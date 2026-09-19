# W23-01 · Photo batch 2 intake: inventory, strip, review, map, provenance

| | |
|---|---|
| Dispatched | Wave 23, 2026-09-18 |
| Source | `/Users/ivan/RC-pics_2nd batch` (read only, never modified) |
| Rulings in force | R-W as amended 2026-09-18 (client-supplied originals), Q-SUPPLIERS |

## What the card asks

Inventory every file (name, dimensions, bytes, sha256), strip EXIF, convert through the
site's existing pipeline to its formats and sizes, map each file to a slot in
`docs/assets/PENDING-PHOTOS.md`, and add provenance rows.

**Report:** mapped, unmapped, and any file showing a house number, a licence plate, or a
face other than in `echipa.jpeg`, flagged not published.

## Acceptance

1. Zero GPS tags in every committed image, read by exiftool.
2. `node scripts/check-asset-provenance.js` exit 0.
3. Every committed image has a provenance row.
