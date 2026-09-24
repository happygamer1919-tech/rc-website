# W28-FIX-01 · The hero stat labels read 14px on phones and tablets

Card W28-FIX-01. Branch `w28/w28-fix-01-stat-labels`, stacked on W28-21. From W28-REVIEW defect 1.

## What this card does

W28-22 (the phone hero) set `.stat__label { font-size: 13px; }` inside the under-1024 block so the
three stats ("500+ proiecte finalizate", "15+ ani de experiență", "5 ani garanție scrisă" and the
Russian three) fit one row at 390. The review's crawl holds visible text to a 14px floor and these
24 nodes (three labels, two home pages, two widths, two locales) were the only wave 28 text under it.
The value becomes 14px. The Russian labels are the long ones ("лет письменной гарантии" already
wraps to two lines at 390); a third line is allowed, clipping or a sideways scroll is not.

## Acceptance

- `node build.js && node scripts/dom-text.js --count ".stat__label" / /ru/`: 3 and 3.
- Headless Chrome at 320, 360, 390 and 768 on `/` and `/ru/`: every `.stat__label` computed font-size
  14px, no label wider than its box, 0 hidden hero children, and `scrollWidth <= clientWidth` at 360
  and above; printed. (At 320 the Russian page scrolls 17px from the header pill, on `main` today as
  well: Q-W28-04, W28-FIX-02.)
- The crawl at 390 and 768 on `/` and `/ru/` counts 0 visible text nodes under 14px that are not the
  SVG diagram labels.
- Budgets re-measured; any that move go to R-Y.
- `node scripts/run-gates.js --keep-going`: 33 of 33 exit 0.
