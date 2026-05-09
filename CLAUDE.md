# GéoWatch v3 — Mémoire projet pour Claude Code

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

### Sources (dans sources.js)
Think tanks : ICG, ACLED, ISW, IRIS, IFRI, FRS, Le Grand Continent, BBC Afrique, RFI, etc.

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

### Auto-refresh
- Au démarrage : `setTimeout(() => loadNews(), 800)` dans DOMContentLoaded
- Toutes les 10 min via `startAutoRefresh()`
- À chaque navigation vers : `news`, `alerts`, `dash`, `sources`, `conflicts`, `worldwatch`, `events`

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
