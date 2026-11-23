// Daevanion board route planner: the maths. Used by index.html; `node planner.js` runs the self-test.
// One planner per board: the search is shared, the scoring model (what a stat is worth) is the board's own.
// Formulas and sources: ../README.md
(function (root) {
  const ALL = typeof BOARDS !== 'undefined' ? BOARDS : require('./boards.js');
  const SK = typeof SKILLS !== 'undefined' ? SKILLS : ALL.SKILLS;  // class -> board -> the skill behind each skill node
  const META = typeof SKILL_META !== 'undefined' ? SKILL_META : ALL.SKILL_META;  // class -> skill -> icon file, '|p' for a passive
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const GOALS = { dps: [1, 0], tank: [0, 1], balanced: [0.5, 0.5] };

  // ---------------------------------------------------------------- Ariel: PvE, against bosses
  const ARIEL = {
    // Your character WITHOUT any Ariel nodes. Every number changes which route is best:
    // the board's stats have diminishing returns against what you already have.
    DEFAULT_BUILD: {
      attack: 2000,               // (Attack x Weapon Dmg Boost + Attack Bonus) x Attack Increase + PvE/Boss Attack
      damage_boost_pct: 15,       // Damage Boost + PvE Damage Boost + Boss Damage Boost (one additive bucket)
      crit_hit: 600,              // Critical Hit rating
      accuracy: 700,              // Accuracy rating, PvE Accuracy included
      crit_damage_boost_pct: 5,   // on top of the base 1.5x
      hp: 15000,
      tolerance_pct: 15,          // your Damage Tolerance + PvE + Boss Damage Tolerance
      // --- not readable in game: community figures and guesses ---
      crit_cap_pct: 50,           // Global cap (KR guides say 80)
      crit_pct_per_point: 1 / 15, // crit chance per rating point where the encounter has no measured crit figure
      block_pct_per_point: 0.1,   // chance to be blocked per Accuracy point short (AION 2 Timers: 10% per 100; Aion 2 Maps: ~6.7%)
      block_loss_pct: 50,         // damage lost on a blocked hit (reports range 20 to 50)
      boss_tolerance_pct: 20,     // boss's Damage Tolerance where the encounter has no measured one (KR community reference value)
      boss_defense: 0,            // boss's Defense: takes a flat 0.1 x Defense off every hit. Never measured, so 0
      boss_crit_dmg_resist_pct: 25,
      boss_hit: 4000,             // typical boss hit before your Defense
      boss_damage_boost_pct: 50,  // boss's own Damage Boost
      evasion_pct_per_point: 0,   // 0 = ignore PvE Evasion (no reliable data)
    },
    // Encounters. NCsoft publishes no boss stats; these are Global player measurements from Aion 2 Maps
    // (aion2maps.com, guides "Accuracy and Crit" and "How damage works", 16 Nov 2026: one Ranger's fight logs plus Global parses).
    // acc: Accuracy (Accuracy + Accuracy Bonus + PvE Accuracy) where parries stop; the top of the measured range, 0 = no check.
    // crit: Critical Hit that reaches the 50% cap, about the boss's Critical Hit Resist + 500; 0 = not measured.
    // over: boss numbers for this encounter that replace the boss_* guesses in the build (measured Damage Tolerance; the custom encounter).
    TARGETS: [
      { id: 'open', name: 'Open world and normal dungeons', acc: 0, crit: 0, note: 'Bosses here do not block you. No Critical Hit figure is measured, so crit chance is estimated from your rating.' },
      { id: 't4', name: 'Transcendence tier 4', acc: 1075, crit: 1420, over: { boss_tolerance_pct: 68 }, note: 'Crit cap at about 1,420 Critical Hit. Parries stop between 800 and 1,075 Accuracy depending on the boss; the plan uses 1,075. Boss Damage Tolerance measured at 68%.' },
      { id: 'hardmid', name: 'Conquest hard, mid-bosses', acc: 1000, crit: 1415, over: { boss_tolerance_pct: 62 }, note: 'Crit cap at 1,405 to 1,425 Critical Hit. Parries stop between 800 and 1,000 Accuracy; the plan uses 1,000. Boss Damage Tolerance measured at 58 to 67%; the plan uses 62%.' },
      { id: 'hardfinal', name: 'Conquest hard, final bosses', acc: 1075, crit: 1540, over: { boss_tolerance_pct: 62 }, note: 'Crit cap at 1,525 to 1,555 Critical Hit. Parries stop at about 925 Accuracy, 1,075 on Transcendent Bakarma; the plan uses 1,075. Boss Damage Tolerance measured at 58 to 67%; the plan uses 62%.' },
      { id: 'fire', name: 'Fire Temple hard', acc: 1050, crit: 1600, note: 'Crit cap at 1,590 to 1,610 Critical Hit. Parries stop between 800 and 1,050 Accuracy; the plan uses 1,050.' },
      { id: 'horn', name: 'Ferocious Horn Den hard', acc: 1125, crit: 1600, note: 'Crit cap at 1,590 to 1,610 Critical Hit. Parries stop between 800 and 1,125 Accuracy; the plan uses 1,125.' },
      { id: 'ludramid', name: 'Ludra hard, mid-bosses', acc: 0, crit: 1630, note: 'Crit cap at 1,615 to 1,650 Critical Hit. These bosses almost never parry.' },
      { id: 'ludra', name: 'Eternal Ludra, normal and hard', acc: 1180, crit: 1800, note: 'Crit cap at 1,750 to 1,850 Critical Hit. Parries stop at about 1,100 Accuracy, rarely up to 1,180; the plan uses 1,180.' },
    ],
    env: (b, t) => (t && t.over ? Object.assign({}, b, t.over) : b),  // the build with this encounter's boss numbers
    // One hit of a 100% skill against target t, in real numbers.
    hit(stats, b, t) {
      b = ARIEL.env(b, t);
      const g = k => stats[k] || 0;
      const attack = b.attack + g('PvE Attack') + g('Boss Attack');
      const bucket = Math.max(0.05, 1 + (b.damage_boost_pct + g('PvE Damage Boost') + g('Boss Damage Boost') - b.boss_tolerance_pct) / 100);
      const rating = b.crit_hit + g('Critical Hit'), acc = b.accuracy + g('PvE Accuracy');
      // measured encounters: 10% crit per 100 rating short of the figure that reaches the cap
      const critRate = clamp(t.crit ? b.crit_cap_pct - (t.crit - rating) * 0.1 : rating * b.crit_pct_per_point, 0, b.crit_cap_pct) / 100;
      const blocked = t.acc ? clamp((t.acc - acc) * b.block_pct_per_point, 0, 80) / 100 : 0;
      const normal = Math.max(0, attack - 0.1 * b.boss_defense) * bucket, crit = normal * (1.5 + (b.crit_damage_boost_pct - b.boss_crit_dmg_resist_pct) / 100);
      const average = (normal + critRate * (crit - normal)) * (1 - blocked * b.block_loss_pct / 100);
      return { attack, bucket, critRate, blocked, normal, crit, average };
    },
    // -> [damage dealt multiplier, effective-HP multiplier] against target t, relative to no board
    score(stats, b, t) {
      const g = k => stats[k] || 0;
      const dmg = ARIEL.hit(stats, b, t).average / ARIEL.hit({}, b, t).average;
      b = ARIEL.env(b, t);
      // damage taken = (boss hit - 0.1 x Defense) x (1 + boss boost - your tolerance) x (1 - evade)
      // Critical Hit Resist and MP are worth nothing here: bosses do not crit.
      const flat = 1 - 0.1 * (g('PvE Defense') + g('Boss Defense')) / b.boss_hit;
      const tb0 = 1 + (b.boss_damage_boost_pct - b.tolerance_pct) / 100;
      const tol = 1 - (g('PvE Damage Tolerance') + g('Boss Damage Tolerance')) / 100 / tb0;
      const eva = 1 - g('PvE Evasion') * b.evasion_pct_per_point / 100;
      return [dmg, (1 + g('HP') / b.hp) / (flat * tol * eva)];
    },
  };

  // ---------------------------------------------------------------- Azphel: PvP, against another player
  // Same formula as PvE with the PvP numbers (Aion 2 Maps, "PvP" and "How damage works", Nov 2026):
  // Defense takes roughly 5 to 10% of its value off a hit instead of 10% (sources split, some say 1%); a crit starts at 1.25x
  // instead of 1.5x; Damage Boost and PvP Damage Boost share one pile, minus the target's Damage Tolerance and PvP Damage Tolerance;
  // crit chance tops out near 50% and each 100 Critical Hit Resist on the target takes about 6 points off; Evasion only pays once
  // it passes the attacker's Accuracy; Block only helps shield classes, about 6 points per 100.
  const AZPHEL = {
    // A fighter WITHOUT any Azphel nodes. Yours, and the same shape for the opponent.
    DEFAULT_BUILD: {
      attack: 2000,                 // (Attack x Weapon Dmg Boost + Attack Bonus) x Attack Increase + PvP Attack
      damage_boost_pct: 10,         // Damage Boost + PvP Damage Boost
      crit_hit: 600,                // Critical Hit + PvP Critical Hit
      accuracy: 400,                // Accuracy + Accuracy Bonus + PvP Accuracy (PvE Accuracy does nothing against players)
      crit_damage_boost_pct: 5,     // on top of the base 1.25x
      hp: 15000,
      defense: 6000,                // Defense + PvP Defense
      tolerance_pct: 15,            // Damage Tolerance + PvP Damage Tolerance
      crit_resist: 300,             // Critical Hit Resist + PvP Critical Hit Resist
      evasion: 150,                 // Evasion + PvP Evasion
      block: 0,                     // Block + PvP Block; 0 unless you carry a shield
      crit_damage_tolerance_pct: 3,
      // --- how PvP works: community figures ---
      crit_cap_pct: 50,
      crit_base: 1.25,              // a PvP crit before Critical Damage Boost
      crit_pct_per_point: 0.06,     // crit chance per point of Critical Hit over the target's Resist
      evade_pct_per_point: 0.06,    // chance to be evaded per point the target's Evasion is over your Accuracy
      evade_cap_pct: 30,
      block_pct_per_point: 0.06,    // chance to be blocked per point of the target's Block over your Accuracy
      block_loss_pct: 50,
      defense_factor: 0.05,         // share of Defense taken off a hit in PvP: sources say 0.01, 0.05 or 0.1
      status_chance_value: 0,       // what 1% Status Effect Chance is worth to you, as % damage (0 = not counted)
      status_resist_value: 0,       // what 1% Status Effect Resist is worth to you, as % survival (0 = not counted)
    },
    // Opponents. `opp` is the opponent's build; the mirror uses your own stats, the custom one is edited or loaded on the page.
    TARGETS: [
      { id: 'mirror', name: 'A player with your stats', note: 'Your opponent has exactly your stats, without your Azphel nodes. A fair default when you have nobody particular in mind.' },
    ],
    // a fighter as the formula sees it: the build plus the Azphel stats of a set of nodes
    side(b, stats) {
      const g = k => stats[k] || 0;
      return { attack: b.attack + g('PvP Attack'), boost: b.damage_boost_pct + g('PvP Damage Boost'), tol: b.tolerance_pct + g('PvP Damage Tolerance'),
        defense: b.defense + g('PvP Defense'), crit: b.crit_hit + g('PvP Critical Hit'), critRes: b.crit_resist + g('PvP Critical Hit Resist'),
        acc: b.accuracy + g('PvP Accuracy'), eva: b.evasion + g('PvP Evasion'), block: b.block, cdb: b.crit_damage_boost_pct, cdt: b.crit_damage_tolerance_pct };
    },
    // one hit of a 100% skill from `a` on `d` (two sides), with the PvP rules in p
    duel(a, d, p) {
      const attack = a.attack, afterDef = Math.max(0, attack - p.defense_factor * d.defense);
      const bucket = Math.max(0.05, 1 + (a.boost - d.tol) / 100);
      const critRate = clamp((a.crit - d.critRes) * p.crit_pct_per_point, 0, p.crit_cap_pct) / 100;
      const evaded = clamp((d.eva - a.acc) * p.evade_pct_per_point, 0, p.evade_cap_pct) / 100;
      const shield = d.block > 0 ? clamp((d.block - a.acc) * p.block_pct_per_point, 0, 80) / 100 : 0;
      const normal = afterDef * bucket, crit = normal * Math.max(1, p.crit_base + (a.cdb - d.cdt) / 100);
      const average = (normal + critRate * (crit - normal)) * (1 - evaded) * (1 - shield * p.block_loss_pct / 100);
      return { attack, afterDef, bucket, critRate, blocked: evaded, shield, normal, crit, average };
    },
    opp: (b, t) => (t && t.opp ? Object.assign({}, b, t.opp) : b),  // the opponent's stats, under your PvP rules
    hit(stats, b, t) { return AZPHEL.duel(AZPHEL.side(b, stats), AZPHEL.side(AZPHEL.opp(b, t), {}), b); },      // you hitting them
    taken(stats, b, t) { return AZPHEL.duel(AZPHEL.side(AZPHEL.opp(b, t), {}), AZPHEL.side(b, stats), b); },    // them hitting you
    score(stats, b, t) {
      const g = k => stats[k] || 0;
      const dmg = AZPHEL.hit(stats, b, t).average / AZPHEL.hit({}, b, t).average * (1 + g('Status Effect Chance') * b.status_chance_value / 100);
      const safer = AZPHEL.taken({}, b, t).average / Math.max(1e-9, AZPHEL.taken(stats, b, t).average);
      return [dmg, (1 + g('HP') / b.hp) * safer * (1 + g('Status Effect Resist') * b.status_resist_value / 100)];
    },
  };
  // ---------------------------------------------------------------- Nezekan, Zikel, Vaizel, Triniel: the class boards
  // General stats, valued in PvE with the Ariel formula and encounters. Attack Bonus, Damage Boost and Critical Damage Boost go
  // into your own figures before the hit is worked out. Combat Speed, Cooldown Reduction and Multi-hit Chance have no place in
  // the one-hit formula, so each is worth what you say 1% of it is worth (My stats); the defaults are guesses.
  // Skill nodes are not scored at all: nobody can say what a skill level is worth to you. You tick the skills you want instead.
  // ponytail: Attack Bonus is added flat, not multiplied by your Attack Increase %; a few percent low for builds with a lot of it.
  const GENERAL = Object.assign({}, ARIEL, {
    DEFAULT_BUILD: Object.assign({}, ARIEL.DEFAULT_BUILD, { speed_value: 1, cooldown_value: 0.5, multihit_value: 0.5 }),
    fold(stats, b) {  // your build with the board's general stats added in
      const g = k => stats[k] || 0;
      return Object.assign({}, b, { attack: b.attack + g('Attack Bonus'), damage_boost_pct: b.damage_boost_pct + g('Damage Boost'), crit_damage_boost_pct: b.crit_damage_boost_pct + g('Critical Damage Boost') });
    },
    hit(stats, b, t) { return ARIEL.hit(stats, GENERAL.fold(stats, b), t); },
    score(stats, b, t) {
      const g = k => stats[k] || 0, e = ARIEL.env(b, t);
      const tempo = (1 + g('Combat Speed') * b.speed_value / 100) * (1 + g('Cooldown Reduction') * b.cooldown_value / 100) * (1 + g('Multi-hit Chance') * b.multihit_value / 100);
      const dmg = GENERAL.hit(stats, b, t).average / GENERAL.hit({}, b, t).average * tempo;
      // Critical Hit Resist, Critical Damage Tolerance and Multi-hit Resist are worth nothing here: bosses do not crit or multi-hit.
      const flat = 1 - 0.1 * g('Defense Bonus') / e.boss_hit, tol = 1 - g('Damage Tolerance') / 100 / (1 + (e.boss_damage_boost_pct - e.tolerance_pct) / 100);
      return [dmg, (1 + g('HP') / e.hp) / (flat * tol)];
    },
  });
  const MODELS = { ariel: ARIEL, azphel: AZPHEL };
  const CLASS_BOARDS = ['nezekan', 'zikel', 'vaizel', 'triniel'], CLASSES = Object.keys(SK);

  const POOL = 416;  // the four class boards are paid from one pool of Daevanion points

  // id 'class' is the four class boards as one board with four starts and one pool: a route is planned across all of them at once
  function make(id, cls) {
    const parts = id === 'class' ? CLASS_BOARDS : [id], M = MODELS[id] || GENERAL;
    cls = id === 'class' || CLASS_BOARDS.includes(id) ? (SK[cls] ? cls : CLASSES[0]) : '';
    // sub: which of the boards a node is on. A skill node gives one level of the skill behind it; the two-crystal ones are passives.
    const NODES = parts.flatMap((part, sub) => ALL[part].nodes.map(n => Object.assign({}, n, n.skill == null ? null : { fx: [[SK[cls][part][n.skill], 1, false]], isSkill: true }, { sub, board: part })))
      .map(n => Object.assign(n, { stat: n.fx.length ? n.fx[0][0] : 'Start', kind: n.fx.map(e => e[0]).join(' + ') }));
    const BOARD = id === 'class' ? { name: 'Class', nodes: NODES, total_cost: NODES.reduce((a, n) => a + n.cost, 0), pool: POOL } : ALL[id];
    const skills = [...new Set(NODES.filter(n => n.isSkill).map(n => n.stat))];  // a skill sits on several nodes
    const N = NODES.length;
    const key = (x, y, sub) => (x + 100 * (sub || 0)) + ',' + y;  // boards never touch: each is 100 columns away from the last
    const POS = new Map(NODES.map((n, i) => [key(n.x, n.y, n.sub), i]));
    const STARTS = NODES.map((n, i) => i).filter(i => !NODES[i].fx.length), START = STARTS[0];
    const base = set => { const r = new Set(set || []); for (const i of STARTS) r.add(i); return r; };  // every start is yours from the beginning
    const ADJ = NODES.map(n => [[1, 0], [-1, 0], [0, 1], [0, -1]]
      .map(([dx, dy]) => POS.get(key(n.x + dx, n.y + dy, n.sub))).filter(i => i !== undefined));
    const { DEFAULT_BUILD, TARGETS, hit } = M;
    const score = (stats, b, t) => M.score(stats, b, t || TARGETS[0]);

    // what a set of nodes gives, every effect of every node: {stat: total}
    function totals(chosen) {
      const t = {};
      for (const i of chosen) for (const [stat, value] of NODES[i].fx) t[stat] = (t[stat] || 0) + value;
      return t;
    }

    function rng32(a) {  // mulberry32: seeded so the same inputs always give the same route
      return () => {
        let t = (a += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    // Best connected set containing START whose new nodes cost <= crystals. With `allowed`, only those nodes may be used.
    // On a spanning tree this is an exact knapsack (take a node, or skip its whole subtree).
    // The board is a grid, not a tree, so we try many random spanning trees; each new tree
    // keeps the current answer intact, so the answer only ever improves.
    // ponytail: randomised search, not a proof of optimality. The self-test brute-forces small
    // budgets, and at these settings it matched an exact MILP in 240/240 runs up to 60 crystals
    // (at 240 rounds / restart every 40 it missed ~20%, by at most 2% of the gain).
    // The four class boards together are 2.5 times the nodes and twice the budget, so they get fewer rounds for the same waiting time.
    function solve(crystals, weights, owned, allowed, rounds = Math.round(clamp(53e6 / (N * (crystals + 1)), 300, 1500))) {
      const rand = rng32(1);
      owned = base(owned);
      const cost = NODES.map((n, i) => (owned.has(i) ? 0 : n.cost));
      const w = NODES.map((n, i) => (owned.has(i) ? 1e3 : weights[i] - 1e-9 * cost[i]));  // tie-break: cheaper
      const B = crystals, value = set => { let v = 0; for (const i of set) v += w[i]; return v; };
      let best = owned, bestVal = value(owned), cur = owned;
      for (let it = 0; it < rounds; it++) {
        if (it % 4 === 0) cur = owned;  // frequent fresh starts: 4 improving trees, then a new random one
        // random spanning tree that grows through `cur` first
        const kids = NODES.map(() => []), seen = new Set(STARTS), hot = [], cold = [];
        const push = u => { for (const v of ADJ[u]) if (!seen.has(v) && (!allowed || allowed.has(v))) (cur.has(u) && cur.has(v) ? hot : cold).push([u, v]); };
        for (const st of STARTS) push(st);
        while (hot.length || cold.length) {
          let e;
          if (hot.length) e = hot.pop();
          else { const k = Math.floor(rand() * cold.length); e = cold[k]; cold[k] = cold[cold.length - 1]; cold.pop(); }
          if (seen.has(e[1])) continue;
          seen.add(e[1]); kids[e[0]].push(e[1]); push(e[1]);
        }
        const pre = [], end = new Array(N), stack = STARTS.map(st => [st, false]);
        while (stack.length) {
          const [u, done] = stack.pop();
          if (done) { end[u] = pre.length; continue; }
          pre.push(u); stack.push([u, true]);
          for (const k of kids[u]) stack.push([k, false]);
        }
        // f[i][b]: best value from preorder position i onward with b crystals left
        const M = pre.length, f = new Array(M + 1);  // fewer than N when the search is kept inside `allowed`
        f[M] = new Float64Array(B + 1);
        for (let i = M - 1; i >= 0; i--) {
          const u = pre[i], c = cost[u], skip = f[end[u]], take = f[i + 1], row = Float64Array.from(skip);
          for (let b = c; b <= B; b++) { const t = w[u] + take[b - c]; if (t > row[b]) row[b] = t; }
          f[i] = row;
        }
        const got = new Set(owned);
        for (let i = 0, b = B; i < M;) {
          const u = pre[i], c = cost[u];
          if (b >= c && w[u] + f[i + 1][b - c] > f[end[u]][b]) { got.add(u); b -= c; i++; } else i = end[u];
        }
        cur = got;
        const val = value(cur);
        if (val > bestVal) { best = cur; bestVal = val; }
      }
      return best;
    }


    // ponytail: each node's gain on top of `base`, summed linearly. plan() re-solves once around
    // its own answer so the crit cap / shrinking returns are priced in; leftover cross terms are <0.1%.
    function nodeWeights(build, mix, base, t) {
      const t0 = totals(base || []), [d0, e0] = score(t0, build, t);
      return NODES.map(n => {
        const s = Object.assign({}, t0);
        for (const [stat, value] of n.fx) s[stat] = (s[stat] || 0) + value;
        const [d, e] = score(s, build, t);
        return mix[0] * Math.log(d / d0) + mix[1] * Math.log(e / e0);
      });
    }

    // Buy order: always adjacent to what you hold, best payoff per crystal first.
    function order(chosen, owned, weights) {
      const have = base(owned), seq = [];
      while (have.size < chosen.size) {
        const path = new Map([...have].map(h => [h, []])), queue = [...have];
        for (const u of queue) for (const v of ADJ[u]) if (chosen.has(v) && !path.has(v)) { path.set(v, path.get(u).concat(v)); queue.push(v); }
        let best = null, bestKey = null;
        for (const p of path.values()) {
          if (!p.length) continue;
          const c = p.reduce((a, i) => a + NODES[i].cost, 0), g = p.reduce((a, i) => a + (weights ? weights[i] : 1), 0);
          const k = [g / c, -c, -p[p.length - 1]];
          if (!best || k[0] > bestKey[0] || (k[0] === bestKey[0] && (k[1] > bestKey[1] || (k[1] === bestKey[1] && k[2] > bestKey[2])))) { best = p; bestKey = k; }
        }
        if (!best) break;  // the rest is not connected to what you hold
        for (const i of best) { have.add(i); seq.push(i); }
      }
      return seq;
    }

    // The cheapest way, in crystals, to join `target` to a board that already holds START: the nodes to buy, target last.
    // Ties go to the path with fewer nodes. Used when a plan is built by hand and a far node is clicked.
    function pathTo(have, target) {
      have = base(have);
      if (have.has(target)) return [];
      const dist = NODES.map(() => [Infinity, Infinity]), prev = [], todo = new Set(NODES.keys());
      const less = (a, b) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);
      for (const i of have) dist[i] = [0, 0];
      while (todo.size) {
        let u = -1; for (const i of todo) if (u < 0 || less(dist[i], dist[u])) u = i;
        todo.delete(u);
        if (u === target) break;
        for (const v of ADJ[u]) { const d = [dist[u][0] + NODES[v].cost, dist[u][1] + 1]; if (less(d, dist[v])) { dist[v] = d; prev[v] = u; } }
      }
      const path = [];
      for (let v = target; !have.has(v); v = prev[v]) path.unshift(v);
      return path;
    }

    const connected = set => order(base(set)).length === base(set).size - STARTS.length;
    const spent = (set, owned) => [...set].reduce((a, i) => a + (owned && owned.has(i) ? 0 : NODES[i].cost), 0);

    // opt.must: skills (class boards) the route has to reach; they are worth more than any stat, so they go in first.
    // opt.later: crystals you expect on top of these. The route is then the best board for the larger total, and the crystals
    // you have now are spent inside it, so nothing bought today ever has to be reset. `later` reports the price of that:
    // {chosen: the board at the larger total, seq: what to buy after today's nodes, loss: goal value given up today}.
    function plan(crystals, build, goal, owned, t, opt) {
      // points the goal has no use for are not wasted: they go to skill levels first, then to the other side of the goal
      const mix = GOALS[goal].map(v => v || 1e-5), must = new Set((opt && opt.must) || []), more = (opt && opt.later) || 0;
      owned = base(owned);
            const weigh = from => nodeWeights(build, mix, from, t).map((v, i) => v + (!NODES[i].isSkill ? 0 : must.has(NODES[i].stat) ? 10 : 1e-4));
      const w = weigh(owned);
      const obj = c => { const s = score(totals(c), build, t); let v = mix[0] * Math.log(s[0]) + mix[1] * Math.log(s[1]); for (const i of c) if (NODES[i].isSkill && must.has(NODES[i].stat)) v += 10; return v; };
      const best = (budget, allowed) => {
        let chosen = solve(budget, w, owned, allowed);
        // second pass: value nodes at the midpoint of the first answer (halves the linearisation error)
        const seq = order(chosen, owned, w);
        const again = solve(budget, weigh([...owned, ...seq.slice(0, seq.length >> 1)]), owned, allowed);
        return obj(again) > obj(chosen) ? again : chosen;
      };
      if (!(more > 0)) { const chosen = best(crystals); return { chosen, seq: order(chosen, owned, w) }; }
      const final = best(crystals + more), chosen = best(crystals, final), seq = order(chosen, owned, w);
      return { chosen, seq, later: { chosen: final, seq: order(final, chosen, w), loss: Math.max(0, obj(best(crystals)) - obj(chosen)) } };
    }

    // Two ways a player might spend the same crystals without a planner, to compare against plan().
    function baselines(crystals, build, goal, owned, t) {
      const mix = GOALS[goal], start = base(owned);
      const frontier = have => [...new Set([...have].flatMap(h => ADJ[h]))].filter(i => !have.has(i));
      // 1. always buy the neighbouring node that is worth most per crystal
      const greedy = new Set(start);
      for (let left = crystals; ;) {
        const w = nodeWeights(build, mix, greedy, t);
        const next = frontier(greedy).filter(i => NODES[i].cost <= left).sort((a, b) => w[b] / NODES[b].cost - w[a] / NODES[a].cost || NODES[a].cost - NODES[b].cost || a - b)[0];
        if (next === undefined) break;
        greedy.add(next); left -= NODES[next].cost;
      }
      // 2. walk the cheapest path to the single most valuable node, again and again
      const rush = new Set(start);
      for (let left = crystals; ;) {
        const w = nodeWeights(build, mix, rush, t), dist = NODES.map(() => Infinity), prev = [], todo = new Set(NODES.keys());
        for (const i of rush) dist[i] = 0;
        while (todo.size) {  // Dijkstra on node cost
          let u = -1; for (const i of todo) if (u < 0 || dist[i] < dist[u]) u = i;
          todo.delete(u);
          for (const v of ADJ[u]) if (dist[u] + NODES[v].cost < dist[v]) { dist[v] = dist[u] + NODES[v].cost; prev[v] = u; }
        }
        const goalNode = NODES.map((_, i) => i).filter(i => !rush.has(i) && dist[i] <= left && w[i] > 0).sort((a, b) => w[b] - w[a] || dist[a] - dist[b] || a - b)[0];
        if (goalNode === undefined) break;
        left -= dist[goalNode];
        for (let v = goalNode; !rush.has(v); v = prev[v]) rush.add(v);
      }
      return [{ name: 'Always buy the best neighbouring node', chosen: greedy }, { name: 'Walk straight to the most valuable nodes', chosen: rush }];
    }

    // What one node of each kind is worth on top of `base`: [{kind, fx, costs, damage, ehp}] (damage/ehp as fractions).
    // A kind is what the node gives, so the two-stat green nodes are kinds of their own.
    function nodeTypes(build, base, t) {
      const t0 = totals(base || []), [d0, e0] = score(t0, build, t), rows = new Map();
      for (const n of NODES) {
        if (!n.fx.length) continue;
        if (!rows.has(n.kind)) {
          const s = Object.assign({}, t0);
          for (const [stat, value] of n.fx) s[stat] = (s[stat] || 0) + value;
          const [d, e] = score(s, build, t);
          rows.set(n.kind, { kind: n.kind, fx: n.fx, costs: new Set(), damage: d / d0 - 1, ehp: e / e0 - 1 });
        }
        rows.get(n.kind).costs.add(n.cost);
      }
      return [...rows.values()].map(r => ({ ...r, costs: [...r.costs].sort() }));
    }

    return { id, cls, skills, skillMeta: (cls && META[cls]) || {}, BOARD, NODES, START, STARTS, base, POS, ADJ, DEFAULT_BUILD, GOALS, TARGETS, model: M, totals, hit, score, solve, plan, order, spent, pathTo, baselines, nodeTypes, connected };
  }

  function selftest() {
    const assert = require('assert'), close = (x, y) => assert(Math.abs(x - y) < 1e-9, x + ' != ' + y);
    // ---- Ariel
    const A = make('ariel'), { NODES, START, POS, ADJ, totals, score, hit, plan, order, spent, pathTo, baselines, nodeTypes, connected } = A;
    // fixed numbers so the checks below do not move when the defaults do
    const b = Object.assign({}, A.DEFAULT_BUILD, { attack: 5000, damage_boost_pct: 80, crit_hit: 600, accuracy: 700, crit_damage_boost_pct: 30, hp: 30000, tolerance_pct: 20, boss_tolerance_pct: 20 });
    const all = NODES.map((_, i) => i);
    assert(NODES.length === 153 && spent(all) === 232 && A.BOARD.total_cost === 232);
    assert(connected(all), 'board is not connected under 4-neighbour adjacency');
    const full = totals(all);
    assert(full['PvE Attack'] === 72 && full['PvE Defense'] === 720 && full['PvE Damage Boost'] === 6 && full['Critical Hit'] === 40, 'Ariel totals');
    assert(NODES.filter(n => n.fx.length === 2).length === 24, 'the 24 green nodes give two stats each');
    assert.deepStrictEqual(score({}, b), [1, 1]);
    close(score({ 'PvE Damage Boost': 1.6 }, b)[0], 1.01);  // +1.6% on a 1.6x bucket (80% boost - 20% boss tolerance) = +1%
    close(score({ 'Critical Hit': 9999 }, b)[0], score({ 'Critical Hit': 150 }, b)[0]);  // crit cap
    close(score({ 'Boss Defense': 400 }, b)[1], 1 / 0.99);  // 400 def = 40 dmg off a 4000 hit
    const L = { acc: 1200, crit: 1700 }, h = hit({}, b, L);
    close(h.normal, 5000 * 1.6); close(h.crit, 8000 * 1.55);        // 1.5 + 30% - 25%
    close(h.critRate, 0); close(h.blocked, 0.5);                    // 600 crit is 1,100 short of 1,700; 700 accuracy is 500 short of 1,200
    close(hit({ 'PvE Accuracy': 100, 'Critical Hit': 800 }, b, L).critRate, 0.2);     // 1,400 is 300 short: 50% - 30%
    close(hit({ 'PvE Accuracy': 100 }, b, L).average, 8000 * (1 - 0.4 * 0.5));
    close(hit({}, b, { acc: 0, crit: 0, over: { boss_defense: 1000, boss_tolerance_pct: 0 } }).normal, 4900 * 1.8);  // an encounter's own boss numbers
    for (const x of baselines(20, b, 'dps', [], L)) assert(spent(x.chosen) <= 20 && connected(x.chosen), x.name);
    assert(score(totals(plan(20, b, 'dps', [], L).chosen), b, L)[0] >= Math.max(...baselines(20, b, 'dps', [], L).map(x => score(totals(x.chosen), b, L)[0])) - 1e-9);
    assert(nodeTypes(b, [], L).length === 17);                                     // 14 single kinds and 3 two-stat kinds
    assert.deepStrictEqual(pathTo([], POS.get('7,6')), [POS.get('7,6')]);          // a neighbour of the start is its own path
    const far = pathTo([], POS.get('0,0'));                                        // a corner: connected, ends there, and no cheaper way exists
    assert(far[far.length - 1] === POS.get('0,0') && connected(far));
    const seenAt = new Map(), walk = [[START, 0]];
    while (walk.length) { const [u, c] = walk.pop(); if (seenAt.has(u) && seenAt.get(u) <= c) continue; seenAt.set(u, c); for (const v of ADJ[u]) walk.push([v, c + NODES[v].cost]); }
    assert(spent(far) === seenAt.get(POS.get('0,0')), 'pathTo is not the cheapest path');
    assert.deepStrictEqual(pathTo(far, POS.get('0,0')), []);
    const everything = score(totals(all), b), got = score(totals(plan(232, b, 'balanced').chosen), b);
    close(got[0], everything[0]); close(got[1], everything[1]);  // full budget gets everything worth anything
    let prev = 0;
    for (const c of [0, 1, 10, 40]) {
      const p = plan(c, b, 'dps');
      assert(spent(p.chosen) <= c && p.seq.length === p.chosen.size - 1);  // in budget, connected
      const d = score(totals(p.chosen), b)[0];
      assert(d >= prev); prev = d;
    }
    const withOwned = plan(10, b, 'tank', [POS.get('7,6')]);
    assert(withOwned.chosen.has(POS.get('7,6')) && spent(withOwned.chosen) <= 10 + NODES[POS.get('7,6')].cost);
    // 10 crystals, dps: brute force every connected set to check the search really finds the best
    let best = 1; const seenSets = new Set(), stack = [[[START], 0]];
    while (stack.length) {
      const [s, c] = stack.pop(), sid = s.slice().sort((x, y) => x - y).join();
      if (seenSets.has(sid)) continue;
      seenSets.add(sid); best = Math.max(best, score(totals(s), b)[0]);
      for (const j of new Set(s.flatMap(u => ADJ[u]))) if (!s.includes(j) && c + NODES[j].cost <= 10) stack.push([s.concat(j), c + NODES[j].cost]);
    }
    close(score(totals(plan(10, b, 'dps').chosen), b)[0], best);

    // ---- Azphel
    const Z = make('azphel'), zb = Object.assign({}, Z.DEFAULT_BUILD, { attack: 3000, damage_boost_pct: 30, tolerance_pct: 10, defense: 4000, crit_hit: 800, crit_resist: 300,
      accuracy: 400, evasion: 500, block: 0, crit_damage_boost_pct: 25, crit_damage_tolerance_pct: 5, hp: 20000, defense_factor: 0.05 });
    const zall = Z.NODES.map((_, i) => i), zt = Z.totals(zall), mirror = Z.TARGETS[0];
    assert(Z.NODES.length === 153 && Z.spent(zall) === 232 && Z.connected(zall));
    assert(zt['PvP Attack'] === 72 && zt['PvP Damage Boost'] === 6 && zt['PvP Critical Hit'] === 120 && zt['Status Effect Chance'] === 8, 'Azphel totals');
    const zh = Z.hit({}, zb, mirror);
    close(zh.afterDef, 3000 - 0.05 * 4000); close(zh.bucket, 1.2);          // 30% boost - 10% tolerance
    close(zh.critRate, 0.3); close(zh.blocked, 0.06);                        // (800 - 300) x 0.06%; (500 evasion - 400 accuracy) x 0.06%
    close(zh.crit, zh.normal * (1.25 + 0.20));                               // 1.25 + 25% - 5%
    close(zh.average, (zh.normal + 0.3 * (zh.crit - zh.normal)) * 0.94);
    assert.deepStrictEqual(Z.score({}, zb, mirror), [1, 1]);
    close(Z.score({ 'PvP Damage Boost': 1.2 }, zb, mirror)[0], 1.01);        // +1.2% on a 1.2x bucket
    close(Z.score({ 'PvP Damage Tolerance': 1.2 }, zb, mirror)[1], 1.2 / 1.188);  // the opponent's bucket drops from 1.2 to 1.188
    assert(Z.score({ 'PvP Evasion': 72 }, zb, mirror)[1] > 1 && Z.score({ 'PvP Accuracy': 100 }, zb, mirror)[0] > 1);
    assert(Z.score({ 'PvP Accuracy': 9999 }, zb, mirror)[0] === Z.score({ 'PvP Accuracy': 100 }, zb, mirror)[0]);  // past their Evasion, Accuracy is wasted
    const tough = { id: 'x', opp: { tolerance_pct: 30, crit_resist: 9999 } };  // an opponent of their own
    close(Z.hit({}, zb, tough).bucket, 1.0); close(Z.hit({}, zb, tough).critRate, 0);
    const zp = Z.plan(30, zb, 'dps', [], mirror);
    assert(Z.spent(zp.chosen) <= 30 && Z.connected(zp.chosen) && Z.score(Z.totals(zp.chosen), zb, mirror)[0] > 1);
    // ---- planning toward a later total: today's nodes sit inside the later board, and cost nothing extra to reach it
    const lp = plan(15, b, 'dps', [], L, { later: 40 });
    assert(spent(lp.chosen) <= 15 && connected(lp.chosen) && spent(lp.later.chosen) <= 55 && lp.later.loss >= 0);
    for (const i of lp.chosen) assert(lp.later.chosen.has(i), 'a node bought today is not on the later board');
    assert(lp.seq.length + lp.later.seq.length === lp.later.chosen.size - 1);

    // ---- a class board: general stats, and skills you ask for
    const N = make('nezekan', 'cleric'), nb = N.DEFAULT_BUILD, nall = N.NODES.map((_, i) => i);
    assert(N.NODES.length === 89 && N.spent(nall) === 134 && N.connected(nall) && N.skills.length === 17 && N.NODES.filter(n => n.isSkill).length === 22);
    assert(make('triniel', 'gladiator').spent(make('triniel').NODES.map((_, i) => i)) === 168 && make('nezekan', 'nobody').cls === CLASSES[0]);
    assert.deepStrictEqual(N.score({}, nb), [1, 1]);
    close(N.hit({ 'Attack Bonus': 100 }, nb, N.TARGETS[0]).attack, nb.attack + 100);
    close(N.score({ 'Combat Speed': 3 }, nb)[0], 1.03); close(N.score({ 'Healing Light': 1, MP: 500, 'Critical Hit Resist': 50 }, nb)[0], 1);
    close(N.score({ 'Damage Boost': 1 }, nb)[0], 1 + 0.01 / (1 + (nb.damage_boost_pct - nb.boss_tolerance_pct) / 100));
    const want = ['Healing Light', 'Bolt'], np = N.plan(30, nb, 'dps', [], N.TARGETS[0], { must: want });
    assert(N.spent(np.chosen) <= 30 && N.connected(np.chosen) && want.every(s => [...np.chosen].some(i => N.NODES[i].stat === s)), 'the route misses a wanted skill');
    // ---- the four class boards as one: four starts, one pool
    const K = make('class', 'cleric'), kall = K.NODES.map((_, i) => i);
    assert(K.NODES.length === 384 && K.STARTS.length === 4 && K.BOARD.total_cost === 570 && K.BOARD.pool === 416 && K.connected(kall) && K.skills.length === 22);
    for (const n of K.NODES) if (n.isSkill) assert(K.skillMeta[n.stat] && (n.cost === 2) === K.skillMeta[n.stat].endsWith('|p'), 'passives cost 2, actives 3: ' + n.stat);
    assert(!K.connected([K.POS.get('103,2')]) && K.pathTo([], K.POS.get('307,6')).every(i => K.NODES[i].sub === 3), 'boards only join at their own start');
    const kp = K.plan(416, K.DEFAULT_BUILD, 'balanced', [], K.TARGETS[0], { must: ['Bolt'] });
    assert(K.spent(kp.chosen) <= 416 && K.connected(kp.chosen) && kp.seq.length === kp.chosen.size - 4 && new Set(kp.seq.map(i => K.NODES[i].sub)).size === 4);
    assert(K.NODES.filter(n => n.stat === 'Bolt').every(n => kp.chosen.has(K.NODES.indexOf(n))), 'a wanted skill is taken on every board');
    console.log('selftest ok');
  }

  // the board comes from the address (?board=zikel&class=ranger); the class, for the class boards, falls back to the last one used
  const pick = () => {
    const q = new URLSearchParams(location.search), b = q.get('board'), id = CLASS_BOARDS.includes(b) ? 'class' : b === 'class' || BOARDS[b] ? b : 'ariel';  // the old address of one class board leads to all four
    let cls = q.get('class'); try { cls = cls || localStorage.getItem('daevanion-class'); } catch (e) {}
    return make(id, cls);
  };
  if (typeof module !== 'undefined') { module.exports = Object.assign(make('ariel'), { make, CLASSES, CLASS_BOARDS }); if (require.main === module) selftest(); }
  else root.Planner = Object.assign(pick(), { make, CLASSES, CLASS_BOARDS });
})(this);
