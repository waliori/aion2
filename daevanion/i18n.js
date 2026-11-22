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

  'Node types': 'Types de nœuds', Offensive: 'Offensif', Defensive: 'Défensif', Resources: 'Ressources', '{name}: {nodes}': '{name} : {nodes}',
  'Click a type or a family beside the board to colour its nodes': 'Cliquez sur un type ou une famille à côté du plateau pour colorer ses nœuds',
  // --- planning by hand ---
  'A click on the board': 'Un clic sur le plateau', 'Marks what I own': 'Marque ce que je possède', 'Builds my own plan': 'Construit mon propre plan',
  'My own plan': 'Mon propre plan', 'Compare with the recommended plan': 'Comparer avec le plan recommandé', 'Clear my plan': 'Effacer mon plan',
  ', in my plan': ', dans mon plan',
  'Click a node to add it to your plan, or to take it out.': 'Cliquez sur un nœud pour l’ajouter à votre plan, ou pour l’en retirer.', 'Start from my board': 'Partir de mon plateau', 'Start from the recommended plan': 'Partir du plan recommandé',
  'Your plan is empty. Click any node and the cheapest path to it is added; click a planned node to take it out, with whatever hangs from it. The recommended route is hidden while you plan.':
    'Votre plan est vide. Cliquez sur n’importe quel nœud : le chemin le moins cher jusqu’à lui est ajouté ; cliquez sur un nœud planifié pour le retirer, avec tout ce qui en dépend. Le chemin recommandé est masqué pendant que vous planifiez.',
  'Your own plan: {nodes} for {spent}. Damage gained from the board {d}, survivability {e}.': 'Votre propre plan : {nodes} pour {spent}. Dégâts gagnés grâce au plateau {d}, survie {e}.',
  'You have {have}: {board} in your board and {spend} to spend.': 'Vous avez {have} : {board} dans votre plateau et {spend} à dépenser.',
  'That is {n} more than you have.': 'C’est {n} de plus que ce que vous avez.',
  '{name}: {nodes}, +{total} in total': '{name} : {nodes}, +{total} au total',

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

  // the formula block (a <pre>: matched on its whole text)
  "damage = ( [ ((Attack × Weapon Boost) + Attack Bonus) × Attack Increase\n             + PvE Attack + Boss Attack ] × skill coefficient\n           + skill flat damage − target Defense × 0.1 )\n       × (1 + Damage Boost + PvE Boost + Boss Boost − target Tolerance)\n       × crit × double × front/back":
    "dégâts = ( [ ((ATQ × Boost d’arme) + ATQ supplémentaire) × Augmentation de l’ATQ\n             + ATQ JcE + ATQ contre les boss ] × coefficient de compétence\n           + dégâts fixes de compétence − DÉF de la cible × 0,1 )\n       × (1 + Boost de DGT + Boost JcE + Boost boss − Tolérance de la cible)\n       × critique × double × face/dos",

  // --- loading characters ---
  Server: 'Serveur', Faction: 'Faction', 'All servers': 'Tous les serveurs', 'Both factions': 'Les deux factions', Elyos: 'Élyséens', Asmodians: 'Asmodiens',
  'No character with that name here. Try fewer filters.': 'Aucun personnage de ce nom ici. Essayez avec moins de filtres.',
  '{name}, {server}, {faction}, level {level}': '{name}, {server}, {faction}, niveau {level}',
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

// --- the Azphel (PvP) board, and what changed when the planner learned a second board ---
Object.assign(FR, {
  // stats (official French client terms, read from the API)
  'PvP Attack': 'ATQ JcJ', 'PvP Defense': 'DÉF JcJ', 'PvP Accuracy': 'Précision JcJ', 'PvP Evasion': 'Esquive JcJ', 'PvP Damage Boost': 'Boost de DGT JcJ',
  'PvP Damage Tolerance': 'Tolérance aux DGT JcJ', 'PvP Critical Hit': 'CRIT JcJ', 'PvP Critical Hit Resist': 'RÉS CRIT JcJ',
  'Status Effect Chance': 'Taux altération état', 'Status Effect Resist': 'RÉS aux altérations d’état',
  // page
  'Plan the best route through the AION 2 Daevanion boards, Ariel for PvE and Azphel for PvP, see the numbers behind it, and compare boards side by side.':
    'Trouvez le meilleur chemin sur les plateaux Daevanion d’AION 2, Ariel pour le JcE et Azphel pour le JcJ, voyez les calculs derrière, et comparez deux plateaux côte à côte.',
  'Daevanion board': 'Plateau Daevanion',
  Refresh: 'Actualiser', 'Change character': 'Changer de personnage',
  'Using {name}, {server}, {faction}, level {level}. Loaded {when}.': 'Personnage utilisé : {name}, {server}, {faction}, niveau {level}. Chargé le {when}.',
  'The other board will use this character too, without loading again.': 'L’autre plateau utilisera aussi ce personnage, sans le recharger.',
  'Stats and owned nodes on this board now come from {name}, the character you loaded. Nothing was loaded again.': 'Les stats et les nœuds possédés de ce plateau viennent maintenant de {name}, le personnage que vous avez chargé. Rien n’a été rechargé.', 'Ariel, PvE': 'Ariel, JcE', 'Azphel, PvP': 'Azphel, JcJ',
  'Azphel board route planner': 'Planificateur du plateau d’Azphel', 'Azphel board route planner.': 'Planificateur du plateau d’Azphel.',
  'The PvE board. Turquoise is what to buy, in order. Red is what you own.': 'Le plateau JcE. En turquoise : ce qu’il faut acheter, dans l’ordre. En rouge : ce que vous possédez.',
  'The PvP board. Turquoise is what to buy, in order. Red is what you own.': 'Le plateau JcJ. En turquoise : ce qu’il faut acheter, dans l’ordre. En rouge : ce que vous possédez.',
  'Green-cost nodes give two stats. Click a type or a family beside the board to colour its nodes': 'Les nœuds verts donnent deux stats. Cliquez sur un type ou une famille à côté du plateau pour colorer ses nœuds',
  '{name}: {n} node open on this board.': '{name} : {n} nœud ouvert sur ce plateau.', '{name}: {n} nodes open on this board.': '{name} : {n} nœuds ouverts sur ce plateau.',
  'Reading their board…': 'Lecture de son plateau…',
  // Ariel, changed texts
  'Boss Damage Tolerance %, where none is measured': 'Tolérance aux DGT du boss %, quand aucune n’est mesurée',
  'The same route everywhere. Critical Hit, Accuracy and Damage Tolerance figures are measured by players on Global (Aion 2 Maps, November 2026); where a boss’s Damage Tolerance was not measured, the guess from My stats is used.':
    'Le même chemin partout. Les seuils de CRIT et de Précision et la Tolérance aux DGT sont mesurés par des joueurs sur le serveur Global (Aion 2 Maps, novembre 2026) ; quand la Tolérance d’un boss n’a pas été mesurée, l’estimation de Mes stats est utilisée.',
  'All Damage Boost types add into one bucket, and the boss’s Damage Tolerance comes off it. Against a boss with 68% Tolerance and 25% boost of your own, the bucket is only 57%, so +1.5% is 1.5 ÷ 57 = +2.6% damage. The more Tolerance the boss has, the more each Damage Boost node is worth.':
    'Tous les Boosts de DGT s’additionnent dans un seul multiplicateur, dont on retire la Tolérance aux DGT du boss. Contre un boss à 68 % de Tolérance, avec 25 % de boost à vous, il ne reste que 57 % : +1,5 % donne alors 1,5 ÷ 57 = +2,6 % de dégâts. Plus le boss a de Tolérance, plus chaque nœud de Boost de DGT rapporte.',
  'The green nodes give two stats at once, and both are counted.': 'Les nœuds verts donnent deux stats à la fois, et les deux sont comptées.',
  'Crit cap at about 1,420 Critical Hit. Parries stop between 800 and 1,075 Accuracy depending on the boss; the plan uses 1,075. Boss Damage Tolerance measured at 68%.':
    'Plafond de critique vers 1 420 de CRIT. Les parades cessent entre 800 et 1 075 de Précision selon le boss ; le plan utilise 1 075. Tolérance aux DGT du boss mesurée à 68 %.',
  'Crit cap at 1,405 to 1,425 Critical Hit. Parries stop between 800 and 1,000 Accuracy; the plan uses 1,000. Boss Damage Tolerance measured at 58 to 67%; the plan uses 62%.':
    'Plafond de critique entre 1 405 et 1 425 de CRIT. Les parades cessent entre 800 et 1 000 de Précision ; le plan utilise 1 000. Tolérance aux DGT du boss mesurée entre 58 et 67 % ; le plan utilise 62 %.',
  'Crit cap at 1,525 to 1,555 Critical Hit. Parries stop at about 925 Accuracy, 1,075 on Transcendent Bakarma; the plan uses 1,075. Boss Damage Tolerance measured at 58 to 67%; the plan uses 62%.':
    'Plafond de critique entre 1 525 et 1 555 de CRIT. Les parades cessent vers 925 de Précision, 1 075 sur Bakarma transcendant ; le plan utilise 1 075. Tolérance aux DGT du boss mesurée entre 58 et 67 % ; le plan utilise 62 %.',
  // Azphel: opponents
  'A player with your stats': 'Un joueur avec vos stats',
  'Your opponent has exactly your stats, without your Azphel nodes. A fair default when you have nobody particular in mind.': 'Votre adversaire a exactement vos stats, sans vos nœuds d’Azphel. Un choix neutre quand vous ne visez personne en particulier.',
  'Your opponent.': 'Votre adversaire.', 'Your chosen opponent': 'L’adversaire que vous avez choisi', 'Your chosen opponent: {name}': 'L’adversaire que vous avez choisi : {name}',
  'A player to plan against. Load one from the game, with their own Azphel board, or type the numbers. Pick “Your chosen opponent” under Against to use them.':
    'Un joueur contre qui planifier. Chargez-en un depuis le jeu, avec son propre plateau d’Azphel, ou saisissez les chiffres. Choisissez « L’adversaire que vous avez choisi » dans Contre pour l’utiliser.',
  'The opponent set under My stats, with the numbers shown there.': 'L’adversaire réglé dans Mes stats, avec les chiffres qui y sont affichés.',
  'Copy my own stats': 'Copier mes propres stats',
  '{name} is now your opponent, with their gear, titles and boards added up. Their numbers are below; correct them if you know better.':
    '{name} est maintenant votre adversaire, avec son équipement, ses titres et ses plateaux additionnés. Ses chiffres sont ci-dessous ; corrigez-les si vous en savez plus.',
  'Your opponent now has your own stats.': 'Votre adversaire a maintenant vos propres stats.', 'Your opponent is {name}.': 'Votre adversaire est {name}.',
  'Their Attack': 'Son ATQ', 'Their Damage Boost %': 'Son Boost de DGT %', 'Their Critical Hit': 'Son CRIT', 'Their Accuracy': 'Sa Précision',
  'Their Critical Damage Boost %': 'Son Boost de DGT CRIT %', 'Their Defense': 'Sa DÉF', 'Their Damage Tolerance %': 'Sa Tolérance aux DGT %',
  'Their Critical Hit Resist': 'Sa RÉS aux CRIT', 'Their Evasion': 'Son Esquive', 'Their Block (0 without a shield)': 'Son Blocage (0 sans bouclier)', 'Their Critical Damage Tolerance %': 'Sa Tolérance aux DGT CRIT %',
  // Azphel: your stats
  'Attack, total (after weapon boost and attack increase, PvP Attack included)': 'ATQ totale (après boost d’arme et augmentation de l’ATQ, ATQ JcJ comprise)',
  'Damage Boost % (generic + PvP)': 'Boost de DGT % (général + JcJ)', 'Critical Hit (PvP Critical Hit included)': 'CRIT (CRIT JcJ compris)',
  'Accuracy (PvP Accuracy included, PvE Accuracy left out)': 'Précision (Précision JcJ comprise, Précision JcE exclue)',
  'Defense (PvP Defense included)': 'DÉF (DÉF JcJ comprise)', 'Damage Tolerance % (generic + PvP)': 'Tolérance aux DGT % (générale + JcJ)',
  'Critical Hit Resist (PvP included)': 'RÉS aux CRIT (JcJ comprise)', 'Evasion (PvP Evasion included)': 'Esquive (Esquive JcJ comprise)',
  'Block (0 unless you carry a shield)': 'Blocage (0 sauf si vous portez un bouclier)', 'Critical Damage Tolerance %': 'Tolérance aux DGT CRIT %',
  'How PvP works. These are community figures, the same for you and your opponent.': 'Le fonctionnement du JcJ. Ce sont des chiffres de la communauté, les mêmes pour vous et votre adversaire.',
  'Share of Defense taken off a hit (sources say 0.01, 0.05 or 0.1)': 'Part de la DÉF retirée d’un coup (les sources donnent 0,01, 0,05 ou 0,1)',
  'Crit multiplier before Critical Damage Boost': 'Multiplicateur de critique avant le Boost de DGT CRIT',
  'Crit chance % per point of Critical Hit over their Resist': 'Chance de critique % par point de CRIT au-dessus de sa RÉS',
  'Evade chance % per point of Evasion over the attacker’s Accuracy': 'Chance d’esquive % par point d’Esquive au-dessus de la Précision de l’attaquant',
  'Evade chance cap %': 'Plafond de chance d’esquive %',
  'Block chance % per point of Block over the attacker’s Accuracy': 'Chance de blocage % par point de Blocage au-dessus de la Précision de l’attaquant',
  'What 1% Status Effect Chance is worth to you, as % damage (0 = not counted)': 'Ce que vaut pour vous 1 % de Taux altération état, en % de dégâts (0 = non compté)',
  'What 1% Status Effect Resist is worth to you, as % survival (0 = not counted)': 'Ce que vaut pour vous 1 % de RÉS aux altérations d’état, en % de survie (0 = non compté)',
  'Without any Azphel nodes. Only what counts against players is here: PvE and Boss stats do nothing in PvP.': 'Sans aucun nœud d’Azphel. Seul ce qui compte contre des joueurs figure ici : les stats JcE et contre les boss ne servent à rien en JcJ.',
  'Loaded {name}: Attack {attack}, Damage Boost {boost}%, Critical Hit {crit}, Accuracy {acc}, Defense {def}, Damage Tolerance {tol}%, Critical Hit Resist {res}, Evasion {eva}, Block {block}. {nodes} marked as owned. Added up from gear, titles and boards; pets, wings, skill passives and base stats are not in the data, and HP is not available. Check them under My stats.':
    '{name} chargé : ATQ {attack}, Boost de DGT {boost}%, CRIT {crit}, Précision {acc}, DÉF {def}, Tolérance aux DGT {tol}%, RÉS aux CRIT {res}, Esquive {eva}, Blocage {block}. {nodes} marqué(s) comme possédé(s). Calculé à partir de l’équipement, des titres et des plateaux ; les familiers, les ailes, les passifs de compétence et les stats de base ne sont pas dans les données, et les PV ne sont pas disponibles. Vérifiez-les dans Mes stats.',
  // Azphel: tables
  '{crit} crit, {blocked} evaded': '{crit} de crit., {blocked} esquivés', 'Hits evaded': 'Coups esquivés', 'Evaded after': 'Esquivés après',
  'Damage Boost, after their Tolerance': 'Boost de DGT, après sa Tolérance', 'A 100% skill, selected opponent': 'Compétence à 100 %, adversaire choisi',
  'Against each opponent.': 'Contre chaque adversaire.', Opponent: 'Adversaire',
  'The same route against each opponent. An opponent is a set of player stats: your own, or the one you chose under My stats.': 'Le même chemin contre chaque adversaire. Un adversaire, c’est un jeu de stats de joueur : les vôtres, ou celui que vous avez choisi dans Mes stats.',
  'One node of each kind on top of what you own, against the selected opponent, sorted by worth per crystal for your goal.': 'Un nœud de chaque type en plus de ce que vous possédez, contre l’adversaire choisi, trié par valeur par cristal pour votre objectif.',
  'Both boards are valued with your stats, against the selected opponent.': 'Les deux plateaux sont évalués avec vos stats, contre l’adversaire choisi.',
  // Azphel: how it is calculated
  'Only PvP stats count here. PvE and Boss Attack, Damage Boost, Accuracy and the rest do nothing against a player.': 'Seules les stats JcJ comptent ici. L’ATQ, le Boost de DGT, la Précision et le reste en JcE ou contre les boss ne servent à rien contre un joueur.',
  'PvP Attack is added after Attack Increase, so each point is worth 1 ÷ your Attack once their Defense is off.': 'L’ATQ JcJ s’ajoute après l’Augmentation de l’ATQ : chaque point vaut donc 1 ÷ votre ATQ, une fois sa DÉF retirée.',
  'Damage Boost and PvP Damage Boost add into one bucket, and the target’s Damage Tolerance and PvP Damage Tolerance come off it. The less is left, the more each point is worth.':
    'Le Boost de DGT et le Boost de DGT JcJ s’additionnent dans un seul multiplicateur, dont on retire la Tolérance aux DGT et la Tolérance aux DGT JcJ de la cible. Moins il en reste, plus chaque point rapporte.',
  'Defense takes a flat share of its value off every hit. In PvP that share is smaller than the 10% of PvE; sources give 1%, 5% or 10%, and the planner uses 5% unless you change it.':
    'La DÉF retire à chaque coup une part fixe de sa valeur. En JcJ cette part est plus faible que les 10 % du JcE ; les sources donnent 1 %, 5 % ou 10 %, et le planificateur utilise 5 % sauf si vous le changez.',
  'A crit starts at 1.25× in PvP, not 1.5×. Crit chance tops out near 50%, and each 100 Critical Hit Resist on the target takes about 6 points off.':
    'Un critique commence à 1,25× en JcJ, et non 1,5×. La chance de critique plafonne vers 50 %, et chaque tranche de 100 de RÉS aux CRIT de la cible en retire environ 6 points.',
  'Evasion does nothing until it passes the attacker’s Accuracy; past that, each 100 points evade about 6% of hits, up to 30%. Accuracy over the target’s Evasion is wasted.':
    'L’Esquive ne fait rien tant qu’elle ne dépasse pas la Précision de l’attaquant ; au-delà, chaque tranche de 100 points esquive environ 6 % des coups, jusqu’à 30 %. La Précision au-dessus de l’Esquive de la cible est perdue.',
  'Block only helps a player with a shield.': 'Le Blocage ne sert qu’à un joueur qui porte un bouclier.',
  'Status Effect Chance and Resist decide whether stuns and the like land. They cannot be turned into damage, so they count for nothing unless you give them a value in My stats.':
    'Le Taux altération état et la RÉS aux altérations décident si les étourdissements et autres contrôles passent. On ne peut pas les convertir en dégâts : ils ne comptent donc pas, sauf si vous leur donnez une valeur dans Mes stats.',
  'The green nodes give two stats at once, one offensive and one defensive, and both are counted.': 'Les nœuds verts donnent deux stats à la fois, une offensive et une défensive, et les deux sont comptées.',
  'Survival here is how many of the opponent’s hits you can take: your HP ÷ their average hit on you.': 'La survie, ici, c’est le nombre de coups de l’adversaire que vous pouvez encaisser : vos PV ÷ son coup moyen sur vous.',
  'This is one hit of a skill that does 100% of your Attack. Double hits (1.5× in PvP) and front or back bonuses multiply on top; they are not on this board, so they are left at 1.':
    'Il s’agit d’un coup d’une compétence qui inflige 100 % de votre ATQ. Les coups doubles (1,5× en JcJ) et les bonus de face ou de dos se multiplient par-dessus ; ils ne sont pas sur ce plateau et restent donc à 1.',
  '3 ÷ {n} Attack after Defense': '3 ÷ {n} d’ATQ après la DÉF',
  '{v} ÷ {bucket} (100 + your Damage Boost − their Tolerance)': '{v} ÷ {bucket} (100 + votre Boost de DGT − sa Tolérance)',
  'You are at the crit cap against them': 'Vous êtes au plafond de critique contre lui', 'Still under their {n} Critical Hit Resist': 'Encore sous ses {n} de RÉS aux CRIT',
  '5 points add {x}% crit chance': '5 points ajoutent {x}% de chance de critique',
  'They never evade or block you': 'Il ne vous esquive ni ne vous bloque jamais', '5 points make them evade {x}% fewer hits': '5 points lui font esquiver {x}% de coups en moins',
  '{x} damage off their {n} hit': '{x} dégâts en moins sur son coup de {n}', '{v} ÷ {bucket} (their multiplier against you)': '{v} ÷ {bucket} (son multiplicateur contre vous)',
  'They never crit you': 'Il ne vous fait jamais de critique', '5 points take {x}% off their crit chance': '5 points retirent {x}% à sa chance de critique',
  'You are at the evasion cap against them': 'Vous êtes au plafond d’esquive contre lui', 'Still under their {n} Accuracy, where evading starts': 'Encore sous ses {n} de Précision, seuil où l’esquive commence',
  '3 points evade {x}% more of their hits': '3 points esquivent {x}% de ses coups en plus',
  'Counted as {x}% damage, the value you set': 'Compté comme {x}% de dégâts, la valeur que vous avez fixée', 'Counted as {x}% survival, the value you set': 'Compté comme {x}% de survie, la valeur que vous avez fixée',
  'Not counted: set a value in My stats': 'Non compté : fixez une valeur dans Mes stats',
  '(({weapon} weapon + {lines} Attack lines) × {wb} Weapon Boost + {bonus} Attack Bonus) × {inc} Attack Increase + {flat} PvP Attack':
    '(({weapon} arme + {lines} lignes d’ATQ) × {wb} Boost d’arme + {bonus} ATQ supplémentaire) × {inc} Augmentation de l’ATQ + {flat} ATQ JcJ',
  '{a} + {pvp} PvP Attack from nodes': '{a} + {pvp} ATQ JcJ venant des nœuds', 'After their Defense': 'Après sa DÉF',
  '1 + {yours} yours + {nodes} from nodes − {tol} their Tolerance': '1 + {yours} à vous + {nodes} des nœuds − {tol} de sa Tolérance',
  '{n} × ({base} + {cdb} Critical Damage Boost − {res} their Critical Damage Tolerance)': '{n} × ({base} + {cdb} de Boost de DGT CRIT − {res} de sa Tolérance aux DGT CRIT)',
  '({have} Critical Hit − {res} their Resist) × {k}%, between 0 and the {cap} cap': '({have} de CRIT − {res} de sa RÉS) × {k}%, entre 0 et le plafond de {cap}',
  '({eva} their Evasion − {acc} your Accuracy) × {k}%, between 0 and {cap}': '({eva} de son Esquive − {acc} de votre Précision) × {k}%, entre 0 et {cap}',
  'Hits blocked by their shield': 'Coups bloqués par son bouclier', '({block} their Block − {acc} your Accuracy) × {k}%, never below 0': '({block} de son Blocage − {acc} de votre Précision) × {k}%, jamais sous 0',
  '({n} + {p} × ({c} − {n})) × (1 − {e} evaded)': '({n} + {p} × ({c} − {n})) × (1 − {e} esquivés)', '× (1 − {s} × {loss} lost per block)': '× (1 − {s} × {loss} perdus par blocage)',
  'Their average hit on you, after this plan': 'Son coup moyen sur vous, après ce plan',
  'The same formula the other way round: their stats against your Defense, Tolerance, Resist and Evasion': 'La même formule dans l’autre sens : ses stats contre votre DÉF, votre Tolérance, votre RÉS et votre Esquive',
  'Their hit on your board now': 'Son coup sur votre plateau actuel', 'Their hit on an empty board': 'Son coup sur un plateau vide',
  [`damage = ( [ ((Attack × Weapon Boost) + Attack Bonus) × Attack Increase
             + PvP Attack ] × skill coefficient
           + skill flat damage − target Defense × 0.05 )
       × (1 + Damage Boost + PvP Boost − target Tolerance − target PvP Tolerance)
       × crit (1.25×) × double (1.5×) × front/back`]:
`dégâts = ( [ ((ATQ × Boost d’arme) + ATQ supplémentaire) × Augmentation de l’ATQ
             + ATQ JcJ ] × coefficient de compétence
           + dégâts fixes de compétence − DÉF de la cible × 0,05 )
       × (1 + Boost de DGT + Boost JcJ − Tolérance de la cible − Tolérance JcJ de la cible)
       × critique (1,25×) × double (1,5×) × face/dos`,
});

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
  const body = html.slice(html.indexOf('<body'), cut).replace(/<button[^>]*data-lang[\s\S]*?<\/button>/g, '');
  for (const m of body.matchAll(/>([^<>]+)</g)) { const t = m[1].replace(/\s+/g, ' ').trim(); if (t && !/^[0-9%+.]*$/.test(t)) keys.add(t); }
  for (const m of body.matchAll(/(?:placeholder|aria-label)="([^"]+)"/g)) keys.add(m[1]);
  for (const m of html.matchAll(/<title>([^<]+)<|name="description" content="([^"]+)"/g)) keys.add(m[1] || m[2]);
  // in the scripts: T('...') and L('...') calls, both branches of T(cond ? '...' : '...'), and L(`...`) blocks
  for (const src of [html.slice(cut), read('ui.js')]) {
    for (const m of src.matchAll(/\b[TL]\((?:[^'`()]*\?\s*)?'((?:[^'\\]|\\.)*)'(?:\s*:\s*'((?:[^'\\]|\\.)*)')?/g)) { keys.add(unescape(m[1])); if (m[2]) keys.add(unescape(m[2])); }
    for (const m of src.matchAll(/\bL\(`([^`]*)`\)/g)) keys.add(m[1]);
    for (const m of src.matchAll(/const (?:SIDES|GOAL_NAMES|FACTIONS) = \{([^}]*)\}/g)) for (const k of m[1].matchAll(/: '([^']*)'/g)) keys.add(k[1]);
  }
  // stat names, targets, comparison strategies, regions and messages from the other scripts, for both boards
  const P = require('./planner.js'), C = require('./character.js');
  for (const id of ['ariel', 'azphel']) {
    const B = P.make(id);
    for (const n of B.NODES) for (const e of n.fx) keys.add(e[0]);
    for (const t of B.TARGETS) { keys.add(t.name); keys.add(t.note); }
    for (const b of B.baselines(1, B.DEFAULT_BUILD, 'dps', [], B.TARGETS[0])) keys.add(b.name);
  }
  for (const r of Object.values(C.REGIONS)) keys.add(r);
  for (const m of read('character.js').matchAll(/(?:onProgress|new Error)\(['`]([^'`$]+)['`]\)/g)) keys.add(m[1]);
  const missing = [...keys].filter(k => !(k in FR));
  if (missing.length) { console.error('No French for:\n' + missing.map(k => '  ' + JSON.stringify(k)).join('\n')); process.exit(1); }
  console.log(`i18n ok: ${keys.size} texts have French`);
}
