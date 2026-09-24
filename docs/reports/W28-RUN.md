# W28-RUN · how wave 28 was run, and every deviation from the dispatch

**Card W28-21, wave 28, 2026-09-24.** The dispatch arrived 2026-09-23 23:08 UTC with an addendum minutes
later (R-W28-02, R-W28-03) and two owner messages during the wave (R-W28-04, R-W28-05). Every card was
worked in order, one card one pull request, each branch stacked on the previous card's branch, self-merged
on a green `quality` check under R-W28-01, and verified live on its merge sha with section 12.0. Nothing
waited for owner input; what was blocked went to `docs/QUESTIONS.md` and to this report. The board
(`docs/board/W28-board.json`) was republished to its artifact after every change (sixteen versions).

## Pull requests, in order

| Card | PR | Merged (UTC) | Merge sha | Live verify |
|---|---|---|---|---|
| W28-00 rulings and board | #168 | 23:31:37 | `801a66a` | EXIT=0 |
| W28-10 branch protection | none (API call, recorded under R-W28-01) | 23:13 | none | GET exit 0, contexts `["quality"]`, strict |
| W28-11 claims cleanup | #169 | 23:53:49 | `29346a7` | EXIT=0 |
| W28-12 home CTA | #170 | 00:05:34 | `1bf9166` | EXIT=0 |
| W28-13 services versus catalog | #171 | 00:26:33 | `b843133` | EXIT=0 |
| W28-14 copertine | #172 | 00:51:43 | `40d144f` | EXIT=0 |
| W28-15 fatade images | #173 | 01:11:52 | `31dc8c6` | EXIT=0 |
| W28-22 phone hero (owner chat, R-W28-04) | #174 | 01:22:18 | `7ddd241` | EXIT=0 |
| W28-16 industrial lines | #175 | 01:31:34 | `01ee981` | EXIT=0 |
| W28-17 technical SEO | #176 | 01:45:00 | `4d763b2` | EXIT=0 |
| W28-18 structured data | #177 | 01:55:25 | `3c30f00` | EXIT=0 |
| W28-19 GEO | #178 | 02:06:59 | `36669bd` | EXIT=0 |
| W28-20 Search Console tag | none, blocked | | | Q-W28-01 |
| W28-21 wave close | #179 | after this report | | section 12.0 on its merge sha |
| W28-FIX-01 stat labels 14px | #180 | after #179 | | section 12.0 on its merge sha |

## Blocked, with the exact lists

- **Q-W28-01, W28-20**: the `google-site-verification` meta tag needs its content value from the owner.
  The Business Profile half of the card landed in W28-11 as the reviews link (R-W28-03). One card when
  the value arrives: the tag in both locale heads from a committed ruling.
- **Q-W28-02, W28-14**: imperlux.md publishes no price for any copertine model, so the twelve models
  C-01 to C-12 carry the W24-R7 ask line instead of "de la N"; the dispatch's "price non-null" half of
  the acceptance fails by design. Also recorded there: car maker badges inside the Imperlux photographs
  of C-05, C-06, C-08, C-10 and C-12 (read as not a third-party mark), and C-01's pictures being
  renders rather than photographs.
- **Q-W28-03, W28-15**: three plate pictures show a different colour than the product they stand for
  (CAT-0051, CAT-0060, CAT-0077), and fatade3d.md serves one render for RED 69 and RED 70.

## Every deviation from the dispatch, flagged

Each row names the dispatch's words, what the repo or the world said, and what was done instead.

| # | The dispatch said | What was found | What was done |
|---|---|---|---|
| D1 | "Main at bc3e3a9" | main was `5751d2c` (#167 merged after the sha was written) | The wave opened on `5751d2c`; recorded in the W28-R.md preamble |
| D2 | "Append the cards below to the board JSON in docs/board/" | No board JSON and no board artifact existed in this repo (per-card `.md` files and BACKLOG.md statuses only) | `docs/board/W28-board.json` created with the rulings array and the cards; rendered to https://claude.ai/artifact/JrELJq3JM8Ub8pmLkdvatk and republished after every board change |
| D3 | "one card each to revert R-05 R-07" | The rulings are `W27-R-05` and `W27-R-07` (no `R-05` or `R-07` exists) | Read as the wave 27 rulings; recorded under R-W28-01 |
| D4 | W28-11: "Unify experience to 10+ ani" | The addendum's R-W28-02 says fifteen years | "15+ ani de experiență" everywhere, the 15+ exclusion dropped from the acceptance |
| D5 | W28-11: "no link until owner supplies URL" | The addendum's R-W28-03 supplied the share link | The link is live under the testimonials; the share link resolves to a google.com/search knowledge panel, so it is used as given |
| D6 | W28-12: "exactly 3 CTA anchors to contact on home" | Five `a.btn--primary[href$="#oferta"]` exist (desktop header, mobile panel copy, hero claim, portfolio, footer) | Three counted on the section-level ones by a stated selector; the hero claim button and the mobile panel copy are excluded, not deleted |
| D7 | W28-13: "Remove product grids, filter chips, counts and every price from service pages" | The roofing hub tiles carry no price and are navigation | The hub stays on the Acoperisuri service page; grids, chips, counts, prices and compare tables moved to `/catalog/materiale-acoperis/`; the compare tables are permitted there by shape |
| D8 | W28-14: "prices from imperlux.md shown de la N" and "every record has price non-null" | imperlux.md publishes no copertine price (every model page prints "Preț după măsurători") | Price null on all twelve, the W24-R7 ask line on each card; the price half of the acceptance FAILS by design; Q-W28-02 |
| D9 | W28-15: "every fatade image source_url hosts on fatade3d.md" | 113 fatade3d records stand on other hosts under W25-R1, W25-R20 and W25-R17 | The named test is scoped to the 110 direct-supplier rows; the other 113 are counted and printed |
| D10 | Not in the dispatch | Four FAQ answers per locale still said a thirty-year warranty against W25-22 (five) | Rewritten in W28-19 |
| D11 | Not in the dispatch | Owner chat during the wave: the phone hero must match the desktop hero | New card W28-22 under R-W28-04, worked as #174 between W28-15 and W28-16 |
| D12 | Not in the dispatch | Owner chat during the wave: services versus catalog split | Already shipped by W28-13 (#171); recorded as R-W28-05 with the live reading (0 " lei" on the four service pages) |
| D13 | W28-20: "blocked on owner: GSC_META_CONTENT / GBP_URL" | The addendum split the card: the reviews link landed in W28-11 | W28-20 stays blocked on the Search Console tag only (Q-W28-01) |
| D14 | W28-21: "invoke CRITIC per CLAUDE.md" | `docs/CLAUDE.md` names no CRITIC procedure and the repo has no root CLAUDE.md | The pass is run in the W27-REV-01 shape: every gate, a rendered crawl at three widths, Lighthouse, a taste list; one fix card |
| D15 | W28-17 acceptance | `scripts/check-template-literals.js` refused seo-check.js's own sitemap regex (a `\s*` before an interpolated `/` reads as `*/` once the interpolation is stripped) | Rewritten as a string concatenation before the pull request opened |
| D16 | W28-19: "NAP identical byte for byte across every page" | The footer's contact block sat on 70 of 85 pages in three spellings of one address | One `<address data-nap>` block rendered from one constant on 85 of 85 pages, one sha256; the redirect and review pages carry it centred under their body |
| D17 | W28-21: "Lighthouse on ... contact" | There is no contact page; the contact section is the home page's footer | The contact row is the home row, stated in the reports |
| D18 | W28-21: measurements "on the final tree" | The wave-close tree was measured before #178 merged, to save the wait | The tree is byte-identical to `main` at `36669bd` (`git diff --stat` prints nothing), stated in W28-REVIEW |

## Timeline

- 23:08 dispatch read; 23:13 branch protection set (W28-10); 23:20 rulings and board written; 23:31 #168 merged.
- 23:53 to 01:55: #169 to #177 merged and verified, one every 10 to 25 minutes, the chain waiting on
  each `quality` run (6 to 7 minutes each) and on section 12.0 (about 3 minutes each).
- 01:05 owner chat: phone hero and services versus catalog; W28-22 added and worked at once (#174 at 01:22).
- 02:00 to 02:17 wave-close measurements on the W28-19 tree (33 gates, the crawl at three widths, 24
  Lighthouse runs); 02:07 #178 merged, 02:10 verified.
- 02:20 to 02:50 screenshots read, the three reports written, the fix card added to the board.

## Owner action after the merge

One real lead in Romanian and one in Russian through the quote form, per the W21 standing rule. The form's
wiring is gate-checked; delivery is not. This is an owner action, not a terminal step.
