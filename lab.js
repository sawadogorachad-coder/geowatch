/* ==========================================================================
   GéoWatch — LAB : Laboratoire de l'analyste (features 5 à 11)
   Module autonome. Dépend de : DB, getDerivedAlertsFromNews, GW_DEPTH (optionnel),
   Chart (Chart.js), window.jspdf, NEWS_STATE.
   Expose des fonctions globales appelées par le Router :
   renderTimeline, renderCompare, renderACH, renderReferentiels, renderActorsGraph
   + GW_LAB.exportNoteExpress(), GW_LAB.startKiosk()
   ========================================================================== */
(function(){
  'use strict';

  const T = { bg:'#0a0f1c', card:'#0c1426', border:'#1a2340', txt:'#e2e8f0', dim:'#94a3b8', faint:'#64748b',
              blue:'#60a5fa', green:'#22c55e', orange:'#f97316', red:'#ef4444', yellow:'#fde047', purple:'#a855f7' };
  const g = id => document.getElementById(id);
  const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const sevColor = s => s>=8?T.red : s>=6?T.orange : s>=4?T.yellow : T.green;

  function getConflicts(){ try{ return DB.get().conflicts||[]; }catch(e){ return []; } }
  function getCountries(){ try{ return DB.get().countries||[]; }catch(e){ return []; } }

  /* ====================================================================
     FEATURE 9 — RÉFÉRENTIELS MÉTHODOLOGIQUES (multi-théâtres)
     ==================================================================== */
  const REFERENTIELS = {
    sahel: {
      label:'Sahel / AES', icon:'fa-fire', color:'#f97316',
      focus:'Triple frontière Liptako-Gourma, transitions militaires, compétition d\'influence (Russie/Turquie/Occident), littoralisation du conflit.',
      watch:[
        'La gouvernance jihadiste (JNIM/EIGS) progresse-t-elle par la coercition ou par l\'arbitrage social local ?',
        'Quels signaux de littoralisation vers les pays côtiers (Bénin, Côte d\'Ivoire, Togo, Ghana) ?',
        'Quelle soutenabilité du modèle Wagner/Africa Corps (paiement en or, concessions minières) ?',
        'Le projet de monnaie AES franchit-il des étapes concrètes ou reste-t-il déclaratoire ?'
      ],
      judgments:[
        'La crise sahélienne n\'est pas qu\'un problème sécuritaire : c\'est un changement de système régional (sortie CEDEAO, pivot Russie).',
        'Toute solution purement militaire est vouée à l\'échec sans réintégration politique des marges rurales.',
        'Les exactions des forces régulières et supplétives nourrissent le recrutement jihadiste autant qu\'elles le répriment.'
      ],
      indicators:['Attaques en zone côtière nord (Pendjari, Comoé)','Rotations Africa Corps et livraisons d\'armement','Évolution du cours de l\'or et captation des filières','Déclarations sur la monnaie AES','Pression sur corridors portuaires (Lomé, Cotonou, Abidjan)'],
      sources:['ISS Africa','ACLED','WATHI','Le Grand Continent','RFI Afrique','Sahel sources locales (Lefaso, Maliweb, Niger24)']
    },
    moyenorient: {
      label:'Moyen-Orient', icon:'fa-mosque', color:'#ef4444',
      focus:'Dissuasion Iran-Israël, axe de la résistance, sécurité énergétique (Ormuz, mer Rouge), accès humanitaire à Gaza.',
      watch:[
        'Le conflit se diffuse-t-il horizontalement (Liban, Yémen, Irak) ou reste-t-il contenu ?',
        'Quels changements touchent l\'accès humanitaire et la capacité hospitalière ?',
        'Quels signaux de dissuasion entre Iran, Israël et partenaires occidentaux deviennent structurants ?',
        'Quelles décisions diplomatiques ont un effet concret vs déclaratoire ?'
      ],
      judgments:[
        'Séparer trois niveaux de lecture : humanitaire, militaire et diplomatique, sans les confondre.',
        'Les sources fiables n\'éclairent chacune qu\'une tranche du conflit — croiser par fonction, pas par prestige.',
        'Le risque régional se mesure aussi par la dissuasion et les routes énergétiques, pas seulement par les combats.'
      ],
      indicators:['Accès corridors humanitaires Gaza','Frappes et interceptions transfrontalières','Trafic maritime mer Rouge / Ormuz et primes d\'assurance','Posture AIEA sur le nucléaire iranien','Positions du Conseil de sécurité'],
      sources:['OCHA oPt','AIEA','ICRC','UN Press Middle East','ACLED Middle East','Al Jazeera','Times of Israel']
    },
    ukraine: {
      label:'Ukraine / Russie', icon:'fa-shield-halved', color:'#3b82f6',
      focus:'Guerre d\'usure, soutien occidental fluctuant, économie de guerre russe, frappes sur l\'énergie, dimension nucléaire.',
      watch:[
        'L\'érosion des stocks de défense occidentaux et la fatigue budgétaire changent-elles le rapport de forces ?',
        'Quels signaux de négociation indirecte ou de lignes rouges nucléaires ?',
        'La soutenabilité de l\'économie de guerre russe (inflation, taux, main-d\'œuvre) ?',
        'Quels corridors logistiques critiques (mer Noire, Baltique) sont sous tension ?'
      ],
      judgments:[
        'La trajectoire dépend autant des décisions politiques occidentales que de la situation sur le front.',
        'Les incidents à faible intensité peuvent annoncer des bascules stratégiques plus larges.',
        'La dimension africaine (céréales, Wagner) relie ce théâtre au Sahel.'
      ],
      indicators:['Volume et nature de l\'aide militaire (ATACMS, financement UE)','Frappes sur infrastructures énergétiques','Indicateurs macro russes (inflation, taux directeur)','Activité mer Noire et exportations céréalières','Langage d\'escalade nucléaire'],
      sources:['ISW','RUSI','Chatham House','Le Grand Continent','IFRI Russie/NEI','Kyiv Independent']
    },
    asiepac: {
      label:'Asie-Pacifique', icon:'fa-dragon', color:'#a855f7',
      focus:'Détroit de Taïwan, mer de Chine méridionale, semi-conducteurs, alliances émergentes (AUKUS, Quad), axe Chine-Russie-Corée du Nord.',
      watch:[
        'Quelles vulnérabilités des chaînes de valeur technologiques (TSMC, semi-conducteurs) ?',
        'L\'activité militaire autour des points de friction insulaires change-t-elle de nature ?',
        'Quelle densification des partenariats de sécurité dans la zone ?',
        'Quels signaux d\'incidents « zone grise » sous le seuil du conflit ouvert ?'
      ],
      judgments:[
        'La dissuasion tient, mais les incidents gris (garde-côtes, cyber, ballons) restent probables.',
        'La compétition technologique est le cœur stratégique, plus que la confrontation militaire directe.',
        'Toute crise sur Taïwan aurait un effet systémique mondial immédiat (semi-conducteurs).'
      ],
      indicators:['Incursions PLA dans l\'ADIZ taïwanaise','Restrictions export semi-conducteurs','Exercices conjoints et nouveaux accords de sécurité','Activité en mer de Chine méridionale','Coopération militaire Chine-Russie-RPDC'],
      sources:['CSIS','IISS','RAND','Nikkei Asia','SCMP','Lowy Institute']
    }
  };

  window.renderReferentiels = function(){
    const host = g('referentiels-content'); if(!host) return;
    const keys = Object.keys(REFERENTIELS);
    let html = `<div style="background:${T.card};border:1px solid ${T.border};border-left:4px solid ${T.blue};border-radius:8px;padding:16px 18px;margin-bottom:16px">
      <div style="font-size:1.05rem;font-weight:700;color:${T.txt};margin-bottom:6px"><i class="fa-solid fa-compass-drafting" style="color:${T.blue}"></i> Référentiels de veille par théâtre</div>
      <div style="font-size:.84rem;color:${T.dim};line-height:1.55">Pour chaque grand théâtre : les <b>questions de veille</b>, les <b>jugements structurants</b>, les <b>indicateurs prioritaires</b> et les <b>sources de référence</b>. C'est ta grille de lecture méthodologique — à garder ouverte quand tu rédiges une note.</div>
    </div>`;
    html += `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">` +
      keys.map((k,i)=>`<button class="lab-ref-tab" data-ref="${k}" style="background:${i===0?REFERENTIELS[k].color:'transparent'};color:${i===0?'#0a0f1c':REFERENTIELS[k].color};border:1px solid ${REFERENTIELS[k].color};border-radius:16px;padding:7px 14px;font-size:.8rem;font-weight:700;cursor:pointer"><i class="fa-solid ${REFERENTIELS[k].icon}"></i> ${REFERENTIELS[k].label}</button>`).join('') +
      `</div><div id="lab-ref-body"></div>`;
    host.innerHTML = html;
    const renderBody = (k)=>{
      const r = REFERENTIELS[k];
      const block = (title,icon,items,color)=>`<div style="background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:14px 16px;margin-bottom:12px">
        <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:1px;font-weight:800;color:${color};margin-bottom:9px"><i class="fa-solid ${icon}"></i> ${title}</div>
        <ul style="margin:0;padding-left:18px;color:${T.txt};font-size:.85rem;line-height:1.7">${items.map(x=>`<li style="margin-bottom:4px">${esc(x)}</li>`).join('')}</ul></div>`;
      g('lab-ref-body').innerHTML =
        `<div style="background:linear-gradient(135deg,${r.color}18 0%,${T.card} 100%);border:1px solid ${r.color}55;border-left:4px solid ${r.color};border-radius:8px;padding:14px 16px;margin-bottom:14px"><div style="font-size:1.1rem;font-weight:700;color:${T.txt};margin-bottom:5px"><i class="fa-solid ${r.icon}" style="color:${r.color}"></i> ${r.label}</div><div style="font-size:.84rem;color:${T.dim};line-height:1.5">${esc(r.focus)}</div></div>` +
        block('Questions de veille','fa-circle-question',r.watch,T.blue) +
        block('Jugements structurants','fa-scale-balanced',r.judgments,T.purple) +
        block('Indicateurs prioritaires','fa-binoculars',r.indicators,T.orange) +
        `<div style="background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:14px 16px"><div style="font-size:.7rem;text-transform:uppercase;letter-spacing:1px;font-weight:800;color:${T.green};margin-bottom:9px"><i class="fa-solid fa-book-bookmark"></i> Sources de référence</div><div style="display:flex;gap:6px;flex-wrap:wrap">${r.sources.map(s=>`<span style="background:rgba(34,197,94,.12);color:#86efac;border:1px solid rgba(34,197,94,.3);border-radius:12px;padding:4px 10px;font-size:.74rem">${esc(s)}</span>`).join('')}</div></div>`;
    };
    renderBody(keys[0]);
    host.querySelectorAll('.lab-ref-tab').forEach(btn=>{
      btn.onclick = ()=>{
        host.querySelectorAll('.lab-ref-tab').forEach(b=>{ const k=b.dataset.ref; b.style.background='transparent'; b.style.color=REFERENTIELS[k].color; });
        const k=btn.dataset.ref; btn.style.background=REFERENTIELS[k].color; btn.style.color='#0a0f1c';
        renderBody(k);
      };
    });
  };

  /* ====================================================================
     FEATURE 5 — TIMELINE PAR CONFLIT
     ==================================================================== */
  let TL_CONFLICT = null;
  window.renderTimeline = function(){
    const host = g('timeline-content'); if(!host) return;
    const conflicts = getConflicts();
    if(!conflicts.length){ host.innerHTML = `<div style="color:${T.dim};padding:20px">Aucun conflit chargé.</div>`; return; }
    if(!TL_CONFLICT || !conflicts.find(c=>c.id===TL_CONFLICT)) TL_CONFLICT = conflicts[0].id;
    const c = conflicts.find(x=>x.id===TL_CONFLICT);

    // Événements historiques (chronologie) + événements RSS récents si dispo
    const hist = (c.chronologie||[]).map(e=>({date:e.d, label:e.e, sev:e.sev||4, rupture:!!e.rupture, note:e.note, src:'historique'}));
    let rss = [];
    try {
      if(window.GW_DEPTH && GW_DEPTH.getConflictArticles){
        rss = (GW_DEPTH.getConflictArticles(c.id, 30)||[]).slice(0,12).map(a=>({
          date:(a.pubDate||'').slice(0,10), label:a.title, sev:(a._majors&&a._majors.length)?7:4, rupture:false, src:a._source||'RSS', link:a.link
        }));
      }
    } catch(e){}
    const all = [...hist, ...rss].filter(e=>e.date).sort((a,b)=>new Date(b.date)-new Date(a.date));

    const sel = `<select id="tl-select" style="background:${T.card};color:${T.txt};border:1px solid ${T.border};border-radius:6px;padding:8px 12px;font-size:.85rem;min-width:260px">${conflicts.map(x=>`<option value="${x.id}"${x.id===TL_CONFLICT?' selected':''}>${esc(x.name)}</option>`).join('')}</select>`;

    let html = `<div style="background:${T.card};border:1px solid ${T.border};border-left:4px solid ${T.blue};border-radius:8px;padding:16px 18px;margin-bottom:16px">
      <div style="font-size:1.05rem;font-weight:700;color:${T.txt};margin-bottom:6px"><i class="fa-solid fa-timeline" style="color:${T.blue}"></i> Frise chronologique du conflit</div>
      <div style="font-size:.84rem;color:${T.dim};line-height:1.55;margin-bottom:12px">Électrocardiogramme géopolitique : les ruptures historiques (pastilles colorées par sévérité) fusionnées avec les dépêches RSS récentes. Les <b style="color:${T.red}">ruptures majeures</b> sont marquées d'un éclair.</div>
      ${sel}
    </div>`;

    // Mini-résumé du conflit
    html += `<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px">
      <div style="background:${T.card};border:1px solid ${T.border};border-radius:6px;padding:9px 13px;font-size:.78rem;color:${T.dim}">Intensité <b style="color:${sevColor(c.intensity||5)};font-size:1.1rem">${c.intensity||'?'}/10</b></div>
      <div style="background:${T.card};border:1px solid ${T.border};border-radius:6px;padding:9px 13px;font-size:.78rem;color:${T.dim}">Depuis <b style="color:${T.txt};font-size:1.1rem">${c.start_year||'?'}</b></div>
      <div style="background:${T.card};border:1px solid ${T.border};border-radius:6px;padding:9px 13px;font-size:.78rem;color:${T.dim}">Événements <b style="color:${T.txt};font-size:1.1rem">${all.length}</b></div>
      <div style="background:${T.card};border:1px solid ${T.border};border-radius:6px;padding:9px 13px;font-size:.78rem;color:${T.dim}">Ruptures <b style="color:${T.red};font-size:1.1rem">${all.filter(e=>e.rupture).length}</b></div>
    </div>`;

    if(!all.length){ html += `<div style="color:${T.dim};padding:20px">Aucun événement chronologique pour ce conflit.</div>`; host.innerHTML=html; bindTL(); return; }

    // Frise verticale
    html += `<div style="position:relative;padding-left:34px">
      <div style="position:absolute;left:11px;top:6px;bottom:6px;width:2px;background:linear-gradient(${T.border},${T.faint})"></div>`;
    html += all.map(e=>{
      const col = e.rupture ? T.red : sevColor(e.sev);
      const dotIcon = e.rupture ? `<i class="fa-solid fa-bolt" style="font-size:.6rem;color:#fff"></i>` : '';
      const yr = (e.date||'').slice(0,4);
      const dateFmt = (()=>{ try{ return new Date(e.date).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'});}catch(x){return e.date;} })();
      return `<div style="position:relative;margin-bottom:14px">
        <div style="position:absolute;left:-34px;top:2px;width:24px;height:24px;border-radius:50%;background:${col};display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 4px ${T.bg}">${dotIcon}</div>
        <div style="background:${T.card};border:1px solid ${T.border};border-left:3px solid ${col};border-radius:6px;padding:10px 14px">
          <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:3px">
            <span style="font-size:.72rem;color:${T.faint};font-weight:700">${dateFmt}</span>
            <span style="display:flex;gap:6px;align-items:center">
              ${e.rupture?`<span style="background:rgba(239,68,68,.15);color:#fca5a5;border:1px solid rgba(239,68,68,.4);border-radius:10px;padding:1px 8px;font-size:.62rem;font-weight:700">RUPTURE</span>`:''}
              <span style="color:${col};font-size:.66rem;font-weight:700">sév. ${e.sev}/10</span>
            </span>
          </div>
          <div style="font-size:.9rem;color:${T.txt};font-weight:600;line-height:1.4">${e.link?`<a href="${e.link}" target="_blank" rel="noopener" style="color:${T.txt}">${esc(e.label)} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:.65rem;color:${T.blue}"></i></a>`:esc(e.label)}</div>
          ${e.note?`<div style="font-size:.76rem;color:${T.dim};margin-top:4px;font-style:italic">${esc(e.note)}</div>`:''}
          <div style="font-size:.66rem;color:${T.faint};margin-top:4px">${e.src==='historique'?'<i class="fa-solid fa-landmark"></i> Repère historique':`<i class="fa-solid fa-broadcast-tower" style="color:#86efac"></i> ${esc(e.src)}`}</div>
        </div>
      </div>`;
    }).join('');
    html += `</div>`;
    host.innerHTML = html;
    bindTL();

    function bindTL(){
      const s = g('tl-select');
      if(s) s.onchange = ()=>{ TL_CONFLICT = s.value; window.renderTimeline(); };
    }
  };

  /* ====================================================================
     FEATURE 8 — COMPARATEUR DE PAYS
     ==================================================================== */
  let CMP_SEL = [];
  let CMP_CHART = null;
  const DIMS = [
    {k:'fsi', label:'Fragilité globale'},
    {k:'gov', label:'Gouvernance'},
    {k:'sec', label:'Sécurité'},
    {k:'eco', label:'Économie'},
    {k:'soc', label:'Société'}
  ];
  window.renderCompare = function(){
    const host = g('compare-content'); if(!host) return;
    const countries = getCountries();
    if(!countries.length){ host.innerHTML=`<div style="color:${T.dim};padding:20px">Aucun pays chargé.</div>`; return; }
    if(!CMP_SEL.length) CMP_SEL = countries.slice(0,3).map(c=>c.code);

    let html = `<div style="background:${T.card};border:1px solid ${T.border};border-left:4px solid ${T.blue};border-radius:8px;padding:16px 18px;margin-bottom:16px">
      <div style="font-size:1.05rem;font-weight:700;color:${T.txt};margin-bottom:6px"><i class="fa-solid fa-scale-unbalanced" style="color:${T.blue}"></i> Comparateur de pays</div>
      <div style="font-size:.84rem;color:${T.dim};line-height:1.55">Compare 2 à 4 pays côte à côte sur 5 dimensions de fragilité (échelle 0 = stable → 10 = critique, inspirée du <i>Fragile States Index</i>). Idéal pour une note comparative.</div>
    </div>`;

    // Sélecteurs de pays (chips toggle)
    html += `<div style="background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:12px 14px;margin-bottom:16px">
      <div style="font-size:.68rem;text-transform:uppercase;letter-spacing:.6px;color:${T.faint};font-weight:700;margin-bottom:8px">Sélectionne 2 à 4 pays (${CMP_SEL.length} sélectionné${CMP_SEL.length>1?'s':''})</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">`;
    countries.forEach(c=>{
      const on = CMP_SEL.includes(c.code);
      html += `<button class="lab-cmp-chip" data-code="${c.code}" style="background:${on?T.blue:'transparent'};color:${on?'#0a0f1c':T.dim};border:1px solid ${on?T.blue:T.border};border-radius:14px;padding:5px 11px;font-size:.74rem;font-weight:${on?'700':'400'};cursor:pointer">${esc(c.name)}</button>`;
    });
    html += `</div></div>`;

    const sel = CMP_SEL.map(code=>countries.find(c=>c.code===code)).filter(Boolean);

    if(sel.length<2){ html += `<div style="color:${T.yellow};padding:20px;text-align:center"><i class="fa-solid fa-triangle-exclamation"></i> Sélectionne au moins 2 pays pour comparer.</div>`; host.innerHTML=html; bindCmp(); return; }

    // Radar chart
    html += `<div style="background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:16px;margin-bottom:16px"><div style="max-width:480px;margin:auto"><canvas id="cmp-radar" height="300"></canvas></div></div>`;

    // Tableau comparatif
    html += `<div style="background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:4px;overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.82rem">
      <thead><tr><th style="text-align:left;padding:10px;color:${T.faint};font-size:.7rem;text-transform:uppercase;border-bottom:1px solid ${T.border}">Dimension</th>${sel.map(c=>`<th style="padding:10px;color:${T.txt};border-bottom:1px solid ${T.border};text-align:center">${esc(c.name)}</th>`).join('')}</tr></thead><tbody>`;
    DIMS.forEach(dim=>{
      html += `<tr><td style="padding:9px 10px;color:${T.dim};border-bottom:1px solid ${T.border}">${dim.label}</td>`;
      sel.forEach(c=>{
        const v = c[dim.k]||0; const col = sevColor(v);
        html += `<td style="padding:9px 10px;border-bottom:1px solid ${T.border}"><div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:7px;background:${T.bg};border-radius:4px;overflow:hidden"><div style="width:${v*10}%;height:100%;background:${col}"></div></div><b style="color:${col};min-width:26px;text-align:right">${v}</b></div></td>`;
      });
      html += `</tr>`;
    });
    html += `<tr><td style="padding:9px 10px;color:${T.dim};border-bottom:1px solid ${T.border}">Région</td>${sel.map(c=>`<td style="padding:9px 10px;border-bottom:1px solid ${T.border};text-align:center;color:${T.txt}">${esc(c.region||'—')}</td>`).join('')}</tr>`;
    html += `<tr><td style="padding:9px 10px;color:${T.dim};vertical-align:top">Note</td>${sel.map(c=>`<td style="padding:9px 10px;color:${T.dim};font-size:.76rem;line-height:1.5;vertical-align:top">${esc(c.note||'—')}</td>`).join('')}</tr>`;
    html += `</tbody></table></div>`;
    html += `<div style="font-size:.72rem;color:${T.faint};margin-top:10px;line-height:1.5"><i class="fa-solid fa-circle-info"></i> Échelle 0-10 : plus le score est élevé, plus la dimension est <b style="color:${T.red}">critique/fragile</b>. fsi = indice composite de fragilité.</div>`;

    host.innerHTML = html;
    bindCmp();
    drawRadar(sel);

    function drawRadar(sel){
      const cv = g('cmp-radar'); if(!cv || typeof Chart==='undefined') return;
      if(CMP_CHART){ try{CMP_CHART.destroy();}catch(e){} CMP_CHART=null; }
      const palette = [T.blue,T.red,T.yellow,T.green];
      CMP_CHART = new Chart(cv.getContext('2d'), {
        type:'radar',
        data:{ labels:DIMS.map(d=>d.label), datasets: sel.map((c,i)=>({
          label:c.name, data:DIMS.map(d=>c[d.k]||0),
          backgroundColor:palette[i%4]+'33', borderColor:palette[i%4], borderWidth:2, pointBackgroundColor:palette[i%4]
        })) },
        options:{ responsive:true, plugins:{ legend:{ labels:{ color:T.txt, font:{size:11} } } },
          scales:{ r:{ min:0, max:10, ticks:{ stepSize:2, color:T.faint, backdropColor:'transparent' }, grid:{color:T.border}, angleLines:{color:T.border}, pointLabels:{ color:T.dim, font:{size:10} } } } }
      });
    }
    function bindCmp(){
      host.querySelectorAll('.lab-cmp-chip').forEach(b=>{
        b.onclick = ()=>{
          const code=b.dataset.code;
          if(CMP_SEL.includes(code)) CMP_SEL = CMP_SEL.filter(x=>x!==code);
          else { if(CMP_SEL.length>=4){ toast && toast('Maximum 4 pays','info'); return; } CMP_SEL.push(code); }
          window.renderCompare();
        };
      });
    }
  };

  /* ====================================================================
     FEATURE 7 — MÉTHODE ACH (Analyse des Hypothèses Concurrentes)
     ==================================================================== */
  const ACH_KEY = 'gw_ach_analyses';
  const ACH_RATINGS = [
    {v:2, sym:'++', label:'Très cohérent', color:T.green},
    {v:1, sym:'+', label:'Cohérent', color:'#86efac'},
    {v:0, sym:'0', label:'Neutre', color:T.faint},
    {v:-1, sym:'–', label:'Incohérent', color:'#fca5a5'},
    {v:-2, sym:'– –', label:'Très incohérent', color:T.red}
  ];
  const achLoad = ()=>{ try{ return JSON.parse(localStorage.getItem(ACH_KEY))||[]; }catch(e){ return []; } };
  const achSave = a => localStorage.setItem(ACH_KEY, JSON.stringify(a));
  let ACH_CURRENT = null;

  window.renderACH = function(){
    const host = g('ach-content'); if(!host) return;
    const analyses = achLoad();

    let html = `<div style="background:${T.card};border:1px solid ${T.border};border-left:4px solid ${T.purple};border-radius:8px;padding:16px 18px;margin-bottom:16px">
      <div style="font-size:1.05rem;font-weight:700;color:${T.txt};margin-bottom:6px"><i class="fa-solid fa-diagram-project" style="color:${T.purple}"></i> Méthode ACH — Analyse des Hypothèses Concurrentes</div>
      <div style="font-size:.84rem;color:${T.dim};line-height:1.55">Méthode d'analyse de renseignement (Richards Heuer, CIA). Tu poses plusieurs <b>hypothèses concurrentes</b>, tu listes les <b>indices/preuves</b>, puis tu notes la cohérence de chaque indice avec chaque hypothèse. <b>L'hypothèse la plus probable n'est pas celle qui a le plus de preuves pour, mais celle qui a le moins de preuves contre.</b> Tout est sauvegardé dans ton navigateur.</div>
    </div>`;

    if(!ACH_CURRENT){
      // Liste des analyses + création
      html += `<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
        <input id="ach-new-q" placeholder="Question d'analyse (ex: L'AES va-t-elle adopter une monnaie commune en 2026 ?)" style="flex:1;min-width:280px;background:${T.card};color:${T.txt};border:1px solid ${T.border};border-radius:6px;padding:9px 12px;font-size:.85rem"/>
        <button id="ach-create" class="btn primary sm"><i class="fa-solid fa-plus"></i> Nouvelle analyse</button>
      </div>`;
      if(!analyses.length){
        html += `<div style="background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:30px;text-align:center;color:${T.dim}"><i class="fa-solid fa-diagram-project" style="font-size:2rem;color:${T.purple};margin-bottom:10px"></i><div>Aucune analyse pour l'instant. Crée ta première question ci-dessus.</div></div>`;
      } else {
        html += `<div style="display:grid;gap:10px">`;
        analyses.forEach(a=>{
          const best = achBest(a);
          html += `<div style="background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:14px 16px">
            <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:flex-start">
              <div style="flex:1;min-width:240px"><div style="font-size:.95rem;color:${T.txt};font-weight:600;margin-bottom:4px;cursor:pointer" class="ach-open" data-id="${a.id}">${esc(a.question)}</div>
              <div style="font-size:.72rem;color:${T.faint}">${a.hypotheses.length} hypothèses · ${a.evidence.length} indices${best?` · <span style="color:${T.green}">favorite : ${esc(best.label)}</span>`:''}</div></div>
              <div style="display:flex;gap:6px"><button class="btn ghost sm ach-open" data-id="${a.id}"><i class="fa-solid fa-pen"></i> Ouvrir</button><button class="btn ghost sm ach-del" data-id="${a.id}" title="Supprimer"><i class="fa-solid fa-trash"></i></button></div>
            </div></div>`;
        });
        html += `</div>`;
      }
      host.innerHTML = html;
      g('ach-create').onclick = ()=>{
        const q = g('ach-new-q').value.trim(); if(!q){ toast&&toast('Saisis une question','info'); return; }
        const a = { id:'ach_'+Date.now(), question:q, hypotheses:[], evidence:[], matrix:{} };
        const arr = achLoad(); arr.unshift(a); achSave(arr); ACH_CURRENT=a.id; window.renderACH();
      };
      host.querySelectorAll('.ach-open').forEach(b=>b.onclick=()=>{ ACH_CURRENT=b.dataset.id; window.renderACH(); });
      host.querySelectorAll('.ach-del').forEach(b=>b.onclick=()=>{ if(confirm('Supprimer cette analyse ?')){ achSave(achLoad().filter(x=>x.id!==b.dataset.id)); window.renderACH(); } });
      return;
    }

    // Vue détaillée d'une analyse
    const arr = achLoad(); const a = arr.find(x=>x.id===ACH_CURRENT);
    if(!a){ ACH_CURRENT=null; window.renderACH(); return; }

    html += `<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:14px">
      <button class="btn ghost sm" id="ach-back"><i class="fa-solid fa-arrow-left"></i> Toutes les analyses</button>
      <div style="font-size:.72rem;color:${T.faint}">Sauvegarde automatique</div>
    </div>`;
    html += `<div style="background:linear-gradient(135deg,${T.purple}18,${T.card});border:1px solid ${T.purple}55;border-left:4px solid ${T.purple};border-radius:8px;padding:14px 16px;margin-bottom:16px"><div style="font-size:1.05rem;color:${T.txt};font-weight:700">${esc(a.question)}</div></div>`;

    // Ajout hypothèse / indice
    html += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px" class="ach-add-grid">
      <div style="background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:12px"><div style="font-size:.7rem;text-transform:uppercase;color:${T.faint};font-weight:700;margin-bottom:8px">Hypothèses (${a.hypotheses.length})</div>
        <div style="display:flex;gap:6px"><input id="ach-h" placeholder="ex: Oui, adoption en 2026" style="flex:1;background:${T.bg};color:${T.txt};border:1px solid ${T.border};border-radius:5px;padding:7px 10px;font-size:.8rem"/><button class="btn primary sm" id="ach-addh"><i class="fa-solid fa-plus"></i></button></div></div>
      <div style="background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:12px"><div style="font-size:.7rem;text-transform:uppercase;color:${T.faint};font-weight:700;margin-bottom:8px">Indices / preuves (${a.evidence.length})</div>
        <div style="display:flex;gap:6px"><input id="ach-e" placeholder="ex: Communiqué officiel AES de mars" style="flex:1;background:${T.bg};color:${T.txt};border:1px solid ${T.border};border-radius:5px;padding:7px 10px;font-size:.8rem"/><button class="btn primary sm" id="ach-adde"><i class="fa-solid fa-plus"></i></button></div></div>
    </div>`;

    if(a.hypotheses.length && a.evidence.length){
      // Score diagnostic
      const scores = a.hypotheses.map((h,hi)=>{
        let incons=0, weighted=0;
        a.evidence.forEach((e,ei)=>{ const v=(a.matrix[ei+'_'+hi]); if(v===-1){incons++;weighted+=1;} else if(v===-2){incons++;weighted+=2;} });
        return {hi, label:h, incons, weighted};
      }).sort((x,y)=>x.weighted-y.weighted);
      const bestHi = scores[0].hi;

      html += `<div style="background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:14px;margin-bottom:16px">
        <div style="font-size:.7rem;text-transform:uppercase;color:${T.faint};font-weight:700;margin-bottom:10px"><i class="fa-solid fa-trophy" style="color:${T.yellow}"></i> Diagnostic — classement par moindre incohérence</div>`;
      scores.forEach((s,rank)=>{
        const col = rank===0?T.green:rank===scores.length-1?T.red:T.dim;
        html += `<div style="display:flex;align-items:center;gap:10px;padding:6px 0">
          <span style="font-size:1.1rem;font-weight:800;color:${col};min-width:26px">#${rank+1}</span>
          <span style="flex:1;color:${T.txt};font-size:.86rem">${esc(s.label)}</span>
          <span style="font-size:.74rem;color:${col}">score incohérence : <b>${s.weighted}</b> (${s.incons} indice${s.incons>1?'s':''} contre)</span>
        </div>`;
      });
      html += `<div style="font-size:.74rem;color:${T.dim};margin-top:8px;padding-top:8px;border-top:1px solid ${T.border};line-height:1.5">➜ L'hypothèse <b style="color:${T.green}">« ${esc(a.hypotheses[bestHi])} »</b> est actuellement la plus solide : elle résiste le mieux aux indices contradictoires. <i>Cherche activement les preuves qui pourraient la réfuter.</i></div></div>`;

      // Matrice
      html += `<div style="background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:4px;overflow-x:auto;margin-bottom:14px"><table style="width:100%;border-collapse:collapse;font-size:.8rem">
        <thead><tr><th style="text-align:left;padding:10px;color:${T.faint};font-size:.68rem;text-transform:uppercase;border-bottom:1px solid ${T.border};min-width:200px">Indice \\ Hypothèse</th>${a.hypotheses.map((h,hi)=>`<th style="padding:8px;border-bottom:1px solid ${T.border};color:${hi===bestHi?T.green:T.txt};font-size:.74rem;text-align:center;min-width:90px">H${hi+1}</th>`).join('')}<th style="border-bottom:1px solid ${T.border}"></th></tr></thead><tbody>`;
      a.evidence.forEach((e,ei)=>{
        html += `<tr><td style="padding:8px 10px;color:${T.txt};border-bottom:1px solid ${T.border};font-size:.78rem">${esc(e)}</td>`;
        a.hypotheses.forEach((h,hi)=>{
          const v = a.matrix[ei+'_'+hi];
          const rt = ACH_RATINGS.find(r=>r.v===v) || ACH_RATINGS[2];
          html += `<td style="padding:6px;border-bottom:1px solid ${T.border};text-align:center"><select class="ach-cell" data-k="${ei}_${hi}" style="background:${T.bg};color:${rt.color};border:1px solid ${T.border};border-radius:4px;padding:3px 4px;font-weight:700;font-size:.8rem;cursor:pointer">${ACH_RATINGS.map(r=>`<option value="${r.v}"${r.v===(v==null?0:v)?' selected':''}>${r.sym}</option>`).join('')}</select></td>`;
        });
        html += `<td style="padding:6px;border-bottom:1px solid ${T.border};text-align:center"><button class="btn ghost sm ach-dele" data-i="${ei}" title="Retirer l'indice"><i class="fa-solid fa-xmark"></i></button></td></tr>`;
      });
      html += `</tbody></table></div>`;
      html += `<div style="font-size:.72rem;color:${T.faint};line-height:1.6">Légende : ${ACH_RATINGS.map(r=>`<span style="color:${r.color};font-weight:700">${r.sym}</span> ${r.label}`).join(' · ')}</div>`;
      // liste hypothèses avec suppression
      html += `<div style="margin-top:14px;display:flex;gap:6px;flex-wrap:wrap">${a.hypotheses.map((h,hi)=>`<span style="background:${T.bg};border:1px solid ${T.border};border-radius:12px;padding:4px 10px;font-size:.74rem;color:${T.dim}">H${hi+1}: ${esc(h)} <i class="fa-solid fa-xmark ach-delh" data-i="${hi}" style="cursor:pointer;color:${T.red};margin-left:4px"></i></span>`).join('')}</div>`;
    } else {
      html += `<div style="background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:24px;text-align:center;color:${T.dim}">Ajoute au moins <b>2 hypothèses</b> et <b>1 indice</b> pour construire la matrice diagnostique.</div>`;
    }

    host.innerHTML = html;

    const save = ()=>{ const all=achLoad(); const idx=all.findIndex(x=>x.id===a.id); all[idx]=a; achSave(all); };
    g('ach-back').onclick = ()=>{ ACH_CURRENT=null; window.renderACH(); };
    g('ach-addh').onclick = ()=>{ const v=g('ach-h').value.trim(); if(v){ a.hypotheses.push(v); save(); window.renderACH(); } };
    g('ach-adde').onclick = ()=>{ const v=g('ach-e').value.trim(); if(v){ a.evidence.push(v); save(); window.renderACH(); } };
    g('ach-h').onkeydown = ev=>{ if(ev.key==='Enter') g('ach-addh').click(); };
    g('ach-e').onkeydown = ev=>{ if(ev.key==='Enter') g('ach-adde').click(); };
    host.querySelectorAll('.ach-cell').forEach(s=>s.onchange=()=>{ a.matrix[s.dataset.k]=parseInt(s.value,10); save(); window.renderACH(); });
    host.querySelectorAll('.ach-dele').forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; a.evidence.splice(i,1); a.matrix=remapMatrix(a,'e',i); save(); window.renderACH(); });
    host.querySelectorAll('.ach-delh').forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; a.hypotheses.splice(i,1); a.matrix=remapMatrix(a,'h',i); save(); window.renderACH(); });
  };

  function remapMatrix(a, axis, removedIdx){
    // Reconstruit la matrice après suppression d'un indice (e) ou d'une hypothèse (h)
    const nm = {};
    a.evidence.forEach((e,ei)=>{ a.hypotheses.forEach((h,hi)=>{
      let oei=ei, ohi=hi;
      if(axis==='e' && ei>=removedIdx) oei=ei+1;
      if(axis==='h' && hi>=removedIdx) ohi=hi+1;
      const old = a.matrix[oei+'_'+ohi];
      if(old!=null) nm[ei+'_'+hi]=old;
    }); });
    return nm;
  }
  function achBest(a){
    if(!a.hypotheses.length || !a.evidence.length) return null;
    const scores = a.hypotheses.map((h,hi)=>{ let w=0; a.evidence.forEach((e,ei)=>{ const v=a.matrix[ei+'_'+hi]; if(v===-1)w+=1; else if(v===-2)w+=2; }); return {label:h,w}; });
    scores.sort((x,y)=>x.w-y.w); return scores[0];
  }

  /* ====================================================================
     FEATURE 6 — GRAPHE D'ACTEURS
     ==================================================================== */
  let AG_FILTER = 'all';
  let AG_HIGHLIGHT = null;
  window.renderActorsGraph = function(){
    const host = g('actors-content'); if(!host) return;
    const conflicts = getConflicts().filter(c=> AG_FILTER==='all' || c.id===AG_FILTER);

    // Construire noeuds + liens
    const nodes = {}; const links = [];
    conflicts.forEach(c=>{
      const etat = (c.actors_etat||[]).map(n=>({name:cleanActor(n), type:'etat'}));
      const non = (c.actors_non_etat||[]).map(n=>({name:cleanActor(n), type:'non_etat'}));
      const actors = [...etat, ...non];
      actors.forEach(a=>{ if(!nodes[a.name]) nodes[a.name]={name:a.name, type:a.type, conflicts:new Set(), deg:0}; nodes[a.name].conflicts.add(c.short||c.name); });
      // liens entre acteurs du même conflit
      for(let i=0;i<actors.length;i++) for(let j=i+1;j<actors.length;j++){
        links.push({s:actors[i].name, t:actors[j].name, conflict:c.short||c.name});
      }
    });
    const nodeList = Object.values(nodes);
    nodeList.forEach(n=> n.deg = links.filter(l=>l.s===n.name||l.t===n.name).length);

    const allConflicts = getConflicts();
    let html = `<div style="background:${T.card};border:1px solid ${T.border};border-left:4px solid ${T.purple};border-radius:8px;padding:16px 18px;margin-bottom:16px">
      <div style="font-size:1.05rem;font-weight:700;color:${T.txt};margin-bottom:6px"><i class="fa-solid fa-circle-nodes" style="color:${T.purple}"></i> Graphe d'acteurs</div>
      <div style="font-size:.84rem;color:${T.dim};line-height:1.55">Réseau des acteurs étatiques (<span style="color:${T.blue}">bleu</span>) et non-étatiques (<span style="color:${T.orange}">orange</span>). Deux acteurs sont reliés s'ils interviennent dans le même conflit. La taille du nœud = nombre de connexions. <b>Clique sur un acteur</b> pour isoler ses liens.</div>
    </div>`;
    html += `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;align-items:center">
      <select id="ag-filter" style="background:${T.card};color:${T.txt};border:1px solid ${T.border};border-radius:6px;padding:7px 11px;font-size:.82rem">
        <option value="all"${AG_FILTER==='all'?' selected':''}>Tous les conflits</option>
        ${allConflicts.map(c=>`<option value="${c.id}"${AG_FILTER===c.id?' selected':''}>${esc(c.name)}</option>`).join('')}
      </select>
      <span style="font-size:.76rem;color:${T.faint}">${nodeList.length} acteurs · ${links.length} liens</span>
      ${AG_HIGHLIGHT?`<button class="btn ghost sm" id="ag-clear"><i class="fa-solid fa-xmark"></i> Désélectionner ${esc(AG_HIGHLIGHT)}</button>`:''}
    </div>`;

    if(nodeList.length<2){ html += `<div style="color:${T.dim};padding:20px">Pas assez d'acteurs pour ce filtre.</div>`; host.innerHTML=html; g('ag-filter').onchange=e=>{AG_FILTER=e.target.value;AG_HIGHLIGHT=null;window.renderActorsGraph();}; return; }

    // Layout force-directed simple (déterministe)
    const W=860, H=560;
    layout(nodeList, links, W, H);

    // Liens visibles selon highlight
    const neighbors = new Set();
    if(AG_HIGHLIGHT){ links.forEach(l=>{ if(l.s===AG_HIGHLIGHT)neighbors.add(l.t); if(l.t===AG_HIGHLIGHT)neighbors.add(l.s); }); neighbors.add(AG_HIGHLIGHT); }

    let svg = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;background:${T.bg};border:1px solid ${T.border};border-radius:8px" preserveAspectRatio="xMidYMid meet">`;
    // liens
    links.forEach(l=>{
      const a=nodes[l.s], b=nodes[l.t]; if(!a||!b)return;
      const dim = AG_HIGHLIGHT && !(l.s===AG_HIGHLIGHT||l.t===AG_HIGHLIGHT);
      svg += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${dim?'#13192e':'#26304d'}" stroke-width="${dim?0.5:1}"/>`;
    });
    // noeuds
    nodeList.forEach(n=>{
      const r = Math.min(7+n.deg*1.6, 22);
      const col = n.type==='etat'?T.blue:T.orange;
      const dim = AG_HIGHLIGHT && !neighbors.has(n.name);
      const op = dim?0.25:1;
      svg += `<g class="ag-node" data-name="${esc(n.name)}" style="cursor:pointer" opacity="${op}">
        <circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${r.toFixed(1)}" fill="${col}" stroke="${n.name===AG_HIGHLIGHT?'#fff':'#0a0f1c'}" stroke-width="${n.name===AG_HIGHLIGHT?2.5:1}"/>
        <text x="${n.x.toFixed(1)}" y="${(n.y+r+11).toFixed(1)}" text-anchor="middle" fill="${dim?T.faint:T.txt}" font-size="10" font-family="system-ui">${esc(n.name.length>20?n.name.slice(0,19)+'…':n.name)}</text>
      </g>`;
    });
    svg += `</svg>`;
    html += svg;

    // Détail si sélection
    if(AG_HIGHLIGHT && nodes[AG_HIGHLIGHT]){
      const n=nodes[AG_HIGHLIGHT];
      html += `<div style="background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:14px 16px;margin-top:14px">
        <div style="font-size:.95rem;color:${T.txt};font-weight:700;margin-bottom:6px">${esc(n.name)} <span style="font-size:.7rem;color:${n.type==='etat'?T.blue:T.orange};font-weight:600">(${n.type==='etat'?'étatique':'non-étatique'})</span></div>
        <div style="font-size:.78rem;color:${T.dim};margin-bottom:6px">Présent dans : ${[...n.conflicts].map(c=>`<span style="background:${T.bg};border:1px solid ${T.border};border-radius:10px;padding:2px 8px;font-size:.72rem;margin-right:4px">${esc(c)}</span>`).join('')}</div>
        <div style="font-size:.78rem;color:${T.dim}">Connecté à <b style="color:${T.txt}">${[...neighbors].filter(x=>x!==AG_HIGHLIGHT).length}</b> autres acteurs</div>
      </div>`;
    }

    host.innerHTML = html;
    g('ag-filter').onchange = e=>{ AG_FILTER=e.target.value; AG_HIGHLIGHT=null; window.renderActorsGraph(); };
    const clr=g('ag-clear'); if(clr) clr.onclick=()=>{ AG_HIGHLIGHT=null; window.renderActorsGraph(); };
    host.querySelectorAll('.ag-node').forEach(nd=>nd.onclick=()=>{ const nm=nd.dataset.name; AG_HIGHLIGHT = (AG_HIGHLIGHT===nm)?null:nm; window.renderActorsGraph(); });
  };

  function cleanActor(s){ return String(s).replace(/\s*\([^)]*\)\s*/g,'').trim(); }

  function layout(nodes, links, W, H){
    // Positions initiales en cercle (déterministe)
    const cx=W/2, cy=H/2, R=Math.min(W,H)*0.38;
    nodes.forEach((n,i)=>{ const ang=(i/nodes.length)*Math.PI*2; n.x=cx+R*Math.cos(ang); n.y=cy+R*Math.sin(ang); n.vx=0; n.vy=0; });
    const idx={}; nodes.forEach((n,i)=>idx[n.name]=i);
    // Simulation force-directed
    for(let it=0; it<240; it++){
      // répulsion
      for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i], b=nodes[j]; let dx=a.x-b.x, dy=a.y-b.y; let d2=dx*dx+dy*dy; if(d2<1)d2=1;
        const f=2400/d2; const d=Math.sqrt(d2); const fx=f*dx/d, fy=f*dy/d;
        a.vx+=fx; a.vy+=fy; b.vx-=fx; b.vy-=fy;
      }
      // attraction (liens)
      links.forEach(l=>{ const a=nodes[idx[l.s]], b=nodes[idx[l.t]]; if(!a||!b)return; let dx=b.x-a.x, dy=b.y-a.y; const d=Math.sqrt(dx*dx+dy*dy)||1; const f=(d-90)*0.012; const fx=f*dx/d, fy=f*dy/d; a.vx+=fx; a.vy+=fy; b.vx-=fx; b.vy-=fy; });
      // centre
      nodes.forEach(n=>{ n.vx+=(cx-n.x)*0.002; n.vy+=(cy-n.y)*0.002; });
      // intégration + amortissement
      nodes.forEach(n=>{ n.x+=Math.max(-12,Math.min(12,n.vx)); n.y+=Math.max(-12,Math.min(12,n.vy)); n.vx*=0.85; n.vy*=0.85; n.x=Math.max(40,Math.min(W-40,n.x)); n.y=Math.max(30,Math.min(H-30,n.y)); });
    }
  }

  /* ====================================================================
     FEATURE 10 — NOTE EXPRESS (PDF 1 page)
     ==================================================================== */
  function exportNoteExpress(){
    if(!window.jspdf){ toast && toast('Bibliothèque PDF non chargée','error'); return; }
    let alerts = [];
    try { alerts = (typeof getDerivedAlertsFromNews==='function'? getDerivedAlertsFromNews():[]) || []; } catch(e){}
    const crit = alerts.filter(a=>a.level==='critical');
    const high = alerts.filter(a=>a.level==='high');
    const top = [...crit, ...high].slice(0,6);
    if(!top.length){ toast && toast('Aucune alerte critique/élevée à exporter','info'); return; }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({unit:'mm',format:'a4'});
    const pw = 210; const M=16; let y=18;
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});

    // En-tête
    doc.setFillColor(10,15,28); doc.rect(0,0,pw,30,'F');
    doc.setTextColor(96,165,250); doc.setFont('helvetica','bold'); doc.setFontSize(16);
    doc.text('NOTE EXPRESS — VEILLE GÉOPOLITIQUE', M, 14);
    doc.setTextColor(148,163,184); doc.setFont('helvetica','normal'); doc.setFontSize(9);
    doc.text('GéoWatch · Observatoire des conflits', M, 21);
    doc.text(dateStr.charAt(0).toUpperCase()+dateStr.slice(1), M, 26);
    y=40;

    doc.setTextColor(30,41,59); doc.setFont('helvetica','bold'); doc.setFontSize(11);
    doc.text(`${top.length} alerte(s) prioritaire(s) — ${crit.length} critique(s), ${high.length} élevée(s)`, M, y); y+=8;

    top.forEach((a,i)=>{
      if(y>262){ doc.addPage(); y=20; }
      const col = a.level==='critical'?[239,68,68]:[249,115,22];
      doc.setFillColor(col[0],col[1],col[2]); doc.rect(M,y-3.5,3,16,'F');
      doc.setTextColor(col[0],col[1],col[2]); doc.setFont('helvetica','bold'); doc.setFontSize(7.5);
      doc.text((a.level==='critical'?'CRITIQUE':'ÉLEVÉE')+(a._bf?' · BF':''), M+5, y);
      doc.setTextColor(30,41,59); doc.setFont('helvetica','bold'); doc.setFontSize(10);
      const title = doc.splitTextToSize(a.title||'', pw-2*M-5); doc.text(title, M+5, y+5); y+=5+title.length*5;
      if(a.description){ doc.setTextColor(71,85,105); doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
        const desc = doc.splitTextToSize(a.description.replace(/<[^>]+>/g,''), pw-2*M-5).slice(0,3); doc.text(desc, M+5, y); y+=desc.length*4.2; }
      doc.setTextColor(148,163,184); doc.setFontSize(7.5);
      doc.text(`Source : ${a._source||'—'}${a._corroborations>1?` · +${a._corroborations-1} corroborations`:''}`, M+5, y+1); y+=8;
    });

    // Pied de page
    const ph=297; doc.setDrawColor(226,232,240); doc.line(M,ph-16,pw-M,ph-16);
    doc.setTextColor(148,163,184); doc.setFont('helvetica','italic'); doc.setFontSize(7.5);
    doc.text('Document de travail — sources ouvertes à recouper. Généré automatiquement par GéoWatch.', M, ph-11);
    doc.text(now.toLocaleString('fr-FR'), M, ph-7);
    doc.save(`Note_Express_${now.toISOString().slice(0,10)}.pdf`);
    toast && toast('Note Express PDF générée','success');
  }

  /* ====================================================================
     FEATURE 11 — MODE KIOSQUE (présentation plein écran)
     ==================================================================== */
  let KIOSK_TIMER=null, KIOSK_IDX=0, KIOSK_ITEMS=[];
  function startKiosk(){
    let alerts=[]; try{ alerts=(typeof getDerivedAlertsFromNews==='function'?getDerivedAlertsFromNews():[])||[]; }catch(e){}
    KIOSK_ITEMS = alerts.filter(a=>a.level==='critical'||a.level==='high').slice(0,10);
    if(!KIOSK_ITEMS.length){ toast && toast('Aucune alerte à présenter','info'); return; }
    KIOSK_IDX=0;
    let ov = g('kiosk-overlay');
    if(!ov){ ov=document.createElement('div'); ov.id='kiosk-overlay'; document.body.appendChild(ov); }
    ov.style.cssText='position:fixed;inset:0;z-index:99999;background:radial-gradient(circle at 50% 30%,#0c1426,#030712);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6vh 8vw;cursor:none';
    renderKioskSlide();
    try{ if(ov.requestFullscreen) ov.requestFullscreen(); }catch(e){}
    document.addEventListener('keydown', kioskKey);
    KIOSK_TIMER = setInterval(()=>{ KIOSK_IDX=(KIOSK_IDX+1)%KIOSK_ITEMS.length; renderKioskSlide(); }, 12000);
  }
  function renderKioskSlide(){
    const ov=g('kiosk-overlay'); if(!ov) return;
    const a=KIOSK_ITEMS[KIOSK_IDX];
    const col=a.level==='critical'?T.red:T.orange;
    const lvl=a.level==='critical'?'CRITIQUE':'ÉLEVÉE';
    let when=''; try{ when=new Date(a.date).toLocaleString('fr-FR',{dateStyle:'long',timeStyle:'short'}); }catch(e){}
    ov.innerHTML = `
      <div style="position:absolute;top:4vh;left:0;right:0;text-align:center;color:${T.faint};font-size:1.1rem;letter-spacing:3px;text-transform:uppercase"><i class="fa-solid fa-satellite-dish" style="color:#86efac"></i> GéoWatch — Veille en direct</div>
      <div style="display:inline-flex;align-items:center;gap:14px;margin-bottom:30px">
        <span style="background:${col};color:#0a0f1c;font-weight:800;padding:8px 22px;border-radius:30px;font-size:1.4rem;letter-spacing:2px">${lvl}</span>
        ${a._bf?`<span style="background:rgba(253,224,71,.2);color:${T.yellow};border:2px solid ${T.yellow};padding:6px 18px;border-radius:30px;font-weight:700;font-size:1.2rem">🇧🇫 BURKINA FASO</span>`:''}
      </div>
      <div style="font-size:clamp(2rem,5vw,4rem);font-weight:800;color:#f1f5f9;text-align:center;line-height:1.2;max-width:1100px;margin-bottom:30px">${esc(a.title)}</div>
      ${a.description?`<div style="font-size:clamp(1.1rem,2vw,1.6rem);color:${T.dim};text-align:center;line-height:1.5;max-width:950px;margin-bottom:30px">${esc(a.description.replace(/<[^>]+>/g,'').slice(0,260))}</div>`:''}
      <div style="color:${T.faint};font-size:1.2rem"><i class="fa-solid fa-newspaper"></i> ${esc(a._source||'')} ${a._corroborations>1?`· +${a._corroborations-1} sources`:''} · ${when}</div>
      <div style="position:absolute;bottom:5vh;left:0;right:0;text-align:center;color:${T.faint};font-size:1rem">
        <div style="display:flex;gap:6px;justify-content:center;margin-bottom:14px">${KIOSK_ITEMS.map((x,i)=>`<span style="width:${i===KIOSK_IDX?'34px':'10px'};height:10px;border-radius:5px;background:${i===KIOSK_IDX?col:'#26304d'};transition:all .3s"></span>`).join('')}</div>
        Alerte ${KIOSK_IDX+1} / ${KIOSK_ITEMS.length} &nbsp;·&nbsp; <kbd style="background:#1a2340;padding:2px 8px;border-radius:4px">←</kbd> <kbd style="background:#1a2340;padding:2px 8px;border-radius:4px">→</kbd> naviguer &nbsp;·&nbsp; <kbd style="background:#1a2340;padding:2px 8px;border-radius:4px">Échap</kbd> quitter
      </div>`;
  }
  function kioskKey(e){
    if(e.key==='Escape') stopKiosk();
    else if(e.key==='ArrowRight'){ KIOSK_IDX=(KIOSK_IDX+1)%KIOSK_ITEMS.length; renderKioskSlide(); }
    else if(e.key==='ArrowLeft'){ KIOSK_IDX=(KIOSK_IDX-1+KIOSK_ITEMS.length)%KIOSK_ITEMS.length; renderKioskSlide(); }
  }
  function stopKiosk(){
    if(KIOSK_TIMER){ clearInterval(KIOSK_TIMER); KIOSK_TIMER=null; }
    document.removeEventListener('keydown', kioskKey);
    try{ if(document.fullscreenElement) document.exitFullscreen(); }catch(e){}
    const ov=g('kiosk-overlay'); if(ov) ov.remove();
  }

  /* ====================================================================
     FEATURE — ENVOYER LE BRIEF PAR MAIL (assisté, multi-messagerie)
     ==================================================================== */
  function _topAlerts(){
    let alerts=[]; try{ alerts=(typeof getDerivedAlertsFromNews==='function'?getDerivedAlertsFromNews():[])||[]; }catch(e){}
    const crit=alerts.filter(a=>a.level==='critical'), high=alerts.filter(a=>a.level==='high');
    return { crit, high, top:[...crit,...high].slice(0,7) };
  }
  function buildBriefText(){
    const {crit,high,top} = _topAlerts();
    const now=new Date();
    const dateStr=now.toLocaleDateString('fr-FR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
    const subject=`Veille géopolitique — Note du ${dateStr}`;
    let body=`VEILLE GÉOPOLITIQUE — ${dateStr.charAt(0).toUpperCase()+dateStr.slice(1)}\nGéoWatch · Observatoire des conflits\n\n`;
    if(!top.length){ body+=`Aucune alerte critique ou élevée détectée sur la période.\n`; }
    else {
      body+=`${crit.length} alerte(s) critique(s), ${high.length} élevée(s).\n\n`;
      top.forEach((a,i)=>{
        const lvl=a.level==='critical'?'CRITIQUE':'ÉLEVÉE';
        const desc=(a.description||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim().slice(0,160);
        body+=`${i+1}. [${lvl}]${a._bf?' [BF]':''} ${a.title}\n`;
        body+=`   Source : ${a._source||'—'}${a._corroborations>1?` · +${a._corroborations-1} corroboration(s)`:''}\n`;
        if(desc) body+=`   ${desc}${desc.length>=160?'…':''}\n`;
        if(a._link) body+=`   ${a._link}\n`;
        body+=`\n`;
      });
    }
    body+=`—\nDocument de travail — sources ouvertes à recouper.\nGénéré par GéoWatch le ${now.toLocaleString('fr-FR')}.`;
    return { subject, body };
  }
  function emailBrief(){
    const {top}=_topAlerts();
    if(!top.length){ toast && toast('Aucune alerte critique/élevée à envoyer','info'); return; }
    const {subject,body}=buildBriefText();
    const eS=encodeURIComponent(subject), eB=encodeURIComponent(body);
    const gmail=`https://mail.google.com/mail/?view=cm&fs=1&su=${eS}&body=${eB}`;
    const outlook=`https://outlook.office.com/mail/deeplink/compose?subject=${eS}&body=${eB}`;
    const mailto=`mailto:?subject=${eS}&body=${eB}`;

    let ov=g('mailbrief-overlay');
    if(!ov){ ov=document.createElement('div'); ov.id='mailbrief-overlay'; document.body.appendChild(ov); }
    ov.style.cssText='position:fixed;inset:0;z-index:99998;background:rgba(3,7,18,.82);display:flex;align-items:center;justify-content:center;padding:4vh 4vw';
    ov.innerHTML=`
      <div style="background:${T.card};border:1px solid ${T.border};border-radius:12px;max-width:720px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,.5)">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid ${T.border}">
          <div style="font-size:1.05rem;font-weight:700;color:${T.txt}"><i class="fa-solid fa-envelope" style="color:${T.blue}"></i> Envoyer le brief par mail</div>
          <button id="mb-close" class="btn ghost sm"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div style="padding:18px 20px">
          <div style="font-size:.82rem;color:${T.dim};line-height:1.5;margin-bottom:12px">Le briefing ci-dessous a été généré à partir des <b style="color:${T.txt}">${top.length} alertes prioritaires</b> du moment. Choisis ta messagerie (le texte sera pré-rempli) ou copie-le. <b>Tu gardes la main : c'est toi qui ajoutes le destinataire et qui envoies.</b></div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
            <a href="${gmail}" target="_blank" rel="noopener" class="btn primary sm" style="text-decoration:none"><i class="fa-solid fa-envelope"></i> Ouvrir dans Gmail</a>
            <a href="${outlook}" target="_blank" rel="noopener" class="btn ghost sm" style="text-decoration:none"><i class="fa-solid fa-envelope"></i> Ouvrir dans Outlook</a>
            <a href="${mailto}" class="btn ghost sm" style="text-decoration:none"><i class="fa-solid fa-desktop"></i> Messagerie par défaut</a>
            <button id="mb-copy" class="btn ghost sm"><i class="fa-solid fa-copy"></i> Copier le texte</button>
          </div>
          <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.6px;color:${T.faint};font-weight:700;margin-bottom:6px">Objet</div>
          <input id="mb-subj" value="${esc(subject)}" readonly style="width:100%;background:${T.bg};color:${T.txt};border:1px solid ${T.border};border-radius:6px;padding:8px 11px;font-size:.82rem;margin-bottom:12px"/>
          <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.6px;color:${T.faint};font-weight:700;margin-bottom:6px">Corps du message (modifiable)</div>
          <textarea id="mb-body" style="width:100%;height:260px;background:${T.bg};color:${T.txt};border:1px solid ${T.border};border-radius:6px;padding:11px;font-size:.8rem;line-height:1.5;font-family:inherit;resize:vertical">${esc(body)}</textarea>
        </div>
      </div>`;
    const close=()=>{ ov.remove(); };
    g('mb-close').onclick=close;
    ov.onclick=(e)=>{ if(e.target===ov) close(); };
    g('mb-copy').onclick=async()=>{
      const txt=g('mb-body').value;
      try{ await navigator.clipboard.writeText(txt); toast && toast('Texte copié — colle-le dans ton mail','success'); }
      catch(e){ const ta=g('mb-body'); ta.select(); document.execCommand('copy'); toast && toast('Texte copié','success'); }
    };
    // Mettre à jour les liens si l'utilisateur modifie le corps
    g('mb-body').oninput=()=>{
      const nb=encodeURIComponent(g('mb-body').value);
      ov.querySelectorAll('a').forEach(a=>{
        if(a.href.includes('mail.google.com')) a.href=`https://mail.google.com/mail/?view=cm&fs=1&su=${eS}&body=${nb}`;
        else if(a.href.includes('outlook.office.com')) a.href=`https://outlook.office.com/mail/deeplink/compose?subject=${eS}&body=${nb}`;
        else if(a.href.startsWith('mailto:')) a.href=`mailto:?subject=${eS}&body=${nb}`;
      });
    };
  }

  /* ====================================================================
     EXPOSITION GLOBALE
     ==================================================================== */
  window.GW_LAB = { exportNoteExpress, startKiosk, stopKiosk, emailBrief, buildBriefText };

})();
