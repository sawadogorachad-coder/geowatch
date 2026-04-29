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
     ★ SOURCES VÉRIFIÉES EN DIRECT (2026-04-29) — 100% fonctionnelles ★
     ============================================================ */

  // 🌍 INTERNATIONAL — vérifiés
  {id:'rss_bbc',       name:'BBC World',           cat:'geopol',  region:'UK',  url:'https://feeds.bbci.co.uk/news/world/rss.xml',           verified:true},
  {id:'rss_bbc_afr',   name:'BBC Afrique (FR)',    cat:'africa',  region:'UK',  url:'https://feeds.bbci.co.uk/afrique/rss.xml',              verified:true},
  {id:'rss_bbc_africa',name:'BBC Africa (EN)',     cat:'africa',  region:'UK',  url:'https://feeds.bbci.co.uk/news/world/africa/rss.xml',    verified:true},
  {id:'rss_bbc_biz',   name:'BBC Business',        cat:'economic',region:'UK',  url:'https://feeds.bbci.co.uk/news/business/rss.xml',        verified:true},
  {id:'rss_aje',       name:'Al Jazeera English',  cat:'geopol',  region:'QA',  url:'https://www.aljazeera.com/xml/rss/all.xml',             verified:true},
  {id:'rss_npr',       name:'NPR World',           cat:'geopol',  region:'US',  url:'https://feeds.npr.org/1004/rss.xml',                    verified:true},

  // 🏛️ DIPLOMATIE — vérifiés
  {id:'rss_unnewsfr',  name:'ONU Info (FR)',       cat:'diplomatic',region:'INT',url:'https://news.un.org/feed/subscribe/fr/news/all/rss.xml',verified:true},
  {id:'rss_unnews',    name:'UN News (EN)',        cat:'diplomatic',region:'INT',url:'https://news.un.org/feed/subscribe/en/news/all/rss.xml',verified:true},

  // 🧠 THINK TANKS FR — vérifiés
  {id:'rss_lgc',       name:'Le Grand Continent',  cat:'thinktank',region:'EU', url:'https://legrandcontinent.eu/fr/feed/',                  verified:true},
  {id:'rss_iris',      name:'IRIS France',         cat:'thinktank',region:'FR', url:'https://www.iris-france.org/feed/',                     verified:true},
  {id:'rss_diplo',     name:'Diploweb',            cat:'thinktank',region:'FR', url:'https://www.diploweb.com/spip.php?page=backend',        verified:true},

  /* ============================================================
     SOURCES NON VÉRIFIÉES (à tester via les proxies CORS).
     Peuvent fonctionner sur le site déployé (HTTPS) mais bloquées
     en accès direct depuis Claude Code. À conserver pour activation
     manuelle par l'utilisateur quand le site est en ligne.
     ============================================================ */
  {id:'rss_lemonde',   name:'Le Monde International (à tester)',cat:'geopol',region:'FR',url:'https://www.lemonde.fr/international/rss_full.xml',verified:false},
  {id:'rss_lemondeeco',name:'Le Monde Économie (à tester)',     cat:'economic',region:'FR',url:'https://www.lemonde.fr/economie/rss_full.xml',verified:false},
  {id:'rss_f24fr',     name:'France 24 FR (à tester)',          cat:'geopol',region:'FR',url:'https://www.france24.com/fr/rss',              verified:false},
  {id:'rss_dw',        name:'Deutsche Welle (à tester)',        cat:'geopol',region:'DE',url:'https://rss.dw.com/rdf/rss-en-world',          verified:false},
  {id:'rss_guardian',  name:'The Guardian (à tester)',          cat:'geopol',region:'UK',url:'https://www.theguardian.com/world/rss',        verified:false},
  {id:'rss_jeuneafr',  name:'Jeune Afrique (à tester)',         cat:'africa',region:'FR',url:'https://www.jeuneafrique.com/feed/',           verified:false},
  {id:'rss_rfiafr',    name:'RFI Afrique (à tester)',           cat:'africa',region:'FR',url:'https://www.rfi.fr/fr/afrique/rss',            verified:false},
  {id:'rss_tv5afr',    name:'TV5 Monde Afrique (à tester)',     cat:'africa',region:'FR',url:'https://information.tv5monde.com/afrique/rss.xml',verified:false},
  {id:'rss_apa',       name:'APA News Afrique (à tester)',      cat:'africa',region:'AF',url:'https://apanews.net/feed/',                    verified:false},
  {id:'rss_reliefweb', name:'ReliefWeb (à tester)',             cat:'humanitarian',region:'INT',url:'https://reliefweb.int/updates/rss.xml', verified:false},
  {id:'rss_hrw',       name:'Human Rights Watch (à tester)',    cat:'humanitarian',region:'US',url:'https://www.hrw.org/rss/news',           verified:false},
  {id:'rss_lmd',       name:'Le Monde Diplomatique (à tester)', cat:'diplomatic',region:'FR',url:'https://www.monde-diplomatique.fr/recents.xml',verified:false}
];

/* PAR DÉFAUT, on n'active QUE les 11 sources VÉRIFIÉES EN DIRECT.
   Couverture : géopol mondiale (BBC + AJE + NPR), Afrique (BBC Afrique FR + BBC Africa),
                économie (BBC Business), diplomatie (ONU FR + EN),
                think tanks FR (Le Grand Continent + IRIS + Diploweb) */
const RSS_DEFAULT_ACTIVE = [
  'rss_bbc','rss_bbc_afr','rss_bbc_africa','rss_bbc_biz',
  'rss_aje','rss_npr',
  'rss_unnewsfr','rss_unnews',
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
