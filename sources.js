/* ==========================================================================
   GéoWatch — Sources RSS étendues (150+ sources mondiales)
   ============================================================================
   Organisation : 14 blocs géographiques + think tanks
   Champs :
     id        : identifiant unique
     name      : nom affiché
     cat       : catégorie thématique (bf_local, sahel, ouest_afrique, etc.)
     region    : code zone (BF, ML, NE, TD, CI, SN, GH, NG, RU, CN, IN, US, FR…)
     lang      : fr | en | ar | es
     bloc      : bloc géopolitique pour veille adversariale
     url       : URL du flux RSS
     verified  : true si testé en direct, false sinon (peut marcher via proxy)
   ============================================================================ */

const RSS_SOURCES_FULL = [

  /* =========================================================================
     ╔═══════════════════════════════════════════════════════════════╗
     ║  🇧🇫 BLOC 1 : BURKINA FASO — SOURCES LOCALES (priorité)        ║
     ╚═══════════════════════════════════════════════════════════════╝
     ========================================================================= */
  {id:'rss_lefaso',     name:'Lefaso.net',                  cat:'bf_local', region:'BF', lang:'fr', bloc:'bf_local', url:'https://lefaso.net/spip.php?page=backend',                  verified:true},
  {id:'rss_burkina24',  name:'Burkina24',                   cat:'bf_local', region:'BF', lang:'fr', bloc:'bf_local', url:'https://burkina24.com/feed/',                                verified:false},
  {id:'rss_sidwaya',    name:'Sidwaya',                     cat:'bf_local', region:'BF', lang:'fr', bloc:'bf_local', url:'https://www.sidwaya.info/feed/',                             verified:false},
  {id:'rss_aib',        name:'AIB — Agence Information BF', cat:'bf_local', region:'BF', lang:'fr', bloc:'bf_local', url:'https://www.aib.media/feed/',                                verified:false},
  {id:'rss_wakatsera',  name:'Wakat Séra',                  cat:'bf_local', region:'BF', lang:'fr', bloc:'bf_local', url:'https://www.wakatsera.com/feed/',                            verified:false},
  {id:'rss_lepays_bf',  name:'Le Pays (BF)',                cat:'bf_local', region:'BF', lang:'fr', bloc:'bf_local', url:'https://lepays.bf/feed/',                                    verified:false},
  {id:'rss_eco_faso',   name:'L\'Économiste du Faso',       cat:'bf_local', region:'BF', lang:'fr', bloc:'bf_local', url:'https://www.leconomistedufaso.com/feed/',                    verified:false},
  {id:'rss_faso7',      name:'Faso7',                       cat:'bf_local', region:'BF', lang:'fr', bloc:'bf_local', url:'https://faso7.com/feed/',                                    verified:false},
  {id:'rss_mutations',  name:'Mutations BF',                cat:'bf_local', region:'BF', lang:'fr', bloc:'bf_local', url:'https://mutationsbf.net/feed/',                              verified:false},
  {id:'rss_netafrique', name:'Net Afrique (BF)',            cat:'bf_local', region:'BF', lang:'fr', bloc:'bf_local', url:'https://netafrique.net/feed/',                               verified:false},
  {id:'rss_omega',      name:'Radio Omega Burkina',         cat:'bf_local', region:'BF', lang:'fr', bloc:'bf_local', url:'https://radioomegaburkina.com/feed/',                        verified:false},
  {id:'rss_observ_bf',  name:'L\'Observateur Paalga',       cat:'bf_local', region:'BF', lang:'fr', bloc:'bf_local', url:'https://www.lobservateur.bf/feed/',                          verified:false},
  {id:'rss_minute_bf',  name:'Minute BF',                   cat:'bf_local', region:'BF', lang:'fr', bloc:'bf_local', url:'https://www.minute.bf/feed/',                                verified:false},
  {id:'rss_bf24',       name:'Faso24',                      cat:'bf_local', region:'BF', lang:'fr', bloc:'bf_local', url:'https://www.faso24.com/feed/',                               verified:false},
  {id:'rss_quotidien_bf',name:'Le Quotidien (BF)',          cat:'bf_local', region:'BF', lang:'fr', bloc:'bf_local', url:'https://lequotidienbf.com/feed/',                            verified:false},

  /* =========================================================================
     ╔═══════════════════════════════════════════════════════════════╗
     ║  🌍 BLOC 2 : SAHEL VOISINS (Mali, Niger, Tchad, Mauritanie)   ║
     ╚═══════════════════════════════════════════════════════════════╝
     ========================================================================= */
  // Mali
  {id:'rss_maliweb',    name:'Maliweb',                     cat:'sahel',    region:'ML', lang:'fr', bloc:'sahel',    url:'https://www.maliweb.net/feed',                                verified:false},
  {id:'rss_malijet',    name:'Malijet',                     cat:'sahel',    region:'ML', lang:'fr', bloc:'sahel',    url:'https://malijet.com/feed/',                                  verified:false},
  {id:'rss_studio_tam', name:'Studio Tamani (Mali)',        cat:'sahel',    region:'ML', lang:'fr', bloc:'sahel',    url:'https://www.studiotamani.org/feed/',                         verified:false},
  {id:'rss_journ_mali', name:'Journal du Mali',             cat:'sahel',    region:'ML', lang:'fr', bloc:'sahel',    url:'https://www.journaldumali.com/feed/',                        verified:false},
  {id:'rss_essor_mali', name:'L\'Essor (Mali)',             cat:'sahel',    region:'ML', lang:'fr', bloc:'sahel',    url:'https://www.essor.ml/feed/',                                 verified:false},
  // Niger
  {id:'rss_niger24',    name:'Niger24',                     cat:'sahel',    region:'NE', lang:'fr', bloc:'sahel',    url:'https://www.niger24.net/feed/',                              verified:false},
  {id:'rss_anip_niger', name:'ANIP — Agence Nigérienne de Presse',cat:'sahel',region:'NE',lang:'fr',bloc:'sahel',    url:'https://www.anip.ne/feed/',                                  verified:false},
  {id:'rss_kalangou',   name:'Studio Kalangou (Niger)',     cat:'sahel',    region:'NE', lang:'fr', bloc:'sahel',    url:'https://www.studiokalangou.org/feed/',                       verified:false},
  {id:'rss_tamtam',     name:'Tamtaminfo (Niger)',          cat:'sahel',    region:'NE', lang:'fr', bloc:'sahel',    url:'https://www.tamtaminfo.com/feed/',                           verified:false},
  // Tchad
  {id:'rss_tchadinfos', name:'Tchadinfos',                  cat:'sahel',    region:'TD', lang:'fr', bloc:'sahel',    url:'https://tchadinfos.com/feed/',                               verified:false},
  {id:'rss_alwihda',    name:'Alwihda Info (Tchad)',        cat:'sahel',    region:'TD', lang:'fr', bloc:'sahel',    url:'https://www.alwihdainfo.com/feed.html',                      verified:false},
  {id:'rss_journ_tch',  name:'Journal du Tchad',            cat:'sahel',    region:'TD', lang:'fr', bloc:'sahel',    url:'https://www.journaldutchad.com/feed/',                       verified:false},
  // Mauritanie
  {id:'rss_cridem',     name:'Cridem (Mauritanie)',         cat:'sahel',    region:'MR', lang:'fr', bloc:'sahel',    url:'https://www.cridem.org/feed.php',                            verified:false},
  {id:'rss_alakhbar',   name:'Alakhbar Info (Mauritanie)',  cat:'sahel',    region:'MR', lang:'fr', bloc:'sahel',    url:'https://fr.alakhbar.info/feed/',                             verified:false},
  {id:'rss_sahara_med', name:'Sahara Médias',               cat:'sahel',    region:'MR', lang:'fr', bloc:'sahel',    url:'https://fr.saharamedias.net/feed/',                          verified:false},

  /* =========================================================================
     ╔═══════════════════════════════════════════════════════════════╗
     ║  🌍 BLOC 3 : AFRIQUE DE L'OUEST CÔTIÈRE (corridor BF)         ║
     ╚═══════════════════════════════════════════════════════════════╝
     ========================================================================= */
  // Côte d'Ivoire
  {id:'rss_abidjan',    name:'Abidjan.net',                 cat:'ouest_afr',region:'CI', lang:'fr', bloc:'afrique',  url:'https://news.abidjan.net/rss.asp',                           verified:false},
  {id:'rss_fratmat',    name:'Fraternité Matin (CI)',       cat:'ouest_afr',region:'CI', lang:'fr', bloc:'afrique',  url:'https://www.fratmat.info/feed',                              verified:false},
  {id:'rss_linfodrome', name:'Linfodrome (CI)',             cat:'ouest_afr',region:'CI', lang:'fr', bloc:'afrique',  url:'https://www.linfodrome.com/feed',                            verified:false},
  {id:'rss_koaci',      name:'Koaci',                       cat:'ouest_afr',region:'CI', lang:'fr', bloc:'afrique',  url:'https://www.koaci.com/feed/',                                verified:false},
  // Sénégal
  {id:'rss_seneweb',    name:'Seneweb',                     cat:'ouest_afr',region:'SN', lang:'fr', bloc:'afrique',  url:'https://www.seneweb.com/news/rss.xml',                       verified:false},
  {id:'rss_lesoleil',   name:'Le Soleil (Sénégal)',         cat:'ouest_afr',region:'SN', lang:'fr', bloc:'afrique',  url:'https://lesoleil.sn/feed/',                                  verified:false},
  {id:'rss_dakaractu',  name:'Dakaractu',                   cat:'ouest_afr',region:'SN', lang:'fr', bloc:'afrique',  url:'https://www.dakaractu.com/feed.html',                        verified:false},
  {id:'rss_pressafrik', name:'Pressafrik (Sénégal)',        cat:'ouest_afr',region:'SN', lang:'fr', bloc:'afrique',  url:'https://www.pressafrik.com/rss.xml',                         verified:false},
  // Ghana (anglo)
  {id:'rss_myjoyonline',name:'MyJoyOnline (Ghana)',         cat:'ouest_afr',region:'GH', lang:'en', bloc:'afrique',  url:'https://www.myjoyonline.com/feed/',                          verified:false},
  {id:'rss_ghanaweb',   name:'GhanaWeb',                    cat:'ouest_afr',region:'GH', lang:'en', bloc:'afrique',  url:'https://www.ghanaweb.com/GhanaHomePage/rss/news.xml',        verified:false},
  {id:'rss_citi',       name:'Citi Newsroom (Ghana)',       cat:'ouest_afr',region:'GH', lang:'en', bloc:'afrique',  url:'https://citinewsroom.com/feed/',                             verified:false},
  // Bénin
  {id:'rss_lanation_bj',name:'La Nation (Bénin)',           cat:'ouest_afr',region:'BJ', lang:'fr', bloc:'afrique',  url:'https://lanation.bj/feed/',                                  verified:false},
  {id:'rss_beninwebtv', name:'Bénin Web TV',                cat:'ouest_afr',region:'BJ', lang:'fr', bloc:'afrique',  url:'https://beninwebtv.com/feed/',                               verified:false},
  // Togo
  {id:'rss_togoinfos',  name:'Togo Infos',                  cat:'ouest_afr',region:'TG', lang:'fr', bloc:'afrique',  url:'https://www.togofirst.com/fr/feed',                          verified:false},
  {id:'rss_atop',       name:'ATOP (Togo)',                 cat:'ouest_afr',region:'TG', lang:'fr', bloc:'afrique',  url:'https://www.atop.tg/feed/',                                  verified:false},
  // Guinée Conakry
  {id:'rss_guineenews', name:'Guineenews',                  cat:'ouest_afr',region:'GN', lang:'fr', bloc:'afrique',  url:'https://www.guineenews.org/feed/',                           verified:false},
  {id:'rss_mediaguinee',name:'Mediaguinee',                 cat:'ouest_afr',region:'GN', lang:'fr', bloc:'afrique',  url:'https://mediaguinee.org/feed/',                              verified:false},
  // Nigeria (anglo, voisin AES via Bénin)
  {id:'rss_premiumng',  name:'Premium Times (Nigeria)',     cat:'ouest_afr',region:'NG', lang:'en', bloc:'afrique',  url:'https://www.premiumtimesng.com/feed',                        verified:false},
  {id:'rss_saharang',   name:'Sahara Reporters (Nigeria)',  cat:'ouest_afr',region:'NG', lang:'en', bloc:'afrique',  url:'https://saharareporters.com/feed',                           verified:false},
  {id:'rss_vanguard',   name:'Vanguard (Nigeria)',          cat:'ouest_afr',region:'NG', lang:'en', bloc:'afrique',  url:'https://www.vanguardngr.com/feed/',                          verified:false},
  {id:'rss_punch',      name:'Punch (Nigeria)',             cat:'ouest_afr',region:'NG', lang:'en', bloc:'afrique',  url:'https://punchng.com/feed/',                                  verified:false},

  /* =========================================================================
     ╔═══════════════════════════════════════════════════════════════╗
     ║  🌍 BLOC 4 : AFRIQUE CENTRALE & EST                           ║
     ╚═══════════════════════════════════════════════════════════════╝
     ========================================================================= */
  // Cameroun
  {id:'rss_camer',      name:'Camer.be (Cameroun)',         cat:'centre_afr',region:'CM',lang:'fr', bloc:'afrique',  url:'https://www.camer.be/rss.xml',                               verified:false},
  {id:'rss_journ_cam',  name:'Journal du Cameroun',         cat:'centre_afr',region:'CM',lang:'fr', bloc:'afrique',  url:'https://www.journalducameroun.com/feed/',                    verified:false},
  // Gabon
  {id:'rss_gabonreview',name:'Gabon Review',                cat:'centre_afr',region:'GA',lang:'fr', bloc:'afrique',  url:'https://www.gabonreview.com/feed/',                          verified:false},
  // RDC
  {id:'rss_radiookapi', name:'Radio Okapi (RDC)',           cat:'centre_afr',region:'CD',lang:'fr', bloc:'afrique',  url:'https://www.radiookapi.net/feed',                            verified:false},
  {id:'rss_actuacd',    name:'ActualitéCD (RDC)',           cat:'centre_afr',region:'CD',lang:'fr', bloc:'afrique',  url:'https://actualite.cd/feed',                                  verified:false},
  {id:'rss_7sur7',      name:'7sur7.cd (RDC)',              cat:'centre_afr',region:'CD',lang:'fr', bloc:'afrique',  url:'https://7sur7.cd/feed',                                      verified:false},
  // Congo Brazza
  {id:'rss_adiac',      name:'ADIAC — Dépêches Brazzaville',cat:'centre_afr',region:'CG',lang:'fr', bloc:'afrique',  url:'https://www.adiac-congo.com/feed',                           verified:false},
  // Kenya
  {id:'rss_dailynation',name:'Daily Nation (Kenya)',        cat:'est_afr',  region:'KE', lang:'en', bloc:'afrique',  url:'https://nation.africa/kenya/rss',                            verified:false},
  {id:'rss_standard_ke',name:'The Standard (Kenya)',        cat:'est_afr',  region:'KE', lang:'en', bloc:'afrique',  url:'https://www.standardmedia.co.ke/rss/headlines.php',          verified:false},
  // Éthiopie
  {id:'rss_addis_std',  name:'Addis Standard (Éthiopie)',   cat:'est_afr',  region:'ET', lang:'en', bloc:'afrique',  url:'https://addisstandard.com/feed/',                            verified:false},
  // Soudan
  {id:'rss_sudan_trib', name:'Sudan Tribune',               cat:'est_afr',  region:'SD', lang:'en', bloc:'afrique',  url:'https://sudantribune.com/feed/',                             verified:false},
  {id:'rss_dabanga',    name:'Dabanga Sudan',               cat:'est_afr',  region:'SD', lang:'en', bloc:'afrique',  url:'https://www.dabangasudan.org/en/feed',                       verified:false},
  // Afrique du Sud
  {id:'rss_news24',     name:'News24 (Afrique du Sud)',     cat:'sud_afr',  region:'ZA', lang:'en', bloc:'afrique',  url:'https://feeds.news24.com/articles/News24/TopStories/rss',    verified:false},
  {id:'rss_dailymav',   name:'Daily Maverick',              cat:'sud_afr',  region:'ZA', lang:'en', bloc:'afrique',  url:'https://www.dailymaverick.co.za/feed/',                      verified:false},

  /* =========================================================================
     ╔═══════════════════════════════════════════════════════════════╗
     ║  🌍 BLOC 5 : AFRIQUE DU NORD / MAGHREB                        ║
     ╚═══════════════════════════════════════════════════════════════╝
     ========================================================================= */
  // Algérie
  {id:'rss_tsa',        name:'TSA — Tout sur l\'Algérie',   cat:'maghreb',  region:'DZ', lang:'fr', bloc:'afrique',  url:'https://www.tsa-algerie.com/feed/',                          verified:false},
  {id:'rss_elwatan',    name:'El Watan (Algérie)',          cat:'maghreb',  region:'DZ', lang:'fr', bloc:'afrique',  url:'https://www.elwatan-dz.com/feed',                            verified:false},
  // Maroc
  {id:'rss_le360',      name:'Le360 (Maroc)',               cat:'maghreb',  region:'MA', lang:'fr', bloc:'afrique',  url:'https://fr.le360.ma/feed/',                                  verified:false},
  {id:'rss_telquel',    name:'TelQuel (Maroc)',             cat:'maghreb',  region:'MA', lang:'fr', bloc:'afrique',  url:'https://telquel.ma/feed',                                    verified:false},
  {id:'rss_medias24',   name:'Médias 24 (Maroc)',           cat:'maghreb',  region:'MA', lang:'fr', bloc:'afrique',  url:'https://medias24.com/feed/',                                 verified:false},
  {id:'rss_hespress',   name:'Hespress (Maroc, FR)',        cat:'maghreb',  region:'MA', lang:'fr', bloc:'afrique',  url:'https://fr.hespress.com/feed',                               verified:false},
  // Tunisie
  {id:'rss_kapitalis',  name:'Kapitalis (Tunisie)',         cat:'maghreb',  region:'TN', lang:'fr', bloc:'afrique',  url:'https://kapitalis.com/tunisie/feed/',                        verified:false},
  {id:'rss_webmanager', name:'Webmanagercenter (Tunisie)',  cat:'maghreb',  region:'TN', lang:'fr', bloc:'afrique',  url:'https://www.webmanagercenter.com/feed/',                     verified:false},
  // Égypte
  {id:'rss_madamasr',   name:'Mada Masr (Égypte)',          cat:'maghreb',  region:'EG', lang:'en', bloc:'golfe_mo', url:'https://www.madamasr.com/en/feed/',                          verified:false},
  // Libye
  {id:'rss_libya_obs',  name:'Libya Observer',              cat:'maghreb',  region:'LY', lang:'en', bloc:'afrique',  url:'https://www.libyaobserver.ly/rss.xml',                       verified:false},

  /* =========================================================================
     ╔═══════════════════════════════════════════════════════════════╗
     ║  🧠 BLOC 6 : THINK TANKS AFRICAINS & SAHÉLIENS                ║
     ╚═══════════════════════════════════════════════════════════════╝
     ========================================================================= */
  {id:'rss_iss_africa', name:'ISS Africa — Institute Security Studies',cat:'thinktank',region:'AF',lang:'en',bloc:'afrique',url:'https://issafrica.org/rss/iss-today',                  verified:false},
  {id:'rss_acss',       name:'Africa Center for Strategic Studies',    cat:'thinktank',region:'AF',lang:'en',bloc:'occident_us',url:'https://africacenter.org/feed/',                   verified:false},
  {id:'rss_wathi',      name:'WATHI — Think tank ouest-africain',      cat:'thinktank',region:'AF',lang:'fr',bloc:'afrique',url:'https://www.wathi.org/feed/',                          verified:false},
  {id:'rss_acled',      name:'ACLED — Armed Conflict Location & Event Data',cat:'thinktank',region:'INT',lang:'en',bloc:'occident_us',url:'https://acleddata.com/feed/',               verified:false},
  {id:'rss_moibrahim',  name:'Mo Ibrahim Foundation',                  cat:'thinktank',region:'AF',lang:'en',bloc:'afrique',url:'https://mo.ibrahim.foundation/news/feed',              verified:false},
  {id:'rss_clingendael',name:'Clingendael — Sahel research',           cat:'thinktank',region:'NL',lang:'en',bloc:'occident_us',url:'https://www.clingendael.org/rss.xml',              verified:false},
  {id:'rss_kas_africa', name:'KAS — Konrad Adenauer Africa',           cat:'thinktank',region:'AF',lang:'en',bloc:'occident_us',url:'https://www.kas.de/de/rss',                        verified:false},
  {id:'rss_ipss',       name:'IPSS — Institute for Peace and Security (Addis-Abeba)',cat:'thinktank',region:'AF',lang:'en',bloc:'afrique',url:'https://ipss-addis.org/feed/',           verified:false},
  {id:'rss_friedrich',  name:'Friedrich Ebert Stiftung Afrique',       cat:'thinktank',region:'AF',lang:'fr',bloc:'occident_us',url:'https://www.fes.de/feed',                          verified:false},

  /* =========================================================================
     ╔═══════════════════════════════════════════════════════════════╗
     ║  🌐 BLOC 7 : THINK TANKS FRANCOPHONES & MÉDIAS RÉFÉRENCE FR   ║
     ╚═══════════════════════════════════════════════════════════════╝
     ========================================================================= */
  {id:'rss_lgc',        name:'Le Grand Continent',          cat:'thinktank',region:'FR', lang:'fr', bloc:'occident_fr',url:'https://legrandcontinent.eu/fr/feed/',                       verified:true},
  {id:'rss_iris',       name:'IRIS France',                 cat:'thinktank',region:'FR', lang:'fr', bloc:'occident_fr',url:'https://www.iris-france.org/feed/',                          verified:true},
  {id:'rss_diplo',      name:'Diploweb',                    cat:'thinktank',region:'FR', lang:'fr', bloc:'occident_fr',url:'https://www.diploweb.com/spip.php?page=backend',             verified:true},
  {id:'rss_ifri',       name:'IFRI — Institut Français RI', cat:'thinktank',region:'FR', lang:'fr', bloc:'occident_fr',url:'https://www.ifri.org/fr/rss.xml',                            verified:false},
  {id:'rss_frs',        name:'FRS — Fondation Recherche Stratégique',cat:'thinktank',region:'FR',lang:'fr',bloc:'occident_fr',url:'https://www.frstrategie.org/rss',                     verified:false},
  {id:'rss_lemonde',    name:'Le Monde International',      cat:'geopol',  region:'FR', lang:'fr', bloc:'occident_fr',url:'https://www.lemonde.fr/international/rss_full.xml',           verified:false},
  {id:'rss_lemondeeco', name:'Le Monde Économie',           cat:'economic',region:'FR', lang:'fr', bloc:'occident_fr',url:'https://www.lemonde.fr/economie/rss_full.xml',                verified:false},
  {id:'rss_lemondeafr', name:'Le Monde Afrique',            cat:'africa',  region:'FR', lang:'fr', bloc:'occident_fr',url:'https://www.lemonde.fr/afrique/rss_full.xml',                 verified:false},
  {id:'rss_f24fr',      name:'France 24',                   cat:'geopol',  region:'FR', lang:'fr', bloc:'occident_fr',url:'https://www.france24.com/fr/rss',                            verified:false},
  {id:'rss_f24afr',     name:'France 24 Afrique',           cat:'africa',  region:'FR', lang:'fr', bloc:'occident_fr',url:'https://www.france24.com/fr/afrique/rss',                    verified:false},
  {id:'rss_jeuneafr',   name:'Jeune Afrique',               cat:'africa',  region:'FR', lang:'fr', bloc:'occident_fr',url:'https://www.jeuneafrique.com/feed/',                          verified:false},
  {id:'rss_rfiafr',     name:'RFI Afrique',                 cat:'africa',  region:'FR', lang:'fr', bloc:'occident_fr',url:'https://www.rfi.fr/fr/afrique/rss',                           verified:false},
  {id:'rss_rfimo',      name:'RFI Moyen-Orient',            cat:'geopol',  region:'FR', lang:'fr', bloc:'occident_fr',url:'https://www.rfi.fr/fr/moyen-orient/rss',                      verified:false},
  {id:'rss_tv5afr',     name:'TV5 Monde Afrique',           cat:'africa',  region:'FR', lang:'fr', bloc:'occident_fr',url:'https://information.tv5monde.com/afrique/rss.xml',           verified:false},
  {id:'rss_lmd',        name:'Le Monde Diplomatique',       cat:'diplomatic',region:'FR',lang:'fr',bloc:'occident_fr',url:'https://www.monde-diplomatique.fr/recents.xml',               verified:false},
  {id:'rss_apa',        name:'APA News Afrique',            cat:'africa',  region:'AF', lang:'fr', bloc:'afrique',  url:'https://apanews.net/feed/',                                  verified:false},
  {id:'rss_bbc_afr',    name:'BBC Afrique (FR)',            cat:'africa',  region:'UK', lang:'fr', bloc:'occident_us',url:'https://feeds.bbci.co.uk/afrique/rss.xml',                    verified:true},
  {id:'rss_unnewsfr',   name:'ONU Info (FR)',               cat:'diplomatic',region:'INT',lang:'fr',bloc:'autre',   url:'https://news.un.org/feed/subscribe/fr/news/all/rss.xml',     verified:true},
  {id:'rss_libe',       name:'Libération International',    cat:'geopol',  region:'FR', lang:'fr', bloc:'occident_fr',url:'https://www.liberation.fr/arc/outboundfeeds/rss/category/international/?outputType=xml',verified:false},
  {id:'rss_figaro',     name:'Le Figaro International',     cat:'geopol',  region:'FR', lang:'fr', bloc:'occident_fr',url:'https://www.lefigaro.fr/rss/figaro_international.xml',       verified:false},
  {id:'rss_mediapart',  name:'Mediapart International',     cat:'geopol',  region:'FR', lang:'fr', bloc:'occident_fr',url:'https://www.mediapart.fr/articles/feed',                     verified:false},

  /* =========================================================================
     ╔═══════════════════════════════════════════════════════════════╗
     ║  🇺🇸 BLOC 8 : THINK TANKS & MÉDIAS ANGLOPHONES MAJEURS          ║
     ╚═══════════════════════════════════════════════════════════════╝
     ========================================================================= */
  {id:'rss_isw',        name:'ISW — Institute for the Study of War',cat:'thinktank',region:'US',lang:'en',bloc:'occident_us',url:'https://understandingwar.org/rss',                    verified:false},
  {id:'rss_csis',       name:'CSIS — Center Strategic & Intl Studies',cat:'thinktank',region:'US',lang:'en',bloc:'occident_us',url:'https://www.csis.org/rss.xml',                       verified:false},
  {id:'rss_brookings',  name:'Brookings Institution',       cat:'thinktank',region:'US', lang:'en', bloc:'occident_us',url:'https://www.brookings.edu/feed/',                            verified:false},
  {id:'rss_rand',       name:'RAND Corporation',            cat:'thinktank',region:'US', lang:'en', bloc:'occident_us',url:'https://www.rand.org/blog.feed',                             verified:false},
  {id:'rss_cfr',        name:'CFR — Council on Foreign Relations',cat:'thinktank',region:'US',lang:'en',bloc:'occident_us',url:'https://www.cfr.org/rss.xml',                            verified:false},
  {id:'rss_chathouse',  name:'Chatham House (UK)',          cat:'thinktank',region:'UK', lang:'en', bloc:'occident_us',url:'https://www.chathamhouse.org/rss/all',                       verified:false},
  {id:'rss_rusi',       name:'RUSI (UK)',                   cat:'thinktank',region:'UK', lang:'en', bloc:'occident_us',url:'https://rusi.org/news/rss',                                  verified:false},
  {id:'rss_iiss',       name:'IISS — International Institute Strategic Studies',cat:'thinktank',region:'UK',lang:'en',bloc:'occident_us',url:'https://www.iiss.org/feed',               verified:false},
  {id:'rss_ecfr',       name:'ECFR — European Council on Foreign Relations',cat:'thinktank',region:'EU',lang:'en',bloc:'occident_us',url:'https://ecfr.eu/feed/',                       verified:false},
  {id:'rss_carnegie',   name:'Carnegie Endowment',          cat:'thinktank',region:'US', lang:'en', bloc:'occident_us',url:'https://carnegieendowment.org/rss',                          verified:false},
  {id:'rss_atlantic',   name:'Atlantic Council',            cat:'thinktank',region:'US', lang:'en', bloc:'occident_us',url:'https://www.atlanticcouncil.org/feed/',                      verified:false},
  {id:'rss_crisisgroup',name:'ICG — International Crisis Group',cat:'thinktank',region:'INT',lang:'en',bloc:'occident_us',url:'https://www.crisisgroup.org/rss',                         verified:false},
  {id:'rss_sipri',      name:'SIPRI — Stockholm Intl Peace Research',cat:'thinktank',region:'INT',lang:'en',bloc:'occident_us',url:'https://www.sipri.org/rss',                          verified:false},
  // Médias US
  {id:'rss_nyt',        name:'NYT World',                   cat:'geopol',  region:'US', lang:'en', bloc:'occident_us',url:'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',     verified:false},
  {id:'rss_wapo',       name:'Washington Post World',       cat:'geopol',  region:'US', lang:'en', bloc:'occident_us',url:'https://feeds.washingtonpost.com/rss/world',                  verified:false},
  {id:'rss_fp',         name:'Foreign Policy',              cat:'geopol',  region:'US', lang:'en', bloc:'occident_us',url:'https://foreignpolicy.com/feed/',                             verified:false},
  {id:'rss_ft',         name:'Financial Times World',       cat:'economic',region:'UK', lang:'en', bloc:'occident_us',url:'https://www.ft.com/world?format=rss',                          verified:false},
  {id:'rss_economist',  name:'The Economist',               cat:'geopol',  region:'UK', lang:'en', bloc:'occident_us',url:'https://www.economist.com/the-world-this-week/rss.xml',     verified:false},
  {id:'rss_atlantic_m', name:'The Atlantic',                cat:'geopol',  region:'US', lang:'en', bloc:'occident_us',url:'https://www.theatlantic.com/feed/all/',                       verified:false},
  {id:'rss_bbc',        name:'BBC World',                   cat:'geopol',  region:'UK', lang:'en', bloc:'occident_us',url:'https://feeds.bbci.co.uk/news/world/rss.xml',                 verified:true},
  {id:'rss_bbc_africa', name:'BBC Africa',                  cat:'africa',  region:'UK', lang:'en', bloc:'occident_us',url:'https://feeds.bbci.co.uk/news/world/africa/rss.xml',          verified:true},
  {id:'rss_guardian',   name:'The Guardian World',          cat:'geopol',  region:'UK', lang:'en', bloc:'occident_us',url:'https://www.theguardian.com/world/rss',                       verified:false},
  {id:'rss_npr',        name:'NPR World',                   cat:'geopol',  region:'US', lang:'en', bloc:'occident_us',url:'https://feeds.npr.org/1004/rss.xml',                          verified:true},
  {id:'rss_dw',         name:'Deutsche Welle (EN)',         cat:'geopol',  region:'DE', lang:'en', bloc:'occident_us',url:'https://rss.dw.com/rdf/rss-en-world',                          verified:false},

  /* =========================================================================
     ╔═══════════════════════════════════════════════════════════════╗
     ║  🇷🇺 BLOC 9 : RUSSIE / EURASIE (veille adversariale)            ║
     ╚═══════════════════════════════════════════════════════════════╝
     ========================================================================= */
  {id:'rss_tass',       name:'TASS (Russie, EN)',           cat:'geopol',  region:'RU', lang:'en', bloc:'russie',   url:'https://tass.com/rss/v2.xml',                                  verified:false},
  {id:'rss_rt_fr',      name:'RT en français',              cat:'geopol',  region:'RU', lang:'fr', bloc:'russie',   url:'https://francais.rt.com/rss',                                  verified:false},
  {id:'rss_sputnik_fr', name:'Sputnik Afrique (FR)',        cat:'africa',  region:'RU', lang:'fr', bloc:'russie',   url:'https://fr.sputniknews.africa/export/rss2/archive/index.xml',verified:false},
  {id:'rss_ria',        name:'RIA Novosti (EN)',            cat:'geopol',  region:'RU', lang:'en', bloc:'russie',   url:'https://en.ria.ru/export/rss2/index.xml',                      verified:false},

  /* =========================================================================
     ╔═══════════════════════════════════════════════════════════════╗
     ║  🇨🇳 BLOC 10 : CHINE                                            ║
     ╚═══════════════════════════════════════════════════════════════╝
     ========================================================================= */
  {id:'rss_xinhua',     name:'Xinhua (EN)',                 cat:'geopol',  region:'CN', lang:'en', bloc:'chine',    url:'http://www.xinhuanet.com/english/rss/worldrss.xml',          verified:false},
  {id:'rss_cgtn',       name:'CGTN (Chine, EN)',            cat:'geopol',  region:'CN', lang:'en', bloc:'chine',    url:'https://www.cgtn.com/subscribe/rss/section/world.xml',       verified:false},
  {id:'rss_globaltimes',name:'Global Times (Chine)',        cat:'geopol',  region:'CN', lang:'en', bloc:'chine',    url:'https://www.globaltimes.cn/rss/outbrain.xml',                 verified:false},
  {id:'rss_chinadaily', name:'China Daily',                 cat:'geopol',  region:'CN', lang:'en', bloc:'chine',    url:'https://www.chinadaily.com.cn/rss/world_rss.xml',             verified:false},
  {id:'rss_scmp',       name:'South China Morning Post',    cat:'geopol',  region:'CN', lang:'en', bloc:'chine',    url:'https://www.scmp.com/rss/91/feed',                            verified:false},

  /* =========================================================================
     ╔═══════════════════════════════════════════════════════════════╗
     ║  🇶🇦 BLOC 11 : MOYEN-ORIENT / GOLFE / TURQUIE                  ║
     ╚═══════════════════════════════════════════════════════════════╝
     ========================================================================= */
  {id:'rss_aje',        name:'Al Jazeera English',          cat:'geopol',  region:'QA', lang:'en', bloc:'golfe_mo', url:'https://www.aljazeera.com/xml/rss/all.xml',                   verified:true},
  {id:'rss_alarabiya',  name:'Al Arabiya (EN)',             cat:'geopol',  region:'AE', lang:'en', bloc:'golfe_mo', url:'https://www.alarabiya.net/feed/rss2/en.xml',                  verified:false},
  {id:'rss_arabnews',   name:'Arab News (Arabie Saoudite)', cat:'geopol',  region:'SA', lang:'en', bloc:'golfe_mo', url:'https://www.arabnews.com/rss.xml',                            verified:false},
  {id:'rss_almonitor',  name:'Al-Monitor',                  cat:'geopol',  region:'INT',lang:'en', bloc:'golfe_mo', url:'https://www.al-monitor.com/rss',                              verified:false},
  {id:'rss_ttoi',       name:'Times of Israel',             cat:'geopol',  region:'IL', lang:'en', bloc:'golfe_mo', url:'https://www.timesofisrael.com/feed/',                          verified:false},
  {id:'rss_jpost',      name:'Jerusalem Post',              cat:'geopol',  region:'IL', lang:'en', bloc:'golfe_mo', url:'https://www.jpost.com/rss/rssfeedsfrontpage.aspx',            verified:false},
  {id:'rss_haaretz',    name:'Haaretz',                     cat:'geopol',  region:'IL', lang:'en', bloc:'golfe_mo', url:'https://www.haaretz.com/srv/htz-2-news-rss',                  verified:false},
  {id:'rss_dailysabah', name:'Daily Sabah (Turquie)',       cat:'geopol',  region:'TR', lang:'en', bloc:'turquie',  url:'https://www.dailysabah.com/rssFeed/2',                        verified:false},
  {id:'rss_trtworld',   name:'TRT World (Turquie)',         cat:'geopol',  region:'TR', lang:'en', bloc:'turquie',  url:'https://www.trtworld.com/rss',                                verified:false},
  {id:'rss_anadolu',    name:'Anadolu Agency (Turquie)',    cat:'geopol',  region:'TR', lang:'en', bloc:'turquie',  url:'https://www.aa.com.tr/en/rss/default?cat=guncel',             verified:false},
  {id:'rss_pressTV',    name:'Press TV (Iran)',             cat:'geopol',  region:'IR', lang:'en', bloc:'golfe_mo', url:'https://www.presstv.ir/rss.xml',                              verified:false},
  {id:'rss_tehran',     name:'Tehran Times',                cat:'geopol',  region:'IR', lang:'en', bloc:'golfe_mo', url:'https://www.tehrantimes.com/rss',                             verified:false},

  /* =========================================================================
     ╔═══════════════════════════════════════════════════════════════╗
     ║  🇮🇳 BLOC 12 : INDE / ASIE DU SUD                              ║
     ╚═══════════════════════════════════════════════════════════════╝
     ========================================================================= */
  {id:'rss_thehindu',   name:'The Hindu (Inde)',            cat:'geopol',  region:'IN', lang:'en', bloc:'autre',    url:'https://www.thehindu.com/news/international/feeder/default.rss',verified:false},
  {id:'rss_wire_in',    name:'The Wire (Inde)',             cat:'geopol',  region:'IN', lang:'en', bloc:'autre',    url:'https://thewire.in/rss',                                       verified:false},
  {id:'rss_dawn',       name:'Dawn (Pakistan)',             cat:'geopol',  region:'PK', lang:'en', bloc:'autre',    url:'https://www.dawn.com/feed',                                    verified:false},

  /* =========================================================================
     ╔═══════════════════════════════════════════════════════════════╗
     ║  🌍 BLOC 13 : ASIE / AMÉRIQUE LATINE                          ║
     ╚═══════════════════════════════════════════════════════════════╝
     ========================================================================= */
  {id:'rss_nikkei',     name:'Nikkei Asia',                 cat:'economic',region:'JP', lang:'en', bloc:'autre',    url:'https://asia.nikkei.com/rss/feed/nar',                         verified:false},
  {id:'rss_japtimes',   name:'The Japan Times',             cat:'geopol',  region:'JP', lang:'en', bloc:'autre',    url:'https://www.japantimes.co.jp/feed/',                          verified:false},
  {id:'rss_bangkok',    name:'Bangkok Post',                cat:'geopol',  region:'TH', lang:'en', bloc:'autre',    url:'https://www.bangkokpost.com/rss/data/world.xml',              verified:false},
  {id:'rss_jakartap',   name:'Jakarta Post',                cat:'geopol',  region:'ID', lang:'en', bloc:'autre',    url:'https://www.thejakartapost.com/feed.xml',                     verified:false},
  {id:'rss_elpais',     name:'El País (Espagne, ES)',       cat:'geopol',  region:'ES', lang:'es', bloc:'occident_fr',url:'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada',verified:false},
  {id:'rss_folha',      name:'Folha de São Paulo (Brésil)', cat:'geopol',  region:'BR', lang:'es', bloc:'autre',    url:'https://feeds.folha.uol.com.br/internacional/rss091.xml',     verified:false},

  /* =========================================================================
     ╔═══════════════════════════════════════════════════════════════╗
     ║  🆘 BLOC 14 : HUMANITAIRE & ORGANISATIONS INTERNATIONALES      ║
     ╚═══════════════════════════════════════════════════════════════╝
     ========================================================================= */
  {id:'rss_unnews',     name:'ONU News (EN)',               cat:'diplomatic',region:'INT',lang:'en',bloc:'autre',   url:'https://news.un.org/feed/subscribe/en/news/all/rss.xml',     verified:true},
  {id:'rss_reliefweb',  name:'ReliefWeb',                   cat:'humanitarian',region:'INT',lang:'en',bloc:'autre',url:'https://reliefweb.int/updates/rss.xml',                       verified:false},
  {id:'rss_reliefweb_burkina',name:'ReliefWeb — Burkina Faso',cat:'humanitarian',region:'INT',lang:'en',bloc:'autre',url:'https://reliefweb.int/country/bfa/rss.xml',                  verified:false},
  {id:'rss_reliefweb_mali',name:'ReliefWeb — Mali',         cat:'humanitarian',region:'INT',lang:'en',bloc:'autre',url:'https://reliefweb.int/country/mli/rss.xml',                   verified:false},
  {id:'rss_hrw',        name:'Human Rights Watch',          cat:'humanitarian',region:'US',lang:'en',bloc:'occident_us',url:'https://www.hrw.org/rss/news',                            verified:false},
  {id:'rss_amnesty',    name:'Amnesty International',       cat:'humanitarian',region:'INT',lang:'en',bloc:'autre',url:'https://www.amnesty.org/en/rss/news.rss',                     verified:false},
  {id:'rss_msf',        name:'MSF — Médecins Sans Frontières',cat:'humanitarian',region:'INT',lang:'fr',bloc:'autre',url:'https://www.msf.fr/rss',                                    verified:false},
  {id:'rss_icrc',       name:'CICR — Croix-Rouge',          cat:'humanitarian',region:'INT',lang:'fr',bloc:'autre',url:'https://www.icrc.org/fr/rss',                                  verified:false},
  {id:'rss_imf',        name:'FMI — World Economic Outlook',cat:'economic', region:'INT',lang:'en',bloc:'autre',  url:'https://www.imf.org/en/News/rss',                              verified:false},
  {id:'rss_worldbank',  name:'Banque Mondiale',             cat:'economic', region:'INT',lang:'en',bloc:'autre',  url:'https://www.worldbank.org/en/news/all/rss.xml',                verified:false}

];

/* =================================================================================================
   SOURCES ACTIVES PAR DÉFAUT — sélection optimisée pour pertinence Burkina Faso
   ================================================================================================ */
const RSS_DEFAULT_ACTIVE = [
  // 🇧🇫 Sources locales BF (priorité absolue)
  'rss_lefaso','rss_burkina24','rss_sidwaya','rss_aib','rss_wakatsera','rss_omega',
  // 🌍 Sahel voisins
  'rss_maliweb','rss_studio_tam','rss_niger24','rss_kalangou','rss_tchadinfos','rss_cridem',
  // 🌍 Afrique de l'Ouest côtière
  'rss_abidjan','rss_seneweb','rss_myjoyonline','rss_lanation_bj','rss_premiumng',
  // 🇫🇷 Médias francophones de référence
  'rss_lemonde','rss_lemondeafr','rss_jeuneafr','rss_rfiafr','rss_f24fr','rss_f24afr','rss_apa','rss_bbc_afr',
  // 🧠 Think tanks africains et francophones
  'rss_iss_africa','rss_wathi','rss_acled','rss_lgc','rss_iris','rss_diplo','rss_lmd',
  // 🌍 International généraliste
  'rss_aje','rss_unnewsfr','rss_reliefweb_burkina',
  // 🛰️ Veille adversariale (Russie + Occident)
  'rss_rt_fr','rss_sputnik_fr','rss_nyt','rss_fp','rss_guardian'
];

/* =================================================================================================
   CATÉGORISATION DES ACTUALITÉS PAR MOTS-CLÉS (FR + EN)
   ================================================================================================ */
const NEWS_CATEGORIES = {
  economic:   ['inflation','sanctions','taux','dollar','euro','baril','pétrole','pétrolier','gaz','obligation','marché','bourse','récession','croissance','PIB','OPEP','OPEC','BRICS','dette','déficit','budget','commerce','exportation','importation','fcfa','f cfa','franc cfa','or','gold','coton','cotton','mine','mining','uranium','lithium','financement','aide','imf','fmi','worldbank','banque mondiale'],
  diplomatic: ['sommet','rencontre','traité','accord','signature','médiation','négociation','ambassade','onu','conseil','résolution','vote','reconnaissance','sanctions','diplomatie','ambassadeur','rappel','expulsion','visite officielle','partenariat','coopération','aes','cedeao','ecowas','union africaine','african union','focac'],
  military:   ['frappe','missile','drone','attaque','offensive','combat','militaire','armée','soldat','terroriste','jihad','jihadiste','attentat','assassinat','bombarde','guerre','front','jnim','eigs','aqim','daesh','islamic state','wagner','africa corps','mercenaire','strike','airstrike','airforce','soldiers','rebels','insurgents','assault','offensive','ambush','massacre'],
  humanitarian:['réfugiés','déplacés','famine','choléra','aide','humanitaire','crise','victimes','msf','hcr','unhcr','ipc','catastrophe','exode','migration','migrants','famine déclarée','sécurité alimentaire','déplacés internes','idp','refugees','displaced','disaster','humanitarian','food security'],
  political:  ['élection','vote','président','premier ministre','coup','manifestation','opposition','régime','démocratie','autoritaire','référendum','constitution','parlement','assemblée','gouvernement','transition','junte','putsch','presidential','election','government','parliament','protest','demonstration','opposition','democracy','autocracy']
};

/* =================================================================================================
   ÉVÉNEMENTS MAJEURS (déclenchent alerte + notification)
   ================================================================================================ */
const MAJOR_EVENT_KEYWORDS = {
  rupture: [
    'attentat majeur','attaque massive','frappe massive','frappe nucléaire','prise de capitale','coup d\'état','coup d\'etat','coup detat','assassinat','massacre','offensive majeure','escalade','breakthrough','ligne rouge','franchissement','effondrement','blocus','fermeture détroit','fermeture du détroit','famine déclarée','génocide','prise de pouvoir',
    'massive strike','major attack','assassinated','seized','captured the capital','coup','overthrow','breakthrough','red line','collapse','blockade'
  ],
  diplo_majeur: [
    'sommet','traité de paix','cessez-le-feu','accord historique','rupture diplomatique','expulsion ambassadeur','rappel ambassadeur','reconnaissance','adhésion otan','adhésion brics','sanctions massives','sortie cedeao','création aes','rétablissement relations',
    'peace treaty','ceasefire','historic agreement','recognition','massive sanctions','aes alliance','brics enlargement'
  ],
  crise: [
    'crise pétrolière','choc pétrolier','krach','effondrement monétaire','panique','contagion','catastrophe','tsunami','séisme','pandémie','famine massive','exode massif','catastrophe humanitaire',
    'oil shock','market crash','currency collapse','contagion','disaster','pandemic','mass exodus','humanitarian catastrophe'
  ]
};

/* exposer */
window.GW_DATA = window.GW_DATA || {};
window.GW_DATA.RSS_SOURCES_FULL = RSS_SOURCES_FULL;
window.GW_DATA.RSS_DEFAULT_ACTIVE = RSS_DEFAULT_ACTIVE;
window.GW_DATA.NEWS_CATEGORIES = NEWS_CATEGORIES;
window.GW_DATA.MAJOR_EVENT_KEYWORDS = MAJOR_EVENT_KEYWORDS;
