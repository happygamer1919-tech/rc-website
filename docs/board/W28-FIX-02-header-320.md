# W28-FIX-02 · The Russian header pill spills 17px at 320

Card W28-FIX-02. No branch yet. Blocked on Q-W28-04. Found by W28-FIX-01 on 2026-09-24.

## What was measured

At 320px on `/ru/` the document scrolls 17px sideways: the header pill measures 305px inside a
header inner of 337px ("Каталог", the phone icon and the menu button do not fit). The Romanian page
fits. It is the same on `main` today and below the smallest width any gate measures (gate 11 starts
at 769, gate 14 and the crawl at 360 and 390).

## What it would do, if the owner says 320 is supported

Tighten the phone header under 340 (the button's padding or its label) and add 320 to gate 14's
matrix so the fix stays fixed. If the owner keeps 360 as the floor, the card closes with that
recorded.

## Acceptance, if worked

- At 320 on `/` and `/ru/`: `scrollWidth` equals `clientWidth` and the header pill fits the viewport.
- Gate 14 measures 320 as well as 360 and 1280.
- 33 of 33 gates exit 0.
