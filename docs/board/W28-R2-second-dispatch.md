# W28-R2 · The second dispatch: R-W28-06, R-W28-07, the two cards, Q-W28-05

Card W28-R2. Branch `w28/w28-r2-rulings-board`, on `main` at `9e9a921`. Documents only.

## What this card does

Records the two rulings the second dispatch of wave 28 asked for and puts its two cards on the
board. The dispatch named them R-W28-04, R-W28-05 and W28-22; all three ids were already taken by
merged work, and the register is append-only, so they are R-W28-06, R-W28-07, W28-23 and W28-24,
each quoting the dispatch verbatim. Opens Q-W28-05 (the 113 manufacturer packshots in the fatade
group, shipped default: kept). Brings the board up to date with #180.

## Acceptance

- `grep -c '^## R-W28-0[67]' docs/rulings/W28-R.md`: 2.
- The board carries W28-R2, W28-23 and W28-24 and the two rulings.
