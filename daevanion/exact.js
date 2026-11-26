// The exact route: not a search that may miss, but a sweep that looks at every possible board.
//
// 1. sweep(): for node values that simply add up, the best connected board through the start is found exactly. The grid is
//    read cell by cell; for every shape the sweep line can have (which of its cells are taken, and which of those are already
//    joined to each other and to the start) it keeps the best value for every number of crystals spent. Nothing is skipped
//    unless a plain upper bound shows it cannot beat a board already known.
// 2. prove(): the real objective does not simply add up (Attack, crit and boosts multiply). It is a sum of curves, one per
//    pile of stats. Each curve is capped from above by a straight line, which turns the objective into node values that add
//    up: the sweep's answer for those values is a ceiling no board can pass. The best real board found is the floor.
//    When floor and ceiling meet, the board is proven best; otherwise the gap between them is the proven margin.
(function (root) {
  const NEG = -Infinity, DONE = 31;

  // cells[y * W + x] = { cost, w, root } or undefined. Returns { best[b]: best value with exactly b crystals (-Infinity if none),
  // pick(b): the cells of that board } or null when the table would not fit in memory.
  // floor: a value known to be reachable; entries that cannot reach it are dropped (pass -Infinity to keep every budget).
  // tail[r]: the most everything outside this board (the other class boards) can add with r crystals; the pool is tail.length - 1.
  function sweep(cells, W, H, B, floor, onRow, limit, tail) {
    const P = W * H, B1 = B + 1, T = tail ? tail.length - 1 : B;
    // rest[p][r]: the most the cells from p on, and everything outside the board, could add with r crystals if they did not have to be joined
    const rest = new Array(P + 1); rest[P] = tail ? Float64Array.from(tail) : new Float64Array(T + 1);
    for (let p = P - 1; p >= 0; p--) {
      const c = cells[p], row = Float64Array.from(rest[p + 1]);
      if (c && !c.root && c.w > 0) for (let r = c.cost; r <= T; r++) { const v = rest[p + 1][r - c.cost] + c.w; if (v > row[r]) row[r] = v; }
      rest[p] = row;
    }
    const comp = new Uint8Array(W + 1), out = new Uint8Array(W + 1), map = new Uint8Array(32);

    // One pass over cells p0..p1-1 from the given layer. Every `every` cells the entries are numbered (state * B1 + crystals)
    // and each entry remembers which numbered entry it came from, so the board can be read back without keeping every layer.
    function run(p0, p1, layer, every, prune) {
      let { keys, names, vals, org, lo, hi } = layer; const marks = [];
      for (let p = p0; p < p1; p++) {
        if ((p - p0) % every === 0) {
          // checkpoint: remember where each live entry came from, then number them afresh
          const ids = [], from = [];
          for (let k = 0; k < names.length; k++) for (let b = lo[k]; b <= hi[k]; b++) if (vals[k * B1 + b] > NEG) { ids.push(k * B1 + b); from.push(org[k * B1 + b]); org[k * B1 + b] = k * B1 + b; }
          marks.push({ p, names, ids: Int32Array.from(ids), from: Int32Array.from(from) });
          if (onRow && every === W) onRow(p / W, H, names.length);
        }
        const c = p % W, cell = cells[p], lim = rest[p + 1], nk = new Map(), nn = [];
        let cap = Math.max(256, Math.ceil(names.length * 1.25)), nv = new Float64Array(cap * B1), no = new Int32Array(cap * B1), nlo = new Int16Array(cap), nhi = new Int16Array(cap), n = 0;
        const put = (shift, w, k0) => {
          const off = k0 * B1, a = lo[k0], z = Math.min(hi[k0], B - shift);
          if (prune) { let any = false; for (let b = a; b <= z; b++) if (vals[off + b] + w + lim[T - b - shift] >= floor) { any = true; break; } if (!any) return; }
          // labels in order of first appearance, so the same shape always has the same name
          if (out[W] !== DONE) {
            map.fill(0); let next = 1;
            for (let i = 0; i < W; i++) { const l = out[i]; if (l) { if (!map[l]) map[l] = next++; out[i] = map[l]; } }
            out[W] = out[W] ? map[out[W]] : 0;
          }
          const key = String.fromCharCode.apply(null, out); let k = nk.get(key);
          if (k === undefined) {
            k = n++; nk.set(key, k); nn.push(key);
            if (n > cap) {
              cap = Math.ceil(cap * 1.5); if (cap * B1 > limit) throw new Error('too big');
              const g = new Float64Array(cap * B1); g.set(nv); nv = g; const h = new Int32Array(cap * B1); h.set(no); no = h;
              const l2 = new Int16Array(cap); l2.set(nlo); nlo = l2; const h2 = new Int16Array(cap); h2.set(nhi); nhi = h2;
            }
            nv.fill(NEG, k * B1, (k + 1) * B1); nlo[k] = B1; nhi[k] = -1;
          }
          const to = k * B1 + shift;
          for (let b = a; b <= z; b++) {
            const v = vals[off + b] + w;
            if (v > nv[to + b] && (!prune || v + lim[T - b - shift] >= floor)) { nv[to + b] = v; no[to + b] = org[off + b]; if (b + shift < nlo[k]) nlo[k] = b + shift; if (b + shift > nhi[k]) nhi[k] = b + shift; }
          }
        };
        for (let k0 = 0; k0 < names.length; k0++) {
          if (hi[k0] < lo[k0]) continue;
          const key = names[k0]; for (let i = 0; i <= W; i++) comp[i] = key.charCodeAt(i);
          const up = comp[c], left = c > 0 ? comp[c - 1] : 0, rootLab = comp[W];
          if (rootLab === DONE) { if (!cell || !cell.root) { out.set(comp); put(0, 0, k0); } continue; }  // the board is closed: nothing more is taken
          if (!cell || !cell.root) {  // leave the cell out
            out.set(comp); out[c] = 0;
            let alive = !up; if (up) for (let i = 0; i < W; i++) if (out[i] === up) { alive = true; break; }
            if (alive) put(0, 0, k0);
            else if (up === rootLab) {  // the start's group leaves the line: fine if it was the only one
              let other = false; for (let i = 0; i < W; i++) if (out[i]) { other = true; break; }
              if (!other) { out[W] = DONE; put(0, 0, k0); }
            }  // any other group that leaves the line without reaching the start is lost
          }
          if (cell) {  // take the cell
            out.set(comp);
            if (up && left && up !== left) { for (let i = 0; i < W; i++) if (out[i] === left) out[i] = up; if (rootLab === left) out[W] = up; }
            out[c] = up || left || 30;
            if (cell.root) out[W] = out[c];
            put(cell.root ? 0 : cell.cost, cell.root ? 0 : cell.w, k0);
          }
        }
        keys = nk; names = nn; vals = nv; org = no; lo = nlo; hi = nhi;
      }
      return { layer: { keys, names, vals, org, lo, hi }, marks };
    }
    const first = () => { const vals = new Float64Array(B1).fill(NEG); vals[0] = 0; const key = '\0'.repeat(W + 1); return { keys: new Map([[key, 0]]), names: [key], vals, org: new Int32Array(B1), lo: Int16Array.of(0), hi: Int16Array.of(0) }; };
    const whole = k => { if (k.charCodeAt(W) === DONE) return true; const r = k.charCodeAt(W); if (!r) return false; for (let i = 0; i < W; i++) { const l = k.charCodeAt(i); if (l && l !== r) return false; } return true; };

    let main;
    try { main = run(0, P, first(), W, floor > NEG); } catch (e) { if (e.message === 'too big') return null; throw e; }
    const end = main.layer, best = new Float64Array(B1).fill(NEG), at = new Int32Array(B1).fill(-1);
    for (let k = 0; k < end.names.length; k++) if (whole(end.names[k])) for (let b = end.lo[k]; b <= end.hi[k]; b++) if (end.vals[k * B1 + b] > best[b]) { best[b] = end.vals[k * B1 + b]; at[b] = k; }

    const find = (mark, id) => { let a = 0, z = mark.ids.length - 1; while (a < z) { const m = (a + z) >> 1; if (mark.ids[m] < id) a = m + 1; else z = m; } return mark.from[a]; };
    function pick(b) {
      if (at[b] < 0) return null;
      // the numbered entry at the start of each row, last row first
      const rows = main.marks.length, ends = new Array(rows + 1);
      ends[rows] = { key: end.names[at[b]], b };
      let id = end.org[at[b] * B1 + b];
      for (let r = rows - 1; r >= 0; r--) { const m = main.marks[r]; ends[r] = { key: m.names[(id / B1) | 0], b: id % B1 }; id = find(m, id); }
      // each row again on its own, from its known first entry to its known last one, numbering every cell
      const taken = [];
      for (let r = 0; r < rows; r++) {
        const s = ends[r], e = ends[r + 1], vals = new Float64Array(B1).fill(NEG); vals[s.b] = 0;
        const seg = run(r * W, (r + 1) * W, { keys: new Map([[s.key, 0]]), names: [s.key], vals, org: new Int32Array(B1), lo: Int16Array.of(s.b), hi: Int16Array.of(s.b) }, 1, false);
        let cur = seg.layer.org[seg.layer.keys.get(e.key) * B1 + e.b], bNow = e.b;
        for (let c = W - 1; c >= 0; c--) {
          const m = seg.marks[c], bBefore = cur % B1, cell = cells[r * W + c];
          if (cell && (cell.root || bNow > bBefore)) taken.push(r * W + c);
          bNow = bBefore; cur = find(m, cur);
        }
      }
      return taken;
    }
    return { best, pick, loose: rest[0] };
  }

  // Exact best board for node values w that add up, on one board or on the four class boards sharing a pool.
  // allowed: nodes that may be used (others are never taken). Returns { set, value } or null when it does not fit in memory.
  function linear(P, w, B, allowed, floor, post) {
    const parts = P.STARTS.map((st, sub) => {
      const ns = P.NODES.map((n, i) => i).filter(i => P.NODES[i].sub === sub && (!allowed || allowed.has(i) || i === st));
      const xs = ns.map(i => P.NODES[i].x), ys = ns.map(i => P.NODES[i].y), x0 = Math.min(...xs), y0 = Math.min(...ys), W = Math.max(...xs) - x0 + 1, H = Math.max(...ys) - y0 + 1;
      const cells = [], back = [];
      for (const i of ns) { const p = (P.NODES[i].y - y0) * W + P.NODES[i].x - x0; cells[p] = { cost: P.NODES[i].cost, w: w[i], root: i === st }; back[p] = i; }
      return { cells, back, W, H, y0, cap: Math.min(B, ns.reduce((a, i) => a + (i === st ? 0 : P.NODES[i].cost), 0)) };
    });
    // what each board could add if its nodes did not have to be joined, and the same for several boards together
    const loose = part => { let row = new Float64Array(B + 1); for (const c of part.cells) if (c && !c.root && c.w > 0) { const n = Float64Array.from(row); for (let r = c.cost; r <= B; r++) { const v = row[r - c.cost] + c.w; if (v > n[r]) n[r] = v; } row = n; } return row; };
    const join = (x, y) => { const z = new Float64Array(B + 1).fill(NEG); for (let i = 0; i <= B; i++) if (x[i] > NEG) for (let j = 0; i + j <= B; j++) { const v = x[i] + y[j]; if (v > z[i + j]) z[i + j] = v; } for (let i = 1; i <= B; i++) if (z[i - 1] > z[i]) z[i] = z[i - 1]; return z; };
    const after = [new Float64Array(B + 1)]; for (let k = parts.length - 1; k > 0; k--) after.unshift(join(after[0], loose(parts[k])));  // boards k+1.. together
    const curves = [], choice = []; let tab = [new Float64Array(B + 1)];
    for (const [k, part] of parts.entries()) {
      // the boards already swept are known exactly, the ones to come only by their loose bound
      const r = sweep(part.cells, part.W, part.H, part.cap, floor, (row, rows, states) => post && post({ type: 'scan', board: k, boards: parts.length, row, rows, y: part.y0 + row, states }), 4e7, parts.length > 1 ? join(tab[k], after[k]) : undefined);
      if (!r) return null;
      curves.push(r);
      // split the pool between the boards: tab[k][b] = best value of the first k boards with at most b crystals
      const prev = tab[k], cur = new Float64Array(B + 1).fill(NEG), ch = new Int16Array(B + 1).fill(-1);
      for (let b = 0; b <= B; b++) for (let u = 0; u <= Math.min(b, part.cap); u++) { const v = prev[b - u] + r.best[u]; if (v > cur[b]) { cur[b] = v; ch[b] = u; } }
      tab.push(cur); choice.push(ch);
    }
    if (!(tab[curves.length][B] > NEG)) return { set: null, value: NEG };  // nothing reaches the floor
    const set = new Set(P.STARTS); let b = B;
    for (let k = curves.length - 1; k >= 0; k--) { const u = choice[k][b]; for (const p of curves[k].pick(u)) set.add(parts[k].back[p]); b -= u; }
    return { set, value: tab[curves.length][B] };
  }

  // The real objective of a board, and the pieces needed to cap it by node values that add up.
  function objective(P, build, goal, t, opt) {
    const mix = P.GOALS[goal].map(v => v || 1e-5), must = new Set((opt && opt.must) || []);
    const bonus = P.NODES.map(n => (!n.isSkill ? 0 : must.has(n.stat) ? 10 : 1e-4));  // skills: wanted ones first, the others only break ties
    const F = s => { const [d, e] = P.score(s, build, t); return mix[0] * Math.log(d) + mix[1] * Math.log(e); };
    const G = set => { let v = F(P.totals(set)); for (const i of set) v += bonus[i]; return v; };
    return { F, G, bonus };
  }

  // Which stats the score depends on, the totals each can reach, and which of them act together (found by trying every pair
  // of reachable totals: stats that never change each other's effect are scored by separate curves).
  function structure(P, F, allowed) {
    const reach = {};
    for (const [i, n] of P.NODES.entries()) if (!allowed || allowed.has(i)) for (const [stat, v] of n.fx) (reach[stat] = reach[stat] || []).push(v);
    const stats = Object.keys(reach).filter(s => { const all = reach[s].reduce((a, v) => a + v, 0); return Math.abs(F({ [s]: all })) > 1e-13 || Math.abs(F({ [s]: reach[s][0] })) > 1e-13; });
    const sums = {};
    for (const s of stats) { let set = new Set([0]); for (const v of reach[s]) for (const u of [...set]) set.add(Math.round((u + v) * 1e6) / 1e6); sums[s] = [...set].sort((a, b) => a - b); }
    const group = Object.fromEntries(stats.map(s => [s, s])), top = s => (group[s] === s ? s : (group[s] = top(group[s])));
    for (let a = 0; a < stats.length; a++) for (let b = a + 1; b < stats.length; b++) {
      const j = stats[a], k = stats[b]; if (top(j) === top(k)) continue;
      const fj = sums[j].map(u => F({ [j]: u })), fk = sums[k].map(u => F({ [k]: u }));
      scan: for (let x = 0; x < fj.length; x++) for (let y = 0; y < fk.length; y++) if (Math.abs(F({ [j]: sums[j][x], [k]: sums[k][y] }) - fj[x] - fk[y]) > 1e-11) { group[top(j)] = top(k); break scan; }
    }
    const groups = {}; for (const s of stats) (groups[top(s)] = groups[top(s)] || []).push(s);
    // every pile's curve, on every combination of totals its stats can reach: pts[q] = totals, val[q] = objective
    const piles = Object.values(groups).map(g => {
      const size = g.reduce((n, s) => n * sums[s].length, 1); if (size > 4e5) return null;
      const pts = new Float64Array(size * g.length), val = new Float64Array(size), cur = {}; let q = 0;
      (function walk(d) { if (d === g.length) { for (let i = 0; i < g.length; i++) pts[q * g.length + i] = cur[g[i]]; val[q++] = F(cur); return; } for (const u of sums[g[d]]) { cur[g[d]] = u; walk(d + 1); } })(0);
      return { stats: g, pts, val, size };
    });
    return { piles, sums };
  }

  // Straight-line caps of the objective inside a box of totals (box[stat] = [lowest, highest], missing = any), fitted around
  // the totals `at` (moved to the nearest reachable totals in the box): slope[stat] and a constant C with
  //   F(totals) <= C + sum(slope[stat] * total)   for every reachable combination of totals in the box.
  // Each pile's line is lowered as far as it goes while staying above its whole curve, so it touches the curve at the current
  // totals whenever the curve allows it; `lift` is what is left when it does not (a curve that bends upward, or two stats
  // that multiply). Null if a pile is too big to check.
  function cap(F, S, at, box) {
    const slope = {}, snapped = {}, lifts = []; let C = 0, parts = 0;
    for (const pile of S.piles) {
      if (!pile) return null;
      const g = pile.stats, d = g.length, { pts, val, size } = pile, p = new Float64Array(d), a = new Float64Array(d);
      const range = g.map(s => (box && box[s]) || [-Infinity, Infinity]), lists = g.map((s, i) => S.sums[s].filter(v => v >= range[i][0] - 1e-9 && v <= range[i][1] + 1e-9));
      const inside = []; for (let q = 0; q < size; q++) { let ok = true; for (let i = 0; i < d; i++) { const v = pts[q * d + i]; if (v < range[i][0] - 1e-9 || v > range[i][1] + 1e-9) { ok = false; break; } } if (ok) inside.push(q); }
      for (let i = 0; i < d; i++) { const want = at[g[i]] || 0; p[i] = lists[i].reduce((b, v) => (Math.abs(v - want) < Math.abs(b - want) ? v : b), lists[i][0]); snapped[g[i]] = p[i]; }
      const here = Object.fromEntries(g.map((s, i) => [s, p[i]])), fp = F(here);
      for (let i = 0; i < d; i++) {  // a first slope: across the reachable totals on either side
        const k = lists[i].indexOf(p[i]), lo = lists[i][Math.max(0, k - 1)], hi = lists[i][Math.min(lists[i].length - 1, k + 1)];
        a[i] = hi > lo ? (F(Object.assign({}, here, { [g[i]]: hi })) - F(Object.assign({}, here, { [g[i]]: lo }))) / (hi - lo) : 0;
      }
      // tilt the line toward whichever point sticks out most, until nothing does (or as little as possible)
      let bestLift = Infinity; const bestA = Float64Array.from(a);
      for (let it = 0; it < 400; it++) {
        let worst = NEG, wq = 0;
        for (const q of inside) { let v = val[q] - fp; for (let i = 0; i < d; i++) v -= a[i] * (pts[q * d + i] - p[i]); if (v > worst) { worst = v; wq = q; } }
        if (worst < bestLift) { bestLift = worst; bestA.set(a); }
        if (worst < 1e-13) break;
        let n2 = 0; for (let i = 0; i < d; i++) n2 += (pts[wq * d + i] - p[i]) ** 2;
        for (let i = 0; i < d; i++) a[i] += worst * (pts[wq * d + i] - p[i]) / n2;
      }
      bestLift = Math.max(0, bestLift);
      let lin = 0; for (let i = 0; i < d; i++) { slope[g[i]] = bestA[i]; lin += bestA[i] * p[i]; }
      C += fp + bestLift - lin; parts += fp; lifts.push({ pile, lift: bestLift, lists, p });
    }
    return { slope, C, parts, at: snapped, lifts };
  }

  // The constant that goes with any slopes: how high the lines must sit to stay above every pile's curve in the box.
  function height(S, slope, box) {
    let C = 0;
    for (const pile of S.piles) {
      const g = pile.stats, d = g.length, { pts, val, size } = pile, range = g.map(s => (box && box[s]) || [-Infinity, Infinity]); let worst = NEG;
      for (let q = 0; q < size; q++) {
        let v = val[q], ok = true;
        for (let i = 0; i < d; i++) { const u = pts[q * d + i]; if (u < range[i][0] - 1e-9 || u > range[i][1] + 1e-9) { ok = false; break; } v -= slope[g[i]] * u; }
        if (ok && v > worst) worst = v;
      }
      C += worst;
    }
    return C;
  }

  // The proof. start: a board already known (the quick search's). post({type}) reports progress:
  //   scan: the sweep's row, better: a better board, margin: the proven margin so far,
  //   done: { set, gap } with gap the proven margin in objective units (0 = proven best, null = could not be checked).
  // The first cap covers every board. Where a pile's line cannot touch its curve, the totals are split into two boxes, each
  // with a tighter line of its own; a box is closed when its ceiling comes down to the best board known.
  function prove(P, build, goal, t, crystals, opt, start, post, budget) {
    const allowed = opt && opt.allowed, { F, G, bonus } = objective(P, build, goal, t, opt), S = structure(P, F, allowed);
    let best = new Set(start), bestG = G(best), sweeps = 0, fail = null;
    const until = Date.now() + ((budget && budget.ms) || 60000), maxSweeps = (budget && budget.sweeps) || 40, close = 1e-6;  // margins under a millionth are not worth more sweeps
    const inBox = (tot, box) => Object.keys(box).every(s => (tot[s] || 0) >= box[s][0] - 1e-9 && (tot[s] || 0) <= box[s][1] + 1e-9);
    // one box: cap it around the best board, sweep, and say how high a board in it can possibly score.
    // A cap can be flat where the real curve is not (crit past its limit, say), and its favourite board then scores less for
    // real than the cap says. The slopes are then moved toward the ones that fit that board, to the mix that would have given
    // the lowest ceiling over the boards seen so far, and the box is swept again.
    function ceilingOf(box) {
      const weights = slope => P.NODES.map((n, i) => bonus[i] + n.fx.reduce((a, [stat, v]) => a + (slope[stat] || 0) * v, 0));
      const lin = (w, set) => { let v = 0; for (const i of set) if (P.NODES[i].fx.length) v += w[i]; return v; };
      let c = cap(F, S, P.totals(best), box), out = Infinity;
      // the curves must add up to the real objective, or the cap proves nothing
      if (!c || Math.abs(c.parts - F(c.at)) > 1e-9) { fail = 'shape'; return null; }
      let slope = c.slope, C = c.C; const seen = [best];
      for (let again = 0; again < 5 && Date.now() < until; again++) {
        const w = weights(slope), at = P.totals(best);
        // only boards whose cap reaches the best known board matter; the best board itself is one of them when it is in the box
        const floor = Math.max(bestG - C, inBox(at, box) ? lin(w, best) : NEG) - 1e-9;
        sweeps++;
        const r = linear(P, w, crystals, allowed, floor, post);
        if (!r) { fail = 'size'; return null; }
        if (!r.set) { out = bestG; break; }  // nothing in reach: no board here beats the best one
        out = Math.min(out, C + r.value);
        post({ type: 'margin', margin: Math.max(0, Math.min(out, top) - bestG), part: true });
        const g = G(r.set);
        if (g > bestG + 1e-12) {
          best = r.set; bestG = g; post({ type: 'better', set: [...best] }); seen.push(best);
          if (!inBox(P.totals(best), box)) break;
          c = cap(F, S, P.totals(best), box); slope = c.slope; C = c.C; continue;  // cap again around the better board
        }
        if (out - bestG <= close) break;
        seen.push(r.set);
        const toward = cap(F, S, P.totals(r.set), box).slope; let pickC = C, pickS = null, low = out - 1e-10;
        for (let k = 1; k <= 32; k++) {
          const mix = {}; for (const st of Object.keys(slope)) mix[st] = slope[st] + (toward[st] - slope[st]) * k / 32;
          const h = height(S, mix, box), wm = weights(mix), guess = h + Math.max(...seen.map(x => lin(wm, x)));
          if (guess < low) { low = guess; pickS = mix; pickC = h; }
        }
        if (!pickS) break;
        slope = pickS; C = pickC;
      }
      return { ceil: Math.max(out, bestG), c };
    }
    // split the box where its worst pile bends: at the best board's total if that is inside the range, else in the middle
    function split(box, c) {
      const worst = c.lifts.reduce((a, b) => (b.lift > a.lift ? b : a));
      if (worst.lift < 1e-10) return null;
      let pick = null;
      worst.pile.stats.forEach((s, i) => {
        const list = worst.lists[i]; if (list.length < 3) return;
        const k = list.indexOf(worst.p[i]), cut = k > 0 && k < list.length - 1 ? k : list.length >> 1;
        const halves = [[list[0], list[cut]], [list[cut], list[list.length - 1]]].map(r => Object.assign({}, box, { [s]: r }));
        // how much of the lift is left in the worse half
        const left = Math.max(...halves.map(h => { const x = cap(F, { piles: [worst.pile], sums: S.sums }, c.at, h); return x ? x.lifts[0].lift : Infinity; }));
        if (!pick || left < pick.left) pick = { left, halves };
      });
      return pick && pick.left < worst.lift * 0.999 ? pick.halves : null;
    }
    let top = Infinity;  // the ceiling of the box being split: its halves cannot be higher
    const root = ceilingOf({});
    if (!root) return post({ type: 'done', set: [...best], gap: null, why: fail });
    let open = [{ box: {}, ceil: root.ceil, c: root.c }], closed = bestG;  // closed: the highest ceiling among boxes that cannot be split further
    const margin = () => Math.max(closed, ...open.map(o => o.ceil), bestG) - bestG;
    post({ type: 'margin', margin: margin() });
    while (open.length && margin() > close && sweeps < maxSweeps && Date.now() < until) {
      open.sort((x, y) => x.ceil - y.ceil);
      const top0 = open.pop();
      if (top0.ceil - bestG <= close) { closed = Math.max(closed, top0.ceil); continue; }
      const halves = split(top0.box, top0.c);
      if (!halves) { closed = Math.max(closed, top0.ceil); continue; }
      top = top0.ceil;
      for (const h of halves) {
        const r = ceilingOf(h);
        if (!r) { open.push(top0); return post({ type: 'done', set: [...best], gap: margin(), why: fail }); }
        open.push({ box: h, ceil: Math.min(r.ceil, top0.ceil), c: r.c });
      }
      post({ type: 'margin', margin: margin() });
    }
    post({ type: 'done', set: [...best], gap: margin() });
  }

  const api = { sweep, linear, prove, objective };
  // node exact.js: the sweep against a plain enumeration of every connected board, then a whole proof
  function selftest() {
    const assert = require('assert'), { make } = require('./planner.js');
    for (const [id, B] of [['ariel', 6], ['azphel', 6], ['class', 5]]) {
      const P = make(id, 'cleric'); let seed = 3; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
      const w = P.NODES.map(() => rnd()), all = new Map(), start = [...P.STARTS].sort((a, b) => a - b);
      // every connected board within B crystals: grow each board by one neighbouring node at a time
      (function grow(set, spent) {
        const key = [...set].sort((a, b) => a - b).join(); if (all.has(key)) return; all.set(key, spent);
        for (const u of set) for (const v of P.ADJ[u]) if (!set.has(v) && spent + P.NODES[v].cost <= B) grow(new Set([...set, v]), spent + P.NODES[v].cost);
      })(new Set(start), 0);
      const value = set => { let v = 0; for (const i of set) if (P.NODES[i].fx.length) v += w[i]; return v; };
      for (let b = 0; b <= B; b++) {
        let brute = 0; for (const [key, spent] of all) if (spent <= b) brute = Math.max(brute, value(key.split(',').map(Number)));
        const r = linear(P, w, b, undefined, NEG);
        assert(Math.abs(r.value - brute) < 1e-9 && Math.abs(value(r.set) - brute) < 1e-9 && P.connected(r.set) && P.spent(r.set) <= b, `${id} ${b}: sweep ${r.value}, enumeration ${brute}`);
        const cut = linear(P, w, b, undefined, brute - 1e-9);  // the same with everything below the best cut away
        assert(Math.abs(value(cut.set) - brute) < 1e-9, `${id} ${b}: the bound cut the best board away`);
      }
    }
    const A = make('ariel'), b = A.DEFAULT_BUILD, t = A.TARGETS[0];
    for (const goal of ['dps', 'balanced']) {
      const quick = A.plan(25, b, goal, [], t).chosen, { G } = objective(A, b, goal, t, {}); let done;
      prove(A, b, goal, t, 25, {}, [...quick], m => { if (m.type === 'done') done = m; }, { sweeps: 4 });
      const set = new Set(done.set);
      assert(done.gap != null && done.gap < 1e-4 && A.connected(set) && A.spent(set) <= 25 && G(set) >= G(quick) - 1e-12, 'proof failed for ' + goal);
    }
    console.log('exact ok');
  }
  if (typeof module !== 'undefined') { module.exports = api; if (require.main === module) selftest(); }
  else if (typeof document === 'undefined') {
    // as a worker: {id, cls, build, goal, target, crystals, later, must, avoid, start, startLater}
    importScripts('boards.js', 'planner.js');
    root.onmessage = e => {
      const m = e.data, P = root.Planner.make(m.id, m.cls), avoid = new Set(m.avoid || []);
      let allowed = avoid.size ? new Set(P.NODES.map((n, i) => i).filter(i => !avoid.has(P.NODES[i].stat))) : undefined;
      const post = (stage, x) => root.postMessage(Object.assign({ stage }, x));
      let later = null;
      if (m.later > 0) {  // the board at the larger total first; today's crystals are then spent inside it
        prove(P, m.build, m.goal, m.target, m.crystals + m.later, { must: m.must, allowed }, m.startLater, x => { if (x.type === 'done') later = x; post('later', x); });
        allowed = new Set(later.set);
      }
      prove(P, m.build, m.goal, m.target, m.crystals, { must: m.must, allowed }, m.start.every(i => allowed === undefined || allowed.has(i)) ? m.start : P.STARTS, x => post('now', x.type === 'done' ? Object.assign(x, { later }) : x));
    };
  } else root.Exact = api;
})(this);
