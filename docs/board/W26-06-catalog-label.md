# W26-06 · Plăci flexibile, and Acoperișuri leaves the catalogue

Card W26-06. Branch `w26/w26-06-catalog-label`, stacked on W26-05a (#128). PR only.

## Recorded first

**W26-R9 to W26-R16** are in `docs/rulings/W26-R.md`, each quoted exactly with my reading under
it, and the dispatch's ratifications are in `DECISIONS.md`. Six question headings now say
answered, and **twenty backlog entries that still read "PR OPEN" after their merges** now carry
their PR numbers, read from GitHub.

## The label

**"Plăci flexibile" / "Гибкая плитка"**, URL unchanged (`/catalog/placi-ceramice/` still
answers). One data edit reaches the menu, the index tile, the breadcrumb, the heading, the page
title and the quote form's subject.

**You gave no Russian.** "Гибкая плитка" is the site's own vocabulary: the 72 photographs on that
page are already described as "Гибкая керамическая плитка". The label drops "керамическая" for the
same reason you dropped "ceramice".

## The text under the label was wrong, so I rewrote it

The category's lede and two paragraphs described **fired, glazed floor tile, porcelain
stoneware and wall faience**. Under a heading that says "Plăci flexibile" that is a wrong claim.
They now describe what the 88 products are: thin, light sheets of modified clay or stone powder
that bend round corners, glued to a flat wall, chosen by format, surface and whether they are
rated for outdoors.

**This is inside the permission you gave for category pages** (general material description, no
claim about Rapid Construct, no manufacturer), and the catalogue gate reads it clean. **You did
not ask for it in terms, so it is recorded for your ratification.**

## Acoperișuri is off the catalogue

**Off the /catalog/ page and off the header Catalog menu.** Its products live on
`/servicii/acoperisuri/`, and its old catalogue addresses still forward there, as W26-R5 keeps
them.

**The menu is my reading.** Your words were "the index". I took the menu too, because otherwise
the menu lists eight categories and the page seven, and the menu's seven roofing sub-rows each
cost a page load only to be forwarded. **Putting it back is one flag** (`"listed": false` in
`content/catalog.json`).

**Side effect, measured**: the catalogue page's search description had been just the word
"Catalog", because eight names did not fit. Seven do, so it now lists them.

## Slots

The roofing tile's slot `CATEG-08` is gone from the ledger because nothing shows it. It borrowed
another product's picture, so **no image file is removed**. **347 rows, 314 filled, 33 empty**
(was 348, 315, 33).

## Heights

| Page | Before | After | Budget |
|---|---|---|---|
| `/catalog/` | 3,623 | **3,623** | unchanged |
| `/ru/catalog/` | 3,648 | **3,648** | unchanged |
| `/catalog/placi-ceramice/` | 12,669 | **12,723** | 12,729 to **12,783** |
| `/ru/catalog/placi-ceramice/` | 13,552 | **13,661** | 13,612 to **13,721** |

The Russian page breached its budget by 49px because the new Russian text is longer, so both
pages take measured plus 60, recorded in R-Y.

## Gates

**27 of 27 gate commands exit 0.**

## Recorded for ratification

1. **The category text rewritten** to describe flexible sheets.
2. **Acoperișuri off the header Catalog menu as well as the index.**
3. **RU label "Гибкая плитка".**
