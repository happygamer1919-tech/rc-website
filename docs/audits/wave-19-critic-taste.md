# Wave 19 critic report · Taste, and what was checked

Critic pass at the wave 19 boundary, 2026-09-16. It reviews the live site
`https://rapidconstruct.md` and `/ru/`, build `47957f3` (the `build-sha` served
equals `origin/main`), as a visitor, at 390, 768, 1280 and 1920px. Some checks were
extended across 360 to 1024px where a finding needed its edges.

**Defects are cards, not items here.** Five were issued, in `docs/board/`:

| Card | Defect | Rank |
|---|---|---|
| [W19-D3](../board/W19-D3-catalog-chevron-click-closes.md) | Desktop catalog: clicking a category's chevron closes the subcategories hover just opened | 1 |
| [W19-D2](../board/W19-D2-hero-photo-half-width.md) | From 401 to 768px, the hero photo on the homepage and all service pages shrinks to 400px | 2 |
| [W19-D1](../board/W19-D1-heading-overflow.md) | Long one-word headings overflow; the RU privacy page scrolls sideways on phones | 3 |
| [W19-D4](../board/W19-D4-empty-price-band.md) | Five service pages carry a "Preț și condiții" band with no price and no conditions | 4 |
| [W19-D5](../board/W19-D5-portfolio-filter-missing-3d.md) | The homepage portfolio has no filter chip for its 3D project | 5 |

Each card's acceptance was run against the live site before it was written, and fails
there on exactly the defect it describes.

## The dispatch named an input that does not exist

The dispatch says to read `docs/audits/wave-19-readiness.md` first. **No such file
exists** in the working tree, on `origin/main`, on any of the remote branches, in
any commit of the repository's history, or in the repository directory, `~/Downloads` or `~/Desktop`, which are the places searched. This review ran
without it. "Already recorded as an open question" was read from
`docs/QUESTIONS.md`, and "blocked on photographs" from the photo manifests and their
open questions.

## A sixth defect, below the cap of five

Not carded, because the dispatch allows five cards and this one ranks last. It is a
defect, not taste, and is recorded here so it is not lost.

**On phones, a link to a homepage section from another page lands with the section's
label under the fixed header.** The desktop nav and the hamburger on non-home pages link to `/#servicii`,
`/#portofoliu`, `/#despre` and `/#contacte`. This was checked in the live HTML of
`/servicii/fatade/` and `/ru/catalog/vopsele/`. On the homepage itself, the
Servicii menu's first row is also `/#servicii`. The
browser jumps straight to the section top. The in-page offset in `src/main.js` only
runs for links whose `href` starts with `#`, and no CSS `scroll-margin-top` exists. With 56px of
section padding on mobile and an 80px header, the eyebrow lands at y=57, under the
header.

Measured at 390px:

| Link | Eyebrow top | Header bottom |
|---|---|---|
| `/#portofoliu` | 57 | 80 |
| `/#despre` | 57 | 80 |
| `/#servicii` | 57 | 80 |
| `/ru/#portofoliu` | 109 | 80 |

The RU run landed clear, so the result is timing-dependent. The section's `h2` stays
visible below the header. On desktop the same landing clears the 96px header by 1px,
because the section padding is also 96px: correct today, by coincidence.

## Taste

Everything below is a judgement about how the site could read better. None of it is
broken, and none of it is carded.

1. **Tablet widths use the phone layout.** At 768px every grid is one column.
   - Service cards are 736px wide.
   - Each roofing offer photo is about 680 by 840px.
   - The process steps are full-width photos.
   - The RO homepage is 22,019px tall at 768px against 21,116px at 390px.
   - A two-column tablet layout would read better. (W19-D2 is a separate, actual
     defect in the same range.)
2. **The floating WhatsApp and call buttons sit over full-width buttons** as those
   scroll past on phones. On the homepage's first screen they cover part of the hero
   CTA:
   - at 412x915, the call button covers 32x42px;
   - at 430x932, both buttons cover part of it in RO, and the call button 32x28px in RU;
   - at 360x780, 375x667, 390x844, 768x1024 and 820x1180 nothing is covered.
   - Floating buttons trade this for reach; they could lift or shrink.
3. **The "Te sunăm noi" popup opens by itself**, after 30s, at 50% scroll depth, or
   on desktop exit intent, once per session. It behaves correctly: focus moves to the
   phone field, Escape and the close button work. It is present on the homepages and
   service pages, but not on the product or category pages. Whether a paying client
   wants an auto-opening popup is theirs to say.
4. **Hero composition differs by page type** under the same menus.
   - Service pages: a photo beside the title, and no button.
   - Product pages (tile, carports, fences) and category pages: a button, and no photo.
   - The two families were built in different waves.
5. **Footers differ by template.**
   - Only the homepage footer opens with the "Solicită ofertă gratuită / Sună acum" row.
   - The privacy and 404 footers have no navigation columns and no offer line.
   - The footer's "Servicii" column lists 6 of the 9 services and none of the three
     product pages, while the header's Servicii menu lists 13 destinations.
6. **Category pages.**
   - The body section starts with no heading.
   - The subcategory list uses the browser's black disc bullets, where the roofing
     offer cards use brand-colour markers.
   - The form heading reads "Cere o ofertă pentru acest serviciu" / "Запросить смету
     на эту услугу" on a materials page. This is copy, so it is flagged, not proposed.
7. **Two different discount messages share a page.** The promo bar says "Reducere 10%
   la orice serviciu doar până în 2027". The hero card, footer and price band say
   "−10% la programări anticipate". This is copy; flagged only.
8. **The privacy page's eyebrow reads "Contact" / "Контакты"** above "Politica de
   confidențialitate". A label mismatch; copy, flagged only.
9. **The roofing offer cards' ghost numerals** (01 to 04) sit behind the ends of long
   titles at 390px, for example "…ȘINDRILĂ BITUMINOASĂ" over "02". This is the
   wave 14 audit's anatomy by design, but it reads crowded on a phone.
10. **The modular tile's profile diagram** keeps the full 160 by 100 frame with no
    dimensions under the drawing. In the four-column row that aligns the cards; at
    768px and below, where cards stack, it reads as an empty band.
11. **The carport chooser's model chips** (C-01 to C-12) look like tags and do
    nothing. Linking each to its model card below would make them useful.
12. **The footer address**, "Nicolae Zelinski St 24, Chișinău", uses the English "St"
    on RO and RU pages. The RU copyright line says "Кишинёв" while the RU address
    says "Chișinău". Copy; flagged only.

## Checked, and clean

So the next pass need not repeat them. All on the live site, headless Chrome, each
check asserting it read what it claims.

- **Layout.** 44 pages at 390, 768, 1280 and 1920px (176 combinations):
  - no sideways page scroll, except the RU privacy page (W19-D1);
  - no text clipped, and no visible text under 12px;
  - no broken image, failed request, JavaScript exception or visible TODO;
  - no section without content;
  - the fixed header never covers content at the top of the page, on 11 pages covering
    all six templates, at the four widths.
- **Consistency across waves.** Section padding (96px, and 56px compact) and the
  1200px container match on every template except privacy, whose reading column is a deliberate 760px. Primary buttons are identical on all six templates
  (48px tall, 28px padding, 6px radius). Section headings match (40px uppercase on
  desktop, 26px on phones).
- **RO and RU.**
  - Identical structure on all 22 page pairs (sections, cards, images, links, buttons,
    headings).
  - The language switch maps each of the 42 sitemap pages to its own counterpart.
  - `html lang` is correct on every page.
  - No untranslated text, other than the switch labels, which are correct by design,
    and the address.
- **Interactions**, with real mouse and key events:
  - the Servicii menu opens on click and closes on Escape (three templates: home,
    product and category; both locales; 1280 and 1920);
  - the catalog opens and closes on an outside click;
  - the hamburger opens and closes at 390 and 768;
  - the phone catalog drill-down and its back button work;
  - portfolio chips each show at least one card;
  - the popup opens at depth and closes on Escape;
  - an empty form submit is refused with three messages and focus on the name
    field (four templates: home, service, product and category; both locales; 390 to 1920). No form was submitted with
    valid data.
- **Images.** The marquee logos that render at 0 by 0 before they scroll into view
  load when they arrive, at 1920px. At 480, 600 and 768px, no image box on the 44 pages
  is narrower than its column except the two hero photo boxes (W19-D2).

## Discarded as the reviewer's own artifacts

Each looked like a defect and was shown not to be one before anything was written:
- Grey empty boxes in full-page captures were lazy images the capture had not
  scrolled to. All 9 service images loaded once the page was scrolled.
- Two "overlapping" links on `/ru/servicii/proiectare-3d/` were one inline link
  wrapping across two lines, so its bounding box contained the next link.
- A header drawn mid-page in captures was a smooth scroll still running when the
  capture fired. Measured at scroll 0, the header never overlaps content.
- An empty-form test that "failed" on the homepage was the popup opening at 50% depth
  under a test that had suppressed it with the wrong storage key.
- The Catalog label "overflowing" at 360px is deliberately clipped to an icon button
  below 375px (W14-06).
