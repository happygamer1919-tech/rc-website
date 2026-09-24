# W28-24 · Service galleries: ten stock pictures more per gallery, two new galleries, the examples heading

Card W28-24. Branch `w28/w28-24-service-galleries`, stacked on W28-23. Under R-W28-07.

## What this card does

Eleven galleries (the nine service pages plus copertine and the fence gallery page) gain ten
stock pictures each after the owner's own (fifteen on fatade); industrial and proiectare-3d, which
had none, gain a gallery of ten. Subjects match the service. The pictures come from the allowed
set, are viewed for marks, text, livery and faces, encoded to WebP full and thumb, and carry alt
text in both locales in `content/galleries.json` with their origin, source and licence. The
projects-and-gallery heading on the service pages becomes "Exemple de lucrări și soluții" /
"Примеры работ и решений" through a key of its own. The home page's Portofoliu section is untouched.

## Acceptance

- `node scripts/check-galleries.js`: exit 0 with the new counts (acoperisuri 25, case-la-cheie 12,
  fatade 19, finisaje 15, instalatii 15, terasamente 26, reparatii 37, copertine 12,
  galerie-garduri 22, industrial 10, proiectare-3d 10).
- The heading string present on every service page in both locales (rendered DOM).
- `node scripts/check-image-sources.js`: exit 0.
- Lighthouse desktop, median of three, performance at or above 90 on all 18 service pages,
  recorded in `docs/reports/W28-FINAL-RUN-2.md`.
