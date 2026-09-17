# Catalog product form

**This is the form to fill in from a supplier's answer.** Card RC-152 (W22-03). It
is the only thing standing between the catalogue pages and their product cards: the
structure, the quote wiring, the gates and the image request list were all built in
wave 21 (RC-149, RC-150) and are waiting for this.

**Nothing on this page is a product.** No product was looked up, remembered or
invented to write it, and none may be added to it from anywhere but a supplier's own
answer. `docs/QUESTIONS.md` Q-W21-01 records why the list is empty: the only products
any file in this repo records belong to three other companies.

**When the form is filled**, the values go into `content/catalog-products.json`, one
block per product under its category slug, and the cards appear on the next build. The
supplier image requests (`docs/assets/CATALOG-IMAGE-SLOTS.md`) generate themselves from
the same data.

---

## 1. The fields, per product

Nine values per product. Six of them are one value per language, so **a product is not
complete until both languages are written**; the build refuses a half-translated record.

| # | Field | Languages | What it is | Rules |
|---|---|---|---|---|
| 1 | `id` | one, ASCII | a short handle for the product, used in the image file name | lowercase letters, digits and hyphens; unique inside its category |
| 2 | `name` RO | Romanian | the product name as the supplier writes it | no marketing words around it |
| 3 | `name` RU | Russian | the same product name in Russian | the supplier's own Russian name where one exists |
| 4 | `manufacturer` | one, both languages read it | who makes it | **not** Dasterum, Imperlux or Fațade 3D: the build and the gate both refuse those three |
| 5 | `pack` RO | Romanian | pack size **or** coverage: how it is sold, or how far one unit goes | a quantity and a unit, for example a volume, a weight, an area per unit |
| 6 | `pack` RU | Russian | the same | |
| 7 | `spec` RO | Romanian | **one** key specification, the one a buyer chooses on | one fact, not a list |
| 8 | `spec` RU | Russian | the same | |
| 9 | category | — | which of the seven catalogue categories it belongs in | the slug list is in section 5 |

### Never in a record

A price. A currency. A discount. A stock level. An availability or lead time. A
warranty claim. A superlative. A capability claim about Rapid Construct. A product
image file (images are requested separately, section 6).

The card's button reads **"Preț la cerere"** / **"Цена по запросу"** and is the only
price wording allowed on these pages (ruling W22-01). Everything else is refused by
`scripts/check-catalog-pages.js`, on the built page, before it can ship.

---

## 2. The minimum viable record

**All nine values.** There is no shorter version: the build refuses a record whose
name, pack or specification is not real in **both** languages, and refuses a record
with no id or no manufacturer. A record that is missing one value does not render as a
partial card; it fails the build, on purpose, so a half-filled form cannot reach a
visitor.

What is **not** needed for a card to appear:

- an image (the card renders without one; nothing occupies the space),
- a subcategory,
- a second specification,
- anything about price, stock or delivery.

---

## 3. A page with fewer than three records

**Measured**, on a test build at 1280px: the cards sit in the same three-column row the
project cards use, so

| Records on a page | What a visitor sees |
|---|---|
| 0 | **no section at all**: no heading, nothing. The page is exactly as it is today |
| 1 | the heading, then one card at the left of the row, with two thirds of the row empty |
| 2 | the heading, then two cards, with one third empty |
| 3 | a full row |
| 4 to 6 | a full row, then the remainder on a second row, the same way the portfolio grid wraps |

**The decision to make, and it is yours.** Three options, and none of them needs code
that is not already there:

- **(a) Publish whatever exists.** A category with one product shows one card. Honest,
  and it looks unfinished at desktop width.
- **(b) Hold a category back until it has three.** The section stays absent, as today,
  until the third record lands. Recommended: a row of three is the shape every other
  grid on the site uses, and an empty two-thirds reads as a page still being built.
- **(c) Fill short rows with the categories' own subcategory names** instead of
  products. Not recommended: a subcategory is not a product, and the card's fields
  (manufacturer, pack, specification) have nothing to hold.

**Default until you say otherwise: (b).** It costs nothing to change later: it is the
difference between writing two records into the file and writing three.

---

## 4. The form, one block per product

Copy this block once per product and fill every line. Leave nothing blank: a line you
cannot answer is a question for the supplier, not a value to guess.

```
category slug   : ...........................   (from section 5)
id              : ...........................
name, Romanian  : ...........................
name, Russian   : ...........................
manufacturer    : ...........................
pack, Romanian  : ...........................   (pack size or coverage)
pack, Russian   : ...........................
spec, Romanian  : ...........................   (one key specification)
spec, Russian   : ...........................
```

---

## 5. The seven categories, and how many records you want in each

| Category | Slug | Records wanted |
|---|---|---|
| Sisteme de termoizolație | `termoizolatie` | |
| Tencuieli decorative | `tencuieli-decorative` | |
| Plăci ceramice | `placi-ceramice` | |
| Elemente decorative | `elemente-decorative` | |
| Vopsele | `vopsele` | |
| Sisteme de iluminare | `sisteme-iluminare` | |
| Alte materiale de construcții | `alte-materiale` | |

**How many records each category has now is not written here.** It lives in
`content/catalog-products.json`, and `docs/assets/CATALOG-IMAGE-SLOTS.md` prints the
live count per category every time it is generated. A count copied into a second
document is how the stub count drifted for thirteen waves (RC-148); this form states
what is wanted, never what is.

---

## 6. What happens after the form comes back

1. **The records go into `content/catalog-products.json`**, in the shape its `_note`
   describes. The build refuses anything incomplete.
2. **The cards appear.** Each one's button carries its own product name into the quote
   form's hidden field, so a lead says which product it is about. That path is already
   proven: 12 of 12 submissions in the RC-149 acceptance.
3. **The image requests generate themselves.** `docs/assets/CATALOG-IMAGE-SLOTS.md`
   lists one slot per product, with the brand, the category, the file names and the 4:3
   shape to ask the supplier for. Until an approved image arrives, a card simply has
   none.
4. **Heights are re-measured and ruling R-Y is extended** by the card that ships the
   first records, which is the ratified deferral from wave 21.
5. **A real lead is sent by hand, one per language**, and confirmed to arrive: the
   standing rule at gate 13, since any card that touches a form carries it.
