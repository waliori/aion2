// Load a character from the official AION 2 (Global) API and turn it into planner stats.
// The API has no "final stats" endpoint, only gear, titles, boards and primary stats, so we add
// those up ourselves. It cannot see pets, wings, skill passives, buffs or class base stats:
// the result is a starting point to correct against your in-game stat sheet, not the truth.
(function (root) {
  const API = 'https://aion2.plaync.com/api/character';
  const SEARCH = 'https://api-search.plaync.com/aion2global/search/v2/character';
  const REGIONS = { eu: 'Europe', nae: 'North America East', naw: 'North America West', la: 'South America', as: 'Asia' };
  const ARIEL = 85, BOARDS = [81, 82, 83, 84, 85, 86];
  const num = v => parseFloat(String(v).replace(/[+,]/g, ''));

  // -> { flat: {name: sum}, pct: {name: sum}, weapon: average weapon Attack }
  function collect(info, items, boards) {
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
    for (const id of BOARDS) if (id !== ARIEL) for (const s of (boards[id] && boards[id].openStatEffectList) || []) addDesc(s.desc);
    for (const s of (info.stat && info.stat.statList) || []) for (const d of s.statSecondList || []) addDesc(d);  // "Attack increase +3.2%"
    return out;
  }

  // -> { build: values for the planner, owned: [[x, y]] Ariel nodes already open }
  function toBuild(info, items, boards, critPctPerPoint) {
    const { flat, pct, weapon } = collect(info, items, boards);
    const f = k => flat[k] || 0, p = k => pct[k] || 0;
    const attack = ((weapon + f('Attack')) * (1 + p('Weapon Damage Boost') / 100) + f('Attack Bonus')) * (1 + p('Attack increase') / 100)
      + f('PvE Attack') + f('Boss Attack');
    const build = {
      attack: Math.round(attack),
      damage_boost_pct: +(p('Damage Boost') + p('PvE Damage Boost') + p('Boss Damage Boost')).toFixed(2),
      tolerance_pct: +(p('Damage Tolerance') + p('PvE Damage Tolerance') + p('Boss Damage Tolerance')).toFixed(2),
      crit_damage_boost_pct: +p('Critical Damage Boost').toFixed(2),
      // assumes the boss has no Critical Hit Resist: an upper estimate
      crit_chance_pct: +(f('Critical Hit') * (1 + p('Critical Hit increase') / 100) * critPctPerPoint).toFixed(1),
    };
    const owned = ((boards[ARIEL] && boards[ARIEL].nodeList) || []).filter(n => n.open && n.type === 'Stat').map(n => [n.col - 1, n.row - 1]);
    return { build, owned };
  }

  async function get(url) {
    const r = await fetch('/api?url=' + encodeURIComponent(url));
    if (r.status === 429) throw new Error('The AION 2 site is rate-limiting requests. Wait a minute and try again.');
    if (!r.ok) throw new Error(`The AION 2 site answered ${r.status}.`);
    return r.json();
  }

  async function search(name, region) {
    const d = await get(`${SEARCH}?keyword=${encodeURIComponent(name)}&page=1&size=20&localeInfo=en-US&region=${region}&serverId=`);
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
    for (const [k, d] of (await Promise.all(BOARDS.map(id => get(`${API}/daevanion/detail?${q}&boardId=${id}`)))).entries()) boards[BOARDS[k]] = d;
    return { info, items, boards };
  }

  const api = { REGIONS, search, load, toBuild, collect };
  if (typeof module !== 'undefined') module.exports = api; else root.Character = api;
})(this);
