/* ==========================================================================
   GéoWatch — MÉTHODO : taxonomie + matrice de pertinence + desks
   Module autonome. Dépend de : window.NEWS_STATE (articles RSS), GW_INTEL (optionnel, cotes).
   Expose : window.renderMatrice, window.renderDesks, window.GW_METHODO
   Appelé par le Router (app.js) : pages data-page="matrice" et data-page="desks".
   Aligné sur la méthodologie SEMDE (12 thématiques codées, 18 zones, matrice ●/○).
   ========================================================================== */
(function(){
  'use strict';

  const T = { bg:'#0a0f1c', card:'#0c1426', border:'#1a2340', txt:'#e2e8f0', dim:'#94a3b8',
              faint:'#64748b', blue:'#60a5fa', green:'#22c55e', orange:'#f97316', red:'#ef4444',
              yellow:'#fde047', purple:'#a855f7' };
  const g = id => document.getElementById(id);
  const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  /* ---------- THÈME CLAIR / SOMBRE (bascule réversible, défaut = clair) ---------- */
  (function initTheme(){
    try{
      const KEY = 'gw_theme';
      if(localStorage.getItem(KEY) === null) localStorage.setItem(KEY, 'light'); // défaut : clair
      const applyTheme = () => document.documentElement.classList.toggle('gw-light', localStorage.getItem(KEY) === 'light');
      applyTheme();
      const addBtn = () => {
        if(!document.body || document.getElementById('gw-theme-btn')) return;
        const b = document.createElement('button');
        b.id = 'gw-theme-btn';
        b.title = 'Basculer thème clair / sombre';
        b.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:5000;width:42px;height:42px;border-radius:50%;border:1px solid #94a3b8;background:#ffffff;color:#0f172a;font-size:18px;line-height:1;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35)';
        const setIcon = () => { b.textContent = (localStorage.getItem(KEY) === 'light') ? '🌙' : '☀️'; };
        setIcon();
        b.onclick = () => { localStorage.setItem(KEY, localStorage.getItem(KEY) === 'light' ? 'dark' : 'light'); applyTheme(); setIcon(); };
        document.body.appendChild(b);
      };
      if(document.body) addBtn(); else window.addEventListener('DOMContentLoaded', addBtn);
    }catch(e){}
  })();

  /* ---------- 12 THÉMATIQUES CODÉES ---------- */
  const THEMES = [
    {code:'S', label:'Sécurité & défense', color:'#ef4444',
     re:/attaque|offensive|frappe|jihad|djihad|terror|militaire|arm[ée]e|soldat|mercenaire|wagner|africa corps|jnim|eigs|daesh|drone|embuscade|attentat|coup d.?[ée]tat|putsch|insurg|raid|bombard|affrontement|enl[èe]vement|otage/gi},
    {code:'D', label:'Diplomatie & alliances', color:'#a855f7',
     re:/diploma|ambassad|sanction|cedeao|union africaine|sommet|accord bilat|trait[ée]|reconnaissance|expuls|rupture des relations|alliance|coop[ée]ration|m[ée]diation|n[ée]gociation|partenariat strat[ée]gique/gi},
    {code:'E', label:'Économie & ressources', color:'#f59e0b',
     re:/[ée]conomi|investiss|\bmine|mini[èe]re|minier|orpaillage|cours de l.or|p[ée]trole|p[ée]trolier|hydrocarbure|\bgaz\b|dette|\bfmi\b|banque mondiale|inflation|c[ée]r[ée]ale|carburant|export|import|fcfa|franc cfa|budget|croissance|commerce|douane|redevance|n[ée]goce|mati[èe]res premi[èe]res|engrais|lithium|uranium/gi},
    {code:'L', label:'Logistique & corridors', color:'#22c55e',
     re:/corridor|\bport\b|\bports\b|fronti[èe]re|fermeture|blocus|blocage|transit|approvisionn|ravitaill|axe routier|a[ée]roport|espace a[ée]rien|logistique|cha[îi]ne d.approvision/gi},
    {code:'H', label:'Humanitaire & social', color:'#38bdf8',
     re:/humanitaire|d[ée]plac[ée]|r[ée]fugi|famine|crise alimentaire|[ée]pid[ée]mie|chol[ée]ra|malnutrition|secours|\bhcr\b|ocha|civils tu[ée]s|massacre|exaction|aide d.urgence/gi},
    {code:'I', label:'Information & influence', color:'#e879f9',
     re:/propagand|d[ée]sinformation|narratif|guerre cognitive|fake news|r[ée]seaux sociaux|campagne d.influence|manipulation de l.information|\btroll|d[ée]bunk|infox/gi},
    {code:'C', label:'Climat & environnement', color:'#84cc16',
     re:/climat|s[ée]cheresse|inondation|d[ée]sertification|p[ée]nurie d.eau|barrage|agropastoral|[ée]leveur|r[ée]chauffement|catastrophe naturelle|crise de l.eau/gi},
    {code:'N', label:'Nucléaire & prolifération', color:'#fb7185',
     re:/nucl[ée]aire|uranium|prolif[ée]ration|\baiea\b|enrichissement|arme atomique|missile balistique|ogive/gi},
    {code:'M', label:'Maritime & océanique', color:'#06b6d4',
     re:/maritime|golfe de guin[ée]e|piraterie|d[ée]troit|\bnavire|c[âa]ble sous-marin|\bp[êe]che\b|bab el.?mandeb|ormuz|hormuz|mer rouge|porte-conteneurs/gi},
    {code:'T', label:'Technologie & cyber', color:'#818cf8',
     re:/\bcyber|num[ée]rique|semi-conducteur|t[ée]l[ée]communicat|satellite|intelligence artificielle|piratage informatique|hacking|fuite de donn[ée]es|starlink|fibre optique/gi},
    {code:'P', label:'Politique interne & gouvernance', color:'#f97316',
     re:/[ée]lection|r[ée]f[ée]rendum|transition|transition|gouvernement|constitution|manifestation|opposition|pr[ée]sident|remaniement|l[ée]gitimit[ée]|prise de pouvoir|dissolution/gi},
    {code:'J', label:'Justice & droit international', color:'#c4b5fd',
     re:/\bcpi\b|cour p[ée]nale|\bjustice\b|proc[èe]s|tribunal|enqu[êe]te|crime de guerre|condamn|mandat d.arr[êe]t|poursuites|inculp/gi}
  ];
  const THEME_BY = {}; THEMES.forEach(t=>THEME_BY[t.code]=t);
  const COLS = ['S','D','E','L','H','I','C','P','J','N','M','T'];

  /* ---------- 18 ZONES + PIVOTS ---------- */
  const ZONES = [
    {id:1, label:'Sahel & Afrique de l’Ouest francophone', short:'1. Sahel & AO franco.', pivots:'Burkina, Mali, Niger, Tchad',
     re:/burkina|ouagadougou|bobo[- ]?dioulasso|\bmali\b|bamako|\bniger\b|niamey|tchad|n.?djamena|s[ée]n[ée]gal|dakar|guin[ée]e\b|conakry|c[ôo]te d.ivoire|abidjan|b[ée]nin|cotonou|\btogo\b|lom[ée]|mauritanie|nouakchott|\baes\b|sahel|liptako|traor[ée]|go[ïi]ta|tiani|kaya\b|\bdori\b|djibo|\bgao\b|kidal|tombouctou|m[ée]naka|tillab[ée]ri|gourma|s[ée]no/gi},
    {id:2, label:'Afrique de l’Ouest anglophone & côtière', short:'2. AO anglo. & côtière', pivots:'Nigeria, Ghana',
     re:/nigeria|abuja|lagos|\bghana\b|accra|sierra leone|freetown|liberia|monrovia|gambie|banjul/gi},
    {id:3, label:'Afrique centrale', short:'3. Afrique centrale', pivots:'Tchad, Cameroun, RDC',
     re:/cameroun|yaound[ée]|douala|centrafric|\brca\b|bangui|gabon|libreville|\bcongo\b|brazzaville|guin[ée]e [ée]quatoriale/gi},
    {id:4, label:'Afrique des Grands Lacs', short:'4. Grands Lacs', pivots:'RDC, Rwanda, Ouganda',
     re:/\brdc\b|kinshasa|\bkivu\b|\bm23\b|rwanda|kigali|burundi|bujumbura|ouganda|kampala|tanzanie|grands lacs/gi},
    {id:5, label:'Corne de l’Afrique', short:'5. Corne de l’Afrique', pivots:'Soudan, Éthiopie, Somalie',
     re:/soudan|khartoum|[ée]rythr[ée]e|asmara|djibouti|[ée]thiopie|addis[- ]?abeba|somalie|mogadiscio|corne de l.afrique/gi},
    {id:6, label:'Afrique australe', short:'6. Afrique australe', pivots:'Afrique du Sud, Angola',
     re:/angola|luanda|zambie|zimbabwe|harare|malawi|mozambique|namibie|botswana|afrique du sud|pretoria|johannesbourg|madagascar|lesotho|eswatini/gi},
    {id:7, label:'Maghreb & Afrique du Nord', short:'7. Maghreb & Afr. Nord', pivots:'Algérie, Libye, Maroc, Égypte',
     re:/alg[ée]rie|alger\b|libye|tripoli|\bmaroc\b|rabat|casablanca|tunisie|\btunis\b|[ée]gypte|le caire|maghreb/gi},
    {id:8, label:'Moyen-Orient', short:'8. Moyen-Orient', pivots:'Iran, Arabie saoudite, Turquie, Émirats',
     re:/turquie|ankara|istanbul|\bliban\b|beyrouth|syrie|\bdamas\b|\birak\b|bagdad|\biran\b|t[ée]h[ée]ran|isra[ëe]l|j[ée]rusalem|\bgaza\b|hamas|hezbollah|arabie saoudite|riyad|y[ée]men|\bqatar\b|[ée]mirats|dubai|golfe persique|\boman\b|kowe[ïi]t|moyen-orient/gi},
    {id:9, label:'Europe occidentale & centrale', short:'9. Europe occidentale', pivots:'France, Allemagne, Royaume-Uni',
     re:/\bfrance\b|paris|allemagne|berlin|royaume-uni|londres|union europ[ée]enne|bruxelles|espagne|\bmadrid\b|italie|\brome\b|suisse|otan/gi},
    {id:10, label:'Europe orientale & Balkans', short:'10. Europe orient. & Balkans', pivots:'Russie, Ukraine',
     re:/russie|moscou|poutine|ukraine|\bkiev\b|\bkyiv\b|bi[ée]lorussie|moldavie|g[ée]orgie|arm[ée]nie|azerba[ïi]djan|serbie|balkans|mer noire/gi},
    {id:11, label:'Asie centrale', short:'11. Asie centrale', pivots:'Kazakhstan, Afghanistan',
     re:/kazakhstan|kirghiz|tadjik|turkm[ée]nistan|ouzb[ée]kistan|afghanistan|kaboul|taliban|asie centrale/gi},
    {id:12, label:'Asie du Sud', short:'12. Asie du Sud', pivots:'Inde, Pakistan',
     re:/\binde\b|new delhi|\bdelhi\b|pakistan|islamabad|bangladesh|dhaka|n[ée]pal|sri lanka|colombo/gi},
    {id:13, label:'Asie du Sud-Est', short:'13. Asie du Sud-Est', pivots:'Indonésie, Vietnam, Singapour',
     re:/birmanie|myanmar|tha[ïi]lande|bangkok|\blaos\b|cambodge|vietnam|hano[ïi]|malaisie|singapour|indon[ée]sie|jakarta|philippines|manille|asean|anase/gi},
    {id:14, label:'Extrême-Orient', short:'14. Extrême-Orient', pivots:'Chine, Japon, Taïwan',
     re:/\bchine\b|p[ée]kin|beijing|xi jinping|ta[ïi]wan|cor[ée]e|s[ée]oul|pyongyang|\bjapon\b|tokyo|mongolie|mer de chine/gi},
    {id:15, label:'Océanie & Pacifique', short:'15. Océanie & Pacifique', pivots:'Australie',
     re:/australie|canberra|sydney|nouvelle-z[ée]lande|papouasie|\bfidji\b|pacifique sud|oc[ée]anie/gi},
    {id:16, label:'Amérique du Nord', short:'16. Amérique du Nord', pivots:'États-Unis',
     re:/[ée]tats-unis|washington|maison blanche|\btrump\b|\bbiden\b|\bcanada\b|ottawa|mexique|mexico/gi},
    {id:17, label:'Amérique centrale & Caraïbes', short:'17. Amérique C. & Caraïbes', pivots:'Selon l’actualité',
     re:/cara[ïi]bes|\bcuba\b|la havane|ha[ïi]ti|\bpanama\b|guatemala|honduras|nicaragua|costa rica|salvador|r[ée]publique dominicaine/gi},
    {id:18, label:'Amérique du Sud', short:'18. Amérique du Sud', pivots:'Brésil, Venezuela',
     re:/br[ée]sil|brasilia|argentine|buenos aires|colombie|bogota|venezuela|caracas|p[ée]rou\b|\blima\b|\bchili\b|santiago|[ée]quateur|bolivie|guyane/gi}
  ];
  const ZONE_BY = {}; ZONES.forEach(z=>ZONE_BY[z.id]=z);

  /* ---------- MATRICE DE PERTINENCE (Annexe C) : A=active, L=légère, .=nulle ----------
     Ordre des colonnes = COLS (S D E L H I C P J N M T) */
  const RELEVANCE_ROWS = {
    1:'AAAAAAAAA..L', 2:'AAAAAAAAA.LL', 3:'AAAAAAAAA..L', 4:'AAALALAAL..L',
    5:'AAALAAAAA.AL', 6:'LAA.LLLLL.LL', 7:'AAAAAAAAL.AL', 8:'AAAALALALAAL',
    9:'LAALLA.LA.LA', 10:'AAALLALLAALL', 11:'AAALLLLALL.L', 12:'LAALLLLLLAAL',
    13:'.LLL..LL..AL', 14:'LAALLALLLAAA', 15:'.LL...L...LL', 16:'LAALLA.LLALA',
    17:'.LL...L...LL', 18:'.LA.......LL'
  };
  // validation
  Object.keys(RELEVANCE_ROWS).forEach(k=>{ if(RELEVANCE_ROWS[k].length!==12) console.warn('[methodo] ligne matrice invalide zone', k, RELEVANCE_ROWS[k].length); });

  /* ---------- PERSISTANCE (overrides matrice + config desks) ---------- */
  const LS_MAT = 'gw_methodo_matrix';
  const LS_DESK = 'gw_methodo_desks';
  function loadMatrixOverrides(){ try{ return JSON.parse(localStorage.getItem(LS_MAT))||{}; }catch(e){ return {}; } }
  function saveMatrixOverrides(o){ try{ localStorage.setItem(LS_MAT, JSON.stringify(o)); }catch(e){} }
  function relevance(zoneId, code){
    const ov = loadMatrixOverrides();
    if(ov[zoneId] && ov[zoneId][code]) return ov[zoneId][code];
    const row = RELEVANCE_ROWS[zoneId]; if(!row) return '.';
    return row[COLS.indexOf(code)] || '.';
  }

  const DESKS_DEFAULT = {
    desks:[
      {id:'A1', name:'A1 — Cœur AES', themes:'S, P, D, I, J'},
      {id:'A2', name:'A2 — Façade & corridors', themes:'L, E, S, M'},
      {id:'A3', name:'A3 — Afrique élargie', themes:'S, D, E, H, M'},
      {id:'A4', name:'A4 — Maghreb & Méditerranée', themes:'D, E, L, I, M'},
      {id:'A5', name:'A5 — Moyen-Orient & influences', themes:'D, E, I, N, S'},
      {id:'A6', name:'A6 — Desk transverse (puissances & institutions)', themes:'D, E, I, J, T', transverse:true}
    ],
    owner:{1:'A1', 2:'A2', 3:'A3', 4:'A3', 5:'A3', 6:'A6', 7:'A4', 8:'A5',
           9:'A6', 10:'A6', 11:'A6', 12:'A6', 13:'A6', 14:'A6', 15:'A6', 16:'A6', 17:'A6', 18:'A6'}
  };
  function loadDesks(){
    try{ const d = JSON.parse(localStorage.getItem(LS_DESK)); if(d && d.desks && d.owner) return d; }catch(e){}
    return JSON.parse(JSON.stringify(DESKS_DEFAULT));
  }
  function saveDesks(d){ try{ localStorage.setItem(LS_DESK, JSON.stringify(d)); }catch(e){} }

  /* ---------- MOTEUR D'ÉTIQUETAGE ---------- */
  function getItems(){ try{ return (window.NEWS_STATE && window.NEWS_STATE.items) || []; }catch(e){ return []; } }
  function txtOf(it){ return (it.title||'')+' '+(it.description||it.summary||''); }
  function countRe(text, re){ const m = text.match(re); return m? m.length : 0; }

  function tagItem(it){
    const text = txtOf(it);
    let zScores = [], tScores = [];
    for(const z of ZONES){ const n = countRe(text, z.re); if(n>0) zScores.push([z.id,n]); }
    for(const t of THEMES){ const n = countRe(text, t.re); if(n>0) tScores.push([t.code,n]); }
    zScores.sort((a,b)=>b[1]-a[1]); tScores.sort((a,b)=>b[1]-a[1]);
    let pz = zScores.length? zScores[0][0] : null;
    let pt = tScores.length? tScores[0][0] : null;
    if(!pz && it._bf) pz = 1;            // tout contenu BF non géolocalisé → Sahel/AES
    if(pz===null && it._bf===undefined){ /* rien */ }
    return { pz, pt, zones: zScores.map(x=>x[0]), themes: tScores.map(x=>x[0]) };
  }

  function reliabilityChip(it){
    try{ if(typeof GW_INTEL!=='undefined' && GW_INTEL && GW_INTEL.reliabilityChip) return GW_INTEL.reliabilityChip(it,{compact:true}); }catch(e){}
    return '';
  }
  function srcName(it){ return it._source || it.source || (it.sourceName) || ''; }
  function itemLink(it){ return it.link || it.url || '#'; }

  /* ---------- PAGE : MATRICE DE PERTINENCE ---------- */
  let MAT_EDIT = false;
  let MAT_SEL = null; // {z, c}

  window.renderMatrice = function(){
    const host = g('matrice-content'); if(!host) return;
    const items = getItems();
    // pré-tag tous les articles une fois
    const tagged = items.map(it=>({it, tag:tagItem(it)}));
    // compteur par cellule
    const cellCount = {}; let totalTagged=0, inActive=0, inLight=0;
    tagged.forEach(({it,tag})=>{
      if(tag.pz && tag.pt){
        const k = tag.pz+'|'+tag.pt; cellCount[k]=(cellCount[k]||0)+1; totalTagged++;
        const r = relevance(tag.pz, tag.pt);
        if(r==='A') inActive++; else if(r==='L') inLight++;
      }
    });
    const pct = totalTagged? Math.round(inActive*100/totalTagged) : 0;

    let html = '';
    html += banner('table-cells', T.purple, 'Matrice de pertinence — zones × thématiques',
      'Pour chaque zone du monde et chacune des 12 thématiques, la matrice dit ce que l’on suit activement (●), légèrement (○) ou pas du tout (vide). C’est le filtre qui concentre l’effort là où il compte pour l’AES.',
      ['● veille active = collecte systématique (quotidien/hebdo)', '○ veille légère = revue mensuelle / alertes', 'Case vide = pas de veille', 'Le chiffre dans une case = articles RSS récents détectés pour ce croisement']);

    // barre de stats + contrôles
    html += `<div class="card" style="margin-bottom:14px"><div style="display:flex;flex-wrap:wrap;gap:18px;align-items:center;justify-content:space-between">
      <div style="display:flex;gap:22px;flex-wrap:wrap">
        ${stat(totalTagged, 'articles classés', T.blue)}
        ${stat(inActive, 'en veille active ●', T.green)}
        ${stat(inLight, 'en veille légère ○', T.yellow)}
        ${stat(pct+'%', 'de la matière en zone active', T.purple)}
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <label style="font-size:.78rem;color:${T.dim};display:flex;align-items:center;gap:6px;cursor:pointer">
          <input type="checkbox" id="mat-edit" ${MAT_EDIT?'checked':''}> Mode édition (cliquer une case la fait passer ● → ○ → vide)
        </label>
        <button class="btn ghost sm" id="mat-refresh"><i class="fa-solid fa-rotate"></i> Rafraîchir</button>
        <button class="btn ghost sm" id="mat-reset"><i class="fa-solid fa-rotate-left"></i> Réinitialiser</button>
      </div>
    </div>`;

    // tableau
    html += `<div class="card" style="overflow-x:auto"><table style="border-collapse:collapse;width:100%;font-size:.72rem">`;
    html += `<thead><tr><th style="position:sticky;left:0;background:${T.card};text-align:left;padding:6px 8px;color:${T.dim};border-bottom:2px solid ${T.border};min-width:170px">Zone</th>`;
    COLS.forEach(c=>{ const t=THEME_BY[c]; html += `<th title="${esc(t.label)}" style="padding:6px 4px;color:${t.color};border-bottom:2px solid ${T.border};font-weight:700">${c}</th>`; });
    html += `</tr></thead><tbody>`;
    ZONES.forEach(z=>{
      html += `<tr><td style="position:sticky;left:0;background:${T.card};text-align:left;padding:5px 8px;color:${T.txt};border-bottom:1px solid ${T.border};white-space:nowrap" title="${esc(z.label)} — pivots : ${esc(z.pivots)}">${esc(z.short)}</td>`;
      COLS.forEach(c=>{
        const r = relevance(z.id, c);
        const k = z.id+'|'+c; const n = cellCount[k]||0;
        const sym = r==='A'?'●' : r==='L'?'○' : '';
        const col = r==='A'?T.green : r==='L'?T.yellow : T.faint;
        const bg = (MAT_SEL && MAT_SEL.z===z.id && MAT_SEL.c===c)? 'rgba(96,165,250,.25)' : 'transparent';
        const badge = n>0? `<span style="font-size:.6rem;color:${T.blue};margin-left:2px">${n}</span>` : '';
        html += `<td class="mat-cell" data-z="${z.id}" data-c="${c}" style="text-align:center;padding:4px 3px;border-bottom:1px solid ${T.border};cursor:pointer;background:${bg}"><span style="color:${col};font-size:.9rem">${sym}</span>${badge}</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table></div>`;

    // détail cellule sélectionnée
    html += `<div id="mat-detail" style="margin-top:14px"></div>`;
    host.innerHTML = html;

    // bindings
    g('mat-edit').onchange = e=>{ MAT_EDIT = e.target.checked; };
    g('mat-refresh').onclick = ()=> window.renderMatrice();
    g('mat-reset').onclick = ()=>{ if(confirm('Réinitialiser la matrice aux valeurs par défaut ?')){ saveMatrixOverrides({}); window.renderMatrice(); } };
    host.querySelectorAll('.mat-cell').forEach(td=>{
      td.onclick = ()=>{
        const z = +td.dataset.z, c = td.dataset.c;
        if(MAT_EDIT){
          const cur = relevance(z,c);
          const next = cur==='A'?'L' : cur==='L'?'.' : 'A';
          const ov = loadMatrixOverrides(); ov[z]=ov[z]||{}; ov[z][c]=next; saveMatrixOverrides(ov);
          window.renderMatrice();
        } else {
          MAT_SEL = {z, c}; showCellDetail(z, c, tagged);
          host.querySelectorAll('.mat-cell').forEach(x=>x.style.background='transparent');
          td.style.background='rgba(96,165,250,.25)';
        }
      };
    });
    if(MAT_SEL) showCellDetail(MAT_SEL.z, MAT_SEL.c, tagged);
  };

  function showCellDetail(zoneId, code, tagged){
    const box = g('mat-detail'); if(!box) return;
    const z = ZONE_BY[zoneId], t = THEME_BY[code];
    const r = relevance(zoneId, code);
    const lvl = r==='A'?'<span style="color:'+T.green+'">● veille active</span>' : r==='L'?'<span style="color:'+T.yellow+'">○ veille légère</span>' : '<span style="color:'+T.faint+'">vide — pas de veille</span>';
    const matched = tagged.filter(x=>x.tag.pz===zoneId && x.tag.pt===code)
      .sort((a,b)=> new Date(b.it.pubDate||0)-new Date(a.it.pubDate||0)).slice(0,25);
    let html = `<div class="card"><div class="card-hd"><h2><i class="fa-solid fa-filter" style="color:${T.blue}"></i> ${esc(z.short)} × ${esc(t.label)} (${code})</h2></div>`;
    html += `<div style="font-size:.8rem;color:${T.dim};margin-bottom:10px">Niveau de veille : ${lvl} · ${matched.length} article(s) récent(s) détecté(s).</div>`;
    if(!matched.length){ html += `<div style="color:${T.faint};font-size:.82rem">Aucun article RSS récent pour ce croisement. (Charge les flux via le Tableau de bord si la liste est vide.)</div>`; }
    else {
      html += `<div style="display:flex;flex-direction:column;gap:8px">`;
      matched.forEach(({it})=>{
        const d = it.pubDate? new Date(it.pubDate).toLocaleString('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'';
        html += `<div style="border-left:3px solid ${t.color};padding:6px 10px;background:rgba(255,255,255,.02);border-radius:0 6px 6px 0">
          <a href="${esc(itemLink(it))}" target="_blank" rel="noopener" style="color:${T.txt};text-decoration:none;font-size:.84rem;font-weight:600">${esc(it.title||'(sans titre)')}</a>
          <div style="font-size:.66rem;color:${T.faint};margin-top:3px">${esc(srcName(it))} · ${d} ${reliabilityChip(it)}</div>
        </div>`;
      });
      html += `</div>`;
    }
    html += `</div>`;
    box.innerHTML = html;
  }

  /* ---------- PAGE : DESKS / RÉPARTITION ---------- */
  let DESK_EDIT = false;

  function routeItem(it, cfg){
    const tag = tagItem(it);
    if(!tag.pz) return {deskId:null, tag};
    const owner = cfg.owner[tag.pz];
    if(owner) return {deskId:owner, tag};
    const trans = cfg.desks.find(d=>d.transverse);
    return {deskId: trans?trans.id:null, tag};
  }

  window.renderDesks = function(){
    const host = g('desks-content'); if(!host) return;
    const cfg = loadDesks();
    const items = getItems();
    const routed = {}; cfg.desks.forEach(d=>routed[d.id]=[]);
    let unrouted = 0;
    items.forEach(it=>{ const {deskId, tag} = routeItem(it, cfg); if(deskId && routed[deskId]) routed[deskId].push({it, tag}); else unrouted++; });

    let html = '';
    html += banner('people-group', T.green, 'Desks / Répartition de la veille',
      'Chaque zone du monde est confiée à un analyste (desk). Toute dépêche est automatiquement routée vers le desk responsable de sa zone. Le desk transverse récupère les grandes puissances, les institutions et le reste du monde.',
      ['Socle proposé : 6 desks (modulable de 3 à 10).', 'Chaque article est rangé selon sa zone principale détectée.', 'Clique « Configurer » pour réaffecter les zones aux analystes.']);

    html += `<div class="card" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
      <div style="display:flex;gap:22px;flex-wrap:wrap">
        ${stat(cfg.desks.length, 'desks', T.blue)}
        ${stat(items.length, 'articles en circulation', T.green)}
        ${stat(unrouted, 'non routés (hors périmètre)', T.faint)}
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn ghost sm" id="desk-refresh"><i class="fa-solid fa-rotate"></i> Rafraîchir</button>
        <button class="btn ${DESK_EDIT?'primary':'ghost'} sm" id="desk-config"><i class="fa-solid fa-sliders"></i> Configurer la répartition</button>
      </div>
    </div>`;

    if(DESK_EDIT){ html += deskEditor(cfg); }

    html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px">`;
    cfg.desks.forEach(d=>{
      const zonesOwned = Object.keys(cfg.owner).filter(z=>cfg.owner[z]===d.id).map(z=>ZONE_BY[+z]);
      const arr = (routed[d.id]||[]).sort((a,b)=> new Date(b.it.pubDate||0)-new Date(a.it.pubDate||0));
      const top = arr.slice(0,6);
      html += `<div class="card" style="border-top:3px solid ${d.transverse?T.purple:T.blue}">
        <div style="font-weight:700;color:${T.txt};font-size:.92rem">${esc(d.name)}</div>
        <div style="font-size:.68rem;color:${T.dim};margin:4px 0">Thématiques dominantes : <b style="color:${T.blue}">${esc(d.themes||'—')}</b></div>
        <div style="font-size:.66rem;color:${T.faint};margin-bottom:8px">Zones : ${zonesOwned.length? zonesOwned.map(z=>esc(z.short.replace(/^\d+\.\s*/,''))).join(' · '):'<i>aucune</i>'}</div>
        <div style="font-size:.72rem;color:${T.dim};margin-bottom:6px"><b style="color:${T.green}">${arr.length}</b> dépêche(s) routée(s) · ${top.length? 'dernières :':''}</div>
        <div style="display:flex;flex-direction:column;gap:6px">`;
      if(!top.length){ html += `<div style="color:${T.faint};font-size:.74rem">Aucune dépêche récente pour ce desk.</div>`; }
      top.forEach(({it,tag})=>{
        const d2 = it.pubDate? new Date(it.pubDate).toLocaleString('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'';
        const chips = (tag.pt?`<span style="background:${(THEME_BY[tag.pt]||{}).color||T.faint}22;color:${(THEME_BY[tag.pt]||{}).color||T.dim};padding:1px 5px;border-radius:6px;font-size:.58rem">${tag.pt}</span>`:'');
        html += `<div style="border-left:3px solid ${d.transverse?T.purple:T.blue};padding:4px 8px;background:rgba(255,255,255,.02);border-radius:0 6px 6px 0">
          <a href="${esc(itemLink(it))}" target="_blank" rel="noopener" style="color:${T.txt};text-decoration:none;font-size:.76rem;font-weight:600">${esc((it.title||'').slice(0,110))}</a>
          <div style="font-size:.6rem;color:${T.faint};margin-top:2px">${chips} ${esc(srcName(it))} · ${d2} ${reliabilityChip(it)}</div>
        </div>`;
      });
      html += `</div></div>`;
    });
    html += `</div>`;
    host.innerHTML = html;

    g('desk-refresh').onclick = ()=> window.renderDesks();
    g('desk-config').onclick = ()=>{ DESK_EDIT = !DESK_EDIT; window.renderDesks(); };
    if(DESK_EDIT) bindDeskEditor(cfg);
  };

  function deskEditor(cfg){
    let html = `<div class="card" style="margin-bottom:14px;border:1px solid ${T.blue}">
      <div class="card-hd"><h2><i class="fa-solid fa-sliders" style="color:${T.blue}"></i> Configurer la répartition</h2></div>
      <div style="font-size:.74rem;color:${T.dim};margin-bottom:10px">Attribue chaque zone à un analyste. Modifie les noms si besoin, puis enregistre.</div>`;
    // noms des desks
    html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px;margin-bottom:12px">`;
    cfg.desks.forEach(d=>{ html += `<div><label style="font-size:.62rem;color:${T.faint}">${d.id}</label><input class="desk-name" data-id="${d.id}" value="${esc(d.name)}" style="width:100%;background:${T.bg};border:1px solid ${T.border};color:${T.txt};border-radius:6px;padding:5px 8px;font-size:.74rem"></div>`; });
    html += `</div>`;
    // zone -> desk
    html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:6px">`;
    ZONES.forEach(z=>{
      html += `<div style="display:flex;align-items:center;gap:8px">
        <span style="flex:1;font-size:.72rem;color:${T.txt}">${esc(z.short)}</span>
        <select class="zone-owner" data-z="${z.id}" style="background:${T.bg};border:1px solid ${T.border};color:${T.txt};border-radius:6px;padding:4px 6px;font-size:.72rem">
          ${cfg.desks.map(d=>`<option value="${d.id}" ${cfg.owner[z.id]===d.id?'selected':''}>${esc(d.id)}</option>`).join('')}
        </select></div>`;
    });
    html += `</div>`;
    html += `<div style="margin-top:12px;display:flex;gap:8px">
      <button class="btn primary sm" id="desk-save"><i class="fa-solid fa-floppy-disk"></i> Enregistrer</button>
      <button class="btn ghost sm" id="desk-reset"><i class="fa-solid fa-rotate-left"></i> Réinitialiser (socle 6 desks)</button>
    </div></div>`;
    return html;
  }

  function bindDeskEditor(cfg){
    const sv = g('desk-save'); if(sv) sv.onclick = ()=>{
      const newCfg = JSON.parse(JSON.stringify(cfg));
      document.querySelectorAll('.desk-name').forEach(inp=>{ const d=newCfg.desks.find(x=>x.id===inp.dataset.id); if(d) d.name=inp.value.trim()||d.id; });
      document.querySelectorAll('.zone-owner').forEach(sel=>{ newCfg.owner[+sel.dataset.z]=sel.value; });
      saveDesks(newCfg); DESK_EDIT=false; window.renderDesks();
      try{ if(window.toast) window.toast('Répartition enregistrée'); }catch(e){}
    };
    const rs = g('desk-reset'); if(rs) rs.onclick = ()=>{ if(confirm('Revenir au socle de 6 desks par défaut ?')){ saveDesks(JSON.parse(JSON.stringify(DESKS_DEFAULT))); DESK_EDIT=false; window.renderDesks(); } };
  }

  /* ---------- helpers UI ---------- */
  function banner(icon, color, title, what, lines){
    return `<div class="card" style="margin-bottom:14px;border-left:4px solid ${color}">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
        <i class="fa-solid fa-${icon}" style="color:${color};font-size:1.1rem"></i>
        <span style="font-weight:700;color:${T.txt};font-size:1rem">${esc(title)}</span>
      </div>
      <div style="font-size:.82rem;color:${T.dim};margin-bottom:8px">${esc(what)}</div>
      <ul style="margin:0;padding-left:18px;color:${T.faint};font-size:.74rem">${lines.map(l=>`<li>${esc(l)}</li>`).join('')}</ul>
    </div>`;
  }
  function stat(val, label, color){
    return `<div><div style="font-size:1.3rem;font-weight:800;color:${color}">${val}</div><div style="font-size:.66rem;color:${T.dim}">${esc(label)}</div></div>`;
  }

  function card(title, icon, color, inner){
    return `<div class="card" style="margin-bottom:14px"><div class="card-hd"><h2><i class="fa-solid fa-${icon}" style="color:${color}"></i> ${esc(title)}</h2></div>${inner}</div>`;
  }
  function goBtn(page, label, color){
    return `<button class="btn ghost sm" onclick="Router.go('${page}')" style="color:${color||T.blue}"><i class="fa-solid fa-arrow-right"></i> ${esc(label)}</button>`;
  }

  /* ---------- PAGE : MÉTHODOLOGIE (doctrine vivante) ---------- */
  window.renderMethodo = function(){
    const host = g('methodo-content'); if(!host) return;
    let html = '';
    html += banner('compass-drafting', T.purple, 'Méthodologie de veille — doctrine de la cellule',
      'La méthode commune de la cellule SEMDE : comment nous décidons quoi suivre, qui suit quoi, comment nous évaluons l’information et sous quelle forme nous la restituons. Couverture mondiale, lue au prisme Burkina Faso / AES.',
      ['Veille orientée « client » (impact sur l’AES).', 'Architecture Géographie × Acteurs × Thématique.', 'Cotation systématique des sources, rien sans source ni cote.']);

    html += card('1. Principe directeur : une veille orientée « client »', 'bullseye', T.yellow,
      `<div style="font-size:.85rem;color:${T.dim}">La première question n’est pas « que se passe-t-il dans le monde ? » mais « de quoi notre commanditaire a-t-il besoin pour décider ? ». Le commanditaire de référence est le <b style="color:${T.txt}">Burkina Faso et l’AES</b> : tout est filtré par l’impact (direct ou indirect) sur sa sécurité, son économie, sa diplomatie et sa stabilité.</div>`);

    html += card('2. Le cycle de veille en 5 temps', 'arrows-spin', T.green,
      tbl(['Phase','Question clé'], [
        ['1. Orientation','Que doit-on savoir, et pour quelle décision ?'],
        ['2. Collecte','Où trouver l’information, de façon licite et traçable ?'],
        ['3. Traitement & évaluation','L’information est-elle fiable et recoupée ?'],
        ['4. Analyse','Qu’est-ce que cela signifie pour l’AES ?'],
        ['5. Diffusion','Qui doit savoir quoi, et pour quoi faire ?']
      ]));

    html += card('3. Les trois niveaux d’analyse', 'layer-group', T.blue,
      `<ul style="margin:0;padding-left:18px;color:${T.dim};font-size:.85rem">
        <li><b style="color:${T.txt}">Descriptif</b> — Que s’est-il passé ? (faits datés et sourcés)</li>
        <li><b style="color:${T.txt}">Explicatif</b> — Pourquoi est-ce arrivé ? (causes, intentions, contexte)</li>
        <li><b style="color:${T.txt}">Prospectif</b> — Que va-t-il se passer ? (scénarios, conséquences AES)</li>
      </ul><div style="font-size:.78rem;color:${T.faint};margin-top:6px">Exigence : atteindre systématiquement l’explicatif, viser le prospectif sur les sujets prioritaires.</div>`);

    html += card('4. Architecture : Géographie × Acteurs × Thématique', 'table-cells', T.purple,
      `<div style="font-size:.85rem;color:${T.dim};margin-bottom:8px">Chaque objet de veille croise une zone (parmi 18), une famille d’acteurs et une thématique (parmi 12 codées : S, D, E, L, H, I, C, N, M, T, P, J). La <b style="color:${T.txt}">matrice de pertinence</b> dit, pour chaque zone, ce que l’on suit activement (●) ou légèrement (○).</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">${goBtn('matrice','Ouvrir la matrice de pertinence',T.purple)}${goBtn('desks','Voir la répartition (desks)',T.green)}</div>`);

    html += card('5. Fiabiliser : cotation des sources (code OTAN)', 'shield-halved', T.red,
      `<div style="display:flex;gap:18px;flex-wrap:wrap">
        <div>${tbl(['Fiabilité source','—'], [['A','Totalement fiable'],['B','Habituellement fiable'],['C','Assez fiable'],['D','Peu fiable'],['E','Non fiable'],['F','Indéterminable']])}</div>
        <div>${tbl(['Crédibilité info','—'], [['1','Confirmée'],['2','Probablement vraie'],['3','Possiblement vraie'],['4','Douteuse'],['5','Improbable'],['6','Indéterminable']])}</div>
      </div>
      <div style="font-size:.78rem;color:${T.faint};margin-top:6px">On note chaque information par une lettre + un chiffre (ex. B2). Règle des deux sources indépendantes pour tout fait sensible. GéoWatch applique déjà ces cotes automatiquement sur les dépêches.</div>`);

    html += card('6. Donner du sens : techniques d’analyse structurée', 'diagram-project', '#c4b5fd',
      `<div style="font-size:.85rem;color:${T.dim}">Analyse des hypothèses concurrentes (ACH), vérification des hypothèses clés, avocat du diable. On externalise le raisonnement pour qu’il soit discutable, et on ne rejette pas trop vite l’hypothèse gênante.</div>
      <div style="margin-top:8px">${goBtn('ach','Ouvrir l’outil ACH','#c4b5fd')}</div>`);

    html += card('7. Produire : livrables et cadence', 'file-lines', T.blue,
      `<div style="font-size:.85rem;color:${T.dim}">Alerte flash (immédiat), bulletin hebdomadaire, note d’analyse, note prospective, fiches pays/acteurs. L’essentiel d’abord (BLUF), toujours sourcer et coter, afficher un niveau de confiance.</div>
      <div style="margin-top:8px">${goBtn('cadence','Voir la cadence et générer le bulletin',T.blue)}</div>`);

    html += card('8. Gouvernance', 'scale-balanced', T.green,
      `<ul style="margin:0;padding-left:18px;color:${T.dim};font-size:.85rem">
        <li>Révision de la matrice de pertinence chaque trimestre.</li>
        <li>Capitalisation : fiches pays/acteurs, archivage des alertes, journal des décisions.</li>
        <li>Contrôle qualité : relecture croisée, recoupement et cotation avant diffusion.</li>
      </ul>`);

    html += `<div style="font-size:.72rem;color:${T.faint};margin-top:4px">Document de référence complet : « SEMDE — Méthodologie de veille géopolitique » (Word, 18 p.). Cette page en est la version vivante intégrée à l’outil.</div>`;
    host.innerHTML = html;
  };

  /* ---------- PAGE : CADENCE / LIVRABLES ---------- */
  window.renderCadence = function(){
    const host = g('cadence-content'); if(!host) return;
    let html = '';
    html += banner('calendar-check', T.blue, 'Cadence & livrables',
      'À chaque besoin son format et son rythme. Cette page organise les livrables de la cellule et génère automatiquement le bulletin de veille de la semaine, classé par desk.',
      ['Quotidien : collecte + alertes flash.', 'Hebdomadaire : bulletin de veille.', 'Mensuel : revue des zones légères. Trimestriel : révision de la matrice.']);

    html += `<div class="card" style="margin-bottom:14px"><table style="border-collapse:collapse;width:100%;font-size:.8rem">
      <thead><tr>${['Rythme','Activité','Livrable','Aller à'].map(h=>`<th style="text-align:left;padding:7px 8px;color:${T.dim};border-bottom:2px solid ${T.border}">${h}</th>`).join('')}</tr></thead><tbody>
      ${cadenceRow('Quotidien','Collecte zones actives + alertes','Alerte flash · Brief quotidien','bqs','Brief quotidien')}
      ${cadenceRow('Hebdomadaire','Synthèse des faits marquants','Bulletin de veille','#bulletin','Générer le bulletin')}
      ${cadenceRow('À la demande','Sujet traité en profondeur','Note d’analyse / prospective','generator','Générateur de livrables')}
      ${cadenceRow('Mensuel','Revue des zones en veille légère','Revue ◯','matrice','Matrice')}
      ${cadenceRow('Trimestriel','Révision des priorités','Matrice révisée','matrice','Matrice (mode édition)')}
    </tbody></table></div>`;

    html += `<div class="card" id="bulletin"><div class="card-hd"><h2><i class="fa-solid fa-newspaper" style="color:${T.green}"></i> Bulletin de veille hebdomadaire (automatique)</h2></div>
      <div style="font-size:.82rem;color:${T.dim};margin-bottom:10px">Compile les dépêches des 7 derniers jours, classées par desk (zone × thématique), prêtes à relire et diffuser.</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
        <button class="btn primary sm" id="bul-gen"><i class="fa-solid fa-wand-magic-sparkles"></i> Générer le bulletin de la semaine</button>
        <button class="btn ghost sm" id="bul-copy"><i class="fa-solid fa-copy"></i> Copier le texte</button>
        <button class="btn ghost sm" id="bul-doc"><i class="fa-solid fa-file-word"></i> Exporter (.doc)</button>
      </div>
      <div id="cadence-bulletin" style="background:${T.bg};border:1px solid ${T.border};border-radius:8px;padding:14px;min-height:80px;color:${T.txt};font-size:.82rem">Clique « Générer » pour produire le bulletin de la semaine.</div>
    </div>`;
    host.innerHTML = html;

    host.querySelectorAll('[data-cad]').forEach(b=>{ b.onclick=()=>{ const tgt=b.dataset.cad; if(tgt.startsWith('#')){ const el=g(tgt.slice(1)); if(el) el.scrollIntoView({behavior:'smooth'}); } else Router.go(tgt); }; });
    g('bul-gen').onclick = ()=>{ g('cadence-bulletin').innerHTML = buildWeekly(); };
    g('bul-copy').onclick = ()=>{ const t=g('cadence-bulletin').innerText; try{ navigator.clipboard.writeText(t); if(window.toast) window.toast('Bulletin copié'); }catch(e){ alert('Copie impossible'); } };
    g('bul-doc').onclick = ()=>{ exportDoc(g('cadence-bulletin').innerHTML); };
  };

  function cadenceRow(rythme, act, liv, target, btn){
    return `<tr>
      <td style="padding:6px 8px;border-bottom:1px solid ${T.border};color:${T.txt};font-weight:600">${esc(rythme)}</td>
      <td style="padding:6px 8px;border-bottom:1px solid ${T.border};color:${T.dim}">${esc(act)}</td>
      <td style="padding:6px 8px;border-bottom:1px solid ${T.border};color:${T.dim}">${esc(liv)}</td>
      <td style="padding:6px 8px;border-bottom:1px solid ${T.border}"><button class="btn ghost sm" data-cad="${esc(target)}">${esc(btn)}</button></td>
    </tr>`;
  }

  function buildWeekly(){
    const cfg = loadDesks();
    const items = getItems();
    const now = Date.now();
    const week = items.filter(it=> it.pubDate && (now-new Date(it.pubDate))/86400000 <= 7);
    if(!week.length) return `<div style="color:${T.faint}">Aucune dépêche des 7 derniers jours en mémoire. Ouvre le Tableau de bord pour charger les flux RSS, puis reviens générer le bulletin.</div>`;
    const byDesk = {}; cfg.desks.forEach(d=>byDesk[d.id]=[]);
    week.forEach(it=>{ const r=routeItem(it,cfg); if(r.deskId&&byDesk[r.deskId]) byDesk[r.deskId].push({it, tag:r.tag}); });
    let h = `<div style="font-weight:800;font-size:1rem;color:${T.txt};margin-bottom:4px">Bulletin de veille hebdomadaire — ${new Date().toLocaleDateString('fr-FR')}</div>`;
    h += `<div style="color:${T.dim};margin-bottom:12px">Synthèse automatique de ${week.length} dépêches (7 derniers jours), classées par desk.</div>`;
    cfg.desks.forEach(d=>{
      const arr = byDesk[d.id].sort((a,b)=> new Date(b.it.pubDate)-new Date(a.it.pubDate)).slice(0,8);
      if(!arr.length) return;
      h += `<div style="font-weight:700;color:${d.transverse?T.purple:T.blue};margin:10px 0 4px">${esc(d.name)} — ${byDesk[d.id].length} sujet(s)</div><ul style="margin:0;padding-left:18px">`;
      arr.forEach(({it,tag})=>{
        const z = tag.pz?ZONE_BY[tag.pz].short.replace(/^\d+\.\s*/,''):'—';
        const code = tag.pt||'—';
        h += `<li style="margin-bottom:3px"><b style="color:${(THEME_BY[tag.pt]||{}).color||T.faint}">[${esc(z)} · ${esc(code)}]</b> ${esc(it.title||'')} <span style="color:${T.faint}">(${esc(srcName(it))})</span></li>`;
      });
      h += `</ul>`;
    });
    return h;
  }

  function exportDoc(innerHtml){
    const head = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Bulletin de veille</title></head><body style="font-family:Calibri,Arial,sans-serif">';
    const blob = new Blob(['﻿', head, innerHtml, '</body></html>'], {type:'application/msword'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='Bulletin_veille_hebdo.doc'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(()=>URL.revokeObjectURL(url), 1500);
  }

  function tbl(headers, rows){
    let h = `<table style="border-collapse:collapse;width:100%;font-size:.8rem"><thead><tr>`;
    headers.forEach(x=> h+=`<th style="text-align:left;padding:5px 8px;color:${T.dim};border-bottom:1px solid ${T.border}">${esc(x)}</th>`);
    h += `</tr></thead><tbody>`;
    rows.forEach(r=>{ h+=`<tr>`; r.forEach((c,i)=> h+=`<td style="padding:5px 8px;border-bottom:1px solid ${T.border};color:${i===0?T.txt:T.dim};${i===0?'font-weight:600;white-space:nowrap':''}">${esc(c)}</td>`); h+=`</tr>`; });
    return h+`</tbody></table>`;
  }

  /* ---------- PAGE : ÉTUDES & ANALYSES (produites par l'agent analyste) ---------- */
  window.renderEtudes = function(){
    const host = g('etudes-content'); if(!host) return;
    let head = banner('flask', T.purple, 'Études & Analyses (agent autonome)',
      'Productions de l’agent analyste : dynamiques détectées (tendances lourdes, signaux faibles, ruptures, recompositions), notes d’analyse par zone, notes prospectives et études thématiques. Rafraîchi automatiquement par le pipeline GéoWatch.',
      ['Mode structuré (gratuit) par défaut ; rédaction IA si une clé API est configurée.', 'Aucun fait inventé : tout s’appuie sur les dépêches collectées et cotées.', 'Cliquez « Rafraîchir » après un nouveau passage de l’agent.']);
    head += `<div style="margin-bottom:12px"><button class="btn ghost sm" id="et-refresh"><i class="fa-solid fa-rotate"></i> Rafraîchir</button></div><div id="etudes-body" style="color:${T.dim}">Chargement…</div>`;
    host.innerHTML = head;
    const refresh = ()=> g('et-refresh') && (g('et-refresh').onclick = loadEtudes);
    refresh();
    loadEtudes();
  };

  // Dossiers d'analyse RÉDIGÉS (par l'analyste) — fichier statique, non écrasé par l'agent auto.
  let DOSS_CACHE = null, DOSS_AT = 0;
  function dossiersFetch(cb){
    const now = Date.now();
    if (DOSS_CACHE && now - DOSS_AT < 90000) { cb(DOSS_CACHE); return; }
    fetch('data/generated/dossiers.json?t=' + now).then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { DOSS_CACHE = d; DOSS_AT = now; } cb(DOSS_CACHE); }).catch(() => cb(DOSS_CACHE));
  }
  function dossierHTML(d){
    const sec = (label, txt) => txt ? `<div style="margin:6px 0"><span style="font-weight:700;color:${T.txt}">${label} — </span><span style="font-size:.85rem;color:${T.dim}">${esc(txt)}</span></div>` : '';
    const listSec = (label, arr) => (arr && arr.length) ? `<div style="margin:6px 0"><div style="font-weight:700;color:${T.txt}">${label}</div><ul style="margin:2px 0;padding-left:18px;color:${T.dim};font-size:.82rem">${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : '';
    return `<div style="font-weight:800;color:${T.txt};font-size:.95rem">${esc(d.titre || d.name)}</div>`
      + `<div style="font-size:.66rem;color:${T.faint};margin-bottom:6px">${esc(d.name)} · confiance ${esc(d.confiance || '—')}</div>`
      + (d.enjeu ? `<div style="margin:6px 0;padding:6px 10px;background:rgba(245,158,11,.12);border-left:3px solid ${T.yellow};border-radius:0 6px 6px 0;font-size:.84rem;color:${T.txt}"><b>Enjeu central — </b>${esc(d.enjeu)}</div>` : '')
      + sec('Situation', d.situation) + sec('Causes', d.causes)
      + listSec('Acteurs (qui contre qui)', d.acteurs)
      + sec('Conséquences AES', d.consequencesAES)
      + listSec('Scénarios', d.scenarios) + listSec('À surveiller', d.surveiller)
      + ((d.sources && d.sources.length) ? `<div style="font-size:.68rem;color:${T.faint};margin-top:4px">Sources : ${esc(d.sources.join(' · '))}</div>` : '');
  }
  function loadEtudes(){
    const body = g('etudes-body'); if(!body) return;
    body.innerHTML = `<span style="color:${T.dim}">Chargement…</span>`;
    dossiersFetch(d => {
      let html = '';
      if (d) {
        if (d.syntheseExecutive) html += card('Synthèse exécutive (rédigée par l\'analyste)', 'bullseye', T.yellow, `<div style="font-size:.85rem;color:${T.txt};white-space:pre-line">${esc(d.syntheseExecutive)}</div>`);
        const arr = d.byConflict ? Object.values(d.byConflict) : [];
        if (arr.length) html += card('Dossiers d\'analyse de fond (rédigés)', 'fire', T.red, arr.map(x => `<div style="margin-bottom:16px;border-left:3px solid ${T.red};padding-left:10px">${dossierHTML(x)}</div>`).join(''));
      }
      fetch('data/generated/analysis-latest.json?t=' + Date.now()).then(r => r.ok ? r.json() : null).then(a => {
        if (a) html += `<div style="font-size:.7rem;color:${T.faint};margin:16px 0 6px;text-transform:uppercase;letter-spacing:.5px">Veille automatique (signaux live)</div>` + renderAnalysis(a);
        body.innerHTML = html || `<div class="card" style="color:${T.dim}"><b style="color:${T.txt}">Pas encore de contenu.</b><br>Les dossiers rédigés (<code>dossiers.json</code>) et/ou la veille auto (<code>analysis-latest.json</code>) apparaîtront ici.</div>`;
      }).catch(() => { body.innerHTML = html || `<div class="card" style="color:${T.dim}">Pas encore de contenu généré.</div>`; });
    });
  }

  function dirChip(d){
    const col = d==='hausse'?T.red : d==='baisse'?T.green : d==='nouveau'?T.purple : T.faint;
    return `<span style="font-size:.62rem;color:${col};border:1px solid ${col};border-radius:6px;padding:0 5px;margin-left:4px">${esc(d||'')}</span>`;
  }
  function faitsList(arr){
    return `<ul style="margin:4px 0;padding-left:18px;color:${T.dim};font-size:.78rem">${(arr||[]).map(f=>`<li><a href="${esc(f.lien||'#')}" target="_blank" rel="noopener" style="color:${T.txt};text-decoration:none">${esc(f.titre||'')}</a> <span style="color:${T.faint}">(${esc(f.source||'')}${f.cote?' · '+esc(f.cote):''})</span></li>`).join('')}</ul>`;
  }

  function renderAnalysis(a){
    let h = '';
    h += `<div style="font-size:.72rem;color:${T.faint};margin-bottom:10px">Généré le ${esc(a.generatedAt||'')} · ${a.stats?a.stats.analysed:'?'} articles · IA : ${a.llmUsed?esc(a.llmModel||'oui'):'non (mode structuré)'}</div>`;
    if(a.syntheseExecutive){ h += card('Synthèse exécutive', 'bullseye', T.yellow, `<div style="font-size:.85rem;color:${T.txt};white-space:pre-line">${esc(a.syntheseExecutive)}</div>`); }
    if(a.byConflict && Object.keys(a.byConflict).length){
      const arr = Object.values(a.byConflict).sort((x,y)=>y.volume-x.volume);
      h += card('Analyse par conflit', 'fire', T.red, arr.map(c=>`<div style="margin-bottom:14px;border-left:3px solid ${T.red};padding-left:10px"><div style="font-weight:700;color:${T.txt}">${esc(c.name)} <span style="font-size:.66rem;color:${T.faint}">${c.volume} signaux · confiance ${esc(c.confiance)}</span></div><div style="font-size:.82rem;color:${T.dim};white-space:pre-line;margin:4px 0">${esc(c.proseIA||c.lectureStructuree||'')}</div>${faitsList(c.faits)}</div>`).join(''));
    }
    const f = a.findings || {};
    let dyn = '';
    dyn += `<div style="font-weight:700;color:${T.txt};margin:6px 0 2px">Tendances lourdes</div><ul style="margin:0 0 8px;padding-left:18px;color:${T.dim};font-size:.8rem">${(f.tendancesLourdes||[]).map(t=>`<li>${esc(t.libelle)} — ${t.volume} signaux${dirChip(t.direction)}</li>`).join('')||'<li>—</li>'}</ul>`;
    dyn += `<div style="font-weight:700;color:${T.txt};margin:6px 0 2px">Signaux faibles</div><ul style="margin:0 0 8px;padding-left:18px;color:${T.dim};font-size:.8rem">${(f.signauxFaibles||[]).map(s=>`<li><b style="color:${T.txt}">${esc(s.zone)} · ${esc(s.thematique)}</b> — ${esc(s.exemple||'')}</li>`).join('')||'<li>—</li>'}</ul>`;
    dyn += `<div style="font-weight:700;color:${T.txt};margin:6px 0 2px">Ruptures</div><ul style="margin:0 0 8px;padding-left:18px;color:${T.dim};font-size:.8rem">${(f.ruptures||[]).map(r=> r.type==='evenement'?`<li>${esc(r.zone)} · ${esc(r.thematique)} — <a href="${esc(r.lien||'#')}" target="_blank" rel="noopener" style="color:${T.txt}">${esc(r.titre)}</a> <span style="color:${T.faint}">(${esc(r.source||'')}${r.cote?' · '+esc(r.cote):''})</span></li>`:`<li>Pic : ${esc(r.zone)} · ${esc(r.thematique)} (${r.volume} vs ${r.base} moy.)</li>`).join('')||'<li>—</li>'}</ul>`;
    dyn += `<div style="font-weight:700;color:${T.txt};margin:6px 0 2px">Recompositions / bascules</div><ul style="margin:0;padding-left:18px;color:${T.dim};font-size:.8rem">${(f.recompositions||[]).map(r=>`<li><b style="color:${T.txt}">${esc(r.axe)}</b> ${esc(r.cle)} : ${esc(r.partAnterieure)} → ${esc(r.partActuelle)} (${esc(r.sens)})</li>`).join('')||'<li>—</li>'}</ul>`;
    h += card('Dynamiques détectées', 'wave-square', T.blue, dyn);

    if((a.notesParZone||[]).length){
      h += card('Notes d’analyse par zone', 'file-lines', T.green, (a.notesParZone||[]).map(n=>`<div style="margin-bottom:10px"><div style="font-weight:700;color:${T.txt}">${esc(n.zone)} <span style="font-size:.66rem;color:${T.faint}">confiance ${esc(n.confiance)}</span></div><div style="font-size:.82rem;color:${T.dim};white-space:pre-line">${esc(n.proseIA||n.lectureStructuree||'')}</div>${faitsList(n.faits)}</div>`).join(''));
    }
    if((a.notesProspectives||[]).length){
      h += card('Notes prospectives', 'chess', '#c4b5fd', (a.notesProspectives||[]).map(n=>`<div style="margin-bottom:10px"><div style="font-weight:700;color:${T.txt}">${esc(n.zone)} <span style="font-size:.66rem;color:${T.faint}">confiance ${esc(n.confiance)}</span></div><div style="font-size:.82rem;color:${T.dim};white-space:pre-line">${esc(n.proseIA||n.hypothese||'')}</div><div style="font-size:.72rem;color:${T.faint};margin-top:3px">À surveiller : ${esc((n.signauxASurveiller||[]).join(' · '))}</div></div>`).join(''));
    }
    if((a.etudesThematiques||[]).length){
      h += card('Études thématiques', 'layer-group', T.orange, (a.etudesThematiques||[]).map(e=>`<div style="margin-bottom:10px"><div style="font-weight:700;color:${T.txt}">${esc(e.libelle)} (${esc(e.code)}) — ${e.volume} signaux${dirChip(e.direction)}</div>${e.proseIA?`<div style="font-size:.82rem;color:${T.dim};white-space:pre-line">${esc(e.proseIA)}</div>`:(e.lecture?`<div style="font-size:.82rem;color:${T.dim};white-space:pre-line">${esc(e.lecture)}</div>`:'')}<div style="font-size:.72rem;color:${T.faint};margin:3px 0">Acteurs/blocs : ${esc((e.blocs||[]).join(', '))} · Sources : ${esc((e.sources||[]).join(', '))}</div>${faitsList(e.faitsSaillants)}</div>`).join(''));
    }
    return h;
  }

  /* ---------- INJECTION : panneau « Analyse de l'agent (LIVE) » sur les pages existantes ----------
     Decouple : ne reecrit pas app.js. Un timer place/rafraichit un panneau en tete
     de la page active (pages analytiques + labo), lu depuis analysis-latest.json. */
  const AGENT_PAGES = {
    conflicts: 'conflicts', briefs: 'sel:brief-conflict', scenarios: 'sel:scen-conflict',
    impact_bf: 'sel:bf-conflict', indicators: 'synth', reconfig: 'synth', analyses: 'synth',
    ach: 'ach', actors: 'synth', timeline: 'synth', compare: 'synth', referentiels: 'synth'
  };
  let AG_CACHE = null, AG_AT = 0;
  function agentFetch(cb){
    const now = Date.now();
    if (AG_CACHE && now - AG_AT < 90000) { cb(AG_CACHE); return; }
    fetch('data/generated/analysis-latest.json?t=' + now).then(r => r.ok ? r.json() : null)
      .then(a => { if (a) { AG_CACHE = a; AG_AT = now; } cb(AG_CACHE); }).catch(() => cb(AG_CACHE));
  }
  function synthBody(a){
    let b = '';
    if (a.syntheseExecutive) b += `<div style="font-size:.82rem;color:${T.dim};white-space:pre-line;margin-bottom:6px">${esc(a.syntheseExecutive)}</div>`;
    const f = a.findings || {};
    const t = (f.tendancesLourdes || []).slice(0, 4).map(x => esc(x.libelle) + ' (' + esc(x.direction || '') + ')').join(' · ');
    if (t) b += `<div style="font-size:.72rem;color:${T.faint}">Tendances : ${t}</div>`;
    return b || `<div style="font-size:.78rem;color:${T.faint}">Analyse globale en cours de génération.</div>`;
  }
  function agentPanelHTML(page, a, sel, d){
    const m = AGENT_PAGES[page]; let body = '';
    if (m && m.indexOf('sel:') === 0){
      const dd = (d && d.byConflict && sel) ? d.byConflict[sel] : null;
      if (dd) body = dossierHTML(dd) + `<div style="font-size:.62rem;color:${T.faint};margin-top:4px">Dossier rédigé par l'analyste</div>`;
      else {
        const c = (sel && a.byConflict) ? a.byConflict[sel] : null;
        if (c) body = `<div style="font-weight:600;color:${T.txt}">${esc(c.name)} <span style="font-size:.66rem;color:${T.faint}">confiance ${esc(c.confiance)}</span></div><div style="font-size:.82rem;color:${T.dim};white-space:pre-line">${esc(c.proseIA || c.lectureStructuree || '')}</div>${faitsList(c.faits)}`;
        else body = synthBody(a) + `<div style="font-size:.72rem;color:${T.faint};margin-top:6px">Sélectionne un conflit ci-dessous pour l'analyse dédiée.</div>`;
      }
    } else if (page === 'conflicts'){
      const dl = (d && d.byConflict) ? Object.values(d.byConflict) : [];
      if (dl.length){
        body = dl.map(x => `<div style="margin-bottom:16px;border-left:3px solid ${T.red};padding-left:10px">${dossierHTML(x)}</div>`).join('');
      } else {
        const arr = a.byConflict ? Object.values(a.byConflict).sort((x, y) => y.volume - x.volume) : [];
        if (!arr.length) return '';
        body = arr.slice(0, 8).map(c => `<div style="margin-bottom:6px"><b style="color:${T.txt}">${esc(c.name)}</b> <span style="font-size:.62rem;color:${T.faint}">${c.volume} signaux · conf. ${esc(c.confiance)}</span><div style="font-size:.78rem;color:${T.dim}">${esc((c.proseIA || c.lectureStructuree || '').slice(0, 240))}</div></div>`).join('');
      }
    } else if (page === 'ach'){
      const s = a.achSuggestions || []; if (!s.length) return '';
      body = `<div style="font-size:.8rem;color:${T.dim};margin-bottom:6px">Hypothèses pré-remplies par l'agent (à reporter dans ta matrice ACH) :</div>` + s.map(x => `<div style="margin-bottom:8px"><b style="color:${T.txt}">${esc(x.name)}</b><ul style="margin:2px 0;padding-left:18px;color:${T.dim};font-size:.78rem">${x.hypotheses.map(h => `<li>${esc(h)}</li>`).join('')}</ul><div style="font-size:.66rem;color:${T.faint}">Indices : ${esc(x.evidence.slice(0, 3).join(' · '))}</div></div>`).join('');
    } else { body = synthBody(a); }
    if (!body) return '';
    return `<div class="card" style="border-left:4px solid ${T.purple};margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <i class="fa-solid fa-robot" style="color:${T.purple}"></i>
        <span style="font-weight:700;color:${T.txt}">Analyse de l'agent (LIVE)</span>
        <span style="font-size:.6rem;color:${T.faint};margin-left:auto">${esc(a.generatedAt || '')} · ${a.llmUsed ? 'IA' : 'structuré'}</span>
      </div>${body}</div>`;
  }
  function injectAgentPanel(){
    const sec = document.querySelector('.page.active'); if (!sec) return;
    const page = sec.dataset.page; if (!(page in AGENT_PAGES)) return;
    dossiersFetch(d => { agentFetch(a => {
      if (!a && !d) return;
      const m = AGENT_PAGES[page];
      let sel = '';
      if (m.indexOf('sel:') === 0){ const el = document.getElementById(m.split(':')[1]); sel = el ? el.value : ''; }
      const sig = page + '|' + sel + '|' + ((a && a.generatedAt) || '') + '|' + ((d && d.generatedAt) || '');
      let panel = sec.querySelector('#gw-agent-panel');
      if (panel && panel.dataset.sig === sig) return;
      const html = agentPanelHTML(page, a || {}, sel, d);
      if (!html){ if (panel) panel.remove(); return; }
      if (!panel){ panel = document.createElement('div'); panel.id = 'gw-agent-panel'; sec.insertBefore(panel, sec.firstChild); }
      panel.dataset.sig = sig; panel.innerHTML = html;
      // Sur la page Fiches conflits : masquer les fiches FIGÉES pour ne montrer que les dossiers frais.
      if (page === 'conflicts' && d && d.byConflict && Object.keys(d.byConflict).length){
        sec.querySelectorAll('.conflict-card').forEach(el => { el.style.display = 'none'; });
      }
    }); });
  }
  try { setInterval(injectAgentPanel, 1500); } catch (e) {}

  /* ---------- VERROU ADMINISTRATION (réservé à l'administrateur) ---------- */
  (function adminLock(){
    const ADMIN_HASH = '3853286131044cf68ad152010f89a959a17219d8dac4841816d2c6d8cb2474f5'; // empreinte SHA-256 du mot de passe administrateur
    const KEY = 'gw_admin_ok';
    const unlocked = () => localStorage.getItem(KEY) === '1';
    async function sha256(s){ const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join(''); }
    function tick(){
      try{
        const sec = document.querySelector('.page.active[data-page="admin"]');
        if (sec && !unlocked()){
          if (!document.getElementById('gw-admin-lock')){
            sec.innerHTML = `<div id="gw-admin-lock" class="card" style="max-width:440px;margin:48px auto;text-align:center;border:1px solid ${T.border}">
              <div style="font-size:1.7rem;color:${T.purple};margin-bottom:6px"><i class="fa-solid fa-lock"></i></div>
              <div style="font-weight:700;color:${T.txt};font-size:1.05rem">Administration réservée</div>
              <div style="color:${T.dim};font-size:.84rem;margin:6px 0 12px">Accès réservé à l'administrateur du site.</div>
              <input id="gw-admin-pw" type="password" placeholder="Mot de passe" style="width:88%;padding:9px 11px;border-radius:8px;border:1px solid ${T.border};background:${T.bg};color:${T.txt};font-size:.9rem">
              <div><button id="gw-admin-go" class="btn primary sm" style="margin-top:10px"><i class="fa-solid fa-unlock"></i> Déverrouiller</button></div>
              <div id="gw-admin-msg" style="color:#ef4444;font-size:.8rem;margin-top:8px;min-height:16px"></div>
            </div>`;
            const go = async () => {
              const pw = (document.getElementById('gw-admin-pw') || {}).value || '';
              const h = await sha256(pw);
              if (h === ADMIN_HASH){ localStorage.setItem(KEY, '1'); location.reload(); }
              else { const m = document.getElementById('gw-admin-msg'); if (m) m.textContent = 'Mot de passe incorrect.'; }
            };
            const btn = document.getElementById('gw-admin-go'); if (btn) btn.onclick = go;
            const inp = document.getElementById('gw-admin-pw'); if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
          }
        }
      }catch(e){}
    }
    try { setInterval(tick, 700); tick(); } catch(e){}
    window.gwAdminLock = () => { localStorage.removeItem(KEY); location.reload(); }; // re-verrouiller
  })();

  /* ---------- API publique ---------- */
  window.GW_METHODO = { THEMES, ZONES, COLS, relevance, tagItem, routeItem, loadDesks, RELEVANCE_ROWS };

})();
