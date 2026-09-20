# W24-04 · The catalogue gets a card, a grid, a page per subcategory and an index

| | |
|---|---|
| Dispatched | Wave 24, 2026-09-19 |
| Rulings in force | R-V, R-W, R-X, R-Y as amended by W24-R4, R-Z, R-AA, R-AB, W24-R3, W24-R8 |
| Depends on | W24-01, W24-03 |
| Fixes | F-03 (a subcategory menu row lands on the parent page top), and the live `/catalog/` 404 |

## The card

Mirroring the fatade3d geometry and none of its colours or fonts (W24-R8):

- a white card, a large radius, a square image area on top carrying the W24-01
  placeholder and its slot id,
- the brand as a small text line, **no logos**,
- the product name bold over two to three lines,
- the variant line in muted text,
- a bottom row with the price bold on the left and a square brand-orange icon button on
  the right.

The button opens the existing quote form **prefilled with the product name**. There is no
cart, no SKU and no `schema.org` `Offer`.

## The grid and the pages

4 columns at 1440, 3 at 1024, 2 at 768, 1 at 390. Card heights equal per row and the
price row pinned to the bottom of the card.

Each page carries a breadcrumb, an H1 that is the uppercase category name, and the grid.

- A real page **per subcategory**, which is what stops a menu row landing on the parent
  page top (F-03).
- A `/catalog/` index page listing all 7 categories as placeholder tiles, which is what
  stops the live 404.
- A parent category page shows all of its products.
- The catalogue index is added to the mobile menu and to the footer.
- Sitemap and hreflang updated.

## Prices, and the re-scoped gate

Q-W21-01 is amended by W24-R3: a catalogue card shows **the fatade3d price**.
"Pret la cerere" / "Цена по запросу" appears **only where no price exists**.
`scripts/check-catalog-pages.js` is re-scoped accordingly: a price is permitted only
inside `.prod__price` on a catalogue page, and stays forbidden everywhere it was
forbidden before. **The re-scoped gate is negative-tested**, and the PR carries the
negative test and the exit code that was read (R-AB).

## Height budgets

Pages changed or created in wave 24 take a new budget of **measured + 60** at ship
(W24-R4), recorded in `docs/rulings/R-Y.md` as an amendment block. **The 1,400px section
cap does not apply to a catalogue grid.**

## Acceptance

1. `node build.js` exit 0, both locales, with every new page emitted.
2. The re-scoped catalogue gate green, and its negative arm watched red.
3. Gate 2 `check-links.js` green: every new route resolves, in the sitemap, the mobile
   menu and the footer.
4. Gate 14 `check-heading-fit.js` green at 360 and 1280 on every new page.
5. Gate 5 Lighthouse at or above the floors on a representative new page, both locales.
6. New height budgets recorded, each with the measured number it came from.
7. Screenshots at 1440 and 390 of the index, a parent category and a subcategory, RO and
   RU, in `~/Documents/rc-audit-w24/w24/`.
8. Every gate under `quality` exit 0, each as its own process, named with its exit code.
