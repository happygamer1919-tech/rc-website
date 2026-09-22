# W25-28 · The category tiles, and a gate rule that depended on walk order

Card W25-28. Branch `w25/w25-28-category-tiles`, stacked on `w25/w25-27-sourcing`. PR only,
stops for the owner.

## What this ships

**All eight `CATEG-` tiles on `/catalog/` are filled**, each from an installed product image of
its own category, under **W25-R22**. The ledger goes from **299 to 307 of 337**.

**No image file was added.** Not one byte: every tile is a declared reuse of a picture the site
already carries and a person has already reviewed.

## Why there is no crop file

W25-R22 says "cropped to the tile ratio", and **the tile already does the cropping**:
`.cat-tile__ph.ph--filled img` paints `object-fit: cover` in a box whose ratio is the ledger
row's `4 / 3`. What a visitor sees IS the 4/3 crop.

Cutting a second file would have been the obvious move and it fails on three of the eight.
Measured before deciding:

| Tile | Source | A centred 4/3 crop would be |
|---|---|---|
| `CATEG-03` | `CAT-0060` 600x284 | 379x284, **under the 450 floor** |
| `CATEG-05` | `CAT-0191` 600x375 | 500x375, **under the floor** |
| `CATEG-08` | `CAT-0224` 488x488 | 488x366, **under the floor** |

Every Dasterum roofing image is 488x488, so **no roofing product could have produced a cropped
tile at the floor at all**. Cropping five and rendering three would have been two mechanisms
for one thing. One mechanism: the source, above the floor, cropped by the box.

## The eight

| Tile | Category | Stands on |
|---|---|---|
| `CATEG-01` | Sisteme de termoizolație | `CAT-0004` Polistiren expandat STOP FIRE |
| `CATEG-02` | Tencuieli decorative | `CAT-0032` Duraziv Standard TDS cu silicon |
| `CATEG-03` | Plăci ceramice | `CAT-0060` Placă Sandstorm |
| `CATEG-04` | Elemente decorative | `CAT-0127` Element decorativ RED 01 |
| `CATEG-05` | Vopsele | `CAT-0191` Amphibolin |
| `CATEG-06` | Sisteme de iluminare | `CAT-0206` Lampă K5014 |
| `CATEG-07` | Alte materiale | `CAT-0221` Membrana de difuzie |
| `CATEG-08` | Acoperișuri | `CAT-0224` Țiglă metalică Monterrey |

**Membership is asserted, not assumed**: the write refuses a tile whose source record is not in
that category, so a tile cannot show a product from somewhere else.

**The flags travel with the picture.** `CATEG-04` inherits `label` from `CAT-0127`, whose render
has `RED-01` burned into it, and `CATEG-08` inherits `watermark` from the Dasterum source. A
picture that needed flagging on a product card needs it on a tile.

## The gate rule that depended on walk order

Filling these turned gate 19 red on **40 problems**, and the tiles were not the defect.

W25-20's reuse check was *"the first slot the walk meets owns the picture, and every later slot
must declare reuse of THAT slot"*. `dist/catalog/` is walked before `dist/servicii/`, so
**`CATEG-08` became the owner of a photograph and `CAT-0224`, the product it is a picture of,
was told to declare reuse of the tile.** The message read `W25-R17 permits it only where this
slot declares reuse_of "CATEG-08"`, which is backwards, and it was backwards because of
directory order.

**The rule was never about order.** It is now written as the group rule it always was: collect
every slot standing on one picture, require **exactly one origin** in the group, and require
every other member to declare reuse of a member. A chain of three passes; two origins fail;
the walk order cannot change the answer.

**Two arms watch it**, and one of them is the shape the old version refused: three slots on one
picture with one origin and two declaring reuse, asserted GREEN.

## Slots and gates

**299 to 307 of 337.** **25 of 25 gate commands exit 0.** No height moved: a filled slot takes
the placeholder's own box.

**Nineteen empty slots are left in the three reviewed sections**, and thirty in the ledger. The
eight before/after evidence slots are among them and are owner photographs by rule.

## Recorded for ratification

1. **No crop file.** The tile's own `object-fit: cover` is the crop, and a second file would
   have fallen under the floor on three of the eight.
2. **Gate 19's shared-picture rule is a group rule now**, not a first-seen rule. The old one
   gave a different answer depending on the order `dist/` was walked in.
3. **Flags travel with the picture** from the product card to the tile.
