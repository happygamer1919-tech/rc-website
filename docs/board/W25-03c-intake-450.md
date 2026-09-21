# W25-03c · The floor moves to 450 and twenty-six slots fill

Card W25-03c. Branch `w25/w25-03c-intake-450`. PR only, stops for the owner (R-V as
amended at wave 19).

Stacked on `main` at `8a966f649095e29ad30d9c30055771c9027d2c8f`, with #93 merged.
**Section 12.0 was run on that sha before any of this work**: `node scripts/verify-live.js`
against `https://rapidconstruct.md` with the full forty-character `EXPECT_SHA`, **exit 0,
PASS, 0 unverified, 0 failed, 51 of 51 pages read, 39 reachable URLs crawled, 0 with a
visible TODO**. The edge was polled with a cache-buster until it served the merge sha
before a single measurement was taken.

## The headline

**Slots filled: 1 of 261 before, 27 of 261 after.** Twenty-six real photographs, every one
from the manufacturer's own site, every one looked at by a person before it was installed.

| | Before | After |
|---|---|---|
| Ledger slots filled | 1 | **27** |
| Catalogue products with a photograph | 1 of 223 | **27 of 223** |
| Ceramic plates with a photograph | 0 of 88 | **25 of 88** |

## What went in

**Twenty-five Phomi flexible ceramic plates**, each filled with the photograph Phomi
publishes for that product, at 459x398 (one at 458x398). **One ROKO AquaMix decorative
plaster**, `CAT-0033`, the manufacturer's own pack shot at 492x400, from
`rokospol.com`, which is ROKOSPOL a.s., ROKO AquaMix's own maker.

Nothing was upscaled. A 459px source is written at 459.

**Why twenty-five and not the eighteen W25-03b staged.** The full catalogue walk this
card's ruling ordered is in W25-03d, but it had to run first to know which plates are
Phomi families, and it moved the number: W25-03b matched 18 families from Phomi's category
listing pages, and the walk finds **25**. Seven more plates are Phomi families that the
listing pages did not name the way our records do: `CAT-0107` Concrete Pouring Slab,
`CAT-0114` Sawtooth Wood, `CAT-0117` Rope Wave B, `CAT-0119` Stackle Square 4.0,
`CAT-0123` Oman Linear Stone, `CAT-0124` Chiseled Stone, `CAT-0126` Stone Ridged. Four of
those seven live on top-level pages (`phomi.com/sawtooth-wood/`) that sit under no range,
which is why walking the ranges missed them.

**And one of the eighteen was nearly a wrong photograph.** `CAT-0111` is "Rusty Slab", and
Phomi's product page for it is headed **Rusty Stone**. W25-03b had it staged as a family
match and there is no name "Rusty Slab" anywhere in Phomi's product pages. It survives
because Phomi's own category card is titled **"Rusty Slab"** and links to `/rusty-stone/`:
the manufacturer names the same product two ways. That was found by reading the category
card, not by trusting the staged file, and the same reading is what produced the other
seven.

## What stayed a placeholder, and the measurement for each

| What | Count | Measured | Why it is refused |
|---|---|---|---|
| Phomi colour variants | 60 | 650x450 | **the product's English name is burned into the picture**, and no crop removes it while leaving both sides at 450 |
| ROKO Omítka Rokomozaiková, `CAT-0038` | 1 | **423x400** | longest side short of the 450 floor by **27px**; ROKOSPOL publishes no larger file |
| DURAZIV, `CAT-0032` and `CAT-0037` | 2 | **343x335** | short of the floor by **107px**, re-measured today on `duraziv.ro` |
| Plates in no catalogue yet | 3 | not applicable | `CAT-0051` Elsa Black Grey, `CAT-0060` Sandstorm, `CAT-0077` H06; they go to W25-03d's Ecofasad and Kordeko match |

### The swatch rule, measured rather than asserted

The owner's rule is "images with a burned-in name label are not used as is; crop the label
only if both sides remain 450 or more after crop, else placeholder". Phomi's colour
swatches are 650x450 with the English name in the lower left. **Both crop directions were
measured on a real swatch, `Kamu Yellow`:**

| Crop | Result | Label gone? | Verdict |
|---|---|---|---|
| bottom 90px | 650x360 | no, fully visible | not a candidate |
| bottom 110px | 650x340 | no, top of it still shows | refused, height short by 110px |
| **bottom 130px** | **650x320** | **yes** | **refused, height short by 130px** |
| left 260px | 390x450 | no, the tail of the word shows | refused, width short by 60px |
| **left 300px** | **350x450** | **yes** | **refused, width short by 100px** |

**The smallest crop in either direction that actually removes the label leaves a side
short.** So all 60 stay placeholders, and that is a measurement and not a preference.

The pack lettering on `CAT-0033` and `CAT-0010` is a different thing and is not caught by
this rule: it is printed on the bucket, which is the product. The rule is about a name
laid over a photograph.

## The code that now holds all of it

**`scripts/process-packshot.js`**
- `SOURCE_FLOOR` 500 to **450**, recorded as final. `OUTPUT` stays 600. Nothing upscales.
- `--crop top,right,bottom,left` removes pixels from the edges and then **asserts both
  sides are still 450 or more**, printing both measurements when it refuses.
- `--label` is the person's declaration that they saw a burned-in name label. **`--label`
  with no `--crop` is refused**, which is the "not used as is" clause made executable.

Eight arms watched, each its own process:

| Arm | Exit | Message |
|---|---|---|
| 449px source | 1 | under the 450px floor |
| 450px source | 0 | written at 450, not upscaled |
| 520px source | 0 | written at 520, not upscaled |
| 900px source | 0 | capped at 600 |
| `--label` with no `--crop` | 1 | forbids using such an image as is |
| crop leaving 650x390 | 1 | height is short by 60px |
| crop leaving 450x450 | 0 | both at or above the floor |
| `--crop 1,2,3` | 1 | takes four whole non-negative pixel counts |

The crop's direction was proved too: removing 200px from the left and removing 200px from
the right produce different bytes, so `--cropOffset` is honoured and not ignored.

**`scripts/check-photo-slots-w24.js` (gate 19) gains the third clause**, the one no
single-file tool can hold: **a family image never fills a colour-variant card.** Stated as
something a machine can read: two filled slots must not stand on the same picture. Both
ways a reuse can be written are checked, the same file path in two rows and two files whose
provenance rows name the same source image URL, and **each is planted as its own self-test
arm** between the two controls. Gate 19 now runs **10 arms**; it read 588 placeholders on
67 pages against 261 rows and passed.

## Gates

**21 of 21 exit 0**, each its own process with its exit code read (R-AB). That is every
command `quality` runs, in `quality.yml`'s order. Gate 19 reads `ledger slots filled: 27 of
261`; gate 17 finds no GPS on any of the 26 new files; gates 11, 14, 18 and 20 are green in
both locales with 26 real photographs on the ceramic plates page.

**The count 21 is a correction.** W25-01, W25-02, W25-03 and W25-03b each reported "19 of
19", and W24-10 reported "19 of 19 exit 0, gates 20, 21 and 22 included". Nineteen was
never the number of commands `quality` runs. See the note at the foot of this card.

## Recorded for ratification

1. **`CAT-0118` and `CAT-0119` are matched with their version suffix dropped.** Our records
   say "Polished Wood 4.0" and "Stackle Square 4.0"; Phomi's pages are "Polished Wood" and
   "Stackle Square". They are the same products at a version the source states and Phomi
   does not.
2. **The source page recorded for a Phomi row is the product's own canonical page**, while
   the image itself is the card image Phomi publishes for that product on its range page.
   Both are on `phomi.com` and both are in the provenance row.
3. **Ten manufacturers and 29 products are still unattempted**, from W25-02's agent
   stall: Caparol 15, Baumit 5, SWEETONDALE 2, and one each of IZOVAT, FAWORI, NOVOTERM,
   KREISEL, Ceresit, ISOMAT and STANCOLAC. They are not in this dispatch's work order and
   were not sourced here. Q-W25-08 asks for a card and recommends one.

---

## The note on "19 gates", which the owner asked for

**Three numbers, and only one of them was ever right.**

| Number | What it counts | Value |
|---|---|---|
| Numbered gates in `docs/CLAUDE.md` section 11 | the list, which is appended to and never renumbered | **22** |
| Commands `quality` actually runs | measured today from `quality.yml`, each its own step | **21** |
| What four cards in a row reported | a local runner's process count | **19** |

They differ for two separate reasons and both have to be said, because fixing one would
still leave the report wrong.

**Why 22 is not 21.** Five numbered gates are not scripts and `quality` cannot run them:
gate 4 (heights measured settled), gate 6 (no new colour value), gate 7 (reduced motion
still disables every effect), gate 8 (`DECISIONS.md`, `BACKLOG.md` and `QUESTIONS.md`
updated) and **gate 9, `verify-live.js` against the deployed sha, which by section 12.0
runs after the merge and not in `quality` at all.** Seventeen numbered gates are scripts,
and `quality` runs four more that were never given numbers: `check-asset-provenance.js`
(R-W), `check-scarcity.js` (R-X), `check-catalog-pages.js` (RC-129) and `check-origin.js`
(W14-17). 17 + 4 = 21.

**Why 21 was reported as 19: two commands were missing, and they are named.**

1. **Gate 21, `node scripts/verify-live.js --self-check`** (W24-09a).
2. **Gate 22, `node scripts/check-css-collisions.js`** (W24-09b).

The last time this repo wrote out the commands it ran was W23-07, in `DECISIONS.md`: that
list is **17 commands**. Gate 19 landed at W24-01 and gate 20 at W24-09, which makes
**19**. Gate 21 landed at W24-09a and gate 22 at W24-09b, and the local runner never grew
to 21. **`quality` did run them on every pull request**, so nothing unchecked reached
`main`; what was wrong was the report, not the branch.

**And W24-10's sentence "19 of 19 exit 0, gates 20, 21 and 22 included" was false**, for 21
and 22. It is the worst kind of wrong entry, because it names the very gates it does not
cover and so reads as proof that they were.

**The third gate, the one neither list holds.** Counting gate 9 as run by `quality` is the
mistake that made all of this survivable-looking, because gate 9 is the gate that finds
what the other twenty-one cannot: it found the broken `verify-live.js` (W24-09a), the
`.faq` collision (W24-09b) and six stale markers (W24-07a). It is owed **by the card that
merged**, after the deploy, and section 12.0 says so. This card ran it on `8a966f6` before
starting, and the next one runs it on this card's merge sha.

**What changes, so it cannot drift again.** The runner is written out in full in this
card, in `quality.yml`'s order, and a card reports the number it measured rather than the
number it reported last time. Q-W25-09 asks whether that runner should be committed as a
script, which is the only way the count stops depending on a file in a scratch directory.
