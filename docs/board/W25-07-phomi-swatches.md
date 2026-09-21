# W25-07 · Forty-seven labelled swatches installed, and eleven cards the rule will not let me fill

Card W25-07. Branch `w25/w25-07-phomi-swatches`. PR only, stops for the owner.

Stacked on `main` at `804768bd1e6c179255175959b9b47fabfe02de80`, with #94, #95, #96 and #97
all merged and confirmed ancestors of HEAD. **Section 12.0 was run on that sha before any
work**: `node scripts/verify-live.js` with the full forty-character `EXPECT_SHA`, **exit 0,
PASS, 0 unverified, 0 failed, 51 of 51 pages**, after polling the edge with a cache-buster
until it served the merge sha.

## The headline

**Catalog slots filled: 27 of 261 before, 74 of 261 after.** The ceramic plates go from
**25 of 88 to 72 of 88**.

| | Before | After |
|---|---|---|
| Ledger slots filled | 27 | **74** |
| Ceramic plates with a photograph | 25 of 88 | **72 of 88** |

## The rulings, recorded before anything was done

`docs/rulings/W25-R.md` is new: the register of the `W25-R` ruling ids. This dispatch's six
rulings are recorded there verbatim as **W25-R5 to W25-R10**.

**The next free id was W25-R5, not W25-R4.** `W25-R4` is already the fourth ruling of
2026-09-20, "a slot with no compliant image stays a placeholder", and it is cited by number
in `DECISIONS.md`, `docs/BACKLOG.md`, `docs/QUESTIONS.md`, a board card and a script. The
register also fixes a collision that was already in the repo: `DECISIONS.md` has blocks
headed `W25-R2` and `W25-R3` which are ANSWER SETS, not the rulings of those numbers.
Nothing is renumbered, because those bodies are immutable under R-S; the register says
which reading applies where.

## What W25-R5 changed in the tool

`scripts/process-packshot.js`: **`--label` no longer refuses.** It records that the person
who looked at the file saw a burned-in product name, prints the flag on the run, and that
flag is what `docs/PHOTO-REVIEW-W25.md` will list for the owner's own pass.

`--crop` and its post-crop floor stay exactly as they were, because the arithmetic is still
right whenever a crop IS the answer. Re-watched, control either side:

| Arm | Exit | Behaviour |
|---|---|---|
| 449px source | 1 | still under the 450px floor |
| `--label` with no `--crop` | **0** | now installs, printing the flag |
| crop leaving 650x390 | 1 | still refused, height short by 60px |
| crop leaving 450x450 | 0 | still accepted |

## What went in

**47 Phomi colour swatches**, 650x450 at source, written at 600x415 because the longest
side exceeds the 600 output and nothing is upscaled. Every one from `phomi.com`, every one
looked at before it was installed.

**And looking at them verified the brand settlement a second time.** Phomi prints the
product name into each swatch, so the contact sheet is 47 independent readings of the match
W25-03d settled from file names. **47 of 47 agree**, including every tier that was not an
exact string match:

| Our record | Printed in Phomi's own image | Tier |
|---|---|---|
| Mountain Medium Grey | Loki Mountain Medium Grey | C-contained |
| Mountain Light Grey | Loki Mountain Light Grey | C-contained |
| Romam Red | Roman Red | B-spelling |
| Agean White | Aegean White | B-spelling |
| Fawn Grey | Fawn Gray | A-exact after gray/grey |
| Y001-01-02 | Y001-01-02 | B-spelling |
| Autumn | Autumn Yellow | D-read |

No watermark, no retailer logo, no face and no other seller's branding on any of the 47.

## The thirteen I could not fill, and the rule that stopped eleven of them

**Eleven slots are held by the one-picture-one-card rule, which the owner ratified this
morning.** Ten Phomi swatches are each the correct picture for more than one of our
records:

| Phomi picture | Our records | What differs between them |
|---|---|---|
| Loki Mountain Light Grey | `CAT-0044`, `CAT-0045`, `CAT-0086` | 1200x600, 1200x600, 2700x1200 |
| Portoro | `CAT-0069`, `CAT-0099` | 1200x600 and 2400x1200, against 2400x1200 |
| Medium Grey | `CAT-0056`, `CAT-0078` | 1200x600, against three sizes |
| Blue Grey | `CAT-0046`, `CAT-0070` | 1200x600, against two sizes |
| Ink Dyed | `CAT-0061`, `CAT-0083` | |
| Sunis White | `CAT-0072`, `CAT-0084` | |
| Andes Yellow | `CAT-0073`, `CAT-0085` | |
| Veil Dark Grey | `CAT-0071`, `CAT-0087` | |
| Sairo Off White | `CAT-0076`, `CAT-0091` | |
| Roman Red | `CAT-0089`, `CAT-0095` | |

**These are not duplicate records. They are the same tile face in different sheet sizes**,
and the prices differ accordingly: Portoro is "De la 680,00 lei" on one record and
"3.806,00 lei / bucata" on the other. Phomi publishes **one swatch per colour, not one per
size**, so the same picture genuinely is the right picture for both.

**I installed on the first record of each group and left the other eleven grey**, which is
the safe default: nothing wrong is published and eleven cards stay as they were. Changing
the rule to allow it is a change to something the owner ratified today, so **Q-W25-13** asks
rather than assumes.

**Two more are held for a different reason.** `CAT-0110` "Polished Concrete Wall" and
`CAT-0112` "Polish Concrete Wall" name a Phomi product that exists only as colours:
`Polish Concrete Wall Fog` and `Polish Concrete Wall Medium Grey`. Our records name no
colour, so no single Phomi image is that product, and picking one would be the near match
W25-R4 forbids.

## Where the 88 plates stand

| | Plates |
|---|---|
| Filled with a Phomi family image (W25-03c) | 25 |
| Filled with a Phomi colour swatch (this card) | **47** |
| Held, one picture serving several size records | 11 |
| Held, a family name with no colour | 2 |
| Held, in no catalogue and `brand_hidden` | 3 |
| **Total** | **88** |

## Gates

**22 of 22 exit 0**, reported by `node scripts/run-gates.js`. Gate 19 reads `ledger slots
filled: 74 of 261`, and **its one-picture-one-card rule is what produced the eleven held
slots**, which is the first time that assertion has decided anything on real data.

## Recorded for ratification

1. **The ruling register is a new file**, `docs/rulings/W25-R.md`. The dispatch asked for
   the rulings to go in "the repo rulings file" and that directory had no W25 file.
2. **The next free id was W25-R5.** W25-R4 is in use.
3. **Eleven slots were left grey rather than sharing a picture.** Q-W25-13.
