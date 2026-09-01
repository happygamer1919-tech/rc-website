# RC WEBSITE MASTER PLAN

> **SCOPE HEADER — READ FIRST**
> This document applies **only** to the Rapid Construct MD website project (GitHub repo: `rc-website`).
> If the current task is not the Rapid Construct website, ignore this file entirely and do not load it into context.
> This file is the single source of truth for the build. Where this document and a chat instruction conflict, ask before deviating.

**Owner:** Ivan
**Client:** Mihai, owner of Rapid Construct MD
**Repo:** `rc-website` (GitHub, private until approved)
**Predecessor build:** rapidconstruct-web.vercel.app (stays live, do not reuse its code)
**Status:** design phase
**Hard date:** approvable sample by Friday

---

## 1. Why this rebuild exists

The first build was rejected by the client. Diagnosed causes, measured on the live site:

1. The page is 13,312px tall across 11 sections. One section, the scroll-driven "От 3D проекта до готового дома" stage sequence, is 5,081px on its own, 38% of the page. While inside it the page does not advance, text fades in and out and a thumbnail strip scrolls horizontally. This is the primary object the client is reacting to. **It is deleted, not reworked.**
2. Four near-identical light background values are in use (`#FAF8F5`, `#FFFFFF`, `#F3EFE9`, plus `#1C1C1C`). At normal viewing distance the light three read as a dirty screen rather than as deliberate sections. This is the client's "white to grey transition" complaint, verbatim and correct.
3. Playfair Display serif headings at 92px read as architectural magazine, not construction contractor.
4. Visible defects: transparent header lets the logo overlap section headings on scroll, the nav item "О нас" wraps to two lines, the thumbnail strip is clipped at the right viewport edge.

**Design principle for the rebuild:** zero scroll-driven motion, zero parallax, zero animated renders. Everything static. Information density high, page short, contact always reachable.

---

## 2. Reference analysis (client-approved sites)

Three sites the client stated he likes: `imperlux.md/garduri/garduri`, `fatade3d.md`, `casabuna.md/ro`.

What all three share, and what the RC build must therefore do:

| Pattern | Evidence |
|---|---|
| Heavy sans-serif headings, uppercase, no serif | Imperlux system sans 60px/700; Fațade 3D Unbounded 40px/800 all caps; Casa Buna Arial 55px uppercase. Two of the three load no custom webfont at all. |
| Hard numbers visible before any scroll | Imperlux: 4 models with lei/m² in a bordered hero box. Fațade 3D: 4 counters in the hero. Casa Buna: bed/bath/m² chips on every project card. |
| Two hero CTAs side by side, one filled one outline | All three |
| Contact permanently reachable | Phone in header on all three; floating WhatsApp/call on Imperlux and Casa Buna; a named "Calculator" nav item on Imperlux and Casa Buna |
| Cards, not narratives | Image + title + spec chips + button. Portfolio filter tabs on Casa Buna and Fațade 3D. No scroll sequences anywhere. |
| Hard-edged, strongly contrasting section backgrounds | Imperlux white / `#F5F5F7`. Fațade 3D white / `#F4F4F4` / near-black bands. Casa Buna white / deep purple. Every transition is a hard edge. |
| Short pages | Imperlux 5,083px, Casa Buna 7,441px, Fațade 3D 9,960px. RC's rejected build: 13,312px. |
| One accent colour used loudly | Imperlux orange, Fațade 3D crimson, Casa Buna purple, applied to buttons, numerals, eyebrows, logo. |
| Static numbered process block | Fațade 3D runs 01 to 06 as plain numbered text, no motion. This replaces RC's 3D scroll section. |

**Interpretation of the client's background instruction:** he meant the Casa Buna model, obviously different neighbours with hard edges, not a small shade shift. The rebuild uses three background values only and never places two similar ones next to each other.

---

## 3. Locked decisions

Approved by Ivan. Do not reopen without his sign-off.

| Decision | Choice |
|---|---|
| Hero visual | **No photo.** Plain light background, headline, stat row, two CTAs, price box (Imperlux model). |
| Prices | **Published.** Per m² figures visible in the hero. |
| Header | **White bar carrying a dark pill.** Solid, opaque, fixed. The bar is `#FFFFFF` with a 1px `--line` bottom border; the nav, phone, CTA and language switcher sit inside a `#141414` pill with a 999px radius. Not transparent, and not floating: the bar is fixed and `<body>` carries a constant spacer. *Amended 2026-09-01, W8-04. This row previously read "Not transparent, not a floating dark pill", which the built header contradicted from phase 1 onward. Ratified by Ivan; see DECISIONS.md.* |
| Languages | **RO + RU.** RO is the default locale at `/`, RU at `/ru`. Language switcher in the header. |
| Copy | Sourced from the existing build, restructured and re-laid-out. Not rewritten from scratch. |
| Photos | Not selected at build time. Build ships with labelled placeholders. See section 7. |
| Motion | None. No scroll-triggered animation, parallax, counters that count up, or carousels that auto-advance. |

**Open item: logo.** The existing build has no logo file; the wordmark is typeset HTML text in Playfair Display. Ivan is supplying a logo image. Until the file is in hand, the header uses a text wordmark in the new heading font as a placeholder. A vector (SVG or AI/EPS) is preferred over JPG; a JPG will need background removal before it is usable on a white bar.

---

## 4. Design tokens

### Colour

| Token | Value | Use |
|---|---|---|
| `--brand` | `#F26419` | Primary buttons, active states, numerals, logo mark |
| `--brand-dark` | `#B23C08` | Eyebrow labels, link hover, small text on light |
| `--ink` | `#1C1C1C` | All body and heading text on light backgrounds |
| `--ink-muted` | `#5A5A5A` | Secondary text, captions, form hints |
| `--bg-light` | `#FFFFFF` | Section background A |
| `--bg-grey` | `#F2F2F2` | Section background B |
| `--bg-dark` | `#141414` | Section background C, white text |
| `--line` | `#E2E2E2` | Card borders, dividers |

**Background rule, non-negotiable:** exactly these three background values. Sections alternate `--bg-light` and `--bg-grey` with hard edges. `--bg-dark` is used exactly twice, on the stats band and the contact footer. No gradients, no fades, no fourth off-white, no `rgba` overlays that create in-between shades.

### Type

Single family: **Inter**, already in use, keeps the build fast and matches Imperlux's plain-sans approach.

| Element | Desktop | Mobile | Weight | Case |
|---|---|---|---|---|
| h1 | 56px | 32px | 800 | UPPERCASE |
| h2 | 40px | 26px | 800 | UPPERCASE |
| h3 / card title | 22px | 19px | 700 | Sentence |
| Eyebrow | 13px | 12px | 700 | UPPERCASE, letter-spacing 0.08em, `--brand-dark` |
| Body | 17px | 16px | 400 | Sentence |
| Stat numeral | 44px | 32px | 800 | — |

Line height 1.15 on headings, 1.6 on body. No Playfair Display, no serif anywhere.

> **A/B for the design mockup:** produce the heading treatment twice, once in Inter 800 uppercase and once in Unbounded 800 uppercase. Mihai picks one. Everything else identical between the two.

### Layout

- Container max-width 1200px, side gutter 24px desktop / 16px mobile.
- Section vertical padding 96px desktop / 56px mobile. Identical on every section.
- Grid: 3 columns desktop, 2 tablet, 1 mobile.
- Border radius: 6px on buttons, 10px on cards and images. Squarish, matching the Fațade 3D header direction.
- Buttons: primary is filled `--brand` with white text; secondary is 1px `--ink` outline, transparent fill. Height 48px, horizontal padding 28px.
- No shadows except a single subtle one on cards: `0 1px 3px rgba(0,0,0,0.08)`.

---

## 5. Section specification

Eight sections. Target total page height 7,000 to 8,000px desktop. If the build exceeds 9,000px, something has been over-built.

### 5.1 Header (sticky)

`--bg-light`, opaque, 1px bottom border `--line`, height **96px desktop / 80px mobile** (amended 2026-09-01, W8-04; this read 72px and never matched the build).
Left: logo. Centre: nav (Acasă, Servicii, Portofoliu, Despre noi, Contacte). Right: phone number as a clickable link, primary CTA button "Solicită ofertă", RO/RU switcher.
These sit inside a `#141414` pill, 64px tall, compressing to 56px on scroll (52px mobile).
Mobile: logo, phone icon, hamburger.
**Fix carried over:** opaque background so nothing overlaps on scroll; `white-space: nowrap` on nav items so none wraps to two lines.

### 5.2 Hero — `--bg-light`

No photo. Left-aligned or centred, single column.
- Eyebrow: work area line (all of Moldova).
- h1: existing headline, reworded to uppercase.
- One-sentence subhead from existing copy.
- Stat row, four items: 500+ proiecte, 15+ ani, 30 ani garanție scrisă, 4.9/5 din 250+ recenzii. Numerals in `--brand`, static, no count-up.
- Price box, bordered, `--brand` left border 4px: the published per-m² figures and the standing offer (minus 10% early booking, 0% installments on roofing, 160 lei/m² frozen for 2026).
- Two CTAs: "Solicită ofertă gratuită" (filled), "Sună acum" (outline).

### 5.3 Services — `--bg-grey`

Eyebrow, h2, one-line intro. 3x3 card grid, nine services, copy already written:
case la cheie, acoperișuri, fațade, reparații la cheie, finisaje, proiectare și vizualizare 3D, rețele inginerești, construcții industriale, terasamente.
Each card: photo (4:3), title, two-line description, text link. Photo slot is a placeholder at build time.

### 5.4 Process — `--bg-light`

**This is the replacement for the deleted 3D scroll section.** Static, one screen, no motion.
Eyebrow, h2, five numbered steps in a row (2 rows on tablet, stacked on mobile). Each step: large numeral 01 to 05 in `--brand`, title, one line, one photo.
Steps: Fundație, Structură și ziduri, Acoperiș, Fațadă, Finisaje și predare.
The stage copy and images from the old scroll section are salvaged into here.

### 5.5 Portfolio — `--bg-grey`

Eyebrow, h2, filter tabs (Toate, Case la cheie, Acoperișuri, Fațade, Reparații, Finisaje). Filters are client-side, instant, no animation.
Six project cards: cover photo (3:2), category chip, title, one-line description, location. Optional lightbox with up to three extra photos per project.
"Vezi tot portofoliul" button below the grid.

### 5.6 Stats band — `--bg-dark`

Short band, white text, four figures repeated from the hero at larger scale, plus the coverage line naming the localities served (Chișinău, Codru, Coșnița, Costești, Căinari, Sociteni). No photo. This is one of only two dark sections.

### 5.7 Why us + testimonials — `--bg-light`

Two blocks in one section, separated by a divider.
- Six trust points in a 3x2 grid: garanție 30 ani în contract, materiale cu certificare UE, predare la termen, echipă cu 10+ ani experiență, prețuri transparente, suport după predare. Icon or numeral, title, one line. No photos.
- Three testimonials as bordered cards: quote, name, city and work type. Static, no carousel.

### 5.8 Quote form — `--bg-grey`

Eyebrow, h2, one line promising a reply within two working hours.
Fields, all carried over: Nume, Telefon, Tip lucrări (select, ten options), Localitate, Mesaj (optional), consent checkbox, honeypot. Submit button filled `--brand`.
Two-column layout desktop, single column mobile.

### 5.9 Contact footer — `--bg-dark`

White text. Left: logo, one-line description, the standing offer line. Middle: nav repeat and service links. Right: address Nicolae Zelinski 24 Chișinău, phone +373 76 837 180, email rapidconstructmd@gmail.com, hours Luni to Sâmbătă 08:00 to 17:00.
Two CTAs repeated. Floating WhatsApp and call buttons, bottom right, present on every scroll position.

---

## 6. Copy

**Do not write new copy.** The existing build at rapidconstruct-web.vercel.app carries finished RU and RO text that took real effort: nine service descriptions, six portfolio captions, three testimonials, six trust points, the stats, the form labels including all ten work types, the standing offer line, and full contact details.

Build task: pull both locales from the live site (`/ro` and `/ru`), place them into `locales/ro.json` and `locales/ru.json`, then re-lay-out. Permitted changes: shortening a sentence, converting a heading to uppercase, splitting a paragraph into a card. Not permitted: inventing services, changing figures, changing guarantees, changing prices.

---

## 7. Photo strategy

Photos are selected **after** the build, against the finished layout, by Ivan and Mihai together. This is the correct order: the slots define the shots.

Build requirement: every image slot ships as a labelled placeholder showing the slot ID, the target aspect ratio and the pixel dimensions, so it is obvious what belongs there and what is missing. Swapping placeholders for real files must be a one-directory drop, no code changes: `/public/img/<slot-id>.jpg`.

The slot inventory and the shooting batches are in the companion file `RC-PHOTO-MANIFEST.md`.

Technical spec for every supplied photo:
- Minimum 1600px on the long edge.
- Landscape only for grid and cover slots. Vertical phone photos are unusable there.
- JPG, compressed under 400KB after processing.
- No watermarks, no third-party logos, no date stamps, no people's faces without permission.
- Real Rapid Construct work only. If a slot has no real photo, the slot is removed rather than filled with stock.

---

## 8. Build sequence

| Step | Output | Owner |
|---|---|---|
| 1 | Design mockup, full landing page, desktop and mobile, two heading-font variants | Claude Design |
| 2 | Mockup approved by Mihai as an image, before any code exists | Ivan and Mihai |
| 3 | Repo `rc-website` created on GitHub | Ivan |
| 4 | Build from this document plus the approved mockup, placeholders for all photos | Claude Code (terminal) |
| 5 | Preview deploy, sample shown to Mihai | Ivan |
| 6 | Photo selection session against the live sample | Ivan and Mihai |
| 7 | Photos dropped in, final review, move to host, go live | Ivan |

**What Claude Design must hand over for step 4**, and what must not be accepted instead of it:
- Full-page screenshots, desktop and mobile, per section.
- A token sheet: exact hex values, font sizes, weights, spacing scale, radii, section padding.
- Raw HTML/CSS if it will produce it.
A prose prompt alone is not an acceptable handover. Most of the design is lost and the build reinvents it.

**Stack:** static-first. Next.js App Router with static export, or plain HTML plus Tailwind if that ships faster. No CMS, no database, no animation library. Form posts to an email endpoint or a webhook. Deploy target after approval to be decided.

---

## 9. Client-handling rules

Mihai has low technical fluency and cannot specify what he wants, but he reacts accurately to something concrete in front of him. The one precise thing he has said, the background transitions, came from reacting to the live site.

1. Never ask him an open question about design. Every approval point is binary: A or B, both rendered.
2. Approve on the mockup image, not on the built site. Changes are free before code and expensive after.
3. The section list in part 5 is frozen. New sections after approval are a new scope, not a revision.
4. Keep the rejected build live as the comparison artefact. When he wavers, show old versus new side by side.

---

## 10. Standing constraints

- No scroll-driven motion of any kind.
- Exactly three background values, hard edges only.
- Page under 9,000px desktop.
- No section taller than 1,400px except the portfolio grid.
- Contact reachable from every scroll position.
- Both locales must stay in sync; a string added to one is added to the other in the same commit.
