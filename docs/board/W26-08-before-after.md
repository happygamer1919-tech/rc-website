# W26-08 · The eight evidence slots, filled with the owner's own photographs

Card W26-08. Branch `w26/w26-08-before-after`, stacked on `w26/w26-02-imperlux-audit`. PR only,
stops for the owner.

**Inserted at the owner's request mid-dispatch**, outside the W26-01 to W26-07 list.

## What this ships

**All eight before/after slots on `/servicii/case-la-cheie/` are filled**, from
`/Users/ivan/Before:After/`. The ledger goes from **307 to 315 of 337**.

**These were the last evidence slots.** W25-R3 forbids a generated image on one and every
report since W25-27 has listed them as owner photographs; they are owner photographs now.

## The folder, and the three candidates

The owner named "Ivan/Before/After". **Three folders matched and the contents decided it**,
rather than a guess:

| Candidate | Contents |
|---|---|
| `/Users/ivan/Before:After` | **8 files**, `Before01` to `Before04` and `After01` to `After04`, written 10:25 to 10:28 today |
| `/Users/ivan/RC-pics_2nd batch/Before_after` | an older batch, `Before_1.JPG` shape |
| `/Users/ivan/RC-webpics_v2/CONSTRUCȚIE CASE LA CHEIE/Before : After` | **empty** |

The first is the one: eight files, paired, named as the owner said, written minutes before the
instruction. On disk the name is `Before:After` because macOS stores a `/` in a folder name as
a colon.

## No GPS, and none to strip

**A GPS tag on a photograph of a client's house publishes where that client lives**, which is
why gate 17 exists and why R-W requires a client-supplied image to carry no metadata at all.

All eight were read byte by byte before anything else: **no Exif block, no GPS string, and no
GPS IFD pointer in any of them.** They were already clean. They are still stripped and the
strip is still asserted on the written bytes, because "it was clean when I looked" is not a
check that runs next time.

## What the photographs actually show, and what the slots asked for

Four genuine pairs, each the same angle before and after, which is what the slot lines demand.
**Three of the four subjects are not what the slots were written for:**

| Slot asked for | The pair shows | Title now |
|---|---|---|
| Casă la cheie | empty plot with a poured foundation, then a finished white house | Casă la cheie, de la teren liber |
| **Fațadă** | a brick shell with its roof trusses, then the finished house | Casă la cheie, de la roșu |
| **Acoperiș** | a two-storey concrete shell, then the finished house | Casă la cheie, două niveluri |
| **Renovare interioară** | an old house with slate roof and bare render, then renovated | Renovare: acoperiș și fațadă |

**There is no interior photograph in the set**, and there is no facade-only or roof-only pair.
W25-18's precedent applies and is applied: **where the picture that lands is not the picture
the line asked for, the line is corrected to the picture and the change is recorded** rather
than made quietly. Four titles and eight alt texts rewritten in both locales, and the ledger's
`shows` lines carry `AMENDED W26-08` with the reason.

**The owner knows the real projects and may rename them.** These titles describe the
photographs; they are not claims about where or when.

## Never upscaled, and one pair gets retina

`BA-01` is 2752x1536, so it gets a 1180 wide `1x` and a 2360 wide `@2x`. The other three pairs
are 1024x572, **below the 2360 retina width**, so they are written at their own 1024 and get
**no `@2x` rather than an upscale**. The renderer already emits `srcset` only where the `@2x`
file exists.

## Gate 19 learned the slider's shape, and that is the substance of this card

Filling these turned gate 19 red, and the photographs were not the defect.

**The slider renders a filled slot as a bare `<img>`**, not as the `<picture>` the placeholder
component emits, because its drag mechanic clips the image itself and a wrapper would break it.
**Gate 19's scanner only looked at `<div>` and `<picture>`**, so it could not see that img at
all and read all eight rows as "rendered by no built page".

Three changes, each narrowing rather than loosening:

1. **`img` joins the scanned elements**, and the img carries `data-photo-slot` now so it can be
   found. It is still held to carrying the slot id, to having alt text, and to matching the
   row's ratio.
2. **The ratio comes from `width` and `height`** on an img, which is the same assertion in the
   shape that element has.
3. **The light/dark variant is not demanded of an img.** A variant is a property of the
   placeholder box; the img has no box. Every other element is held to it exactly as before.

**And one approved origin was missing.** R-W's client-supplied amendment states the licence as
`owned by Rapid Construct, supplied for site use` and leaves "client-supplied original" to the
licence-URL cell, so gate 19's list never matched it. **It had never come up**: no ledger slot
carried that origin until these photographs did.

**Two arms watch the new shape**, one GREEN: a slider img is accepted as a filled rendering,
and one whose width and height disagree with its row fires on `ratio`.

## Gates and budgets

**25 of 25 gate commands exit 0.** `/servicii/case-la-cheie/` reads **6,376** against 6,436 and
RU **6,483** against 6,543, both unchanged: a filled slot takes the placeholder's own box.

**Empty slots: 22**, and **none of them is an evidence slot any more.**

## Recorded for ratification

1. **The four project titles now describe the photographs**, because three of the four subjects
   are not what the slots were written for and there is no interior pair.
2. **Three pairs get no `@2x`** rather than an upscale.
3. **Gate 19 sees a third rendering shape.** A gate that cannot see a legitimate rendering
   reports it as missing, which is what happened here.
