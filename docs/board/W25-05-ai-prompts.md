# W25-05 · The AI prompt pack, and the 135 rows it refuses to write prompts for

Card W25-05. Branch `w25/w25-05-ai-prompts`, stacked on
`w25/w25-04-packshots-iluminat`. PR only, stops for the owner.

**No image enters the repo on this card, and no slot changes state.** The deliverable is
`~/Documents/rc-audit-w24/AI-PROMPTS-W25.md`, outside the repo, as the plan specifies.

## The numbers

| | Rows |
|---|---|
| Ledger rows | 261 |
| **Prompts written** | **126** |
| Held, with a reason each | 135 |

| Held because | Rows |
|---|---|
| a named tile product (W25-R2) | 67 |
| the product names a manufacturer, so it is packshot work | 33 |
| already filled with a real photograph | 27 |
| an evidence slot (W25-R3) | 8 |

## The pack is generated, not typed

`node scripts/gen-ai-prompts-w25.js [output-path]` builds it from
`docs/PHOTO-SLOTS-W24.json` and `content/catalog-products.json`. **126 entries typed by
hand from 261 rows would be wrong somewhere**, and the ratio, the minimum pixels and the
page each slot renders on would go stale the first time a card moved one. Re-running it
after a card that fills slots shrinks the pack by itself: this run already reports 27 held
as filled, which is W25-03c's twenty-six plus the one from W25-02.

The script lives in the repo and its output does not, which is the same split the plan
asks for: a generated image is the owner's own asset under W25-R3 and its prompt is working
material, not a governing document.

## Two rules decided what is in it, and I applied both rather than my own

**W25-R3**: a generated image is allowed only on a product, hub, hero or cross-sell slot,
and never on a project, portfolio or before/after slot. The eight `BA-` rows are held.

**W25-R2**: no AI image on any named tile product. **This is the big one: 67 rows.** All 63
ceramic plates that are still placeholders, and the four Novatik roof tiles, which are
named tiles by the same words. A tile is sold by its exact appearance, and a render of one
is an invented appearance under a real product name. That rule is why 60 Phomi colour
variants stayed grey at W25-03c rather than taking a photograph with the wrong name printed
on it, and generating them here would walk straight around it.

**This corrects something I wrote yesterday.** Q-W25-10 offered "leave them hidden and send
them to W25-05" as its recommended option for the three plates in no catalogue. **That
option does not exist**: they are named tile products and W25-R2 holds them. Q-W25-10 is
amended on this card and its live options are now (b) and (c).

## What the pack actually contains

One shared style block, then 126 entries in nine groups. Per entry: the slot id, the
filename to save (`<slot id>.png`), the aspect ratio, the minimum pixels, the page it
renders on, the product and its variant line where there is one, whether the records
describe its appearance, and the prompt.

| Group | Entries |
|---|---|
| Elemente decorative | 64 |
| Sisteme de iluminare | 25 |
| Fence model cards | 8 |
| Catalogue category tiles | 7 |
| Unbranded building materials | 8 |
| Acoperisuri hub tiles | 4 |
| Garduri hub tiles | 4 |
| Cross-sell cards | 2 |
| Copertine hero | 1 |

**The style block's first rule is no text.** W25-R2 refuses a photograph with a product name
burned into it, and that refusal is what keeps 60 ceramic plates grey today. A generated
image that invents lettering fails the same rule, so it is refused in the same words.

**The unbranded materials are prompted as the MATERIAL, never as a package.** Three of them
carry a trade name in the product name ("Meșterul Dibaci") with no manufacturer behind it,
and a generated sack wearing that name would be a manufacturer's packaging that does not
exist. So the adhesive is a cone of powder with a trowel beside it, the render is a sample
board, the polystyrene is a stack of boards with no printed film. Nothing invents a
package.

## The one thing the pack cannot decide, stated in the pack itself

**89 of the 126 entries are for products whose appearance the records do not describe**:
the 64 mouldings, which carry a shop code and a price per metre and **no profile, no
dimension, no shape**, and the 25 lamps, which carry an OEM code and sometimes a colour
temperature.

A generated picture of `RED 17` is a picture of **a** moulding, not of that one, and a
buyer choosing by profile could order the wrong thing. W25-R3 permits it, so the pack
writes the entry and **marks every one of the 89** rather than deciding for the owner.
Q-W25-12 puts the four ways to go, and recommends splitting: generate the 25 lamps, where a
plain outdoor lantern is honest enough, and photograph the 64 mouldings in the shop, where
the profile is the product. Q-W25-11 may remove the moulding problem entirely if they turn
out to be Kordeko, who photographs all 59 of theirs.

## Gates

**22 of 22 exit 0**, reported by `node scripts/run-gates.js`. The tree changes only in
documents and one new script, and no gate reads the generated pack, because it is outside
the repo by design.

## Recorded for ratification

1. **The generator is in the repo and its output is not.** The plan says the pack is
   written outside the repo; it does not say how, and 126 hand-typed entries would drift
   from the ledger the first time a slot moved.
2. **`NVK-01` to `NVK-04` are held as named tile products.** W25-R2's words are "named tile
   product" and Novatik Classic, Slate and Roman are named tiles. The plan listed them as
   pack entries; the ruling postdates the plan.
3. **Q-W25-10's option (a) is withdrawn** as contradicting W25-R2. The question is amended,
   not rewritten.
