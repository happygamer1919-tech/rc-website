# W24-01 · The shared placeholder component and the photo slot ledger

| | |
|---|---|
| Dispatched | Wave 24, 2026-09-19. **Ship first.** |
| Rulings in force | R-V (no self-merge), R-W, R-X, R-Y as amended by W24-R4, R-Z, R-AA, R-AB, and the W24 owner rulings W24-R1 to W24-R9 |
| Ledger | `docs/PHOTO-SLOTS-W24.json` |

## Why this card exists

Every image rendered in wave 24 is a placeholder. A separate photo session fills them
later. Nothing in this wave sources, downloads or requests an image, and no image, logo
or asset from `fatade3d.md`, `imperlux.md` or `dasterum.md` enters the repo (W24-R2).

For that to be workable, the placeholders have to be one component, and the list of what
each one is waiting for has to be a file the photo session can be handed.

## What the card asks

1. **One shared placeholder component.** A fixed aspect ratio box, a white variant and a
   `#141414` variant, a 1px line border, and the slot id in small centred text
   (`CAT-0042`, `BA-01-before`). One implementation, used by every placeholder the wave
   renders. No new colour value: the border is `--line`, the variants are `--bg-light`
   and `--bg-dark`, the id text is `--ink-muted` on the white variant.
2. **The ledger.** Every placeholder rendered anywhere in wave 24 is registered in
   `docs/PHOTO-SLOTS-W24.json`, one row each: slot id, page, aspect ratio, minimum pixel
   size, and what the photograph should show.
3. **The gate, both directions.** Every placeholder rendered in `dist/` has a ledger row,
   and every ledger row is rendered. It reports how many placeholders and how many rows
   it read and fails on zero of either (R-AB). Negative-tested on both arms: a rendered
   placeholder with no row, and a row with nothing rendering it.
4. **Record the owner rulings.** `DECISIONS.md` gets block **W24-R**, rulings R1 to R9
   verbatim, in this card's commit, before any other wave 24 work.
5. **Two housekeeping fixes.** The wave 23 lines in `docs/BACKLOG.md` still read
   "PR open, awaiting owner" and every one of those pull requests is merged into `main`
   (F-23). And the wave index line moves out of the governing documents into the repo
   memory folder (F-28).

## Acceptance

1. `node build.js` exit 0, both locales.
2. Every gate under `quality` exit 0, each run as its own process, reported by name with
   the exit code that was read (R-AB).
3. The new ledger gate green, and both negative arms watched red.
4. `docs/PHOTO-SLOTS-W24.json` exists and is the input the photo session is handed.
5. `DECISIONS.md` carries W24-R with the nine rulings verbatim.
6. No new binary under `public/img`. `git diff --stat` shows none.
7. Screenshots at 1440 and 390 of each changed page saved outside the repo, under
   `~/Documents/rc-audit-w24/w24/`.
