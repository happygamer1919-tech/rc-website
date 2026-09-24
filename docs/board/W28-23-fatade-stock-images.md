# W28-23 · Fatade product images: the 110 fatade3d.md pictures replaced by generic stock photographs

Card W28-23. Branch `w28/w28-23-fatade-stock-images`, stacked on W28-R2. Under R-W28-06.

## What this card does

Every catalogue picture that was fetched from fatade3d.md (110 of the 223 fatade-group records:
64 RED mouldings, 25 lamps, 21 material packshots; three carry the FATADE print, eleven a maker's
brand) is replaced by a generic, mark-free stock photograph of its product type from the allowed
set (Pexels, Unsplash, Pixabay, Wikimedia Commons CC0 or public domain), one origin slot per type
and `reuse_of` on the rest, encoded to WebP at most 1600 wide, with alt text in both locales
written by the viewer that accepted the picture. Specs, prices and names do not change. The 113
manufacturer and owner-picked packshots stay (Q-W28-05). `docs/images/SOURCES.md` is written for
every picture installed; gate 32 flips to "no fatade-group picture from fatade3d.md, every stock
picture licensed from the allowed set, the packshots counted".

## Acceptance

- `node scripts/check-image-sources.js`: exit 0.
- `docs/reports/W28-FATADE-IMAGES-2.md` lists all 223 fatade-group records with old file, new
  file, source and licence.
- Rendered DOM of every catalogue page, both locales: no product image file name or alt contains
  `fatade3d`, `fatade 3d` or `FATADE`.
- `node scripts/run-gates.js --keep-going`: every command exit 0.
