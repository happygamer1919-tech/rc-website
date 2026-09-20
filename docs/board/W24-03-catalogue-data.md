# W24-03 · Every fatade3d product, extracted into the repo's own records

| | |
|---|---|
| Dispatched | Wave 24, 2026-09-19 |
| Rulings in force | R-V, R-W, R-X, R-Z, R-AA, R-AB, and W24-R1, W24-R2, W24-R3, W24-R9 |
| Depends on | W24-01 |
| Output | `content/catalog-products.json`, `docs/CATALOG-SOURCE-W24.md` |

## What changed, and why this card is allowed to exist

The wave 21 drop of "do not copy the fatade3d catalogue" is **reversed for text data**
(W24-R1). Product names, variant lines, prices and the category structure are copied
from `fatade3d.md`. The owner states the client sells all of them and authorises the
listing. **R-W is unchanged for files** (W24-R2): the pages are fetched to read text and
measure layout, and nothing else crosses.

## What the card asks

Extract **every** product in this taxonomy, which is the taxonomy `content/catalog.json`
already holds, 7 categories and 7 subcategories:

- Sisteme de termoizolatie (Sisteme de termoizolatie, Polistiren expandat, Polistiren
  extrudat, Vata minerala, Adezivi si mase de spaclu, Alte produse)
- Tencuieli decorative
- Placi ceramice
- Elemente decorative
- Vopsele (Vopsele, Vopsele de exterior, Vopsele de interior)
- Sisteme de iluminare
- Alte materiale de constructii

Per product: the exact name with its diacritics, the brand as plain text if shown, the
variant line exactly as shown ("10 mm, 20 mm, ..."), the price or price range exactly as
shown, the source URL, the capture date, and the RU name. Follow pagination to the end.
A range with a `0,00` lower bound is stored whole and renders only its non-zero price.

Write `content/catalog-products.json` and `docs/CATALOG-SOURCE-W24.md` with per-category
counts.

**One incomplete record must no longer fail the whole build.** It fails that record, with
a named error saying which record and which field.

## The control sample, which must match

| Where | What |
|---|---|
| Polistiren expandat | 5 products |
| Polistiren expandat | "CT 80 F - Polistiren expandat", 6,50 lei - 65,00 lei |
| Polistiren expandat | "Polistiren Dalmatina", 20,00 lei - 165,00 lei |
| Tencuieli decorative | "Tencuiala decorativa mozaicata Omitka Rokomozaikova", galeata 20 kg, 1.750,00 lei |
| Tencuieli decorative | "Duraziv Standard TDS cu silicon", 1.150,00 lei - 1.250,00 lei |

**If the site cannot be fetched, STOP this card, report it, and invent nothing.**

## Acceptance

1. The control sample matched, item by item, each reported with its read value.
2. Per-category and per-subcategory counts in `docs/CATALOG-SOURCE-W24.md`.
3. Every RU name taken from the reference site's RU version. Where none exists, RO is
   reused for a product proper name and **every such key is listed in the PR** (W24-R9).
4. No image, logo or asset from the reference host in the diff (W24-R2).
5. Every gate under `quality` exit 0, each as its own process, named with its exit code.
