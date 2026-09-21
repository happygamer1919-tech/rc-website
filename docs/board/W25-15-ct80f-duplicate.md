# W25-15 · The CT80F duplicate, blocked by the ruling that governs it

Card W25-15. Branch `w25/w25-15-ct80f-duplicate`, stacked on
`w25/w25-14-underfloor-second-pass`. PR only, stops for the owner.

**BLOCKED, and the block is the ruling working rather than the card failing.**

## W25-R13, applied

> Duplicate records: if name, unit and price are identical, drop one record and keep the URL
> of the older id. If anything differs, block with a question quoting both rows.

**Three of the three differ**, measured from `content/catalog-products.json`:

| | `CAT-0002` (`f3d-1858`) | `CAT-0005` (`f3d-3283`) | Same? |
|---|---|---|---|
| **Name** | `Polistiren expandat CT80F` | `CT 80 F - Polistiren expandat` | **no** |
| **Unit** | RU `1000 x 500 mm`, twice | RU `1000x500x30 мм` | **no**, and the second names a thickness |
| **Price** | **7,62 to 76,20 lei** | **6,50 to 65,00 lei** | **no**, about 15 percent apart |

So the card stops and **Q-W25-16 quotes both rows in full**, every field, with the four ways
out and a recommendation that says plainly which of them depends on an answer only the owner
has.

## Why this is not a judgement call I should have taken

The RO variant lines are the same ten thicknesses, which reads like one product listed
twice. **The RU line on `CAT-0005` names a single 30mm board**, which reads like a second,
different product, and would explain a 15 percent price gap rather than contradict it.

The data supports both readings and **picking one would decide what the shop sells**. That
is the case the ruling was written for.

## What the site shows meanwhile

Unchanged. `CAT-0002` carries the Caparol packshot installed at W25-08; `CAT-0005` is grey,
held by the one-picture-one-card rule since that card. **Both prices are already live**, and
that is the state Q-W25-16 asks about rather than a state this card created.

## Nothing changed in the tree

No record dropped, no price moved, no slug changed, no image touched.

## Gates

**23 of 23 exit 0**, from `node scripts/run-gates.js`.

## Recorded for ratification

1. **The card is blocked, not skipped.** Its status in `docs/BACKLOG.md` says blocked and
   names the question, and the next card was worked immediately.
