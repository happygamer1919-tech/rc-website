# W25-09 · Dasterum's seven roofing categories, walked and copied

Card W25-09. Branch `w25/w25-09-dasterum-data`, stacked on
`w25/w25-08-manufacturer-packshots`. PR only, stops for the owner.

**Text data only. No Dasterum image enters the repo on this card**: that is W25-10, under
W25-R7. Every one of the 71 new products renders a grey placeholder.

## Walked against copied

| Dasterum category | Listed | **Copied** | Pictured |
|---|---|---|---|
| Țiglă metalică | 4 | **4** | 0, W25-10 |
| Profnastil, tablă cutată | 8 | **8** | 0, W25-10 |
| Hidroizolație, barieră de vapori | 22 | **22** | 0, W25-10 |
| Sistem de scurgere | 14 | **14** | 0, W25-10 |
| Elemente suplimentare | 19 | **19** | 0, W25-10 |
| Elemente de siguranţă | 3 | **3** | 0, W25-10 |
| Elemente de fixare | 6 | **6** | 0, W25-10 |
| **Listings** | **76** | **76** | |
| **Distinct products** | **71** | **71** | |

**Nothing was skipped and no category was empty or 404.** The five-listing gap is three
products that Dasterum files under two categories each; they are one record with two
category memberships, not three dropped rows.

**Every category was read in full.** The listing is paginated at 24 and every one of the
seven is under that, checked by asking for 200 per page and getting the same count back.

## Where the pages live, and why the URL is not `/catalog/acoperisuri/`

Seven subcategory pages and their parent, on the W24 catalogue template: quote button and
no cart, no prices in prose, nine cards then a reveal on a phone.

**The parent is `/catalog/materiale-acoperis/`, not `/catalog/acoperisuri/`.** `acoperisuri`
is the slug of the existing service page, and `build.js` refuses a category slug that
collides with a service or product slug, because one page would write over the other
silently. **The label a visitor sees is "Acoperișuri"**; only the URL segment differs.
**Every existing URL is untouched**, including `/servicii/acoperisuri/` and
`/servicii/tigla-metalica/`.

| Page | URL |
|---|---|
| Acoperișuri | `/catalog/materiale-acoperis/` |
| Țiglă metalică | `/catalog/materiale-acoperis/tigla-metalica/` |
| Profnastil, tablă cutată | `/catalog/materiale-acoperis/profnastil/` |
| Hidroizolație și barieră de vapori | `/catalog/materiale-acoperis/hidroizolatie/` |
| Sistem de scurgere | `/catalog/materiale-acoperis/sistem-de-scurgere/` |
| Elemente suplimentare | `/catalog/materiale-acoperis/elemente-suplimentare/` |
| Elemente de siguranță | `/catalog/materiale-acoperis/elemente-de-siguranta/` |
| Elemente de fixare | `/catalog/materiale-acoperis/elemente-de-fixare/` |

Both locales, so sixteen pages.

## Linked from where the dispatch asks

`/servicii/acoperisuri/` and `/servicii/tigla-metalica/` each gain one link to the new
category. Both reuse `.link-arrow` deliberately: **rule 3.1 says a new class prefix is a
risk, and this needs no new block**. The label and the href both come from
`content/catalog.json`, through one helper that **dies rather than guessing** if the slug is
not in the file, because a silently missing link is the orphan the helper exists to prevent.

## The prices, under W25-R8

**The current public price only.** Dasterum's markup carries three price things: a
`meta itemprop="price"` with the current figure, an `old-price` span, and a `-28%` sticker.
**Only the first is read.** Six of the 76 listings carry a discount badge and an old price,
and neither was copied: `Țiglă metalică Monterrey` shows "De la 110 lei" here and not the
152 it is discounted from, nor the -28%. R-X's gate holds the same line from the other side
and is green.

## The Russian text, and what was NOT invented

**Dasterum publishes no Russian product page.** Its sitemap holds 11 `/ru/` URLs and not one
is a product; every `/ru/<slug>/` for these 71 answers 404, checked on all of them.

So the dispatch's fallback applies exactly as written: **the product name is kept, verbatim,
in both locales, and no copy is invented.** A Russian visitor sees "Membrana superdifuză
DACHMASTER 100 1,5m*50m", which is the name the supplier gives it, inside a Russian page
whose every other string is the catalogue's existing UI. Translating the generic noun would
be inventing copy, and the ruling forbids it. The same is true of the spec line.

**The category's own three paragraphs are new authored copy in both locales**, which is what
W17-02 permits on a category page and what `build.js` requires before one will build. They
are general trade knowledge about what a roof is made of, and they name no manufacturer and
make no claim about Rapid Construct.

## Dasterum is not a brand line

The 71 records carry **no brand**. Dasterum is the supplier, not the manufacturer, and
W17-02's own gate in `build.js` refuses the string outright. The supplier is recorded in
each record's `source`, which is where a provenance belongs, and no catalogue page prints
it.

## Height budgets, measured

Recorded in `docs/rulings/R-Y.md` with the measurement each came from. **Measured plus 60,
under W24-R4.** The parent page is 11,857px, the tallest page in the catalogue, which is
W24-R4's third standing exception: a catalogue grid's length is data.

**Two existing pages were re-measured with a control**, the same build with the two link
insertions removed: `/servicii/tigla-metalica/` grew by **39px** and takes 4,039 RO and
4,072 RU; `/servicii/acoperisuri/` **did not grow at all**, its section's bottom padding
absorbing the link, so its budget is untouched. A budget was raised only where a measurement
said to raise it.

## What this card adds to the ledger, and why here rather than in W25-10

**72 placeholder rows**: `CATEG-08` for the new hub tile and `CAT-0224` to `CAT-0294` for
the products. The dispatch puts the slots in W25-10, but `build.js` refuses to render a
placeholder whose slot has no ledger row, so the rows have to land with the pages that
render them. **They ship as `placeholder` and W25-10 fills them**, which is exactly the
split W24-01 designed.

## One thing the copy rule and the house style disagreed about

Dasterum writes some product names with an em dash: `DRIPSTOP — acoperire anticondens
pentru tablă profilată`. **This dispatch forbids an em dash or an en dash anywhere**, and it
also says to keep product names and invent no copy.

**Every word is kept and only the punctuation changed**, to a comma: `DRIPSTOP, acoperire
anticondens pentru tablă profilată`. 62 characters across 61 names and one ledger row. That
is the narrowest reading that satisfies both rules, and it is recorded rather than done
quietly.

## Gates

**22 of 22 exit 0**, from `node scripts/run-gates.js`. The catalogue index's marker in
`verify-live.js` goes from `catTiles: 7` to **8**, asserted rather than relaxed, so a build
made before this card cannot match it. Sixteen new rows in `PAGES`, each with its budget;
the self-check reads **67 pages**.

## Recorded for ratification

1. **The URL segment is `materiale-acoperis`**, because `acoperisuri` is taken. The label is
   unchanged.
2. **The RU product names are the RO strings verbatim**, per the dispatch, because Dasterum
   publishes no Russian product page.
3. **The 72 ledger rows land here rather than in W25-10**, because `build.js` will not
   render a placeholder without one.
4. **The records carry no brand.** Dasterum is the supplier; `build.js` refuses the name on
   a catalogue page under W17-02, and it lives in `source` instead.
