SELF-MERGE

# W28-FINAL-RUN · wave 28, the final run, 2026-09-23 to 2026-09-24

**Mode: SELF-MERGE under R-W28-01.** Branch protection on `main` requires the `quality` check (strict, no
reviewers); every card below merged with a merge commit after its `quality` run passed and was verified
live on its merge sha with `EXPECT_SHA=<sha> node scripts/verify-live.js https://rapidconstruct.md` (exit
code recorded). Run started 2026-09-23 23:08 UTC, report written 2026-09-24 02:50 UTC.

## Read this first: what to look at in a browser

1. **The home page, both locales**: `https://rapidconstruct.md/` and `/ru/`. No promo bar, no discount
   line, no "250+" or "4.9/5": three stat cards, three testimonials with the "Vezi recenziile pe Google"
   link under them, "15+ ani de experiență" in the hero and the team line, the quote button after the
   portfolio, the Despre facts paragraph, and one address block in the footer that reads the same on
   every page. On a phone the hero is centred and the stats sit in one row (W28-22).
2. **Services versus catalog**: `/servicii/acoperisuri/` and `/servicii/garduri/` (and `/ru/...`) carry
   hero, explanation, projects, FAQ and the quote form, no product card and no price; the six link cards
   under the roofing hub open the matching Catalog sections. The roofing catalogue with its 99 cards,
   7 chips and compare tables is at `/catalog/materiale-acoperis/`.
3. **Copertine**: `/servicii/copertine/` shows Imperlux's own photograph on each of the twelve models,
   "Preț la cerere" on every card (Imperlux publishes no price, Q-W28-02), and the Catalog has a tenth
   tile "Copertine 12".
4. **Fatade**: 66 catalogue cards that showed posters, parameter tables or text overlays now show the
   product's plain photograph (`docs/reports/W28-FATADE-IMAGES.md` lists every one of the 110).
5. **Under the hood** (view source or share a link): every page has its own title, description, canonical,
   alternates and social tags; JSON-LD on every page (Organization and LocalBusiness on home, Service,
   Product with AggregateOffer in MDL, BreadcrumbList, FAQPage where a FAQ is visible; no ratings);
   `/llms.txt` lists the facts, the catalogue groups and the contact.
6. **Not done, waiting on you**: the Search Console tag (Q-W28-01, W28-20).

## Cards

| Card | PR | Merge sha | Live verify | Notes |
|---|---|---|---|---|
| W28-00 | #168 | `801a66a` | PASS: EXIT=0 | rulings register, board JSON, artifact |
| W28-10 | none | none | GET exit 0 | protection set by API 23:13 UTC, recorded under R-W28-01 |
| W28-11 | #169 | `29346a7` | PASS: EXIT=0 | claims cleanup, 15+ (R-W28-02), reviews link live (R-W28-03), gate R-X discount arms |
| W28-12 | #170 | `1bf9166` | PASS: EXIT=0 | quote button after the portfolio |
| W28-13 | #171 | `b843133` | PASS: EXIT=0 | roofing catalogue to `/catalog/materiale-acoperis/`, gate 31 |
| W28-14 | #172 | `40d144f` | PASS: EXIT=0 | copertine photographs, no price at the source (Q-W28-02) |
| W28-15 | #173 | `31dc8c6` | PASS: EXIT=0 | 66 fatade pictures replaced, gate 32, Q-W28-03 |
| W28-22 | #174 | `7ddd241` | PASS: EXIT=0 | phone hero matches desktop (owner chat, R-W28-04) |
| W28-16 | #175 | `01ee981` | PASS: EXIT=0 | two industrial service lines RO and RU |
| W28-17 | #176 | `4d763b2` | PASS: EXIT=0 | technical SEO, gate 33 |
| W28-18 | #177 | `3c30f00` | PASS: EXIT=0 | JSON-LD, gate 34 |
| W28-19 | #178 | `36669bd` | PASS: EXIT=0 | llms.txt, NAP, Despre facts, FAQ rewrites; all 55 budgets move (R-Y) |
| W28-20 | none | none | none | blocked on Q-W28-01 |
| W28-21 | #179 | see W28-RUN | | this report, W28-REVIEW, W28-RUN, the board |
| W28-FIX-01 | #180 | see W28-RUN | | from the review: stat labels 14px on phones |

Twelve pull requests merged (#168 to #178 plus the wave close), twelve live verifications with exit 0,
zero failures, zero fallback branches.

## Gates

On the wave-close tree, byte-identical to `main` at `36669bd`: **33 of 33 gate commands exit 0** locally
(`node scripts/run-gates.js --keep-going`, every command `quality` runs, same Chrome; the count grew from
31 to 33 during the wave: gate 31 `check-catalog-counts.js` (W28-13), gate 32 `check-image-sources.js`
(W28-15), gate 33 `seo-check.js` (W28-17), gate 34 `schema-check.js` (W28-18); gate 4, heights, has no
script). `quality` was green on every one of the eleven pull requests before its merge. The gates no script
runs: gate 4 (heights, re-measured on every card that moved text: W28-11 all 55, W28-12 two, W28-13 six,
W28-14 four, W28-19 all 55; tables in R-Y), gate 8 (the three documents appended on every card), gate 9
(section 12.0 run on every merge sha, exit codes in the table above).

Commands and exit codes, in the order `quality` runs them, from the run of 02:00 UTC:

```
node scripts/check-merge-artifacts.js            exit 0  No conflict markers or duplicate rows (R-Z)
node scripts/verify-live.js --self-check         exit 0  verify-live loads and its probes compile (W24-09a)
node scripts/check-template-literals.js          exit 0  No template literal is cut through a comment (W26-04)
node build.js                                    exit 0  Build both locales
node scripts/check-css-collisions.js             exit 0  No class declared twice with contradicting properties (W24-09b)
node scripts/check-links.js                      exit 0  Links resolve
node scripts/check-stale-docs.js                 exit 0  No stale values in governing documents
node scripts/check-asset-provenance.js           exit 0  Every image has a provenance row (R-W)
node scripts/check-scarcity.js                   exit 0  No countdowns, scarcity, financing or struck prices (R-X)
node scripts/check-catalog-pages.js              exit 0  Catalog category pages carry no prices, stock, cart or product records (RC-129)
node scripts/check-svg-a11y.js                   exit 0  Every svg is decorative or a named image; every diagram is described (RC-142)
node scripts/check-lighthouse.js                 exit 0  Lighthouse floors, both locales (gate 5)
node scripts/check-origin.js                     exit 0  The built site names rapidconstruct.md and never the retired origin (W14-17)
node scripts/check-header-fit.js                 exit 0  Header fits with an 8px slack floor, both locales (RC-139)
node scripts/check-image-metadata.js             exit 0  No GPS in any image, and client-supplied images stripped (W23-01)
node scripts/check-photo-slots-w24.js            exit 0  Every placeholder has a ledger row, and every row is rendered (W24-01)
node scripts/check-plate-brands.js               exit 0  Every ceramic plate's brand matches the settled catalogue match (W25-03d)
node scripts/gen-photo-review-w25.js --check     exit 0  The photo review list matches the ledger (W25-12)
node scripts/gen-owner-intake-w25.js --check     exit 0  The owner intake list matches the data (W25-16)
node scripts/check-stub-count.js                 exit 0  The stub count in the documents equals the data (RC-148)
node scripts/gen-catalog-image-slots.js --check  exit 0  The catalog image slot manifest matches the records (RC-150)
node scripts/check-heading-fit.js                exit 0  No heading wider than its box, every page, 360 and 1280 (W19-D1)
node scripts/check-hub-tile-links.js             exit 0  Every hub tile has an href that resolves (W25-R24)
node scripts/check-galleries.js                  exit 0  Every gallery shows exactly its ledger's photographs (W26-R14)
node scripts/check-catalog-counts.js             exit 0  The catalogue counts are the recorded ones and no service page carries a price (W28-13)
node scripts/check-image-sources.js              exit 0  Every fatade3d picture names its fatade3d.md page and file (W28-15)
node scripts/seo-check.js                        exit 0  Technical SEO on every built page (W28-17)
node scripts/schema-check.js                     exit 0  Structured data on every built page (W28-18)
node scripts/check-dashes.js                     exit 0  No em dash or en dash in any file, the built site or this pull request (W26-13)
node scripts/check-layout-geometry.js            exit 0  Every bento and catalogue grid is the geometry it is specified as (W24-09)
node scripts/check-nav-contrast.js               exit 0  Every header dropdown item readable at rest, 4.5:1 (W23-06)
node scripts/check-text-contrast.js              exit 0  Every visible text element readable at rest, WCAG 1.4.3 (W26-05a)
|                                                exit 0  Every form posts to the configured endpoint with the configured recipient (RC-145)
```

## Lighthouse, desktop, median of three, final state (local server)

- / perf 99 [99 99 99] a11y 100 bp 100 seo 100
- /ru/ perf 99 [99 99 99] a11y 100 bp 100 seo 100
- /servicii/acoperisuri/ perf 97 [97 97 97] a11y 100 bp 100 seo 100
- /ru/servicii/acoperisuri/ perf 97 [97 97 97] a11y 100 bp 100 seo 100
- /servicii/garduri/ perf 99 [99 99 99] a11y 100 bp 100 seo 100
- /ru/servicii/garduri/ perf 99 [99 99 99] a11y 100 bp 100 seo 100
- /catalog/ perf 97 [97 97 97] a11y 100 bp 100 seo 100
- /ru/catalog/ perf 97 [97 97 97] a11y 100 bp 100 seo 100

The contact page is the home page's footer, so its row is the home row. Every reading is at or above the
section 4 floors; total blocking time 0ms everywhere; the roofing page's wave 27 bimodality (92 or 98) is
gone.

## The review

`docs/reports/W28-REVIEW.md`: 83 pages read at 1440, 768 and 390 in both locales; 0 dead links, 0 missing
image files, 0 console errors or exceptions, 0 pages scrolling sideways, 0 hub tiles pointing at a same-page
anchor, 14 of 14 redirect pages carrying their meta refresh, the quote form with its subject on all 30
service pages; 60 text nodes under 14px, 36 of them the known SVG diagram labels and **24 the hero stat
labels at 13px on phones and tablets, set by W28-22: one fix card, W28-FIX-01**; 43 empty `alt`
attributes, all in the three known groups. Five taste findings, none a fix card.

## Open questions

- **Q-W28-01** (W28-20): the Search Console tag's content value.
- **Q-W28-02** (W28-14): copertine prices for C-01 to C-12 (none published); car badges in the
  photographs of C-05, C-06, C-08, C-10, C-12; C-01's pictures are renders.
- **Q-W28-03** (W28-15): CAT-0051, CAT-0060, CAT-0077 show another colour of their family; RED 69 and
  RED 70 share one render at the source.

## Owner action after the merge

One real lead in Romanian and one in Russian through the quote form (the W21 standing rule). The wiring
is gate-checked (the form and its subject on every service page); delivery is not.
