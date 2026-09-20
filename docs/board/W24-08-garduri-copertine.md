# W24-08 · Garduri gets the same bento, and copertine gets a hero and a cross-sell row

| | |
|---|---|
| Dispatched | Wave 24, 2026-09-19 |
| Rulings in force | R-V, R-W, R-X, R-Y as amended by W24-R4, R-Z, R-AA, R-AB, and W24-R5, W24-R6, W24-R7, W24-R8, W24-R9 |
| Depends on | W24-01, W24-07 |
| Held claims | `docs/W24-CLAIMS-HELD.md`, completed by this card |
| Fixes | F-02, for these six product pages |

## Garduri

The same bento pattern, "Garduri tip jaluzele":

| Tile | Goes to |
|---|---|
| Garduri tip jaluzele | the existing garduri content |
| Calculeaza pretul gardului | `/in-constructie/` |
| Modele de garduri | a **new page**, mirroring the imperlux page under W24-R6 and W24-R7 |
| Preturi & oferte | **not a link.** Same treatment as Reduceri: no hover, no pointer, `aria-disabled` |

`GARD_FORBIDDEN` stays exactly as it is (W24-R7).

## Copertine

Mirror the imperlux copertine page:

- a dark full-width hero: breadcrumb, a two-line H1, a lede, three dot-separated facts
  **only if they survive W24-R6**, a primary CTA to the quote form, and a secondary
  "Vezi cele 12 modele" that scrolls to the existing 12 models,
- the existing 12 SVG models are kept, untouched,
- then a three-card cross-sell row: Materiale de acoperis, Soffit metalic **only if Rapid
  Construct has such a page, else omitted**, and Garduri metalice. Placeholder images,
  rounded cards, a "Vezi" link.

## Reachability

All six product pages are reachable from the mobile menu, which is F-02 for these.

## Acceptance

1. Both bentos render, both locales, with the non-link tile inert and `aria-disabled`.
2. The new fence-models page resolves, is in the sitemap with its hreflang pair, and
   carries no held claim and no price figure.
3. The copertine hero renders and the secondary CTA scrolls to the existing 12 models,
   which are unchanged.
4. A cross-sell card is rendered only for a page that exists. The omitted one is named in
   the PR with the reason.
5. All six product pages are reachable from the mobile menu, listed one by one.
6. `docs/W24-CLAIMS-HELD.md` is complete for the whole wave.
7. New height budgets for every changed page, measured plus 60.
8. Screenshots at 1440 and 390 of every changed page, RO and RU.
9. Every gate under `quality` exit 0, each as its own process, named with its exit code.
