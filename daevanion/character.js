// Load a character from the official AION 2 (Global) API and turn it into planner stats.
// The API has no "final stats" endpoint, only gear, titles, boards and primary stats, so we add
// those up ourselves. It cannot see pets, wings, skill passives, buffs or class base stats:
// the result is a starting point to correct against your in-game stat sheet, not the truth.
(function (root) {
  const API = 'https://aion2.plaync.com/api/character';
  const SEARCH = 'https://api-search.plaync.com/aion2global/search/v2/character';
  const REGIONS = { eu: 'Europe', nae: 'North America East', naw: 'North America West', la: 'South America', as: 'Asia' };
  // Board ids are different for every class (Gladiator 11 to 16, Chanter 81 to 86, ...), so they are read
  // from the character, never hard-coded. The first four are the class boards, Ariel (PvE) is the fifth, Azphel (PvP) the sixth.
  const KIND = { 1: 'nezekan', 2: 'zikel', 3: 'vaizel', 4: 'triniel', 5: 'ariel', 6: 'azphel' };
  const boardList = info => ((info.daevanion && info.daevanion.boardList) || []).map(b => ({ id: b.id, kind: KIND[b.id % 10] || '' }));
  const openNodes = (info, boards, kind) => {
    const a = boardList(info).find(b => b.kind === kind);
    return ((a && boards[a.id] && boards[a.id].nodeList) || []).filter(n => n.open && (n.type === 'Stat' || n.type === 'SkillLevel')).map(n => [n.col - 1, n.row - 1]);
  };
  const num = v => parseFloat(String(v).replace(/[+,]/g, ''));

  // -> { flat: {name: sum}, pct: {name: sum}, weapon: average weapon Attack }, leaving out the board named in `skip`
  function collect(info, items, boards, skip) {
    const out = { flat: {}, pct: {}, weapon: 0 };
    const add = (name, v) => {
      const s = String(v), n = num(s), to = s.includes('%') ? out.pct : out.flat;
      if (isFinite(n)) to[name] = (to[name] || 0) + n;
    };
    const addDesc = d => { const m = /^(.+?) ([+-]?[\d.,]+%?)$/.exec(d || ''); if (m) add(m[1], m[2]); };  // "PvE Damage Boost +4.5%"
    const sets = new Set();
    for (const it of items) {
      for (const s of it.mainStats || []) {
        if (s.minValue != null) { out.weapon += (num(s.minValue) + num(s.value)) / 2 + (num(s.extra) || 0); continue; }  // weapon range
        add(s.name, s.value);
        if (num(s.extra)) add(s.name, String(s.extra).replace('%', '') + (String(s.value).includes('%') ? '%' : ''));  // enchant bonus
      }
      for (const s of [...(it.subStats || []), ...(it.magicStoneStat || [])]) add(s.name, s.value);
      if (it.set && !sets.has(it.set.id)) {  // set bonus: highest tier reached, counted once per set
        sets.add(it.set.id);
        const tier = (it.set.bonuses || []).filter(b => b.degree <= it.set.equippedCount).pop();
        for (const d of (tier && tier.descriptions) || []) { const m = /^\+([\d.,]+%?) (.+?)(?: when .*)?$/.exec(d); if (m) add(m[2], m[1]); }
      }
    }
    for (const t of (info.title && info.title.titleList) || []) for (const s of [...(t.equipStatList || []), ...(t.statList || [])]) addDesc(s.desc);
    for (const b of boardList(info)) if (b.kind !== skip) for (const s of (boards[b.id] && boards[b.id].openStatEffectList) || []) addDesc(s.desc);
    for (const s of (info.stat && info.stat.statList) || []) for (const d of s.statSecondList || []) addDesc(d);  // "Attack increase +3.2%"
    return out;
  }

  // -> { build: values for the planner, parts: how Attack was added up, owned: [[x, y]] nodes already open on that board }
  // kind is the board being planned ('ariel' or 'azphel'). Its own nodes are left out of the build, because the planner adds
  // them itself; withBoard keeps them in, for an opponent, who fights with their board.
  function toBuild(info, items, boards, kind, withBoard) {
    kind = kind || 'ariel';
    const { flat, pct, weapon } = collect(info, items, boards, withBoard ? null : kind);  // null skips nothing
    const f = k => flat[k] || 0, p = k => pct[k] || 0, up = (v, k) => v * (1 + p(k) / 100), r2 = v => +v.toFixed(2);
    const base = up((weapon + f('Attack')) * (1 + p('Weapon Damage Boost') / 100) + f('Attack Bonus'), 'Attack increase');
    const crit = up(f('Critical Hit'), 'Critical Hit increase'), accuracy = up(f('Accuracy') + f('Accuracy Bonus'), 'Accuracy increase');
    const pvp = kind === 'azphel', extra = pvp ? f('PvP Attack') : f('PvE Attack') + f('Boss Attack');
    const build = !pvp ? {
      attack: Math.round(base + extra),
      damage_boost_pct: r2(p('Damage Boost') + p('PvE Damage Boost') + p('Boss Damage Boost')),
      tolerance_pct: r2(p('Damage Tolerance') + p('PvE Damage Tolerance') + p('Boss Damage Tolerance')),
      crit_damage_boost_pct: r2(p('Critical Damage Boost')),
      crit_hit: Math.round(crit),
      accuracy: Math.round(accuracy + f('PvE Accuracy')),
    } : {
      attack: Math.round(base + extra),
      damage_boost_pct: r2(p('Damage Boost') + p('PvP Damage Boost')),
      tolerance_pct: r2(p('Damage Tolerance') + p('PvP Damage Tolerance')),
      crit_damage_boost_pct: r2(p('Critical Damage Boost')),
      crit_damage_tolerance_pct: r2(p('Critical Damage Tolerance')),
      crit_hit: Math.round(crit + f('PvP Critical Hit')),
      crit_resist: Math.round(up(f('Critical Hit Resist'), 'Critical Hit Resist increase') + f('PvP Critical Hit Resist')),
      accuracy: Math.round(accuracy + f('PvP Accuracy')),
      evasion: Math.round(up(f('Evasion') + f('Evasion Bonus'), 'Evasion increase') + f('PvP Evasion')),
      block: Math.round(up(f('Block'), 'Block increase') + f('PvP Block')),
      defense: Math.round(up(f('Defense') + f('Defense Bonus'), 'Defense increase') + f('PvP Defense')),
    };
    // the pieces of the Attack figure, so the page can show its working
    const parts = { attack: build.attack, weapon: Math.round(weapon), lines: f('Attack'), weaponBoost: p('Weapon Damage Boost'), bonus: f('Attack Bonus'),
      increase: p('Attack increase'), flat: extra };
    return { build, parts, owned: openNodes(info, boards, kind) };  // for a class board the build is the PvE one
  }

  async function get(url) {
    const r = await fetch('/api?url=' + encodeURIComponent(url));
    if (r.status === 429) throw new Error('The AION 2 site is rate-limiting requests. Wait a minute and try again.');
    if (!r.ok) throw new Error(`The AION 2 site answered ${r.status}.`);
    return r.json();
  }

  // the servers of a region: [{serverId, serverName, raceId}] (raceId 1 = Elyos, 2 = Asmodians)
  async function servers(region) {
    return (await get(`https://aion2.plaync.com/en-us/api/gameinfo/servers?lang=en-US&region=${region}`)).serverList || [];
  }

  async function search(name, region, serverId) {
    const d = await get(`${SEARCH}?keyword=${encodeURIComponent(name)}&page=1&size=50&localeInfo=en-US&region=${region}&serverId=${serverId || ''}`);
    return (d.list || []).map(c => ({ ...c, name: c.name.replace(/<[^>]+>/g, ''), characterId: decodeURIComponent(c.characterId) }));
  }

  async function load(hit, onProgress) {
    const q = `lang=en-US&characterId=${encodeURIComponent(hit.characterId)}&serverId=${hit.serverId}&region=${hit.region}`;
    onProgress('Reading character…');
    const info = await get(`${API}/info?${q}`), equip = await get(`${API}/equipment?${q}`);
    const list = (equip.equipment && equip.equipment.equipmentList) || [], items = [], boards = {};
    for (let k = 0; k < list.length; k += 4) {  // 4 at a time: each call takes ~2s, but the site rate-limits big bursts
      onProgress(`Reading gear ${Math.min(k + 4, list.length)} of ${list.length}…`);
      items.push(...await Promise.all(list.slice(k, k + 4).map(it =>
        get(`${API}/equipment/item?id=${it.id}&enchantLevel=${it.enchantLevel}&${q}&slotPos=${it.slotPos}`))));
    }
    onProgress('Reading Daevanion boards…');
    const ids = boardList(info).map(b => b.id);
    for (const [k, d] of (await Promise.all(ids.map(id => get(`${API}/daevanion/detail?${q}&boardId=${id}`)))).entries()) boards[ids[k]] = d;
    return { info, items, boards };
  }

  // just the open nodes of one board of a character, as [x, y]: two calls, for comparing boards
  async function loadBoard(hit, kind) {
    const q = `lang=en-US&characterId=${encodeURIComponent(hit.characterId)}&serverId=${hit.serverId}&region=${hit.region}`;
    const info = await get(`${API}/info?${q}`), a = boardList(info).find(b => b.kind === (kind || 'ariel'));
    if (!a) return [];
    return openNodes(info, { [a.id]: await get(`${API}/daevanion/detail?${q}&boardId=${a.id}`) }, a.kind);
  }

  // 'cleric', 'spiritmaster', ...: the class as the planner names it
  const classOf = info => String((info.profile && info.profile.className) || '').toLowerCase().replace(/[^a-z]/g, '');

  const api = { REGIONS, servers, search, load, loadBoard, toBuild, collect, classOf };
  if (typeof module !== 'undefined') module.exports = api; else root.Character = api;
})(this);
