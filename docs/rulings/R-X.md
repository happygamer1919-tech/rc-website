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

## AMENDED (W28-11, wave 28): every discount claim goes, and the gate holds it

Added 2026-09-23 by card W28-11, under the owner's wave 28 dispatch. Nothing above this line
moves.

The dispatch's W28-11 text, verbatim: "claims cleanup RO and RU, R-X enforcement: remove every
discount, percent-off, 'pana in 2027', 'programari anticipate', countdown or financing string."
That is the wider ruling interpretation 1 above asked for. **Interpretation 1 is overturned**:
the promo bar's "Reducere 10% la orice serviciu doar până în 2027" / "Скидка 10% на любую услугу
только до 2027 года", the hero and footer line "−10% la programări anticipate" / "−10% при ранней
записи", the discount clause inside five FAQ answers per locale, and the roofing hub tile
labelled "Reduceri" / "Скидки" (now "Solicită ofertă" / "Запросить предложение", which is where
the tile goes) are removed in both locales in the same commit. The promo bar's mechanism in
`build.js` stays and renders nothing while the two `promo.*` strings are absent, so a
non-discount announcement can use it by data; the discount string cannot come back, because
`scripts/check-scarcity.js` now carries seven discount arms (RO and RU words, the until-year
form, the early-booking form and the percent-off form), each self-tested against its own
samples and against clean samples that a discount pattern must not catch (a product figure, a
spec percentage, a warranty year, the two permitted ask strings). Interpretation 2 stands
unchanged, and is moot while no bar renders.
