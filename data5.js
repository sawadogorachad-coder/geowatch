/* ==========================================================================
   GéoWatch — Analyses géopolitiques SIMPLIFIÉES
   Pour chaque conflit : un brief pédagogique court accessible aux non-spécialistes
   ========================================================================== */

const ANALYSES_SIMPLES = {

  c_aes:{
    en_une_phrase:'Trois États sahéliens (Burkina, Mali, Niger) ont basculé hors de l\'orbite occidentale pour former une confédération militaire alignée sur la Russie, tout en perdant du terrain face aux groupes jihadistes.',
    pourquoi_important:'C\'est la rupture géopolitique africaine la plus profonde depuis les indépendances. Elle redistribue les cartes de l\'influence en Afrique de l\'Ouest, fragilise la CEDEAO, ouvre la voie à de nouveaux partenaires (Russie, Chine, Iran, Turquie, Émirats), et pose la question de la viabilité du modèle militaro-plébiscitaire face à une menace jihadiste qui continue de progresser.',
    qui_contre_qui:[
      {a:'Junte militaire AES (Traoré, Goïta, Tiani)',position:'défend la souveraineté contre la « Françafrique » et les jihadistes'},
      {a:'JNIM (al-Qaïda) + EIGS (État islamique)',position:'contestent l\'État, contrôlent ~40% du territoire BF'},
      {a:'France / UE / CEDEAO',position:'ont perdu le bras de fer politique, retraités militairement'},
      {a:'Russie (Africa Corps) + Turquie + Iran + EAU',position:'remplissent le vide, intérêts miniers et stratégiques'}
    ],
    enjeu_central:'Inventer un modèle politique africain qui combine souveraineté affichée et efficacité sécuritaire — sans y être encore parvenu.',
    surveiller:[
      'Une attaque réussie sur Ouagadougou-centre ou Bamako (rupture systémique).',
      'L\'extension côtière de la guerre (Bénin, Togo, Côte d\'Ivoire).',
      'La sortie effective du F CFA et la naissance d\'une monnaie AES.'
    ],
    analogie:'Imaginez l\'Afrique de l\'Ouest comme un quartier où trois maisons (Mali, Burkina, Niger) ont licencié leur ancien gardien (France) pour en embaucher un nouveau (Russie), tout en se barricadant ensemble — pendant qu\'un groupe d\'intrus (jihadistes) profite de la confusion pour occuper les arrière-cours.',
    horizon_proche:'12-24 mois : statu quo dégradé probable, perte de territoires ruraux, popularité urbaine maintenue.',
    horizon_long:'5-10 ans : soit consolidation d\'un nouveau modèle, soit effondrement d\'au moins un État.'
  },

  c_iran_il:{
    en_une_phrase:'Israël a démantelé en 18 mois le réseau de proxies de l\'Iran (Hezbollah, Hamas, Assad), puis a frappé l\'Iran lui-même avec les États-Unis, tuant Khamenei et fermant le détroit d\'Ormuz — une bascule régionale historique.',
    pourquoi_important:'Le Moyen-Orient connaît sa plus profonde recomposition depuis 1979. La fin de l\'arc chiite ouvre une fenêtre rare : soit un nouvel ordre stable autour des Saoudiens, soit le chaos d\'une transition iranienne incontrôlée. La fermeture d\'Ormuz a déjà déclenché un choc pétrolier mondial qui frappe directement les économies importatrices comme le Burkina Faso.',
    qui_contre_qui:[
      {a:'Israël + États-Unis',position:'frappes préventives, démantèlement programme nucléaire iranien'},
      {a:'Iran (Pasdaran/CGRI)',position:'régime ébranlé, Khamenei mort, succession ouverte'},
      {a:'Hezbollah / Hamas / Houthis',position:'décapités mais pas anéantis, Houthis seul gagnant relatif'},
      {a:'Arabie saoudite + Émirats',position:'arbitres ascendants, normalisation Israël en suspens'},
      {a:'Russie + Chine',position:'soutiens diplomatiques de Téhéran, mais peu d\'engagement militaire'}
    ],
    enjeu_central:'La transition iranienne (continuité affaiblie, junte des Pasdaran, effondrement, ou ouverture) déterminera la stabilité de tout le Moyen-Orient pour 20 ans.',
    surveiller:[
      'L\'identité du successeur de Khamenei (fils Mojtaba ? Conseil Pasdaran ?).',
      'Le maintien ou la levée du blocus d\'Ormuz (impact pétrole mondial).',
      'Le sort des sites nucléaires Fordo/Natanz : capacité résiduelle d\'enrichir ?'
    ],
    analogie:'Pensez à Iran-Israël comme à deux duellistes qui se sont battus pendant 45 ans à coups de boxeurs interposés. En 2024-2026, ils ont retiré leurs gants et se sont frappés directement. L\'un des deux est tombé. La question est : se relèvera-t-il ? Et avec qui ?',
    horizon_proche:'6-12 mois : crise économique aiguë en Iran, possible accélération nucléaire clandestine.',
    horizon_long:'5-10 ans : soit Iran réformé/ouvert, soit Iran junte nucléaire, soit Iran défaillant — chaque scénario reconfigure tout.'
  },

  c_ukr:{
    en_une_phrase:'La Russie tente depuis 2022 de soumettre l\'Ukraine par la force ; trois ans plus tard, le front est figé, l\'arrivée de Trump fait peser le risque d\'un abandon américain, et l\'Europe doit décider si elle peut tenir seule.',
    pourquoi_important:'C\'est la première guerre européenne de haute intensité depuis 1945 et le test décisif de l\'ordre international post-Guerre froide. Si la Russie obtient des concessions par la force, la frontière taïwanaise, sahélienne et caucasienne deviennent négociables par les armes. C\'est aussi un test pour le réarmement européen et la crédibilité de l\'OTAN sans soutien américain.',
    qui_contre_qui:[
      {a:'Ukraine + soutiens UE',position:'défense d\'un État souverain et de l\'ordre post-1945'},
      {a:'Russie + Bélarus + Corée du Nord (troupes) + Iran (drones)',position:'reconquête impériale, défi à l\'OTAN'},
      {a:'États-Unis (Trump 2)',position:'soutien fragilisé depuis janvier 2025, chantage à la négociation'},
      {a:'Chine',position:'soutien économique discret, ambiguïté stratégique'}
    ],
    enjeu_central:'L\'Ukraine est trop grande pour être conquise et trop importante pour être abandonnée. Le conflit tend vers un blocage prolongé que personne ne sait résoudre.',
    surveiller:[
      'Les décrets de Trump sur l\'aide militaire (effectif effectif sur 6 mois).',
      'L\'évolution du front : reprise russe ou ukrainienne dans Sumy/Kharkiv/Donetsk.',
      'Les capacités économiques russes après 4 ans d\'économie de guerre (taux d\'intérêt 21%, démographie négative).'
    ],
    analogie:'Imaginez un voisin (la Russie) qui prétend que la maison d\'à côté (l\'Ukraine) lui appartient « historiquement », et qui essaye de la prendre par la force. Quatre ans plus tard, il a détruit la moitié de la maison sans pouvoir y entrer. Le propriétaire (Ukraine) tient grâce à l\'aide des amis (UE, USA), mais l\'un des amis (Trump) hésite à continuer.',
    horizon_proche:'12-24 mois : forte probabilité de gel imposé par Trump sur la ligne actuelle, sans paix.',
    horizon_long:'5-10 ans : soit nouvel équilibre européen avec Russie contenue, soit nouveau cycle d\'agression.'
  },

  c_gaza:{
    en_une_phrase:'L\'attaque du Hamas du 7 octobre 2023 a déclenché une guerre qui a détruit Gaza, décapité Hamas et Hezbollah, fait chuter Assad, et qui n\'a aucune sortie politique en vue.',
    pourquoi_important:'Au-delà du drame humanitaire (~50 000 morts à Gaza, famine documentée), cette guerre teste la crédibilité du droit international (procès CIJ, plaintes CPI), polarise les opinions occidentales et du Sud global, et reconfigure le Moyen-Orient. Elle bloque la normalisation arabe d\'Israël et alimente partout les récits anti-impérialistes — y compris au Burkina Faso.',
    qui_contre_qui:[
      {a:'Israël (coalition Netanyahou)',position:'doctrine sécurité absolue, occupation militaire de fait'},
      {a:'Hamas',position:'militairement réduit ~70%, politiquement vivant'},
      {a:'Hezbollah',position:'décapité (Nasrallah tué), affaibli mais structuré'},
      {a:'Sud global + Sud africain (CIJ)',position:'accusations de génocide, isolement diplomatique d\'Israël'},
      {a:'États-Unis + Saoudite',position:'cherchent un plan régional « jour d\'après » conditionné à un horizon palestinien'}
    ],
    enjeu_central:'Sans horizon politique palestinien crédible (deux États ou alternative), aucun cessez-le-feu ne sera durable. Le « jour d\'après » est la vraie question, pas le « jour pendant ».',
    surveiller:[
      'Le plan régional Trump-Saoudien (force internationale arabe à Gaza ?).',
      'L\'évolution Cisjordanie : risque de 3e Intifada.',
      'La survie de la coalition Netanyahou (otages, procès, élections).'
    ],
    analogie:'Pensez à Gaza comme à une cocotte-minute fermée depuis 2007. Le 7 octobre, le couvercle a sauté avec une force inégalée. Israël essaye depuis de la rendre inoffensive en la cassant, mais chaque fragment génère une nouvelle pression. Sans changer la chimie de fond (la question palestinienne), aucune réparation ne tient.',
    horizon_proche:'12-24 mois : probable statu quo dégradé, occupation militaire permanente Gaza, raids Cisjordanie.',
    horizon_long:'5-10 ans : soit règlement régional saoudien, soit effondrement progressif de la légitimité d\'Israël à long terme.'
  },

  c_sdn:{
    en_une_phrase:'Deux factions militaires soudanaises (SAF de Burhan et RSF de Hemedti) se font la guerre depuis avril 2023 pour le contrôle de l\'État, provoquant la pire crise humanitaire mondiale et un risque génocide reconnu au Darfour.',
    pourquoi_important:'C\'est la guerre la plus meurtrière du moment (~150 000 morts, 10 millions de déplacés, famine déclarée IPC 5) et pourtant la moins couverte. Elle illustre l\'effondrement total d\'un État de 48 millions d\'habitants, alimenté par des sponsors régionaux (EAU vs Égypte/Arabie). Sa persistance déstabilise la mer Rouge, le Tchad, le Sud-Soudan, et révèle la faillite des médiations africaines et arabes.',
    qui_contre_qui:[
      {a:'SAF (général Burhan)',position:'armée régulière, soutenue par Égypte/Arabie/Iran/Russie'},
      {a:'RSF (Hemedti)',position:'paramilitaires issus des Janjaweed, soutenus secrètement par les Émirats'},
      {a:'Civils (Forces FFC)',position:'écrasés entre les deux factions, prônent une transition démocratique'},
      {a:'Médiateurs (USA, Saoudite, Manama, Doha)',position:'tous échouent, processus tournent en rond'}
    ],
    enjeu_central:'Le Soudan est trop grand et trop divers pour qu\'une victoire militaire d\'un camp permette de gouverner. Toute issue militaire produira un État défaillant. Mais aucune négociation ne marche.',
    surveiller:[
      'L\'évolution du soutien émirien aux RSF face aux pressions US (génocide reconnu jan. 2025).',
      'Le sort d\'El Fasher au Darfour (massacres documentés).',
      'La possibilité d\'une base navale russe à Port-Soudan (recomposition mer Rouge).'
    ],
    analogie:'Imaginez deux gardes du corps (SAF et RSF) qui ont assassiné le président qu\'ils protégeaient (Béchir, 2019), pris ensemble le pouvoir, puis se sont retournés l\'un contre l\'autre. Ils détruisent leur propre maison, et chaque visiteur étranger soutient l\'un ou l\'autre selon ses intérêts.',
    horizon_proche:'12-24 mois : partition de fait probable. SAF contrôle Khartoum/Nord/Est, RSF contrôle Darfour/Kordofan-Sud.',
    horizon_long:'5-10 ans : risque d\'effondrement total et de fragmentation type Libye 2011-aujourd\'hui.'
  },

  c_tai:{
    en_une_phrase:'Pékin presse militairement Taïwan pour forcer la « réunification » avant que l\'île, démocratique et productrice de 90% des puces avancées mondiales, ne devienne hors de portée — créant le risque de guerre le plus systémique au monde.',
    pourquoi_important:'Une crise Taïwan ne serait pas régionale : ce serait l\'équivalent de COVID + crise de 2008 combinés. Sans TSMC, l\'IA, les smartphones, les voitures, la défense s\'arrêtent en quelques mois. C\'est aussi le test ultime de la primauté américaine en Pacifique : si Pékin gagne, la première chaîne d\'îles tombe et l\'ordre indo-pacifique bascule pour 50 ans.',
    qui_contre_qui:[
      {a:'République populaire de Chine (Xi Jinping)',position:'« réunification » non négociable, doctrine renouveau national'},
      {a:'République de Chine / Taïwan (Lai Ching-te)',position:'défend statu quo de fait, identité distincte (>60% se déclarent taïwanais seulement)'},
      {a:'États-Unis',position:'ambiguïté stratégique, fragilisée sous Trump 2'},
      {a:'Japon + Philippines + Australie',position:'alliés US, réarmement record'},
      {a:'Russie + Corée du Nord',position:'soutiens diplomatiques de Pékin'}
    ],
    enjeu_central:'TSMC fait de Taïwan un nœud systémique de l\'économie mondiale. Cela renforce la dissuasion (« bouclier de silicium ») mais aussi l\'enjeu, donc la tentation chinoise de neutraliser cet avantage par la force.',
    surveiller:[
      'Les exercices PLA majeurs (encerclement, blocus simulés).',
      'La position de Trump sur l\'engagement militaire en cas d\'invasion.',
      'Les avancées de TSMC en Arizona (relocalisation 100 Mds USD).'
    ],
    analogie:'Pensez à Taïwan comme à une chambre forte mondiale dans une maison contestée. Le voisin (Chine) prétend qu\'elle lui appartient. Mais à l\'intérieur se trouve la moitié de l\'or numérique mondial (TSMC). Tout le monde a peur que les voisins ne se battent pour cette chambre forte, mais aussi peur que la chambre disparaisse si la maison change de propriétaire.',
    horizon_proche:'12-36 mois : pression militaire constante mais pas d\'invasion immédiate. Risque crise non-cinétique (blocus, quarantaine).',
    horizon_long:'5-10 ans : horizon 2027 (centenaire PLA) cité comme date possible. Mais accident escalatoire plus probable que guerre planifiée.'
  },

  c_cod:{
    en_une_phrase:'Le Rwanda soutient depuis trois ans le M23, une rébellion qui a pris Goma puis Bukavu (jan-fév 2025) dans l\'Est de la RDC, captant les minerais critiques (coltan, or) et provoquant la pire crise humanitaire africaine après le Soudan.',
    pourquoi_important:'C\'est le théâtre de la longue guerre des Grands Lacs (~6 millions de morts cumulés depuis 1996). Au-delà de la dimension humanitaire (~7 millions de déplacés), le coltan congolais (70% production mondiale) est indispensable à toute l\'industrie tech mondiale. La crise illustre aussi la captation des ressources africaines par procuration et l\'échec total des médiations EAC, SADC, UA face à un agresseur — le Rwanda — protégé par sa mémoire post-génocide.',
    qui_contre_qui:[
      {a:'République démocratique du Congo (Tshisekedi)',position:'État faible, armée corrompue, mobilise les Wazalendo (volontaires patriotes)'},
      {a:'M23 + RDF Rwanda (Kagame)',position:'occupent Kivu, prétextent défendre les Tutsi congolais'},
      {a:'SAMIDRC + Burundi',position:'soutiennent Kinshasa, capacités limitées'},
      {a:'Médiations (EAC, SADC, Doha, Luanda)',position:'échouent toutes, paralysées par le double standard envers Kagame'}
    ],
    enjeu_central:'La RDC ne peut pas reconquérir le Kivu militairement seule. Le Rwanda ne peut pas annexer ouvertement sans crise diplomatique majeure. C\'est un statu quo violent durable.',
    surveiller:[
      'Les mouvements vers Bukavu et au-delà (Sud-Kivu vers Burundi).',
      'Les sanctions Trump sur le Rwanda (déclaration soutien M23 ?).',
      'Le sort de la MONUSCO (retrait achevé) et l\'éventuelle nouvelle force africaine.'
    ],
    analogie:'Imaginez un voisin (Rwanda) qui envoie ses hommes (M23) chez l\'autre voisin (RDC) pour piller régulièrement les ressources. La police internationale (UA, ONU) ferme les yeux car le Rwanda invoque toujours sa victimisation passée (génocide 1994). Le voisin pillé n\'a ni police ni armée capable de répondre.',
    horizon_proche:'12-36 mois : partition de fait du Kivu. Kinshasa contrôle le reste mais perd autorité dans l\'Est.',
    horizon_long:'5-10 ans : soit recomposition régionale (sanctions Rwanda, médiation Trump, plan africain), soit effondrement plus large.'
  },

  c_yem:{
    en_une_phrase:'Les Houthis, au pouvoir au Yémen depuis 2014, attaquent depuis novembre 2023 les navires en mer Rouge en soutien à Gaza, perturbant 12% du commerce maritime mondial et démontrant qu\'un acteur asymétrique peut bloquer un détroit stratégique.',
    pourquoi_important:'Bab el-Mandeb verrouille le passage entre Suez et l\'océan Indien. Sa fermeture force les navires à contourner par le cap de Bonne-Espérance (+10-14 jours, +30% coût). Les frappes US-UK ne font pas reculer les Houthis, qui sortent renforcés (popularité gonflée, légitimité régionale, leçon utile pour tout acteur asymétrique). Cela impacte directement le commerce du Burkina Faso (importations Asie) et tous les pays enclavés du Sahel.',
    qui_contre_qui:[
      {a:'Houthis (Ansar Allah)',position:'contrôlent Sanaa et la côte mer Rouge, alliés Iran'},
      {a:'Coalition arabe (Saoudite, EAU)',position:'épuisée par 9 ans de guerre, négociations en cours'},
      {a:'États-Unis + Royaume-Uni',position:'frappent depuis 2024 sans résultat majeur'},
      {a:'Iran',position:'fournit drones et missiles, mais affaibli par crise interne'}
    ],
    enjeu_central:'Un acteur asymétrique armé de drones à 30 000 USD peut paralyser le commerce maritime mondial pendant des mois. C\'est une révolution de l\'asymétrie qui change toutes les doctrines navales.',
    surveiller:[
      'Le maintien ou la levée du blocus mer Rouge.',
      'Les négociations saoudo-houthies (gel possible ?).',
      'Le transfert de technologies iraniennes après l\'effondrement de l\'arc chiite.'
    ],
    analogie:'Imaginez une autoroute mondiale (mer Rouge) où une bande de pirates locaux (Houthis), équipés de jouets téléguidés (drones), oblige tous les camionneurs à faire un détour de plusieurs jours. La police internationale (US, UK) bombarde leur planque, mais ils continuent.',
    horizon_proche:'6-18 mois : maintien du harcèlement maritime probable, sauf accord régional global.',
    horizon_long:'5-10 ans : Houthis comme acteur structurel du Yémen et de la péninsule arabique, modèle pour autres groupes.'
  },

  c_kor:{
    en_une_phrase:'La Corée du Nord, en se rapprochant militairement de la Russie (envoi de troupes en Ukraine, échange de technologies missiles), accélère ses programmes nucléaires et balistiques, reconfigurant la sécurité du nord-est asiatique.',
    pourquoi_important:'Le pacte Russie-Corée du Nord (juin 2024) est la première véritable alliance entre une puissance nucléaire et un État-paria depuis longtemps. ~12 000 soldats nord-coréens en Koursk = première projection terrestre de Pyongyang depuis 1953. En échange, Moscou transfère des technologies qui font sauter les verrous sur le programme nord-coréen, augmentant directement la menace pour le Japon, la Corée du Sud et les États-Unis.',
    qui_contre_qui:[
      {a:'Corée du Nord (Kim Jong-un)',position:'rapprochement Russie, durcissement, tirs balistiques records'},
      {a:'Russie',position:'fournit technologies en échange de munitions et troupes'},
      {a:'Corée du Sud (Lee Jae-myung)',position:'rouvre le dialogue avec Pyongyang depuis 2025'},
      {a:'États-Unis (Trump 2)',position:'imprévisible, possible diplomatie personnelle Kim-Trump'},
      {a:'Japon',position:'réarmement record, posture assertive'}
    ],
    enjeu_central:'L\'axe Russie-Corée du Nord brise les sanctions internationales et démontre qu\'un État-paria peut sortir de l\'isolement en s\'alignant sur une grande puissance révisionniste.',
    surveiller:[
      'Les tirs balistiques de nouvelle génération.',
      'La diplomatie Trump-Kim (sommet possible ?).',
      'Le retour des troupes nord-coréennes de Russie avec expérience combat.'
    ],
    analogie:'Imaginez un fauteur de troubles (Corée du Nord) qui s\'allie à un grand voyou en perte de vitesse (Russie). Ils s\'échangent des services : le petit fournit des soldats, le grand donne du matériel sophistiqué. Tout le quartier (Asie NE) doit s\'armer en réponse.',
    horizon_proche:'12-24 mois : poursuite du rapprochement RU-PRK, renforcement programmes, peut-être test nucléaire.',
    horizon_long:'5-10 ans : Corée du Nord pleinement nucléarisée et reconnue de fait, échec définitif de la non-prolifération.'
  },

  c_syr:{
    en_une_phrase:'Le régime Assad est tombé en décembre 2024 face à HTS (anciens jihadistes ayant pivoté), ouvrant une transition fragile sous surveillance israélienne, turque, américaine et russe — première chute d\'un régime arabe baasiste après 60 ans.',
    pourquoi_important:'La Syrie était le pilier oriental de l\'arc chiite iranien et de la projection russe en Méditerranée (base Tartous). Sa chute reconfigure tout le Levant : Iran isolé, Russie affaiblie, Hezbollah privé de corridor logistique, Turquie en position de force. Mais HTS reste suspect (passé jihadiste), la question kurde non résolue, Israël a détruit 80% des capacités militaires syriennes en 48h post-Assad.',
    qui_contre_qui:[
      {a:'HTS / al-Charaa (Joulani)',position:'gouvernement de transition, légitimité fragile'},
      {a:'SDF / Forces démocratiques syriennes',position:'kurdes, soutenus par USA, menacés par Turquie'},
      {a:'Turquie',position:'veut écraser SDF/PKK, soutient l\'opposition syrienne (SNA)'},
      {a:'Israël',position:'a frappé massivement les arsenaux post-Assad, occupation Golan élargie'},
      {a:'Russie',position:'maintient Hmeimim et Tartous mais influence réduite'}
    ],
    enjeu_central:'La transition syrienne peut reconstruire un État viable (rare) ou se fragmenter en libanisation (probable). La gestion de la question kurde et le retour des réfugiés sont les vraies épreuves.',
    surveiller:[
      'Les négociations HTS-SDF sur l\'avenir des Kurdes.',
      'La levée ou non des sanctions occidentales sur le nouveau régime.',
      'Le retour des réfugiés syriens depuis Turquie/Liban (~6 millions).'
    ],
    analogie:'Imaginez une maison (Syrie) occupée 24 ans par un dictateur. Quand il s\'enfuit, ce sont d\'anciens cambrioleurs reconvertis en gardiens (HTS) qui prennent la relève. Les voisins surveillent, certains les soutiennent, d\'autres frappent les serrures préventivement (Israël).',
    horizon_proche:'6-12 mois : stabilisation fragile ou fragmentation. Décision cruciale sur Kurdes.',
    horizon_long:'5-10 ans : soit reconstruction d\'un État laïque modéré, soit libanisation et zones d\'influence multiples.'
  }
};

/* Merger : ajoute analyse_simple à chaque conflit */
(function mergeAnalysesSimples(){
  if(!window.GW_DATA) return;
  Object.keys(ANALYSES_SIMPLES).forEach(cid=>{
    const idx = window.GW_DATA.CONFLITS.findIndex(c=>c.id===cid);
    if(idx>=0) window.GW_DATA.CONFLITS[idx].analyse_simple = ANALYSES_SIMPLES[cid];
  });
})();
