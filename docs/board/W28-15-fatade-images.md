# W28-15 · Fatade images: plain product photographs instead of posters, tables and overlays

Card W28-15. Branch `w28/w28-15-fatade-images`, stacked on W28-14 (#172). Under the wave 28
dispatch.

## What this card does

- **66 catalogue pictures replaced** by the plain photograph the product's own fatade3d.md page
  publishes: the 50 facade mouldings that showed a render with the product code and dimensions
  burned in, 14 products that showed a parameter table, 2 that showed a flyer. Every new file came
  through the repo's own intake (never upscaled, metadata stripped), and every one was looked at
  twice by independent viewers, the second time with the instruction to find fault.
- **44 pictures kept**: they were already plain photographs (a sack or bucket whose printed label is
  the maker's own is a photograph of the product).
- **None left without a photograph**: every one of the 110 pages publishes a plain picture.
- **The report** `docs/reports/W28-FATADE-IMAGES.md` lists all 110 (old image, new image, status,
  source URL) with a reviewer checklist, and the new gate 32 holds every fatade3d picture to its
  fatade3d.md page and file.

## One thing to confirm (Q-W28-03)

Three flexible-plate pictures show a different colour of the same family than the product they are
filed under (Elsa Black Grey, Sandstorm, H06). A wrong colour is not a poster, so they stay; the
right-colour picture exists on each family page and is one small card.

## What to look at

`https://rapidconstruct.md/catalog/elemente-decorative/`: the moulding cards show the element alone,
no code or figures in the picture. `https://rapidconstruct.md/catalog/termoizolatie/`,
`/catalog/vopsele/`, `/catalog/sisteme-iluminare/`: the products that showed a specification table
now show the product.

## Heights

None move.

## Gates

All 31 gate commands exit 0 locally (`node scripts/run-gates.js --keep-going`), including the new
gate 32. CI runs the full 31 on the pull request.
