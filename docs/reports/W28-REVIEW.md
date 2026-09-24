# W28-REVIEW · the full site review after wave 28, 2026-09-24

**Card W28-21, on the wave-close tree, which is byte-identical to `main` at
`36669bd9082261918000d86afef133d6c65bbcd7`** (`git diff --stat origin/main w28/w28-19-geo` prints nothing),
after every wave 28 card merged and verified live. The pass is the W27-REV-01 shape (the dispatch's "CRITIC per
CLAUDE.md" names no procedure in the repo, see W28-RUN deviation D14): every gate, a rendered crawl of every
built page in both locales at 1440, 768 and 390 in headless Chrome (the session's `review-crawl.js`: links
resolved against the built tree, images by file and alt, console and exception listeners, `scrollWidth`
against `clientWidth`, every visible text node's computed size, hub tile hrefs, meta refresh on the redirect
pages, the quote form and its subject on every service page), Lighthouse desktop on the five pages the card
names in both locales (the contact page is the home footer, so its row is the home page), and a taste pass
over screenshots at 390 and 1440. Measured 02:00 to 02:17 UTC, sequentially, so no Chrome run contended
with another.

## Gates

33 of 33 gate commands exit 0 (`node scripts/run-gates.js --keep-going`, every command `quality` runs, same
Chrome). Gate commands run: 33 (31 before the wave; W28-13 added gate 31, W28-15 gate 32, W28-17 gate 33,
W28-18 gate 34; gate 4, heights, is the R-Y budget table and has no script).

## The crawl, in numbers

| Check | Result |
|---|---|
| Pages read (both locales, three widths) | 83 pages, 249 page loads |
| Links that do not resolve | **0** |
| Images whose file is missing | **0** |
| Images with an empty `alt` | 43: 22 in the marquee's `aria-hidden` duplicate track (11 per home page), 16 gallery lightbox pictures (W26-R14, no captions; one per service page in each locale), 5 on the unlisted `/review/` page, 0 elsewhere |
| Console errors and uncaught exceptions | **0** |
| Pages scrolling sideways at 390, 768 or 1440 | **0** |
| Visible text under 14px | 60 nodes: 36 SVG diagram labels at 9px (the metal tile profiles, known since W27-REV-01, paint at about 15.75px) and **24 new: the three hero stat labels at 13px on both home pages at 768 and 390** (W28-22's phone rule), see Defects |
| Hub tiles whose href is a same-page anchor | **0** |
| Redirect pages carrying their meta refresh | 14 of 14 (16 in W27: the two roofing category pages are pages again since W28-13) |
| Service pages with the quote form and its subject | 30 of 30 |

## Lighthouse, desktop, median of three (local server)

| Page | Performance (three runs) | Accessibility | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` | 99 [99 99 99] | 100 | 100 | 100 | 0.95s | 0.002 |
| `/ru/` | 99 [99 99 99] | 100 | 100 | 100 | 0.95s | 0.044 |
| `/servicii/acoperisuri/` | 97 [97 97 97] | 100 | 100 | 100 | 1.22s | 0.001 |
| `/ru/servicii/acoperisuri/` | 97 [97 97 97] | 100 | 100 | 100 | 1.22s | 0 |
| `/servicii/garduri/` | 99 [99 99 99] | 100 | 100 | 100 | 0.86s | 0 |
| `/ru/servicii/garduri/` | 99 [99 99 99] | 100 | 100 | 100 | 0.86s | 0 |
| `/catalog/` | 97 [97 97 97] | 100 | 100 | 100 | 1.20s | 0 |
| `/ru/catalog/` | 97 [97 97 97] | 100 | 100 | 100 | 1.21s | 0 |

Every reading is at or above the section 4 floors. Total blocking time is 0ms on every run. The roofing
page's bimodal reading of wave 27 (92 or 98) is gone: three identical 97s on both locales, the LCP being
the first hub tile's picture at 1.2s.

## Defects

1. **The hero stat labels read 13px on phones and tablets** ("proiecte finalizate", "ani de experiență",
   "ani garanție scrisă" and the Russian three), set by W28-22's rule `.stat__label { font-size: 13px; }`
   inside the under-1024 block so that three stats fit one row at 390. The crawl's floor is 14px and no
   other wave 28 text is under it. **Fix card W28-FIX-01**: 14px, and prove the Russian labels still fit
   three in a row at 320 and 390 without clipping (the longest, "лет письменной гарантии", wraps to two
   lines at 390 today and may wrap to three at 14px, which is allowed; overflow is not).

No other defect was found by the gates, the crawl or Lighthouse.

## Findings that are not defects, recorded

- **Text under 14px that is SVG diagram text**: the metal tile profile diagrams' dimension labels, as in
  W27-REV-01; the computed size reads 9px, the glyphs paint at about 15.75px. Left as is.
- **`alt=""` in three known groups**: gallery pictures under W26-R14, the marquee's duplicate track, the
  unlisted review page. As in W27-REV-01.
- **The Russian home page's layout shift of 0.044** is the hero panels moving when the web font loads
  (Lighthouse names `.hero-panels` and the `h1`, cause "Web font loaded"); the Romanian page reads 0.002
  with the same markup, so it is the Cyrillic fallback metrics, not the wave's changes. Under the 0.1
  threshold; a `size-adjust` on the fallback face is the lever if it ever matters.
- **Two moulding records share one picture**: RED 69 and RED 70 (CAT-0184, CAT-0185) are byte-identical
  because fatade3d.md serves one render for both (Q-W28-03). RED 01 to RED 04 and the rest are distinct
  files from distinct source renders.

## Taste findings, for the morning, not fix cards

- **The roofing service page opens with the hub tiles above its own title.** `/servicii/acoperisuri/`
  renders the "Acoperișuri metalice" bento (Țiglă metalică, Rocă vulcanică Novatik, Calculează prețul,
  Solicită ofertă) before the breadcrumb, the "Acoperișuri" heading and the description. This is the
  W25-24 / W26-R5 arrangement carried through W28-13, which kept the hub on the service page because it
  carries no price (W28-RUN deviation D7). If you would rather the page opened with its description and
  the hub sat after it, above the projects, that is one small card and a ruling, not a fix.
- **The floating WhatsApp and phone buttons cover the right edge of text at 390**: on the home page the
  claim card's second paragraph and on the copertine page the hero lede run under them when the page is
  scrolled to that point. The buttons predate the wave; a 56px right inset on the hero cards at phone
  width would clear them.
- **The mouldings' renders share one scene.** The 66 fatade3d pictures W28-15 installed are the supplier's
  own text-free renders, each a facade corner with the profile drawn in; at card size RED 01 and RED 02
  look alike although they are different files and different profiles. The supplier publishes nothing
  closer; the product page shows the same picture larger. Recorded, no action.
- **The copertine page keeps its four line diagrams** under "Cum alegi copertina" (the type explainer:
  on posts, cantilever, and so on) above the twelve photographed models. They explain a shape rather than
  stand for a product, so W28-14 left them. Reads well; noted so nobody mistakes them for the old model
  sketches.
- **The catalogue index's first tile** (Sisteme de termoizolație) is a heavily branded "STOP FIRE"
  packshot next to nine quieter tiles. Pre-existing; a plainer family picture would sit better.
