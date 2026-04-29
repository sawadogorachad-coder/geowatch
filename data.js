/* ==========================================================================
   GéoWatch — Données conflits (gabarit Note de Situation 8 dimensions)
   Méthodologie : votre NOTE_SITUATION_Iran_Israel + automation Veille MO
   ========================================================================== */

/* -------------------- CONFLITS — fiches analytiques think-tank -------------------- */
const CONFLITS = [

  /* =========== SAHEL / AES — priorité chercheur =========== */
  {
    id:'c_aes', name:'Sahel — AES (Burkina, Mali, Niger)', short:'Sahel/AES',
    region:'Afrique de l\'Ouest', priority:1, status:'escalating', intensity:8, start_year:2012,
    countries:['BF','ML','NE'], lat:14.5, lng:-1.0,
    pays_clefs:'Burkina Faso, Mali, Niger',
    actors_etat:['Junte BF (Traoré)','Junte Mali (Goïta)','Junte Niger (Tiani)','Wagner/Africa Corps','France (retrait)','CEDEAO','UE'],
    actors_non_etat:['JNIM (al-Qaïda Sahel)','EIGS (État islamique Sahel)','Mouvements touaregs (CSP/CMA)','Communautés peules'],
    keywords:['sahel','mali','burkina','niger','jnim','eigs','aes','wagner','traoré','goïta','tiani','bamako','ouagadougou','niamey','aqmi','aqim'],

    causes_historiques: [
      {p:'Avant 2012', f:'Bandes sahélo-sahariennes : foyer historique de circulation transfrontalière. Chefferies traditionnelles peules/touarègues marginalisées par les États post-coloniaux.'},
      {p:'2011 — chute de Kadhafi', f:'Retour massif d\'armes et de combattants touaregs de Libye. Déclencheur de la rébellion MNLA au nord-Mali (jan. 2012).'},
      {p:'2012-2013', f:'Effondrement État malien au nord. Coup d\'État Bamako. Intervention française Serval (jan. 2013) puis Barkhane.'},
      {p:'2013-2020', f:'Échec de la stabilisation. Diffusion vers le centre-Mali, le nord-Burkina, l\'ouest-Niger. JNIM (2017) regroupe AQMI/Ansar Dine/MUJAO.'},
      {p:'2020-2023 — séquence des coups', f:'Mali (août 2020 + mai 2021), Burkina (jan. + sept. 2022), Niger (juil. 2023). Triple junte sahélienne.'},
      {p:'2023-2024 — basculement', f:'Retrait MINUSMA (juin 2023), retrait forces françaises et US, arrivée Wagner/Africa Corps. AES créée (sept. 2023), retrait CEDEAO (jan. 2024).'},
      {p:'2024-2026', f:'Confédération AES (juil. 2024). Tensions monnaie (sortie F CFA annoncée). Échec relatif militaire malgré moyens russes. JNIM atteint banlieues Bamako (déc. 2024 - 2025).'}
    ],
    cle_historique:'La rivalité n\'est pas idéologique au départ : c\'est l\'effondrement d\'un ordre régional construit sur la délégation sécuritaire à la France. La rupture de 2022-2024 est un changement de système, pas une parenthèse.',

    causes_geographiques: [
      {c:'Bande sahélienne', i:'5 400 km d\'est en ouest, faiblement peuplée, frontières non contrôlables. Tout dispositif sécuritaire est par construction perforé.'},
      {c:'Triple frontière Liptako-Gourma (BF-ML-NE)', i:'Épicentre des attaques JNIM/EIGS. Zone de refuge et de manœuvre depuis 2017.'},
      {c:'Enclavement', i:'Aucun accès à la mer pour les 3 États AES. Dépendance ports : Abidjan, Lomé, Cotonou, Tema, Dakar. Le Bénin et la Côte d\'Ivoire sont devenus des leviers stratégiques.'},
      {c:'Profondeur désertique', i:'Refuges naturels Adrar des Ifoghas, Aïr, Liptako. Frappes aériennes peu efficaces en l\'absence de renseignement humain dense.'},
      {c:'Climat — Lac Tchad/Sahel', i:'Pluviométrie en recul. Concurrence agriculteurs/éleveurs alimente le recrutement jihadiste sur fond foncier.'}
    ],

    causes_economiques: [
      {d:'Économie de rente', i:'Or (BF, Mali) capté en partie par filières informelles + Wagner. Coton (BF) sous pression climatique. Uranium nigérien : levier diplomatique vis-à-vis France (Orano) et débouchés russes/iraniens.'},
      {d:'Sanctions CEDEAO', i:'Embargo après coups (Mali 2022, Niger 2023). Effet boomerang : rapprochement AES, sortie CEDEAO, projet monnaie Sahel.'},
      {d:'Dépendance aide', i:'Aide publique au dév. = 8-15 % PIB selon pays. Suspension partenaires occidentaux → bascule Russie/Chine/Turquie/Émirats.'},
      {d:'Économie de guerre informelle', i:'Trafics armes/drogue/migrants alimentent groupes armés. Rente du jihad estimée plusieurs dizaines de millions $/an (rançons, taxes JNIM, contrôle pistes).'},
      {d:'Coût Wagner/Africa Corps', i:'Mali ~10 M$/mois selon estimations, paiements partiels en or et concessions minières. Modèle prédateur soutenable seulement si rente extractive.'}
    ],

    causes_ideologiques: [
      {a:'Souverainisme militaire', d:'Doctrine de la « refondation » et du panafricanisme révolutionnaire (Sankara revisité, Traoré). Rejet de la « Françafrique ». Légitimation populaire forte mais fragile.'},
      {a:'Jihadisme salafiste', d:'JNIM = wilayah AQMI revendiquée, légitimité religieuse via Iyad Ag Ghaly. EIGS = territorialisation de Daesh, plus brutal, en rivalité avec JNIM.'},
      {a:'Islam confrérique', d:'Tijaniyya, Qadiriyya — historiquement modérateurs, marginalisés par le salafisme et par les juntes (suspicion de proximité avec l\'ancien régime).'},
      {a:'Récit anti-impérialiste russe', d:'Réseau RT/Sputnik en français, influenceurs locaux. Vise à légitimer Wagner et délégitimer présence occidentale.'}
    ],

    perceptions_croisees: [
      {a:'Juntes AES voient Occident comme', b:'Acteur néocolonial, allié objectif des jihadistes (théorie complotiste largement diffusée), responsable de l\'échec sécuritaire 2013-2022.'},
      {a:'Occident (France/UE/US) voit AES comme', b:'Régimes putschistes alignés sur Moscou, mauvais payeurs, instrumentalisant le sentiment anti-français pour se maintenir.'},
      {a:'Populations urbaines sahéliennes voient les juntes comme', b:'Rupture nécessaire et incarnation d\'une dignité retrouvée. Soutien massif à Traoré (>80 % en 2024 selon sondages partiaux).'},
      {a:'Populations rurales voient l\'État comme', b:'Absent ou prédateur. Souvent acceptation tacite de la gouvernance jihadiste là où JNIM apporte sécurité minimale + justice expéditive.'}
    ],

    postures_arsenaux: {
      camp_a:{nom:'Forces AES + Wagner', doctrine:'Reprise en main territoriale brutale, opérations conjointes BF-Mali-Niger depuis 2024. Forces aériennes turques (TB2/Akıncı) + drones iraniens reportés.', moyens:'Mali ~25 000 FAMa + ~2 000 Wagner/Africa Corps. BF ~12 000 + 100 000 VDP (volontaires). Niger ~30 000 FANI. Budgets cumulés ~1,5 Md$/an.', faiblesses:'Faible renseignement humain, exactions multipliant les recrutements jihadistes, dépendance Wagner.'},
      camp_b:{nom:'JNIM + EIGS', doctrine:'Guérilla d\'usure, IED massifs, contrôle territorial graduel par la peur + arbitrage social. Évitement bataille rangée.', moyens:'JNIM estimé 5 000-8 000 combattants. EIGS 1 500-3 000. Armement léger + IED + drones commerciaux.', faiblesses:'Rivalités internes JNIM/EIGS, absence de projet politique national crédible au-delà de l\'émirat local.'}
    },

    rivalites_structurelles: [
      {dim:'Légitimité régionale', n:'AES vs CEDEAO. Rupture institutionnelle d\'avril 2024. Question : quelle nouvelle architecture sécuritaire ouest-africaine ?'},
      {dim:'Souveraineté monétaire', n:'Sortie F CFA annoncée. Risque : chaos monétaire à court terme, autonomie à moyen terme. Banque centrale AES en projet.'},
      {dim:'Compétition extérieure', n:'Russie (Wagner/Africa Corps), Chine (mines, infrastructures), Turquie (drones, mosquées), Émirats (or, formation), Iran (uranium NE), Corée du Nord (rapports — non confirmé). France/UE en retrait, US prudents.'},
      {dim:'Côtière vs continentale', n:'Bénin et Côte d\'Ivoire sous pression jihadiste depuis 2021. Risque de littoralisation du conflit. Le Sahel n\'est plus contenu.'},
      {dim:'Modèle de gouvernance', n:'Démocratie libérale procédurale (CEDEAO) vs régime militaire à légitimité plébiscitaire (AES). Question idéologique majeure pour toute l\'Afrique.'}
    ],

    chronologie: [
      {d:'2020-08-18', e:'Coup d\'État au Mali (Goïta)', sev:7, rupture:false},
      {d:'2022-01-24', e:'Coup d\'État Burkina (Damiba)', sev:7, rupture:false},
      {d:'2022-09-30', e:'Contre-coup Burkina — Traoré au pouvoir', sev:7, rupture:true, note:'Bascule géopolitique : pivot Russie immédiat'},
      {d:'2023-06-30', e:'Retrait MINUSMA validé par Mali', sev:8, rupture:true, note:'Fin de la présence ONU au Sahel'},
      {d:'2023-07-26', e:'Coup d\'État Niger (Tiani)', sev:8, rupture:true, note:'Triple junte AES'},
      {d:'2023-09-16', e:'Création Alliance des États du Sahel', sev:7, rupture:true},
      {d:'2024-01-28', e:'Retrait CEDEAO Mali/BF/Niger', sev:8, rupture:true, note:'Rupture institutionnelle ouest-africaine'},
      {d:'2024-07-06', e:'Confédération AES officialisée', sev:6, rupture:false},
      {d:'2024-07-25', e:'Embuscade Tinzaouaten — Wagner décimé par CSP-DPA + JNIM', sev:9, rupture:true, note:'Plus lourde défaite Wagner depuis Bakhmut. Renseignement ukrainien suspecté.'},
      {d:'2024-12-15', e:'JNIM atteint banlieue Bamako (Kati)', sev:8, rupture:false},
      {d:'2025-04-10', e:'Annonce monnaie AES', sev:6, rupture:false},
      {d:'2026-02-14', e:'Attaque coordonnée Bobo-Dioulasso', sev:8, rupture:false}
    ],

    lecture_causale:{
      premiere:'Effondrement de l\'ordre sécuritaire post-Serval. La France a délégué la stabilisation sans transférer les capacités, créant un vide que les juntes ont occupé politiquement et que Wagner occupe militairement.',
      structurante:'La géographie sahélienne rend toute solution militaire seule impossible. Sans réintégration politique des marges et sans assèchement économique du jihad, l\'expansion territoriale continuera.',
      paradoxe:'Plus les juntes s\'appuient sur Wagner et la verticalité militaire, plus elles renforcent la légitimité jihadiste comme alternative locale (justice, sécurité minimale, respect identitaire). La force seule produit son propre adversaire.',
      signal:'L\'extension côtière (Bénin, Togo, Côte d\'Ivoire) — si confirmée — marquera la mutation de la crise sahélienne en crise ouest-africaine. Surveiller : attaques nord-Bénin/nord-Togo, posture ivoirienne.'
    },

    brief_decideur: [
      'Le Sahel n\'est plus un théâtre de stabilisation : c\'est un théâtre de recomposition géopolitique.',
      'L\'AES tient politiquement (popularité Traoré) mais cède territorialement (avancée JNIM jusqu\'à Bamako).',
      'Wagner/Africa Corps coûte plus qu\'il ne rapporte militairement ; le modèle est prédateur, non stabilisateur.',
      'Le risque majeur 2026 est la littoralisation : Bénin et Côte d\'Ivoire deviennent les nouveaux fronts.',
      'La sortie du F CFA annoncée transforme la crise sécuritaire en crise économique systémique régionale.'
    ],
    brief_analyste:{
      faits:'Trois juntes coordonnées politiquement (AES) mais militairement en difficulté. Wagner subit sa pire défaite (Tinzaouaten 07/2024). JNIM contrôle ou influence ~40 % du territoire BF, ~30 % Mali, en progression Niger. Attaques mensuelles en hausse de ~25 % en glissement annuel.',
      incertitudes:'Solidité réelle de la confédération AES (rivalités personnelles Traoré/Goïta/Tiani ?). Implication Iran/Corée du Nord (rumeurs, pas de preuve open source). Capacité ukrainienne à appuyer rebelles touaregs durablement.',
      hypotheses:'H1 (la plus probable, ~55%) : statu quo dégradé — territoire perdu, juntes maintenues, dépendance Wagner croissante. H2 (~25%) : effondrement d\'un État (Burkina ou Mali) — chute capitale, gouvernement de transition jihadiste. H3 (~15%) : recomposition régionale — réintégration partielle CEDEAO via négociation, retour ordre constitutionnel d\'ici 2028. H4 (~5%) : militarisation US/UE renouvelée si menace européenne directe (terrorisme, migrations).',
      indicateurs_24_72h:'Attaques sur Kati ou Ouagadougou centre. Mouvements troupes Bénin/CI. Communiqués CGRI Iran/Pasdaran sur Sahel. Annonce Africa Corps (relève Wagner). Trafic armes vers Tinzaouaten.',
      indicateurs_7_30j:'Statistiques ACLED mensuelles. Décisions sommet AES. Position Trump (US) sur Africa Corps. Évolution cours or et opérations minières. Décision Bénin sur état d\'urgence nord.',
      implications_7_30j:'Risque accru attentat capitale ouest-africaine. Pression migratoire vers littoral et Méditerranée. Renforcement narratif anti-occidental médias panafricains.'
    },

    scenarios: [
      {nom:'Tendanciel — érosion lente', proba:55, impact:7, h:'12-24 mois', d:'Les juntes tiennent par la force et la popularité urbaine, mais perdent du territoire rural. Wagner reste mais ne stabilise pas. JNIM consolide ses émirats. Attaques sur capitales sans les prendre. Sortie partielle F CFA, instabilité monétaire gérée.'},
      {nom:'Rupture — chute d\'un État', proba:25, impact:9, h:'6-18 mois', d:'Un État (probablement BF ou Mali) bascule : prise de capitale ou effondrement militaire complet. Gouvernement transitionnel forcé d\'inclure jihadistes. Onde de choc régionale, exode massif, intervention extérieure non-occidentale possible (Égypte, Algérie).'},
      {nom:'Recomposition — pacte régional', proba:15, impact:6, h:'24-48 mois', d:'Médiation (Algérie, Maroc, Turquie ou Vatican). Cessez-le-feu local négocié JNIM/État. Réintégration CEDEAO partielle via formule hybride. Calendrier électoral réactivé 2027-2028.'},
      {nom:'Wild card — front uni jihadiste', proba:5, impact:10, h:'inconnue', d:'Réconciliation JNIM/EIGS sous pression saoudienne ou émirienne. Ou alliance offensive avec Boko Haram. Bascule régionale en quelques semaines.'}
    ],

    sources: [
      {nom:'ACLED Dashboard Sahel', url:'https://acleddata.com/dashboard/'},
      {nom:'IRIS — Observatoire Boko Haram et Sahel', url:'https://www.iris-france.org/observatoires/observatoire-boko-haram/'},
      {nom:'FRS — Sahel', url:'https://frstrategie.org/recherche/themes/afrique-subsaharienne'},
      {nom:'Crisis Group — Sahel', url:'https://www.crisisgroup.org/africa/sahel'},
      {nom:'Diploweb — dossiers Sahel', url:'https://www.diploweb.com/-Afrique-.html'},
      {nom:'Le Grand Continent — Afrique', url:'https://legrandcontinent.eu/fr/categorie/zones/afrique/'}
    ]
  },

  /* =========== IRAN — ISRAËL (votre note) =========== */
  {
    id:'c_iran_il', name:'Iran — Israël', short:'Iran-Israël',
    region:'Moyen-Orient', priority:1, status:'escalating', intensity:9, start_year:1979,
    countries:['IR','IL'], lat:32.4, lng:45.0,
    pays_clefs:'Iran, Israël, États-Unis, Liban, Syrie, Irak, Yémen, Golfe',
    actors_etat:['Israël','Iran','États-Unis','Russie','Chine','Arabie saoudite','Émirats','Turquie','UE'],
    actors_non_etat:['Hezbollah','Hamas','Houthis','Milices irakiennes (Kataib Hezbollah)','Pasdaran/CGRI','Force Al-Qods'],
    keywords:['iran','israel','israël','khamenei','netanyahu','hezbollah','hamas','houthis','pasdaran','cgri','tel aviv','tehran','téhéran','fordo','natanz','qods','ormuz','strait of hormuz'],

    causes_historiques: [
      {p:'VIIIe s. av. J.-C. – 1925', f:'Coexistence judéo-persane de 28 siècles. Cyrus le Grand libère les Juifs de Babylone (538 av. J.-C.) — Ésaïe le nomme « messie ». Talmud rédigé sous protection perse.'},
      {p:'1925 – 1979', f:'Pahlavi : relations cordiales. Alliance stratégique via la « doctrine de la périphérie » (Ben Gourion). Coopération militaire et technologique poussée.'},
      {p:'1979 — rupture fondatrice', f:'Révolution islamique : ambassade d\'Israël devient ambassade de Palestine. Khomeini reçoit Arafat en premier visiteur. La haine est construite politiquement, pas naturelle.'},
      {p:'1980 – 2022', f:'Guerre froide indirecte : proxies, cyberattaques (Stuxnet 2010), assassinats ciblés. Aucune confrontation directe pendant 45 ans. L\'Iran finance l\'axe de la résistance.'},
      {p:'2023 – 2025', f:'Du 7 octobre à la guerre des Douze Jours. Effondrement progressif de l\'arc chiite. Frappes directes Iran/Israël depuis avril 2024.'},
      {p:'2026', f:'Guerre totale (op. Roaring Lion + Epic Fury). Mort de Khamenei. Fermeture du détroit d\'Ormuz. Soulèvement iranien. Recomposition régionale en cours.'}
    ],
    cle_historique:'La rivalité n\'est pas éternelle : elle a une date de naissance (1979) et des causes politiques construites. Cette grille interdit toute lecture essentialiste.',

    causes_geographiques: [
      {c:'Israël : 15 km largeur min.', i:'Aucune profondeur stratégique → doctrine préventive absolue. Un missile suffit à couper le pays en deux.'},
      {c:'Iran : 1 648 000 km², relief montagneux', i:'Forteresse naturelle. Toute invasion terrestre est impossible. Fordo est à 80 m sous le massif du Zagros.'},
      {c:'Détroit d\'Ormuz', i:'20 % du pétrole mondial. Arme économique ultime de l\'Iran contre toute l\'économie globale.'},
      {c:'États tampons (Irak, Syrie, Liban)', i:'Absence de frontière commune → Iran construit l\'arc chiite pour combler la distance par des proxies.'},
      {c:'Jérusalem — géographie du sacré', i:'Lieu physique de revendications absolues. Non-négociable par nature pour les trois monothéismes.'}
    ],

    causes_economiques: [
      {d:'Asymétrie modèles', i:'Iran : économie rentière pétrolière. Israël : économie de l\'innovation (Start-up Nation). Aucune interdépendance bilatérale → coût d\'entrée en guerre structurellement bas.'},
      {d:'Sanctions', i:'80 % des recettes iraniennes issues des hydrocarbures. Sanctions = asphyxie lente du régime. L\'Iran détourne +20 Mds USD vers ses proxies depuis 2012.'},
      {d:'Corridors rivaux', i:'Corridor d\'Abraham (Inde–Golfe–Haïfa) vs Arc chiite terrestre (Téhéran–Méditerranée). Chaque projet menace l\'autre.'},
      {d:'IDE en Israël', i:'Instabilité entretenue par l\'Iran freine les IDE → cause économique de la réponse militaire israélienne.'}
    ],

    causes_ideologiques: [
      {a:'Velayat-e Faqih (Iran)', d:'Islam chiite d\'État depuis les Séfévides (1501). Notion d\'impureté rituelle (najasa) envers non-musulmans. Doctrine Khomeini : la destruction d\'Israël est un devoir divin. L\'antisionisme est constitutif du régime.'},
      {a:'Sionisme + mémoire de la Shoah (Israël)', d:'Projet d\'émancipation nationale après 2 000 ans de diaspora. Mémoire de la Shoah : filtre perceptif absolu. Tout discours d\'élimination = programme génocidaire sérieux.'},
      {a:'Jérusalem (Al-Quds)', d:'Érigée en symbole universel de l\'islam pour fédérer sunnites et chiites derrière l\'Iran.'},
      {a:'Évangélisme américain', d:'Israël = signe eschatologique → soutien inconditionnel d\'une fraction de l\'électorat US.'}
    ],

    perceptions_croisees: [
      {a:'L\'Iran voit Israël comme', b:'Implant colonial occidental — « entité sioniste » temporaire vouée à disparaître. Avant-poste américain (« petit Satan »). Force occulte de domination mondiale.'},
      {a:'Israël voit l\'Iran comme', b:'Régime apocalyptique guidé par l\'idéologie plutôt que par la raison d\'État. État-parrain du terrorisme par proxies. Puissance dissimulant son programme nucléaire à l\'AIEA.'},
      {a:'Fracture cruciale', b:'La population iranienne n\'est en majorité ni antisioniste ni anti-américaine — c\'est une construction du régime, imposée par le haut.'},
      {a:'Guerre de l\'information', b:'L\'Iran utilise médias multilingues ; Israël mène opérations d\'influence algorithmique ciblant la population iranienne.'}
    ],

    postures_arsenaux: {
      camp_a:{nom:'Israël', doctrine:'Offensive préventive systématique. Décapitation des réseaux ennemis.', moyens:'Dôme de fer / Fronde de David / Arrow 3 (90 % interceptions juin 2025). Frappes préventives sur sites nucléaires. Budget défense ~33 Mds USD.', faiblesses:'Profondeur stratégique nulle. Coût d\'interception massivement supérieur au coût d\'attaque (Arrow 3M$ vs Shahed 30k$).'},
      camp_b:{nom:'Iran', doctrine:'Dissuasion asymétrique par délégation.', moyens:'Drones Shahed (20-50 k$/unité) en masse. Missiles balistiques Fateh, Fattah, Emad. Réseau de proxies (Hezbollah, Hamas, Houthis). Levier d\'Ormuz : péage en yuan/crypto. Budget défense ~8 Mds USD (rapport 1:4).', faiblesses:'Économie sous sanctions, défenses anti-aériennes obsolètes (S-300 neutralisés oct. 2024), proxies décimés depuis 2024.'}
    },

    rivalites_structurelles: [
      {dim:'Hégémonie régionale', n:'Deux acteurs non-arabes en compétition pour dominer un espace majoritairement arabe.'},
      {dim:'Nucléaire', n:'Iran : bombe = garantie de survie du régime. Israël : Iran nucléaire = menace existentielle absolue. Insoluble.'},
      {dim:'Proxies', n:'L\'arc de résistance était la guerre délocalisée. Depuis 2024, la guerre est devenue directe.'},
      {dim:'Légitimité islamique', n:'Iran se pose en champion de la cause palestinienne pour fédérer le monde musulman au-delà du chiisme.'},
      {dim:'Global', n:'Rivalité USA/Chine-Russie projetée sur le Moyen-Orient. Iran = partenaire Chine-Russie ; Israël = ancre US.'}
    ],

    chronologie: [
      {d:'2023-10-07', e:'Attaque du Hamas (1 200 morts) — déclencheur', sev:10, rupture:true},
      {d:'2024-04-01', e:'Israël bombarde le consulat iranien à Damas — ligne rouge franchie', sev:9, rupture:true, note:'16 morts dont général Zahedi'},
      {d:'2024-04-13', e:'1ère attaque directe Iran → Israël (op. Promesse honnête 1)', sev:9, rupture:true, note:'~300 missiles/drones, 99 % interceptés'},
      {d:'2024-07-31', e:'Assassinat Haniyeh à Téhéran', sev:8, rupture:false},
      {d:'2024-09-27', e:'Assassinat Nasrallah', sev:9, rupture:true},
      {d:'2024-10-01', e:'2e attaque directe Iran (200 missiles)', sev:8, rupture:false},
      {d:'2024-12-08', e:'Chute d\'Assad — arc chiite rompu géographiquement', sev:9, rupture:true},
      {d:'2025-06-13', e:'Guerre des Douze Jours — op. Rising Lion (IL)', sev:10, rupture:true},
      {d:'2025-06-22', e:'op. Midnight Hammer (USA) sur Fordo, Natanz, Ispahan', sev:10, rupture:true, note:'~1 054 morts iraniens'},
      {d:'2025-06-24', e:'Cessez-le-feu fragile', sev:6, rupture:false},
      {d:'2026-02-28', e:'Guerre totale — op. Roaring Lion + Epic Fury. Khamenei tué', sev:10, rupture:true, note:'Détroit d\'Ormuz fermé'},
      {d:'2026-04-13', e:'Blocus US d\'Ormuz', sev:9, rupture:true}
    ],

    lecture_causale:{
      premiere:'La révolution islamique de 1979 transforme un allié en ennemi existentiel constitutif du régime.',
      structurante:'La géographie impose à Israël une doctrine préventive et à l\'Iran une stratégie asymétrique — indépendamment des idéologies.',
      paradoxe:'Démanteler la dissuasion iranienne peut accélérer la course à la bombe plutôt que l\'arrêter. Et la décapitation du régime peut produire un État instable nucléaire, plus dangereux qu\'un Iran clérical contenu.',
      signal:'La population iranienne n\'est pas structurellement hostile — la paix est possible sans changement de peuple, mais elle exige un changement de régime ou de doctrine.'
    },

    brief_decideur: [
      'L\'arc chiite est militairement effondré (Hezbollah, Hamas, Assad, S-300 iraniens). L\'Iran est nu.',
      'Khamenei mort, le régime entre en crise de succession ouverte.',
      'Fermeture d\'Ormuz = choc pétrolier global, récession probable. Levier d\'usure ultime de Téhéran.',
      'Le risque d\'une bombe iranienne « de désespoir » augmente, paradoxalement, après les frappes américaines.',
      'La transition iranienne (succession ou révolution) déterminera la stabilité régionale pour 20 ans.'
    ],
    brief_analyste:{
      faits:'Détroit d\'Ormuz fermé depuis 28 fév. 2026. Khamenei tué. Successeur officieux : Mojtaba Khamenei (fils) ou Conseil de discernement. Soulèvement iranien : 7 000+ morts. Rial en chute libre (-80 % en 6 mois). Pas de révolution constituée à ce stade.',
      incertitudes:'Doctrine de réponse iranienne post-Khamenei (continuité ou rupture ?). Posture chinoise sur Ormuz (volonté/capacité d\'intervenir ?). État réel des sites Fordo/Natanz post-frappes (capacité résiduelle d\'enrichissement ?).',
      hypotheses:'H1 (~40%) : continuité régime affaiblie, retrait tactique, course nucléaire clandestine accélérée. H2 (~25%) : transition Pasdaran (junte militaire), durcissement, sortie TNP. H3 (~20%) : effondrement régime, État défaillant nucléaire — pire scénario. H4 (~10%) : ouverture vers Occident sous pression économique. H5 (~5%) : guerre civile prolongée.',
      indicateurs_24_72h:'Annonce successeur Guide. Mouvements navals US/Chine Golfe. Prix du Brent. Communiqués CGRI/Pasdaran. État sites Fordo/Natanz (imagerie satellite). Position Russie.',
      indicateurs_7_30j:'Cours pétrole maintenu >120$/baril. Mouvements troupes US au Moyen-Orient. Décisions Conseil sécurité ONU. Niveau enrichissement uranium déclaré ou détecté. Fuite cadres scientifiques iraniens.',
      implications_7_30j:'Choc pétrolier durable → inflation mondiale +2-3 pts. Recomposition arabe (Saoudiens en pivot). Risque attentats lieux civils par cellules dormantes Hezbollah en Europe/Amérique latine.'
    },

    scenarios: [
      {nom:'Tendanciel — Iran affaibli, ordre US-saoudien', proba:40, impact:7, h:'12-36 mois', d:'Régime iranien survit mais affaibli. Reconstruction proxies lente. Saoudiens dominent OPEC+ et arbitrent Levant. Israël intègre normalisation arabe (extension Abraham). Sahel et Russie reviennent par défaut.'},
      {nom:'Rupture — junte Pasdaran nucléaire', proba:25, impact:9, h:'6-12 mois', d:'CGRI prend le pouvoir, sortie TNP, accélération bombe. Sanctions totales mais marché chinois maintenu. Course aux armements régionale (Saoudite, Turquie). Risque frappes israéliennes répétées.'},
      {nom:'Effondrement — Iran État défaillant', proba:20, impact:10, h:'inconnue', d:'Guerre civile ou désintégration territoriale (Kurdes, Azéris, Baloutches). Stocks d\'uranium dispersés. Risque prolifération non-étatique. Catastrophe humanitaire ~80 M habitants.'},
      {nom:'Ouverture — transition négociée', proba:10, impact:6, h:'24-48 mois', d:'Pression économique force ouverture. Réformistes ou pragmatiques (type Pezeshkian) prennent ascendant. Accord nucléaire reformulé. Réintégration progressive. Difficile mais pas impossible.'},
      {nom:'Wild card — frappe nucléaire iranienne', proba:5, impact:10, h:'inconnue', d:'Course-à-l\'abîme : Iran teste ou utilise une arme rudimentaire avant que Fordo ne soit définitivement neutralisé. Réponse israélienne dévastatrice. Catastrophe régionale.'}
    ],

    sources: [
      {nom:'ISW — Iran Update', url:'https://understandingwar.org/'},
      {nom:'IISS — Strategic Comments Iran', url:'https://www.iiss.org/'},
      {nom:'Crisis Group — Iran', url:'https://www.crisisgroup.org/middle-east-north-africa/gulf-and-arabian-peninsula/iran'},
      {nom:'IRIS — Observatoire géopolitique du religieux', url:'https://www.iris-france.org/observatoires/'},
      {nom:'FRS — Programme Moyen-Orient', url:'https://frstrategie.org/recherche/themes/moyen-orient'},
      {nom:'Le Grand Continent — Iran', url:'https://legrandcontinent.eu/fr/categorie/regions/iran/'}
    ]
  },

  /* =========== UKRAINE — RUSSIE =========== */
  {
    id:'c_ukr', name:'Ukraine — Russie', short:'Ukraine-Russie',
    region:'Europe de l\'Est', priority:1, status:'escalating', intensity:9, start_year:2014,
    countries:['UA','RU','BY'], lat:48.5, lng:35.0,
    pays_clefs:'Ukraine, Russie, OTAN, UE, Bélarus, Corée du Nord',
    actors_etat:['Russie','Ukraine','OTAN','UE','États-Unis','Bélarus','Corée du Nord (troupes)','Iran (drones)','Chine (économie)'],
    actors_non_etat:['Wagner (post-Prigojine)','Légion Russie libre','Volontaires internationaux','Hackers Sandworm/GRU'],
    keywords:['ukraine','russia','russie','kyiv','moscou','donbass','crimea','crimée','zelensky','putin','poutine','kharkiv','odessa','mariupol','wagner','prigojine','azov','bakhmut','koursk'],

    causes_historiques: [
      {p:'IXe – XVIIe s.', f:'Rus de Kiev — matrice partagée. Orthodoxie commune. Mais trajectoires divergentes : Ukraine partagée Pologne-Lituanie-Empire ottoman ; Moscou s\'érige en « 3e Rome ».'},
      {p:'1654 — Pereïaslav', f:'Hetmanat cosaque sous protection tsariste. Lecture russe : réunion. Lecture ukrainienne : alliance trahie.'},
      {p:'1932-33 — Holodomor', f:'Famine planifiée par Staline, ~4 M morts. Mémoire fondatrice ukrainienne moderne, niée jusqu\'en 1991.'},
      {p:'1991', f:'Indépendance ukrainienne (>90 % oui au référendum). Mémorandum de Budapest (1994) : abandon arsenal nucléaire contre garanties (UA, US, RU, UK).'},
      {p:'2004-2014', f:'Révolution orange (2004), révolution de Maïdan (2013-14). Annexion Crimée (mars 2014), guerre du Donbass.'},
      {p:'24 fév. 2022', f:'Invasion à grande échelle. Échec Kyiv en 72 h. Front se stabilise.'},
      {p:'2022-2026', f:'Guerre d\'usure. Contre-offensive UA 2023 limitée. Avancée russe 2024-26 par destruction. Frappes drones longue portée. Internationalisation : Iran (drones), Corée du Nord (troupes), Chine (composants).'}
    ],
    cle_historique:'La guerre n\'est pas un accident : c\'est l\'aboutissement de 30 ans de désaccord sur la nature de la souveraineté ukrainienne. La Russie n\'admet pas une Ukraine pleinement post-soviétique.',

    causes_geographiques: [
      {c:'Plaine ukrainienne', i:'Pas d\'obstacle naturel entre Moscou et l\'Europe centrale → doctrine russe de profondeur stratégique par contrôle de l\'Ukraine.'},
      {c:'Crimée et mer Noire', i:'Sébastopol = base flotte russe depuis Catherine II. Perte de la Crimée = perte de la projection vers Méditerranée orientale.'},
      {c:'Corridor terrestre vers Crimée', i:'Donbass + Marioupol + Kherson = continuité territoriale. Objectif russe non-négociable depuis 2022.'},
      {c:'Bassins industriels Donbass', i:'Charbon, métallurgie, chimie. Centre historique de l\'industrialisation soviétique. Identité ouvrière russophone forte.'},
      {c:'Frontière OTAN', i:'1 215 km (avec adhésion finlandaise 2023). La frontière OTAN-Russie a doublé depuis 2022 — exact opposé du résultat recherché par Moscou.'}
    ],

    causes_economiques: [
      {d:'Gaz et corridors', i:'Ukraine = corridor de transit historique. Gazprom perd un client et un transitaire. Nord Stream sabotés (sept. 2022) ferment l\'arbitrage.'},
      {d:'Céréales', i:'UA = top 5 mondial blé/maïs. Blocus mer Noire 2022-23 a déclenché crise alimentaire africaine. Initiative céréales (juil. 2022) puis rupture (juil. 2023).'},
      {d:'Sanctions', i:'14 paquets UE. Avoirs banque centrale russe (300 Mds$) gelés. PIB russe maintenu par économie de guerre + détournement via EAU/Turquie/Inde.'},
      {d:'Reconstruction', i:'Estimation Banque mondiale ~500 Mds$. Mécanisme « Ukraine Facility » UE : 50 Mds€ sur 2024-2027.'}
    ],

    causes_ideologiques: [
      {a:'Russkiy mir', d:'« Monde russe » : doctrine impériale combinant orthodoxie, langue russe, héritage soviétique. Projetée comme communauté civilisationnelle au-delà des frontières.'},
      {a:'Nation civique ukrainienne', d:'Construction post-Maïdan d\'une identité non-ethnique mais politique (européenne, démocratique, bilingue). Vasalisation russe = négation existentielle.'},
      {a:'Eurasisme (Douguine)', d:'Influence intellectuelle sur Poutine. Vision multipolaire civilisationnelle. Anti-libérale, anti-LGBT, anti-occidentale.'},
      {a:'OTAN vue par Moscou', d:'Alliance offensive existentielle. L\'élargissement de 1999-2004 perçu comme trahison post-Guerre froide. Adhésion ukrainienne = ligne rouge absolue.'}
    ],

    perceptions_croisees: [
      {a:'Russie voit Ukraine comme', b:'Création artificielle (Lénine), territoire historiquement russe, capté par un régime « néonazi » manipulé par Washington.'},
      {a:'Ukraine voit Russie comme', b:'Empire colonial impossible à apaiser. Toute négociation = report de la prochaine agression.'},
      {a:'Europe voit la guerre comme', b:'Test de la sécurité européenne post-1945. Test de la crédibilité OTAN. Test de la capacité industrielle de défense.'},
      {a:'Sud global voit la guerre comme', b:'Affaire européenne (« guerre des riches »), non-prioritaire. Méfiance envers le « 2 poids 2 mesures » occidental (Gaza vs Ukraine).'}
    ],

    postures_arsenaux: {
      camp_a:{nom:'Ukraine + soutiens', doctrine:'Défense en profondeur, frappes asymétriques (drones longue portée, sabotage en territoire russe).', moyens:'~700 000 hommes mobilisés. ATACMS, Storm Shadow, F-16, Patriot. Industrie drones nationale massive (~2 M unités/an). Soutien UE/US fluctuant.', faiblesses:'Démographie (-30 % population effective). Énergie attaquée. Fatigue politique partenaires. Ambiguïté Trump.'},
      camp_b:{nom:'Russie + alliés', doctrine:'Guerre d\'usure, supériorité quantitative artillerie + drones, attrition démographique adversaire.', moyens:'~1,3 M hommes. Production massive obus (>3 M/an). Drones Shahed iraniens. ~12 000 troupes Nord-coréennes (Koursk). Économie de guerre 7-8 % PIB.', faiblesses:'Pertes ~700 000 selon UK MoD. Inflation, taux 21 %. Démographie. Dépendance Chine sans contrepartie politique.'}
    },

    rivalites_structurelles: [
      {dim:'Sécurité européenne', n:'Test OTAN : crédibilité art. 5, capacité industrielle, dissuasion future contre la Russie post-guerre.'},
      {dim:'Ordre international', n:'Inviolabilité des frontières post-1945 contre droit du plus fort. Précédent crucial pour Taïwan/Cachemire/Sahel.'},
      {dim:'Économie de guerre', n:'Russie a démontré qu\'une économie peut supporter une guerre prolongée sous sanctions si autocratie + matières premières + débouchés non-occidentaux.'},
      {dim:'Multipolarité', n:'Cas test BRICS+ : refus alignement, profitent des dislocations (Inde achète pétrole russe à prix cassé, Turquie joue les deux camps).'}
    ],

    chronologie: [
      {d:'2014-02-27', e:'Hommes verts en Crimée', sev:9, rupture:true},
      {d:'2014-03-18', e:'Annexion Crimée', sev:10, rupture:true},
      {d:'2022-02-24', e:'Invasion à grande échelle', sev:10, rupture:true},
      {d:'2022-09-21', e:'Mobilisation partielle russe', sev:8, rupture:false},
      {d:'2023-06-23', e:'Mutinerie Wagner / marche sur Moscou', sev:8, rupture:true, note:'Crise sans précédent du régime'},
      {d:'2023-08-23', e:'Mort de Prigojine', sev:7, rupture:false},
      {d:'2024-08-06', e:'Offensive ukrainienne en Koursk', sev:9, rupture:true, note:'1ère invasion territoire russe depuis 1945'},
      {d:'2024-10-15', e:'Troupes nord-coréennes confirmées en Russie', sev:8, rupture:true},
      {d:'2024-11-19', e:'Ukraine tire ATACMS sur territoire russe (autorisation Biden)', sev:8, rupture:true},
      {d:'2025-01-20', e:'Investiture Trump — incertitude majeure soutien US', sev:9, rupture:true},
      {d:'2025-08-15', e:'Sommet Alaska Trump-Poutine — pas d\'accord', sev:7, rupture:false},
      {d:'2026-03-10', e:'Effondrement front russe oblast Sumy (hypothèse)', sev:8, rupture:false}
    ],

    lecture_causale:{
      premiere:'Refus russe de la souveraineté ukrainienne pleine et entière, doublé de l\'élargissement OTAN — deux facteurs nécessaires, l\'un suffisant.',
      structurante:'L\'Ukraine est trop grande pour être conquise et trop importante pour être abandonnée par l\'Occident. La guerre tend vers un état stationnaire violent.',
      paradoxe:'Plus la Russie utilise la force, plus elle pousse à l\'élargissement OTAN (Finlande, Suède) et au réarmement européen — exact inverse du but recherché.',
      signal:'L\'attitude américaine sous Trump 2 est la variable décisive 2025-2027. Sans soutien US, l\'UE peut compenser ~70-80 % seulement, insuffisant pour victoire UA mais suffisant pour blocage.'
    },

    brief_decideur: [
      'La guerre tend vers un blocage prolongé : Russie ne perd pas, Ukraine ne gagne pas.',
      'Trump 2 = variable décisive 2025-2027. Scénario « gel » négocié probable mais piégé.',
      'Risque majeur : Europe seule face à Russie post-Trump. Réarmement européen insuffisant à horizon 2027.',
      'Effets secondaires : famine Sahel/Corne d\'Afrique, hausse défense globale, axe Russie-Iran-Corée du Nord-Chine consolidé.',
      'L\'Ukraine reste un test : si la frontière peut être déplacée par la force, le précédent vaut pour Taïwan, Cachemire, Sahel.'
    ],
    brief_analyste:{
      faits:'Front statique sur ~1 000 km. Avancée russe ~50-100 km² par mois en 2025. Pertes cumulées : RU ~700 000, UA ~400 000 (estimations divergentes). Frappes UA en territoire russe routinières (raffineries, dépôts). Économie de guerre russe à 7-8 % PIB (record post-soviétique).',
      incertitudes:'Position Trump après 2025 (cessez-le-feu imposé ? abandon ? compromis ?). Soutenabilité économique russe au-delà de 2027 (réserves épuisées, démographie). Capacité européenne à compenser US (industrielle, financière, politique).',
      hypotheses:'H1 (~40%) : gel sur ligne actuelle imposé par Trump, sans reconnaissance, sans paix formelle. H2 (~25%) : guerre prolongée à intensité variable jusqu\'à effondrement d\'un camp (économique RU ou démographique UA). H3 (~20%) : escalade tactique (frappe nucléaire limitée, attaque OTAN limitée). H4 (~15%) : transition politique russe (post-Poutine) ouvrant négociation.',
      indicateurs_24_72h:'Décrets exécutifs Trump sur aide militaire UA. Mouvements russes sur Sumy/Tcherniguiv/Kharkiv. Statut Pokrovsk. Communiqués Kim Jong-un sur troupes en Russie.',
      indicateurs_7_30j:'Vote budget UE défense. Statistiques recrutement RU. Cours rouble. Posture Erdogan, Modi, Lula. Activité chantier reconstruction RU dans territoires occupés.',
      implications_7_30j:'Si gel imposé : crise politique majeure UA (refus Zelensky ?), cohésion UE testée, signal Taïwan/Sahel.'
    },

    scenarios: [
      {nom:'Tendanciel — gel armé', proba:40, impact:7, h:'12-24 mois', d:'Trump impose cessez-le-feu sur ligne actuelle. Pas de reconnaissance Crimée/Donbass. Pas de garanties OTAN. Conflit gelé type Coréen. Reconstruction lente, militarisation pérenne.'},
      {nom:'Rupture — effondrement russe', proba:20, impact:8, h:'18-36 mois', d:'Crise économique aiguë + défaite militaire ponctuelle + crise succession ouvrent transition. Risque mais aussi opportunité historique.'},
      {nom:'Rupture — abandon UA', proba:20, impact:9, h:'6-18 mois', d:'Trump coupe aide totalement. UE incapable de combler. Effondrement front UA. Russie obtient concessions massives. Onde de choc OTAN.'},
      {nom:'Escalade — engagement OTAN limité', proba:10, impact:10, h:'inconnue', d:'Provocation russe (Suwałki, Bélarus, sabotage majeur infra UE). Engagement art. 5 limité. Risque escalade nucléaire.'},
      {nom:'Wild card — frappe nucléaire tactique russe', proba:5, impact:10, h:'inconnue', d:'Si défaite imminente, Poutine teste l\'arme nucléaire tactique. Crise globale.'},
      {nom:'Wild card — transition pacifique russe', proba:5, impact:6, h:'24-60 mois', d:'Élite russe écarte Poutine. Négociation. Réintégration progressive.'}
    ],

    sources: [
      {nom:'ISW — Russian Offensive Campaign Assessment (quotidien)', url:'https://understandingwar.org/backgrounder/russian-offensive-campaign-assessment'},
      {nom:'IRIS — Observatoire (Russie/Eurasie)', url:'https://www.iris-france.org/observatoires/'},
      {nom:'FRS — Russie/Ukraine', url:'https://frstrategie.org/recherche/themes/russie-eurasie'},
      {nom:'IFRI — Centre Russie/NEI', url:'https://www.ifri.org/fr/centre-russie-nei'},
      {nom:'Le Grand Continent — Capsule Ukraine', url:'https://legrandcontinent.eu/fr/categorie/regions/ukraine/'},
      {nom:'Crisis Group — Ukraine', url:'https://www.crisisgroup.org/europe-central-asia/eastern-europe/ukraine'}
    ]
  }

  /* On en mettra d'autres conflits dans data2.js si nécessaire — déjà énorme */
];

/* -------------------- CONFLITS COMPACTS (sans 8 dimensions complètes pour l'instant) -------------------- */
const CONFLITS_COMPACTS = [
  { id:'c_gaza', name:'Israël — Hamas / Gaza-Liban', short:'Gaza-Liban', region:'Moyen-Orient', priority:1, status:'active', intensity:9, start_year:2023, countries:['IL','PS','LB'], lat:31.5, lng:34.47,
    pays_clefs:'Israël, Palestine, Liban, Égypte, Qatar, USA',
    actors_etat:['Israël','Égypte','Qatar','USA','Iran','Turquie'],
    actors_non_etat:['Hamas','Hezbollah','Jihad islamique','Houthis'],
    keywords:['gaza','israel','israël','hamas','hezbollah','cisjordanie','west bank','rafah','idf','liban','beyrouth'],
    cle_historique:'Crise palestinienne du XXe-XXIe siècle ré-explosée. Lié au conflit Iran-Israël par les proxies.',
    brief_decideur:[
      'Hamas militairement décapité mais politiquement vivant — pas d\'alternative palestinienne crédible.',
      'Gaza : crise humanitaire IPC 5 confirmée. Risque famine documenté ONU.',
      'Hezbollah affaibli par décapitation 2024 mais reste 1ère force armée du Liban.',
      'Cisjordanie : risque de 3e Intifada, militarisation des colonies.',
      'Pivot diplomatique Trump 2 : plan régional avec Saoudiens probable, à condition acceptable politique palestinien.'
    ],
    sources:[
      {nom:'ISW — Iran/Hamas Update', url:'https://understandingwar.org/'},
      {nom:'Crisis Group — Israël/Palestine', url:'https://www.crisisgroup.org/middle-east-north-africa/east-mediterranean-mena/israelpalestine'},
      {nom:'B\'Tselem', url:'https://www.btselem.org/'}
    ]
  },
  { id:'c_sdn', name:'Soudan — guerre civile', short:'Soudan', region:'Afrique subsaharienne', priority:2, status:'escalating', intensity:9, start_year:2023, countries:['SD'], lat:15.5, lng:32.5,
    pays_clefs:'Soudan, Émirats, Arabie saoudite, Égypte, Tchad',
    actors_etat:['SAF','EAU (soutien RSF)','Arabie saoudite (médiateur)','Égypte (soutien SAF)','Russie/Wagner'],
    actors_non_etat:['RSF (Hemedti)','Mouvements darfouriens'],
    keywords:['sudan','soudan','khartoum','darfur','darfour','rsf','saf','hemedti','burhan'],
    cle_historique:'Conflit entre deux factions militaires post-coup 2021. Guerre par procuration EAU vs Égypte/Arabie. Famine déclarée 2024.',
    brief_decideur:[
      'Première famine déclarée IPC 5 depuis 2017. Risque génocide Darfour reconnu par US (jan. 2025).',
      'Le conflit est aussi une guerre régionale par procuration : EAU finance RSF, Égypte/Saoudite arment SAF.',
      '~10 M déplacés — la plus grave crise humanitaire mondiale en cours.',
      'Pas de médiation crédible : Genève (2024), Djeddah, Manama tous échoués.',
      'Risque de bascule régionale : Tchad, Sud-Soudan, Éthiopie tous fragilisés.'
    ],
    sources:[
      {nom:'Crisis Group — Soudan', url:'https://www.crisisgroup.org/africa/horn-africa/sudan'},
      {nom:'ACLED — Sudan Crisis', url:'https://acleddata.com/sudan-conflict-monitor/'},
      {nom:'Sudan War Monitor', url:'https://sudanwarmonitor.com/'}
    ]
  },
  { id:'c_tai', name:'Taïwan — Chine', short:'Taïwan', region:'Asie de l\'Est', priority:1, status:'active', intensity:6, start_year:2022, countries:['TW','CN'], lat:24.0, lng:121.0,
    pays_clefs:'Taïwan, Chine, USA, Japon, Philippines',
    actors_etat:['Chine','Taïwan','USA','Japon','Philippines','Australie'],
    actors_non_etat:['TSMC (acteur économique systémique)','Industrie défense US'],
    keywords:['taiwan','taïwan','taipei','china','chine','xi jinping','adiz','strait','tsmc'],
    cle_historique:'République de Chine (Taïwan) depuis 1949. Pression militaire chinoise croissante depuis 2022. TSMC fait de Taïwan un nœud stratégique mondial (semi-conducteurs).',
    brief_decideur:[
      'Pression militaire PLA quotidienne (incursions ADIZ, exercices encerclement).',
      'TSMC = 90 % de la production mondiale de puces de pointe. Toute crise = effondrement chaîne valeur tech mondiale.',
      'Doctrine Xi : « réunification » ne peut être différée indéfiniment. Horizon 2027 (centenaire PLA) à surveiller.',
      'Trump 2 : ambiguïté stratégique fragilisée. Position négociable ?',
      'Si crise : économie mondiale -10 % selon estimations, équivalent COVID + 2008.'
    ],
    sources:[
      {nom:'IISS — Taiwan Strait', url:'https://www.iiss.org/'},
      {nom:'CSIS — China Power', url:'https://chinapower.csis.org/'},
      {nom:'Crisis Group — Taïwan', url:'https://www.crisisgroup.org/asia/north-east-asia/taiwan-strait'}
    ]
  },
  { id:'c_cod', name:'RDC — Est (M23/Rwanda)', short:'RDC-Est', region:'Afrique subsaharienne', priority:2, status:'escalating', intensity:8, start_year:2012, countries:['CD','RW','UG'], lat:-1.67, lng:29.22,
    pays_clefs:'RDC, Rwanda, Ouganda, Burundi, Kenya',
    actors_etat:['RDC (Tshisekedi)','Rwanda (Kagame)','Ouganda','Burundi','SAMIDRC','MONUSCO (retrait)'],
    actors_non_etat:['M23','FARDC','FDLR','ADF','Wazalendo'],
    keywords:['drc','congo','rdc','m23','goma','kivu','rwanda','kagame','tshisekedi','bukavu'],
    cle_historique:'Suite des guerres congolaises 1996-2003. M23 ressuscité 2012 puis 2021, soutenu par Rwanda. Enjeu : minerais (coltan, étain, or) et héritage post-génocide.',
    brief_decideur:[
      'Goma tombée jan. 2025, Bukavu menacée — pire crise depuis 2003.',
      'Kagame conteste tout impact rwandais malgré rapports ONU accablants.',
      'Coltan congolais = 70 % production mondiale, indispensable industrie tech.',
      'Médiation EAC-SADC échoue. Angola (Lourenço) tente arbitrage.',
      'Risque régionalisation : Burundi déjà engagé, Ouganda ambigu.'
    ],
    sources:[
      {nom:'Crisis Group — RDC', url:'https://www.crisisgroup.org/africa/great-lakes/democratic-republic-congo'},
      {nom:'Kivu Security Tracker', url:'https://kivusecurity.org/'}
    ]
  },
  { id:'c_yem', name:'Yémen — mer Rouge / Houthis', short:'Mer Rouge', region:'Moyen-Orient', priority:2, status:'active', intensity:7, start_year:2014, countries:['YE'], lat:15.5, lng:44.2,
    pays_clefs:'Yémen, Arabie saoudite, Émirats, USA, UK, Iran',
    actors_etat:['Coalition arabe (Saoudite, EAU)','USA','UK','UE Aspides'],
    actors_non_etat:['Houthis (Ansar Allah)','Conseil présidentiel yéménite','AQPA'],
    keywords:['yemen','houthi','sanaa','aden','red sea','mer rouge','bab el-mandeb','ormuz','suez'],
    cle_historique:'Guerre civile depuis 2014. Internationalisation 2015 (coalition saoudienne). Depuis nov. 2023, attaques navires en mer Rouge en soutien Gaza.',
    brief_decideur:[
      'Trafic Suez -60 % depuis nov. 2023. Détournement Cap = +10-14 jours, +30 % coût.',
      'Inflation maritime mondiale, perturbation chaînes valeur (Asie-Europe).',
      'Frappes US/UK n\'ont pas fait reculer Houthis : preuve de la résilience asymétrique.',
      'Houthis = seul vrai gagnant de l\'effondrement de l\'arc chiite (popularité gonflée).',
      'Risque extension : Bab el-Mandeb ET Ormuz simultanément = catastrophe énergétique.'
    ],
    sources:[
      {nom:'ACLED — Yémen', url:'https://acleddata.com/yemen-conflict-observatory/'},
      {nom:'Crisis Group — Yémen', url:'https://www.crisisgroup.org/middle-east-north-africa/gulf-and-arabian-peninsula/yemen'}
    ]
  },
  { id:'c_kor', name:'Péninsule coréenne / axe RU-PRK', short:'Corée', region:'Asie de l\'Est', priority:2, status:'active', intensity:6, start_year:1953, countries:['KP','KR','RU'], lat:38.5, lng:127.5,
    pays_clefs:'Corée du Nord, Corée du Sud, USA, Japon, Russie, Chine',
    actors_etat:['Corée du Nord','Corée du Sud','USA','Japon','Russie','Chine'],
    actors_non_etat:['Lazarus Group (cyber)'],
    keywords:['north korea','corée du nord','kim jong un','pyongyang','seoul','south korea','prk','rok'],
    cle_historique:'Armistice 1953 jamais converti en paix. Programme nucléaire depuis 2006. Pivot 2024 : pacte Russie-PRK, troupes nord-coréennes en Russie.',
    brief_decideur:[
      'Axe Russie-PRK formalisé (juin 2024). Échanges armes/technologies.',
      '~12 000 soldats PRK en Koursk. Première projection terrestre depuis 1953.',
      'Programmes balistique/nucléaire accélérés grâce technologies russes.',
      'Lee Jae-myung (Sud) ouvre dialogue Nord — rupture avec Yoon.',
      'Trump 2 : retour à diplomatie personnelle Kim ? Imprévisible.'
    ],
    sources:[
      {nom:'38 North', url:'https://www.38north.org/'},
      {nom:'NK News', url:'https://www.nknews.org/'},
      {nom:'IISS — Korea', url:'https://www.iiss.org/'}
    ]
  },
  { id:'c_syr', name:'Syrie — transition post-Assad', short:'Syrie', region:'Moyen-Orient', priority:2, status:'deescalating', intensity:6, start_year:2011, countries:['SY'], lat:35.0, lng:38.5,
    pays_clefs:'Syrie, Turquie, Israël, USA, Russie (résiduel), Iran (sortie)',
    actors_etat:['Gouvernement de transition (HTS)','Turquie','Israël','USA','Russie (bases résiduelles)'],
    actors_non_etat:['HTS (al-Joulani/al-Charaa)','SDF/FDS','SNA','PKK'],
    keywords:['syria','syrie','damascus','damas','hts','assad','sdf','idlib','aleppo','alep','al-joulani','al-charaa'],
    cle_historique:'Effondrement régime Assad déc. 2024. Transition HTS (ex-jihadistes). Frappes israéliennes massives sur stocks d\'armes. Question kurde non résolue.',
    brief_decideur:[
      'HTS gouverne mais légitimité fragile, suspicion internationale (passé jihadiste).',
      'Question kurde explosive : Turquie veut anéantir SDF, USA protège partiellement.',
      'Israël a détruit 80 % capacités militaires syriennes en 48 h post-Assad.',
      'Reconstruction estimée 400 Mds$. Pas de financement clair.',
      'Risque libanisation : fragmentation confessionnelle, milices, ingérences multiples.'
    ],
    sources:[
      {nom:'ISW — Syria', url:'https://understandingwar.org/'},
      {nom:'Syria Direct', url:'https://syriadirect.org/'},
      {nom:'Crisis Group — Syrie', url:'https://www.crisisgroup.org/middle-east-north-africa/east-mediterranean-mena/syria'}
    ]
  }
];

/* Merge */
CONFLITS.push(...CONFLITS_COMPACTS);

/* -------------------- ÉVÉNEMENTS (chronologie unifiée) -------------------- */
function buildEvents(){
  const events = [];
  CONFLITS.forEach(c=>{
    if(c.chronologie) c.chronologie.forEach((e,i)=>{
      events.push({
        id:`e_${c.id}_${i}`,
        conflict_id:c.id,
        date:e.d, type:'Stratégique',
        severity:e.sev, title:e.e,
        description:(e.note||'') + (e.rupture?' [SEUIL DE RUPTURE]':''),
        rupture:!!e.rupture,
        country:c.countries?.[0]||'',
        lat:c.lat, lng:c.lng,
        actor:''
      });
    });
  });
  return events;
}

/* -------------------- COUNTRIES (avec FSI-like) -------------------- */
const COUNTRIES = [
  {code:'BF',name:'Burkina Faso',region:'Afrique de l\'Ouest',lat:12.24,lng:-1.56,fsi:9,gov:3,sec:9,eco:7,soc:7,note:'Junte Traoré (sept. 2022). Membre AES. JNIM contrôle ou influence ~40 % du territoire. Économie d\'or sous pression.'},
  {code:'ML',name:'Mali',region:'Afrique de l\'Ouest',lat:17.57,lng:-3.99,fsi:9,gov:3,sec:9,eco:6,soc:7,note:'Junte Goïta. AES. Wagner/Africa Corps. Tinzaouaten (juil. 2024). JNIM atteint banlieues Bamako.'},
  {code:'NE',name:'Niger',region:'Afrique de l\'Ouest',lat:17.6,lng:8.08,fsi:8,gov:3,sec:8,eco:7,soc:8,note:'Junte Tiani (juil. 2023). Uranium = levier. Retrait France/USA effectif.'},
  {code:'BJ',name:'Bénin',region:'Afrique de l\'Ouest',lat:9.31,lng:2.32,fsi:6,gov:5,sec:7,eco:5,soc:6,note:'Sous pression jihadiste nord (Pendjari). Risque de littoralisation crise sahélienne.'},
  {code:'CI',name:'Côte d\'Ivoire',region:'Afrique de l\'Ouest',lat:7.54,lng:-5.55,fsi:5,gov:5,sec:6,eco:4,soc:6,note:'Pression nord (frontières BF/Mali). Élection 2025 sensible. Posture pro-CEDEAO.'},
  {code:'TG',name:'Togo',region:'Afrique de l\'Ouest',lat:8.62,lng:0.83,fsi:6,gov:6,sec:7,eco:5,soc:6,note:'Attaques jihadistes Savanes (2021-). État d\'urgence. Pivot vers AES en discussion.'},

  {code:'IR',name:'Iran',region:'Moyen-Orient',lat:32.43,lng:53.69,fsi:9,gov:8,sec:9,eco:9,soc:8,note:'Khamenei tué (fév. 2026). Crise succession. Économie effondrement (-80 % rial).'},
  {code:'IL',name:'Israël',region:'Moyen-Orient',lat:31.05,lng:34.85,fsi:5,gov:6,sec:7,eco:4,soc:6,note:'Multifront. Société clivée (judiciaire, ultraorthodoxes, otages). Économie résiliente mais sous pression.'},
  {code:'PS',name:'Palestine',region:'Moyen-Orient',lat:31.95,lng:35.25,fsi:10,gov:9,sec:10,eco:10,soc:10,note:'Gaza : crise humanitaire IPC 5. Cisjordanie : risque embrasement. Pas d\'autorité unifiée.'},
  {code:'LB',name:'Liban',region:'Moyen-Orient',lat:33.85,lng:35.86,fsi:9,gov:9,sec:8,eco:10,soc:8,note:'Effondrement étatique. Hezbollah affaibli mais reste 1ère force. Présidentielle 2025 décisive.'},
  {code:'SY',name:'Syrie',region:'Moyen-Orient',lat:34.8,lng:38.99,fsi:9,gov:8,sec:9,eco:9,soc:8,note:'Transition HTS post-Assad. Reconstruction 400 Mds$. Question kurde explosive.'},
  {code:'YE',name:'Yémen',region:'Moyen-Orient',lat:15.55,lng:48.52,fsi:10,gov:9,sec:9,eco:10,soc:9,note:'Houthis contrôlent Sanaa et façade mer Rouge. Crise humanitaire massive.'},

  {code:'UA',name:'Ukraine',region:'Europe de l\'Est',lat:48.4,lng:31.2,fsi:8,gov:5,sec:10,eco:8,soc:7,note:'Guerre d\'usure. Démographie (-30 % population effective). Énergie attaquée. Soutien occidental fluctuant.'},
  {code:'RU',name:'Russie',region:'Europe de l\'Est',lat:61.5,lng:105.3,fsi:7,gov:8,sec:6,eco:7,soc:5,note:'Économie de guerre 7-8 % PIB. Pertes lourdes. Inflation, taux 21 %. Cohésion politique tenue.'},

  {code:'SD',name:'Soudan',region:'Afrique subsaharienne',lat:12.86,lng:30.22,fsi:10,gov:10,sec:10,eco:10,soc:10,note:'Famine déclarée IPC 5. ~10 M déplacés. Risque génocide Darfour.'},
  {code:'CD',name:'RD Congo',region:'Afrique subsaharienne',lat:-4.04,lng:21.75,fsi:9,gov:8,sec:9,eco:7,soc:8,note:'Goma tombée jan. 2025. M23 progresse vers Bukavu. Coltan stratégique.'},
  {code:'RW',name:'Rwanda',region:'Afrique subsaharienne',lat:-1.94,lng:29.87,fsi:5,gov:6,sec:5,eco:4,soc:5,note:'Soutien M23 documenté ONU. Sanctions occidentales partielles. Économie performante mais autoritarisme.'},

  {code:'TW',name:'Taïwan',region:'Asie de l\'Est',lat:23.69,lng:121.0,fsi:3,gov:2,sec:6,eco:2,soc:3,note:'TSMC pivot mondial. Pression PLA quotidienne. Élections présidentielles 2024 (Lai DPP).'},
  {code:'CN',name:'Chine',region:'Asie de l\'Est',lat:35.86,lng:104.19,fsi:6,gov:7,sec:5,eco:6,soc:5,note:'Ralentissement immobilier. Tensions Taïwan/mer Chine du Sud. Doctrine Xi.'},
  {code:'KP',name:'Corée du Nord',region:'Asie de l\'Est',lat:40.34,lng:127.51,fsi:9,gov:10,sec:7,eco:9,soc:9,note:'Axe Russie. Troupes en Koursk. Programmes nucléaires accélérés.'},
  {code:'KR',name:'Corée du Sud',region:'Asie de l\'Est',lat:35.91,lng:127.77,fsi:3,gov:4,sec:5,eco:2,soc:4,note:'Lee Jae-myung ouvre dialogue Nord. Tensions internes (impeachment Yoon).'}
];

/* -------------------- ALERTES -------------------- */
const ALERTES_SEED = [
  {id:'a1',title:'Attaque coordonnée à Bobo-Dioulasso (BF)',level:'critical',region:'Afrique de l\'Ouest',conflict_id:'c_aes',date:dateStr(0),seuil:'Frappe d\'ampleur',description:'JNIM frappe simultanément 3 sites. Bilan : 47 morts. Démontre capacité opérationnelle dans le sud-ouest, hors zone d\'opération traditionnelle.'},
  {id:'a2',title:'Détroit d\'Ormuz fermé — blocus US',level:'critical',region:'Moyen-Orient',conflict_id:'c_iran_il',date:dateStr(1),seuil:'Perturbation route maritime/énergétique',description:'Brent à 138$. Choc énergétique global. Recession probable Q3 2026.'},
  {id:'a3',title:'Famine déclarée IPC 5 — Darfour',level:'critical',region:'Afrique subsaharienne',conflict_id:'c_sdn',date:dateStr(3),seuil:'Rupture humanitaire majeure',description:'Confirmation experts UN. Risque génocide Darfour reconnu par US. Aucun accès humanitaire.'},
  {id:'a4',title:'Avancée M23 sur Bukavu',level:'high',region:'Afrique subsaharienne',conflict_id:'c_cod',date:dateStr(5),seuil:'Escalade régionale',description:'M23 à 30 km. Risque de bascule sud-Kivu. Pression sur Kinshasa.'},
  {id:'a5',title:'Trump signe décret suspendant aide militaire UA',level:'high',region:'Europe de l\'Est',conflict_id:'c_ukr',date:dateStr(7),seuil:'Changement diplomatique 1er plan',description:'Décret exécutif suspend transferts ATACMS et financement. UE doit compenser 60 % à court terme.'},
  {id:'a6',title:'Mouvements PLA encerclement Taïwan',level:'medium',region:'Asie de l\'Est',conflict_id:'c_tai',date:dateStr(10),seuil:'Escalade régionale',description:'Exercice « Joint Sword 2026B ». 145 avions, 24 navires. Inhabituel par sa dimension et sa durée.'}
];

function dateStr(daysAgo){
  const d = new Date(); d.setDate(d.getDate()-daysAgo); return d.toISOString().slice(0,10);
}

/* -------------------- SOURCES THINK TANK -------------------- */
const SOURCES_TANK = [
  {id:'sr_iris', name:'IRIS', url_recherche:'https://www.iris-france.org/publications/', rss:'https://www.iris-france.org/feed/', categorie:'Think tank français', specialite:'Géopolitique générale, Sahel, défense'},
  {id:'sr_frs', name:'FRS — Fondation pour la Recherche Stratégique', url_recherche:'https://frstrategie.org/recherche', rss:'https://frstrategie.org/feed', categorie:'Think tank français', specialite:'Stratégie, défense, prolifération'},
  {id:'sr_isw', name:'ISW — Institute for the Study of War', url_recherche:'https://understandingwar.org/', rss:'https://understandingwar.org/rss.xml', categorie:'Think tank US', specialite:'Conflits actifs (Ukraine, Iran, Gaza) — mise à jour quotidienne'},
  {id:'sr_lgc', name:'Le Grand Continent', url_recherche:'https://legrandcontinent.eu/fr/actu-breves/', rss:'https://legrandcontinent.eu/fr/feed/', categorie:'Revue', specialite:'Europe, géopolitique long format, capsules quotidiennes'},
  {id:'sr_icg', name:'ICG — International Crisis Group', url_recherche:'https://www.crisisgroup.org/latest-updates', rss:'https://www.crisisgroup.org/rss', categorie:'Think tank international', specialite:'CrisisWatch mensuel — référence sur 70+ conflits'},
  {id:'sr_acled', name:'ACLED', url_recherche:'https://acleddata.com/dashboard/', rss:'https://acleddata.com/feed/', categorie:'Données', specialite:'Géolocalisation événementielle conflits — base mondiale'},
  {id:'sr_ifri', name:'IFRI', url_recherche:'https://www.ifri.org/fr/publications', rss:'https://www.ifri.org/fr/rss.xml', categorie:'Think tank français', specialite:'Russie/NEI, Asie, énergie, Afrique'},
  {id:'sr_rand', name:'RAND Corporation', url_recherche:'https://www.rand.org/topics/national-security-and-terrorism.html', rss:'https://www.rand.org/topics.xml', categorie:'Think tank US', specialite:'Sécurité nationale, prospective, scénarios'},
  {id:'sr_diplo', name:'Diploweb', url_recherche:'https://www.diploweb.com/', rss:'https://www.diploweb.com/spip.php?page=backend', categorie:'Revue géopolitique', specialite:'Géopolitique francophone, cartographie'},
  {id:'sr_lmd', name:'Le Monde Diplomatique', url_recherche:'https://www.monde-diplomatique.fr/', rss:'https://www.monde-diplomatique.fr/recents.xml', categorie:'Presse', specialite:'Cartographie éditoriale, Sud global'},
  {id:'sr_iiss', name:'IISS — International Institute for Strategic Studies', url_recherche:'https://www.iiss.org/online-analysis', rss:'https://www.iiss.org/online-analysis/online-analysis-rss', categorie:'Think tank UK', specialite:'Équilibre militaire mondial (Military Balance), prolifération'},
  {id:'sr_csis', name:'CSIS', url_recherche:'https://www.csis.org/analysis', rss:'https://www.csis.org/analysis/feed', categorie:'Think tank US', specialite:'Chine, défense, économie politique'},
  {id:'sr_ecfr', name:'ECFR — European Council on Foreign Relations', url_recherche:'https://ecfr.eu/publications/', rss:'https://ecfr.eu/feed/', categorie:'Think tank européen', specialite:'Politique étrangère UE'},
  {id:'sr_chatham', name:'Chatham House', url_recherche:'https://www.chathamhouse.org/publications', rss:'https://www.chathamhouse.org/rss/research', categorie:'Think tank UK', specialite:'Russie, Afrique, énergie'}
];

/* exposer */
window.GW_DATA = { CONFLITS, COUNTRIES, ALERTES_SEED, SOURCES_TANK, buildEvents };
