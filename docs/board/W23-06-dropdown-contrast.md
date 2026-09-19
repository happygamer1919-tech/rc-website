# W23-06 · DEFECT: the Servicii dropdown's rows are invisible until hover

| | |
|---|---|
| Dispatched | Wave 23 second dispatch, 2026-09-19. **Ship first.** |
| Rulings in force | R-W, R-X, R-Z, R-AA, R-AB |

## What the card asks

On the live site the Servicii dropdown renders its panel with the item text invisible,
white on white, until hover. Reproduce it at 1280px and 1440px in RO and RU in a real
browser, find the cause, and fix it.

Add a browser gate: for every nav dropdown item in both locales, the computed text colour
against the panel background is at least 4.5:1 in the resting state, with no hover.
Negative-test the gate by reintroducing the defect and showing it fails, naming the
process whose exit code was read (R-AB).

## Acceptance

1. The new gate green.
2. The negative arm red.
3. `check-header-fit.js` green.
4. `verify-live.js` VERIFIED on the homepage, both locales.
5. A screenshot of the open dropdown at rest attached to the PR.
