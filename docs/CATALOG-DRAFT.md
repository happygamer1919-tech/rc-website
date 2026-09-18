# Catalogue draft, not rendered

Card W23-05, drafted 2026-09-18. **Nothing here is on the site**, and nothing here is
ready to be: this is a draft for the owner to complete or reject, in the shape
`docs/CATALOG-PRODUCT-FORM.md` prescribes.

**Rules this draft was written under.** Products may come only from the 20 brands the
client named (`docs/client-answers/2026-09-18-supplier-checklist.md`). Every value is
taken from a manufacturer's own public page and carries **its source URL**. No price
anywhere, trade, wholesale or retail (R-Z): the price field is the ruled string
**"Preț la cerere" / "Цена по запросу"** (W22-01). Nothing was invented, and where a
value is not published, the row says so instead of filling it.

## The result in one line

**No category reaches three records. Three candidate records exist in two of the seven
categories, and none of the three is complete under the form.**

| Category slug | Candidate records | Complete under the form | Short of three by |
|---|---|---|---|
| `termoizolatie` | 2 | 0 | 1 candidate, and both need their Russian values |
| `vopsele` | 1 | 0 | 2 candidates, and it needs its Russian values |
| `tencuieli-decorative` | 0 | 0 | 3 |
| `placi-ceramice` | 0 | 0 | 3 |
| `elemente-decorative` | 0 | 0 | 3 |
| `sisteme-iluminare` | 0 | 0 | 3 |
| `alte-materiale` | 0 | 0 | 3 |

## The candidates

Each block is the form's nine lines. A line reading **NOT PUBLISHED** is a question for
the manufacturer or the distributor, never a value to guess.

### termoizolatie 1

```
category slug   : termoizolatie
id              : knauf-unifit-035
name, Romanian  : Unifit 035
name, Russian   : NOT PUBLISHED on a Russian manufacturer page; translation to be confirmed
manufacturer    : Knauf Insulation
pack, Romanian  : rolă de 1.200 mm lățime, 6,00 m² pe rolă la grosimea de 100 mm
pack, Russian   : NOT PUBLISHED; translation to be confirmed
spec, Romanian  : conductivitate termică λ 0,035 W/mK
spec, Russian   : NOT PUBLISHED; translation to be confirmed
```

| Value | Source |
|---|---|
| name, manufacturer, pack, spec | https://knauf.com/ro-RO/p/produs/unifit-035-23911_4222 (read 2026-09-18: rolls 1.200 mm wide, 6,00 m²/roll at 100 mm, and the other thicknesses; λ declared 0,035 W/(mK)) |

**Note read on the page, and not resolved here:** the page shows λ = 0,032 W/mK in one
place and 0,035 W/(mK) in its technical data. The draft carries 0,035, which is the
product's own name, and the discrepancy is flagged rather than averaged.

### termoizolatie 2

```
category slug   : termoizolatie
id              : rockwool-frontrock-md
name, Romanian  : Frontrock MD
name, Russian   : NOT PUBLISHED on a Russian manufacturer page; translation to be confirmed
manufacturer    : ROCKWOOL
pack, Romanian  : NOT PUBLISHED on the manufacturer's product page
pack, Russian   : NOT PUBLISHED
spec, Romanian  : conductivitate termică declarată λ 0,035 W/m·K (EN 12667)
spec, Russian   : NOT PUBLISHED; translation to be confirmed
```

| Value | Source |
|---|---|
| name, manufacturer, spec | https://www.rockwool.com/ro/produse/frontrock-md/ (read 2026-09-18) |
| pack | **not on that page.** The manufacturer publishes packaging in its technical data sheets; the value must come from the sheet for the exact thickness, or from the distributor in writing |

### vopsele 1

```
category slug   : vopsele
id              : caparol-muresko-plus
name, Romanian  : Muresko-plus
name, Russian   : NOT PUBLISHED on a Russian manufacturer page; translation to be confirmed
manufacturer    : Caparol
pack, Romanian  : găleată de 2,5 l, 10 l sau 15 l
pack, Russian   : NOT PUBLISHED; translation to be confirmed
spec, Romanian  : consum aproximativ 140 ml/m² pe strat, pe suprafețe netede
spec, Russian   : NOT PUBLISHED; translation to be confirmed
```

| Value | Source |
|---|---|
| name, manufacturer, pack, spec | https://www.caparol.ro/produse/vopsele/vopsele-lavabile-exterior/vopsele-de-dispersie/muresko-plus (read 2026-09-18) |

**Caparol is also the one brand whose media terms permit a trade partner to use its
product images** (`docs/SUPPLIER-LICENCE-SCAN.md`), so this is the only candidate that
could have a picture without a new permission first.

## The four categories with no candidate at all, and why

| Category | Why nothing was drafted |
|---|---|
| `tencuieli-decorative` | Baumit and Caparol both make decorative renders, and Baumit's Romanian product page for the obvious candidate could not be reached on 2026-09-18 (HTTP 404 at the expected address). Every consumption figure found came from **retailers**, not the manufacturer, so none was used |
| `placi-ceramice` | **none of the 20 brands makes ceramic tiles.** The list is roofing, insulation, renders, paints and cement, plus two Moldovan retailers |
| `elemente-decorative` | same: no brand on the list publishes a decorative-element product line |
| `sisteme-iluminare` | same: **no lighting brand is on the list** |
| `alte-materiale` | candidates exist in principle (Holcim/Lafarge cement, a TechnoNICOL membrane), but no value was taken from a manufacturer page in this card, so nothing is drafted rather than half-drafted |

## What every record still needs before it can ship

1. **The Russian values.** No manufacturer on this list publishes a Russian product page
   for the Moldovan market, so the Russian name, pack and specification are the owner's
   to confirm. A translation written here would be a value with no source, which this
   card forbids.
2. **The missing pack figure** for Frontrock MD.
3. **The λ discrepancy** on the Knauf page resolved, by the distributor or the technical
   sheet.
4. **A decision on which products you actually stock**, per category. Three per category
   is the threshold the form recommends before a category's section is switched on.

## What it would look like on the site

Each record becomes one card: the product name, the manufacturer, the pack or coverage,
one specification, and a button reading **"Preț la cerere"** (RU: **"Цена по запросу"**)
that opens the page's quote form with that product's name in the hidden field. No price,
no stock, no availability, and no image until a licence exists for it.

**Nothing in this file is rendered.** `content/catalog-products.json` is untouched and
still holds seven empty arrays, so the catalogue pages are exactly as they were.
