# W24-02 · The Catalog button moves next to the logo, in every header copy

| | |
|---|---|
| Dispatched | Wave 24, 2026-09-19 |
| Rulings in force | R-V, R-W, R-X, R-Y, R-Z, R-AA, R-AB, W24-R8 |
| Depends on | W24-01 |

## What the card asks

The Catalog control moves to immediately **right of the logo**, before the nav items, in
both locales and in every template that carries a header. The header is copy-pasted
across `src/template.html`, `src/service.html`, `src/category.html` and
`src/product.html`: every copy changes, none is left behind.

The button's background is **the exact token of the hero "Solicita oferta" button**, with
the same text colour and the same hover. No new colour value, no new token (W24-R8).

## Acceptance

1. Gate 11 `check-header-fit.js` green in RO and RU, at every width in its matrix.
2. Gate 18 `check-nav-contrast.js` green: the Catalog dropdown still reads at rest.
3. The four templates carry the same header. A diff of the header block between them is
   empty apart from what already differed.
4. RU carries 9px of slack. **If the header fit fails in RU, stop the card and propose
   one fix. Never shrink the type.**
5. Screenshots at 1440 and 390, RO and RU, in `~/Documents/rc-audit-w24/w24/`.
6. Every gate under `quality` exit 0, each as its own process, named with its exit code.
