SELF-MERGE

# W28-FINAL-RUN-4 · wave 28 closes, the fifth dispatch, 2026-09-24 to 2026-09-25

**Mode: SELF-MERGE under R-W28-01.** Every pull request below merged with a merge commit after its
`quality` run passed and was verified live on its merge sha with `EXPECT_SHA=<sha> node
scripts/verify-live.js https://rapidconstruct.md` (exit code recorded). The final measurements were
taken on `main` at `ceaf080`, the last merge before this report. Report written 2026-09-25 00:40 UTC.
**Wave 28 closes with this pull request.**

## Read this first: what to look at in a browser

1. **The Catalog**, `https://rapidconstruct.md/catalog/` and `/ru/catalog/`: 9 tiles and no Copertine, and
   no Copertine row in the Catalog menu on any page (W28-30).
2. **Copertine**, `/servicii/copertine/`: chooser, steps, gallery, then the twelve models with their
   "Solicită ofertă" buttons. The hero's "Vezi cele 12 modele" scrolls straight to them (W28-FIX-03).
3. **The phone menu** on any page: Copertine is indented under Servicii, not under Catalog (W28-FIX-04).
4. **`https://rapidconstruct.md/llms.txt`**: Copertine is listed under Servicii / Услуги (W28-FIX-05).
5. **The board**, https://claude.ai/artifact/JrELJq3JM8Ub8pmLkdvatk, drawn from `main` after this merges.

## Pull requests

| PR | What | Merge sha | quality | Live verify |
|---|---|---|---|---|
| #193 | W28-R7: R-W28-16, cards W28-30 and W28-31 (documents only) | `75bf125` | pass | PASS: EXIT=0, 23:26:33Z |
| #194 | W28-30: copertine leaves the Catalog, the cards below the gallery | `0a2c173` | pass | PASS: EXIT=0, 23:33:52Z |
| #195 | W28-31: the CRITIC pass, W28-REVIEW second pass, three fix cards (documents only) | `1bc5d38` | pass, 6m55s | PASS: EXIT=0, 00:11:18Z |
| #196 | W28-FIX-03: the copertine hero button opens the models | `84ad11b` | pass, 7m32s | PASS: EXIT=0, 00:14:25Z |
| #197 | W28-FIX-04: on a phone, Copertine sits under Servicii | `fc1b1da` | pass, 7m18s | PASS: EXIT=0, 00:17:43Z |
| #198 | W28-FIX-05: the copertine page back in llms.txt | `ceaf080` | pass, 7m23s | PASS: EXIT=0, 00:21:15Z |
| this | W28-R8: this report and the closing board sync (documents only) | after merge | | |

Six merged, six verified, zero failures.

## W28-30: copertine placement

**Read**: the twelve cards rendered only on the copertine page, but W28-14 had made copertine a Catalog
group (a tile on the Catalog index, a Catalog menu row on every page, a chip with its count), so they sat
under Catalog by navigation. **Done**: the group, the tile's ledger row, the chip and its count are gone,
both locales; the cards stay on the copertine page with their buttons, below the gallery. The
catalog-counts test now asserts it and failed on the build of `main` before the change (exit 1, 70
problems).

| Acceptance | Live at `ceaf080` |
|---|---|
| Catalog pages carrying a copertine card | 0 of 46 |
| Catalog index tiles, RO and RU | 9 and 9, none to copertine |
| Catalog menu rows to copertine | 0 |
| Copertine page buttons to the form, RO and RU | 12 and 12 |
| `node scripts/check-catalog-counts.js` | exit 0 |

## The CRITIC pass and its fix cards

Run on `main` at `0a2c173`, the W27-REV-01 shape (the repo's rules name no CRITIC procedure): every
gate, a rendered crawl of 83 pages at 390, 768 and 1440, Lighthouse, a look at the pages this wave
changed. Details and taste in `docs/reports/W28-REVIEW.md`, second pass.

| Card | Defect | Fix | Live |
|---|---|---|---|
| W28-FIX-03 | the copertine hero's "see the 12 models" landed on the chooser | opens `#copertine-modele` | both locales |
| W28-FIX-04 | the phone menu still listed Copertine under Catalog | its row sits under Servicii; the test holds 66 phone menus | every page |
| W28-FIX-05 | the copertine page had left llms.txt | listed under Servicii, both locales; the test holds it | `llms.txt` |

Three cards, all side effects of W28-30. Not defects, read one by one: 47 empty alts (the supplier
marquee's hidden loop copy, gallery thumbnails inside a named link, the internal review page) and 36
text nodes under 14px (the known SVG diagram labels).

## Gates

| Tree | Result |
|---|---|
| #193, #194, #195 trees | 34 of 34 exit 0 each |
| #198's tree (the top of the fix stack, containing #196 and #197) | 34 of 34 exit 0 |
| `main` at `0a2c173` (the CRITIC pass) | 34 of 34 exit 0 |
| **`main` at `ceaf080` (the final run)** | **34 of 34 exit 0** |
| CI `quality` on #193 to #198 | pass on all six |
| `verify-live.js` on the six merge shas | EXIT=0 on all six |

## Lighthouse, desktop, median of three, `main` at `ceaf080` (local server)

The contact page is the home page's footer, so its row is the home page's.

| Page | Performance, three runs | Median | A11y | BP | SEO | LCP ms | CLS |
|---|---|---|---|---|---|---|---|
| `/` (home and contact) | 99, 99, 99 | **99** | 100 | 100 | 100 | 964 | 0.002 |
| `/ru/` (home and contact) | 99, 99, 99 | **99** | 100 | 100 | 100 | 963 | 0.044 |
| `/catalog/` | 96, 96, 96 | **96** | 100 | 100 | 100 | 1,344 | 0 |
| `/ru/catalog/` | 97, 97, 96 | **97** | 100 | 100 | 100 | 1,323 | 0 |
| `/servicii/acoperisuri/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 802 | 0 |
| `/ru/servicii/acoperisuri/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 802 | 0 |
| `/servicii/garduri/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 641 | 0 |
| `/ru/servicii/garduri/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 642 | 0 |
| `/servicii/fatade/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 762 | 0 |
| `/ru/servicii/fatade/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 763 | 0 |

Every page at or above the 95 performance floor the home pages carry (gate 5), and 100 on accessibility.

## Deviations, flagged

1. **"Under Catalog" read as navigation.** The cards were never on a Catalog page; copertine was a
   Catalog group by its tile, menu row and chip. The dispatch's first branch was applied to those.
2. **The CRITIC pass is the W27-REV-01 shape.** The repo's rules name no CRITIC procedure, as at W28-21.
3. **Two catalog-counts rules added by fix cards.** W28-FIX-04 (the phone menu row) and W28-FIX-05 (the
   llms.txt line) each added an assertion to `scripts/check-catalog-counts.js`, the test W28-30 already
   amended, so the defects cannot come back silently; no new gate number.
4. **Full local gates on the top of the fix stack only.** #196 and #197 were gated locally through #198's
   tree, which contains both; CI ran all 34 commands on each of them.

## Still open, waiting on you

- **Q-W28-01**: the Search Console tag's content value (W28-20).
- **The membrane photograph** at 225px: a larger copy, if you have one.

**Wave 28 is closed.** Nothing is queued after this pull request.
