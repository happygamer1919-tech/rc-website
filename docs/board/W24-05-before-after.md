# W24-05 · The before/after slider is turned on, with placeholders that prove it moves

| | |
|---|---|
| Dispatched | Wave 24, 2026-09-19 |
| Rulings in force | R-V, R-W, R-X, R-Y as amended by W24-R4, R-Z, R-AA, R-AB, W24-R8 |
| Depends on | W24-01 |

## What the card asks

Turn on the existing `.ba` slider and place it on the **case la cheie** service page, both
locales. **Not on the homepage.**

Reference geometry, copied as geometry only (W24-R8):

- a heading of two lines, the second line in brand orange ("INAINTE SI DUPA" plus the
  project type),
- round prev and next arrow buttons at the top right,
- one wide rounded frame,
- a vertical drag handle with a grip,
- "INAINTE" bottom left and "DUPA" bottom right, on black chips.

4 projects, 8 placeholder slots, `BA-01-before` through `BA-04-after`, every one in the
W24-01 ledger. **The before placeholder is the white variant and the after placeholder is
the `#141414` variant**, so the drag is visibly working with no photographs in place.

Drag, touch and keyboard all work. Arrow keys on the handle move it. There is no
auto-advance: a scroll-driven or self-advancing carousel is refused by `docs/CLAUDE.md`
section 1.

The standing ruling **"a render is never a proof image"** is unchanged and applies to the
photo session that fills these slots, not to this card.

## Acceptance

1. A browser gate, or a browser check reported with its evidence: the handle moves, the
   clip width changes as it moves, and the arrows change project.
2. Keyboard: the handle is focusable and the arrow keys move it.
3. `prefers-reduced-motion` still disables every effect on the page.
4. Gate 12 `check-svg-a11y.js` green: the arrows and the grip are decorative or named.
5. Gate 5 Lighthouse accessibility 100 on the case la cheie page, both locales.
6. A new height budget for the page, measured plus 60, recorded in `docs/rulings/R-Y.md`.
7. Screenshots at 1440 and 390, RO and RU, with the handle at three positions.
8. Every gate under `quality` exit 0, each as its own process, named with its exit code.
