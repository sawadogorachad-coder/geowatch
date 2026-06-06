// =============================================================================
//  GeoWatch — AGENT ANALYSTE / ETUDES (hybride)
//  Detecte : tendances lourdes, signaux faibles, ruptures, recompositions /
//  reconfigurations, bascules strategiques. Produit : notes d'analyse par zone,
//  notes prospectives / scenarios, etudes thematiques. Rafraichit les pages du
//  site (data/generated/analysis-latest.{json,html}).
//
//  Hybride : moteur STRUCTURE (gratuit, sans IA) par defaut ; si la variable
//  d'environnement ANTHROPIC_API_KEY est presente, une couche IA (API Claude,
//  raw HTTP) redige des analyses en prose. Aucun fait invente : l'IA ne recoit
//  que des donnees deja collectees et cotees, et chaque note garde ses sources.
//
//  Entree : data/generated/latest-news.json (produit par geowatch-agents.mjs).
//  Etat   : data/generated/analyst-history.json (historique pour les tendances).
// =============================================================================
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
  write: !args.has('no-write'),
  hours: Number(args.get('hours') || process.env.GEOWATCH_HOURS || 168), // fenetre d'analyse: 7 j
  histMax: 30,
  llmModel: String(args.get('model') || process.env.GEOWATCH_LLM_MODEL || 'claude-opus-4-8'),
  llmKey: process.env.ANTHROPIC_API_KEY || '',
  llmMaxNotes: Number(process.env.GEOWATCH_LLM_MAX_NOTES || 3),
  topZones: 3,
  topThemes: 4
};

const log = [];
function agentLog(agent, message, extra = {}) {
  log.push({ at: new Date().toISOString(), agent, message, ...extra });
  console.log(`[${agent}] ${message}`);
}

async function readJSON(file, fallback) {
  try { return JSON.parse(await fs.readFile(path.join(OUT_DIR, file), 'utf8')); }
  catch (e) { return fallback; }
}
async function writeJSON(file, data) {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(path.join(OUT_DIR, file), JSON.stringify(data, null, 2), 'utf8');
}

// --- Reutilise methodo.js (meme taxonomie que le site et l'agent de collecte) ---
async function loadMethodo() {
  try {
    const code = await fs.readFile(path.join(ROOT, 'methodo.js'), 'utf8');
    const noop = () => {};
    const sandbox = {
      window: {}, console: { log: noop, warn: noop, error: noop },
      localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
      document: { getElementById: () => null, createElement: () => ({ click: noop }), body: { appendChild: noop, removeChild: noop } },
      navigator: {}, URL: { createObjectURL: () => '', revokeObjectURL: noop }, Blob: function () {}, setTimeout: noop
    };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: 'methodo.js' });
    const M = sandbox.window.GW_METHODO;
    if (!M || typeof M.tagItem !== 'function') throw new Error('GW_METHODO introuvable');
    return M;
  } catch (e) { agentLog('Agent Analyste', `methodo.js indisponible: ${e.message}`); return null; }
}

function ensureTags(items, methodo) {
  if (!methodo) return;
  for (const it of items) {
    if (it._zone === undefined || it._theme === undefined) {
      try {
        const t = methodo.tagItem(it);
        it._zone = t.pz || null; it._theme = t.pt || null;
        it._zoneShort = t.pz ? ((methodo.ZONES.find(z => z.id === t.pz) || {}).short || null) : null;
        it._relevance = (t.pz && t.pt) ? methodo.relevance(t.pz, t.pt) : '.';
      } catch (e) { it._zone = it._zone ?? null; it._theme = it._theme ?? null; }
    }
  }
}

function recent(items, hours) {
  const now = Date.now();
  return items.filter(it => it.pubDate && (now - new Date(it.pubDate).getTime()) / 3600000 <= hours);
}

// --- Snapshot courant + historique ---
function snapshot(items, methodo) {
  const byZone = {}, byTheme = {}, byCell = {}, byBloc = {};
  let alerts = 0;
  for (const it of items) {
    if (it._zone) byZone[it._zone] = (byZone[it._zone] || 0) + 1;
    if (it._theme) byTheme[it._theme] = (byTheme[it._theme] || 0) + 1;
    if (it._zone && it._theme) { const k = it._zone + '|' + it._theme; byCell[k] = (byCell[k] || 0) + 1; }
    const b = it._sourceBloc || 'autre'; byBloc[b] = (byBloc[b] || 0) + 1;
    if (Array.isArray(it._majors) && it._majors.length) alerts++;
  }
  return { at: new Date().toISOString(), total: items.length, byZone, byTheme, byCell, byBloc, alerts };
}

function baselineAvg(history, picker) {
  if (!history.length) return 0;
  let s = 0; for (const snap of history) s += (picker(snap) || 0);
  return s / history.length;
}
function direction(cur, base) {
  if (base <= 0) return cur > 0 ? 'nouveau' : 'stable';
  if (cur > base * 1.25) return 'hausse';
  if (cur < base * 0.75) return 'baisse';
  return 'stable';
}

// --- Detection des dynamiques ---
function detect(items, snap, history, methodo) {
  const themeLabel = c => (methodo && (methodo.THEMES.find(t => t.code === c) || {}).label) || c;
  const zoneLabel = z => (methodo && (methodo.ZONES.find(x => x.id === z) || {}).short) || ('Zone ' + z);

  // 1. Tendances lourdes : fort volume soutenu (themes + zones)
  const tendancesLourdes = [];
  Object.entries(snap.byTheme).sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([c, n]) => {
    if (n < 3) return;
    const base = baselineAvg(history, s => (s.byTheme || {})[c]);
    tendancesLourdes.push({ axe: 'thematique', cle: c, libelle: themeLabel(c), volume: n, base: Math.round(base * 10) / 10, direction: direction(n, base) });
  });
  Object.entries(snap.byZone).filter(([z]) => +z <= 7).sort((a, b) => b[1] - a[1]).slice(0, 4).forEach(([z, n]) => {
    if (n < 3) return;
    const base = baselineAvg(history, s => (s.byZone || {})[z]);
    tendancesLourdes.push({ axe: 'zone', cle: +z, libelle: zoneLabel(+z), volume: n, base: Math.round(base * 10) / 10, direction: direction(n, base) });
  });

  // 2. Signaux faibles : croisements emergents (faible volume, quasi absents avant)
  const signauxFaibles = [];
  Object.entries(snap.byCell).forEach(([k, n]) => {
    if (n < 1 || n > 3) return;
    const base = baselineAvg(history, s => (s.byCell || {})[k]);
    if (base < 0.5) {
      const [z, c] = k.split('|');
      const sample = items.find(it => it._zone === +z && it._theme === c);
      signauxFaibles.push({ zone: zoneLabel(+z), thematique: themeLabel(c), code: c, volume: n, exemple: sample ? sample.title : '' });
    }
  });
  signauxFaibles.sort((a, b) => b.volume - a.volume);

  // 3. Ruptures : evenements majeurs (rupture/crise) + pics de volume
  const ruptures = [];
  const seenZone = new Set();
  items.filter(it => Array.isArray(it._majors) && it._majors.some(m => ['rupture', 'crise'].includes(m.type)))
    .sort((a, b) => (b._score || 0) - (a._score || 0))
    .forEach(it => {
      const key = (it._zone || '?') + '|' + (it._theme || '?');
      if (seenZone.has(key)) return; seenZone.add(key);
      ruptures.push({ type: 'evenement', zone: it._zoneShort || zoneLabel(it._zone), thematique: themeLabel(it._theme), titre: it.title, source: it._source, cote: it._rating, lien: it.link });
    });
  Object.entries(snap.byCell).forEach(([k, n]) => {
    const base = baselineAvg(history, s => (s.byCell || {})[k]);
    if (n >= Math.max(5, base * 2.5) && base > 0) {
      const [z, c] = k.split('|');
      ruptures.push({ type: 'pic', zone: zoneLabel(+z), thematique: themeLabel(c), volume: n, base: Math.round(base * 10) / 10 });
    }
  });

  // 4. Recompositions / reconfigurations / bascules : deplacements de blocs + bascule diplomatique
  const recompositions = [];
  const total = Math.max(1, snap.total);
  Object.entries(snap.byBloc).forEach(([b, n]) => {
    const curShare = n / total;
    const baseShareAvg = baselineAvg(history, s => { const tt = Math.max(1, s.total || 1); return (s.byBloc || {})[b] ? (s.byBloc[b] / tt) : 0; });
    const delta = curShare - baseShareAvg;
    if (Math.abs(delta) >= 0.08 && n >= 3) {
      recompositions.push({ axe: 'bloc mediatique', cle: b, partActuelle: Math.round(curShare * 100) + '%', partAnterieure: Math.round(baseShareAvg * 100) + '%', sens: delta > 0 ? 'montee en puissance' : 'recul' });
    }
  });
  // bascule diplomatique : poussee du theme D sur les zones africaines (1-7)
  const dAfrique = items.filter(it => it._theme === 'D' && it._zone && it._zone <= 7).length;
  const dBase = baselineAvg(history, s => (s.byTheme || {})['D']);
  if (dAfrique >= 4 && dAfrique > dBase * 1.2) {
    recompositions.push({ axe: 'bascule diplomatique', cle: 'AES / Afrique', partActuelle: dAfrique + ' signaux', partAnterieure: Math.round(dBase) + ' (moy.)', sens: 'reconfiguration des alliances a surveiller' });
  }

  return { tendancesLourdes, signauxFaibles: signauxFaibles.slice(0, 8), ruptures: ruptures.slice(0, 8), recompositions };
}

// --- Productions structurees ---
function topInZone(items, zoneId, k = 5) {
  return items.filter(it => it._zone === zoneId).sort((a, b) => (b._score || 0) - (a._score || 0)).slice(0, k);
}
function confidence(list) {
  if (!list.length) return 'faible';
  const corro = list.filter(it => /[12]$/.test(String(it._rating || ''))).length / list.length;
  return corro >= 0.5 ? 'eleve' : corro >= 0.25 ? 'moyen' : 'faible';
}
function themeMix(list, methodo) {
  const c = {}; list.forEach(it => { if (it._theme) c[it._theme] = (c[it._theme] || 0) + 1; });
  return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([code]) => (methodo && (methodo.THEMES.find(t => t.code === code) || {}).label) || code);
}

function buildNotesParZone(items, snap, methodo) {
  const out = [];
  const zones = Object.entries(snap.byZone).filter(([z, n]) => +z <= 7 && n >= 4)
    .sort((a, b) => b[1] - a[1]).slice(0, CONFIG.topZones).map(([z]) => +z);
  for (const z of zones) {
    const faits = topInZone(items, z, 5);
    const zlabel = (methodo && (methodo.ZONES.find(x => x.id === z) || {}).short) || ('Zone ' + z);
    out.push({
      zone: zlabel,
      thematiquesDominantes: themeMix(faits, methodo),
      faits: faits.map(it => ({ titre: it.title, source: it._source, cote: it._rating, lien: it.link, theme: it._theme })),
      lectureStructuree: `Sur la periode, ${zlabel} concentre ${snap.byZone[z]} signaux, dominante ${themeMix(faits, methodo).join(', ') || 'diverse'}.`,
      confiance: confidence(faits),
      proseIA: null
    });
  }
  return out;
}

function buildNotesProspectives(findings, methodo) {
  const out = [];
  findings.tendancesLourdes.filter(t => t.axe === 'zone').slice(0, CONFIG.topZones).forEach(t => {
    out.push({
      zone: t.libelle,
      hypothese: `Si la dynamique « ${t.libelle} » (${t.direction}) se poursuit a 3-6 mois, l'impact sur l'AES s'accentue.`,
      signauxASurveiller: ['Frequence et localisation des incidents', 'Reactions diplomatiques (CEDEAO/UA/ONU)', 'Etat des corridors logistiques', 'Prix (or, carburant, cereales)'],
      confiance: t.direction === 'hausse' ? 'moyen' : 'faible',
      proseIA: null
    });
  });
  return out;
}

function buildEtudesThematiques(items, snap, findings, methodo) {
  const out = [];
  const top = Object.entries(snap.byTheme).sort((a, b) => b[1] - a[1]).slice(0, CONFIG.topThemes).map(([c]) => c);
  for (const code of top) {
    const list = items.filter(it => it._theme === code).sort((a, b) => (b._score || 0) - (a._score || 0));
    const label = (methodo && (methodo.THEMES.find(t => t.code === code) || {}).label) || code;
    const trend = findings.tendancesLourdes.find(t => t.axe === 'thematique' && t.cle === code);
    const acteurs = {}; list.forEach(it => { const b = it._sourceBloc || 'autre'; acteurs[b] = (acteurs[b] || 0) + 1; });
    const sources = {}; list.forEach(it => { if (it._source) sources[it._source] = (sources[it._source] || 0) + 1; });
    out.push({
      code, libelle: label, volume: list.length, direction: trend ? trend.direction : 'stable',
      faitsSaillants: list.slice(0, 5).map(it => ({ titre: it.title, source: it._source, cote: it._rating, lien: it.link })),
      blocs: Object.entries(acteurs).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([b, n]) => `${b} (${n})`),
      sources: Object.entries(sources).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([s]) => s),
      proseIA: null
    });
  }
  return out;
}

// --- Couche IA (optionnelle) : API Claude en HTTP brut ---
async function llmWrite(system, user, maxTokens = 1200) {
  if (!CONFIG.llmKey) return null;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': CONFIG.llmKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: CONFIG.llmModel, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] })
    });
    if (!res.ok) { agentLog('Agent Analyste IA', `API ${res.status}: ${(await res.text()).slice(0, 200)}`); return null; }
    const data = await res.json();
    const block = (data.content || []).find(b => b.type === 'text');
    return block ? block.text.trim() : null;
  } catch (e) { agentLog('Agent Analyste IA', `erreur: ${e.message}`); return null; }
}

const LLM_SYSTEM = [
  "Tu es analyste geopolitique pour une cellule de veille (methodologie SEMDE), au service du Burkina Faso et de l'AES.",
  "Tu rediges en francais, sobre et factuel. Structure : (1) ce qui s'est passe, (2) pourquoi, (3) ce que cela implique pour l'AES (prospectif).",
  "REGLES STRICTES : n'invente aucun fait ; n'utilise QUE les elements fournis ; si une information n'est pas corroboree, dis-le ; pas de chiffres inventes ; reste concis (8-12 lignes)."
].join(' ');

async function addAIProse(analysis, methodo) {
  if (!CONFIG.llmKey) return;
  // Synthese executive
  const fSummary = JSON.stringify({ tendancesLourdes: analysis.findings.tendancesLourdes, ruptures: analysis.findings.ruptures.slice(0, 5), recompositions: analysis.findings.recompositions });
  analysis.syntheseExecutive = await llmWrite(LLM_SYSTEM,
    `Voici les dynamiques detectees automatiquement sur la periode. Redige une synthese executive (10 lignes max) pour un decideur de l'AES, en hierarchisant le plus important.\n\nDONNEES:\n${fSummary}`, 900);
  // Prose pour les premieres notes de zone (limite pour borner le cout)
  let used = 0;
  for (const note of analysis.notesParZone) {
    if (used >= CONFIG.llmMaxNotes) break;
    const faits = note.faits.map(f => `- ${f.titre} (${f.source || '?'}, cote ${f.cote || '?'})`).join('\n');
    note.proseIA = await llmWrite(LLM_SYSTEM,
      `Zone : ${note.zone}. Thematiques dominantes : ${note.thematiquesDominantes.join(', ')}.\nFAITS COLLECTES (sources et cotes OTAN entre parentheses) :\n${faits}\n\nRedige la note d'analyse (faits -> causes -> consequences pour l'AES). N'utilise que ces faits.`, 1200);
    used++;
  }
  analysis.llmUsed = true;
  analysis.llmModel = CONFIG.llmModel;
}

// --- Rendu HTML ---
function esc(s = '') { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function listHtml(arr, fn) { return (arr || []).map(fn).join(''); }

function analysisHtml(a) {
  const dirBadge = d => `<span style="font-size:.7rem;color:${d === 'hausse' ? '#ef4444' : d === 'baisse' ? '#22c55e' : d === 'nouveau' ? '#a855f7' : '#94a3b8'}">${esc(d)}</span>`;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>GeoWatch - Etudes & Analyses</title></head>
<body style="font-family:Arial,sans-serif;line-height:1.5;color:#111;max-width:900px;margin:auto;padding:16px">
  <h1>GeoWatch - Etudes & Analyses (agent)</h1>
  <p><b>Generation :</b> ${esc(a.generatedAt)} | <b>Articles analyses :</b> ${a.stats.analysed} | <b>IA :</b> ${a.llmUsed ? esc(a.llmModel) : 'non (mode structure)'}</p>
  ${a.syntheseExecutive ? `<h2>Synthese executive</h2><p>${esc(a.syntheseExecutive).replace(/\n/g, '<br>')}</p>` : ''}
  <h2>Dynamiques detectees</h2>
  <h3>Tendances lourdes</h3><ul>${listHtml(a.findings.tendancesLourdes, t => `<li>${esc(t.libelle)} — ${t.volume} signaux ${dirBadge(t.direction)}</li>`) || '<li>—</li>'}</ul>
  <h3>Signaux faibles</h3><ul>${listHtml(a.findings.signauxFaibles, s => `<li><b>${esc(s.zone)} · ${esc(s.thematique)}</b> : ${esc(s.exemple || '')}</li>`) || '<li>—</li>'}</ul>
  <h3>Ruptures</h3><ul>${listHtml(a.findings.ruptures, r => r.type === 'evenement' ? `<li>${esc(r.zone)} · ${esc(r.thematique)} — <a href="${esc(r.lien)}">${esc(r.titre)}</a> <small>(${esc(r.source || '')}, ${esc(r.cote || '')})</small></li>` : `<li>Pic : ${esc(r.zone)} · ${esc(r.thematique)} (${r.volume} vs ${r.base} moy.)</li>`) || '<li>—</li>'}</ul>
  <h3>Recompositions / reconfigurations / bascules</h3><ul>${listHtml(a.findings.recompositions, r => `<li><b>${esc(r.axe)}</b> ${esc(r.cle)} : ${esc(r.partAnterieure)} → ${esc(r.partActuelle)} (${esc(r.sens)})</li>`) || '<li>—</li>'}</ul>
  <h2>Notes d'analyse par zone</h2>
  ${listHtml(a.notesParZone, n => `<h3>${esc(n.zone)} <small>(confiance ${esc(n.confiance)})</small></h3>${n.proseIA ? `<p>${esc(n.proseIA).replace(/\n/g, '<br>')}</p>` : `<p>${esc(n.lectureStructuree)}</p>`}<ul>${listHtml(n.faits, f => `<li><a href="${esc(f.lien)}">${esc(f.titre)}</a> <small>(${esc(f.source || '')}, ${esc(f.cote || '')})</small></li>`)}</ul>`)}
  <h2>Notes prospectives</h2>
  ${listHtml(a.notesProspectives, n => `<h3>${esc(n.zone)} <small>(confiance ${esc(n.confiance)})</small></h3>${n.proseIA ? `<p>${esc(n.proseIA).replace(/\n/g, '<br>')}</p>` : `<p>${esc(n.hypothese)}</p>`}<p><i>A surveiller :</i> ${esc((n.signauxASurveiller || []).join(' · '))}</p>`)}
  <h2>Etudes thematiques</h2>
  ${listHtml(a.etudesThematiques, e => `<h3>${esc(e.libelle)} (${esc(e.code)}) — ${e.volume} signaux ${dirBadge(e.direction)}</h3>${e.proseIA ? `<p>${esc(e.proseIA).replace(/\n/g, '<br>')}</p>` : ''}<p><i>Acteurs/blocs :</i> ${esc((e.blocs || []).join(', '))}<br><i>Sources :</i> ${esc((e.sources || []).join(', '))}</p><ul>${listHtml(e.faitsSaillants, f => `<li><a href="${esc(f.lien)}">${esc(f.titre)}</a> <small>(${esc(f.source || '')}, ${esc(f.cote || '')})</small></li>`)}</ul>`)}
  <hr><p style="font-size:.8rem;color:#666">Garde-fou : aucun fait invente. Les analyses s'appuient uniquement sur les depeches collectees et cotees. A rafraichir a chaque cycle.</p>
</body></html>`;
}

async function main() {
  agentLog('Agent Analyste', `Demarrage (IA: ${CONFIG.llmKey ? 'oui ' + CONFIG.llmModel : 'non, mode structure'})`);
  const news = await readJSON('latest-news.json', null);
  if (!news || !Array.isArray(news.items) || !news.items.length) {
    agentLog('Agent Analyste', 'Aucun latest-news.json exploitable — lancer d\'abord geowatch-agents.mjs');
    return;
  }
  const methodo = await loadMethodo();
  const items = news.items;
  ensureTags(items, methodo);
  const win = recent(items, CONFIG.hours);
  const base = win.length ? win : items;
  agentLog('Agent Analyste', `${base.length} articles dans la fenetre (${CONFIG.hours} h)`);

  const snap = snapshot(base, methodo);
  const histStore = await readJSON('analyst-history.json', { snapshots: [] });
  const history = (histStore.snapshots || []).slice(-CONFIG.histMax);

  const findings = detect(base, snap, history, methodo);
  agentLog('Agent Analyste', `Detection: ${findings.tendancesLourdes.length} tendances, ${findings.signauxFaibles.length} signaux faibles, ${findings.ruptures.length} ruptures, ${findings.recompositions.length} recompositions`);

  const analysis = {
    generatedAt: new Date().toISOString(),
    stats: { analysed: base.length, windowHours: CONFIG.hours, sources: new Set(base.map(it => it._source)).size },
    findings,
    notesParZone: buildNotesParZone(base, snap, methodo),
    notesProspectives: buildNotesProspectives(findings, methodo),
    etudesThematiques: buildEtudesThematiques(base, snap, findings, methodo),
    syntheseExecutive: null,
    llmUsed: false
  };

  await addAIProse(analysis, methodo);
  agentLog('Agent Analyste', `Productions: ${analysis.notesParZone.length} notes zone, ${analysis.notesProspectives.length} prospectives, ${analysis.etudesThematiques.length} etudes`);

  if (CONFIG.write) {
    const newHistory = history.concat([snap]).slice(-CONFIG.histMax);
    await writeJSON('analyst-history.json', { snapshots: newHistory });
    await writeJSON('analysis-latest.json', { ...analysis, agentLog: log });
    await fs.writeFile(path.join(OUT_DIR, 'analysis-latest.html'), analysisHtml(analysis), 'utf8');
    agentLog('Agent Analyste', 'Fichiers ecrits dans data/generated/');
  }
  agentLog('Agent Analyste', 'Termine');
}

main().catch(e => { console.error(e); process.exitCode = 1; });
