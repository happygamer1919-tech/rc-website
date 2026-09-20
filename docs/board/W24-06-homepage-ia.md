# W24-06 · The roof offers leave the homepage, and tigla metalica becomes a child of acoperisuri

| | |
|---|---|
| Dispatched | Wave 24, 2026-09-19 |
| Rulings in force | R-V, R-W, R-X, R-Y as amended by W24-R4, R-Z, R-AA, R-AB, and section 5 of `docs/CLAUDE.md` |
| Depends on | W24-01 |

## What the card asks

1. **Remove "Patru lucrari de acoperis"** (`#acoperisuri`, `roofOffers`) from the
   homepage. Render it on the **Acoperisuri service page**, below the bento that W24-07
   puts at the top of that page.
2. In the teaser trio under it, **"TIGLA METALICA" becomes "ACOPERISURI"**, linking to the
   Acoperisuri page. The copy is adjusted **from existing Rapid Construct strings only**.
   No copy is invented (`docs/CLAUDE.md` section 5).
3. **Tigla metalica becomes a child of Acoperisuri.** Its breadcrumb reads
   Acasa / Acoperisuri / Tigla metalica. It is removed from any top-level service list.
   **Its URL is kept**: GitHub Pages serves no redirects, so a moved URL is a dead link.
4. Add a shared page **`/in-constructie/`**, RO and RU, `noindex`, with the header, the
   footer, one line and a back link.
5. The homepage height budget is re-measured and recorded.

## Acceptance

1. `#acoperisuri` renders on the Acoperisuri page and nowhere on the homepage.
2. The teaser reads ACOPERISURI in RO and its RU equivalent, and the link resolves.
3. `/tigla-metalica/` still resolves at the URL it had. Gate 2 green.
4. The tigla breadcrumb is three levels and its `BreadcrumbList` matches it.
5. `/in-constructie/` resolves in both locales, carries `noindex`, and is out of the
   sitemap.
6. A new homepage height budget, measured plus 60, recorded in `docs/rulings/R-Y.md`, with
   the measured figure beside it.
7. `verify-live.js` MARKERS updated if the homepage section count moved, and the reason
   recorded.
8. Screenshots at 1440 and 390 of the homepage, the Acoperisuri page, the tigla page and
   `/in-constructie/`, RO and RU.
9. Every gate under `quality` exit 0, each as its own process, named with its exit code.
