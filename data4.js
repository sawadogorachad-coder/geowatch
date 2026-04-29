/* ==========================================================================
   GéoWatch — Couche d'analyse "Impact Burkina Faso"
   Une rubrique ajoutée à chaque fiche conflit avec 4 dimensions d'impact :
   sécuritaire, économique, diplomatique, sociopolitique.
   ========================================================================== */

const IMPACT_BF = {

  /* ============== SAHEL/AES — impact direct évident ============== */
  c_aes:{
    pertinence:'Maximale (priorité 1)',
    note_synthese:'Le Burkina Faso EST le théâtre central de ce conflit. Toute analyse sahélienne est de facto une analyse burkinabè.',
    securitaire:[
      'Le BF est l\'État le plus exposé du trio AES en termes de pression jihadiste : ~40 % du territoire hors contrôle effectif, attaques mensuelles record en glissement annuel.',
      'Mort civile : >10 000 victimes documentées depuis 2015 (estimation ACLED). Niveau de violence approchant l\'Irak 2014-2016.',
      'Risque d\'effondrement central : la prise de Bobo-Dioulasso ou Ouagadougou-centre constituerait la rupture systémique majeure du continent.',
      'Volontaires VDP (~100 000 enrôlés) : doctrine défensive innovante mais coût humain et risque de milicisation ethnique.',
      'Présence Wagner/Africa Corps : effets sécuritaires limités, exactions documentées, modèle prédateur miné par défaite Tinzaouaten (Mali, juil. 2024).'
    ],
    economique:[
      'L\'or représente 75 % des exportations BF. Captation partielle par filières informelles + Africa Corps érode les recettes étatiques.',
      'Sortie F CFA annoncée AES : risque de chaos monétaire à court terme (12-24 mois) — perte de valeur, fuite des capitaux, hausse import.',
      'Suspension Millennium Challenge Corp. (US, 2022) et coopération budgétaire UE : impact ~ 200-400 M$/an perdus.',
      'Inflation : ~14 % en 2024 (BCEAO). Prix denrées de base en hausse. Subvention pain/carburant insoutenable structurellement.',
      'Coton : 2e exportation. Sous pression climatique + insécurité dans l\'Ouest. Filière SOFITEX en crise.'
    ],
    diplomatique:[
      'Sortie CEDEAO (jan. 2024) puis Confédération AES (juil. 2024) : rupture institutionnelle majeure. Isolement Ouest-africain.',
      'Pivot Russie : visites multiples Moscou-Ouagadougou. Africa Corps remplace Wagner. Coopération militaire formalisée.',
      'Iran : visite Pezeshkian/Traoré non confirmée mais discussions sur uranium et drones rapportées (2024-2025).',
      'Turquie : drones Bayraktar livrés au Mali, en discussion pour BF. Mosquées et coopération éducative.',
      'France : rupture diplomatique de fait. Retrait ambassade. Suspension visa. Anti-français dominant dans discours officiel.'
    ],
    sociopolitique:[
      'Légitimité Traoré record (>80 % popularité, sondages 2024). Cas d\'école de légitimité plébiscitaire vs légitimité électorale.',
      'Construction d\'une mémoire panafricaine révolutionnaire (Sankara revisité, parallèle Lumumba/Cabral). Influence forte sur jeunesse subsaharienne.',
      'Affaiblissement société civile : ONG suspendues, médias contrôlés, opposition exilée. Risque autoritarisation durable.',
      'Récit anti-impérialiste : utilisé pour mobiliser, marginalise débat technique sur réformes structurelles.',
      'Influence sur Côte d\'Ivoire et Bénin : sentiment anti-français croissant chez jeunesse urbaine.'
    ],
    indicateurs_bf:[
      {h:'24-72 h', v:'Attaques sur Ouagadougou-centre ou Bobo-Dioulasso. Mouvements VDP. Décrets exécutifs Traoré.'},
      {h:'7-30 j', v:'Statistiques ACLED-BF mensuelles. Décisions sommet AES. Cours or. Exportations coton SOFITEX. Position Côte d\'Ivoire.'},
      {h:'30-90 j', v:'Mise en place monnaie AES. Élection présidentielle 2025 (annoncée puis annulée ?). Évolution narratif anti-français.'}
    ]
  },

  /* ============== Iran-Israël — impact indirect mais structurant ============== */
  c_iran_il:{
    pertinence:'Élevée (impact indirect majeur)',
    note_synthese:'Le BF n\'est pas acteur direct mais subit la totalité des chocs économiques et géopolitiques de l\'embrasement moyen-oriental.',
    securitaire:[
      'Réseaux jihadistes sahéliens (JNIM, EIGS) bénéficient indirectement de l\'effervescence post-Gaza : recrutement, financement Golfe, diffusion idéologique.',
      'Risque de cellules dormantes Hezbollah/Iran en Afrique de l\'Ouest : présence économique chiite (Liban) au BF historique. Surveillance US accrue.',
      'Drones iraniens (Mohajer, Shahed) : technologie potentiellement transférée à AES via partenariat. Ouvre nouvelle phase capacitaire.',
      'Impact migration : déstabilisation Levant pousse flux Sud-Nord par Sahel (Libye-Niger-Méditerranée). Effet rebond sécurité interne.',
      'Aucun déploiement BF direct mais position diplomatique pro-palestinienne forte (votes ONU).'
    ],
    economique:[
      'Pétrole : fermeture Ormuz (fév. 2026) → Brent à 138$. BF importe 100 % carburant. Coût budgétaire ~180 M$/an supplémentaires si maintenu.',
      'Inflation alimentaire : pétrole impacte engrais, transport, intrants agricoles. Effet cascade sur prix consommation.',
      'Risque dévaluation F CFA si zone euro tangue (BCE choc énergétique). Effet en chaîne pouvoir d\'achat.',
      'IDE : Moyen-Orient (Émirats, Qatar, Arabie) parmi nouveaux investisseurs au BF post-rupture France. Crise = gel des projets.',
      'Or : valeur refuge en hausse en cas de crise. Cours or +25 % anticipé. Recettes BF mécaniquement améliorées si production tient.'
    ],
    diplomatique:[
      'Position BF pro-palestinienne traditionnelle (votes ONU, OCI). Aligned avec posture AES anti-israélienne explicite.',
      'Iran : partenaire potentiel stratégique pour BF (uranium NE, drones, formation). Crise iranienne fragilise cette ligne.',
      'Saoudite/Émirats : nouveaux partenaires économiques BF. Crise Iran = pression alignement, opportunité rapprochement Golfe.',
      'BRICS : BF candidat. Crise Iran/Russie augmente cohésion bloc anti-occidental. Opportunité d\'adhésion accélérée ?',
      'Diplomatie multilatérale : votes BF à l\'ONU traceurs (ex. CIJ Afrique du Sud, abstentions Ukraine). Marqueurs d\'alignement.'
    ],
    sociopolitique:[
      'Cause palestinienne mobilisatrice forte : narratifs anti-impérialistes nourris. Légitimation idéologique régime AES.',
      'Modèle iranien (résistance asymétrique) attractif pour AES : autosuffisance stratégique, dissuasion par déni, partenariats Sud-Sud.',
      'Contre-récit : possible dérive religieuse (sunnite-chiite) si influence iranienne s\'amplifie au BF — fragile équilibre intercommunautaire.',
      'Médias panafricains (RT en français, Sputnik, influenceurs) : couverture pro-Iran/anti-Israël structurante.',
      'Diaspora libanaise au BF (~5 000 personnes, commerce) : tensions internes possibles si guerre Israël-Hezbollah aiguë.'
    ],
    indicateurs_bf:[
      {h:'24-72 h', v:'Cours Brent. Déclarations Traoré sur Iran/Israël. Mouvement diaspora libanaise.'},
      {h:'7-30 j', v:'Décisions OPEC+. Position Saoudite vis-à-vis BF. Évolution prix carburant Ouaga. Visites diplomatiques Iran/Émirats.'},
      {h:'30-90 j', v:'Décisions BRICS sur élargissement. Reconfiguration partenariats énergétiques. Position publique BF sur Iran nucléaire.'}
    ]
  },

  /* ============== Ukraine-Russie — impact via partenariat AES ============== */
  c_ukr:{
    pertinence:'Élevée (Russie = partenaire stratégique BF)',
    note_synthese:'La guerre russe en Ukraine engage directement le partenaire militaire principal du BF (Africa Corps) et structure ses capacités.',
    securitaire:[
      'Africa Corps (héritier Wagner) : ~1 200-2 000 instructeurs/combattants au Mali, présence BF moins documentée mais croissante.',
      'Capacités russes attribuées à l\'Afrique limitées par effort Ukraine. Théoricien militaires russes : Africa = priorité 3 après Ukraine + Asie.',
      'Drones (Lancet, Shahed iraniens transférés) : transfert vers AES possible mais lent. BF reçoit Bayraktar TB2 turcs.',
      'Renseignement ukrainien actif au Sahel (Tinzaouaten juil. 2024) : possible réplique BF. Vulnérabilité Africa Corps.',
      'Effet sanctions : difficulté Russie à transférer matériel sophistiqué. Substitution Iran/Corée du Nord/Chine.'
    ],
    economique:[
      'Blé/maïs : Ukraine + Russie = 30 % exportation mondiale céréalières. Crise alimentaire Sahel directement liée. Pic prix 2022.',
      'Engrais (Russie/Bélarus = top mondial) : pénurie + hausse prix → impact agriculture BF (coton, mil, sorgho).',
      'Or : valeur refuge en hausse pendant la guerre. Bénéfice mécanique pour BF (1ère exportation).',
      'Dette Eurobond BF : risque hausse taux mondiaux si guerre s\'étend. Refinancement difficile.',
      'Russie achète or BF en partie (rumeurs documentées) : circuit échappant aux sanctions occidentales.'
    ],
    diplomatique:[
      'Sommets Russie-Afrique (2019, 2023) : BF participation post-Traoré. Annonces partenariat stratégique.',
      'Votes ONU : BF abstention/contre résolutions condamnant Russie sur Ukraine. Marqueur d\'alignement.',
      'Coopération militaire formalisée. Visites Lavrov/ministres russes à Ouagadougou récurrentes.',
      'Influence informationnelle russe (RT, Sputnik) : structurante dans opinion BF. Anti-occidentalisme valorisé.',
      'Position BF sur élargissement BRICS : alignée Moscou-Pékin contre OTAN/UE.'
    ],
    sociopolitique:[
      'Modèle « doctrine Eurasie » (Douguine) : multipolarité civilisationnelle, anti-libéralisme. Convergence avec souverainisme AES.',
      'Imaginaire « démocratie illibérale » : modèle Poutine attractif pour régimes militaires africains.',
      'Mémoire URSS-Tiers monde : héritage Sankara-Andropov réactivé symboliquement.',
      'Risque dépendance idéologique : alignement aveugle à la propagande russe peut fragiliser autonomie analytique.',
      'Opinion BF : sondages Afrobarometer 2023 — soutien Russie 35-45 %, en hausse vs 15 % en 2018.'
    ],
    indicateurs_bf:[
      {h:'24-72 h', v:'Annonces Africa Corps. Mouvements aériens Bamako-BF. Cours céréales/engrais.'},
      {h:'7-30 j', v:'Statistiques agriculture saisonnière. Décisions Trump sur aide UA (impact indirect crédibilité Moscou). Visites diplomatiques.'},
      {h:'30-90 j', v:'Sommets Russie-Afrique programmés. Évolution capacité Russie à projeter en Afrique. Rapport ONU sanctions or.'}
    ]
  },

  /* ============== Gaza-Liban — impact diplomatique/sociopolitique ============== */
  c_gaza:{
    pertinence:'Modérée (impact diplomatique et symbolique)',
    note_synthese:'Le BF n\'est pas acteur direct mais la cause palestinienne structure la rhétorique anti-occidentale du régime et l\'imaginaire panafricain.',
    securitaire:[
      'Pas d\'impact sécuritaire direct. Mais radicalisation idéologique via réseaux numériques mobilise jihadistes sahéliens (JNIM, EIGS) sur cause palestinienne.',
      'Réseau Hezbollah-Liban : présence économique au BF (commerce, diaspora 5 000 personnes). Surveillance US croissante.',
      'Risque attentats inspirés (loup solitaire) : faible mais non nul. Aucun précédent BF sur cause Israël-Palestine.',
      'Filières d\'armes via mer Rouge perturbées (Houthis) : impact indirect sur trafic d\'armes vers Sahel.',
      'Migrations : crise Gaza pousse réfugiés palestiniens (10 000-30 000 estimés) cherchant pays accueil. BF non concerné directement.'
    ],
    economique:[
      'Pas d\'interdépendance économique directe BF-Israël ou BF-Palestine.',
      'Effets indirects : prix pétrole en cas escalade régionale (déjà documentés Iran-Israël).',
      'Diaspora libanaise BF (commerce) : transferts vers Liban affectés. Risque retrait certains acteurs si Beyrouth s\'effondre.',
      'Saoudite/Qatar/Émirats : suspension projets normalisation Israël = redirection investissements vers Afrique. Possible bénéfice BF.',
      'Aide humanitaire mondiale : Gaza absorbe ~30 Mds$ d\'attention. Crowding out aide Sahel/BF.'
    ],
    diplomatique:[
      'Position BF historiquement pro-palestinienne (OCI, votes ONU). Renforcée sous Traoré.',
      'Vote BF à la CIJ (procès Afrique du Sud) : non-formel mais position publique condamnant Israël.',
      'Pression Saoudite/Émirats : conditionnement aide à positions modérées. Test alignement BF.',
      'Iran : utilise cause palestinienne pour rapprocher AES. Influence symbolique forte.',
      'France : positions divergentes BF/France sur Gaza creusent fossé.'
    ],
    sociopolitique:[
      'Cause palestinienne fortement mobilisatrice dans opinion publique BF (sondages, manifestations).',
      'Récit anti-impérialiste : Gaza = démonstration du « 2 poids 2 mesures » occidental (Ukraine vs Palestine).',
      'Influence sur jeunesse universitaire : campus Ouagadougou, manifestations pro-Gaza 2023-2025.',
      'Médias panafricains/RT/Al Jazeera arabe : couverture continue, structure imaginaire générationnel.',
      'Tensions religieuses internes : majorité musulmane sunnite BF, minorité chrétienne. Risque polarisation si conflit régionalise.'
    ],
    indicateurs_bf:[
      {h:'24-72 h', v:'Manifestations pro-Gaza Ouagadougou. Déclarations Traoré sur Israël. Mouvements diaspora libanaise.'},
      {h:'7-30 j', v:'Votes BF à l\'ONU. Visites diplomatiques arabes. Évolution presse panafricaine.'},
      {h:'30-90 j', v:'Reconfiguration aide Golfe vers BF. Plan régional Saoudien-Trump : position BF.'}
    ]
  },

  /* ============== Soudan — impact via flux et corridor mer Rouge ============== */
  c_sdn:{
    pertinence:'Modérée (effet rebond Sahel)',
    note_synthese:'Le BF subit la déstabilisation régionale et la concurrence pour l\'attention humanitaire.',
    securitaire:[
      'Aucun impact sécuritaire direct (distance géographique Soudan-BF ~3 500 km).',
      'Possible diffusion modèle RSF/Janjaweed vers groupes sahéliens ? Pas documenté.',
      'Réfugiés soudanais ne migrent pas vers BF mais Tchad/Égypte. Pas de pression migratoire directe.',
      'Trafic armes Soudan-Tchad-Sahel : circuits documentés mais marginal pour BF (axe Libye plus important).',
      'Crise Corne de l\'Afrique = saturation attention internationale vis-à-vis Sahel.'
    ],
    economique:[
      'Or : Soudan = 3e producteur africain. Filière chinoise/émirienne. Concurrence indirecte avec or BF.',
      'Concurrence aide humanitaire : Soudan absorbe ~3 Mds$ d\'aide internationale (2024-25). Sahel crowding out.',
      'Émirats : bailleur principal RSF + investisseur potentiel BF. Crédibilité émirienne questionnée.',
      'Pétrole sud-soudanais : pipeline endommagé → tensions énergétiques régionales.',
      'Mer Rouge : corridor stratégique. Si déstabilisé (combiné Houthis), perturbations Suez impactent commerce BF (importations Asie).'
    ],
    diplomatique:[
      'Position BF officielle silencieuse sur Soudan. Pas d\'engagement diplomatique fort.',
      'BRICS : Soudan partenaire potentiel via SAF. Opportunité plateforme commune AES-SAF ?',
      'Russie/Wagner : présence Soudan (négociation base navale Port-Soudan). Convergence stratégique avec AES.',
      'UA/IGAD : médiation Soudan paralysée. Test crédibilité institutions africaines (parallèle CEDEAO/AES).',
      'Égypte : arbitrait potentiellement sur AES-CEDEAO. Position Caire pro-SAF révèle divergences arabes.'
    ],
    sociopolitique:[
      'Récit panafricain : guerre soudanaise marginalisée vs Gaza/Ukraine = preuve « 2 poids 2 mesures ».',
      'Famine déclarée Darfour : humanitaire mais pas mobilisateur dans opinion BF. Distance culturelle.',
      'Modèle RSF : élites paramilitaires capturant l\'État → contre-modèle de ce que cherche AES (réintégration militaire-étatique).',
      'Pas d\'impact significatif sur narratifs internes BF.',
      'Coopération universitaire/religieuse Soudan-BF : marginale.'
    ],
    indicateurs_bf:[
      {h:'24-72 h', v:'Mouvements diplomatiques Wagner Russie-Afrique. Cours or international.'},
      {h:'7-30 j', v:'Décisions Trump sur sanctions EAU. Évolution conflit Sud-Soudan.'},
      {h:'30-90 j', v:'Reconfiguration partenariats Russie-Afrique. Décisions UA sur médiation.'}
    ]
  },

  /* ============== Taïwan-Chine — impact macroéconomique global ============== */
  c_tai:{
    pertinence:'Élevée (impact macro mondial)',
    note_synthese:'Une crise Taïwan = choc économique global qui frapperait le BF de plein fouet via les puces, l\'inflation et le dollar.',
    securitaire:[
      'Impact sécuritaire direct nul (Asie Pacifique).',
      'Mais : crise Taïwan distrait attention US/UE → désengagement d\'autres théâtres (Sahel, Sahel oriental).',
      'Si guerre, mobilisation forces US Pacifique = retrait possible Africa Command. Vide stratégique.',
      'Chine peut conditionner sa relation Afrique à neutralité bienveillante sur Taïwan.',
      'Pas de présence militaire BF en Asie. Pas de ressortissants au volume significatif.'
    ],
    economique:[
      'TSMC = 90 % puces avancées. Crise = effondrement chaîne valeur tech mondiale (~10 % PIB mondial).',
      'BF importe biens manufacturés (textile, électronique, mat. construction) majoritairement Asie. Disruption massive.',
      'Inflation : crise Taïwan = +5-10 pts inflation globale selon estimations. Pouvoir achat BF effondré.',
      'Or : forte hausse en cas crise (valeur refuge). Bénéfice net BF.',
      'Dollar : possible flight-to-quality. Pression F CFA. Pression dette extérieure.'
    ],
    diplomatique:[
      'BF reconnaît la République populaire de Chine (pas Taïwan). Aligned position panafricaine.',
      'Chine : 1er partenaire commercial Afrique. Relations BF-Chine économiques (mines, infrastructures, formation).',
      'Sommets FOCAC : BF présent. Discours souverainiste convergent.',
      'BRICS : Chine clé. Crise Taïwan complique élargissement BRICS si Pékin distrait.',
      'Position BF si conflit : alignement Pékin probable, mais discrétion préservée pour préserver liens commerciaux.'
    ],
    sociopolitique:[
      'Modèle Chine : développement étatique + capitalisme dirigé. Attractif pour AES (alternative occidentale).',
      'Influence informationnelle Chine en Afrique (CGTN, Xinhua) : secondaire mais croissante.',
      'Sentiment populaire BF vis-à-vis Chine : majoritairement neutre/positif. Pragmatique.',
      'Modèle « ascension pacifique » remis en cause par posture Xi. Peut éroder soft power chinois en Afrique.',
      'Pas de polarisation interne BF sur cause taïwanaise.'
    ],
    indicateurs_bf:[
      {h:'24-72 h', v:'Cours dollar/F CFA. Cours puces (Taiwan Semiconductor à NYSE). Tensions PLA.'},
      {h:'7-30 j', v:'Disponibilité produits manufacturés (commerce Ouaga). Décisions FOCAC.'},
      {h:'30-90 j', v:'Investissements chinois en BF (mines, infra). Position Trump sur Taïwan. Élections Taipei.'}
    ]
  },

  /* ============== RDC-Est — impact régional ressources ============== */
  c_cod:{
    pertinence:'Modérée (effet ressources critiques)',
    note_synthese:'Le BF subit indirectement la crise du coltan et des minerais critiques, et observe avec intérêt le modèle d\'État défaillant.',
    securitaire:[
      'Pas d\'impact sécuritaire direct (RDC à 2 500 km).',
      'Mais : effet de précédent. Captation territoriale par voisin (Rwanda) sans réaction CEDEAO/UA = modèle pour ailleurs ?',
      'Wazalendo (volontaires patriotes RDC) : modèle similaire VDP burkinabè. Échange d\'expérience possible.',
      'Trafic armes RDC : marginal pour Sahel.',
      'Présence Wagner ambivalente RDC (les deux côtés selon rumeurs) : utilisée comme cas d\'école par instructeurs Africa Corps.'
    ],
    economique:[
      'Coltan/cobalt : RDC = 70 % production mondiale. Indispensable industrie tech. Disruption = inflation tech.',
      'Or : concurrence indirecte BF. Or RDC + Soudan + Ouganda = volumes massifs. Pression cours.',
      'Concurrence IDE chinois : Katanga (RDC) absorbe massivement IDE Chine, peut détourner intérêt vers Sahel.',
      'Pas d\'échange commercial direct BF-RDC significatif.',
      'Cobalt = batteries véhicules électriques. Disruption = retard transition énergétique mondiale.'
    ],
    diplomatique:[
      'Pas de relations bilatérales fortes BF-RDC.',
      'UA : test médiation. Échec EAC-SADC = signal d\'inefficacité institutions panafricaines.',
      'Doha (Qatar) émerge comme médiateur : nouveau pôle diplomatique africain.',
      'Rwanda : partenaire militaire formé partiellement par occidentaux. Soutien M23 = test sanctions.',
      'Possible plateforme commune Tshisekedi-Traoré sur souveraineté ? Rapprochement à observer.'
    ],
    sociopolitique:[
      'Modèle Tshisekedi (souverainisme + plébiscite + accusation néocolonialisme) parallèle Traoré.',
      'Récit panafricain : RDC pillée par voisins + occident complice = narratif fort.',
      'Mémoire Mobutu/Lumumba : pertinente pour réflexion sur souveraineté africaine.',
      'Influence diaspora congolaise BF : faible.',
      'Pas de polarisation interne sur cause congolaise.'
    ],
    indicateurs_bf:[
      {h:'24-72 h', v:'Cours coltan/cobalt. Mouvements M23. Sanctions Trump Rwanda.'},
      {h:'7-30 j', v:'Sommets EAC-SADC-UA. Visites diplomatiques. Évolution Tshisekedi.'},
      {h:'30-90 j', v:'Reconfiguration partenariats miniers Sahel/Grands Lacs. Décisions UA réforme.'}
    ]
  }
};

/* ============= RECONFIGURATIONS STRATÉGIQUES EN COURS ============= */
const RECONFIGURATIONS = [
  {
    id:'rc_aes',
    titre:'Naissance d\'un bloc sahélien post-CEDEAO',
    h:'2022-2026', niveau:'Régional Afrique',
    description:'Trois coups d\'État (Mali 2020, Burkina 2022, Niger 2023) ont accouché d\'une Confédération AES (juillet 2024) qui rompt avec 50 ans d\'architecture ouest-africaine. Sortie F CFA en projet, monnaie commune annoncée, retrait CEDEAO effectif janvier 2024.',
    consequences:[
      'Rupture institutionnelle ouest-africaine la plus profonde depuis l\'indépendance.',
      'Pivotement géopolitique Russie/Chine/Turquie/Iran/EAU. Sortie sphère France/UE.',
      'Risque de domino : Bénin, Togo, Côte d\'Ivoire sous pression jihadiste pourraient suivre.',
      'Test de viabilité d\'un modèle politique militaire-plébiscitaire africain.'
    ],
    pertinence_bf:'Centre de la reconfiguration. Le BF en est le moteur idéologique (Traoré charisme).'
  },
  {
    id:'rc_arc',
    titre:'Effondrement de l\'arc chiite — recomposition Moyen-Orient',
    h:'2024-2026', niveau:'Régional Moyen-Orient',
    description:'Décapitation Hezbollah (sept-oct 2024), chute Assad (déc. 2024), guerres directes Iran-Israël (juin 2025 + fév. 2026), mort Khamenei. La projection iranienne sur la Méditerranée est rompue, l\'Iran nu pour la première fois depuis 1979.',
    consequences:[
      'Israël devient hégémon militaire incontesté.',
      'Saoudite ascendante : OPEC+, Levant, recomposition arabe.',
      'Risque transition iranienne (Pasdaran, effondrement, ouverture).',
      'Houthis seul gagnant relatif : popularité gonflée, Mer Rouge bloquée.',
      'Plan régional Trump-Saoudien possible si horizon palestinien.'
    ],
    pertinence_bf:'Indirect mais structurant via prix pétrole, IDE Golfe, modèle iranien comme partenariat AES.'
  },
  {
    id:'rc_uk',
    titre:'Test système Trump 2 sur ordre international',
    h:'2025-2027', niveau:'Mondial',
    description:'Investiture Trump (jan. 2025). Suspension aide militaire Ukraine. Tarif douanier global. Pression OTAN et alliés. Recomposition possible des alliances mondiales sur 18-24 mois.',
    consequences:[
      'Ukraine : risque effondrement front ou gel imposé. Précédent géopolitique majeur.',
      'OTAN : test de cohésion, possible « OTAN Lite » sans US.',
      'Taïwan : ambiguïté stratégique fragilisée.',
      'Sahel : possible ouverture US à Africa Corps (transactionnalisme Trump).',
      'BRICS : opportunité d\'accélération.'
    ],
    pertinence_bf:'Élevée. Tout désengagement US/UE crée vide diplomatique remplissable par AES + partenaires non-occidentaux.'
  },
  {
    id:'rc_ipac',
    titre:'Compétition Indo-Pacifique : la décennie décisive',
    h:'2024-2030', niveau:'Mondial',
    description:'Pression PLA croissante sur Taïwan, militarisation Mer Chine méridionale, axe Russie-Corée du Nord, alliance AUKUS+QUAD. La région concentre 60% PIB mondial et 70% production avancée.',
    consequences:[
      'Première chaîne d\'îles : test de la primauté maritime US.',
      'Semi-conducteurs : course de souveraineté technologique (CHIPS Act, EU Chips Act).',
      'Réarmement Japon/Corée du Sud/Australie record post-1945.',
      'BRI chinois en Asie maintenu malgré ralentissement.',
      'Si crise majeure : choc économique mondial type 2008+COVID combiné.'
    ],
    pertinence_bf:'Macroéconomique. Tout choc Taïwan-Chine = crise économique frappant directement le BF.'
  },
  {
    id:'rc_brics',
    titre:'BRICS+ : émergence d\'un pôle non-occidental institutionnalisé',
    h:'2023-2026', niveau:'Mondial',
    description:'Élargissement BRICS (Iran, EAU, Égypte, Éthiopie, Indonésie 2025). Système de paiement alternatif en discussion. Banque NDB active. Possible monnaie commune débattue.',
    consequences:[
      'Système financier mondial fragmenté : SWIFT vs CIPS.',
      'Réserves en devises : dédollarisation lente mais réelle.',
      'Diplomatie multilatérale : ONU contestée, BRICS comme forum alternatif.',
      'Afrique : multiples candidats (BF, Mali, Niger, Algérie, Nigeria).',
      'Russie/Chine arbitrent en pratique. Inde joue les deux camps.'
    ],
    pertinence_bf:'Élevée. Candidature BF en discussion. Adhésion = bascule symbolique majeure.'
  }
];

/* Merger : ajoute impact_bf à chaque conflit */
(function mergeImpactBF(){
  if(!window.GW_DATA) return;
  Object.keys(IMPACT_BF).forEach(cid=>{
    const idx = window.GW_DATA.CONFLITS.findIndex(c=>c.id===cid);
    if(idx>=0) window.GW_DATA.CONFLITS[idx].impact_bf = IMPACT_BF[cid];
  });
  window.GW_DATA.RECONFIGURATIONS = RECONFIGURATIONS;
})();
