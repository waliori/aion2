# aion2

Small tools for AION 2. One folder per tool.

## daevanion/ — Daevanion board route planner

Plans the best route through a Daevanion board for the crystals you have, shows the numbers behind it, and compares boards. Six boards, switched with the buttons in the title band:

- **Ariel**, the PvE board: scored against bosses.
- **Azphel**, the PvP board (`?board=azphel`): scored against another player. Only PvP stats count there.
- **Nezekan, Zikel, Vaizel, Triniel**, the four class boards, planned together from their shared pool of 416 points (`?board=class&class=ranger`), for all eight classes: see "The class boards" below.

```sh
cd daevanion
docker compose up -d    # then open http://localhost:8787  (stop with: docker compose down)
```

It restarts on its own after a reboot. Without Docker, `python3 serve.py` does the same thing. You can also just double-click `index.html`; everything works that way except loading a character.

- `boards.js` — the six boards and every class's skill nodes, read from the official API; a node can give one stat or two (the green ones), or a skill level
- `planner.js` — the maths: one search, and a scoring model per board; `node planner.js` runs its self-test
- `ui.js` — what differs between the boards on the page: labels, stat families, input fields, the worked calculation
- `i18n.js` — English and French; `node i18n.js` checks that every text has a French entry
- `character.js` — loads a character from the official API and adds up its stats
- `index.html` — the page
- `serve.py` — local server; relays character lookups to the official API
- `compose.yaml` — runs `serve.py` in a container
- `worker.js` — the same relay as a Cloudflare Worker, for the online version

### Online

Published at https://daevanion.walior.it as a Cloudflare Worker. Cloudflare Workers Builds redeploys it on every push to `main`, running `sh build.sh && npx wrangler deploy` from the repository root. `build.sh` runs the planner's self-test and the translation check, then copies the site files into `dist/`; `wrangler.toml` points the Worker at that folder and at `daevanion/worker.js`, the relay. Nothing else in the repo is published.

### Load your character

Pick your region (and, if you like, faction and server), search your character name, click it. This fills in your stats for the board you are on and marks the nodes you already own on it. It takes 15 to 20 seconds.

How it works: the official site (`aion2.plaync.com`, Global) has an unauthenticated JSON API, the same one shugo.gg reads. It refuses requests made directly by a web page, which is why `serve.py` relays them. It has no "final stats" endpoint, so `character.js` adds up every stat line on your gear (base, enchant, sub stats, manastones, Arcana set bonus), your titles, your other Daevanion boards and your primary-stat bonuses. Board ids differ per class, so they are read from the character.

What that cannot see: pets, wings, skill passives, buffs and class base stats. So the percentages (Damage Boost, Damage Tolerance, Critical Damage Boost) are reliable unless a passive adds more; Attack, Critical Hit, Accuracy, Defense and Evasion are estimates to compare with your stat sheet; HP is not available and has to be typed in.

### What the page shows

One settings bar holds everything that decides the plan, in the order you fill it: your character, the class (class boards), your crystals, the crystals expected later, the goal, the encounter and the skills to reach. Loading a character and choosing skills open a dialog; while a character is read, a loader covers the page and says what is being read. Under the bar sit the board, with a row of filters above it that light up one kind of node or a whole family, and four tabs beside it:

- **Plan**: what the plan adds (damage dealt, effective HP, crystals spent), the same figures for the board you own now, and the buy order with the running gain.
- **Why**: the calculation, all from your own numbers. One average hit on an empty board, on your board now and after the plan; what one node of each kind is worth per crystal, with the arithmetic; the plan against other ways of spending the same crystals; and the same route against every encounter.
- **Compare**: two boards side by side with the difference in every stat. Each side can be your board now, this plan, another plan with its own crystals, goal and encounter, or another player's Ariel board loaded from the game. Both sides are valued with your stats.
- **My stats**: your numbers, the custom encounter's boss numbers, and how it is calculated.

### Languages

English and French, switched with the two buttons in the title band; the first visit follows the browser's language. English is the source: every text is an English key and `i18n.js` maps it to French. Stat names are the game's own French terms, read from the official API. The build fails if any text on the page has no French entry.

### Encounters

NCsoft publishes no boss stats. The planner uses Global player measurements from [Aion 2 Maps](https://aion2maps.com/guides/accuracy-and-crit/) (16 November 2026: one Ranger's fight logs plus Global parses):

| Encounter | Critical Hit for the 50% crit cap | Accuracy where parries stop |
|---|---|---|
| Open world and normal dungeons | not measured | no check |
| Transcendence tier 4 | about 1,420 | 800 to 1,075 |
| Conquest hard, mid-bosses | 1,405 to 1,425 | 800 to 1,000 |
| Conquest hard, final bosses | 1,525 to 1,555 | about 925; 1,075 on Transcendent Bakarma |
| Fire Temple hard | 1,590 to 1,610 | 800 to 1,050 |
| Ferocious Horn Den hard | 1,590 to 1,610 | 800 to 1,125 |
| Ludra hard, mid-bosses | 1,615 to 1,650 | almost never parry |
| Eternal Ludra, normal and hard | 1,750 to 1,850 | about 1,100, rarely up to 1,180 |

The planner uses the middle of each Critical Hit range and the top of each Accuracy range. The crit figure is the boss's Critical Hit Resist plus about 500: every 100 Critical Hit short costs 10% crit chance from the 50% cap. Every 100 Accuracy short gets about 10% of hits blocked (Aion 2 Maps says 6 to 7% on average), and a blocked hit deals about half its damage.

Boss Damage Tolerance has been measured for some content (same site, "How damage works", one source): 68% on tier 4 Transcendence bosses (a [Korean test](https://gall.dcinside.com/mgallery/board/view/?id=aion2&no=1724014) on Nemon, March 2026, found 44%; the planner keeps 68%), 58 to 67% on Conquest hard bosses. The planner uses those there (62% for Conquest hard). Boss Defense has one measurement, about 6,400 on Nemon in that Korean test; the planner uses 6,400 for every boss. Elsewhere the defaults are Boss Damage Tolerance 20% and crit damage resist 25% (reference values from a [Korean community write-up](https://www.fmkorea.com/9569335827), March 2026). They apply to every encounter and are editable under Your stats.

"Custom encounter" on the page takes your own boss: Accuracy and Critical Hit figures, Damage Tolerance, crit damage resist, Defense, hit size and Damage Boost. All of this lives in `TARGETS` and `DEFAULT_BUILD` in `planner.js`.

### Put your own stats in

The right route depends on what you already have: +1.5% Damage Boost is worth more to someone at 50% than at 200%. Load your character (above), or open "Your stats" on the page and type them in; they are remembered in the browser.

The defaults are a placeholder mid-game character, not yours. The ones listed as guesses (boss hit size, boss Damage Boost, boss Damage Tolerance, what Evasion does) cannot be read in game; they mostly move the Survival route.

### The boards

Both are 15×15 grids with 152 stat nodes and a centre start, 232 crystals for everything, identical for every class. You can only buy a node next to one you own (up/down/left/right). The data comes from the official API.

| Cost | Ariel (PvE) | Azphel (PvP) |
|---|---|---|
| 4 | PvE Damage Boost / PvE Damage Tolerance +1.5% (4 + 4) | PvP Damage Boost / PvP Damage Tolerance +1.5% (4 + 4) |
| 3 | Boss Damage Boost / Tolerance +1%, Critical Hit / Resist +10 (4 each) | Status Effect Chance / Resist +1% (8 + 8) |
| 2, green | two stats each: PvE Attack +3 and PvE Defense +30; Boss Attack +3 and Boss Defense +30; PvE Accuracy +5 and PvE Evasion +5 (8 each) | two stats each: PvP Attack +3 and PvP Defense +30; PvP Accuracy +5 and PvP Evasion +3; PvP Critical Hit +5 and PvP Critical Hit Resist +5 (8 each) |
| 1 | the same stats singly (16 each), HP +100, MP +50 (4 + 4) | the same stats singly (16 each), HP +100, MP +50 (4 + 4) |

### The formulas

NCsoft has not published a damage formula. This is the community-tested one ([gameplay.tips](https://gameplay.tips/guides/aion-2-how-stats-work-damage-formula-guide.html), [expcarry](https://expcarry.com/aion-2-damage-formula)); the two agree on everything used here.

```
damage = ( [ ((Attack × Weapon Dmg Boost) + Attack Bonus) × Attack Increase
             + PvE Attack + Boss Attack ] × skill coefficient
           + skill flat damage − (target Defense − Penetration) × 0.1 )      (×0.01 in PvP)
         × (1 + Damage Boost + PvE Damage Boost + Boss Damage Boost − target Damage Tolerance)
         × crit × double × front/back × skill specialty
```

What that means for the Ariel stats, and how `score()` in `planner.js` values them:

- **PvE Attack / Boss Attack** are added after Attack Increase, so each point is worth `1 / attack` where `attack` is your whole attack bracket. Skill flat damage and target Defense are ignored (small).
- **PvE / Boss Damage Boost** add into one bucket with your generic Damage Boost. +x% is worth `x / (100 + your total boost − boss tolerance)`. This is the diminishing return.
- **PvE / Boss Damage Tolerance** subtract from the boss's bucket the same way.
- **Defense** removes a flat `0.1 × Defense` from each hit, so 720 + 720 Defense from the full board is 144 damage off every boss hit.
- **Critical Hit**: crit multiplier is `1.5 + Critical Damage Boost − boss crit damage resist (25%)`. Crit chance comes from the encounter (see Encounters); where none is measured it is about 1% per 15 Critical Hit. Capped at 50% on Global (80% in KR guides). At the cap these nodes are worth nothing and the planner skips them.
- **PvE Accuracy** only matters where the encounter still blocks you (see Encounters).
- **Critical Hit Resist, MP**: worth nothing against bosses (bosses do not crit).
- **PvE Evasion**: no reliable data; valued at 0 by default.
- **HP**: `HP / your HP` more effective HP.

Damage maximises damage dealt, Survival maximises effective HP (HP ÷ damage taken), Both weighs them equally. On Ariel all of it is against a PvE boss; on Azphel, against the chosen opponent.

### Azphel: the PvP model

Same formula, PvP numbers ([Aion 2 Maps, PvP](https://aion2maps.com/guides/pvp/) and [How damage works](https://aion2maps.com/guides/how-damage-works/), November 2026):

```
damage = ( [ ((Attack × Weapon Dmg Boost) + Attack Bonus) × Attack Increase + PvP Attack ] × skill coefficient
           + skill flat damage − target Defense × 0.05 )
         × (1 + Damage Boost + PvP Damage Boost − target Damage Tolerance − target PvP Damage Tolerance)
         × crit (1.25× base) × double (1.5×) × front/back
```

- Defense takes a smaller share of its value off a hit than in PvE. Sources give 1%, 5% or 10%; the planner uses 5%, editable.
- Crit chance is `(your Critical Hit − their Critical Hit Resist) × 0.06%`, capped at 50%: each 100 Resist on the target takes about 6 points off.
- Evasion only pays once it passes the attacker's Accuracy: `(their Evasion − your Accuracy) × 0.06%`, capped at 30%. Block only matters for a player with a shield.
- Status Effect Chance and Resist cannot be turned into damage. They count for nothing unless you give them a value under My stats.
- The opponent is a set of player stats: a copy of yours, numbers you type, or a real player loaded from the game with their own Azphel board. Survival is your HP divided by their average hit on you, the same formula the other way round.

### The class boards

Nezekan, Zikel and Vaizel have 88 nodes each, Triniel 116: general stats (Attack Bonus, Critical Hit, Defense Bonus, HP, MP, Critical Hit Resist, and a few percent nodes that differ per board) and 22 skill nodes that each raise one skill by a level. The stat nodes are the same for every class; the skills behind the skill nodes are the class's own. Read from one level-45 character per class, 22 Nov 2026.

- **Stats** are scored in PvE with the Ariel formula and encounters. Combat Speed, Cooldown Reduction and Multi-hit Chance have no place in a one-hit formula, so each is worth what you say 1% of it is worth under My stats (defaults 1, 0.5 and 0.5% damage: guesses).
- **Skills** are not scored: nothing published says what a skill level is worth, and it depends on how you play. You tick the skills you want and the route reaches them first, then spends the rest on stats. You can also mark skills to avoid: the route never opens their nodes and goes around them. The board is planned again when you press Done, not on every tick. That is also how a healer, a support or a tank plans these boards: pick the skills of the role, and Damage, Survival or Both for the stats.
- **Costs** follow the node grade: 1 for a stat, 2 for a passive skill, 3 for an active skill, 4 for the corners. Confirmed in game, and a character with every point spent adds up to exactly 416.
- **One pool.** The four boards hold 570 points and share a pool of 416, so they are planned as one board with four starts: the route decides how much of the pool each board gets. All four are treated as open, although the game opens them over time. One board is on screen at a time; each button says what that board takes.
- **Skill icons** come from the skill list of the official character page and are loaded from the game's own asset server: square for an active skill, round for a passive.
- **Leftover points** that your goal has no use for go to skill levels you did not tick, then to the other side of the goal.

### Planning for crystals to come

The exact check can take close to 1 GB of memory, so it starts by itself only on a computer; on a phone the page keeps the quick route and offers a "Check anyway" button.

"Up to the full board" does the same for every crystal the board can take, so one order can be followed from now on; it replaces the number typed under "Expected later". Under the encounter or opponent, the page lists the numbers the plan is made against (the boss's or the player's stats).

"More crystals expected later" plans the route for the larger total and spends today's crystals inside it, so nothing bought now has to be reset later. The page says what that costs today against the best board for today's crystals alone, and the buy order continues, greyed, with what comes later.

### The route starts from an empty board

"Your crystals" is everything you have: what is already in your board plus what is free. Loading a character sets it to what the game says is in the board. The recommended route always spends that total from an empty board, so it is the board to aim for, not an extension of the one you have. Nodes on the route that you already own carry a green edge, and the Plan tab says how many of your nodes the route keeps, how many it leaves out, and whether it beats your board at all.

### Players you follow

The official API has a ranking endpoint, but on Global it returns nothing, so there is no top list to read. Under Compare you add up to ten players yourself; each board is valued with your stats and ranked for your goal, and a small board shows which nodes most of them own.

### How the route is found

Each node gets a value from the formulas above (its gain on top of an empty board). Picking the best connected group of nodes under a crystal budget is a knapsack on a graph. On a tree that can be solved exactly, so the planner solves it on 1500 random spanning trees of the board and keeps the best answer (about 330 for the four class boards together, which are 2.5 times the nodes and twice the budget; there the answer came within 0.5% of a ten times longer search). It then repeats once with node values taken halfway along the route, so diminishing returns and the crit cap are priced in.

That quick search answers at once, but it is a search, not a proof: between about 90 and 150 crystals it misses the best board by up to 0.3 points of damage.

### The exact check

So a second solver (`exact.js`) runs in the background and replaces the quick route with a proven one.

- **The sweep.** For node values that simply add up, the best connected board is found exactly. The grid is read cell by cell; for every shape the sweep line can have (which of its cells are taken, and which of those are already joined to each other and to the start) it keeps the best value for every number of crystals spent. Boards are only dropped when a plain upper bound shows they cannot beat one already known. The four class boards are swept one by one and the pool is split between them exactly.
- **The real formula.** Attack, crit and boosts multiply, so node values do not simply add up. The objective is a sum of curves, one per pile of stats that act together (found by trying every pair of reachable totals). Each curve is capped from above by a straight line, which gives node values that do add up; the sweep's answer for those is a ceiling no board can pass. The best real board found is the floor.
- **Closing the gap.** Where a line cannot touch its curve (a curve that bends upward, like Damage Tolerance, or two stats that multiply, like Critical Hit and Critical Damage Boost), the totals are split into two ranges with a tighter line each, and the slopes are moved when a cap is flat where the real curve is not.

The page then says either "Proven best" (floor and ceiling meet, to a millionth) or "no board can beat this route by more than X%". With the default stats, Damage on Ariel and Azphel is proven best in 2 to 60 seconds; Survival, Both and the class boards usually end within 0.05%. The check stops after a minute or 40 sweeps and reports the margin it reached. `node daevanion/exact.js` checks the sweep against a plain enumeration of every connected board at small budgets.

What "proven" covers: the best board for the formulas and the stats on the page. It does not make the formulas themselves any more certain.

## Search and link previews

The page carries a canonical link per board, Open Graph and Twitter card tags, a JSON-LD description, `robots.txt`, `sitemap.xml`, a web manifest, an SVG icon with PNG copies, and `og.png` (1200 x 630), a capture of the real Ariel board with a planned route. None of them names a person. To redo `og.png` after a visual change, capture the board again at that size.
