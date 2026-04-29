/* ==========================================================================
   GéoWatch — Base géographique mondiale (en français)
   Capitales, métropoles, détroits, canaux, ports, bases militaires, corridors
   ========================================================================== */

/* === CAPITALES MONDIALES (~150 plus importantes) === */
const WORLD_CAPITALS = [
  // Afrique
  {n:'Alger',pays:'Algérie',lat:36.75,lng:3.06,r:'Afrique du Nord',pop:'3.4M'},
  {n:'Le Caire',pays:'Égypte',lat:30.04,lng:31.24,r:'Afrique du Nord',pop:'21M'},
  {n:'Tunis',pays:'Tunisie',lat:36.81,lng:10.18,r:'Afrique du Nord',pop:'2.4M'},
  {n:'Rabat',pays:'Maroc',lat:34.02,lng:-6.84,r:'Afrique du Nord',pop:'1.8M'},
  {n:'Tripoli',pays:'Libye',lat:32.89,lng:13.19,r:'Afrique du Nord',pop:'1.2M'},
  {n:'Khartoum',pays:'Soudan',lat:15.59,lng:32.53,r:'Afrique du Nord',pop:'5.4M'},
  {n:'Dakar',pays:'Sénégal',lat:14.69,lng:-17.44,r:'Afrique de l\'Ouest',pop:'1.2M'},
  {n:'Bamako',pays:'Mali',lat:12.64,lng:-8.0,r:'Afrique de l\'Ouest',pop:'2.7M'},
  {n:'Ouagadougou',pays:'Burkina Faso',lat:12.37,lng:-1.52,r:'Afrique de l\'Ouest',pop:'2.5M',bf:true},
  {n:'Bobo-Dioulasso',pays:'Burkina Faso',lat:11.18,lng:-4.30,r:'Afrique de l\'Ouest',pop:'1.0M',bf:true},
  {n:'Niamey',pays:'Niger',lat:13.51,lng:2.11,r:'Afrique de l\'Ouest',pop:'1.3M'},
  {n:'Abuja',pays:'Nigeria',lat:9.06,lng:7.49,r:'Afrique de l\'Ouest',pop:'3.5M'},
  {n:'Lagos',pays:'Nigeria',lat:6.52,lng:3.38,r:'Afrique de l\'Ouest',pop:'15M'},
  {n:'Accra',pays:'Ghana',lat:5.60,lng:-0.19,r:'Afrique de l\'Ouest',pop:'2.5M'},
  {n:'Abidjan',pays:'Côte d\'Ivoire',lat:5.36,lng:-4.01,r:'Afrique de l\'Ouest',pop:'5.2M'},
  {n:'Cotonou',pays:'Bénin',lat:6.37,lng:2.39,r:'Afrique de l\'Ouest',pop:'780k'},
  {n:'Lomé',pays:'Togo',lat:6.13,lng:1.22,r:'Afrique de l\'Ouest',pop:'1.7M'},
  {n:'Conakry',pays:'Guinée',lat:9.51,lng:-13.71,r:'Afrique de l\'Ouest',pop:'1.7M'},
  {n:'Nouakchott',pays:'Mauritanie',lat:18.08,lng:-15.97,r:'Afrique de l\'Ouest',pop:'1.3M'},
  {n:'Yaoundé',pays:'Cameroun',lat:3.85,lng:11.50,r:'Afrique centrale',pop:'4.1M'},
  {n:'Libreville',pays:'Gabon',lat:0.42,lng:9.45,r:'Afrique centrale',pop:'797k'},
  {n:'Brazzaville',pays:'Congo',lat:-4.27,lng:15.27,r:'Afrique centrale',pop:'2.4M'},
  {n:'Kinshasa',pays:'RD Congo',lat:-4.32,lng:15.31,r:'Afrique centrale',pop:'17M'},
  {n:'Goma',pays:'RD Congo',lat:-1.68,lng:29.22,r:'Afrique centrale',pop:'1.2M'},
  {n:'Bangui',pays:'RCA',lat:4.37,lng:18.55,r:'Afrique centrale',pop:'880k'},
  {n:'Ndjamena',pays:'Tchad',lat:12.13,lng:15.06,r:'Afrique centrale',pop:'1.6M'},
  {n:'Addis-Abeba',pays:'Éthiopie',lat:9.03,lng:38.74,r:'Corne de l\'Afrique',pop:'5M'},
  {n:'Mogadiscio',pays:'Somalie',lat:2.04,lng:45.34,r:'Corne de l\'Afrique',pop:'2.5M'},
  {n:'Asmara',pays:'Érythrée',lat:15.32,lng:38.93,r:'Corne de l\'Afrique',pop:'963k'},
  {n:'Djibouti',pays:'Djibouti',lat:11.59,lng:43.15,r:'Corne de l\'Afrique',pop:'600k'},
  {n:'Nairobi',pays:'Kenya',lat:-1.29,lng:36.82,r:'Afrique de l\'Est',pop:'4.4M'},
  {n:'Kampala',pays:'Ouganda',lat:0.31,lng:32.58,r:'Afrique de l\'Est',pop:'1.7M'},
  {n:'Kigali',pays:'Rwanda',lat:-1.94,lng:30.06,r:'Afrique de l\'Est',pop:'1.2M'},
  {n:'Bujumbura',pays:'Burundi',lat:-3.36,lng:29.36,r:'Afrique de l\'Est',pop:'1.1M'},
  {n:'Dodoma',pays:'Tanzanie',lat:-6.16,lng:35.74,r:'Afrique de l\'Est',pop:'410k'},
  {n:'Lusaka',pays:'Zambie',lat:-15.39,lng:28.32,r:'Afrique australe',pop:'2.5M'},
  {n:'Harare',pays:'Zimbabwe',lat:-17.83,lng:31.05,r:'Afrique australe',pop:'1.5M'},
  {n:'Pretoria',pays:'Afrique du Sud',lat:-25.75,lng:28.19,r:'Afrique australe',pop:'2.5M'},
  {n:'Le Cap',pays:'Afrique du Sud',lat:-33.92,lng:18.42,r:'Afrique australe',pop:'4.7M'},
  {n:'Maputo',pays:'Mozambique',lat:-25.97,lng:32.57,r:'Afrique australe',pop:'1.1M'},
  {n:'Antananarivo',pays:'Madagascar',lat:-18.88,lng:47.51,r:'Afrique australe',pop:'1.4M'},

  // Moyen-Orient
  {n:'Tel-Aviv',pays:'Israël',lat:32.08,lng:34.78,r:'Moyen-Orient',pop:'460k'},
  {n:'Jérusalem',pays:'Israël/Palestine',lat:31.78,lng:35.22,r:'Moyen-Orient',pop:'940k',sacre:true},
  {n:'Ramallah',pays:'Palestine',lat:31.90,lng:35.21,r:'Moyen-Orient',pop:'34k'},
  {n:'Gaza',pays:'Palestine',lat:31.50,lng:34.47,r:'Moyen-Orient',pop:'590k'},
  {n:'Beyrouth',pays:'Liban',lat:33.89,lng:35.50,r:'Moyen-Orient',pop:'2.4M'},
  {n:'Damas',pays:'Syrie',lat:33.51,lng:36.29,r:'Moyen-Orient',pop:'2.4M'},
  {n:'Bagdad',pays:'Irak',lat:33.31,lng:44.36,r:'Moyen-Orient',pop:'7.1M'},
  {n:'Téhéran',pays:'Iran',lat:35.69,lng:51.39,r:'Moyen-Orient',pop:'9M'},
  {n:'Riyad',pays:'Arabie saoudite',lat:24.71,lng:46.68,r:'Moyen-Orient',pop:'7.5M'},
  {n:'Doha',pays:'Qatar',lat:25.29,lng:51.53,r:'Moyen-Orient',pop:'2.4M'},
  {n:'Abou Dabi',pays:'Émirats',lat:24.45,lng:54.39,r:'Moyen-Orient',pop:'1.5M'},
  {n:'Dubaï',pays:'Émirats',lat:25.20,lng:55.27,r:'Moyen-Orient',pop:'3.5M'},
  {n:'Mascate',pays:'Oman',lat:23.59,lng:58.40,r:'Moyen-Orient',pop:'1.6M'},
  {n:'Sanaa',pays:'Yémen',lat:15.37,lng:44.19,r:'Moyen-Orient',pop:'2.9M'},
  {n:'Aden',pays:'Yémen',lat:12.79,lng:45.04,r:'Moyen-Orient',pop:'1M'},
  {n:'Amman',pays:'Jordanie',lat:31.95,lng:35.93,r:'Moyen-Orient',pop:'4M'},
  {n:'Ankara',pays:'Turquie',lat:39.93,lng:32.86,r:'Moyen-Orient',pop:'5.7M'},
  {n:'Istanbul',pays:'Turquie',lat:41.01,lng:28.98,r:'Moyen-Orient',pop:'15M'},

  // Europe
  {n:'Paris',pays:'France',lat:48.85,lng:2.35,r:'Europe',pop:'11M'},
  {n:'Londres',pays:'Royaume-Uni',lat:51.51,lng:-0.13,r:'Europe',pop:'9M'},
  {n:'Berlin',pays:'Allemagne',lat:52.52,lng:13.40,r:'Europe',pop:'3.7M'},
  {n:'Madrid',pays:'Espagne',lat:40.42,lng:-3.70,r:'Europe',pop:'3.3M'},
  {n:'Rome',pays:'Italie',lat:41.90,lng:12.50,r:'Europe',pop:'4.3M'},
  {n:'Bruxelles',pays:'Belgique',lat:50.85,lng:4.35,r:'Europe',pop:'1.2M',ue:true},
  {n:'Amsterdam',pays:'Pays-Bas',lat:52.37,lng:4.90,r:'Europe',pop:'870k'},
  {n:'Vienne',pays:'Autriche',lat:48.21,lng:16.37,r:'Europe',pop:'1.9M'},
  {n:'Berne',pays:'Suisse',lat:46.95,lng:7.45,r:'Europe',pop:'140k'},
  {n:'Lisbonne',pays:'Portugal',lat:38.72,lng:-9.14,r:'Europe',pop:'550k'},
  {n:'Athènes',pays:'Grèce',lat:37.98,lng:23.73,r:'Europe',pop:'3.2M'},
  {n:'Stockholm',pays:'Suède',lat:59.33,lng:18.07,r:'Europe',pop:'1M'},
  {n:'Oslo',pays:'Norvège',lat:59.91,lng:10.75,r:'Europe',pop:'700k'},
  {n:'Helsinki',pays:'Finlande',lat:60.17,lng:24.94,r:'Europe',pop:'660k'},
  {n:'Copenhague',pays:'Danemark',lat:55.68,lng:12.57,r:'Europe',pop:'650k'},
  {n:'Varsovie',pays:'Pologne',lat:52.23,lng:21.01,r:'Europe',pop:'1.8M'},
  {n:'Budapest',pays:'Hongrie',lat:47.50,lng:19.04,r:'Europe',pop:'1.7M'},
  {n:'Bucarest',pays:'Roumanie',lat:44.43,lng:26.10,r:'Europe',pop:'1.8M'},
  {n:'Sofia',pays:'Bulgarie',lat:42.70,lng:23.32,r:'Europe',pop:'1.3M'},
  {n:'Belgrade',pays:'Serbie',lat:44.79,lng:20.45,r:'Europe',pop:'1.4M'},
  {n:'Sarajevo',pays:'Bosnie',lat:43.85,lng:18.37,r:'Europe',pop:'275k'},
  {n:'Zagreb',pays:'Croatie',lat:45.81,lng:15.98,r:'Europe',pop:'790k'},
  {n:'Kiev',pays:'Ukraine',lat:50.45,lng:30.52,r:'Europe de l\'Est',pop:'3M'},
  {n:'Moscou',pays:'Russie',lat:55.75,lng:37.62,r:'Europe de l\'Est',pop:'13M'},
  {n:'Saint-Pétersbourg',pays:'Russie',lat:59.93,lng:30.34,r:'Europe de l\'Est',pop:'5.4M'},
  {n:'Minsk',pays:'Bélarus',lat:53.90,lng:27.57,r:'Europe de l\'Est',pop:'2M'},
  {n:'Vilnius',pays:'Lituanie',lat:54.69,lng:25.28,r:'Europe',pop:'580k'},
  {n:'Riga',pays:'Lettonie',lat:56.95,lng:24.11,r:'Europe',pop:'620k'},
  {n:'Tallinn',pays:'Estonie',lat:59.44,lng:24.75,r:'Europe',pop:'440k'},

  // Asie
  {n:'Pékin',pays:'Chine',lat:39.90,lng:116.41,r:'Asie de l\'Est',pop:'21M'},
  {n:'Shanghai',pays:'Chine',lat:31.23,lng:121.47,r:'Asie de l\'Est',pop:'24M'},
  {n:'Hong Kong',pays:'Chine',lat:22.32,lng:114.17,r:'Asie de l\'Est',pop:'7.5M'},
  {n:'Taipei',pays:'Taïwan',lat:25.03,lng:121.56,r:'Asie de l\'Est',pop:'2.6M'},
  {n:'Tokyo',pays:'Japon',lat:35.68,lng:139.65,r:'Asie de l\'Est',pop:'37M'},
  {n:'Séoul',pays:'Corée du Sud',lat:37.57,lng:126.98,r:'Asie de l\'Est',pop:'10M'},
  {n:'Pyongyang',pays:'Corée du Nord',lat:39.04,lng:125.76,r:'Asie de l\'Est',pop:'3.2M'},
  {n:'Oulan-Bator',pays:'Mongolie',lat:47.89,lng:106.91,r:'Asie de l\'Est',pop:'1.5M'},
  {n:'Hanoï',pays:'Vietnam',lat:21.03,lng:105.85,r:'Asie du Sud-Est',pop:'8.4M'},
  {n:'Bangkok',pays:'Thaïlande',lat:13.76,lng:100.50,r:'Asie du Sud-Est',pop:'10M'},
  {n:'Phnom Penh',pays:'Cambodge',lat:11.55,lng:104.92,r:'Asie du Sud-Est',pop:'2.1M'},
  {n:'Vientiane',pays:'Laos',lat:17.97,lng:102.60,r:'Asie du Sud-Est',pop:'820k'},
  {n:'Naypyidaw',pays:'Myanmar',lat:19.75,lng:96.10,r:'Asie du Sud-Est',pop:'924k'},
  {n:'Kuala Lumpur',pays:'Malaisie',lat:3.14,lng:101.69,r:'Asie du Sud-Est',pop:'1.8M'},
  {n:'Singapour',pays:'Singapour',lat:1.35,lng:103.82,r:'Asie du Sud-Est',pop:'5.7M',hub:true},
  {n:'Jakarta',pays:'Indonésie',lat:-6.21,lng:106.85,r:'Asie du Sud-Est',pop:'10.5M'},
  {n:'Manille',pays:'Philippines',lat:14.60,lng:120.98,r:'Asie du Sud-Est',pop:'13M'},
  {n:'New Delhi',pays:'Inde',lat:28.61,lng:77.21,r:'Asie du Sud',pop:'30M'},
  {n:'Mumbai',pays:'Inde',lat:19.08,lng:72.88,r:'Asie du Sud',pop:'21M'},
  {n:'Dacca',pays:'Bangladesh',lat:23.81,lng:90.41,r:'Asie du Sud',pop:'21M'},
  {n:'Islamabad',pays:'Pakistan',lat:33.69,lng:73.05,r:'Asie du Sud',pop:'1.1M'},
  {n:'Karachi',pays:'Pakistan',lat:24.86,lng:67.01,r:'Asie du Sud',pop:'17M'},
  {n:'Kaboul',pays:'Afghanistan',lat:34.53,lng:69.17,r:'Asie centrale',pop:'4.6M'},
  {n:'Tachkent',pays:'Ouzbékistan',lat:41.31,lng:69.24,r:'Asie centrale',pop:'2.5M'},
  {n:'Achgabat',pays:'Turkménistan',lat:37.95,lng:58.38,r:'Asie centrale',pop:'810k'},
  {n:'Astana',pays:'Kazakhstan',lat:51.17,lng:71.42,r:'Asie centrale',pop:'1.2M'},
  {n:'Bichkek',pays:'Kirghizistan',lat:42.87,lng:74.59,r:'Asie centrale',pop:'1M'},
  {n:'Douchanbé',pays:'Tadjikistan',lat:38.54,lng:68.78,r:'Asie centrale',pop:'860k'},

  // Caucase
  {n:'Tbilissi',pays:'Géorgie',lat:41.72,lng:44.78,r:'Caucase',pop:'1.1M'},
  {n:'Erevan',pays:'Arménie',lat:40.18,lng:44.51,r:'Caucase',pop:'1.1M'},
  {n:'Bakou',pays:'Azerbaïdjan',lat:40.41,lng:49.87,r:'Caucase',pop:'2.3M'},

  // Amériques
  {n:'Washington DC',pays:'États-Unis',lat:38.91,lng:-77.04,r:'Amérique du Nord',pop:'700k'},
  {n:'New York',pays:'États-Unis',lat:40.71,lng:-74.01,r:'Amérique du Nord',pop:'8.4M',hub:true},
  {n:'Ottawa',pays:'Canada',lat:45.42,lng:-75.69,r:'Amérique du Nord',pop:'1M'},
  {n:'Mexico',pays:'Mexique',lat:19.43,lng:-99.13,r:'Amérique du Nord',pop:'22M'},
  {n:'Guatemala',pays:'Guatemala',lat:14.63,lng:-90.51,r:'Amérique centrale',pop:'1M'},
  {n:'San Salvador',pays:'El Salvador',lat:13.69,lng:-89.22,r:'Amérique centrale',pop:'525k'},
  {n:'Tegucigalpa',pays:'Honduras',lat:14.07,lng:-87.19,r:'Amérique centrale',pop:'1.2M'},
  {n:'Managua',pays:'Nicaragua',lat:12.12,lng:-86.27,r:'Amérique centrale',pop:'1M'},
  {n:'San José',pays:'Costa Rica',lat:9.93,lng:-84.08,r:'Amérique centrale',pop:'342k'},
  {n:'Panama',pays:'Panama',lat:8.98,lng:-79.52,r:'Amérique centrale',pop:'880k'},
  {n:'Port-au-Prince',pays:'Haïti',lat:18.59,lng:-72.31,r:'Caraïbes',pop:'2.8M'},
  {n:'La Havane',pays:'Cuba',lat:23.13,lng:-82.38,r:'Caraïbes',pop:'2.1M'},
  {n:'Caracas',pays:'Venezuela',lat:10.49,lng:-66.88,r:'Amérique du Sud',pop:'2.9M'},
  {n:'Bogota',pays:'Colombie',lat:4.71,lng:-74.07,r:'Amérique du Sud',pop:'7.4M'},
  {n:'Quito',pays:'Équateur',lat:-0.18,lng:-78.47,r:'Amérique du Sud',pop:'2M'},
  {n:'Lima',pays:'Pérou',lat:-12.05,lng:-77.04,r:'Amérique du Sud',pop:'10M'},
  {n:'La Paz',pays:'Bolivie',lat:-16.49,lng:-68.13,r:'Amérique du Sud',pop:'816k'},
  {n:'Santiago',pays:'Chili',lat:-33.45,lng:-70.67,r:'Amérique du Sud',pop:'6.8M'},
  {n:'Buenos Aires',pays:'Argentine',lat:-34.61,lng:-58.38,r:'Amérique du Sud',pop:'15M'},
  {n:'Brasilia',pays:'Brésil',lat:-15.79,lng:-47.88,r:'Amérique du Sud',pop:'3M'},
  {n:'Rio de Janeiro',pays:'Brésil',lat:-22.91,lng:-43.17,r:'Amérique du Sud',pop:'13M'},
  {n:'São Paulo',pays:'Brésil',lat:-23.55,lng:-46.63,r:'Amérique du Sud',pop:'22M'},
  {n:'Asuncion',pays:'Paraguay',lat:-25.30,lng:-57.63,r:'Amérique du Sud',pop:'525k'},
  {n:'Montevideo',pays:'Uruguay',lat:-34.90,lng:-56.16,r:'Amérique du Sud',pop:'1.3M'},

  // Océanie
  {n:'Canberra',pays:'Australie',lat:-35.28,lng:149.13,r:'Océanie',pop:'455k'},
  {n:'Sydney',pays:'Australie',lat:-33.87,lng:151.21,r:'Océanie',pop:'5.3M'},
  {n:'Wellington',pays:'Nouvelle-Zélande',lat:-41.29,lng:174.78,r:'Océanie',pop:'215k'}
];

/* === DÉTROITS, CANAUX & VOIES MARITIMES STRATÉGIQUES === */
const STRAITS_CANALS = [
  {n:'Détroit d\'Ormuz',lat:26.57,lng:56.25,role:'20% pétrole mondial transit. Verrou Iran/Oman.',type:'detroit',crit:10},
  {n:'Détroit de Bab el-Mandeb',lat:12.58,lng:43.33,role:'Mer Rouge / Suez. Cibles Houthis depuis 2023.',type:'detroit',crit:10},
  {n:'Détroit de Malacca',lat:2.5,lng:101.5,role:'30% commerce maritime mondial. Vital pour la Chine.',type:'detroit',crit:10},
  {n:'Détroit du Bosphore',lat:41.10,lng:29.05,role:'Mer Noire / Méditerranée. Convention de Montreux.',type:'detroit',crit:9},
  {n:'Détroit des Dardanelles',lat:40.20,lng:26.40,role:'Couplé au Bosphore. Verrouille flotte russe Mer Noire.',type:'detroit',crit:9},
  {n:'Détroit de Gibraltar',lat:35.96,lng:-5.61,role:'Méditerranée / Atlantique. Présence britannique.',type:'detroit',crit:9},
  {n:'Détroit de Taïwan',lat:24.50,lng:120.50,role:'Eaux internationales contestées. Tension Chine-USA.',type:'detroit',crit:10},
  {n:'Détroit de Magellan',lat:-53.50,lng:-70.50,role:'Pacifique / Atlantique sud. Alternative à Panama.',type:'detroit',crit:6},
  {n:'Canal de Suez',lat:30.59,lng:32.27,role:'~12% commerce mondial. Crise Houthis -60% trafic.',type:'canal',crit:10},
  {n:'Canal de Panama',lat:9.08,lng:-79.68,role:'Pacifique / Atlantique. Sécheresse 2023-2024 réduit capacité.',type:'canal',crit:9},
  {n:'Canal de Kiel',lat:54.39,lng:10.07,role:'Mer du Nord / Baltique. Stratégique en cas conflit OTAN-Russie.',type:'canal',crit:7},
  {n:'Détroit d\'Hormuz / Larak',lat:26.85,lng:56.35,role:'Voisin Hormuz. Bases iraniennes.',type:'detroit',crit:8},
  {n:'Cap de Bonne-Espérance',lat:-34.36,lng:18.47,role:'Route alternative à Suez. +10-14 jours.',type:'cap',crit:8},
  {n:'Cap Horn',lat:-55.98,lng:-67.27,role:'Alternative à Panama. Conditions météo hostiles.',type:'cap',crit:5},
  {n:'Détroit de Lombok',lat:-8.50,lng:116.0,role:'Alternative à Malacca pour gros tonnages.',type:'detroit',crit:7},
  {n:'Détroit de Sonde',lat:-6.07,lng:105.85,role:'Java / Sumatra. Voie maritime régionale.',type:'detroit',crit:6},
  {n:'Détroit de Béring',lat:65.50,lng:-169.0,role:'Russie / Alaska. Voie arctique en croissance.',type:'detroit',crit:7}
];

/* === HUBS PORTUAIRES MAJEURS === */
const PORTS_STRAT = [
  {n:'Port de Shanghai',lat:31.36,lng:121.62,role:'1er port mondial conteneurs (47M EVP/an).',crit:10},
  {n:'Port de Singapour',lat:1.27,lng:103.85,role:'2e port mondial. Hub Malacca.',crit:10},
  {n:'Port de Rotterdam',lat:51.95,lng:4.13,role:'1er port européen.',crit:9},
  {n:'Port de Ningbo-Zhoushan',lat:29.95,lng:121.81,role:'Top 3 mondial conteneurs.',crit:9},
  {n:'Port de Busan',lat:35.10,lng:129.04,role:'Hub coréen. Top 7 mondial.',crit:8},
  {n:'Port de Hong Kong',lat:22.30,lng:114.17,role:'Hub historique sud-Chine.',crit:8},
  {n:'Port de Djibouti',lat:11.59,lng:43.15,role:'Sahel/Corne, base militaire (US, FR, CN, JP).',crit:9,strat:true},
  {n:'Port-Soudan',lat:19.62,lng:37.22,role:'Soudan. Projet base navale russe.',crit:7,strat:true},
  {n:'Port d\'Abidjan',lat:5.27,lng:-4.02,role:'Hub Afrique de l\'Ouest. Critique pour AES enclavés.',crit:8,strat:true},
  {n:'Port de Lomé',lat:6.13,lng:1.28,role:'Hub Afrique de l\'Ouest. Trafic AES.',crit:7,strat:true},
  {n:'Port de Tema',lat:5.62,lng:0.0,role:'Ghana. Ouverture mer pour Sahel.',crit:7,strat:true},
  {n:'Port d\'Anvers',lat:51.23,lng:4.42,role:'2e port européen.',crit:8},
  {n:'Port de Hambourg',lat:53.55,lng:9.99,role:'3e port européen.',crit:8},
  {n:'Port de New York',lat:40.66,lng:-74.05,role:'1er port côte est USA.',crit:8},
  {n:'Port de Los Angeles',lat:33.74,lng:-118.27,role:'1er port côte ouest USA.',crit:8},
  {n:'Port de Sébastopol',lat:44.61,lng:33.52,role:'Base flotte russe Mer Noire. Crimée.',crit:9,strat:true},
  {n:'Port de Tartous',lat:34.89,lng:35.88,role:'Base navale russe Méditerranée.',crit:9,strat:true},
  {n:'Port d\'Haïfa',lat:32.83,lng:35.00,role:'Israël. Corridor d\'Abraham (Inde-Golfe).',crit:8,strat:true}
];

/* === BASES MILITAIRES MAJEURES === */
const BASES_MIL = [
  {n:'Camp Lemonnier',pays:'Djibouti',lat:11.55,lng:43.15,role:'Seule base permanente US en Afrique.',acteur:'USA',crit:10},
  {n:'Base de Doha (Al Udeid)',pays:'Qatar',lat:25.12,lng:51.31,role:'CENTCOM avancé. ~10 000 personnels.',acteur:'USA',crit:10},
  {n:'Base navale 5e flotte',pays:'Bahreïn',lat:26.21,lng:50.61,role:'Couvre Golfe persique.',acteur:'USA',crit:10},
  {n:'Base aérienne d\'Incirlik',pays:'Turquie',lat:37.0,lng:35.41,role:'OTAN. Armes nucléaires US.',acteur:'USA/OTAN',crit:9},
  {n:'Base de Ramstein',pays:'Allemagne',lat:49.43,lng:7.60,role:'Hub aérien US Europe.',acteur:'USA',crit:9},
  {n:'Base de Yokosuka',pays:'Japon',lat:35.28,lng:139.66,role:'7e flotte US, Pacifique-Ouest.',acteur:'USA',crit:10},
  {n:'Base de Guam',pays:'Guam',lat:13.44,lng:144.79,role:'Pivot Indo-Pacifique.',acteur:'USA',crit:9},
  {n:'Base de Diego Garcia',pays:'OIBT',lat:-7.32,lng:72.42,role:'Océan Indien. Bombardiers stratégiques.',acteur:'USA/UK',crit:9},
  {n:'Base de Hmeimim',pays:'Syrie',lat:35.40,lng:35.95,role:'Base aérienne russe.',acteur:'Russie',crit:8},
  {n:'Base de Kaliningrad',pays:'Russie',lat:54.71,lng:20.51,role:'Enclave russe en Europe. Iskander.',acteur:'Russie',crit:9},
  {n:'Base de Hainan',pays:'Chine',lat:18.51,lng:108.65,role:'Sous-marins nucléaires chinois.',acteur:'Chine',crit:9},
  {n:'Base d\'Aksaï Chin',pays:'Chine',lat:35.0,lng:78.0,role:'Plateau Tibétain. Frontière Inde.',acteur:'Chine',crit:7},
  {n:'Base de Pearl Harbor',pays:'Hawaï',lat:21.36,lng:-157.97,role:'Pacifique central US.',acteur:'USA',crit:8},
  {n:'Base navale de Toulon',pays:'France',lat:43.11,lng:5.93,role:'1ère base navale française.',acteur:'France',crit:7},
  {n:'Base de Gao',pays:'Mali',lat:16.27,lng:-0.04,role:'Ancien hub Barkhane (FR), évacuée 2022.',acteur:'Russie/AES',crit:8,strat:true}
];

/* === CORRIDORS ÉNERGÉTIQUES === */
const CORRIDORS_ENERGY = [
  {n:'Pipeline Druzhba',from:[55.61,37.62],to:[51.10,17.03],role:'Pétrole russe vers Europe centrale. Toujours actif.',acteur:'Russie/UE'},
  {n:'Nord Stream 1/2',from:[59.5,28.5],to:[54.0,12.0],role:'Gaz russe vers Allemagne. Sabotés sept. 2022.',acteur:'Russie/UE',inactif:true},
  {n:'Pipeline TurkStream',from:[44.78,37.85],to:[41.96,28.56],role:'Gaz russe vers Turquie/Europe SE.',acteur:'Russie/Turquie'},
  {n:'Pipeline Power of Siberia',from:[60.0,128.0],to:[46.0,123.0],role:'Gaz russe vers Chine. Capacité doublée 2024.',acteur:'Russie/Chine'},
  {n:'Pipeline TAPI',from:[37.95,58.38],to:[28.61,77.21],role:'Turkménistan-Afghanistan-Pakistan-Inde. Stratégique.',acteur:'Asie centrale',inactif:true},
  {n:'BTC pipeline',from:[40.41,49.87],to:[36.99,35.31],role:'Bakou-Tbilissi-Ceyhan. Pétrole Caspienne.',acteur:'AZ/GE/TR'},
  {n:'Corridor Ormuz',from:[24.45,54.39],to:[26.57,56.25],role:'Émirats / Arabie / Qatar -> Ormuz. 20% pétrole mondial.',acteur:'Golfe'},
  {n:'Route mer Rouge',from:[12.58,43.33],to:[30.59,32.27],role:'Bab el-Mandeb -> Suez. Cibles Houthis.',acteur:'Mer Rouge'}
];

/* exposer */
window.GW_DATA = window.GW_DATA || {};
window.GW_DATA.WORLD_CAPITALS = WORLD_CAPITALS;
window.GW_DATA.STRAITS_CANALS = STRAITS_CANALS;
window.GW_DATA.PORTS_STRAT = PORTS_STRAT;
window.GW_DATA.BASES_MIL = BASES_MIL;
window.GW_DATA.CORRIDORS_ENERGY = CORRIDORS_ENERGY;
