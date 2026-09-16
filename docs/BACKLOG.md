# Backlog

Ticket status for the `rc-website` build. One card, one commit, one branch named
`<wave>/<ticket-id>-<short-slug>`.

Status values: `todo` · `in progress` · `blocked` · `shipped`.

Waves 1 to 5 predate this file; their tickets are reconstructed from the git
history and are all `shipped`. `RELEASE-NOTES.md` carries what each one changed.

## Wave 18

Dispatch of 2026-09-16. No ruling this wave. #39 (R-AB) and #43 (RC-134) were both
merged by the owner before this run and verified as ancestors of `origin/main`
before any card was worked: #39 as `1cb075c`, #43 as `41ec827`. The owner's
rulings on wave 17 are recorded in DECISIONS.md, W18 ratifications, and ride the
first wave 18 PR, as wave 17's rode R-AB.

| Ticket | Card | Mode | Branch | Status |
|---|---|---|---|---|
| RC-138 | W18-01 Tile profile diagrams, closes Q-W14-11b | SELF | `w18/rc-138-tile-profiles` | shipped: four original inline SVG profiles, four distinct by mapping and by geometry, widths drawn from the audit on three and none on the modular tile; zero image files; swatches byte-identical; 264 of 264 rendered assertions; 5 build arms, 2 harness arms, 2 marker arms; tile page RO 3,940 / RU 3,973, R-Y extended (LOCAL) |
| RC-139 | W18-02 Header slack floor, 8px | SELF | `w18/rc-139-header-slack-floor` | shipped: no header check existed in the repo, so the wave 17 harness became `scripts/check-header-fit.js`, run by `quality`; fit and floor asserted separately; reproduced W17-05's matrix 108 of 108; one RU letter took slack to 0 and only the floor fired; fails if Inter does not load |
| RC-140 | W18-03 Acceptance-grep integrity | SELF | `w18/rc-140-grep-integrity` | shipped: 11 acceptance checks audited by running each against zero inputs; 6 lacked it and passed having read nothing (check-links, check-stale-docs, check-lighthouse, verify-live, W18-02's own check-header-fit, and the deploy workflow's placeholder grep); all 6 now print their count and fail on zero, each watched failing; 5 already had it, shown by their own zero arms |

**The W18 numbers follow the dispatch's order.**

## Wave 17

Dispatch of 2026-09-16. **Ruling R-AB** (`docs/rulings/R-AB.md`) ships first, as a
STOP PR, ahead of every other card. #35 (R-AA) was merged by the owner before this
run and verified as an ancestor of `main` before any card was worked: `8f786ad`.

| Ticket | Card | Mode | Branch | Status |
|---|---|---|---|---|
| RC-137 | W17-01 Ruling R-AB, a gate's result is its own exit code and its own output | STOP | `w17/rc-137-ruling-rab` | STOP PR #39, awaiting owner |
| RC-133 | W17-02 Category page prose, closes Q-W16-01 | SELF | `w17/rc-133-category-prose` | shipped: 42 strings, a lede and two paragraphs on each of 14 pages in its own locale; zero prices, lei, manufacturer names, capability or superlative terms; gate extended and negative-tested on 9 arms; R-Y amended (LOCAL); meta description is now the lede |
| RC-134 | W17-03 Upgrade the R-Y category budgets from LOCAL to R-P | STOP | `w17/rc-134-ry-live-budgets` | STOP PR, awaiting owner: 4 live R-P runs on the #42 deploy, 28 of 28 VERIFIED and identical; category figures equal W17-02's, no budget changes; `catProse` marker added and negative-tested; LOCAL labels struck |
| RC-135 | W17-04 Close the scan gap, `src/product.html` | SELF | `w17/rc-135-scan-gap` | shipped: both template scans carry it, 6 of 6 asserted by count in each; it fails nothing; main's scans shown missing a plant; 4 arms negative-tested |
| RC-136 | W17-05 Header caret, Q-W15-01 option (c) | SELF | `w17/rc-136-header-caret` | shipped: pill gap 24 to 20px, 14px caret; 108 of 108 matrix combinations across six templates, caret present wherever the nav shows, phone fully visible 36 of 36 from 1280px; RU slack 15 to 9; 3 arms and 64 behaviour assertions; heights unmoved |

**RC-137 is this executor's numbering.** The dispatch named R-AB without a ticket
id; RC-133 to RC-136 are the dispatch's own, so R-AB took the next free number. The
W17 numbers follow the dispatch's order, not the order the cards are worked in.

**This section is added by whichever wave 17 card merges first.** RC-137 and RC-134
are STOP and wait for the owner, so the SELF cards reach `main` ahead of them and
carry it in. Each open STOP branch then takes `main` forward by merge and resolves
this section by union, locally, per `docs/CLAUDE.md` section 10 and R-Z.

## Wave 16

Dispatch of 2026-09-16. **Ruling R-AA** (`docs/rulings/R-AA.md`) ships first, as a
STOP PR, ahead of every other card. #25 and #31 were both merged by the owner
before this run and verified as ancestors of `main` before any card was worked:
#25 as `29fd10b`, #31 as `47f967f`.

| Ticket | Card | Mode | Branch | Status |
|---|---|---|---|---|
| RC-132 | W16-01 Ruling R-AA, destructive git commands and worktree hygiene | STOP | `w16/rc-132-ruling-raa` | PR #35, awaiting owner |
| RC-129 | W16-02 Catalog category pages, seven pages both locales | SELF | `w16/rc-129-category-pages` | shipped: 14 pages, 14 sitemap URLs, 8 gates green, budgets added to R-Y (local) and 14 rows to verify-live; descriptive prose omitted as unsourced (Q-W16-01); a standing gate added beyond the card, for ratification |
| RC-130 | W16-03 Repoint the catalog menu, closes Q-W15-01 | SELF | `w16/rc-130-repoint-catalog` | shipped: 14 rows repointed, zero to a service page, build-time mapping assertion negative-tested on two arms; header unchanged, all three candidates measured and none fits RU (cheapest misses by 1px), 72 of 72 matrix combinations pass |
| RC-131 | W16-04 Lighthouse gate: make gate 5 execute or delete it | SELF | `w16/rc-131-lighthouse-gate` | shipped: IMPLEMENTED, gate 5 executes via a pinned npx/PATH ladder with no silent fallback and no repo dependency; negative-tested on three arms; RO/RU performance 99-100, accessibility 100 against floors 95/100; the gate found two bugs in itself, both surfaced by its refusal to skip |

**RC-132 is this executor's numbering.** The dispatch named R-AA without a ticket
id; RC-129 to RC-131 are the dispatch's own, so R-AA took the next free number.

**This section is added by whichever wave 16 card merges first.** RC-132 is STOP
and waits for the owner, so the SELF cards reach `main` ahead of it and carry it
in. PR #35 adds the same section on its own branch; when `main` is merged forward
into it, the two are resolved by union, locally, per `docs/CLAUDE.md` section 10
and rulings R-Z and R-AA.

## Wave 15

Dispatch of 2026-09-15. **Ruling R-Z** (`docs/rulings/R-Z.md`) ships first, as a
STOP PR, ahead of every other card, as the dispatch directs.

**R-V's autonomy did not carry.** R-V scopes itself to wave 14, cards RC-101 to
RC-114, and says so in as many words. The wave 15 dispatch grants SELF per card
instead, and the three content cards carry it; R-Z is STOP because it is a
ruling, which is the one path `docs/rulings/` has always taken.

| Ticket | Card | Mode | Branch | Status |
|---|---|---|---|---|
| RC-125 | W15-01 Ruling R-Z, merge hygiene and supplier pricing | STOP | `w15/rc-125-ruling-rz` | merged by the owner, #31 (`47f967f`) |
| RC-126 | W15-02 Servicii dropdown, closes Q-W14-15 | SELF | `w15/rc-126-servicii-dropdown` | shipped: 13 destinations, 54 of 54 header-fit combinations, 76 of 76 behaviour assertions, heights unmoved; slack unchanged RO 53 / RU 15 at 1280px and up; no caret and no RC-121 revert, both refused by measurement (Q-W15-01) |
| RC-127 | W15-03 Two missing carport diagrams | SELF | `w15/rc-127-carport-diagrams` | shipped: inclined and architectural drawn, C-10, C-11, C-12 and the Arhitecturală tile remapped, 56 of 56 assertions, heights unmoved, zero image files; the depiction is for ratification |
| RC-128 | W15-04 Swatch provenance correction | SELF | `w15/rc-128-swatch-provenance` | shipped: 15 legend values reauthored as ours, source URLs and the ral field removed and now refused by the build, 52 of 52 assertions, heights unmoved; three premise corrections and Q-W15-02 recorded |

**RC-125 is this executor's numbering.** The dispatch named R-Z without a ticket
id and RC-124 was the last one used, so R-Z took the next. RC-126, RC-127 and
RC-128 are the dispatch's own numbers.

**This section is added by whichever wave 15 card merges first.** RC-125 is STOP
and waits for the owner, so the SELF cards reach `main` ahead of it and carry it
in. PR #31 adds the same section on its own branch; when `main` is merged forward
into it the two are resolved by union, locally, per `docs/CLAUDE.md` section 10
and ruling R-Z itself.

## Wave 14

Dispatch of 2026-09-15. **Ruling R-V** (`docs/rulings/R-V.md`): a SELF card
self-merges on a green `quality` check; a STOP card opens a PR and halts that
card only. From R-V onward a ruling lives in its own file under `docs/rulings/`.

Worked in dependency order, not number order: R-V first, then RC-102 (nothing
can self-merge until `quality` exists), RC-101, RC-114 (the R-X gate lands before
any new content), RC-106 to RC-112, and RC-105 last so its STOP PR is cut from
the final `main` and stays mergeable.

| Ticket | Card | Mode | Branch | Status |
|---|---|---|---|---|
| RC-101 | W14-01a Ruling R-V, wave autonomy | STOP | `w14/rc-101-ruling-rv` | PR #1, awaiting owner |
| RC-101 | W14-01 Land the competitor structure audit | SELF | `w14/rc-101-audit` | shipped |
| RC-102 | W14-02a Ruling R-W, asset provenance | STOP | `w14/rc-102-ruling-rw` | PR #2, awaiting owner |
| RC-102 | W14-02 Asset provenance gate, and the `quality` check | SELF | `w14/rc-102-asset-provenance` | shipped |
| RC-103 | W14-03 Section 1 copy, RO | SELF | none | **blocked**, Q-W14-02 |
| RC-104 | W14-04 Section 1 copy, RU parity | SELF | none | **blocked** on RC-103 |
| RC-105 | W14-05 Remove the frozen price | STOP | `w14/rc-105-frozen-price` | merged at the owner's instruction with W14-05b |
| RC-106 | W14-06 Catalog mega-menu, S-01 | SELF | `w14/rc-106-catalog-menu` | **blocked**, PR #7 open, not merged: Q-W14-04, Q-W14-05 |
| RC-107 | W14-07 Social row, S-07 | SELF | `w14/rc-107-social-row` | shipped, URLs to confirm: Q-W14-06 |
| RC-108 | W14-08 Acoperișuri offer cards, S-02 | SELF | `w14/rc-108-offer-cards` | shipped without images (Q-W14-07); homepage over R-J until RC-113 |
| RC-109 | W14-09 Before/after slider, S-03 | SELF | `w14/rc-109-before-after` | shipped, empty until client before/after pairs exist |
| RC-110 | W14-10 Țiglă metalică grid, S-04 | SELF | `w14/rc-110-tigla-grid` | shipped without images (Q-W14-07); prices to confirm (Q-W14-08) |
| RC-111 | W14-11 Copertine, S-06 | SELF | `w14/rc-111-copertine` | shipped without images (Q-W14-07); homepage 53% over R-J |
| RC-112 | W14-12 Garduri, S-05, component only | SELF | `w14/rc-112-garduri` | **blocked**, Q-W14-09; component and empty data file merged |
| RC-113 | W14-13 Height re-measure, new budget ruling | STOP | none | carried into the close-out board below |
| RC-114 | W14-14a Ruling R-X, no pressure selling | STOP | `w14/rc-114-ruling-rx` | PR #3, awaiting owner |
| RC-114 | W14-14 Scarcity gate | SELF | `w14/rc-114-scarcity-gate` | shipped |

**Close-out dispatch, 2026-09-15.** Ratifications recorded (DECISIONS.md, W14
ratifications); PRs #1, #2, #3 merged at the owner's instruction.

| Ticket | Card | Mode | Branch | Status |
|---|---|---|---|---|
| RC-102 | W14-02b R-W amendment: legacy status, approved origins | STOP | `w14/rc-102-rw-amendment` | merged by the owner, #16 |
| RC-115 | W14-15 Header breakpoint to 1100px | SELF | `w14/rc-115-header-breakpoint` | shipped, closes Q-W14-05 |
| RC-107 | W14-07b Fix: hero photo overflow after the social row | SELF | `w14/rc-107-hero-overflow-fix` | shipped |
| RC-116 | W14-16 Page split: tigla-metalica, copertine, garduri | SELF | `w14/rc-116-page-split` | shipped |
| RC-117 | W14-17 Origin cutover to rapidconstruct.md | STOP | `w14/rc-117-origin-cutover` | merged by the owner, #20; verified live and tagged `wave-14-cutover` (RC-124) |
| RC-105 | W14-05b The 160 lei/m² figure leaves meta and price field, folded into #14 | owner-ordered merge | `w14/rc-105-frozen-price` | shipped with #14 |
| RC-106 | W14-06b Catalog menu, unblocked, audit 1.2 data | SELF | `w14/rc-106-catalog-menu` | merged, #7 (RC-106b, after RC-121) |
| RC-103 | W14-03 Section 1 copy, RO, strings supplied | SELF | `w14/rc-103-copy-ro` | shipped, closes Q-W14-02 |
| RC-104 | W14-04 Section 1 copy, RU parity | SELF | `w14/rc-104-copy-ru` | shipped |
| RC-118 | W14-18 Product and visualisation images | SELF | `w14/rc-118-images` | shipped: four offer card images (RC-108); tile renders and RAL chips **blocked** (Q-W14-11); carport images **blocked** (Q-W14-12) |
| RC-119 | W14-19 Real-photo placeholders and pending manifest | SELF | `w14/rc-119-pending-photos` | manifest shipped (`docs/assets/PENDING-PHOTOS.md`); placeholders **blocked**, no host section exists for them (Q-W14-14) |
| RC-113 | W14-13 Re-measure, per-page budgets ruling | STOP | `w14/rc-113-remeasure` | merged by the owner, #25 (`29fd10b`) |
| RC-112 | W14-12 Garduri data | SELF | none | **blocked**, Q-W14-09 |

**Tail dispatch, 2026-09-15.** Ratifications recorded (DECISIONS.md, W14 tail
ratifications). #16 and #20 were merged by the owner before the run; #25 was not.

| Ticket | Card | Mode | Branch | Status |
|---|---|---|---|---|
| RC-124 | W14-24 Post-cutover verification and tag | owner-ordered | `w14/rc-124-cutover-verify` | shipped: verified live, tagged `wave-14-cutover`; main repaired (W14-24a) |
| RC-121 | W14-21 Header fit, unblocks #7 | SELF | `w14/rc-121-header-fit` | shipped: ladder step 3; with the catalog, slack at 1280px and up RO 52px, RU 15px |
| RC-106b | W14-06b Merge the catalog menu | SELF | `w14/rc-106-catalog-menu` | shipped: 67 of 67, data 16 of 16, header fit 116 of 116 with the catalog; #7 merged |
| RC-120 | W14-20 Garduri service page, closes Q-W14-09 | SELF | `w14/rc-120-garduri-page` | shipped: page rebuilt, 34 of 34; the header nav link **blocked** (Q-W14-15) |
| RC-122 | W14-22 Tile colour swatches, closes Q-W14-11 | SELF | `w14/rc-122-tile-swatches` | shipped: swatches on every chip, 12 of 12; Dasterum renders still open (Q-W14-11b); the values shipped as RAL figures and were reauthored as our own approximations at W15-04 |
| RC-123 | W14-23 Carport diagrams, closes Q-W14-12 | SELF | `w14/rc-123-carport-diagrams` | shipped: five line diagrams on 5 tiles and 12 models, 22 of 22, zero image files |

## Wave 13

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-085 | W13-01 Logo survey, reported, stopped on raster | — | reported |
| RC-085 | W13-02 Mark to brand orange by channel rewrite | `w13/rc-085-logo-orange` | shipped |
| RC-086 | W13-03 Enlarge the mark in the header pill and footer | `w13/rc-086-logo-size` | shipped |

## Wave 12

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-050 | W12-01 Portfolio end tile, 100+ | `w12/rc-050-portfolio-end-tile` | shipped |
| RC-051 | W12-02 Static promo bar, data-driven | `w12/rc-051-promo-bar` | shipped |
| RC-052 | W12-03 Rulings R-H and R-I, heights measured | `w12/rc-052-wave12-docs` | shipped |
| RC-053 | W12-05 Adopt the full-width tile | `w12/rc-053-full-width-tile` | shipped |
| RC-054 | W12-06 Promo bar on every public page | `w12/rc-054-promo-site-wide` | shipped |
| RC-055 | W12-08 Google profile sameAs, resolved | `w12/rc-055-google-sameas` | shipped |
| RC-056 | W12-09 Coverage, 20 localities, one source | `w12/rc-056-coverage` | **built, HELD** |
| RC-060 | W12-04 R-J, R-K, baseline corrections, docs | `w12/rc-060-wave12b-docs` | shipped |
| RC-059 | Custom domain root + CNAME in the artifact | `fix/rc-059-custom-domain-base-path` | **merged 2026-09-06, live** |
| RC-077 | W12-28 Amend master plan lines 121, 245, 200 under R-R | `w12/rc-077-amend-master-plan-heuristic` | shipped |
| RC-061 | W12-10 R-J amended: the derivation governs, not the stated figures | `w12/rc-060-wave12b-docs` | shipped |
| RC-062 | W12-11 Ruling R-L, locality names verified against the CUATM | `w12/rc-062-cuatm-verify` | shipped |
| RC-063 | W12-12 Arm GOOGLE_REVIEWS_URL with the resolved canonical | `w12/rc-063-live-figures` | shipped |
| RC-064 | W12-13 Remove the 4.9/250+ review claim, both locales | `w12/rc-064-remove-review-claim` | shipped |
| RC-065 | W12-13b The removed claim was still shipping in an HTML comment | `w12/rc-065-comment-fix` | shipped |
| RC-066 | W12-14 SITE_URL defaults to the domain the client controls | `w12/rc-066-site-url-default` | shipped |
| RC-067 | W12-15 Ruling R-M, the Russian locale follows usage | `w12/rc-066-site-url-default` | shipped |
| RC-068 | W12-16 Wave 12 close, live figures, the 8px RO headroom | `docs/rc-068-wave12-close` | shipped |
| RC-069 | W12-17 Unlink the privacy pages while they render TODO | `w12/rc-069-unlink-privacy` | shipped |
| RC-070 | W12-18 to W12-20 Ruling R-N restore, R-O profile is sameAs only | `w12/rc-070-review-restore` | shipped |
| RC-071 | W12-21, W12-21b Privacy draft naming no operator; gate fix | `w12/rc-073-verify-live-doctrine` | shipped |
| RC-073 | W12-22 Ruling R-P, the live-measurement verifier | `w12/rc-073-verify-live-doctrine` | shipped |
| RC-074 | W12-23 to W12-25 build-sha identity marker, R-Q, the gate rule | `w12/rc-074-sha-and-rq` | shipped |
| RC-072 | W12-26 Publish the fallback privacy page on an explicit switch | `w12/rc-072-privacy-fallback` | shipped |
| RC-076 | W12-27 Ruling R-R, three documents amended in place | `w12/rc-076-ruling-rr` | shipped |
| RC-078 | W12-29 Staleness gate, `check-stale-docs.js`, negative-tested | `w12/rc-078-stale-docs-gate` | shipped |
| RC-079 | W12-30 Close wave 12: handoff, open questions, production tag | `w12/rc-079-close-wave-12` | shipped |
| RC-080 | W12-31 Amend the two stylesheet comments; gate reads source comments | `w12/rc-080-source-comment-gate` | shipped |
| RC-081 | W12-32 Ruling R-S, handoff final figures, re-tag | `w12/rc-081-ruling-rs` | shipped |
| RC-082 | W12-33 Ruling R-T, amendment blocks and strike-through scope | `w12/rc-082-ruling-rt` | shipped |
| RC-083 | W12-34 Five owner answers, ruling R-U, hero alt and RO title | `w12/rc-083-owner-answers` | shipped |
| RC-084 | W12-35 Close: final handoff, deploy, verify, tag | `w12/rc-084-close` | shipped |

**The docs branch was rebuilt off W12-08, not off W12-09.** RC-057 originally sat
on top of the coverage commit, so merging it would have dragged the held card in.
RC-060 is the same docs commit cherry-picked onto `w12/rc-055-google-sameas`, so
the held card is not in its ancestry. RC-057 is abandoned, not merged.
| RC-058 | W12-07 Legal identity from the client PDF | — | **BLOCKED, awaiting confirmation** |

**The form gate is released.** `WEB3FORMS_KEY` is set and a real browser
submission landed at 08:57 on 2026-09-06. Q-W10-01 and W10-02 are closed on that
evidence.

**Two things are still held, and they are not the same hold:**

- **RC-056 (W12-09)** is built and must not merge until the client confirms
  Bălți, Ungheni and Cahul. Those three are also three of the four names in the
  new `meta.description`, so a "no" changes more than the list.
- **RC-058 (W12-07)** is not built at all. The two strings were extracted from
  the client PDF and reported for confirmation, which the card requires before
  anything is written. See Q-W12-07 and the report.

## Wave 6

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-031 | Wave 6 tracking files (this file + QUESTIONS.md) | `docs/rc-031-wave6-tracking` | shipped |
| RC-032 | W6-01 Supplier marquee: 12 named slots, white logo tiles | `w6/rc-032-supplier-marquee` | shipped |
| RC-033 | W6-02 Project model scale-up: 5 to 7 per service | `w6/rc-033-project-model-scale` | shipped |
| RC-034 | W6-03 Image slot type changes: hero-panel + 9 service photos | `w6/rc-034-image-slot-types` | shipped |
| RC-035 | W6-03b Service page hero art eager, not lazy | `w6/rc-035-svc-hero-eager` | shipped |
| RC-036 | Dead-link gate script + wave 6 release notes | `docs/rc-036-wave6-gates` | shipped |

## Wave 10

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-046 | W10-01 Process the five "Cum lucrăm" step photos | `w10/rc-046-process-steps` | shipped |

## Wave 9

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-043 | W9-01 Swap Ceresit -> CAT and Weber -> Heidelberg Materials | `w9/rc-043-supplier-swap` | shipped |
| RC-044 | W9-02 Social profiles in the footer bar | `w9/rc-044-social-links` | shipped |
| RC-045 | W9-03 CAT -> Liebherr, every tile now has a logo | `w9/rc-045-cat-replacement` | shipped |

## Wave 8

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-040 | W8-03 Hero panel photo on a provisional 720px floor | `w8/rc-040-hero-panel-photo` | shipped |
| RC-041 | W8-04 Close questions, drop bosch, ratify the header | `w8/rc-041-close-questions` | shipped |
| RC-042 | Wave 8 release notes, live measurements | `docs/rc-042-wave8-notes` | shipped |

W8-01 (deploy wave 7 and verify live) and W8-02 (reconcile duplicate artwork)
carried no code change. W8-02's premise did not hold: no duplicate set exists.

## Wave 7

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-037 | W7-01 docs/CLAUDE.md, standing rules | `w7/rc-037-claude-md` | shipped |
| RC-038 | W7-02 Route the nine service images | `w7/rc-038-service-images` | shipped |
| RC-039 | W7-03 Supplier logos: 9 of 12 landed | `w7/rc-039-supplier-logos` | shipped |

## Shipped, waves 1 to 5

| Ticket | What | Wave |
|---|---|---|
| RC-001 … RC-010 | Initial build, form demo mode, base path and Pages, photo pipeline, Lighthouse, a11y and privacy pages, phase 2 motion | pre-wave |
| RC-011 … RC-018 | Intake, header, hero, marquee, reviews, manifest v2, phase 1 snapshot, hero CTA | 1 |
| RC-019 … RC-023 | Content model, 18 service pages, wiring, SEO, crawlable-anchor fix | 2 |
| RC-024 … RC-027 | Never render a TODO marker, noindex gate, price scope, hero fit | 3 |
| RC-028 | 51-slot pipeline, dress rehearsal, shoot sheet | 4 |
| RC-029, RC-030 | Hero spacing, mobile hero gap | 5 |

## W9-04 · Portfolio content from the real photo set
**Status: DONE** (2026-09-01, branch `w9/rc-047-portfolio-content`)

Owner rulings R-A to R-G recorded in DECISIONS.md. 46 photographs inventoried,
12 struck for failing master plan section 7 (4 by R-D, 8 by Q-W9-04), 34 written
into `content/projects.json` with bilingual descriptions and per-project crop
anchors. `process-photos.js` gained the R-B no-upscale clamp and `--cropOffset`
anchoring; project covers moved to 4:3 at 400/800.

Sitemap 2 -> 18 URLs. 16 of 18 service pages cleared the W3-02 noindex gate;
`industrial` is the exception and has no real photograph. Open: Q-W9-04
(provenance rulings, and a photograph for `industrial`), Q-W9-05 (localities).

## W9-05 · Form delivery (B-01)
**Status: DONE except the live test** (2026-09-01)

Workflow wiring and honeypot were already correct. Subject lines now carry an
explicit [RO]/[RU] tag and the source path; the demo notice is emitted only when
disarmed. Verified in a headless browser, both locales, both paths. The two live
submissions are blocked on the secret being present and a merge to main, which
is a publish. See Q-W9-06.

## W9-06 · SEO foundations (C-01, C-04, part of C-02)
**Status: DONE** (2026-09-01)

sitemap lastmod from git content dates, six answer engines allowed explicitly in
robots.txt, generated /llms.txt, sameAs, absolute breadcrumb, ImageObject per
project cover, per-service og:image with real dimensions, unique title and
description on all 24 pages. Open: Q-W9-07 (two RO homepage fields over their
limits, plus a coverage-list contradiction), Q-W9-08 (SITE_URL is set, not
unset; answered).

## W9-08 · Extractable structure (C-02 FAQ, C-03)
**Status: DONE** (2026-09-01)

Direct 40-60 word answer opening all 18 service pages, spec tables on the six
services whose content supports one, four FAQ questions per page with matching
FAQPage schema, two contextual sibling links per page, content-dated
"Actualizat". All 20 pages inside the height budgets. Open deviation recorded in
DECISIONS.md: Russian answers run 31-39 words, not 40-60, to stay faithful
translations.

## W10-01 · Publish wave 9
**Status: DONE** (2026-09-01). Merged `w9/rc-047-portfolio-content` to main as
`b4bf763`, deployed. Verified live, not local: 18 sitemap URLs each with a
lastmod, 16 of 18 service pages indexable, industrial the only noindex pair,
homepage portfolio six different services in both locales, 68 cover files all
HTTP 200, zero slots on SVG fallback, 212 images across 20 pages all decode,
zero dead internal links, zero upscaled variants against source.

## W10-02 · Live form test
**Status: BLOCKED, not started.** `WEB3FORMS_KEY` does not exist. Deploy log says
DEMO MODE, the secrets API returns zero for the repo and both environments, and
the live HTML carries `data-armed="0"`. See Q-W10-01 for the three-step fix.

## W10-03 · Restore images
**Status: HELD** pending the owner confirming the set, as instructed.

## W10-04 · Title and description
**Status: DONE** (2026-09-01). RO title 62 -> 60, description 176 -> 155, no
claim dropped. Deployed as `7b136d0` and verified live. All 24 pages within both
limits. RU unchanged at 60 and 155.

## W11-01 · Restore the four industrial photographs
**Status: DONE** (2026-09-02). Only four of the eight on the brief were ever
held; the other four shipped in W9-04 and were live. Correction recorded in
DECISIONS.md. industrial cleared the noindex gate: 18 of 18 service pages
indexable, sitemap 20 URLs, 38 renderable projects, zero upscales.

## W11-02 · Unlisted review page
**Status: DONE** (2026-09-02). /review/ renders the five held photographs at
full size with filename, reason and service, no descriptions. noindex nofollow,
absent from the sitemap, zero links to it from any other page. One mislabel was
caught and fixed before publishing: selecting by dimension picked the published
reparatii-01 for the 1200x1600 slot because that folder holds two files at that
size. Selection is now by exact filename with an asserted dimension check.

## W11-03 · Deploy and verify live
**Status: DONE** (2026-09-02). Deployed as f179951. All acceptance criteria met
live. The deploy log still reports DEMO MODE: WEB3FORMS_KEY is still absent, so
Q-W10-01 remains open and W10-02 remains blocked.

## W12-01 · Portfolio end tile
**Status: BUILT, HELD** (2026-09-03). Seventh cell after the six cards, `100+`
over a one-line caption, project-card box, no link and nothing focusable, and
outside the filter selector so filters leave it alone. Labelled not hidden:
numeral `aria-hidden`, sentence exposed, confirmed on the accessibility tree.
Costs 193px, which is the whole of the wave's budget overage. See Q-W12-01.

## W12-02 · Promo bar
**Status: BUILT, HELD** (2026-09-03). Static in-flow strip, 44/36px hard cap,
`--ink` on `--brand` at 5.10:1, one line unclipped from 320px to 1440px, zero
animation, zero CLS measured against a control. Data-driven with `promo.endDate`
as the removal switch. Homepage only — Q-W12-03 asks whether to extend it to the
service pages. Costs exactly 44px and stays inside budget on its own.

## W12-03 · Heights
**Status: REPORTED, OVER BUDGET** (2026-09-03). RO 8,883 against 8,744, RU 9,096
against 9,044. Not trimmed, per the card. **AMENDED: those budgets are R-I's and
were superseded by R-J on 2026-09-06, which set 8,851 and 9,065. The figures here
are the then-current ones this card was measured against, kept as the record of
what was reported; do not budget against them.** **AMENDED again 2026-09-15: R-J's figures are themselves superseded by ruling R-Y (W14-13).** Also corrected a 142px error in the
recorded baseline that had stood since wave 8. See W12-03 in DECISIONS.md.

## W12-05 · Full-width tile
**Status: DONE** (2026-09-06). 193px -> 101px. Accessibility treatment
re-verified against the accessibility tree after the layout change, not carried
over on trust. RO 8,791 / RU 9,005 at this point in the wave.

## W12-06 · Promo bar site-wide
**Status: DONE** (2026-09-06). 24 of 25 pages; `/review/` excluded and why is
recorded. Tallest service page 5,729px against 6,000, 271px of headroom.

## W12-07 · Legal identity
**Status: BLOCKED, reported not written** (2026-09-06). The PDF was located and
two strings extracted. The company name in it is **not** "Rapid Construct", and
the document is a bank payment advice rather than a registration certificate, so
both facts were reported for confirmation before any write. Privacy pages remain
`noindex` and out of the sitemap. See Q-W12-07.

## W12-08 · Google Business Profile
**Status: DONE** (2026-09-06). Shortlink resolved to a tracking-laden Search URL
and was NOT used; the Maps CID URL was used instead. Zero rating markup, audited.

## W12-09 · Coverage
**Status: BUILT, HELD** (2026-09-06). 20 localities from one source; prose,
both `areaServed` blocks and `llms.txt` verified identical. `location` still
empty on all 38 renderable projects. Q-W9-05 explicitly NOT closed.

## W12-10 to W12-27 · the second half of wave 12

**Status: all shipped** (2026-09-06 and 2026-09-07). Rows added at the wave close,
W12-30: the ticket table above stopped being updated after W12-09 and eighteen
cards merged without one. The branch column is reconstructed from
`git log --first-parent` on `main` and two cards share a branch where a docs
commit was cherry-picked onto its predecessor, which is recorded above for
RC-060.

Six rulings landed in that stretch — R-L and R-M on place names, R-N and R-O on
the review claim and the profile link, R-P on live measurement, R-Q and R-R on
what a governing document may restate. Each is in `DECISIONS.md` under its own
heading.

## W12-28 · Master plan amendments
**Status: DONE** (2026-09-07). Lines 121, 245 and 200 amended under R-R.
Line 121 was a false rule rather than a stale value: it declared that exceeding
9,000px meant something had been over-built, which RU does by design under R-J. Resolves
Q-W12-11.

## W12-29 · Staleness gate
**Status: DONE** (2026-09-07). `scripts/check-stale-docs.js`, gate 3 in
CLAUDE.md section 11, seeded with every value the wave found. Negative-tested on
a scratch copy before it was trusted, and the first version failed that test:
it missed a superseded budget restated as live in a section that discussed the
superseding ruling four lines away. R-Q amended to make the list part of
recording a ruling. Q-W12-12 logged: two `src/styles.css` comments are the same
defect and are out of the scan's scope.

## W12-30 · Close the wave
**Status: DONE** (2026-09-07). Production verified under R-P with the SHA
assertion and tagged. Handoff written at the foot of `RELEASE-NOTES.md`: budgets
by ruling reference, the open questions with what unblocks each, and the exact
W12-07 reversal step.

## W12-31 · The last known stale value
**Status: DONE** (2026-09-07). The two `src/styles.css` comments quoting the cap
R-J superseded are amended, naming R-J and stating no figure. `check-stale-docs.js`
now reads source comments as well as documents: `src/*.css`, `src/*.html`,
`build.js`, `scripts/*.js`, comments only, extracted by a character scanner
rather than a regex. Negative-tested on both arms - four values planted in four
comment forms all fired, six planted in code fired nothing. Resolves Q-W12-12.

## W12-32 · Ruling R-S
**Status: DONE** (2026-09-07). Bodies are immutable, status metadata is not.
CLAUDE.md section 17. Ratifies the four question headings W12-30 moved from OPEN
to answered, and settles that RELEASE-NOTES dated wave records stay as written
while current figures live in the handoff. Closes the in-place correction method
R-J used without reversing R-J. Q-W12-13 logged: two rulings carry amendment
blocks appended inside their bodies, which R-S as worded does not clearly permit;
default shipped is that the next one is its own entry.

## W12-33 · Ruling R-T
**Status: DONE** (2026-09-07). Answers Q-W12-13 with (a): a ruling body may carry
appended amendment blocks, because a ruling is standing authority read forward
and R-S governs snapshots read backward. The blocks in R-J and R-Q stand, and
R-J's in-place figure corrections are regularised, so the irregularity W12-32
left open is closed with no correcting entry owed. Recorded alongside R-R: the
strike-through requirement holds where the superseded value has documentary
purpose, so W12-31's removal from two stylesheet comments is the standard.

## W12-34 · Owner answers and ruling R-U
**Status: DONE** (2026-09-07). Q-09 hero alt rewritten in both locales from the
photograph itself; the provenance half dissolves because the new text claims
nothing. Q-W9-07 title shortened 60 to 51 by deleting two words, and this card
corrects that question's stale figures - the description half stays open and was
not touched. Q-W12-02 accepted as built, no scheduler, reasoning recorded.
Q-W12-05 closed by R-M. Ruling R-U closes Q-W9-05: `location` is permanently
empty, verified 0 of 54 and 0 of the 20 coverage names anywhere in projects.json.

## W12-35 · Close
**Status: DONE** (2026-09-07). Final handoff: four live questions with whose they
are and what unblocks each, R-U flagged as required reading before touching
projects.json, and the four-step W12-07 reversal carried forward unchanged.
Production verified under R-P with the SHA assertion and tagged `wave-12-closed`.
Tags are added, never moved.

## W13-01 · Logo survey
**Status: REPORTED, STOPPED** (2026-09-07). Every logo asset is raster; no vector
source exists in the repo. Reported per the card's stop condition rather than
recolouring by filter or tint. The survey found one asset, `logo-white.png`, that
is a single-colour alpha mask and therefore exactly recolourable in data.

## W13-02 · Mark to brand orange
**Status: DONE** (2026-09-08). RGB channel rewritten to `#F65308`, taken from
CLAUDE.md section 3 and not from the master plan's struck row. Verified on the
written file: 1 distinct RGB equal to the target, alpha identical across all
875,856 bytes with a matching sha256. Renamed `logo-white.png` to `logo-mono.png`
and updated nine references. og:image regenerated on `#141414`, 5.40:1 on every
surface the mark renders on. Q-W13-01 logged for the three assets that need a
client-supplied source.

## W13-03 · Logo size
**Status: DONE** (2026-09-08). CSS only, no image files touched. Mark 32 to 48px
in the 64px pill, derived from the CTA button's existing 8px clearance rather
than chosen; 40px scrolled, 40px mobile, 36px mobile scrolled, all at the same
8px. Mobile had no rule and was inheriting the desktop 32px into a 56px pill.
Footer 44 to 66px, the same 1.5x factor. The real finding: the PNG carries 76px
of transparent margin at the top and 24px at the bottom, so a 32px box was only
26.4px of ink sitting low - which is why it read smaller than its CSS said.
Header bar 96px and pill 64px both unchanged. Zero height impact, measured
before deploying. Largest rendered width 179.2px against a 1542px source.
