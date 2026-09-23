# W27-REVIEW · the full site review, 2026-09-23

**Card W27-REV-01, on `main` at `a9447143ef4f35a1b677d2538ccf5b03768e24b5`**, after every wave 27 card merged and verified live. Two
instruments: `node scripts/run-gates.js` (every command `quality` runs, locally, same Chrome) and a
rendered crawl of every built page in both locales at 1440, 768 and 390 in headless Chrome (the
session's `review-crawl.js`: links resolved against the built tree, images by file and alt, console
and exception listeners, `scrollWidth` against `clientWidth`, every visible text node's computed
size, hub tile hrefs, meta refresh on the redirect pages, the quote form and its subject on every
service page). Lighthouse, desktop preset, median of three, on the four main pages in both locales.

## Gates

29 of 29 gate commands exit 0.. Gate commands run: 29.

## The crawl, in numbers

| Check | Result |
|---|---|
| Pages read (both locales, three widths) | 83 pages, 249 page loads |
| Links that do not resolve | **0** |
| Images whose file is missing | **0** |
| Images with an empty `alt` | 59: 32 gallery lightbox and card pictures (W26-R14, no captions), 22 in the marquee's `aria-hidden` duplicate track, 5 on the unlisted `/review/` page, 0 elsewhere |
| Console errors and uncaught exceptions | **0** |
| Pages scrolling sideways at 390, 768 or 1440 | **0** |
| Visible text under 14px | 36 nodes: 36 x text.[object SVGAnimatedString] at 9px |
| Hub tiles whose href is a same-page anchor | **0** (the product bento's tiles open sections of their own page by ruling W26-R5 and are not counted) |
| Redirect pages carrying their meta refresh | 16 of 16 |
| Service pages with the quote form | 30 of 30 (every page under `/servicii/` in both locales, product pages included); subject prefilled as `[RO|RU] <title> - <path>` on all 30; 78 of the 83 non-redirect pages carry the form, the five without being the two privacy pages, the two "in construcție" pages and the unlisted review page, which is what gate 13 expects |
| Roofing page product cards with a `data-product` lead |  |

## Lighthouse, desktop, median of three (local server)

- / perf 99 [99 99 99] a11y 100 bp 100 seo 100
- /ru/ perf 99 [99 99 99] a11y 100 bp 100 seo 100
- /servicii/acoperisuri/ perf 92 [98 92 91] a11y 100 bp 100 seo 100
- /ru/servicii/acoperisuri/ perf 98 [92 98 98] a11y 100 bp 100 seo 100
- /servicii/case-la-cheie/ perf 100 [100 100 100] a11y 100 bp 100 seo 100
- /ru/servicii/case-la-cheie/ perf 100 [100 100 100] a11y 100 bp 100 seo 100
- /catalog/ perf 99 [99 99 100] a11y 100 bp 100 seo 100
- /ru/catalog/ perf 99 [99 99 100] a11y 100 bp 100 seo 100

## Defects

None found by the crawl or the gates.

## Findings that are not defects, recorded

- **Text under 14px is SVG diagram text**: the metal tile profile diagrams (`.tile-diagram__svg`,
  W14-10) draw their dimension labels at 9 SVG units in a 160x100 box scaled to 280px wide, which
  paints at about 15.75px. The computed `font-size` reads 9px; the rendered glyphs do not. Left as is.
- **Gallery pictures carry `alt=""`** by W26-R14 ("no captions"); the lightbox announces its count.
  A screen reader gets no description of each photograph. A one-line generic alt per gallery (the
  page's title) would be the accessible middle; it is a ruling change, so it is a question, not a fix.
- **The marquee's duplicate logo track** is `aria-hidden` and its logos carry `alt=""` on purpose.

## Taste findings, for the morning, not fix cards

- **The roofing page's Lighthouse performance is bimodal and stays so after W27-FIX-02**: this run read
  92 [98 92 91] on RO and 98 [92 98 98] on RU; five runs on the fix's own branch read 98 four times. The
  slow mode is the first hub tile's picture painting at 1.9s instead of 1.15s. CI's own gate (median of
  three, floor 95) passed on every pull request of the wave. Two levers are left, both taste: a lighter
  first tile picture (ACOP-01 is a 483x580 JPEG) or a `<link rel="preload">` for it. Recorded in
  `docs/reports/W27-FINAL-RUN.md` for the owner; not a fix card, because the condition predates the wave
  (W26-14 measured the same two modes) and the target of 98 to 100 is met on the other seven readings.
- **The Tablă cutată strip tile** is a small watermarked packshot enlarged to a band (Q-W27-01).
- **Imperlux's orange mark** sits in the metal tile, shingle and Creaton previews (Q-W27-02).
- **Eleven rainwater parts ask for a price** where the Dasterum figure used to print (Q-W27-03).
- **The Russian page shows three Romanian colour names** in its chips (Q-W27-02).
- **The Compară table for Sisteme pluviale** is seventeen rows with one column (Dimensiuni) after the
  price column left; it is correct and a little bare. A taste call.
