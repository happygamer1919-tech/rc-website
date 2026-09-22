# W25-18 · Twelve Garduri slots, from a competitor, by the owner's decision

Card W25-18. Branch `w25/w25-18-garduri-images`, stacked on `w25/w25-17-fatade3d-images`.
PR only, stops for the owner.

## What this ships

**All twelve Garduri slots filled**, `GARD-01` to `GARD-08` and `GARDB-01` to `GARDB-04`,
from `imperlux.md` under **W25-R15**. Garduri goes from **0 to 12 of 12**. The ledger goes
from 259 to **271 of 333**.

> **STRATEGY RISK, recorded at the owner's instruction.** The origin is a direct competitor.
> The site is served from GitHub Pages, so a complaint reaches a host that can take the whole
> site down rather than one image, and the images are traceable to their source by anyone who
> looks. The owner has read this and decided.

## The override is coded against twelve slot ids, never against the host

W25-R14 lifted a ban because the client buys from that supplier. **Nothing of the sort is
true here**, so this is not an approved origin and is not written like one. The licence
string is `owner_override_imperlux`, distinct from `direct_supplier`, so a reader of the
ledger never has to guess which permission a row is standing on.

`fetch-packshot.js`, `check-asset-provenance.js` and gate 19 each hold the override to the
twelve ids. **A thirteenth id is refused with the flag set.** That is the only executable
form of "nothing else from imperlux.md, ever", and it was watched fire at W25-17.

## The eight model cards, and the one thing the source does not vary

Imperlux publishes **four louvre profiles in three RAL colours**, `il12`, `il30`, `il40` and
`il100`, each at 1296x1600. It publishes **no image per material**: `Metal Plus` and
`Metal PlusDV` differ by sheet gauge, 0,50mm against 0,55mm, and by warranty, and the source
shows the same three pictures for both. **A photograph cannot show 0,05mm.**

So the eight cards take **eight different files**, and each one is a colour that model is
actually sold in. The page states the rule itself: *"3 culori RAL pe Metal Plus, 2 pe Metal
PlusDV"*, and RAL 9005 is counted half as often as 7016 and 8019 in its own markup, which is
what says 9005 is the Metal Plus colour.

| Slot | Model | File taken |
|---|---|---|
| `GARD-01` | IL12 Metal Plus | `il12/9005.webp` |
| `GARD-02` | IL12 Metal PlusDV | `il12/7016.webp` |
| `GARD-03` | IL30 Metal Plus | `il30/9005.webp` |
| `GARD-04` | IL30 Metal PlusDV | `il30/7016.webp` |
| `GARD-05` | IL100 Metal Plus | `il100/9005.webp` |
| `GARD-06` | IL100 Metal PlusDV | `il100/7016.webp` |
| `GARD-07` | IL40 Metal Plus | `il40/9005.webp` |
| `GARD-08` | IL40 Metal PlusDV | `il40/7016.webp` |

**No reuse was needed and none was used.** All eight sha256 differ, all eight source URLs
differ. W25-R17 exists for W25-20 and is not drawn on here.

## The four hub tiles, and the three whose subject does not exist on the source

The tiles were specified for a photo session that has not happened. **One of the four is
exactly what was asked for**; the other three are not, because `imperlux.md` publishes no
picture of a person measuring a fence, no picture of three profiles side by side, and no
picture of slats stacked in a warehouse.

| Slot | Asked for | What landed |
|---|---|---|
| `GARDB-01` | a finished fence seen along its line, portrait | exactly that, `ga-ansamblu-ialoveni` |
| `GARDB-02` | measuring on site, wide panorama | a fence line running the length of a street |
| `GARDB-03` | three louvre profiles side by side | one profile close up on a fitted fence |
| `GARDB-04` | slats stacked in a warehouse | a finished fence at a modern house |

**The `shows` line on those three is corrected to the picture, and each correction says so in
the row itself**, `AMENDED W25-18: ceruse ..., pe care sursa nu le publica.` The alternative
was to leave three lines describing photographs that are not there, which is the shape of
defect this repo has been bitten by before: prose that no longer describes the thing.

**`GARDB-03` was taken twice.** The first file, `card-garduri.webp`, is the source's own
fences card and is visually the same studio render as the model cards, so the hub tile would
have looked like a ninth model card. It was replaced by a daylight photograph of a fitted
fence, which is a different picture in the way that matters. Gate 19 would not have caught
it: it reads file paths and source URLs, and those differed.

## RC-pics-real is no longer expected for fences

Its `README.txt` now says **nothing is waiting**, names the eight that were, and keeps the
better outcome in view: a real photograph from the owner's own project set would replace an
override file, and nothing is blocked on it. `docs/OWNER-INTAKE-W25.md` is generated and now
prints list (a) as empty.

**The two generators were amended, not gutted.** `gen-owner-intake-w25.js` asserted
`fence.length !== 8` and `hub.length !== 8`; a hard 8 would have turned the owner's own
decision into a red gate. A filled slot now drops off the list instead of failing it, and
what is still asserted is that the walk saw both hub families and that both lists are not
empty at once.

**GARDB leaves the prompt pack by being filled, not by deletion.** `PRIORITY_ALL` still names
all eight hub tiles and the ledger decides which are still asked for, so **a slot that is
still empty and falls out of the pack is still a failure**. Deleting the four from the
constant would have deleted the assertion with them. The pack is 19 entries and the batch is
`ACOP-01` to `ACOP-04`.

## Gates

**24 of 24 gate commands exit 0**, from `node scripts/run-gates.js --keep-going`. Gate 19
reads `ledger slots filled: 271 of 333`, gate 24 reads `271 installed, 51 empty`, gate 25
reads `0 fence cards, 4 hub tiles, file matches the data`.

**No height moved.** A filled slot takes the placeholder's own box from the same
`--ph-ratio`, so the twelve pictures change no layout and no budget. Gate 20 measured both
pages and passed.

## Recorded for ratification

1. **Eight different files for eight cards**, one per profile and colour, because the source
   publishes no image per material and a photograph cannot show 0,05mm of sheet.
2. **Three `shows` lines corrected to the picture**, each saying what it used to ask for and
   that the source does not publish it.
3. **A slot leaves a list or a batch by being filled, never by being deleted from a
   constant**, so the assertion that guards it survives.
