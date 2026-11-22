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
    crit_chance_pct: 30,        // effective crit chance against the boss
    crit_cap_pct: 50,           // Global cap (KR guides say 80)
    crit_damage_boost_pct: 5,   // on top of the base 1.5x
    hp: 15000,
    tolerance_pct: 15,          // your Damage Tolerance + PvE + Boss Damage Tolerance
    // --- not readable in game: guesses ---
    boss_tolerance_pct: 0,      // boss's Damage Tolerance, subtracted from your boost bucket
    boss_crit_dmg_resist_pct: 25,
    boss_hit: 4000,             // typical boss hit before your Defense
    boss_damage_boost_pct: 50,  // boss's own Damage Boost
    crit_pct_per_point: 1 / 15,       // 1200 Critical Hit over the target's resist = 80%
    accuracy_dps_pct_per_point: 0,    // 0 = bosses never block/parry you
    evasion_pct_per_point: 0,         // 0 = ignore PvE Evasion (no reliable data)
  };
  const GOALS = { dps: [1, 0], tank: [0, 1], balanced: [0.5, 0.5] };

  function totals(chosen) {
    const t = {};
    for (const i of chosen) if (i !== START) t[NODES[i].stat] = (t[NODES[i].stat] || 0) + NODES[i].value;
    return t;
  }

  // -> [damage dealt multiplier, effective-HP multiplier] against a PvE boss, relative to no board
  function score(stats, b) {
    const g = k => stats[k] || 0;
    // damage = (attack bracket + PvE Atk + Boss Atk) x (1 + boost bucket - boss tolerance) x crit x hit
    const atk = 1 + (g('PvE Attack') + g('Boss Attack')) / b.attack;
    const bucket0 = 1 + (b.damage_boost_pct - b.boss_tolerance_pct) / 100;
    const boost = 1 + (g('PvE Damage Boost') + g('Boss Damage Boost')) / 100 / bucket0;
    const critBonus = (50 + b.crit_damage_boost_pct - b.boss_crit_dmg_resist_pct) / 100;
    const p0 = Math.min(b.crit_chance_pct, b.crit_cap_pct) / 100;
    const p1 = Math.min(b.crit_chance_pct + g('Critical Hit') * b.crit_pct_per_point, b.crit_cap_pct) / 100;
    const crit = (1 + p1 * critBonus) / (1 + p0 * critBonus);
    const acc = 1 + g('PvE Accuracy') * b.accuracy_dps_pct_per_point / 100;
    // damage taken = (boss hit - 0.1 x Defense) x (1 + boss boost - your tolerance) x (1 - evade)
    // Critical Hit Resist and MP are worth nothing here: bosses do not crit.
    const flat = 1 - 0.1 * (g('PvE Defense') + g('Boss Defense')) / b.boss_hit;
    const tb0 = 1 + (b.boss_damage_boost_pct - b.tolerance_pct) / 100;
    const tol = 1 - (g('PvE Damage Tolerance') + g('Boss Damage Tolerance')) / 100 / tb0;
    const eva = 1 - g('PvE Evasion') * b.evasion_pct_per_point / 100;
    return [atk * boost * crit * acc, (1 + g('HP') / b.hp) / (flat * tol * eva)];
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
  function nodeWeights(build, mix, base) {
    const t0 = totals(base || []), [d0, e0] = score(t0, build);
    return NODES.map(n => {
      const s = Object.assign({}, t0); s[n.stat] = (s[n.stat] || 0) + n.value;
      const [d, e] = score(s, build);
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

  function plan(crystals, build, goal, owned) {
    const mix = GOALS[goal];
    owned = new Set(owned || []).add(START);
    const w = nodeWeights(build, mix, owned);
    let chosen = solve(crystals, w, owned);
    // second pass: value nodes at the midpoint of the first answer (halves the linearisation error)
    const seq = order(chosen, owned, w);
    const again = solve(crystals, nodeWeights(build, mix, [...owned, ...seq.slice(0, seq.length >> 1)]), owned);
    const obj = c => { const s = score(totals(c), build); return mix[0] * Math.log(s[0]) + mix[1] * Math.log(s[1]); };
    if (obj(again) > obj(chosen)) chosen = again;
    const before = score(totals(owned), build), after = score(totals(chosen), build);
    return { chosen, seq: order(chosen, owned, w), damage: after[0] / before[0] - 1, ehp: after[1] / before[1] - 1 };
  }

  function selftest() {
    const assert = require('assert'), close = (x, y) => assert(Math.abs(x - y) < 1e-9, x + ' != ' + y);
    // fixed numbers so the checks below do not move when the defaults do
    const b = Object.assign({}, DEFAULT_BUILD, { attack: 5000, damage_boost_pct: 80, crit_chance_pct: 40, crit_damage_boost_pct: 30, hp: 30000, tolerance_pct: 20 });
    const all = NODES.map((_, i) => i), spent = c => [...c].reduce((a, i) => a + NODES[i].cost, 0);
    assert(N === 153 && spent(all) === 232 && BOARD.total_cost === 232);
    assert(connected(all), 'board is not connected under 4-neighbour adjacency');
    assert.deepStrictEqual(score({}, b), [1, 1]);
    close(score({ 'PvE Damage Boost': 1.8 }, b)[0], 1.01);  // +1.8% on a 1.8x bucket = +1%
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

  const api = { NODES, START, POS, ADJ, DEFAULT_BUILD, GOALS, totals, score, plan, connected };
  if (typeof module !== 'undefined') { module.exports = api; if (require.main === module) selftest(); }
  else root.Planner = api;
})(this);
