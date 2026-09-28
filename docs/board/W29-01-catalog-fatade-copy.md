# W29-01 · Catalogue: the fatade3d.md catalogue structure, pages and pictures, in RC colours and design

R-W29-01, R-W29-02. The full dispatch text is the card's `ask` in `docs/board/W29-board.json`. Source of record: fatade3d.md's Catalog menu and every category and product page it reaches. Acoperisuri and Garduri untouched; Copertine stays out of the Catalog.

## Acceptance (from the dispatch)

- named test catalog-structure: the category and sub-category tree in both locales, exit 0
- named test catalog-parity: `docs/catalog/FATADE-PARITY.json` (scraped at run time and committed) against the rendered catalogue in headless Chrome, zero missing products, exit 0
- named test catalog-images: every fatade-group product picture maps to a SOURCES.md row with the fatade licence string, the four exceptions exactly as specified, exit 0
- 320px gate, axe (Lighthouse accessibility), Lighthouse catalogue pages at or above 90 performance
- catalog-counts updated and green
- screenshots in the report: hub, Sisteme de termoizolatie category page, Polistiren expandat sub-page, Vopsele flyout open desktop and mobile, one product detail page
