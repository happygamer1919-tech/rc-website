# W25-10 · Seventy-one Dasterum photographs, watermark and all

Card W25-10. Branch `w25/w25-10-dasterum-images`, stacked on `w25/w25-09-dasterum-data`.
PR only, stops for the owner.

## The headline

**Slots filled: 89 of 333 before, 160 of 333 after.** Every one of the 71 products W25-09
copied now has the supplier's own photograph.

| | Before | After |
|---|---|---|
| Ledger slots filled | 89 of 333 | **160 of 333** |
| Acoperișuri products pictured | 0 of 71 | **71 of 71** |

## Every condition of W25-R7, and where each one is held

W25-R7's conditions are part of the permission, not advice, so none of them is held in
prose:

| Condition | Measured or enforced |
|---|---|
| Only `dasterum.md` | `fetch-packshot.js` refuses the host unless the run passes `--dasterum`. Watched: without the flag it refuses and names the flag; with it, it fetches; **and `fatade3d.md` is still refused with the flag set** |
| Watermark exactly as published | no crop and no inpaint exists in this pipeline, and none was passed. The DASTERUM mark is in the top right of all 71, as published |
| No upscaling | all 71 sources are **488x488** and all 71 are written at **488** |
| Floor 450 | unchanged; 488 clears it by 38 |
| Source URL per file | in every provenance row, and **asserted from the other side**: a row carrying this licence and naming no `dasterum.md` URL is now a failure |

## The licence is fixed text that names its own host

    direct supplier, dasterum.md, owner buys directly and accepts use of their
    product data and images, watermark as published, owner accepted 2026-09-21

**The host is lifted by exception in three places, never removed from a ban list.**
`check-asset-provenance.js` keeps `dasterum.md` in `BANNED` and skips it only for this
licence. `check-photo-slots-w24.js` keeps it in `FORBIDDEN_HOSTS` and lifts it only for a
row naming `direct supplier, dasterum.md`. `fetch-packshot.js` needs the flag.

**So a row that drifts one word off the sentence stops being allowed**, without anyone
having to remember to put the host back. `fatade3d.md` and `imperlux.md` are untouched.

## Writing the self-test arm found a real defect

Gate 19 gains an arm that plants a Dasterum source under an ordinary licence and must fire.
**It did not fire**, and the reason was not the new code.

R-W's interpretation 3 says "Hostname matching includes subdomains" and names
`www.dasterum.md` by name. **Gate 19's pattern never matched a subdomain.** It required a
non-`[a-z0-9.-]` character before the host, and the character before `dasterum.md` in
`www.dasterum.md` is a dot, which that class excludes. Every subdomain of every forbidden
host had always slipped past that gate.

It was found only because the arm was written with the URL shape the real rows use. The
leading class is now `[^a-z0-9-]`. **Both of interpretation 3's own counter-examples still
hold**: `notdasterum.md` is not caught, because the character before is a letter, and
`dasterum.md.example.com` is not caught, because the trailing class still refuses a
following dot.

Gate 19 now runs **12 arms**.

## Looked at, all seventy-one

Product photographs on white: tiles, profiled sheet, membranes in rolls, gutters and
downpipes, ridge and valley pieces, screws and caps. **The DASTERUM watermark is in the top
right of every one and it stays there.** No face, no third-party branding, no retailer logo
beyond the supplier's own mark, which is the thing the ruling says to leave alone.

## Gates

**22 of 22 exit 0**, from `node scripts/run-gates.js`. Gate 19 reads `ledger slots filled:
160 of 333` and runs 12 self-test arms. The R-W gate reads 71 more rows and passes the
direct-supplier condition in both directions.

## Recorded for ratification

1. **The subdomain fix changes behaviour for `fatade3d.md` and `imperlux.md` too.** They
   were always meant to be caught with a subdomain and now are. Nothing in the repo relied
   on the gap.
2. **`--dasterum` is a new flag** on `fetch-packshot.js`, required rather than implied, so
   the permission cannot be used by accident.
