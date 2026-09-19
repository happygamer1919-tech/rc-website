# W23-07 · The RO nav label "Despre" becomes "Despre noi"

| | |
|---|---|
| Dispatched | Wave 23 second dispatch, 2026-09-19 |
| Rulings in force | R-W, R-X, R-Z, R-AA, R-AB |

## What the card asks

The Romanian nav label "Despre" becomes "Despre noi". The Russian label is unchanged.

The header fit gate must stay green at every width it covers. **If it fails, do not
shrink type or spacing: stop, report the measured overflow in px, and propose one fix in
the PR.**

## Acceptance

1. `check-header-fit.js` green.
2. `check-links.js` green.
3. "Despre noi" present in the RO nav of every RO built page.
