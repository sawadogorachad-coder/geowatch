/* ==========================================================================
   GéoWatch v3 — Observatoire des conflits (think-tank grade)
   Méthodologie : Note de Situation 8 dimensions + Brief 2 couches (Codex Veille)
   Sources d'inspiration : ICG, ACLED, ISW, IRIS, FRS, IFRI, Le Grand Continent, LMD
   ========================================================================== */

const SEV_COLORS = {1:'#22c55e',2:'#22c55e',3:'#22c55e',4:'#f59e0b',5:'#f59e0b',6:'#f59e0b',7:'#f97316',8:'#f97316',9:'#ef4444',10:'#ef4444'};
const REGIONS = ['Afrique de l\'Ouest','Afrique subsaharienne','Afrique du Nord','Moyen-Orient','Europe de l\'Est','Asie de l\'Est','Asie du Sud-Est','Amériques','Caucase'];

/* ============= DB (localStorage) ============= */
const DB = {
  k: 'geowatch_v3',
  load(){ try{ return JSON.parse(localStorage.getItem(this.k))||null; }catch(e){return null;} },
  save(d){ localStorage.setItem(this.k, JSON.stringify(d)); },
  get(){
    let d = this.load();
    if(!d){
      d = {
        conflicts: window.GW_DATA.CONFLITS,
        countries: window.GW_DATA.COUNTRIES,
        events: window.GW_DATA.buildEvents(),
        alerts: window.GW_DATA.ALERTES_SEED,
        sources: window.GW_DATA.SOURCES_TANK
      };
      this.save(d);
    }
    return d;
  },
  reset(){ localStorage.removeItem(this.k); return this.get(); },
  add(coll, item){ const d=this.get(); item.id=item.id||'id_'+Date.now(); d[coll].push(item); this.save(d); return item; },
  del(coll, id){ const d=this.get(); d[coll]=d[coll].filter(x=>x.id!==id); this.save(d); }
};

/* ============= UTILS ============= */
const fmt = {
  date(s){ if(!s) return ''; const d=new Date(s); return d.toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}); },
  dateShort(s){ const d=new Date(s); return d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'}); },
  dateTime(s){ const d=new Date(s); return d.toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'}); }
};

function toast(msg, type='info'){
  const t = document.getElementById('toast');
  const icon = type==='success'?'<i class="fa-solid fa-check-circle"></i>':type==='error'?'<i class="fa-solid fa-triangle-exclamation"></i>':'<i class="fa-solid fa-info-circle"></i>';
  t.innerHTML = icon + msg;
  t.className = 'show '+type;
  clearTimeout(toast._t); toast._t = setTimeout(()=>t.classList.remove('show'), 3200);
}

function statusChip(s){
  const m = { active:['chip orange','Actif'], escalating:['chip red','Escalade'], deescalating:['chip blue','Désescalade'], frozen:['chip gray','Gelé'], resolved:['chip green','Résolu'] };
  const [c,l] = m[s]||['chip gray',s]; return `<span class="${c}">${l}</span>`;
}

function levelChip(l){
  const m = { critical:['chip red','Critique'], high:['chip orange','Élevée'], medium:['chip yellow','Moyenne'], low:['chip blue','Faible'], info:['chip gray','Info'] };
  const [c,t]=m[l]||['chip gray',l]; return `<span class="${c}">${t}</span>`;
}

function conflictColor(i){ if(i>=9) return '#ef4444'; if(i>=7) return '#f97316'; if(i>=5) return '#f59e0b'; return '#22c55e'; }

function sevBar(n){
  const c=Math.max(1,Math.min(10,n|0));
  return `<span class="sev-bar s${c}" title="Sévérité ${c}/10">${'<span></span>'.repeat(10)}</span>`;
}

/* Chart.js defaults */
Chart.defaults.color='#94a3b8'; Chart.defaults.font.family="'Segoe UI',system-ui,sans-serif"; Chart.defaults.font.size=11; Chart.defaults.borderColor='#1a2340';
function chartOpts(extra={}){ return { responsive:true, maintainAspectRatio:false, plugins:{ legend:{labels:{color:'#cbd5e1',font:{size:11},usePointStyle:true,padding:12}}, tooltip:{backgroundColor:'#0c1426',titleColor:'#e2e8f0',bodyColor:'#cbd5e1',borderColor:'#2a3a60',borderWidth:1,padding:10,cornerRadius:6}}, scales:{x:{grid:{color:'rgba(26,35,64,.4)'},ticks:{color:'#64748b'}},y:{grid:{color:'rgba(26,35,64,.4)'},ticks:{color:'#64748b'},beginAtZero:true}}, ...extra }; }

/* Helper : titre d'axe lisible */
function axT(text){ return { display:true, text, color:'#cbd5e1', font:{size:11,weight:'600'}, padding:{top:6,bottom:6} }; }

/* Helper : panneau "Comment lire" pédagogique en dessous d'un chart
   Signature : chartInsight(canvasId, methodHTML, lectureHTML, color='#60a5fa', bottomLine='')
   - methodHTML  : explication de comment lire le graphique (axes, échelles, conventions)
   - lectureHTML : ce que les chiffres nous disent concrètement
   - bottomLine  : (optionnel) phrase synthétique « À retenir » pour décideur
*/
function chartInsight(canvasId, methodHTML, lectureHTML, color='#60a5fa', bottomLine=''){
  const el = document.getElementById(canvasId); if(!el) return;
  const card = el.closest('.card'); if(!card) return;
  let ins = card.querySelector('.chart-insight');
  if(!ins){
    ins = document.createElement('div');
    ins.className='chart-insight';
    ins.style.cssText='margin-top:14px;font-size:.8rem;line-height:1.6';
    card.appendChild(ins);
  }
  ins.innerHTML = `
    ${bottomLine ? `<div style="background:linear-gradient(135deg,${color}25 0%,${color}10 100%);border:1px solid ${color}55;border-radius:6px;padding:10px 13px;margin-bottom:10px;color:#e2e8f0;font-size:.86rem;font-weight:600;line-height:1.5">
      <span style="font-size:.66rem;color:${color};text-transform:uppercase;letter-spacing:1px;font-weight:800;display:block;margin-bottom:3px"><i class="fa-solid fa-bullseye"></i> À retenir</span>
      ${bottomLine}
    </div>` : ''}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div style="background:rgba(148,163,184,.06);border-left:3px solid #94a3b8;padding:10px 12px;border-radius:4px;color:#cbd5e1">
        <div style="font-size:.68rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;font-weight:700;margin-bottom:5px"><i class="fa-solid fa-book-open"></i> Comment lire ce graphique</div>
        ${methodHTML}
      </div>
      <div style="background:${color}10;border-left:3px solid ${color};padding:10px 12px;border-radius:4px;color:#e2e8f0">
        <div style="font-size:.68rem;color:${color};text-transform:uppercase;letter-spacing:.5px;font-weight:700;margin-bottom:5px"><i class="fa-solid fa-magnifying-glass-chart"></i> Ce que les chiffres nous disent</div>
        ${lectureHTML}
      </div>
    </div>`;
}

/* Helper : BANDEAU PÉDAGOGIQUE introductif d'une page
   Args :
     targetId  : l'élément où injecter le bandeau (en haut)
     cfg       : { icon, color, title, what, howToRead[], takeaway }
       icon       : nom Font Awesome (sans 'fa-')
       color      : couleur thématique (hex)
       title      : titre court de la page
       what       : 1 phrase répondant à « À quoi ça sert ? »
       howToRead  : tableau 2-4 lignes expliquant comment lire le contenu
       takeaway   : (optionnel) phrase clé en gros pour décideur
*/
function pageIntroBanner(targetId, cfg){
  const t = document.getElementById(targetId); if(!t) return;
  if(t.querySelector('.page-intro-banner')) return; // déjà présent
  const b = document.createElement('div');
  b.className='page-intro-banner';
  b.style.cssText=`background:linear-gradient(135deg,${cfg.color}11 0%,#0a0f1c 100%);border:1px solid ${cfg.color}55;border-left:4px solid ${cfg.color};border-radius:6px;padding:14px 18px;margin-bottom:16px`;
  b.innerHTML = `
    <div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap">
      <div style="font-size:2.2rem;color:${cfg.color};line-height:1;flex-shrink:0"><i class="fa-solid fa-${cfg.icon}"></i></div>
      <div style="flex:1;min-width:240px">
        <div style="font-size:.62rem;color:${cfg.color};letter-spacing:2px;text-transform:uppercase;font-weight:800;margin-bottom:2px">⚡ ${cfg.title||''}</div>
        <div style="font-size:1rem;color:#e2e8f0;font-weight:700;line-height:1.4;margin-bottom:7px">${cfg.what}</div>
        ${cfg.howToRead?.length ? `
          <div style="background:#0a0f1c;border:1px solid #1a2340;border-radius:5px;padding:9px 11px;margin-top:6px">
            <div style="font-size:.66rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;font-weight:700;margin-bottom:5px"><i class="fa-solid fa-circle-question"></i> Comment lire cette page</div>
            ${cfg.howToRead.map(line=>`<div style="font-size:.78rem;color:#cbd5e1;padding:2px 0;line-height:1.45">▸ ${line}</div>`).join('')}
          </div>` : ''}
        ${cfg.takeaway ? `
          <div style="background:linear-gradient(135deg,${cfg.color}25 0%,${cfg.color}10 100%);border:1px solid ${cfg.color}66;border-radius:5px;padding:8px 11px;margin-top:8px">
            <span style="font-size:.62rem;color:${cfg.color};text-transform:uppercase;letter-spacing:1px;font-weight:800;display:block;margin-bottom:2px"><i class="fa-solid fa-bullseye"></i> Ce qu'on cherche à savoir</span>
            <span style="font-size:.86rem;color:#e2e8f0;font-weight:600">${cfg.takeaway}</span>
          </div>` : ''}
      </div>
    </div>`;
  t.insertBefore(b, t.firstChild);
}

/* Helper : bandeau d'aide pédagogique général en haut d'une page riche en graphiques */
function chartHelpBanner(targetId, title='Comment lire les graphiques de cette page'){
  const t = document.getElementById(targetId); if(!t) return;
  if(t.querySelector('.chart-help-banner')) return; // déjà présent
  const banner = document.createElement('div');
  banner.className='chart-help-banner';
  banner.style.cssText='background:linear-gradient(135deg,#0c1426 0%,#0a0f1c 100%);border:1px solid #1a2340;border-radius:6px;padding:11px 14px;margin-bottom:14px;font-size:.78rem;color:#94a3b8;line-height:1.55';
  banner.innerHTML = `<div style="display:flex;gap:9px;align-items:flex-start">
    <i class="fa-solid fa-circle-info" style="color:#60a5fa;font-size:1.05rem;margin-top:2px"></i>
    <div style="flex:1">
      <b style="color:#cbd5e1">${title}</b><br>
      Chaque graphique dispose d'un encart <b style="color:#60a5fa">« Comment lire »</b> (méthode) et <b style="color:#fde047">« Ce que les chiffres nous disent »</b> (interprétation), avec si possible un encart <b style="color:#22c55e">« À retenir »</b> pour décideur.
      <br><span style="color:#64748b;font-size:.74rem">Survolez les barres et points avec la souris pour obtenir les valeurs précises.</span>
    </div>
  </div>`;
  t.insertBefore(banner, t.firstChild);
}

const CHARTS = {};
function makeChart(id, cfg){ if(CHARTS[id]){CHARTS[id].destroy(); delete CHARTS[id];} const el=document.getElementById(id); if(!el) return null; CHARTS[id]=new Chart(el,cfg); return CHARTS[id]; }

/* ============= ROUTER ============= */
const Router = {
  current:'dash',
  titles:{
    dash:['Tableau de bord','Synthèse opérationnelle multi-théâtres'],
    bqs:['Brief Quotidien Stratégique','Top 5 développements 24 h · exportable PDF & Word'],
    adversarial:['Veille adversariale','Cartographie des narratives par bloc géopolitique'],
    impact_radar:['Veille Impact BF','Radar mondial — 35 canaux d\'impact direct, proximité, systémique sur le BF'],
    geointel:['GeoIntel — Carte mondiale','Outil cartographique compagnon : mers, fleuves, détroits, territoires, fiches pays — fusion avec GéoWatch'],
    conflicts:['Fiches conflits','Note de situation 8 dimensions par conflit'],
    briefs:['Briefs 2 couches','Décideur (5 points) + analyste (faits, hypothèses, indicateurs)'],
    scenarios:['Scénarios prospectifs','Méthode Godet — proba × impact'],
    indicators:['Indicateurs à surveiller','Signaux 24-72 h, 7-30 j, 30-90 j'],
    reconfig:['Reconfigurations stratégiques','Recompositions d\'équilibres internationaux'],
    impact_bf:['Impacts Burkina Faso','Conséquences contextualisées des dynamiques mondiales'],
    analyses:['Analyses quantitatives','Tendances, rythmes, comparaisons'],
    map:['Carte stratégique','Style ICG — zones, statut, intensité'],
    countries:['Pays','Indice composite type Fragile States Index'],
    sources:['Sources think tanks & médias','140+ sources : 15 BF locales (Lefaso, Burkina24, Sidwaya, AIB, Wakat Séra…), Sahel (Maliweb, Niger24, Tchadinfos, Cridem…), Afrique (Abidjan.net, Seneweb, ISS Africa, WATHI…), think tanks (ICG, ACLED, IRIS, IFRI, ISW, Brookings, Carnegie…), médias (Le Monde, BBC, Al Jazeera, NYT, Jeune Afrique, RFI…)'],
    news:['Flux RSS','Veille auto-taggée par conflit'],
    worldwatch:['Veille mondiale automatique','Tensions, zones chaudes & événements détectés en temps réel depuis les flux RSS'],
    alerts:['Alertes','Seuils de rupture (cf. Codex Veille MO)'],
    events:['Chronologie','Tous événements consolidés'],
    admin:['Administration','Gestion des données']
  },
  go(page){
    this.current = page;
    document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active', a.dataset.page===page));
    document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active', p.dataset.page===page));
    const [t,s] = this.titles[page]||[page,'']; document.getElementById('page-title').textContent=t; document.getElementById('page-sub').textContent=s;
    if(page==='dash') renderDashboard();
    else if(page==='bqs') renderBQS();
    else if(page==='adversarial') renderAdversarial();
    else if(page==='impact_radar') renderImpactRadar();
    else if(page==='geointel') renderGeoIntel();
    else if(page==='conflicts') renderConflicts();
    else if(page==='briefs') renderBriefs();
    else if(page==='scenarios') renderScenarios();
    else if(page==='indicators') renderIndicators();
    else if(page==='reconfig') renderReconfig();
    else if(page==='impact_bf') renderImpactBF();
    else if(page==='analyses') renderAnalyses();
    else if(page==='map') setTimeout(()=>{GeoMap.init('map'); GeoMap.renderAll();},80);
    else if(page==='countries') renderCountries();
    else if(page==='sources') renderSources();
    else if(page==='news') renderNews();
    else if(page==='worldwatch') renderWorldWatch();
    else if(page==='alerts') renderAlerts();
    else if(page==='events') renderEvents();
    else if(page==='admin') renderAdmin();
    // Refresh RSS automatique si données stales (>5min) sur les pages qui en bénéficient
    if(['news','alerts','dash','sources','conflicts','worldwatch','events','bqs','adversarial','impact_radar'].includes(page)){
      const stale = !NEWS_STATE.lastUpdate || (Date.now()-new Date(NEWS_STATE.lastUpdate))>5*60*1000;
      if(stale && !NEWS_STATE.loading){ NEWS_STATE.loading=true; loadNews().finally(()=>{NEWS_STATE.loading=false;}); }
    }
  }
};

/* ============================================================
   ===== GW_INTEL : MODULE INTELLIGENCE STRATÉGIQUE AVANCÉE =====
   ============================================================
   Composants :
   - IMS-BF : Indice de Menace Stratégique pondéré (6 dimensions)
   - BQS    : Brief Quotidien Stratégique (top 5, format A4, PDF)
   - COTES  : Système de fiabilité OTAN (A1-F6) sur sources & articles
   - ADV    : Veille adversariale (segmentation par bloc d'origine)
   ============================================================ */
const GW_INTEL = (()=>{

  /* ===== TAXONOMIE DES SOURCES PAR BLOC (veille adversariale) ===== */
  const BLOCKS = {
    'occident_fr':{label:'Occident — francophone', flag:'🇫🇷', color:'#3b82f6',
      patterns:['lemonde','rfi','france24','franceinfo','liberation','figaro','grandcontinent','le grand continent','diploweb','iris','ifri','frs.','politis','mediapart','euronews']},
    'occident_us':{label:'Occident — anglophone', flag:'🇺🇸', color:'#60a5fa',
      patterns:['nytimes','washingtonpost','foreignpolicy','voanews','voa.gov','ft.com','wsj','reuters','bbc.com','bbc.co.uk','economist','theatlantic','cnn.com','cfr.org','brookings','rand.org','aei.org','csis.org','isw.','crisisgroup','acleddata']},
    'russie':{label:'Russie / pro-Moscou', flag:'🇷🇺', color:'#dc2626',
      patterns:['rt.com','rt.fr','sputnik','tass','ria.ru','strategic-culture','katehon']},
    'golfe_mo':{label:'Golfe / Moyen-Orient', flag:'🇶🇦', color:'#a855f7',
      patterns:['aljazeera','alarabiya','almonitor','arabnews','tehran','presstv','iranintl','jpost','timesofisrael']},
    'chine':{label:'Chine / pro-Pékin', flag:'🇨🇳', color:'#dc2626',
      patterns:['xinhuanet','xinhua','cgtn','globaltimes','chinadaily','people.cn','scmp']},
    'turquie':{label:'Turquie', flag:'🇹🇷', color:'#f97316',
      patterns:['trtworld','trt ','anadoluagency','dailysabah','hurriyet']},
    'afrique':{label:'Afrique panafricaine', flag:'🌍', color:'#22c55e',
      patterns:['jeuneafrique','africanews','africa news','allafrica','iss africa','issafrica','bbc afrique','rfi afrique','apa news','afrik','agenceecofin']},
    'bf_local':{label:'Burkina Faso — local', flag:'🇧🇫', color:'#fde047',
      patterns:['lefaso','burkina24','sidwaya','aib.media','wakatsera','ouaga.com','radio omega']}
  };

  function classifyBlock(item){
    const txt = ((item._source||'')+' '+(item.link||'')+' '+(item._feed||'')).toLowerCase();
    for(const [key,b] of Object.entries(BLOCKS)){
      if(b.patterns.some(p=>txt.includes(p))) return key;
    }
    return 'autre';
  }

  /* ===== COTES DE FIABILITÉ STYLE OTAN (A-F × 1-6) ===== */
  // Lettre = fiabilité de la source / Chiffre = crédibilité de l'information
  const RELIABILITY_LETTER = {
    'A':{label:'Totalement fiable', desc:'Source officielle, think tank reconnu, archive primaire', color:'#22c55e'},
    'B':{label:'Habituellement fiable', desc:'Média de référence, rédaction contrôlée', color:'#3b82f6'},
    'C':{label:'Assez fiable', desc:'Agence de presse, média grand public neutre', color:'#a78bfa'},
    'D':{label:'Pas habituellement fiable', desc:'Média d\'État partisan, propagande probable', color:'#f59e0b'},
    'E':{label:'Non fiable', desc:'Source douteuse, blog non vérifié', color:'#ef4444'},
    'F':{label:'Fiabilité indéterminée', desc:'Source inconnue ou nouvelle', color:'#64748b'}
  };
  const CREDIBILITY_NUM = {
    1:'Confirmé par 3+ sources indépendantes',
    2:'Probablement vrai (2 sources)',
    3:'Possiblement vrai (1 source fiable)',
    4:'Véracité douteuse',
    5:'Improbable',
    6:'Indéterminé'
  };

  // Tables de cotation des sources connues (lettre uniquement, le chiffre se calcule sur l'info)
  const SOURCE_RATING = {
    // A — think tanks et primaires
    'crisisgroup':'A','iss':'A','iris':'A','ifri':'A','frs':'A','rand':'A','isw':'A','acled':'A','sipri':'A','csis':'A','cfr':'A','brookings':'A',
    // B — médias de référence
    'le monde':'B','bbc':'B','reuters':'B','financial times':'B','ft.com':'B','nytimes':'B','wsj':'B','washingtonpost':'B','le grand continent':'B','grandcontinent':'B','diploweb':'B','foreign policy':'B','foreignpolicy':'B','economist':'B','jeuneafrique':'B','jeune afrique':'B',
    // C — agences neutres / médias grand public
    'rfi':'C','france 24':'C','france24':'C','africanews':'C','africa news':'C','euronews':'C','dw':'C','liberation':'C','figaro':'C','allafrica':'C','agenceecofin':'C','apa news':'C',
    // D — médias d'État partisans
    'rt.com':'D','rt ':'D','sputnik':'D','tass':'D','xinhua':'D','cgtn':'D','globaltimes':'D','aljazeera':'D','al jazeera':'D','presstv':'D','trt':'D','voanews':'D','voa ':'D',
    // BF — local
    'lefaso':'C','burkina24':'C','sidwaya':'C','aib':'C','wakatsera':'C'
  };

  function reliabilityLetter(item){
    const txt = ((item._source||'')+' '+(item.link||'')).toLowerCase();
    for(const [k,v] of Object.entries(SOURCE_RATING)){
      if(txt.includes(k)) return v;
    }
    return 'F';
  }

  function credibilityNum(item){
    // Heuristique : un événement majeur (rupture/crise) avec confirmation multiple ⇒ 1-2
    // Sinon par défaut 3 (source unique). Si source D, on dégrade à 4-5.
    const letter = reliabilityLetter(item);
    if(letter==='D' || letter==='E') return 4;
    // Si plusieurs sources mentionnent le même événement (mots-clés du titre)
    const allItems = (window.NEWS_STATE?.items)||[];
    const titleWords = (item.title||'').toLowerCase().split(/\s+/).filter(w=>w.length>5).slice(0,5);
    if(titleWords.length>0){
      const corroborated = allItems.filter(it=>{
        if(it===item || !it.title) return false;
        const t = it.title.toLowerCase();
        return titleWords.filter(w=>t.includes(w)).length >= 3;
      }).length;
      if(corroborated>=2) return 1;
      if(corroborated===1) return 2;
    }
    return 3;
  }

  function reliabilityChip(item, opts={}){
    const L = reliabilityLetter(item);
    const N = credibilityNum(item);
    const meta = RELIABILITY_LETTER[L];
    const tipL = `${L} : ${meta.label} — ${meta.desc}`;
    const tipN = `${N} : ${CREDIBILITY_NUM[N]}`;
    const compact = opts.compact;
    return `<span class="rel-chip" title="Cote OTAN — ${tipL} | ${tipN}" style="display:inline-flex;align-items:center;gap:0;padding:1px 0;background:${meta.color}15;color:${meta.color};border:1px solid ${meta.color}55;border-radius:4px;font-size:.62rem;font-weight:700;font-family:'Courier New',monospace;letter-spacing:.5px">
      <span style="background:${meta.color};color:#0a0f1c;padding:1px 4px;border-radius:3px 0 0 3px">${L}${N}</span>${compact?'':`<span style="padding:1px 5px">${meta.label.split(' ')[0]}</span>`}
    </span>`;
  }

  /* ===== IMS-BF : INDICE DE MENACE STRATÉGIQUE BF ===== */
  // Calcul pondéré sur 6 dimensions (sortie 0-100)
  function computeIMS(){
    const items = (window.NEWS_STATE?.items)||[];
    const d = DB.get();

    // Fenêtre glissante 7 jours
    const week = items.filter(it=>it.pubDate && (Date.now()-new Date(it.pubDate))/86400000 < 7);
    const day = items.filter(it=>it.pubDate && (Date.now()-new Date(it.pubDate))/86400000 < 1);

    // 1. SÉCURITAIRE (25%) — attaques, JNIM/EIGS, frappes près du BF
    const secKw = ['attaque','attentat','frappe','embusca','tué','morts','jnim','eigs','aqim','daesh','jihadiste','terroriste','vbiéd','offensive','assaut','ied'];
    const bfSec = week.filter(it=>{
      const txt = ((it.title||'')+' '+(it.description||'')).toLowerCase();
      return (it._bf || /sahel|burkina|mali|niger|ouagadougou|bamako|niamey/i.test(txt)) && secKw.some(k=>txt.includes(k));
    });
    const secScore = Math.min(100, bfSec.length*8 + day.filter(it=>it._bf).length*4);

    // 2. DIPLOMATIQUE (20%) — sanctions, ruptures, expulsions
    const diploKw = ['sanction','expulsion','ambassadeur rappelé','rupture','isolement','suspension','condamnation','blocus'];
    const diplo = week.filter(it=>{
      const txt = ((it.title||'')+' '+(it.description||'')).toLowerCase();
      const isBFAxis = /burkina|mali|niger|aes|cedeao|ecowas|sahel/i.test(txt);
      return isBFAxis && diploKw.some(k=>txt.includes(k));
    });
    const diploScore = Math.min(100, diplo.length*15);

    // 3. ÉCONOMIQUE (20%) — or, coton, F CFA, dette, mines
    const ecoKw = ['or','gold','coton','franc cfa','f cfa','dette','crise économique','inflation','mine','wagner','africa corps'];
    const eco = week.filter(it=>{
      const txt = ((it.title||'')+' '+(it.description||'')).toLowerCase();
      return /burkina|sahel|aes|mali|niger/i.test(txt) && ecoKw.some(k=>txt.includes(k));
    });
    const ecoScore = Math.min(100, eco.length*12);

    // 4. COHÉSION INTERNE BF (15%) — manifestations, tensions, communautaires
    const cohKw = ['manifestation','communautaire','peul','dozos','vdp','dozo','exaction','crime','massacre','déplacés','réfugiés'];
    const coh = week.filter(it=>{
      const txt = ((it.title||'')+' '+(it.description||'')).toLowerCase();
      return /burkina|ouagadougou|bobo|kaya|djibo|dori/i.test(txt) && cohKw.some(k=>txt.includes(k));
    });
    const cohScore = Math.min(100, coh.length*15);

    // 5. ENVIRONNEMENT RÉGIONAL (10%) — Côte d'Ivoire, Ghana, Bénin, Togo, Sénégal, CEDEAO
    const reg = week.filter(it=>{
      const txt = ((it.title||'')+' '+(it.description||'')).toLowerCase();
      return /côte d'ivoire|ivoire|ghana|bénin|benin|togo|sénégal|senegal|cedeao|ecowas/i.test(txt) && /tension|crise|attaque|frontiere|frontière/i.test(txt);
    });
    const regScore = Math.min(100, reg.length*15);

    // 6. PRESSION INFORMATIONNELLE (10%) — volume articles hostiles vs BF
    const adv = week.filter(it=>{
      const block = classifyBlock(it);
      const txt = ((it.title||'')+' '+(it.description||'')).toLowerCase();
      return ['occident_fr','occident_us'].includes(block) && /burkina|traoré|aes|junte|sahel/i.test(txt);
    });
    const infoScore = Math.min(100, adv.length*5);

    // Score pondéré final
    const score = Math.round(
      secScore*0.25 + diploScore*0.20 + ecoScore*0.20 +
      cohScore*0.15 + regScore*0.10 + infoScore*0.10
    );

    return {
      score,
      level: score>=70?'CRITIQUE':score>=50?'ÉLEVÉ':score>=30?'MODÉRÉ':score>=15?'FAIBLE':'CALME',
      color: score>=70?'#ef4444':score>=50?'#f97316':score>=30?'#f59e0b':score>=15?'#eab308':'#22c55e',
      dimensions: {
        securitaire: {score:Math.round(secScore), weight:25, count:bfSec.length, label:'Menace sécuritaire'},
        diplomatique: {score:Math.round(diploScore), weight:20, count:diplo.length, label:'Pression diplomatique'},
        economique: {score:Math.round(ecoScore), weight:20, count:eco.length, label:'Vulnérabilité économique'},
        cohesion: {score:Math.round(cohScore), weight:15, count:coh.length, label:'Cohésion interne'},
        regional: {score:Math.round(regScore), weight:10, count:reg.length, label:'Environnement régional'},
        info: {score:Math.round(infoScore), weight:10, count:adv.length, label:'Pression informationnelle'}
      },
      dataPoints: week.length,
      window: '7 jours glissants',
      computedAt: new Date().toISOString()
    };
  }

  // Historique IMS sur 30 jours (stocké dans localStorage)
  function pushIMSHistory(ims){
    const HKEY = 'gw_ims_history';
    let h = []; try { h = JSON.parse(localStorage.getItem(HKEY))||[]; } catch(e){}
    const today = new Date().toISOString().slice(0,10);
    h = h.filter(x=>x.date!==today);
    h.push({date:today, score:ims.score, level:ims.level});
    h = h.slice(-90); // 90 jours max
    try { localStorage.setItem(HKEY, JSON.stringify(h)); } catch(e){}
    return h;
  }
  function getIMSHistory(){
    try { return JSON.parse(localStorage.getItem('gw_ims_history'))||[]; } catch(e){ return []; }
  }

  /* ===== JAUGE IMS-BF (SVG circulaire premium) ===== */
  function renderIMSGauge(targetId='ims-gauge'){
    const el = document.getElementById(targetId); if(!el) return;
    const ims = computeIMS();
    pushIMSHistory(ims);
    const hist = getIMSHistory();

    const r = 95, cx = 130, cy = 130;
    const circ = 2 * Math.PI * r;
    const dash = (ims.score/100) * circ;
    const offset = circ - dash;

    // Mini sparkline 30j
    const last30 = hist.slice(-30);
    const sparkW = 220, sparkH = 38;
    let spark = '';
    if(last30.length>1){
      const max = Math.max(...last30.map(p=>p.score), 30);
      const pts = last30.map((p,i)=>{
        const x = (i/(last30.length-1))*sparkW;
        const y = sparkH - (p.score/max)*sparkH;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      spark = `<svg width="${sparkW}" height="${sparkH}" style="display:block">
        <polyline fill="none" stroke="${ims.color}" stroke-width="1.8" points="${pts}"/>
        <polyline fill="${ims.color}22" stroke="none" points="0,${sparkH} ${pts} ${sparkW},${sparkH}"/>
      </svg>`;
    }

    const dimsHTML = Object.entries(ims.dimensions).map(([k,v])=>{
      const dCol = v.score>=70?'#ef4444':v.score>=50?'#f97316':v.score>=30?'#f59e0b':v.score>=15?'#eab308':'#22c55e';
      return `<div style="margin-bottom:7px">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:.7rem;margin-bottom:2px">
          <span style="color:#cbd5e1"><b>${v.label}</b> <span style="color:#64748b">· ${v.weight}%</span></span>
          <span style="color:${dCol};font-weight:700">${v.score}<span style="color:#64748b;font-weight:400">/100</span></span>
        </div>
        <div style="height:5px;background:#0a0f1c;border-radius:3px;overflow:hidden"><div style="height:100%;width:${v.score}%;background:${dCol};transition:width .8s ease"></div></div>
      </div>`;
    }).join('');

    el.innerHTML = `
      <div style="display:grid;grid-template-columns:280px 1fr;gap:24px;align-items:center">
        <!-- JAUGE CIRCULAIRE -->
        <div style="position:relative;width:260px;height:260px;margin:auto">
          <svg width="260" height="260" viewBox="0 0 260 260">
            <defs>
              <linearGradient id="ims-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${ims.color}" stop-opacity=".2"/>
                <stop offset="100%" stop-color="${ims.color}" stop-opacity=".8"/>
              </linearGradient>
              <filter id="ims-glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#0a0f1c" stroke-width="14"/>
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#ims-grad)" stroke-width="14" stroke-linecap="round"
              stroke-dasharray="${dash} ${circ}" stroke-dashoffset="0"
              transform="rotate(-90 ${cx} ${cy})" filter="url(#ims-glow)"
              style="transition:stroke-dasharray 1.2s ease"/>
            <text x="${cx}" y="${cy-6}" text-anchor="middle" fill="${ims.color}" font-size="56" font-weight="800" font-family="Segoe UI">${ims.score}</text>
            <text x="${cx}" y="${cy+18}" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="600" letter-spacing="2">/ 100</text>
            <text x="${cx}" y="${cy+42}" text-anchor="middle" fill="${ims.color}" font-size="13" font-weight="700" letter-spacing="3">${ims.level}</text>
          </svg>
          <div style="position:absolute;top:-6px;left:50%;transform:translateX(-50%);background:${ims.color};color:#0a0f1c;padding:3px 11px;border-radius:11px;font-size:.62rem;font-weight:800;letter-spacing:1px;box-shadow:0 0 12px ${ims.color}88">⚡ INDICE LIVE</div>
        </div>

        <!-- DIMENSIONS + SPARKLINE -->
        <div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:10px;flex-wrap:wrap">
            <div>
              <div style="font-size:1.05rem;color:#e2e8f0;font-weight:700;letter-spacing:.3px">Indice de Menace Stratégique — Burkina Faso</div>
              <div style="font-size:.72rem;color:#94a3b8;margin-top:2px">Calcul pondéré sur ${ims.dataPoints} articles · fenêtre ${ims.window}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:.62rem;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Tendance 30 j</div>
              ${spark}
            </div>
          </div>
          ${dimsHTML}
          <div style="margin-top:8px;padding:7px 10px;background:rgba(96,165,250,.06);border:1px solid rgba(96,165,250,.2);border-radius:5px;font-size:.7rem;color:#94a3b8;line-height:1.45">
            <i class="fa-solid fa-circle-info" style="color:#60a5fa"></i> <b style="color:#cbd5e1">Méthodologie :</b> Score = 0,25·Sécuritaire + 0,20·Diplo + 0,20·Éco + 0,15·Cohésion + 0,10·Régional + 0,10·Info. Mise à jour à chaque collecte RSS.
          </div>
        </div>
      </div>`;
  }

  /* ===== BQS — BRIEF QUOTIDIEN STRATÉGIQUE ===== */
  // Sélectionne les top 5 développements 24h pondérés par criticité pour le BF
  function buildBQS(){
    const items = (window.NEWS_STATE?.items)||[];
    const items24 = items.filter(it=>it.pubDate && (Date.now()-new Date(it.pubDate))/3600000 < 24);

    // Score chaque article : pertinence BF, sévérité, fiabilité
    const scored = items24.map(it=>{
      const txt = ((it.title||'')+' '+(it.description||'')).toLowerCase();
      let s = 0;
      if(it._bf) s += 30;
      if(/burkina|ouagadougou|traoré|aes/i.test(txt)) s += 25;
      if(/sahel|mali|niger/i.test(txt)) s += 18;
      if(/cedeao|ecowas|côte d'ivoire|ghana|bénin|togo/i.test(txt)) s += 12;
      if((it._majors||[]).length) s += 20;
      if((it._tags||[]).includes('military')) s += 8;
      if(/attaque|frappe|tué|sanction|coup/i.test(txt)) s += 10;
      const letter = reliabilityLetter(it);
      if(letter==='A'||letter==='B') s += 5;
      if(letter==='D'||letter==='E') s -= 5;
      return {item:it, score:s};
    }).filter(x=>x.score>0)
      .sort((a,b)=>b.score-a.score);

    const top5 = scored.slice(0,5).map(x=>x.item);

    // Implications BF auto-générées par patterns
    const implications = top5.map(it=>{
      const txt = ((it.title||'')+' '+(it.description||'')).toLowerCase();
      const lines = [];
      if(/burkina|ouagadougou|traoré/i.test(txt)){
        if(/attaque|jihadiste|jnim/i.test(txt)) lines.push('Pression sécuritaire intérieure directe — réévaluer dispositif local');
        if(/sanction|isolé|cedeao/i.test(txt)) lines.push('Pression diplomatique → opportunité narrative AES');
        else lines.push('Effet d\'image direct sur la souveraineté burkinabè');
      }
      if(/mali|niger/i.test(txt) && !/burkina/i.test(txt)){
        lines.push('Effet de contagion AES — coordination tripartite à surveiller');
      }
      if(/cedeao|ecowas/i.test(txt)){
        lines.push('Posture régionale en évolution — implications corridor logistique côtier');
      }
      if(/wagner|africa corps|russie/i.test(txt)){
        lines.push('Reconfiguration partenariat sécuritaire — surveiller livraisons');
      }
      if(/or|gold|mine/i.test(txt)){
        lines.push('Levier économique extractif — vigilance sur recettes État');
      }
      if(/iran|israël|gaza|liban/i.test(txt)){
        lines.push('Onde de choc Moyen-Orient — surveiller flux migratoires & inflation énergie');
      }
      if(/soudan|fsr|burhan/i.test(txt)){
        lines.push('Crise soudanaise — risque déstabilisation régionale élargie');
      }
      if(lines.length===0) lines.push('Veille à maintenir — implications BF à confirmer sur 48-72 h');
      return lines.slice(0,2);
    });

    // Indicateurs à surveiller (J+1 à J+7)
    const indicators = [];
    const ims = computeIMS();
    if(ims.dimensions.securitaire.score>40) indicators.push('🔴 Activité JNIM/EIGS soutenue dans la région — vigilance frontière nord/est');
    if(ims.dimensions.diplomatique.score>30) indicators.push('🟠 Tensions diplomatiques actives — déclarations CEDEAO/AES à venir');
    if(ims.dimensions.economique.score>30) indicators.push('🟠 Cours or, coton, mouvements F CFA à surveiller cette semaine');
    if(ims.dimensions.regional.score>30) indicators.push('🟡 Voisins côtiers en tension — corridor Lomé/Cotonou/Abidjan à surveiller');
    if(ims.dimensions.info.score>30) indicators.push('🟡 Volume narratives occidentales hostiles élevé — préparer riposte com');
    if(indicators.length===0) indicators.push('🟢 Pas de signal d\'alerte précoce identifié — maintien vigilance routine');

    return {
      date: new Date(),
      ims,
      top5,
      implications,
      indicators,
      stats: {
        articles24: items24.length,
        bf24: items24.filter(it=>it._bf).length,
        adversarial: items24.filter(it=>['occident_fr','occident_us'].includes(classifyBlock(it))).length
      }
    };
  }

  function renderBQS(){
    const el = document.getElementById('bqs-content'); if(!el) return;
    const bqs = buildBQS();
    const ims = bqs.ims;
    const dateStr = bqs.date.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    const timeStr = bqs.date.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});

    const top5HTML = bqs.top5.length ? bqs.top5.map((it,i)=>{
      const block = classifyBlock(it);
      const blockMeta = BLOCKS[block] || {flag:'🌐', label:'Non classé', color:'#64748b'};
      const impl = bqs.implications[i] || [];
      return `<div style="page-break-inside:avoid;border-left:3px solid ${ims.color};background:#0a0f1c;padding:11px 13px;margin-bottom:10px;border-radius:0 6px 6px 0">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px;flex-wrap:wrap">
          <div style="font-size:.92rem;color:#e2e8f0;font-weight:700;line-height:1.35;flex:1">
            <span style="color:${ims.color};margin-right:5px">${i+1}.</span> ${it.title||'(sans titre)'}
          </div>
          ${reliabilityChip(it)}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:7px">
          <span style="font-size:.62rem;color:${blockMeta.color};background:${blockMeta.color}15;border:1px solid ${blockMeta.color}55;padding:1px 7px;border-radius:9px">${blockMeta.flag} ${blockMeta.label}</span>
          <span style="font-size:.62rem;color:#64748b">${fmt.dateTime(it.pubDate)} · ${it._source||'—'}</span>
          ${(it._majors||[]).length?'<span class="chip" style="background:rgba(239,68,68,.15);color:#fca5a5;font-size:.6rem;border:1px solid rgba(239,68,68,.4);font-weight:700">⚠ MAJEUR</span>':''}
        </div>
        ${it.description?`<div style="font-size:.78rem;color:#94a3b8;line-height:1.5;margin-bottom:7px">${(it.description||'').slice(0,260)}${(it.description||'').length>260?'…':''}</div>`:''}
        <div style="background:rgba(253,224,71,.05);border:1px solid rgba(253,224,71,.2);padding:7px 10px;border-radius:4px;margin-top:7px">
          <div style="font-size:.64rem;color:#fde047;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;font-weight:700"><i class="fa-solid fa-flag-checkered"></i> Implications Burkina Faso</div>
          ${impl.map(l=>`<div style="font-size:.76rem;color:#cbd5e1;line-height:1.45">→ ${l}</div>`).join('')}
        </div>
        ${it.link?`<a href="${it.link}" target="_blank" rel="noopener" style="font-size:.66rem;color:#60a5fa;display:inline-block;margin-top:6px"><i class="fa-solid fa-arrow-up-right-from-square"></i> Source</a>`:''}
      </div>`;
    }).join('') : '<div class="empty"><i class="fa-solid fa-spinner fa-spin"></i><p>Collecte RSS en cours… Le brief s\'enrichit dès que les articles sont disponibles.</p></div>';

    el.innerHTML = `
      <!-- EN-TÊTE BRIEF -->
      <div style="background:linear-gradient(135deg,#0c1426 0%,#0a0f1c 100%);border:1px solid #1a2340;border-radius:8px;padding:16px 18px;margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">
          <div>
            <div style="font-size:.66rem;color:${ims.color};letter-spacing:3px;text-transform:uppercase;font-weight:800">⚡ Brief Quotidien Stratégique</div>
            <div style="font-size:1.3rem;color:#e2e8f0;font-weight:700;margin-top:3px;text-transform:capitalize">${dateStr}</div>
            <div style="font-size:.74rem;color:#64748b;margin-top:2px">Généré à ${timeStr} · Cycle 24 heures · Document à diffusion restreinte</div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn primary sm" id="bqs-export-pdf"><i class="fa-solid fa-file-pdf"></i> Exporter PDF</button>
            <button class="btn primary sm" id="bqs-export-doc" style="background:#2563eb"><i class="fa-solid fa-file-word"></i> Exporter Word</button>
            <button class="btn ghost sm" id="bqs-refresh"><i class="fa-solid fa-rotate"></i> Actualiser</button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-top:14px">
          <div style="background:#0a0f1c;border-left:3px solid ${ims.color};padding:8px 11px;border-radius:0 5px 5px 0">
            <div style="font-size:.62rem;color:#64748b;text-transform:uppercase;letter-spacing:.5px">IMS-BF</div>
            <div style="font-size:1.5rem;color:${ims.color};font-weight:800">${ims.score}<span style="color:#64748b;font-size:.78rem;font-weight:500">/100</span></div>
            <div style="font-size:.66rem;color:${ims.color};font-weight:700">${ims.level}</div>
          </div>
          <div style="background:#0a0f1c;border-left:3px solid #60a5fa;padding:8px 11px;border-radius:0 5px 5px 0">
            <div style="font-size:.62rem;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Articles 24 h</div>
            <div style="font-size:1.5rem;color:#60a5fa;font-weight:800">${bqs.stats.articles24}</div>
            <div style="font-size:.66rem;color:#94a3b8">collectés</div>
          </div>
          <div style="background:#0a0f1c;border-left:3px solid #fde047;padding:8px 11px;border-radius:0 5px 5px 0">
            <div style="font-size:.62rem;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Pertinents BF</div>
            <div style="font-size:1.5rem;color:#fde047;font-weight:800">${bqs.stats.bf24}</div>
            <div style="font-size:.66rem;color:#94a3b8">articles</div>
          </div>
          <div style="background:#0a0f1c;border-left:3px solid #ef4444;padding:8px 11px;border-radius:0 5px 5px 0">
            <div style="font-size:.62rem;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Couverture occidentale</div>
            <div style="font-size:1.5rem;color:#ef4444;font-weight:800">${bqs.stats.adversarial}</div>
            <div style="font-size:.66rem;color:#94a3b8">articles à analyser</div>
          </div>
        </div>
      </div>

      <!-- TOP 5 DÉVELOPPEMENTS -->
      <div class="card" style="margin:0 0 14px">
        <div class="card-hd"><h2><i class="fa-solid fa-bullseye" style="color:${ims.color}"></i>Top 5 développements stratégiques (24 h)</h2><div class="help">Classement pondéré : pertinence BF · sévérité · fiabilité source</div></div>
        ${top5HTML}
      </div>

      <!-- INDICATEURS À SURVEILLER -->
      <div class="card" style="margin:0">
        <div class="card-hd"><h2><i class="fa-solid fa-binoculars" style="color:#60a5fa"></i>Indicateurs à surveiller (J+1 → J+7)</h2><div class="help">Signaux faibles dérivés de l'analyse multidimensionnelle</div></div>
        <div style="display:flex;flex-direction:column;gap:7px">
          ${bqs.indicators.map(ind=>`<div style="background:#0a0f1c;border:1px solid #1a2340;padding:9px 12px;border-radius:5px;font-size:.85rem;color:#cbd5e1">${ind}</div>`).join('')}
        </div>
      </div>

      <!-- PIED -->
      <div style="margin-top:14px;padding:10px 14px;background:rgba(96,165,250,.04);border:1px solid rgba(96,165,250,.15);border-radius:6px;font-size:.7rem;color:#64748b;line-height:1.5;text-align:center">
        <b style="color:#94a3b8">GéoWatch — Cycle de veille automatisé</b> · Cotes de fiabilité standard OTAN (A1–F6) · Document généré à partir de ${bqs.stats.articles24} sources internationales
      </div>`;

    // Bind boutons
    const expBtn = document.getElementById('bqs-export-pdf');
    if(expBtn) expBtn.onclick = ()=>exportBQSPDF(bqs);
    const expDocBtn = document.getElementById('bqs-export-doc');
    if(expDocBtn) expDocBtn.onclick = ()=>exportBQSDOCX(bqs);
    const refBtn = document.getElementById('bqs-refresh');
    if(refBtn) refBtn.onclick = ()=>{ if(typeof loadNews==='function'){ toast('Actualisation en cours…','info'); loadNews().then(()=>renderBQS()); } else renderBQS(); };
  }

  /* ===== EXPORT PDF DU BRIEF QUOTIDIEN (format A4) ===== */
  function exportBQSPDF(bqs){
    if(!window.jspdf){ toast('Bibliothèque PDF non chargée','error'); return; }
    bqs = bqs || buildBQS();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({unit:'mm',format:'a4'});
    const W=210, H=297, M=15;
    let y = M;

    const dateStr = bqs.date.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    const timeStr = bqs.date.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});

    const checkPage = (need=20)=>{ if(y+need>H-15){ doc.addPage(); y=M; addFooter(); } };
    const addFooter = ()=>{
      const pn = doc.getCurrentPageInfo().pageNumber;
      doc.setFont('helvetica','italic'); doc.setFontSize(7.5); doc.setTextColor(120);
      doc.text(`GéoWatch — Brief Quotidien Stratégique — ${bqs.date.toLocaleDateString('fr-FR')}`, M, H-9);
      doc.text(`Page ${pn}`, W-M, H-9, {align:'right'});
      doc.setTextColor(0);
    };

    // BANDEAU EN-TÊTE
    const imsHex = bqs.ims.color.replace('#','');
    const r=parseInt(imsHex.slice(0,2),16), g=parseInt(imsHex.slice(2,4),16), b=parseInt(imsHex.slice(4,6),16);
    doc.setFillColor(8,13,26); doc.rect(0,0,W,32,'F');
    doc.setFillColor(r,g,b); doc.rect(0,32,W,1.5,'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(22); doc.setTextColor(96,165,250);
    doc.text('GéoWatch', M, 14);
    doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(180);
    doc.text('BRIEF QUOTIDIEN STRATÉGIQUE', M, 21);
    doc.setFontSize(8); doc.setTextColor(140);
    doc.text(`${dateStr} · ${timeStr}`, M, 27);
    // bloc IMS à droite
    doc.setFillColor(r,g,b); doc.rect(W-50, 6, 36, 22, 'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(7); doc.setTextColor(255);
    doc.text('IMS-BF', W-32, 11, {align:'center'});
    doc.setFontSize(20); doc.text(String(bqs.ims.score), W-32, 22, {align:'center'});
    doc.setFontSize(7); doc.text(bqs.ims.level, W-32, 26, {align:'center'});
    doc.setFontSize(8); doc.setTextColor(180);
    doc.text('Document à diffusion restreinte', W-M, 14, {align:'right'});
    doc.setTextColor(0); y = 42;
    addFooter();

    // RÉSUMÉ EXÉCUTIF
    doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(20,40,90);
    doc.text('RÉSUMÉ EXÉCUTIF (BLUF)', M, y); y+=2; doc.setDrawColor(20,40,90); doc.setLineWidth(.4); doc.line(M,y,W-M,y); y+=5;
    doc.setTextColor(0);
    const bluf = `IMS-BF du jour : ${bqs.ims.score}/100 (${bqs.ims.level}). ${bqs.stats.articles24} articles agrégés (${bqs.stats.bf24} pertinents BF, ${bqs.stats.adversarial} à analyser côté occidental). ${bqs.top5.length>0?'Le développement principal porte sur : '+(bqs.top5[0].title||'').slice(0,140)+'.':''}`;
    doc.setFont('helvetica','normal'); doc.setFontSize(10); doc.setTextColor(40);
    doc.splitTextToSize(bluf, W-2*M).forEach(l=>{checkPage(5); doc.text(l, M, y); y+=4.7;});
    y+=4;

    // DIMENSIONS IMS
    checkPage(50);
    doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(20,40,90);
    doc.text('DÉCOMPOSITION DE L\'INDICE DE MENACE', M, y); y+=2; doc.line(M,y,W-M,y); y+=5;
    doc.setTextColor(0);
    Object.entries(bqs.ims.dimensions).forEach(([k,d])=>{
      checkPage(8);
      doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(40);
      doc.text(`${d.label} (poids ${d.weight}%)`, M, y);
      doc.setFont('helvetica','normal');
      doc.text(`${d.score}/100 — ${d.count} signal(aux)`, W-M, y, {align:'right'});
      y+=2;
      doc.setFillColor(230,230,230); doc.rect(M, y, W-2*M, 2.2, 'F');
      const dHex = (d.score>=70?'ef4444':d.score>=50?'f97316':d.score>=30?'f59e0b':d.score>=15?'eab308':'22c55e');
      const dr=parseInt(dHex.slice(0,2),16), dg=parseInt(dHex.slice(2,4),16), db=parseInt(dHex.slice(4,6),16);
      doc.setFillColor(dr,dg,db); doc.rect(M, y, (W-2*M)*(d.score/100), 2.2, 'F');
      y+=6;
    });
    y+=4;

    // TOP 5
    checkPage(20);
    doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(180,40,40);
    doc.text('TOP 5 DÉVELOPPEMENTS STRATÉGIQUES (24 H)', M, y); y+=2; doc.setDrawColor(180,40,40); doc.line(M,y,W-M,y); y+=5;
    doc.setTextColor(0);

    bqs.top5.forEach((it,i)=>{
      checkPage(35);
      const block = classifyBlock(it);
      const blockMeta = BLOCKS[block] || {label:'Non classé', flag:''};
      const L = reliabilityLetter(it), N = credibilityNum(it);
      const impl = bqs.implications[i] || [];
      // numéro
      doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(180,40,40);
      doc.text(`${i+1}.`, M, y);
      // titre
      doc.setFontSize(10); doc.setTextColor(20);
      doc.splitTextToSize(it.title||'(sans titre)', W-2*M-8).forEach((l,li)=>{ doc.text(l, M+8, y); if(li>=0) y+=4.7; });
      // meta
      doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(110);
      const date = it.pubDate ? new Date(it.pubDate).toLocaleString('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '';
      doc.text(`[${L}${N}] ${blockMeta.label} · ${it._source||'—'} · ${date}`, M+8, y); y+=5;
      // description courte
      if(it.description){
        doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(60);
        doc.splitTextToSize((it.description||'').slice(0,260), W-2*M-8).forEach(l=>{checkPage(5); doc.text(l, M+8, y); y+=4.5;});
      }
      // implications BF
      y+=1;
      doc.setFillColor(255,250,220); doc.rect(M+8, y-1, W-2*M-8, impl.length*5+5, 'F');
      doc.setDrawColor(220,180,40); doc.setLineWidth(.3); doc.line(M+8, y-1, M+8, y+impl.length*5+4);
      doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(160,100,0);
      doc.text('IMPLICATIONS BF :', M+11, y+3);
      doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(40);
      impl.forEach((l,li)=>{
        const lines = doc.splitTextToSize('→ '+l, W-2*M-14);
        lines.forEach(ln=>{ doc.text(ln, M+11, y+8+li*5); });
      });
      y += impl.length*5 + 9;
      // séparateur
      doc.setDrawColor(220); doc.setLineWidth(.2); doc.line(M, y, W-M, y); y+=4;
    });

    // INDICATEURS
    checkPage(40);
    doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(20,80,150);
    doc.text('INDICATEURS À SURVEILLER (J+1 → J+7)', M, y); y+=2; doc.setDrawColor(20,80,150); doc.line(M,y,W-M,y); y+=5;
    doc.setFont('helvetica','normal'); doc.setFontSize(9.5); doc.setTextColor(20);
    bqs.indicators.forEach(ind=>{
      checkPage(7);
      doc.splitTextToSize('▸ '+ind.replace(/^[🔴🟠🟡🟢]\s*/,''), W-2*M-3).forEach(l=>{ doc.text(l, M+3, y); y+=4.7; });
      y+=1;
    });
    y+=4;

    // MÉTHODOLOGIE & DISCLAIMER
    checkPage(30);
    doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(100);
    doc.text('MÉTHODOLOGIE', M, y); y+=4;
    doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(120);
    const meth = `IMS-BF = somme pondérée de 6 dimensions sur fenêtre 7 jours glissants : Sécuritaire 25% + Diplomatique 20% + Économique 20% + Cohésion 15% + Régional 10% + Informationnel 10%. Cotes de fiabilité = standard OTAN (lettre A-F pour la source, chiffre 1-6 pour l'information). Sources : ${bqs.stats.articles24} articles agrégés depuis flux RSS internationaux.`;
    doc.splitTextToSize(meth, W-2*M).forEach(l=>{ doc.text(l, M, y); y+=3.5; });

    doc.save(`BQS_${bqs.date.toISOString().slice(0,10)}.pdf`);
    toast('Brief Quotidien exporté en PDF','success');
  }

  /* ===== VEILLE ADVERSARIALE — RENDU ===== */
  function renderAdversarial(){
    const el = document.getElementById('adv-content'); if(!el) return;
    const items = (window.NEWS_STATE?.items)||[];
    const week = items.filter(it=>it.pubDate && (Date.now()-new Date(it.pubDate))/86400000 < 7);

    // Filtrage : articles parlant du Burkina/AES/Sahel
    const subjectKw = /burkina|ouagadougou|traoré|aes|sahel|mali|niger|jnim|wagner|africa corps|junte/i;
    const focused = week.filter(it=>{
      const txt = (it.title||'')+' '+(it.description||'');
      return subjectKw.test(txt);
    });

    // Classification par bloc
    const byBlock = {};
    Object.keys(BLOCKS).forEach(k=>byBlock[k]={items:[], block:BLOCKS[k]});
    byBlock.autre = {items:[], block:{label:'Non classé',flag:'❓',color:'#64748b'}};

    focused.forEach(it=>{
      const b = classifyBlock(it);
      (byBlock[b]||byBlock.autre).items.push(it);
    });

    // Détection narratives par mots-clés ciblés
    const narrPatterns = [
      {key:'pro_aes', label:'Pro-AES / pro-Traoré', color:'#22c55e', kw:['souveraineté','panafricanisme','indépendance','traoré héros','révolutionnaire','anti-impérialiste']},
      {key:'anti_aes', label:'Anti-junte / pro-CEDEAO', color:'#ef4444', kw:['junte','régime militaire','putsch','dictature','isolement','sanction']},
      {key:'pro_russia', label:'Pro-Russie / Wagner', color:'#dc2626', kw:['wagner partenaire','africa corps efficace','russie alliée','aide russe']},
      {key:'anti_russia', label:'Anti-Russie / Wagner', color:'#3b82f6', kw:['wagner mercenaires','exactions wagner','crimes de guerre','manipulation russe']},
      {key:'pro_france', label:'Pro-France / pro-occident', color:'#60a5fa', kw:['france soutient','aide française','partenariat européen','retour france']},
      {key:'anti_france', label:'Anti-France / Françafrique', color:'#a855f7', kw:['françafrique','néocolonial','ingérence française','rupture france']}
    ];

    const narrCount = narrPatterns.map(n=>{
      const matches = focused.filter(it=>{
        const t = ((it.title||'')+' '+(it.description||'')).toLowerCase();
        return n.kw.some(k=>t.includes(k));
      });
      return {...n, count:matches.length, items:matches};
    }).filter(n=>n.count>0).sort((a,b)=>b.count-a.count);

    const totalFocused = focused.length;

    el.innerHTML = `
      <div class="card" style="margin:0 0 14px;background:linear-gradient(135deg,#0c1426 0%,#0a0f1c 100%);border-color:#1a2340">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">
          <div>
            <div style="font-size:.62rem;color:#ef4444;letter-spacing:3px;text-transform:uppercase;font-weight:800">⚡ Veille adversariale</div>
            <div style="font-size:1.15rem;color:#e2e8f0;font-weight:700;margin-top:3px">Cartographie des narratives sur le Burkina Faso & le Sahel</div>
            <div style="font-size:.74rem;color:#64748b;margin-top:2px">${totalFocused} articles analysés sur 7 jours · répartis par bloc d'origine</div>
          </div>
        </div>
      </div>

      <!-- RÉPARTITION PAR BLOC -->
      <div class="card" style="margin:0 0 14px">
        <div class="card-hd"><h2><i class="fa-solid fa-globe"></i>Répartition de la couverture par bloc géopolitique</h2><div class="help">Volume d'articles parlant du BF/Sahel/AES classés par origine éditoriale</div></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px">
          ${Object.values(byBlock).filter(b=>b.items.length>0).sort((a,b)=>b.items.length-a.items.length).map(b=>{
            const pct = totalFocused>0 ? Math.round(b.items.length/totalFocused*100) : 0;
            return `<div style="background:#0a0f1c;border:1px solid #1a2340;border-top:3px solid ${b.block.color};border-radius:6px;padding:11px">
              <div style="font-size:1.4rem;font-weight:800;color:${b.block.color}">${b.block.flag} ${b.items.length}</div>
              <div style="font-size:.78rem;color:#e2e8f0;font-weight:600;margin-top:2px">${b.block.label}</div>
              <div style="font-size:.7rem;color:#64748b">${pct}% de la couverture</div>
              <div style="height:4px;background:#141c30;border-radius:2px;margin-top:7px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${b.block.color}"></div></div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- NARRATIVES DÉTECTÉES -->
      <div class="card" style="margin:0 0 14px">
        <div class="card-hd"><h2><i class="fa-solid fa-comments"></i>Narratives détectées</h2><div class="help">Détection automatique par signatures lexicales — à vérifier manuellement</div></div>
        ${narrCount.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px">
          ${narrCount.map(n=>`<div style="background:#0a0f1c;border-left:3px solid ${n.color};border-radius:5px;padding:11px 13px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
              <span style="font-size:.85rem;font-weight:700;color:${n.color}">${n.label}</span>
              <span style="font-size:1.1rem;font-weight:800;color:${n.color}">${n.count}</span>
            </div>
            <div style="font-size:.7rem;color:#94a3b8">${n.items.slice(0,2).map(it=>'• '+(it.title||'').slice(0,80)+'…').join('<br>')}</div>
          </div>`).join('')}
        </div>` : '<div class="empty"><i class="fa-solid fa-shield-halved"></i><p>Aucune narrative caractéristique détectée pour le moment.</p></div>'}
      </div>

      <!-- ARTICLES PAR BLOC -->
      <div class="card" style="margin:0">
        <div class="card-hd"><h2><i class="fa-solid fa-list"></i>Détail des couvertures par bloc</h2></div>
        ${Object.values(byBlock).filter(b=>b.items.length>0).map(b=>{
          return `<div style="margin-bottom:14px">
            <div style="font-size:.85rem;font-weight:700;color:${b.block.color};padding:6px 10px;background:${b.block.color}11;border-left:3px solid ${b.block.color};border-radius:0 4px 4px 0;margin-bottom:7px">${b.block.flag} ${b.block.label} <span style="color:#64748b;font-weight:400">· ${b.items.length} articles</span></div>
            ${b.items.slice(0,5).map(it=>`<a href="${it.link||'#'}" target="_blank" rel="noopener" style="display:block;text-decoration:none;padding:6px 10px;border-bottom:1px solid #141c30;color:#cbd5e1;font-size:.78rem">
              ${reliabilityChip(it,{compact:true})} <span style="color:#94a3b8;font-size:.66rem;margin:0 4px">${it._source||'—'} ·</span> ${(it.title||'').slice(0,140)}
            </a>`).join('')}
            ${b.items.length>5?`<div style="font-size:.7rem;color:#64748b;padding:5px 10px">+ ${b.items.length-5} autres articles</div>`:''}
          </div>`;
        }).join('')}
      </div>`;
  }

  /* ====================================================================
     ===== MATRICE D'IMPACT MONDIAL — 35 canaux affectant le BF =====
     ====================================================================
     Chaque canal détecte un type d'événement mondial et propose des
     thèmes de recherche + questions analytiques pour le chercheur.
     Niveau : direct | proximité | indirect | systémique
     ==================================================================== */
  const IMPACT_CHANNELS = [
    /* ═══ SÉCURITAIRE ═══ */
    {id:'sahel_jihad', cat:'security', label:'Jihadisme sahélien', icon:'⚔️', color:'#ef4444', level:'direct',
     patterns:[/jnim|eigs|aqmi|aqim|al[- ]?qaida|qaeda|daesh|état islamique|islamic state|jihadiste|terroriste sahel/i, /(attaque|frappe|embuscade|tué).{0,40}(burkina|mali|niger|sahel|liptako)/i],
     themes:['Évolution des modes opératoires JNIM/EIGS post-2024','Cartographie territoriale du contrôle jihadiste','Stratégie d\'épuisement vs AES'],
     questions:['Comment la stratégie d\'usure affecte-t-elle la cohésion AES ?','Quels signaux d\'extension vers les zones côtières ?','Quelle relation JNIM ↔ acteurs transnationaux (AQ, EI core) ?']},
    {id:'coastal_spillover', cat:'security', label:'Débordement côtier', icon:'🏖️', color:'#f97316', level:'proximité',
     patterns:[/côte d'ivoire|ivoire|ghana|togo|bénin|benin|sénégal|senegal/i, /(attentat|attaque|incursion|jihadiste|terroriste)/i],
     themes:['Modèle d\'extension Sahel→Golfe de Guinée','Capacités d\'anticipation des États côtiers','Coopération transfrontalière post-CEDEAO'],
     questions:['Le Bénin est-il devenu le nouveau front ?','Quelles ripostes à l\'Initiative d\'Accra ?','Quel rôle pour les corridors logistiques côtiers ?']},
    {id:'mercenaries_pmcs', cat:'security', label:'Sociétés militaires privées', icon:'🛡️', color:'#dc2626', level:'direct',
     patterns:[/wagner|africa corps|mercenaire|pmc|société militaire privée|private military|prigojine/i],
     themes:['Modèle économique des PMC russes en Afrique','Substitution Wagner→Africa Corps post-Prigojine','Comparatif coûts/bénéfices vs forces locales'],
     questions:['Quel coût réel pour le BF en concessions minières ?','Quelle pérennité de l\'engagement russe ?','Émergence d\'alternatives (Turquie, EAU, Iran) ?']},
    {id:'arms_trafficking', cat:'security', label:'Trafic d\'armes & flux illicites', icon:'🔫', color:'#b91c1c', level:'proximité',
     patterns:[/trafic d'armes|arms traffic|flux illicite|libye.{0,30}armes|sahara.{0,30}arms/i, /armement|arsenal|munitions/i],
     themes:['Flux libyens post-2011 dans le Sahel','Réseaux nord-africains d\'approvisionnement','Drones civils détournés (DJI, ZALA)'],
     questions:['Comment perturber les réseaux de réapprovisionnement ?','Quel impact des sanctions UE/US sur les flux ?']},
    {id:'drone_warfare', cat:'security', label:'Guerre des drones', icon:'🛸', color:'#dc2626', level:'direct',
     patterns:[/drone|tb2|bayraktar|akinci|akıncı|shahed|uav|unmanned aerial/i],
     themes:['Drones turcs Bayraktar TB2 dans la doctrine AES','Drones commerciaux dans les attaques jihadistes','Course technologique low-cost'],
     questions:['Quelle adaptation tactique JNIM aux drones ?','Bilan opérationnel des TB2 au Burkina/Mali ?']},

    /* ═══ DIPLOMATIQUE ═══ */
    {id:'cedeao_pressure', cat:'diplo', label:'Pression CEDEAO/AES', icon:'🤝', color:'#a855f7', level:'direct',
     patterns:[/cedeao|ecowas|aes|alliance des états du sahel/i, /(sortie|sanction|isolement|rupture|sommet)/i],
     themes:['Architecture sécuritaire post-CEDEAO','Émergence d\'un bloc AES-Sud global','Statut juridique des ressortissants AES'],
     questions:['Quel coût économique réel de la sortie pour BF ?','Quelle réintégration possible et à quel prix ?']},
    {id:'france_fr_relations', cat:'diplo', label:'Relations France & Françafrique', icon:'🇫🇷', color:'#3b82f6', level:'direct',
     patterns:[/france|français|françafrique|élysée|paris|macron|colon|néocolonial/i],
     themes:['Dé-dollarisation de l\'aide française','Repositionnement stratégique français en Afrique','Médias français et narratives sur le BF'],
     questions:['Quelle nouvelle équation France-AES après 2027 ?','Quel impact sur les diasporas ?']},
    {id:'russia_pivot', cat:'diplo', label:'Pivot russe en Afrique', icon:'🐻', color:'#dc2626', level:'direct',
     patterns:[/russie|russian|moscou|moscow|kremlin|poutine|putin|rt.com|sputnik/i, /(afrique|africa|sahel|sommet)/i],
     themes:['Doctrine Lavrov pour l\'Afrique 2024-2030','Sommets Russie-Afrique : bilan opérationnel','Relai narratif RT/Sputnik'],
     questions:['Quel coût réel pour la souveraineté monétaire AES ?','Capacité de la Russie à honorer ses promesses ?']},
    {id:'china_engagement', cat:'diplo', label:'Engagement chinois', icon:'🐲', color:'#dc2626', level:'proximité',
     patterns:[/chine|chinese|chinois|beijing|pékin|xi jinping|bri|belt and road|nouvelle route|focac/i],
     themes:['Investissements chinois extractifs au Sahel','FOCAC 2024 et engagements pour le BF','Diplomatie de la dette africaine'],
     questions:['Quel arbitrage AES entre Chine et Russie ?','Risque de dépendance dette ?']},
    {id:'gulf_powers', cat:'diplo', label:'Golfe & Turquie en Afrique', icon:'🕌', color:'#a855f7', level:'proximité',
     patterns:[/(émirats|emirats|uae|abu dhabi|qatar|arabie saoudite|saudi|turquie|turkey|erdogan|erdoğan|iran).{0,30}(afrique|africa|sahel|burkina|mali)/i],
     themes:['EAU comme financier des juntes via or','Turquie : drones, mosquées, formation','Iran : uranium, drones, axe Sahel'],
     questions:['Quelle architecture multipolaire émerge au Sahel ?','Concurrence ou complémentarité Golfe/Russie ?']},
    {id:'usa_africom', cat:'diplo', label:'USA & AFRICOM', icon:'🇺🇸', color:'#3b82f6', level:'proximité',
     patterns:[/états-unis|united states|américain|american|biden|trump|africom|pentagone|state department|cia/i],
     themes:['Posture US post-retrait Niger 2024','Section 333 et financements de défense','Stratégie d\'endiguement de la Russie'],
     questions:['Quelle redéfinition de la coopération militaire ?','Trump 2 : recul ou recadrage ?']},
    {id:'un_unsc', cat:'diplo', label:'ONU & multilatéralisme', icon:'🌐', color:'#60a5fa', level:'systémique',
     patterns:[/onu|united nations|conseil de sécurité|security council|guterres|minusma/i],
     themes:['Désengagement onusien et alternatives','Capacité de l\'ONU à intervenir en Afrique','Réforme du Conseil de sécurité'],
     questions:['Quel rôle pour l\'UA dans le post-MINUSMA ?']},

    /* ═══ ÉCONOMIQUE ═══ */
    {id:'gold_market', cat:'eco', label:'Marché de l\'or', icon:'💰', color:'#eab308', level:'direct',
     patterns:[/(or|gold|aurifère|orpaillage).{0,40}(prix|cours|marché|export|exportation|burkina|mali|sahel)/i, /lbma|sgbf|mine d'or/i],
     themes:['Or sahélien dans les chaînes mondiales','Captation Wagner et flux opaques (EAU)','Cours mondial et recettes État BF'],
     questions:['Quelle traçabilité réelle de l\'or BF ?','Comment formaliser l\'orpaillage ?']},
    {id:'cotton_textile', cat:'eco', label:'Coton & filière textile', icon:'🌾', color:'#a3e635', level:'direct',
     patterns:[/coton|cotton|textile|sofitex|filature/i],
     themes:['Effondrement filière coton sahélien','Pression climatique sur les rendements','Filières concurrentes (Asie centrale)'],
     questions:['Comment redresser SOFITEX BF ?','Quelle adaptation aux dérèglements climatiques ?']},
    {id:'oil_energy', cat:'eco', label:'Pétrole & énergie', icon:'⛽', color:'#f59e0b', level:'systémique',
     patterns:[/(pétrole|petrole|petroleum|brent|wti|opep|opec).{0,30}(prix|baril|marché|mondial)/i, /(énergie|energy|électricité|electric).{0,30}(crise|prix|africa|afrique)/i],
     themes:['Coût énergétique des États enclavés','Dépendance importations raffinées','Solaire comme alternative stratégique'],
     questions:['Impact d\'une flambée pétrole sur l\'inflation BF ?','Stratégie énergétique souveraine ?']},
    {id:'fcfa_currency', cat:'eco', label:'F CFA & monnaie souveraine', icon:'💱', color:'#a78bfa', level:'direct',
     patterns:[/franc cfa|f cfa|fcfa|cfa franc|sortie cfa|monnaie sahel|monnaie aes|bceao|umoa/i],
     themes:['Roadmap monnaie AES — réalisme technique','Impact sortie F CFA sur commerce extérieur','Modèles : Mauritanie ouguiya, Guinée franc'],
     questions:['Quels stocks de réserves disponibles ?','Risque hyperinflation transitionnelle ?']},
    {id:'food_security', cat:'eco', label:'Sécurité alimentaire', icon:'🌾', color:'#22c55e', level:'direct',
     patterns:[/(famine|food security|sécurité alimentaire|insécurité alimentaire|fao|pam|wfp|hunger).{0,40}(sahel|africa|burkina|niger|mali)/i, /céréales|grain|wheat|riz|rice|maïs|maize/i],
     themes:['Guerre en Ukraine et prix des céréales','Stocks stratégiques sahéliens','Innovation agricole face au climat'],
     questions:['Quel point de bascule famine au BF ?','Capacité d\'autosuffisance céréalière ?']},
    {id:'mining_commodities', cat:'eco', label:'Mines & métaux stratégiques', icon:'⛏️', color:'#ca8a04', level:'direct',
     patterns:[/(uranium|lithium|cobalt|manganèse|manganese|coltan|terres rares|rare earth).{0,40}(afrique|africa|sahel|niger|mali|burkina)/i, /orano|areva/i],
     themes:['Uranium nigérien et transition énergétique','Concurrence chinoise sur lithium africain','Géopolitique des terres rares'],
     questions:['Comment capter plus de valeur extractive ?','Sécurisation des sites miniers ?']},
    {id:'aid_sanctions', cat:'eco', label:'Aide & sanctions', icon:'📋', color:'#f59e0b', level:'direct',
     patterns:[/(aide|aid|sanction|embargo|gel d'avoirs|usaid|afd|gtz|gef|kfw).{0,40}(afrique|africa|sahel|burkina|mali|niger)/i],
     themes:['Effets boomerang des sanctions CEDEAO','Substitution Russie/Chine/Émirats à l\'aide occidentale','Conditionnalités de gouvernance'],
     questions:['Trou budgétaire BF post-suspensions UE ?','Quelle dépendance aide réelle ?']},

    /* ═══ SOCIO-POLITIQUE ═══ */
    {id:'coups_juntas_global', cat:'socio', label:'Coups d\'État & juntes globales', icon:'⚓', color:'#dc2626', level:'systémique',
     patterns:[/coup d'état|coup détat|coup d'etat|putsch|junta|junte/i, /(gabon|guinée|guinee|tchad|chad|venezuela|myanmar|honduras)/i],
     themes:['Doctrine de la "vague des juntes" (2020-2024)','Apprentissage entre régimes militaires','Réception internationale comparée'],
     questions:['Le BF est-il modèle ou exception ?','Quelle stabilisation civile post-junte ?']},
    {id:'democracy_setback', cat:'socio', label:'Recul démocratique', icon:'📉', color:'#a855f7', level:'systémique',
     patterns:[/(démocratie|democracy|autoritarisme|authoritarian|régime hybride|backsliding|recul démocratique|freedom house|v-dem)/i],
     themes:['Indices V-Dem & Freedom House appliqués au BF','Légitimité plébiscitaire vs procédurale','Modèles asiatiques (Singapour, Vietnam)'],
     questions:['Quel équilibre légitimité/efficacité pour le BF ?','Calendrier électoral réaliste ?']},
    {id:'migration_flows', cat:'socio', label:'Flux migratoires & déplacés', icon:'🚸', color:'#06b6d4', level:'direct',
     patterns:[/(migration|migrant|réfugié|refugee|déplacé|displaced|idp|hcr|unhcr).{0,40}(sahel|africa|afrique|burkina|niger)/i],
     themes:['Couloir BF→Côte d\'Ivoire/Ghana','Politiques européennes anti-migration','Déplacés internes et capacité d\'accueil'],
     questions:['2,1 M déplacés BF : capacité absorption ?','Migrations climatiques à 5 ans ?']},
    {id:'religious_dynamics', cat:'socio', label:'Dynamiques religieuses', icon:'🕌', color:'#8b5cf6', level:'proximité',
     patterns:[/(salafi|wahhabi|tijaniyya|qadiriyya|izala|sufi|soufi|missionnaire|missionnary|évangélique|evangelical|pentecôtiste|pentecostal)/i],
     themes:['Compétition islamique au Sahel','Évangélisation pentecôtiste vs Islam','Géopolitique religieuse Sénégal/BF'],
     questions:['Quelle alliance possible Soufis/État ?','Risque de polarisation chrétiens/musulmans ?']},
    {id:'ethnic_tensions', cat:'socio', label:'Tensions ethno-communautaires', icon:'⚡', color:'#ef4444', level:'direct',
     patterns:[/(peul|fulani|dogon|mossi|touareg|tuareg|sonrai|songhai|massalit|wolof).{0,40}(tension|conflit|conflict|massacre|exaction)/i, /communautaire|inter[- ]?communautaire|ethnique/i],
     themes:['Stigmatisation Peuls/Fulani et radicalisation','Médiation traditionnelle vs justice étatique','Modèles ivoiriens d\'apaisement'],
     questions:['Comment briser le cercle stigma→radicalisation ?','Rôle des chefferies traditionnelles ?']},

    /* ═══ RUPTURES STRATÉGIQUES ═══ */
    {id:'brics_global_south', cat:'strat', label:'BRICS & Sud global', icon:'🌍', color:'#22c55e', level:'systémique',
     patterns:[/brics|sud global|global south|non[- ]?aligné|non[- ]?aligned|g77|bandoung/i],
     themes:['Élargissement BRICS+ et nouvelle architecture','BNS et alternatives à la Banque mondiale','Doctrine post-westphalienne du Sud'],
     questions:['Quelle stratégie BRICS pour l\'AES ?','Le BF peut-il être observateur BRICS ?']},
    {id:'info_warfare', cat:'strat', label:'Guerre informationnelle', icon:'📡', color:'#dc2626', level:'direct',
     patterns:[/(désinformation|disinformation|manipulation|fake news|propagande|propaganda|opération d'influence|info[- ]?op)/i, /(rt|sputnik|al jazeera|voa).{0,40}(afrique|africa|sahel|burkina)/i],
     themes:['Cartographie des opérations d\'influence anti-BF','Capacités de riposte communicationnelle locale','Économie des fake news africaines'],
     questions:['Quelle stratégie BF en guerre informationnelle ?','Faut-il un Conseil de l\'information ?']},
    {id:'cyber_attacks', cat:'strat', label:'Cyber & sécurité numérique', icon:'💻', color:'#3b82f6', level:'systémique',
     patterns:[/(cyberattaque|cyber[- ]?attack|piratage|hack|ransomware|fuite de données|data leak|ddos|spyware|pegasus)/i, /(afrique|africa|sahel|gouvernement)/i],
     themes:['Posture cyber des États sahéliens','Souveraineté numérique : Starlink, fibre','Surveillance d\'État (Pegasus, Cellebrite)'],
     questions:['Quelle dépendance cyber du BF ?','Stratégie nationale de cybersécurité ?']},
    {id:'climate_security', cat:'strat', label:'Sécurité climatique', icon:'🌡️', color:'#0891b2', level:'systémique',
     patterns:[/(climat|climate|sécheresse|drought|inondation|flood|désertification|desertification|sahel green|grande muraille verte)/i],
     themes:['Sécurité climatique au Sahel — nexus','Adaptation agricole et conflits','Financement climat international'],
     questions:['Quel impact +2°C sur la sécurité BF ?','Nature-based solutions au Sahel ?']},
    {id:'pandemics_health', cat:'strat', label:'Pandémies & santé globale', icon:'🦠', color:'#06b6d4', level:'systémique',
     patterns:[/(pandémie|pandemic|épidémie|epidemic|oms|who|ebola|covid|mpox|monkeypox|paludisme|malaria|tuberculose|tuberculosis)/i],
     themes:['Souveraineté pharmaceutique africaine','Système de santé sahélien sous pression','Géopolitique vaccinale post-COVID'],
     questions:['Capacité résilience pandémique du BF ?','BF dans Africa CDC ?']},

    /* ═══ THÉÂTRES MAJEURS ═══ */
    {id:'ukraine_russia', cat:'theatre', label:'Théâtre Ukraine-Russie', icon:'🇺🇦', color:'#3b82f6', level:'systémique',
     patterns:[/ukraine|kiev|kyiv|zelensky|donbass|crimée|crimea/i],
     themes:['Effets en cascade sur prix céréales','Mobilisation Wagner depuis l\'Afrique','Impact sur soutien occidental à l\'Afrique'],
     questions:['Fin de guerre = retour Wagner en force au Sahel ?','Engagement BF dans une éventuelle médiation ?']},
    {id:'middle_east', cat:'theatre', label:'Théâtre Moyen-Orient', icon:'🕊️', color:'#a855f7', level:'systémique',
     patterns:[/(israël|israel|palestine|gaza|cisjordanie|hamas|hezbollah|iran|liban|lebanon|yémen|yemen|houthis|syrie|syria)/i],
     themes:['Houthis et corridor maritime mer Rouge','Iran-AES : axe émergent','Impact narratif Gaza sur l\'opinion sahélienne'],
     questions:['BF doit-il prendre position sur Gaza ?','Conséquences fermeture mer Rouge sur exports BF ?']},
    {id:'china_taiwan', cat:'theatre', label:'Théâtre Indo-Pacifique', icon:'🌊', color:'#dc2626', level:'systémique',
     patterns:[/(taïwan|taiwan|détroit|indo[- ]?pacific|aukus|quad|philippines|mer de chine)/i],
     themes:['Effets d\'une crise Taïwan sur l\'attention US','Concurrence semiconducteurs et terres rares','Reconfiguration des alliances Sud global'],
     questions:['Crise Taïwan = fenêtre AES pour Pékin ?']},
    {id:'sudan_horn', cat:'theatre', label:'Théâtre Soudan/Corne', icon:'🌅', color:'#dc2626', level:'proximité',
     patterns:[/(soudan|sudan|fsr|burhan|hemedti|hemeti|darfour|darfur|tigré|tigray|éthiopie|ethiopia|érythrée|eritrea|somalie|somalia|al[- ]?shabaab)/i],
     themes:['Risque déstabilisation Tchad par contagion','Réseaux d\'or Soudan-EAU et impact BF','Modèle FSR vs JNIM'],
     questions:['Capacité d\'absorption Tchad de réfugiés ?','Risque embrasement bassin tchadien ?']},
    {id:'lake_chad', cat:'theatre', label:'Théâtre bassin Tchad', icon:'🐊', color:'#ef4444', level:'proximité',
     patterns:[/(boko haram|iswap|lac tchad|lake chad|extrême[- ]?nord|borno|adamawa|diffa)/i],
     themes:['Articulation ISWAP-EIGS','Coopération BF-Tchad-Niger','Modèle FMM (Force multinationale mixte)'],
     questions:['Conflit Tchadien = ouverture frontière nord BF ?']},
    {id:'libya_chaos', cat:'theatre', label:'Théâtre libyen', icon:'🏜️', color:'#f97316', level:'proximité',
     patterns:[/libye|libya|haftar|tripoli|benghazi|misrata|sebha/i],
     themes:['Stabilisation libyenne et flux Sahel','Présence Wagner en Libye et lien Sahel','Migrations subsahariennes'],
     questions:['Réunification libyenne = baisse trafics armes ?']}
  ];

  function detectChannels(item){
    const txt = ((item.title||'')+' '+(item.description||'')).toLowerCase();
    const matched = [];
    for(const ch of IMPACT_CHANNELS){
      for(const p of ch.patterns){
        if(p.test(txt)){ matched.push(ch.id); break; }
      }
    }
    return matched;
  }

  function aggregateChannels(items){
    const agg = {};
    IMPACT_CHANNELS.forEach(ch=>{ agg[ch.id] = {channel:ch, count:0, items:[]}; });
    items.forEach(it=>{
      detectChannels(it).forEach(cid=>{
        if(agg[cid]){ agg[cid].count++; agg[cid].items.push(it); }
      });
    });
    return agg;
  }

  /* ===== RENDU PAGE "VEILLE IMPACT BF" ===== */
  function renderImpactRadar(){
    const el = document.getElementById('impact-content'); if(!el) return;
    const items = (window.NEWS_STATE?.items)||[];
    const week = items.filter(it=>it.pubDate && (Date.now()-new Date(it.pubDate))/86400000 < 7);
    const agg = aggregateChannels(week);

    // Catégories
    const CATS = {
      security:{label:'Sécuritaire',color:'#ef4444',icon:'fa-shield-halved'},
      diplo:{label:'Diplomatique',color:'#a855f7',icon:'fa-handshake'},
      eco:{label:'Économique',color:'#eab308',icon:'fa-coins'},
      socio:{label:'Sociopolitique',color:'#06b6d4',icon:'fa-users'},
      strat:{label:'Ruptures stratégiques',color:'#3b82f6',icon:'fa-bolt'},
      theatre:{label:'Théâtres majeurs',color:'#22c55e',icon:'fa-globe'}
    };

    // Score d'exposition par catégorie
    const catScore = {};
    Object.keys(CATS).forEach(k=>catScore[k]={count:0, channels:0});
    Object.values(agg).forEach(a=>{
      catScore[a.channel.cat].count += a.count;
      if(a.count>0) catScore[a.channel.cat].channels++;
    });

    // Niveau d'impact (colonnes)
    const LEVEL_META = {
      direct:{label:'IMPACT DIRECT',desc:'Affecte directement le BF',color:'#ef4444'},
      proximité:{label:'PROXIMITÉ',desc:'Affecte les voisins ou alliés',color:'#f97316'},
      systémique:{label:'SYSTÉMIQUE',desc:'Affecte l\'environnement global',color:'#3b82f6'},
      indirect:{label:'INDIRECT',desc:'Effet de second ordre',color:'#a78bfa'}
    };

    const totalActive = Object.values(agg).filter(a=>a.count>0).length;
    const totalArt = week.length;

    // Top 5 canaux
    const topChannels = Object.values(agg).filter(a=>a.count>0).sort((a,b)=>b.count-a.count).slice(0,5);

    el.innerHTML = `
      <!-- BANDEAU -->
      <div class="card" style="margin:0 0 14px;background:linear-gradient(135deg,#0c1426 0%,#08101e 100%);border-color:#1a2340">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">
          <div>
            <div style="font-size:.66rem;color:#fde047;letter-spacing:3px;text-transform:uppercase;font-weight:800">⚡ Veille Impact Burkina Faso</div>
            <div style="font-size:1.2rem;color:#e2e8f0;font-weight:700;margin-top:3px">Cartographie temps réel des dynamiques mondiales affectant le BF</div>
            <div style="font-size:.74rem;color:#64748b;margin-top:3px">${IMPACT_CHANNELS.length} canaux scrutés · ${totalActive} actifs · ${totalArt} articles agrégés (7 jours)</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-top:14px">
          ${Object.entries(CATS).map(([k,m])=>{
            const score = catScore[k];
            return `<div style="background:#0a0f1c;border-left:3px solid ${m.color};padding:9px 11px;border-radius:0 5px 5px 0">
              <div style="font-size:.62rem;color:${m.color};letter-spacing:.5px;text-transform:uppercase;font-weight:700">${m.label}</div>
              <div style="display:flex;align-items:flex-end;gap:5px;margin-top:3px">
                <div style="font-size:1.4rem;color:${m.color};font-weight:800">${score.count}</div>
                <div style="font-size:.66rem;color:#94a3b8;padding-bottom:5px">articles</div>
              </div>
              <div style="font-size:.65rem;color:#64748b">${score.channels} canaux actifs</div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- TOP 5 SIGNAUX FORTS -->
      ${topChannels.length ? `<div class="card" style="margin:0 0 14px">
        <div class="card-hd"><h2><i class="fa-solid fa-fire"></i>Signaux forts cette semaine</h2><div class="help">Top 5 canaux d'impact les plus actifs · 7 jours glissants</div></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">
          ${topChannels.map((a,rank)=>{
            const ch = a.channel;
            const lvl = LEVEL_META[ch.level];
            return `<div style="background:#0a0f1c;border:1px solid #1a2340;border-top:4px solid ${ch.color};border-radius:6px;padding:12px;cursor:pointer" onclick="document.getElementById('imp-ch-${ch.id}')?.scrollIntoView({behavior:'smooth',block:'start'})">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
                <span style="font-size:1.5rem">${ch.icon}</span>
                <div style="text-align:right">
                  <div style="font-size:1.6rem;color:${ch.color};font-weight:800;line-height:1">${a.count}</div>
                  <div style="font-size:.62rem;color:#64748b">articles</div>
                </div>
              </div>
              <div style="font-size:.85rem;color:#e2e8f0;font-weight:700;margin-bottom:3px">${ch.label}</div>
              <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:6px">
                <span class="chip" style="background:${lvl.color}22;color:${lvl.color};border:1px solid ${lvl.color}55;font-size:.6rem;font-weight:700">${lvl.label}</span>
                <span class="chip gray" style="font-size:.6rem">#${rank+1}</span>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>` : ''}

      <!-- VUE COMPLÈTE PAR CATÉGORIE -->
      ${Object.entries(CATS).map(([catKey,catMeta])=>{
        const catChannels = Object.values(agg).filter(a=>a.channel.cat===catKey).sort((a,b)=>b.count-a.count);
        if(!catChannels.length) return '';
        return `<div class="card" style="margin:0 0 14px;border-left:4px solid ${catMeta.color}">
          <div class="card-hd"><h2 style="color:${catMeta.color}"><i class="fa-solid ${catMeta.icon}"></i>${catMeta.label}</h2><span style="font-size:.74rem;color:#64748b">${catChannels.filter(a=>a.count>0).length}/${catChannels.length} canaux actifs</span></div>
          ${catChannels.map(a=>{
            const ch = a.channel;
            const lvl = LEVEL_META[ch.level];
            const isActive = a.count>0;
            return `<div id="imp-ch-${ch.id}" style="background:${isActive?'#0a0f1c':'rgba(10,15,28,.4)'};border:1px solid ${isActive?'#1a2340':'#0c1426'};border-left:3px solid ${isActive?ch.color:'#1a2340'};border-radius:5px;padding:11px 13px;margin-bottom:8px;${isActive?'':'opacity:.45'}">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:7px">
                <div style="flex:1;min-width:200px">
                  <div style="font-size:.95rem;color:#e2e8f0;font-weight:700"><span style="margin-right:5px">${ch.icon}</span>${ch.label}</div>
                  <div style="font-size:.66rem;color:${lvl.color};font-weight:700;letter-spacing:.5px;margin-top:2px">${lvl.label} · ${lvl.desc}</div>
                </div>
                <div style="text-align:right">
                  <div style="font-size:1.3rem;color:${isActive?ch.color:'#64748b'};font-weight:800">${a.count}</div>
                  <div style="font-size:.62rem;color:#64748b">article${a.count>1?'s':''} · 7 j</div>
                </div>
              </div>
              ${isActive ? `
                <!-- Articles détectés -->
                <details style="margin-top:7px"><summary style="cursor:pointer;font-size:.72rem;color:#60a5fa;font-weight:600">Voir les articles détectés (${a.count})</summary>
                  <div style="margin-top:7px;max-height:180px;overflow-y:auto;border-left:2px solid ${ch.color}55;padding-left:8px">
                    ${a.items.slice(0,8).map(it=>`<a href="${it.link||'#'}" target="_blank" rel="noopener" style="display:block;padding:4px 0;border-bottom:1px solid #141c30;font-size:.74rem;color:#cbd5e1;text-decoration:none">${reliabilityChip(it,{compact:true})} <span style="color:#94a3b8;font-size:.66rem">${it._source||'—'}</span> ${(it.title||'').slice(0,140)}</a>`).join('')}
                    ${a.items.length>8?`<div style="font-size:.66rem;color:#64748b;padding:5px 0">+ ${a.items.length-8} autres</div>`:''}
                  </div>
                </details>
                <!-- Thèmes de recherche -->
                <div style="background:rgba(96,165,250,.05);border:1px solid rgba(96,165,250,.2);border-radius:4px;padding:8px 10px;margin-top:8px">
                  <div style="font-size:.62rem;color:#60a5fa;text-transform:uppercase;letter-spacing:.5px;font-weight:700;margin-bottom:4px"><i class="fa-solid fa-lightbulb"></i> Thèmes de recherche suggérés</div>
                  ${ch.themes.map(t=>`<div style="font-size:.74rem;color:#cbd5e1;padding:2px 0;line-height:1.4">▸ ${t}</div>`).join('')}
                </div>
                <!-- Questions analytiques -->
                <div style="background:rgba(253,224,71,.04);border:1px solid rgba(253,224,71,.2);border-radius:4px;padding:8px 10px;margin-top:5px">
                  <div style="font-size:.62rem;color:#fde047;text-transform:uppercase;letter-spacing:.5px;font-weight:700;margin-bottom:4px"><i class="fa-solid fa-circle-question"></i> Questions à creuser</div>
                  ${ch.questions.map(q=>`<div style="font-size:.74rem;color:#cbd5e1;padding:2px 0;line-height:1.4">→ ${q}</div>`).join('')}
                </div>
              ` : `<div style="font-size:.7rem;color:#64748b;font-style:italic">Aucun signal détecté cette semaine — canal en veille</div>`}
            </div>`;
          }).join('')}
        </div>`;
      }).join('')}

      <!-- PIED -->
      <div style="margin-top:14px;padding:10px 14px;background:rgba(96,165,250,.04);border:1px solid rgba(96,165,250,.15);border-radius:6px;font-size:.7rem;color:#64748b;line-height:1.5;text-align:center">
        <b style="color:#94a3b8">Méthodologie :</b> détection par signatures lexicales (regex) sur ${IMPACT_CHANNELS.length} canaux · classification par catégorie + niveau d'impact · thèmes et questions construits à partir de la doctrine d'analyse think-tank · mise à jour à chaque collecte RSS.
      </div>`;
  }

  /* ===== EXPORT BQS — VERSION WORD (.doc) ===== */
  function exportBQSDOCX(bqs){
    bqs = bqs || buildBQS();
    const dateStr = bqs.date.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    const timeStr = bqs.date.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
    const ims = bqs.ims;

    const css = `<style>
      body{font-family:'Calibri',Arial,sans-serif;font-size:11pt;color:#222;line-height:1.5;margin:1.5cm}
      h1{font-size:22pt;color:#0a3d62;border-bottom:3px solid #0a3d62;padding-bottom:6pt;margin:0 0 10pt 0}
      h2{font-size:14pt;color:#a52e2e;border-bottom:1px solid #a52e2e;margin-top:16pt;padding-bottom:3pt}
      h3{font-size:12pt;color:#1e40af;margin-top:8pt}
      .meta{color:#666;font-style:italic;font-size:10pt}
      .ims-box{display:table;width:100%;background:#f0f4f8;border-left:5px solid ${ims.color};padding:10pt 14pt;margin:10pt 0}
      .ims-num{font-size:32pt;color:${ims.color};font-weight:bold;line-height:1}
      .ims-lbl{font-size:11pt;color:#444;font-weight:bold}
      table{width:100%;border-collapse:collapse;margin:8pt 0}
      th{background:#0a3d62;color:#fff;text-align:left;padding:6pt;font-size:10pt}
      td{border:1px solid #ccc;padding:6pt;font-size:10pt;vertical-align:top}
      .top5{background:#f8fafc;border:1px solid #cbd5e1;border-left:4px solid ${ims.color};padding:10pt 14pt;margin:8pt 0;page-break-inside:avoid}
      .top5-num{color:${ims.color};font-weight:bold;font-size:13pt}
      .top5-title{font-weight:bold;font-size:12pt;color:#1a1a1a}
      .top5-meta{color:#666;font-size:9pt;margin:4pt 0}
      .impl{background:#fef3c7;border-left:4px solid #d97706;padding:8pt 12pt;margin:6pt 0}
      .indic{background:#eff6ff;border-left:4px solid #2563eb;padding:6pt 12pt;margin:4pt 0;font-size:10.5pt}
      .reliab{display:inline-block;font-family:'Courier New',monospace;font-weight:bold;padding:1pt 5pt;background:#ddd;color:#333;border-radius:2pt;font-size:9pt}
      .footer{margin-top:24pt;padding-top:8pt;border-top:1px solid #ccc;color:#666;font-size:9pt;font-style:italic;text-align:center}
      .bar{display:inline-block;height:8pt;background:#ddd;margin-right:4pt;vertical-align:middle;width:40%}
      .bar-fill{display:inline-block;height:8pt;background:#a52e2e}
    </style>`;

    let html = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><title>Brief Quotidien Stratégique — ${bqs.date.toLocaleDateString('fr-FR')}</title>${css}</head><body>`;

    // EN-TÊTE
    html += `<h1>Brief Quotidien Stratégique</h1>
      <p class="meta">GéoWatch — Cycle de veille automatisé • <span style="text-transform:capitalize">${dateStr}</span> à ${timeStr} • Document à diffusion restreinte</p>`;

    // BANDEAU IMS
    html += `<div class="ims-box">
      <div style="display:table-cell;width:30%;vertical-align:middle">
        <div class="ims-num">${ims.score}<span style="font-size:14pt;color:#666">/100</span></div>
        <div class="ims-lbl" style="color:${ims.color}">${ims.level}</div>
      </div>
      <div style="display:table-cell;vertical-align:middle">
        <b>Indice de Menace Stratégique — Burkina Faso</b><br>
        <span class="meta">Calcul pondéré sur ${ims.dataPoints} articles · fenêtre ${ims.window}</span><br>
        <span style="font-size:10pt">Articles 24h : <b>${bqs.stats.articles24}</b> · Pertinents BF : <b style="color:#d97706">${bqs.stats.bf24}</b> · Couverture occidentale : <b style="color:#a52e2e">${bqs.stats.adversarial}</b></span>
      </div>
    </div>`;

    // RÉSUMÉ EXÉCUTIF
    html += `<h2>Résumé exécutif (BLUF)</h2>`;
    const bluf = `IMS-BF du jour : <b style="color:${ims.color}">${ims.score}/100 (${ims.level})</b>. ${bqs.stats.articles24} articles agrégés (${bqs.stats.bf24} pertinents BF, ${bqs.stats.adversarial} à analyser côté occidental). ${bqs.top5.length>0?'Le développement principal porte sur : <i>«&nbsp;'+(bqs.top5[0].title||'').slice(0,180)+'&nbsp;»</i>.':''}`;
    html += `<p>${bluf}</p>`;

    // DÉCOMPOSITION IMS
    html += `<h2>Décomposition de l'indice de menace</h2><table>
      <tr><th>Dimension</th><th>Poids</th><th>Score</th><th>Signaux</th><th>Visualisation</th></tr>`;
    Object.values(ims.dimensions).forEach(d=>{
      const dCol = d.score>=70?'#dc2626':d.score>=50?'#f97316':d.score>=30?'#f59e0b':d.score>=15?'#eab308':'#22c55e';
      html += `<tr><td><b>${d.label}</b></td><td>${d.weight}%</td><td><b style="color:${dCol}">${d.score}/100</b></td><td>${d.count}</td><td><span class="bar"><span class="bar-fill" style="width:${d.score}%;background:${dCol}"></span></span></td></tr>`;
    });
    html += `</table>`;

    // TOP 5
    html += `<h2>Top 5 développements stratégiques (24 h)</h2>`;
    if(bqs.top5.length){
      bqs.top5.forEach((it,i)=>{
        const block = classifyBlock(it);
        const blockMeta = BLOCKS[block] || {label:'Non classé',flag:''};
        const L = reliabilityLetter(it), N = credibilityNum(it);
        const impl = bqs.implications[i] || [];
        const date = it.pubDate ? new Date(it.pubDate).toLocaleString('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '';
        html += `<div class="top5">
          <div class="top5-num">${i+1}.</div>
          <div class="top5-title">${it.title||'(sans titre)'}</div>
          <div class="top5-meta">
            <span class="reliab">[${L}${N}]</span>
            ${blockMeta.flag} ${blockMeta.label} · ${it._source||'—'} · ${date}
          </div>
          ${it.description?`<p style="color:#444;font-size:10.5pt">${(it.description||'').slice(0,300)}${(it.description||'').length>300?'…':''}</p>`:''}
          <div class="impl">
            <b style="color:#92400e">Implications Burkina Faso :</b>
            ${impl.map(l=>`<div>→ ${l}</div>`).join('')}
          </div>
          ${it.link?`<p style="font-size:9pt;color:#3b82f6"><a href="${it.link}">${it.link}</a></p>`:''}
        </div>`;
      });
    } else {
      html += `<p class="meta">Aucun article à fort enjeu n'a été détecté sur la période. Les flux RSS sont peut-être en cours de chargement.</p>`;
    }

    // INDICATEURS
    html += `<h2>Indicateurs à surveiller (J+1 → J+7)</h2>`;
    bqs.indicators.forEach(ind=>{
      html += `<div class="indic">▸ ${ind.replace(/^[🔴🟠🟡🟢]\s*/,'')}</div>`;
    });

    // PIED
    html += `<div class="footer">GéoWatch — Cycle de veille automatisé · Cotes de fiabilité standard OTAN (A1–F6) · Document généré à partir de ${bqs.stats.articles24} sources internationales · Méthodologie : IMS = 0,25·Sécuritaire + 0,20·Diplo + 0,20·Éco + 0,15·Cohésion + 0,10·Régional + 0,10·Info</div>`;

    html += `</body></html>`;

    const blob = new Blob(['﻿', html], {type:'application/msword'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`BQS_${bqs.date.toISOString().slice(0,10)}.doc`; a.click();
    toast('Brief Quotidien exporté en Word','success');
  }

  // Public API
  return {
    BLOCKS, classifyBlock,
    RELIABILITY_LETTER, CREDIBILITY_NUM, SOURCE_RATING,
    reliabilityLetter, credibilityNum, reliabilityChip,
    computeIMS, pushIMSHistory, getIMSHistory, renderIMSGauge,
    buildBQS, renderBQS, exportBQSPDF, exportBQSDOCX,
    renderAdversarial,
    IMPACT_CHANNELS, detectChannels, aggregateChannels, renderImpactRadar
  };
})();

// Exposer renderBQS, renderAdversarial et renderImpactRadar pour le Router
function renderBQS(){ GW_INTEL.renderBQS(); }
function renderAdversarial(){ GW_INTEL.renderAdversarial(); }
function renderImpactRadar(){ GW_INTEL.renderImpactRadar(); }

/* ============= GEOINTEL — fusion compagnon ============= */
function renderGeoIntel(){
  // Bind du bouton recharger (au cas où)
  const reloadBtn = document.getElementById('geointel-reload');
  const iframe = document.getElementById('geointel-iframe');
  if(reloadBtn && iframe && !reloadBtn._gwBound){
    reloadBtn._gwBound = true;
    reloadBtn.onclick = ()=>{ iframe.src = iframe.src; toast('GeoIntel rechargé','info'); };
  }
}

/* ==========================================================================
   ===== GW_DEPTH : PROFONDEUR ANALYTIQUE INTÉGRÉE =====
   ==========================================================================
   Module qui injecte des couches profondes dans chaque section :
   - Articles RSS récents par conflit (citations live)
   - Détection des déclencheurs activés
   - Statut live des indicateurs (allumé/calme)
   - Cross-références automatiques entre sections
   - Questions de recherche spécifiques
   - Actions opérationnelles concrètes pour le BF
   ========================================================================== */
const GW_DEPTH = (()=>{

  /* ===== Articles RSS pertinents pour un conflit, fenêtre N jours ===== */
  function getConflictArticles(conflictId, days=7){
    const items = (window.NEWS_STATE?.items)||[];
    const now = Date.now();
    return items.filter(it=>{
      if(!it.pubDate) return false;
      if((now-new Date(it.pubDate))/86400000 > days) return false;
      return (it._conflicts||[]).some(c=>c.id===conflictId);
    }).sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate));
  }

  /* ===== Détection live des déclencheurs d'un conflit ===== */
  // Pour chaque indicateur 24-72h ou 7-30j d'un conflit, on cherche s'il a un correspondant RSS
  function detectActiveSignals(c){
    const signals = [];
    const articles = getConflictArticles(c.id, 7);
    const articles24 = getConflictArticles(c.id, 1);

    // Indicateur 24-72h
    if(c.brief_analyste?.indicateurs_24_72h){
      const text = c.brief_analyste.indicateurs_24_72h.toLowerCase();
      const keywords = extractKeywords(text);
      const matched = articles24.filter(a=>keywords.some(k=>((a.title||'')+' '+(a.description||'')).toLowerCase().includes(k)));
      signals.push({
        horizon: '24-72 h',
        text: c.brief_analyste.indicateurs_24_72h,
        status: matched.length>0 ? 'activated' : articles24.length>2 ? 'monitoring' : 'quiet',
        articles: matched.slice(0,3),
        articleCount: matched.length,
        color: '#ef4444'
      });
    }
    // Indicateur 7-30j
    if(c.brief_analyste?.indicateurs_7_30j){
      const text = c.brief_analyste.indicateurs_7_30j.toLowerCase();
      const keywords = extractKeywords(text);
      const matched = articles.filter(a=>keywords.some(k=>((a.title||'')+' '+(a.description||'')).toLowerCase().includes(k)));
      signals.push({
        horizon: '7-30 j',
        text: c.brief_analyste.indicateurs_7_30j,
        status: matched.length>=3 ? 'activated' : matched.length>0 ? 'monitoring' : 'quiet',
        articles: matched.slice(0,3),
        articleCount: matched.length,
        color: '#60a5fa'
      });
    }
    return signals;
  }

  /* ===== Extraction de mots-clés depuis un texte d'indicateur ===== */
  function extractKeywords(text){
    // Garder mots de plus de 4 lettres, sans accents, sans stopwords
    const stopwords = new Set(['avec','dans','pour','vers','sans','sous','entre','aussi','plus','très','tout','tous','toutes','leur','leurs','celui','celle','cette','sont','être','avoir','faire','peut','doit','tout','depuis','également','également','jusqu\'à']);
    return text.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g,'')
      .replace(/[^a-z0-9\s]/g,' ')
      .split(/\s+/)
      .filter(w=>w.length>=5 && !stopwords.has(w))
      .slice(0,12);
  }

  /* ===== Détection des scénarios à déclencheurs activés ===== */
  function detectScenarioTriggers(c){
    if(!c.scenarios) return [];
    const articles = getConflictArticles(c.id, 14);
    return c.scenarios.map(s=>{
      const keywords = extractKeywords((s.nom||'')+' '+(s.d||''));
      const matched = articles.filter(a=>{
        const txt = ((a.title||'')+' '+(a.description||'')).toLowerCase();
        return keywords.filter(k=>txt.includes(k)).length>=2;
      });
      const triggerStatus = matched.length>=3 ? 'activated' : matched.length>0 ? 'partial' : 'dormant';
      return {scenario:s, articles:matched.slice(0,3), articleCount:matched.length, triggerStatus};
    });
  }

  /* ===== Sources qui ont mentionné le conflit récemment ===== */
  function getRecentSources(conflictId, days=7){
    const articles = getConflictArticles(conflictId, days);
    const sources = {};
    articles.forEach(a=>{
      const src = a._source||'inconnue';
      if(!sources[src]) sources[src] = {count:0, latest:a.pubDate};
      sources[src].count++;
      if(new Date(a.pubDate)>new Date(sources[src].latest)) sources[src].latest = a.pubDate;
    });
    return Object.entries(sources)
      .map(([name, data])=>({name, ...data}))
      .sort((a,b)=>b.count-a.count);
  }

  /* ===== Helper : badge de statut d'un signal ===== */
  function statusBadge(status){
    const meta = {
      activated: {label:'🔴 ACTIVÉ', color:'#ef4444', desc:'Signal allumé maintenant'},
      monitoring: {label:'🟡 EN COURS', color:'#f59e0b', desc:'Signal partiellement détecté'},
      quiet: {label:'⚪ CALME', color:'#64748b', desc:'Aucun signal détecté'},
      partial: {label:'🟡 PARTIEL', color:'#f59e0b', desc:'Quelques articles détectés'},
      dormant: {label:'⚪ DORMANT', color:'#64748b', desc:'Aucun déclencheur'}
    };
    const m = meta[status] || meta.quiet;
    return `<span class="chip" style="background:${m.color}22;color:${m.color};border:1px solid ${m.color}66;font-weight:800;font-size:.66rem;letter-spacing:.5px" title="${m.desc}">${m.label}</span>`;
  }

  /* ===== Affichage compact d'un article ===== */
  function articleLine(a, opts={}){
    if(!a) return '';
    const titleMax = opts.titleMax || 140;
    const date = a.pubDate ? new Date(a.pubDate).toLocaleString('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '';
    const src = a._source||'—';
    const reliab = (typeof GW_INTEL!=='undefined') ? GW_INTEL.reliabilityChip(a,{compact:true}) : '';
    const title = (a.title||'').slice(0,titleMax);
    const ellipsis = (a.title||'').length>titleMax ? '…' : '';
    return `<a href="${a.link||'#'}" target="_blank" rel="noopener" style="display:block;padding:6px 9px;border-bottom:1px solid #141c30;font-size:.74rem;color:#cbd5e1;text-decoration:none;line-height:1.4">
      <div style="display:flex;gap:6px;align-items:center;margin-bottom:2px;flex-wrap:wrap">
        ${reliab}
        <span style="color:#94a3b8;font-size:.66rem">${src}</span>
        <span style="color:#64748b;font-size:.62rem">· ${date}</span>
      </div>
      <div>${title}${ellipsis}</div>
    </a>`;
  }

  /* ===== Génération de questions de recherche par conflit ===== */
  function getResearchAngles(c){
    const angles = [];
    if(c.region?.toLowerCase().includes('afrique')){
      angles.push(`Comment l'évolution de ${c.short||c.name} affecte-t-elle l'équilibre régional ouest-africain ?`);
    }
    if(c.actors_etat?.some(a=>/wagner|russie/i.test(a))){
      angles.push(`Quelle est la trajectoire de l'engagement russe dans ${c.region} et ses limites soutenables ?`);
    }
    if(c.actors_non_etat?.some(a=>/jnim|eigs|aqim|daesh/i.test(a))){
      angles.push(`Comment évoluent les modes opératoires des groupes armés non étatiques ?`);
      angles.push(`Quels signaux d'extension territoriale sont observables ?`);
    }
    if(c.intensity>=7){
      angles.push(`Quelles sont les conditions matérielles d'une désescalade dans ce conflit ?`);
    }
    if(c.scenarios?.length){
      angles.push(`Quels indicateurs précoces permettraient de discriminer entre les scénarios projetés ?`);
    }
    angles.push(`Quel impact direct ${c.short||c.name} a-t-il sur les politiques publiques burkinabè à 6 mois ?`);
    return angles;
  }

  /* ===== Actions opérationnelles BF concrètes ===== */
  function getOperationalActions(c){
    const actions = [];
    const i = c.impact_bf;
    if(c.intensity>=7){
      actions.push({prio:'urgent', icon:'fa-bolt', text:'Mettre à jour la matrice de risques nationale (volet sécuritaire)'});
    }
    if(i?.economique?.length){
      actions.push({prio:'haute', icon:'fa-chart-line', text:'Mettre en place une veille économique sur les indicateurs (or, coton, F CFA, dette)'});
    }
    if(i?.diplomatique?.length){
      actions.push({prio:'haute', icon:'fa-handshake', text:'Préparer position diplomatique du Burkina Faso sur ce dossier'});
    }
    if(i?.securitaire?.length){
      actions.push({prio:'urgent', icon:'fa-shield-halved', text:'Évaluation des points de friction frontaliers et capacités de riposte'});
    }
    actions.push({prio:'moyenne', icon:'fa-binoculars', text:'Cycle de monitoring hebdomadaire des indicateurs identifiés'});
    actions.push({prio:'moyenne', icon:'fa-file-circle-check', text:'Note de situation actualisée mensuellement'});
    return actions;
  }

  /* ===== Cross-references vers autres pages ===== */
  function crossRefBlock(c){
    return `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
      <button class="btn ghost sm" onclick="Router.go('briefs');setTimeout(()=>{const s=document.getElementById('brief-conflict');if(s){s.value='${c.id}';renderBriefs();}},80)"><i class="fa-solid fa-bullseye"></i> Brief 2 couches</button>
      <button class="btn ghost sm" onclick="Router.go('scenarios');setTimeout(()=>{const s=document.getElementById('scen-conflict');if(s){s.value='${c.id}';renderScenarios();}},80)"><i class="fa-solid fa-chess"></i> Scénarios</button>
      <button class="btn ghost sm" onclick="Router.go('indicators')"><i class="fa-solid fa-binoculars"></i> Indicateurs</button>
      <button class="btn ghost sm" onclick="Router.go('impact_bf');setTimeout(()=>{const s=document.getElementById('bf-conflict');if(s){s.value='${c.id}';renderImpactBF();}},80)"><i class="fa-solid fa-flag-checkered" style="color:#fde047"></i> Impact BF</button>
      <button class="btn ghost sm" onclick="showConflictDetail('${c.id}')"><i class="fa-solid fa-circle-info"></i> Fiche complète</button>
      <button class="btn ghost sm" onclick="Router.go('geointel')" style="color:#86efac"><i class="fa-solid fa-globe"></i> Carte GeoIntel</button>
    </div>`;
  }

  /* ===== Bloc "Articles RSS récents pour ce conflit" ===== */
  function recentArticlesBlock(conflictId, days=7, max=5){
    const articles = getConflictArticles(conflictId, days);
    if(!articles.length) return `<div style="background:#0a0f1c;border:1px dashed #1a2340;border-radius:5px;padding:11px 14px;font-size:.78rem;color:#64748b;font-style:italic">Aucun article RSS pertinent dans les ${days} derniers jours pour ce conflit. Les sources sont peut-être en cours de chargement, ou ce conflit ne fait pas l'actualité immédiate.</div>`;
    const sources = getRecentSources(conflictId, days);
    return `<div style="background:#0a0f1c;border:1px solid #1a2340;border-radius:6px;padding:11px 13px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;flex-wrap:wrap;gap:8px">
        <div style="font-size:.7rem;color:#86efac;text-transform:uppercase;letter-spacing:1px;font-weight:700"><i class="fa-solid fa-broadcast-tower"></i> Articles RSS récents (${days} j) <span style="font-weight:400;color:#64748b">— ${articles.length} trouvés</span></div>
        <div style="font-size:.66rem;color:#94a3b8">${sources.length} sources distinctes : ${sources.slice(0,3).map(s=>`<b style="color:#cbd5e1">${s.name}</b> (${s.count})`).join(' · ')}${sources.length>3?` <span style="color:#64748b">+${sources.length-3}</span>`:''}</div>
      </div>
      <div>
        ${articles.slice(0,max).map(a=>articleLine(a)).join('')}
        ${articles.length>max?`<div style="font-size:.66rem;color:#64748b;padding:5px 9px;font-style:italic">+ ${articles.length-max} autres articles disponibles</div>`:''}
      </div>
    </div>`;
  }

  /* ===== Bloc "Statut live des indicateurs" pour un conflit ===== */
  function liveSignalsBlock(c){
    const signals = detectActiveSignals(c);
    if(!signals.length) return '';
    return `<div style="background:#0a0f1c;border:1px solid #1a2340;border-radius:6px;padding:11px 13px">
      <div style="font-size:.7rem;color:#fde047;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:8px"><i class="fa-solid fa-radar" style="color:#fde047"></i> Statut live des signaux (croisement RSS automatique)</div>
      ${signals.map(s=>`<div style="background:#141c30;border-left:3px solid ${s.color};border-radius:0 5px 5px 0;padding:9px 11px;margin-bottom:7px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap;margin-bottom:5px">
          <span style="font-size:.7rem;color:${s.color};text-transform:uppercase;letter-spacing:1px;font-weight:800">${s.horizon}</span>
          ${statusBadge(s.status)}
        </div>
        <div style="font-size:.78rem;color:#cbd5e1;line-height:1.5;margin-bottom:5px">${s.text}</div>
        ${s.articleCount>0 ? `
          <details style="margin-top:5px">
            <summary style="cursor:pointer;font-size:.7rem;color:#60a5fa;font-weight:600">Voir ${s.articleCount} article${s.articleCount>1?'s':''} qui ${s.articleCount>1?'confirment':'confirme'} ce signal</summary>
            <div style="margin-top:4px">${s.articles.map(a=>articleLine(a)).join('')}</div>
          </details>` : `<div style="font-size:.7rem;color:#64748b;font-style:italic;margin-top:3px">Aucune corroboration RSS pour le moment — surveillance passive</div>`}
      </div>`).join('')}
    </div>`;
  }

  /* ===== Bloc "Questions de recherche" ===== */
  function researchAnglesBlock(c){
    const angles = getResearchAngles(c);
    if(!angles.length) return '';
    return `<div style="background:rgba(96,165,250,.05);border:1px solid rgba(96,165,250,.2);border-radius:6px;padding:11px 13px">
      <div style="font-size:.7rem;color:#60a5fa;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:7px"><i class="fa-solid fa-lightbulb"></i> Pistes de recherche analytique pour ce conflit</div>
      ${angles.map((q,i)=>`<div style="font-size:.78rem;color:#cbd5e1;padding:4px 0;line-height:1.5;border-bottom:1px solid #141c30"><span style="color:#60a5fa;font-weight:700">Q${i+1}.</span> ${q}</div>`).join('')}
    </div>`;
  }

  /* ===== Bloc "Actions opérationnelles BF" ===== */
  function actionsBlock(c){
    const actions = getOperationalActions(c);
    if(!actions.length) return '';
    const prioCol = {urgent:'#ef4444',haute:'#f97316',moyenne:'#fde047'};
    return `<div style="background:rgba(253,224,71,.04);border:1px solid rgba(253,224,71,.2);border-radius:6px;padding:11px 13px">
      <div style="font-size:.7rem;color:#fde047;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:8px"><i class="fa-solid fa-list-check"></i> Actions opérationnelles recommandées (volet Burkina Faso)</div>
      ${actions.map(a=>`<div style="display:flex;align-items:center;gap:9px;padding:5px 0;border-bottom:1px solid #141c30">
        <i class="fa-solid ${a.icon}" style="color:${prioCol[a.prio]||'#94a3b8'};font-size:.92rem;width:18px;text-align:center"></i>
        <span class="chip" style="background:${prioCol[a.prio]}22;color:${prioCol[a.prio]};border:1px solid ${prioCol[a.prio]}55;font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.5px;flex-shrink:0">${a.prio}</span>
        <span style="font-size:.78rem;color:#cbd5e1;line-height:1.4">${a.text}</span>
      </div>`).join('')}
    </div>`;
  }

  return {
    getConflictArticles, getRecentSources,
    detectActiveSignals, detectScenarioTriggers,
    getResearchAngles, getOperationalActions,
    statusBadge, articleLine,
    crossRefBlock, recentArticlesBlock, liveSignalsBlock,
    researchAnglesBlock, actionsBlock
  };
})();

/* ============= SYNTHÈSE DU JOUR (bandeau "À retenir") =============
   Génère en haut du dashboard une synthèse en 2 lignes accessibles à tous :
   - Tendance globale (calme / tendu / critique)
   - Top sujet du jour (avec lien direct)
   - Recommandation d'action immédiate
   ============================================================== */
function renderDashSynthese(){
  const dash = document.querySelector('section[data-page="dash"]');
  if(!dash) return;
  let synth = document.getElementById('dash-synthese');
  if(!synth){
    synth = document.createElement('div');
    synth.id = 'dash-synthese';
    synth.style.cssText = 'margin-bottom:14px';
    dash.insertBefore(synth, dash.firstChild);
  }

  const items = (window.NEWS_STATE?.items)||[];
  const items24 = items.filter(it=>it.pubDate && (Date.now()-new Date(it.pubDate))/3600000 < 24);
  const bf24 = items24.filter(it=>it._bf);
  const majors24 = items24.filter(it=>(it._majors||[]).length>0);
  const ims = (typeof GW_INTEL!=='undefined') ? GW_INTEL.computeIMS() : {score:0, level:'CALME', color:'#22c55e'};
  const lastUpd = window.NEWS_STATE?.lastUpdate ? Math.round((Date.now()-new Date(window.NEWS_STATE.lastUpdate))/60000) : null;

  // Top sujet : article majeur le plus récent, prioritairement BF
  const topItem = bf24.find(it=>(it._majors||[]).length>0) || majors24[0] || bf24[0] || items24[0];

  // État global calculé
  let stateLabel, stateIcon, stateColor, recommendation;
  if(ims.score>=70){ stateLabel='ÉTAT CRITIQUE'; stateIcon='triangle-exclamation'; stateColor='#ef4444';
    recommendation='Mobilisation requise. Préparer note d\'alerte au plus vite.'; }
  else if(ims.score>=50){ stateLabel='ÉTAT ÉLEVÉ'; stateIcon='exclamation'; stateColor='#f97316';
    recommendation='Vigilance accrue. Surveiller chaque évolution sur les 24-48 h.'; }
  else if(ims.score>=30){ stateLabel='ÉTAT MODÉRÉ'; stateIcon='circle-exclamation'; stateColor='#f59e0b';
    recommendation='Surveillance routine. Contrôler les indicateurs de la semaine.'; }
  else if(ims.score>=15){ stateLabel='ÉTAT FAIBLE'; stateIcon='circle-info'; stateColor='#eab308';
    recommendation='Niveau de vigilance ordinaire. RAS dans l\'immédiat.'; }
  else { stateLabel='ÉTAT CALME'; stateIcon='circle-check'; stateColor='#22c55e';
    recommendation='Aucun signal d\'alerte. Profiter pour préparer analyses de fond.'; }

  // Date / heure
  const hr = new Date();
  const greeting = hr.getHours()<12 ? 'Bonjour' : hr.getHours()<18 ? 'Bon après-midi' : 'Bonsoir';
  const dateStr = hr.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

  synth.innerHTML = `
    <div style="background:linear-gradient(135deg,${stateColor}11 0%,#0a0f1c 100%);border:1px solid ${stateColor}55;border-left:5px solid ${stateColor};border-radius:8px;padding:18px 22px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:14px;margin-bottom:12px">
        <div>
          <div style="font-size:.7rem;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;font-weight:700">${greeting} — ${dateStr}</div>
          <div style="font-size:1.6rem;color:#e2e8f0;font-weight:800;margin-top:4px;line-height:1.15">À retenir aujourd'hui</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;background:#0a0f1c;padding:8px 14px;border-radius:8px;border:1px solid ${stateColor}66">
          <i class="fa-solid fa-${stateIcon}" style="color:${stateColor};font-size:1.6rem"></i>
          <div>
            <div style="font-size:.62rem;color:#94a3b8;text-transform:uppercase;letter-spacing:1px">Niveau global</div>
            <div style="font-size:1rem;color:${stateColor};font-weight:800;letter-spacing:1px">${stateLabel}</div>
          </div>
        </div>
      </div>

      ${items24.length===0 ? `
        <div style="background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.3);border-radius:6px;padding:11px 14px;color:#fde047;font-size:.86rem;line-height:1.5">
          <i class="fa-solid fa-spinner fa-spin"></i> <b>Collecte RSS en cours…</b> Les actualités du jour seront synthétisées dès que les flux auront répondu (1-2 minutes maximum).
        </div>
      ` : `
        <!-- Mini-stats compréhensibles -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:9px;margin-bottom:13px">
          <div style="background:#0a0f1c;border:1px solid #1a2340;padding:9px 12px;border-radius:6px">
            <div style="font-size:1.5rem;font-weight:800;color:#60a5fa;line-height:1">${items24.length}</div>
            <div style="font-size:.68rem;color:#94a3b8;line-height:1.3">articles agrégés<br>(24 dernières heures)</div>
          </div>
          <div style="background:#0a0f1c;border:1px solid #1a2340;padding:9px 12px;border-radius:6px">
            <div style="font-size:1.5rem;font-weight:800;color:#fde047;line-height:1">${bf24.length}</div>
            <div style="font-size:.68rem;color:#94a3b8;line-height:1.3">touchent directement<br>le Burkina Faso</div>
          </div>
          <div style="background:#0a0f1c;border:1px solid #1a2340;padding:9px 12px;border-radius:6px">
            <div style="font-size:1.5rem;font-weight:800;color:#ef4444;line-height:1">${majors24.length}</div>
            <div style="font-size:.68rem;color:#94a3b8;line-height:1.3">événements<br>jugés majeurs</div>
          </div>
          <div style="background:#0a0f1c;border:1px solid #1a2340;padding:9px 12px;border-radius:6px">
            <div style="font-size:1.5rem;font-weight:800;color:${stateColor};line-height:1">${ims.score}<span style="font-size:.78rem;color:#64748b">/100</span></div>
            <div style="font-size:.68rem;color:#94a3b8;line-height:1.3">indice de menace<br>stratégique BF</div>
          </div>
        </div>

        ${topItem ? `
          <div style="background:rgba(0,0,0,.35);border-left:3px solid ${stateColor};border-radius:0 6px 6px 0;padding:10px 13px;margin-bottom:11px">
            <div style="font-size:.62rem;color:${stateColor};text-transform:uppercase;letter-spacing:1px;font-weight:800;margin-bottom:3px"><i class="fa-solid fa-bullseye"></i> Sujet n°1 du jour</div>
            <a href="${topItem.link||'#'}" target="_blank" rel="noopener" style="font-size:.96rem;color:#e2e8f0;font-weight:700;text-decoration:none;line-height:1.45;display:block;margin-bottom:4px">${(topItem.title||'').slice(0,200)}${(topItem.title||'').length>200?'…':''}</a>
            <div style="font-size:.7rem;color:#94a3b8">${topItem._source||'—'} · ${fmt.dateTime(topItem.pubDate)} ${topItem._bf?'· <span style="color:#fde047">🇧🇫 pertinent BF</span>':''} ${(topItem._majors||[]).length?'· <span style="color:#ef4444">⚠ événement majeur</span>':''}</div>
          </div>
        ` : ''}
      `}

      <!-- Recommandation d'action -->
      <div style="background:linear-gradient(135deg,${stateColor}22 0%,${stateColor}08 100%);border:1px solid ${stateColor}55;border-radius:6px;padding:9px 13px;display:flex;align-items:center;gap:9px;flex-wrap:wrap">
        <i class="fa-solid fa-lightbulb" style="color:${stateColor};font-size:1.05rem"></i>
        <span style="font-size:.62rem;color:${stateColor};text-transform:uppercase;letter-spacing:1px;font-weight:800">Recommandation</span>
        <span style="font-size:.85rem;color:#e2e8f0;font-weight:600">${recommendation}</span>
      </div>

      <!-- Liens d'action rapide -->
      <div style="display:flex;gap:7px;margin-top:12px;flex-wrap:wrap">
        <button class="btn primary sm" onclick="Router.go('bqs')"><i class="fa-solid fa-file-circle-exclamation"></i> Brief quotidien complet</button>
        <button class="btn ghost sm" onclick="Router.go('alerts')"><i class="fa-solid fa-bell"></i> Voir alertes</button>
        <button class="btn ghost sm" onclick="Router.go('impact_radar')"><i class="fa-solid fa-bullseye"></i> Radar 35 canaux</button>
        ${lastUpd!==null && lastUpd<60 ? `<span style="font-size:.7rem;color:#86efac;align-self:center;margin-left:auto"><i class="fa-solid fa-circle" style="font-size:.5rem"></i> RSS à jour il y a ${lastUpd} min</span>` : `<button class="btn ghost sm" onclick="loadNews()" style="margin-left:auto"><i class="fa-solid fa-rotate"></i> Actualiser RSS</button>`}
      </div>
    </div>
  `;
}

/* ============= DASHBOARD ============= */
function renderDashboard(){
  const d = DB.get(); const now=new Date();
  const active = d.conflicts.filter(c=>c.status!=='frozen'&&c.status!=='resolved');
  const ruptures = d.events.filter(e=>e.rupture).length;

  // ═══ SYNTHÈSE DU JOUR — bandeau "À retenir aujourd'hui" ═══
  renderDashSynthese();

  // ═══ JAUGE IMS-BF (rendu en tête du tableau de bord) ═══
  try { GW_INTEL.renderIMSGauge('ims-gauge'); } catch(e){ console.warn('IMS gauge:',e); }

  // KPIs LIVE depuis RSS
  const rss24h = (NEWS_STATE?.items||[]).filter(it=>{
    if(!it.pubDate) return false;
    return (Date.now()-new Date(it.pubDate))/3600000 < 24;
  });
  const bf24h = rss24h.filter(it=>it._bf);
  const liveAlerts = (typeof getDerivedAlertsFromNews==='function'?getDerivedAlertsFromNews():[]);
  const totalAlerts = liveAlerts.length + (d.alerts?.length||0);
  const critAlerts = liveAlerts.filter(a=>a.level==='critical').length + (d.alerts||[]).filter(a=>a.level==='critical').length;

  document.getElementById('kpi-active').textContent = active.length;
  const kpiRSS = document.getElementById('kpi-rss-24h'); if(kpiRSS) kpiRSS.textContent = rss24h.length;
  const kpiRSStr = document.getElementById('kpi-rss-tr'); if(kpiRSStr) kpiRSStr.innerHTML = NEWS_STATE.lastUpdate ? `Maj : ${Math.round((Date.now()-new Date(NEWS_STATE.lastUpdate))/60000)} min` : 'Chargement…';
  const kpiBF = document.getElementById('kpi-bf'); if(kpiBF) kpiBF.textContent = bf24h.length;
  const kpiBFtr = document.getElementById('kpi-bf-tr'); if(kpiBFtr) kpiBFtr.innerHTML = bf24h.length>0 ? `<span style="color:#fde047">📍 surveillance Sahel/AES active</span>` : 'Aucun signal BF en 24h';
  document.getElementById('kpi-alerts').textContent = totalAlerts;
  const kpiAtr = document.getElementById('kpi-alerts-tr'); if(kpiAtr) kpiAtr.innerHTML = `<span style="color:#ef4444">${critAlerts} critique${critAlerts>1?'s':''}</span> · ${liveAlerts.length} live RSS · ${d.alerts?.length||0} manuelles`;
  // Ancien kpi-events (pour rétrocompat si élément encore présent)
  const ev30El = document.getElementById('kpi-events'); if(ev30El) ev30El.textContent = d.events.filter(e=>(now-new Date(e.date))/86400000<30).length;
  const evTr = document.getElementById('kpi-events-tr'); if(evTr) evTr.innerHTML = `${ruptures} seuils de rupture historiques recensés`;
  const intEl = document.getElementById('kpi-intensity'); if(intEl) intEl.textContent = active.length ? (active.reduce((s,c)=>s+c.intensity,0)/active.length).toFixed(1) : 0;

  // alerts in topbar (intègre alertes live + manuelles)
  const tbA = document.getElementById('tb-alerts');
  if(critAlerts>0){ tbA.style.display='inline-flex'; document.getElementById('tb-alerts-txt').textContent=`${critAlerts} alerte${critAlerts>1?'s':''} critique${critAlerts>1?'s':''}`; }
  else { tbA.style.display='none'; }
  const nb = document.getElementById('nav-alerts-badge');
  if(totalAlerts>0){ nb.style.display='inline-block'; nb.textContent=totalAlerts; }
  else { nb.style.display='none'; }

  // Escalade globale (1 an)
  const months = []; for(let i=11;i>=0;i--){ const x=new Date(now.getFullYear(), now.getMonth()-i, 1); months.push(x); }
  const monthLabels = months.map(m=>m.toLocaleDateString('fr-FR',{month:'short',year:'2-digit'}));
  const scoreByMonth = months.map(m=>{
    const next = new Date(m.getFullYear(), m.getMonth()+1, 1);
    return d.events.filter(e=>{const t=new Date(e.date); return t>=m && t<next;}).reduce((s,e)=>s+(e.severity||0),0);
  });
  makeChart('ch-dash-escalation',{type:'line',data:{labels:monthLabels,datasets:[
    {label:'Score d\'escalade (Σ sévérités)',data:scoreByMonth,borderColor:'#ef4444',backgroundColor:'rgba(239,68,68,.15)',fill:true,tension:.3,borderWidth:2,pointRadius:3,pointHoverRadius:6}
  ]},options:chartOpts({plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>`Score : ${ctx.parsed.y} pts`}}},scales:{x:{title:axT('Mois (12 derniers)'),grid:{color:'rgba(26,35,64,.4)'},ticks:{color:'#64748b'}},y:{title:axT('Score (Σ sévérités événements 1-10)'),grid:{color:'rgba(26,35,64,.4)'},ticks:{color:'#64748b'},beginAtZero:true}}})});
  // Insight escalade
  const last3=scoreByMonth.slice(-3),prev3=scoreByMonth.slice(-6,-3);
  const trend = last3.reduce((a,b)=>a+b,0) - prev3.reduce((a,b)=>a+b,0);
  const trendStr = trend>0 ? `<span style="color:#ef4444">↗ Accélération (+${trend} pts vs trimestre précédent)</span>` : trend<0 ? `<span style="color:#22c55e">↘ Décélération (${trend} pts vs trimestre précédent)</span>` : '<span style="color:#94a3b8">→ Stabilité</span>';
  chartInsight('ch-dash-escalation',
    `Pour chaque mois, on additionne la <b>sévérité (1-10)</b> de tous les événements enregistrés. Plus la courbe monte, plus la période est intense. Repère mental : <code>&lt;30</code> calme, <code>30-80</code> tendu, <code>&gt;80</code> crise active.`,
    `Tendance trimestrielle : ${trendStr}. Pic 12 mois : <b>${Math.max(...scoreByMonth)} pts</b> (${monthLabels[scoreByMonth.indexOf(Math.max(...scoreByMonth))]}).`,
    trend>0?'#ef4444':'#22c55e');

  // Régions
  const regions = {};
  active.forEach(c=>{ regions[c.region]=(regions[c.region]||0)+c.intensity; });
  const regionTotal = Object.values(regions).reduce((a,b)=>a+b,0);
  makeChart('ch-dash-region',{type:'doughnut',data:{labels:Object.keys(regions),datasets:[{data:Object.values(regions),backgroundColor:['#ef4444','#f97316','#f59e0b','#eab308','#22c55e','#06b6d4','#3b82f6','#a78bfa'],borderColor:'#0a0f1c',borderWidth:2}]},options:chartOpts({scales:{},plugins:{legend:{position:'right',labels:{color:'#cbd5e1',font:{size:10},padding:8,boxWidth:10}},tooltip:{callbacks:{label:ctx=>`${ctx.label} : ${ctx.parsed} pts (${Math.round(ctx.parsed/regionTotal*100)}%)`}}}})});
  // Insight régions
  const topReg = Object.entries(regions).sort((a,b)=>b[1]-a[1])[0];
  chartInsight('ch-dash-region',
    `Chaque part = <b>somme des intensités des conflits actifs</b> dans la région (échelle 1-10). Pondère par <i>gravité</i>, pas par <i>nombre</i> : 1 conflit à 10/10 pèse autant que 10 conflits à 1/10.`,
    topReg?`Région la plus exposée : <b style="color:#ef4444">${topReg[0]}</b> avec ${topReg[1]} pts cumulés (<b>${Math.round(topReg[1]/regionTotal*100)}%</b> du total mondial actif).`:'Aucun conflit actif.',
    '#f97316');

  // Top conflits par intensité — colonne "RSS 30j" alimentée par les articles RSS
  const top = active.slice().sort((a,b)=>b.intensity-a.intensity).slice(0,7);
  const rssAll = NEWS_STATE?.items||[];
  const rss30dCountFor = cid => rssAll.filter(it=>{
    if(!it.pubDate) return false;
    if(!(it._conflicts||[]).some(c=>c.id===cid)) return false;
    return (Date.now()-new Date(it.pubDate))/86400000 < 30;
  }).length;
  document.getElementById('tbl-top-conflicts').innerHTML = top.map(c=>{
    const rssC = rss30dCountFor(c.id);
    const evC = d.events.filter(e=>e.conflict_id===c.id&&(now-new Date(e.date))/86400000<30).length;
    return `<tr class="clickable" data-cid="${c.id}">
      <td><b style="color:#e2e8f0">${c.short||c.name}</b></td>
      <td style="color:#94a3b8">${c.region}</td>
      <td><span style="color:${conflictColor(c.intensity)};font-weight:700">${c.intensity}/10</span>${sevBar(c.intensity)}</td>
      <td><span style="color:#86efac;font-weight:700">${rssC}</span><span style="color:#64748b;font-size:.7rem"> RSS</span> + ${evC} <span style="color:#64748b;font-size:.7rem">jalons</span></td>
      <td>${statusChip(c.status)}</td>
    </tr>`;
  }).join('');
  document.querySelectorAll('#tbl-top-conflicts tr').forEach(tr=>tr.onclick=()=>showConflictDetail(tr.dataset.cid));

  // Événements ⚠ rupture récents — fusionne ruptures historiques + événements RSS majeurs récents
  const rssEvents = (typeof getRSSEvents==='function' ? getRSSEvents() : []).filter(e=>e.rupture);
  const histRup = d.events.filter(e=>e.rupture).map(e=>({...e, _live:false}));
  const allRup = [...rssEvents, ...histRup].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,10);
  document.getElementById('tbl-recent-events').innerHTML = allRup.map(e=>{
    const c = d.conflicts.find(x=>x.id===e.conflict_id);
    const liveBadge = e._live ? '<span class="chip" style="background:rgba(34,197,94,.18);color:#86efac;font-size:.6rem;border:1px solid rgba(34,197,94,.35);font-weight:700"><i class="fa-solid fa-broadcast-tower" style="font-size:.55rem"></i> RSS</span>' : '<span class="chip red" style="font-size:.6rem">Rupture historique</span>';
    const titleHTML = e._live && e._link ? `<a href="${e._link}" target="_blank" rel="noopener" style="color:#e2e8f0;text-decoration:none">⚠ ${e.title}<i class="fa-solid fa-arrow-up-right-from-square" style="font-size:.6rem;margin-left:5px;color:#60a5fa"></i></a>` : `⚠ ${e.title}`;
    return `<tr><td style="color:#94a3b8;font-size:.74rem">${fmt.date(e.date)}</td><td><b>${c?.short||c?.name||'—'}</b></td><td>${titleHTML}</td><td>${liveBadge}</td><td>${sevBar(e.severity)}</td></tr>`;
  }).join('') || '<tr><td colspan="5"><div class="empty" style="padding:20px"><i class="fa-solid fa-inbox"></i><p>Aucune rupture détectée. Les ruptures RSS apparaîtront ici dès détection.</p></div></td></tr>';

  // === SECTION : ACTIVITÉ RSS RÉCENTE ===
  const rssRecent = rssAll.slice(0,8);
  const rssRecentEl = document.getElementById('dash-rss-recent');
  if(rssRecentEl){
    if(!rssRecent.length){
      rssRecentEl.innerHTML = '<div class="loading" style="padding:30px"><i class="fa-solid fa-spinner fa-spin"></i> Collecte RSS en cours…</div>';
    } else {
      rssRecentEl.innerHTML = rssRecent.map(it=>{
        const isMajor = it._majors?.length>0;
        const col = isMajor?'#ef4444':it._bf?'#fde047':'#60a5fa';
        return `<a href="${it.link}" target="_blank" rel="noopener" style="display:block;text-decoration:none;padding:9px 12px;background:rgba(0,0,0,.25);border-left:3px solid ${col};border-radius:4px;margin-bottom:7px;transition:background .15s" onmouseover="this.style.background='rgba(96,165,250,.08)'" onmouseout="this.style.background='rgba(0,0,0,.25)'">
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:3px">
            ${isMajor?'<span class="chip" style="background:rgba(239,68,68,.18);color:#fca5a5;font-size:.58rem;border:1px solid rgba(239,68,68,.4);font-weight:700">⚠ MAJEUR</span>':''}
            ${it._bf?'<span class="chip" style="background:rgba(253,224,71,.15);color:#fde047;font-size:.58rem;border:1px solid rgba(253,224,71,.35)">🇧🇫 BF</span>':''}
            ${(it._tags||[]).slice(0,2).map(t=>`<span class="chip gray" style="font-size:.58rem">${t}</span>`).join('')}
          </div>
          <div style="font-size:.82rem;color:#e2e8f0;font-weight:600;line-height:1.35">${(it.title||'').slice(0,140)}${(it.title||'').length>140?'…':''}</div>
          <div style="font-size:.66rem;color:#64748b;margin-top:3px">${fmt.dateTime(it.pubDate)} · ${it._source||'—'}</div>
        </a>`;
      }).join('');
    }
  }

  // === SECTION : TENSIONS AUTO-DÉTECTÉES (preview Veille mondiale) ===
  const wwEl = document.getElementById('dash-ww-preview');
  if(wwEl && rssAll.length>0){
    let bilat = [], zones = [];
    try { bilat = wwDetectBilateral(rssAll).slice(0,3); zones = wwDetectHotZones(rssAll).slice(0,5); } catch(e){}
    if(!bilat.length && !zones.length){
      wwEl.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b;font-size:.78rem"><i class="fa-solid fa-shield-halved"></i> Aucune tension détectée pour le moment.</div>';
    } else {
      const bilatHTML = bilat.length ? `<div style="margin-bottom:10px"><div style="font-size:.7rem;color:#ef4444;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">⚡ Tensions bilatérales</div>${bilat.map(p=>`<div style="background:rgba(239,68,68,.06);border-left:3px solid #ef4444;border-radius:4px;padding:7px 10px;margin-bottom:5px;font-size:.78rem;color:#cbd5e1"><b style="color:#e2e8f0">${p.pair[0]} ↔ ${p.pair[1]}</b> <span style="color:#94a3b8">· ${p.articles.length} articles · ${p.types.slice(0,3).join(', ')}</span></div>`).join('')}</div>` : '';
      const zonesHTML = zones.length ? `<div><div style="font-size:.7rem;color:#f97316;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">🔥 Zones chaudes</div><div style="display:flex;gap:6px;flex-wrap:wrap">${zones.map(z=>{const sev=z.severity>=15?'#ef4444':z.severity>=8?'#f97316':'#f59e0b'; return `<span class="chip" style="background:${sev}22;color:${sev};border:1px solid ${sev}55;font-size:.7rem;font-weight:600">📍 ${z.country} (${z.articles.length} art.)</span>`;}).join('')}</div></div>` : '';
      wwEl.innerHTML = bilatHTML + zonesHTML + '<div style="text-align:center;margin-top:10px"><a href="#" data-page="worldwatch" class="btn ghost sm" style="font-size:.72rem"><i class="fa-solid fa-arrow-right"></i> Voir veille mondiale complète</a></div>';
    }
  }

  // Mini-map
  setTimeout(()=>{ GeoMap.init('map-dash'); GeoMap.renderAll({layer:'both'}); }, 80);
}

/* Convertit les articles RSS en événements (pour fusion dans Chronologie & Dashboard) */
function getRSSEvents(){
  if(!NEWS_STATE?.items?.length) return [];
  return NEWS_STATE.items.filter(it=>it.pubDate).map(it=>{
    const conflictId = (it._conflicts||[])[0]?.id;
    const types = (it._majors||[]).map(m=>m.type);
    let severity = 4;
    if(types.includes('rupture')||types.includes('crise')) severity = 9;
    else if(types.includes('diplo_majeur')) severity = 7;
    else if((it._tags||[]).includes('military')) severity = 6;
    else if(it._bf) severity = 5;
    let evType = 'info';
    if(types.length) evType = types[0];
    else if((it._tags||[]).length) evType = it._tags[0];
    return {
      id: 'rss_ev_'+(it.link||'').slice(-30),
      date: it.pubDate,
      title: it.title,
      description: (it.description||'').slice(0,300),
      conflict_id: conflictId, country: '',
      type: evType, severity, rupture: types.length>0,
      _live: true, _link: it.link, _source: it._source, _bf: !!it._bf
    };
  });
}

/* ============= FICHES CONFLITS (8 dimensions) ============= */
let CF_STATE = { search:'', region:'', status:'', sort:'priority' };

function renderConflicts(){
  const d = DB.get();
  // populate region filter
  const sel = document.getElementById('cf-region');
  if(sel.options.length<=1){ [...new Set(d.conflicts.map(c=>c.region))].sort().forEach(r=>{ const o=document.createElement('option'); o.value=r; o.textContent=r; sel.appendChild(o); }); }

  let list = d.conflicts.slice();
  if(CF_STATE.search) list=list.filter(c=>(c.name+' '+(c.actors_etat||[]).join(' ')+' '+(c.actors_non_etat||[]).join(' ')+' '+(c.cle_historique||'')).toLowerCase().includes(CF_STATE.search.toLowerCase()));
  if(CF_STATE.region) list=list.filter(c=>c.region===CF_STATE.region);
  if(CF_STATE.status) list=list.filter(c=>c.status===CF_STATE.status);

  if(CF_STATE.sort==='priority') list.sort((a,b)=>(a.priority||9)-(b.priority||9) || b.intensity-a.intensity);
  else if(CF_STATE.sort==='intensity') list.sort((a,b)=>b.intensity-a.intensity);
  else if(CF_STATE.sort==='name') list.sort((a,b)=>a.name.localeCompare(b.name));

  document.getElementById('cf-count').textContent = `${list.length} conflit${list.length>1?'s':''} — cliquer pour ouvrir la fiche complète`;
  const wrap = document.getElementById('cf-list');
  if(!list.length){ wrap.innerHTML='<div class="empty" style="grid-column:1/-1"><i class="fa-solid fa-inbox"></i><p>Aucun résultat.</p></div>'; return; }

  // Compteurs RSS live par conflit (24h et total en mémoire)
  const rssAll = NEWS_STATE?.items||[];
  const rss24h = rssAll.filter(it=>it.pubDate && (Date.now()-new Date(it.pubDate))/3600000 < 24);
  const rssCountFor = cid => rssAll.filter(it=>(it._conflicts||[]).some(c=>c.id===cid)).length;
  const rss24Count = cid => rss24h.filter(it=>(it._conflicts||[]).some(c=>c.id===cid)).length;

  wrap.innerHTML = list.map(c=>{
    const col = conflictColor(c.intensity);
    const has8 = !!c.causes_historiques;
    const rTot = rssCountFor(c.id);
    const r24 = rss24Count(c.id);
    const liveBadge = rTot>0
      ? `<span class="chip" style="background:rgba(34,197,94,.15);color:#86efac;font-size:.62rem;border:1px solid rgba(34,197,94,.35);font-weight:700"><i class="fa-solid fa-broadcast-tower" style="font-size:.55rem"></i> ${rTot} articles RSS${r24>0?` (${r24} en 24h)`:''}</span>`
      : '<span class="chip gray" style="font-size:.62rem">Aucun article RSS récent</span>';
    return `<div class="conflict-card" data-cid="${c.id}" style="--cc:${col}">
      <div class="cc-hd">
        <div>
          <div class="cc-name">${c.name}</div>
          <div class="cc-region">${c.region} • depuis ${c.start_year} • Priorité ${c.priority||'—'}</div>
        </div>
        <div class="cc-intensity"><div class="cc-int-val">${c.intensity}</div><div class="cc-int-lbl">Int.</div></div>
      </div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px">${statusChip(c.status)}${liveBadge}${has8?'<span class="chip purple">Fiche 8 dim.</span>':''}${c.brief_decideur?'<span class="chip blue">Brief</span>':''}${c.scenarios?'<span class="chip green">Scénarios</span>':''}</div>
      <div class="cc-desc">${c.cle_historique||(c.brief_decideur?.[0])||''}</div>
      <div class="cc-meta" style="margin-top:8px">
        <span><b style="color:#e2e8f0">${(c.actors_etat||[]).length}</b> acteurs étatiques</span>
        <span><b style="color:#e2e8f0">${(c.chronologie||[]).length}</b> jalons</span>
      </div>
    </div>`;
  }).join('');
  wrap.querySelectorAll('.conflict-card').forEach(el=>el.onclick=()=>showConflictDetail(el.dataset.cid));
}

/* ----- Fiche conflit complète (modal) ----- */
function showConflictDetail(cid){
  const d = DB.get();
  const c = d.conflicts.find(x=>x.id===cid); if(!c) return;
  const col = conflictColor(c.intensity);
  const m = document.getElementById('modal');

  const sec = (icon, title, body) => body ? `<div class="card" style="margin:0 0 12px"><div class="card-hd"><h2><i class="fa-solid ${icon}"></i>${title}</h2></div>${body}</div>` : '';

  // Build sections only if data exists
  const histo = c.causes_historiques ? `<table class="tbl"><thead><tr><th style="width:30%">Période</th><th>Faits essentiels</th></tr></thead><tbody>${c.causes_historiques.map(x=>`<tr><td><b>${x.p}</b></td><td>${x.f}</td></tr>`).join('')}</tbody></table>${c.cle_historique?`<div style="margin-top:10px;padding:10px 12px;background:#0a0f1c;border-left:3px solid ${col};border-radius:4px"><b style="color:#60a5fa">Clé analytique :</b> ${c.cle_historique}</div>`:''}` : '';

  const geo = c.causes_geographiques ? `<table class="tbl"><thead><tr><th style="width:35%">Contrainte</th><th>Implication</th></tr></thead><tbody>${c.causes_geographiques.map(x=>`<tr><td><b>${x.c}</b></td><td>${x.i}</td></tr>`).join('')}</tbody></table>` : '';
  const eco = c.causes_economiques ? `<table class="tbl"><thead><tr><th style="width:30%">Dimension</th><th>Élément</th></tr></thead><tbody>${c.causes_economiques.map(x=>`<tr><td><b>${x.d}</b></td><td>${x.i}</td></tr>`).join('')}</tbody></table>` : '';
  const ideo = c.causes_ideologiques ? `<table class="tbl"><thead><tr><th style="width:30%">Doctrine/idéologie</th><th>Description</th></tr></thead><tbody>${c.causes_ideologiques.map(x=>`<tr><td><b>${x.a}</b></td><td>${x.d}</td></tr>`).join('')}</tbody></table>` : '';
  const perc = c.perceptions_croisees ? `<table class="tbl"><thead><tr><th style="width:35%">Acteur</th><th>Regard porté</th></tr></thead><tbody>${c.perceptions_croisees.map(x=>`<tr><td><b>${x.a}</b></td><td>${x.b}</td></tr>`).join('')}</tbody></table>` : '';

  const post = c.postures_arsenaux ? `<div class="grid-2e">
    <div style="background:#0a0f1c;border:1px solid #1a2340;border-radius:8px;padding:14px">
      <h3 style="color:#60a5fa;font-size:.95rem;margin-bottom:8px">${c.postures_arsenaux.camp_a.nom}</h3>
      <div style="font-size:.78rem;color:#94a3b8;margin-bottom:6px"><b style="color:#cbd5e1">Doctrine :</b> ${c.postures_arsenaux.camp_a.doctrine}</div>
      <div style="font-size:.78rem;color:#94a3b8;margin-bottom:6px"><b style="color:#cbd5e1">Moyens :</b> ${c.postures_arsenaux.camp_a.moyens}</div>
      <div style="font-size:.78rem;color:#fca5a5"><b>Faiblesses :</b> ${c.postures_arsenaux.camp_a.faiblesses}</div>
    </div>
    <div style="background:#0a0f1c;border:1px solid #1a2340;border-radius:8px;padding:14px">
      <h3 style="color:#f97316;font-size:.95rem;margin-bottom:8px">${c.postures_arsenaux.camp_b.nom}</h3>
      <div style="font-size:.78rem;color:#94a3b8;margin-bottom:6px"><b style="color:#cbd5e1">Doctrine :</b> ${c.postures_arsenaux.camp_b.doctrine}</div>
      <div style="font-size:.78rem;color:#94a3b8;margin-bottom:6px"><b style="color:#cbd5e1">Moyens :</b> ${c.postures_arsenaux.camp_b.moyens}</div>
      <div style="font-size:.78rem;color:#fca5a5"><b>Faiblesses :</b> ${c.postures_arsenaux.camp_b.faiblesses}</div>
    </div>
  </div>` : '';

  const riv = c.rivalites_structurelles ? `<table class="tbl"><thead><tr><th style="width:25%">Dimension</th><th>Nature de la rivalité</th></tr></thead><tbody>${c.rivalites_structurelles.map(x=>`<tr><td><b>${x.dim}</b></td><td>${x.n}</td></tr>`).join('')}</tbody></table>` : '';

  const chrono = c.chronologie ? `<div class="timeline" style="--cc:${col}">${c.chronologie.slice().reverse().map(x=>`<div class="tl-item"><div class="tl-date">${fmt.date(x.d)} ${x.rupture?'<span class="chip red">⚠ Seuil de rupture</span>':''} ${sevBar(x.sev)}</div><div class="tl-title">${x.e}</div>${x.note?`<div class="tl-desc">${x.note}</div>`:''}</div>`).join('')}</div>` : '';

  const lecture = c.lecture_causale ? `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">
    <div style="background:#0a0f1c;border-left:3px solid #ef4444;padding:10px 12px;border-radius:4px"><div style="font-size:.7rem;color:#fca5a5;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Cause première</div><div style="font-size:.85rem;color:#cbd5e1;line-height:1.5">${c.lecture_causale.premiere}</div></div>
    <div style="background:#0a0f1c;border-left:3px solid #f97316;padding:10px 12px;border-radius:4px"><div style="font-size:.7rem;color:#fdba74;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Cause structurante</div><div style="font-size:.85rem;color:#cbd5e1;line-height:1.5">${c.lecture_causale.structurante}</div></div>
    <div style="background:#0a0f1c;border-left:3px solid #a78bfa;padding:10px 12px;border-radius:4px"><div style="font-size:.7rem;color:#c4b5fd;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Paradoxe central</div><div style="font-size:.85rem;color:#cbd5e1;line-height:1.5">${c.lecture_causale.paradoxe}</div></div>
    <div style="background:#0a0f1c;border-left:3px solid #60a5fa;padding:10px 12px;border-radius:4px"><div style="font-size:.7rem;color:#93c5fd;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Signal décisif</div><div style="font-size:.85rem;color:#cbd5e1;line-height:1.5">${c.lecture_causale.signal}</div></div>
  </div>` : '';

  const briefDec = c.brief_decideur ? `<ol style="padding-left:22px;line-height:1.7">${c.brief_decideur.map(b=>`<li style="margin-bottom:6px;color:#cbd5e1;font-size:.88rem">${b}</li>`).join('')}</ol>` : '';

  const briefAna = c.brief_analyste ? (()=>{
    const b = c.brief_analyste;
    return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:.82rem">
      <div style="background:#0a0f1c;padding:10px 12px;border-radius:6px;border:1px solid #1a2340"><div style="font-size:.7rem;color:#22c55e;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Faits robustes</div><div style="color:#cbd5e1;line-height:1.5">${b.faits||''}</div></div>
      <div style="background:#0a0f1c;padding:10px 12px;border-radius:6px;border:1px solid #1a2340"><div style="font-size:.7rem;color:#f59e0b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Incertitudes</div><div style="color:#cbd5e1;line-height:1.5">${b.incertitudes||''}</div></div>
      <div style="grid-column:1/-1;background:#0a0f1c;padding:10px 12px;border-radius:6px;border:1px solid #1a2340"><div style="font-size:.7rem;color:#a78bfa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Hypothèses pondérées</div><div style="color:#cbd5e1;line-height:1.5">${b.hypotheses||''}</div></div>
      <div style="background:#0a0f1c;padding:10px 12px;border-radius:6px;border:1px solid #1a2340"><div style="font-size:.7rem;color:#ef4444;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Indicateurs 24-72 h</div><div style="color:#cbd5e1;line-height:1.5">${b.indicateurs_24_72h||''}</div></div>
      <div style="background:#0a0f1c;padding:10px 12px;border-radius:6px;border:1px solid #1a2340"><div style="font-size:.7rem;color:#60a5fa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Indicateurs 7-30 j</div><div style="color:#cbd5e1;line-height:1.5">${b.indicateurs_7_30j||''}</div></div>
      ${b.implications_7_30j?`<div style="grid-column:1/-1;background:#0a0f1c;padding:10px 12px;border-radius:6px;border:1px solid #1a2340"><div style="font-size:.7rem;color:#f97316;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Implications 7-30 j</div><div style="color:#cbd5e1;line-height:1.5">${b.implications_7_30j}</div></div>`:''}
    </div>`;
  })() : '';

  const scen = c.scenarios ? c.scenarios.map(s=>{
    const probaCol = s.proba>=40?'#ef4444':s.proba>=20?'#f97316':s.proba>=10?'#f59e0b':'#22c55e';
    return `<div style="background:#0a0f1c;border:1px solid #1a2340;border-left:4px solid ${probaCol};border-radius:6px;padding:12px;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px">
        <div><div style="font-size:.92rem;color:#e2e8f0;font-weight:700">${s.nom}</div><div style="font-size:.72rem;color:#64748b">Horizon ${s.h}</div></div>
        <div style="text-align:right"><div style="font-size:1.1rem;font-weight:700;color:${probaCol}">${s.proba}%</div><div style="font-size:.7rem;color:#64748b">Impact ${s.impact}/10</div></div>
      </div>
      <div style="font-size:.82rem;color:#cbd5e1;line-height:1.5">${s.d}</div>
    </div>`;
  }).join('') : '';

  const sources = c.sources ? `<ul style="list-style:none;padding:0">${c.sources.map(s=>`<li style="padding:6px 0;border-bottom:1px solid #141c30"><a href="${s.url}" target="_blank" rel="noopener" style="color:#60a5fa"><i class="fa-solid fa-arrow-up-right-from-square" style="font-size:.7rem;margin-right:6px"></i>${s.nom}</a></li>`).join('')}</ul>` : '';

  m.innerHTML = `
    <button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
    <div class="modal-hd">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap">
        <div>
          <h1>${c.name}</h1>
          <div class="sub">${c.region} • depuis ${c.start_year} • ${statusChip(c.status)} <span class="chip" style="background:${col}22;color:${col};border:1px solid ${col}55">Intensité ${c.intensity}/10</span></div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn ghost sm" onclick="exportNoteSituation('${c.id}')"><i class="fa-solid fa-file-lines"></i> .txt</button>
          <button class="btn ghost sm" onclick="exportNoteDOCX('${c.id}')"><i class="fa-solid fa-file-word" style="color:#2b579a"></i> Word</button>
          <button class="btn primary sm" onclick="exportNotePDF('${c.id}')"><i class="fa-solid fa-file-pdf"></i> PDF</button>
          <button class="btn secondary sm" onclick="exportNotePPTX('${c.id}')" style="background:#b7472a;color:#fff"><i class="fa-solid fa-file-powerpoint"></i> PPTX</button>
        </div>
      </div>
      <div style="margin-top:10px;color:#94a3b8;font-size:.82rem"><b style="color:#cbd5e1">Pays clés :</b> ${c.pays_clefs||''}</div>
      <div style="margin-top:6px;font-size:.78rem"><b style="color:#cbd5e1">Acteurs étatiques :</b> ${(c.actors_etat||[]).map(a=>`<span class="chip purple" style="margin:2px 3px 2px 0">${a}</span>`).join('')}</div>
      ${(c.actors_non_etat||[]).length?`<div style="margin-top:6px;font-size:.78rem"><b style="color:#cbd5e1">Acteurs non-étatiques :</b> ${c.actors_non_etat.map(a=>`<span class="chip orange" style="margin:2px 3px 2px 0">${a}</span>`).join('')}</div>`:''}
    </div>

    ${c.analyse_simple ? renderAnalyseSimplePanel(c) : ''}
    ${briefDec ? sec('fa-bullseye','Brief — couche décideur (5 points max)', briefDec) : ''}
    ${briefAna ? sec('fa-microscope','Brief — couche analyste', briefAna) : ''}
    ${c.impact_bf ? `<div class="card" style="margin:0 0 12px;background:linear-gradient(135deg,#1a0d05 0%,#0e0703 100%);border-color:#7c2d12"><div class="card-hd"><h2 style="color:#fde047"><i class="fa-solid fa-flag-checkered"></i>Impacts sur le Burkina Faso</h2></div>${renderBFPanel(c)}</div>` : ''}
    ${histo ? sec('fa-clock-rotate-left','I — Causes historiques', histo) : ''}
    ${geo ? sec('fa-mountain-sun','II — Causes géographiques', geo) : ''}
    ${eco ? sec('fa-coins','III — Causes économiques', eco) : ''}
    ${ideo ? sec('fa-book-open','IV — Causes idéologiques et religieuses', ideo) : ''}
    ${perc ? sec('fa-eye','V — Perceptions et imaginaires', perc) : ''}
    ${post ? sec('fa-shield-halved','VI — Postures et arsenaux', post) : ''}
    ${riv ? sec('fa-scale-balanced','VII — Rivalités structurelles', riv) : ''}
    ${chrono ? sec('fa-timeline','VIII — Chronologie', chrono) : ''}
    ${lecture ? sec('fa-key','Lecture causale intégrée', lecture) : ''}
    ${scen ? sec('fa-chess','Scénarios prospectifs', scen) : ''}
    ${sources ? sec('fa-book-bookmark','Sources de référence', sources) : ''}
  `;
  document.getElementById('modal-bg').classList.add('open');
  document.querySelector('#modal').scrollTop = 0;
}

function closeModal(){ document.getElementById('modal-bg').classList.remove('open'); }

/* ============= ANALYSE GÉOPOLITIQUE SIMPLIFIÉE ============= */
function renderAnalyseSimplePanel(c){
  const a = c.analyse_simple; if(!a) return '';
  const col = conflictColor(c.intensity);
  return `<div class="card" style="margin:0 0 14px;background:linear-gradient(135deg,#0a1428 0%,#060d1a 100%);border:2px solid ${col};border-radius:12px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap">
    <i class="fa-solid fa-lightbulb" style="color:${col};font-size:1.3rem"></i>
    <h2 style="font-size:1rem;color:#e2e8f0;font-weight:700">Analyse géopolitique simplifiée</h2>
    <span class="chip" style="background:${col}22;color:${col};border:1px solid ${col}55;font-size:.65rem">Pédagogique</span>
    ${(()=>{ if(!a.date_analyse) return '<span class="chip orange" style="font-size:.65rem">⚠ Non daté — à vérifier</span>';
      const ageDays = Math.floor((Date.now()-new Date(a.date_analyse))/86400000);
      const col = ageDays>30 ? '#ef4444' : ageDays>14 ? '#f59e0b' : '#22c55e';
      const lbl = ageDays===0?'aujourd\'hui':ageDays===1?'hier':`il y a ${ageDays} j`;
      const warn = ageDays>30 ? ' • ⚠ Analyse à actualiser' : '';
      return `<span class="chip" style="background:${col}22;color:${col};border:1px solid ${col}55;font-size:.65rem"><i class="fa-solid fa-calendar"></i> Màj ${a.date_analyse} (${lbl})${warn}</span>`;
    })()}
    ${a.source_reference?`<span style="font-size:.65rem;color:#64748b"><i class="fa-solid fa-book"></i> ${a.source_reference}</span>`:''}
  </div>
  ${a.source_reference && a.source_reference.includes('prospectifs') ? `<div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.3);border-radius:6px;padding:8px 12px;margin-bottom:10px;font-size:.75rem;color:#fca5a5"><i class="fa-solid fa-triangle-exclamation"></i> <b>Cette analyse contient des éléments prospectifs.</b> Vérifiez avec les dernières sources officielles avant toute utilisation.</div>`:''}

    <div style="background:rgba(96,165,250,.08);border-left:4px solid #60a5fa;padding:14px 16px;border-radius:6px;margin-bottom:12px">
      <div style="font-size:.7rem;color:#60a5fa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;font-weight:700">📌 En une phrase</div>
      <div style="font-size:.95rem;color:#e2e8f0;line-height:1.6;font-weight:500">${a.en_une_phrase}</div>
    </div>

    <div style="background:#0a0f1c;padding:12px 14px;border-radius:6px;border:1px solid #1a2340;margin-bottom:12px">
      <div style="font-size:.7rem;color:#a78bfa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;font-weight:700">💡 Pourquoi c'est important</div>
      <div style="font-size:.85rem;color:#cbd5e1;line-height:1.6">${a.pourquoi_important}</div>
    </div>

    <div style="background:#0a0f1c;padding:12px 14px;border-radius:6px;border:1px solid #1a2340;margin-bottom:12px">
      <div style="font-size:.7rem;color:#f97316;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;font-weight:700">⚔️ Qui contre qui ?</div>
      ${(a.qui_contre_qui||[]).map(q=>`<div style="display:grid;grid-template-columns:1fr 1.5fr;gap:10px;padding:5px 0;border-bottom:1px solid #141c30;font-size:.8rem"><div style="color:#e2e8f0;font-weight:600">${q.a}</div><div style="color:#94a3b8;line-height:1.4">${q.position}</div></div>`).join('')}
    </div>

    <div style="background:rgba(239,68,68,.08);border-left:4px solid #ef4444;padding:14px 16px;border-radius:6px;margin-bottom:12px">
      <div style="font-size:.7rem;color:#ef4444;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;font-weight:700">🎯 Enjeu central</div>
      <div style="font-size:.88rem;color:#e2e8f0;line-height:1.6">${a.enjeu_central}</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
      <div style="background:#0a0f1c;padding:12px 14px;border-radius:6px;border:1px solid #1a2340">
        <div style="font-size:.7rem;color:#22c55e;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;font-weight:700">🔭 À surveiller</div>
        <ul style="list-style:none;padding:0;margin:0">${(a.surveiller||[]).map(x=>`<li style="padding:4px 0;color:#cbd5e1;font-size:.8rem;line-height:1.5">→ ${x}</li>`).join('')}</ul>
      </div>
      <div style="background:#0a0f1c;padding:12px 14px;border-radius:6px;border:1px solid #1a2340">
        <div style="font-size:.7rem;color:#06b6d4;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;font-weight:700">⏰ Horizons</div>
        <div style="font-size:.78rem;color:#cbd5e1;line-height:1.5;margin-bottom:6px"><b style="color:#06b6d4">Court terme :</b> ${a.horizon_proche}</div>
        <div style="font-size:.78rem;color:#cbd5e1;line-height:1.5"><b style="color:#06b6d4">Long terme :</b> ${a.horizon_long}</div>
      </div>
    </div>

    ${a.analogie?`<div style="background:rgba(253,224,71,.06);border-left:4px solid #fde047;padding:13px 16px;border-radius:6px;font-style:italic">
      <div style="font-size:.7rem;color:#fde047;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;font-weight:700">🎭 Pour comprendre simplement</div>
      <div style="font-size:.85rem;color:#cbd5e1;line-height:1.6">${a.analogie}</div>
    </div>`:''}
  </div>`;
}

/* ============= BRIEFS 2 COUCHES ============= */
function renderBriefs(){
  const d = DB.get();
  const sel = document.getElementById('brief-conflict');
  if(sel.options.length<=0){ d.conflicts.filter(c=>c.brief_decideur).forEach((c,i)=>{ const o=document.createElement('option'); o.value=c.id; o.textContent=c.short||c.name; if(i===0) o.selected=true; sel.appendChild(o); }); }
  const cid = sel.value || (d.conflicts.find(c=>c.brief_decideur)?.id);
  if(!cid){ document.getElementById('brief-content').innerHTML='<div class="empty"><i class="fa-solid fa-inbox"></i><p>Aucun brief disponible.</p></div>'; return; }
  const c = d.conflicts.find(x=>x.id===cid); if(!c) return;
  const col = conflictColor(c.intensity);

  const briefDec = c.brief_decideur ? `<ol style="padding-left:22px;line-height:1.75">${c.brief_decideur.map(b=>`<li style="margin-bottom:8px;color:#cbd5e1;font-size:.95rem">${b}</li>`).join('')}</ol>` : '<div class="empty"><p>Brief décideur non disponible.</p></div>';
  const b = c.brief_analyste || {};
  const briefAna = c.brief_analyste ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    <div style="background:#0a0f1c;padding:12px 14px;border-radius:8px;border:1px solid #1a2340"><div style="font-size:.72rem;color:#22c55e;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px"><i class="fa-solid fa-check-circle"></i> Faits robustes</div><div style="color:#cbd5e1;line-height:1.55;font-size:.86rem">${b.faits||''}</div></div>
    <div style="background:#0a0f1c;padding:12px 14px;border-radius:8px;border:1px solid #1a2340"><div style="font-size:.72rem;color:#f59e0b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px"><i class="fa-solid fa-question-circle"></i> Incertitudes</div><div style="color:#cbd5e1;line-height:1.55;font-size:.86rem">${b.incertitudes||''}</div></div>
    <div style="grid-column:1/-1;background:#0a0f1c;padding:12px 14px;border-radius:8px;border:1px solid #1a2340"><div style="font-size:.72rem;color:#a78bfa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px"><i class="fa-solid fa-list-ol"></i> Hypothèses pondérées</div><div style="color:#cbd5e1;line-height:1.55;font-size:.86rem">${b.hypotheses||''}</div></div>
    <div style="background:#0a0f1c;padding:12px 14px;border-radius:8px;border:1px solid #1a2340"><div style="font-size:.72rem;color:#ef4444;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px"><i class="fa-solid fa-radar"></i> Indicateurs 24-72 h</div><div style="color:#cbd5e1;line-height:1.55;font-size:.86rem">${b.indicateurs_24_72h||''}</div></div>
    <div style="background:#0a0f1c;padding:12px 14px;border-radius:8px;border:1px solid #1a2340"><div style="font-size:.72rem;color:#60a5fa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px"><i class="fa-solid fa-binoculars"></i> Indicateurs 7-30 j</div><div style="color:#cbd5e1;line-height:1.55;font-size:.86rem">${b.indicateurs_7_30j||''}</div></div>
    ${b.implications_7_30j?`<div style="grid-column:1/-1;background:#0a0f1c;padding:12px 14px;border-radius:8px;border:1px solid #1a2340"><div style="font-size:.72rem;color:#f97316;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px"><i class="fa-solid fa-bolt"></i> Implications 7-30 j</div><div style="color:#cbd5e1;line-height:1.55;font-size:.86rem">${b.implications_7_30j}</div></div>`:''}
  </div>` : '<div class="empty"><p>Brief analyste non disponible.</p></div>';

  // ═══ ENRICHISSEMENT GW_DEPTH : couches de profondeur live ═══
  const articlesBlock     = (typeof GW_DEPTH!=='undefined') ? GW_DEPTH.recentArticlesBlock(c.id, 7, 6) : '';
  const liveSignals       = (typeof GW_DEPTH!=='undefined') ? GW_DEPTH.liveSignalsBlock(c) : '';
  const researchAngles    = (typeof GW_DEPTH!=='undefined') ? GW_DEPTH.researchAnglesBlock(c) : '';
  const operationalActions= (typeof GW_DEPTH!=='undefined') ? GW_DEPTH.actionsBlock(c) : '';
  const crossRef          = (typeof GW_DEPTH!=='undefined') ? GW_DEPTH.crossRefBlock(c) : '';

  // Compteurs live
  const articles24h = (typeof GW_DEPTH!=='undefined') ? GW_DEPTH.getConflictArticles(c.id, 1).length : 0;
  const articles7d  = (typeof GW_DEPTH!=='undefined') ? GW_DEPTH.getConflictArticles(c.id, 7).length : 0;
  const sources7d   = (typeof GW_DEPTH!=='undefined') ? GW_DEPTH.getRecentSources(c.id, 7).length : 0;

  document.getElementById('brief-content').innerHTML = `
    <!-- En-tête conflit avec mini-stats live -->
    <div style="border-left:4px solid ${col};padding:10px 0 10px 14px;margin-bottom:14px;background:rgba(255,255,255,.02);border-radius:0 6px 6px 0">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
        <div>
          <div style="font-size:1.15rem;color:#e2e8f0;font-weight:700">${c.name}</div>
          <div style="font-size:.78rem;color:#94a3b8;margin-top:4px">${c.region} • ${statusChip(c.status)} <span class="chip" style="background:${col}22;color:${col};border:1px solid ${col}55">Intensité ${c.intensity}/10</span> ${c.priority?`<span class="chip gray">Priorité ${c.priority}</span>`:''}</div>
        </div>
        <div style="display:flex;gap:9px;align-items:center">
          <div style="text-align:center;background:#0a0f1c;padding:5px 11px;border-radius:5px;border:1px solid #1a2340">
            <div style="font-size:1.05rem;color:#86efac;font-weight:800;line-height:1">${articles24h}</div>
            <div style="font-size:.55rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px">articles 24h</div>
          </div>
          <div style="text-align:center;background:#0a0f1c;padding:5px 11px;border-radius:5px;border:1px solid #1a2340">
            <div style="font-size:1.05rem;color:#60a5fa;font-weight:800;line-height:1">${articles7d}</div>
            <div style="font-size:.55rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px">articles 7j</div>
          </div>
          <div style="text-align:center;background:#0a0f1c;padding:5px 11px;border-radius:5px;border:1px solid #1a2340">
            <div style="font-size:1.05rem;color:#a78bfa;font-weight:800;line-height:1">${sources7d}</div>
            <div style="font-size:.55rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px">sources</div>
          </div>
        </div>
      </div>
      ${c.cle_historique ? `<div style="margin-top:10px;padding:8px 11px;background:rgba(0,0,0,.3);border-left:2px solid #fde047;font-size:.82rem;color:#cbd5e1;line-height:1.55;border-radius:0 4px 4px 0"><b style="color:#fde047">Clé d'analyse :</b> ${c.cle_historique}</div>` : ''}
    </div>

    <!-- COUCHE 1 — DÉCIDEUR -->
    <div class="card" style="margin:0 0 14px;background:linear-gradient(135deg,#1a0609 0%,#0e0304 100%);border-color:#7f1d1d">
      <div class="card-hd"><h2 style="color:#fca5a5"><i class="fa-solid fa-bullseye"></i> COUCHE 1 — DÉCIDEUR</h2><div class="help">5 points max, axes de risque, faits robustes, implications immédiates</div></div>
      ${briefDec}
    </div>

    <!-- COUCHE 2 — ANALYSTE -->
    <div class="card" style="margin:0 0 14px;background:linear-gradient(135deg,#0a0f1c 0%,#060912 100%);border-color:#1e3a5f">
      <div class="card-hd"><h2 style="color:#93c5fd"><i class="fa-solid fa-microscope"></i> COUCHE 2 — ANALYSTE</h2><div class="help">Faits, incertitudes, hypothèses pondérées, indicateurs à surveiller</div></div>
      ${briefAna}
    </div>

    <!-- ═══ COUCHE 3 — STATUT LIVE DES INDICATEURS (croisement RSS automatique) ═══ -->
    ${liveSignals ? `<div class="card" style="margin:0 0 14px;background:linear-gradient(135deg,#0a1020 0%,#060912 100%);border-color:#fde047">
      <div class="card-hd"><h2 style="color:#fde047"><i class="fa-solid fa-tower-broadcast"></i> COUCHE 3 — STATUT LIVE DES INDICATEURS</h2><div class="help">Le système croise automatiquement chaque indicateur avec les articles RSS récents pour vous dire lesquels sont déjà allumés</div></div>
      ${liveSignals}
    </div>` : ''}

    <!-- ═══ COUCHE 4 — VEILLE RSS RÉCENTE ═══ -->
    <div class="card" style="margin:0 0 14px;background:linear-gradient(135deg,#0a1020 0%,#060912 100%);border-color:#22c55e">
      <div class="card-hd"><h2 style="color:#86efac"><i class="fa-solid fa-broadcast-tower"></i> COUCHE 4 — CITATIONS RSS LIVE</h2><div class="help">Les articles internationaux récents qui parlent de ce conflit, croisés avec ${(window.GW_DATA?.RSS_SOURCES_FULL?.length)||140}+ sources</div></div>
      ${articlesBlock}
    </div>

    <!-- ═══ COUCHE 5 — PISTES DE RECHERCHE ═══ -->
    ${researchAngles ? `<div class="card" style="margin:0 0 14px;background:linear-gradient(135deg,#0a1020 0%,#060912 100%);border-color:#60a5fa">
      <div class="card-hd"><h2 style="color:#93c5fd"><i class="fa-solid fa-lightbulb"></i> COUCHE 5 — PISTES DE RECHERCHE ANALYTIQUE</h2><div class="help">Questions stratégiques à creuser pour ce conflit, générées à partir de sa configuration</div></div>
      ${researchAngles}
    </div>` : ''}

    <!-- ═══ COUCHE 6 — ACTIONS OPÉRATIONNELLES BF ═══ -->
    ${operationalActions ? `<div class="card" style="margin:0 0 14px;background:linear-gradient(135deg,#1a1409 0%,#0e0a04 100%);border-color:#d97706">
      <div class="card-hd"><h2 style="color:#fde047"><i class="fa-solid fa-list-check"></i> COUCHE 6 — ACTIONS OPÉRATIONNELLES (volet Burkina Faso)</h2><div class="help">Recommandations concrètes triées par priorité urgente / haute / moyenne</div></div>
      ${operationalActions}
    </div>` : ''}

    <!-- Cross-ref : naviguer vers les autres pages liées -->
    <div class="card" style="margin:0">
      <div class="card-hd"><h2><i class="fa-solid fa-link"></i>Aller plus loin sur ce conflit</h2><div class="help">Toutes les sections du site liées à ${c.short||c.name}</div></div>
      ${crossRef}
    </div>
  `;
}

/* ============= SCÉNARIOS ============= */
function renderScenarios(){
  const d = DB.get();
  const sel = document.getElementById('scen-conflict');
  if(sel.options.length<=0){ const opt0=document.createElement('option'); opt0.value=''; opt0.textContent='— Tous (matrice globale) —'; sel.appendChild(opt0); d.conflicts.filter(c=>c.scenarios).forEach(c=>{ const o=document.createElement('option'); o.value=c.id; o.textContent=c.short||c.name; sel.appendChild(o); }); }
  const cid = sel.value;

  const wrap = document.getElementById('scen-content');

  // ═══ BANDEAU PÉDAGOGIQUE ═══
  pageIntroBanner('scen-content', {
    icon:'chess', color:'#a855f7', title:'Scénarios prospectifs',
    what:'Pour chaque conflit, on imagine 3 à 5 futurs possibles avec leur probabilité et leur gravité.',
    howToRead:[
      '<b style="color:#fde047">Probabilité (%)</b> : chance estimée que le scénario se réalise sur l\'horizon donné',
      '<b style="color:#fde047">Impact (/10)</b> : gravité des conséquences SI le scénario se produit',
      '<b style="color:#ef4444">Couleur rouge</b> = très probable · <b style="color:#f59e0b">orange</b> = possible · <b style="color:#22c55e">vert</b> = peu probable',
      '<b style="color:#fde047">⚡ Wild card</b> = scénario rare mais à fort impact (« cygne noir »)'
    ],
    takeaway:'Sur quoi le Burkina Faso doit-il se préparer en priorité ? On regarde d\'abord les scénarios à <b style="color:#ef4444">probabilité élevée × impact élevé</b>.'
  });

  if(cid){
    const c = d.conflicts.find(x=>x.id===cid); if(!c||!c.scenarios) return;

    // ═══ ENRICHISSEMENT GW_DEPTH : déclencheurs détectés sur RSS ═══
    const triggers = (typeof GW_DEPTH!=='undefined') ? GW_DEPTH.detectScenarioTriggers(c) : [];
    const triggersByScenario = {};
    triggers.forEach(t=>{ triggersByScenario[t.scenario.nom] = t; });

    // Préserver le bandeau, on n'écrase que le contenu après
    const banner = wrap.querySelector('.page-intro-banner');
    const articles14d = (typeof GW_DEPTH!=='undefined') ? GW_DEPTH.getConflictArticles(c.id, 14).length : 0;
    wrap.innerHTML = (banner?banner.outerHTML:'') + `
      <div style="border-left:4px solid ${conflictColor(c.intensity)};padding:10px 0 10px 14px;margin-bottom:14px;background:rgba(255,255,255,.02);border-radius:0 6px 6px 0">
        <div style="font-size:1.1rem;color:#e2e8f0;font-weight:700">${c.name}</div>
        <div style="font-size:.78rem;color:#94a3b8;margin-top:3px">${c.region} · ${c.scenarios.length} scénarios projetés · <span style="color:#86efac">${articles14d} articles RSS analysés (14 jours)</span></div>
        <div style="margin-top:8px;padding:7px 11px;background:rgba(96,165,250,.05);border-left:2px solid #60a5fa;font-size:.74rem;color:#cbd5e1;line-height:1.5;border-radius:0 4px 4px 0">
          <b style="color:#60a5fa">📌 Méthode :</b> Pour chaque scénario, le système analyse automatiquement les articles RSS récents et indique si <b style="color:#fde047">des déclencheurs sont détectés</b> ou non. Si oui, le scénario passe de « DORMANT » à « PARTIEL » ou « ACTIVÉ ».
        </div>
      </div>` + c.scenarios.map(s=>{
      // Récupérer les triggers GW_DEPTH pour ce scénario
      const trigger = triggersByScenario[s.nom];
      const probaCol = s.proba>=40?'#ef4444':s.proba>=20?'#f97316':s.proba>=10?'#f59e0b':'#22c55e';
      const probaLabel = s.proba>=40?'TRÈS PROBABLE':s.proba>=20?'PROBABLE':s.proba>=10?'POSSIBLE':'PEU PROBABLE';
      const impactLabel = s.impact>=8?'CRITIQUE':s.impact>=6?'ÉLEVÉ':s.impact>=4?'MODÉRÉ':'FAIBLE';
      const impactCol = s.impact>=8?'#ef4444':s.impact>=6?'#f97316':s.impact>=4?'#f59e0b':'#22c55e';
      const isWild = s.nom.toLowerCase().includes('wild');
      const priority = (s.proba>=40 && s.impact>=7) ? '🔴 PRIORITÉ MAXIMALE' : (s.impact>=7 && s.proba<40) ? '⚡ SURPRISE STRATÉGIQUE' : (s.proba>=40 && s.impact<5) ? '📊 BRUIT' : '';
      return `<div style="background:#0a0f1c;border:1px solid #1a2340;border-left:4px solid ${probaCol};border-radius:8px;padding:14px;margin-bottom:10px">
        ${priority?`<div style="display:inline-block;background:${probaCol}22;color:${probaCol};border:1px solid ${probaCol}66;padding:2px 9px;border-radius:11px;font-size:.62rem;font-weight:800;letter-spacing:1px;margin-bottom:8px">${priority}</div>`:''}
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:8px;flex-wrap:wrap">
          <div style="flex:1;min-width:200px">
            <div style="font-size:1.05rem;color:#e2e8f0;font-weight:700">${isWild?'⚡ ':''}${s.nom}</div>
            <div style="font-size:.72rem;color:#64748b;margin-top:2px"><i class="fa-solid fa-clock"></i> Horizon : <b style="color:#cbd5e1">${s.h}</b></div>
          </div>
          <div style="display:flex;gap:14px">
            <div style="text-align:center;background:#141c30;padding:6px 11px;border-radius:6px;border:1px solid ${probaCol}55">
              <div style="font-size:1.4rem;font-weight:800;color:${probaCol};line-height:1">${s.proba}<span style="font-size:.78rem;color:#64748b">%</span></div>
              <div style="font-size:.55rem;color:${probaCol};text-transform:uppercase;letter-spacing:.5px;font-weight:700;margin-top:2px">${probaLabel}</div>
            </div>
            <div style="text-align:center;background:#141c30;padding:6px 11px;border-radius:6px;border:1px solid ${impactCol}55">
              <div style="font-size:1.4rem;font-weight:800;color:${impactCol};line-height:1">${s.impact}<span style="font-size:.78rem;color:#64748b">/10</span></div>
              <div style="font-size:.55rem;color:${impactCol};text-transform:uppercase;letter-spacing:.5px;font-weight:700;margin-top:2px">IMPACT ${impactLabel}</div>
            </div>
          </div>
        </div>
        <div style="font-size:.86rem;color:#cbd5e1;line-height:1.6;background:rgba(255,255,255,.02);padding:8px 11px;border-radius:5px;border-left:2px solid ${probaCol}88;margin-bottom:8px">${s.d}</div>

        <!-- ═══ STATUT DU DÉCLENCHEUR (analyse RSS automatique) ═══ -->
        ${trigger ? `<div style="background:#0a0f1c;border:1px solid #1a2340;border-radius:5px;padding:9px 11px;margin-top:8px">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:5px">
            <div style="font-size:.66rem;color:#fde047;text-transform:uppercase;letter-spacing:.8px;font-weight:800"><i class="fa-solid fa-bolt"></i> Déclencheurs détectés sur RSS</div>
            ${(typeof GW_DEPTH!=='undefined') ? GW_DEPTH.statusBadge(trigger.triggerStatus) : ''}
          </div>
          ${trigger.articleCount>0 ? `
            <details><summary style="cursor:pointer;font-size:.7rem;color:#86efac;font-weight:600">${trigger.articleCount} article${trigger.articleCount>1?'s':''} récent${trigger.articleCount>1?'s':''} pourrai${trigger.articleCount>1?'ent':'t'} déclencher ce scénario</summary>
              <div style="margin-top:5px">${trigger.articles.map(a=>(typeof GW_DEPTH!=='undefined' ? GW_DEPTH.articleLine(a) : '')).join('')}</div>
            </details>` : `<div style="font-size:.7rem;color:#64748b;font-style:italic">Aucun signal récent compatible avec ce scénario — observation passive</div>`}
        </div>` : ''}
      </div>`;
    }).join('');
  } else {
    // Vue globale : liste tous conflits avec leurs scénarios
    const banner = wrap.querySelector('.page-intro-banner');
    wrap.innerHTML = (banner?banner.outerHTML:'') + d.conflicts.filter(c=>c.scenarios).map(c=>{
      const col = conflictColor(c.intensity);
      return `<div class="card" style="margin:0 0 12px"><div class="card-hd"><h2 style="color:${col}"><i class="fa-solid fa-fire"></i>${c.name}</h2><span style="font-size:.7rem;color:#64748b">${c.scenarios.length} scénarios</span></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px">
          ${c.scenarios.map(s=>{
            const pc = s.proba>=40?'#ef4444':s.proba>=20?'#f97316':s.proba>=10?'#f59e0b':'#22c55e';
            const probaLabel = s.proba>=40?'Très probable':s.proba>=20?'Probable':s.proba>=10?'Possible':'Peu probable';
            return `<div style="background:#0a0f1c;border:1px solid #1a2340;border-top:3px solid ${pc};border-radius:6px;padding:10px;cursor:pointer" onclick="document.getElementById('scen-conflict').value='${c.id}';renderScenarios();">
              <div style="font-size:.82rem;color:#e2e8f0;font-weight:700;margin-bottom:4px">${s.nom}</div>
              <div style="font-size:.66rem;color:#64748b;margin-bottom:7px"><i class="fa-solid fa-clock" style="font-size:.6rem"></i> ${s.h}</div>
              <div style="display:flex;justify-content:space-between;align-items:center;gap:6px">
                <div><span style="font-weight:800;color:${pc};font-size:1.1rem">${s.proba}%</span><div style="font-size:.6rem;color:${pc};font-weight:600">${probaLabel}</div></div>
                <div style="text-align:right"><span style="color:#cbd5e1;font-size:.8rem;font-weight:700">${s.impact}/10</span><div style="font-size:.6rem;color:#94a3b8">Impact</div></div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }).join('');
  }

  // Matrice scatter proba × impact
  const points = [];
  d.conflicts.filter(c=>c.scenarios).forEach(c=>{
    c.scenarios.forEach(s=>points.push({
      x:s.proba, y:s.impact,
      label:`${c.short||c.name} — ${s.nom}`,
      color:conflictColor(c.intensity),
      conflict: c.short||c.name,
      scenario: s.nom
    }));
  });
  const critical    = points.filter(p=>p.x>=40 && p.y>=7).length;
  const surveiller  = points.filter(p=>p.x<40 && p.y>=7).length;
  const bruit       = points.filter(p=>p.x>=40 && p.y<7).length;
  const negligeable = points.filter(p=>p.x<40 && p.y<7).length;

  // ═══ GUIDE PÉDAGOGIQUE MASSIF AU-DESSUS DE LA MATRICE ═══
  const matrixCanvas = document.getElementById('ch-scen-matrix');
  if(matrixCanvas){
    const card = matrixCanvas.closest('.card');
    if(card && !card.querySelector('.matrix-guide')){
      const guide = document.createElement('div');
      guide.className = 'matrix-guide';
      guide.style.cssText = 'margin-bottom:14px;background:linear-gradient(135deg,#0c1426 0%,#0a0f1c 100%);border:1px solid #1a2340;border-radius:6px;padding:13px 16px';
      guide.innerHTML = `
        <div style="font-size:.85rem;color:#e2e8f0;font-weight:700;margin-bottom:8px"><i class="fa-solid fa-graduation-cap" style="color:#fde047"></i> Comment lire ce graphique en 30 secondes</div>
        <div style="font-size:.78rem;color:#cbd5e1;line-height:1.6;margin-bottom:10px">
          Chaque <span style="display:inline-block;width:9px;height:9px;background:#94a3b8;border-radius:50%;vertical-align:middle"></span> <b>point représente un scénario possible</b>. Sa position sur les axes vous dit deux choses :
          <br>• <b style="color:#fde047">Axe horizontal (gauche → droite) :</b> probabilité que le scénario arrive (de 0% à 100%)
          <br>• <b style="color:#fde047">Axe vertical (bas → haut) :</b> gravité des conséquences SI le scénario arrive (de 0 à 10/10)
        </div>
        <div style="font-size:.78rem;color:#cbd5e1;line-height:1.55;margin-bottom:11px">
          Le graphique se lit comme une grille à <b>4 cadrans</b>. Voici ce que chaque coin signifie :
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:11px">
          <div style="background:rgba(239,68,68,.08);border:1px solid #7f1d1d;border-radius:5px;padding:9px 11px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-size:.7rem;color:#ef4444;text-transform:uppercase;letter-spacing:.8px;font-weight:800">↗ Coin haut-droite</span>
              <span style="font-size:1rem;color:#ef4444;font-weight:800">${critical}</span>
            </div>
            <div style="font-size:.74rem;color:#fca5a5;font-weight:700;margin-bottom:3px">🔴 SCÉNARIOS CRITIQUES</div>
            <div style="font-size:.72rem;color:#cbd5e1;line-height:1.4">Très probables (≥40%) ET très graves (≥7/10).<br><b style="color:#fca5a5">Action : à anticiper en priorité absolue.</b></div>
            <div style="font-size:.66rem;color:#94a3b8;margin-top:4px;font-style:italic">Ex : « offensive JNIM avant 2026 », « rupture monnaie F CFA »</div>
          </div>
          <div style="background:rgba(249,115,22,.08);border:1px solid #7c2d12;border-radius:5px;padding:9px 11px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-size:.7rem;color:#f97316;text-transform:uppercase;letter-spacing:.8px;font-weight:800">↖ Coin haut-gauche</span>
              <span style="font-size:1rem;color:#f97316;font-weight:800">${surveiller}</span>
            </div>
            <div style="font-size:.74rem;color:#fdba74;font-weight:700;margin-bottom:3px">⚡ SURPRISES STRATÉGIQUES</div>
            <div style="font-size:.72rem;color:#cbd5e1;line-height:1.4">Peu probables (&lt;40%) MAIS très graves (≥7/10).<br><b style="color:#fdba74">Action : « cygnes noirs » à monitorer.</b></div>
            <div style="font-size:.66rem;color:#94a3b8;margin-top:4px;font-style:italic">Ex : « front uni jihadiste », « coup d'État côte d'Ivoire »</div>
          </div>
          <div style="background:rgba(245,158,11,.06);border:1px solid #78350f;border-radius:5px;padding:9px 11px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-size:.7rem;color:#f59e0b;text-transform:uppercase;letter-spacing:.8px;font-weight:800">↘ Coin bas-droite</span>
              <span style="font-size:1rem;color:#f59e0b;font-weight:800">${bruit}</span>
            </div>
            <div style="font-size:.74rem;color:#fcd34d;font-weight:700;margin-bottom:3px">📊 BRUIT</div>
            <div style="font-size:.72rem;color:#cbd5e1;line-height:1.4">Très probables (≥40%) MAIS peu graves (&lt;7/10).<br><b style="color:#fcd34d">Action : à connaître mais pas urgent.</b></div>
            <div style="font-size:.66rem;color:#94a3b8;margin-top:4px;font-style:italic">Ex : « tensions diplomatiques continues », « manifestations »</div>
          </div>
          <div style="background:rgba(34,197,94,.06);border:1px solid #14532d;border-radius:5px;padding:9px 11px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-size:.7rem;color:#22c55e;text-transform:uppercase;letter-spacing:.8px;font-weight:800">↙ Coin bas-gauche</span>
              <span style="font-size:1rem;color:#22c55e;font-weight:800">${negligeable}</span>
            </div>
            <div style="font-size:.74rem;color:#86efac;font-weight:700;margin-bottom:3px">✓ NÉGLIGEABLES</div>
            <div style="font-size:.72rem;color:#cbd5e1;line-height:1.4">Peu probables (&lt;40%) ET peu graves (&lt;7/10).<br><b style="color:#86efac">Action : à laisser de côté pour l'instant.</b></div>
            <div style="font-size:.66rem;color:#94a3b8;margin-top:4px;font-style:italic">Ex : « scénarios spéculatifs », « bruits de couloir »</div>
          </div>
        </div>
        <div style="background:rgba(96,165,250,.06);border:1px solid rgba(96,165,250,.3);border-radius:5px;padding:9px 11px;font-size:.74rem;color:#cbd5e1;line-height:1.5">
          <b style="color:#60a5fa">💡 Astuce :</b> survolez chaque point avec votre souris pour voir le nom du conflit, le scénario, la probabilité et l'impact exacts. La couleur du point reflète l'<b style="color:#fde047">intensité actuelle du conflit parent</b> (rouge = conflit chaud, vert = froid).
        </div>`;
      // Insertion juste avant le canvas
      const chartBox = matrixCanvas.closest('.chart-box') || matrixCanvas.parentElement;
      if(chartBox && chartBox.parentElement===card){
        card.insertBefore(guide, chartBox);
      } else {
        card.insertBefore(guide, card.firstChild?.nextSibling || card.firstChild);
      }
    }
  }

  makeChart('ch-scen-matrix',{
    type:'scatter',
    data:{datasets:points.map(p=>({label:p.label,data:[{x:p.x,y:p.y}],backgroundColor:p.color,borderColor:p.color,pointRadius:8,pointHoverRadius:12}))},
    options:{responsive:true,maintainAspectRatio:false,plugins:{
      legend:{display:false},
      tooltip:{
        callbacks:{
          title:(ctx)=>ctx[0].dataset.label,
          label:(ctx)=>{
            const x=ctx.parsed.x, y=ctx.parsed.y;
            const cadran = (x>=40 && y>=7)?'🔴 CRITIQUE — anticiper en priorité' : (x<40 && y>=7)?'⚡ SURPRISE STRATÉGIQUE — à monitorer' : (x>=40 && y<7)?'📊 BRUIT — à connaître' : '✓ NÉGLIGEABLE — pas urgent';
            return [`Probabilité : ${x}%`, `Impact : ${y}/10`, ``, cadran];
          }
        },
        backgroundColor:'#0c1426',titleColor:'#e2e8f0',bodyColor:'#cbd5e1',borderColor:'#2a3a60',borderWidth:1,padding:11
      }
    },scales:{
      x:{title:axT('PROBABILITÉ (%) — chance que le scénario arrive →'),min:0,max:100,grid:{color:'rgba(26,35,64,.4)'},ticks:{color:'#64748b'}},
      y:{title:axT('IMPACT (/10) — gravité si le scénario arrive ↑'),min:0,max:10,grid:{color:'rgba(26,35,64,.4)'},ticks:{color:'#64748b'}}
    }}
  });
  chartInsight('ch-scen-matrix',
    `Voir l'encart pédagogique au-dessus du graphique. <b>Méthode</b> : Godet à 4 cadrans, abondamment utilisée dans les think tanks (RAND, IRIS, ICG).`,
    `<b>${points.length}</b> scénarios projetés au total. <b style="color:#ef4444">${critical}</b> dans le coin <b>CRITIQUE</b> (haut-droite) — c'est ce qu'il faut anticiper. <b style="color:#f97316">${surveiller}</b> dans le coin <b>SURPRISES</b> (haut-gauche) — à monitorer.`,
    critical>0?'#ef4444':'#f59e0b',
    critical>0 ? `🔴 <b>${critical} scénario${critical>1?'s':''} dans la zone critique du graphique.</b> Ce sont les développements à anticiper EN PRIORITÉ pour le Burkina Faso.` : (surveiller>0 ? `⚡ <b>${surveiller} surprise${surveiller>1?'s':''} stratégique${surveiller>1?'s':''} à monitorer</b> : peu probables mais à très fort impact.` : `Aucun scénario dans la zone critique. La situation reste sous contrôle anticipatoire.`));
}

/* ============= INDICATEURS À SURVEILLER ============= */
/* ============= RECONFIGURATIONS STRATÉGIQUES ============= */
function renderReconfig(){
  const recs = (window.GW_DATA && window.GW_DATA.RECONFIGURATIONS) || [];
  const palette = ['#ef4444','#f97316','#a78bfa','#60a5fa','#22c55e','#06b6d4'];
  const wrap = document.getElementById('reconfig-content');
  if(!wrap) return;
  wrap.innerHTML = '';

  // ═══ BANDEAU PÉDAGOGIQUE ═══
  pageIntroBanner('reconfig-content', {
    icon:'arrows-spin', color:'#06b6d4', title:'Reconfigurations stratégiques',
    what:'Les grands basculements d\'équilibres internationaux qui redessinent l\'ordre mondial — et leur effet sur le Burkina Faso.',
    howToRead:[
      'Une <b style="color:#06b6d4">reconfiguration</b> = un changement profond et durable de l\'architecture géopolitique (ex : sortie CEDEAO, BRICS+, recul français)',
      '<b style="color:#fde047">Niveau</b> indique l\'ampleur : <span style="color:#06b6d4">mineure</span> (régionale) → <span style="color:#a78bfa">majeure</span> (continentale) → <span style="color:#ef4444">structurelle</span> (mondiale)',
      '<b style="color:#fde047">Horizon</b> = délai d\'effet : court (mois) / moyen (1-3 ans) / long (5+ ans)',
      'Chaque fiche détaille les <b style="color:#fde047">conséquences attendues</b> et la <b style="color:#fde047">pertinence pour le Burkina Faso</b>'
    ],
    takeaway:'Quels sont les bouleversements en cours dans le monde et que signifient-ils concrètement pour notre pays ?'
  });

  if(!recs.length){
    wrap.insertAdjacentHTML('beforeend','<div class="empty"><p>Pas de reconfiguration documentée.</p></div>');
    return;
  }

  // ═══ ENRICHISSEMENT GW_DEPTH : pour chaque reconfig, compter articles RSS pertinents ═══
  const items = (window.NEWS_STATE?.items)||[];
  const week = items.filter(it=>it.pubDate && (Date.now()-new Date(it.pubDate))/86400000 < 14);

  const html = recs.map((r,i)=>{
    const col = palette[i%palette.length];

    // Détecter articles RSS qui matérialisent cette reconfiguration
    const titreKeywords = (r.titre||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').split(/\s+/).filter(w=>w.length>=5).slice(0,5);
    const matched = week.filter(a=>{
      const txt = ((a.title||'')+' '+(a.description||'')).toLowerCase();
      return titreKeywords.filter(k=>txt.includes(k)).length>=2;
    }).slice(0,4);

    // Phase d'avancement (heuristique simple)
    const phase = matched.length>=4 ? {label:'EN ACCÉLÉRATION', color:'#ef4444', desc:'Plusieurs articles récents confirment'} :
                  matched.length>=1 ? {label:'EN COURS', color:'#f59e0b', desc:'Phénomène actif sur le RSS'} :
                  {label:'LATENT', color:'#64748b', desc:'Aucun signal RSS récent'};

    return `<div class="card" style="margin:0 0 12px;border-left:4px solid ${col}">
      <div class="card-hd"><h2 style="color:${col}"><i class="fa-solid fa-arrows-spin"></i>${r.titre}</h2>
        <div style="display:flex;gap:5px;flex-wrap:wrap">
          <span class="chip gray" title="Horizon temporel"><i class="fa-solid fa-clock" style="font-size:.6rem"></i> ${r.h}</span>
          <span class="chip" style="background:${col}22;color:${col};border:1px solid ${col}55" title="Ampleur de la reconfiguration"><i class="fa-solid fa-layer-group" style="font-size:.6rem"></i> ${r.niveau}</span>
          <span class="chip" style="background:${phase.color}22;color:${phase.color};border:1px solid ${phase.color}66;font-weight:800;font-size:.62rem" title="${phase.desc}">${phase.label}</span>
        </div></div>
      <div style="font-size:.66rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;font-weight:700"><i class="fa-solid fa-quote-left"></i> Description du phénomène</div>
      <div style="font-size:.88rem;color:#cbd5e1;line-height:1.65;margin-bottom:12px;padding:9px 12px;background:rgba(255,255,255,.02);border-left:2px solid ${col}66;border-radius:0 5px 5px 0">${r.description}</div>
      <div style="background:#0a0f1c;padding:11px 13px;border-radius:6px;border:1px solid #1a2340;margin-bottom:10px">
        <div style="font-size:.7rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;font-weight:700"><i class="fa-solid fa-bolt"></i> Conséquences attendues</div>
        <ul style="list-style:none;padding:0;margin:0">${r.consequences.map(c=>`<li style="padding:4px 0;color:#cbd5e1;font-size:.84rem;line-height:1.55;border-bottom:1px solid #141c30">→ ${c}</li>`).join('')}</ul>
      </div>
      <div style="background:rgba(253,224,71,.06);border:1px solid rgba(253,224,71,.3);padding:10px 13px;border-radius:6px;margin-bottom:10px">
        <div style="font-size:.7rem;color:#fde047;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;font-weight:700"><i class="fa-solid fa-flag-checkered"></i> Pertinence pour le Burkina Faso</div>
        <div style="font-size:.86rem;color:#cbd5e1;line-height:1.55">${r.pertinence_bf}</div>
      </div>
      <!-- Veille RSS qui matérialise la reconfiguration -->
      ${matched.length ? `
        <div style="background:#0a0f1c;border:1px solid #1a2340;border-radius:6px;padding:10px 12px">
          <div style="font-size:.7rem;color:#86efac;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;font-weight:700"><i class="fa-solid fa-broadcast-tower"></i> Articles RSS qui matérialisent cette reconfiguration (14 j)</div>
          ${matched.map(a=>(typeof GW_DEPTH!=='undefined'?GW_DEPTH.articleLine(a):'')).join('')}
        </div>` : `
        <div style="background:#0a0f1c;border:1px dashed #1a2340;border-radius:5px;padding:9px 12px;font-size:.74rem;color:#64748b;font-style:italic">
          Aucun article RSS récent ne matérialise directement cette reconfiguration. Le phénomène reste latent ou diffus dans la couverture.
        </div>`}
    </div>`;
  }).join('');
  wrap.insertAdjacentHTML('beforeend', html);
}

/* ============= IMPACTS BURKINA FASO ============= */
function renderImpactBF(){
  const d = DB.get();
  const sel = document.getElementById('bf-conflict');
  if(sel.options.length<=0){ d.conflicts.filter(c=>c.impact_bf).forEach((c,i)=>{ const o=document.createElement('option'); o.value=c.id; o.textContent=c.short||c.name; if(i===0) o.selected=true; sel.appendChild(o); }); }
  const cid = sel.value || (d.conflicts.find(c=>c.impact_bf)?.id);
  const wrap = document.getElementById('bf-content');

  // ═══ BANDEAU PÉDAGOGIQUE ═══
  pageIntroBanner('bf-content', {
    icon:'flag-checkered', color:'#fde047', title:'Impacts sur le Burkina Faso',
    what:'Pour chaque grand conflit mondial, on analyse comment il affecte concrètement le Burkina Faso, dimension par dimension.',
    howToRead:[
      '<b style="color:#ef4444">Sécuritaire</b> : risques d\'attaques, instabilité frontière, recrutement jihadiste',
      '<b style="color:#f59e0b">Économique</b> : prix, marchés, exportations, importations, recettes État',
      '<b style="color:#60a5fa">Diplomatique</b> : alliances, isolement, leviers de négociation',
      '<b style="color:#a78bfa">Sociopolitique</b> : opinion publique, tensions internes, mobilisations',
      '<b style="color:#fde047">Pertinence</b> : faible / moyenne / élevée / critique selon l\'effet attendu'
    ],
    takeaway:'Quel impact concret cet événement mondial a-t-il sur la vie quotidienne et les politiques publiques au Burkina Faso ?'
  });

  if(!cid){ wrap.insertAdjacentHTML('beforeend','<div class="empty"><p>Aucune analyse d\'impact disponible.</p></div>'); return; }
  const c = d.conflicts.find(x=>x.id===cid); if(!c||!c.impact_bf){ wrap.insertAdjacentHTML('beforeend','<div class="empty"><p>Pas de fiche d\'impact pour ce conflit.</p></div>'); return; }

  // Préserver le bandeau, remplacer le reste
  const banner = wrap.querySelector('.page-intro-banner');
  wrap.innerHTML = (banner?banner.outerHTML:'') + renderBFPanel(c);
}

function renderBFPanel(c){
  const i = c.impact_bf; if(!i) return '';
  const dim = (icon, color, title, items, explanation)=>`<div style="background:#0a0f1c;border:1px solid #1a2340;border-left:4px solid ${color};border-radius:8px;padding:14px;margin-bottom:10px">
    <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:9px;flex-wrap:wrap">
      <i class="fa-solid ${icon}" style="color:${color};font-size:1.2rem;margin-top:2px"></i>
      <div style="flex:1;min-width:200px">
        <h3 style="font-size:1rem;color:#e2e8f0;font-weight:700">${title}</h3>
        <div style="font-size:.7rem;color:${color};font-style:italic">${explanation}</div>
      </div>
      <span class="chip" style="background:${color}22;color:${color};border:1px solid ${color}55;font-size:.65rem;font-weight:700">${items.length} effet${items.length>1?'s':''}</span>
    </div>
    ${items.length ? `<ul style="list-style:none;padding:0;margin:0">${items.map(x=>`<li style="padding:6px 0;color:#cbd5e1;font-size:.86rem;line-height:1.55;border-bottom:1px solid #141c30">→ ${x}</li>`).join('')}</ul>` : '<div style="color:#64748b;font-size:.78rem;font-style:italic">Pas d\'effet identifié sur cette dimension</div>'}
  </div>`;

  // Récupérer la note synthèse (compatibilité ancienne et nouvelle structure)
  const synthese = (typeof _impactBFSynthese==='function')? _impactBFSynthese(c) : (i.note_synthese || '');
  const pertinenceCol = i.pertinence==='critique'?'#ef4444':i.pertinence==='élevée'?'#f97316':i.pertinence==='moyenne'?'#f59e0b':'#22c55e';

  return `
    <!-- En-tête conflit + pertinence -->
    <div style="border-left:4px solid ${conflictColor(c.intensity)};padding:10px 0 10px 14px;margin-bottom:14px;background:rgba(253,224,71,.04);border-radius:0 6px 6px 0">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">
        <div>
          <div style="font-size:1.15rem;color:#e2e8f0;font-weight:700">${c.name}</div>
          <div style="font-size:.78rem;color:#94a3b8;margin-top:3px">${c.region} • ${statusChip(c.status)} • Intensité ${c.intensity}/10</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:.6rem;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;font-weight:700">Pertinence pour le BF</div>
          <span class="chip" style="background:${pertinenceCol}22;color:${pertinenceCol};border:1px solid ${pertinenceCol}66;font-size:.78rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;padding:3px 11px;margin-top:3px;display:inline-block">${i.pertinence||'—'}</span>
        </div>
      </div>
      ${synthese ? `<div style="margin-top:12px;padding:10px 12px;background:rgba(0,0,0,.3);border-left:2px solid #fde047;border-radius:0 4px 4px 0">
        <div style="font-size:.62rem;color:#fde047;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:3px"><i class="fa-solid fa-quote-left"></i> Synthèse</div>
        <div style="font-size:.88rem;color:#e2e8f0;line-height:1.55">${synthese}</div>
      </div>` : ''}
    </div>

    <!-- 4 dimensions d'impact -->
    <div style="font-size:.7rem;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:10px"><i class="fa-solid fa-layer-group"></i> Effets par dimension</div>
    ${dim('fa-shield-halved','#ef4444','1. Dimension sécuritaire', i.securitaire||[],'Risques d\'attaques, frontières, recrutement jihadiste, exactions')}
    ${dim('fa-coins','#f59e0b','2. Dimension économique', i.economique||[],'Prix, marchés, recettes État, exportations, importations, dette')}
    ${dim('fa-handshake','#60a5fa','3. Dimension diplomatique', i.diplomatique||[],'Alliances, isolement, partenariats, levées de sanctions')}
    ${dim('fa-users','#a78bfa','4. Dimension sociopolitique', i.sociopolitique||[],'Opinion publique, tensions internes, mobilisations, identité')}

    <!-- Indicateurs à surveiller -->
    <div class="card" style="margin:0 0 14px;background:#0a0f1c">
      <div class="card-hd">
        <h2><i class="fa-solid fa-binoculars"></i>Indicateurs Burkina Faso à surveiller</h2>
        <div class="help">Signaux précis à surveiller pour anticiper les retombées</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">
        ${(i.indicateurs_bf||[]).map(x=>{
          const c2 = x.h.includes('24')?'#ef4444':x.h.includes('7')?'#60a5fa':'#a78bfa';
          const lbl = x.h.includes('24')?'COURT TERME':x.h.includes('7')?'MOYEN TERME':'LONG TERME';
          return `<div style="background:#0a0f1c;border:1px solid #1a2340;border-top:3px solid ${c2};border-radius:6px;padding:11px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
              <span style="font-size:.62rem;color:${c2};text-transform:uppercase;letter-spacing:1px;font-weight:800">${lbl}</span>
              <span style="font-size:.7rem;color:${c2};font-weight:700">${x.h}</span>
            </div>
            <div style="font-size:.82rem;color:#cbd5e1;line-height:1.5">${x.v}</div>
          </div>`;
        }).join('') || '<div style="color:#64748b;font-size:.78rem">Aucun indicateur défini pour ce conflit</div>'}
      </div>
    </div>

    <!-- ═══ COUCHE PROFONDE — RSS croisé en temps réel ═══ -->
    ${(typeof GW_DEPTH!=='undefined') ? `
      <div class="card" style="margin:0 0 14px;background:linear-gradient(135deg,#0a1020 0%,#060912 100%);border-color:#22c55e">
        <div class="card-hd"><h2 style="color:#86efac"><i class="fa-solid fa-broadcast-tower"></i>Articles RSS récents qui matérialisent l'impact</h2><div class="help">Sources internationales croisées sur les 7 derniers jours pour ce conflit</div></div>
        ${GW_DEPTH.recentArticlesBlock(c.id, 7, 6)}
      </div>

      <!-- ═══ Actions opérationnelles BF ═══ -->
      <div class="card" style="margin:0 0 14px;background:linear-gradient(135deg,#1a1409 0%,#0e0a04 100%);border-color:#d97706">
        <div class="card-hd"><h2 style="color:#fde047"><i class="fa-solid fa-list-check"></i>Actions opérationnelles à activer côté BF</h2><div class="help">Recommandations triées par priorité urgente / haute / moyenne</div></div>
        ${GW_DEPTH.actionsBlock(c)}
      </div>

      <!-- ═══ Cross-références ═══ -->
      <div class="card" style="margin:0">
        <div class="card-hd"><h2><i class="fa-solid fa-link"></i>Aller plus loin sur ce conflit</h2></div>
        ${GW_DEPTH.crossRefBlock(c)}
      </div>
    ` : ''}
  `;
}

function renderIndicators(){
  const d = DB.get();
  const conflicts = d.conflicts.filter(c=>c.brief_analyste);
  const wrap = document.getElementById('indic-content');
  if(!wrap) return;
  wrap.innerHTML='';

  // ═══ BANDEAU PÉDAGOGIQUE ═══
  pageIntroBanner('indic-content', {
    icon:'binoculars', color:'#60a5fa', title:'Indicateurs à surveiller',
    what:'Quels signaux précis surveiller pour détecter à l\'avance qu\'un conflit s\'aggrave ou évolue ?',
    howToRead:[
      '<b style="color:#ef4444">Court terme (24-72 h)</b> : signaux d\'alerte immédiats, à vérifier chaque jour',
      '<b style="color:#60a5fa">Moyen terme (7-30 j)</b> : tendances à confirmer sur quelques semaines',
      'Pour chaque conflit, on liste les <b style="color:#fde047">événements précis</b> à monitorer (ex : « manifestations à Bamako », « cours de l\'or », « rappel d\'ambassadeur »)',
      'Si un signal s\'allume, c\'est qu\'un changement majeur est en cours <b style="color:#fde047">et que le BF doit en tenir compte rapidement</b>'
    ],
    takeaway:'Quels indicateurs concrets dois-je surveiller cette semaine pour ne pas être surpris ?'
  });

  if(!conflicts.length){
    wrap.insertAdjacentHTML('beforeend','<div class="empty"><i class="fa-solid fa-inbox"></i><p>Aucun indicateur défini.</p></div>');
    return;
  }

  // Statistique en tête
  const total24h = conflicts.filter(c=>c.brief_analyste.indicateurs_24_72h).length;
  const total7d  = conflicts.filter(c=>c.brief_analyste.indicateurs_7_30j).length;
  wrap.insertAdjacentHTML('beforeend',`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-bottom:14px">
    <div style="background:#0a0f1c;border:1px solid #1a2340;border-left:3px solid #ef4444;border-radius:5px;padding:10px 13px">
      <div style="font-size:.6rem;color:#ef4444;text-transform:uppercase;letter-spacing:1px;font-weight:800"><i class="fa-solid fa-stopwatch"></i> Court terme</div>
      <div style="font-size:1.6rem;color:#ef4444;font-weight:800">${total24h}</div>
      <div style="font-size:.7rem;color:#94a3b8">conflits avec signaux 24-72 h</div>
    </div>
    <div style="background:#0a0f1c;border:1px solid #1a2340;border-left:3px solid #60a5fa;border-radius:5px;padding:10px 13px">
      <div style="font-size:.6rem;color:#60a5fa;text-transform:uppercase;letter-spacing:1px;font-weight:800"><i class="fa-solid fa-calendar-week"></i> Moyen terme</div>
      <div style="font-size:1.6rem;color:#60a5fa;font-weight:800">${total7d}</div>
      <div style="font-size:.7rem;color:#94a3b8">conflits avec signaux 7-30 j</div>
    </div>
    <div style="background:#0a0f1c;border:1px solid #1a2340;border-left:3px solid #a78bfa;border-radius:5px;padding:10px 13px">
      <div style="font-size:.6rem;color:#a78bfa;text-transform:uppercase;letter-spacing:1px;font-weight:800"><i class="fa-solid fa-list-check"></i> Total</div>
      <div style="font-size:1.6rem;color:#a78bfa;font-weight:800">${conflicts.length}</div>
      <div style="font-size:.7rem;color:#94a3b8">conflits sous surveillance</div>
    </div>
  </div>`);

  // ═══ ENRICHISSEMENT GW_DEPTH : compter les conflits avec signaux activés ═══
  let activatedCount = 0, monitoringCount = 0;
  if(typeof GW_DEPTH!=='undefined'){
    conflicts.forEach(c=>{
      const sigs = GW_DEPTH.detectActiveSignals(c);
      if(sigs.some(s=>s.status==='activated')) activatedCount++;
      else if(sigs.some(s=>s.status==='monitoring')) monitoringCount++;
    });
    // Insérer un panneau de synthèse "live" supplémentaire
    wrap.insertAdjacentHTML('beforeend',`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-bottom:14px">
      <div style="background:#0a0f1c;border:1px solid #7f1d1d;border-left:3px solid #ef4444;border-radius:5px;padding:10px 13px">
        <div style="font-size:.6rem;color:#ef4444;text-transform:uppercase;letter-spacing:1px;font-weight:800"><i class="fa-solid fa-bell"></i> 🔴 Activés maintenant</div>
        <div style="font-size:1.6rem;color:#ef4444;font-weight:800">${activatedCount}</div>
        <div style="font-size:.7rem;color:#94a3b8">conflits avec signal allumé sur RSS</div>
      </div>
      <div style="background:#0a0f1c;border:1px solid #7c2d12;border-left:3px solid #f59e0b;border-radius:5px;padding:10px 13px">
        <div style="font-size:.6rem;color:#f59e0b;text-transform:uppercase;letter-spacing:1px;font-weight:800"><i class="fa-solid fa-magnifying-glass"></i> 🟡 En monitoring</div>
        <div style="font-size:1.6rem;color:#f59e0b;font-weight:800">${monitoringCount}</div>
        <div style="font-size:.7rem;color:#94a3b8">conflits avec activité RSS partielle</div>
      </div>
      <div style="background:#0a0f1c;border:1px solid #1a2340;border-left:3px solid #64748b;border-radius:5px;padding:10px 13px">
        <div style="font-size:.6rem;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:800"><i class="fa-solid fa-circle"></i> ⚪ Calmes</div>
        <div style="font-size:1.6rem;color:#64748b;font-weight:800">${conflicts.length-activatedCount-monitoringCount}</div>
        <div style="font-size:.7rem;color:#94a3b8">conflits sans signal détecté</div>
      </div>
    </div>`);
  }

  const html = conflicts.map(c=>{
    const b = c.brief_analyste; const col = conflictColor(c.intensity);
    // Statut live des signaux pour ce conflit
    const signals = (typeof GW_DEPTH!=='undefined') ? GW_DEPTH.detectActiveSignals(c) : [];
    const signalCT = signals.find(s=>s.horizon==='24-72 h');
    const signalMT = signals.find(s=>s.horizon==='7-30 j');
    const liveSignalsBlock = (typeof GW_DEPTH!=='undefined') ? GW_DEPTH.liveSignalsBlock(c) : '';

    return `<div class="card" style="margin:0 0 12px;border-left:4px solid ${col}">
      <div class="card-hd">
        <h2><i class="fa-solid fa-fire"></i>${c.name}</h2>
        <div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap">
          <span style="font-size:.7rem;color:#94a3b8">${c.region}</span>
          <span class="chip" style="background:${col}22;color:${col};border:1px solid ${col}55;font-size:.62rem;font-weight:700">Intensité ${c.intensity}/10</span>
          ${signalCT ? (typeof GW_DEPTH!=='undefined' ? `<span style="font-size:.6rem">CT</span>` + GW_DEPTH.statusBadge(signalCT.status) : '') : ''}
          ${signalMT ? (typeof GW_DEPTH!=='undefined' ? `<span style="font-size:.6rem">MT</span>` + GW_DEPTH.statusBadge(signalMT.status) : '') : ''}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
        <div style="background:#0a0f1c;padding:11px 13px;border-radius:6px;border:1px solid #1a2340;border-left:3px solid #ef4444">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;flex-wrap:wrap;gap:6px">
            <span style="font-size:.66rem;color:#ef4444;text-transform:uppercase;letter-spacing:1px;font-weight:800"><i class="fa-solid fa-stopwatch"></i> Court terme · 24-72 h</span>
            ${signalCT && typeof GW_DEPTH!=='undefined' ? GW_DEPTH.statusBadge(signalCT.status) : ''}
          </div>
          <div style="font-size:.84rem;color:#cbd5e1;line-height:1.55;margin-bottom:6px">${b.indicateurs_24_72h||'<span style="color:#64748b;font-style:italic">Aucun signal court terme défini</span>'}</div>
          ${signalCT && signalCT.articleCount>0 ? `<details><summary style="cursor:pointer;font-size:.66rem;color:#60a5fa;font-weight:600">${signalCT.articleCount} article${signalCT.articleCount>1?'s':''} corrobore${signalCT.articleCount>1?'nt':''}</summary><div style="margin-top:4px">${signalCT.articles.map(a=>(typeof GW_DEPTH!=='undefined'?GW_DEPTH.articleLine(a):'')).join('')}</div></details>` : ''}
        </div>
        <div style="background:#0a0f1c;padding:11px 13px;border-radius:6px;border:1px solid #1a2340;border-left:3px solid #60a5fa">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;flex-wrap:wrap;gap:6px">
            <span style="font-size:.66rem;color:#60a5fa;text-transform:uppercase;letter-spacing:1px;font-weight:800"><i class="fa-solid fa-calendar-week"></i> Moyen terme · 7-30 j</span>
            ${signalMT && typeof GW_DEPTH!=='undefined' ? GW_DEPTH.statusBadge(signalMT.status) : ''}
          </div>
          <div style="font-size:.84rem;color:#cbd5e1;line-height:1.55;margin-bottom:6px">${b.indicateurs_7_30j||'<span style="color:#64748b;font-style:italic">Aucun signal moyen terme défini</span>'}</div>
          ${signalMT && signalMT.articleCount>0 ? `<details><summary style="cursor:pointer;font-size:.66rem;color:#60a5fa;font-weight:600">${signalMT.articleCount} article${signalMT.articleCount>1?'s':''} corrobore${signalMT.articleCount>1?'nt':''}</summary><div style="margin-top:4px">${signalMT.articles.map(a=>(typeof GW_DEPTH!=='undefined'?GW_DEPTH.articleLine(a):'')).join('')}</div></details>` : ''}
        </div>
      </div>
      <!-- Bouton accès rapide -->
      <button class="btn ghost sm" onclick="Router.go('briefs');setTimeout(()=>{const s=document.getElementById('brief-conflict');if(s){s.value='${c.id}';renderBriefs();}},80)" style="font-size:.68rem"><i class="fa-solid fa-arrow-right"></i> Voir le brief complet de ce conflit</button>
    </div>`;
  }).join('');
  wrap.insertAdjacentHTML('beforeend', html);
}

/* ============= ANALYSES ============= */
let AN_STATE = { period:'month', conflict:'' };
function renderAnalyses(){
  const d = DB.get();
  const sel = document.getElementById('an-conflict');
  if(sel.options.length<=1){ d.conflicts.forEach(c=>{const o=document.createElement('option'); o.value=c.id; o.textContent=c.short||c.name; sel.appendChild(o);}); }

  // ═══ BANDEAU PÉDAGOGIQUE ═══
  pageIntroBanner('analyses-page', {
    icon:'chart-line', color:'#22c55e', title:'Analyses quantitatives',
    what:'Vue chiffrée et graphique des dynamiques de conflit : combien d\'événements ? où ? quand ? avec quelle gravité ?',
    howToRead:[
      '<b style="color:#fde047">4 indicateurs clés</b> en haut : nombre total de jalons recensés, événements de la dernière période, ruptures majeures, sévérité moyenne',
      '<b style="color:#fde047">Évolution temporelle</b> : montre si l\'activité s\'accélère ou se stabilise (filtres Jour/Semaine/Mois)',
      '<b style="color:#fde047">Distribution de sévérité</b> : combien d\'événements faibles vs critiques',
      '<b style="color:#fde047">Heatmap</b> : intensité par conflit et par semaine — repère les périodes chaudes',
      '<b style="color:#fde047">Radar</b> : comparaison côte-à-côte des 5 conflits les plus intenses'
    ],
    takeaway:'Y a-t-il une accélération des tensions ? Quels conflits dominent l\'attention ? Où concentrer la veille ?'
  });

  const evs = AN_STATE.conflict ? d.events.filter(e=>e.conflict_id===AN_STATE.conflict) : d.events;
  const now = new Date();
  let periods=[];
  if(AN_STATE.period==='day'){ for(let i=29;i>=0;i--){const s=new Date(now); s.setDate(s.getDate()-i); s.setHours(0,0,0,0); const e=new Date(s); e.setHours(23,59,59,999); periods.push({label:fmt.dateShort(s),s,e});} }
  else if(AN_STATE.period==='week'){ for(let i=11;i>=0;i--){const s=new Date(now); s.setDate(s.getDate()-i*7-6); s.setHours(0,0,0,0); const e=new Date(s); e.setDate(e.getDate()+6); e.setHours(23,59,59,999); periods.push({label:'S'+(12-i),s,e});} }
  else { for(let i=23;i>=0;i--){const s=new Date(now.getFullYear(),now.getMonth()-i,1); const e=new Date(now.getFullYear(),now.getMonth()-i+1,0,23,59,59); periods.push({label:s.toLocaleDateString('fr-FR',{month:'short',year:'2-digit'}),s,e});} }

  const byPeriod = periods.map(p=>evs.filter(e=>{const t=new Date(e.date); return t>=p.s && t<=p.e;}));
  const totalEv = evs.length, last=byPeriod.at(-1).length, prev=byPeriod.at(-2)?.length||0;
  const ruptures = evs.filter(e=>e.rupture).length;
  const avgSev = evs.length ? (evs.reduce((s,e)=>s+e.severity,0)/evs.length).toFixed(1) : 0;

  document.getElementById('an-kpi').innerHTML = `
    <div class="stat blue"><i class="stat-icon fa-solid fa-database"></i><div><div class="stat-val">${totalEv}</div><div class="stat-lbl">Jalons recensés</div></div></div>
    <div class="stat orange"><i class="stat-icon fa-solid fa-chart-simple"></i><div><div class="stat-val">${last}</div><div class="stat-lbl">Dernière période</div></div></div>
    <div class="stat red"><i class="stat-icon fa-solid fa-exclamation"></i><div><div class="stat-val">${ruptures}</div><div class="stat-lbl">Seuils de rupture</div></div></div>
    <div class="stat purple"><i class="stat-icon fa-solid fa-gauge-high"></i><div><div class="stat-val">${avgSev}</div><div class="stat-lbl">Sévérité moyenne</div></div></div>`;

  // ═══ DÉTECTION D'ANOMALIES & INSIGHTS AUTO ═══
  // Analyse interprétative des chiffres pour générer des insights actionnables
  const insights = [];
  const lastValue = byPeriod.at(-1).length;
  const prev3 = byPeriod.slice(-4,-1).map(p=>p.length);
  const avg3 = prev3.length ? prev3.reduce((a,b)=>a+b,0)/prev3.length : 0;
  if(lastValue > avg3*1.5 && avg3>0){
    insights.push({type:'alert', icon:'fa-arrow-trend-up', color:'#ef4444',
      title:'⚠ Accélération anormale détectée',
      desc:`La dernière période compte <b>${lastValue} jalons</b>, contre une moyenne de <b>${avg3.toFixed(1)}</b> pour les 3 périodes précédentes. C'est <b style="color:#ef4444">+${Math.round((lastValue-avg3)/Math.max(avg3,1)*100)}%</b> au-dessus de la moyenne — signal d'escalade.`});
  } else if(lastValue < avg3*0.5 && avg3>0){
    insights.push({type:'positive', icon:'fa-arrow-trend-down', color:'#22c55e',
      title:'↘ Décélération significative',
      desc:`La dernière période ne compte que <b>${lastValue} jalons</b>, vs <b>${avg3.toFixed(1)}</b> en moyenne. Soit <b style="color:#22c55e">-${Math.round((avg3-lastValue)/Math.max(avg3,1)*100)}%</b>. Phase de stabilisation possible.`});
  }
  // Sévérité critique
  const critRecent = byPeriod.slice(-3).flat().filter(e=>e.severity>=9).length;
  if(critRecent>=3){
    insights.push({type:'alert', icon:'fa-skull', color:'#ef4444',
      title:`${critRecent} événements critiques (sévérité ≥ 9) sur les 3 dernières périodes`,
      desc:`Concentration anormale de ruptures : à creuser avec la liste des conflits actifs.`});
  }
  // Conflit dominant
  if(!AN_STATE.conflict){
    const byConflict = {};
    byPeriod.slice(-3).flat().forEach(e=>{ byConflict[e.conflict_id] = (byConflict[e.conflict_id]||0)+1; });
    const topConflict = Object.entries(byConflict).sort((a,b)=>b[1]-a[1])[0];
    if(topConflict && topConflict[1]>=4){
      const cf = d.conflicts.find(x=>x.id===topConflict[0]);
      if(cf) insights.push({type:'info', icon:'fa-bullseye', color:'#fde047',
        title:`Conflit dominant : ${cf.name}`,
        desc:`Concentre <b>${topConflict[1]}</b> jalons sur les 3 dernières périodes — c'est la dynamique principale du moment. <a href="#" onclick="showConflictDetail('${cf.id}');return false" style="color:#60a5fa">Voir la fiche →</a>`});
    }
  }
  // Sévérité vs nombre
  if(lastValue>0 && scoresByP.at(-1)/lastValue >= 7){
    insights.push({type:'alert', icon:'fa-fire', color:'#f97316',
      title:'Événements peu nombreux mais très graves',
      desc:`Sévérité moyenne <b>${(scoresByP.at(-1)/lastValue).toFixed(1)}/10</b> sur la dernière période — les rares jalons sont des ruptures structurelles.`});
  }
  // Bilan positif si rien de critique
  if(!insights.length){
    insights.push({type:'positive', icon:'fa-check-circle', color:'#22c55e',
      title:'Aucune anomalie statistique détectée',
      desc:`Tendance dans la moyenne des périodes précédentes. RAS dans l'immédiat.`});
  }

  // Injecter le panneau d'insights après les KPI
  let insightsEl = document.getElementById('an-insights');
  if(!insightsEl){
    insightsEl = document.createElement('div');
    insightsEl.id = 'an-insights';
    insightsEl.style.cssText = 'margin:14px 0';
    document.getElementById('an-kpi').insertAdjacentElement('afterend', insightsEl);
  }
  insightsEl.innerHTML = `<div class="card" style="margin:0;background:linear-gradient(135deg,#0a1020 0%,#060912 100%);border-color:#fde047">
    <div class="card-hd"><h2 style="color:#fde047"><i class="fa-solid fa-brain"></i>Anomalies détectées & insights automatiques</h2><div class="help">Lecture interprétative des chiffres pour qu'un décideur sache quoi en faire</div></div>
    <div style="display:grid;gap:8px">
      ${insights.map(ins=>`<div style="background:#0a0f1c;border-left:3px solid ${ins.color};border-radius:0 5px 5px 0;padding:10px 13px">
        <div style="display:flex;align-items:flex-start;gap:8px">
          <i class="fa-solid ${ins.icon}" style="color:${ins.color};font-size:1.05rem;margin-top:2px"></i>
          <div style="flex:1">
            <div style="font-size:.86rem;color:#e2e8f0;font-weight:700;margin-bottom:3px">${ins.title}</div>
            <div style="font-size:.78rem;color:#cbd5e1;line-height:1.5">${ins.desc}</div>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>`;

  const scoresByP = byPeriod.map(arr=>arr.reduce((s,e)=>s+e.severity,0));
  const countsByP = byPeriod.map(arr=>arr.length);
  const periodLabel = AN_STATE.period==='day'?'Jour':AN_STATE.period==='week'?'Semaine':'Mois';
  makeChart('ch-evo',{type:'line',data:{labels:periods.map(p=>p.label),datasets:[
    {label:'Score (Σ sévérités) — axe gauche',data:scoresByP,borderColor:'#ef4444',backgroundColor:'rgba(239,68,68,.15)',fill:true,tension:.3,borderWidth:2,pointRadius:3,yAxisID:'y'},
    {label:'Nombre de jalons — axe droit',data:countsByP,borderColor:'#60a5fa',backgroundColor:'transparent',borderDash:[4,4],tension:.3,borderWidth:2,pointRadius:3,yAxisID:'y1'}
  ]},options:chartOpts({scales:{x:{title:axT(periodLabel+' (du plus ancien au plus récent)'),grid:{color:'rgba(26,35,64,.4)'},ticks:{color:'#64748b'}},y:{title:axT('Score (rouge)'),position:'left',beginAtZero:true,ticks:{color:'#ef4444'}},y1:{title:axT('Jalons (bleu)'),position:'right',beginAtZero:true,grid:{drawOnChartArea:false},ticks:{color:'#60a5fa'}}}})});
  const lastIdx = scoresByP.length-1;
  const divergence = countsByP[lastIdx]>0 && scoresByP[lastIdx]/countsByP[lastIdx] > 6 ? 'Sévérité moyenne élevée (peu d\'événements mais graves).' : countsByP[lastIdx]>0 ? `Sévérité moyenne : ${(scoresByP[lastIdx]/countsByP[lastIdx]).toFixed(1)}/10.` : 'Aucun jalon récent.';
  chartInsight('ch-evo',
    `Deux séries superposées : <span style="color:#ef4444"><b>rouge plein</b></span> = score cumulé de sévérité (1-10 par événement, additionnés) ; <span style="color:#60a5fa"><b>bleu pointillé</b></span> = nombre de jalons. Si le rouge monte plus vite que le bleu, peu d'événements mais très graves.`,
    `Dernière période : <b>${scoresByP[lastIdx]||0} pts</b> sur <b>${countsByP[lastIdx]||0} jalons</b>. ${divergence}`,
    '#ef4444');

  const sevB = [[1,3,'Faible (1-3)','#22c55e'],[4,6,'Moyenne (4-6)','#f59e0b'],[7,8,'Élevée (7-8)','#f97316'],[9,10,'Critique (9-10)','#ef4444']];
  makeChart('ch-sev',{type:'bar',data:{labels:periods.map(p=>p.label),datasets:sevB.map(([lo,hi,lbl,col])=>({label:lbl,backgroundColor:col,stack:'s',data:byPeriod.map(arr=>arr.filter(e=>e.severity>=lo&&e.severity<=hi).length)}))},options:chartOpts({scales:{x:{title:axT(periodLabel),stacked:true,grid:{color:'rgba(26,35,64,.4)'},ticks:{color:'#64748b'}},y:{title:axT('Nombre de jalons'),stacked:true,beginAtZero:true,grid:{color:'rgba(26,35,64,.4)'},ticks:{color:'#64748b'}}}})});
  const totalCrit = byPeriod.flat().filter(e=>e.severity>=9).length;
  const totalEvts = byPeriod.flat().length || 1;
  chartInsight('ch-sev',
    `Chaque barre = nombre de jalons par période, <b>empilés par strate de sévérité</b> : <span style="color:#22c55e">vert (1-3)</span>, <span style="color:#f59e0b">orange (4-6)</span>, <span style="color:#f97316">élevé (7-8)</span>, <span style="color:#ef4444">rouge critique (9-10)</span>.`,
    `<b>${totalCrit} jalons critiques</b> (sévérité ≥9) sur <b>${totalEvts}</b> au total — <b>${Math.round(totalCrit/totalEvts*100)}%</b> de la période. Plus de rouge = escalade.`,
    totalCrit/totalEvts>0.15?'#ef4444':'#22c55e');

  // Type doughnut : rupture vs ordinaire
  const ruptCount = evs.filter(e=>e.rupture).length;
  makeChart('ch-type',{type:'doughnut',data:{labels:['Seuils de rupture ⚠','Jalons ordinaires'],datasets:[{data:[ruptCount, evs.length-ruptCount],backgroundColor:['#ef4444','#60a5fa'],borderColor:'#0a0f1c',borderWidth:2}]},options:chartOpts({scales:{},plugins:{legend:{position:'right',labels:{color:'#cbd5e1',font:{size:11}}},tooltip:{callbacks:{label:ctx=>`${ctx.label} : ${ctx.parsed} (${evs.length?Math.round(ctx.parsed/evs.length*100):0}%)`}}}})});
  chartInsight('ch-type',
    `Un <b>seuil de rupture</b> est un jalon marqué comme tournant majeur (assassinat ciblé, frappe massive, prise de capitale, accord historique, retournement diplomatique...). Méthodologiquement = champ <code>rupture:true</code> dans la base.`,
    `<b>${ruptCount}/${evs.length}</b> jalons sont des ruptures (<b>${evs.length?Math.round(ruptCount/evs.length*100):0}%</b>). Au-delà de 20%, période d'instabilité structurelle.`,
    ruptCount/Math.max(evs.length,1)>0.2?'#ef4444':'#60a5fa');

  // Top conflits par intensité (renommé : "Acteurs impliqués" était trompeur)
  const conflictInt = d.conflicts.filter(c=>c.status!=='frozen'&&c.status!=='resolved').sort((a,b)=>b.intensity-a.intensity).slice(0,10);
  makeChart('ch-actors',{type:'bar',data:{labels:conflictInt.map(c=>c.short||c.name),datasets:[{label:'Intensité',data:conflictInt.map(c=>c.intensity),backgroundColor:conflictInt.map(c=>conflictColor(c.intensity)),borderRadius:4}]},options:chartOpts({indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>{const c=conflictInt[ctx.dataIndex]; return [`Intensité : ${ctx.parsed.x}/10`, `Région : ${c.region}`, `Acteurs : ${(c.actors_etat||[]).length+(c.actors_non_etat||[]).length}`];}}}},scales:{x:{title:axT('Intensité (échelle 1-10)'),beginAtZero:true,max:10},y:{title:axT('Conflit'),ticks:{color:'#cbd5e1'}}}})});
  const intHigh = conflictInt.filter(c=>c.intensity>=8).length;
  chartInsight('ch-actors',
    `Top 10 conflits actifs (hors gelés/résolus) classés par <b>intensité 1-10</b>. Couleur : <span style="color:#ef4444">rouge ≥9 (escalade)</span>, <span style="color:#f97316">orange ≥7 (intense)</span>, <span style="color:#f59e0b">jaune ≥5 (modéré)</span>, <span style="color:#22c55e">vert &lt;5 (faible)</span>.`,
    `<b>${intHigh}/${conflictInt.length}</b> conflits en zone d'escalade (≥8/10). ${conflictInt[0]?`Plus intense : <b style="color:#ef4444">${conflictInt[0].short||conflictInt[0].name}</b> (${conflictInt[0].intensity}/10).`:''}`,
    intHigh>3?'#ef4444':'#f59e0b');

  // Heatmap conflits × mois (12 derniers mois)
  const months=[]; for(let i=11;i>=0;i--){const s=new Date(now.getFullYear(),now.getMonth()-i,1); const e=new Date(now.getFullYear(),now.getMonth()-i+1,0,23,59,59); months.push({s,e,lbl:s.toLocaleDateString('fr-FR',{month:'short'})});}
  const allEv = d.events;
  const activeC = d.conflicts.filter(c=>c.status!=='frozen'&&c.status!=='resolved').slice(0,8);
  makeChart('ch-heat',{type:'bar',data:{labels:months.map(m=>m.lbl),datasets:activeC.map((c,i)=>({label:c.short||c.name,data:months.map(m=>allEv.filter(e=>e.conflict_id===c.id && new Date(e.date)>=m.s && new Date(e.date)<=m.e).length),backgroundColor:['#ef4444','#f97316','#f59e0b','#eab308','#22c55e','#06b6d4','#3b82f6','#a78bfa'][i%8],stack:'h'}))},options:chartOpts({plugins:{legend:{position:'bottom',labels:{color:'#cbd5e1',font:{size:10},padding:6,boxWidth:10}}},scales:{x:{title:axT('Mois (12 derniers)'),stacked:true},y:{title:axT('Nombre de jalons (cumulé)'),stacked:true,beginAtZero:true}}})});
  const monthlyTotals = months.map((m,mi)=>activeC.reduce((s,c,i)=>s+allEv.filter(e=>e.conflict_id===c.id&&new Date(e.date)>=m.s&&new Date(e.date)<=m.e).length,0));
  const pkMonth = monthlyTotals.indexOf(Math.max(...monthlyTotals));
  chartInsight('ch-heat',
    `Pour chaque <b>mois</b>, on empile le <b>nombre de jalons</b> par conflit (top 8 actifs). Hauteur totale = activité globale du mois ; couleur dominante = conflit qui pèse le plus.`,
    `Pic d'activité : <b>${months[pkMonth]?.lbl||'—'}</b> avec <b>${monthlyTotals[pkMonth]} jalons</b> cumulés. Total 12 mois : <b>${monthlyTotals.reduce((a,b)=>a+b,0)}</b>.`,
    '#06b6d4');

  // Radar : top 5 conflits
  const top5 = d.conflicts.slice().sort((a,b)=>b.intensity-a.intensity).slice(0,5);
  const dims = ['Intensité','Jalons 12 mois','Sévérité moy.','Acteurs','Ancienneté'];
  const raw = top5.map(c=>{
    const e12 = d.events.filter(e=>e.conflict_id===c.id && (now-new Date(e.date))/86400000<365);
    return [c.intensity, e12.length, e12.length?e12.reduce((s,e)=>s+e.severity,0)/e12.length:0, (c.actors_etat||[]).length+(c.actors_non_etat||[]).length, now.getFullYear()-c.start_year];
  });
  const norm = top5.map((c,i)=>dims.map((_,j)=>{const col=raw.map(r=>r[j]); return (raw[i][j]/Math.max(...col,1))*10;}));
  const pal = ['#ef4444','#f97316','#f59e0b','#60a5fa','#a78bfa'];
  makeChart('ch-radar',{type:'radar',data:{labels:dims,datasets:top5.map((c,i)=>({label:c.short||c.name,data:norm[i],backgroundColor:pal[i]+'33',borderColor:pal[i],borderWidth:2,pointBackgroundColor:pal[i],pointRadius:3}))},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:'#cbd5e1',font:{size:10}}},tooltip:{callbacks:{label:ctx=>{const r=raw[ctx.datasetIndex][ctx.dataIndex]; const lbl=dims[ctx.dataIndex]; const fmt=lbl==='Sévérité moy.'?r.toFixed(1)+'/10':lbl==='Ancienneté'?r+' ans':lbl==='Intensité'?r+'/10':r; return `${ctx.dataset.label} — ${lbl} : ${fmt} (normalisé ${ctx.parsed.r.toFixed(1)}/10)`;}}}},scales:{r:{min:0,max:10,angleLines:{color:'#1a2340'},grid:{color:'#1a2340'},pointLabels:{color:'#cbd5e1',font:{size:11}},ticks:{color:'#64748b',backdropColor:'transparent',stepSize:2}}}}});
  chartInsight('ch-radar',
    `5 conflits les + intenses sur <b>5 dimensions normalisées 0-10</b> (chaque dimension est rapportée à son maximum dans le top 5). Plus la forme est <b>large</b> = présent sur toutes les dimensions ; <b>étroite et pointue</b> = profil spécialisé (ex: vieux conflit peu actif).`,
    `Comparaison : la <b>surface</b> de chaque polygone reflète la "charge totale" du conflit. Survolez les sommets pour voir les valeurs brutes (ex: nombre d'acteurs, années).`,
    '#a78bfa');
}

/* ============= COUNTRIES (Fragile States Index) ============= */
function renderCountries(){
  const d = DB.get();
  const wrap = document.getElementById('countries-grid');
  // tri par FSI (plus fragile en haut)
  const sorted = d.countries.slice().sort((a,b)=>(b.fsi||0)-(a.fsi||0));
  wrap.innerHTML = sorted.map(c=>{
    const fsi = c.fsi||0;
    const fsiCol = fsi>=9?'#ef4444':fsi>=7?'#f97316':fsi>=5?'#f59e0b':'#22c55e';
    const conflits = d.conflicts.filter(x=>(x.countries||[]).includes(c.code));
    return `<div class="card" style="margin:0">
      <div class="card-hd"><h2><i class="fa-solid fa-flag"></i>${c.name} <span style="font-size:.72rem;color:#64748b">(${c.code})</span></h2>
        <span class="chip" style="background:${fsiCol}22;color:${fsiCol};border:1px solid ${fsiCol}55">FSI ${fsi}/10</span></div>
      <div style="font-size:.74rem;color:#94a3b8;margin-bottom:8px">${c.region}</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px;font-size:.7rem">
        <div style="background:#0a0f1c;padding:6px;border-radius:4px;text-align:center"><div style="color:#64748b">Gouv.</div><div style="color:#cbd5e1;font-weight:700">${c.gov||'—'}/10</div></div>
        <div style="background:#0a0f1c;padding:6px;border-radius:4px;text-align:center"><div style="color:#64748b">Sécu.</div><div style="color:#cbd5e1;font-weight:700">${c.sec||'—'}/10</div></div>
        <div style="background:#0a0f1c;padding:6px;border-radius:4px;text-align:center"><div style="color:#64748b">Éco.</div><div style="color:#cbd5e1;font-weight:700">${c.eco||'—'}/10</div></div>
        <div style="background:#0a0f1c;padding:6px;border-radius:4px;text-align:center"><div style="color:#64748b">Soc.</div><div style="color:#cbd5e1;font-weight:700">${c.soc||'—'}/10</div></div>
      </div>
      <div style="font-size:.8rem;color:#cbd5e1;line-height:1.5">${c.note||''}</div>
      ${conflits.length?`<div style="margin-top:10px;padding-top:10px;border-top:1px solid #1a2340"><div style="font-size:.7rem;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Conflits liés</div><div class="chip-group">${conflits.map(x=>`<span class="chip orange" style="cursor:pointer" onclick="showConflictDetail('${x.id}')">${x.short||x.name}</span>`).join('')}</div></div>`:''}
    </div>`;
  }).join('');
}

/* ============= SOURCES THINK TANKS ============= */
function renderSources(){
  const sources = DB.get().sources;
  const wrap = document.getElementById('sources-grid');

  // Active RSS sources from RSS_SOURCES_FULL pour mapping par nom
  const activeRSS = (window.GW_DATA?.RSS_SOURCES_FULL||[]);
  const dRSS = DB.get().rss_active||[];

  // Statistiques RSS LIVE par source : on cherche les articles dont _source contient le nom du think tank
  const findArticlesFor = (s)=>{
    if(!NEWS_STATE?.items?.length) return [];
    const needle = (s.name||'').toLowerCase().split(/[\s\-/]+/).filter(w=>w.length>3);
    return NEWS_STATE.items.filter(it=>{
      const src = (it._source||'').toLowerCase();
      return needle.some(w=>src.includes(w));
    });
  };
  const findActiveRSSFor = (s)=>{
    const needle = (s.name||'').toLowerCase().split(/[\s\-/]+/).filter(w=>w.length>3);
    return activeRSS.find(r=>{ const n=r.name.toLowerCase(); return needle.some(w=>n.includes(w)); });
  };

  // Banner freshness en haut de la page Sources
  const lastUpd = NEWS_STATE.lastUpdate;
  const ageStr = !lastUpd?'aucune':Math.round((Date.now()-new Date(lastUpd))/60000)+' min';
  const totArticles = NEWS_STATE.items?.length||0;
  const banner = `<div class="card" style="margin:0 0 14px;background:linear-gradient(135deg,#0a1428 0%,#060912 100%);border:1px solid #1a2340">
    <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;justify-content:space-between">
      <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
        <span style="font-size:.84rem;color:#cbd5e1"><i class="fa-solid fa-satellite-dish" style="color:#60a5fa"></i> <b>Bibliothèque sources</b></span>
        <span style="font-size:.74rem;color:#94a3b8">${sources.length} think tanks de référence • ${totArticles} articles RSS en mémoire • dernière collecte : <span style="color:${ageStr==='aucune'?'#f59e0b':'#86efac'}">${ageStr}</span></span>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn primary sm" onclick="loadNews()"><i class="fa-solid fa-rotate"></i> Collecter RSS</button>
        <a class="btn ghost sm" data-page="news" href="#"><i class="fa-solid fa-arrow-right"></i> Voir flux RSS</a>
      </div>
    </div>
  </div>`;

  wrap.innerHTML = banner + sources.map(s=>{
    const catCol = s.categorie.includes('français')?'#ef4444':s.categorie.includes('US')?'#3b82f6':s.categorie.includes('UK')?'#8b5cf6':s.categorie.includes('international')?'#22c55e':'#f59e0b';
    const arts = findArticlesFor(s);
    const activeRSSEntry = findActiveRSSFor(s);
    const isLive = !!activeRSSEntry && dRSS.includes(activeRSSEntry.id);
    const liveBadge = isLive
      ? `<span class="chip" style="background:rgba(34,197,94,.15);color:#86efac;font-size:.62rem;border:1px solid rgba(34,197,94,.35);font-weight:700"><i class="fa-solid fa-broadcast-tower" style="font-size:.55rem"></i> LIVE RSS</span>`
      : activeRSSEntry
        ? `<span class="chip gray" style="font-size:.62rem">RSS dispo (inactif)</span>`
        : `<span class="chip gray" style="font-size:.62rem">Pas de RSS direct</span>`;
    const lastArt = arts[0];
    const lastArtStr = lastArt ? `Dernier article : <b>${(lastArt.title||'').slice(0,80)}${(lastArt.title||'').length>80?'…':''}</b><br><span style="font-size:.7rem;color:#64748b">${fmt.dateTime(lastArt.pubDate)}</span>` : '<span style="color:#64748b">Aucun article récent collecté.</span>';

    return `<div class="card" style="margin:0">
      <div class="card-hd" style="margin-bottom:8px">
        <h2 style="font-size:.95rem"><i class="fa-solid fa-book-bookmark" style="color:${catCol}"></i>${s.name}</h2>
        <div style="display:flex;gap:5px;flex-wrap:wrap">
          <span class="chip" style="background:${catCol}22;color:${catCol};border:1px solid ${catCol}55;font-size:.62rem">${s.categorie}</span>
          ${liveBadge}
        </div>
      </div>
      <div style="font-size:.76rem;color:#cbd5e1;margin-bottom:8px;line-height:1.5"><b>Spécialité :</b> ${s.specialite}</div>
      ${arts.length>0 ? `<div style="background:rgba(34,197,94,.06);border-left:3px solid #22c55e;padding:8px 10px;border-radius:4px;margin-bottom:10px;font-size:.74rem;color:#cbd5e1;line-height:1.5"><b style="color:#86efac">🛰 ${arts.length} article${arts.length>1?'s':''} live</b><br>${lastArtStr}</div>` : `<div style="background:rgba(100,116,139,.06);border-left:3px solid #475569;padding:8px 10px;border-radius:4px;margin-bottom:10px;font-size:.72rem;color:#94a3b8">Aucun article live de cette source en mémoire. ${activeRSSEntry?'Activez le flux RSS pour collecter automatiquement.':'Pas de flux RSS disponible — consulter directement le site.'}</div>`}
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <a href="${s.url_recherche}" target="_blank" rel="noopener" class="btn primary sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Site officiel</a>
        ${activeRSSEntry && !isLive ? `<button class="btn ghost sm" onclick="toggleRSSActive('${activeRSSEntry.id}',true)"><i class="fa-solid fa-rss"></i> Activer flux</button>` : ''}
        ${isLive ? `<button class="btn ghost sm" onclick="filterNewsBySource('${(s.name||'').replace(/'/g,'')}')"><i class="fa-solid fa-filter"></i> Voir ses articles</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

/* Active/désactive un flux RSS depuis la page Sources */
function toggleRSSActive(rssId, activate){
  const d = DB.get();
  if(!d.rss_active) d.rss_active = [];
  if(activate && !d.rss_active.includes(rssId)) d.rss_active.push(rssId);
  if(!activate) d.rss_active = d.rss_active.filter(x=>x!==rssId);
  d.rss_active_user_modified = true;
  DB.save(d);
  toast('Flux activé · collecte en cours…','success');
  loadNews().then(()=>renderSources());
}

/* Filtre la page News par nom de source (texte dans search) */
function filterNewsBySource(name){
  Router.go('news');
  setTimeout(()=>{
    const inp = document.getElementById('news-search');
    if(inp){ inp.value = name.split(' ')[0]; inp.dispatchEvent(new Event('input')); }
  }, 200);
}

function addSourceFromTank(id){
  const tank = DB.get().sources.find(x=>x.id===id);
  if(!tank || !tank.rss){ toast('Pas de flux RSS pour cette source','error'); return; }
  // ici on l'ajoute aux sources RSS actives
  const d = DB.get();
  if(!d.rss_sources) d.rss_sources = [];
  if(d.rss_sources.find(s=>s.url===tank.rss)){ toast(tank.name+' déjà actif','info'); return; }
  d.rss_sources.push({id:'rss_'+Date.now(),name:tank.name,url:tank.rss,active:true});
  DB.save(d);
  toast(tank.name+' ajouté à la veille RSS','success');
}

/* ============================================================
   VEILLE MONDIALE AUTOMATIQUE
   Détection heuristique de tensions à partir des articles RSS :
   - Extraction pays mentionnés (dictionnaire)
   - Extraction types de tension (mots-clés)
   - Clustering par paire de pays + par pays unique
   - Rendu en cartes auto-générées
   ============================================================ */

const WW_COUNTRIES = {
  // ── Afrique
  'Burkina Faso':['burkina','ouagadougou'],
  'Mali':['mali','bamako','azawad'],
  'Niger':['niger','niamey'],
  'Nigéria':['nigeria','abuja','lagos','boko haram','iswap'],
  'Tchad':['tchad','chad','n\'djamena','ndjamena'],
  'Soudan':['soudan','sudan','khartoum','rsf','rapid support'],
  'Soudan du Sud':['south sudan','soudan du sud','juba'],
  'RDC':['rdc','dr congo','dem.rep.congo','kinshasa','goma','m23','kivu','congo-kinshasa'],
  'Rwanda':['rwanda','kigali','kagame'],
  'Éthiopie':['éthiopie','ethiopia','addis','tigray','amhara','oromo'],
  'Érythrée':['érythrée','eritrea','asmara'],
  'Somalie':['somalie','somalia','mogadiscio','shabaab','al-shabaab'],
  'Kenya':['kenya','nairobi'],
  'Afrique du Sud':['afrique du sud','south africa','pretoria','johannesburg'],
  'Algérie':['algérie','algeria','alger'],
  'Maroc':['maroc','morocco','rabat','sahara occidental'],
  'Tunisie':['tunisie','tunisia','tunis'],
  'Libye':['libye','libya','tripoli','benghazi','haftar'],
  'Égypte':['égypte','egypt','le caire','cairo','sissi'],
  'Sénégal':['sénégal','senegal','dakar'],
  'Côte d\'Ivoire':['côte d\'ivoire','ivory coast','abidjan'],
  'Mauritanie':['mauritanie','mauritania','nouakchott'],
  'Bénin':['bénin','benin','cotonou'],
  'Togo':['togo','lomé'],
  'Cameroun':['cameroun','cameroon','yaoundé','douala','ambazonie'],
  'RCA':['centrafrique','central african rep','bangui'],
  'Mozambique':['mozambique','maputo','cabo delgado'],
  'Zimbabwe':['zimbabwe','harare'],
  // ── Moyen-Orient
  'Israël':['israel','israël','tel aviv','jerusalem','jérusalem','idf','tsahal','netanyahu'],
  'Palestine':['palestine','gaza','hamas','cisjordanie','west bank','ramallah','jihad islamique'],
  'Liban':['liban','lebanon','beyrouth','beirut','hezbollah','nasrallah'],
  'Syrie':['syrie','syria','damas','damascus','assad','hts','golan'],
  'Iran':['iran','téhéran','tehran','khamenei','rgc','irgc','ayatollah','hormuz'],
  'Iraq':['irak','iraq','bagdad','baghdad'],
  'Yémen':['yémen','yemen','sanaa','sanaá','houthi','houthis','aden'],
  'Arabie Saoudite':['arabie saoudite','saudi','saoudite','riyad','riyadh','mbs'],
  'EAU':['émirats','emirates','uae','abu dhabi','dubai','dubaï'],
  'Qatar':['qatar','doha'],
  'Bahreïn':['bahreïn','bahrain'],
  'Oman':['oman','muscat'],
  'Koweït':['koweït','kuwait'],
  'Jordanie':['jordanie','jordan','amman'],
  'Turquie':['turquie','türkiye','turkey','ankara','erdogan','istanbul'],
  // ── Asie
  'Chine':['chine','china','pékin','beijing','xi jinping','pla','plén'],
  'Taïwan':['taïwan','taiwan','taipei','formose'],
  'Hong Kong':['hong kong','hongkong'],
  'Japon':['japon','japan','tokyo','kishida'],
  'Corée du Nord':['corée du nord','north korea','dprk','pyongyang','kim jong'],
  'Corée du Sud':['corée du sud','south korea','séoul','seoul'],
  'Inde':['inde','india','delhi','new delhi','modi','cachemire','kashmir'],
  'Pakistan':['pakistan','islamabad','karachi'],
  'Afghanistan':['afghanistan','kaboul','kabul','taliban','talibans'],
  'Birmanie':['birmanie','myanmar','rangoun','yangon','rohingya'],
  'Thaïlande':['thaïlande','thailand','bangkok'],
  'Vietnam':['vietnam','hanoï','hanoi'],
  'Philippines':['philippines','manille','manila'],
  'Indonésie':['indonésie','indonesia','jakarta'],
  'Bangladesh':['bangladesh','dacca','dhaka'],
  // ── Europe & ex-URSS
  'Russie':['russie','russia','moscou','moscow','poutine','putin','kremlin','wagner'],
  'Ukraine':['ukraine','kiev','kyiv','zelensky','zelenskyy','donetsk','donbass','crimée','crimea','marioupol'],
  'Biélorussie':['biélorussie','belarus','minsk','loukachenko','lukashenko'],
  'Pologne':['pologne','poland','varsovie','warsaw'],
  'Allemagne':['allemagne','germany','berlin','scholz'],
  'France':['france','paris','élysée','elysée','macron'],
  'Royaume-Uni':['royaume-uni','royaume uni','uk','britain','london','londres','starmer','sunak'],
  'Italie':['italie','italy','rome','meloni'],
  'Espagne':['espagne','spain','madrid'],
  'Suède':['suède','sweden','stockholm'],
  'Finlande':['finlande','finland','helsinki'],
  'Géorgie':['géorgie','georgia','tbilissi','tbilisi'],
  'Arménie':['arménie','armenia','erevan','yerevan'],
  'Azerbaïdjan':['azerbaïdjan','azerbaijan','baku','bakou','haut-karabakh','nagorno'],
  'Moldavie':['moldavie','moldova','chișinău'],
  'Serbie':['serbie','serbia','belgrade'],
  'Kosovo':['kosovo','pristina'],
  // ── Amériques
  'États-Unis':['états-unis','etats-unis','usa','united states','washington','pentagone','pentagon','biden','trump','white house','maison blanche'],
  'Mexique':['mexique','mexico','mexique','sinaloa','cartel','jalisco'],
  'Cuba':['cuba','la havane','havana'],
  'Venezuela':['venezuela','caracas','maduro'],
  'Colombie':['colombie','colombia','bogota','farc','eln'],
  'Brésil':['brésil','brazil','brasília','brasilia','lula'],
  'Argentine':['argentine','argentina','buenos aires','milei'],
  'Chili':['chili','chile','santiago'],
  'Pérou':['pérou','peru','lima'],
  'Haïti':['haïti','haiti','port-au-prince'],
  'Équateur':['équateur','ecuador','quito']
};

const WW_TENSION_KEYWORDS = {
  military:    ['attaque','attaqué','frappe','missile','drone','bombarde','bombardement','combats','offensive','soldat','troupe','tank','char','blindé','airstrike','strike','bataille','front','tirs','tué','tués','assassinat','assassiné','terroriste','jihad','jihadiste','attentat','offensive','exfiltration','déploiement','occupation','frappe ciblée','operation','opération','snipe','tank','miliciens'],
  diplomatic:  ['sanctions','rappel ambassadeur','expulsion ambassadeur','rupture diplomatique','sommet','traité','accord','reconnaissance','médiation','négociation','vote onu','résolution','session','condamnation','protestation','rétorsion'],
  political:   ['coup d\'état','coup d\'etat','coup','manifestation','émeute','arrestation massive','élection contestée','fraude électorale','référendum','régime','autoritaire','renversement','opposition','dissidents'],
  humanitarian:['déplacés','famine','réfugiés','crise humanitaire','choléra','épidémie','massacre','génocide','victimes civiles','blocus','siège','aide humanitaire','msf','hcr'],
  economic:    ['sanctions économiques','blocus','embargo','effondrement','crise monétaire','dévaluation','inflation','ressources','pétrole','gaz','minerais','coltan','uranium']
};

/* Extrait pays + types de tension d'un article */
function wwExtract(item){
  const text = ((item.title||'')+' '+(item.description||'')).toLowerCase();
  const countries = [];
  Object.entries(WW_COUNTRIES).forEach(([country, terms])=>{
    if(terms.some(t=>text.includes(t))) countries.push(country);
  });
  const types = [];
  Object.entries(WW_TENSION_KEYWORDS).forEach(([type, kws])=>{
    if(kws.some(kw=>text.includes(kw))) types.push(type);
  });
  return { countries, types };
}

/* Détecte les tensions BILATÉRALES (paires de pays co-mentionnés avec mots-clés tension) */
function wwDetectBilateral(items){
  const pairs = {};
  items.forEach(it=>{
    const { countries, types } = wwExtract(it);
    if(countries.length<2 || types.length===0) return;
    for(let i=0;i<countries.length;i++){
      for(let j=i+1;j<countries.length;j++){
        const key = [countries[i],countries[j]].sort().join('||');
        if(!pairs[key]) pairs[key] = { pair:[countries[i],countries[j]].sort(), articles:[], types:new Set(), majors:0, bf:false };
        pairs[key].articles.push(it);
        types.forEach(t=>pairs[key].types.add(t));
        if(it._majors?.length) pairs[key].majors++;
        if(it._bf) pairs[key].bf = true;
      }
    }
  });
  return Object.values(pairs)
    .filter(p=>p.articles.length>=2 && (p.types.has('military')||p.types.has('diplomatic')||p.types.has('political')||p.majors>0))
    .map(p=>({...p, types:[...p.types]}))
    .sort((a,b)=>b.majors-a.majors||b.articles.length-a.articles.length)
    .slice(0,15);
}

/* Détecte les ZONES CHAUDES (pays uniques avec ≥3 articles de tension) */
function wwDetectHotZones(items){
  const zones = {};
  items.forEach(it=>{
    const { countries, types } = wwExtract(it);
    if(types.length===0) return;
    countries.forEach(c=>{
      if(!zones[c]) zones[c] = { country:c, articles:[], types:new Set(), majors:0, severity:0 };
      zones[c].articles.push(it);
      types.forEach(t=>zones[c].types.add(t));
      if(it._majors?.length) zones[c].majors++;
      // Score de sévérité : militaire>diplo>politique>humanitaire>éco
      zones[c].severity += (types.includes('military')?3:0) + (types.includes('diplomatic')?2:0) + (types.includes('political')?2:0) + (types.includes('humanitarian')?2:0) + (types.includes('economic')?1:0);
    });
  });
  return Object.values(zones)
    .filter(z=>z.articles.length>=3)
    .map(z=>({...z, types:[...z.types]}))
    .sort((a,b)=>b.severity-a.severity)
    .slice(0,20);
}

/* Met à jour le badge sidebar avec le nb de tensions détectées */
function wwUpdateBadge(){
  if(!NEWS_STATE?.items?.length) return;
  const bilat = wwDetectBilateral(NEWS_STATE.items).length;
  const zones = wwDetectHotZones(NEWS_STATE.items).length;
  const total = bilat + zones;
  const badge = document.getElementById('nav-ww-badge');
  if(badge){
    if(total>0){ badge.style.display='inline-block'; badge.textContent = total; }
    else badge.style.display='none';
  }
}

function renderWorldWatch(){
  const wrap = document.getElementById('ww-panel');
  if(!wrap) return;
  if(!NEWS_STATE?.items?.length){
    wrap.innerHTML = `<div class="card" style="text-align:center;padding:40px"><i class="fa-solid fa-spinner fa-spin" style="font-size:2rem;color:#60a5fa"></i><h2 style="margin-top:16px;color:#e2e8f0">Veille mondiale en cours d'initialisation…</h2><p style="color:#94a3b8;margin-top:8px">Le système collecte les flux RSS et analyse les articles pour détecter les tensions, zones chaudes et événements majeurs.</p><button class="btn primary" onclick="loadNews()" style="margin-top:14px"><i class="fa-solid fa-rotate"></i> Lancer la collecte maintenant</button></div>`;
    return;
  }
  const bilat = wwDetectBilateral(NEWS_STATE.items);
  const zones = wwDetectHotZones(NEWS_STATE.items);
  const majors = NEWS_STATE.items.filter(it=>it._majors?.length>0).slice(0,15);
  const lastUpd = Math.round((Date.now()-new Date(NEWS_STATE.lastUpdate))/60000);

  const typeChip = (t)=>{
    const map = {military:['#ef4444','⚔ Militaire'],diplomatic:['#3b82f6','🤝 Diplomatique'],political:['#a78bfa','🏛 Politique'],humanitarian:['#fde047','🆘 Humanitaire'],economic:['#22c55e','💰 Économique']};
    const [c,l] = map[t]||['#94a3b8',t];
    return `<span class="chip" style="background:${c}22;color:${c};border:1px solid ${c}55;font-size:.62rem">${l}</span>`;
  };

  // === HEADER ===
  const header = `<div class="card" style="margin:0 0 14px;background:linear-gradient(135deg,#0a1428 0%,#060912 100%);border:1px solid rgba(34,197,94,.3)">
    <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;justify-content:space-between">
      <div>
        <div style="font-size:1rem;color:#86efac;font-weight:700"><i class="fa-solid fa-globe"></i> Veille mondiale automatique <span style="background:rgba(34,197,94,.2);color:#86efac;font-size:.62rem;padding:2px 7px;border-radius:10px;margin-left:8px"><i class="fa-solid fa-broadcast-tower" style="font-size:.55rem"></i> EN DIRECT</span></div>
        <div style="font-size:.78rem;color:#94a3b8;margin-top:4px">${NEWS_STATE.items.length} articles analysés · ${bilat.length} tensions bilatérales · ${zones.length} zones chaudes · ${majors.length} événements majeurs · maj : ${lastUpd} min</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn primary sm" onclick="loadNews()"><i class="fa-solid fa-rotate"></i> Réanalyser</button>
      </div>
    </div>
    <div style="margin-top:10px;background:rgba(34,197,94,.06);border-left:3px solid #22c55e;padding:9px 12px;border-radius:4px;font-size:.74rem;color:#cbd5e1;line-height:1.6">
      <b style="color:#86efac"><i class="fa-solid fa-cogs"></i> Méthode :</b> chaque article est scanné pour détecter les pays mentionnés (~80 pays référencés) × les types de tension (militaire, diplomatique, politique, humanitaire, économique). Les articles sont ensuite groupés en <b>tensions bilatérales</b> (≥2 articles entre 2 pays), <b>zones chaudes</b> (≥3 articles sur un pays unique avec un score de sévérité pondéré), <b>événements majeurs</b> (mots-clés rupture/crise/diplo). Tout est recalculé à chaque cycle RSS (10 min).
    </div>
  </div>`;

  // === TENSIONS BILATÉRALES ===
  const bilatHTML = bilat.length===0 ? '<div class="empty"><i class="fa-solid fa-handshake"></i><p>Aucune tension bilatérale détectée dans les articles récents.</p></div>' : bilat.map(p=>{
    const sev = p.types.includes('military')?'critical':p.types.includes('diplomatic')||p.types.includes('political')?'high':'medium';
    const col = sev==='critical'?'#ef4444':sev==='high'?'#f97316':'#f59e0b';
    return `<div class="card" style="margin:0 0 10px;background:linear-gradient(135deg,#1a0d05 0%,#060912 100%);border-left:4px solid ${col}">
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:8px">
        <div style="flex:1">
          <div style="font-size:1rem;font-weight:700;color:#e2e8f0">⚡ ${p.pair[0]} ↔ ${p.pair[1]}</div>
          <div style="font-size:.74rem;color:#94a3b8;margin-top:4px">${p.articles.length} articles · ${p.majors} événement${p.majors>1?'s':''} majeur${p.majors>1?'s':''}${p.bf?' · <span style="color:#fde047">🇧🇫 pertinent BF</span>':''}</div>
        </div>
        <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:flex-start">${p.types.map(typeChip).join('')}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px">
        ${p.articles.slice(0,3).map(a=>`<a href="${a.link}" target="_blank" rel="noopener" style="text-decoration:none;display:block;padding:7px 10px;background:rgba(0,0,0,.3);border-left:2px solid ${col};border-radius:4px;font-size:.78rem;color:#cbd5e1"><b style="color:#e2e8f0">${(a.title||'').slice(0,140)}${(a.title||'').length>140?'…':''}</b><br><span style="font-size:.7rem;color:#64748b">${fmt.dateTime(a.pubDate)} · ${a._source||''}</span></a>`).join('')}
      </div>
      ${p.articles.length>3?`<div style="text-align:center;margin-top:6px;font-size:.74rem;color:#64748b">+ ${p.articles.length-3} autre${p.articles.length-3>1?'s':''} article${p.articles.length-3>1?'s':''}</div>`:''}
    </div>`;
  }).join('');

  // === ZONES CHAUDES ===
  const zonesHTML = zones.length===0 ? '<div class="empty"><i class="fa-solid fa-circle-check"></i><p>Aucune zone chaude détectée.</p></div>' : `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px">${zones.map(z=>{
    const sev = z.severity>=15?'critical':z.severity>=8?'high':z.severity>=4?'medium':'low';
    const col = sev==='critical'?'#ef4444':sev==='high'?'#f97316':sev==='medium'?'#f59e0b':'#22c55e';
    return `<div class="card" style="margin:0;background:linear-gradient(135deg,#0a1020 0%,#060912 100%);border-top:3px solid ${col}">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
        <div>
          <div style="font-size:.95rem;font-weight:700;color:#e2e8f0">📍 ${z.country}</div>
          <div style="font-size:.7rem;color:#94a3b8;margin-top:3px">${z.articles.length} articles · score sévérité ${z.severity}</div>
        </div>
        <span class="chip" style="background:${col}22;color:${col};border:1px solid ${col}55;font-size:.62rem;font-weight:700">${sev.toUpperCase()}</span>
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">${z.types.map(typeChip).join('')}</div>
      <a href="${z.articles[0].link}" target="_blank" rel="noopener" style="text-decoration:none;display:block;padding:6px 9px;background:rgba(0,0,0,.3);border-radius:4px;font-size:.74rem;color:#cbd5e1;line-height:1.4"><b style="color:#e2e8f0">${(z.articles[0].title||'').slice(0,90)}${(z.articles[0].title||'').length>90?'…':''}</b></a>
    </div>`;
  }).join('')}</div>`;

  // === ÉVÉNEMENTS MAJEURS ===
  const majorsHTML = majors.length===0 ? '<div class="empty"><i class="fa-solid fa-shield"></i><p>Aucun événement majeur détecté dans les flux récents.</p></div>' : majors.map(it=>{
    const types = (it._majors||[]).map(m=>m.type);
    const sev = types.includes('rupture')||types.includes('crise')?'#ef4444':'#f97316';
    return `<div class="card" style="margin:0 0 8px;background:linear-gradient(135deg,#1a0609 0%,#060912 100%);border-left:4px solid ${sev}">
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:6px">
        <div style="flex:1">
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px">${(it._majors||[]).map(m=>`<span class="chip" style="background:${sev}22;color:${sev};border:1px solid ${sev}55;font-size:.62rem;font-weight:700">${m.type.toUpperCase()}</span>`).join('')}${it._bf?'<span class="chip" style="background:rgba(253,224,71,.18);color:#fde047;font-size:.62rem;border:1px solid rgba(253,224,71,.4)">🇧🇫 BF</span>':''}</div>
          <div style="font-size:.92rem;font-weight:700;color:#e2e8f0;line-height:1.4">⚠ ${it.title}</div>
          <div style="font-size:.72rem;color:#94a3b8;margin-top:4px">${fmt.dateTime(it.pubDate)} · ${it._source||''}</div>
        </div>
        <a class="btn primary sm" href="${it.link}" target="_blank" rel="noopener" style="text-decoration:none;align-self:start"><i class="fa-solid fa-arrow-up-right-from-square"></i> Lire</a>
      </div>
      <div style="font-size:.78rem;color:#cbd5e1;line-height:1.55;background:rgba(0,0,0,.25);border-left:2px solid ${sev};padding:7px 10px;border-radius:3px">${(it.description||'').slice(0,300)}${(it.description||'').length>300?'…':''}</div>
    </div>`;
  }).join('');

  wrap.innerHTML = header + `
    <div class="card" style="margin:0 0 14px">
      <div class="card-hd" style="margin-bottom:10px"><h2 style="color:#ef4444"><i class="fa-solid fa-bolt"></i>Tensions bilatérales émergentes (${bilat.length})</h2><div class="help">Paires de pays co-mentionnés dans ≥2 articles avec au moins une tension militaire/diplo/politique.</div></div>
      ${bilatHTML}
    </div>
    <div class="card" style="margin:0 0 14px">
      <div class="card-hd" style="margin-bottom:10px"><h2 style="color:#f97316"><i class="fa-solid fa-fire"></i>Zones chaudes (${zones.length})</h2><div class="help">Pays uniques avec ≥3 articles de tension. Score sévérité = pondération militaire (×3) + diplo/polit/humanit. (×2) + éco (×1).</div></div>
      ${zonesHTML}
    </div>
    <div class="card" style="margin:0 0 14px">
      <div class="card-hd" style="margin-bottom:10px"><h2 style="color:#ef4444"><i class="fa-solid fa-triangle-exclamation"></i>Événements majeurs détectés (${majors.length})</h2><div class="help">Articles RSS contenant des mots-clés de rupture/crise/escalade (cf. <code>MAJOR_EVENT_KEYWORDS</code> dans <code>sources.js</code>).</div></div>
      ${majorsHTML}
    </div>`;
}

/* ============= ALERTES ============= */
/* Dérive les alertes EN DIRECT depuis les articles RSS détectés comme événements majeurs */
function getDerivedAlertsFromNews(){
  if(!NEWS_STATE?.items?.length) return [];
  return NEWS_STATE.items.filter(it=>it._majors?.length>0).map(it=>{
    const types = (it._majors||[]).map(m=>m.type);
    let level = 'high';
    if(types.includes('rupture') || types.includes('crise')) level = 'critical';
    else if(types.includes('diplo_majeur')) level = 'high';
    const seuilLabels = {rupture:'Rupture/escalade',diplo_majeur:'Diplomatie haut niveau',crise:'Crise systémique'};
    return {
      id:'rss_'+(it.link||it.title||'').replace(/[^a-z0-9]/gi,'').slice(0,30),
      title: it.title,
      description:(it.description||'').slice(0,500),
      level, date: it.pubDate||new Date().toISOString(),
      conflict_id:(it._conflicts||[])[0]?.id,
      seuil: types.map(t=>seuilLabels[t]||t).join(' • '),
      _live:true, _link:it.link, _source:it._source, _bf:!!it._bf,
      _keywords:(it._majors||[]).map(m=>m.keyword)
    };
  });
}

/* Synthèse impact BF (gère les 2 structures : note_synthese OU dimensions) */
function _impactBFSynthese(c){
  if(!c?.impact_bf) return null;
  if(c.impact_bf.note_synthese) return c.impact_bf.note_synthese;
  const dims = ['securitaire','economique','diplomatique','sociopolitique'];
  const parts = dims.filter(d=>c.impact_bf[d]?.titre).map(d=>{
    const x=c.impact_bf[d]; return `[${d}] ${x.titre}${x.niveau?` (${x.niveau})`:''}`;
  });
  return parts.length? parts.join(' · ') : null;
}

// État de filtrage des alertes
let AL_STATE = { level:'all', source:'all', bfOnly:false };

function renderAlerts(){
  const d = DB.get();
  const liveAlerts = getDerivedAlertsFromNews();
  let all = [...liveAlerts, ...(d.alerts||[])].sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
  const el = document.getElementById('alerts-list');
  if(!el) return;
  const lastUpd = NEWS_STATE.lastUpdate ? Math.round((Date.now()-new Date(NEWS_STATE.lastUpdate))/60000) : null;
  const freshLabel = lastUpd===null ? 'jamais' : lastUpd<1?'à l\'instant':`il y a ${lastUpd} min`;
  const freshColor = lastUpd===null||lastUpd>15 ? '#f59e0b' : '#22c55e';

  // Stats par niveau
  const liveCount = liveAlerts.length, manualCount = (d.alerts||[]).length;
  const critCount = all.filter(a=>a.level==='critical').length;
  const highCount = all.filter(a=>a.level==='high').length;
  const mediumCount = all.filter(a=>a.level==='medium' || a.level==='info' || (!a.level)).length;
  const bfCount = all.filter(a=>a._bf).length;

  // Bandeau pédagogique
  let html = `
    <div style="background:linear-gradient(135deg,#1a060933 0%,#0a0f1c 100%);border:1px solid #7f1d1d;border-left:4px solid #ef4444;border-radius:6px;padding:14px 18px;margin-bottom:14px">
      <div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap">
        <div style="font-size:2.2rem;color:#ef4444;line-height:1;flex-shrink:0"><i class="fa-solid fa-bell"></i></div>
        <div style="flex:1;min-width:240px">
          <div style="font-size:.62rem;color:#ef4444;letter-spacing:2px;text-transform:uppercase;font-weight:800;margin-bottom:2px">⚡ Centre d'alertes</div>
          <div style="font-size:1rem;color:#e2e8f0;font-weight:700;line-height:1.4;margin-bottom:7px">Tous les événements détectés comme « majeurs » par le système, automatiquement extraits des flux RSS et croisés avec le catalogue des conflits.</div>
          <div style="background:#0a0f1c;border:1px solid #1a2340;border-radius:5px;padding:9px 11px;margin-top:6px">
            <div style="font-size:.66rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;font-weight:700;margin-bottom:5px"><i class="fa-solid fa-circle-question"></i> Comment fonctionnent les alertes ?</div>
            <div style="font-size:.78rem;color:#cbd5e1;padding:2px 0;line-height:1.45">▸ Le système scanne en permanence les ${(window.GW_DATA?.RSS_SOURCES_FULL?.length)||140}+ sources RSS configurées</div>
            <div style="font-size:.78rem;color:#cbd5e1;padding:2px 0;line-height:1.45">▸ Quand un titre/article contient un <b style="color:#fde047">mot-clé majeur</b> (coup d'État, frappe massive, accord historique, choc pétrolier...), il devient automatiquement une alerte <span style="color:#86efac">EN DIRECT</span></div>
            <div style="font-size:.78rem;color:#cbd5e1;padding:2px 0;line-height:1.45">▸ Niveau attribué : <span style="color:#ef4444">Critique</span> (rupture/crise) · <span style="color:#f97316">Élevée</span> (diplomatie majeure) · <span style="color:#fde047">Moyenne</span> (info importante)</div>
            <div style="font-size:.78rem;color:#cbd5e1;padding:2px 0;line-height:1.45">▸ Si l'article touche un conflit catalogué, on affiche aussi <b style="color:#fde047">l'impact pour le Burkina Faso</b></div>
          </div>
        </div>
      </div>
    </div>`;

  // Stats clignotantes par niveau
  html += `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:14px">
    <div onclick="AL_STATE.level=AL_STATE.level==='critical'?'all':'critical';renderAlerts()" style="cursor:pointer;background:#0a0f1c;border:1px solid #7f1d1d;border-left:3px solid #ef4444;border-radius:5px;padding:11px 13px;${AL_STATE.level==='critical'?'box-shadow:0 0 0 2px #ef4444':''}">
      <div style="font-size:.62rem;color:#ef4444;text-transform:uppercase;letter-spacing:1px;font-weight:800"><i class="fa-solid fa-triangle-exclamation"></i> Critique</div>
      <div style="font-size:1.6rem;color:#ef4444;font-weight:800">${critCount}</div>
      <div style="font-size:.68rem;color:#94a3b8">action immédiate requise</div>
    </div>
    <div onclick="AL_STATE.level=AL_STATE.level==='high'?'all':'high';renderAlerts()" style="cursor:pointer;background:#0a0f1c;border:1px solid #7c2d12;border-left:3px solid #f97316;border-radius:5px;padding:11px 13px;${AL_STATE.level==='high'?'box-shadow:0 0 0 2px #f97316':''}">
      <div style="font-size:.62rem;color:#f97316;text-transform:uppercase;letter-spacing:1px;font-weight:800"><i class="fa-solid fa-exclamation"></i> Élevée</div>
      <div style="font-size:1.6rem;color:#f97316;font-weight:800">${highCount}</div>
      <div style="font-size:.68rem;color:#94a3b8">à traiter dans la journée</div>
    </div>
    <div onclick="AL_STATE.level=AL_STATE.level==='medium'?'all':'medium';renderAlerts()" style="cursor:pointer;background:#0a0f1c;border:1px solid #1a2340;border-left:3px solid #fde047;border-radius:5px;padding:11px 13px;${AL_STATE.level==='medium'?'box-shadow:0 0 0 2px #fde047':''}">
      <div style="font-size:.62rem;color:#fde047;text-transform:uppercase;letter-spacing:1px;font-weight:800"><i class="fa-solid fa-circle-info"></i> Moyenne / info</div>
      <div style="font-size:1.6rem;color:#fde047;font-weight:800">${mediumCount}</div>
      <div style="font-size:.68rem;color:#94a3b8">à classer dans la veille</div>
    </div>
    <div onclick="AL_STATE.bfOnly=!AL_STATE.bfOnly;renderAlerts()" style="cursor:pointer;background:#0a0f1c;border:1px solid #1a2340;border-left:3px solid ${AL_STATE.bfOnly?'#fde047':'#1a2340'};border-radius:5px;padding:11px 13px;${AL_STATE.bfOnly?'box-shadow:0 0 0 2px #fde047':''}">
      <div style="font-size:.62rem;color:#fde047;text-transform:uppercase;letter-spacing:1px;font-weight:800"><i class="fa-solid fa-flag-checkered"></i> Pertinentes BF</div>
      <div style="font-size:1.6rem;color:#fde047;font-weight:800">${bfCount}</div>
      <div style="font-size:.68rem;color:#94a3b8">${AL_STATE.bfOnly?'(filtre actif — cliquer pour voir tout)':'cliquer pour filtrer'}</div>
    </div>
  </div>`;

  // Bandeau de contrôle
  const sourceLabel = AL_STATE.source==='live'?'EN DIRECT seulement':AL_STATE.source==='manual'?'manuelles seulement':'toutes sources';
  html += `<div class="card" style="margin-bottom:14px;background:linear-gradient(135deg,#0a1020 0%,#060912 100%);border:1px solid #1a2340">
    <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:.78rem;color:#94a3b8"><i class="fa-solid fa-satellite-dish" style="color:${freshColor}"></i> RSS scanné <b style="color:${freshColor}">${freshLabel}</b></span>
        <span style="font-size:.7rem;color:#64748b">· Actualisation auto toutes les 10 min</span>
        <span style="font-size:.7rem;color:#64748b">· ${liveCount} EN DIRECT + ${manualCount} manuelles</span>
        ${AL_STATE.level!=='all'||AL_STATE.bfOnly||AL_STATE.source!=='all' ? `<span class="chip" style="background:rgba(96,165,250,.15);color:#60a5fa;font-size:.66rem;border:1px solid rgba(96,165,250,.4)">🔍 Filtres actifs</span>` : ''}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${AL_STATE.level!=='all'||AL_STATE.bfOnly||AL_STATE.source!=='all' ? `<button class="btn ghost sm" onclick="AL_STATE={level:'all',source:'all',bfOnly:false};renderAlerts()"><i class="fa-solid fa-xmark"></i> Réinitialiser filtres</button>` : ''}
        <button class="btn primary sm" onclick="loadNews()"><i class="fa-solid fa-rotate"></i> Actualiser RSS</button>
      </div>
    </div>
  </div>`;

  // Application des filtres
  if(AL_STATE.level!=='all'){
    if(AL_STATE.level==='medium') all = all.filter(a=>!a.level || a.level==='medium' || a.level==='info' || a.level==='low');
    else all = all.filter(a=>a.level===AL_STATE.level);
  }
  if(AL_STATE.bfOnly) all = all.filter(a=>a._bf);
  if(AL_STATE.source==='live') all = all.filter(a=>a._live);
  else if(AL_STATE.source==='manual') all = all.filter(a=>!a._live);

  // Cas vide
  if(!all.length){
    if(critCount===0 && highCount===0 && mediumCount===0){
      // Vraiment aucune alerte
      html += `<div style="background:linear-gradient(135deg,#0a1020 0%,#060912 100%);border:1px solid #1a2340;border-radius:8px;padding:30px;text-align:center">
        <i class="fa-solid fa-shield-halved" style="font-size:2.5rem;color:#22c55e;margin-bottom:10px"></i>
        <div style="font-size:1.05rem;color:#86efac;font-weight:700;margin-bottom:5px">Aucune alerte active</div>
        <div style="font-size:.84rem;color:#94a3b8;line-height:1.55;max-width:600px;margin:auto">Le système n'a détecté aucun événement majeur dans les flux RSS. Cela peut signifier soit que la situation est calme, soit que les flux RSS n'ont pas encore été collectés.<br>Cliquez sur <b style="color:#60a5fa">« Actualiser RSS »</b> ci-dessus pour relancer une collecte.</div>
      </div>`;
    } else {
      // Filtres trop restrictifs
      html += `<div style="background:linear-gradient(135deg,#0a1020 0%,#060912 100%);border:1px solid #1a2340;border-radius:8px;padding:24px;text-align:center">
        <i class="fa-solid fa-filter-circle-xmark" style="font-size:2rem;color:#f59e0b;margin-bottom:10px"></i>
        <div style="font-size:.95rem;color:#fde047;font-weight:700;margin-bottom:4px">Aucune alerte ne correspond aux filtres actifs</div>
        <div style="font-size:.78rem;color:#94a3b8">Cliquez sur <b style="color:#60a5fa">« Réinitialiser filtres »</b> pour voir toutes les alertes.</div>
      </div>`;
    }
    el.innerHTML = html;
    return;
  }

  // Liste des alertes
  el.innerHTML = html + all.map(a=>{
    const c = d.conflicts.find(x=>x.id===a.conflict_id);
    const levelBg = a.level==='critical'?'#1a0609':a.level==='high'?'#1a0d05':'#0c1426';
    const levelBorder = a.level==='critical'?'#7f1d1d':a.level==='high'?'#7c2d12':'#1a2340';
    const liveBadge = a._live ? `<span class="chip" style="background:rgba(34,197,94,.18);color:#86efac;font-size:.62rem;border:1px solid rgba(34,197,94,.35);font-weight:700"><i class="fa-solid fa-broadcast-tower" style="font-size:.6rem"></i> EN DIRECT</span>` : `<span class="chip gray" style="font-size:.62rem">📝 Manuelle</span>`;
    const bfImpact = _impactBFSynthese(c);
    const dateLabel = a._live ? `${fmt.dateTime(a.date)} (RSS)` : fmt.date(a.date);
    return `<div class="card" style="margin:0 0 12px;background:linear-gradient(135deg,${levelBg} 0%,#060912 100%);border-color:${levelBorder};border-width:1.5px">
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:10px">
        <div style="flex:1;min-width:280px">
          <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:6px">${liveBadge}${a._bf?'<span class="chip" style="background:rgba(253,224,71,.15);color:#fde047;font-size:.62rem;border:1px solid rgba(253,224,71,.35)">🇧🇫 Pertinent BF</span>':''}</div>
          <div style="font-size:1rem;font-weight:700;color:#e2e8f0;line-height:1.4;margin-bottom:5px">⚠ ${a.title}</div>
          <div style="font-size:.76rem;color:#94a3b8;margin-bottom:8px">${dateLabel}${a._source?` • ${a._source}`:''}${c?` • <span style="color:#60a5fa;cursor:pointer;text-decoration:underline" onclick="showConflictDetail('${c.id}')">${c.short||c.name}</span>`:''}</div>
          ${a.seuil?`<div style="margin-bottom:9px"><span class="chip purple" style="font-size:.7rem">Seuil détecté : ${a.seuil}</span></div>`:''}
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">${levelChip(a.level)}${!a._live?`<button class="btn ghost sm" onclick="delAlert('${a.id}')" title="Supprimer"><i class="fa-solid fa-trash"></i></button>`:''}</div>
      </div>
      <div style="background:rgba(0,0,0,.25);border-left:3px solid ${levelBorder};border-radius:4px;padding:11px 14px;font-size:.88rem;color:#e2e8f0;line-height:1.65;white-space:pre-wrap;word-wrap:break-word">${a.description||'<i style="color:#64748b">Pas de description.</i>'}</div>
      ${c?.brief_decideur?.[0]?`<div style="margin-top:10px;background:rgba(96,165,250,.05);border-left:3px solid #60a5fa;padding:9px 12px;border-radius:4px;font-size:.78rem;color:#cbd5e1"><b style="color:#60a5fa">📌 Contexte conflit lié :</b> ${c.brief_decideur[0]}</div>`:''}
      ${bfImpact?`<div style="margin-top:8px;background:rgba(253,224,71,.06);border-left:3px solid #fde047;padding:9px 12px;border-radius:4px;font-size:.78rem;color:#cbd5e1"><b style="color:#fde047">🇧🇫 Impact BF :</b> ${bfImpact}</div>`:''}
      <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">
        ${a._live && a._link?`<a class="btn primary sm" href="${a._link}" target="_blank" rel="noopener" style="text-decoration:none"><i class="fa-solid fa-arrow-up-right-from-square"></i> Lire l'article source</a>`:''}
        ${c?`<button class="btn ghost sm" onclick="showConflictDetail('${c.id}')"><i class="fa-solid fa-circle-info"></i> Fiche conflit</button>`:''}
        ${c?.id?`<button class="btn ghost sm" onclick="Router.go('impact_bf');setTimeout(()=>{const s=document.getElementById('bf-conflict');if(s){s.value='${c.id}';renderImpactBF();}},100)"><i class="fa-solid fa-flag-checkered" style="color:#fde047"></i> Voir impact BF</button>`:''}
        <button class="btn ghost sm" onclick="Router.go('geointel')" style="color:#86efac"><i class="fa-solid fa-globe"></i> Carte GeoIntel</button>
      </div>
    </div>`;
  }).join('');
}
function delAlert(id){ if(confirm('Supprimer ?')){DB.del('alerts',id); toast('Supprimée','success'); renderAlerts();} }

/* ============= EVENTS (chronologie globale) ============= */
let EV_STATE = { search:'', conflict:'', sev:'', ruptureOnly:false, sortKey:'date', sortDir:-1, source:'all' };
function renderEvents(){
  const d = DB.get();
  const sel = document.getElementById('ev-filter-conflict');
  if(sel.options.length<=1){ d.conflicts.forEach(c=>{const o=document.createElement('option'); o.value=c.id; o.textContent=c.short||c.name; sel.appendChild(o);}); }

  // FUSION : événements historiques (statiques, jalons clés) + événements RSS live
  const histEvents = d.events.map(e=>({...e, _live:false}));
  const rssEvents = (typeof getRSSEvents==='function' ? getRSSEvents() : []);
  let list = [...rssEvents, ...histEvents];

  // Filtre source (manuel/RSS/all) via EV_STATE.source
  const srcFilter = EV_STATE.source || 'all';
  if(srcFilter==='rss') list = list.filter(e=>e._live);
  else if(srcFilter==='manual') list = list.filter(e=>!e._live);

  if(EV_STATE.search){const q=EV_STATE.search.toLowerCase(); list=list.filter(e=>((e.title||'')+' '+(e.description||'')).toLowerCase().includes(q));}
  if(EV_STATE.conflict) list=list.filter(e=>e.conflict_id===EV_STATE.conflict);
  if(EV_STATE.sev==='high') list=list.filter(e=>e.severity>=7);
  else if(EV_STATE.sev==='mid') list=list.filter(e=>e.severity>=4&&e.severity<=6);
  else if(EV_STATE.sev==='low') list=list.filter(e=>e.severity<=3);
  if(EV_STATE.ruptureOnly) list=list.filter(e=>e.rupture);
  list.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));

  // Bandeau d'en-tête avec stats fraîcheur
  const histCount = histEvents.length, rssCount = rssEvents.length;
  const lastUpd = NEWS_STATE.lastUpdate ? Math.round((Date.now()-new Date(NEWS_STATE.lastUpdate))/60000) : null;
  const freshLabel = lastUpd===null ? 'aucune collecte' : (lastUpd<1?'à l\'instant':`il y a ${lastUpd} min`);
  const freshCol = lastUpd===null||lastUpd>15 ? '#f59e0b' : '#22c55e';
  const headerEl = document.getElementById('events-header');
  if(headerEl){
    headerEl.innerHTML = `<div class="card" style="margin:0 0 14px;background:linear-gradient(135deg,#0a1428 0%,#060912 100%);border:1px solid #1a2340">
      <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;justify-content:space-between">
        <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center">
          <span style="font-size:.84rem;color:#cbd5e1"><i class="fa-solid fa-list-check" style="color:#60a5fa"></i> <b>Chronologie consolidée</b></span>
          <span style="font-size:.74rem;color:#94a3b8">${list.length} événements affichés · ${histCount} jalons historiques · <span style="color:#86efac">${rssCount} événements RSS</span> · maj : <span style="color:${freshCol}">${freshLabel}</span></span>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn ${srcFilter==='all'?'primary':'ghost'} sm" onclick="EV_STATE.source='all';renderEvents()"><i class="fa-solid fa-layer-group"></i> Tout (${histCount+rssCount})</button>
          <button class="btn ${srcFilter==='rss'?'primary':'ghost'} sm" onclick="EV_STATE.source='rss';renderEvents()"><i class="fa-solid fa-broadcast-tower"></i> RSS live (${rssCount})</button>
          <button class="btn ${srcFilter==='manual'?'primary':'ghost'} sm" onclick="EV_STATE.source='manual';renderEvents()"><i class="fa-solid fa-bookmark"></i> Jalons (${histCount})</button>
          <button class="btn primary sm" onclick="loadNews()"><i class="fa-solid fa-rotate"></i> Actualiser</button>
        </div>
      </div>
    </div>`;
  }

  document.getElementById('tbl-events').innerHTML = list.slice(0,200).map(e=>{
    const c = d.conflicts.find(x=>x.id===e.conflict_id);
    const liveBadge = e._live ? '<span class="chip" style="background:rgba(34,197,94,.18);color:#86efac;font-size:.6rem;border:1px solid rgba(34,197,94,.35);font-weight:700"><i class="fa-solid fa-broadcast-tower" style="font-size:.55rem"></i> RSS</span>' : '<span class="chip" style="background:rgba(167,139,250,.15);color:#c4b5fd;font-size:.6rem;border:1px solid rgba(167,139,250,.35)">📚 Jalon</span>';
    const titleHTML = e._live && e._link ? `<a href="${e._link}" target="_blank" rel="noopener" style="color:#e2e8f0;text-decoration:none">${e.rupture?'⚠ ':''}${(e.title||'').slice(0,160)}${(e.title||'').length>160?'…':''}<i class="fa-solid fa-arrow-up-right-from-square" style="font-size:.6rem;margin-left:5px;color:#60a5fa"></i></a>` : `${e.rupture?'⚠ ':''}${e.title}`;
    const typeChip = e._live ? `<span class="chip gray" style="font-size:.62rem">${e._source||e.type||'RSS'}</span>` : `<span class="chip ${e.rupture?'red':'gray'}" style="font-size:.62rem">${e.rupture?'Rupture':e.type||'—'}</span>`;
    return `<tr><td style="color:#94a3b8;font-size:.74rem;white-space:nowrap">${fmt.date(e.date)}</td><td><b>${c?.short||c?.name||'—'}</b></td><td>${titleHTML}</td><td>${liveBadge}</td><td>${typeChip}</td><td>${sevBar(e.severity)}</td><td></td></tr>`;
  }).join('') || '<tr><td colspan="7"><div class="empty"><i class="fa-solid fa-inbox"></i><p>Aucun résultat avec ces filtres.</p></div></td></tr>';
}

/* ============= NEWS / RSS — 5 proxies + catégorisation + auto-refresh + auto-désactivation ============= */
const NEWS_STATE = { items:[], lastUpdate:null, autoTimer:null, currentCat:'all' };
window.NEWS_STATE = NEWS_STATE; // Exposé pour le module GW_INTEL (IMS-BF, BQS, Veille adversariale)

/* Compteur d'échecs persistant : auto-désactive les sources qui échouent 3 fois consécutives */
function getFailCount(sourceId){
  try{ return JSON.parse(localStorage.getItem('gw_rss_fails')||'{}')[sourceId]||0; }catch(e){return 0;}
}
function incrementFailCount(sourceId){
  try{
    const f = JSON.parse(localStorage.getItem('gw_rss_fails')||'{}');
    f[sourceId] = (f[sourceId]||0) + 1;
    localStorage.setItem('gw_rss_fails', JSON.stringify(f));
    if(f[sourceId]>=3){
      const d = DB.get();
      d.rss_active = (d.rss_active||[]).filter(id=>id!==sourceId);
      DB.save(d);
    }
  }catch(e){}
}
function resetFailCount(sourceId){
  try{
    const f = JSON.parse(localStorage.getItem('gw_rss_fails')||'{}');
    delete f[sourceId];
    localStorage.setItem('gw_rss_fails', JSON.stringify(f));
  }catch(e){}
}
function clearAllFailCounts(){ try{ localStorage.removeItem('gw_rss_fails'); }catch(e){} }

/* Fetch avec timeout */
function fetchTimeout(url, ms=8000){
  return Promise.race([
    fetch(url, {mode:'cors'}),
    new Promise((_,rej)=>setTimeout(()=>rej(new Error('Timeout')), ms))
  ]);
}

/* Parse XML générique */
function parseXMLItems(xmlText){
  const xml = new DOMParser().parseFromString(xmlText,'text/xml');
  if(xml.querySelector('parsererror')) return [];
  return [...xml.querySelectorAll('item, entry')].slice(0,20).map(it=>{
    // Cherche le contenu le plus riche disponible : content:encoded > content > description > summary
    const fullHTML = it.querySelector('encoded')?.textContent
      || it.querySelector('content')?.textContent
      || it.querySelector('description')?.textContent
      || it.querySelector('summary')?.textContent
      || '';
    const clean = fullHTML.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
    return {
      title: (it.querySelector('title')?.textContent||'').trim(),
      link: it.querySelector('link')?.getAttribute('href') || it.querySelector('link')?.textContent || it.querySelector('guid')?.textContent || '',
      pubDate: it.querySelector('pubDate, published, updated, dc\\:date')?.textContent || new Date().toISOString(),
      description: clean
    };
  }).filter(i=>i.title && i.link);
}

/* 4 proxies en cascade — résilience max */
async function fetchRSS(url){
  // 1) rss2json
  try{
    const r = await fetchTimeout(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&count=15`, 8000);
    if(r.ok){ const j=await r.json(); if(j.status==='ok' && j.items?.length) return j.items; }
  }catch(e){}
  // 2) allorigins (raw)
  try{
    const r = await fetchTimeout(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, 8000);
    if(r.ok){ const txt = await r.text(); const items = parseXMLItems(txt); if(items.length) return items; }
  }catch(e){}
  // 3) allorigins (get)
  try{
    const r = await fetchTimeout(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, 8000);
    if(r.ok){ const j = await r.json(); if(j.contents){ const items = parseXMLItems(j.contents); if(items.length) return items; } }
  }catch(e){}
  // 4) corsproxy.io
  try{
    const r = await fetchTimeout(`https://corsproxy.io/?${encodeURIComponent(url)}`, 8000);
    if(r.ok){ const txt = await r.text(); const items = parseXMLItems(txt); if(items.length) return items; }
  }catch(e){}
  // 5) thingproxy
  try{
    const r = await fetchTimeout(`https://thingproxy.freeboard.io/fetch/${url}`, 8000);
    if(r.ok){ const txt = await r.text(); const items = parseXMLItems(txt); if(items.length) return items; }
  }catch(e){}
  throw new Error('All proxies failed: '+url);
}

/* === ACTUALITÉS DE DÉMONSTRATION (si tous les proxies échouent) === */
const NEWS_DEMO = [
  {title:'Burkina Faso : nouvelle attaque de JNIM dans la région du Centre-Est', source:'GéoWatch démo', link:'#', pubDate:new Date(Date.now()-3600000).toISOString(), description:'Une attaque coordonnée du Jamaat Nusrat al-Islam wal Muslimin a visé une unité des VDP. Bilan provisoire : 18 victimes. La situation sécuritaire dans la région reste préoccupante.', _bf:true},
  {title:'AES : annonce de la création d\'une banque centrale commune Burkina-Mali-Niger', source:'GéoWatch démo', link:'#', pubDate:new Date(Date.now()-7200000).toISOString(), description:'Les trois États de l\'Alliance des États du Sahel ont confirmé la mise en place d\'une institution monétaire commune, première étape vers une sortie progressive du F CFA. La déclaration commune a été publiée à l\'issue d\'un sommet à Bamako.', _bf:true},
  {title:'Ormuz : le baril du Brent dépasse 140 $ après la fermeture du détroit', source:'GéoWatch démo', link:'#', pubDate:new Date(Date.now()-10800000).toISOString(), description:'Le blocus iranien sur le détroit d\'Ormuz, en réponse aux frappes américaines sur les sites nucléaires, fait flamber les cours du pétrole. Les économies importatrices comme le Burkina Faso voient leur facture énergétique exploser.', _bf:true},
  {title:'Ukraine : Trump ordonne la suspension complète des transferts ATACMS', source:'GéoWatch démo', link:'#', pubDate:new Date(Date.now()-14400000).toISOString(), description:'Le décret exécutif signé hier au Bureau ovale stoppe immédiatement la livraison de missiles à longue portée à Kyiv. L\'Union européenne tente de compenser mais les capacités industrielles sont insuffisantes à court terme.', _bf:false},
  {title:'M23 : nouvelle progression vers le Sud-Kivu, pression sur Bukavu', source:'GéoWatch démo', link:'#', pubDate:new Date(Date.now()-18000000).toISOString(), description:'Les combattants du M23 et leurs soutiens rwandais ont avancé de 30 km en direction de Bukavu. Le HCR alerte sur un nouveau déplacement massif de civils.', _bf:false},
  {title:'Soudan : nouvelle famine déclarée IPC 5 dans le Kordofan-Sud', source:'GéoWatch démo', link:'#', pubDate:new Date(Date.now()-21600000).toISOString(), description:'L\'IPC a confirmé un nouveau foyer de famine au Kordofan-Sud, en plus du Darfour. Le seuil de 10 millions de déplacés a été franchi selon l\'OCHA.', _bf:false},
  {title:'Sahel : 4 attaques jihadistes en 48 heures au Burkina, Mali et Niger', source:'GéoWatch démo', link:'#', pubDate:new Date(Date.now()-25200000).toISOString(), description:'L\'EIGS (État islamique au Grand Sahara) a revendiqué 4 attaques simultanées dans la zone des trois frontières. Les forces conjointes AES annoncent une riposte coordonnée.', _bf:true},
  {title:'Or : les cours mondiaux atteignent un nouveau record historique', source:'GéoWatch démo', link:'#', pubDate:new Date(Date.now()-28800000).toISOString(), description:'L\'once d\'or dépasse les 3 200 $ pour la première fois. Effet positif mécanique pour les économies productrices comme le Burkina Faso, dont l\'or représente 75 % des exportations.', _bf:true},
  {title:'Taïwan : nouvel exercice naval chinois encerclant l\'île', source:'GéoWatch démo', link:'#', pubDate:new Date(Date.now()-32400000).toISOString(), description:'L\'Armée populaire de libération a déployé 145 avions et 27 navires autour de Taïwan dans le cadre de l\'exercice « Strait Thunder 2026B ». Tokyo et Manille élèvent leur niveau d\'alerte.', _bf:false},
  {title:'CEDEAO : nouvel échec des pourparlers avec l\'AES sur la libre circulation', source:'GéoWatch démo', link:'#', pubDate:new Date(Date.now()-36000000).toISOString(), description:'Les délégations de la CEDEAO et de la Confédération AES n\'ont trouvé aucun accord à Lomé. La question des passeports communautaires et de la circulation des biens reste en suspens.', _bf:true},
  {title:'Gaza : OCHA confirme l\'aggravation de la crise alimentaire au nord', source:'GéoWatch démo', link:'#', pubDate:new Date(Date.now()-39600000).toISOString(), description:'Selon le Bureau de coordination des affaires humanitaires de l\'ONU, 92 % de la population du nord de Gaza est en insécurité alimentaire aiguë. La frontière de Rafah reste fermée par intermittence.', _bf:false},
  {title:'Iran : Mojtaba Khamenei pressenti comme nouveau Guide suprême', source:'GéoWatch démo', link:'#', pubDate:new Date(Date.now()-43200000).toISOString(), description:'L\'Assemblée des experts a entamé les consultations pour désigner un successeur à l\'ayatollah Khamenei. Son fils Mojtaba apparaît comme le favori des Pasdaran.', _bf:false}
];

async function diagnosticProxies(){
  const testUrl = 'http://feeds.bbci.co.uk/news/world/rss.xml';
  const proxies = [
    {n:'rss2json', u:`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(testUrl)}&count=1`},
    {n:'allorigins (raw)', u:`https://api.allorigins.win/raw?url=${encodeURIComponent(testUrl)}`},
    {n:'allorigins (get)', u:`https://api.allorigins.win/get?url=${encodeURIComponent(testUrl)}`},
    {n:'corsproxy.io', u:`https://corsproxy.io/?${encodeURIComponent(testUrl)}`},
    {n:'thingproxy', u:`https://thingproxy.freeboard.io/fetch/${testUrl}`}
  ];
  const listEl = document.getElementById('news-list');
  listEl.innerHTML = '<div class="loading"><i class="fa-solid fa-spinner"></i>Diagnostic des proxies CORS en cours...</div>';
  const results = [];
  for(const p of proxies){
    const t0 = Date.now();
    try{ const r = await fetchTimeout(p.u, 6000); results.push({n:p.n, ok:r.ok, status:r.status, ms:Date.now()-t0}); }
    catch(e){ results.push({n:p.n, ok:false, err:e.message, ms:Date.now()-t0}); }
  }
  listEl.innerHTML = `<div class="card" style="margin:0"><div class="card-hd"><h2><i class="fa-solid fa-stethoscope"></i>Diagnostic proxies CORS</h2></div>
    <div style="font-size:.82rem;color:#94a3b8;margin-bottom:12px">Test de connectivité avec un flux BBC. Si tous échouent, c'est un problème réseau ou environnement <code>file://</code>.</div>
    <table class="tbl"><thead><tr><th>Proxy</th><th>Statut</th><th>Temps</th><th>Détails</th></tr></thead><tbody>
    ${results.map(r=>`<tr><td><b>${r.n}</b></td><td><span class="chip ${r.ok?'green':'red'}">${r.ok?'OK':'ÉCHEC'}</span></td><td>${r.ms} ms</td><td style="font-size:.74rem;color:#94a3b8">${r.ok?`HTTP ${r.status}`:r.err||'—'}</td></tr>`).join('')}
    </tbody></table>
    <div style="margin-top:12px;font-size:.78rem;color:#cbd5e1;line-height:1.5;background:#0a0f1c;padding:11px;border-radius:6px;border-left:3px solid #60a5fa">
      <b style="color:#60a5fa">💡 Si tous échouent :</b> ouvrez le site déployé (GitHub Pages, Vercel) au lieu du fichier local. Les proxies CORS bloquent souvent les requêtes <code>file://</code> par sécurité.
    </div></div>`;
}

function loadDemoNews(){
  NEWS_STATE.items = NEWS_DEMO.map(n=>({
    ...n,
    _source: n.source,
    _conflicts: tagNewsByConflict(n),
    _tags: categorizeNews(n)
  }));
  NEWS_STATE.lastUpdate = new Date();
  updateLastUpdateLabel();
  renderNewsList();
  detectAndPushNewItems();
}

/* Tag conflit (par mots-clés) */
function tagNewsByConflict(item){
  const d = DB.get();
  const text = ((item.title||'')+' '+(item.description||'')).toLowerCase();
  return d.conflicts.filter(c=>(c.keywords||[]).some(kw=>text.includes(kw.toLowerCase())));
}

/* Catégorise par tags thématiques (eco/diplo/militaire/...) */
function categorizeNews(item){
  const text = ((item.title||'')+' '+(item.description||'')).toLowerCase();
  const cats = window.GW_DATA?.NEWS_CATEGORIES || {};
  const matched = [];
  Object.entries(cats).forEach(([k,kws])=>{ if(kws.some(kw=>text.includes(kw))) matched.push(k); });
  return matched;
}

/* Détecte la pertinence Burkina Faso */
function detectBFRelevance(item){
  const text = ((item.title||'')+' '+(item.description||'')).toLowerCase();
  const bfKw = ['burkina','ouagadougou','sahel','aes','traoré','jnim','bamako','niamey','wagner','africa corps','cfa','cedeao','franc cfa','sankara'];
  return bfKw.some(kw=>text.includes(kw));
}

/* Sources actives : croise paramètres user + sources étendues du fichier sources.js */
function getActiveSources(){
  const d = DB.get();
  const full = window.GW_DATA?.RSS_SOURCES_FULL || [];
  const defaultActive = window.GW_DATA?.RSS_DEFAULT_ACTIVE || full.slice(0,10).map(s=>s.id);
  // Première utilisation : initialise
  if(!d.rss_active){
    d.rss_active = defaultActive;
    DB.save(d);
  }
  // Migration : si le user a une liste pré-curée (ancienne version), basculer vers nouvelle liste vérifiée
  // Détection : si AUCUNE source vérifiée n'est active mais des anciennes IDs existent
  const currentIds = new Set(d.rss_active);
  const verifiedIds = full.filter(s=>s.verified).map(s=>s.id);
  const anyVerifiedActive = verifiedIds.some(id=>currentIds.has(id));
  if(!anyVerifiedActive && d.rss_active.length>0 && !d.rss_active_user_modified){
    d.rss_active = defaultActive;
    DB.save(d);
  }
  // Mode catégorie : si l'utilisateur clique sur une catégorie, on charge SES sources
  if(NEWS_STATE.currentCat && NEWS_STATE.currentCat!=='all' && NEWS_STATE.currentCat!=='bf-impact'){
    return full.filter(s=>s.cat===NEWS_STATE.currentCat);
  }
  // Sinon : sources sélectionnées
  return full.filter(s=>d.rss_active.includes(s.id));
}

/* ============= TRADUCTION AUTO (Google Translate gtx) ============= */
async function translateToFr(text){
  if(!text || !text.trim()) return text;
  try{
    const url='https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fr&dt=t&q='+encodeURIComponent(text);
    const r=await fetch(url);
    if(!r.ok) throw new Error('HTTP '+r.status);
    const d=await r.json();
    return (d[0]||[]).map(s=>s[0]||'').join('');
  }catch(e){ return text; } // fallback texte original
}

async function translateEnglishItems(items){
  const engItems=items.filter(it=>{
    const src=(window.GW_DATA?.RSS_SOURCES_FULL||[]).find(s=>s.id===it._sourceId);
    return src?.lang==='en' && !it._translated;
  });
  if(!engItems.length) return;
  for(const it of engItems){
    try{
      const [tTitle,tDesc]=await Promise.all([
        translateToFr(it.title||''),
        translateToFr((it.description||'').slice(0,500))
      ]);
      if(tTitle) it.title=tTitle;
      if(tDesc) it.description=tDesc+(it.description&&it.description.length>500?' […]':'');
      it._translated=true;
    }catch(e){ /* garde le texte original si traduction échoue */ }
    await new Promise(r=>setTimeout(r,60)); // petite pause anti-throttle
  }
}

async function loadNews(){
  const sources = getActiveSources();
  const statusEl = document.getElementById('src-status');
  const listEl = document.getElementById('news-list');
  listEl.innerHTML = '<div class="loading"><i class="fa-solid fa-spinner"></i>Chargement de '+sources.length+' flux RSS...</div>';

  const catEmoji = { thinktank:'🧠', geopol:'🌐', economic:'💰', diplomatic:'🤝', humanitarian:'🆘', africa:'🌍', asia:'🏯' };
  statusEl.innerHTML = sources.map(s=>{
    const verifiedBadge = s.verified===true ? '<span style="color:#22c55e;margin-right:3px;font-weight:700" title="Vérifié">✓</span>' : '<span style="color:#f59e0b;margin-right:3px" title="À tester">⚠</span>';
    const langBadge = s.lang==='fr' ? '<span style="font-size:.65rem;background:rgba(59,130,246,.2);color:#60a5fa;padding:1px 4px;border-radius:3px;margin-right:3px">🇫🇷</span>' : '<span style="font-size:.65rem;background:rgba(100,116,139,.2);color:#94a3b8;padding:1px 4px;border-radius:3px;margin-right:3px">🇬🇧</span>';
    return `<span class="src-chip loading" id="src-${s.id}" title="${s.url}"><i class="fa-solid fa-circle"></i>${langBadge}${verifiedBadge}${catEmoji[s.cat]||''} ${s.name}</span>`;
  }).join('');

  const all = [];
  let okCount = 0, errCount = 0, autoDisabled = [];
  await Promise.allSettled(sources.map(async s=>{
    try{
      const items = await fetchRSS(s.url);
      items.forEach(i=>{ i._source=s.name; i._sourceCat=s.cat; i._sourceId=s.id; });
      all.push(...items);
      resetFailCount(s.id);
      const chip = document.getElementById('src-'+s.id);
      if(chip){ chip.className='src-chip ok'; chip.innerHTML=`<i class="fa-solid fa-circle"></i>${catEmoji[s.cat]||''} ${s.name} (${items.length})`; }
      okCount++;
    } catch(e){
      incrementFailCount(s.id);
      const fails = getFailCount(s.id);
      const chip = document.getElementById('src-'+s.id);
      if(chip){
        if(fails>=3){
          chip.className='src-chip err'; chip.innerHTML=`<i class="fa-solid fa-circle"></i>${s.name} — désactivé (3 échecs)`;
          autoDisabled.push(s.name);
        } else {
          chip.className='src-chip err'; chip.innerHTML=`<i class="fa-solid fa-circle"></i>${s.name} — échec ${fails}/3`;
        }
      }
      errCount++;
    }
  }));
  if(autoDisabled.length) toast(`Désactivation auto : ${autoDisabled.join(', ')}`,'info');

  // Trie par date desc
  all.sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate));

  // Enrichit chaque item : tags conflits, catégories, pertinence BF
  NEWS_STATE.items = all.slice(0,150).map(it=>({
    ...it,
    _conflicts: tagNewsByConflict(it),
    _tags: categorizeNews(it),
    _bf: detectBFRelevance(it)
  }));
  NEWS_STATE.lastUpdate = new Date();

  updateLastUpdateLabel();

  // Si TOUS les proxies ont échoué, on bascule en mode démo
  if(okCount===0 && sources.length>0){
    toast('Tous les proxies CORS bloqués (mode local file://). Chargement actualités de démonstration.','error');
    loadDemoNews();
    const listEl = document.getElementById('news-list');
    listEl.insertAdjacentHTML('afterbegin', `<div style="background:rgba(239,68,68,.08);border:1px solid #7f1d1d;border-radius:8px;padding:12px 14px;margin-bottom:12px;font-size:.82rem;color:#fca5a5"><b><i class="fa-solid fa-triangle-exclamation"></i> Flux RSS bloqués</b><br><span style="color:#fecaca">Les proxies CORS publics ne sont pas joignables depuis votre environnement local. Ceci est <b>normal en mode <code>file://</code></b>. Une fois le site déployé sur GitHub Pages / Vercel / Netlify, les flux fonctionneront correctement. <br>En attendant, voici 12 actualités de démonstration crédibles pour tester l'interface.</span></div>`);
    return;
  }

  // Traduction automatique des articles en anglais → français
  const engCount = NEWS_STATE.items.filter(it=>{
    const src=(window.GW_DATA?.RSS_SOURCES_FULL||[]).find(s=>s.id===it._sourceId);
    return src?.lang==='en';
  }).length;
  if(engCount>0){
    document.getElementById('news-list').innerHTML=`<div class="loading"><i class="fa-solid fa-language"></i> Traduction de ${engCount} article(s) anglais en français…</div>`;
    await translateEnglishItems(NEWS_STATE.items);
  }

  renderNewsList();
  detectAndPushNewItems();
  // Re-render la page active (couvre TOUTES les pages dynamiques)
  rerenderActivePage();
  // Met à jour le badge "Veille mondiale" dans la sidebar (visible depuis toutes les pages)
  if(typeof wwUpdateBadge==='function') wwUpdateBadge();
  // Toujours mettre à jour la pill freshness en topbar
  updateLastUpdateLabel();
  // Détection synthèse pour le toast
  let wwTotal = 0;
  try { wwTotal = wwDetectBilateral(NEWS_STATE.items).length + wwDetectHotZones(NEWS_STATE.items).length; } catch(e){}
  toast(`${NEWS_STATE.items.length} articles • ${okCount}/${sources.length} flux OK${engCount>0?' • '+engCount+' traduits 🇫🇷':''}${wwTotal>0?' • '+wwTotal+' tensions détectées 🌍':''}`, okCount>0?'success':'error');
}

function updateLastUpdateLabel(){
  const el = document.getElementById('news-last-update');
  const fdot = document.getElementById('tb-freshness-dot');
  const ftxt = document.getElementById('tb-freshness-txt');
  const fbtn = document.getElementById('tb-freshness');
  if(!NEWS_STATE.lastUpdate){
    if(el){ el.textContent='⏳ Chargement automatique en cours…'; el.style.color='#f59e0b'; }
    if(fdot){ fdot.style.background='#f59e0b'; fdot.style.boxShadow='0 0 8px #f59e0b'; }
    if(ftxt) ftxt.textContent='RSS chargement…';
    if(fbtn) fbtn.style.borderColor='rgba(245,158,11,.4)';
    return;
  }
  const diff = Math.round((new Date()-NEWS_STATE.lastUpdate)/60000);
  const ageStr = diff===0?'à l\'instant':diff+' min';
  let nextStr = '';
  if(NEWS_STATE.nextRefresh && document.getElementById('news-auto')?.checked){
    const sec = Math.max(0,Math.round((NEWS_STATE.nextRefresh-Date.now())/1000));
    const m = Math.floor(sec/60), s = sec%60;
    nextStr = ` • ⏱ next ${m}m${s.toString().padStart(2,'0')}`;
  }
  if(el){
    el.textContent = `🛰 Maj : ${ageStr}${nextStr}`;
    el.style.color = diff<15 ? '#86efac' : '#f59e0b';
  }
  // Pill globale dans la topbar
  const col = diff<10?'#22c55e':diff<30?'#f59e0b':'#ef4444';
  const lbl = diff<10?'À jour':diff<30?'À actualiser':'Obsolète';
  if(fdot){ fdot.style.background=col; fdot.style.boxShadow='0 0 8px '+col; fdot.style.animation='pulse 2s infinite'; }
  if(ftxt) ftxt.innerHTML = `<b style="color:${col}">${lbl}</b> · RSS ${ageStr} · ${NEWS_STATE.items.length} articles`;
  if(fbtn) fbtn.style.borderColor = col+'66';
}

/* Hook freshness pill click → loadNews */
document.addEventListener('click',(ev)=>{
  if(ev.target.closest('#tb-freshness')){ ev.preventDefault(); loadNews(); toast('Actualisation RSS en cours…','info'); }
});

function renderNewsList(){
  const search = (document.getElementById('news-search').value||'').toLowerCase();
  const cid = document.getElementById('news-conflict').value;
  const tag = document.getElementById('news-tag')?.value;
  const cat = NEWS_STATE.currentCat;

  let items = NEWS_STATE.items;
  if(search) items = items.filter(i=>(i.title+' '+(i.description||'')).toLowerCase().includes(search));
  if(cid) items = items.filter(i=>(i._conflicts||[]).some(c=>c.id===cid));
  if(tag) items = items.filter(i=>(i._tags||[]).includes(tag));
  if(cat==='bf-impact') items = items.filter(i=>i._bf);

  const el = document.getElementById('news-list');
  if(!items.length){ el.innerHTML='<div class="empty"><i class="fa-solid fa-inbox"></i><p>Aucun article. Cliquez « Actualiser » ou changez les filtres.</p></div>'; return; }

  const tagEmoji = { economic:'💰', diplomatic:'🤝', military:'⚔️', humanitarian:'🆘', political:'🏛️' };
  const tagColor = { economic:'orange', diplomatic:'blue', military:'red', humanitarian:'purple', political:'green' };

  el.innerHTML = items.slice(0,100).map((it,idx)=>{
    const conflictTags = (it._conflicts||[]).slice(0,3).map(c=>`<span class="chip orange" style="cursor:pointer" onclick="showConflictDetail('${c.id}')">${c.short||c.name}</span>`).join('');
    const themeTags = (it._tags||[]).map(t=>`<span class="chip ${tagColor[t]||'gray'}">${tagEmoji[t]||''} ${t}</span>`).join('');
    const bfBadge = it._bf ? `<span class="chip" style="background:rgba(253,224,71,.18);color:#fde047;border:1px solid rgba(253,224,71,.5)">🇧🇫 Pertinent BF</span>` : '';
    const reliabilityBadge = (typeof GW_INTEL!=='undefined') ? GW_INTEL.reliabilityChip(it) : '';
    const blockKey = (typeof GW_INTEL!=='undefined') ? GW_INTEL.classifyBlock(it) : null;
    const blockMeta = blockKey && GW_INTEL.BLOCKS[blockKey];
    const blockBadge = blockMeta ? `<span class="chip" style="background:${blockMeta.color}15;color:${blockMeta.color};border:1px solid ${blockMeta.color}55;font-size:.62rem" title="${blockMeta.label}">${blockMeta.flag} ${blockMeta.label.split(' ')[0]}</span>` : '';
    const srcObj = (window.GW_DATA?.RSS_SOURCES_FULL||[]).find(s=>s.id===it._sourceId);
    const isEn = srcObj?.lang==='en';
    const langBadge = !isEn
      ? `<span class="chip" style="background:rgba(59,130,246,.15);color:#93c5fd;font-size:.65rem;border:1px solid rgba(59,130,246,.3)">🇫🇷 FR</span>`
      : it._translated
        ? `<span class="chip" style="background:rgba(34,197,94,.12);color:#86efac;font-size:.65rem;border:1px solid rgba(34,197,94,.3)" title="Traduit automatiquement depuis l'anglais">🔄 Traduit EN→FR</span>`
        : `<span class="chip gray" style="font-size:.65rem">🇬🇧 EN</span>`;
    const fullDesc = (it.description||'').replace(/<[^>]+>/g,'').trim();
    const preview = fullDesc.length > 320 ? fullDesc.slice(0,320)+'…' : fullDesc;
    const hasMore = fullDesc.length > 320;
    const globalIdx = NEWS_STATE.items.indexOf(it);
    return `<div class="news-item">
      <div class="news-hd">
        <div class="news-title"><a href="${it.link}" target="_blank" rel="noopener">${it.title}</a></div>
        <div class="news-meta"><i class="fa-solid fa-newspaper"></i><b>${it._source||''}</b> • ${fmt.dateTime(it.pubDate)}</div>
      </div>
      ${preview?`<div class="news-desc" id="ndesc-${globalIdx}">${preview}</div>`:''}
      ${hasMore?`<button class="btn ghost sm" style="margin:4px 0 2px;font-size:.74rem" onclick="expandNews(${globalIdx})"><i class="fa-solid fa-chevron-down"></i> Lire intégralement</button>`:''}
      <div class="news-tags" style="margin-top:6px">${reliabilityBadge}${blockBadge}${langBadge}${bfBadge}${conflictTags}${themeTags}
        <a href="${it.link}" target="_blank" rel="noopener" class="chip gray" style="text-decoration:none;margin-left:auto"><i class="fa-solid fa-arrow-up-right-from-square"></i> Article source</a>
      </div>
    </div>`;
  }).join('');
}

/* Expand article en place */
function expandNews(idx){
  const it = NEWS_STATE.items[idx]; if(!it) return;
  const el = document.getElementById('ndesc-'+idx); if(!el) return;
  const btn = el.nextElementSibling;
  el.textContent = (it.description||'').replace(/<[^>]+>/g,'').trim();
  if(btn && btn.tagName==='BUTTON') btn.remove();
}

function renderNews(){
  if(NEWS_STATE.items.length===0){
    document.getElementById('news-list').innerHTML='<div class="loading"><i class="fa-solid fa-spinner"></i>Cliquez sur « Actualiser » pour charger les flux RSS (think tanks + presse + économie + diplomatie + Afrique).</div>';
  } else { renderNewsList(); updateLastUpdateLabel(); }
}

/* Auto-refresh : 10 min par défaut + countdown visible */
function startAutoRefresh(){
  if(NEWS_STATE.autoTimer) clearInterval(NEWS_STATE.autoTimer);
  if(NEWS_STATE.countdownTimer) clearInterval(NEWS_STATE.countdownTimer);
  if(NEWS_STATE.staleCheckTimer) clearInterval(NEWS_STATE.staleCheckTimer);

  const INTERVAL_MS = 10*60*1000; // 10 min — actualisation RSS complète
  NEWS_STATE.nextRefresh = Date.now() + INTERVAL_MS;

  // ═══ TIMER PRINCIPAL : RSS toutes les 10 min ═══
  // Le checkbox news-auto, s'il existe, peut désactiver l'auto. Par défaut : ON.
  NEWS_STATE.autoTimer = setInterval(()=>{
    const autoCheckbox = document.getElementById('news-auto');
    const autoEnabled = !autoCheckbox || autoCheckbox.checked; // Par défaut ON si checkbox absent
    if(autoEnabled){
      loadNews().catch(e=>console.warn('Auto-refresh RSS failed:',e));
      NEWS_STATE.nextRefresh = Date.now() + INTERVAL_MS;
    }
    updateLastUpdateLabel();
    rerenderActivePage();
    if(typeof wwUpdateBadge==='function') wwUpdateBadge();
  }, INTERVAL_MS);

  // ═══ Countdown affiché toutes les 30s ═══
  NEWS_STATE.countdownTimer = setInterval(()=>{ updateLastUpdateLabel(); }, 30*1000);

  // ═══ STALE-CHECK toutes les 60 sec : vérifie si la page actuelle est obsolète ═══
  // Si l'utilisateur reste longtemps sur une page, on re-render toutes les 60s
  // pour rafraîchir les compteurs, "il y a X min", etc. — sans nouveau loadNews.
  NEWS_STATE.staleCheckTimer = setInterval(()=>{
    rerenderActivePage();
  }, 60*1000);
}

/* ====================================================================
   Re-render la page active — appelé après RSS load et à chaque tick.
   Couvre TOUTES les pages dynamiques pour éviter qu'une page reste figée.
   ==================================================================== */
function rerenderActivePage(){
  const cur = document.querySelector('.page.active')?.dataset.page;
  if(!cur) return;
  try {
    if(cur==='dash') renderDashboard();
    else if(cur==='bqs') renderBQS();
    else if(cur==='adversarial') renderAdversarial();
    else if(cur==='impact_radar') renderImpactRadar();
    else if(cur==='alerts') renderAlerts();
    else if(cur==='sources') renderSources();
    else if(cur==='conflicts') renderConflicts();
    else if(cur==='worldwatch') renderWorldWatch();
    else if(cur==='events') renderEvents();
    else if(cur==='news') renderNewsList();
    else if(cur==='briefs') renderBriefs();
    else if(cur==='scenarios') renderScenarios();
    else if(cur==='indicators') renderIndicators();
    else if(cur==='reconfig') renderReconfig();
    else if(cur==='impact_bf') renderImpactBF();
    else if(cur==='analyses') renderAnalyses();
    else if(cur==='geointel') renderGeoIntel();
    else if(cur==='countries' && typeof renderCountries==='function') renderCountries();
  } catch(e){ console.warn('rerenderActivePage('+cur+'):', e); }
}

/* ============= NOTIFICATIONS (panel + Web API) ============= */
const NOTIF_STATE = { items:[], seenUrls:new Set(), permission:'default' };

function loadNotifSeen(){
  try{ const seen = JSON.parse(localStorage.getItem('gw_seen_news')||'[]'); seen.forEach(u=>NOTIF_STATE.seenUrls.add(u)); }catch(e){}
  try{ NOTIF_STATE.items = JSON.parse(localStorage.getItem('gw_notif_items')||'[]'); }catch(e){}
}

/* Helper : construit une entrée du panel notifications depuis un article */
function buildNotifEntry(it){
  return {
    id:'n_'+Date.now()+Math.random(),
    title:it.title,
    desc:(it.description||'').slice(0,200),
    link:it.link,
    source:it._source||'',
    date:it.pubDate,
    bf:!!it._bf,
    tags:it._tags||[],
    majors:it._majors||[],
    conflicts:(it._conflicts||[]).map(c=>({id:c.id,name:c.short||c.name})),
    read:false
  };
}
function saveNotifSeen(){
  // Limiter à 500 derniers urls vus
  const arr = [...NOTIF_STATE.seenUrls].slice(-500);
  try{ localStorage.setItem('gw_seen_news', JSON.stringify(arr)); }catch(e){}
  try{ localStorage.setItem('gw_notif_items', JSON.stringify(NOTIF_STATE.items.slice(0,50))); }catch(e){}
}

function requestNotifPermission(){
  if(!('Notification' in window)){
    console.warn('Notifications non supportées par ce navigateur');
    return;
  }
  if(Notification.permission==='default'){
    Notification.requestPermission().then(p=>{
      NOTIF_STATE.permission = p;
      if(p==='granted'){
        toast('🔔 Notifications activées — vous recevrez les alertes majeures','success');
        // Notification de test pour confirmer
        try{
          new Notification('GéoWatch — notifications activées', {
            body: 'Vous serez alerté(e) des événements majeurs détectés sur les flux RSS.',
            icon:'data:image/svg+xml;base64,'+btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#1e293b"/><text x="32" y="44" text-anchor="middle" fill="#fde047" font-size="40" font-weight="bold">G</text></svg>')
          });
        }catch(e){}
      } else if(p==='denied'){
        toast('Notifications refusées. Vous pouvez les réactiver dans les paramètres du navigateur.','error');
      }
    });
  } else {
    NOTIF_STATE.permission = Notification.permission;
    if(Notification.permission==='denied'){
      // Bandeau persistant pour informer l'utilisateur
      showNotifBlockedBanner();
    }
  }
}

/* Bandeau d'information : notifications bloquées */
function showNotifBlockedBanner(){
  if(document.getElementById('notif-blocked-banner')) return;
  const b = document.createElement('div');
  b.id = 'notif-blocked-banner';
  b.style.cssText = 'background:rgba(245,158,11,.1);border:1px solid #d97706;border-radius:6px;padding:10px 14px;margin:0 0 12px;font-size:.78rem;color:#fde047;display:flex;align-items:center;gap:10px;flex-wrap:wrap';
  b.innerHTML = `<i class="fa-solid fa-bell-slash" style="color:#f59e0b"></i>
    <span style="flex:1"><b>Notifications bloquées</b> — pour les recevoir, cliquez sur 🔒 dans la barre d'adresse de votre navigateur et autorisez les notifications, puis rechargez la page.</span>
    <button onclick="this.parentElement.remove()" style="background:transparent;border:1px solid #d97706;color:#fde047;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:.7rem">Fermer</button>`;
  const main = document.querySelector('.main') || document.body;
  main.insertBefore(b, main.firstChild);
}

function pushBrowserNotif(item){
  if(!('Notification' in window) || Notification.permission!=='granted') return;
  try{
    const n = new Notification(item.title.slice(0,80), {
      body: (item.description||'').slice(0,140),
      icon: 'data:image/svg+xml;base64,'+btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#1e293b"/><text x="32" y="44" text-anchor="middle" fill="#fde047" font-size="40" font-family="sans-serif" font-weight="bold">G</text></svg>'),
      tag: item.link,
      requireInteraction: false
    });
    n.onclick = ()=>{ window.focus(); window.open(item.link,'_blank'); n.close(); };
    setTimeout(()=>n.close(), 8000);
  } catch(e){}
}

/* Détecte si un article correspond à un ÉVÉNEMENT MAJEUR */
function detectMajorEvent(item){
  const text = ((item.title||'')+' '+(item.description||'')).toLowerCase();
  const M = window.GW_DATA?.MAJOR_EVENT_KEYWORDS || {};
  const matched = [];
  Object.entries(M).forEach(([k,kws])=>{
    const found = kws.find(kw=>text.includes(kw));
    if(found){ matched.push({type:k, keyword:found}); }
  });
  return matched;
}

function detectAndPushNewItems(){
  if(!NEWS_STATE.items.length) return;
  const newOnes = [];
  const majorEvents = [];
  const isFirstRun = NOTIF_STATE.seenUrls.size === 0; // ne pas spammer au tout 1er chargement
  NEWS_STATE.items.forEach(it=>{
    if(!it.link) return;
    if(NOTIF_STATE.seenUrls.has(it.link)) return;
    NOTIF_STATE.seenUrls.add(it.link);
    const isPriority = it._bf || (it._conflicts||[]).some(c=>c.priority===1) || (it._tags||[]).includes('military') || (it._tags||[]).includes('diplomatic');
    const majors = detectMajorEvent(it);
    it._majors = majors;
    if(majors.length>0){
      majorEvents.push(it);
    }
    if(isPriority){
      newOnes.push(it);
    }
  });
  // Au premier chargement (pas de seen), on ne pousse que les majeurs sans toast spammant
  if(isFirstRun){
    NOTIF_STATE.items = newOnes.slice(0,20).map(buildNotifEntry);
    saveNotifSeen();
    updateNotifBadge();
    return;
  }
  // Toast in-app à chaque nouveau article BF (ne dépend PAS de la permission navigateur)
  const newBF = newOnes.filter(it=>it._bf);
  if(newBF.length>0){
    toast(`🇧🇫 ${newBF.length} nouvelle${newBF.length>1?'s':''} dépêche${newBF.length>1?'s':''} pertinente${newBF.length>1?'s':''} pour le BF`, 'info');
  }
  if(majorEvents.length>0){
    toast(`🚨 ${majorEvents.length} événement${majorEvents.length>1?'s':''} majeur${majorEvents.length>1?'s':''} détecté${majorEvents.length>1?'s':''} — voir notifications`, 'error');
  }
  // Ajouter dans le panel notifications (jusqu'à 15 nouveaux)
  newOnes.slice(0,15).forEach(it=>{
    NOTIF_STATE.items.unshift(buildNotifEntry(it));
  });
  NOTIF_STATE.items = NOTIF_STATE.items.slice(0,50);
  // Push notif navigateur RENFORCÉ pour les événements majeurs
  majorEvents.slice(0,3).forEach(pushMajorEventNotif);
  // Sinon, push standard pour BF
  newOnes.filter(it=>it._bf && (!it._majors || it._majors.length===0)).slice(0,2).forEach(pushBrowserNotif);
  // Bandeau rouge persistant si événements majeurs
  if(majorEvents.length>0){
    showMajorEventBanner(majorEvents);
  }
  saveNotifSeen();
  updateNotifBadge();
}

function pushMajorEventNotif(item){
  if(!('Notification' in window) || Notification.permission!=='granted') return;
  try{
    const types = (item._majors||[]).map(m=>m.type).join(', ');
    const n = new Notification('🚨 ÉVÉNEMENT MAJEUR — '+(item.title||'').slice(0,60), {
      body: `${types.toUpperCase()}\n\n${(item.description||'').slice(0,180)}`,
      icon: 'data:image/svg+xml;base64,'+btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#7f1d1d"/><text x="32" y="46" text-anchor="middle" fill="#fef2f2" font-size="38" font-weight="900">!</text></svg>'),
      tag: 'major_'+item.link,
      requireInteraction: true,  // reste affichée jusqu'à interaction utilisateur
      silent: false
    });
    n.onclick = ()=>{ window.focus(); window.open(item.link,'_blank'); n.close(); };
  } catch(e){}
}

function showMajorEventBanner(events){
  let banner = document.getElementById('major-banner');
  if(!banner){
    banner = document.createElement('div');
    banner.id = 'major-banner';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:linear-gradient(90deg,#7f1d1d 0%,#991b1b 50%,#7f1d1d 100%);color:#fff;padding:10px 18px;z-index:3000;display:flex;align-items:center;gap:12px;box-shadow:0 4px 16px rgba(127,29,29,.5);border-bottom:2px solid #ef4444;animation:bannerPulse 2s infinite';
    document.body.insertBefore(banner, document.body.firstChild);
    if(!document.getElementById('major-banner-style')){
      const st = document.createElement('style');
      st.id = 'major-banner-style';
      st.textContent = '@keyframes bannerPulse{0%,100%{box-shadow:0 4px 16px rgba(127,29,29,.5)}50%{box-shadow:0 4px 24px rgba(239,68,68,.9)}}';
      document.head.appendChild(st);
    }
  }
  const ev = events[0]; // affiche le premier en bandeau
  banner.innerHTML = `
    <i class="fa-solid fa-triangle-exclamation" style="font-size:1.4rem;color:#fde047;animation:pulse 1s infinite"></i>
    <div style="flex:1">
      <div style="font-weight:700;font-size:.9rem">🚨 ÉVÉNEMENT MAJEUR DÉTECTÉ${events.length>1?` (+${events.length-1} autres)`:''}</div>
      <div style="font-size:.78rem;color:#fecaca;margin-top:2px">${(ev.title||'').slice(0,140)}${(ev.title||'').length>140?'…':''}</div>
      <div style="font-size:.7rem;color:#fde047;margin-top:3px">Type : ${(ev._majors||[]).map(m=>m.type).join(' • ')} · Source : ${ev._source||'—'}</div>
    </div>
    <a href="${ev.link}" target="_blank" rel="noopener" style="background:#fff;color:#7f1d1d;padding:6px 14px;border-radius:6px;font-size:.78rem;font-weight:700;text-decoration:none">Lire →</a>
    <button onclick="document.getElementById('major-banner').remove()" style="background:transparent;color:#fff;border:1px solid rgba(255,255,255,.3);padding:5px 9px;border-radius:6px;cursor:pointer;font-size:.85rem">×</button>
  `;
}

function updateNotifBadge(){
  const unread = NOTIF_STATE.items.filter(n=>!n.read).length;
  const b = document.getElementById('tb-notif-badge');
  const c = document.getElementById('tb-notif-count');
  if(c) c.textContent = unread;
  if(b){ if(unread>0){ b.style.display='inline-block'; b.textContent=unread>99?'99+':unread; } else b.style.display='none'; }
}

function toggleNotifPanel(){
  let panel = document.getElementById('notif-panel');
  if(!panel){
    panel = document.createElement('div');
    panel.id = 'notif-panel';
    panel.style.cssText = 'position:fixed;top:60px;right:20px;width:380px;max-height:70vh;overflow-y:auto;background:#0c1426;border:1px solid #2a3a60;border-radius:10px;box-shadow:0 12px 40px rgba(0,0,0,.5);z-index:2000;display:none';
    document.body.appendChild(panel);
  }
  if(panel.style.display==='none'){
    renderNotifPanel(panel);
    panel.style.display='block';
    // Marque tous comme lus 1.5s après ouverture
    setTimeout(()=>{ NOTIF_STATE.items.forEach(n=>n.read=true); saveNotifSeen(); updateNotifBadge(); },1500);
  } else panel.style.display='none';
}

function renderNotifPanel(panel){
  // Bandeau permission navigateur
  let permBanner = '';
  const permState = ('Notification' in window) ? Notification.permission : 'unsupported';
  if(permState==='default'){
    permBanner = `<div style="padding:11px 14px;background:rgba(96,165,250,.08);border-bottom:1px solid rgba(96,165,250,.3)">
      <div style="font-size:.78rem;color:#cbd5e1;margin-bottom:7px;line-height:1.4"><i class="fa-solid fa-bell" style="color:#60a5fa"></i> <b>Recevez les alertes même quand l'onglet n'est pas ouvert</b><br><span style="color:#94a3b8;font-size:.72rem">Cliquez ci-dessous pour activer les notifications navigateur (push système).</span></div>
      <button onclick="requestNotifPermission()" class="btn primary sm" style="width:100%"><i class="fa-solid fa-bell"></i> Activer les notifications navigateur</button>
    </div>`;
  } else if(permState==='denied'){
    permBanner = `<div style="padding:11px 14px;background:rgba(245,158,11,.08);border-bottom:1px solid #d97706">
      <div style="font-size:.74rem;color:#fde047;line-height:1.4"><i class="fa-solid fa-bell-slash"></i> <b>Notifications navigateur bloquées</b><br><span style="color:#fcd34d;font-size:.7rem">Cliquez sur 🔒 dans la barre d'adresse pour autoriser, puis rechargez la page. Les notifications in-app continuent de fonctionner.</span></div>
    </div>`;
  } else if(permState==='granted'){
    permBanner = `<div style="padding:8px 14px;background:rgba(34,197,94,.06);border-bottom:1px solid rgba(34,197,94,.25);font-size:.7rem;color:#86efac"><i class="fa-solid fa-check-circle"></i> Notifications navigateur activées</div>`;
  }

  if(!NOTIF_STATE.items.length){
    panel.innerHTML = permBanner + `<div style="padding:30px 20px;text-align:center;color:#64748b"><i class="fa-solid fa-bell-slash" style="font-size:2rem;margin-bottom:10px;display:block;opacity:.4"></i><div style="font-size:.85rem">Aucune notification pour l'instant.<br><span style="color:#94a3b8;font-size:.74rem">Le système surveille en permanence les flux RSS. Les dépêches importantes apparaîtront ici dès qu'une nouvelle dépêche sera détectée.</span></div></div>`;
    return;
  }
  panel.innerHTML = permBanner + `
    <div style="padding:14px 16px;border-bottom:1px solid #1a2340;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#0c1426;z-index:1">
      <div><b style="color:#e2e8f0;font-size:.9rem">Notifications</b><div style="font-size:.7rem;color:#64748b">${NOTIF_STATE.items.length} dépêche${NOTIF_STATE.items.length>1?'s':''} prioritaire${NOTIF_STATE.items.length>1?'s':''}</div></div>
      <button onclick="clearNotifs()" style="background:transparent;color:#64748b;border:none;font-size:.75rem;cursor:pointer">Effacer tout</button>
    </div>
    ${NOTIF_STATE.items.map(n=>{
      const tagEmoji = { economic:'💰', diplomatic:'🤝', military:'⚔️', humanitarian:'🆘', political:'🏛️' };
      const tagsHtml = (n.tags||[]).slice(0,3).map(t=>`<span style="background:#1a2340;color:#cbd5e1;font-size:.65rem;padding:1px 5px;border-radius:8px">${tagEmoji[t]||''}${t}</span>`).join(' ');
      const confHtml = (n.conflicts||[]).slice(0,2).map(c=>`<span style="background:#7c2d12;color:#fdba74;font-size:.65rem;padding:1px 5px;border-radius:8px">${c.name}</span>`).join(' ');
      return `<div style="padding:11px 14px;border-bottom:1px solid #141c30;${n.read?'':'background:rgba(96,165,250,.05)'}">
        ${n.bf?'<div style="background:rgba(253,224,71,.18);color:#fde047;font-size:.65rem;padding:1px 6px;border-radius:8px;display:inline-block;margin-bottom:5px;font-weight:700">🇧🇫 PERTINENT BF</div>':''}
        <a href="${n.link}" target="_blank" rel="noopener" style="display:block;color:#e2e8f0;font-size:.83rem;font-weight:600;line-height:1.4;text-decoration:none;margin-bottom:4px">${n.title}</a>
        ${n.desc?`<div style="font-size:.74rem;color:#94a3b8;line-height:1.45;margin-bottom:5px">${n.desc.slice(0,160)}…</div>`:''}
        <div style="font-size:.68rem;color:#64748b;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
          <span><i class="fa-solid fa-newspaper"></i> ${n.source} • ${fmt.dateTime(n.date)}</span>
          <div style="display:flex;gap:3px;flex-wrap:wrap">${confHtml}${tagsHtml}</div>
        </div>
      </div>`;
    }).join('')}
  `;
}

function clearNotifs(){
  NOTIF_STATE.items = [];
  saveNotifSeen();
  updateNotifBadge();
  const p = document.getElementById('notif-panel');
  if(p && p.style.display!=='none') renderNotifPanel(p);
  toast('Notifications effacées','info');
}

/* ============= ADMIN AVANCÉ ============= */
function renderAdmin(){
  document.getElementById('admin-panel').innerHTML = `
    <div class="tabs" style="flex-wrap:wrap;margin-bottom:16px">
      <button class="tab active" data-atab="overview"   onclick="adminTab('overview')">  <i class="fa-solid fa-table-columns"></i> Vue d'ensemble</button>
      <button class="tab"        data-atab="add"        onclick="adminTab('add')">        <i class="fa-solid fa-plus-circle"></i>   Ajouter un conflit</button>
      <button class="tab"        data-atab="analyses"   onclick="adminTab('analyses')">   <i class="fa-solid fa-pen-to-square"></i>  Modifier les analyses</button>
      <button class="tab"        data-atab="impact-bf"  onclick="adminTab('impact-bf')">  <i class="fa-solid fa-flag"></i>           Impacts Burkina Faso</button>
      <button class="tab"        data-atab="export"     onclick="adminTab('export')">     <i class="fa-solid fa-download"></i>       Exporter pour GitHub</button>
    </div>
    <div id="admin-tab-content"></div>`;
  adminTab('overview');
}

function adminTab(tab){
  document.querySelectorAll('[data-atab]').forEach(b=>b.classList.toggle('active', b.dataset.atab===tab));
  const el = document.getElementById('admin-tab-content'); if(!el) return;
  if(tab==='overview')   el.innerHTML = _adminOverview();
  else if(tab==='add')   el.innerHTML = _adminAddForm();
  else if(tab==='analyses') { el.innerHTML = _adminAnalysesForm(); _adminAnalysesWire(); }
  else if(tab==='impact-bf') { el.innerHTML = _adminImpactBFForm(); _adminImpactBFWire(); }
  else if(tab==='export') el.innerHTML = _adminExport();
  if(tab==='overview') _adminOverviewWire();
  if(tab==='add') _adminAddWire();
}

/* ── TAB 1 : Vue d'ensemble ── */
function _adminOverview(){
  const d = DB.get();
  const conflictsCustom = JSON.parse(localStorage.getItem('gw_user_conflicts')||'[]');
  return `
  <div class="grid-2e">
    <div class="card">
      <div class="card-hd"><h2><i class="fa-solid fa-fire"></i>Conflits (${d.conflicts.length})</h2></div>
      <div class="tbl-wrap" style="max-height:300px"><table class="tbl"><thead><tr><th>Nom</th><th>Région</th><th>Int.</th><th>Statut</th></tr></thead>
        <tbody>${d.conflicts.map(c=>`<tr><td><b>${c.short||c.name}</b></td><td style="font-size:.78rem">${c.region}</td><td><span style="color:${conflictColor(c.intensity)};font-weight:700">${c.intensity}/10</span></td><td>${statusChip(c.status)}</td></tr>`).join('')}</tbody>
      </table></div>
      ${conflictsCustom.length?`<div style="margin-top:8px;font-size:.78rem;color:#a78bfa"><i class="fa-solid fa-user"></i> ${conflictsCustom.length} conflit(s) ajouté(s) par vous (localStorage)</div>`:''}
    </div>
    <div class="card">
      <div class="card-hd"><h2><i class="fa-solid fa-flag"></i>Pays (${d.countries.length})</h2></div>
      <div class="tbl-wrap" style="max-height:300px"><table class="tbl"><thead><tr><th>Code</th><th>Nom</th><th>FSI</th></tr></thead>
        <tbody>${d.countries.map(c=>`<tr><td><b>${c.code}</b></td><td>${c.name}</td><td>${c.fsi||'—'}</td></tr>`).join('')}</tbody>
      </table></div>
    </div>
  </div>
  <div class="card mt">
    <div class="card-hd"><h2><i class="fa-solid fa-rss"></i>Sources RSS (${(window.GW_DATA?.RSS_SOURCES_FULL||[]).length})</h2></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Nom</th><th>Catégorie</th><th>Région</th><th>Vérifié</th></tr></thead>
      <tbody>${(window.GW_DATA?.RSS_SOURCES_FULL||[]).map(s=>`<tr>
        <td><b>${s.name}</b></td><td>${s.cat}</td><td>${s.region}</td>
        <td>${s.verified===true?'<span style="color:#22c55e">✓ OK</span>':'<span style="color:#f59e0b">⚠ À tester</span>'}</td>
      </tr>`).join('')}</tbody>
    </table></div>
  </div>
  <div class="card mt">
    <div class="card-hd"><h2><i class="fa-solid fa-database"></i>Données localStorage</h2></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn secondary" id="db-export"><i class="fa-solid fa-download"></i>Exporter JSON</button>
      <button class="btn secondary" id="db-import"><i class="fa-solid fa-upload"></i>Importer JSON</button>
      <button class="btn secondary" id="db-seed"><i class="fa-solid fa-seedling"></i>Réinitialiser (démo)</button>
      <button class="btn danger"    id="db-clear"><i class="fa-solid fa-trash"></i>Tout supprimer</button>
      <input type="file" id="db-import-file" accept=".json" hidden/>
    </div>
  </div>`;
}
function _adminOverviewWire(){
  document.getElementById('db-export').onclick = ()=>{const b=new Blob([JSON.stringify(DB.get(),null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=`geowatch_${new Date().toISOString().slice(0,10)}.json`; a.click(); toast('Export OK','success');};
  document.getElementById('db-import').onclick = ()=>document.getElementById('db-import-file').click();
  document.getElementById('db-import-file').onchange = e=>{const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>{try{DB.save(JSON.parse(ev.target.result)); toast('Import OK','success'); adminTab('overview');}catch(err){toast('Erreur : '+err.message,'error');}}; r.readAsText(f);};
  document.getElementById('db-seed').onclick = ()=>{if(confirm('Recharger les données du gabarit ?')){DB.reset(); toast('Réinitialisé','success'); location.reload();}};
  document.getElementById('db-clear').onclick = ()=>{if(confirm('Supprimer toutes les données ?')){localStorage.removeItem(DB.k); toast('Vidé','success'); location.reload();}};
}

/* ── TAB 2 : Ajouter un conflit ── */
function _adminAddForm(){
  const regions = ['Afrique de l\'Ouest','Afrique subsaharienne','Afrique du Nord','Moyen-Orient','Europe de l\'Est','Asie de l\'Est','Asie du Sud-Est','Amériques','Caucase','Global'];
  const regionOpts = regions.map(r=>`<option>${r}</option>`).join('');
  return `
  <div style="background:rgba(167,139,250,.08);border:1px solid rgba(167,139,250,.3);border-radius:8px;padding:12px 14px;margin-bottom:16px;font-size:.82rem;color:#c4b5fd">
    <i class="fa-solid fa-info-circle"></i> <b>Comment ça marche :</b> Remplis ce formulaire → <b>Enregistrer</b> ajoute le conflit localement (visible immédiatement). Ensuite, utilise l'onglet <b>Exporter pour GitHub</b> pour le rendre visible à tous les visiteurs du site.
  </div>
  <div class="grid-2e">
    <div class="card">
      <div class="card-hd"><h2><i class="fa-solid fa-circle-info"></i>Informations générales</h2></div>
      <div style="display:grid;gap:10px">
        <div><label class="lbl">Nom complet du conflit *</label><input class="inp" id="ac-name" placeholder="Ex : Conflit Sénégal-Mauritanie" required></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div><label class="lbl">Nom court / abréviation</label><input class="inp" id="ac-short" placeholder="Ex : Sénégal-Maur."></div>
          <div><label class="lbl">Année de début *</label><input class="inp" id="ac-year" type="number" min="1900" max="2030" placeholder="Ex : 2024"></div>
        </div>
        <div><label class="lbl">Région *</label><select class="inp" id="ac-region"><option value="">Choisir…</option>${regionOpts}</select></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div><label class="lbl">Statut</label>
            <select class="inp" id="ac-status">
              <option value="active">Actif</option>
              <option value="escalating">Escalade</option>
              <option value="deescalating">Désescalade</option>
              <option value="frozen">Gelé</option>
              <option value="resolved">Résolu</option>
            </select>
          </div>
          <div><label class="lbl">Intensité (1-10)</label>
            <div style="display:flex;align-items:center;gap:8px">
              <input class="inp" id="ac-intensity" type="range" min="1" max="10" value="5" style="flex:1;padding:6px 0">
              <span id="ac-intensity-val" style="color:#f59e0b;font-weight:700;min-width:24px">5</span>
            </div>
          </div>
        </div>
        <div><label class="lbl">Pays clés (ex : Syrie, Irak, Liban)</label><input class="inp" id="ac-pays" placeholder="Séparer par des virgules"></div>
        <div><label class="lbl">Acteurs étatiques (un par ligne)</label><textarea class="inp" id="ac-actors-e" rows="3" placeholder="Gouvernement syrien\nRussie\nTurquie"></textarea></div>
        <div><label class="lbl">Acteurs non-étatiques (un par ligne)</label><textarea class="inp" id="ac-actors-ne" rows="3" placeholder="Jabhat al-Nosra\nForces démocratiques syriennes"></textarea></div>
      </div>
    </div>
    <div class="card">
      <div class="card-hd"><h2><i class="fa-solid fa-bullseye"></i>Brief Décideur (5 points max)</h2></div>
      <div style="display:grid;gap:8px">
        ${[1,2,3,4,5].map(n=>`<div><label class="lbl">Point ${n}${n<=2?' *':''}</label><textarea class="inp" id="ac-bd${n}" rows="2" placeholder="${n===1?'Fait majeur structurant…':n===2?'Risque immédiat…':'Optionnel…'}"></textarea></div>`).join('')}
      </div>
    </div>
  </div>
  <div class="card mt">
    <div class="card-hd"><h2><i class="fa-solid fa-microscope"></i>Brief Analyste</h2></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px">
      <div><label class="lbl">Faits robustes</label><textarea class="inp" id="ac-faits" rows="3" placeholder="Faits vérifiés, datés, sourcés…"></textarea></div>
      <div><label class="lbl">Incertitudes</label><textarea class="inp" id="ac-incert" rows="3" placeholder="Ce qu'on ne sait pas encore…"></textarea></div>
      <div><label class="lbl">Hypothèses pondérées</label><textarea class="inp" id="ac-hyp" rows="3" placeholder="Hypothèse A (60%) : … / Hypothèse B (30%) : …"></textarea></div>
      <div><label class="lbl">Indicateurs 24-72 h</label><textarea class="inp" id="ac-ind24" rows="3" placeholder="Signaux à surveiller dans les 3 prochains jours…"></textarea></div>
      <div><label class="lbl">Indicateurs 7-30 j</label><textarea class="inp" id="ac-ind7" rows="3" placeholder="Signaux à surveiller dans le mois à venir…"></textarea></div>
      <div><label class="lbl">Implications 7-30 j</label><textarea class="inp" id="ac-impl" rows="3" placeholder="Conséquences probables si les signaux se confirment…"></textarea></div>
    </div>
  </div>
  <div class="card mt">
    <div class="card-hd"><h2><i class="fa-solid fa-lightbulb"></i>Analyse simplifiée (pour le grand public)</h2></div>
    <div style="display:grid;gap:10px">
      <div><label class="lbl">En une phrase *</label><textarea class="inp" id="ac-phrase" rows="2" placeholder="Résumé du conflit en une phrase claire et factuelle…"></textarea></div>
      <div><label class="lbl">Pourquoi c'est important ?</label><textarea class="inp" id="ac-pourquoi" rows="3" placeholder="Enjeux géopolitiques, économiques, humanitaires…"></textarea></div>
      <div><label class="lbl">Enjeu central</label><input class="inp" id="ac-enjeu" placeholder="La question fondamentale que ce conflit pose…"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
        <div><label class="lbl">Signal 1 à surveiller</label><input class="inp" id="ac-s1" placeholder="Signal clé…"></div>
        <div><label class="lbl">Signal 2 à surveiller</label><input class="inp" id="ac-s2" placeholder="Signal clé…"></div>
        <div><label class="lbl">Signal 3 à surveiller</label><input class="inp" id="ac-s3" placeholder="Signal clé…"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div><label class="lbl">Horizon proche (6-24 mois)</label><textarea class="inp" id="ac-h-proche" rows="2" placeholder="Évolution probable à court terme…"></textarea></div>
        <div><label class="lbl">Horizon long (5-10 ans)</label><textarea class="inp" id="ac-h-long" rows="2" placeholder="Évolution probable à long terme…"></textarea></div>
      </div>
      <div><label class="lbl">Analogie pédagogique (optionnel)</label><textarea class="inp" id="ac-analogie" rows="2" placeholder="Pour expliquer simplement à un non-spécialiste…"></textarea></div>
    </div>
  </div>
  <div class="card mt">
    <div class="card-hd"><h2><i class="fa-solid fa-chess"></i>Scénarios prospectifs (méthode Godet)</h2></div>
    <div style="display:grid;gap:12px">
      ${[1,2,3,4].map(n=>`
      <div style="background:#0a0f1c;border:1px solid #1a2340;border-radius:8px;padding:12px">
        <div style="font-size:.78rem;color:#94a3b8;margin-bottom:8px;font-weight:600">Scénario ${n}</div>
        <div style="display:grid;grid-template-columns:2fr 80px 80px 120px;gap:8px;align-items:end">
          <div><label class="lbl">Nom du scénario</label><input class="inp" id="ac-sc${n}-nom" placeholder="${n===1?'Tendanciel':n===2?'Rupture':n===3?'Recomposition':'Wild card'}"></div>
          <div><label class="lbl">Proba (%)</label><input class="inp" id="ac-sc${n}-p" type="number" min="0" max="100" placeholder="30"></div>
          <div><label class="lbl">Impact (1-10)</label><input class="inp" id="ac-sc${n}-i" type="number" min="1" max="10" placeholder="7"></div>
          <div><label class="lbl">Horizon</label><input class="inp" id="ac-sc${n}-h" placeholder="12-24 mois"></div>
        </div>
        <div style="margin-top:8px"><label class="lbl">Description</label><textarea class="inp" id="ac-sc${n}-d" rows="2" placeholder="Description du scénario…"></textarea></div>
      </div>`).join('')}
    </div>
  </div>
  <div style="display:flex;gap:10px;margin-top:16px;justify-content:flex-end">
    <button class="btn secondary" onclick="adminTab('overview')"><i class="fa-solid fa-xmark"></i> Annuler</button>
    <button class="btn primary" id="ac-save"><i class="fa-solid fa-floppy-disk"></i> Enregistrer le conflit</button>
  </div>`;
}
function _adminAddWire(){
  const slider = document.getElementById('ac-intensity');
  const val = document.getElementById('ac-intensity-val');
  if(slider) slider.oninput = ()=>{ val.textContent=slider.value; val.style.color=conflictColor(+slider.value); };
  document.getElementById('ac-save').onclick = _adminSaveConflict;
}
function _adminSaveConflict(){
  const name = document.getElementById('ac-name').value.trim();
  const phrase = document.getElementById('ac-phrase').value.trim();
  if(!name){ toast('Le nom du conflit est obligatoire','error'); return; }
  const scens = [1,2,3,4].map(n=>{
    const nom = document.getElementById(`ac-sc${n}-nom`).value.trim();
    if(!nom) return null;
    return { nom, proba:+document.getElementById(`ac-sc${n}-p`).value||20, impact:+document.getElementById(`ac-sc${n}-i`).value||5, h:document.getElementById(`ac-sc${n}-h`).value||'12-24 mois', d:document.getElementById(`ac-sc${n}-d`).value||'' };
  }).filter(Boolean);
  const bd = [1,2,3,4,5].map(n=>document.getElementById(`ac-bd${n}`).value.trim()).filter(Boolean);
  const g = id => document.getElementById(id);
  const newC = {
    id: 'c_user_'+Date.now(),
    name, short: g('ac-short').value.trim()||name.slice(0,20),
    region: g('ac-region').value||'Global',
    status: g('ac-status').value||'active',
    intensity: +g('ac-intensity').value||5,
    start_year: +g('ac-year').value||new Date().getFullYear(),
    pays_clefs: g('ac-pays').value.trim(),
    actors_etat: (g('ac-actors-e').value||'').split('\n').map(x=>x.trim()).filter(Boolean),
    actors_non_etat: (g('ac-actors-ne').value||'').split('\n').map(x=>x.trim()).filter(Boolean),
    brief_decideur: bd,
    brief_analyste: {
      faits: g('ac-faits').value.trim(), incertitudes: g('ac-incert').value.trim(),
      hypotheses: g('ac-hyp').value.trim(), indicateurs_24_72h: g('ac-ind24').value.trim(),
      indicateurs_7_30j: g('ac-ind7').value.trim(), implications_7_30j: g('ac-impl').value.trim()
    },
    scenarios: scens,
    analyse_simple: phrase ? {
      en_une_phrase: phrase,
      pourquoi_important: g('ac-pourquoi').value.trim(),
      enjeu_central: g('ac-enjeu').value.trim(),
      surveiller: [g('ac-s1').value.trim(), g('ac-s2').value.trim(), g('ac-s3').value.trim()].filter(Boolean),
      horizon_proche: g('ac-h-proche').value.trim(),
      horizon_long: g('ac-h-long').value.trim(),
      analogie: g('ac-analogie').value.trim(),
      date_analyse: new Date().toISOString().slice(0,10),
      source_reference: 'Saisie manuelle'
    } : null,
    _user_added: true,
    _added_date: new Date().toISOString().slice(0,10)
  };
  // Sauvegarde dans DB + liste séparée pour export
  const d = DB.get();
  d.conflicts.push(newC);
  DB.save(d);
  const custom = JSON.parse(localStorage.getItem('gw_user_conflicts')||'[]');
  custom.push(newC);
  localStorage.setItem('gw_user_conflicts', JSON.stringify(custom));
  toast(`Conflit "${name}" enregistré ! Allez dans Exporter pour GitHub pour le partager.`, 'success');
  adminTab('overview');
}

/* ── TAB 3 : Modifier les analyses ── */
function _adminAnalysesForm(){
  const d = DB.get();
  const opts = d.conflicts.map(c=>`<option value="${c.id}">${c.short||c.name}</option>`).join('');
  return `
  <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:12px 14px;margin-bottom:16px;font-size:.82rem;color:#fca5a5">
    <i class="fa-solid fa-triangle-exclamation"></i> <b>Important :</b> Les analyses existantes ont été rédigées le <b>29 avril 2026</b> et peuvent contenir des éléments <b>prospectifs ou hypothétiques</b> présentés comme des faits. Vérifiez systématiquement avec des sources officielles (IRIS, ICG, ACLED, OCHA, etc.) avant utilisation.
  </div>
  <div class="card">
    <div class="card-hd"><h2><i class="fa-solid fa-pen-to-square"></i>Sélectionner le conflit à modifier</h2></div>
    <select class="inp" id="ea-conflict" style="max-width:400px"><option value="">Choisir un conflit…</option>${opts}</select>
  </div>
  <div id="ea-form" style="margin-top:12px"></div>`;
}
function _adminAnalysesWire(){
  document.getElementById('ea-conflict').onchange = function(){
    const cid = this.value; if(!cid){ document.getElementById('ea-form').innerHTML=''; return; }
    const c = DB.get().conflicts.find(x=>x.id===cid); if(!c) return;
    const a = c.analyse_simple||{};
    const surveiller = a.surveiller||['','',''];
    document.getElementById('ea-form').innerHTML = `
    <div class="card">
      <div class="card-hd"><h2><i class="fa-solid fa-edit"></i>Analyse simplifiée — <span style="color:#60a5fa">${c.name}</span></h2>
        ${a.date_analyse?`<span class="chip gray">Dernière màj : ${a.date_analyse}</span>`:'<span class="chip orange">Jamais modifié</span>'}
      </div>
      <div style="display:grid;gap:10px">
        <div><label class="lbl">En une phrase (factuel, daté, sourcé)</label><textarea class="inp" id="ea-phrase" rows="2">${a.en_une_phrase||''}</textarea></div>
        <div><label class="lbl">Pourquoi c'est important ?</label><textarea class="inp" id="ea-pourquoi" rows="3">${a.pourquoi_important||''}</textarea></div>
        <div><label class="lbl">Enjeu central</label><input class="inp" id="ea-enjeu" value="${(a.enjeu_central||'').replace(/"/g,'&quot;')}"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
          <div><label class="lbl">Signal 1 à surveiller</label><input class="inp" id="ea-s1" value="${(surveiller[0]||'').replace(/"/g,'&quot;')}"></div>
          <div><label class="lbl">Signal 2 à surveiller</label><input class="inp" id="ea-s2" value="${(surveiller[1]||'').replace(/"/g,'&quot;')}"></div>
          <div><label class="lbl">Signal 3 à surveiller</label><input class="inp" id="ea-s3" value="${(surveiller[2]||'').replace(/"/g,'&quot;')}"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div><label class="lbl">Horizon proche (6-24 mois)</label><textarea class="inp" id="ea-hproche" rows="2">${a.horizon_proche||''}</textarea></div>
          <div><label class="lbl">Horizon long (5-10 ans)</label><textarea class="inp" id="ea-hlong" rows="2">${a.horizon_long||''}</textarea></div>
        </div>
        <div><label class="lbl">Analogie pédagogique</label><textarea class="inp" id="ea-analogie" rows="2">${a.analogie||''}</textarea></div>
        <div><label class="lbl">Source(s) de référence utilisée(s)</label><input class="inp" id="ea-source" value="${(a.source_reference||'').replace(/"/g,'&quot;')}" placeholder="Ex : IRIS France, rapport ICG n°xxx, ACLED avril 2026…"></div>
      </div>
      <div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end">
        <button class="btn primary" onclick="_adminSaveAnalyse('${cid}')"><i class="fa-solid fa-floppy-disk"></i> Enregistrer</button>
      </div>
    </div>`;
  };
}
function _adminSaveAnalyse(cid){
  const d = DB.get();
  const c = d.conflicts.find(x=>x.id===cid); if(!c) return;
  c.analyse_simple = {
    en_une_phrase: document.getElementById('ea-phrase').value.trim(),
    pourquoi_important: document.getElementById('ea-pourquoi').value.trim(),
    enjeu_central: document.getElementById('ea-enjeu').value.trim(),
    surveiller: [document.getElementById('ea-s1').value.trim(), document.getElementById('ea-s2').value.trim(), document.getElementById('ea-s3').value.trim()].filter(Boolean),
    horizon_proche: document.getElementById('ea-hproche').value.trim(),
    horizon_long: document.getElementById('ea-hlong').value.trim(),
    analogie: document.getElementById('ea-analogie').value.trim(),
    source_reference: document.getElementById('ea-source').value.trim(),
    date_analyse: new Date().toISOString().slice(0,10)
  };
  DB.save(d);
  toast(`Analyse de "${c.name}" mise à jour. Pensez à Exporter pour GitHub.`, 'success');
  document.getElementById('ea-conflict').dispatchEvent(new Event('change'));
}

/* ── TAB 4 : Impacts Burkina Faso ── */
function _adminImpactBFForm(){
  const d = DB.get();
  const opts = d.conflicts.map(c=>`<option value="${c.id}">${c.short||c.name}</option>`).join('');
  const dims = ['securitaire','economique','diplomatique','sociopolitique'];
  const dimLabels = {securitaire:'Sécuritaire',economique:'Économique',diplomatique:'Diplomatique',sociopolitique:'Sociopolitique'};
  return `
  <div class="card">
    <div class="card-hd"><h2><i class="fa-solid fa-flag"></i>Sélectionner le conflit</h2></div>
    <select class="inp" id="ibf-conflict" style="max-width:400px"><option value="">Choisir un conflit…</option>${opts}</select>
  </div>
  <div id="ibf-form" style="margin-top:12px"></div>`;
}
function _adminImpactBFWire(){
  document.getElementById('ibf-conflict').onchange = function(){
    const cid = this.value; if(!cid){ document.getElementById('ibf-form').innerHTML=''; return; }
    const c = DB.get().conflicts.find(x=>x.id===cid); if(!c) return;
    const bf = c.impact_bf||{};
    const dims = ['securitaire','economique','diplomatique','sociopolitique'];
    const dimLabels = {securitaire:'🔴 Sécuritaire',economique:'💰 Économique',diplomatique:'🤝 Diplomatique',sociopolitique:'🏛️ Sociopolitique'};
    const niveaux = ['critique','élevé','moyen','faible','positif','neutre'];
    document.getElementById('ibf-form').innerHTML = `
    <div class="card">
      <div class="card-hd"><h2>Impacts sur le Burkina Faso — <span style="color:#fde047">${c.name}</span></h2></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">
        ${dims.map(dim=>{
          const d2 = bf[dim]||{};
          return `<div style="background:#0a0f1c;border:1px solid #1a2340;border-radius:8px;padding:12px">
            <div style="font-size:.82rem;color:#fde047;font-weight:700;margin-bottom:8px">${dimLabels[dim]}</div>
            <label class="lbl">Titre</label><input class="inp" id="ibf-${dim}-t" value="${(d2.titre||'').replace(/"/g,'&quot;')}" placeholder="Ex : Choc d'approvisionnement alimentaire">
            <label class="lbl" style="margin-top:6px">Description</label><textarea class="inp" id="ibf-${dim}-d" rows="3">${d2.description||''}</textarea>
            <label class="lbl" style="margin-top:6px">Niveau d'impact</label>
            <select class="inp" id="ibf-${dim}-n">
              ${niveaux.map(n=>`<option${n===d2.niveau?' selected':''}>${n}</option>`).join('')}
            </select>
          </div>`;
        }).join('')}
      </div>
      <div style="margin-top:12px">
        <label class="lbl">Indicateurs à surveiller — horizon proche</label>
        <textarea class="inp" id="ibf-ind-proche" rows="3" placeholder="Signaux à surveiller à 3-6 mois…">${(bf.indicateurs_bf?.horizon_proche||[]).join('\n')}</textarea>
        <label class="lbl" style="margin-top:8px">Indicateurs à surveiller — horizon long</label>
        <textarea class="inp" id="ibf-ind-long" rows="3" placeholder="Signaux à surveiller à 12-36 mois…">${(bf.indicateurs_bf?.horizon_long||[]).join('\n')}</textarea>
      </div>
      <div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end">
        <button class="btn primary" onclick="_adminSaveImpactBF('${cid}')"><i class="fa-solid fa-floppy-disk"></i> Enregistrer</button>
      </div>
    </div>`;
  };
}
function _adminSaveImpactBF(cid){
  const d = DB.get();
  const c = d.conflicts.find(x=>x.id===cid); if(!c) return;
  const dims = ['securitaire','economique','diplomatique','sociopolitique'];
  c.impact_bf = {};
  dims.forEach(dim=>{
    c.impact_bf[dim] = {
      titre: document.getElementById(`ibf-${dim}-t`).value.trim(),
      description: document.getElementById(`ibf-${dim}-d`).value.trim(),
      niveau: document.getElementById(`ibf-${dim}-n`).value
    };
  });
  c.impact_bf.indicateurs_bf = {
    horizon_proche: document.getElementById('ibf-ind-proche').value.split('\n').map(x=>x.trim()).filter(Boolean),
    horizon_long: document.getElementById('ibf-ind-long').value.split('\n').map(x=>x.trim()).filter(Boolean)
  };
  DB.save(d);
  toast(`Impacts BF de "${c.name}" mis à jour !`, 'success');
}

/* ── TAB 5 : Exporter pour GitHub ── */
function _adminExport(){
  const custom = JSON.parse(localStorage.getItem('gw_user_conflicts')||'[]');
  return `
  <div style="display:grid;gap:14px">
    <div class="card">
      <div class="card-hd"><h2><i class="fa-solid fa-fire"></i>Conflits personnalisés (${custom.length})</h2></div>
      <p style="font-size:.83rem;color:#94a3b8;line-height:1.6">Ce fichier contient tous les conflits que tu as ajoutés via le formulaire. Il suffit de l'uploader sur GitHub et d'ajouter une ligne dans <code>index.html</code>.</p>
      ${custom.length===0 ? `<div style="color:#64748b;font-style:italic">Aucun conflit personnalisé à exporter.</div>` : `
        <button class="btn primary" onclick="_exportUserConflicts()"><i class="fa-solid fa-download"></i> Télécharger data_user.js</button>
        <div style="margin-top:10px;background:#0a0f1c;border:1px solid #1a2340;border-radius:6px;padding:10px;font-size:.78rem;color:#94a3b8;line-height:1.8">
          <b style="color:#cbd5e1">Instruction GitHub :</b><br>
          1. Upload <code>data_user.js</code> dans le repo GitHub<br>
          2. Dans <code>index.html</code>, ajoute <code>&lt;script src="data_user.js"&gt;&lt;/script&gt;</code> avant <code>&lt;script src="app.js"&gt;</code><br>
          3. Commit → le site affiche tes conflits pour tous les visiteurs
        </div>`}
    </div>
    <div class="card">
      <div class="card-hd"><h2><i class="fa-solid fa-pen-to-square"></i>Analyses mises à jour</h2></div>
      <p style="font-size:.83rem;color:#94a3b8;line-height:1.6">Ce fichier contient les analyses simplifiées que tu as modifiées dans l'onglet <b>Modifier les analyses</b>. Il remplace <code>data5.js</code> sur GitHub.</p>
      <button class="btn primary" onclick="_exportData5()"><i class="fa-solid fa-download"></i> Télécharger data5_updated.js</button>
      <div style="margin-top:10px;background:#0a0f1c;border:1px solid #1a2340;border-radius:6px;padding:10px;font-size:.78rem;color:#94a3b8;line-height:1.8">
        <b style="color:#cbd5e1">Instruction GitHub :</b><br>
        1. Télécharge le fichier<br>
        2. Sur GitHub, clique sur <code>data5.js</code> → ✏️ Edit → colle tout le contenu → Commit<br>
        3. Le site affiche tes analyses mises à jour pour tous
      </div>
    </div>
    <div class="card">
      <div class="card-hd"><h2><i class="fa-solid fa-database"></i>Sauvegarde complète JSON</h2></div>
      <p style="font-size:.83rem;color:#94a3b8">Export de toutes les données (conflits + pays + alertes + événements) au format JSON. Permet de restaurer une sauvegarde complète.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn secondary" onclick="_adminExportJSON()"><i class="fa-solid fa-download"></i>Exporter JSON</button>
        <button class="btn secondary" onclick="document.getElementById('db-import-btn-exp').click()"><i class="fa-solid fa-upload"></i>Importer JSON</button>
        <input type="file" id="db-import-btn-exp" accept=".json" hidden onchange="_adminImportJSON(this)">
      </div>
    </div>
  </div>`;
}
function _exportUserConflicts(){
  const custom = JSON.parse(localStorage.getItem('gw_user_conflicts')||'[]');
  if(!custom.length){ toast('Aucun conflit à exporter','info'); return; }
  const js = `/* GéoWatch — Conflits ajoutés par l'utilisateur — généré le ${new Date().toISOString().slice(0,10)} */
window.GW_DATA = window.GW_DATA || {};
(function(){
  const userConflicts = ${JSON.stringify(custom, null, 2)};
  if(window.GW_DATA.CONFLITS) {
    userConflicts.forEach(c=>{ if(!window.GW_DATA.CONFLITS.find(x=>x.id===c.id)) window.GW_DATA.CONFLITS.push(c); });
  }
})();
`;
  const b = new Blob([js],{type:'text/javascript'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='data_user.js'; a.click();
  toast('data_user.js téléchargé !','success');
}
function _exportData5(){
  const d = DB.get();
  const analyses = {};
  d.conflicts.forEach(c=>{ if(c.analyse_simple) analyses[c.id] = c.analyse_simple; });
  const js = `/* GéoWatch — Analyses simplifiées mises à jour — généré le ${new Date().toISOString().slice(0,10)} */
const ANALYSES_SIMPLES = ${JSON.stringify(analyses, null, 2)};

window.GW_DATA = window.GW_DATA || {};
window.GW_DATA.CONFLITS = (window.GW_DATA.CONFLITS||[]).map(c=>{
  if(ANALYSES_SIMPLES[c.id]) c.analyse_simple = ANALYSES_SIMPLES[c.id];
  return c;
});
`;
  const b = new Blob([js],{type:'text/javascript'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='data5_updated.js'; a.click();
  toast('data5_updated.js téléchargé !','success');
}
function _adminExportJSON(){
  const b=new Blob([JSON.stringify(DB.get(),null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(b);
  a.download=`geowatch_backup_${new Date().toISOString().slice(0,10)}.json`; a.click();
  toast('Sauvegarde JSON téléchargée','success');
}
function _adminImportJSON(input){
  const f=input.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=ev=>{try{DB.save(JSON.parse(ev.target.result)); toast('Import OK','success'); adminTab('overview');}catch(err){toast('Erreur : '+err.message,'error');}};
  r.readAsText(f);
}

/* ============= EXPORT NOTE DE SITUATION (style CNES) ============= */
function exportNoteSituation(cid){
  const d = DB.get();
  const c = d.conflicts.find(x=>x.id===cid); if(!c){toast('Conflit introuvable','error'); return;}
  const now = new Date();
  let t = `NOTE DE SITUATION — ${c.name.toUpperCase()}\n`;
  t += `À l'usage exclusif du décideur politique | ${now.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})} | Synthèse analytique multi-dimensionnelle\n`;
  t += `${'='.repeat(78)}\n\n`;
  t += `RÉGION : ${c.region}\nSTATUT : ${c.status}\nINTENSITÉ : ${c.intensity}/10\nDÉBUT : ${c.start_year}\nPAYS CLEFS : ${c.pays_clefs||''}\nACTEURS ÉTATIQUES : ${(c.actors_etat||[]).join(', ')}\nACTEURS NON-ÉTATIQUES : ${(c.actors_non_etat||[]).join(', ')}\n\n`;

  if(c.brief_decideur){ t += `BRIEF DÉCIDEUR (5 points)\n${'-'.repeat(78)}\n`; c.brief_decideur.forEach((b,i)=>t+=`${i+1}. ${b}\n`); t+='\n'; }
  if(c.brief_analyste){ const b=c.brief_analyste; t += `BRIEF ANALYSTE\n${'-'.repeat(78)}\nFaits : ${b.faits||''}\nIncertitudes : ${b.incertitudes||''}\nHypothèses : ${b.hypotheses||''}\nIndicateurs 24-72h : ${b.indicateurs_24_72h||''}\nIndicateurs 7-30j : ${b.indicateurs_7_30j||''}\nImplications : ${b.implications_7_30j||''}\n\n`; }

  if(c.causes_historiques){ t += `I. CAUSES HISTORIQUES\n${'-'.repeat(78)}\n`; c.causes_historiques.forEach(x=>t+=`[${x.p}]\n${x.f}\n\n`); if(c.cle_historique) t+=`Clé analytique : ${c.cle_historique}\n\n`; }
  if(c.causes_geographiques){ t += `II. CAUSES GÉOGRAPHIQUES\n${'-'.repeat(78)}\n`; c.causes_geographiques.forEach(x=>t+=`• ${x.c}\n  ${x.i}\n\n`); }
  if(c.causes_economiques){ t += `III. CAUSES ÉCONOMIQUES\n${'-'.repeat(78)}\n`; c.causes_economiques.forEach(x=>t+=`• ${x.d}\n  ${x.i}\n\n`); }
  if(c.causes_ideologiques){ t += `IV. CAUSES IDÉOLOGIQUES ET RELIGIEUSES\n${'-'.repeat(78)}\n`; c.causes_ideologiques.forEach(x=>t+=`• ${x.a}\n  ${x.d}\n\n`); }
  if(c.perceptions_croisees){ t += `V. PERCEPTIONS ET IMAGINAIRES\n${'-'.repeat(78)}\n`; c.perceptions_croisees.forEach(x=>t+=`• ${x.a}\n  ${x.b}\n\n`); }
  if(c.postures_arsenaux){ t += `VI. POSTURES ET ARSENAUX\n${'-'.repeat(78)}\n${c.postures_arsenaux.camp_a.nom}\n  Doctrine : ${c.postures_arsenaux.camp_a.doctrine}\n  Moyens : ${c.postures_arsenaux.camp_a.moyens}\n  Faiblesses : ${c.postures_arsenaux.camp_a.faiblesses}\n\n${c.postures_arsenaux.camp_b.nom}\n  Doctrine : ${c.postures_arsenaux.camp_b.doctrine}\n  Moyens : ${c.postures_arsenaux.camp_b.moyens}\n  Faiblesses : ${c.postures_arsenaux.camp_b.faiblesses}\n\n`; }
  if(c.rivalites_structurelles){ t += `VII. RIVALITÉS STRUCTURELLES\n${'-'.repeat(78)}\n`; c.rivalites_structurelles.forEach(x=>t+=`• ${x.dim}\n  ${x.n}\n\n`); }
  if(c.chronologie){ t += `VIII. CHRONOLOGIE\n${'-'.repeat(78)}\n`; c.chronologie.forEach(x=>t+=`${x.d} | ${x.rupture?'⚠ ':''}${x.e} (sév. ${x.sev}/10)${x.note?`\n   → ${x.note}`:''}\n`); t+='\n'; }
  if(c.lecture_causale){ t += `LECTURE CAUSALE INTÉGRÉE\n${'-'.repeat(78)}\nCause première : ${c.lecture_causale.premiere}\n\nCause structurante : ${c.lecture_causale.structurante}\n\nParadoxe central : ${c.lecture_causale.paradoxe}\n\nSignal décisif : ${c.lecture_causale.signal}\n\n`; }
  if(c.scenarios){ t += `SCÉNARIOS PROSPECTIFS (Méthode Godet)\n${'-'.repeat(78)}\n`; c.scenarios.forEach((s,i)=>t+=`${i+1}. ${s.nom} | Probabilité ${s.proba}% | Impact ${s.impact}/10 | Horizon ${s.h}\n   ${s.d}\n\n`); }
  if(c.sources){ t += `SOURCES DE RÉFÉRENCE\n${'-'.repeat(78)}\n`; c.sources.forEach(s=>t+=`• ${s.nom}\n  ${s.url}\n`); t+='\n'; }

  t += `\n${'='.repeat(78)}\nDocument généré par GéoWatch — Méthodologie Note de Situation 8 dimensions\nDocument confidentiel — Usage interne — ${now.toLocaleDateString('fr-FR')}\n`;

  const blob = new Blob([t], {type:'text/plain;charset=utf-8'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`note_situation_${c.id}_${now.toISOString().slice(0,10)}.txt`; a.click();
  toast('Note de situation exportée','success');
}

/* ============= EXPORT PDF (jsPDF) ============= */
function exportNotePDF(cid){
  if(!window.jspdf){ toast('Bibliothèque PDF non chargée','error'); return; }
  const d = DB.get();
  const c = d.conflicts.find(x=>x.id===cid); if(!c){toast('Conflit introuvable','error'); return;}
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({unit:'mm',format:'a4'});

  const W = 210, H = 297, M = 18;
  let y = M;
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});

  // Helpers
  const checkPage = (need=20)=>{ if(y+need>H-M){ doc.addPage(); y=M; addFooter(); } };
  const addFooter = ()=>{
    const pageNum = doc.getCurrentPageInfo().pageNumber;
    doc.setFont('helvetica','italic'); doc.setFontSize(8); doc.setTextColor(120);
    doc.text(`GéoWatch — Note de situation : ${c.name}`, M, H-10);
    doc.text(`Page ${pageNum}`, W-M, H-10, {align:'right'});
    doc.setTextColor(0);
  };
  const h1 = (t)=>{ checkPage(15); doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.setTextColor(20,40,90); doc.text(t,M,y); y+=8; doc.setTextColor(0); };
  const h2 = (t)=>{ checkPage(12); y+=3; doc.setFont('helvetica','bold'); doc.setFontSize(13); doc.setTextColor(180,40,40); doc.text(t,M,y); y+=2; doc.setDrawColor(180,40,40); doc.setLineWidth(.4); doc.line(M,y,W-M,y); y+=5; doc.setTextColor(0); };
  const h3 = (t)=>{ checkPage(10); y+=2; doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(40,80,140); doc.text(t,M,y); y+=5; doc.setTextColor(0); };
  const para = (t, opts={})=>{
    if(!t) return;
    doc.setFont('helvetica',opts.bold?'bold':'normal');
    doc.setFontSize(opts.size||10);
    if(opts.color) doc.setTextColor(...opts.color); else doc.setTextColor(40);
    const lines = doc.splitTextToSize(t, W-2*M);
    lines.forEach(line=>{ checkPage(6); doc.text(line, M, y); y+=4.5; });
    if(opts.color) doc.setTextColor(0);
    y+=1.5;
  };
  const bullet = (t)=>{ checkPage(6); doc.setFont('helvetica','normal'); doc.setFontSize(10); const lines = doc.splitTextToSize(t, W-2*M-5); lines.forEach((line,i)=>{ checkPage(5); doc.text((i===0?'• ':'  ')+line, M, y); y+=4.5; }); };
  const kv = (k,v)=>{ if(!v) return; checkPage(8); doc.setFont('helvetica','bold'); doc.setFontSize(9.5); doc.setTextColor(60); const kw = doc.getTextWidth(k+' '); doc.text(k, M, y); doc.setFont('helvetica','normal'); doc.setTextColor(20); const lines = doc.splitTextToSize(v, W-2*M-kw); doc.text(lines[0], M+kw, y); y+=4.5; for(let i=1;i<lines.length;i++){ checkPage(5); doc.text(lines[i], M, y); y+=4.5; } y+=1; };

  // === EN-TÊTE ===
  doc.setFillColor(8,13,26); doc.rect(0,0,W,28,'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(20); doc.setTextColor(96,165,250);
  doc.text('GéoWatch', M, 14);
  doc.setFontSize(10); doc.setTextColor(180);
  doc.text('Observatoire des conflits — Note de situation', M, 21);
  doc.setFontSize(9); doc.text(dateStr, W-M, 14, {align:'right'});
  doc.text('Document confidentiel — Usage interne', W-M, 21, {align:'right'});
  doc.setTextColor(0); y = 38;
  addFooter();

  // === TITRE CONFLIT ===
  h1(c.name.toUpperCase());
  para(`${c.region} • Depuis ${c.start_year} • Statut : ${c.status} • Intensité ${c.intensity}/10`, {color:[100,116,139],size:10});
  if(c.cle_historique){ y+=2; doc.setFillColor(245,247,250); const txt = doc.splitTextToSize(`Clé d'analyse : ${c.cle_historique}`, W-2*M-6); const boxH = txt.length*4.5 + 8; doc.rect(M,y,W-2*M,boxH,'F'); doc.setDrawColor(96,165,250); doc.setLineWidth(.6); doc.line(M,y,M,y+boxH); y+=5; doc.setFont('helvetica','italic'); doc.setFontSize(9.5); doc.setTextColor(50); txt.forEach(l=>{doc.text(l,M+3,y); y+=4.5;}); y+=4; doc.setTextColor(0); }
  if(c.pays_clefs) kv('Pays clés :', c.pays_clefs);
  if(c.actors_etat?.length) kv('Acteurs étatiques :', c.actors_etat.join(' • '));
  if(c.actors_non_etat?.length) kv('Acteurs non-étatiques :', c.actors_non_etat.join(' • '));

  // === BRIEF DÉCIDEUR ===
  if(c.brief_decideur?.length){ h2('BRIEF — COUCHE DÉCIDEUR'); para('5 points maximum, axes de risque, faits robustes, implications immédiates.', {color:[100,116,139],size:9}); c.brief_decideur.forEach((b,i)=>bullet(`${i+1}. ${b}`)); y+=3; }

  // === BRIEF ANALYSTE ===
  if(c.brief_analyste){ h2('BRIEF — COUCHE ANALYSTE'); const b=c.brief_analyste;
    if(b.faits){ h3('Faits robustes'); para(b.faits); }
    if(b.incertitudes){ h3('Incertitudes'); para(b.incertitudes); }
    if(b.hypotheses){ h3('Hypothèses pondérées'); para(b.hypotheses); }
    if(b.indicateurs_24_72h){ h3('Indicateurs 24-72 h'); para(b.indicateurs_24_72h); }
    if(b.indicateurs_7_30j){ h3('Indicateurs 7-30 j'); para(b.indicateurs_7_30j); }
    if(b.implications_7_30j){ h3('Implications 7-30 j'); para(b.implications_7_30j); }
  }

  // === I. CAUSES HISTORIQUES ===
  if(c.causes_historiques?.length){ h2('I. CAUSES HISTORIQUES'); c.causes_historiques.forEach(x=>{ kv(`[${x.p}]`, x.f); }); }
  if(c.causes_geographiques?.length){ h2('II. CAUSES GÉOGRAPHIQUES'); c.causes_geographiques.forEach(x=>{ kv(`• ${x.c}`, x.i); }); }
  if(c.causes_economiques?.length){ h2('III. CAUSES ÉCONOMIQUES'); c.causes_economiques.forEach(x=>{ kv(`• ${x.d}`, x.i); }); }
  if(c.causes_ideologiques?.length){ h2('IV. CAUSES IDÉOLOGIQUES ET RELIGIEUSES'); c.causes_ideologiques.forEach(x=>{ kv(`• ${x.a}`, x.d); }); }
  if(c.perceptions_croisees?.length){ h2('V. PERCEPTIONS ET IMAGINAIRES'); c.perceptions_croisees.forEach(x=>{ kv(`• ${x.a}`, x.b); }); }
  if(c.postures_arsenaux){ h2('VI. POSTURES ET ARSENAUX');
    h3(c.postures_arsenaux.camp_a.nom); kv('Doctrine :', c.postures_arsenaux.camp_a.doctrine); kv('Moyens :', c.postures_arsenaux.camp_a.moyens); kv('Faiblesses :', c.postures_arsenaux.camp_a.faiblesses);
    h3(c.postures_arsenaux.camp_b.nom); kv('Doctrine :', c.postures_arsenaux.camp_b.doctrine); kv('Moyens :', c.postures_arsenaux.camp_b.moyens); kv('Faiblesses :', c.postures_arsenaux.camp_b.faiblesses);
  }
  if(c.rivalites_structurelles?.length){ h2('VII. RIVALITÉS STRUCTURELLES'); c.rivalites_structurelles.forEach(x=>{ kv(`• ${x.dim}`, x.n); }); }

  // === VIII. CHRONOLOGIE ===
  if(c.chronologie?.length){ h2('VIII. CHRONOLOGIE');
    c.chronologie.forEach(x=>{
      const dt = new Date(x.d).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'});
      const sym = x.rupture ? '⚠ ' : '• ';
      kv(`${sym}${dt}`, `${x.e}${x.note?` → ${x.note}`:''} (sév. ${x.sev}/10)`);
    });
  }

  // === LECTURE CAUSALE ===
  if(c.lecture_causale){ h2('LECTURE CAUSALE INTÉGRÉE');
    if(c.lecture_causale.premiere){ h3('Cause première'); para(c.lecture_causale.premiere); }
    if(c.lecture_causale.structurante){ h3('Cause structurante'); para(c.lecture_causale.structurante); }
    if(c.lecture_causale.paradoxe){ h3('Paradoxe central'); para(c.lecture_causale.paradoxe); }
    if(c.lecture_causale.signal){ h3('Signal décisif'); para(c.lecture_causale.signal); }
  }

  // === SCÉNARIOS ===
  if(c.scenarios?.length){ h2('SCÉNARIOS PROSPECTIFS (Méthode Godet)');
    c.scenarios.forEach((s,i)=>{
      checkPage(15); doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(20);
      doc.text(`${i+1}. ${s.nom}`, M, y); y+=4.5;
      doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(80);
      doc.text(`Probabilité : ${s.proba}%   |   Impact : ${s.impact}/10   |   Horizon : ${s.h}`, M, y); y+=4.5;
      para(s.d, {size:9.5}); y+=2;
    });
  }

  // === SOURCES ===
  if(c.sources?.length){ h2('SOURCES DE RÉFÉRENCE');
    c.sources.forEach(s=>{ kv('•', `${s.nom} — ${s.url}`); });
  }

  // === FOOTER FINAL ===
  y+=8; checkPage(20);
  doc.setDrawColor(180); doc.setLineWidth(.3); doc.line(M,y,W-M,y); y+=5;
  doc.setFont('helvetica','italic'); doc.setFontSize(8); doc.setTextColor(100);
  doc.text(`Document généré par GéoWatch — Méthodologie : Note de situation 8 dimensions (gabarit CNES).`,M,y); y+=4;
  doc.text(`Sources curées (extrait sur 140+ sources actives) : Lefaso, Burkina24, Sidwaya, AIB, Wakat Séra, Maliweb, Niger24, Tchadinfos, Cridem, Abidjan.net, Seneweb, MyJoyOnline, ISS Africa, WATHI, ACLED, ICG, IRIS, IFRI, ISW, Brookings, Carnegie, Le Monde Afrique, BBC Afrique, RFI Afrique, Jeune Afrique, Al Jazeera, NYT, FT, Le Grand Continent, Diploweb, LMD.`,M,y);

  // Re-ajoute footer sur toutes pages générées
  const total = doc.getNumberOfPages();
  for(let p=1; p<=total; p++){ doc.setPage(p); doc.setFont('helvetica','italic'); doc.setFontSize(8); doc.setTextColor(120);
    doc.text(`GéoWatch — ${c.name}`, M, H-10);
    doc.text(`Page ${p}/${total}`, W-M, H-10, {align:'right'}); }

  doc.save(`note_${c.id}_${now.toISOString().slice(0,10)}.pdf`);
  toast('PDF exporté','success');
}

/* ============= EXPORT DOCX (HTML -> Word) ============= */
function exportNoteDOCX(cid){
  const d = DB.get();
  const c = d.conflicts.find(x=>x.id===cid); if(!c){toast('Conflit introuvable','error'); return;}
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});

  // Style Word minimaliste
  const css = `<style>
    body{font-family:'Calibri',Arial,sans-serif;font-size:11pt;color:#222;line-height:1.5}
    h1{font-size:22pt;color:#0a3d62;border-bottom:3px solid #0a3d62;padding-bottom:6pt;margin-top:0}
    h2{font-size:14pt;color:#a52e2e;border-bottom:1px solid #a52e2e;margin-top:20pt;padding-bottom:3pt}
    h3{font-size:12pt;color:#1e40af;margin-top:10pt}
    table{width:100%;border-collapse:collapse;margin:8pt 0}
    th{background:#0a3d62;color:#fff;text-align:left;padding:6pt;font-size:10pt}
    td{border:1px solid #ccc;padding:6pt;font-size:10pt;vertical-align:top}
    .meta{color:#666;font-style:italic;font-size:10pt}
    .key{background:#f0f4f8;border-left:4px solid #0a3d62;padding:8pt 12pt;margin:10pt 0;font-style:italic}
    .bf{background:#fef3c7;border-left:4px solid #d97706;padding:8pt 12pt;margin:10pt 0}
    .scenario{background:#f8fafc;border:1px solid #cbd5e1;border-left:4px solid #ef4444;padding:8pt 12pt;margin:6pt 0}
    .footer{margin-top:24pt;padding-top:8pt;border-top:1px solid #ccc;color:#666;font-size:9pt;font-style:italic}
    ul{margin:4pt 0 8pt 16pt}
    li{margin-bottom:3pt}
  </style>`;

  let html = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
  <head><meta charset="UTF-8"><title>Note de situation — ${c.name}</title>${css}</head><body>`;

  // En-tête
  html += `<h1>Note de situation — ${c.name}</h1>
    <p class="meta">GéoWatch — Observatoire des conflits • ${dateStr} • Document confidentiel — Usage interne</p>
    <p><b>Région :</b> ${c.region} &nbsp;|&nbsp; <b>Statut :</b> ${c.status} &nbsp;|&nbsp; <b>Intensité :</b> ${c.intensity}/10 &nbsp;|&nbsp; <b>Depuis :</b> ${c.start_year}</p>
    <p><b>Pays clés :</b> ${c.pays_clefs||''}</p>
    <p><b>Acteurs étatiques :</b> ${(c.actors_etat||[]).join(' • ')}</p>
    ${c.actors_non_etat?.length?`<p><b>Acteurs non-étatiques :</b> ${c.actors_non_etat.join(' • ')}</p>`:''}
    ${c.cle_historique?`<div class="key"><b>Clé d'analyse :</b> ${c.cle_historique}</div>`:''}`;

  // Briefs
  if(c.brief_decideur?.length){ html += `<h2>Brief — couche décideur</h2><p class="meta">5 points maximum, axes de risque, faits robustes, implications immédiates</p><ol>${c.brief_decideur.map(b=>`<li>${b}</li>`).join('')}</ol>`; }
  if(c.brief_analyste){ const b=c.brief_analyste; html += `<h2>Brief — couche analyste</h2>`;
    if(b.faits) html += `<h3>Faits robustes</h3><p>${b.faits}</p>`;
    if(b.incertitudes) html += `<h3>Incertitudes</h3><p>${b.incertitudes}</p>`;
    if(b.hypotheses) html += `<h3>Hypothèses pondérées</h3><p>${b.hypotheses}</p>`;
    if(b.indicateurs_24_72h) html += `<h3>Indicateurs 24-72 h</h3><p>${b.indicateurs_24_72h}</p>`;
    if(b.indicateurs_7_30j) html += `<h3>Indicateurs 7-30 j</h3><p>${b.indicateurs_7_30j}</p>`;
    if(b.implications_7_30j) html += `<h3>Implications 7-30 j</h3><p>${b.implications_7_30j}</p>`;
  }

  // Impact BF
  if(c.impact_bf){ const i = c.impact_bf;
    html += `<h2>Impacts sur le Burkina Faso</h2><div class="bf"><b>Pertinence : ${i.pertinence}</b><br>${i.note_synthese}</div>`;
    if(i.securitaire?.length) html += `<h3>Dimension sécuritaire</h3><ul>${i.securitaire.map(x=>`<li>${x}</li>`).join('')}</ul>`;
    if(i.economique?.length) html += `<h3>Dimension économique</h3><ul>${i.economique.map(x=>`<li>${x}</li>`).join('')}</ul>`;
    if(i.diplomatique?.length) html += `<h3>Dimension diplomatique</h3><ul>${i.diplomatique.map(x=>`<li>${x}</li>`).join('')}</ul>`;
    if(i.sociopolitique?.length) html += `<h3>Dimension sociopolitique</h3><ul>${i.sociopolitique.map(x=>`<li>${x}</li>`).join('')}</ul>`;
    if(i.indicateurs_bf?.length){ html += `<h3>Indicateurs BF à surveiller</h3><table><tr><th>Horizon</th><th>Signaux</th></tr>${i.indicateurs_bf.map(x=>`<tr><td>${x.h}</td><td>${x.v}</td></tr>`).join('')}</table>`; }
  }

  // 8 dimensions
  if(c.causes_historiques?.length){ html += `<h2>I. Causes historiques</h2><table><tr><th style="width:25%">Période</th><th>Faits essentiels</th></tr>${c.causes_historiques.map(x=>`<tr><td><b>${x.p}</b></td><td>${x.f}</td></tr>`).join('')}</table>`; }
  if(c.causes_geographiques?.length){ html += `<h2>II. Causes géographiques</h2><table><tr><th style="width:30%">Contrainte</th><th>Implication</th></tr>${c.causes_geographiques.map(x=>`<tr><td><b>${x.c}</b></td><td>${x.i}</td></tr>`).join('')}</table>`; }
  if(c.causes_economiques?.length){ html += `<h2>III. Causes économiques</h2><table><tr><th style="width:30%">Dimension</th><th>Élément</th></tr>${c.causes_economiques.map(x=>`<tr><td><b>${x.d}</b></td><td>${x.i}</td></tr>`).join('')}</table>`; }
  if(c.causes_ideologiques?.length){ html += `<h2>IV. Causes idéologiques et religieuses</h2><table><tr><th style="width:30%">Doctrine</th><th>Description</th></tr>${c.causes_ideologiques.map(x=>`<tr><td><b>${x.a}</b></td><td>${x.d}</td></tr>`).join('')}</table>`; }
  if(c.perceptions_croisees?.length){ html += `<h2>V. Perceptions et imaginaires</h2><table><tr><th style="width:30%">Acteur</th><th>Regard</th></tr>${c.perceptions_croisees.map(x=>`<tr><td><b>${x.a}</b></td><td>${x.b}</td></tr>`).join('')}</table>`; }
  if(c.postures_arsenaux){ html += `<h2>VI. Postures et arsenaux</h2>
    <h3>${c.postures_arsenaux.camp_a.nom}</h3>
    <p><b>Doctrine :</b> ${c.postures_arsenaux.camp_a.doctrine}</p>
    <p><b>Moyens :</b> ${c.postures_arsenaux.camp_a.moyens}</p>
    <p><b>Faiblesses :</b> ${c.postures_arsenaux.camp_a.faiblesses}</p>
    <h3>${c.postures_arsenaux.camp_b.nom}</h3>
    <p><b>Doctrine :</b> ${c.postures_arsenaux.camp_b.doctrine}</p>
    <p><b>Moyens :</b> ${c.postures_arsenaux.camp_b.moyens}</p>
    <p><b>Faiblesses :</b> ${c.postures_arsenaux.camp_b.faiblesses}</p>`; }
  if(c.rivalites_structurelles?.length){ html += `<h2>VII. Rivalités structurelles</h2><table><tr><th style="width:25%">Dimension</th><th>Nature</th></tr>${c.rivalites_structurelles.map(x=>`<tr><td><b>${x.dim}</b></td><td>${x.n}</td></tr>`).join('')}</table>`; }
  if(c.chronologie?.length){ html += `<h2>VIII. Chronologie</h2><table><tr><th style="width:18%">Date</th><th>Événement</th><th style="width:10%">Sév.</th></tr>${c.chronologie.map(x=>`<tr${x.rupture?' style="background:#fef2f2"':''}><td>${fmt.date(x.d)} ${x.rupture?'⚠':''}</td><td><b>${x.e}</b>${x.note?`<br><i>${x.note}</i>`:''}</td><td>${x.sev}/10</td></tr>`).join('')}</table>`; }

  if(c.lecture_causale){ html += `<h2>Lecture causale intégrée</h2>
    ${c.lecture_causale.premiere?`<h3>Cause première</h3><p>${c.lecture_causale.premiere}</p>`:''}
    ${c.lecture_causale.structurante?`<h3>Cause structurante</h3><p>${c.lecture_causale.structurante}</p>`:''}
    ${c.lecture_causale.paradoxe?`<h3>Paradoxe central</h3><p>${c.lecture_causale.paradoxe}</p>`:''}
    ${c.lecture_causale.signal?`<h3>Signal décisif</h3><p>${c.lecture_causale.signal}</p>`:''}`; }

  if(c.scenarios?.length){ html += `<h2>Scénarios prospectifs (méthode Godet)</h2>${c.scenarios.map((s,i)=>`<div class="scenario"><b>${i+1}. ${s.nom}</b> &nbsp;|&nbsp; Probabilité ${s.proba}% &nbsp;|&nbsp; Impact ${s.impact}/10 &nbsp;|&nbsp; Horizon ${s.h}<br>${s.d}</div>`).join('')}`; }

  if(c.sources?.length){ html += `<h2>Sources de référence</h2><ul>${c.sources.map(s=>`<li><b>${s.nom}</b> — ${s.url}</li>`).join('')}</ul>`; }

  html += `<div class="footer">Document généré par GéoWatch — Méthodologie Note de situation 8 dimensions. Sources curées (extrait sur 140+ flux) : sources locales burkinabè (Lefaso, Burkina24, Sidwaya, AIB, Wakat Séra), sahéliennes (Maliweb, Niger24, Tchadinfos, Cridem), ouest-africaines (Abidjan.net, Seneweb, MyJoyOnline, Premium Times), think tanks africains (ISS Africa, WATHI, ACSS), internationaux (ACLED, ICG, IRIS, IFRI, ISW, Brookings, Carnegie, Le Grand Continent, Diploweb, LMD), médias (BBC Afrique, RFI, Le Monde Afrique, Jeune Afrique, Al Jazeera, NYT, FT).</div>`;
  html += `</body></html>`;

  const blob = new Blob(['﻿', html], {type:'application/msword'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`note_${c.id}_${now.toISOString().slice(0,10)}.doc`; a.click();
  toast('Document Word exporté','success');
}

/* ============= EXPORT PPTX (PptxGenJS) ============= */
function exportNotePPTX(cid){
  if(!window.PptxGenJS){ toast('Bibliothèque PPTX non chargée','error'); return; }
  const d = DB.get();
  const c = d.conflicts.find(x=>x.id===cid); if(!c){toast('Conflit introuvable','error'); return;}
  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = `Note ${c.name}`;
  pres.author = 'GéoWatch';

  const TITLE_BG = '08172A', RED = 'A52E2E', BLUE = '1E40AF', YELLOW = 'D97706', GRAY='64748B', LIGHT='F1F5F9';
  const dateStr = new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});

  const addFooter = (s)=>{
    s.addText('GéoWatch — Note de situation', {x:0.4, y:7.0, w:6, h:0.3, fontSize:9, color:GRAY, italic:true});
    s.addText(`${c.name} • ${dateStr}`, {x:7, y:7.0, w:6, h:0.3, fontSize:9, color:GRAY, italic:true, align:'right'});
  };

  // === SLIDE 1 — Couverture ===
  const s1 = pres.addSlide(); s1.background = {color:TITLE_BG};
  s1.addText('GéoWatch', {x:0.6,y:0.4,fontSize:14,color:'60A5FA',bold:true});
  s1.addText('Observatoire des conflits — Note de situation', {x:0.6,y:0.85,fontSize:11,color:'94A3B8'});
  s1.addText(c.name, {x:0.6,y:2.4,fontSize:40,color:'FFFFFF',bold:true,w:12});
  s1.addText(`${c.region} • depuis ${c.start_year} • Statut ${c.status} • Intensité ${c.intensity}/10`, {x:0.6,y:3.6,fontSize:14,color:'CBD5E1'});
  if(c.cle_historique) s1.addText(c.cle_historique, {x:0.6,y:4.4,w:12,h:1.6,fontSize:13,color:'E2E8F0',italic:true});
  s1.addText(dateStr+'  |  Document confidentiel — Usage interne', {x:0.6,y:6.7,fontSize:10,color:'64748B'});

  // === SLIDE 2 — Brief décideur ===
  if(c.brief_decideur?.length){
    const s = pres.addSlide(); s.background = {color:'FFFFFF'};
    s.addText('Brief — couche décideur', {x:0.4,y:0.3,fontSize:24,color:RED,bold:true});
    s.addText('5 points maximum • axes de risque • faits robustes • implications immédiates', {x:0.4,y:0.85,fontSize:11,color:GRAY,italic:true});
    s.addShape('rect', {x:0.4,y:1.2,w:12.5,h:0.04,fill:{color:RED}});
    c.brief_decideur.forEach((b,i)=>{
      s.addText(`${i+1}. ${b}`, {x:0.6,y:1.4+i*1.05,w:12.3,h:1,fontSize:14,color:'1E293B'});
    });
    addFooter(s);
  }

  // === SLIDE 3 — Brief analyste ===
  if(c.brief_analyste){ const b = c.brief_analyste;
    const s = pres.addSlide(); s.background = {color:'FFFFFF'};
    s.addText('Brief — couche analyste', {x:0.4,y:0.3,fontSize:24,color:BLUE,bold:true});
    s.addShape('rect', {x:0.4,y:0.95,w:12.5,h:0.04,fill:{color:BLUE}});
    const blocks = [
      ['Faits robustes', b.faits, '22C55E'],
      ['Incertitudes', b.incertitudes, 'F59E0B'],
      ['Hypothèses pondérées', b.hypotheses, 'A78BFA'],
      ['Indicateurs 24-72 h', b.indicateurs_24_72h, 'EF4444'],
      ['Indicateurs 7-30 j', b.indicateurs_7_30j, '60A5FA'],
      ['Implications 7-30 j', b.implications_7_30j, 'F97316']
    ].filter(x=>x[1]);
    blocks.forEach((blk, i)=>{
      const col = i%2, row = Math.floor(i/2);
      const x = 0.4 + col*6.4, y = 1.3 + row*1.85;
      s.addShape('rect', {x, y, w:6.1, h:1.7, fill:{color:LIGHT}, line:{color:blk[2],width:2}});
      s.addText(blk[0], {x:x+0.15, y:y+0.1, w:5.8, h:0.4, fontSize:11, bold:true, color:blk[2]});
      s.addText(blk[1], {x:x+0.15, y:y+0.5, w:5.8, h:1.15, fontSize:10, color:'1E293B'});
    });
    addFooter(s);
  }

  // === SLIDE 4 — Impact Burkina Faso ===
  if(c.impact_bf){ const i = c.impact_bf;
    const s = pres.addSlide(); s.background = {color:'FEF3C7'};
    s.addText('🇧🇫 Impacts sur le Burkina Faso', {x:0.4,y:0.3,fontSize:24,color:'92400E',bold:true});
    s.addText(`Pertinence : ${i.pertinence}`, {x:0.4,y:0.9,fontSize:12,color:YELLOW,italic:true});
    s.addShape('rect', {x:0.4,y:1.25,w:12.5,h:0.04,fill:{color:YELLOW}});
    s.addText(i.note_synthese, {x:0.4,y:1.4,w:12.5,h:0.7,fontSize:12,color:'78350F',italic:true});
    const dims = [
      ['Sécuritaire', i.securitaire, 'EF4444'],
      ['Économique', i.economique, 'F59E0B'],
      ['Diplomatique', i.diplomatique, '2563EB'],
      ['Sociopolitique', i.sociopolitique, '7C3AED']
    ].filter(x=>x[1]?.length);
    dims.forEach((dim, idx)=>{
      const col = idx%2, row = Math.floor(idx/2);
      const x = 0.4 + col*6.4, y = 2.3 + row*2.3;
      s.addShape('rect', {x, y, w:6.1, h:2.15, fill:{color:'FFFFFF'}, line:{color:dim[2],width:2}});
      s.addText(dim[0], {x:x+0.15, y:y+0.1, w:5.8, h:0.3, fontSize:12, bold:true, color:dim[2]});
      const text = dim[1].slice(0,3).map(x=>`• ${x}`).join('\n');
      s.addText(text, {x:x+0.15, y:y+0.45, w:5.8, h:1.6, fontSize:9, color:'1E293B'});
    });
    addFooter(s);
  }

  // === SLIDE 5 — Lecture causale ===
  if(c.lecture_causale){
    const s = pres.addSlide(); s.background = {color:'FFFFFF'};
    s.addText('Lecture causale intégrée', {x:0.4,y:0.3,fontSize:24,color:'0A3D62',bold:true});
    s.addShape('rect', {x:0.4,y:0.95,w:12.5,h:0.04,fill:{color:'0A3D62'}});
    const lc = c.lecture_causale;
    const items = [
      ['Cause première', lc.premiere, 'EF4444'],
      ['Cause structurante', lc.structurante, 'F97316'],
      ['Paradoxe central', lc.paradoxe, 'A78BFA'],
      ['Signal décisif', lc.signal, '60A5FA']
    ].filter(x=>x[1]);
    items.forEach((it, idx)=>{
      const col = idx%2, row = Math.floor(idx/2);
      const x = 0.4 + col*6.4, y = 1.3 + row*2.7;
      s.addShape('rect', {x, y, w:6.1, h:2.55, fill:{color:LIGHT}, line:{color:it[2],width:2}});
      s.addText(it[0], {x:x+0.15, y:y+0.1, w:5.8, h:0.35, fontSize:13, bold:true, color:it[2]});
      s.addText(it[1], {x:x+0.15, y:y+0.5, w:5.8, h:2, fontSize:11, color:'1E293B'});
    });
    addFooter(s);
  }

  // === SLIDE 6 — Scénarios prospectifs ===
  if(c.scenarios?.length){
    const s = pres.addSlide(); s.background = {color:'FFFFFF'};
    s.addText('Scénarios prospectifs (méthode Godet)', {x:0.4,y:0.3,fontSize:24,color:RED,bold:true});
    s.addShape('rect', {x:0.4,y:0.95,w:12.5,h:0.04,fill:{color:RED}});
    c.scenarios.slice(0,5).forEach((sc, idx)=>{
      const y = 1.3 + idx*1.05;
      const probaCol = sc.proba>=40?'EF4444':sc.proba>=20?'F97316':sc.proba>=10?'F59E0B':'22C55E';
      s.addShape('rect', {x:0.4, y, w:12.5, h:0.95, fill:{color:LIGHT}, line:{color:probaCol,width:2}});
      s.addText(`${idx+1}. ${sc.nom}`, {x:0.6, y:y+0.05, w:9, h:0.35, fontSize:13, bold:true, color:'1E293B'});
      s.addText(`Proba ${sc.proba}% • Impact ${sc.impact}/10 • ${sc.h}`, {x:9.5, y:y+0.05, w:3.4, h:0.35, fontSize:11, bold:true, color:probaCol, align:'right'});
      s.addText(sc.d, {x:0.6, y:y+0.4, w:12.1, h:0.5, fontSize:10, color:'334155'});
    });
    addFooter(s);
  }

  // === SLIDE 7 — Chronologie ⚠ ===
  if(c.chronologie?.length){
    const ruptures = c.chronologie.filter(x=>x.rupture);
    if(ruptures.length){
      const s = pres.addSlide(); s.background = {color:'FFFFFF'};
      s.addText('Seuils de rupture documentés ⚠', {x:0.4,y:0.3,fontSize:24,color:RED,bold:true});
      s.addShape('rect', {x:0.4,y:0.95,w:12.5,h:0.04,fill:{color:RED}});
      ruptures.slice(0,8).forEach((r, idx)=>{
        const y = 1.3 + idx*0.65;
        s.addShape('rect', {x:0.4, y, w:12.5, h:0.55, fill:{color:'FEF2F2'}, line:{color:'FEE2E2',width:1}});
        s.addText(fmt.date(r.d), {x:0.6, y:y+0.1, w:1.8, h:0.35, fontSize:11, bold:true, color:RED});
        s.addText(`⚠ ${r.e}`, {x:2.5, y:y+0.05, w:9, h:0.45, fontSize:11, color:'1E293B'});
        s.addText(`${r.sev}/10`, {x:11.7, y:y+0.1, w:1.1, h:0.35, fontSize:11, bold:true, color:RED, align:'right'});
      });
      addFooter(s);
    }
  }

  // === SLIDE 8 — Sources ===
  if(c.sources?.length){
    const s = pres.addSlide(); s.background = {color:'FFFFFF'};
    s.addText('Sources de référence', {x:0.4,y:0.3,fontSize:24,color:'0A3D62',bold:true});
    s.addShape('rect', {x:0.4,y:0.95,w:12.5,h:0.04,fill:{color:'0A3D62'}});
    c.sources.slice(0,8).forEach((src, idx)=>{
      const y = 1.3 + idx*0.6;
      s.addText('•', {x:0.5, y, w:0.3, h:0.4, fontSize:14, color:BLUE, bold:true});
      s.addText(src.nom, {x:0.85, y, w:5, h:0.4, fontSize:12, bold:true, color:'1E293B'});
      s.addText(src.url, {x:5.9, y, w:7, h:0.4, fontSize:10, color:GRAY});
    });
    addFooter(s);
  }

  pres.writeFile({fileName:`note_${c.id}_${new Date().toISOString().slice(0,10)}.pptx`}).then(()=>toast('Présentation PPTX exportée','success'));
}

/* ============= MAP (Clair éditorial / Topo relief / Sombre) ============= */
const MAP_STATE = { mode:'conflict', region:'', status:'', tile:'diplo' };
const GeoMap = {
  map:null, layers:{conflicts:null, fsi:null}, tileLayers:[], _initialized:false,
  setTile(t){
    if(!this.map) return;
    this.tileLayers.forEach(l=>this.map.removeLayer(l));
    this.tileLayers = [];
    // Stratégie : on charge un fond SANS labels et on superpose nos propres labels FR (capitales)
    // Pour mode world, on n'affiche AUCUN label de tuile (juste nos étiquettes FR)
    const isWorld = MAP_STATE.mode==='world';
    if(t==='diplo'){
      // CartoDB Voyager light (sans labels) — fond clair éditorial
      this.tileLayers.push(L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{attribution:'© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',subdomains:'abcd',maxZoom:19}).addTo(this.map));
      // Labels FR uniquement si pas en mode world (sinon nos labels suffisent)
      if(!isWorld){
        this.tileLayers.push(L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',{subdomains:'abcd',maxZoom:19,opacity:.85}).addTo(this.map));
      }
    } else if(t==='isw'){
      // Style ISW : relief sans labels (on n'utilise pas les labels Esri qui sont en anglais)
      this.tileLayers.push(L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',{attribution:'© Esri',maxZoom:13}).addTo(this.map));
      // Pour les modes non-world : utiliser cartodb voyager labels (multi-langue)
      if(!isWorld){
        this.tileLayers.push(L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',{subdomains:'abcd',maxZoom:19,opacity:.85}).addTo(this.map));
      }
    } else {
      // Dark sobre sans labels
      this.tileLayers.push(L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',{attribution:'© CARTO',subdomains:'abcd',maxZoom:19}).addTo(this.map));
      if(!isWorld){
        this.tileLayers.push(L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',{subdomains:'abcd',maxZoom:19}).addTo(this.map));
      }
    }
    MAP_STATE.tile = t;
    document.body.classList.toggle('map-light', t!=='dark');
  },
  statusColor(s, intensity){
    if(s==='escalating') return '#ef4444';
    if(s==='active') return intensity>=8?'#f97316':'#f59e0b';
    if(s==='deescalating') return '#22c55e';
    return '#64748b';
  },
  fsiColor(fsi){
    if(fsi>=9) return '#7f1d1d';
    if(fsi>=7) return '#ef4444';
    if(fsi>=5) return '#f97316';
    if(fsi>=3) return '#f59e0b';
    return '#22c55e';
  },
  init(id){
    const el = document.getElementById(id); if(!el) return;
    if(this.map && this.map._cid===id){ this.map.invalidateSize(); return; }
    if(this.map) this.map.remove();
    this.map = L.map(id,{zoomControl:true,preferCanvas:true,worldCopyJump:true,minZoom:2}).setView([20,15],3);
    this.map._cid = id;
    this.setTile(MAP_STATE.tile||'diplo');
    this.layers.conflicts = L.layerGroup();
    this.layers.fsi = L.layerGroup();
    this._initialized = true;
  },
  clear(){ Object.values(this.layers).forEach(l=>l&&l.clearLayers()); },
  iconConflict(c){
    const col = this.statusColor(c.status, c.intensity);
    const size = 22 + c.intensity*1.6;
    return L.divIcon({className:'',html:`<div style="position:relative"><div style="width:${size}px;height:${size}px;border-radius:50%;background:${col};border:2.5px solid rgba(255,255,255,.9);box-shadow:0 0 12px ${col},0 2px 4px rgba(0,0,0,.5)"></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-weight:800;font-size:.78rem;text-shadow:0 1px 3px rgba(0,0,0,.9)">${c.intensity}</div></div>`,iconSize:[size,size],iconAnchor:[size/2,size/2]});
  },
  iconCountry(ct){
    const col = this.fsiColor(ct.fsi||0);
    const size = 16 + (ct.fsi||0)*1.4;
    return L.divIcon({className:'',html:`<div style="width:${size}px;height:${size}px;border-radius:50%;background:${col};opacity:.85;border:2px solid #fff;box-shadow:0 0 8px ${col}"></div>`,iconSize:[size,size],iconAnchor:[size/2,size/2]});
  },
  filterConflicts(){
    const d = DB.get();
    let list = d.conflicts.slice();
    if(MAP_STATE.region) list=list.filter(c=>c.region===MAP_STATE.region);
    if(MAP_STATE.status) list=list.filter(c=>c.status===MAP_STATE.status);
    return list;
  },
  renderAll(opts={}){
    if(!this.map) return;
    this.clear();
    const mode = opts.mode || MAP_STATE.mode;
    MAP_STATE.mode = mode; // important pour setTile
    // Re-applique les tuiles (active/désactive labels selon mode)
    this.setTile(MAP_STATE.tile);
    const lightTile = MAP_STATE.tile!=='dark';
    const labelBg = lightTile ? 'rgba(255,255,255,.95)' : 'rgba(10,15,28,.92)';
    const labelTxt = lightTile ? '#1e293b' : '#e2e8f0';

    // === MODE CARTE MONDIALE STRATÉGIQUE ===
    if(mode==='world'){
      this.map.setView([20,15],3);
      const G = window.GW_DATA||{};
      const zoomNow = this.map.getZoom();
      // Capitales prioritaires labellisées à zoom faible
      const PRIO = new Set(['Ouagadougou','Bobo-Dioulasso','Paris','Londres','Moscou','Pékin','Washington DC','Tokyo','New Delhi','Le Caire','Brasilia','Téhéran','Tel-Aviv','Jérusalem','Kiev','Berlin','Riyad','Ankara','Pretoria','Lagos','Dakar','Abidjan','Bamako','Niamey','Addis-Abeba','Nairobi','Kinshasa','Khartoum','Bagdad','Damas','Doha','Singapour','Taipei','Séoul','Pyongyang','Madrid','Rome','Bruxelles','Oslo','Stockholm','Istanbul','Mexico','Buenos Aires','Sydney','Canberra']);
      // 1) Capitales
      (G.WORLD_CAPITALS||[]).forEach(c=>{
        const isBF = c.bf, isSacre = c.sacre, isHub = c.hub;
        const col = isBF?'#fde047':isSacre?'#a78bfa':isHub?'#06b6d4':'#3b82f6';
        const size = isBF?16:isHub?13:10;
        const icon = L.divIcon({className:'',html:`<div style="width:${size}px;height:${size}px;border-radius:50%;background:${col};border:2px solid #fff;box-shadow:0 0 6px ${col},0 1px 3px rgba(0,0,0,.4)"></div>`,iconSize:[size,size],iconAnchor:[size/2,size/2]});
        L.marker([c.lat,c.lng],{icon,zIndexOffset:isBF?500:0}).bindPopup(`<div style="min-width:200px"><b style="color:${col}">${isBF?'🇧🇫 ':''}${c.n}</b><br><span style="color:#64748b;font-size:.78rem">${c.pays} • ${c.r||''}</span><br><div style="font-size:.78rem;margin-top:4px"><b>Population :</b> ${c.pop||'—'}</div></div>`).addTo(this.layers.conflicts);
        // Label : prioritaire à zoom 3-4, toutes à zoom 5+
        const showLabel = isBF || (zoomNow>=5) || PRIO.has(c.n);
        if(showLabel){
          const lbl = L.divIcon({className:'',html:`<div style="background:${labelBg};color:${labelTxt};padding:1px 6px;border-radius:3px;font-size:.68rem;font-weight:700;white-space:nowrap;border:1px solid ${col};transform:translateY(-15px);box-shadow:0 1px 3px rgba(0,0,0,.25)">${c.n}</div>`,iconSize:[10,10],iconAnchor:[5,-8]});
          L.marker([c.lat,c.lng],{icon:lbl,interactive:false,zIndexOffset:-50}).addTo(this.layers.conflicts);
        }
      });
      // 2) Détroits & canaux
      (G.STRAITS_CANALS||[]).forEach(s=>{
        const col = s.crit>=10?'#dc2626':s.crit>=8?'#f97316':'#f59e0b';
        const icon = L.divIcon({className:'',html:`<div style="width:18px;height:18px;background:${col};transform:rotate(45deg);border:2px solid #fff;box-shadow:0 0 8px ${col}"></div>`,iconSize:[18,18],iconAnchor:[9,9]});
        L.marker([s.lat,s.lng],{icon,zIndexOffset:300}).bindPopup(`<div style="min-width:240px"><b style="color:${col}">${s.type==='canal'?'🛶 ':s.type==='cap'?'⛰️ ':'⚓ '}${s.n}</b><br><span style="color:#64748b;font-size:.74rem;text-transform:uppercase;letter-spacing:.5px">${s.type} • Criticité ${s.crit}/10</span><div style="font-size:.8rem;color:${labelTxt==='#1e293b'?'#1e293b':'#cbd5e1'};margin-top:6px;line-height:1.45">${s.role}</div></div>`).addTo(this.layers.conflicts);
        const lbl = L.divIcon({className:'',html:`<div style="background:${col};color:#fff;padding:1px 6px;border-radius:3px;font-size:.62rem;font-weight:700;white-space:nowrap;transform:translate(0,-22px);box-shadow:0 2px 4px rgba(0,0,0,.3)">${s.n}</div>`,iconSize:[10,10],iconAnchor:[5,-12]});
        L.marker([s.lat,s.lng],{icon:lbl,interactive:false}).addTo(this.layers.conflicts);
      });
      // 3) Ports stratégiques
      (G.PORTS_STRAT||[]).forEach(p=>{
        const col = p.strat?'#7c2d12':'#0891b2';
        const icon = L.divIcon({className:'',html:`<div style="width:14px;height:14px;background:${col};border:2px solid #fff;box-shadow:0 0 6px ${col}">⚓</div>`,iconSize:[14,14],iconAnchor:[7,7]});
        L.marker([p.lat,p.lng],{icon,zIndexOffset:200}).bindPopup(`<div style="min-width:220px"><b style="color:${col}">⚓ ${p.n}</b><br><span style="color:#64748b;font-size:.74rem;text-transform:uppercase;letter-spacing:.5px">Port • Criticité ${p.crit}/10</span><div style="font-size:.8rem;color:${labelTxt==='#1e293b'?'#1e293b':'#cbd5e1'};margin-top:6px;line-height:1.45">${p.role}</div></div>`).addTo(this.layers.conflicts);
      });
      // 4) Bases militaires
      (G.BASES_MIL||[]).forEach(b=>{
        const acteurCol = {USA:'#1e40af','USA/OTAN':'#1e3a8a',Russie:'#dc2626',Chine:'#dc2626','USA/UK':'#1e40af',France:'#0c4a6e','Russie/AES':'#7c2d12'}[b.acteur]||'#475569';
        const icon = L.divIcon({className:'',html:`<div style="width:16px;height:16px;background:${acteurCol};color:#fff;border:2px solid #fff;text-align:center;font-size:.7rem;line-height:14px;font-weight:900">★</div>`,iconSize:[16,16],iconAnchor:[8,8]});
        L.marker([b.lat,b.lng],{icon,zIndexOffset:250}).bindPopup(`<div style="min-width:230px"><b style="color:${acteurCol}">★ ${b.n}</b><br><span style="color:#64748b;font-size:.74rem">${b.pays} • Acteur : <b>${b.acteur}</b> • Criticité ${b.crit}/10</span><div style="font-size:.8rem;color:${labelTxt==='#1e293b'?'#1e293b':'#cbd5e1'};margin-top:6px;line-height:1.45">${b.role}</div></div>`).addTo(this.layers.conflicts);
      });
      // 5) Corridors énergétiques
      (G.CORRIDORS_ENERGY||[]).forEach(co=>{
        const col = co.inactif?'#94a3b8':'#dc2626';
        const dash = co.inactif?'8,8':'12,4';
        L.polyline([co.from,co.to],{color:col,weight:3,opacity:.7,dashArray:dash}).bindPopup(`<div style="min-width:220px"><b style="color:${col}">⛽ ${co.n}</b>${co.inactif?' <span style="background:#94a3b8;color:#fff;padding:1px 5px;border-radius:3px;font-size:.65rem">INACTIF</span>':''}<br><span style="color:#64748b;font-size:.74rem">Acteur : ${co.acteur}</span><div style="font-size:.8rem;color:${labelTxt==='#1e293b'?'#1e293b':'#cbd5e1'};margin-top:6px;line-height:1.45">${co.role}</div></div>`).addTo(this.layers.conflicts);
      });
      this.layers.conflicts.addTo(this.map);
      this.map.removeLayer(this.layers.fsi);
      document.getElementById('map-count').textContent = `Carte mondiale : ${(G.WORLD_CAPITALS||[]).length} villes • ${(G.STRAITS_CANALS||[]).length} détroits/canaux • ${(G.PORTS_STRAT||[]).length} ports • ${(G.BASES_MIL||[]).length} bases • ${(G.CORRIDORS_ENERGY||[]).length} corridors`;
      this.updateLegend('world');
      setTimeout(()=>this.map.invalidateSize(),100);
      MAP_STATE.mode = mode;
      return;
    }

    // Mode centré Burkina : recentre carte + ajoute marqueur BF spécial
    if(mode==='bf'){
      this.map.setView([12.37,-1.52], 4);
      const bfIcon = L.divIcon({className:'',html:`<div style="position:relative"><div style="width:30px;height:30px;border-radius:50%;background:#fde047;border:3px solid #1e293b;box-shadow:0 0 16px #fde047,0 4px 8px rgba(0,0,0,.4)"></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:1rem">🇧🇫</div></div>`,iconSize:[30,30],iconAnchor:[15,15]});
      L.marker([12.37,-1.52],{icon:bfIcon,zIndexOffset:1000}).bindPopup(`<div style="min-width:240px"><b style="font-size:1rem;color:#7c2d12">🇧🇫 Burkina Faso — Centre d'analyse</b><br><span style="color:#64748b;font-size:.78rem">Ouagadougou • 21 M habitants</span><br><div style="margin-top:8px;font-size:.82rem;color:#1e293b;line-height:1.5">Pivot de l'analyse. Toutes les fiches conflits intègrent une rubrique « Impacts BF » structurée en 4 dimensions.</div><a href="#" onclick="Router.go('impact_bf');closeMapPopup();return false;" style="display:inline-block;margin-top:8px;color:#2563eb;font-weight:600">Centre d'analyse Impacts BF →</a></div>`).addTo(this.layers.conflicts);
      L.circle([12.37,-1.52],{radius:1500000,color:'#fde047',fillColor:'#fde047',fillOpacity:.07,weight:1.5,dashArray:'5,5'}).addTo(this.layers.conflicts);
    }

    // === Couche conflits ===
    if(mode==='conflict' || mode==='combined' || mode==='bf'){
      const list = this.filterConflicts();
      list.forEach(c=>{
        const col = this.statusColor(c.status, c.intensity);
        // Cercle d'influence (zone)
        const radius = 180000 + c.intensity*100000;
        L.circle([c.lat,c.lng],{radius,color:col,fillColor:col,fillOpacity:.12,weight:2,opacity:.6,dashArray:c.status==='frozen'?'4,6':null})
          .bindPopup(this.popupConflict(c)).addTo(this.layers.conflicts);
        // Marqueur central avec note chiffrée
        L.marker([c.lat,c.lng],{icon:this.iconConflict(c)}).bindPopup(this.popupConflict(c)).addTo(this.layers.conflicts);
        // Label éditorial (nom du conflit)
        const label = L.divIcon({className:'',html:`<div style="background:${labelBg};color:${labelTxt};padding:2px 7px;border-radius:3px;font-size:.7rem;font-weight:700;white-space:nowrap;border:1.5px solid ${col};box-shadow:0 2px 6px rgba(0,0,0,.25);transform:translateY(-22px)">${c.short||c.name}</div>`,iconSize:[10,10],iconAnchor:[5,-12]});
        L.marker([c.lat,c.lng],{icon:label,interactive:false,zIndexOffset:-100}).addTo(this.layers.conflicts);
      });
      this.layers.conflicts.addTo(this.map);
      document.getElementById('map-count').textContent = `${list.length} conflit${list.length>1?'s':''} affiché${list.length>1?'s':''}`;
    } else {
      this.map.removeLayer(this.layers.conflicts);
    }

    // === Couche FSI pays (choroplèthe-like par cercles) ===
    if(mode==='fsi' || mode==='combined'){
      const d = DB.get();
      let countries = d.countries.slice();
      if(MAP_STATE.region) countries = countries.filter(c=>c.region===MAP_STATE.region);
      countries.forEach(ct=>{
        const col = this.fsiColor(ct.fsi||0);
        L.marker([ct.lat,ct.lng],{icon:this.iconCountry(ct)}).bindPopup(this.popupCountry(ct)).addTo(this.layers.fsi);
        const label = L.divIcon({className:'',html:`<div style="background:${labelBg};color:${labelTxt};padding:1px 5px;border-radius:3px;font-size:.65rem;font-weight:700;white-space:nowrap;border:1.5px solid ${col};transform:translateY(-18px)">${ct.code} — FSI ${ct.fsi||'?'}</div>`,iconSize:[10,10],iconAnchor:[5,-10]});
        L.marker([ct.lat,ct.lng],{icon:label,interactive:false,zIndexOffset:-200}).addTo(this.layers.fsi);
      });
      this.layers.fsi.addTo(this.map);
      if(mode==='fsi') document.getElementById('map-count').textContent = `${countries.length} pays — code couleur FSI`;
    } else {
      this.map.removeLayer(this.layers.fsi);
    }

    // Légende dynamique
    this.updateLegend(mode);

    MAP_STATE.mode = mode;
    setTimeout(()=>this.map.invalidateSize(),100);
  },
  popupConflict(c){
    const col = this.statusColor(c.status, c.intensity);
    const light = MAP_STATE.tile!=='dark';
    const txt = light?'#1e293b':'#cbd5e1', sub = light?'#64748b':'#94a3b8', cardBg = light?'#f1f5f9':'#0a0f1c';
    return `<div style="min-width:260px"><b style="font-size:.95rem;color:${col}">${c.name}</b><br><span style="color:${sub};font-size:.78rem">${c.region} • depuis ${c.start_year}</span><br><div style="margin:8px 0;display:flex;gap:5px;flex-wrap:wrap"><span style="background:${col}22;color:${col};border:1px solid ${col};padding:2px 7px;border-radius:10px;font-size:.7rem;font-weight:700">Intensité ${c.intensity}/10</span><span style="background:${cardBg};color:${txt};border:1px solid ${col}55;padding:2px 7px;border-radius:10px;font-size:.7rem">${c.status}</span></div><div style="font-size:.78rem;color:${txt};line-height:1.45;margin:6px 0">${(c.brief_decideur&&c.brief_decideur[0])||c.cle_historique||''}</div>${c.impact_bf?`<div style="background:rgba(253,224,71,.15);border-left:3px solid #fde047;padding:6px 9px;font-size:.74rem;color:${txt};margin:6px 0;border-radius:3px"><b>🇧🇫 Impact BF :</b> ${c.impact_bf.pertinence}</div>`:''}<a href="#" onclick="showConflictDetail('${c.id}');closeMapPopup();return false;" style="display:inline-block;margin-top:6px;color:${light?'#1e40af':'#60a5fa'};font-size:.8rem;font-weight:700">Ouvrir la fiche complète →</a></div>`;
  },
  popupCountry(ct){
    const col = this.fsiColor(ct.fsi||0);
    const light = MAP_STATE.tile!=='dark';
    const txt = light?'#1e293b':'#cbd5e1', sub = light?'#64748b':'#94a3b8', cardBg = light?'#f1f5f9':'#0a0f1c';
    const isBF = ct.code==='BF';
    return `<div style="min-width:240px"><b style="font-size:.95rem;color:${col}">${isBF?'🇧🇫 ':''}${ct.name} (${ct.code})</b><br><span style="color:${sub};font-size:.76rem">${ct.region}</span><br><div style="margin:8px 0;font-size:.74rem;display:grid;grid-template-columns:repeat(4,1fr);gap:4px"><div style="text-align:center;background:${cardBg};padding:5px;border-radius:3px"><div style="color:${sub}">Gouv</div><b style="color:${txt}">${ct.gov||'—'}</b></div><div style="text-align:center;background:${cardBg};padding:5px;border-radius:3px"><div style="color:${sub}">Sécu</div><b style="color:${txt}">${ct.sec||'—'}</b></div><div style="text-align:center;background:${cardBg};padding:5px;border-radius:3px"><div style="color:${sub}">Éco</div><b style="color:${txt}">${ct.eco||'—'}</b></div><div style="text-align:center;background:${cardBg};padding:5px;border-radius:3px"><div style="color:${sub}">Soc</div><b style="color:${txt}">${ct.soc||'—'}</b></div></div><div style="font-size:.76rem;color:${txt};line-height:1.45">${ct.note||''}</div></div>`;
  },
  updateLegend(mode){
    const el = document.getElementById('map-legend'); if(!el) return;
    if(mode==='world'){
      el.innerHTML = `<h4>🌍 Carte stratégique mondiale</h4>
        <div class="legend-row"><span class="legend-dot" style="background:#fde047"></span>Burkina Faso (pivot)</div>
        <div class="legend-row"><span class="legend-dot" style="background:#3b82f6"></span>Capitales</div>
        <div class="legend-row"><span class="legend-dot" style="background:#06b6d4"></span>Hubs économiques</div>
        <div class="legend-row"><span class="legend-dot" style="background:#a78bfa"></span>Villes saintes</div>
        <h4 style="margin-top:8px">Points stratégiques</h4>
        <div class="legend-row"><span style="display:inline-block;width:10px;height:10px;background:#dc2626;transform:rotate(45deg);margin-right:7px"></span>Détroit / canal critique</div>
        <div class="legend-row"><span style="display:inline-block;width:10px;height:10px;background:#0891b2;margin-right:7px">⚓</span>Hub portuaire</div>
        <div class="legend-row"><span style="display:inline-block;width:10px;height:10px;background:#1e40af;color:#fff;text-align:center;font-size:.6rem;line-height:10px;margin-right:7px">★</span>Base militaire (US)</div>
        <div class="legend-row"><span style="display:inline-block;width:10px;height:10px;background:#dc2626;color:#fff;text-align:center;font-size:.6rem;line-height:10px;margin-right:7px">★</span>Base (RU/CN)</div>
        <h4 style="margin-top:8px">Corridors</h4>
        <div class="legend-row"><span style="display:inline-block;width:18px;height:2px;background:#dc2626;margin-right:7px"></span>Pipeline / route maritime</div>
        <div style="margin-top:6px;font-size:.66rem;color:#94a3b8;line-height:1.4">Cliquer sur les marqueurs pour les détails. Carte de référence pure (sans conflits).</div>`;
    } else if(mode==='fsi'){
      el.innerHTML = `<h4>Indice FSI (Fragile States — composite)</h4>
        <div class="legend-row"><span class="legend-dot" style="background:#7f1d1d"></span>9-10 — Effondrement</div>
        <div class="legend-row"><span class="legend-dot" style="background:#ef4444"></span>7-8 — Critique</div>
        <div class="legend-row"><span class="legend-dot" style="background:#f97316"></span>5-6 — Fragile</div>
        <div class="legend-row"><span class="legend-dot" style="background:#f59e0b"></span>3-4 — Modéré</div>
        <div class="legend-row"><span class="legend-dot" style="background:#22c55e"></span>0-2 — Stable</div>
        <div style="margin-top:8px;font-size:.68rem;color:#94a3b8;line-height:1.4">Composite : gouvernance + sécurité + économie + social. Inspiré du Fragile States Index (Fund for Peace).</div>`;
    } else if(mode==='combined'){
      el.innerHTML = `<h4>Conflits (cercle + note)</h4>
        <div class="legend-row"><span class="legend-dot" style="background:#ef4444"></span>Escalade</div>
        <div class="legend-row"><span class="legend-dot" style="background:#f97316"></span>Actif intense</div>
        <div class="legend-row"><span class="legend-dot" style="background:#f59e0b"></span>Actif modéré</div>
        <div class="legend-row"><span class="legend-dot" style="background:#22c55e"></span>Désescalade</div>
        <div class="legend-row"><span class="legend-dot" style="background:#64748b"></span>Gelé</div>
        <h4 style="margin-top:8px">Pays (FSI — petits cercles)</h4>
        <div class="legend-row"><span class="legend-dot" style="background:#7f1d1d"></span>FSI critique 9-10</div>
        <div class="legend-row"><span class="legend-dot" style="background:#22c55e"></span>FSI stable 0-2</div>`;
    } else {
      el.innerHTML = `<h4>Statut conflit</h4>
        <div class="legend-row"><span class="legend-dot" style="background:#ef4444"></span>Escalade</div>
        <div class="legend-row"><span class="legend-dot" style="background:#f97316"></span>Actif intense (≥8)</div>
        <div class="legend-row"><span class="legend-dot" style="background:#f59e0b"></span>Actif modéré</div>
        <div class="legend-row"><span class="legend-dot" style="background:#22c55e"></span>Désescalade</div>
        <div class="legend-row"><span class="legend-dot" style="background:#64748b"></span>Gelé / résolu</div>
        <h4 style="margin-top:8px">Lecture</h4>
        <div style="font-size:.68rem;color:#94a3b8;line-height:1.4">Le cercle représente l'aire d'influence. Le marqueur central porte la note d'intensité (1-10). Style éditorial inspiré ICG/Le Monde Diplomatique.</div>`;
    }
    // Enrobage final : wrapper .legend-content + bouton toggle
    const inner = el.innerHTML;
    el.innerHTML = `<button class="legend-toggle" id="legend-toggle-btn" title="Réduire/déplier la légende">−</button><div class="legend-content">${inner}</div>`;
    const tbtn = document.getElementById('legend-toggle-btn');
    if(tbtn){
      tbtn.onclick = (ev)=>{
        ev.stopPropagation();
        el.classList.toggle('collapsed');
        tbtn.textContent = el.classList.contains('collapsed') ? '+' : '−';
      };
    }
    el.onclick = (ev)=>{
      // Si la légende est collapsée, un clic n'importe où la déplie
      if(el.classList.contains('collapsed')){
        el.classList.remove('collapsed');
        if(tbtn) tbtn.textContent = '−';
      }
    };
  }
};
function closeMapPopup(){ if(GeoMap.map) GeoMap.map.closePopup(); }

/* ============= EVENTS WIRING ============= */
function setupEvents(){
  document.getElementById('sb-toggle').onclick = ()=>document.getElementById('sidebar').classList.toggle('collapsed');
  document.querySelectorAll('a[data-page], button[data-page]').forEach(el=>el.addEventListener('click',ev=>{if(el.dataset.page){ev.preventDefault(); Router.go(el.dataset.page);}}));
  document.getElementById('tb-alerts').onclick = ()=>Router.go('alerts');
  document.getElementById('tb-notif')?.addEventListener('click', toggleNotifPanel);

  // Ferme le panneau notifications si on clique ailleurs
  document.addEventListener('click', (ev)=>{
    const panel = document.getElementById('notif-panel');
    const btn = document.getElementById('tb-notif');
    if(!panel || panel.style.display==='none') return;
    if(panel.contains(ev.target) || btn?.contains(ev.target)) return;
    panel.style.display='none';
  });
  document.getElementById('modal-bg').onclick = e=>{if(e.target.id==='modal-bg') closeModal();};
  document.addEventListener('keydown', e=>{if(e.key==='Escape') closeModal();});

  // Conflicts filters
  document.getElementById('cf-search').oninput = e=>{CF_STATE.search=e.target.value; renderConflicts();};
  document.getElementById('cf-region').onchange = e=>{CF_STATE.region=e.target.value; renderConflicts();};
  document.getElementById('cf-status').onchange = e=>{CF_STATE.status=e.target.value; renderConflicts();};
  document.getElementById('cf-sort').onchange = e=>{CF_STATE.sort=e.target.value; renderConflicts();};

  // Briefs / Scenarios selectors
  document.getElementById('brief-conflict').onchange = renderBriefs;
  document.getElementById('bf-conflict')?.addEventListener('change', renderImpactBF);
  document.getElementById('bf-export-pdf')?.addEventListener('click', ()=>{ const cid=document.getElementById('bf-conflict').value; if(cid) exportNotePDF(cid); });
  document.getElementById('brief-export-txt').onclick = ()=>{ const cid = document.getElementById('brief-conflict').value; if(cid) exportNoteSituation(cid); };
  document.getElementById('brief-export-pdf').onclick = ()=>{ const cid = document.getElementById('brief-conflict').value; if(cid) exportNotePDF(cid); };
  document.getElementById('brief-export-docx').onclick = ()=>{ const cid = document.getElementById('brief-conflict').value; if(cid) exportNoteDOCX(cid); };
  document.getElementById('brief-export-pptx').onclick = ()=>{ const cid = document.getElementById('brief-conflict').value; if(cid) exportNotePPTX(cid); };
  document.getElementById('scen-conflict').onchange = renderScenarios;

  // Analyses tabs
  document.querySelectorAll('#an-period .tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('#an-period .tab').forEach(x=>x.classList.remove('active')); t.classList.add('active'); AN_STATE.period=t.dataset.p; renderAnalyses();});
  document.getElementById('an-conflict').onchange = e=>{AN_STATE.conflict=e.target.value; renderAnalyses();};
  document.getElementById('an-export').onclick = ()=>{ const cid=AN_STATE.conflict||document.getElementById('an-conflict').value; if(cid) exportNoteSituation(cid); else toast('Sélectionnez un conflit pour exporter sa note','info'); };

  // Map controls (mode + filters)
  const mapMode = document.getElementById('map-mode');
  if(mapMode){
    mapMode.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{
      mapMode.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
      b.classList.add('active'); MAP_STATE.mode=b.dataset.mode; GeoMap.renderAll();
    });
  }
  const mapTile = document.getElementById('map-tile');
  if(mapTile){
    mapTile.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{
      mapTile.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
      b.classList.add('active'); GeoMap.setTile(b.dataset.tile); GeoMap.renderAll();
    });
  }
  const mapRegion = document.getElementById('map-region');
  if(mapRegion){
    if(mapRegion.options.length<=1) [...new Set(DB.get().conflicts.map(c=>c.region))].sort().forEach(r=>{const o=document.createElement('option'); o.value=r; o.textContent=r; mapRegion.appendChild(o);});
    mapRegion.onchange = e=>{ MAP_STATE.region=e.target.value; GeoMap.renderAll(); };
  }
  const mapStatus = document.getElementById('map-status');
  if(mapStatus) mapStatus.onchange = e=>{ MAP_STATE.status=e.target.value; GeoMap.renderAll(); };

  // Events
  document.getElementById('ev-search').oninput = e=>{EV_STATE.search=e.target.value; renderEvents();};
  document.getElementById('ev-filter-conflict').onchange = e=>{EV_STATE.conflict=e.target.value; renderEvents();};
  document.getElementById('ev-filter-sev').onchange = e=>{EV_STATE.sev=e.target.value; renderEvents();};
  document.getElementById('ev-add')?.addEventListener('click',()=>toast('Édition désactivée — données issues du gabarit méthodologique','info'));

  // News
  document.getElementById('news-refresh').onclick = loadNews;
  document.getElementById('news-demo')?.addEventListener('click', ()=>{ loadDemoNews(); toast('Actualités de démonstration chargées','success'); });
  document.getElementById('news-diag')?.addEventListener('click', diagnosticProxies);
  document.getElementById('news-manage').onclick = ()=>Router.go('sources');
  document.getElementById('news-search').oninput = renderNewsList;
  document.getElementById('news-conflict').onchange = renderNewsList;
  document.getElementById('news-tag')?.addEventListener('change', renderNewsList);

  // Catégorie news : si on change, on recharge avec les sources de la catégorie
  const newsCat = document.getElementById('news-cat');
  if(newsCat){
    newsCat.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{
      newsCat.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      NEWS_STATE.currentCat = b.dataset.cat;
      // Pour 'all' et 'bf-impact', on filtre. Pour les autres, on recharge avec les sources de la catégorie.
      if(['all','bf-impact'].includes(NEWS_STATE.currentCat)){
        renderNewsList();
      } else {
        loadNews();
      }
    });
  }
  startAutoRefresh();
  const ncs = document.getElementById('news-conflict');
  if(ncs.options.length<=1) DB.get().conflicts.forEach(c=>{const o=document.createElement('option'); o.value=c.id; o.textContent=c.short||c.name; ncs.appendChild(o);});

  // Alerts
  document.getElementById('al-add').onclick = ()=>toast('Édition désactivée — voir Admin','info');

  // Les boutons DB sont maintenant gérés dynamiquement dans l'onglet Admin (renderAdmin / _adminOverviewWire)

  document.getElementById('tb-date').textContent = new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
}

/* ============= INIT ============= */
window.addEventListener('DOMContentLoaded',()=>{
  DB.get();
  loadNotifSeen();
  setupEvents();
  Router.go('dash');
  updateNotifBadge();
  // 🛰 Chargement RSS automatique IMMÉDIAT au démarrage (le site est vivant dès la 1ère seconde)
  setTimeout(()=>{ loadNews().catch(e=>console.warn('Auto-load news failed:',e)); }, 800);
  // Demande permission notifications navigateur après 3s pour ne pas brusquer l'utilisateur
  setTimeout(requestNotifPermission, 3000);
});
