# GéoWatch v3 — Mémoire projet pour Claude Code

## 🌟 Synthèse "À retenir aujourd'hui" (Dashboard)

Fonction `renderDashSynthese()` injecte en haut du dashboard un grand bandeau coloré qui synthétise en français simple :
- Salutation + date
- État global (CALME / FAIBLE / MODÉRÉ / ÉLEVÉ / CRITIQUE) basé sur l'IMS-BF
- 4 mini-stats expliquées : articles 24h, articles BF, événements majeurs, score IMS
- **Sujet n°1 du jour** (top article majeur ou BF)
- **Recommandation d'action concrète** par niveau ("Mobilisation requise", "Vigilance accrue"...)
- Boutons d'action rapide vers Brief Quotidien / Alertes / Radar

Appelée automatiquement par `renderDashboard()` au tout début. Le div `dash-synthese` est créé dynamiquement si absent.

## 🚨 Centre d'alertes opérationnel

`renderAlerts()` refait avec :
- Bandeau pédagogique « Comment fonctionnent les alertes ? » (4 puces explicatives)
- 4 cards-stats cliquables = filtres rapides : **Critique / Élevée / Moyenne / Pertinente BF**
- État `AL_STATE = {level, source, bfOnly}` pour les filtres
- Bouton « Réinitialiser filtres » visible quand un filtre est actif
- Cas vides intelligents :
  - 0 alerte au total → message rassurant "Aucune alerte active" avec icône bouclier vert
  - Filtres trop restrictifs → message "Aucune alerte ne correspond aux filtres actifs"

## 📚 Bandeaux pédagogiques sur les pages

Helper `pageIntroBanner(targetId, cfg)` ajoute un bandeau didactique en tête de page :
```js
pageIntroBanner('scen-content', {
  icon:'chess', color:'#a855f7', title:'Scénarios prospectifs',
  what:'1 phrase répondant à « À quoi ça sert ? »',
  howToRead:[ '...', '...', '...' ],   // 3-5 lignes d'explication
  takeaway:'Question stratégique principale à laquelle la page répond'
});
```
Pages équipées :
- `bf-content` (Impact BF) — 4 dimensions sécuritaire/éco/diplo/sociopolitique
- `scen-content` (Scénarios) — explication proba × impact + Wild card
- `reconfig-content` (Reconfigurations) — niveau + horizon + conséquences + pertinence BF
- `indic-content` (Indicateurs) — court terme 24-72h vs moyen terme 7-30j + stats globales
- `analyses-page` (Analyses) — guide de lecture des 5 graphiques

Helper `chartInsight(canvasId, methodHTML, lectureHTML, color, bottomLine)` accepte désormais un **5e argument** `bottomLine` qui affiche un encart « À retenir » en gros pour le décideur.

## 🧬 Module GW_DEPTH — Profondeur analytique injectée

Le module `GW_DEPTH` enrichit toutes les sections (Briefs, Scénarios, Indicateurs, Reconfigurations, Impact BF, Analyses) avec **6 couches de profondeur live** :

### API publique
```js
GW_DEPTH.getConflictArticles(conflictId, days=7)  // Articles RSS récents pour un conflit
GW_DEPTH.getRecentSources(conflictId, days)       // Sources distinctes qui ont parlé du conflit
GW_DEPTH.detectActiveSignals(c)                   // Statut live des indicateurs (activated/monitoring/quiet)
GW_DEPTH.detectScenarioTriggers(c)                // Statut des déclencheurs par scénario
GW_DEPTH.getResearchAngles(c)                     // Questions de recherche spécifiques au conflit
GW_DEPTH.getOperationalActions(c)                 // Actions BF concrètes triées par priorité
GW_DEPTH.statusBadge(status)                      // Badge HTML du statut
GW_DEPTH.articleLine(article, opts)               // Affichage compact d'un article
GW_DEPTH.crossRefBlock(c)                         // Boutons cross-ref vers Brief/Scen/Indic/Impact
GW_DEPTH.recentArticlesBlock(conflictId, days, max)
GW_DEPTH.liveSignalsBlock(c)
GW_DEPTH.researchAnglesBlock(c)
GW_DEPTH.actionsBlock(c)
```

### Pages enrichies par GW_DEPTH
- **Briefs (renderBriefs)** : 6 couches — Décideur · Analyste · Statut LIVE indicateurs · Citations RSS · Pistes recherche · Actions BF
- **Scénarios (renderScenarios)** : statut déclencheur (DORMANT/PARTIEL/ACTIVÉ) par scénario, articles RSS qui activent
- **Indicateurs (renderIndicators)** : compteurs Activés/Monitoring/Calmes + badge statut par signal + détails articles
- **Reconfigurations (renderReconfig)** : phase d'avancement (LATENT/EN COURS/EN ACCÉLÉRATION) + articles qui matérialisent
- **Impact BF (renderImpactBF)** : articles RSS qui matérialisent l'impact + actions opérationnelles
- **Analyses (renderAnalyses)** : panneau « Anomalies détectées & insights automatiques » avec lecture interprétative

### Heuristique d'activation (ex. signaux 24-72h)
1. Extraction de mots-clés du texte de l'indicateur (mots ≥5 lettres, sans stopwords)
2. Recherche dans les articles 24h pour ce conflit
3. Statut : `activated` si match ≥1 · `monitoring` si articles RSS récents existent (sans match) · `quiet` sinon

## ⚡ Module GW_INTEL — Intelligence stratégique avancée

Bloc IIFE situé juste avant `renderDashboard()` dans `app.js`. Expose 4 fonctionnalités :

### 1. IMS-BF — Indice de Menace Stratégique Burkina Faso
- `GW_INTEL.computeIMS()` → `{score:0-100, level, color, dimensions, ...}`
- 6 dimensions pondérées : Sécuritaire (25%) + Diplomatique (20%) + Économique (20%) + Cohésion (15%) + Régional (10%) + Informationnel (10%)
- Fenêtre glissante 7 jours, recalcul à chaque RSS
- `GW_INTEL.renderIMSGauge('ims-gauge')` → SVG circulaire premium + sparkline 30j
- Historique stocké dans localStorage clé `gw_ims_history`
- Appelée en tête de `renderDashboard()`

### 2. BQS — Brief Quotidien Stratégique
- Page `data-page="bqs"` accessible via nav
- `GW_INTEL.buildBQS()` → top 5 articles 24h + implications BF + indicateurs J+1→J+7
- Score articles : `_bf×30 + Burkina×25 + Sahel×18 + CEDEAO×12 + majeur×20 + ...`
- Implications BF auto-générées par patterns regex
- **Export PDF A4** : `GW_INTEL.exportBQSPDF(bqs)` (bandeau IMS, top 5, indicateurs, méthodologie)
- **Export Word (.doc)** : `GW_INTEL.exportBQSDOCX(bqs)` (HTML+Word XML, ouvrable dans Microsoft Word)

### 3. Cotes de fiabilité OTAN (A1-F6)
- Lettre A-F pour la **source** (`reliabilityLetter(item)`) basée sur `SOURCE_RATING` (table de 30+ sources connues)
- Chiffre 1-6 pour la **crédibilité** (`credibilityNum(item)`) calculée par corroboration multi-sources
- `GW_INTEL.reliabilityChip(item, {compact})` → badge HTML stylisé
- Affiché dans `renderNewsList()` à côté de chaque article

### 5. MATRICE D'IMPACT MONDIAL — 35 canaux affectant le BF
- Page `data-page="impact_radar"` accessible via nav (badge "35")
- `GW_INTEL.IMPACT_CHANNELS` : taxonomie de 35 canaux d'impact sur 6 catégories :
  - **Sécuritaire** (5) : sahel_jihad, coastal_spillover, mercenaries_pmcs, arms_trafficking, drone_warfare
  - **Diplomatique** (7) : cedeao_pressure, france_fr_relations, russia_pivot, china_engagement, gulf_powers, usa_africom, un_unsc
  - **Économique** (7) : gold_market, cotton_textile, oil_energy, fcfa_currency, food_security, mining_commodities, aid_sanctions
  - **Sociopolitique** (5) : coups_juntas_global, democracy_setback, migration_flows, religious_dynamics, ethnic_tensions
  - **Ruptures stratégiques** (5) : brics_global_south, info_warfare, cyber_attacks, climate_security, pandemics_health
  - **Théâtres majeurs** (6) : ukraine_russia, middle_east, china_taiwan, sudan_horn, lake_chad, libya_chaos
- Chaque canal : `{id, cat, label, icon, color, level, patterns[], themes[], questions[]}`
- Niveau d'impact : `direct | proximité | indirect | systémique`
- `GW_INTEL.detectChannels(item)` retourne les canaux activés par un article
- `GW_INTEL.aggregateChannels(items)` retourne `{channel, count, items}` pour tous les canaux
- `GW_INTEL.renderImpactRadar()` : rendu page complète avec :
  - Score d'exposition par catégorie (compteurs colorés)
  - Top 5 signaux forts (cards cliquables, scroll vers le canal)
  - Vue complète par catégorie (canaux actifs avec articles + thèmes + questions)
- **Pour chaque canal actif** : 3 thèmes de recherche suggérés + 2-3 questions analytiques

### 4. Veille adversariale
- Page `data-page="adversarial"` accessible via nav
- `GW_INTEL.classifyBlock(item)` → un de : `occident_fr | occident_us | russie | golfe_mo | chine | turquie | afrique | bf_local | autre`
- Détection des 6 narratives types : pro-AES, anti-AES, pro/anti-Russie, pro/anti-France
- 8 blocs définis dans `BLOCKS` avec patterns d'URL et couleurs
- Affichage : répartition en cards + narratives détectées + détail par bloc

### Important
- `window.NEWS_STATE = NEWS_STATE` est exposé après la ligne `const NEWS_STATE = ...` pour que GW_INTEL accède aux articles RSS
- Le Router gère les pages `bqs` et `adversarial` (RSS auto-refresh inclus)
- Re-render automatique de bqs/adversarial après `loadNews()`



## 🎯 Contexte & auteur
- **Auteur :** Chercheur en sciences politiques, CNES Burkina Faso
- **Objectif :** Observatoire géopolitique "think-tank grade" — veille conflits, alertes, chronologie, analyse mondiale
- **Site en ligne :** https://sawadogorachad-coder.github.io/geowatch/
- **Dépôt GitHub :** https://github.com/sawadogorachad-coder/geowatch
- **Source locale :** `C:\CLAUDE\geowatch-v2\`
- **Déploiement :** GitHub Pages (auto via Actions sur push)

---

## 🏗️ Architecture technique

**Type :** SPA (Single Page Application) — HTML/CSS/JS pur, zéro backend, zéro framework

### Fichiers clés
| Fichier | Rôle |
|---------|------|
| `index.html` | Structure HTML complète — toutes les `<section data-page="...">` |
| `app.js` | Logique applicative (~2700+ lignes) — routeur, DB, RSS, rendu |
| `data.js` → `data5.js` | Données conflits seed (historiques) |
| `sources.js` | Flux RSS des think tanks |
| `geo.js` | Données géographiques pays |

### Persistance
```javascript
const DB = {
  k: 'geowatch_v3',   // clé localStorage
  get()  // lit localStorage, initialise avec seed si vide
  save() // écrit dans localStorage
  add(coll, item) // ajoute dans une collection
  del(coll, id)   // supprime par id
}
// Collections : conflicts, countries, events, alerts, sources
```

### Routeur SPA
```javascript
const Router = {
  go(page)  // change la page visible, charge RSS si nécessaire
  cur()     // retourne la page active
}
// IMPORTANT: sélecteur des liens nav = 'a[data-page], button[data-page]'
// NE PAS utiliser '[data-page]' seul (capture les <section> → bug propagation)
```

---

## 📡 Système RSS

### Sources (dans sources.js) — 140+ sources organisées en 14 blocs
- **Bloc 1 — 🇧🇫 Burkina Faso local** (15) : Lefaso.net, Burkina24, Sidwaya, AIB, Wakat Séra, Le Pays, L'Économiste du Faso, Faso7, Mutations BF, Net Afrique, Radio Omega, L'Observateur Paalga, Minute BF, Faso24, Le Quotidien BF
- **Bloc 2 — 🌍 Sahel voisins** (14) : Maliweb, Malijet, Studio Tamani, Journal du Mali, Essor, Niger24, ANIP, Studio Kalangou, Tamtaminfo, Tchadinfos, Alwihda, Cridem, Alakhbar, Sahara Médias
- **Bloc 3 — 🌍 Afrique Ouest côtière** (15+) : Abidjan.net, Fratmat, Linfodrome, Koaci, Seneweb, Le Soleil, Dakaractu, Pressafrik, MyJoyOnline, GhanaWeb, Citi, La Nation Bénin, Bénin Web TV, Togo Infos, ATOP, Guineenews, Mediaguinee, Premium Times, Sahara Reporters, Vanguard, Punch
- **Bloc 4 — 🌍 Afrique centrale & Est** : Camer, Journal du Cameroun, Gabon Review, Radio Okapi, ActualitéCD, 7sur7, ADIAC, Daily Nation, The Standard, Addis Standard, Sudan Tribune, Dabanga, News24, Daily Maverick
- **Bloc 5 — 🌍 Maghreb** : TSA, El Watan, Le360, TelQuel, Médias 24, Hespress, Kapitalis, Webmanagercenter, Mada Masr, Libya Observer
- **Bloc 6 — 🧠 Think tanks africains** : ISS Africa, ACSS, WATHI, ACLED, Mo Ibrahim, Clingendael, KAS Africa, IPSS, FES Africa
- **Bloc 7 — 🇫🇷 Médias français de référence** : Le Monde (Inter/Éco/Afrique), France 24, Jeune Afrique, RFI Afrique/MO, TV5 Monde, Le Monde Diplo, APA, BBC Afrique, ONU Info FR, Libération, Figaro, Mediapart + think tanks (LGC, IRIS, Diploweb, IFRI, FRS)
- **Bloc 8 — 🇺🇸 Anglophones majeurs** : ISW, CSIS, Brookings, RAND, CFR, Chatham House, RUSI, IISS, ECFR, Carnegie, Atlantic Council, ICG, SIPRI + NYT, WaPo, FT, Foreign Policy, Economist, BBC, Guardian, NPR, DW
- **Bloc 9 — 🇷🇺 Russie** : TASS, RT FR, Sputnik Afrique, RIA Novosti
- **Bloc 10 — 🇨🇳 Chine** : Xinhua, CGTN, Global Times, China Daily, SCMP
- **Bloc 11 — 🇶🇦 Moyen-Orient/Golfe/Turquie** : Al Jazeera, Al Arabiya, Arab News, Al-Monitor, Times of Israel, Jerusalem Post, Haaretz, Daily Sabah, TRT World, Anadolu, Press TV, Tehran Times
- **Bloc 12 — 🇮🇳 Inde/Asie Sud** : The Hindu, The Wire, Dawn
- **Bloc 13 — 🌏 Asie/AmLat** : Nikkei, Japan Times, Bangkok Post, Jakarta Post, El País, Folha SP
- **Bloc 14 — 🆘 Humanitaire/OI** : ONU News, ReliefWeb (+BF +Mali), HRW, Amnesty, MSF, CICR, FMI, Banque Mondiale

Champs source : `{id, name, cat, region, lang, bloc, url, verified}` — `bloc` aligné avec `GW_INTEL.BLOCKS` pour la veille adversariale

### Cascade de proxies (5 niveaux)
```javascript
// Ordre : rss2json → allorigins(1) → allorigins(2) → corsproxy.io → thingproxy
async function fetchRSS(url)
async function loadNews()  // charge tous les flux, traduit EN→FR, détecte conflits
```

### Traduction automatique EN→FR
```javascript
async function translateToFr(text)        // Google gtx API (sans clé)
async function translateEnglishItems(items) // batch translate des articles EN
```

### État global RSS
```javascript
let NEWS_STATE = {
  items: [],        // articles chargés
  lastUpdate: null, // timestamp dernière MAJ
  autoTimer: null,  // timer auto-refresh (toutes les 10 min)
  nextRefresh: null,
  loading: false
}
```

### Auto-refresh — Système consolidé (4 niveaux)
1. **Démarrage** : `setTimeout(loadNews, 800)` dans DOMContentLoaded → première collecte RSS dès 0,8 s
2. **Timer principal — 10 min** : `startAutoRefresh()` relance `loadNews()` + `rerenderActivePage()`
   - Auto-refresh activé par défaut (sans dépendre du checkbox `news-auto`)
3. **Stale-check — 60 s** : timer secondaire qui re-render la page active sans relancer RSS
   - Met à jour les compteurs "il y a X min", les chrono, les badges
4. **Navigation** : `Router.go(page)` détecte si RSS stale (>5 min) et relance `loadNews()`

### Fonction centralisée `rerenderActivePage()`
Couvre TOUTES les pages dynamiques :
`dash · bqs · adversarial · impact_radar · alerts · sources · conflicts · worldwatch · events · news · briefs · scenarios · indicators · reconfig · impact_bf · analyses · countries`
→ Toute page reste vivante, même sans changement d'onglet.

---

## 🗺️ Pages et fonctions de rendu

| Page (`data-page`) | Fonction principale | Live ? |
|---------------------|--------------------|----|
| `dash` | `renderDash()` | ✅ RSS + localStorage |
| `news` | `renderNewsList()` | ✅ RSS |
| `alerts` | `renderAlerts()` | ✅ RSS + localStorage |
| `conflicts` | `renderConflicts()` | ✅ localStorage |
| `events` | `renderEvents()` | ✅ RSS + localStorage fusionnés |
| `worldwatch` | `renderWorldWatch()` | ✅ détection auto RSS |
| `sources` | `renderSources()` | ✅ activité RSS |
| `analysis` | `renderAnalysis()` | ✅ localStorage |
| `admin` | (panel admin) | ✅ CRUD localStorage |

---

## 🌍 Veille Mondiale (WorldWatch)

### Dictionnaires
```javascript
const WW_COUNTRIES = { 'Burkina Faso':['burkina','ouagadougou'], ... } // ~80 pays
const WW_TENSION_KEYWORDS = {
  military: ['attaque','frappe','offensive','bombardement','missile',...],
  diplomatic: ['sanctions','expulsion','ambassadeur','rupture',...],
  humanitarian: ['famine','déplacés','réfugiés','catastrophe',...],
  // ...
}
```

### Détection
```javascript
function wwExtract(item)           // extrait pays + types de tensions d'un article
function wwDetectBilateral(items)  // paires de pays (≥2 articles communs)
function wwDetectHotZones(items)   // zones chaudes (≥3 articles, score sévérité)
function renderWorldWatch()        // rendu page + mise à jour badge sidebar
function wwUpdateBadge()           // badge rouge sur nav item
```

---

## 🚨 Alertes

### Alertes dérivées du RSS
```javascript
function getDerivedAlertsFromNews()  // génère alertes live depuis articles _major
// Fusionne avec alertes manuelles localStorage dans renderAlerts()
```

### Topbar freshness
```html
<!-- dans index.html -->
<button id="tb-freshness">
  <span id="tb-freshness-dot"></span>   <!-- point couleur : vert/orange/rouge -->
  <span id="tb-freshness-txt">...</span> <!-- âge + nb articles -->
</button>
```
```javascript
function updateLastUpdateLabel()  // met à jour les indicateurs de fraîcheur
```

---

## 📊 Dashboard

### KPIs
- `#kpi-conflicts` : conflits actifs
- `#kpi-events` : événements
- `#kpi-alerts` : alertes critiques
- `#kpi-sources` : sources actives
- `#kpi-rss-24h` : articles RSS 24h (**LIVE**)
- `#kpi-bf` : articles Burkina Faso 24h (**LIVE**)

### Sections live
- `#dash-rss-recent` : 8 derniers articles RSS
- `#dash-ww-preview` : tensions auto-détectées

### Bug corrigé important
```javascript
// ERREUR : alertsCrit (ancienne variable)
// CORRECT : critAlerts
if(critAlerts > 0){ tbA.style.display='inline-flex'; ... }
```

---

## 📅 Chronologie (Events)

### Fusion données
```javascript
function getRSSEvents()  // convertit articles RSS en événements (avec sévérité)
function renderEvents()  // fusionne getRSSEvents() + DB.get().events
```

### Filtres
```javascript
let EV_STATE = {
  conflict: 'all',
  type: 'all',
  source: 'all'  // 'all' | 'rss' | 'manual'
}
```

### Sévérité RSS automatique
- `rupture` dans titre → 9
- `diplomatique/accord` → 7
- `militaire/attaque` → 6
- `burkina/ouagadougou` → 5
- défaut → 4

---

## 🔧 Panel Admin

### Accès : cliquer "Admin" dans la sidebar

### Fonctions CRUD
```javascript
// Conflits
function adminSaveConflict()   // ajoute/modifie conflit
function adminDeleteConflict() // supprime

// Événements, Alertes : même pattern

// Export
function _adminExportJSON()    // télécharge le JSON complet
```

### Piège connu
```javascript
// CORRECT (garde le contexte document)
const g = id => document.getElementById(id);

// INCORRECT (perd le 'this' context)
const banal = document.getElementById;  // ← NE PAS FAIRE
```

---

## 📈 Graphiques (Chart.js)

### Configuration par défaut
```javascript
function chartOpts(extra={})  // options communes (dark theme, grille)
function axT(text)            // titre d'axe lisible
function chartInsight(canvasId, methodHTML, lectureHTML, color)  // panneau "Comment lire"
```

### Règle UX graphiques
- **Toujours** ajouter `chartInsight()` sous chaque graphique
- Titres d'axes explicites avec `axT()`
- Légende visible et lisible (couleurs contrastées)
- Palette : vert `#22c55e` / orange `#f59e0b` / rouge `#ef4444` / bleu `#3b82f6`

---

## 🚀 Déploiement

### Workflow
1. Modifier `app.js` et/ou `index.html` sur cet ordinateur
2. Upload sur GitHub : https://github.com/sawadogorachad-coder/geowatch
3. GitHub Actions déploie automatiquement en ~2 min sur GitHub Pages

### Upload depuis Mac
```bash
# Première fois
git clone https://github.com/sawadogorachad-coder/geowatch.git
cd geowatch

# Copier les fichiers modifiés depuis C:\CLAUDE\geowatch-v2\
# puis :
git add app.js index.html
git commit -m "description de la mise à jour"
git push
```

### Depuis GitHub.com (petits correctifs)
- Aller sur le fichier → icône crayon ✏️ → modifier → "Commit changes"

---

## ⚠️ Points critiques à ne pas oublier

1. **Sélecteur nav** : toujours `a[data-page], button[data-page]` (jamais `[data-page]` seul)
2. **Variable alertes** : `critAlerts` (pas `alertsCrit`)
3. **getElementById** : utiliser `const g = id => document.getElementById(id)`
4. **impact_bf** : utiliser `_impactBFSynthese(c)` pour compatibilité ancienne/nouvelle structure
5. **RSS auto-start** : `setTimeout(() => loadNews(), 800)` dans DOMContentLoaded
6. **Graphiques** : toujours ajouter un panneau d'explication `chartInsight()`

---

## 🎨 Thème visuel
- Fond principal : `#030712` (noir profond)
- Sidebar : `#0a1220`
- Cards : `#0c1426`
- Texte principal : `#e2e8f0`
- Texte secondaire : `#94a3b8`
- Accent bleu : `#3b82f6`
- Police : `'Segoe UI', system-ui, sans-serif`
