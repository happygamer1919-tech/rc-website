# W26-03 · Two tiles filled, two refused, and no hub tile is an anchor any more

Card W26-03. Branch `w26/w26-03-hub-tiles`, based on `main` at `18b98ce`. PR only, stops
for the owner.

## Section 12.0, first, on the sha you merged

`EXPECT_SHA=18b98cec9bb2b729785c9f2e8bf548df130f53f6 node scripts/verify-live.js
https://rapidconstruct.md` → **exit 0. PASS, 0 unverified, 0 failed.** 51 pages read, 39
reachable URLs crawled, 16 of 16 redirects answer 200, **0 rows retried, 0 pages that never
became ready.** The marker that failed this run on `a8d819e` is the one W26-01 corrected and
coupled to gate 26; it is green now, on the deploy, which is where it had to be proved.

## The hub tiles, measured against the ruling

W26-R3 says `ACOP-01` to `ACOP-04` "are the tile images imperlux.md shows today". **Read from
the rendered DOM under W26-R2, that hub carries six tile images and two of them answer to our
four tiles.**

| Our tile | imperlux.md file | Fetched | Shipped |
|---|---|---|---|
| Țiglă metalică | `images/categories/tigla-metalica.png` | 200, **1440x1080** | **filled**, cropped |
| Rocă vulcanică Novatik | `images/categories/roca-vulcanica.png` | 200, **1440x1080** | **filled**, cropped |
| Calculează prețul acoperișului | **none exists** | - | **empty** |
| Reduceri | `images/promo/scurgere-gratuit-cta.jpg` | 200, 1080x1080 | **empty, refused** |

**No screenshot-crop was needed.** W26-R3 permits one where a file will not come out at the
450 floor; all six fetch at 200 and the smallest is 1080 on its short side. The fallback is
recorded as unused rather than quietly skipped.

**GARDB-01 to GARDB-04 were already filled at W25-18**, from imperlux.md under the same
override. The ruling names eight slots and four of them were done a wave ago.

## Why the two filled ones are cropped, and it is not framing

**Every one of the five category tiles carries burned-in Romanian text**: a headline and a
**model count**.

| File | Burned-in text | Ink band, measured |
|---|---|---|
| `tigla-metalica.png` | 7 MODELE DISPONIBILE · ȚIGLĂ METALICĂ | y 270..494 |
| `roca-vulcanica.png` | 4 MODELE DISPONIBILE · ȚIGLĂ CU ROCĂ VULCANICĂ | y 240..556 |

**Two separate defects, and neither is cosmetic.** Romanian words burned into a picture render
on the **Russian** page, where section 8 says the two locales stay in step. And "7 MODELE
DISPONIBILE" is a **claim about a range**, in Imperlux's numbers, that would read on our page
as ours: section 5 does not let a figure arrive without a source, and this one has the wrong
source.

**So the crop is the permission being used for what it is for.** W26-R3's own wording is
"screenshot the rendered tile ... and crop", so a crop is contemplated by the ruling; what it
removes here is text rather than framing. The bands were measured rather than eyeballed, by an
ink profile of every row of every file, and each crop starts below the last inked row of text:
**ACOP-01 from y 500, ACOP-02 from y 608.**

| Slot | Box | File shipped | Subject |
|---|---|---|---|
| ACOP-01 | 5 / 6 portrait | **483x580** | the tile profile, filling the frame |
| ACOP-02 | 7 / 2 panoramic | **969x277** | the whole tile, edge to edge |

Both clear the 450 floor. **Nothing is upscaled.** Checked on the built page at 1440: both
labels stay legible, because the tile's own bottom gradient paints `rgba(0,0,0,0.85)` under
them and a white ground reads as near black through it.

## The "Reduceri" picture is an advert, and it is refused twice over

The only imperlux.md tile left is what its `oferte` tile shows. It carries:

1. **The IMPERLUX logo.** W25-R15's override is permission to take a competitor's *product
   pictures*. It has never been permission to put their **brand** on this site, and W24-R2 is
   otherwise absolute about it.
2. **"Vrei sistem de scurgere GRATUIT?"** with a "Click și află detalii" button. A free-offer
   claim this site has no source for (section 5), and the kind of promotional claim R-X
   refuses independently.

**Cropping to its photograph does not save it**: what is left is a rainwater-system render,
which matches neither the tile's own "Reduceri" label nor the ledger's subject line. **The
slot stays empty and the reason is written into its ledger row**, so the next reader does not
re-litigate it. Logged as **Q-W26-03** with the one-line fix: a photograph in
`RC-pics-real/ACOP-04.jpg`.

**ACOP-03 has no counterpart at all.** Imperlux's bento is five product categories and one
promo, and none of them is a price calculator. Nothing was substituted.

## The override machinery went to sixteen and got narrower, not wider

W26-R3: *"the machinery that holds twelve and then sixteen does not widen."*

`scripts/check-photo-slots-w24.js` lists the four ACOP ids beside the twelve fence ids. All
four, although two are filled: **the list is a permission, and listing a slot fills nothing.**

`scripts/check-asset-provenance.js` did **not** simply grow its list. It now holds **one exact
licence sentence per ruling, each with its own files**, so a row carrying W25-R15's sentence
on a roofing file and a row carrying W26-R3's sentence on a fence file are **both** refused.
The new sentence records the crop, which W25-R15's never mentioned:

> `owner_override_imperlux, competitor origin taken by owner decision W26-R3, cropped to
> remove burned-in text, no upscale, source URL per file, owner accepted 2026-09-22`

**Three arms between two clean controls (R-AB)**, each exiting 1: W26-R3's sentence on
`GARDB-04`, W25-R15's sentence on `ACOP-01`, and the override sentence with its source URL
taken away. **And the message was sharpened by watching it.** Its first version printed all
sixteen files and read "this file is in the list" back at someone whose real mistake was the
wrong ruling's sentence; it now names the ruling the licence claims, the files that ruling
covers, and the other override.

## W26-R4: a hub tile opens a page

**Zero same-page anchors on sixteen tiles.** Two tiles were anchors, in two locales each,
both created by W25-24:

| Tile | Was | Now |
|---|---|---|
| Reduceri | `#acoperisuri` | `/in-constructie/` |
| Prețuri și oferte | `#oferta` | `/servicii/modele-garduri/` |

**Neither had an obvious page and both are logged as Q-W26-02 with the recommendation.**
"Prețuri și oferte" opens the page that publishes the fence prices, which is what its label
promises; the cost is that **three of the four fence tiles now share it**. "Reduceri" has no
discounts page to open at all, so it goes to the page this site uses for a destination that
does not exist yet; the cost is that **two of the four roofing tiles now go there**. Inventing
a page and relabelling a tile are both product decisions and neither was taken.

**It is refused in two places, and the reason is the same both times.** `build.js` refuses a
hub tile that declares an anchor, before rendering, naming the ruling. Gate 26 refuses one on
the built tree. A build-time assertion catches the author; a gate catches the tree.

### Gate 26 is narrower in one direction and scoped in the other

**It refuses a same-page anchor by kind now**, which is what its first version did before
W25-24 loosened it. That loosening was not a reasoning error, it was an authority one:
W25-R24 said "an href that answers 200" and an anchor does answer 200, so the gate took the
wider reading **silently**. The lesson written into the file: where a ruling's purpose is not
stated, a gate says so rather than choosing.

**And it is scoped to the hub, which W26-R5 requires.** The roofing restructure adds a second,
**product** bento whose tiles open sections of the same page on purpose. A rule reading every
`.hub__tile` would make that bento unbuildable. So `build.js` marks the hub component's grid
`data-hub-grid="1"` and the gate judges only tiles inside a marked grid. **A hub page with no
marked grid is a failure**, not a quiet pass over nothing.

**Nine arms now, one GREEN, two clean controls.** The same-page anchor is planted **twice**,
once resolving and once not, because the whole change is that resolution stopped being the
question. The missing scope marker is its own arm. The one green arm left is the cross-page
fragment that resolves, which is the shape most at risk of being caught by a rule aimed at the
other one. **The arm that used to be green is now red, and it is named in the file as such.**

## A budget that stayed still while its page moved

Found while taking the before reading for this card, and **not this card's doing**:
`/servicii/garduri/` measures **5,547** against a budget of 5,728 that W24-08 set from a
measurement of **5,668** on 2026-09-20. The page is **121px shorter in both locales** and no
block records it.

**Measured three ways, which agree**: on this branch, on the branch it was stacked on, and on
the deployed site by section 12.0 above (`garduri RO 5547px / 5728 inside`). One local reading
would not have been enough to move a budget on.

**Repaired, because R-Y's own sentence is "what it may never do is stay still while the page
moves."** 181px above the page is not a budget, it is unexamined room for the next change to
hide in, and the direction it drifted is the one nobody watches. Lowered to measured plus 60:
**5,607 and 5,629**, in R-Y and in `verify-live.js`, which hold the pair. W25-11 lowered a
budget for the same reason. **Which wave 25 card shrank it is not chased here**; that is a
bisection and it is not this card's work.

## Heights

Measured at 1440, settled, both locales, before and after on the same recipe.

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/acoperisuri/` | 16,470 | **16,470** | 16,530 |
| `/ru/servicii/acoperisuri/` | 16,608 | **16,608** | 16,668 |
| `/servicii/garduri/` | 5,547 | **5,547** | ~~5,728~~ **5,607** |
| `/ru/servicii/garduri/` | 5,569 | **5,569** | ~~5,750~~ **5,629** |

**Unchanged to the pixel**, which is what filling a slot should do: the `<picture>` takes the
placeholder's own box from the same `--ph-ratio`.

## The ledger

**317 of 337 filled**, up from 315. **20 empty**, two of them the roofing tiles above with
their refusals written into their rows.

## Gates

**25 of 25 gate commands exit 0.**

## Recorded for ratification

1. **Two tiles filled, cropped to drop burned-in Romanian text and a model count** that is
   Imperlux's range and not ours.
2. **Two tiles refused**: no calculator tile exists, and the "Reduceri" candidate is a
   branded free-offer advert. Q-W26-03.
3. **The provenance override is one sentence per ruling**, so the two cannot be crossed.
4. **Gate 26 refuses an anchor by kind and is scoped to the hub grid**, so W26-R5's product
   bento can exist.
5. **Two tile destinations are placeholders for decisions you have not made.** Q-W26-02.
6. **`/servicii/garduri/`'s budget is lowered 121px** to follow a page that had already moved.
