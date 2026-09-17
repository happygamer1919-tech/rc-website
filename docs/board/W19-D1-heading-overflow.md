# W19-D1 · Long one-word headings overflow their column; the RU privacy page scrolls sideways on phones

| | |
|---|---|
| Found by | Critic, wave 19 boundary, 2026-09-16 |
| Live build | `47957f3`, `https://rapidconstruct.md` |
| Severity rank | 3 of 5 |
| Mode | Not assigned by the critic |

## What a visitor sees

On `/ru/konfidentsialnost/` on a phone, the title "ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ" does
not fit. "КОНФИДЕНЦИАЛЬНОСТИ" is one word and cannot wrap, so it runs off the right
edge and is cut after "КОНФИДЕНЦИАЛЬНОС". The whole page then scrolls sideways, and
the header pill stretches with it (411px wide in a 390px viewport). The RO page,
"POLITICA DE CONFIDENȚIALITATE", wraps and fits.

On desktop, the same heading sticks 25px out past the right edge of the privacy
page's 760px text column. On the RU tile page at 360px, "МЕТАЛЛОЧЕРЕПИЦА" sticks
14px out of its column into the gutter. Neither of those two makes the page scroll.

## Why it happens

The `h1` is set in uppercase Inter 800: 32px up to 768px, 44px up to 1024px, and 56px above that. No
heading rule allows a single long word to break or hyphenate, and nothing reduces
the size for a long word. Only Russian produces words this long at these sizes.

## Evidence, measured on the live site

Headless Chrome, Inter loaded (asserted on every load), every `h1`, `h2` and `h3`
checked. 44 pages x widths 360, 375, 390, 768, 1280 and 1920: **264 combinations
read, 6 failing, all shown**:

| Page | Width | Page scrolls sideways by | Heading overflow |
|---|---|---|---|
| `/ru/konfidentsialnost/` | 360 | 83px | h1 +99px |
| `/ru/konfidentsialnost/` | 375 | 68px | h1 +84px |
| `/ru/konfidentsialnost/` | 390 | 53px | h1 +69px |
| `/ru/konfidentsialnost/` | 1280 | 0 | h1 +25px |
| `/ru/konfidentsialnost/` | 1920 | 0 | h1 +25px |
| `/ru/servicii/tigla-metalica/` | 360 | 0 | h1 +14px |

Everything else passes. A separate check over **every** visible text element
(not only headings) at 390, 768, 1280 and 1920 found no other text wider than its
box.

## Scope

Heading typography sitewide, both locales. The fix must hold for any heading
string, not only these two: the next long RU word should not need its own card.

## Fix direction, non-binding

Let headings break long words, for example `overflow-wrap: anywhere` together with
`hyphens: auto` (both locales set `lang`, so the browser can hyphenate), or step the
size down for long headings. It must not change any heading that already fits, and
it must not move the height budgets. Re-measure under R-Y if a page's height
changes.

## Acceptance, machine-checkable

Headless Chrome against a local build, `mobile: true` at 390 and below.

1. **Font precondition.** On every load, wait until at least one Inter `FontFace`
   is `loaded` and none is `loading`. If none loads, the combination is invalid and
   the run fails; widths measured in a fallback font are not evidence.
2. For **every** page in `dist/sitemap.xml` plus both 404 pages (44), at widths 360,
   375, 390, 768, 1280 and 1920 (264 combinations, print the count read):
   - `document.documentElement.scrollWidth - document.documentElement.clientWidth <= 0`;
   - zero visible `h1`, `h2` or `h3` elements with `scrollWidth > clientWidth + 1`.
3. **Watched failing first.** The same check on the current `main` build fails on
   exactly the 6 combinations in the table above.
4. **Nothing that fit moved.** For every `h1` and `h2` that passed on `main`, its
   rendered line count is unchanged at 390 and 1280 on all 44 pages. A heading that
   wraps differently is listed and justified.
5. `node scripts/verify-live.js` against the local build exits 0 with every page
   inside budget. All `quality` gates exit 0, each read from its own process,
   including `node scripts/check-header-fit.js`.

Recommended, not required: make check 2 a standing gate beside
`check-header-fit.js`. It uses the same harness, and it would catch the next long RU
word before it ships.
