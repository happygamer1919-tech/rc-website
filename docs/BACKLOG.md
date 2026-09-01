# Backlog

Ticket status for the `rc-website` build. One card, one commit, one branch named
`<wave>/<ticket-id>-<short-slug>`.

Status values: `todo` · `in progress` · `blocked` · `shipped`.

Waves 1 to 5 predate this file; their tickets are reconstructed from the git
history and are all `shipped`. `RELEASE-NOTES.md` carries what each one changed.

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
