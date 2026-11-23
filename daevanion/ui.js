// What differs between the boards on the page: names, labels, stat families, input fields, and the worked explanations.
// The page script (index.html) is the same for both boards and reads everything board-specific from UI[board].
const L = s => s;  // marks a text that is translated where it is shown; `node i18n.js` checks each one has French

// number formats, in the page's language
const fx = (v, d) => dec((+v).toFixed(d));
const signed = v => (v >= 0 ? '+' : '') + fx(v * 100, 2) + '%', rate = v => fx(v * 100, 1) + '%';
const int = v => Math.round(v).toLocaleString(LOCALE), pc = v => dec(+(+v).toFixed(2)) + '%', plain = v => dec(+(+v).toFixed(1));
const cr = n => T(n === 1 ? '{n} crystal' : '{n} crystals', { n }), nodesText = n => T(n === 1 ? '{n} node' : '{n} nodes', { n });

// the first row of both worked calculations: how the loaded character's Attack was added up
const attackRow = (c, template) => [T('Your Attack'), c.parts
  ? T(template,
    { weapon: int(c.parts.weapon), lines: int(c.parts.lines), wb: fx(1 + c.parts.weaponBoost / 100, 3), bonus: int(c.parts.bonus), inc: fx(1 + c.parts.increase / 100, 3), flat: int(c.parts.flat) })
  : T('The Attack you entered under Your stats'), [int(c.b.attack), 'num']];

const UI = {
  // ------------------------------------------------------------------ Ariel, PvE
  ariel: {
    store: 'ariel-planner-2', label: L('Ariel, PvE'),
    title: L('Ariel board route planner'), heading: L('Ariel board route planner.'),
    tagline: L('The PvE board, scored against bosses. Orange is what to buy, numbered in buying order; green is what you own.'),
    short: { 'PvE Attack': 'Atk', 'Boss Attack': 'B.Atk', 'PvE Defense': 'Def', 'Boss Defense': 'B.Def', 'PvE Accuracy': 'Acc', 'PvE Evasion': 'Eva',
      'PvE Damage Boost': 'Dmg', 'Boss Damage Boost': 'B.Dmg', 'PvE Damage Tolerance': 'Tol', 'Boss Damage Tolerance': 'B.Tol',
      'Critical Hit': 'Crit', 'Critical Hit Resist': 'C.Res', HP: 'HP', MP: 'MP' },
    shortFr: { 'PvE Attack': 'ATQ', 'Boss Attack': 'ATQ.B', 'PvE Defense': 'DÉF', 'Boss Defense': 'DÉF.B', 'PvE Accuracy': 'Préc', 'PvE Evasion': 'Esq',
      'PvE Damage Boost': 'DGT', 'Boss Damage Boost': 'DGT.B', 'PvE Damage Tolerance': 'Tol', 'Boss Damage Tolerance': 'Tol.B',
      'Critical Hit': 'CRIT', 'Critical Hit Resist': 'R.CRIT', HP: 'PV', MP: 'PM' },
    // Order and shade follow each stat's weight in the damage formula: multipliers first (darkest), then flat amounts,
    // then the stats that only matter under a condition, then the ones that do nothing against bosses (lightest).
    families: [
      [L('Offensive'), 'off', [['PvE Damage Boost', 1], ['Boss Damage Boost', 1], ['Critical Hit', 2], ['PvE Attack', 3], ['Boss Attack', 3], ['PvE Accuracy', 4]]],
      [L('Defensive'), 'def', [['PvE Damage Tolerance', 1], ['Boss Damage Tolerance', 1], ['PvE Defense', 2], ['Boss Defense', 2], ['PvE Evasion', 3], ['Critical Hit Resist', 4]]],
      [L('Resources'), 'res', [['HP', 1], ['MP', 2]]],
    ],
    fields: [
      ['attack', L('Attack, total (after weapon boost and attack increase)')],
      ['damage_boost_pct', L('Damage Boost % (generic + PvE + Boss)')],
      ['crit_hit', L('Critical Hit')],
      ['accuracy', L('Accuracy (PvE Accuracy included)')],
      ['crit_damage_boost_pct', L('Critical Damage Boost %')],
      ['hp', L('HP')],
      ['tolerance_pct', L('Damage Tolerance % (generic + PvE + Boss)')],
      [null, L('Not shown in game. These are community figures and guesses; the last four mostly move the Survival route.')],
      ['crit_cap_pct', L('Crit chance cap %')],
      ['crit_pct_per_point', L('Crit chance % per Critical Hit point, unmeasured encounters')],
      ['block_pct_per_point', L('Blocked chance % per Accuracy point short')],
      ['block_loss_pct', L('Damage lost on a blocked hit %')],
      ['boss_crit_dmg_resist_pct', L('Boss crit damage resist %')],
      ['boss_tolerance_pct', L('Boss Damage Tolerance %, where none is measured')],
      ['boss_defense', L('Boss Defense')],
      ['boss_hit', L('Boss hit size before your Defense')],
      ['boss_damage_boost_pct', L('Boss Damage Boost %')],
      ['evasion_pct_per_point', L('Damage avoided % per Evasion point (0 = ignore)')],
    ],
    divisors: ['attack', 'hp', 'boss_hit'],
    // the custom target: your own boss
    customTitle: L('Custom encounter.'),
    customNote: L('Your own boss. Pick “Custom encounter” under Against to plan for it; these numbers then replace the boss guesses above.'),
    customFields: [['acc', L('Accuracy where parries stop (0 = never blocked)')], ['crit', L('Critical Hit that reaches the crit cap (0 = not known)')],
      ['boss_tolerance_pct', L('Boss Damage Tolerance %')], ['boss_crit_dmg_resist_pct', L('Boss crit damage resist %')], ['boss_defense', L('Boss Defense')],
      ['boss_hit', L('Boss hit size before your Defense')], ['boss_damage_boost_pct', L('Boss Damage Boost %')]],
    customDivisors: ['boss_hit'],
    customDefaults: b => ({ acc: 1000, crit: 1500, boss_tolerance_pct: b.boss_tolerance_pct, boss_crit_dmg_resist_pct: b.boss_crit_dmg_resist_pct, boss_defense: b.boss_defense, boss_hit: b.boss_hit, boss_damage_boost_pct: b.boss_damage_boost_pct }),
    customTarget(c) { const { acc, crit, ...over } = c; return { id: 'custom', name: L('Custom encounter'), acc, crit, over, note: L('Your own boss, set under My stats.') }; },
    canLoadOpponent: false,
    // texts of the shared tables
    miss: L('{crit} crit, {blocked} blocked'), missRow: L('Hits blocked'), missHead: L('Blocked after'),
    boostRow: L('Damage Boost, after the boss’s Tolerance'), statesHead: L('A 100% skill, selected encounter'),
    encTitle: L('Against each encounter.'), encHead: L('Encounter'),
    encNote: L('The same route everywhere. Critical Hit, Accuracy and Damage Tolerance figures are measured by players on Global (Aion 2 Maps, November 2026); where a boss’s Damage Tolerance was not measured, the guess from My stats is used.'),
    worthNote: L('One node of each kind on top of what you own, against the selected encounter, sorted by worth per crystal for your goal.'),
    compareNote: L('Both boards are valued with your stats, against the selected encounter.'),
    statsNote: L('Without any Ariel nodes. The best route depends on these: 1.5% Damage Boost is worth more at 50% than at 200%.'),
    loaded: (name, b, nodes) => T('Loaded {name}: Attack {attack}, Damage Boost {boost}%, Critical Hit {crit}, Accuracy {acc}, Damage Tolerance {tol}%, Critical Damage Boost {cdb}%. {nodes} marked as owned. Added up from gear, titles and boards; pets, wings, skill passives and base stats are not in the data, and HP is not available. Check them under My stats.',
      { name, attack: int(b.attack), boost: dec(b.damage_boost_pct), crit: int(b.crit_hit), acc: int(b.accuracy), tol: dec(b.tolerance_pct), cdb: dec(b.crit_damage_boost_pct), nodes }),
    formula: L(`damage = ( [ ((Attack × Weapon Boost) + Attack Bonus) × Attack Increase
             + PvE Attack + Boss Attack ] × skill coefficient
           + skill flat damage − target Defense × 0.1 )
       × (1 + Damage Boost + PvE Boost + Boss Boost − target Tolerance)
       × crit × double × front/back`),
    bullets: [
      L('PvE and Boss Attack are added after Attack Increase, so each point is worth 1 ÷ your Attack.'),
      L('All Damage Boost types add into one bucket, and the boss’s Damage Tolerance comes off it. Against a boss with 68% Tolerance and 25% boost of your own, the bucket is only 57%, so +1.5% is 1.5 ÷ 57 = +2.6% damage. The more Tolerance the boss has, the more each Damage Boost node is worth.'),
      L('Damage Tolerance takes away from the boss’s bucket in the same way.'),
      L('Defense removes a flat 0.1 × Defense from every hit.'),
      L('Critical Hit: where an encounter has a measured figure, every 100 points short of it costs 10% crit chance, down from the 50% cap. A crit does 1.5× plus your Critical Damage Boost, minus the boss’s resist. At the cap, crit nodes are worth nothing.'),
      L('Accuracy: every 100 points short of the encounter’s figure gets about 10% of your hits blocked, and a blocked hit loses about half its damage.'),
      L('HP adds HP ÷ your HP. Critical Hit Resist and MP are worth nothing against bosses, because bosses do not crit.'),
      L('Evasion counts for nothing unless you give it a value above.'),
      L('The green nodes give two stats at once, and both are counted.'),
      L('Effective HP is how much raw boss damage you survive: HP ÷ damage taken.'),
    ],
    calcNote: L('This is one hit of a skill that does 100% of your Attack. For a 250% skill, multiply the Attack line by 2.5 before the boss’s Defense comes off. Double hits and front or back bonuses multiply on top; they are not on this board, so they are left at 1.'),
    // why one node of each stat is worth what it is: the arithmetic, per stat
    how(c) {
      const { b, t, sNow, now } = c, eb = t.over ? Object.assign({}, b, t.over) : b;
      const base = T(eb.boss_defense ? '{n} Attack after Defense' : '{n} Attack', { n: int(now.attack - 0.1 * eb.boss_defense) });
      const bucket = fx(now.bucket * 100, 1), bossBucket = fx(100 + eb.boss_damage_boost_pct - b.tolerance_pct - (sNow['PvE Damage Tolerance'] || 0) - (sNow['Boss Damage Tolerance'] || 0), 1);
      const crit = now.critRate * 100 >= b.crit_cap_pct ? T('You are at the crit cap here')
        : !t.crit ? T('10 points add {x}% crit chance', { x: fx(10 * b.crit_pct_per_point, 2) })
          : b.crit_hit + (sNow['Critical Hit'] || 0) + 10 <= t.crit - b.crit_cap_pct * 10 ? T('Still under {n} Critical Hit, where crits start here', { n: int(t.crit - b.crit_cap_pct * 10) })
            : T('10 points add {x}% crit chance', { x: 1 });
      return {
        'PvE Attack': `3 ÷ ${base}`, 'Boss Attack': `3 ÷ ${base}`,
        'PvE Damage Boost': T('{v} ÷ {bucket} (100 + your Damage Boost − boss Tolerance)', { v: dec(1.5), bucket }), 'Boss Damage Boost': T('{v} ÷ {bucket} (100 + your Damage Boost − boss Tolerance)', { v: 1, bucket }),
        'Critical Hit': crit,
        'PvE Accuracy': !t.acc ? T('This encounter does not block you') : now.blocked <= 0 ? T('You are never blocked here') : T('5 points block {x}% fewer hits', { x: fx(5 * b.block_pct_per_point, 1) }),
        'PvE Defense': T('3 damage off a {n} hit', { n: int(eb.boss_hit) }), 'Boss Defense': T('3 damage off a {n} hit', { n: int(eb.boss_hit) }),
        'PvE Damage Tolerance': T('{v} ÷ {bucket} (the boss’s bucket)', { v: dec(1.5), bucket: bossBucket }), 'Boss Damage Tolerance': T('{v} ÷ {bucket} (the boss’s bucket)', { v: 1, bucket: bossBucket }),
        HP: T('100 ÷ {n} HP', { n: int(b.hp + (sNow.HP || 0)) }), MP: T('No effect on damage or survival'), 'Critical Hit Resist': T('Bosses do not crit'),
        'PvE Evasion': b.evasion_pct_per_point ? T('5 points avoid {x}% of hits', { x: fx(5 * b.evasion_pct_per_point, 2) }) : T('Not counted: no reliable data'),
      };
    },
    // the formula with the player's numbers, for the board after the plan: [step, working, result]
    calc(c) {
      const { b, t, z, h } = c, eb = t.over ? Object.assign({}, b, t.over) : b, g = k => c.after[k] || 0;
      const afterDef = Math.max(0, z.attack - 0.1 * eb.boss_defense), rating = b.crit_hit + g('Critical Hit'), acc = b.accuracy + g('PvE Accuracy');
      return [
        { cells: attackRow(c, L('(({weapon} weapon + {lines} Attack lines) × {wb} Weapon Boost + {bonus} Attack Bonus) × {inc} Attack Increase + {flat} PvE and Boss Attack')) },
        { cells: [T('Attack with the board'), T('{a} + {pve} PvE Attack + {boss} Boss Attack from nodes', { a: int(b.attack), pve: g('PvE Attack'), boss: g('Boss Attack') }), [int(z.attack), 'num']] },
        { cells: [T('After the boss’s Defense'), T('{a} × 100% skill − {def} Defense × {k}', { a: int(z.attack), def: int(eb.boss_defense), k: dec(0.1) }), [int(afterDef), 'num']] },
        { cells: [T('Damage Boost multiplier'), T('1 + {yours} yours + {nodes} from nodes − {tol} boss Tolerance', { yours: pc(b.damage_boost_pct), nodes: pc(g('PvE Damage Boost') + g('Boss Damage Boost')), tol: pc(eb.boss_tolerance_pct) }), ['× ' + fx(z.bucket, 3), 'num']] },
        { cells: [T('Normal hit'), `${int(afterDef)} × ${fx(z.bucket, 3)}`, [int(z.normal), 'num']], cls: 'major' },
        { cells: [T('Critical hit'), T('{n} × ({base} + {cdb} Critical Damage Boost − {res} boss resist)', { n: int(z.normal), base: dec(1.5), cdb: pc(b.crit_damage_boost_pct), res: pc(eb.boss_crit_dmg_resist_pct) }), [int(z.crit), 'num']], cls: 'major' },
        { cells: [T('Crit chance'), t.crit ? T('{cap} cap − ({need} needed − {have} Critical Hit) × {k}, kept between 0 and the cap', { cap: pc(b.crit_cap_pct), need: int(t.crit), have: int(rating), k: dec(0.1) })
          : T('{have} Critical Hit × {k}%, up to the {cap} cap', { have: int(rating), k: fx(b.crit_pct_per_point, 4), cap: pc(b.crit_cap_pct) }), [rate(z.critRate), 'num']] },
        { cells: [T('Hits blocked'), t.acc ? T('({need} needed − {have} Accuracy) × {k}%, never below 0', { need: int(t.acc), have: int(acc), k: dec(b.block_pct_per_point) }) : T('This encounter does not block you'), [rate(z.blocked), 'num']] },
        { cells: [T('Average hit'), T('({n} + {p} × ({c} − {n})) × (1 − {b} × {loss} lost per block)', { n: int(z.normal), p: rate(z.critRate), c: int(z.crit), b: rate(z.blocked), loss: pc(b.block_loss_pct) }), [int(z.average), 'num']], cls: 'current' },
        { cells: [T('The same hit on your board now'), T('Same steps, with the nodes you own'), [int(h[1].average), 'num']] },
        { cells: [T('The same hit on an empty board'), T('Same steps, with no nodes'), [int(h[0].average), 'num']] },
      ];
    },
  },

  // ------------------------------------------------------------------ Azphel, PvP
  azphel: {
    store: 'azphel-planner-1', label: L('Azphel, PvP'),
    title: L('Azphel board route planner'), heading: L('Azphel board route planner.'),
    tagline: L('The PvP board, scored against another player. Orange is what to buy, numbered in buying order; green is what you own.'),
    short: { 'PvP Attack': 'Atk', 'PvP Defense': 'Def', 'PvP Accuracy': 'Acc', 'PvP Evasion': 'Eva', 'PvP Damage Boost': 'Dmg', 'PvP Damage Tolerance': 'Tol',
      'PvP Critical Hit': 'Crit', 'PvP Critical Hit Resist': 'C.Res', 'Status Effect Chance': 'St.Ch', 'Status Effect Resist': 'St.Res', HP: 'HP', MP: 'MP' },
    shortFr: { 'PvP Attack': 'ATQ', 'PvP Defense': 'DÉF', 'PvP Accuracy': 'Préc', 'PvP Evasion': 'Esq', 'PvP Damage Boost': 'DGT', 'PvP Damage Tolerance': 'Tol',
      'PvP Critical Hit': 'CRIT', 'PvP Critical Hit Resist': 'R.CRIT', 'Status Effect Chance': 'Alt.', 'Status Effect Resist': 'R.Alt', HP: 'PV', MP: 'PM' },
    families: [
      [L('Offensive'), 'off', [['PvP Damage Boost', 1], ['PvP Critical Hit', 2], ['PvP Attack', 3], ['PvP Accuracy', 4], ['Status Effect Chance', 4]]],
      [L('Defensive'), 'def', [['PvP Damage Tolerance', 1], ['PvP Critical Hit Resist', 2], ['PvP Defense', 3], ['PvP Evasion', 4], ['Status Effect Resist', 4]]],
      [L('Resources'), 'res', [['HP', 1], ['MP', 2]]],
    ],
    fields: [
      ['attack', L('Attack, total (after weapon boost and attack increase, PvP Attack included)')],
      ['damage_boost_pct', L('Damage Boost % (generic + PvP)')],
      ['crit_hit', L('Critical Hit (PvP Critical Hit included)')],
      ['accuracy', L('Accuracy (PvP Accuracy included, PvE Accuracy left out)')],
      ['crit_damage_boost_pct', L('Critical Damage Boost %')],
      ['hp', L('HP')],
      ['defense', L('Defense (PvP Defense included)')],
      ['tolerance_pct', L('Damage Tolerance % (generic + PvP)')],
      ['crit_resist', L('Critical Hit Resist (PvP included)')],
      ['evasion', L('Evasion (PvP Evasion included)')],
      ['block', L('Block (0 unless you carry a shield)')],
      ['crit_damage_tolerance_pct', L('Critical Damage Tolerance %')],
      [null, L('How PvP works. These are community figures, the same for you and your opponent.')],
      ['defense_factor', L('Share of Defense taken off a hit (sources say 0.01, 0.05 or 0.1)')],
      ['crit_base', L('Crit multiplier before Critical Damage Boost')],
      ['crit_cap_pct', L('Crit chance cap %')],
      ['crit_pct_per_point', L('Crit chance % per point of Critical Hit over their Resist')],
      ['evade_pct_per_point', L('Evade chance % per point of Evasion over the attacker’s Accuracy')],
      ['evade_cap_pct', L('Evade chance cap %')],
      ['block_pct_per_point', L('Block chance % per point of Block over the attacker’s Accuracy')],
      ['block_loss_pct', L('Damage lost on a blocked hit %')],
      ['status_chance_value', L('What 1% Status Effect Chance is worth to you, as % damage (0 = not counted)')],
      ['status_resist_value', L('What 1% Status Effect Resist is worth to you, as % survival (0 = not counted)')],
    ],
    divisors: ['attack', 'hp'],
    // the custom target: an opponent of your choice, typed in or loaded from the game
    customTitle: L('Your opponent.'),
    customNote: L('A player to plan against. Load one from the game, with their own Azphel board, or type the numbers. Pick “Your chosen opponent” under Against to use them.'),
    customFields: [['attack', L('Their Attack')], ['damage_boost_pct', L('Their Damage Boost %')], ['crit_hit', L('Their Critical Hit')], ['accuracy', L('Their Accuracy')],
      ['crit_damage_boost_pct', L('Their Critical Damage Boost %')], ['defense', L('Their Defense')], ['tolerance_pct', L('Their Damage Tolerance %')],
      ['crit_resist', L('Their Critical Hit Resist')], ['evasion', L('Their Evasion')], ['block', L('Their Block (0 without a shield)')], ['crit_damage_tolerance_pct', L('Their Critical Damage Tolerance %')]],
    customDivisors: ['attack'],
    customDefaults: b => ({ attack: b.attack, damage_boost_pct: b.damage_boost_pct, crit_hit: b.crit_hit, accuracy: b.accuracy, crit_damage_boost_pct: b.crit_damage_boost_pct, defense: b.defense,
      tolerance_pct: b.tolerance_pct, crit_resist: b.crit_resist, evasion: b.evasion, block: b.block, crit_damage_tolerance_pct: b.crit_damage_tolerance_pct }),
    customTarget(c, name) { return { id: 'custom', name: name ? T('Your chosen opponent: {name}', { name }) : L('Your chosen opponent'), opp: c, note: L('The opponent set under My stats, with the numbers shown there.') }; },
    canLoadOpponent: true,
    miss: L('{crit} crit, {blocked} evaded'), missRow: L('Hits evaded'), missHead: L('Evaded after'),
    boostRow: L('Damage Boost, after their Tolerance'), statesHead: L('A 100% skill, selected opponent'),
    encTitle: L('Against each opponent.'), encHead: L('Opponent'),
    encNote: L('The same route against each opponent. An opponent is a set of player stats: your own, or the one you chose under My stats.'),
    worthNote: L('One node of each kind on top of what you own, against the selected opponent, sorted by worth per crystal for your goal.'),
    compareNote: L('Both boards are valued with your stats, against the selected opponent.'),
    statsNote: L('Without any Azphel nodes. Only what counts against players is here: PvE and Boss stats do nothing in PvP.'),
    loaded: (name, b, nodes) => T('Loaded {name}: Attack {attack}, Damage Boost {boost}%, Critical Hit {crit}, Accuracy {acc}, Defense {def}, Damage Tolerance {tol}%, Critical Hit Resist {res}, Evasion {eva}, Block {block}. {nodes} marked as owned. Added up from gear, titles and boards; pets, wings, skill passives and base stats are not in the data, and HP is not available. Check them under My stats.',
      { name, attack: int(b.attack), boost: dec(b.damage_boost_pct), crit: int(b.crit_hit), acc: int(b.accuracy), def: int(b.defense), tol: dec(b.tolerance_pct), res: int(b.crit_resist), eva: int(b.evasion), block: int(b.block), nodes }),
    formula: L(`damage = ( [ ((Attack × Weapon Boost) + Attack Bonus) × Attack Increase
             + PvP Attack ] × skill coefficient
           + skill flat damage − target Defense × 0.05 )
       × (1 + Damage Boost + PvP Boost − target Tolerance − target PvP Tolerance)
       × crit (1.25×) × double (1.5×) × front/back`),
    bullets: [
      L('Only PvP stats count here. PvE and Boss Attack, Damage Boost, Accuracy and the rest do nothing against a player.'),
      L('PvP Attack is added after Attack Increase, so each point is worth 1 ÷ your Attack once their Defense is off.'),
      L('Damage Boost and PvP Damage Boost add into one bucket, and the target’s Damage Tolerance and PvP Damage Tolerance come off it. The less is left, the more each point is worth.'),
      L('Defense takes a flat share of its value off every hit. In PvP that share is smaller than the 10% of PvE; sources give 1%, 5% or 10%, and the planner uses 5% unless you change it.'),
      L('A crit starts at 1.25× in PvP, not 1.5×. Crit chance tops out near 50%, and each 100 Critical Hit Resist on the target takes about 6 points off.'),
      L('Evasion does nothing until it passes the attacker’s Accuracy; past that, each 100 points evade about 6% of hits, up to 30%. Accuracy over the target’s Evasion is wasted.'),
      L('Block only helps a player with a shield.'),
      L('Status Effect Chance and Resist decide whether stuns and the like land. They cannot be turned into damage, so they count for nothing unless you give them a value in My stats.'),
      L('The green nodes give two stats at once, one offensive and one defensive, and both are counted.'),
      L('Survival here is how many of the opponent’s hits you can take: your HP ÷ their average hit on you.'),
    ],
    calcNote: L('This is one hit of a skill that does 100% of your Attack. Double hits (1.5× in PvP) and front or back bonuses multiply on top; they are not on this board, so they are left at 1.'),
    how(c) {
      const { b, t, sNow, now, P } = c, o = P.model.opp(b, t), me = P.model.side(b, sNow), them = P.model.side(o, {}), taken = P.model.taken(sNow, b, t);
      const k = b.crit_pct_per_point, e = b.evade_pct_per_point;
      return {
        'PvP Attack': T('3 ÷ {n} Attack after Defense', { n: int(now.afterDef) }),
        'PvP Damage Boost': T('{v} ÷ {bucket} (100 + your Damage Boost − their Tolerance)', { v: dec(1.5), bucket: fx(now.bucket * 100, 1) }),
        'PvP Critical Hit': now.critRate * 100 >= b.crit_cap_pct ? T('You are at the crit cap against them') : me.crit + 5 <= them.critRes ? T('Still under their {n} Critical Hit Resist', { n: int(them.critRes) }) : T('5 points add {x}% crit chance', { x: fx(5 * k, 2) }),
        'PvP Accuracy': now.blocked <= 0 && now.shield <= 0 ? T('They never evade or block you') : T('5 points make them evade {x}% fewer hits', { x: fx(5 * e, 2) }),
        'PvP Defense': T('{x} damage off their {n} hit', { x: fx(30 * b.defense_factor, 1), n: int(taken.afterDef) }),
        'PvP Damage Tolerance': T('{v} ÷ {bucket} (their multiplier against you)', { v: dec(1.5), bucket: fx(taken.bucket * 100, 1) }),
        'PvP Critical Hit Resist': taken.critRate <= 0 ? T('They never crit you') : T('5 points take {x}% off their crit chance', { x: fx(5 * k, 2) }),
        'PvP Evasion': taken.blocked * 100 >= b.evade_cap_pct ? T('You are at the evasion cap against them') : me.eva + 3 <= them.acc ? T('Still under their {n} Accuracy, where evading starts', { n: int(them.acc) }) : T('3 points evade {x}% more of their hits', { x: fx(3 * e, 2) }),
        'Status Effect Chance': b.status_chance_value ? T('Counted as {x}% damage, the value you set', { x: fx(b.status_chance_value, 2) }) : T('Not counted: set a value in My stats'),
        'Status Effect Resist': b.status_resist_value ? T('Counted as {x}% survival, the value you set', { x: fx(b.status_resist_value, 2) }) : T('Not counted: set a value in My stats'),
        HP: T('100 ÷ {n} HP', { n: int(b.hp + (sNow.HP || 0)) }), MP: T('No effect on damage or survival'),
      };
    },
    calc(c) {
      const { b, t, z, h, P } = c, o = P.model.opp(b, t), me = P.model.side(b, c.after), them = P.model.side(o, {}), g = k => c.after[k] || 0;
      const tk = [{}, c.now, c.after].map(s => P.model.taken(s, b, t));
      return [
        { cells: attackRow(c, L('(({weapon} weapon + {lines} Attack lines) × {wb} Weapon Boost + {bonus} Attack Bonus) × {inc} Attack Increase + {flat} PvP Attack')) },
        { cells: [T('Attack with the board'), T('{a} + {pvp} PvP Attack from nodes', { a: int(b.attack), pvp: g('PvP Attack') }), [int(z.attack), 'num']] },
        { cells: [T('After their Defense'), T('{a} × 100% skill − {def} Defense × {k}', { a: int(z.attack), def: int(them.defense), k: dec(b.defense_factor) }), [int(z.afterDef), 'num']] },
        { cells: [T('Damage Boost multiplier'), T('1 + {yours} yours + {nodes} from nodes − {tol} their Tolerance', { yours: pc(b.damage_boost_pct), nodes: pc(g('PvP Damage Boost')), tol: pc(them.tol) }), ['× ' + fx(z.bucket, 3), 'num']] },
        { cells: [T('Normal hit'), `${int(z.afterDef)} × ${fx(z.bucket, 3)}`, [int(z.normal), 'num']], cls: 'major' },
        { cells: [T('Critical hit'), T('{n} × ({base} + {cdb} Critical Damage Boost − {res} their Critical Damage Tolerance)', { n: int(z.normal), base: dec(b.crit_base), cdb: pc(me.cdb), res: pc(them.cdt) }), [int(z.crit), 'num']], cls: 'major' },
        { cells: [T('Crit chance'), T('({have} Critical Hit − {res} their Resist) × {k}%, between 0 and the {cap} cap', { have: int(me.crit), res: int(them.critRes), k: dec(b.crit_pct_per_point), cap: pc(b.crit_cap_pct) }), [rate(z.critRate), 'num']] },
        { cells: [T('Hits evaded'), T('({eva} their Evasion − {acc} your Accuracy) × {k}%, between 0 and {cap}', { eva: int(them.eva), acc: int(me.acc), k: dec(b.evade_pct_per_point), cap: pc(b.evade_cap_pct) }), [rate(z.blocked), 'num']] },
        ...(them.block > 0 ? [{ cells: [T('Hits blocked by their shield'), T('({block} their Block − {acc} your Accuracy) × {k}%, never below 0', { block: int(them.block), acc: int(me.acc), k: dec(b.block_pct_per_point) }), [rate(z.shield), 'num']] }] : []),
        { cells: [T('Average hit'), T('({n} + {p} × ({c} − {n})) × (1 − {e} evaded)', { n: int(z.normal), p: rate(z.critRate), c: int(z.crit), e: rate(z.blocked) })
          + (z.shield > 0 ? ' ' + T('× (1 − {s} × {loss} lost per block)', { s: rate(z.shield), loss: pc(b.block_loss_pct) }) : ''), [int(z.average), 'num']], cls: 'current' },
        { cells: [T('The same hit on your board now'), T('Same steps, with the nodes you own'), [int(h[1].average), 'num']] },
        { cells: [T('The same hit on an empty board'), T('Same steps, with no nodes'), [int(h[0].average), 'num']] },
        { cells: [T('Their average hit on you, after this plan'), T('The same formula the other way round: their stats against your Defense, Tolerance, Resist and Evasion'), [int(tk[2].average), 'num']], cls: 'major' },
        { cells: [T('Their hit on your board now'), T('Same steps, with the nodes you own'), [int(tk[1].average), 'num']] },
        { cells: [T('Their hit on an empty board'), T('Same steps, with no nodes'), [int(tk[0].average), 'num']] },
      ];
    },
  },
};

if (typeof module !== 'undefined') module.exports = { UI, L };
