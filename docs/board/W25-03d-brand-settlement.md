# W25-03d · Three catalogues walked, and the brand of all 88 plates settled

Card W25-03d. Branch `w25/w25-03d-brand-settlement`, stacked on `w25/w25-03c-intake-450`.
PR only, stops for the owner.

## The settled counts, which is what you asked for

| Brand | Plates | How |
|---|---|---|
| **Phomi** | **85** | 25 matched a Phomi family, 60 matched a Phomi colour variant |
| **Ecofasad** | **0** | Ecofasad names no product; see below |
| **Kordeko** | **0** | none of the three residual names is in Kordeko's catalogue |
| **`brand_hidden`** | **3** | `CAT-0051` Elsa Black Grey, `CAT-0060` Sandstorm, `CAT-0077` H06 |

**88 of 88 accounted for.** The number of plates falsely attributed to Phomi went 70, then
37, then 3, and each earlier number was a research result held in prose. It is data now.

## How each catalogue was walked

**Phomi, `phomi.com`.** 57 product pages taken from the page sitemap rather than from the
range menus, which is what moved the count: four products sit on top-level pages under no
range. 57 category cards read as well, because **the category card and the product page
disagree on at least one name**: the card says "Rusty Slab", the page says "Rusty Stone",
and they are the same product. 774 colour-variant images, whose names Phomi writes into the
file name.

**And the names were verified against the manufacturer's own lettering.** Phomi burns the
product name into each colour swatch. Ten matches were sampled across the whole run and
read off the picture:

| Slot | Our name | Printed in Phomi's own image |
|---|---|---|
| CAT-0039 | Kamu Red | Kamu Red |
| CAT-0044 | Mountain Light Grey | Loki Mountain Light Grey |
| CAT-0049 | Castol Grey | Castol Grey |
| CAT-0055 | Y001-01-02 | Y001-01-02 |
| CAT-0062 | Perth Grey | Perth Grey |
| CAT-0067 | Orange | Orange |
| CAT-0072 | Sunis White | Sunis White |
| CAT-0078 | Medium Grey | Medium Grey |
| CAT-0083 | Ink-Dyed | Ink Dyed |
| CAT-0088 | Castol Yellow | Castol Yellow |

**Ten of ten.** `Y001-01-02` matters most: it reads exactly that in the photograph, so
Phomi's code-like names are real product names and not artefacts of reading file names.
That is what settles `HY001` too, which Phomi publishes on three of its weaving products.

**Ecofasad, `ecofasad.md`.** A Moldovan manufacturer, not a Russian domain. 102 flexible
stone and flexible marble textures across its two texture pages. **Ecofasad gives none of
them a name**: they are `rock-1808`, `marble-1801`, four-digit numbers with a material
prefix. **So no plate name can ever match an Ecofasad product**, and a name-based match
against Ecofasad is not a thing that can succeed or fail. Matching by eye would mean
comparing a photograph we do not have, of a plate that has no picture, against 102
textures. It is reported rather than attempted.

**Kordeko, `kordeko.com`.** Also Moldovan, also not a Russian domain. 81 products from its
sitemap. 22 are named flexible facade tiles: Butcher White, Butcher Beige, Butcher Light
Gray, Butcher Gray, Mont Blanc, Tender Rock, El Arabia, Cerro-Torre, Gray Cold Rock,
Chocolate Rock, Volcanic Anthracite, Loft Red Clay, Royal Granite, Milky Travertine, Latte
Travertine, White Stone Travertine, Dune Stone Travertine, Golden Maple, Forest Beech,
Ripe Cherry, Wenge, and four slate finishes. The other 59 are cornices, mouldings, window
cornices and post caps. **None of Elsa Black Grey, Sandstorm or H06 appears anywhere on
either Kordeko domain.**

**No Russian domain was found, so none was fetched.** The ruling asked for one to be
reported if an official site turned out to be on `.ru`; both are `.md` and `.com`.

## The three that are in no catalogue

| Slot | Name | Nearest thing in any of the three |
|---|---|---|
| `CAT-0051` | Elsa Black Grey | nothing. The string "Elsa" appears on none of the three sites |
| `CAT-0060` | Sandstorm | nothing. Phomi has "Sandstone", which is a different word |
| `CAT-0077` | H06 | nothing. Phomi publishes H01, H02, H05, HB01 and HB06, and no H06 |

They take `brand_hidden`, so the site stops naming a manufacturer for them, and nothing
else in `placi-ceramice` does. **Q-W25-10 asks who makes them**, since the answer you gave
for Q-W25-05 turns out not to cover them.

## What is now data rather than prose

`content/plate-brand-settlement.json`: one row per plate, naming the manufacturer, the
exact catalogue name it matched, the tier it matched at and the catalogue page. The tiers
are declared in the file:

| Tier | Plates | What it means |
|---|---|---|
| A-exact | 74 | our name equals a catalogue name exactly, ignoring case, punctuation and gray/grey |
| B-spelling | 5 | one character from exactly one catalogue name, the source carrying the slip: `Romam Red` for Roman Red (x2), `Romam Grey`, `Agean White`, `Y001-01-02` |
| C-contained | 3 | our name is the whole-word prefix or suffix of exactly one name: `Mountain Light Grey` (x2) and `Mountain Medium Grey` inside Loki Mountain |
| D-read | 3 | settled by reading Phomi where the automatic tiers were ambiguous: `Autumn`, `Polish Concrete Wall`, `Polished Concrete Wall` |
| unmatched | 3 | in none of the three |

**The three D-read rows, with the reason each one is not a guess.** `Autumn` was ambiguous
only because Phomi ships the same product under its own typo, `Autumn Yelllow` beside
`Autumn Yellow`: three candidates, one product. `Polish Concrete Wall` was ambiguous only
because Phomi publishes it as two colours, `Polish Concrete Wall Fog` and `Polish Concrete
Wall Medium Grey`: two candidates, one name. `Polished Concrete Wall` is the same Phomi
product with an English participle our source added, and it is a duplicate record of
`CAT-0112` rather than a second product.

## Gate 23, and why it is a gate

`node scripts/check-plate-brands.js`. **Prose is not state.** The 70-plate claim survived
because `catalog-products.json` went on printing a brand line while the claim about it
lived in a board card, and nothing in the repo could disagree with the wrong one.

Held in both directions: every plate has a settlement row and every row is a plate; a row
naming a manufacturer requires `brand` to equal it and **forbids `brand_hidden`**; a row
naming none **requires `brand_hidden`**, which is the ruling's "apply `brand_hidden` only to
plates unmatched after all three catalogues"; and a settled row must name what it matched,
at a declared tier, with a URL.

**It does not visit a catalogue and says so in its own header.** Re-doing research is a
card, not a gate. What it stops is the two files drifting apart silently.

**Nine self-test arms** between two controls, and **both real defects watched fire on the
shipping files**, with the shipping files read clean immediately before and after (R-AB):

| Plant on the real data | Exit | Message |
|---|---|---|
| `brand_hidden` removed from `CAT-0060` | 1 | `unmatched-not-hidden`, naming Sandstorm |
| `CAT-0105`'s brand changed to Kordeko | 1 | `brand-disagrees`, Rome Travertine |

## `scripts/run-gates.js`, the other thing this card ships

W25-03c opened Q-W25-09 asking whether the local gate runner should be committed. **The
habit failed again one card later**: adding gate 23 to the hand-written runner silently did
not apply, and the run reported 21 commands when `quality` carried 22. So option (b) is
shipped rather than asked about, and the question stays open for your ratification only.

`node scripts/run-gates.js` reads `.github/workflows/quality.yml` and runs exactly the
steps it finds, each its own process with its own exit code. It prints what it skipped and
why (`actions/checkout`, `setup-node`, the pinned Lighthouse install) rather than dropping
them quietly, and it **fails rather than guesses** on a shape it cannot read, because a
silent partial read would print "0 of 0 green" and be the same defect again.

Three arms watched, control clean either side: a planted failing step takes it to exit 1
and names it; a `quality.yml` with no readable `steps:` exits 1 rather than reporting a
clean run of nothing; the real workflow runs 22 of 22 green.

## Gates

**22 of 22 exit 0**, reported by `node scripts/run-gates.js`, which is now the thing that
counts them. Gate 23 reads `settled per brand: Phomi 85, no manufacturer (brand_hidden) 3`.

## Recorded for ratification

1. **`scripts/run-gates.js` is new and no ruling asked for it.** Q-W25-09.
2. **Ecofasad cannot be matched by name, and that is a property of Ecofasad.** It is
   reported as zero matched rather than as zero attempted.
3. **`CAT-0110` and `CAT-0112` are the same Phomi product** under two spellings the source
   supplied. Both are settled as Phomi; neither is merged, because merging catalogue
   records is a product decision and was not asked for.
