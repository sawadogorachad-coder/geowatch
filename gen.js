/* ==========================================================================
   GéoWatch — GÉNÉRATEUR DE LIVRABLES
   Transforme la veille live en brouillons sourcés prêts à compléter, dans les
   formats CNES de Rachad : Note de situation, Brief décideur, Revue de presse.
   Garde-fou : aucun fait inventé. Chaque élément garde sa source et son lien.
   Dépend de : NEWS_STATE, DB. Expose window.renderGenerator + window.GW_GEN.
   ========================================================================== */
(function(){
  'use strict';
  const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const g = id => document.getElementById(id);

  // ---- Théâtres (alignés sur le portefeuille de l'utilisateur) ----
  const THEATRES = {
    all:          { label:'Tous les théâtres', conflicts:null, kw:null },
    sahel:        { label:'Sahel / AES', conflicts:['c_aes'], kw:/\b(sahel|burkina|ouagadougou|mali|bamako|niger|niamey|jnim|eigs|isgs|aes|wagner|africa corps|traor|go[iï]ta|tiani|liptako|cedeao|ecowas)\b/i },
    moyen_orient: { label:'Moyen-Orient', conflicts:['c_iran_il','c_gaza','c_yem','c_syr'], kw:/\b(iran|t[ée]h[ée]ran|isra[ëe]l|gaza|hamas|hezbollah|liban|syrie|y[ée]men|houthi|ormuz|mer rouge|nucl[ée]aire iranien|netanyahou|cisjordanie)\b/i },
    afrique_ouest:{ label:"Afrique de l'Ouest côtière", conflicts:[], kw:/\b(b[ée]nin|c[ôo]te d.?ivoire|ivoir|togo|ghana|s[ée]n[ée]gal|guin[ée]e|accra|abidjan|dakar|lom[ée]|cotonou|pendjari|como[ée]|littoralisation)\b/i },
    mondial:      { label:'Grands théâtres mondiaux', conflicts:['c_ukr','c_tai','c_sdn','c_cod','c_kor'], kw:/\b(ukrain|russie|poutine|moscou|ta[iï]wan|chine|p[ée]kin|soudan|darfour|rdc|congo|kinshasa|m23|cor[ée]e|pyongyang)\b/i }
  };

  const DIMENSIONS = [
    { key:'secu', label:'Situation sécuritaire', test:(t,it)=> (it._tags||[]).includes('military') || /attaqu|frappe|combat|jihad|terror|militaire|drone|embuscade|offensive|assaut|raid|bombard|missile|soldat|massacre|enl[èe]vement/i.test(t) },
    { key:'diplo', label:'Dynamiques diplomatiques', test:(t,it)=> (it._tags||[]).includes('diplomatic') || /sommet|accord|trait[ée]|sanction|ambassad|cedeao|ecowas|onu|union africaine|m[ée]diation|n[ée]gociation|coop[ée]ration|partenariat|visite officielle|r[ée]solution/i.test(t) },
    { key:'eco', label:'Enjeux économiques & ressources', test:(t,it)=> (it._tags||[]).includes('economic') || /\b(p[ée]trole|or\b|gold|aurif[èe]re|coton|fcfa|franc cfa|dette|inflation|commerce|corridor|mine|uranium|gaz|[ée]nergie|budget|march[ée])\b/i.test(t) },
    { key:'huma', label:'Situation humanitaire', test:(t,it)=> (it._tags||[]).includes('humanitarian') || /famine|d[ée]plac[ée]|r[ée]fugi[ée]|humanitaire|cholera|chol[ée]ra|[ée]pid[ée]mie|catastrophe|crise alimentaire|ipc|exode|victimes civiles/i.test(t) },
    { key:'socio', label:'Dynamiques sociopolitiques', test:(t,it)=> (it._tags||[]).includes('political') || /[ée]lection|manifestation|junte|putsch|coup d.?[ée]tat|transition|opposition|r[ée]f[ée]rendum|gouvernement|parlement|constitution|grève/i.test(t) }
  ];

  function activeItems(){ return (window.NEWS_STATE && NEWS_STATE.items) || []; }
  function withinHours(it, h){ const d=new Date(it.pubDate||0).getTime(); return d && (Date.now()-d) <= h*3600000; }

  function relevant(theatreKey, hours){
    const th = THEATRES[theatreKey] || THEATRES.all;
    return activeItems().filter(it=>{
      if(!withinHours(it, hours)) return false;
      if(theatreKey==='all') return true;
      const inConf = th.conflicts && th.conflicts.length && (it._conflicts||[]).some(c=>th.conflicts.includes(c.id||c));
      const inKw = th.kw && th.kw.test((it.title||'')+' '+(it.description||''));
      return inConf || inKw;
    });
  }

  // ---- Synthèses FACTUELLES (aucun jugement inventé : comptes, sources, thèmes) ----
  const THEME_FR = { military:'sécuritaire', diplomatic:'diplomatique', economic:'économique', humanitarian:'humanitaire', political:'sociopolitique' };
  function factualSynthesis(items){
    const n=items.length;
    const sources=new Set(items.map(it=>it._source).filter(Boolean));
    const tagCount={}; items.forEach(it=>(it._tags||[]).forEach(t=>tagCount[t]=(tagCount[t]||0)+1));
    const themes=Object.entries(tagCount).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([t,c])=>`${THEME_FR[t]||t} (${c})`);
    const majors=items.filter(it=>(it._majors||[]).length);
    const robust=items.filter(isRobust).length;
    const bf=items.filter(it=>it._bf).length;
    return { n, nSources:sources.size, themes, majors, robust, confirm:n-robust, bf };
  }
  function winLabel(hours){ return hours<48 ? hours+' heures' : Math.round(hours/24)+' jours'; }
  function periodPhrase(hours){ return hours<48 ? `les dernières ${hours} heures` : `les ${Math.round(hours/24)} derniers jours`; }
  function synthHtml(items, hours){
    const s=factualSynthesis(items);
    if(!s.n) return `<p class="chapeau">Aucun article collecté sur la période.</p>`;
    let t=`Sur <b>${periodPhrase(hours)}</b>, la veille a recensé <b>${s.n} articles</b> issus de <b>${s.nSources} sources</b> distinctes`;
    if(s.themes.length) t+=`, dominés par les axes ${s.themes.join(', ')}`;
    t+='. ';
    t+=`${s.robust} élément(s) reposent sur des sources fiables ou corroborées, ${s.confirm} restent à confirmer. `;
    if(s.majors.length) t+=`<b>${s.majors.length} signal/signaux de rupture</b> détecté(s), à vérifier en priorité. `;
    if(s.bf) t+=`${s.bf} élément(s) présentent une pertinence Burkina Faso / AES. `;
    t+=`<i>Synthèse factuelle automatique — l'appréciation analytique reste à votre main.</i>`;
    return `<p class="chapeau">${t}</p>`;
  }
  function dimLead(matched){
    if(!matched.length) return '';
    const srcs=new Set(matched.map(it=>it._source).filter(Boolean));
    const corro=matched.filter(isRobust).length;
    return `${matched.length} élément(s) recensé(s) sur ${srcs.size} source(s), dont ${corro} corroboré(s) ou de source fiable. `;
  }

  function ratingOf(it){ return it._rating || ''; }
  function scoreOf(it){
    if(typeof it._score==='number') return it._score;
    let s=0; if(it._bf)s+=20; if((it._majors||[]).length)s+=25; s+=Math.min((it._conflicts||[]).length*10,20);
    const ageH=(Date.now()-new Date(it.pubDate||0).getTime())/3600000; if(ageH<6)s+=10; else if(ageH<24)s+=5; return s;
  }
  function isRobust(it){ const r=ratingOf(it); return /^[AB]/.test(r) || /[12]$/.test(r) || (it._conflicts||[]).length>0; }
  function fmtDate(d){ try{ return new Date(d).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}); }catch(e){ return ''; } }
  function srcLine(it){ const r=ratingOf(it); return `${it._source||'source inconnue'}${r?` (${r})`:''} · ${fmtDate(it.pubDate)}`; }

  // ---------- Génération des 3 formats (renvoie {titre, html, texte}) ----------
  function header(theatre, sub){
    const now=new Date();
    const dl=now.toLocaleDateString('fr-FR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
    return { dateLong: dl.charAt(0).toUpperCase()+dl.slice(1), theatre, sub, now };
  }

  function genBriefDecideur(theatreKey, hours){
    const th=THEATRES[theatreKey]; const items=relevant(theatreKey,hours).sort((a,b)=>scoreOf(b)-scoreOf(a));
    const h=header(th.label,'Brief décideur');
    const top5=items.slice(0,5);
    const majors=items.filter(it=>(it._majors||[]).length).slice(0,5);
    const robustes=items.filter(isRobust).slice(0,6);
    const aConfirmer=items.filter(it=>!isRobust(it)).slice(0,4);
    const tags=new Set(items.flatMap(it=>it._tags||[]));

    let html=docHead('BRIEF DÉCIDEUR', h);
    html+=synthHtml(items, hours);
    html+=`<h2>Les points à retenir</h2>`;
    html+= top5.length? `<ol>`+top5.map(it=>`<li><b>${esc(it.title)}</b><br><span class="src">${esc(srcLine(it))}</span></li>`).join('')+`</ol>` : `<p class="empty">Aucun élément saillant sur la période.</p>`;
    html+=`<h2>Faits robustes (corroborés / sources fiables)</h2>`;
    html+= robustes.length? `<ul>`+robustes.map(it=>`<li>${esc(it.title)} <span class="src">— ${esc(srcLine(it))}</span></li>`).join('')+`</ul>` : `<p class="empty">—</p>`;
    html+=`<h2>À confirmer (source unique / non corroboré)</h2>`;
    html+= aConfirmer.length? `<ul>`+aConfirmer.map(it=>`<li>${esc(it.title)} <span class="src">— ${esc(srcLine(it))}</span></li>`).join('')+`</ul>` : `<p class="empty">—</p>`;
    html+=`<h2>Signaux d'alerte (24-72h)</h2>`;
    html+= majors.length? `<ul>`+majors.map(it=>`<li>${esc(it.title)} <span class="src">— ${esc(srcLine(it))}</span></li>`).join('')+`</ul>` : `<p class="empty">Aucun signal de rupture détecté.</p>`;
    html+=`<h2>Implications immédiates</h2>`;
    const axes=[...tags].map(t=>THEME_FR[t]||t);
    html+=`<p class="fill">${axes.length?`Les développements de la période relèvent principalement des registres ${esc(axes.join(', '))}. `:''}${majors.length?`Les signaux de rupture ci-dessus appellent une vérification sous 24-72h. `:''}<span class="todo">[Implications opérationnelles à apprécier par l'analyste]</span></p>`;
    html+=docFoot();
    return { titre:`Brief décideur — ${th.label}`, html, texte: htmlToText(html), count:items.length };
  }

  function genNoteSituation(theatreKey, hours){
    const th=THEATRES[theatreKey]; const items=relevant(theatreKey,hours);
    const h=header(th.label,'Note de situation');
    let html=docHead('NOTE DE SITUATION', h);
    html+=`<p class="chapeau"><b>Objet :</b> Situation ${esc(th.label)} — éléments factuels sourcés sur ${hours<48?hours+'h':Math.round(hours/24)+' jours'}. <i>Brouillon à compléter par l'analyse.</i></p>`;
    html+=synthHtml(items, hours);
    const used=new Set();
    DIMENSIONS.forEach((dim,i)=>{
      const matched=items.filter(it=>{ const t=((it.title||'')+' '+(it.description||'')).toLowerCase(); return dim.test(t,it); });
      matched.forEach(it=>used.add(it.link||it.title));
      html+=`<h2>${i+1}. ${dim.label}</h2>`;
      if(matched.length){
        html+=`<p class="lbl">Éléments factuels (sourcés) :</p><ul>`+matched.slice(0,8).map(it=>`<li>${esc(it.title)} <span class="src">— ${esc(srcLine(it))}</span></li>`).join('')+`</ul>`;
      } else { html+=`<p class="empty">Aucun élément collecté sur cette dimension.</p>`; }
      html+=`<p class="fill">${dimLead(matched)}<span class="todo">[Analyse — ${esc(dim.label.toLowerCase())}]</span></p>`;
    });
    const autres=items.filter(it=>!used.has(it.link||it.title));
    if(autres.length){
      html+=`<h2>${DIMENSIONS.length+1}. Autres signaux</h2><ul>`+autres.slice(0,6).map(it=>`<li>${esc(it.title)} <span class="src">— ${esc(srcLine(it))}</span></li>`).join('')+`</ul>`;
    }
    html+=`<h2>Appréciation générale & perspectives <span class="todo">[à rédiger]</span></h2><p class="fill">…</p>`;
    html+=docFoot();
    return { titre:`Note de situation — ${th.label}`, html, texte: htmlToText(html), count:items.length };
  }

  function genRevuePresse(theatreKey, hours){
    const th=THEATRES[theatreKey]; const items=relevant(theatreKey,hours).sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate));
    const h=header(th.label,'Revue de presse');
    // Groupement par conflit, sinon "Autres sujets"
    const groups={};
    items.forEach(it=>{ const c=(it._conflicts||[])[0]; const key=c?(c.short||c.name||c.id):'Autres sujets'; (groups[key]=groups[key]||[]).push(it); });
    const ordered=Object.entries(groups).sort((a,b)=>b[1].length-a[1].length);
    let html=docHead('REVUE DE PRESSE COMMENTÉE', h);
    html+=synthHtml(items, hours);
    if(!items.length) html+=`<p class="empty">Aucun article sur la période.</p>`;
    ordered.forEach(([grp,arts])=>{
      html+=`<h2>${esc(grp)} <span class="cnt">(${arts.length})</span></h2><ul>`;
      html+=arts.slice(0,10).map(it=>`<li><a href="${esc(it.link||'#')}">${esc(it.title)}</a> <span class="src">— ${esc(srcLine(it))}</span></li>`).join('');
      html+=`</ul><p class="fill"><span class="todo">[Commentaire analytique]</span> …</p>`;
    });
    html+=docFoot();
    return { titre:`Revue de presse — ${th.label}`, html, texte: htmlToText(html), count:items.length };
  }

  // ---------- Présentation document (style "papier") ----------
  function docHead(kind, h){
    return `<div class="doc">
      <div class="doc-band">
        <div class="doc-org">CNES · Veille géopolitique</div>
        <div class="doc-kind">${kind}</div>
      </div>
      <div class="doc-meta"><b>${esc(h.theatre)}</b> &nbsp;·&nbsp; ${esc(h.dateLong)}</div>`;
  }
  function docFoot(){
    return `<div class="doc-foot">Document de travail — sources ouvertes à recouper. Aucun fait inventé : chaque élément conserve sa source. Généré par GéoWatch.</div></div>`;
  }
  function htmlToText(html){
    let t=html
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi,'\n\n## $1\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi,'• $1\n')
      .replace(/<p[^>]*class="chapeau"[^>]*>(.*?)<\/p>/gi,'$1\n')
      .replace(/<br\s*\/?>(?!\n)/gi,' — ')
      .replace(/<[^>]+>/g,'')
      .replace(/\[à compléter par l'analyste\]|\[à rédiger\]/g,'[À COMPLÉTER]')
      .replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
      .replace(/[ \t]{2,}/g,' ')
      .replace(/\n{3,}/g,'\n\n').trim();
    return t;
  }

  // ---------- Export Word (.doc via Blob HTML) ----------
  function exportWord(doc){
    const style=`<style>body{font-family:Calibri,Arial,sans-serif;color:#111;line-height:1.45}h1{font-size:18pt;color:#1a3a6b}h2{font-size:13pt;color:#1a3a6b;border-bottom:1px solid #ccc;padding-bottom:2px;margin-top:16px}.src{color:#666;font-size:9pt}.todo{color:#b45309;font-weight:bold}.empty{color:#999;font-style:italic}.fill{color:#444}.doc-band{border-bottom:3px solid #1a3a6b;margin-bottom:8px}.doc-org{color:#1a3a6b;font-weight:bold}.doc-kind{font-size:16pt;font-weight:bold}.doc-meta{color:#444;margin-bottom:12px}.doc-foot{margin-top:20px;border-top:1px solid #ccc;padding-top:6px;color:#888;font-size:8pt;font-style:italic}.chapeau{background:#f3f4f6;padding:8px;border-left:3px solid #1a3a6b}.cnt{color:#888;font-weight:normal}</style>`;
    const full=`<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset='utf-8'>${style}</head><body>${doc.html}</body></html>`;
    const blob=new Blob(['﻿',full],{type:'application/msword'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
    a.download=(doc.titre.replace(/[^\w\sÀ-ÿ-]/g,'').replace(/\s+/g,'_'))+'.doc';
    document.body.appendChild(a); a.click(); a.remove();
    if(window.toast) toast('Document Word généré','success');
  }
  function printDoc(doc){
    const w=window.open('','_blank');
    if(!w){ if(window.toast) toast('Pop-up bloquée — autorise les pop-ups pour imprimer','error'); return; }
    const style=`<style>@media print{@page{margin:18mm}}body{font-family:Calibri,Arial,sans-serif;color:#111;line-height:1.45;max-width:780px;margin:auto;padding:20px}h2{color:#1a3a6b;border-bottom:1px solid #ccc;padding-bottom:2px;margin-top:16px;font-size:14pt}.src{color:#666;font-size:9pt}.todo{color:#b45309;font-weight:bold}.empty{color:#999;font-style:italic}.fill{color:#444}.doc-band{border-bottom:3px solid #1a3a6b;margin-bottom:8px}.doc-org{color:#1a3a6b;font-weight:bold}.doc-kind{font-size:16pt;font-weight:bold}.doc-meta{color:#444;margin-bottom:12px}.doc-foot{margin-top:20px;border-top:1px solid #ccc;padding-top:6px;color:#888;font-size:8pt}.chapeau{background:#f3f4f6;padding:8px;border-left:3px solid #1a3a6b}a{color:#1a3a6b}</style>`;
    w.document.write(`<html><head><meta charset='utf-8'><title>${esc(doc.titre)}</title>${style}</head><body>${doc.html}<script>window.onload=function(){setTimeout(function(){window.print();},300);}<\/script></body></html>`);
    w.document.close();
  }
  async function copyDoc(doc){
    try{ await navigator.clipboard.writeText(doc.texte); if(window.toast) toast('Texte copié','success'); }
    catch(e){ if(window.toast) toast('Copie impossible','error'); }
  }

  // ---------- État + rendu de la page ----------
  let GEN_STATE={ theatre:'all', format:'decideur', hours:24, current:null };
  const FORMATS={ decideur:{label:'Brief décideur', fn:genBriefDecideur}, note:{label:'Note de situation', fn:genNoteSituation}, revue:{label:'Revue de presse', fn:genRevuePresse} };

  function build(){
    const f=FORMATS[GEN_STATE.format]; GEN_STATE.current=f.fn(GEN_STATE.theatre, GEN_STATE.hours); return GEN_STATE.current;
  }

  window.renderGenerator=function(){
    const host=g('generator-content'); if(!host) return;
    const T={card:'#0c1426',border:'#1a2340',txt:'#e2e8f0',dim:'#94a3b8',faint:'#64748b',blue:'#60a5fa',green:'#22c55e'};
    const nItems=activeItems().length;

    let html=`<div style="background:linear-gradient(135deg,#1a3a6b22,${T.card});border:1px solid ${T.border};border-left:4px solid ${T.blue};border-radius:8px;padding:16px 18px;margin-bottom:16px">
      <div style="font-size:1.1rem;font-weight:700;color:${T.txt};margin-bottom:6px"><i class="fa-solid fa-file-pen" style="color:${T.blue}"></i> Générateur de livrables</div>
      <div style="font-size:.84rem;color:${T.dim};line-height:1.55">Transforme la veille live en <b>brouillon sourcé prêt à compléter</b> dans ton format CNES. Tu choisis le théâtre + le format → tu obtiens un document pré-rempli avec les faits et leurs sources, où il ne te reste qu'à <b>ajouter ton analyse</b> (les zones <span style="color:#f59e0b">[à compléter]</span>). <b>Aucun fait inventé.</b></div>
      <div style="font-size:.72rem;color:${T.faint};margin-top:8px">${nItems} articles disponibles dans la veille actuelle.</div>
    </div>`;

    // Contrôles
    const selStyle=`background:${T.card};color:${T.txt};border:1px solid ${T.border};border-radius:6px;padding:8px 11px;font-size:.84rem`;
    html+=`<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:16px;background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:14px">
      <label style="display:flex;flex-direction:column;gap:4px;font-size:.7rem;color:${T.faint};text-transform:uppercase;letter-spacing:.5px;font-weight:700">Théâtre
        <select id="gen-theatre" style="${selStyle}">${Object.entries(THEATRES).map(([k,v])=>`<option value="${k}"${GEN_STATE.theatre===k?' selected':''}>${v.label}</option>`).join('')}</select></label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:.7rem;color:${T.faint};text-transform:uppercase;letter-spacing:.5px;font-weight:700">Format
        <select id="gen-format" style="${selStyle}">${Object.entries(FORMATS).map(([k,v])=>`<option value="${k}"${GEN_STATE.format===k?' selected':''}>${v.label}</option>`).join('')}</select></label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:.7rem;color:${T.faint};text-transform:uppercase;letter-spacing:.5px;font-weight:700">Période
        <select id="gen-hours" style="${selStyle}">${[['24','24 h'],['48','48 h'],['168','7 jours']].map(([v,l])=>`<option value="${v}"${String(GEN_STATE.hours)===v?' selected':''}>${l}</option>`).join('')}</select></label>
      <button id="gen-go" class="btn primary" style="padding:9px 18px"><i class="fa-solid fa-wand-magic-sparkles"></i> Générer</button>
    </div>`;

    // Zone résultat
    html+=`<div id="gen-result"></div>`;
    host.innerHTML=html;

    g('gen-theatre').onchange=e=>GEN_STATE.theatre=e.target.value;
    g('gen-format').onchange=e=>GEN_STATE.format=e.target.value;
    g('gen-hours').onchange=e=>GEN_STATE.hours=parseInt(e.target.value,10);
    g('gen-go').onclick=()=>{
      if(!activeItems().length){ if(window.toast) toast('Veille pas encore chargée — patiente quelques secondes','info'); return; }
      const doc=build();
      const res=g('gen-result');
      res.innerHTML=`
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center">
          <span style="font-size:.78rem;color:${T.dim}"><b style="color:${T.txt}">${esc(doc.titre)}</b> · ${doc.count} article(s)</span>
          <span style="flex:1"></span>
          <button class="btn primary sm" id="gen-word"><i class="fa-solid fa-file-word"></i> Word</button>
          <button class="btn ghost sm" id="gen-print"><i class="fa-solid fa-print"></i> Imprimer / PDF</button>
          <button class="btn ghost sm" id="gen-copy"><i class="fa-solid fa-copy"></i> Copier</button>
        </div>
        <div class="gen-paper">${doc.html}</div>`;
      g('gen-word').onclick=()=>exportWord(doc);
      g('gen-print').onclick=()=>printDoc(doc);
      g('gen-copy').onclick=()=>copyDoc(doc);
      injectPaperStyle();
      res.scrollIntoView({behavior:'smooth',block:'start'});
    };
  };

  function injectPaperStyle(){
    if(g('gen-paper-style')) return;
    const s=document.createElement('style'); s.id='gen-paper-style';
    s.textContent=`
      .gen-paper{background:#f8fafc;color:#1e293b;border-radius:8px;padding:30px 34px;max-width:860px;line-height:1.55;box-shadow:0 4px 24px rgba(0,0,0,.3)}
      .gen-paper .doc-band{display:flex;justify-content:space-between;align-items:baseline;border-bottom:3px solid #1a3a6b;padding-bottom:6px;margin-bottom:8px}
      .gen-paper .doc-org{color:#1a3a6b;font-weight:700;font-size:.8rem;letter-spacing:.5px}
      .gen-paper .doc-kind{color:#0f172a;font-weight:800;font-size:1.2rem;letter-spacing:1px}
      .gen-paper .doc-meta{color:#475569;margin-bottom:14px;font-size:.92rem}
      .gen-paper h2{color:#1a3a6b;font-size:1.02rem;border-bottom:1px solid #e2e8f0;padding-bottom:3px;margin:18px 0 8px}
      .gen-paper ul,.gen-paper ol{margin:6px 0 6px 4px;padding-left:20px}
      .gen-paper li{margin-bottom:5px}
      .gen-paper .src{color:#64748b;font-size:.8rem}
      .gen-paper .todo{color:#b45309;font-weight:700;font-size:.85rem}
      .gen-paper .empty{color:#94a3b8;font-style:italic}
      .gen-paper .fill{color:#475569;min-height:1.2em;border-left:2px dashed #cbd5e1;padding-left:10px;margin:4px 0 10px}
      .gen-paper .chapeau{background:#eef2f7;padding:10px 12px;border-left:3px solid #1a3a6b;border-radius:4px;margin-bottom:6px}
      .gen-paper .cnt{color:#94a3b8;font-weight:400}
      .gen-paper a{color:#1a3a6b;text-decoration:none}
      .gen-paper .doc-foot{margin-top:22px;border-top:1px solid #e2e8f0;padding-top:8px;color:#94a3b8;font-size:.72rem;font-style:italic}`;
    document.head.appendChild(s);
  }

  window.GW_GEN={ build, genBriefDecideur, genNoteSituation, genRevuePresse, exportWord, THEATRES, relevant, factualSynthesis };
})();
