# W26-01 · The owner's own roof photographs, and the marker that failed the merge

Card W26-01. Branch `w26/w26-01-roof-section`, on `main` at `a8d819e` after #114 to #120
merged. PR only, stops for the owner.

## Section 12.0 on `a8d819e` FAILED, and the cause was mine

`EXPECT_SHA=a8d819ea91f30003ae4dedb56f72324ca308c1a8 node scripts/verify-live.js https://rapidconstruct.md`
returned **exit 1: 4 unverified, 0 failed, 51 of 51 pages, 4 rows retried, 1 page that never
became ready.**

**Nothing was wrong with the site.** All four rows failed on one marker:

    UNVERIFIED svc RO acoper  16470px / 16530  inside
                 marker mismatch: bentoLinks expected 3, got 4

**W25-24 gave every hub tile a destination under W25-R24 and left `bentoLinks: 3` behind.**
Every height was inside budget; the four unverified rows are the two acoperisuri pages and the
two garduri pages, which are the four pages that carry a bento hub.

**This is the defect `docs/CLAUDE.md` section 12 already records, in the same component.**
W24-07a renamed the hub's classes and left `verify-live.js` probing the old ones, and the rule
written from it is *a marker that is not renamed with the thing it names is not a marker*.
W25-24 changed what the thing **is** and did not come here. Twice.

**One page never became ready**, `svc RO acoper` read 1: 900px with `promoBar 0` and every
count 0, then 16,470px clean on reads 2 and 3, agreeing to the pixel. That is the
stylesheet-not-yet-applied flake W25-R11 exists for, and the re-read did its job; it is not a
second defect.

### The marker is corrected, and coupled so it cannot go stale again

`bentoLinks` is 4 in both hub marker sets. **And gate 26 now reads those values out of
`verify-live.js` and compares them with what it counts on the built pages**, so a marker left
behind fails in `quality`, before a merge, instead of in section 12.0 after it.

It is watched on the real file: the stale `3` was planted back, the gate reported

    scripts/verify-live.js expects bentoLinks: 3 and the built hub pages carry 4.

and the control was clean before and after. **Four marker arms, one of them green**, and the
green one is the shipping shape including the two deliberate `bentoTiles: 0` on the pages that
are bento destinations rather than hubs.

## The eight rulings

`docs/rulings/W26-R.md` is new and holds **W26-R1 to W26-R8**, quoted exactly. It says in its
own header why it is a new register rather than `W25-R25`, and that the ids map one for one if
the owner meant the other.

**It also records what this dispatch overturned, and that the method was the error.** W25-24
reported both imperlux 4-tile sections gone on two pieces of evidence that were the same
mistake twice: it grepped the **HTML response** for labels that render client-side, and it
screenshotted **the first 4,000px** of a page several times that long. Neither could have found
a section that renders in JS below the fold. W26-R2 is the standing rule that comes out of it.

**Q-W25-19 is answered: leave the warranty off.** The fence cards ship with no warranty line,
which is what W25-25 already shipped, and the question is closed at option (a).

## The four photographs

**The folder was found with the space in its name and nothing was guessed**:
`/Users/ivan/fatade3d_04roof pics/`, four files, each **900x675**, all clearing the floor.

**They map to the four cards by name, and that is asserted rather than assumed**: each filename
is its card's title, and the install refuses to run if any of the four titles has changed.

| Card | Title | File |
|---|---|---|
| 01 | Înlocuire ardezie cu țiglă metalică | `schimbare-ardezie-tigla-metalica` |
| 02 | Înlocuire ardezie cu șindrilă bituminoasă | `schimbare-ardezie-sindrila-bituminoasa` |
| 03 | Acoperiș la cheie cu țiglă metalică | `acoperis-la-cheie-tigla-metalica` |
| 04 | Acoperiș la cheie cu șindrilă bituminoasă | `acoperis-la-cheie-sindrila-bituminoasa` |

### "No edits" decided how they are installed

`.offer__media` is `aspect-ratio: 81 / 100`, portrait. These photographs are **4:3 landscape**.
The four they replace were Unsplash pictures **centre-cropped to 0.81:1 by
`scripts/process-photos.js`**, which their own provenance rows record.

Cropping these would have been an edit, so **they are installed uncropped**: the `@2x` is the
file at its native 900x675, the `1x` is the same picture scaled to 600x450, and the box crops
it with the `object-fit: cover` it has always had. **Nothing is upscaled and nothing is cut.**

The result was looked at rather than assumed: the roof and the roofers sit in the middle of all
four frames and survive the portrait crop intact.

### Metadata, and the assertion that caught a real leak

The strip is asserted on the written bytes, and **it fired on the first attempt**: `sips -Z`
writes a fresh Exif block, so the original order, strip then resize, left metadata in the 1x
files. Resize first, strip after, assert last. All eight files: **metadata none**.

### The origin

**"owner_supplied" is R-W's client-supplied origin under another name**, and it is recorded in
R-W's own words rather than as a ninth origin string: source
`client direct transfer, Mihai, 22.09.2026`, licence
`owned by Rapid Construct, supplied for site use`. That is the stricter reading on purpose:
**gate 17 requires an image on that origin to carry no metadata at all**, which a new string
would not have inherited. Eight provenance rows rewritten, the Unsplash rows replaced.

### The caption check is an assertion

No `title` and no `desc` on the four cards may claim the work is ours, in either locale, and
the check runs over all eight strings against a pattern of "realizate de noi" and its Russian
equivalents. **Zero ownership claims**, before and after. The four `alt` strings are rewritten
in both locales to describe the new photographs, which the old ones no longer did.

## Budgets

`/servicii/acoperisuri/` **16,470** against 16,530 and RU **16,608** against 16,668, both
unchanged. The box ratio did not move, so the page did not.

## Gates

**25 of 25 gate commands exit 0.**

## Recorded for ratification

1. **The 12.0 failure was a stale marker, not the site**, and gate 26 now holds the two files
   to each other so it cannot recur a third time.
2. **The photographs are installed uncropped** because "no edits" and a portrait box cannot
   both be satisfied by cutting the file.
3. **`owner_supplied` is recorded as R-W's client-supplied origin**, which is stricter than a
   new origin string would have been.
