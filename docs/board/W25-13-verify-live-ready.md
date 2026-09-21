# W25-13 · Gate 9 waits before it measures, and the obvious proof did not work

Card W25-13. Branch `w25/w25-13-verify-live-ready`. PR only, stops for the owner.

Built on `main` at `e702134490e9665f9ec8091c343114501f9b0dc8`, with #98 to #103 merged.
**Section 12.0 was run on that sha before any work**: `node scripts/verify-live.js` with the
full forty-character `EXPECT_SHA`, **exit 0, PASS, 0 unverified, 0 failed, 67 of 67 pages,
41 reachable URLs crawled**.

## The rulings, recorded before acting

`docs/rulings/W25-R.md` gains **W25-R11, W25-R12 and W25-R13**, verbatim. The next free ids
after R10.

## The root fix, which is not a sleep

A page is now measured only once **its stylesheet has applied and its promo bar is
present**. Both are real signals rather than durations:

- **The stylesheet.** The site's design tokens are custom properties declared on `:root` in
  `src/styles.css`. `--brand` resolving to a non-empty value **is** the stylesheet having
  applied, by definition. Nothing else in the document sets it.
- **The promo bar.** All ten marker sets in `MARKERS` expect `promoBar: 1`, so it is on
  every page this gate reads, and its absence is exactly what the false red reported.

The wait is **bounded**. A page that never becomes ready reports `NOT READY` with how long
it waited and which half is missing, and the marker assertion then does its job: a page that
genuinely has no promo bar still comes back UNVERIFIED rather than hanging.

## The fallback, bounded in three directions

At most **two** re-reads, only for a row that came back **UNVERIFIED**, and **never** for a
row that **FAILED**. A failure is a measurement about the site; an unverified row can be a
measurement about the instrument, and only the second kind may be read again. A row that is
over budget, or carries rating markup or a visible TODO, is never re-read: that would be
reading until it agrees.

Every re-read prints `RETRIED` with **all** the readings, and the summary counts them:

    rows retried: 0; pages that never became ready: 0

**R-AB holds.** The exit code is the result: a run whose retries all succeeded exits 0, a
run with a row still unverified after two re-reads exits 1.

## The proof, and the part of it that failed

`node scripts/verify-live.js <origin> --prove`. Eight assertions, two clean controls, R-AB:

| Arm | Result |
|---|---|
| control, tokens and promo present at once | ready **true**, waited 0ms |
| **arm 1**, neither token nor promo | ready **false**, waited 12,214ms, and came back |
| **arm 2**, both arrive after 1,200ms | ready **true**, waited **1,216ms**: it waited |
| **arm 3**, token present, promo absent | ready **false**: half ready is not ready |
| control again, after the arms | ready **true**, waited 1ms |
| **arm 4**, a page read with an impossible marker | exactly **3** reads, one plus two |
| arm 4, `RETRIED` printed with every reading | `read 1 UNVERIFIED 9135px, read 2 UNVERIFIED 9135px, read 3 UNVERIFIED 9135px` |
| arm 4, counted in the summary | `retried 1, saved 0` |

`PROOF PASSED: 0 arm(s) did not behave.`

### The obvious proof did not work, and that is a finding

The card asked for a forced slow-stylesheet run. **It was built, it ran, and it proved
nothing**, which is recorded rather than dropped.

`--slow <ms>` holds the top-level document and every stylesheet back through CDP's Fetch
domain. On a real run against the live site it held **94 responses by 4,000ms each**, with
the readiness wait disabled, and the row still read **3,464px, VERIFIED**.

**Two reasons, both measured.** A render-blocking `<link>` also delays the load event, so
`readyState` stays `loading` and the old poll waited anyway. And CDP's `Runtime.evaluate`
waits for the new execution context, so the probe could not run against the previous
document either.

**So the 900px row of 2026-09-21 is not reproducible by making the network slow**, and this
card does not claim to have reproduced it. The proof therefore tests **the probe** rather
than a guess at the cause: it watches the probe refuse an unready document, wait for a late
one, refuse a half-ready one, and come back rather than hang. The flag stays in the file,
with the finding written beside it, because a debug flag that was tried and did not
reproduce is worth more than one nobody wrote.

## Gates

**23 of 23 exit 0**, from `node scripts/run-gates.js`. Gate 21 now compiles **two** probe
strings, `PROBE` and the new `READY`, and reads 67 pages.

## Recorded for ratification

1. **Three debug flags are new and permanent**: `--only`, `--slow`, `--no-wait-ready`, plus
   `--prove`. Nothing in CI passes any of them.
2. **`--slow` did not reproduce the defect** and is kept anyway, with the finding beside it.
3. **A not-ready page costs up to 12 seconds** before it reports. It is bounded and no page
   on the live site is unready, so a clean run pays nothing.
