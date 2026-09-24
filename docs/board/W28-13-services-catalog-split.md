# W28-13 · Services versus catalog

Card W28-13. Branch `w28/w28-13-services-catalog-split`, stacked on W28-12 (#170). Under the wave
28 dispatch.

## What this card does

- **The roofing products are in the Catalog now.** The whole roofing catalogue (the product tiles,
  the filter buttons with their counts, the four "Compară" tables and all 99 product cards with
  their prices) renders on `/catalog/materiale-acoperis/` in both languages, which is where the
  Catalog's "Acoperișuri" tile and the header's Catalog menu already lead.
- **The Acoperișuri service page is about the work.** It keeps its four navigation tiles, the
  hero, "Ce include", the four roofing works, the project photographs, the FAQ and the quote form,
  and gets six link cards ("Țiglă metalică", "Tablă cutată", "Țiglă ceramică", "Șindrilă
  bituminoasă", "Sisteme pluviale", "Accesorii de acoperiș"), each opening its group in the
  Catalog. No price is left on it.
- **The Garduri service page** already had no prices; it gets one link card, "Modele de garduri",
  to the fence models page, which is unchanged (8 models with prices).
- **Every old address still works**: the seven old catalogue sub-pages redirect into the right
  group on the catalogue page; no product page moved.
- **A new gate holds the counts**: 99 roofing cards, 9 tiles, 7 filters, 8 fence cards, both
  languages, and no price on a service page.

## What to look at

- `https://rapidconstruct.md/servicii/acoperisuri/`: no product grid, no prices; below the four
  roofing works, six cards under "Catalog / Acoperișuri"; click "Sisteme pluviale", the Catalog
  page opens on that group with the filter pressed.
- `https://rapidconstruct.md/catalog/materiale-acoperis/`: the tiles, then the filter bar
  ("Toate 99"), the compare tables and the cards with prices.
- `https://rapidconstruct.md/servicii/garduri/`: one card, "Modele de garduri", above the FAQ.
- Same three in Russian under `/ru/`.

## One reading for you to confirm

The four "Compară" tables carry prices, and prices are refused in prose on catalogue pages. The
tables are the same product figures the cards show, so the gate now permits them on the roofing
catalogue page by their shape (and still refuses a price written in prose there). If you would
rather the tables stayed on the service page or went away, that is one line each way.

## Heights

Service page about 15,700px shorter; catalogue page about 15,200px taller; fence page 390px
taller. Six budgets move (R-Y).

## Gates

All 30 gate commands exit 0 locally (`node scripts/run-gates.js --keep-going`), including the
new gate 31. CI runs the full 30 on the pull request.
