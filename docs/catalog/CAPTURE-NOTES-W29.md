# fatade3d.md catalogue capture, 2026-09-28

Read-only capture of the public site. Permission to reuse structure and images obtained by the rc-website owner on 2026-09-28.

## Method

- Headless Chrome (`--headless=new`, CDP on port 9341, profile in `raw/chrome-profile`) driven by the zero-dependency client `scripts/lib/cdp-ws.js`. The Chrome user agent string ends with `rc-website https://github.com/happygamer1919-tech/rc-website`. curl also used that exact string. Nothing else was sent to identify anyone.
- Task A (`scripts/a-render.js`): 1440x900. The Catalog menu was read from the DOM. Each of the 14 category and sub-category pages was rendered, scrolled to the bottom until the count stopped growing, and "Vezi mai mult" (AJAX load more) was clicked until it went away. Every `/page/N/` URL was then rendered separately. The run was done twice (`raw/a-render.run1.json`, `raw/a-render.json`).
- Store API: `/wp-json/wc/store/v1/products/categories?per_page=100` and `/products?category=<id>&per_page=100&page=N`, all 1 page. Raw files are in `raw/api/`.
- Task B (`scripts/b-products.js`): every product page was fetched with curl (the server HTML holds all the data, so no JS was needed) and parsed in Chrome with DOMParser. Scripts did not run and no subresources loaded. The RU page was reached through the WPML switcher link on each RO page. Raw HTML is in `raw/prod/`, with `ru__` for RU pages.
- RU category pages (`scripts/a-render-ru.js`): rendered from the switcher link on each RO category page, using the same extractor and `/page/N/` order.
- Image originals (`scripts/img-check.js`): a `-WxH` suffix was stripped and the result checked with `curl -I`. All 153 stripped candidates returned 200 image/*.
- Task C (`scripts/c-motion.js`, `scripts/c-motion-extra.js`): motion measurements, see motion.json.
- Politeness: at most 2 concurrent requests, 250 to 1000 ms between requests. No blocking, no 429, no 5xx.

## Rules applied to text

- **Dashes.** The site renders U+2013 between price bounds (U+2013, e.g. "6,50 lei [U+2013] 65,00 lei") and uses U+2013 and U+2014 in some names and descriptions. The no-dash rule applies, so every one was written as "-". 655 fields changed. Each one is listed in `raw/dash-normalized.json`. The raw HTML keeps the originals.
- **Spaces.** NBSP was collapsed to a normal space.
- **Screen-reader text.** Text like "Interval de prețuri: ..." was excluded from `price_text`.
- **Breadcrumbs.** The site puts ">" separators with no spaces, so breadcrumb text reads "Prima pagină>Magazin Online>...". It is recorded as the DOM text.

## Tree and counts (RO rendered = API, per placement)

| Category / sub-category | Rendered | API | Pages | RU rendered |
|---|---|---|---|---|
| Sisteme de termoizolație | tiles only (5) | 25 (union of subs) | 1 | tiles |
| . Polistiren expandat | 5 | 5 | 1 | 5 |
| . Polistiren extrudat | 2 | 2 | 1 | 2 |
| . Vată minerală (tile badge "Top") | 5 | 5 | 1 | 5 |
| . Adezivi și mase de șpaclu | 11 | 11 | 1 | 9 |
| . Alte produse | 2 | 2 | 1 | 2 |
| Tencuieli decorative | 13 | 13 | 1 | 13 |
| Plăci ceramice (badge "Top", Phomi logo) | 27 | 88 | 2 (16+11) | 61 (a different set, see below) |
| Elemente decorative (RED logo) | 64 | 64 | 4 (16x4) | 64 |
| Vopsele | tiles only (2) | 5 (union of subs) | 1 | tiles |
| . Vopsele de exterior | 4 | 4 | 1 | 6 |
| . Vopsele de interior (badge "Nou", Caparol logo) | 4 | 4 | 1 | 4 |
| Sisteme de iluminare (badge "Top") | 25 | 25 | 2 (16+9) | 17 |
| Alte materiale de construcții (badge "Reduceri") | 3 | 3 | 1 | 3 |

- The menu matches the owner's expected list exactly, in the same order.
- The only extra item in the menu is its header text "Categorii de produse" (RU "Категории продуктов").
- 165 placement records cover 162 unique products. Three products appear in both Vopsele de exterior and Vopsele de interior: Ultrapal, Isomat Flexcoat and Amphibolin.
- Parent pages (Sisteme de termoizolație, Vopsele) show only sub-category tiles and no product grid. Every product the API lists under a parent is on one of its sub-category pages.
- Top-level images and badges come from the "Magazin Online" page tiles.
- Tile badges sit in `.product-category__badges`. Some tiles show a producer logo there instead of, or next to, a text badge. These are recorded as `badge_logo`.
- The "Magazin Online" page also has a product carousel. It is recorded under `extras` in fatade-tree.json.

## Surprises and gaps

1. **Plăci ceramice, API 88 vs rendered 27.**
   - The 61 API-only products are hidden single-colour products, for example "Placă Portoro".
   - Every one of them returns 301 to its parent product with the colour preselected, for example `/produs/stone-alpes/?attribute_pa_culoare=portoro` (`raw/api-only-redirects.json`).
   - They are listed in api-crosscheck.json under `api_only` with API name, price, images and redirect target. They have no RO page of their own.
2. **The RU catalogue is a different product set for Plăci ceramice.**
   - The RU page lists 61 single-colour tiles ("Плитка Portoro" and so on).
   - None of the 27 RO plate products has a RU translation.
   - The 61 RU cards are recorded under `ru_only` in api-crosscheck.json at card level. Their pages were not fetched because they are not in the RO rendered set.
3. **RO products with no RU switcher link: 37.** For these, `url_ru` and `name_ru` are null. The URL was not guessed.
   - 27 Plăci ceramice.
   - 8 Sisteme de iluminare, which is why RU shows 17 instead of 25.
   - 2 Adezivi, which is why RU shows 9 instead of 11.
   - RU Vopsele de exterior shows 6 cards against 4 in RO. All 6 are translations of RO products, so RU categorises 2 of them differently.
4. **"0,00 lei" low end: 1 product.** Polistiren expandat STOP FIRE shows "0,00 lei - 110,00 lei". Its variation 90mm / 1000 x 500 mm has display_price 0 in data-product_variations.
5. **Load-more order is not stable on Plăci ceramice.**
   - Across two runs, the AJAX "Vezi mai mult" order swapped items 18 to 24. The `/page/N/` order was identical in both runs.
   - The recorded order is the `/page/N/` order. On every other page, load-more order equals pagination order.
6. **RU variant selects often differ from RO (10 products).** Example: Dalmatina in RU shows only "Размер" with two identical "1000 x 500 mm" options, and no thickness select. Both are recorded as shown (`variants`, `variants_ru`). They were not aligned.
7. **Brand.**
   - The logo `alt` is empty everywhere, so brand names come from the Store API `brands[]`. 153 of 162 products have one, and `brand_source` says so.
   - 126 products show a logo.
8. **Missing data.**
   - SKU: none shown on any product page.
   - Product card badges: none.
   - RO description: 27 products have none.
   - RO short description: 31 products have none.
   - Variants line on the card: 27 products have none.
9. **Images.**
   - Card and tile images use the un-sized original when the stripped URL returned 200. Otherwise they use the largest srcset candidate (17 cards had no `-WxH` suffix to strip). `card_image_how` records which rule applied.
   - Gallery images are the full-size `href` of each gallery link: 292 URLs, and 91 products have more than one. `images_api` holds the API copies.
   - No image files were downloaded.
10. **Lazy loading.** Images use native `loading="lazy"`, and every URL is in the markup. No infinite scroll was found, only the load-more button.
11. **Cookie wall.** The Complianz cookie wall overlays the page and swallows the first click. For Task C it was dismissed with "Refuză", which set only a cookie in the local profile.

## Motion (motion.json)

- **Measured:**
  - The panel, flyout and trigger (desktop and mobile).
  - Tile, "Vezi produse" button and product card at rest and on hover (desktop).
- **Not measured:**
  - Mobile hover states: touch has no hover, and a tap would navigate away.
  - Closing animations.
  - Keyframe source text: its effect was sampled over time instead.

Screenshots are in `shots/`:
- `desktop-catalog-open.png`
- `desktop-vopsele-flyout-open.png`
- `mobile-catalog-open.png`
- `mobile-vopsele-flyout-open.png`
- `desktop-sisteme-de-termoizolatie.png` and its `-fullpage` version
- `desktop-polistiren-expandat.png` and its `-fullpage` version
