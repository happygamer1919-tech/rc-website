# CATALOG-SOURCE-W24.md

Where `content/catalog-products.json` came from, what it counts, and every field that
could not be read. Card W24-03.

**Ruling.** W24-R1 reverses the wave 21 "do not copy the fatade3d catalogue" drop **for
text data**: product names, variant lines, prices and the category structure are copied
from `fatade3d.md`, and the owner states the client sells all of them. **W24-R2 is
unchanged for files**: no image, logo or asset from that host, from `imperlux.md` or from
`dasterum.md` is in this repo, and none was downloaded. Their pages were fetched to read
text and to measure layout, and nothing else crossed.

**Capture date: 2026-09-19.** Every figure below was read on that date. The source's own
`last-modified` on the product collection was `Tue, 25 Aug 2026 03:30:37 GMT`.

## 1. How it was read

Three sources were joined, each authoritative for different fields.

**a. The WooCommerce Store API**, which the host serves publicly, for ids, names, brands,
prices and category membership:

    GET https://fatade3d.md/wp-json/wc/store/v1/products?per_page=100&page={1,2,3}
    GET https://fatade3d.md/wp-json/wc/store/v1/products/categories?per_page=100
    GET https://fatade3d.md/ru/wp-json/wc/store/v1/products?per_page=100&page={1,2}
    GET https://fatade3d.md/ru/wp-json/wc/store/v1/products/categories?per_page=100

`x-wp-total: 223` and `x-wp-totalpages: 3` on the RO collection; `186` and `2` on the RU
one. Page 4 of the RU collection answers `[]`, which is how the end was confirmed rather
than assumed.

**b. The rendered category pages**, for the variant line exactly as a card shows it. The
card is `div.card.card--product`; the variant line is the text of `div.product-attribute`
inside it. Pagination is `/categorie-produs/<path>/page/<N>/` and the page after the last
answers HTTP 404, which was the stop condition. 19 RO pages and 21 RU pages returned 200
and were read; 24 further requests returned the terminating 404.

**c. The WPML language switcher on each product page**, for the RO to RU link. The host
runs WPML, not Polylang: `/wp-json/wp/v2/product` answers HTTP 500 without `_fields`, and
with `_fields` it carries no `translations` and no `lang`; `/wp-json/pll/v1/languages` is
404. So all 223 RO product pages were fetched and the `a.wpml-ls-link` read.

## 2. Counts

**Direct** is the products that category holds itself. **Rendered** is what its page shows:
a parent shows its subcategories' products as well as its own, which is what the card asks
for.

| Slug | Category | Direct | Rendered |
|---|---|---|---|
| `termoizolatie` | Sisteme de termoizolație | 0 | 25 |
| `termoizolatie/polistiren-expandat` | Polistiren expandat | 5 | 5 |
| `termoizolatie/polistiren-extrudat` | Polistiren extrudat | 2 | 2 |
| `termoizolatie/vata-minerala` | Vată minerală | 5 | 5 |
| `termoizolatie/adezivi-si-mase-de-spaclu` | Adezivi și mase de șpaclu | 11 | 11 |
| `termoizolatie/alte-produse` | Alte produse | 2 | 2 |
| `tencuieli-decorative` | Tencuieli decorative | 13 | 13 |
| `placi-ceramice` | Plăci ceramice | 88 | 88 |
| `elemente-decorative` | Elemente decorative | 64 | 64 |
| `vopsele` | Vopsele | 0 | 5 |
| `vopsele/vopsele-de-exterior` | Vopsele de exterior | 4 | 4 |
| `vopsele/vopsele-de-interior` | Vopsele de interior | 4 | 4 |
| `sisteme-iluminare` | Sisteme de iluminare | 25 | 25 |
| `alte-materiale` | Alte materiale de construcții | 3 | 3 |

**223 products in total**, each with one record and one photo slot, keyed
by `id` and never by name: ten names are used by two products each on the source.

`termoizolatie` and `vopsele` are container categories. They hold no product of their own
on the source either, and their own pages there render no card.

## 3. The control sample

Every one of the six matched. The value read is what `content/catalog-products.json` now
holds.

| # | Control | Result | Read |
|---|---|---|---|
| 1 | Polistiren expandat has 5 products | **PASS** | 5 |
| 2 | "CT 80 F - Polistiren expandat" 6,50 lei - 65,00 lei | **PASS** | `6,50 lei - 65,00 lei` |
| 3 | "Polistiren Dalmatina" 20,00 lei - 165,00 lei | **PASS** | `20,00 lei - 165,00 lei` |
| 4 | Tencuieli decorative has "Tencuiala decorativa mozaicata Omitka Rokomozaikova", galeata 20 kg, 1.750,00 lei | **PASS** | `Tencuială decorativă mozaicată Omitka Rokomozaikova`, variant `găleată 20 kg`, `1.750,00 lei` |
| 5 | Tencuieli decorative has "Duraziv Standard TDS cu silicon" 1.150,00 lei - 1.250,00 lei | **PASS** | `Duraziv Standard TDS cu silicon - Tencuială decorativă siliconică`, `1.150,00 lei - 1.250,00 lei` |
| 6 | A range with a 0,00 lower bound is stored and renders only the non-zero price | **2 found** | see section 5 |

Samples 4 and 5 were written in the dispatch without diacritics and sample 5 without its
suffix. The source spells both with full Romanian diacritics, and the exact strings above
are what is stored.

## 4. Two transforms, applied to every rendered string

**Plain hyphens.** The source separates the two halves of a product name, and the two ends
of a price range, with an en dash rather than a hyphen. The dispatch writes plain hyphens
and nothing else, and **its own control sample spells "CT 80 F - Polistiren expandat" with
a plain hyphen**, which is what decided it. Every rendered string carries plain hyphens; `source.name` keeps the host's string
unchanged beside it.

**A refused name never renders.** W17-02 refuses Dasterum, Imperlux and Fațade 3D by name
on a catalogue page, and W24-R1 does not touch that: it authorises product names, variant
lines, prices and the category structure, not a competitor's name. `build.js` and
`scripts/check-catalog-pages.js` both still refuse one. So `brand` is null where the
source brand is one, and a name carrying one is stored whole in `source.name` and rendered
with it removed. Both are listed in section 5.

## 5. Every field that could not be read, named

### A name carrying a refused manufacturer (3)

These render with the refused name removed. The untouched source string is in `source.name` and `source.ru_name`.

| Record | Product | What |
|---|---|---|
| `f3d-2576` | Plasă de armare | RU name "Армирующая сетка FAȚADE 3D" carries a name W17-02 refuses on a catalogue page; rendered as "Армирующая сетка". |
| `f3d-2583` | Colțar PVC | RO name "Colțar PVC - FAȚADE 3D" carries a name W17-02 refuses on a catalogue page; rendered as "Colțar PVC". |
| `f3d-2583` | Colțar PVC | RU name "ПВХ уголок - FAȚADE 3D" carries a name W17-02 refuses on a catalogue page; rendered as "ПВХ уголок". |

### A brand that W17-02 refuses on a catalogue page (27)

`brand` is null, so no brand line renders. `source.brand` keeps the value.

| Record | Product | What |
|---|---|---|
| `f3d-1716` | Lampă GMD-881F | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-1726` | Lampă GMD-881Y | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-1729` | Lampă GMD-F841F-2 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-1733` | Lampă K1207 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-1736` | Lampă K1212S | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-1749` | Lampă K1213M | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-1753` | Lampă K1241 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-1756` | Lampă K1247 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-1759` | Lampă K2148 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-1762` | Lampă K2276 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-1765` | Lampă K5014 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-1770` | Lampă K5016 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-1771` | Lampă K41041 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-1774` | Lampă K41047 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-1777` | Lampă K41059 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-1780` | Lampă K41061 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-1783` | Lampă K45015 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-5395` | Lampă K1247 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-5417` | Lampă K2880 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-5428` | Lampă K2088L | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-5432` | Lampă K2222 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-5437` | Lampă K2841 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-5440` | Lampă K2842 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-5444` | Lampă K1823 | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-2569` | Membrana de DIFUZIE pentru acoperișuri | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-2576` | Plasă de armare | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |
| `f3d-2583` | Colțar PVC | brand "Fatade3D" is a name W17-02 refuses on a catalogue page; no brand line renders. |

### No brand assigned on the source (9)

The source assigns no brand term, so no brand line renders.

| Record | Product | What |
|---|---|---|
| `f3d-1879` | Polistiren expandat EPS-50 | EPS-70 | EPS-80 | EPS-200 | the source assigns no brand; no brand line renders. |
| `f3d-1924` | Polistiren expandat STOP FIRE | the source assigns no brand; no brand line renders. |
| `f3d-2400` | Meșterul Dibaci Universal - Adeziv pentru plăci ceramice | the source assigns no brand; no brand line renders. |
| `f3d-5591` | Mesterul dibaci POLISTIREN | the source assigns no brand; no brand line renders. |
| `f3d-5595` | Mesterul dibaci VATĂ MINERALĂ | the source assigns no brand; no brand line renders. |
| `f3d-1992` | Diblu din plastic LTX | the source assigns no brand; no brand line renders. |
| `f3d-2007` | Diblu din oțel LGX | the source assigns no brand; no brand line renders. |
| `f3d-2475` | Tencuială decorativă siliconică STICKY | the source assigns no brand; no brand line renders. |
| `f3d-5405` | Lampă K2146 | the source assigns no brand; no brand line renders. |

### No price published on the source (1)

The card asks for a price instead, which is the one case W24-R3 leaves the W22-01 phrase.

| Record | Product | What |
|---|---|---|
| `f3d-3925` | Placă Veil Dark Grey | the source publishes no price ("/ bucata"); the card asks for one instead. |

### A range whose lower bound is 0,00 (1)

Stored whole, renders the non-zero bound alone, as the dispatch directs.

| Record | Product | What |
|---|---|---|
| `f3d-1924` | Polistiren expandat STOP FIRE | the source range starts at 0,00; stored whole, only 110,00 renders. |

### A RU card with no variant line (9)

The RU card renders no variant line.

| Record | Product | What |
|---|---|---|
| `f3d-2021` | Klebespachtel 100R - Adeziv de armare polistiren și vată | the RU source card shows no variant line. |
| `f3d-2025` | Kleber 90R Adeziv lipire polistiren | the RU source card shows no variant line. |
| `f3d-2031` | Mortar universal Caparol ArmaReno 700 | the RU source card shows no variant line. |
| `f3d-2368` | Adeziv Kreisel 215 | the RU source card shows no variant line. |
| `f3d-2377` | Adeziv Baumit - Bianco Alb | the RU source card shows no variant line. |
| `f3d-2386` | Adeziv DuoContact Baumit | the RU source card shows no variant line. |
| `f3d-2393` | Baumit Pro Contact - Adeziv și Masă de Șpaclu | the RU source card shows no variant line. |
| `f3d-2406` | CERESIT CT 82 - Mortar adeziv și masă de șpaclu pentru polistiren | the RU source card shows no variant line. |
| `f3d-1992` | Diblu din plastic LTX | the RU source card shows no variant line. |


### No variant line on the source card (88)

These are the plates whose `/produs/<slug>/` URL answers HTTP 301 to a parent product with
a colour query string, so they never render in a category loop and have no card to read a
variant line from, plus the 27 plates on the source's newer card template, which emits no
`div.product-attribute` at all. Their names, brands and prices are the Store API's, which
is where every other record's are too. Listed by id in `source`; not tabulated here
because the reason is the same for all 88.

### No RU product on the source (37)

W24-R9: where no RU string exists, the RO proper name is reused and **every such key is
listed**. These 37 records carry `name.ru` equal to
`name.ro`, and `source.ru_name` is null so the reuse is never mistaken for a translation.

- `f3d-5591` Mesterul dibaci POLISTIREN
- `f3d-5595` Mesterul dibaci VATĂ MINERALĂ
- `f3d-6117` 35 Piece Stone
- `f3d-6120` Rough Surface
- `f3d-6134` Stone Alpes
- `f3d-6140` Oceanic Travertine
- `f3d-6145` Skyline
- `f3d-6149` Rome Travertine
- `f3d-6155` Ghana Travertine
- `f3d-6157` Concrete Pouring Slab
- `f3d-6163` Mount Celestial
- `f3d-6170` Marble
- `f3d-6175` Polished Concrete Wall
- `f3d-6188` Rusty Slab
- `f3d-6192` Polish Concrete Wall
- `f3d-6196` Devine Mushroom Stone
- `f3d-6199` Sawtooth Wood
- `f3d-6204` Original Wood
- `f3d-6207` Spliced Wood
- `f3d-6209` Rope Wave B
- `f3d-6211` Polished Wood 4.0
- `f3d-6214` Stackle Square 4.0
- `f3d-6216` Poly Wood
- `f3d-6218` Rammed Earth Wall
- `f3d-6221` Polished Stone
- `f3d-6223` Oman Linear Stone
- `f3d-6225` Chiseled Stone
- `f3d-6228` Bush Hammered
- `f3d-6231` Stone Ridged
- `f3d-5395` Lampă K1247
- `f3d-5405` Lampă K2146
- `f3d-5417` Lampă K2880
- `f3d-5428` Lampă K2088L
- `f3d-5432` Lampă K2222
- `f3d-5437` Lampă K2841
- `f3d-5440` Lampă K2842
- `f3d-5444` Lampă K1823

## 6. How RO was matched to RU

| Method | Products | Confidence |
|---|---|---|
| The WPML language switcher on the RO product page | 125 | certain, a server-rendered translation link |
| A unique first-image `src`, inside the ceramic plate categories only | 61 | high: a closed 61 against 61 pool, every match unique, none left over, and every pair name-consistent after stripping the leading noun |
| No RU product exists | 37 | certain, the switcher block is absent, which is how WPML renders an untranslated post |
| **Total** | **223** | |

**No RU name was invented.** The 37 with none carry the RO proper name under W24-R9 and
are listed in section 5.

## 7. Oddities read successfully, recorded so a later card does not rediscover them

- **Ten names are used by two products each**, twenty products in all. Every record is
  keyed on `id`. A card's quote button must carry something more than the name or two
  different products send an identical lead line.
- **Five names carry a capitalisation typo on the source**, `PLacă` rather than `Placă`:
  `f3d-4853`, `f3d-4864`, `f3d-4875`, `f3d-4886`, `f3d-4897`. Stored and rendered
  verbatim, because "exactly as shown" is what the dispatch asks for. Q-W24-03 asks
  whether to correct them.
- **RO and RU key their cards off different attributes.** `f3d-3283` shows
  `10 mm, 20 mm, ... 100 mm` in RO and `1000x500x30 мм` in RU. Each locale's line is
  copied as that locale shows it and the two are never reconciled.
- **`f3d-5437` has the numeric slug `5437`** on the source.
- **Three products sit in two categories each** (`f3d-2076`, `f3d-2085`, `f3d-2532`, all
  in both paint subcategories). Each has one record and one photo slot, and appears in both
  lists.

## 8. What is not in this repo

No image. No logo. No stylesheet, script or font from the source. `git diff --stat` on
this card adds no binary file at all. The raw captures live outside the repo, in this
session's scratch directory, and are not committed.

## 9. The price, as the source prints it

**AMENDED by W24-04.** The first draft of these records recomposed the price from its
lower and upper bounds and printed `129,00 lei`. The source prints
`129,00 lei / m`. **100 of the 223 products state a unit after the figure**, 57 per
linear metre, 41 per piece and 2 per square metre, and a price printed without its unit
is a different price: a decorative element sold at 129 lei the metre read as 129 lei the
element.

So `price.render` is now the source's own display string, per locale, with two things
done to it and nothing else:

- the en dash between the two ends of a range becomes a plain hyphen, which is the same
  transform section 4 records for names, and
- a range whose lower bound is `0,00` renders its non-zero end alone, which the dispatch
  directs. One product, `f3d-1924`.

`price.min`, `price.max` and `price.source_display` keep the values as the API and the
card gave them, untouched, beside it.

### Where the two locales disagree, and why they are not reconciled

The source disagrees with itself on some records, and each locale is copied as that
locale prints it rather than being made to agree:

- `f3d-3004` and the rest of the decorative elements print `129,00 lei / m` in RO and
  `129,00 lei` in RU. The RU card states no unit.
- `f3d-4686` prints `/ bucata` in RO and `/ м2` in RU.
- `f3d-1924` prints a `0,00` lower bound in RO and `1,00` in RU, so RO renders
  `110,00 lei` under the zero-bound rule and RU renders `1,00 lei - 110,00 lei`.

**37 of the 222 priced products have no RU price display on the source**, because they
have no RU product at all. Each reuses the RO string, which is the same W24-R9 treatment
their names get, and `price.source_display` is the RO one for both. They are the same 37
records listed in section 5.

### One product has no price at all

`f3d-3925` Placă Veil Dark Grey. The source publishes no figure for it. Its card asks for
a price instead, which is the one case W24-R3 leaves the W22-01 phrase.

## 10. The variant line is present in one locale only on 80 records

19 records show a variant line in RO and not in RU, and 61 the other way round. This is
the source's own asymmetry, not a rendering choice: the 61 are the ceramic plates whose
RO page answers HTTP 301 and therefore never renders a card to read a line from, while
their RU counterparts do render one. The effect on the site is visible and worth stating
plainly: **`/catalog/placi-ceramice/` shows no variant line on any card and
`/ru/catalog/placi-ceramice/` shows one on 61 of 88.**

Nothing is invented to close the gap. A variant line is mostly dimensions, and writing a
Romanian one from the Russian card would be authoring a specification for a product this
repo has never seen.
