# W25-12 · The review list the owner reads, and a priority batch of eight

Card W25-12. Branch `w25/w25-12-photo-review`, rebuilt on `main` at `2df8033` after #98 to
#102 merged. PR only, stops for the owner.

## What this ships

**`docs/PHOTO-REVIEW-W25.md`**, the list the owner reads when reviewing images by hand.
**160 rows in table one, 162 in table two**, across Catalog, Acoperisuri and Garduri.

**And it is a gate, not a document.** W25-R5 permits a photograph with a burned-in product
name **on condition that each one is flagged in the review list**, and W25-R7 permits a
Dasterum image **on condition that its watermark stays as published**. A review list that
had drifted from the ledger would make both permissions unverifiable. So it is generated
from `docs/PHOTO-SLOTS-W24.json`, `docs/assets/PROVENANCE.md`,
`content/catalog-products.json` and `content/plate-brand-settlement.json`, and **gate 24**,
`node scripts/gen-photo-review-w25.js --check`, fails if the committed file and the data
disagree.

## Table one, and the flags that make it worth reading

| Flag | Rows | What to look for |
|---|---|---|
| **labelled swatch** | 47 | the product name is printed into the photograph, in English, and the card prints it again underneath in Romanian |
| **watermark** | 71 | a DASTERUM mark in the top right. It is there on purpose and must not be cropped |
| **low confidence match** | 7 | the plate matched Phomi at a tier that is not an exact string match |
| no flag | 42 | an ordinary manufacturer packshot |

**No flag is typed.** "labelled swatch" is read from the brand settlement's own `level`
being `variant`; "watermark" from the licence being the `direct_supplier` origin; "low
confidence" from the settlement's tier not being `A-exact`. Each one traces to a file, so
none of them can be right in the document and wrong in the data.

**The list is 160 rows and not 133.** The dispatch asks for a row per image installed by it,
which is 133. The other 27 were installed by the dispatch before this one and **have never
been through a review list either**; leaving them out would hand the owner a list that is
not all of it. The flag columns tell them apart: nothing from the earlier dispatch is a
labelled swatch or carries a watermark.

## Table two, and the reason on every row

162 empty slots, each with a reason that traces to a card or a ruling rather than to a
memory:

| Section | Empty | The reasons, in their own words |
|---|---|---|
| Catalog | 142 | `brand_hidden` and in no catalogue; a Phomi picture already on another record of the same product (Q-W25-13); no manufacturer, so no manufacturer site (W25-R1); the manufacturer publishes nothing that clears 450 (W25-08); W25-R9 where the appearance is not in the records |
| Acoperisuri | 8 | 4 hub tiles in the priority batch, 4 Novatik tiles held by W25-R2 |
| Garduri | 12 | 8 model cards, **"real photo from owner project set"**, and 4 hub tiles in the priority batch |

**The eight `GARD-` model cards carry exactly the reason the dispatch specifies.** They are
also removed from the prompt pack on that ground, so nothing generates a fence that a real
photograph is coming for.

## The prompt pack: two changes

**W25-R9 applied.** Q-W25-12 is closed at option (d): no AI image on any product card whose
appearance is not in the records. **89 entries are gone**, the 25 lamps and the 64
mouldings, including the 25 this terminal recommended generating. They are listed as held,
waiting on the client. The generator now **dies** if such an entry ever survives into the
pack, so the ruling cannot quietly lapse.

**The PRIORITY BATCH is first.** `ACOP-01` to `ACOP-04` and `GARDB-01` to `GARDB-04`, the
hub tiles on `/servicii/acoperisuri/` and `/servicii/garduri/`, in their own labelled block
at the top. The generator **dies** if the batch names a slot the pack does not carry, so it
cannot quietly lose one.

The pack shrank from 126 entries to **30**: 89 removed by W25-R9, 8 by the owner-photo
reason, and the rest because **160 slots are now filled with real photographs** instead of
waiting for a generated one.

## Gates

**23 of 23 exit 0**, from `node scripts/run-gates.js`. Gate 24 is new and reads
`160 installed, 162 empty, file matches the data`.

## Section 12.0 on `2df8033`, owed by #98 to #102

Run unprompted after the owner's merge, with the full forty-character `EXPECT_SHA` and the
edge polled with a cache-buster until it served that sha.

| Run | `node scripts/verify-live.js` | Result |
|---|---|---|
| 1 | exit **1** | FAIL, **1 unverified**, 0 failed, 67 of 67 pages |
| 2 | exit **0** | PASS, 0 unverified, 0 failed, 67 of 67 pages |
| 3 | exit **0** | PASS, 0 unverified, 0 failed, 67 of 67 pages |

**The one unverified row was the instrument, and it was diagnosed by measurement before
anything was proposed**, which is what section 12.0 asks for. `sub RU eps` read **900px with
promoBar 0 and productCards 0** on run 1, and **3,464px, clean** on runs 2 and 3, agreeing to
the pixel. The page answers 200 with 37,555 bytes of the right template on the edge and its
RO twin passed all three times. A 900px page with no promo bar and no card is a page read
**before its stylesheet applied**.

**Every budget this dispatch set was confirmed live.** The sixteen new catalogue rows all
read inside, including the parent at 11,857 against 11,917; the two lowered fence budgets
read 3,686 and 3,707 against 3,746 and 3,767; the tigla page reads inside its raised 4,039
and 4,072. 41 reachable URLs crawled, 0 with a visible TODO.

**Q-W25-15 opened**: gate 9 reads each page once and gate 5 already takes the median of
three for exactly this reason.

## Recorded for ratification

1. **The review list is a gate.** Both W25-R5 and W25-R7 make a flag in it part of the
   permission, so a list that can drift makes a permission unverifiable.
2. **It carries 160 rows, not the dispatch's 133.** The 27 from the previous dispatch have
   not been reviewed either.
3. **The prompt pack's generator now dies** on a W25-R9 entry and on a missing priority
   slot, rather than warning.
