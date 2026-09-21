# W25-03b · Packshot rerun under the 500px floor, and a correction to W25-03

| | |
|---|---|
| Dispatched | Wave 25, 2026-09-21 |
| Rulings in force | R-W as amended by W25-R1 to W25-R4 and W25-R2, R-AB, section 12.0 |
| Depends on | #92, merged as `4d665c9` |
| Opens | Q-W25-06 (my W25-03 count was wrong), Q-W25-07 (the floor unlocks nothing) |
| Result | **0 slots filled.** 28.87GB reclaimed, six gates taught to clean up, the floor implemented and negative-tested. |

## The precondition

`#92` merged as `4d665c9`, deploy succeeded, edge polled until it served that sha,
`node scripts/verify-live.js` **exit 0, PASS, 0 unverified, 0 failed, 51 of 51**.

## 1 · Housekeeping, done first because it freed the machine

**727 directories, 28.87GB, removed. Nothing else touched.**

Every candidate was checked before anything was deleted: under `$TMPDIR`, a plain
directory and not a symlink, owned by this user, and its name matching the `mkdtemp`
pattern this repo's own scripts create. **Zero foreign directories matched** and none was
open by a running process. `rc-packshot-stage`, the staging area, was kept on purpose.

| Prefix | Dirs | Created by |
|---|---|---|
| `rp-verify-` | 125 | `verify-live.js` |
| `rc-header-fit-` | 96 | gate 11 |
| `rc-heading-fit-` | 80 | gate 14 |
| `rc-lh-` | 73 | gate 5 |
| `rc-nav-contrast-` | 38 | gate 18 |
| `rc-layout-geometry-` | 19 | gate 20 |
| others | 296 | scratch scripts from this work |

**The leak, named.** Every browser gate created a Chrome profile directory and **none of
them removed it**. The worst offender was the failure path: `fail()` calls
`process.exit`, so the `stop()` that kills Chrome never ran either, which is also where
the 27 orphaned Chrome processes came from.

**The fix** is a `process.on('exit')` handler in all six, which fires on a normal return
and on `process.exit` alike, killing Chrome first because a live Chrome writes the
directory back.

**Proved rather than assumed**: baseline 1 directory (the staging area), then a passing
`check-header-fit`, a passing `check-nav-contrast`, a passing `check-layout-geometry` and
a **deliberately failing** `check-heading-fit`. Still 1 directory. Nothing accumulates.

## 2 · The floor, implemented exactly as ruled

`SOURCE_FLOOR` 500, `OUTPUT` 600, and **nothing is ever upscaled**.

| Source | Result |
|---|---|
| 499px | **refused** (the negative test W25-R2 asks for) |
| 500px | accepted, written at **500** |
| 520px | accepted, written at **520** |
| 900px | accepted, written at **600** |

## 3 · The rerun filled nothing, and there are two separate reasons

### I got W25-03's central finding wrong

W25-03 told the owner that **70 of 88 plates are not Phomi products**, and W25-R2 ruled on
that number. **It is 37.** I matched against Phomi's category listing pages, which show
product families and not the colour variants inside them. Harvested from the product pages
themselves, Phomi publishes **129 variant names**, and 51 of our 88 match exactly.

`Kamu Red` is a Phomi colour called `Kamu Red`. So are `Tunguska Yellow`, `Castol Grey`,
`Veil White`, `Dandy Grey`, `Ash Grey`, `Stellar Red`. Those are the names I said did not
exist.

**No `brand_hidden` flag was applied to anything**, because the ruling was made on a wrong
count and the corrected count may still move: I walked 22 of Phomi's product pages and it
has brick, weaving and leather ranges I have not. **Q-W25-06.**

### And the corrected 51 still cannot be filled

| Phomi image | Size | Verdict |
|---|---|---|
| Family images, 18 plates | 459 x 398 | under the 500 floor by 41px |
| Colour variants, 33 plates | 650 x 450 | clears the floor, **but each carries its English name burned into the picture** |

The variant swatches print `Kamu Red`, `Tunguska Yellow` and so on across the bottom left.
The card already prints the name underneath in Romanian. **The guard passed those files;
looking at them is what caught it**, which is exactly the step R-W says no gate can do.

### The floor unlocks nothing else either

Re-measured directly rather than taken from the earlier research:

| Manufacturer | Longest side | Short of 500 by |
|---|---|---|
| DURAZIV, 2 products | 343 | 157px |
| Phomi families, 18 | 459 | 41px |
| ROKO AquaMix, 2 | 492 | **8px** |

**The floor moved from 800 to 500 and the measured population is 343 to 492.** It passed
over the entire group. **Q-W25-07** recommends 450, which would clear 20 products instead
of none.

## 4 · Method

Direct, as W25-R2 requires. No agents. The 18 Phomi family images were fetched through
`scripts/fetch-packshot.js` like everything else, measured, looked at, and none installed.

## Gates

19 of 19 exit 0, each its own process with its exit code read (R-AB).
