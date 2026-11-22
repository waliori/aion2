// Languages. English is the source: every text in the page and the scripts is an English key, and FR maps it to French.
// Stat names are the game's own French terms, read from the official API (lang=fr-FR).
// `node i18n.js` checks that every text the page can show has a French entry.
const FR = {
  // --- stats (official French client terms) ---
  'PvE Attack': 'ATQ JcE', 'Boss Attack': 'ATQ contre les boss', 'PvE Defense': 'DÉF JcE', 'Boss Defense': 'DÉF contre les boss',
  'PvE Accuracy': 'Précision JcE', 'PvE Evasion': 'Esquive JcE', 'PvE Damage Boost': 'Boost de DGT JcE', 'Boss Damage Boost': 'Boost de DGT boss',
  'PvE Damage Tolerance': 'Tolérance aux DGT JcE', 'Boss Damage Tolerance': 'Tolérance aux DGT boss',
  'Critical Hit': 'CRIT', 'Critical Hit Resist': 'RÉS aux CRIT', HP: 'PV', MP: 'PM', Start: 'Départ', Attack: 'ATQ',

  // --- page head and settings ---
  'Ariel board route planner': 'Planificateur du plateau d’Ariel',
  'Ariel board route planner.': 'Planificateur du plateau d’Ariel.',
  'Plan the best route through the AION 2 Ariel Daevanion board for the crystals you have, see the numbers behind it, and compare boards side by side.':
    'Trouvez le meilleur chemin sur le plateau Daevanion d’Ariel d’AION 2 avec vos cristaux, voyez les calculs derrière, et comparez deux plateaux côte à côte.',
  'Turquoise is what to buy, in order. Red is what you own.': 'En turquoise : ce qu’il faut acheter, dans l’ordre. En rouge : ce que vous possédez.',
  Language: 'Langue', Settings: 'Réglages', 'Your character': 'Votre personnage', Region: 'Région', 'Character name': 'Nom du personnage', Load: 'Charger',
  'Crystals to spend': 'Cristaux à dépenser', Goal: 'Objectif', Damage: 'Dégâts', Survival: 'Survie', Both: 'Les deux', Against: 'Contre',
  Board: 'Plateau', 'Ariel Daevanion board': 'Plateau Daevanion d’Ariel',
  'Click a node you already bought to mark it as owned.': 'Cliquez sur un nœud déjà acheté pour le marquer comme possédé.',
  'Buy this': 'À acheter', 'Already owned': 'Déjà possédé', 'One tick per crystal of cost': 'Un point par cristal de coût',
  Views: 'Vues', Plan: 'Plan', Why: 'Pourquoi', Compare: 'Comparer', 'My stats': 'Mes stats',

  // --- Plan tab ---
  'What this plan adds.': 'Ce que ce plan apporte.', 'Damage dealt': 'Dégâts infligés', 'Effective HP': 'PV effectifs', 'Crystals spent': 'Cristaux dépensés',
  'Your board now.': 'Votre plateau actuel.', 'Crystals in it': 'Cristaux investis', 'Clear owned nodes': 'Effacer les nœuds possédés',
  'Buy order.': 'Ordre d’achat.', Step: 'Étape', Node: 'Nœud', Column: 'Colonne', Row: 'Ligne', Cost: 'Coût', Total: 'Total',
  'Damage so far': 'Dégâts cumulés', 'Eff. HP so far': 'PV eff. cumulés',
  '{n} crystal': '{n} cristal', '{n} crystals': '{n} cristaux', '{n} node': '{n} nœud', '{n} nodes': '{n} nœuds',
  '{a} of {b}': '{a} sur {b}', 'You gain: {list}.': 'Vous gagnez : {list}.',
  'Nothing left on the board is worth buying for this goal.': 'Il ne reste rien d’utile à acheter sur le plateau pour cet objectif.',
  'Enter how many crystals you have.': 'Indiquez combien de cristaux vous avez.',
  '{nodes} owned, compared with an empty board: {list}. The plan keeps them and adds {crystals} on top.':
    '{nodes} possédé(s), par rapport à un plateau vide : {list}. Le plan les garde et ajoute {crystals} par-dessus.',
  'No owned nodes yet. Load your character, or click the nodes you have bought.': 'Aucun nœud possédé pour l’instant. Chargez votre personnage, ou cliquez sur les nœuds que vous avez achetés.',
  'Clear owned nodes and get {crystals} back': 'Effacer les nœuds possédés et récupérer {crystals}',
  'Mark a node next to one you own first.': 'Marquez d’abord un nœud voisin d’un nœud possédé.',
  'Unmark the nodes further out first.': 'Démarquez d’abord les nœuds plus éloignés.',
  ', owned': ', possédé', ', buy as step {s}': ', à acheter à l’étape {s}',
  'Nothing to show yet.': 'Rien à afficher pour l’instant.',

  // --- Why tab ---
  'One average hit.': 'Un coup moyen.', 'Empty board': 'Plateau vide', 'Your board now': 'Votre plateau actuel', 'After this plan': 'Après ce plan',
  'A 100% skill, selected encounter': 'Compétence à 100 %, combat choisi',
  '{crit} crit, {blocked} blocked': '{crit} de crit., {blocked} bloqués',
  'Normal hit': 'Coup normal', 'Critical hit': 'Coup critique',
  'Damage Boost, after the boss’s Tolerance': 'Boost de DGT, après la Tolérance du boss',
  'Damage gained from the board': 'Dégâts gagnés grâce au plateau', 'Survivability gained from the board': 'Survie gagnée grâce au plateau',
  'What a crystal buys.': 'Ce qu’achète un cristal.',
  'One node of each kind on top of what you own, against the selected encounter, sorted by worth per crystal for your goal.':
    'Un nœud de chaque type en plus de ce que vous possédez, contre le combat choisi, trié par valeur par cristal pour votre objectif.',
  'Eff. HP': 'PV eff.', 'Per crystal': 'Par cristal', ' or ': ' ou ',
  '{n} Attack': '{n} d’ATQ', '{n} Attack after Defense': '{n} d’ATQ après la DÉF',
  '{v} ÷ {bucket} (100 + your Damage Boost − boss Tolerance)': '{v} ÷ {bucket} (100 + votre Boost de DGT − Tolérance du boss)',
  '{v} ÷ {bucket} (the boss’s bucket)': '{v} ÷ {bucket} (le multiplicateur du boss)',
  'You are at the crit cap here': 'Vous êtes au plafond de critique ici',
  '10 points add {x}% crit chance': '10 points ajoutent {x}% de chance de critique',
  'Still under {n} Critical Hit, where crits start here': 'Encore sous {n} de CRIT, seuil où les critiques commencent ici',
  'This encounter does not block you': 'Ce combat ne vous bloque pas', 'You are never blocked here': 'Vous n’êtes jamais bloqué ici',
  '5 points block {x}% fewer hits': '5 points font bloquer {x}% de coups en moins',
  '3 damage off a {n} hit': '3 dégâts en moins sur un coup de {n}',
  '100 ÷ {n} HP': '100 ÷ {n} PV', 'No effect on damage or survival': 'Aucun effet sur les dégâts ni la survie', 'Bosses do not crit': 'Les boss ne font pas de critiques',
  '5 points avoid {x}% of hits': '5 points évitent {x}% des coups', 'Not counted: no reliable data': 'Non compté : pas de données fiables',
  'Other ways to spend them.': 'D’autres façons de les dépenser.',
  'Each row is measured against an empty board, so they compare directly.': 'Chaque ligne est mesurée par rapport à un plateau vide : elles se comparent directement.',
  Way: 'Méthode', Crystals: 'Cristaux', 'For your goal': 'Pour votre objectif', 'This plan': 'Ce plan',
  'Always buy the best neighbouring node': 'Toujours acheter le meilleur nœud voisin', 'Walk straight to the most valuable nodes': 'Aller tout droit vers les nœuds les plus rentables',
  'Clear the board and re-plan all {crystals}': 'Effacer le plateau et tout replanifier avec {crystals}',
  'There is nothing to buy yet, so the three boards below are the same.': 'Il n’y a encore rien à acheter : les trois plateaux ci-dessous sont identiques.',
  'Planned for: {name}. Every figure on this tab is computed from your stats.': 'Planifié pour : {name}. Tous les chiffres de cet onglet sont calculés à partir de vos stats.',
  'Clearing your board and re-planning everything would do better than adding to it: see Other ways to spend them.':
    'Effacer votre plateau et tout replanifier ferait mieux que d’y ajouter des nœuds : voir « D’autres façons de les dépenser ».',
  'Against each encounter.': 'Contre chaque combat.',
  'The same route everywhere. Critical Hit and Accuracy figures are measured by players on Global (Aion 2 Maps, November 2026); boss Damage Tolerance and crit damage resist are the same guesses on every row.':
    'Le même chemin partout. Les seuils de CRIT et de Précision sont mesurés par des joueurs sur le serveur Global (Aion 2 Maps, novembre 2026) ; la Tolérance aux DGT et la résistance aux dégâts critiques des boss sont les mêmes estimations sur chaque ligne.',
  Encounter: 'Combat', 'Crit after': 'Crit. après', 'Blocked after': 'Bloqués après', 'Hit now': 'Coup actuel', 'Hit after': 'Coup après', Gain: 'Gain',
  '(planned for)': '(planifié pour)',

  // --- encounters ---
  'Open world and normal dungeons': 'Monde ouvert et donjons normaux',
  'Transcendence tier 4': 'Transcendance palier 4', 'Conquest hard, mid-bosses': 'Conquête difficile, boss intermédiaires', 'Conquest hard, final bosses': 'Conquête difficile, boss finaux',
  'Fire Temple hard': 'Temple du feu difficile', 'Ferocious Horn Den hard': 'Antre de la Corne féroce difficile',
  'Ludra hard, mid-bosses': 'Ludra difficile, boss intermédiaires', 'Eternal Ludra, normal and hard': 'Ludra éternel, normal et difficile',
  'Custom encounter': 'Combat personnalisé', 'Your own boss, set under My stats.': 'Votre propre boss, à régler dans Mes stats.',
  'Bosses here do not block you. No Critical Hit figure is measured, so crit chance is estimated from your rating.':
    'Ici les boss ne vous bloquent pas. Aucun seuil de CRIT n’est mesuré : la chance de critique est estimée à partir de votre CRIT.',
  'Crit cap at about 1,420 Critical Hit. Parries stop between 800 and 1,075 Accuracy depending on the boss; the plan uses 1,075.':
    'Plafond de critique vers 1 420 de CRIT. Les parades cessent entre 800 et 1 075 de Précision selon le boss ; le plan utilise 1 075.',
  'Crit cap at 1,405 to 1,425 Critical Hit. Parries stop between 800 and 1,000 Accuracy; the plan uses 1,000.':
    'Plafond de critique entre 1 405 et 1 425 de CRIT. Les parades cessent entre 800 et 1 000 de Précision ; le plan utilise 1 000.',
  'Crit cap at 1,525 to 1,555 Critical Hit. Parries stop at about 925 Accuracy, 1,075 on Transcendent Bakarma; the plan uses 1,075.':
    'Plafond de critique entre 1 525 et 1 555 de CRIT. Les parades cessent vers 925 de Précision, 1 075 sur Bakarma transcendant ; le plan utilise 1 075.',
  'Crit cap at 1,590 to 1,610 Critical Hit. Parries stop between 800 and 1,050 Accuracy; the plan uses 1,050.':
    'Plafond de critique entre 1 590 et 1 610 de CRIT. Les parades cessent entre 800 et 1 050 de Précision ; le plan utilise 1 050.',
  'Crit cap at 1,590 to 1,610 Critical Hit. Parries stop between 800 and 1,125 Accuracy; the plan uses 1,125.':
    'Plafond de critique entre 1 590 et 1 610 de CRIT. Les parades cessent entre 800 et 1 125 de Précision ; le plan utilise 1 125.',
  'Crit cap at 1,615 to 1,650 Critical Hit. These bosses almost never parry.': 'Plafond de critique entre 1 615 et 1 650 de CRIT. Ces boss ne parent presque jamais.',
  'Crit cap at 1,750 to 1,850 Critical Hit. Parries stop at about 1,100 Accuracy, rarely up to 1,180; the plan uses 1,180.':
    'Plafond de critique entre 1 750 et 1 850 de CRIT. Les parades cessent vers 1 100 de Précision, rarement jusqu’à 1 180 ; le plan utilise 1 180.',

  // --- Compare tab ---
  'Side by side.': 'Côte à côte.', 'Both boards are valued with your stats, against the selected encounter.': 'Les deux plateaux sont évalués avec vos stats, contre le combat choisi.',
  'Left board': 'Plateau de gauche', 'Right board': 'Plateau de droite', 'On both': 'Sur les deux', 'Only on A': 'Seulement sur A', 'Only on B': 'Seulement sur B',
  'Only on: {name}': 'Seulement sur : {name}',
  'My board now': 'Mon plateau actuel', 'Another plan': 'Un autre plan', 'Another player': 'Un autre joueur',
  'Another plan.': 'Un autre plan.', 'A second plan from your owned nodes, with its own settings.': 'Un second plan à partir de vos nœuds possédés, avec ses propres réglages.',
  'Another player.': 'Un autre joueur.', Find: 'Chercher', 'The difference.': 'La différence.', Measure: 'Mesure', A: 'A', B: 'B', Difference: 'Différence',
  'Plan: {crystals}, {goal}': 'Plan : {crystals}, {goal}', '(left)': '(gauche)', '(right)': '(droite)',
  'The difference is “{b}” compared with “{a}”: a plus means “{b}” has more. Green is where “{a}” is ahead, red is where “{b}” is.':
    'La différence compare « {b} » à « {a} » : un plus signifie que « {b} » en a davantage. En vert, « {a} » est devant ; en rouge, c’est « {b} ».',
  Nodes: 'Nœuds', 'Crystals in the board': 'Cristaux dans le plateau', 'Average hit': 'Coup moyen', 'Crit chance': 'Chance de critique', 'Hits blocked': 'Coups bloqués',

  // --- My stats tab ---
  'Your stats.': 'Vos stats.',
  'Without any Ariel nodes. The best route depends on these: 1.5% Damage Boost is worth more at 50% than at 200%.':
    'Sans aucun nœud d’Ariel. Le meilleur chemin en dépend : 1,5 % de Boost de DGT vaut plus à 50 % qu’à 200 %.',
  'Reset stats to defaults': 'Remettre les stats par défaut',
  'Custom encounter.': 'Combat personnalisé.',
  'Your own boss. Pick “Custom encounter” under Against to plan for it; these numbers then replace the boss guesses above.':
    'Votre propre boss. Choisissez « Combat personnalisé » dans Contre pour planifier contre lui ; ces chiffres remplacent alors les estimations de boss ci-dessus.',
  'Attack, total (after weapon boost and attack increase)': 'ATQ totale (après boost d’arme et augmentation de l’ATQ)',
  'Damage Boost % (generic + PvE + Boss)': 'Boost de DGT % (général + JcE + boss)',
  'Accuracy (PvE Accuracy included)': 'Précision (Précision JcE comprise)',
  'Critical Damage Boost %': 'Boost de DGT CRIT %',
  'Damage Tolerance % (generic + PvE + Boss)': 'Tolérance aux DGT % (générale + JcE + boss)',
  'Not shown in game. These are community figures and guesses; the last four mostly move the Survival route.':
    'Non affiché en jeu. Ce sont des chiffres de la communauté et des estimations ; les quatre derniers influencent surtout le chemin Survie.',
  'Crit chance cap %': 'Plafond de chance de critique %',
  'Crit chance % per Critical Hit point, unmeasured encounters': 'Chance de critique % par point de CRIT, combats non mesurés',
  'Blocked chance % per Accuracy point short': 'Chance d’être bloqué % par point de Précision manquant',
  'Damage lost on a blocked hit %': 'Dégâts perdus sur un coup bloqué %',
  'Boss crit damage resist %': 'Résistance du boss aux dégâts critiques %',
  'Boss Damage Tolerance %': 'Tolérance aux DGT du boss %', 'Boss hit size before your Defense': 'Coup du boss avant votre DÉF',
  'Boss Damage Boost %': 'Boost de DGT du boss %',
  'Damage avoided % per Evasion point (0 = ignore)': 'Dégâts évités % par point d’Esquive (0 = ignorer)',
  'Accuracy where parries stop (0 = never blocked)': 'Précision à laquelle les parades cessent (0 = jamais bloqué)',
  'Critical Hit that reaches the crit cap (0 = not known)': 'CRIT qui atteint le plafond de critique (0 = inconnu)',

  // --- how it is calculated ---
  'How it is calculated.': 'Comment c’est calculé.',
  'NCsoft has not published a formula. This is the community-tested one.': 'NCsoft n’a pas publié de formule. Voici celle testée par la communauté.',
  'With your numbers.': 'Avec vos chiffres.', Working: 'Calcul', Result: 'Résultat',
  'Against: {name}, with the board as it would be after this plan.': 'Contre : {name}, avec le plateau tel qu’il serait après ce plan.',
  'Your Attack': 'Votre ATQ',
  '(({weapon} weapon + {lines} Attack lines) × {wb} Weapon Boost + {bonus} Attack Bonus) × {inc} Attack Increase + {flat} PvE and Boss Attack':
    '(({weapon} arme + {lines} lignes d’ATQ) × {wb} Boost d’arme + {bonus} ATQ supplémentaire) × {inc} Augmentation de l’ATQ + {flat} ATQ JcE et contre les boss',
  'The Attack you entered under Your stats': 'L’ATQ que vous avez saisie dans Vos stats',
  'Attack with the board': 'ATQ avec le plateau',
  '{a} + {pve} PvE Attack + {boss} Boss Attack from nodes': '{a} + {pve} ATQ JcE + {boss} ATQ contre les boss venant des nœuds',
  'After the boss’s Defense': 'Après la DÉF du boss', '{a} × 100% skill − {def} Defense × {k}': '{a} × compétence à 100 % − {def} de DÉF × {k}',
  'Damage Boost multiplier': 'Multiplicateur de Boost de DGT',
  '1 + {yours} yours + {nodes} from nodes − {tol} boss Tolerance': '1 + {yours} à vous + {nodes} des nœuds − {tol} de Tolérance du boss',
  '{n} × ({base} + {cdb} Critical Damage Boost − {res} boss resist)': '{n} × ({base} + {cdb} de Boost de DGT CRIT − {res} de résistance du boss)',
  '{cap} cap − ({need} needed − {have} Critical Hit) × {k}, kept between 0 and the cap': 'plafond de {cap} − ({need} requis − {have} de CRIT) × {k}, borné entre 0 et le plafond',
  '{have} Critical Hit × {k}%, up to the {cap} cap': '{have} de CRIT × {k}%, jusqu’au plafond de {cap}',
  '({need} needed − {have} Accuracy) × {k}%, never below 0': '({need} requis − {have} de Précision) × {k}%, jamais sous 0',
  '({n} + {p} × ({c} − {n})) × (1 − {b} × {loss} lost per block)': '({n} + {p} × ({c} − {n})) × (1 − {b} × {loss} perdus par blocage)',
  'The same hit on your board now': 'Le même coup sur votre plateau actuel', 'Same steps, with the nodes you own': 'Mêmes étapes, avec les nœuds que vous possédez',
  'The same hit on an empty board': 'Le même coup sur un plateau vide', 'Same steps, with no nodes': 'Mêmes étapes, sans aucun nœud',
  'This is one hit of a skill that does 100% of your Attack. For a 250% skill, multiply the Attack line by 2.5 before the boss’s Defense comes off. Double hits and front or back bonuses multiply on top; they are not on this board, so they are left at 1.':
    'Il s’agit d’un coup d’une compétence qui inflige 100 % de votre ATQ. Pour une compétence à 250 %, multipliez la ligne d’ATQ par 2,5 avant de retirer la DÉF du boss. Les coups doubles et les bonus de face ou de dos se multiplient par-dessus ; ils ne sont pas sur ce plateau et restent donc à 1.',
  'PvE and Boss Attack are added after Attack Increase, so each point is worth 1 ÷ your Attack.':
    'L’ATQ JcE et l’ATQ contre les boss s’ajoutent après l’Augmentation de l’ATQ : chaque point vaut donc 1 ÷ votre ATQ.',
  'All Damage Boost types add into one bucket. +1.5% on a bucket of 180% is 1.5 ÷ 180 = +0.83% damage. The more you have, the less each node gives.':
    'Tous les Boosts de DGT s’additionnent dans un seul multiplicateur. +1,5 % sur un total de 180 %, c’est 1,5 ÷ 180 = +0,83 % de dégâts. Plus vous en avez, moins chaque nœud rapporte.',
  'Damage Tolerance takes away from the boss’s bucket in the same way.': 'La Tolérance aux DGT se soustrait de la même façon au multiplicateur du boss.',
  'Defense removes a flat 0.1 × Defense from every hit.': 'La DÉF retire une valeur fixe de 0,1 × DÉF à chaque coup.',
  'Critical Hit: where an encounter has a measured figure, every 100 points short of it costs 10% crit chance, down from the 50% cap. A crit does 1.5× plus your Critical Damage Boost, minus the boss’s resist. At the cap, crit nodes are worth nothing.':
    'CRIT : quand un combat a un seuil mesuré, chaque tranche de 100 points manquants coûte 10 % de chance de critique, à partir du plafond de 50 %. Un critique inflige 1,5× plus votre Boost de DGT CRIT, moins la résistance du boss. Au plafond, les nœuds de CRIT ne valent rien.',
  'Accuracy: every 100 points short of the encounter’s figure gets about 10% of your hits blocked, and a blocked hit loses about half its damage.':
    'Précision : chaque tranche de 100 points sous le seuil du combat fait bloquer environ 10 % de vos coups, et un coup bloqué perd environ la moitié de ses dégâts.',
  'HP adds HP ÷ your HP. Critical Hit Resist and MP are worth nothing against bosses, because bosses do not crit.':
    'Les PV ajoutent PV ÷ vos PV. La RÉS aux CRIT et les PM ne valent rien contre les boss, car les boss ne font pas de critiques.',
  'Evasion counts for nothing unless you give it a value above.': 'L’Esquive ne compte pas, sauf si vous lui donnez une valeur ci-dessus.',
  'Effective HP is how much raw boss damage you survive: HP ÷ damage taken.': 'Les PV effectifs, c’est la quantité de dégâts bruts de boss à laquelle vous survivez : PV ÷ dégâts subis.',

  // --- loading characters ---
  Europe: 'Europe', 'North America East': 'Amérique du Nord Est', 'North America West': 'Amérique du Nord Ouest', 'South America': 'Amérique du Sud', Asia: 'Asie',
  'To load a character, run “docker compose up -d” in this folder and open http://localhost:8787. Everything else works without it.':
    'Pour charger un personnage, lancez « docker compose up -d » dans ce dossier et ouvrez http://localhost:8787. Tout le reste fonctionne sans cela.',
  'Searching…': 'Recherche…', 'Pick the character.': 'Choisissez le personnage.', 'No character with that name in this region.': 'Aucun personnage de ce nom dans cette région.',
  '{name}, {server}, level {level}': '{name}, {server}, niveau {level}',
  'Reading character…': 'Lecture du personnage…', 'Reading gear {a} of {b}…': 'Lecture de l’équipement {a} sur {b}…', 'Reading Daevanion boards…': 'Lecture des plateaux Daevanion…',
  'Reading their Ariel board…': 'Lecture de son plateau d’Ariel…',
  'The AION 2 site is rate-limiting requests. Wait a minute and try again.': 'Le site d’AION 2 limite les requêtes. Attendez une minute et réessayez.',
  'The AION 2 site answered {code}.': 'Le site d’AION 2 a répondu {code}.',
  'This character has no weapon equipped, so there is nothing to calculate from.': 'Ce personnage n’a pas d’arme équipée : il n’y a rien à calculer.',
  '{n} Ariel node': '{n} nœud d’Ariel', '{n} Ariel nodes': '{n} nœuds d’Ariel',
  '{name}: {n} Ariel node open.': '{name} : {n} nœud d’Ariel ouvert.', '{name}: {n} Ariel nodes open.': '{name} : {n} nœuds d’Ariel ouverts.',
  'Loaded {name}: Attack {attack}, Damage Boost {boost}%, Critical Hit {crit}, Accuracy {acc}, Damage Tolerance {tol}%, Critical Damage Boost {cdb}%. {nodes} marked as owned. Added up from gear, titles and boards; pets, wings, skill passives and base stats are not in the data, and HP is not available. Check them under My stats.':
    '{name} chargé : ATQ {attack}, Boost de DGT {boost}%, CRIT {crit}, Précision {acc}, Tolérance aux DGT {tol}%, Boost de DGT CRIT {cdb}%. {nodes} marqué(s) comme possédé(s). Calculé à partir de l’équipement, des titres et des plateaux ; les familiers, les ailes, les passifs de compétence et les stats de base ne sont pas dans les données, et les PV ne sont pas disponibles. Vérifiez-les dans Mes stats.',
};

const LANG = (() => {
  if (typeof localStorage === 'undefined') return 'en';
  try { const s = localStorage.getItem('ariel-lang'); if (s === 'fr' || s === 'en') return s; } catch (e) {}
  return (navigator.language || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';  // first visit: follow the browser
})();
const LOCALE = LANG === 'fr' ? 'fr-FR' : 'en-US';

// T('{n} crystals', { n: 3 }) -> the text in the page's language, with the {placeholders} filled in
function T(key, vars) {
  let s = (LANG === 'fr' && FR[key]) || key;
  if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
}
const dec = v => (LANG === 'fr' ? String(v).replace('.', ',') : String(v));  // decimal comma in French

// translate the static text of the page in place: text nodes, placeholders, labels for assistive tech, the title
function translatePage(doc) {
  doc.documentElement.lang = LANG;
  if (LANG !== 'fr') return;
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT), nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const n of nodes) {
    if (n.parentElement.closest('script, style, pre, [data-lang]')) continue;  // the language buttons keep their own names
    const key = n.nodeValue.replace(/\s+/g, ' ').trim();
    if (FR[key]) n.nodeValue = n.nodeValue.replace(n.nodeValue.trim(), FR[key]);
  }
  for (const e of doc.querySelectorAll('[placeholder], [aria-label]')) for (const a of ['placeholder', 'aria-label']) {
    const v = e.getAttribute(a);
    if (v && FR[v]) e.setAttribute(a, FR[v]);
  }
  doc.title = T(doc.title);
  const meta = doc.querySelector('meta[name="description"]');
  if (meta) meta.content = T(meta.content);
}

// node i18n.js: every text the page can show must have a French entry
if (typeof module !== 'undefined' && require.main === module) {
  const fs = require('fs'), path = require('path'), read = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
  const html = read('index.html'), cut = html.indexOf('<script>'), keys = new Set();
  const unescape = s => s.replace(/\\'/g, "'");
  // texts between tags, and the attributes shown or read aloud
  const body = html.slice(html.indexOf('<body'), cut).replace(/<pre>[\s\S]*?<\/pre>/g, '').replace(/<button[^>]*data-lang[\s\S]*?<\/button>/g, '');
  for (const m of body.matchAll(/>([^<>]+)</g)) { const t = m[1].replace(/\s+/g, ' ').trim(); if (t && !/^[0-9%+.]*$/.test(t)) keys.add(t); }
  for (const m of body.matchAll(/(?:placeholder|aria-label)="([^"]+)"/g)) keys.add(m[1]);
  for (const m of html.matchAll(/<title>([^<]+)<|name="description" content="([^"]+)"/g)) keys.add(m[1] || m[2]);
  // T('...') calls, including both branches of T(cond ? '...' : '...'), and the label tables
  const script = html.slice(cut);
  for (const m of script.matchAll(/T\((?:[^'()]*\?\s*)?'((?:[^'\\]|\\.)*)'(?:\s*:\s*'((?:[^'\\]|\\.)*)')?/g)) { keys.add(unescape(m[1])); if (m[2]) keys.add(unescape(m[2])); }
  for (const name of ['FIELDS', 'CUSTOM_FIELDS']) for (const m of script.slice(script.indexOf('const ' + name), script.indexOf('];', script.indexOf('const ' + name))).matchAll(/, '((?:[^'\\]|\\.)*)'\]/g)) keys.add(unescape(m[1]));
  for (const name of ['SIDES', 'GOAL_NAMES']) for (const m of script.slice(script.indexOf('const ' + name), script.indexOf('};', script.indexOf('const ' + name))).matchAll(/: '([^']*)'/g)) keys.add(m[1]);
  // stat names, encounters, comparison strategies, regions and messages from the other scripts
  const P = require('./planner.js'), C = require('./character.js');
  for (const n of P.NODES) keys.add(n.stat);
  for (const t of P.TARGETS) { keys.add(t.name); keys.add(t.note); }
  for (const b of P.baselines(1, P.DEFAULT_BUILD, 'dps', [], P.TARGETS[0])) keys.add(b.name);
  for (const r of Object.values(C.REGIONS)) keys.add(r);
  for (const m of read('character.js').matchAll(/(?:onProgress|new Error)\(['`]([^'`$]+)['`]\)/g)) keys.add(m[1]);
  const missing = [...keys].filter(k => !(k in FR));
  if (missing.length) { console.error('No French for:\n' + missing.map(k => '  ' + JSON.stringify(k)).join('\n')); process.exit(1); }
  console.log(`i18n ok: ${keys.size} texts have French`);
}
