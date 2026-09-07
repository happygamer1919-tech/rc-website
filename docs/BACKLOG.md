# Backlog

Ticket status for the `rc-website` build. One card, one commit, one branch named
`<wave>/<ticket-id>-<short-slug>`.

Status values: `todo` · `in progress` · `blocked` · `shipped`.

Waves 1 to 5 predate this file; their tickets are reconstructed from the git
history and are all `shipped`. `RELEASE-NOTES.md` carries what each one changed.

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
what was reported; do not budget against them.** Also corrected a 142px error in the
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
