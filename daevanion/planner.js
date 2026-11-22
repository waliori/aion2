// Ariel board route planner: the maths. Used by index.html; `node planner.js` runs the self-test.
// Formulas and sources: ../README.md
(function (root) {
  const BOARD = typeof ARIEL_BOARD !== 'undefined' ? ARIEL_BOARD : require('./board.js');
  const NODES = BOARD.nodes, N = NODES.length;
  const key = (x, y) => x + ',' + y;
  const POS = new Map(NODES.map((n, i) => [key(n.x, n.y), i]));
  const START = NODES.findIndex(n => n.stat === 'Start');
  const ADJ = NODES.map(n => [[1, 0], [-1, 0], [0, 1], [0, -1]]
    .map(([dx, dy]) => POS.get(key(n.x + dx, n.y + dy))).filter(i => i !== undefined));

  // Your character WITHOUT any Ariel nodes. Every number changes which route is best:
  // the board's stats have diminishing returns against what you already have.
  const DEFAULT_BUILD = {
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
    boss_tolerance_pct: 20,     // boss's Damage Tolerance, subtracted from your boost bucket (KR community reference value)
    boss_defense: 0,            // boss's Defense: takes a flat 0.1 x Defense off every hit. Never measured, so 0
    boss_crit_dmg_resist_pct: 25,
    boss_hit: 4000,             // typical boss hit before your Defense
    boss_damage_boost_pct: 50,  // boss's own Damage Boost
    evasion_pct_per_point: 0,   // 0 = ignore PvE Evasion (no reliable data)
  };
  const GOALS = { dps: [1, 0], tank: [0, 1], balanced: [0.5, 0.5] };
  // Encounters. NCsoft publishes no boss stats; these are Global player measurements from Aion 2 Maps
  // (aion2maps.com/guides/accuracy-and-crit, 16 Nov 2026: one Ranger's fight logs plus Global parses).
  // acc: Accuracy (Accuracy + Accuracy Bonus + PvE Accuracy) where parries stop; the top of the measured range, 0 = no check.
  // crit: Critical Hit that reaches the 50% cap, about the boss's Critical Hit Resist + 500; 0 = not measured.
  // over: optional boss numbers for this encounter that replace the boss_* guesses in the build (used by the custom encounter).
  const TARGETS = [
    { id: 'open', name: 'Open world and normal dungeons', acc: 0, crit: 0, note: 'Bosses here do not block you. No Critical Hit figure is measured, so crit chance is estimated from your rating.' },
    { id: 't4', name: 'Transcendence tier 4', acc: 1075, crit: 1420, note: 'Crit cap at about 1,420 Critical Hit. Parries stop between 800 and 1,075 Accuracy depending on the boss; the plan uses 1,075.' },
    { id: 'hardmid', name: 'Conquest hard, mid-bosses', acc: 1000, crit: 1415, note: 'Crit cap at 1,405 to 1,425 Critical Hit. Parries stop between 800 and 1,000 Accuracy; the plan uses 1,000.' },
    { id: 'hardfinal', name: 'Conquest hard, final bosses', acc: 1075, crit: 1540, note: 'Crit cap at 1,525 to 1,555 Critical Hit. Parries stop at about 925 Accuracy, 1,075 on Transcendent Bakarma; the plan uses 1,075.' },
    { id: 'fire', name: 'Fire Temple hard', acc: 1050, crit: 1600, note: 'Crit cap at 1,590 to 1,610 Critical Hit. Parries stop between 800 and 1,050 Accuracy; the plan uses 1,050.' },
    { id: 'horn', name: 'Ferocious Horn Den hard', acc: 1125, crit: 1600, note: 'Crit cap at 1,590 to 1,610 Critical Hit. Parries stop between 800 and 1,125 Accuracy; the plan uses 1,125.' },
    { id: 'ludramid', name: 'Ludra hard, mid-bosses', acc: 0, crit: 1630, note: 'Crit cap at 1,615 to 1,650 Critical Hit. These bosses almost never parry.' },
    { id: 'ludra', name: 'Eternal Ludra, normal and hard', acc: 1180, crit: 1800, note: 'Crit cap at 1,750 to 1,850 Critical Hit. Parries stop at about 1,100 Accuracy, rarely up to 1,180; the plan uses 1,180.' },
  ];
  const env = (b, t) => (t && t.over ? Object.assign({}, b, t.over) : b);  // the build with this encounter's boss numbers

  function totals(chosen) {
    const t = {};
    for (const i of chosen) if (i !== START) t[NODES[i].stat] = (t[NODES[i].stat] || 0) + NODES[i].value;
    return t;
  }

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  // One hit of a 100% skill against target t, in real numbers.
  function hit(stats, b, t) {
    b = env(b, t);
    const g = k => stats[k] || 0;
    const attack = b.attack + g('PvE Attack') + g('Boss Attack');
    const bucket = 1 + (b.damage_boost_pct + g('PvE Damage Boost') + g('Boss Damage Boost') - b.boss_tolerance_pct) / 100;
    const rating = b.crit_hit + g('Critical Hit'), acc = b.accuracy + g('PvE Accuracy');
    // measured encounters: 10% crit per 100 rating short of the figure that reaches the cap
    const critRate = clamp(t.crit ? b.crit_cap_pct - (t.crit - rating) * 0.1 : rating * b.crit_pct_per_point, 0, b.crit_cap_pct) / 100;
    const blocked = t.acc ? clamp((t.acc - acc) * b.block_pct_per_point, 0, 80) / 100 : 0;
    const normal = Math.max(0, attack - 0.1 * b.boss_defense) * bucket, crit = normal * (1.5 + (b.crit_damage_boost_pct - b.boss_crit_dmg_resist_pct) / 100);
    const average = (normal + critRate * (crit - normal)) * (1 - blocked * b.block_loss_pct / 100);
    return { attack, bucket, critRate, blocked, normal, crit, average };
  }

  // -> [damage dealt multiplier, effective-HP multiplier] against target t, relative to no board
  function score(stats, b, t) {
    t = t || TARGETS[0];
    const g = k => stats[k] || 0;
    const dmg = hit(stats, b, t).average / hit({}, b, t).average;
    b = env(b, t);
    // damage taken = (boss hit - 0.1 x Defense) x (1 + boss boost - your tolerance) x (1 - evade)
    // Critical Hit Resist and MP are worth nothing here: bosses do not crit.
    const flat = 1 - 0.1 * (g('PvE Defense') + g('Boss Defense')) / b.boss_hit;
    const tb0 = 1 + (b.boss_damage_boost_pct - b.tolerance_pct) / 100;
    const tol = 1 - (g('PvE Damage Tolerance') + g('Boss Damage Tolerance')) / 100 / tb0;
    const eva = 1 - g('PvE Evasion') * b.evasion_pct_per_point / 100;
    return [dmg, (1 + g('HP') / b.hp) / (flat * tol * eva)];
  }

  function rng32(a) {  // mulberry32: seeded so the same inputs always give the same route
    return () => {
      let t = (a += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Best connected set containing START whose new nodes cost <= crystals.
  // On a spanning tree this is an exact knapsack (take a node, or skip its whole subtree).
  // The board is a grid, not a tree, so we try many random spanning trees; each new tree
  // keeps the current answer intact, so the answer only ever improves.
  // ponytail: randomised search, not a proof of optimality. The self-test brute-forces small
  // budgets, and at these settings it matched an exact MILP in 240/240 runs up to 60 crystals
  // (at 240 rounds / restart every 40 it missed ~20%, by at most 2% of the gain).
  function solve(crystals, weights, owned, rounds = 1500) {
    const rand = rng32(1);
    owned = new Set(owned).add(START);
    const cost = NODES.map((n, i) => (owned.has(i) ? 0 : n.cost));
    const w = NODES.map((n, i) => (owned.has(i) ? 1e3 : weights[i] - 1e-9 * cost[i]));  // tie-break: cheaper
    const B = crystals, value = set => { let v = 0; for (const i of set) v += w[i]; return v; };
    let best = owned, bestVal = value(owned), cur = owned;
    for (let it = 0; it < rounds; it++) {
      if (it % 4 === 0) cur = owned;  // frequent fresh starts: 4 improving trees, then a new random one
      // random spanning tree that grows through `cur` first
      const kids = NODES.map(() => []), seen = new Set([START]), hot = [], cold = [];
      const push = u => { for (const v of ADJ[u]) if (!seen.has(v)) (cur.has(u) && cur.has(v) ? hot : cold).push([u, v]); };
      push(START);
      while (hot.length || cold.length) {
        let e;
        if (hot.length) e = hot.pop();
        else { const k = Math.floor(rand() * cold.length); e = cold[k]; cold[k] = cold[cold.length - 1]; cold.pop(); }
        if (seen.has(e[1])) continue;
        seen.add(e[1]); kids[e[0]].push(e[1]); push(e[1]);
      }
      const pre = [], end = new Array(N), stack = [[START, false]];
      while (stack.length) {
        const [u, done] = stack.pop();
        if (done) { end[u] = pre.length; continue; }
        pre.push(u); stack.push([u, true]);
        for (const k of kids[u]) stack.push([k, false]);
      }
      // f[i][b]: best value from preorder position i onward with b crystals left
      const f = new Array(N + 1);
      f[N] = new Float64Array(B + 1);
      for (let i = N - 1; i >= 0; i--) {
        const u = pre[i], c = cost[u], skip = f[end[u]], take = f[i + 1], row = Float64Array.from(skip);
        for (let b = c; b <= B; b++) { const t = w[u] + take[b - c]; if (t > row[b]) row[b] = t; }
        f[i] = row;
      }
      const got = new Set(owned);
      for (let i = 0, b = B; i < N;) {
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
      const s = Object.assign({}, t0); s[n.stat] = (s[n.stat] || 0) + n.value;
      const [d, e] = score(s, build, t);
      return mix[0] * Math.log(d / d0) + mix[1] * Math.log(e / e0);
    });
  }

  // Buy order: always adjacent to what you hold, best payoff per crystal first.
  function order(chosen, owned, weights) {
    const have = new Set(owned || []).add(START), seq = [];
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

  const connected = set => order(new Set(set).add(START)).length === new Set(set).add(START).size - 1;

  const spent = (set, owned) => [...set].reduce((a, i) => a + (owned && owned.has(i) ? 0 : NODES[i].cost), 0);

  function plan(crystals, build, goal, owned, t) {
    const mix = GOALS[goal];
    owned = new Set(owned || []).add(START);
    const w = nodeWeights(build, mix, owned, t);
    let chosen = solve(crystals, w, owned);
    // second pass: value nodes at the midpoint of the first answer (halves the linearisation error)
    const seq = order(chosen, owned, w);
    const again = solve(crystals, nodeWeights(build, mix, [...owned, ...seq.slice(0, seq.length >> 1)], t), owned);
    const obj = c => { const s = score(totals(c), build, t); return mix[0] * Math.log(s[0]) + mix[1] * Math.log(s[1]); };
    if (obj(again) > obj(chosen)) chosen = again;
    return { chosen, seq: order(chosen, owned, w) };
  }

  // Two ways a player might spend the same crystals without a planner, to compare against plan().
  function baselines(crystals, build, goal, owned, t) {
    const mix = GOALS[goal], start = new Set(owned || []).add(START);
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

  // What one node of each kind is worth on top of `base`: [{stat, value, pct, costs, damage, ehp}] (damage/ehp as fractions)
  function nodeTypes(build, base, t) {
    const t0 = totals(base || []), [d0, e0] = score(t0, build, t), rows = new Map();
    for (const n of NODES) {
      if (n.stat === 'Start') continue;
      if (!rows.has(n.stat)) {
        const s = Object.assign({}, t0); s[n.stat] = (s[n.stat] || 0) + n.value;
        const [d, e] = score(s, build, t);
        rows.set(n.stat, { stat: n.stat, value: n.value, pct: n.pct, costs: new Set(), damage: d / d0 - 1, ehp: e / e0 - 1 });
      }
      rows.get(n.stat).costs.add(n.cost);
    }
    return [...rows.values()].map(r => ({ ...r, costs: [...r.costs].sort() }));
  }

  function selftest() {
    const assert = require('assert'), close = (x, y) => assert(Math.abs(x - y) < 1e-9, x + ' != ' + y);
    // fixed numbers so the checks below do not move when the defaults do
    const b = Object.assign({}, DEFAULT_BUILD, { attack: 5000, damage_boost_pct: 80, crit_hit: 600, accuracy: 700, crit_damage_boost_pct: 30, hp: 30000, tolerance_pct: 20, boss_tolerance_pct: 20 });
    const all = NODES.map((_, i) => i);
    assert(N === 153 && spent(all) === 232 && BOARD.total_cost === 232);
    assert(connected(all), 'board is not connected under 4-neighbour adjacency');
    assert.deepStrictEqual(score({}, b), [1, 1]);
    const L = { acc: 1200, crit: 1700 }, h = hit({}, b, L);
    close(h.normal, 5000 * 1.6); close(h.crit, 8000 * 1.55);        // 1.5 + 30% - 25%
    close(h.critRate, 0); close(h.blocked, 0.5);                    // 600 crit is 1,100 short of 1,700; 700 accuracy is 500 short of 1,200
    close(hit({ 'PvE Accuracy': 100, 'Critical Hit': 800 }, b, L).critRate, 0.2);     // 1,400 is 300 short: 50% - 30%
    close(hit({ 'PvE Accuracy': 100 }, b, L).average, 8000 * (1 - 0.4 * 0.5));
    close(hit({}, b, { acc: 0, crit: 0, over: { boss_defense: 1000, boss_tolerance_pct: 0 } }).normal, 4900 * 1.8);  // custom boss numbers
    for (const x of baselines(20, b, 'dps', [], L)) assert(spent(x.chosen) <= 20 && connected(x.chosen), x.name);
    assert(score(totals(plan(20, b, 'dps', [], L).chosen), b, L)[0] >= Math.max(...baselines(20, b, 'dps', [], L).map(x => score(totals(x.chosen), b, L)[0])) - 1e-9);
    assert(nodeTypes(b, [], L).length === 14);
    close(score({ 'PvE Damage Boost': 1.6 }, b)[0], 1.01);  // +1.6% on a 1.6x bucket (80% boost - 20% boss tolerance) = +1%
    close(score({ 'Critical Hit': 9999 }, b)[0], score({ 'Critical Hit': 150 }, b)[0]);  // crit cap
    close(score({ 'Boss Defense': 400 }, b)[1], 1 / 0.99);  // 400 def = 40 dmg off a 4000 hit
    const full = score(totals(all), b), got = score(totals(plan(232, b, 'balanced').chosen), b);
    close(got[0], full[0]); close(got[1], full[1]);  // full budget gets everything worth anything
    let prev = 0;
    for (const c of [0, 1, 10, 40]) {
      const p = plan(c, b, 'dps');
      assert(spent(p.chosen) <= c && p.seq.length === p.chosen.size - 1);  // in budget, connected
      const d = score(totals(p.chosen), b)[0];
      assert(d >= prev); prev = d;
    }
    const withOwned = plan(10, b, 'tank', [POS.get('7,6')]);
    assert(withOwned.chosen.has(POS.get('7,6')) && spent(withOwned.chosen) <= 11);
    // 10 crystals, dps: brute force every connected set to check the search really finds the best
    let best = 1; const seenSets = new Set(), stack = [[[START], 0]];
    while (stack.length) {
      const [s, c] = stack.pop(), id = s.slice().sort((x, y) => x - y).join();
      if (seenSets.has(id)) continue;
      seenSets.add(id); best = Math.max(best, score(totals(s), b)[0]);
      for (const j of new Set(s.flatMap(h => ADJ[h]))) if (!s.includes(j) && c + NODES[j].cost <= 10) stack.push([s.concat(j), c + NODES[j].cost]);
    }
    close(score(totals(plan(10, b, 'dps').chosen), b)[0], best);
    console.log('selftest ok');
  }

  const api = { NODES, START, POS, ADJ, DEFAULT_BUILD, GOALS, TARGETS, totals, hit, score, plan, order, spent, baselines, nodeTypes, connected };
  if (typeof module !== 'undefined') { module.exports = api; if (require.main === module) selftest(); }
  else root.Planner = api;
})(this);
