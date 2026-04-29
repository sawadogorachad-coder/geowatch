/* ==========================================================================
   GéoWatch — Fiches conflits enrichies (8 dimensions complètes)
   Gaza-Liban / Soudan / Taïwan-Chine / RDC-Est
   ========================================================================== */

const CONFLITS_ENRICHIS = [

  /* ============== GAZA — LIBAN — IRAN par proxies ============== */
  {
    id:'c_gaza',
    causes_historiques:[
      {p:'1917 — Déclaration Balfour', f:'Le Royaume-Uni s\'engage à favoriser un « foyer national juif » en Palestine, alors sous mandat ottoman. Origine juridique du conflit moderne.'},
      {p:'1947-48', f:'Plan de partage ONU (résolution 181) rejeté par les États arabes. Première guerre israélo-arabe. Création de l\'État d\'Israël (14 mai 1948). Nakba palestinienne (~750 000 réfugiés).'},
      {p:'1967 — Guerre des Six Jours', f:'Israël occupe Cisjordanie, Gaza, Sinaï, Golan, Jérusalem-Est. Acte fondateur de l\'occupation prolongée.'},
      {p:'1987 / 2000', f:'Première et deuxième Intifada. Échec d\'Oslo (1993-95). Assassinat Rabin (1995). Camp David (2000) sans accord.'},
      {p:'2005 — désengagement Gaza', f:'Israël retire ses colonies. Élections palestiniennes 2006 : Hamas l\'emporte. Coup de force Hamas à Gaza (2007). Blocus à partir de cette date.'},
      {p:'2008-2014-2021', f:'Plusieurs guerres Gaza-Israël (Plomb durci, Pilier de défense, Bordure protectrice, Gardien des murs). Aucune n\'a résolu la question du blocus ni du Hamas.'},
      {p:'7 octobre 2023', f:'Attaque massive du Hamas : 1 200 morts, 250 otages. Choc inégalé pour Israël depuis 1973. Déclencheur de l\'opération « Épées de fer ».'},
      {p:'2024 — bascule régionale', f:'Israël décapite Hezbollah (Nasrallah, sept. 2024). Effondrement Assad (déc. 2024). Arc chiite rompu. Conflit Gaza devient sous-ensemble du conflit Iran-Israël.'},
      {p:'2025-2026', f:'Cessez-le-feu janv. 2025 fragile. Reprise opérations Gaza mars 2025. Plan Trump-Saoudien-Émirats en négociation (« jour d\'après »). Cisjordanie au bord d\'une 3e Intifada.'}
    ],
    cle_historique:'Le 7 octobre n\'est pas un commencement, c\'est une rupture dans une trajectoire centenaire. Le Hamas n\'a pas inventé le conflit ; il l\'a militarisé sur des fondations qui le précèdent largement.',

    causes_geographiques:[
      {c:'Bande de Gaza : 365 km², 2,3 M habitants', i:'Une des densités les plus élevées au monde. Bande littorale de 41 km. Frontière unique terrestre avec Israël, plus le poste de Rafah (Égypte). Aucune profondeur civile.'},
      {c:'Cisjordanie morcelée (zones A/B/C des accords d\'Oslo)', i:'~60 % du territoire en zone C sous contrôle israélien complet. Colonisation continue (~700 000 colons). Discontinuité géographique = impossibilité État palestinien viable.'},
      {c:'Vallée du Jourdain', i:'Annexion de fait projetée. Frontière naturelle Israël/Jordanie. Stratégique militairement et économiquement (eau, agriculture).'},
      {c:'Liban-Sud / Galilée', i:'Frontière de 79 km. Hezbollah déployé au sud du Litani contrairement à la résolution 1701 (2006). Zone tampon disputée.'},
      {c:'Jérusalem', i:'Statut juridique non résolu. Capitale revendiquée par Israël et Palestine. Lieux saints des trois monothéismes : explosivité maximale (Esplanade des Mosquées).'},
      {c:'Plateau du Golan', i:'Annexé par Israël (1981, reconnaissance US 2019). Position dominante surveillance Damas/Hezbollah.'}
    ],

    causes_economiques:[
      {d:'Asymétrie Israël-Palestine', i:'PIB/hab Israël : ~55 000 USD ; Cisjordanie : ~3 700 USD ; Gaza : ~1 200 USD (avant 2023). Un des plus grands écarts au monde entre territoires contigus.'},
      {d:'Économie sous occupation', i:'Cisjordanie : monnaie israélienne (shekel), accès à la mer et à l\'aéroport contrôlé par Israël. Recettes douanières palestiniennes prélevées par Israël (mécanisme d\'Oslo détourné régulièrement).'},
      {d:'Blocus Gaza (depuis 2007)', i:'Contrôle Israélien et égyptien des frontières et de la mer. Eau, électricité, télécoms dépendants. Économie de tunnels (Rafah) et d\'aide internationale (UNRWA).'},
      {d:'Coût pour Israël', i:'Guerre 2023-2026 : ~120-200 Mds USD selon estimations (mobilisation réservistes, pertes IDE, baisse touristique, reconstruction nord). Note crédit dégradée Moody\'s/Fitch.'},
      {d:'Reconstruction', i:'Estimation Gaza ~50-80 Mds USD. Cisjordanie aussi en récession. Pas de financement clair (Saoudiens conditionnent à un horizon politique palestinien).'},
      {d:'Eau', i:'Israël contrôle ~80 % des nappes phréatiques de Cisjordanie. Conflit hydrique latent permanent.'}
    ],

    causes_ideologiques:[
      {a:'Sionisme religieux', d:'Mouvement minoritaire mais influent depuis 1977 (Goush Émounim). Coalition Netanyahou 2022 dépend de Smotrich/Ben Gvir : annexionnistes assumés. Doctrine : la terre d\'Israël est don divin non-négociable.'},
      {a:'Hamas — Frères musulmans palestiniens', d:'Charte 1988 (révisée 2017). Vision : libération totale de la Palestine, ambiguïté sur reconnaissance Israël. Branche armée (Brigades al-Qassam). Soutien Iran/Qatar/Turquie.'},
      {a:'Hezbollah — chiisme révolutionnaire', d:'Créé 1982 sous parrainage iranien. « Parti de Dieu » : projet politique-militaire-social. Veillée idéologique sur le velayat-e faqih iranien. État dans l\'État au Liban.'},
      {a:'Évangélisme américain dispensationaliste', d:'~30 % électorat US. Israël = signe eschatologique. Soutien inconditionnel pèse sur la politique US (Capitol Hill, Trump).'},
      {a:'Antisionisme arabe / panarabisme', d:'Affaibli depuis Sadate (1979) et accords d\'Abraham (2020). Reste vivant dans les opinions publiques arabes. Levier interne pour Iran et Turquie.'},
      {a:'Universalisme post-coloniale (Sud global)', d:'Lecture du conflit comme dernier conflit colonial. Cause palestinienne = symbole. Boycott (BDS), procès Afrique du Sud à la CIJ (jan. 2024).'}
    ],

    perceptions_croisees:[
      {a:'Israël voit le Hamas comme', b:'Branche du djihad iranien à la frontière. Organisation génocidaire (charte). Existential threat structurel — pas un partenaire de négociation possible.'},
      {a:'Hamas voit Israël comme', b:'Entité coloniale de peuplement à démanteler. Toute trêve est tactique. Le 7 octobre voulait briser la « normalisation » et imposer un retour de la cause palestinienne.'},
      {a:'Population palestinienne voit Israël comme', b:'Occupant brutal. Indifférente ou hostile au Hamas en tant que gouvernance, mais solidaire face aux frappes. Polarisation augmente avec la durée et la sévérité de la guerre.'},
      {a:'Population israélienne post-7 oct.', b:'Trauma fondateur. Soutien initial massif à l\'opération militaire. Polarisation croissante : famille des otages vs colons vs ultra-orthodoxes vs camp de la paix.'},
      {a:'Sud global voit le conflit comme', b:'Génocide en cours (procès CIJ Afrique du Sud, plaintes individuelles Burundi, Bolivie, etc.). Test de la crédibilité du droit international face au double standard occidental.'},
      {a:'Occident voit le conflit comme', b:'Dilemme moral : soutien à Israël démocratie vs préoccupations humanitaires. Polarisation politique interne (campus US, élections européennes).'}
    ],

    postures_arsenaux:{
      camp_a:{
        nom:'Israël (IDF) + soutien US',
        doctrine:'Doctrine Dahieh (destruction massive zones civiles d\'où provient menace), supériorité technologique absolue, accent renseignement (Aman, Mossad, Shin Bet) et frappes ciblées. Multi-front depuis 2024.',
        moyens:'~170 000 actifs + 465 000 réservistes mobilisables. F-35I Adir, F-15I, Merkava IV. Dôme de fer / David / Arrow 2 et 3. Sous-marins Dolphin (capacité nucléaire). Budget ~33 Mds USD, ~5 % PIB. Aide US ~3,8 Mds USD/an + munitions exceptionnelles depuis 2023.',
        faiblesses:'Saturation interception (cas oct. 2024). Démographie réservistes (économie sous pression). Légitimité internationale érodée. Dépendance technologique US.'
      },
      camp_b:{
        nom:'Hamas + Hezbollah + Houthis (axe résistance)',
        doctrine:'Asymétrie maximale. Réseau tunnels (Gaza : >500 km estimés). Lancement saturation drones/roquettes. Hezbollah : ~150 000 roquettes/missiles avant 2024. Boucliers humains. Communication propagande.',
        moyens:'Hamas avant oct. 2023 : ~30 000 combattants armés. Aujourd\'hui décimé (~50-70 % perdu) mais recrutement continu. Hezbollah : ~30 000 combattants permanents + ~50 000 réservistes. Affaibli par décapitation 2024 mais structuré. Houthis : 200 000 combattants estimés, drones et missiles.',
        faiblesses:'Décapitation systématique (Sinwar, Deif, Nasrallah, Safieddine). Rupture corridor logistique (chute Assad). Population libanaise majoritairement hostile à une nouvelle guerre.'
      }
    },

    rivalites_structurelles:[
      {dim:'Question palestinienne', n:'Cœur du conflit. Sans horizon politique (deux États, un État binational, confédération), le militaire seul ne tranche rien.'},
      {dim:'Hégémonie régionale', n:'Israël-Saoudite vs Iran. La normalisation Israël-Saoudite, suspendue par Gaza, reprendrait sous condition palestinienne.'},
      {dim:'Légitimité des armes', n:'Israël impose le primat sécuritaire ; le Sud global et les ONG dénoncent une violation du DIH (proportionnalité). Tension juridique structurelle (CIJ, CPI).'},
      {dim:'Blocs idéologiques globaux', n:'Démocraties libérales (en bloc derrière Israël avec nuances) vs « axe de la résistance » (Iran, certains États arabes, militants Sud global).'},
      {dim:'Énergie / corridor', n:'Lié au conflit Iran-Israël et à la mer Rouge. Toute escalade fait monter le baril. Corridor d\'Abraham (Inde-Golfe-Haïfa) suspendu mais pas mort.'},
      {dim:'Liban', n:'Risque de libanisation : effondrement étatique, milices multiples. Élection présidentielle 2025 décisive (Aoun élu jan. 2025).'}
    ],

    chronologie:[
      {d:'2023-10-07', e:'Attaque massive du Hamas (1 200 morts, 250 otages)', sev:10, rupture:true, note:'Plus grand massacre antijuif depuis la Shoah'},
      {d:'2023-10-08', e:'Hezbollah ouvre front nord (tirs depuis Sud-Liban)', sev:8, rupture:true, note:'Internationalisation immédiate'},
      {d:'2023-10-27', e:'Opération terrestre IDF à Gaza-Nord', sev:9, rupture:false},
      {d:'2024-01-25', e:'Cour internationale de Justice : Israël doit prévenir actes de génocide', sev:8, rupture:true, note:'Mesures conservatoires sans déclaration de génocide'},
      {d:'2024-04-01', e:'Israël frappe consulat iranien à Damas', sev:9, rupture:true},
      {d:'2024-07-31', e:'Assassinat Haniyeh à Téhéran', sev:8, rupture:false},
      {d:'2024-09-17', e:'Opération Pagers : Hezbollah frappé par sabotage massif', sev:8, rupture:true, note:'Opération sans précédent dans l\'histoire moderne'},
      {d:'2024-09-27', e:'Assassinat Nasrallah par frappe massive Beyrouth-Sud', sev:9, rupture:true},
      {d:'2024-10-16', e:'Sinwar tué à Rafah', sev:8, rupture:false},
      {d:'2024-11-27', e:'Cessez-le-feu Israël-Hezbollah', sev:6, rupture:true},
      {d:'2024-12-08', e:'Chute d\'Assad — arc chiite rompu', sev:9, rupture:true},
      {d:'2025-01-19', e:'Cessez-le-feu Gaza phase 1 (libération otages partielle)', sev:7, rupture:true},
      {d:'2025-03-18', e:'Reprise opérations IDF à Gaza', sev:8, rupture:true},
      {d:'2025-09-09', e:'Frappe israélienne sur leadership Hamas à Doha', sev:8, rupture:true, note:'Attaque sur sol qatari — choc diplomatique'},
      {d:'2026-02-14', e:'Plan Trump-Saoudien « jour d\'après » présenté', sev:6, rupture:false}
    ],

    lecture_causale:{
      premiere:'Une question coloniale et nationale non résolue depuis 1947, sur laquelle se sont superposées une dimension religieuse (depuis 1967), une dimension islamiste (depuis 1987) et une dimension régionale iranienne (depuis 1979).',
      structurante:'L\'asymétrie radicale (puissance militaire Israël vs faiblesse étatique palestinienne) interdit une victoire militaire pleinement décisive d\'un côté ou de l\'autre. Le Hamas peut être détruit comme structure mais pas comme idée tant que le grief perdure.',
      paradoxe:'Plus Israël use de la force pour assurer sa sécurité par démantèlement du Hamas, plus il alimente un futur Hamas (orphelins, traumatisés, radicalisés). Et plus il fragilise sa propre légitimité internationale, qui était une garantie de sécurité à long terme.',
      signal:'Sans horizon politique palestinien crédible (deux États avec contiguïté, ou confédération), aucun cessez-le-feu ne sera durable. Le « jour d\'après » est la variable décisive — pas le « jour pendant ». La normalisation saoudienne reste l\'étoile polaire mais conditionnée.'
    },

    brief_decideur:[
      'Hamas est militairement décapité mais politiquement vivant — pas d\'alternative palestinienne crédible identifiée à ce jour.',
      'Gaza : crise humanitaire IPC 5 confirmée. Risque famine documenté ONU. Reconstruction estimée 50-80 Mds USD sans financement clair.',
      'Hezbollah : décapité oct. 2024 mais reste 1ère force armée du Liban. Cessez-le-feu Israël-Hezbollah tient mais fragile.',
      'Cisjordanie : risque 3e Intifada. Militarisation des colonies. Contrôle Autorité palestinienne en érosion.',
      'Plan Trump-Saoudien probable mais conditionné à un horizon politique palestinien acceptable (impossible avec coalition Smotrich/Ben Gvir).'
    ],
    brief_analyste:{
      faits:'~50 000 morts Gaza (estimation MoH Hamas, contestée mais reprise par UN OCHA). ~95 % de la population déplacée au moins une fois. ~80 % infrastructures détruites. Hamas militairement réduit de ~50-70 %. Hezbollah perte cadres + ~20 % stocks. Liban : ~4 000 morts. Israël : ~2 000 morts dont 1 200 le 7 oct.',
      incertitudes:'Capacité résiduelle Hamas (recrutement, tunnels résiduels, leadership). Otages restants (vivants ?). Posture Trump 2 sur conditionnalité aide militaire. Soutenabilité coalition Netanyahou (procès, pression société civile, otages).',
      hypotheses:'H1 (~45%) : statu quo dégradé prolongé — Gaza occupée militairement de fait, sans gouvernance de transition crédible, raids Cisjordanie réguliers. H2 (~25%) : plan régional saoudien-Trump avec gouvernance internationale temporaire Gaza + horizon palestinien minimal. H3 (~15%) : effondrement coalition Netanyahou, gouvernement union nationale, négociation. H4 (~10%) : nouvelle guerre Hezbollah-Israël (rupture cessez-le-feu). H5 (~5%) : 3e Intifada Cisjordanie + escalade régionale.',
      indicateurs_24_72h:'Tirs Sud-Liban / réponse israélienne. Mouvements colons Cisjordanie. Communiqués famille otages. Posture Égypte (Rafah). Déclarations Smotrich/Ben Gvir.',
      indicateurs_7_30j:'Statistiques mortalité OCHA. Position Saoudite normalisation. Décisions CIJ/CPI. Coalition Netanyahou (votes). Reprise/arrêt aide humanitaire. Élections municipales palestiniennes ?',
      implications_7_30j:'Si stagnation : érosion supplémentaire légitimité Israël (Sud global, jeunes Occident). Pression interne croissante en Israël. Risque attentats inspirés en Europe. Reconstruction qui ne commence pas → crise humanitaire chronique.'
    },

    scenarios:[
      {nom:'Tendanciel — guerre prolongée à intensité variable', proba:45, impact:8, h:'12-24 mois', d:'Pas de cessez-le-feu durable. Opérations IDF récurrentes Gaza et Cisjordanie. Tirs sporadiques Sud-Liban. Hamas se reconstitue lentement. Reconstruction quasi-nulle. Crise humanitaire chronique.'},
      {nom:'Recomposition — plan régional Trump/Saoudien', proba:25, impact:7, h:'12-36 mois', d:'Force internationale arabe (saoudienne, EAU, Égypte) à Gaza. Réforme Autorité palestinienne. Reconstruction financée Golfe. Normalisation saoudienne phase 1. Cisjordanie en attente.'},
      {nom:'Rupture — chute Netanyahou, gouvernement union', proba:15, impact:6, h:'6-18 mois', d:'Élections anticipées. Coalition Likoud sans Smotrich-Ben Gvir + centre + Bleu-blanc. Réouverture négociation. Pas paix mais stabilisation.'},
      {nom:'Rupture — guerre régionale (Hezbollah-Iran)', proba:10, impact:9, h:'6-12 mois', d:'Rupture cessez-le-feu nord. Engagement direct Iran (frappes massives). Crise pétrolière. Engagement US.'},
      {nom:'Wild card — 3e Intifada Cisjordanie', proba:5, impact:8, h:'inconnue', d:'Soulèvement déclenché par incident à Jérusalem ou Cisjordanie. Effondrement Autorité palestinienne. Israël en gestion d\'occupation totale.'}
    ],

    sources:[
      {nom:'Crisis Group — Israël/Palestine', url:'https://www.crisisgroup.org/middle-east-north-africa/east-mediterranean-mena/israelpalestine'},
      {nom:'ISW — Hamas/Hezbollah Updates', url:'https://understandingwar.org/'},
      {nom:'B\'Tselem (ONG israélienne)', url:'https://www.btselem.org/'},
      {nom:'OCHA — Occupied Palestinian Territory', url:'https://www.ochaopt.org/'},
      {nom:'Le Grand Continent — Israël', url:'https://legrandcontinent.eu/fr/categorie/regions/israel/'},
      {nom:'IRIS — Observatoire mondes méditerranéens et moyen-oriental', url:'https://www.iris-france.org/observatoires/'}
    ]
  },

  /* ============== SOUDAN — Guerre civile SAF/RSF ============== */
  {
    id:'c_sdn',
    causes_historiques:[
      {p:'1898-1956 — Condominium anglo-égyptien', f:'Soudan administré conjointement. Indépendance proclamée 1956. Conflit Nord (arabe-musulman) / Sud (africain-chrétien-animiste) immédiat.'},
      {p:'1955-1972 / 1983-2005', f:'Deux guerres civiles Nord-Sud. ~2 millions de morts. Accord de Naivasha (2005). Indépendance Sud-Soudan (juillet 2011) — perte de 75 % des recettes pétrolières pour Khartoum.'},
      {p:'2003-2008 — Darfour', f:'Insurrection au Darfour (Justice and Equality Movement). Réponse de Khartoum : Janjaweed (milice arabe). ~300 000 morts, ~2,7 M déplacés. CPI inculpe Béchir (génocide, 2010).'},
      {p:'2013', f:'Création des Forces de soutien rapide (RSF) à partir des Janjaweed. Officialisées comme force paramilitaire sous le commandement de Hemedti.'},
      {p:'2019', f:'Révolution soudanaise. Béchir renversé. Conseil souverain de transition (militaires + civils). Hemedti (RSF) devient n°2 du régime.'},
      {p:'2021', f:'Coup d\'État Burhan-Hemedti. Sortie civils du gouvernement. Mouvement de protestation continu.'},
      {p:'15 avril 2023 — déclenchement', f:'Tension Burhan/Hemedti sur l\'intégration RSF dans SAF. Accrochages à Khartoum dégénèrent en guerre ouverte.'},
      {p:'2023-2026', f:'Khartoum prise par RSF. SAF se retire à Port-Soudan (capitale temporaire). Famine déclarée IPC 5 (2024). Reprise Khartoum par SAF (mars 2025). RSF retranchée au Darfour. Massacres ethniques El Geneina, El Fasher.'}
    ],
    cle_historique:'La guerre actuelle n\'est pas un accident mais l\'aboutissement de 30 ans de duplication structurelle des forces armées par Béchir, qui jouait sur la rivalité SAF/Janjaweed pour assurer son pouvoir personnel.',

    causes_geographiques:[
      {c:'Soudan : 1,86 M km² — 16e pays du monde par superficie', i:'Vastes zones difficilement contrôlables. Cinq régions distinctes (Khartoum, Darfour, Kordofan, Est, Nil Bleu) avec dynamiques propres.'},
      {c:'Darfour', i:'Région de l\'ouest, 4 États, ~9 M habitants. Frontière Tchad et RCA. Refuge historique RSF (origine Janjaweed). Composition ethnique arabe/non-arabe (Four, Massalit, Zaghawa).'},
      {c:'Khartoum — confluent Nil Blanc / Nil Bleu', i:'Capitale + agglomération ~6 M habitants. Cœur économique et symbolique. Sa prise par RSF (avril 2023) puis sa reprise (mars 2025) sont des moments charnières.'},
      {c:'Port-Soudan — façade mer Rouge', i:'Capitale de fait depuis avril 2023. Pétrole sud-soudanais transite ici. Présence russe ? (Wagner / projet base navale).'},
      {c:'Frontières poreuses', i:'Tchad (réfugiés Darfour), Égypte (réfugiés vers le Caire), Sud-Soudan, Éthiopie, Érythrée, RCA, Libye. Conflit risque de déstabiliser TOUTE la Corne et le Sahel oriental.'},
      {c:'Triangle de Hala\'ib', i:'Différend territorial avec Égypte. Soudan officiel ne le contrôle pas. Levier diplomatique potentiel.'}
    ],

    causes_economiques:[
      {d:'Économie de rente or/agriculture', i:'Or = 1ère exportation depuis 2018 (perte du pétrole). Production largement artisanale et informelle. Hemedti contrôle filière depuis 2017 via Al Junaid (groupe RSF).'},
      {d:'Sanctions et économie informelle', i:'Sanctions US 1993-2017. PIB officiel ~30 Mds USD. Économie largement informelle. Chute monnaie (livre soudanaise : -90 % depuis 2023).'},
      {d:'Soutiens externes', i:'EAU finance et arme RSF (or, dronesn formation aux Émirats). Égypte/Arabie saoudite/Russie soutiennent SAF. Iran fournit drones SAF depuis 2024. Wagner/Africa Corps ambigu (deux côtés).'},
      {d:'Dépendance Sud-Soudan', i:'Soudan touche ~24 USD/baril de transit pour pétrole sud-soudanais. Pipeline endommagé par RSF (2024) → assèchement Juba ET Khartoum.'},
      {d:'Aide humanitaire', i:'~25 M personnes nécessitent assistance. Financement ONU < 30 % requis (2025). Famine déclarée Darfour aoűt 2024 (IPC 5).'}
    ],

    causes_ideologiques:[
      {a:'Suprématie arabe vs africanité', d:'Idéologie arabe-suprémaciste utilisée historiquement par Khartoum pour mobiliser contre populations non-arabes du Sud, du Darfour. Au cœur du génocide 2003-2008 et de celui en cours au Darfour.'},
      {a:'Islamisme politique (Frères musulmans soudanais)', d:'Régime Béchir dominé par Hassan al-Tourabi (FM). Réseau économique-religieux profond, marginalisé après 2019. Reste influent dans SAF. Soutien Qatar/Turquie probable.'},
      {a:'Pragmatisme RSF/Hemedti', d:'Hemedti d\'origine Rizeigat (tribu arabe Darfour). Idéologie pragmatique : pouvoir, ressources, réseaux. Cherche reconnaissance internationale (visites Moscou, Paris 2023).'},
      {a:'Démocratisation civile', d:'Mouvement Forces pour la liberté et le changement (FFC). Coalitions civiles multiples. Affaiblies par la guerre, polarisées (acceptation/refus dialogue avec belligérants).'}
    ],

    perceptions_croisees:[
      {a:'SAF voit RSF comme', b:'Milice tribale qui a trahi l\'État, instrument des Émirats, responsable de génocide. Aucune négociation possible.'},
      {a:'RSF voit SAF comme', b:'Bras armé des islamistes (Frères musulmans) et des élites du Nil. Refusent intégration qui aurait été dilution.'},
      {a:'Population civile voit la guerre comme', b:'Catastrophe imposée par deux factions militaires illégitimes. Ni l\'une ni l\'autre n\'est plébiscitée. Les FFC continuent d\'exister mais sont écrasées.'},
      {a:'EAU voit le conflit comme', b:'Opportunité stratégique : ports mer Rouge, or, contrôle puissance régionale par RSF interposée. Officiellement nient soutien militaire.'},
      {a:'Égypte voit le conflit comme', b:'Menace existentielle : barrage Nil Bleu (GERD éthiopien), instabilité frontalière, afflux réfugiés. Soutient SAF.'},
      {a:'Communauté internationale', b:'Saturation. Comparaison défavorable avec attention donnée à Ukraine/Gaza. Famine déclarée mais aide insuffisante.'}
    ],

    postures_arsenaux:{
      camp_a:{
        nom:'SAF — Forces armées soudanaises (général Burhan)',
        doctrine:'Armée régulière classique. Forces aériennes décisives (avions, drones iraniens Mohajer + Mohajer-6, Bayraktar TB2 turcs). Reprise territoriale par contrôle des routes et villes.',
        moyens:'~120-200 000 actifs (estimations divergentes). Aviation : MiG-29, Su-25, drones. Soutien matériel Égypte, Arabie saoudite, Iran, Russie (résiduel).',
        faiblesses:'Faiblesse infanterie. Cohésion interne fragile (réseaux Frères musulmans vs militaires « propres »). Économie de guerre épuisée.'
      },
      camp_b:{
        nom:'RSF — Forces de soutien rapide (Hemedti)',
        doctrine:'Forces paramilitaires de manœuvre. Mobilité 4x4. Tactique de razzia (or, civils, ressources). Massacres ciblés ethniquement (Darfour). Drones commerciaux modifiés.',
        moyens:'~70-100 000 combattants. Pickups armés. Drones commerciaux + drones EAU. Financement EAU + or Darfour. Réseau Wagner (technique).',
        faiblesses:'Aucune aviation propre. Massacres documentés érodant légitimité. Dépendance EAU. Impossibilité de gouverner les territoires conquis (refus populations).'
      }
    },

    rivalites_structurelles:[
      {dim:'Type de violence', n:'Guerre conventionnelle Khartoum vs guerre génocidaire Darfour. Deux logiques distinctes simultanées.'},
      {dim:'Géopolitique régionale', n:'Conflit par procuration EAU vs Égypte/Saoudite. Intérêts russes, iraniens, israéliens (sécurisation mer Rouge).'},
      {dim:'Mer Rouge', n:'Soudan + Yémen + Égypte = corridor vital. Russie projette base navale Port-Soudan. USA veulent l\'éviter.'},
      {dim:'Or', n:'Soudan : 3e producteur d\'or africain. Filière captée par RSF, échangée via EAU et Russie. Finance la guerre.'},
      {dim:'Réfugiés', n:'~3 M déplacés internes + ~3 M réfugiés (Tchad, Égypte, Éthiopie, Sud-Soudan). Pression sur États fragiles voisins.'},
      {dim:'Justice', n:'CPI a inculpé Béchir + Hemedti potentiellement (Darfour). Question : amnistie possible pour paix ?'}
    ],

    chronologie:[
      {d:'2019-04-11', e:'Chute Béchir', sev:8, rupture:true},
      {d:'2021-10-25', e:'Coup d\'État Burhan-Hemedti', sev:8, rupture:true},
      {d:'2023-04-15', e:'Déclenchement guerre civile (Khartoum)', sev:10, rupture:true, note:'RSF tente coup, SAF résiste'},
      {d:'2023-04-23', e:'RSF prend palais présidentiel', sev:9, rupture:false},
      {d:'2023-06-14', e:'Massacre El Geneina (Darfour)', sev:10, rupture:true, note:'Wali (gouverneur) Massalit assassiné. Étincelle ethnique.'},
      {d:'2024-04-10', e:'Siège d\'El Fasher commence', sev:9, rupture:true, note:'Dernière capitale d\'État du Darfour aux mains SAF'},
      {d:'2024-08-01', e:'Famine déclarée Camp Zamzam (Darfour)', sev:10, rupture:true, note:'IPC 5 confirmé — 1ère famine déclarée mondialement depuis 2017'},
      {d:'2024-08-30', e:'SAF reprend Sennar', sev:7, rupture:false},
      {d:'2025-01-07', e:'Génocide reconnu par US (Blinken)', sev:8, rupture:true},
      {d:'2025-03-26', e:'SAF reprend Khartoum', sev:8, rupture:true, note:'Tournant militaire majeur'},
      {d:'2025-10-26', e:'Chute El Fasher (RSF)', sev:9, rupture:true, note:'Plus grand massacre depuis 2003 documenté'},
      {d:'2026-01-15', e:'Pourparlers Manama échouent', sev:6, rupture:false}
    ],

    lecture_causale:{
      premiere:'Trente ans de duplication des forces armées par Béchir : il jouait SAF contre Janjaweed/RSF pour rester au pouvoir. La structure de violence était constituée bien avant avril 2023.',
      structurante:'Le Soudan est trop grand, trop divers et trop fragmenté pour qu\'une victoire militaire d\'un camp permette de gouverner. Toute issue militaire produira un État défaillant.',
      paradoxe:'L\'EAU finance les RSF qu\'il dénonce officiellement et qui commettent un génocide reconnu par les US — ses propres alliés stratégiques. La contradiction n\'est pas tenable à terme.',
      signal:'Le Sud-Soudan est désormais en cessation de paiements (pipeline endommagé). Si le Sud-Soudan retombe en guerre, c\'est toute la Corne qui s\'embrase. Surveiller : Juba, Bahr el Ghazal, frontière Tchad.'
    },

    brief_decideur:[
      'Première famine déclarée IPC 5 depuis 2017. Génocide Darfour reconnu par US (jan. 2025). ~150 000 morts estimés (ACLED 2024).',
      'Conflit par procuration : EAU (RSF) vs Égypte-Saoudite-Iran (SAF). Russie ambivalente, USA passifs.',
      '~10 M déplacés internes + ~3 M réfugiés. La plus grave crise humanitaire mondiale en cours.',
      'Reprise Khartoum par SAF (mars 2025) ne résout rien : RSF retranchée au Darfour, capacité de nuisance intacte.',
      'Risque de bascule régionale : Tchad, Sud-Soudan, Éthiopie tous fragilisés. Mer Rouge (route maritime) menacée.'
    ],
    brief_analyste:{
      faits:'~150 000-200 000 morts (ACLED + estimations indirectes). ~10 M déplacés (record mondial). Famine confirmée Darfour. SAF contrôle Khartoum + Est + Centre. RSF contrôle Darfour + Kordofan-Sud. Stagnation militaire après reprise Khartoum.',
      incertitudes:'Implication réelle Wagner/Africa Corps des deux côtés. Capacité réelle EAU à maintenir soutien RSF face à pression US/UE. Cohésion future Burhan / Frères musulmans.',
      hypotheses:'H1 (~50%) : partition de fait — SAF Nord/Centre, RSF Darfour/Kordofan-Sud — sans déclaration officielle. H2 (~25%) : effondrement RSF si EAU coupe (probabilité faible mais possible si pression US Trump). H3 (~15%) : effondrement SAF si crise économique aiguë. H4 (~10%) : médiation arabe (Saoudite, Égypte) menant à transition militaire-civile.',
      indicateurs_24_72h:'Position EAU sur RSF (déclarations Mohamed bin Zayed). Mouvements SAF Kordofan. Rumeurs santé Hemedti. Posture Trump/Rubio sur génocide. Combats Sud-Soudan.',
      indicateurs_7_30j:'Statistiques ACLED. Décisions sanctions US/UE sur EAU. Niveau pipeline pétrolier. Famine indicators IPC. Mouvements Wagner.',
      implications_7_30j:'Si stagnation : famine s\'élargit, Sud-Soudan effondre, ~5 M réfugiés supplémentaires possible vers Tchad/Égypte. Si rupture EAU/RSF : possible désescalade rapide.'
    },

    scenarios:[
      {nom:'Tendanciel — partition de fait', proba:50, impact:8, h:'24-48 mois', d:'SAF tient Nord/Centre/Est avec capitale Khartoum reprise. RSF tient Darfour/Kordofan-Sud. Pas d\'accord politique. Économie effondrée. Crise humanitaire chronique. Pas de service public.'},
      {nom:'Recomposition — médiation Trump-Saoudite', proba:20, impact:6, h:'12-24 mois', d:'Pression US (sanctions, déclaration génocide) force EAU à lâcher RSF. Médiation Saoudite-Égypte. Cessez-le-feu, cantonnement RSF. Transition militaire-civile négociée.'},
      {nom:'Rupture — effondrement SAF', proba:15, impact:9, h:'6-18 mois', d:'Crise économique aiguë + offensive RSF coordonnée + scission Frères musulmans dans SAF. Khartoum reprise par RSF. Pillage massif. État défaillant total.'},
      {nom:'Rupture — bascule régionale (Sud-Soudan)', proba:10, impact:9, h:'12-36 mois', d:'Sud-Soudan retombe en guerre civile (Kiir vs Machar). Effet domino. ~5 M réfugiés supplémentaires. Crise alimentaire Corne. Implication Éthiopie/Ouganda.'},
      {nom:'Wild card — base navale russe Port-Soudan', proba:5, impact:7, h:'12-24 mois', d:'Russie obtient base navale en échange soutien SAF. Tension US/Égypte/Israël. Recomposition Mer Rouge.'}
    ],

    sources:[
      {nom:'Crisis Group — Soudan', url:'https://www.crisisgroup.org/africa/horn-africa/sudan'},
      {nom:'ACLED — Sudan Conflict Observatory', url:'https://acleddata.com/sudan-conflict-monitor/'},
      {nom:'Sudan War Monitor', url:'https://sudanwarmonitor.com/'},
      {nom:'IPC — Integrated Food Security Phase Classification', url:'https://www.ipcinfo.org/'},
      {nom:'OCHA Soudan', url:'https://www.unocha.org/sudan'},
      {nom:'IRIS — Afrique', url:'https://www.iris-france.org/'}
    ]
  }

  /* Taïwan et RDC dans data3.js pour ne pas surcharger */
];

/* Merger avec CONFLITS existants : remplace les fiches compactes par les enrichies */
(function mergeEnriched(){
  if(!window.GW_DATA) return;
  CONFLITS_ENRICHIS.forEach(enr => {
    const idx = window.GW_DATA.CONFLITS.findIndex(c=>c.id===enr.id);
    if(idx>=0){
      // fusionne : on garde les champs de base de l'original et on ajoute/écrase avec l'enrichi
      window.GW_DATA.CONFLITS[idx] = { ...window.GW_DATA.CONFLITS[idx], ...enr };
    }
  });
  // Régénère les events à partir des chronologies enrichies
  window.GW_DATA.events_full = window.GW_DATA.buildEvents();
})();
