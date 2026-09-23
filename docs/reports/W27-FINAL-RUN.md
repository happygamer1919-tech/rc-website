SELF-MERGE

# W27-FINAL-RUN · the final run before the client review, 2026-09-22 to 2026-09-23

**Mode: SELF-MERGE.** The harness accepted every `gh pr merge`; no fallback branch was needed. Every card
below merged with a merge commit after its `quality` check passed and was verified live on its merge
sha with `EXPECT_SHA=<sha> node scripts/verify-live.js https://rapidconstruct.md` (exit code recorded).
Run started 2026-09-23 01:35 UTC (21:35 owner time), report written 04:09 UTC.

## Read this first: what to look at in a browser before 08:00

1. **The roofing page, both locales**: `https://rapidconstruct.md/servicii/acoperisuri/` and `/ru/servicii/acoperisuri/`.
   Nine tiles, seven filter chips, 105 products: the seven Imperlux metal tiles first with their preview
   pictures (Imperlux's orange mark is in them: Q-W27-02), prices "De la N lei/buc", chips and facts;
   Tablă cutată as its own section; the 20 Imperlux accessories at the top of Accesorii; **the eleven
   gutter parts that now say "Preț la cerere" instead of a Dasterum price (Q-W27-03)**; the Tablă cutată
   strip tile made from a small watermarked packshot (Q-W27-01).
2. **The Novatik page**: `/servicii/roca-vulcanica/`, four priced cards, 60-year line, chips.
3. **The design**: cream ground, floating header, sentence-case headings at 64/48, dark labels on the
   orange buttons, the cream form with a full-width send button, the four dark stat cards, the quiet
   footer, the zebra tables, orange prices on product cards. Compare `docs/design/W27/w28-08-*.jpg`
   (final) against `docs/design/W26/` (before). W28-02 and W28-04 were approved under your delegation
   (W27-R-07) and are one card each to revert.
4. **One test lead per language** after the form change (your W21 standing rule): the form's wiring is
   gate-checked (64 forms), delivery is not.
5. **Not done**: W28-T two-tone headings (needs a generator change, the card allowed CSS and locale
   strings only; optional under W27-R-08). Folie anticondens not added (no picture at the floor).

## Cards

| Card | PR | Merge sha | Live verify | Notes |
|---|---|---|---|---|
| W27-R-00 | #136 | `df3ef5e` | PASS: 0 unverified, 0 failed |  |
| W27-C-01 | #137 | `5dea666` | PASS: 0 unverified, 0 failed |  |
| W27-C-02 | #138 | `77aae07` | PASS: 0 unverified, 0 failed |  |
| W27-C-03 | #139 | `0d9461b` | PASS: 0 unverified, 0 failed |  |
| W27-C-04 | #140 | `f5a7032` | PASS: 0 unverified, 0 failed |  |
| W27-C-05 | #141 | `a0d77fb` | PASS: 0 unverified, 0 failed |  |
| W27-C-06 | #142 | `08c08ff` | PASS: 0 unverified, 0 failed |  |
| W28-01 | #143 | `ff8a922` | FAIL: 0 unverified, 2 failed | live check FAILED on two budgets, corrected by #147 |
| W28-02 | #144 | `645f53b` | PASS: 0 unverified, 0 failed |  |
| W28-03 | #145 | `4ae1cc1` | PASS: 0 unverified, 0 failed |  |
| W28-04 | #146 | `e763cba` | PASS: 0 unverified, 0 failed |  |
| W27-FIX-01 | #147 | `1a39e04` | PASS: 0 unverified, 0 failed | budget correction after #143 |
| W28-05 | #148 | `ccd47a9` | PASS: 0 unverified, 0 failed |  |
| W28-06 | #149 | `a4e1cec` | PASS: 0 unverified, 0 failed |  |
| W28-07 | #150 | `15656ed` | PASS: 0 unverified, 0 failed | CI caught a 14px sideways scroll at 769 (gate 11), fixed on the branch before merge |
| W28-08 | #151 | `232b97f` | PASS: 0 unverified, 0 failed |  |
| W27-FIX-02 | #152 | `a944714` | PASS: 0 unverified, 0 failed | review fix, LCP priority hint |
| W27-REV-01 | (this PR) | | | the review, `docs/reports/W27-REVIEW.md`; no fix cards beyond FIX-01 and FIX-02 |

**Deviations from the dispatch, each recorded in DECISIONS.md at the card:**

- `docs/RC-PROJECT-RULES.md` does not exist; the run followed `docs/CLAUDE.md` (W27-R-00).
- `main` had no branch protection and no rulesets: nothing was deleted; auto-merge was enabled but has
  nothing to wait on, so each merge waited on `gh pr checks` instead (W27-R-00).
- Merges are **merge commits, not squashes** (section 10 of the rules; every merge on the repo is one).
- **PRs were opened stacked, ahead of the previous merge**, so CI queued in parallel; merges stayed
  strictly serial and each was verified live before the next merge. After every merge to `main` the
  stacked PRs conflicted on the append-only records (DECISIONS, BACKLOG, R-Y); each was brought up to
  date by merging `main` forward locally with a union of both sides (R-Z: never the web editor).
- The design proposals were **PDF "why" pages under `design/`**, not the `.md` files under `docs/design/`
  the dispatch names; both were rasterised and transcribed; the dispatch's numbers were the spec.
- Prices print as **"De la N lei/buc"** (capital D), the site's existing form, not "de la".
- The Compară tables carry **no warranty row** (W26-R6's hold stands); the warranty figure is on the
  card's facts line under W27-R-04.
- **RU colour chips keep Maro, Negru, Ciocolată in Romanian**, the dispatch's "missing entries keep RO"
  applied literally; the dictionary carries only Antracit (Q-W27-02).
- **Eleven rainwater prices became "Preț la cerere"** under "same numbers" (Imperlux publishes none);
  the Dasterum figures are kept in the data (Q-W27-03).
- Per design card, screenshots cover the **four main pages** (home, catalogue, roofing, fences) at 390
  and 1440 in both locales; there is no contact page, the contact block is the homepage's form section.
- Per design card, Lighthouse was left to CI's own gate (three-run median, floor 95); the four-page
  reading was taken on the final design state and in the review (below).
- **Every design card that moved text re-measured all 53 budgets** (generated tables in R-Y), after the
  live check on W28-01 caught the metal tile page 64 and 86px over budget (W27-FIX-01).

## Gates

On `main` at `a944714`: **29 of 29 gate commands exit 0** locally (`node scripts/run-gates.js`, every command `quality` runs, same Chrome), and `quality` was green on every one of the 17 pull requests before its merge. The five gates no script runs: gate 4 (heights, re-measured on every card that moved text, budgets in R-Y), gate 6 (one new colour value, `#232323`, recorded in section 3, and the retired neutrals added to the staleness gate), gate 7 (every new effect is inside the reduced-motion block, checked by reading it), gate 8 (the three documents appended on every card), gate 9 (section 12.0 run on every merge sha, exit codes in the table above; one failure, W28-01, corrected by W27-FIX-01).

## Lighthouse, desktop, median of three, final state (local server)

- / perf 99 [99 99 99] a11y 100 bp 100 seo 100
- /ru/ perf 99 [99 99 99] a11y 100 bp 100 seo 100
- /servicii/acoperisuri/ perf 92 [98 92 91] a11y 100 bp 100 seo 100
- /ru/servicii/acoperisuri/ perf 98 [92 98 98] a11y 100 bp 100 seo 100
- /servicii/case-la-cheie/ perf 100 [100 100 100] a11y 100 bp 100 seo 100
- /ru/servicii/case-la-cheie/ perf 100 [100 100 100] a11y 100 bp 100 seo 100
- /catalog/ perf 99 [99 99 100] a11y 100 bp 100 seo 100
- /ru/catalog/ perf 99 [99 99 100] a11y 100 bp 100 seo 100

The roofing page is bimodal (W26-14 recorded the same): the first hub tile's picture is the largest
paint and lands at 1.15s (98) or 1.9s (92). W27-FIX-02 gives it `fetchpriority=high`; five runs after
read 98, 98, 98, 98 and one cold 92.

## The review (W27-REV-01)

`docs/reports/W27-REVIEW.md`: 83 pages read at 1440, 768 and 390 in both locales; 0 dead links, 0 missing image files, 0 console errors or exceptions, 0 pages scrolling sideways, 0 hub tiles pointing at a same-page anchor, 16 of 16 redirect pages carrying their meta refresh, the quote form with its subject on every service page; 36 text nodes under 14px, all of them the metal tile profile diagrams' SVG labels, which paint at about 15.75px; 59 empty `alt` attributes, all in three known groups (gallery pictures under the no-captions ruling, the marquee's aria-hidden duplicate track, the unlisted review page). No defect that needed a fix card beyond W27-FIX-01 (budgets) and W27-FIX-02 (the LCP hint).

## Screenshots

`docs/design/W27/w28-0N-<page>-<ro|ru>-<1440|390>.jpg`, 16 per design card, N = 01 to 08; `w28-08-*` is
the final state. Before: `docs/design/W26/`.

## Open questions for the morning

- **Q-W27-01** the Tablă cutată tile: a real photograph, or a squarer tile.
- **Q-W27-02** Imperlux's orange mark in the metal tile and shingle previews (keep or crop), the unnamed
  fourth colour on five models, and the Romanian chip names on the Russian page (three words fix it).
- **Q-W27-03** the eleven gutter prices (put back or not), seven Imperlux accessories that look like
  Dasterum near-twins (fold or keep), Folie anticondens (no picture at the floor), the Novatik and
  Creaton accessory grids (not products).
- W28-02 floating header and W28-04 sentence-case headings: approved under delegation, one card each
  to revert.

## Strategy risk note, carried as W27-R-04 asked

The site now states a competitor's published prices and shows a competitor's product photography for
the roofing and fence sections under Rapid Construct's name, and a change on imperlux.md is a change
this site does not see until the next crawl. Recorded at W25 and W26, unchanged.
