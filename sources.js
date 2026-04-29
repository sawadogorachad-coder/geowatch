/* ==========================================================================
   GéoWatch — Sources RSS étendues (think tanks, éco, diplo, humanitaire, Afrique)
   ========================================================================== */

/* === SOURCES RSS — VÉRIFIÉES EN DIRECT le 2026-04-29 ===
   verified:true  → flux testé, répond 200, contenu RSS valide à jour
   verified:false → flux dont l'accès direct est bloqué (anti-bot, 403, ECONNREFUSED)
                    mais qui peut fonctionner via certains proxies CORS
*/
const RSS_SOURCES_FULL = [
  /* ============================================================
     ★ SOURCES FRANÇAISES — PRIORITÉ (langue: FR) ★
     ============================================================ */

  // 🌍 PRESSE INTERNATIONALE EN FRANÇAIS — vérifiées
  {id:'rss_bbc_afr',   name:'BBC Afrique',         cat:'africa',   region:'FR', lang:'fr', url:'https://feeds.bbci.co.uk/afrique/rss.xml',              verified:true},
  {id:'rss_unnewsfr',  name:'ONU Info (FR)',        cat:'diplomatic',region:'FR',lang:'fr', url:'https://news.un.org/feed/subscribe/fr/news/all/rss.xml',verified:true},

  // 🧠 THINK TANKS FRANCOPHONES — vérifiés
  {id:'rss_lgc',       name:'Le Grand Continent',  cat:'thinktank',region:'FR', lang:'fr', url:'https://legrandcontinent.eu/fr/feed/',                  verified:true},
  {id:'rss_iris',      name:'IRIS France',          cat:'thinktank',region:'FR', lang:'fr', url:'https://www.iris-france.org/feed/',                     verified:true},
  {id:'rss_diplo',     name:'Diploweb',             cat:'thinktank',region:'FR', lang:'fr', url:'https://www.diploweb.com/spip.php?page=backend',        verified:true},

  // 🌍 SOURCES FRANCOPHONES — à tester (fonctionnent sur HTTPS déployé)
  {id:'rss_lemonde',   name:'Le Monde International', cat:'geopol',region:'FR', lang:'fr', url:'https://www.lemonde.fr/international/rss_full.xml',     verified:false},
  {id:'rss_lemondeeco',name:'Le Monde Économie',      cat:'economic',region:'FR',lang:'fr', url:'https://www.lemonde.fr/economie/rss_full.xml',          verified:false},
  {id:'rss_f24fr',     name:'France 24',              cat:'geopol',region:'FR', lang:'fr', url:'https://www.france24.com/fr/rss',                       verified:false},
  {id:'rss_jeuneafr',  name:'Jeune Afrique',          cat:'africa',region:'FR', lang:'fr', url:'https://www.jeuneafrique.com/feed/',                    verified:false},
  {id:'rss_rfiafr',    name:'RFI Afrique',            cat:'africa',region:'FR', lang:'fr', url:'https://www.rfi.fr/fr/afrique/rss',                     verified:false},
  {id:'rss_tv5afr',    name:'TV5 Monde Afrique',      cat:'africa',region:'FR', lang:'fr', url:'https://information.tv5monde.com/afrique/rss.xml',      verified:false},
  {id:'rss_lmd',       name:'Le Monde Diplomatique',  cat:'diplomatic',region:'FR',lang:'fr',url:'https://www.monde-diplomatique.fr/recents.xml',       verified:false},
  {id:'rss_apa',       name:'APA News Afrique',        cat:'africa',region:'AF', lang:'fr', url:'https://apanews.net/feed/',                            verified:false},

  /* ============================================================
     SOURCES EN ANGLAIS — optionnelles (activables manuellement)
     Utiles pour la couverture mondiale mais contenu en anglais
     ============================================================ */
  {id:'rss_bbc',       name:'BBC World (EN)',       cat:'geopol',  region:'UK',  lang:'en', url:'https://feeds.bbci.co.uk/news/world/rss.xml',           verified:true},
  {id:'rss_bbc_africa',name:'BBC Africa (EN)',      cat:'africa',  region:'UK',  lang:'en', url:'https://feeds.bbci.co.uk/news/world/africa/rss.xml',    verified:true},
  {id:'rss_bbc_biz',   name:'BBC Business (EN)',    cat:'economic',region:'UK',  lang:'en', url:'https://feeds.bbci.co.uk/news/business/rss.xml',        verified:true},
  {id:'rss_aje',       name:'Al Jazeera (EN)',      cat:'geopol',  region:'QA',  lang:'en', url:'https://www.aljazeera.com/xml/rss/all.xml',             verified:true},
  {id:'rss_npr',       name:'NPR World (EN)',       cat:'geopol',  region:'US',  lang:'en', url:'https://feeds.npr.org/1004/rss.xml',                    verified:true},
  {id:'rss_unnews',    name:'ONU News (EN)',        cat:'diplomatic',region:'INT',lang:'en', url:'https://news.un.org/feed/subscribe/en/news/all/rss.xml',verified:true},
  {id:'rss_reliefweb', name:'ReliefWeb (EN)',       cat:'humanitarian',region:'INT',lang:'en',url:'https://reliefweb.int/updates/rss.xml',               verified:false},
  {id:'rss_hrw',       name:'Human Rights Watch (EN)',cat:'humanitarian',region:'US',lang:'en',url:'https://www.hrw.org/rss/news',                      verified:false},
  {id:'rss_dw',        name:'Deutsche Welle (EN)',  cat:'geopol',region:'DE',   lang:'en', url:'https://rss.dw.com/rdf/rss-en-world',                   verified:false},
  {id:'rss_guardian',  name:'The Guardian (EN)',    cat:'geopol',region:'UK',   lang:'en', url:'https://www.theguardian.com/world/rss',                 verified:false}
];

/* PAR DÉFAUT : SOURCES FRANÇAISES UNIQUEMENT
   - BBC Afrique (FR), ONU Info (FR), Le Grand Continent, IRIS France, Diploweb
   → 5 sources 100% francophones et vérifiées
   Les sources anglophones sont disponibles mais inactives par défaut.
   Activez-les manuellement dans la page Flux RSS si besoin. */
const RSS_DEFAULT_ACTIVE = [
  'rss_bbc_afr',
  'rss_unnewsfr',
  'rss_lgc','rss_iris','rss_diplo'
];

/* Catégorisation des actualités par mots-clés */
const NEWS_CATEGORIES = {
  economic:   ['inflation','sanctions','taux','dollar','euro','baril','pétrole','gas','gas','obligation','marché','bourse','récession','croissance','PIB','OPEC','BRICS','dette','déficit','budget','commerce'],
  diplomatic: ['sommet','rencontre','traité','accord','signature','médiation','négociation','ambassade','onu','conseil','résolution','vote','reconnaissance','sanctions','diplomatie'],
  military:   ['frappe','missile','drone','attaque','offensive','combat','militaire','armée','soldat','terroriste','jihad','attentat','assassinat','bombarde','guerre','front'],
  humanitarian:['réfugiés','déplacés','famine','cholera','aide','humanitaire','crise','victimes','onu','msf','hcr','ipc','famine','catastrophe'],
  political:  ['élection','vote','président','premier ministre','coup','manifestation','opposition','régime','démocratie','autoritaire','référendum','constitution']
};

/* Mots-clés ÉVÉNEMENTS MAJEURS (déclenchent une alerte renforcée + bandeau + notif système) */
const MAJOR_EVENT_KEYWORDS = {
  // Strikes / escalations / ruptures
  rupture: ['attentat majeur','attaque massive','frappe massive','frappe nucléaire','prise de capitale','coup d\'état','coup d\'etat','assassinat','massacre','offensive majeure','escalade','breakthrough','ligne rouge','franchissement','effondrement','blocus','fermeture détroit','fermeture du détroit','famine déclarée','génocide','massive strike','major attack','assassinated','seized','captured the capital','coup','overthrow','breakthrough','red line','collapse','blockade'],
  // Diplomatie haut niveau
  diplo_majeur: ['sommet','traité de paix','cessez-le-feu','accord historique','rupture diplomatique','expulsion ambassadeur','rappel ambassadeur','reconnaissance','adhésion otan','adhésion brics','sanctions massives','peace treaty','ceasefire','historic agreement','recognition','massive sanctions'],
  // Crises
  crise: ['crise pétrolière','choc pétrolier','krach','effondrement monétaire','panique','contagion','catastrophe','tsunami','séisme','pandémie','oil shock','market crash','currency collapse','contagion','disaster']
};

/* exposer */
window.GW_DATA = window.GW_DATA || {};
window.GW_DATA.RSS_SOURCES_FULL = RSS_SOURCES_FULL;
window.GW_DATA.RSS_DEFAULT_ACTIVE = RSS_DEFAULT_ACTIVE;
window.GW_DATA.NEWS_CATEGORIES = NEWS_CATEGORIES;
window.GW_DATA.MAJOR_EVENT_KEYWORDS = MAJOR_EVENT_KEYWORDS;
