# W29-RUN · Wave 29, 2026-09-28

The run of the wave 29 dispatch and its addendum (W29-04). Self-merge on green per R-W29-00; every merge
followed by section 12.0 (`scripts/verify-live.js` against the merge sha on https://rapidconstruct.md).
Rulings: `docs/rulings/W29-R.md`. Board: `docs/board/W29-board.json`.

## Per card

| Card | What | PR | Merge | quality | Section 12.0 |
|---|---|---|---|---|---|
| W29-00 | The ruling register, R-W29-00 to R-W29-03 | #200 | `09c273a` | green 7m20s | EXIT 0, 15:38:24Z, 55 of 55 pages |
| W29-02 | Service cards fully clickable | #201 | `0098d17` | green 8m21s | EXIT 0, 15:58:21Z |
| W29-03 | Gallery preview reads as a button, never repeats a described picture | #202 | `00b260a` | green 8m42s | EXIT 0, 16:22:55Z |
| W29-01 | The catalogue on fatade3d.md's structure, pages and pictures | #203 | `1f1d647` | green 24m11s | EXIT 0, 18:34:48Z, 59 of 59 pages |
| W29-05 | The Alte produse tile shows the owner's photograph (owner message) | #204 | `5ddc703` | green 24m15s | EXIT 0, 19:10:20Z |
| W29-04 | Non-Moldova stock leaves the service galleries (addendum dispatch) | #205 | `697276c` | green 24m10s (after main merged in) | EXIT 0, 19:36:10Z |

Order worked: W29-02, W29-03, W29-01, as the dispatch set; W29-04 (the addendum) after W29-01 landed.

## Deviations, flagged, none ratified here

1. **Ruling ids.** The dispatch's "R-W28-04 and R-W28-06" both point at the recorded R-W28-06 (the fatade
   picture ruling the second wave 28 dispatch had called R-W28-04). The phone hero ruling R-W28-04 stands.
   Q-W29-01.
2. **Playwright and axe.** The repo has no dependencies and adds none without the owner. The named tests are
   zero-dependency Chrome DevTools scripts doing the same clicks and reads; "axe" is Lighthouse
   accessibility (the axe-core rule set) at 100 plus a nesting check. Q-W29-03.
3. **"Every other service card grid (services index)."** The site has no services index page; the home grid is
   the only card grid linking to service pages.
4. **Romanian plural.** "(25 de fotografii)", not "(25 fotografii)": Romanian needs "de" from 20.
5. **Fațade preview (W29-03).** Its preview was a second shot of the same facade as a project card, not the
   same file; replaced on that judgement. Terasamente's was the identical photograph. Acoperișuri's shows
   the same house as a project from another angle and was left.
6. **Hidden plates (W29-01).** fatade renders 27 plates; the 61 single-colour products its Store API lists are
   hidden there (each redirects to its parent with the colour preselected), so they left this catalogue.
   Q-W29-07.
7. **The supplier's name as text.** "FAȚADE 3D" is dropped from the name, URL and descriptions of "Colțar PVC"
   and from the Russian name of "Plasă de armare": docs/CLAUDE.md section 5 still refuses it as text on a
   catalogue page, and R-W29-01 lifts it for pictures only.
8. **No 301.** "Plăci flexibile" was only a label; the slug was already `placi-ceramice`, so no old URL exists
   to redirect.
9. **Menu position.** Acoperișuri and Garduri keep their places (2nd and 3rd, W27-R-21). Q-W29-05.
10. **Logos.** Shown where fatade prints one, never where the brand is withheld (`brand_hidden`: the 64
    RedConstruct elements under Q-W24-03, the unconfirmed plate makers under gate 23), and never the
    "Fatade3D" logo. Q-W29-06.
11. **Motion.** fatade's timing is reproduced; the travel is capped at 16px by section 1, and the header now
    animates, which section 1 excluded. Q-W29-08.
12. **Pictures by eye.** A celebrity advert on the Sisteme de termoizolație tile (Q-W29-04, recommend
    replacing), a marketplace watermark on one picture, manufacturers' phone numbers on two packs, faces on
    three Baumit labels, and fatade's RED-01 picture showing RED-06. Q-W29-09.
13. **Gate changes.** The R-X percent-off pattern reads "1-2%" as a range; the nav-contrast gate waits out the
    new menu animation; gate 32 reversed for R-W29-02; the catalogue page gate knows a product page; the
    provenance gate lifts fatade3d.md for `public/images/catalog/` only; catalog-counts extended.
14. **Two supplier phrases edited** in Russian descriptions ("Упаковка и наличие" to "Упаковка", a stock
    claim; "При наличии множественных трещин" to "Если трещин много", same meaning), logged with reasons.
15. **W29-05, owner message.** The "Alte produse" tile carried fatade's FATADE membrane; the owner supplied his
    own photograph (a plastic insulation dowel). The hub's "Alte materiale de construcții" tile showed the same
    membrane as a reuse; the owner named only Alte produse, so it keeps fatade's picture. Say so and it changes.
16. **W29-04, the Garduri list.** The owner's seven are files 16 to 22 of the fence gallery. Two of them (a gabion
    close-up and a chain-link close-up) meet no criterion and are the kind of close-up the ruling allows; they go
    because the owner named them. "The three jaluzele close-ups" match no stock picture: the three stock
    pictures left are a welded mesh panel, a steel palisade and an ornate cast-iron park fence. They stay
    (Q-W29-10).
17. **W29-04, borderline removals.** Eight removals rest on a reading of the criteria (a backyard polytunnel, an
    unreadable site sign, a sea horizon with no vegetation, an industrial building at a carport's edge, a
    street sign at a frame's edge, a timber-stud interior, factory sheds behind the industrial gallery's own
    subject, a timber barn). Q-W29-11. Eleven kept pictures match no criterion but may still read foreign
    (Q-W29-12).

## Motion, measured on fatade3d.md (headless Chrome, 2026-09-28) and shipped

| Element | fatade3d.md, measured | rapidconstruct.md, shipped |
|---|---|---|
| Catalog panel open (desktop) | keyframe fadeInUp, 0.3s ease-in-out, opacity 0 to 1, translateY 511px (100% of the panel) to 0 | 300ms ease-in-out, opacity 0 to 1, translateY 16px to 0 |
| Catalog panel open (mobile) | fadeInLeft, 0.3s ease-in-out, full-height drawer 360 wide, translateX -360px to 0 | the existing sheet under the header, same 300ms ease-in-out fade and 16px rise |
| Flyout open (desktop) | fadeInRight, 0.3s ease-in-out, translateX 330px to 0; top = row top (0 offset), left = list's right edge (0 offset), height 385 (Sisteme) and 196 (Vopsele); heading = the category's name | 300ms ease-in-out, translateX 16px to 0; top on the row (the row is its containing block), left at the list's edge, heading = the category's name |
| Flyout open (mobile) | fadeInRight 0.3s, covers the drawer from its top, back button | slides in from the right 16px at the tapped row's height (`--sub-top` from the row's offset), back button |
| Chevron | transform none before and after | points right, never rotates |
| Catalog button | all 0.3s ease-in-out, background red to near-black | unchanged (our orange to brand-dark) |
| Menu row hover | instant, background to red, text white | instant, our existing active row (brand) |
| Sub-category tile hover | all 0.3s ease; no visible change | 300ms ease: lift 4px, deeper shadow, border to brand, picture scale 1.03 |
| "Vezi produse" hover | all 0.3s ease-in-out, transparent with red text to red with white text | 300ms ease-in-out, outline brand-dark to filled brand-dark with white text |
| Product card hover | all 0.3s ease-in-out, shadow none to rgba(205,20,45,0.19) 3px 4px 20px | 300ms ease-in-out, our card lift and `--shadow-card-hover` (no new colour) |

Everything is off under `prefers-reduced-motion`. The full measurement: `docs/catalog/FATADE-MOTION-W29.json`.

## Products copied, per category and sub-category (fatade3d.md, 2026-09-28)

| Category | Sub-category | Products |
|---|---|---|
| Sisteme de termoizolație | Polistiren expandat | 5 |
| | Polistiren extrudat | 2 |
| | Vată minerală (TOP) | 5 |
| | Adezivi și mase de șpaclu | 11 |
| | Alte produse | 2 |
| Tencuieli decorative | | 13 |
| Plăci ceramice | | 27 |
| Elemente decorative | | 64 |
| Vopsele | Vopsele de exterior | 4 |
| | Vopsele de interior | 4 |
| Sisteme de iluminare | | 25 |
| Alte materiale de construcții | | 3 |
| **Total** | | **165 placements, 162 products** (Ultrapal, Isomat Flexcoat and Amphibolin sit in both Vopsele sub-categories) |

Each has a product page in both locales (324 pages). The full list with order, price and picture source:
`docs/catalog/FATADE-PARITY.json`; gate 39 (catalog-parity) holds the live catalogue to it.

## The four exceptions, confirmed

Gate 40 (catalog-images) hashes each file against its value on `main` before W29-01:

| Product | Picture | State |
|---|---|---|
| CT 80 F - Polistiren expandat | `public/img/catalog/CAT-0002.jpg`, the neutral EPS board render the site already showed, now its own slot file (not a reuse) | unchanged, sha256 4e3af62d... |
| Colțar PVC | `public/img/catalog/CAT-0223.webp` (the owner's photograph) | unchanged, sha256 0e90c491... |
| Plasă de armare | `public/img/catalog/CAT-0222.webp` | unchanged, sha256 e64efc77... |
| Membrana de DIFUZIE pentru acoperișuri | `public/img/catalog/CAT-0221.webp` (the owner's photograph) | unchanged, sha256 5c96e799... |

Every other catalogue picture (309 source files, 912 files) is fatade3d.md's, at the largest resolution served,
each with a SOURCES row on "permission Fatade 3D via owner 2026-09-28". 40 source pictures are under 600px wide
on fatade itself and are served as published, never upscaled.

## Lighthouse, desktop, median of three (the gate's own script, catalogue pages)

| Page | Performance | Accessibility |
|---|---|---|
| /catalog/ RO, RU | 99, 99 | 100, 100 |
| Sisteme de termoizolație (tiles) RO, RU | 100, 100 | 100, 100 |
| Polistiren expandat RO, RU | 100, 100 | 100, 100 |
| Plăci ceramice RO, RU | 99, 99 | 100, 100 |
| Elemente decorative (64 cards) RO, RU | 99, 100 | 100, 100 |
| Polistiren Dalmatina (product page) RO, RU | 100, 100 | 100, 100 |

Spread of the three runs: 0 or 1 point everywhere. The dispatch's floor was 90.

## W29-03, replaced previews, per page

| Service page (RO and RU) | Preview before | Preview after | Why |
|---|---|---|---|
| Terasamente | photograph 07 | photograph 01 | 07 was the "Radier armat, cofraj montat înainte de turnare" cover's own photograph (correlation 0.981) |
| Fațade | photograph 03 | photograph 01 | 03 was a second shot of the "Fațadă cu placaj din plăci mari de piatră" facade from nearly the same place (0.84) |
| Acoperișuri, Case la cheie, Copertine, Finisaje, Industrial, Instalații, Proiectare 3D, Reparații | unchanged | unchanged | already distinct |

Screenshots of all 20 gallery sections: `docs/audits/w29-03/`.

## Screenshots

- W29-01: `docs/audits/w29-01/`: hub, Sisteme de termoizolație category page, Polistiren expandat sub-page (1440
  and 320), two product pages (RO Dalmatina, RU Stone Alpes), the Vopsele flyout open on desktop and on a phone.
- W29-03: `docs/audits/w29-03/` (20 pages).
- W29-04: `docs/audits/w29-04/servicii_galerie-garduri.jpg`, the Garduri gallery RO after the change (15 pictures:
  12 of the owner's, 3 stock).

## W29-04, per gallery (removed files and criterion in `docs/reports/W29-04-REMOVED.md`)

| Gallery | Before | Removed | Kept |
|---|---|---|---|
| galerie-garduri | 22 | 7 (16 to 22, the owner's list) | 15 (12 RC-own, stock 13, 14, 15) |
| acoperisuri | 25 | 5 (19, 20, 21, 23, 25) | 20 |
| case-la-cheie | 12 | 2 (03, 09) | 10 |
| copertine | 12 | 8 (03, 04, 05, 07, 08, 09, 10, 12) | 4 |
| fatade | 19 | 1 (19) | 18 |
| reparatii | 37 | 1 (30) | 36 |
| industrial | 10 | 1 (01) | 9 |
| finisaje, instalatii, terasamente, proiectare-3d | 15, 15, 26, 10 | 0 | unchanged |

25 stock pictures (50 files) removed, none of the owner's photographs touched, none replaced (the ruling: gaps
stay). Gallery-preview-distinct (gate 37) is green after the removals; the industrial gallery's preview was
photograph 01, removed, so it shows 02 (R-W29-03's order). The named test gallery-removed (gate 42) exits 1 on
the build of `main` before the card (366 problems) and 0 after.

## Open questions for the owner

Q-W29-01 to Q-W29-09 and Q-W29-10 to Q-W29-12 in `docs/QUESTIONS.md`, each with the default that shipped. The one to read
first: **Q-W29-04**, the celebrity advert on the Sisteme de termoizolație tile.

## Board and artifact

This report ships in the documents-only board sync that closes the run; the board artifact is republished
from `docs/board/W29-board.json` as it stands on `main` after that merge (R-W28-12).
