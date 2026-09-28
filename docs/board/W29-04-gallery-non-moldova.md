# W29-04 · Garduri gallery: remove non-Moldova stock, audit all galleries

R-W29-04. Service gallery stock pictures must not show scenery that reads as non-Moldova, by seven hard criteria; close-up product shots with no scenery are allowed; no replacement from stock, the gaps stay until the owner supplies RC-own photographs. The fence gallery (`/servicii/galerie-garduri/`, RO and RU) loses the owner's seven (files 16 to 22) and keeps its twelve RC-own photographs and three stock pictures (13, 14, 15). Every other gallery is audited against the criteria and its offenders removed the same way. Stacked on W29-01, which lands first.

## Reading

- "Service gallery" is every gallery in `content/galleries.json` (eleven); "stock" is `origin: "stock"`. Owner photographs are never candidates.
- "Remove" is the whole trace: full and thumb deleted from `public/`, the ledger entry and its alt in both locales dropped, the SOURCES row and both PROVENANCE rows deleted. No file is renumbered.
- The criteria are applied literally to what is in the frame; the words that needed a reading, and the borderline calls, are in `docs/rulings/W29-R.md` under R-W29-04 and asked as Q-W29-10 to Q-W29-12.
- The owner's Garduri list binds as written, including the gabion (20) and chain-link (21) close-ups, which meet no criterion.

## Acceptance

- `docs/reports/W29-04-REMOVED.md` committed, listing every removed path (50 files, 25 pictures) with its criterion and source URL, and per gallery the kept count.
- `node build.js && node scripts/check-gallery-removed.js` (the named test gallery-removed) exit 0; it exits 1 on the build of the card's base before the change.
- `node scripts/check-gallery-preview.js` (gallery-preview-distinct) exit 0.
- `node scripts/check-viewport-320.js` exit 0.
- `node scripts/check-galleries.js`, `node scripts/check-image-sources.js`, `node scripts/check-asset-provenance.js` exit 0.
- Screenshot of `/servicii/galerie-garduri/` (RO) after the change: `docs/audits/w29-04/servicii_galerie-garduri.jpg`.
