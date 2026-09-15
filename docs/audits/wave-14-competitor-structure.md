# Wave 14 competitor structure audit

Browser audit, read-only, performed 2026-09-15 from a desktop viewport (1414 x 1151 CSS px, Chrome).
Scope: fatade3d.md (catalog taxonomy and /acoperisuri/), dasterum.md/tigla-metalica/ (plus the four
product detail pages it links, needed for the product fields), imperlux.md/garduri/ and
imperlux.md/acoperisuri/copertine/.

Method: DOM and computed-style inspection, scripted interaction tests (pointer, keyboard, carousel
controls), and on-screen viewing of image slots for classification. No image, video, logo or watermark
was downloaded, saved or committed. Body prose is not reproduced: each block is described by the job it
does in this report's own words, plus the factual claims it makes. Exact strings are kept only where the
brief asks for them (menu labels, product names, button labels, spec values, prices).

Measurements are CSS px at the viewport above. Aspect ratios are rendered box ratios unless marked
"source", which is the intrinsic file size.

Conventions: "RC photo only" in the manifest means the slot can only be satisfied honestly with a
Rapid Construct site photograph (a real job, a real team member, a real before/after pair).

---

## 1. fatade3d.md catalog taxonomy

### 1.1 Header navigation (all pages)

Top to bottom: dismissible red announcement bar (promo line, underlined "COMANDĂ ACUM" link, close X),
then a fixed white navbar with shadow: wordmark, "Catalog" button, search icon, account icon, cart icon
with count badge, RO/RU toggle, text nav, partner badge image, phone pill.

| Order | Nav item | Type | Children |
|---|---|---|---|
| 1 | Catalog | Button, opens mega-menu | See 1.2 |
| 2 | Acasă | Link | none |
| 3 | Magazin Online | Link | none |
| 4 | Servicii | Dropdown (Bootstrap, click) | Fațade; Acoperișuri; Constructii case |
| 5 | Contacte | Link | none |
| 6 | Blog | Link | none |

### 1.2 Catalog mega-menu: full taxonomy

Panel heading: "Categorii de produse". Maximum nesting depth: 2 (category, subcategory). No third level
exists in the menu markup.

| # | Level 1 label | Has submenu | Level 2 labels (exact, in order) |
|---|---|---|---|
| 1 | Sisteme de termoizolație | Yes | Sisteme de termoizolație (repeated as panel title and link to parent); Polistiren expandat; Polistiren extrudat; Vată minerală; Adezivi și mase de șpaclu; Alte produse |
| 2 | Tencuieli decorative | No | none |
| 3 | Plăci ceramice | No | none |
| 4 | Elemente decorative | No | none |
| 5 | Vopsele | Yes | Vopsele (panel title); Vopsele de exterior; Vopsele de interior |
| 6 | Sisteme de iluminare | No | none |
| 7 | Alte materiale de construcții | No | none |

Counts: 7 top-level categories, 2 with children, 7 subcategories (5 + 2), excluding the repeated parent
title row.

Observation: the menu has no roofing category. The roof product linked from /acoperisuri/ (diffusion
membrane) sits under "Alte materiale de construcții" per its breadcrumb.

### 1.3 Mega-menu interaction model

- Open: click on "Catalog" (Bootstrap `data-bs-toggle="dropdown"`). Hover over the button alone did not
  open it in testing. Button gains a darker filled state while open.
- Panel: vertical list, fixed width (about 300 px), anchored under the button, white rows separated by
  thin rules, heading row at top. A close button exists but is shown only below the md breakpoint.
- Level 2 on desktop: hovering a row with a chevron opens a flyout panel to the right of the list, same
  row height, first row repeats the parent label. Hovered row turns brand red with white text.
- Level 2 by click: each parent row is a split control. The label is a link to the category page; the
  chevron is a separate toggle button. Clicking the chevron opens the child list as a drill-down panel
  laid over the parent list (same width), with a back toggle, which is the mobile pattern.
- Close: click outside or on the button again (standard Bootstrap dropdown behaviour).

---

## 2. Product records

### 2.1 dasterum.md: Țiglă metalică (listing plus four detail pages)

Listing facts: 4 products, filter sidebar (subcategories, price range, colour), per-page and sort
controls. Listing cards show a discount badge, "от X lei" (discounted, from) and a second price (list).

Detail page model: one product page per profile, a "Tip de calitate" (grade) select that switches
variant by URL parameter (Econom, Standart, Premium), colour chips grouped "Matt" and "Lucios", a spec
block (article number, warranty, metal thickness, finish), unit price, a length x width x quantity
calculator for m² products, add-to-cart and consultation buttons. Manufacturer shown: Dasterum (page
title claims a Moldovan producer). Colour codes are shown as bare four-digit RAL-style numbers with a
name; the site does not print the "RAL" prefix. Suffix M means matt.

Price field note: on detail pages for Monterrey, Valencia and Kascad the displayed unit price equals the
listing's second (list) figure for Econom, while the discount sticker stays on the page and no separate
discounted figure is printed. On the modular detail page the displayed price equals the listing's first
(discounted) figure. Both behaviours are recorded as observed, not reconciled.

| Model | Mfr | Grade | Art. no. | Thickness | Sheet width total / working | Matt colours | Gloss colours | Warranty | Finish / coating | Unit | List price | Discounted price | Sticker |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Monterrey | Dasterum | Econom | 2001 | 0.45 mm | 1190 / 1100 mm | 3005M, 7016M, 7024M, 8017M, 8019M | 9006 | 1 year | Matt; galvanised steel with polyester polymer layer (description) | m² | 152 lei (detail and listing) | from 110 lei (listing) | -27.6% |
| Monterrey | Dasterum | Standart | 2014 | 0.45 mm | 1190 / 1100 mm | 3005M, 7016M, 8017M, 8019M, 9005M | 3005, 5005, 6005, 8017, 9003, 7016, 7024, 9006 | 10 years | Matt | m² | 184 lei (detail) | not shown | -27.6% |
| Monterrey | Dasterum | Premium | 2023 | 0.50 mm | 1190 / 1100 mm | 3005M, 6005M, 8017M, 8019M | 6005 | 20 years | Matt | m² | 207 lei (detail) | not shown | -27.6% |
| Valencia | Dasterum | Econom | 2054 | 0.45 mm | 1190 / 1100 mm | 3005M, 7016M, 7024M, 8017M, 8019M | 9006 | 1 year | Matt | m² | 156 lei (detail); 152 lei (listing) | from 110 lei (listing) | -27.6% |
| Valencia | Dasterum | Standart | 2066 | 0.45 mm | 1190 / 1100 mm | 3005M, 7016M, 8017M, 8019M, 9005M | 3005, 5005, 6005, 8017, 9003, 7016, 9006 | 10 years | Matt | m² | 184 lei (detail) | not shown | -27.6% |
| Valencia | Dasterum | Premium | 2074 | 0.50 mm | 1190 / 1100 mm | 3005M, 6005M, 8017M, 8019M | 6005 | 20 years | Matt | m² | 207 lei (detail) | not shown | -27.6% |
| Kascad | Dasterum | Econom | 2027 | 0.45 mm | 1160 / 1080 mm | 3005M, 7016M, 7024M, 8017M, 8019M | 9006 | 1 year | Matt | m² | 160 lei (detail); 156 lei (listing) | from 110 lei (listing) | -29.5% |
| Kascad | Dasterum | Standart | 2040 | 0.45 mm | 1160 / 1080 mm | 3005M, 7016M, 8017M, 8019M, 9005M | 3005, 5005, 6005, 8017, 9003, 7016, 7024, 9006 | 10 years | Matt | m² | 189 lei (detail) | not shown | -29.5% |
| Kascad | Dasterum | Premium | 2048 | 0.50 mm | 1160 / 1080 mm | 3005M, 6005M, 8017M, 8019M | 6005 | 20 years | Matt | m² | 213 lei (detail) | not shown | -29.5% |
| Țiglă metalică modulară | Dasterum | Premium (only grade) | 206 | 0.45 mm | sold per piece, 0.83 m² each | 7016M, 8019M | none | 10 years | Matt | piece | 188 lei (listing) | 169 lei (detail and listing) | -10.1% |

Extra facts on these pages: Monterrey description states 4.5 kg/m² and the polyester coating; Monterrey,
Valencia and Kascad are cut to any length; Valencia detail carries a profile cross-section drawing with
dimensions (350 mm step, 1190 mm total, 1100 mm working).

Colour legend from the listing filter (15 entries, code and site's own name):

| Code | Site name | Code | Site name |
|---|---|---|---|
| 3005M | Vin rosu Matt | 8019M | Maro gri Matt |
| 3005 | Vin rosu | 9005M | Jet negru Matt |
| 6005M | Mușchi verde Matt | 7016 | Gri antracit |
| 7016M | Antracit gri Matt | 7024 | Gri grafit |
| 5005 | Semnal albastru | 8017 | Maro ciocolată |
| 7024M | Grafit gri Matt | 9003 | Semnal alb |
| 6005 | Mușchi verde | 9006 | Aluminiu alb |
| 8017M | Ciocolata maro Matt | | |

### 2.2 imperlux.md/garduri/: louvre fence models

Material facts stated on the page: own plant in Chișinău, producing since 2015; galvanised steel with a
ZnMg coating of 140 g/m²; hidden fixing system claimed as unique locally; Metal Plus carries a 20-year
anticorrosion warranty and Metal PlusDV 30 years; 3 RAL colours on Metal Plus, 2 on PlusDV (which two is
not stated on the page). A FAQ entry indicates the promotion applies to the Antracit colour only.

| Model | Mfr | Line | Thickness | Colours with RAL | Warranty | Coating / grade | Fixing | Unit | List price | Discounted price | Source block |
|---|---|---|---|---|---|---|---|---|---|---|---|
| IL12 | Imperlux | Metal Plus | 0.50 mm | Antracit RAL 7016; Maro Wenge RAL 8019; Negru profund RAL 9005 | 20 years anticorrosion | ZnMg 140 g/m² galvanised | Hidden | lei/m² | 602 | from 500 (-17%, saving 102/m²) | Offer card |
| IL30 | Imperlux | Metal Plus | 0.50 mm | same three | 20 years | same | Hidden | lei/m² | 742 | from 668 (-10%, saving 74/m²) | Offer card |
| IL100 | Imperlux | Metal Plus | 0.50 mm | same three | 20 years | same | Hidden | lei/m² | 1007 | from 906 (-10%, saving 101/m²) | Offer card |
| IL40 | Imperlux | Metal Plus | 0.50 mm | same three | 20 years | same | Hidden | lei/m² | 832 | from 749 (-10%, saving 83/m²) | Offer card |
| IL12 | Imperlux | Metal PlusDV | not shown | 2 RAL, not named | 30 years | not shown | not shown | lei/m² | not shown | from 680 | Form select, structured data |
| IL30 | Imperlux | Metal PlusDV | not shown | 2 RAL, not named | 30 years | not shown | not shown | lei/m² | not shown | from 822 | Form select, structured data |
| IL100 | Imperlux | Metal PlusDV | not shown | 2 RAL, not named | 30 years | not shown | not shown | lei/m² | not shown | from 1128 | Form select, structured data |
| IL40 | Imperlux | Metal PlusDV | not shown | 2 RAL, not named | 30 years | not shown | not shown | lei/m² | not shown | from 926 | Form select, structured data |
| IL12 | Imperlux | not stated | not shown | not shown | not shown | not shown | not shown | lei/m² | 587 | 499 (-15%) | Calculator step 1 |
| IL30 | Imperlux | not stated | not shown | not shown | not shown | not shown | not shown | lei/m² | 705 | 599 (-15%) | Calculator step 1 |
| IL30 Dublu | Imperlux | not stated | not shown | not shown | not shown | not shown | not shown | lei/m² | 777 | none | Calculator step 1 |
| IL100 | Imperlux | not stated | not shown | not shown | not shown | not shown | not shown | lei/m² | 1010 | 859 (-15%) | Calculator step 1 |

Observation: the same model carries different prices in the offer block and the calculator block on the
same page (IL12 500 vs 499, IL30 668 vs 599, IL100 906 vs 859). Recorded as found.

Portfolio card models referenced but without price data: IL02, IL40 plus vertical custom, IL41, IL101,
IL102, IL30 Dublu, custom designs. The calculator states 8 models in total.

### 2.3 imperlux.md/acoperisuri/copertine/: carport models

No prices are published; the FAQ gives the reason (price depends on span, ground, foundation, roofing
and mounting, so a quote follows a site measurement). Roofing options stated: polycarbonate, metal sheet
or sandwich panels. Manufacturer: Imperlux, made in Moldova.

| Model | Name | Structural category (card chip) | Stated distinguishing fact | Thickness | Colours | Warranty | Unit | List price | Discounted price |
|---|---|---|---|---|---|---|---|---|---|
| IL301 | Basic | On posts | Standard carport for one or two cars | not shown | not shown | not shown | none | not published | not published |
| IL302 | Panoramic | Cantilever, wide span | Cantilever up to 6 m | not shown | not shown | not shown | none | not published | not published |
| IL303 | Wall | Wall-mounted | Anchored to the building | not shown | not shown | not shown | none | not published | not published |
| IL304 | 2 Ape | Gable | Drains on both sides | not shown | not shown | not shown | none | not published | not published |
| IL305 | Flat | On posts | Flat roof, one or two cars | not shown | not shown | not shown | none | not published | not published |
| IL306 | Arc | Arched | Optional forged elements | not shown | not shown | not shown | none | not published | not published |
| IL307 | ProtectFlex | Arched / semi-arched | Sized to truss type | not shown | not shown | not shown | none | not published | not published |
| IL308 | Prestige | On posts, boxed edge | Boxed fascia integrated with house | not shown | not shown | not shown | none | not published | not published |
| IL309 | Luxe | Cantilever | Posts on one side only | not shown | not shown | not shown | none | not published | not published |
| IL310 | Vector | Inclined posts | Wider free opening | not shown | not shown | not shown | none | not published | not published |
| IL311 | Design | Architectural | Heavy profiles, open structure | not shown | not shown | not shown | none | not published | not published |
| IL312 | Exclusive | Architectural, to project | Asymmetric, integrated lighting | not shown | not shown | not shown | none | not published | not published |

### 2.4 fatade3d.md: roof product and service price records

Diffusion membrane (product page linked from /acoperisuri/, category Alte materiale de construcții):

| Model | Mfr / brand | Density variant | Roll size | Coverage per roll | Colour | Warranty | Unit | List price | Discounted price |
|---|---|---|---|---|---|---|---|---|---|
| Membrană de difuzie pentru acoperișuri | Fațade 3D (brand printed on product) | 115 g/m² | 1.5 x 50 m | 75 m² | not stated (product image is red) | "quality guarantee", no years | m² | 17.40 lei | 17.40 lei (no discount) |
| same | same | 140 g/m² | same | same | same | same | m² | 21.00 lei | 21.00 lei (no discount) |
| same | same | 160 g/m² | same | same | same | same | m² | 22.00 lei | 22.00 lei (no discount) |
| same | same | 180 g/m² | same | same | same | same | m² | 23.00 lei | 23.00 lei (no discount) |

/acoperisuri/ service offers (no product records, material options only):

| Offer card | Material options listed | Price |
|---|---|---|
| 01 Slate replacement with metal tile | Korean, Italian, Swedish metal tile | none |
| 02 Slate replacement with bituminous shingle | none listed | none |
| 03 Turnkey roof with metal tile | Korean, Italian, Swedish metal tile | none |
| 04 Turnkey roof with bituminous shingle | none listed | none |

/acoperisuri/ paid home consultation (the only published prices on that page):

| Zone | Fee | Stated inclusions (shared) |
|---|---|---|
| Northern and southern districts | 1000 lei | Expert measurement, renovation advice, personalised quote, specialist travel |
| Central districts | 750 lei | same |
| Chișinău and suburbs | 500 lei | same |

---

## 3. fatade3d.md/acoperisuri/ page structure

Global chrome: announcement bar and fixed navbar (section 1.1); floating round chat button bottom right.
Section rhythm alternates white, light grey, white, pattern, dark, white.

| # | Section (class root) | Top y / height | Background | Communicative job | Factual claims |
|---|---|---|---|---|---|
| 1 | showcase (hero) | 50 / 1151 | White with faint grid pattern | Promise a correctly built roof that protects for years; route to consultation or projects | Turnkey roofs and old-roof renovation across Moldova, from slate swap to new timber structure |
| 2 | servicii-acoperis | 1201 / 1654 | White | Show the four roof job types and let each request a quote | Four job types; metal tile offered in three origins |
| 3 | before-after | 2855 / 1110 | Light grey | Prove visual transformation with drag comparisons | 4 renovated houses |
| 4 | portfolio | 3965 / 981 | White | Show geographic spread of finished roofs | 7 named villages, years 2025 and 2026 |
| 5 | roof-membrane (shop-categories) | 4946 / 863 | White with logo-element pattern | Explain that the hidden layers matter and sell the own-brand membrane | Membrane is waterproof, vapour-open, resists UV and temperature swings, quick to fit |
| 6 | testimonials | 5809 / 868 | Default | Social proof through owner video interviews | 13 videos |
| 7 | pasi-consultatie | 6678 / 771 | Full-bleed image under dark overlay, white text | Explain the consultation to execution path in six steps | Expert visits on site, measures, gives a personalised quote, team executes |
| 8 | prices | 7449 / 975 | Default | State that consultations are paid and how much by zone | 500 / 750 / 1000 lei by zone |
| 9 | roof-faq | 8424 / 1367 | White | Pre-empt objections on cost, per-m² pricing, remote quotes, scope, materials, duration, travel, warranty, choosing material | 10 questions |
| 10 | contact-forms | 9791 / 929 | Decorative | Capture a home-consultation request | Form fields below |

### 3.1 Hero

- Split layout, two columns. Left (648 px): H1 set in heavy uppercase display type with the first words in
  brand red, a paragraph, two filled red buttons side by side ("Vreau consultație", "Vezi proiecte").
  Right (622 x 350, 16:9): an HTML5 video, autoplay, native controls visible, not looped, 18 s,
  1280 x 720 source. Two video elements with the same file exist (one hidden at this width).
- No stat tiles on this page (the home page hero has four: years, clients consulted, rating, delivery).
- Scroll cue centred at the bottom edge: chevron over a short label.

### 3.2 Offer cards (servicii-acoperis)

- Header: H2 with accent span, supporting paragraph.
- Grid: Bootstrap row with `g-4` gutters, 2 columns at lg and md (`col-lg-6 col-md-6`), 1 column below md.
  2 x 2 cards, each column 660 px, card 636 x 500.
- Card anatomy, top to bottom:
  - 3.75 px brand red top border, no radius, no shadow, flex column.
  - Numeral "01" to "04": absolutely positioned top right, 92 px display type, brand red at opacity 0.1
    (a ghost numeral behind the title area).
  - H3 title top left, uppercase, two lines max.
  - Body: CSS grid, two columns (300 px | about 262 px). Left: image 299 x 370 (portrait, about 0.81:1,
    cropped with object-fit from a 900 x 675 source), inside a frame with a 0.6 px pale red border.
    Right: short description paragraph, bold label introducing options, bullet list (`list-style: disc`,
    red markers, one item per line), then the CTA.
  - CTA: filled red pill button "Solicită ofertă", sits at the bottom of the right column, left aligned.
  - Cards 02 and 04 have no option list; the CTA moves up under the paragraph.

### 3.3 Before/after slider

- Header row: supporting paragraph above the H2 (eyebrow order reversed: paragraph first), H2 with
  accent span, left 8 columns. Right 4 columns: two circular arrow buttons (57 px, white fill, thin red
  border), right aligned, labelled previous and next image.
- Stage: one project visible at a time; inactive items are `display: none`. Compare box 1180 x 664
  (about 1.78:1), 18 px radius, drop shadow, sources 1448 x 1086 (4:3) cropped to fill.
- Layering: "after" image full size underneath; "before" image in a wrapper on top clipped with
  `clip-path: inset(0 X 0 0)`, driven by a CSS custom property `--position` (default 50%). Before is
  therefore on the left, after on the right.
- Drag behaviour (tested): hover alone does nothing; pointer down anywhere on the image jumps the divider
  to that x position and dragging moves it continuously (`cursor: ew-resize`, `touch-action: none`);
  a plain click without pointer down does not move it. Keyboard: focusing the handle and pressing an
  arrow key moves the divider 5 percentage points.
- Handle: a full-height 4 px white line (pseudo-element) with a centred white pill 40 x 70, fully rounded,
  soft drop shadow, carrying three short dark vertical grip bars (2 x 24 px) spaced 7 px apart. Handle is
  a button with an accessible label about dragging to compare.
- Labels: "Înainte" bottom left and "După" bottom right, 24 px from the edges, 38 px tall, uppercase
  14 px white text on 82% black, square corners. Labels are fixed to the frame, not to the divider.
- Navigation: arrows only, no dots, no counter, no autoplay, no swipe-between-projects handler found.
  Next from the last project wraps to the first; previous from the first wraps to the last. Each project
  has a visually hidden H3 title.
- Set size: 4 projects (8 images).

### 3.4 Portfolio

- Slick carousel, `slidesToShow: 3`, `rows: 2` (so 2 x 3 cards per view), infinite, speed 500 ms, arrows
  on, dots off, autoplay off. Responsive: 2 per view at 1024 px and below, 1 per view and 1 row at 600 px
  and below.
- Arrows: 57 px white circles in the header row, top right beside the H2.
- Card: rounded image 413 x 205 (about 2:1, sources are mixed portrait and landscape), H4
  "Acoperiș în [village]" below. Hover reveals a red "Vezi proiectul" button that slides up from below
  the image (translateY with overflow hidden). Each project holds a hidden set of gallery links for a
  lightbox.
- 7 unique projects: Trușeni, Mereni, Lozova, Drochia, Cojușna, Donici, Mălăiești.

### 3.5 Membrane block

Two columns. Left: product name eyebrow, H2 with accent span, paragraph, 5-item benefit list, filled red
button "Vreau membrană" and outline red button "Vreau acoperiș nou" side by side. Right: product image
650 x 508 (about 1.28:1).

### 3.6 Video testimonials

Slick carousel, 3 per view, 2 media stacked per slide, arrows on, dots off, autoplay off; 13 unique
videos. Each media tile 413 x 205 with a background thumbnail and a centred YouTube-style play button
(99 x 69). Titles under tiles are empty.

### 3.7 Consultation steps

Full-width band with a background image (cover) under a dark overlay, white text. Left: eyebrow line,
H2 with accent span, 6 steps in a 2 x 3 grid, each a small red rounded badge with a two-digit numeral
("01" to "06") beside one sentence; yellow/amber large button below. Right: portrait photo 520 x 650
(4:5) of a staff member holding a sample.

Steps (own words): book a home consultation; expert visits the roof; structure and roof shape checked;
exact measurement and choice between material swap or turnkey; personalised quote by material, area and
complexity; agree terms, crew and materials prepared, then execution.

### 3.8 Prices, FAQ, form

- Prices: centred header with a highlighted note on what the fee covers, then 3 equal cards (440 x 540)
  in a row, each with zone title, large fee in lei and a "Vreau Consultație" button.
- FAQ: single column Bootstrap accordion, 10 items, visible two-digit numerals prefixed to each question,
  first item open on load, single-open (items share a parent).
- Form: title line, full-width stacked fields: name (required), phone with international country picker
  defaulting to +373, email, hidden referring-page field, full-width submit "Vreau consultație".

---

## 4. imperlux.md page structures

Shared chrome on both pages: floating rounded pill header (logo, phone number, orange "Solicită ofertă"
button, menu icon); floating WhatsApp and phone buttons bottom right. Tailwind build, light grey
(#f5f5f7) and white alternating sections, orange accent, generous radii (16 to 32 px).

### 4.1 /garduri/

Additional chrome: a small badge bottom left stating local production.

| # | Section | Top y / height | Background | Communicative job | Factual claims |
|---|---|---|---|---|---|
| 1 | Hero | 84 / 1470 | Light grey | Own-production louvre fence, galvanised, hidden fixings; urgency and proof up front | Live counter of people requesting quotes today; 10+ years; 500+ fences installed; rating 4.9; 20-year anticorrosion |
| 2 | Lucrări realizate | 1554 / 643 | Zinc-50 | Show volume and spread of finished fences | 24 projects with model, length in linear metres or "new job", locality |
| 3 | Oferte limitate (#oferte) | 2197 / 2026 | White | Time-boxed promo on 4 models with specs | Countdown in days and time; limited stock note; prices and specs in 2.2 |
| 4 | 4-step process plus stat tiles | 4223 / 937 | Grey rounded panel on white | Make buying feel simple and low-risk | 4 steps; up to 36 interest-free instalments; installation 1 to 2 days anywhere in Moldova |
| 5 | Personalizează | 5159 / 735 | White | Sell laser-cut custom designs | Any cut pattern; 29 inspiration designs or own drawing; same 20-year steel; instalments possible |
| 6 | Calculator (#calculator) | 5894 / 1602 | Light grey | 5-step online price estimator | 8 models; step-1 prices in 2.2 |
| 7 | Cum funcționează | 7496 / 1232 | White | Operational timeline from measure to install | Measure 30 to 60 min; produce 3 to 12 days; install 1 to 2 days; total 7 to 10 days |
| 8 | Manager | 8728 / 693 | Light grey | Put a named human salesperson in front of the buyer | 10+ years experience; free measurement; reply within 2 hours; no hidden costs |
| 9 | Ce spun clienții | 9421 / 538 | White | Text testimonials | 4 quotes, first name plus initial and locality |
| 10 | Recenzii video | 9958 / 493 | Light grey | Video testimonials | 3 videos |
| 11 | FAQ (#faq) | 10451 / 727 | White | Objection handling: warranty meaning, promo colour, install time, installation included, showroom visit, what Metal Plus is | 6 questions |
| 12 | Form | 11178 / 958 | White | Capture a free measurement request | Reply within 2 hours; data used only for the quote |

Hero anatomy: centred single column. Pill with a pulsing green dot and a live count; H1 (two lines,
centred, about 984 px wide); one-sentence subline; inline stat row of three items separated by small
dots (values animate up from 0 on load); orange filled CTA "Vezi ofertele" with chevron plus plain text
link "Vezi modelele" with arrow; a white summary card with an orange left border containing a bold lead
line and 5 bullet facts with bold lead-ins; large rounded image below (856 x 642, 4:3).

Portfolio anatomy: header row with H2 and subline left, "Vezi toate" link right. One horizontal row of
420 px cards in a native overflow scroller, scrollbar hidden, no snap, no arrows, no dots, no autoplay.
Card is a link: rounded image 418 x 278 (3:2) with a model chip top left and a length or "new job" chip
bottom right overlaid on the image, then an H3 title and a locality line.

Offer cards anatomy: centred H2 in large uppercase, subline, then a status row with a red pill countdown
("expires in" plus days and hh:mm:ss) and an amber pill stock note. Grid: 3 columns of 368 px, 4 cards
(3 plus 1 wrapping). Card 294 wide, top to bottom: image 292 x 366 (4:5) holding three stacked colour
renders; discount badge top right on the image; row of three circular colour swatches centred under the
image (each a button labelled with colour name and RAL code, swaps the image); H3 model code; "de la" +
large price + "lei/m²"; struck list price with a small saving chip; 2 x 2 spec grid of label over value
(Material, Grosime, Garanție, Fixare); one-line tagline; small note that the PlusDV line exists with a
30-year warranty. No button inside cards; a single "Vezi toate modelele" link under the grid.

Four-step process block (requested): one grey panel (1024 x 777, 32 px radius) holding a centred H2 on
three short lines and a subline, then a 3-column grid of white tiles (304 x 200, 16 px radius):

| Grid cell | Tile type | Contents |
|---|---|---|
| Row 1, col 1 | Step | Grey "Pas 1" label over bold 18 px H3: contact by call, message or form |
| Row 1, col 2 | Step | "Pas 2": estimate plus free measurement |
| Row 1, col 3 | Step | "Pas 3": crew installs, buyer relaxes |
| Row 2, col 1 | Step | "Pas 4": 20-year manufacturer anticorrosion warranty, with a small sub-note on material and 0.50 mm thickness |
| Row 2, col 2 | Stat tile | Small grey lead-in, big orange 60 px / weight 900 counter (animates 0 to 36), small dark caption: interest-free instalments |
| Row 2, col 3 | Stat tile | Small grey lead-in, big orange 60 px value "1-2 zile", caption: anywhere in Moldova |

Under the tiles, inside the same panel: a bold question line about price, a one-line promise of an answer
in 60 seconds, and an arrow link to the calculator. Steps carry no icons or connectors; numbering is text
only.

Stat tiles on this page, full list: hero inline stats (3, animated counters, no tile chrome) and the two
orange stat tiles above.

Custom block: two columns. Left: H2, paragraph with a bold phrase, 3 check bullets, button. Right: 2 x 2
square images (243 px each).

Calculator: centred header, 5-segment progress bar, "step 1 of 5" label, H3 question and subline, 2 x 2
option cards (image 302 x 378, 4:5, discount badge top right, model name, price per m², struck price),
a full-width "all models (8)" button, a full-width primary "Continuă" button, a fast-lane text button for
catalogue plus price, a green WhatsApp button and a phone line.

How it works: centred header, 3 step columns each with a 32 px numbered circle, "Pas N" label, H3 verb
(measure, produce, install), one sentence and a duration; the middle column sits 36 px lower (stagger).
Below: a 16:9 video thumbnail (1024 x 576) with a play button, a total-time line, and a call CTA link.

Manager: image left (512 x 533), right column: eyebrow, H2 first name, role line, short bio, 4 check
bullets, full-width call button.

Text testimonials: 4 cards in a row (200 px text column each), quote on top, round initial-letter avatar
with name and locality below; no photos or stars.

Video reviews: 3 thumbnails (331 x 186, 16:9) in a row with play buttons.

FAQ: 6 native `details` elements, all closed on load, single column 768 px.

Form: centred white card: hidden honeypot field; labelled inputs for full name (placeholder example name),
phone (placeholder +373 pattern); model select with 9 options (4 models x 2 lines plus "not sure");
optional details textarea; full-width submit; reply-time line; privacy and terms links; a reassurance
note on data use.

### 4.2 /acoperisuri/copertine/

| # | Section | Height | Background | Communicative job | Factual claims |
|---|---|---|---|---|---|
| 1 | Hero | 672 | #141414 with full-bleed image | Twelve carport models, from post-supported to cantilever and architectural, made and installed locally | Made in Moldova, installed by own crews; 3 roofing options; free measurement; nationwide |
| 2 | Cum alegi modelul potrivit | 1277 | Default | Teach the buyer to choose by site constraints, not looks | 5 structural families mapped to model codes |
| 3 | Cele 12 modele | 2038 | #141414 | Catalogue of all 12 models | Each built to the yard's dimensions; images show standard configurations |
| 4 | Cum lucrăm | 535 | Default | 4-step process with fixed final price before fabrication | Measurement is required for a correct price; quote lists model, size, roof type, foundation |
| 5 | CTA band | 215 | Navy rounded band | Unsure buyers: describe cars and yard, get a visit | Final price after measurement |
| 6 | Alte materiale | 757 | Default | Cross-sell roof materials, soffit and fences from the same crew | Metal, ceramic, volcanic stone tile and bituminous shingle; hidden-fix soffit; own-workshop fences with installation included |
| 7 | FAQ | 506 | Default | Objection handling: no prices, lead time, roofing choice, snow load, permits, near a boundary | 6 questions |
| 8 | Form | 569 | Default | Capture a quote request | Reply within 2 hours; phone alternative |

Hero anatomy: breadcrumb top left; image fills the section with a left-to-right dark gradient (solid for
the first quarter, fading to clear) so text sits on the dark side; H1 on two lines (category, then
count); paragraph; row of three chips separated by dots; orange filled "Cere ofertă" button plus text
link to the model grid. No stat tiles.

Chooser bento: centred header with accent word. Grid of 5 tiles in 3 columns. Row 1: a double-width tile
(text left 360 px: H3, paragraph, model-code chips; image right 424 x 456) plus a single tile (image
416 x 260 on top, 8:5, then H3, paragraph, chips). Row 2: three single tiles of the same anatomy. Chips
are small rounded labels of model code and name.

Model grid: dark section, 3 columns of 411 px, 12 cards, each a link: image 411 x 308 (4:3) with a dark
overlay and a structural-category chip top left; below, model code and name inline, then a one-line
descriptor. No prices, no buttons.

Four-step process block (requested): 4 tiles in one row (308 x 238 each, gap 16 px), light grey fill,
32 px radius, no border. Tile anatomy: orange circle numeral (40 px, white 14 px digit) top left, H3 below
it, 2 to 4 line paragraph. No connectors, no icons, no durations.

| Step | Job (own words) |
|---|---|
| 1 | Site measurement: span, ground and car access checked; no price without it |
| 2 | Quote with exact configuration and final price, not a per-m² estimate |
| 3 | Fabrication to order for the chosen model and span |
| 4 | Installation of structure, roof and drainage; handover clean and working |

CTA band: navy (rgb 0, 48, 73) rounded 24 px band, H2 and paragraph left, button right.

Cross-sell cards: 3 columns, each a link card 416 wide: image 416 x 260 (8:5), H3, one line, "Vezi" link.

FAQ: 6 disclosure buttons with chevron icons, collapsed on load.

Form: white card 672 wide, 16 px radius: hidden honeypot, name (required), phone (required), consent
checkbox linked to the privacy policy, full-width submit; reply-time line with phone number; data-use
note.

---

## 5. Photo manifest

Classification key: **Real** = real project photograph; **Product render** = manufacturer or brand
product render or cut-out; **Stock-type** = generic staged or stock-style scene, or a photoreal
visualisation that cannot be verified as a real job; **Video** = video file or video thumbnail.
Classification is by on-screen inspection; "appears" marks judgement calls.

### 5.1 fatade3d.md/acoperisuri/

| Section | Slot ID | Depicts | Aspect (rendered; source) | Type | RC photo only |
|---|---|---|---|---|---|
| Hero | F-HERO-V1 | 18 s live-action clip: two men outside a house looking up at a roof, ends on a brand end card | 16:9; 1280 x 720 | Video (real footage plus brand card) | Yes |
| Offer cards | F-OFF-01 | Pitched-roof house mid slate-to-metal swap, workers on roof, red membrane exposed | 0.81:1; 4:3 | Stock-type (composited illustration style) | No |
| Offer cards | F-OFF-02 | Same house type mid swap to shingle, workers, red band | 0.81:1; 4:3 | Stock-type (composited) | No |
| Offer cards | F-OFF-03 | House with new roof partly clad, red membrane section, ladder | 0.81:1; 4:3 | Stock-type (composited) | No |
| Offer cards | F-OFF-04 | House with dark roof, red membrane section, worker | 0.81:1; 4:3 | Stock-type (composited) | No |
| Before/after | F-BA-1A | Green three-storey house, new roof, drone view | 1.78:1; 4:3 | Real | Yes |
| Before/after | F-BA-1B | Same house before, scaffolding and debris | 1.78:1; 4:3 | Real | Yes |
| Before/after | F-BA-2A | Single-storey house with new dark roof, field in front | 1.78:1; 4:3 | Real (appears retouched sky) | Yes |
| Before/after | F-BA-2B | Same house before, old roof | 1.78:1; 4:3 | Real | Yes |
| Before/after | F-BA-3A | Two-storey villa after roof renovation, drone | 1.78:1; 4:3 | Real | Yes |
| Before/after | F-BA-3B | Same villa before, roof under tarp | 1.78:1; 4:3 | Real | Yes |
| Before/after | F-BA-4A | House with garage after, drone | 1.78:1; 4:3 | Real | Yes |
| Before/after | F-BA-4B | Same house before | 1.78:1; 4:3 | Real | Yes |
| Portfolio | F-PORT-1 | Drone top-down of a finished roof, Trușeni | 2:1; portrait source | Real | Yes |
| Portfolio | F-PORT-2 | Drone of finished roof, Mereni | 2:1; portrait source | Real | Yes |
| Portfolio | F-PORT-3 | Drone of finished roof in trees, Lozova | 2:1; 4:3 source | Real | Yes |
| Portfolio | F-PORT-4 | Drone of finished roof, Drochia | 2:1; portrait source | Real | Yes |
| Portfolio | F-PORT-5 | Drone of hipped roof, Cojușna | 2:1; portrait source | Real | Yes |
| Portfolio | F-PORT-6 | Drone of dark roof among neighbours, Donici | 2:1; 16:9 source | Real | Yes |
| Portfolio | F-PORT-7 | Drone of roof in village, Mălăiești | 2:1; 16:9 source | Real | Yes |
| Portfolio | F-PORT-GAL | Hidden per-project lightbox galleries (not rendered, not enumerated) | n/a | Real (assumed from context) | Yes |
| Membrane | F-MEMB-1 | Red membrane roll with printed brand | 1.28:1 | Product render (own brand) | No (needs product image, not a site photo) |
| Testimonials | F-TEST-01 to F-TEST-13 | 13 video thumbnails: homeowners and crew interviewed at houses; one tile is a platform placeholder | 2:1 tile; 16:9 thumbnails | Video (real) | Yes (13 slots) |
| Consult steps | F-CONS-BG | Modern single-storey house exterior, glazed facade, under dark overlay | 1.81:1 cover | Stock-type (architectural visualisation) | No |
| Consult steps | F-CONS-1 | Staff member in branded work jacket holding a roof sample, cut-out on light ground | 4:5 | Real (staff portrait) | Yes |

### 5.2 imperlux.md/garduri/

| Section | Slot ID | Depicts | Aspect (rendered; source) | Type | RC photo only |
|---|---|---|---|---|---|
| Hero | I-G-HERO-1 | Man in hard hat and woman holding a louvre panel sample in a workshop, labelled as the team | 4:3 | Stock-type (staged team scene) | Yes if kept as a team claim |
| Portfolio | I-G-PORT-01 | Presenter standing beside a fence (video-style frame) | 3:2 | Real | Yes |
| Portfolio | I-G-PORT-02 | Vertical fence at a church, text overlay on image | 3:2 | Real (with overlay) | Yes |
| Portfolio | I-G-PORT-03 | Fence with gabion posts, house behind, text overlay | 3:2 | Real (with overlay) | Yes |
| Portfolio | I-G-PORT-04 | Couple in front of a custom fence | 3:2 | Real | Yes |
| Portfolio | I-G-PORT-05 to I-G-PORT-24 | 20 finished fences at houses across Moldova (street views, gates, corners, one with site soil) | 3:2 | Real | Yes (20 slots) |
| Offers | I-G-OFF-IL12-7016 / -8019 / -9005 | IL12 louvre panel close-up in three colours | 4:5 | Product render | No |
| Offers | I-G-OFF-IL30-7016 / -8019 / -9005 | IL30 panel close-up in three colours | 4:5 | Product render | No |
| Offers | I-G-OFF-IL100-7016 / -8019 / -9005 | IL100 panel close-up in three colours | 4:5 | Product render | No |
| Offers | I-G-OFF-IL40-7016 / -8019 / -9005 | IL40 panel close-up in three colours | 4:5 | Product render | No |
| Custom | I-G-CUST-1 to I-G-CUST-4 | Gate or panel with laser-cut decorative pattern, isolated | 1:1 | Product render | No |
| Calculator | I-G-CALC-IL12 / IL30 / IL30D / IL100 | Panel close-ups per model | 4:5 | Product render | No |
| How it works | I-G-HOW-V1 | Video thumbnail: installer in branded hoodie in a workshop | 16:9 | Video (real) | Yes |
| Manager | I-G-MGR-1 | Woman holding a louvre panel sample, studio portrait (two sources, one per breakpoint) | about 1:1.04 | Stock-type (staged portrait) | Yes if kept as a named person |
| Video reviews | I-G-VID-1 to I-G-VID-3 | Client interviews at finished fences | 16:9 | Video (real) | Yes (3 slots) |

### 5.3 imperlux.md/acoperisuri/copertine/

| Section | Slot ID | Depicts | Aspect (rendered; source) | Type | RC photo only |
|---|---|---|---|---|---|
| Hero | I-C-HERO-1 | Angular architectural carport lit at dusk over a car, beside a house | 2.09:1 cover | Stock-type (photoreal visualisation) | No |
| Chooser | I-C-CH-1 | Post-supported carport over a white car on a lawn | 0.93:1 | Stock-type (visualisation) | No |
| Chooser | I-C-CH-2 | Cantilever carport along a white wall | 8:5 | Stock-type (visualisation) | No |
| Chooser | I-C-CH-3 | Wall-anchored carport over a narrow drive | 8:5 | Stock-type (visualisation) | No |
| Chooser | I-C-CH-4 | Arched polycarbonate carport over a car | 8:5 | Stock-type (visualisation) | No |
| Chooser | I-C-CH-5 | Architectural carport, modern setting | 8:5 | Stock-type (visualisation) | No |
| Models | I-C-M-IL301 to I-C-M-IL311 (11 slots) | One carport per model in a standard residential setting (posts, cantilever, wall, gable, arc, boxed edge, inclined posts, snow scene, open profiles) | 4:3 | Stock-type (photoreal visualisations) | No |
| Models | I-C-M-IL312 | Asymmetric lit carport at dusk (same scene family as hero) | 4:3 | Stock-type (visualisation) | No |
| Cross-sell | I-C-X-1 | Aerial of a finished metal-tile roof | 8:5 | Real (appears) | Yes |
| Cross-sell | I-C-X-2 | Close-up of soffit under eaves | 8:5 | Real (appears) | Yes |
| Cross-sell | I-C-X-3 | Louvre fence with gate between pillars | 8:5 | Real | Yes |

Note on the model grid: two model images (the snow scene and the one with a forged gate) could be real
photographs; they are classified conservatively as visualisations because the page states images show
standard configurations.

### 5.4 dasterum.md/tigla-metalica/

| Section | Slot ID | Depicts | Aspect (rendered; source) | Type | RC photo only |
|---|---|---|---|---|---|
| Listing grid | D-LIST-1 | Monterrey sheet, green, isolated, watermark | 1:1; 488 x 488 | Product render (manufacturer) | No |
| Listing grid | D-LIST-2 | Valencia sheet, wine red, isolated, watermark | 1:1 | Product render | No |
| Listing grid | D-LIST-3 | Modular tile, graphite, isolated, watermark | 1:1 | Product render | No |
| Listing grid | D-LIST-4 | Kascad sheet, blue, isolated, watermark | 1:1 | Product render | No |
| Detail page | D-DET-MAIN | Selected profile render in the chosen colour (one slot per product page) | 1:1 | Product render | No |
| Detail page | D-DET-DWG | Profile cross-section drawing with dimensions | 2.7:1; 590 x 220 | Technical drawing | No |

### 5.5 Slots only a Rapid Construct site photo can satisfy

Counted from the tables above (a range row counts as its number of slots):

| Page | Slots flagged RC photo only | Breakdown |
|---|---|---|
| fatade3d /acoperisuri/ | 30 plus hidden galleries | hero video 1, before/after 8, portfolio 7, testimonials 13, staff portrait 1, plus F-PORT-GAL |
| imperlux /garduri/ | 30 | portfolio 24, how-it-works video 1, video reviews 3, hero team 1, manager 1 |
| imperlux /copertine/ | 3 | cross-sell 3 |
| dasterum /tigla-metalica/ | 0 | all product renders or drawings |

Pattern: every block that makes a proof claim (before/after, portfolio, testimonials, team, process
video) needs a real site photo; every block that explains a product or a structural option runs on
renders or visualisations.

---

## 6. Row counts

| Table | Rows |
|---|---|
| 1.1 Header navigation | 6 |
| 1.2 Catalog taxonomy | 7 |
| 2.1 Dasterum product records | 10 |
| 2.1 Dasterum colour legend | 15 codes (8 table rows) |
| 2.2 Imperlux fence records | 12 |
| 2.3 Imperlux carport records | 12 |
| 2.4 fatade3d membrane records | 4 |
| 2.4 fatade3d service offers | 4 |
| 2.4 fatade3d consultation prices | 3 |
| 3 fatade3d section order | 10 |
| 4.1 garduri section order | 12 |
| 4.1 garduri four-step grid | 6 |
| 4.2 copertine section order | 8 |
| 4.2 copertine four steps | 4 |
| 5.1 Photo manifest fatade3d | 25 rows covering 36 slots |
| 5.2 Photo manifest garduri | 15 rows covering 50 slots |
| 5.3 Photo manifest copertine | 11 rows covering 21 slots |
| 5.4 Photo manifest dasterum | 6 rows |
| 5.5 RC-only summary | 4 |

## 7. Access notes

- No page blocked, rate-limited or required login. All targets loaded on first request.
- fatade3d and dasterum show cookie or consent notices; none were accepted. Imperlux counters and the
  "people requesting today" figure are dynamic and changed between loads (36, then 37).
- Browser screenshots in this session rendered stale or partial frames, so structure was read from the
  DOM and computed styles; images were inspected on screen only for classification.
