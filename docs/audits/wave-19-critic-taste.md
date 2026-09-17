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

---

# Second pass · 2026-09-17, live build `ff102c6`

A second critic pass at the wave 19 boundary, dispatched after wave 19's executor
PRs #48, #49 and #50 merged. **The first pass above is left exactly as written.**
Where this pass contradicts it, the correction is its own section below.

This time `docs/audits/wave-19-readiness.md` existed, and it was read first. The
live `build-sha` was `ff102c64e0c5f76868c4f76bf1d650b1363ef32f`, equal to
`origin/main`. The site was reviewed as a visitor, in Romanian and Russian, at 390,
768, 1280 and 1920px. Checks were extended to other widths and heights where a
finding needed its edges.

**Treated as already recorded, and not re-carded:**
- the first pass's five cards, its sixth defect and its twelve taste items;
- every open question listed in the readiness audit, section 5;
- every photo slot listed in the readiness audit, section 4;
- recorded decisions, such as the project description line clamp (DECISIONS.md,
  W9-08).

## Cards issued in this pass

**Five defects were found, and five cards issued.** The count is not padded.
W19-D9 and W19-D10 are real but narrow (a broken Russian link, a phone held
sideways), and are ranked last for that reason. No sixth defect was found.

| Card | Defect | Rank | Acceptance run on live, failing |
|---|---|---|---|
| [W19-D6](../board/W19-D6-quote-cta-opens-callback-popup.md) | On both homepages, the "Solicită ofertă" buttons land on the quote form with the callback popup covering it and holding the focus | 1 | 24 of 24 |
| [W19-D7](../board/W19-D7-spec-table-cut-on-phones.md) | On phones, the specification table on six service pages, both locales, is cut mid-word at the screen edge | 2 | 84 of 120 |
| [W19-D8](../board/W19-D8-homepage-form-missing-three-services.md) | The homepage form's work-type list cannot name metal tile, carports or fences | 3 | 3 labels missing, per locale |
| [W19-D9](../board/W19-D9-ru-404-served-in-romanian.md) | A broken `/ru/` link shows the Romanian 404; the Russian one is never served | 4 | 3 of 3 RU paths, at 2 widths |
| [W19-D10](../board/W19-D10-landscape-catalog-cut-off.md) | On a phone held sideways, the catalog's last categories cannot be reached | 5 | 16 of 40 |

Each card's acceptance was run against the live site before the card was written.
Each fails there on exactly the set its card names.

## The first pass's cards are all still open on the live build

Wave 19's executor cards (RC-141 to RC-143) did not take them. Each was re-measured
on `ff102c6`:

| Card | Measured on `ff102c6` |
|---|---|
| W19-D1 | `/ru/konfidentsialnost/` at 390: the page scrolls sideways by 53px; the h1 overflows by 69px |
| W19-D2 | `/servicii/fatade/` at 600: the hero photo is 400px wide in a 568px column |
| W19-D3 | `/` at 1280: hover the first parent row, click its chevron, and `aria-expanded` is `"false"` |
| W19-D4 | "Preț și condiții" is still in the live HTML of `/servicii/fatade/` |
| W19-D5 | `/`: 6 chips, none for `proiectare-3d`, while the cards include a `proiectare-3d` project |

The first pass's sixth defect, cross-page `/#section` links landing under the header,
was not re-measured.

## A correction to the first pass

Taste item 3 says the "Te sunăm noi" popup "is present on the homepages and service
pages". **It is on the two homepages only.** `src/template.html` carries
`lead-modal`, and `src/service.html`, `src/product.html` and `src/category.html` do
not. That was equally true at the first pass's build, `47957f3`: `git show` of each
template counts 3, 0, 0 and 0 at both commits. The live HTML of 8 non-homepage pages
fetched in this pass carries no `id="lead-modal"`.

## Taste, second pass

Judgements, not defects. None of them are carded.

1. **Two section heading styles on the same service page.** "Sisteme de fațadă"
   (the spec table) and "Întrebări frecvente" have no eyebrow, and leave 28px
   between the heading and what follows. Their neighbours on the same page,
   "Proiecte recente" and "Cere o ofertă", carry an eyebrow and leave 40px before
   their cards or form. The first two are wave 9's (W9-08); the neighbours are
   later. Measured at 1280 and 390.
2. **The homepage roofing offer cards' buttons sit at different heights** within a
   row. Each button follows its card's text, so card 01's is lower than card 02's,
   and card 03's than card 04's. The services grid and the product cards pin their
   links to the card bottom.
3. **The homepage's row of three product cards** (Țiglă metalică, Copertine,
   Garduri) is its own section, with no eyebrow and no heading. It sits between the
   roofing offers and "Cum lucrăm".
4. **On phones, the menu has no list of services.** It holds Acasă, Servicii (a
   link to the homepage grid), Portofoliu, Despre and Contacte. Desktop has a
   dropdown of twelve services. On a phone, the three product pages are reachable
   only through the homepage's product row. They are reachable, so this is not a
   defect.
5. **Carport models share drawings.** 12 models use 7 distinct diagrams:
   - C-01, C-05 and C-08 are one drawing;
   - C-02 and C-09 are one;
   - C-06 and C-07 are one;
   - C-11 and C-12 are one.

   Each pair carries the same `<desc>`, so the text alternative agrees with the
   drawing. The drawings just do not tell the models apart.
6. **The quote form's "Trimite mesajul" button** keeps its natural width at 390,
   aligned left (`align-self: flex-start`). Every other primary button on a phone is
   full width: the hero, the offer cards, the phone menu and the footer.
7. **The service pages' project cards carry chips** ("Fațadă ventilată", "Placaj
   piatră fațadă") styled like the homepage filter chips, and they do nothing. This
   is the same family as the first pass's item 11.
8. **Copy, flagged only, in both locales:**
   - "15+ ani de experiență" in the stats sits beside "Echipă cu 10+ ani experiență"
     under Despre;
   - "500+ proiecte finalizate" sits beside the portfolio's "Și peste 100 de alte
     proiecte finalizate".

## Checked in this pass, and clean

All on the live site in headless Chrome, with Inter asserted loaded, each check
printing what it read.

- **What leaves the browser.** The network was recorded on all 44 pages at 1280.
  - The only hosts contacted are `rapidconstruct.md`, `fonts.googleapis.com` and
    `fonts.gstatic.com`.
  - No cookie is set. `localStorage` stays empty.
  - This matches the privacy page's own sections 3 and 4.
- **Images.** 780 rendered image boxes, over 44 pages at 390, 1280 and 1920.
  - None is stretched out of its aspect ratio.
  - None is drawn larger than its file at 1x (scale above 1.05).
  - Every image that fails to finish loading is a marquee duplicate the first pass
    already explained.
- **RO and RU numbers.** On all 22 page pairs, every number matches in both
  locales: prices, dimensions, colour codes, stats and years. The comparison was
  negative-tested with a planted change, which it caught.
- **Contact targets.** 10 pages were fetched:
  - one phone, `tel:+37376837180`, 56 links;
  - one WhatsApp number, `wa.me/37376837180`;
  - one email;
  - the three social profiles.

  They agree everywhere.
- **Forms.** The quote form was tested on 5 pages at 390 and 1280: `/`, `/ru/`, a
  service page, an RU product page and a category page. `window.fetch` was replaced
  in the page and the endpoint was blocked at the network layer. **No request
  reached Web3Forms.**
  - On success, the confirmation appears in view and the form clears.
  - On failure, the message with the phone number appears and the input is kept.
  - The honeypot sits 9,995px off-screen.
- **Short screens.** Measured bottom edges: the Servicii dropdown at 618px, the
  catalog at 455px.
  - Both fit at 1280×650, 1366×657, 1536×730 and 1920×960.
  - The phone sheets scroll at 375×667 and 390×844.
  - The popup fits at 375×667 and 844×390.
  - At 390 and 768, at scroll 0 and at 2000, the catalog sheet and the phone menu
    meet the header's bottom edge exactly.
- **Type across templates.** The h1, eyebrow, lede, breadcrumb and body text are
  identical on the home, service, product, category, privacy and 404 templates, at
  390 and 1280.
- **Scroll reveal.** 176 natural scroll-throughs: 44 pages at 375×667, 844×390,
  390×844 and 1280×720. Every `[data-reveal]` element was revealed.
- **Buttons.** Every `<button>` on the 10 fetched pages has a handler in
  `src/main.js`.
- **Deep 404s.** The 404 page served at `/ru/servicii/a/b/` still loads its
  stylesheet, logo and fonts, because every asset path is absolute. Its language is
  W19-D9.
- **Overlapping targets.** Every visible link, button and field, pairwise, on 176
  page loads at 390, 768, 1280 and 1920. The only overlap is 3px, between a footer
  social icon and "Politica de confidențialitate", at 390 and 768 on 3 pages per
  locale. A visitor cannot see it.

## Discarded in this pass as the reviewer's own artifacts

- **A thin light strip at the right edge of dark bands**, in captures scaled to
  0.75. Every section measured exactly the viewport width at 390 and 768.
- **Blank white captures of an open menu.** A clip at y=0 on a page scrolled to
  2000 captures the top of the document, not the viewport.
- **Two card bodies left unrevealed** on `/ru/` at 844×390, in one fast
  scroll-through. Eight reruns at two scroll speeds revealed everything.
- **"Preț și condiții" not found by `innerText`.** CSS uppercases it. It is in the
  HTML, and W19-D4 is still live.
- **"Acasă" and "Servicii" opening the popup** in the nav-jump test. Scrolling the
  footer rows into view had already crossed 50% depth before the click.
- **"Sisteme de iluminare" counted unreachable at 844×390** by its bottom edge. Its
  centre can be tapped, and W19-D10's acceptance uses the centre.
