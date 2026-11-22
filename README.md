# aion2

Small tools for AION 2. One folder per tool.

## daevanion/ — Ariel board route planner

```sh
cd daevanion
docker compose up -d    # then open http://localhost:8787  (stop with: docker compose down)
```

It restarts on its own after a reboot. Without Docker, `python3 serve.py` does the same thing.

Enter how many Daevanion Crystal: Ariel you have and pick a goal. The board shows the best nodes to buy in gold, numbered in buy order. Click nodes you already bought to mark them as owned; the plan then spends your crystals on top of those.

You can also just double-click `index.html`; everything works that way except loading a character.

- `board.js` — the board data (checked against the official API: 152 of 152 nodes match)
- `planner.js` — the maths; `node planner.js` runs its self-test
- `character.js` — loads a character from the official API and adds up its stats
- `index.html` — the page
- `serve.py` — local server; relays character lookups to the official API
- `compose.yaml` — runs `serve.py` in a container

### Load your character

Pick your region, search your character name, click it. This fills in Attack, Damage Boost, Critical Hit, Accuracy, Damage Tolerance and Critical Damage Boost, and marks the Ariel nodes you already own. It takes 15 to 20 seconds.

How it works: the official site (`aion2.plaync.com`, Global) has an unauthenticated JSON API, the same one shugo.gg reads. It refuses requests made directly by a web page, which is why `serve.py` relays them. It has no "final stats" endpoint, so `character.js` adds up every stat line on your gear (base, enchant, sub stats, manastones, Arcana set bonus), your titles, your other Daevanion boards and your primary-stat bonuses.

What that cannot see: pets, wings, skill passives, buffs and class base stats. So:

- **Damage Boost, Damage Tolerance, Critical Damage Boost**: summed directly; reliable unless a passive adds more.
- **Attack**: `((weapon average + Attack lines) × Weapon Damage Boost + Attack Bonus) × Attack increase + PvE Attack`. An estimate; compare with your stat sheet.
- **Critical Hit and Accuracy**: the ratings, summed from gear, titles and boards with their percentage bonuses. Compare with your stat sheet.
- **HP**: not available; type it in.

### What the page shows

A settings strip (your character, crystals, goal, encounter), the board, and four tabs beside it:

- **Plan**: what the plan adds (damage dealt, effective HP, crystals spent), the same figures for the board you own now, and the buy order with the running gain.
- **Why**: the calculation, all from your own numbers. One average hit on an empty board, on your board now and after the plan; what one node of each kind is worth per crystal, with the arithmetic; the plan against other ways of spending the same crystals; and the same route against every encounter.
- **Compare**: two boards side by side with the difference in every stat. Each side can be your board now, this plan, another plan with its own crystals, goal and encounter, or another player's Ariel board loaded from the game. Both sides are valued with your stats.
- **My stats**: your numbers, the custom encounter's boss numbers, and how it is calculated.

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

Not measured by anyone: per-boss Defense and Damage Tolerance. The defaults are Boss Damage Tolerance 20% and crit damage resist 25% (reference values from a [Korean community write-up](https://www.fmkorea.com/9569335827), March 2026) and Boss Defense 0. They apply to every encounter and are editable under Your stats.

"Custom encounter" on the page takes your own boss: Accuracy and Critical Hit figures, Damage Tolerance, crit damage resist, Defense, hit size and Damage Boost. All of this lives in `TARGETS` and `DEFAULT_BUILD` in `planner.js`.

### Put your own stats in

The right route depends on what you already have: +1.5% Damage Boost is worth more to someone at 50% than at 200%. Load your character (above), or open "Your stats" on the page and type them in; they are remembered in the browser.

The defaults are a placeholder mid-game character, not yours. The ones listed as guesses (boss hit size, boss Damage Boost, boss Damage Tolerance, what Evasion does) cannot be read in game; they mostly move the Survival route.

### The board

`board.js`: 15×15 grid, 152 stat nodes + centre start, 232 crystals for everything, identical for every class. You can only buy a node next to one you own (up/down/left/right). Scraped from [wikily.gg](https://wikily.gg/aion-2/daevanion/cleric/ariel); totals match [aion2maps](https://aion2maps.com/guides/daevanion-boards/) and [aion2vault](https://aion2vault.com/builds/ariel-daevanion/).

| Node | Each | Cost | Count |
|---|---|---|---|
| PvE Damage Boost / PvE Damage Tolerance | 1.5% | 4 | 4 + 4 |
| Boss Damage Boost / Boss Damage Tolerance | 1% | 3 | 4 + 4 |
| Critical Hit / Critical Hit Resist | 10 | 3 | 4 + 4 |
| PvE Attack / Boss Attack | 3 | 1 or 2 | 24 + 24 |
| PvE Defense / Boss Defense | 30 | 1 or 2 | 24 + 24 |
| PvE Accuracy / PvE Evasion | 5 | 1 or 2 | 24 + 24 |
| HP / MP | 100 / 50 | 1 | 4 + 4 |

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

Damage maximises damage dealt, Survival maximises effective HP (HP ÷ damage taken), Both weighs them equally. All of it is "against a PvE boss".

### How the route is found

Each node gets a value from the formulas above (its gain on top of what you already own). Picking the best connected group of nodes under a crystal budget is a knapsack on a graph. On a tree that can be solved exactly, so the planner solves it on 1500 random spanning trees of the board and keeps the best answer. It then repeats once with node values taken halfway along the route, so diminishing returns and the crit cap are priced in.

This is a search, not a proof. The self-test checks it against brute force at 10 crystals, and it matched an exact (slow) integer-programming solve in 240 of 240 runs for budgets of 15 to 60 crystals. Above 60 it is unverified.
