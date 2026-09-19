# W23-02 · Before/after: pair, check the angle, publish only what passes

| | |
|---|---|
| Dispatched | Wave 23, 2026-09-18 |
| Source | `Before_after/` in the batch: `Before_1..4` and `After_1..4` |
| Host | `content/before-after.json`, empty by design; `build.js` renders the slider only when it has a pair |

## What the card asks

Pair the files, check each pair is the same angle **by viewing both**, publish only pairs
that pass, and enable the section when at least one pair passes. Report the pairs
rejected, with the reason.

## Acceptance

1. The section renders on the built page.
2. The R-Y height budget is green.
3. The Lighthouse gate is green.

**If no pair passes, the section does not render and the acceptance is the report.** The
slot rule is master plan section 7 as amended by W14-18: a before/after slot takes real
Rapid Construct work only.
