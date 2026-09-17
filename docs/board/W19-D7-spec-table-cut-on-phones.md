# W19-D7 · On phones, the specification table on six service pages is cut mid-word at the screen edge

| | |
|---|---|
| Found by | Critic, wave 19 boundary, second pass, 2026-09-17 |
| Live build | `ff102c6`, `https://rapidconstruct.md` |
| Severity rank | 2 of 5 in this pass |
| Mode | Not assigned by the critic |

## What a visitor sees

On a phone, open a service page with a specification table, for example
`/servicii/fatade/` ("Sisteme de fațadă") or `/ru/servicii/fatade/` ("Фасадные
системы"). The left column reads normally. The right column, which holds the
description, stops at the edge of the screen in the middle of words:
"Графитовый пенопо", "приклеенный и закр", "Подсистема из мет". The rest can only
be reached by swiping the table sideways. Nothing on the page says so, because
phone browsers show no scrollbar until the box is touched.

## Why it happens

`src/styles.css`, the W9-08 service page block:

    .table-wrap { overflow-x: auto; ... }
    .spec { width: 100%; min-width: 480px; ... }

The table is never narrower than 480px. Its wrapper scrolls sideways, so the page
itself never does, which is what W9-08 set out to guarantee. DECISIONS.md, W9-08:
"so a long row can never be the reason the page body scrolls sideways. Checked at
1440, 1024, 768 and 390". The page body was checked, not what the table shows inside
its box. Below a 512px viewport the column is narrower than 480px, and the
description column is cut.

## Evidence, measured on the live site

Headless Chrome, Inter loaded, `mobile: true` at 768 and below. Every service page
in both locales (18) was read. **12 carry a table**: `case-la-cheie`,
`acoperisuri`, `fatade`, `finisaje`, `instalatii` and `terasamente`, RO and RU.
Widths 320, 360, 375, 390, 414, 430, 480, 768, 1280 and 1920:
**120 combinations read, 84 failing**, every table page at every width from 320
to 480.

| Width | Pages failing | Table width hidden in its box | Description column visible |
|---|---|---|---|
| 320 | 12 of 12 | 192px | 33% |
| 360 | 12 of 12 | 152px | 47% |
| 375 | 12 of 12 | 137px | 53% |
| 390 | 12 of 12 | 122px | 58% |
| 414 | 12 of 12 | 98px | 66% |
| 430 | 12 of 12 | 82px | 72% |
| 480 | 12 of 12 | 32px | 89% |
| 768, 1280, 1920 | 0 of 12 | 0 | 100% |

In every failing combination, every description cell (4 to 6 per table) runs past
the box's right edge, and no label cell does. The page itself never scrolls
sideways: `scrollWidth - clientWidth` is 0 on the document at every width.

**Removing `min-width` alone does not fix it.** Measured by overriding it on the
live pages: at 390 every table fits, but at 320 five RU tables still overflow their
box, by 30 to 60px. At 360 three still overflow, by 3 to 20px. A long Russian word
widens the auto-layout table past its box. The RU fațade table's tallest row also
grows to 358px at 320.

## Scope

`section#ce-include` on the six service pages that render one, both locales, at
viewport widths below 512px. The three service pages without a table are
unaffected.

## Fix direction, non-binding

On phones, each row must fit the column. One option is stacking each row, with the
label above its description, below a breakpoint. Another is a layout that wraps
long words. Keep `.table-wrap` as the guard against the page scrolling sideways. The
desktop table should not change.

## Acceptance, machine-checkable

Headless Chrome against a local build, `mobile: true` at 768 and below.

1. **Font precondition.** On every load, at least one Inter `FontFace` is `loaded`
   and none is `loading`. If not, the combination is invalid and the run fails.
2. For **every** service page in `dist/sitemap.xml`, both locales, at widths 320,
   360, 375, 390, 414, 430, 480, 768, 1280 and 1920, on each page that carries
   `#ce-include` (print the pages found and the combinations read; fail if none):
   - exactly one `#ce-include .table-wrap`;
   - `wrap.scrollWidth - wrap.clientWidth <= 0`;
   - every `th` and `td` bounding box lies horizontally inside the wrap's box,
     with 0.5px tolerance;
   - no `th` or `td` with `scrollWidth > clientWidth + 1`;
   - `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
3. **Watched failing first.** Check 2 on the current `main` build fails on exactly
   84 combinations: the 12 table pages at 320, 360, 375, 390, 414, 430 and 480. It
   passes at 768, 1280 and 1920.
4. **No content lost.** For each of the 12 pages, the text of every `th` and `td`,
   in order, equals `main`'s.
5. **Desktop unchanged.** At 1280 and 1920, the table's bounding box width and
   height equal `main`'s within 1px on all 12 pages.
6. `node scripts/verify-live.js` against the local build exits 0 with every page
   inside budget. All `quality` gates exit 0, each read from its own process.
