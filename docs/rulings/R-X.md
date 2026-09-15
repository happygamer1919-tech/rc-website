# RULING R-X · No pressure selling, 2026-09-15

Recorded at the owner's instruction, from the wave 14 dispatch (cards RC-110 and
RC-114).

## The ruling, as given

From RC-110:

> No discount badges, no struck prices.

From RC-114:

> Zero countdown timers, zero stock-scarcity strings and zero instalment or
> financing strings across both locales. The gate asserts the presence of the
> check, not the absence of a complaint, per `docs/CLAUDE.md` section 13.

Both cards cite R-X, so the ruling is the union of the two.

## Implementation

`scripts/check-scarcity.js`, run by the `quality` workflow. It scans both locale
files and the built HTML of both locales.

## What R-X removes that is live today

The site has carried "Rate 0% la acoperiș" / "Рассрочка 0% на кровлю" since
wave 1, sourced from the predecessor build. That is an instalment string, so R-X
removes it. RC-114 does the removal in the same commit as the gate, because the
gate cannot go green while the string is on the page.

## Recorded interpretations, each open for ratification

1. **"−10% la programări anticipate" and the promo bar's "Reducere 10% ... doar
   până în 2027" stay.** R-X as given bans discount *badges* and *struck* prices,
   plus countdowns, stock scarcity and financing. A static discount line matches
   none of them. If the owner meant every discount claim, that is a wider ruling.
2. **The promo bar's build-time expiry is not a countdown timer.** It prints no
   remaining time and does not change while a visitor is on the page.
