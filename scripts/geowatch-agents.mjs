import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'data', 'generated');

const args = new Map();
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith('--')) continue;
  const key = a.slice(2);
  const next = process.argv[i + 1];
  if (!next || next.startsWith('--')) args.set(key, true);
  else { args.set(key, next); i++; }
}

const CONFIG = {
  profile: String(args.get('profile') || process.env.GEOWATCH_PROFILE || 'broad'),
  hours: Number(args.get('hours') || process.env.GEOWATCH_HOURS || 24),
  limitSources: Number(args.get('limit') || process.env.GEOWATCH_LIMIT || 0),
  concurrency: Number(args.get('concurrency') || process.env.GEOWATCH_CONCURRENCY || 8),
  sendEmail: args.has('send-email') || /^true$/i.test(process.env.SEND_EMAIL || ''),
  write: !args.has('no-write'),
  maxArticles: Number(process.env.GEOWATCH_MAX_ARTICLES || 800)
};

const log = [];
function agentLog(agent, message, extra = {}) {
  const row = { at: new Date().toISOString(), agent, message, ...extra };
  log.push(row);
  console.log(`[${agent}] ${message}`);
}

function decodeHtml(s = '') {
  const map = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
    rsquo: "'", lsquo: "'", ldquo: '"', rdquo: '"', eacute: 'e', egrave: 'e',
    agrave: 'a', ecirc: 'e', euml: 'e', ccedil: 'c', ugrave: 'u', ocirc: 'o'
  };
  return String(s)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (_, n) => map[n.toLowerCase()] ?? `&${n};`)
    .replace(/\s+/g, ' ')
    .trim();
}

function stripHtml(s = '') {
  return decodeHtml(String(s).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));
}

function tagText(block, tagNames) {
  for (const tag of tagNames) {
    const ns = tag.includes(':') ? tag.replace(':', '\\:') : `(?:[\\w-]+:)?${tag}`;
    const re = new RegExp(`<${ns}\\b[^>]*>([\\s\\S]*?)<\\/${ns}>`, 'i');
    const m = block.match(re);
    if (m) return decodeHtml(m[1]);
  }
  return '';
}

function atomLink(block) {
  const href = block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1];
  if (href) return decodeHtml(href);
  return tagText(block, ['link', 'guid', 'id']);
}

function parseFeed(xml) {
  const itemBlocks = [...String(xml).matchAll(/<item\b[\s\S]*?<\/item>/gi)].map(m => m[0]);
  const entryBlocks = [...String(xml).matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map(m => m[0]);
  const blocks = itemBlocks.length ? itemBlocks : entryBlocks;
  return blocks.slice(0, 30).map(block => {
    const title = stripHtml(tagText(block, ['title']));
    const link = atomLink(block);
    const pubDate = tagText(block, ['pubDate', 'published', 'updated', 'date']) || new Date().toISOString();
    const description = stripHtml(tagText(block, ['content:encoded', 'encoded', 'content', 'description', 'summary']));
    return { title, link, pubDate, description };
  }).filter(x => x.title && x.link);
}

async function loadSiteData() {
  const code = await fs.readFile(path.join(ROOT, 'sources.js'), 'utf8');
  const sandbox = { window: { GW_DATA: {} }, console: { log(){}, warn(){}, error(){} } };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'sources.js' });
  const data = sandbox.window.GW_DATA || {};
  return {
    sources: data.RSS_SOURCES_FULL || [],
    defaultActive: data.RSS_DEFAULT_ACTIVE || [],
    categories: data.NEWS_CATEGORIES || {},
    majorKeywords: data.MAJOR_EVENT_KEYWORDS || {}
  };
}

function sourceProfile(all, defaultActive, profile) {
  if (profile === 'all') return all;
  if (profile === 'verified') return all.filter(s => s.verified === true);
  if (profile === 'core') {
    const ids = new Set(defaultActive);
    return all.filter(s => ids.has(s.id));
  }
  const cats = new Set(['bf_local','sahel','ouest_afr','centre_afr','est_afr','maghreb','thinktank','geopol','africa','economic','diplomatic','humanitarian']);
  const blocs = new Set(['bf_local','sahel','afrique','occident_fr','occident_us','russie','chine','golfe_mo','turquie']);
  return all.filter(s => cats.has(s.cat) || blocs.has(s.bloc) || s.verified === true);
}

async function runPool(list, limit, worker) {
  const out = new Array(list.length);
  let idx = 0;
  await Promise.all(Array.from({ length: Math.min(limit, list.length) }, async () => {
    while (idx < list.length) {
      const current = idx++;
      out[current] = await worker(list[current], current);
    }
  }));
  return out;
}

async function fetchFeed(source) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        'accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        'user-agent': 'GeoWatch-Agent/1.0 (+https://github.com/)'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const items = parseFeed(text).map(item => ({
      ...item,
      sourceName: source.name,
      sourceId: source.id,
      sourceCat: source.cat,
      sourceBloc: source.bloc,
      sourceRegion: source.region,
      sourceLang: source.lang,
      sourceVerified: !!source.verified
    }));
    return { ok: true, source, items };
  } catch (error) {
    return { ok: false, source, items: [], error: error.message };
  } finally {
    clearTimeout(timer);
  }
}

const SOURCE_RATING = {
  crisisgroup:'A', iss:'A', iris:'A', ifri:'A', frs:'A', rand:'A', isw:'A', acled:'A', sipri:'A', csis:'A', cfr:'A', brookings:'A',
  'le monde':'B', bbc:'B', reuters:'B', 'financial times':'B', 'ft.com':'B', nytimes:'B', wsj:'B', washingtonpost:'B', 'le grand continent':'B', grandcontinent:'B', diploweb:'B', 'foreign policy':'B', foreignpolicy:'B', economist:'B', jeuneafrique:'B', 'jeune afrique':'B',
  rfi:'C', 'france 24':'C', france24:'C', africanews:'C', 'africa news':'C', euronews:'C', dw:'C', liberation:'C', figaro:'C', allafrica:'C', agenceecofin:'C', 'apa news':'C',
  'rt.com':'D', 'rt ':'D', sputnik:'D', tass:'D', xinhua:'D', cgtn:'D', globaltimes:'D', aljazeera:'D', 'al jazeera':'D', presstv:'D', trt:'D', voanews:'D', 'voa ':'D',
  lefaso:'C', burkina24:'C', sidwaya:'C', aib:'C', wakatsera:'C'
};

function reliabilityLetter(item) {
  const txt = `${item.sourceName || item._source || ''} ${item.link || ''}`.toLowerCase();
  for (const [k, v] of Object.entries(SOURCE_RATING)) if (txt.includes(k)) return v;
  return item.sourceVerified ? 'C' : 'F';
}

function titleWords(title) {
  return String(title || '').toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/).filter(w => w.length > 5).slice(0, 7);
}

function credibilityNum(item, allItems) {
  const L = reliabilityLetter(item);
  if (L === 'D' || L === 'E') return 4;
  const words = titleWords(item.title);
  if (words.length) {
    const same = allItems.filter(other => {
      if (other === item) return false;
      const text = String(other.title || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
      return words.filter(w => text.includes(w)).length >= 3;
    }).length;
    if (same >= 2) return 1;
    if (same === 1) return 2;
  }
  return ['A', 'B'].includes(L) ? 3 : 6;
}

function evidenceLabel(item, allItems) {
  const L = reliabilityLetter(item);
  const N = credibilityNum(item, allItems);
  if (['D', 'E'].includes(L)) return { label: 'Narrative a corroborer', color: '#ef4444', rating: `${L}${N}` };
  if (N <= 2) return { label: 'Corrobore', color: '#22c55e', rating: `${L}${N}` };
  if (['A', 'B'].includes(L)) return { label: 'Source fiable unique', color: '#60a5fa', rating: `${L}${N}` };
  return { label: 'Source unique', color: '#f59e0b', rating: `${L}${N}` };
}

function includesAny(text, list = []) {
  const t = text.toLowerCase();
  return list.some(k => t.includes(String(k).toLowerCase()));
}

function categorize(item, categories) {
  const text = `${item.title} ${item.description}`.toLowerCase();
  return Object.entries(categories).filter(([, kws]) => includesAny(text, kws)).map(([cat]) => cat);
}

// Titres d'analyse/essai/récap/SPORT : ce ne sont PAS des événements → jamais d'alerte
const ANALYSIS_TITLE = /\b(synth[èe]se|g[ée]n[ée]ration|d[ée]cryptage|r[ée]trospective|chronique|[ée]dito(?:rial)?|tribune|entretien|podcast|revue de presse|le point sur|que retenir|aux origines|comprendre|pourquoi|dossier|portrait|interview|grand angle|d[ée]bat|opinion|points? de vue|analyse|carte blanche|billet|coupe du monde|coupe d.?afrique|fifa|caf|football|mondial 2026|messi|supporters?|championnat|ligue des champions|jeux olympiques|olympique)\b/i;
// Mots-clés trop ambigus seuls en français (sous-chaînes / idiomes) : « coup » matche
// « Coupe du monde », « coup de chance », « coups de feu »... On les ignore et on s'appuie
// sur les formulations précises déjà présentes (« coup d'état », « offensive majeure »...).
const STOP_MAJOR = new Set(['coup','coups','offensive','front','breakthrough','recognition','strike','collapse','assault','seized','captured the capital','overthrow']);
function kwInTitle(title, kw){
  if (STOP_MAJOR.has(kw)) return false;
  const escd = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Correspondance par limite de mot (gère les accents) : « coup » ne matche pas « coupe ».
  return new RegExp('(^|[^a-zà-öø-ÿ])' + escd + '($|[^a-zà-öø-ÿ])', 'i').test(title);
}
function detectMajor(item, majorKeywords) {
  // Garde-fou A : recherche uniquement dans le TITRE (les essais emploient ces mots
  // de façon abstraite dans le corps de texte → faux positifs).
  const title = String(item.title || '').toLowerCase();
  // Garde-fou B : formats d'analyse / récap / sport → jamais une alerte.
  if (ANALYSIS_TITLE.test(title)) return [];
  // Garde-fou D : correspondance par mot entier + exclusion des mots trop ambigus.
  return Object.entries(majorKeywords).flatMap(([type, kws]) => {
    const found = kws.find(k => kwInTitle(title, String(k).toLowerCase()));
    return found ? [{ type, keyword: found }] : [];
  });
}

function bfAesFlags(item) {
  const text = `${item.title} ${item.description}`.toLowerCase();
  const bf = /\b(burkina|ouagadougou|bobo[- ]?dioulasso|traore|traoré|vdp|aib|lefaso)\b/.test(text);
  const aes = bf || /\b(aes|sahel|mali|bamako|niger|niamey|jnim|eigs|liptako|gourma|cedeao|ecowas)\b/.test(text);
  return { bf, aes };
}

function classifyBlock(item) {
  return item.sourceBloc || 'autre';
}

function scoreArticle(item, allItems) {
  const text = `${item.title} ${item.description}`.toLowerCase();
  const evidence = evidenceLabel(item, allItems);
  const L = evidence.rating[0];
  const N = Number(evidence.rating.slice(1));
  let score = 0;
  if (item.bfRelevant) score += 35;
  if (item.aesRelevant) score += 20;
  if (/burkina|ouagadougou|traore|traoré/.test(text)) score += 20;
  if (/sahel|mali|niger|cedeao|ecowas/.test(text)) score += 12;
  if (item.majors.length) score += 25;
  if (item.tags.includes('military')) score += 12;
  if (item.tags.includes('diplomatic')) score += 8;
  if (item.tags.includes('economic')) score += 8;
  if (['A', 'B'].includes(L)) score += 8;
  if (N <= 2) score += 12;
  if (L === 'D' || L === 'E') score -= 25;
  if (N >= 4) score -= 8;
  return Math.max(0, score);
}

function dedupe(items) {
  const seen = new Set();
  return items.filter(it => {
    const key = String(it.link || '').replace(/[?#].*$/, '').toLowerCase().trim() ||
      `${String(it.title).toLowerCase().trim()}|${it.sourceName}`;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function enrichItems(rawItems, siteData) {
  const sorted = dedupe(rawItems).sort((a,b) => new Date(b.pubDate) - new Date(a.pubDate)).slice(0, CONFIG.maxArticles);
  return sorted.map(it => {
    const flags = bfAesFlags(it);
    const tags = categorize(it, siteData.categories);
    const majors = detectMajor(it, siteData.majorKeywords);
    return {
      title: it.title,
      link: it.link,
      pubDate: new Date(it.pubDate || Date.now()).toISOString(),
      description: it.description || '',
      _source: it.sourceName,
      _sourceId: it.sourceId,
      _sourceCat: it.sourceCat,
      _sourceBloc: it.sourceBloc,
      _sourceVerified: it.sourceVerified,
      _tags: tags,
      _majors: majors,
      _bf: flags.bf,
      _aes: flags.aes,
      _agentGenerated: true
    };
  }).map((it, _, arr) => {
    const evidence = evidenceLabel({
      ...it,
      sourceName: it._source,
      sourceVerified: it._sourceVerified
    }, arr.map(x => ({ title: x.title, sourceName: x._source, link: x.link, sourceVerified: x._sourceVerified })));
    const scoringItem = {
      ...it,
      sourceName: it._source,
      sourceVerified: it._sourceVerified,
      bfRelevant: it._bf,
      aesRelevant: it._aes,
      tags: it._tags,
      majors: it._majors
    };
    return { ...it, _evidence: evidence, _rating: evidence.rating, _score: scoreArticle(scoringItem, arr) };
  });
}

function sourceHealth(results) {
  const ok = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);
  return {
    total: results.length,
    ok: ok.length,
    failed: failed.length,
    articles: ok.reduce((s,r) => s + r.items.length, 0),
    okSources: ok.map(r => ({ id: r.source.id, name: r.source.name, count: r.items.length })),
    failedSources: failed.map(r => ({ id: r.source.id, name: r.source.name, error: r.error }))
  };
}

function buildBrief(items, health) {
  const now = Date.now();
  const recent24 = items.filter(it => now - new Date(it.pubDate).getTime() <= CONFIG.hours * 3600000);
  const top = recent24
    .filter(it => (it._bf || it._aes || it._majors.length) && it._score >= 18 && !(/^D|^E/.test(it._rating) && !/1|2$/.test(it._rating)))
    .sort((a,b) => b._score - a._score)
    .slice(0, 8);
  const alerts = recent24
    .filter(it => it._majors.length)
    .map(it => ({
      title: it.title,
      link: it.link,
      source: it._source,
      date: it.pubDate,
      rating: it._rating,
      evidence: it._evidence.label,
      // Garde-fou C : « critique » exige un événement de rupture/crise ET une corroboration
      // (crédibilité 1 ou 2 = recoupé par d'autres sources). Un essai mono-source ne peut
      // pas être « critique ». Source douteuse (D/E non corroborée) → simple « info ».
      level: (/^D|^E/.test(it._rating) && !/[12]$/.test(it._rating)) ? 'info'
           : (it._majors.some(m => ['rupture','crise'].includes(m.type)) && /[12]$/.test(it._rating)) ? 'critical'
           : 'high',
      bf: it._bf,
      majors: it._majors
    }));
  const bf = recent24.filter(it => it._bf || it._aes);
  const blocks = Object.entries(recent24.reduce((a,it) => {
    const key = it._sourceBloc || 'autre';
    a[key] = (a[key] || 0) + 1;
    return a;
  }, {})).sort((a,b) => b[1] - a[1]);
  return {
    generatedAt: new Date().toISOString(),
    windowHours: CONFIG.hours,
    sourceHealth: health,
    stats: {
      articles: recent24.length,
      bfAes: bf.length,
      alerts: alerts.length,
      criticalAlerts: alerts.filter(a => a.level === 'critical').length,
      sourcesDistinct: new Set(recent24.map(it => it._sourceId || it._source)).size
    },
    topDevelopments: top,
    alerts,
    narrativesByBloc: blocks,
    indicators: buildIndicators(recent24, alerts, health)
  };
}

function buildIndicators(items, alerts, health) {
  const out = [];
  if (alerts.some(a => a.level === 'critical')) out.push('Verifier immediatement les alertes critiques avec une seconde source independante.');
  if (items.filter(it => it._bf).length > 0) out.push('Suivre les signaux BF/AES sur sources locales, institutionnelles et regionales.');
  if (items.some(it => it._tags.includes('economic'))) out.push('Surveiller les canaux economiques : or, carburant, corridors, budget, sanctions.');
  if (items.some(it => it._tags.includes('diplomatic'))) out.push('Surveiller communiques CEDEAO/AES/UA/ONU et reactions des voisins cotiers.');
  if (health.failed > Math.max(10, health.total * .35)) out.push('Audit technique requis : trop de flux RSS en erreur ou silencieux.');
  if (!out.length) out.push('Aucun signal robuste : maintenir veille de routine et verifier la couverture source.');
  return out;
}

function htmlEscape(s = '') {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function briefHtml(brief) {
  const rows = brief.topDevelopments.map((it, i) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #ddd">${i + 1}</td>
      <td style="padding:8px;border-bottom:1px solid #ddd"><a href="${htmlEscape(it.link)}">${htmlEscape(it.title)}</a><br><small>${htmlEscape(it._source)} - ${htmlEscape(it._rating)} - ${htmlEscape(it._evidence.label)}</small></td>
      <td style="padding:8px;border-bottom:1px solid #ddd">${it._bf ? 'BF' : it._aes ? 'AES' : '-'}</td>
    </tr>`).join('');
  const alerts = brief.alerts.map(a => `<li><b>${htmlEscape(a.level)}</b> - <a href="${htmlEscape(a.link)}">${htmlEscape(a.title)}</a> <small>${htmlEscape(a.source)} - ${htmlEscape(a.rating)} - ${htmlEscape(a.evidence)}</small></li>`).join('');
  const indicators = brief.indicators.map(i => `<li>${htmlEscape(i)}</li>`).join('');
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>GeoWatch Brief</title></head>
<body style="font-family:Arial,sans-serif;line-height:1.45;color:#111">
  <h1>GeoWatch - Brief strategique BF/AES</h1>
  <p><b>Generation :</b> ${htmlEscape(brief.generatedAt)}<br>
  <b>Articles :</b> ${brief.stats.articles} | <b>BF/AES :</b> ${brief.stats.bfAes} | <b>Alertes critiques :</b> ${brief.stats.criticalAlerts} | <b>Sources distinctes :</b> ${brief.stats.sourcesDistinct}</p>
  <p><b>Garde-fou :</b> aucun fait invente. Les signaux non corroborés restent des hypotheses a verifier.</p>
  <h2>Top developpements</h2>
  <table style="border-collapse:collapse;width:100%"><tbody>${rows || '<tr><td>Aucun developpement prioritaire.</td></tr>'}</tbody></table>
  <h2>Alertes</h2>
  <ul>${alerts || '<li>Aucune alerte majeure robuste.</li>'}</ul>
  <h2>Indicateurs a surveiller</h2>
  <ul>${indicators}</ul>
  <h2>Sante RSS</h2>
  <p>${brief.sourceHealth.ok}/${brief.sourceHealth.total} flux OK, ${brief.sourceHealth.failed} en erreur, ${brief.sourceHealth.articles} articles collectes.</p>
</body></html>`;
}

async function sendMail(brief, html) {
  if (!CONFIG.sendEmail) {
    agentLog('Agent Email', 'Envoi email ignore (SEND_EMAIL=false)');
    return { sent: false, reason: 'disabled' };
  }
  const to = (process.env.EMAIL_TO || '').split(',').map(s => s.trim()).filter(Boolean);
  const from = process.env.EMAIL_FROM || 'GeoWatch <onboarding@resend.dev>';
  if (!to.length) return { sent: false, reason: 'EMAIL_TO missing' };
  const subject = `GeoWatch - Brief BF/AES - ${new Date().toISOString().slice(0,10)}`;
  if (process.env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from, to, subject, html })
    });
    if (!res.ok) throw new Error(`Resend HTTP ${res.status}: ${await res.text()}`);
    return { sent: true, provider: 'resend', result: await res.json() };
  }
  if (process.env.BREVO_API_KEY) {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({
        sender: parseSender(from),
        to: to.map(email => ({ email })),
        subject,
        htmlContent: html
      })
    });
    if (!res.ok) throw new Error(`Brevo HTTP ${res.status}: ${await res.text()}`);
    return { sent: true, provider: 'brevo', result: await res.json() };
  }
  if (process.env.SENDGRID_API_KEY) {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.SENDGRID_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: to.map(email => ({ email })) }],
        from: parseSender(from),
        subject,
        content: [{ type: 'text/html', value: html }]
      })
    });
    if (!res.ok) throw new Error(`SendGrid HTTP ${res.status}: ${await res.text()}`);
    return { sent: true, provider: 'sendgrid' };
  }
  return { sent: false, reason: 'no provider secret' };
}

function parseSender(from) {
  const m = String(from).match(/^(.*?)<([^>]+)>$/);
  if (m) return { name: m[1].trim(), email: m[2].trim() };
  return { email: from };
}

async function writeOutputs(items, health, brief, html, mailResult) {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(path.join(OUT_DIR, 'latest-news.json'), JSON.stringify({
    generatedAt: brief.generatedAt,
    profile: CONFIG.profile,
    sourceHealth: health,
    items
  }, null, 2), 'utf8');
  await fs.writeFile(path.join(OUT_DIR, 'brief-latest.json'), JSON.stringify({ ...brief, mail: mailResult, agentLog: log }, null, 2), 'utf8');
  await fs.writeFile(path.join(OUT_DIR, 'brief-latest.html'), html, 'utf8');
  await fs.writeFile(path.join(OUT_DIR, 'agent-run-log.json'), JSON.stringify(log, null, 2), 'utf8');
}

async function main() {
  agentLog('Agent Orchestrateur', `Demarrage profile=${CONFIG.profile}`);
  const siteData = await loadSiteData();
  let selected = sourceProfile(siteData.sources, siteData.defaultActive, CONFIG.profile);
  if (CONFIG.limitSources > 0) selected = selected.slice(0, CONFIG.limitSources);
  agentLog('Agent Sources', `${selected.length}/${siteData.sources.length} sources selectionnees`);

  const results = await runPool(selected, CONFIG.concurrency, fetchFeed);
  const health = sourceHealth(results);
  agentLog('Agent Collecte RSS', `${health.ok}/${health.total} flux OK, ${health.articles} articles`);

  const rawItems = results.flatMap(r => r.items);
  const items = enrichItems(rawItems, siteData);
  agentLog('Agent Preuves', `${items.length} articles dedoubles et enrichis`);

  const brief = buildBrief(items, health);
  const html = briefHtml(brief);
  agentLog('Agent Brief BF/AES', `${brief.topDevelopments.length} developpements, ${brief.alerts.length} alertes`);

  let mailResult = { sent: false, reason: 'not attempted' };
  try {
    mailResult = await sendMail(brief, html);
    agentLog('Agent Email', mailResult.sent ? `Email envoye via ${mailResult.provider}` : `Email non envoye: ${mailResult.reason}`);
  } catch (error) {
    mailResult = { sent: false, error: error.message };
    agentLog('Agent Email', `Erreur email: ${error.message}`);
  }

  if (CONFIG.write) await writeOutputs(items, health, brief, html, mailResult);
  agentLog('Agent Orchestrateur', 'Termine');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
