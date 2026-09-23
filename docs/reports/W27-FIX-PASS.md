SELF-MERGE

# W27-FIX-PASS · the wave 27 fix pass, 2026-09-23

**Mode: SELF-MERGE**, the final run's protocol under W27-R-01 as the fix-pass dispatch extends it: each card
a pull request, merged with a merge commit only after its `quality` check passed, then section 12.0 on the
merge sha (`EXPECT_SHA=<sha> node scripts/verify-live.js https://rapidconstruct.md`, the deploy run and the edge
waited for first), then the next card. The five rulings were recorded first (W27-FIX-00). Run started
06:41 UTC (02:41 owner time); the serial merge chain ran unattended from 07:09 UTC.

## Read this first

1. **The roofing page, both locales**: `https://rapidconstruct.md/servicii/acoperisuri/` and `/ru/servicii/acoperisuri/`.
   99 cards in one grid; the eleven gutter parts price again ("De la 172 lei" on Jgheab); the metal tile,
   shingle and Creaton cards show the product alone, no orange mark; five tiles print a "+1" chip; the Russian
   page prints Russian colour names; the accessories section is 60 cards, five near-twins folded.
2. **The Novatik page**: "+2" on Roman, "+1" on Wood.
3. **Q-W27-04** (three held folds) and the five-line list at the foot are what need you.

## Cards

| Card | PR | Merge sha | Live verify (section 12.0) | What |
|---|---|---|---|---|
| W27-FIX-00 | #154 | `406b13e` | PASS: 0 unverified, 0 failed, exit 0 | the fix-pass rulings W27-R-09 to W27-R-13, recorded first |
| W27-FIX-03 | #155 | `77581d1` | PASS: 0 unverified, 0 failed, exit 0 | the eleven rainwater prices back (W27-R-10) |
| W27-FIX-04 | #156 | `c134884` | PASS: 0 unverified, 0 failed, exit 0 | Russian chip names and the "+N" chip (W27-R-11) |
| W27-FIX-05 | #157 | `1d5c833` | PASS: 0 unverified, 0 failed, exit 0 | five near-twin pairs folded, three held (W27-R-12) |
| W27-FIX-06 | #158 | `f8bb13f` | PASS: 0 unverified, 0 failed, exit 0 | ten marked previews replaced by the makers' packshots (W27-R-13) |

**No card was SKIPPED.** One card is partial by the ruling's own test: W27-FIX-05 folded five of the seven
near-twin rows and held two (the membranes, the ridge band) and Folie anticondens in Q-W27-04, because
"same physical item" does not hold across brands and a fold there would print one maker's picture over
another maker's price. **Q-W27-01** (the Tablă cutată strip tile) was not a card: the dispatch's default is
the T-12 product image cropped to the tile ratio, which is what already ships; the question asks for a
photograph or a squarer tile, so it stays open for the morning.

## Kept-imperlux list (W27-FIX-06)

Ten marked previews were named or covered by W27-R-13. **Three took a third party's packshot**: IKO
Cambridge and IKO Superglass Hex (IKO's own colour swatches, iko.eu), Creaton Rapido (the maker's own render,
swissporton.ro, the former CREATON south-east Europe works). **Seven are kept-imperlux, because Imperlux is
their maker** (brand Imperlux, ArcelorMittal steel on every page) and no other manufacturer's packshot
exists: Barcelona, Madrid, Bavaria, Heta, Zet, Finn, Izi. Each now shows Imperlux's own 1080x1080 gallery
render of the bare sheet, which carries neither the orange mark nor the burned-in name, under a fifth
override sentence naming W27-R-13. A 76-picture sweep of every product-card picture on the roofing, Novatik
and fence pages, two independent viewers each with a tie-break, found no other overlaid third-party mark.
Marks that are part of the product and were left: the BILKA stamp embossed on four rainwater parts
(ACIM-22, 25, 26, 31), the "mdm VAXO" print on the five membranes, the burned-in caption on the four Novatik
previews (no orange mark; W25-R5's label case), Dasterum's watermark on its own five tile pictures (W25-R7).

## Gates

**29 of 29 gate commands exit 0** (`node scripts/run-gates.js --keep-going`, exit 0) on the tree of `w27/w27-fix-06-packshots` at `883c166`, which is
byte-identical to `main` after #158 (a stacked branch merges with no other change; `git diff` between the
two is empty). `quality` was green on every one of the pull requests before its merge, and section 12.0 ran
on every merge sha with the exit codes in the table above. The five gates no script runs: gate 4 (every card
that moved text re-measured all 53 budgets, generated into R-Y: FIX-03 two move, FIX-04 two, FIX-05 two,
FIX-06 none), gate 6 (no new colour value), gate 7 (no new effect), gate 8 (the three records on every card),
gate 9 (section 12.0, above).

## Lighthouse, desktop preset, local server on the final tree

The roofing page, five runs each (the page W26-14 recorded as bimodal):

- `/servicii/acoperisuri/` perf median **92** [98 92 92 92 98], LCP 1128ms / 1866ms / 1864ms / 1864ms / 1069ms
- `/ru/servicii/acoperisuri/` perf median **97** [92 97 97 97 98], LCP 1865ms / 1168ms / 1168ms / 1169ms / 1170ms

The eight main pages, median of three:

- `catalog` perf 99 [99 99 99] a11y 100 bp 100 seo 100
- `home` perf 99 [99 99 99] a11y 100 bp 100 seo 100
- `ru` perf 99 [99 99 99] a11y 100 bp 100 seo 100
- `ru-catalog` perf 99 [99 99 99] a11y 100 bp 100 seo 100
- `ru-servicii-acoperisuri` perf 97 [92 97 97] a11y 100 bp 100 seo 100
- `ru-servicii-case-la-cheie` perf 100 [100 100 100] a11y 100 bp 100 seo 100
- `servicii-acoperisuri` perf 92 [92 98 92] a11y 100 bp 100 seo 100
- `servicii-case-la-cheie` perf 100 [100 100 100] a11y 100 bp 100 seo 100

## Deviations recorded this pass

- **W27-FIX-05 folded five of the eight named folds** and held three in Q-W27-04 (above).
- **W27-FIX-06 treated a tenth preview** (Creaton Rapido) with the nine, under the ruling's last sentence.
- **W27-R-11 was applied as ruled ("+N") although imperlux names the colour** (RAL 9005 Negru on the five tiles,
  Cod 51 on IKO Cambridge, in each page's colour picker); recorded, one word per model to switch.
- **Creaton Rapido's packshot is from swissporton.ro**, the maker under its new brand, not a creaton.* domain.
- **Not ratified by W27-R-09 and still standing from the final run**: prices print "De la" with a capital D;
  the warranty ROW stays out of the Compară tables (W26-R6); the seventeen rainwater parts print Romanian
  names on the Russian page; W28-02 and W28-04 remain under delegation.
- **The board is the repo's**: `docs/board/W27-FIX-0N-*.md` per card and the statuses in `docs/BACKLOG.md`,
  moved to MERGED with the section 12.0 result by this report's card; no artifact board exists for this repo.

## For the morning, five lines

1. **Q-W27-04**: fold the membranes (say which Dasterum grammage each VAXO size is), the Blachvent/ROLL ECCO
   band, and Folie anticondens (name its twin or send a picture), or leave all three as they are.
2. **"+1" or the name**: imperlux names the fourth colour (Negru, RAL 9005) on Bavaria, Heta, Zet, Finn, Izi and
   Cod 51 on IKO Cambridge; the cards print "+1" as you ruled. One word per model to name it.
3. **Q-W27-01**: the Tablă cutată strip tile stays the T-12 packshot cropped to the strip; a photograph of a
   profiled-sheet roof from your folders, or a squarer tile, is one small card.
4. **Pictures**: the seven tiles are Imperlux-made, so their mark-free pictures are still Imperlux's; Creaton
   Rapido's comes from swissporTON (the former CREATON works). Say if either source is not what you meant.
5. **Still open from the final run**: the warranty row (W26-R6), the Russian names of the seventeen rainwater
   parts, "De la" capitalised, W28-02 and W28-04 under delegation, and one test lead per language after the
   form change.
