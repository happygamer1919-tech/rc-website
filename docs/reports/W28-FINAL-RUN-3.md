SELF-MERGE

# W28-FINAL-RUN-3 · wave 28, the fourth dispatch, 2026-09-24 (evening, UTC)

**Mode: SELF-MERGE under R-W28-01.** Every pull request below merged with a merge commit after its
`quality` run passed and was verified live on its merge sha with `EXPECT_SHA=<sha> node
scripts/verify-live.js https://rapidconstruct.md` (exit code recorded). Report written 2026-09-24
22:50 UTC.

## Read this first: what to look at in a browser

1. **Copertine**, `https://rapidconstruct.md/servicii/copertine/` and `/ru/...`: every model card ends
   in one "Solicită ofertă" / "Запросить предложение" button that scrolls to the contact form. No
   price and no "Preț la cerere" anywhere (R-W28-14).
2. **Turnkey houses**, `/servicii/case-la-cheie/`: open the gallery. There are 12 pictures, your two
   first, and every example shows masonry or brick. Picture 11, the mason, was the closest call on the
   face rule (only the back of his jaw shows).
3. **A 320px phone**, `/ru/`: scroll to "Недавние проекты". The long filter button takes two lines,
   and no page scrolls sideways.
4. **The board**: https://claude.ai/artifact/JrELJq3JM8Ub8pmLkdvatk, drawn from `main` after this
   pull request merges.

## Pull requests

| PR | What | Merge sha | quality | Live verify |
|---|---|---|---|---|
| #188 | W28-R5: R-W28-12 to R-W28-15, the three cards (documents only) | `cc1deff` | pass, 7m3s | PASS: EXIT=0, 22:15:43Z |
| #189 | W28-29: copertine, a button to the contact form, no price | `02ff0dd` | pass, 6m54s | PASS: EXIT=0, 22:22:43Z |
| #190 | W28-27: turnkey examples in masonry and brick | `191f999` | pass, 6m48s | PASS: EXIT=0, 22:32:10Z |
| #191 | W28-28: the 320 sweep, gate 35 | `3c2e11c` | pass, 7m17s | PASS: EXIT=0, 22:42:28Z |
| this | W28-R6: this report and the closing board sync (documents only) | after merge | | |

Four merged, four verified, zero failures.

## On the live site at `3c2e11c`

| Check | Result |
|---|---|
| Copertine buttons to `#oferta`, RO and RU | 12 and 12; `prod__ask` 0 and 0 |
| Turnkey pictures 08 to 12 served live against the repo | sha256 identical, all five |
| `node scripts/check-viewport-320.js` on a build of `main` at `3c2e11c` | 71 of 71 pages at 320 |

## W28-27: what was replaced, and from where

| Slot | Was (timber frame) | Now | Source | Licence |
|---|---|---|---|---|
| 08 | stucco tract house on a timber frame | concrete block house in scaffolding | Wikimedia Commons, Springfield Mews, Brighton | CC0 1.0 |
| 09 | two-storey OSB timber frame | brick terrace in scaffolding | Wikimedia Commons, Sandiacre | CC0 1.0 |
| 10 | timber frame with OSB walls | brick houses with roof trusses going up (cropped above a developer's hoarding) | Wikimedia Commons, Broadnook | CC0 1.0 |
| 11 | two timber-frame houses | a mason laying concrete blocks (cropped above a tool logo) | Wikimedia Commons, Namibia | CC0 1.0 |
| 12 | stud frame on a cleared plot | a finished brick house | Pexels 15303808 | Pexels License |

The CC0 licence was read from each file's own Commons page. Two viewers judged every candidate at full
size under your words, and both had to accept. Ten candidates were judged and five kept. The five refused
carried a brand on pallets and a site banner, a logo on a tape measure, a recognisable face, boxes with a
brand name on a building that is not a house, or a timber-frame membrane. One more refusal was a first
crop of the Namibia picture that sips had centred instead of anchoring at the top; both viewers caught
the tape measure still in frame, and the corrected crop is the one installed. Lighthouse on the page stayed at 100 in both locales, and
the gallery count stayed at 12.

## W28-28: the 320 list

| | Pages |
|---|---|
| html files in `dist/` | 85 |
| redirect pages, skipped and counted | 14 |
| measured at 320, both locales | 71 (36 RO, 35 RU) |
| wider than 320 before the fix | 1: `/ru/`, 337px |
| wider than 320 after the fix | 0 |

**The cause** was the portfolio filter chip "Проектирование и 3D-визуализация", set not to wrap:
305px of label in a 288px column. **This corrects W28-FIX-01 and Q-W28-04**, which named the header
pill. The pill only measured wide because the chip had already widened the layout. The fix lets a
chip wrap onto two lines below 360px only, so the 360 and desktop layouts are unchanged and no budget
moves. The check is now **gate 35**: every pull request measures every page at 320.

## Gates

| Tree | Result |
|---|---|
| #188 (`f5371f6`) | 33 of 33 exit 0 (the geometry gate first failed on a port held by an orphaned run of itself, and passed 72 of 72 once that process was stopped) |
| #189 (`95d243a`) | 33 of 33 exit 0 |
| #190 (`01693eb`) | 33 of 33 exit 0; Lighthouse on the turnkey page 100 and 100 |
| #191 (`e23863b`) | 34 of 34 exit 0, gate 35 included |
| this (the closing tree) | 34 of 34 exit 0 |
| CI `quality` on #188 to #191 | pass, pass, pass, pass |
| `verify-live.js` on the four merge shas | EXIT=0 on all four |

## Deviations, flagged

1. **Card ids renumbered.** The dispatch's W28-25 and W28-26 were taken, so they are W28-27 and W28-28,
   each quoting the dispatch.
2. **Your two chat answers acted on.** The dispatch said Q-W28-02 and Q-W28-03 stay open and not to touch
   copertine prices. Your later messages answered both, and your answers were applied: R-W28-14 with card
   W28-29 (still no price), and R-W28-15 (no change to the plates).
3. **Five turnkey pictures replaced, not four.** Four show a visible timber frame. The fifth (08) is a
   North American stucco tract house built the same way, so it was replaced too.
4. **Two pictures are crops.** CC0 permits a crop. They cut off a developer's branded hoarding and a tool
   with a maker's logo, and both manifest rows record the crop.
5. **Sourcing without a browser.** The browser route was ratified for W28-23 only. Candidates came from the
   W28-23 harvest and from Wikimedia Commons through its API and Openverse. Commons' file host refused the
   intake's generic user agent (HTTP 429), so the two originals were fetched with a contact user agent.
6. **A new gate.** R-W28-13's check is registered as gate 35 so the 320 floor cannot slip back. It sits in
   `docs/CLAUDE.md` section 11, where the count is now 35 gates and 34 `quality` commands.
7. **The W28-FIX-01 diagnosis was wrong.** The header pill was not the cause at 320; a filter chip was.

## Still open, waiting on you

- **Q-W28-01**: the Search Console tag's content value (W28-20).
- **The membrane photograph** at 225px: a larger copy, if you have one.
