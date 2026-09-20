# W24-07 · Acoperisuri becomes a hub, with a bento at the top and a new Novatik page

| | |
|---|---|
| Dispatched | Wave 24, 2026-09-19 |
| Rulings in force | R-V, R-W, R-X, R-Y as amended by W24-R4, R-Z, R-AA, R-AB, and W24-R5, W24-R6, W24-R7, W24-R8, W24-R9 |
| Depends on | W24-01, W24-06 |
| Held claims | `docs/W24-CLAIMS-HELD.md` |

## What the card asks

The **first section after the header** on the Acoperisuri page is a bento mirroring the
imperlux "Acoperisuri metalice" section: a heading whose second word is muted, then a
grid of one tall tile on the left spanning two rows and about one third of the width, one
wide tile at the top right, and two equal tiles at the bottom right. Large radius. The
label sits bottom left in white. Each tile is a `#141414` placeholder carrying its slot
id, registered in the W24-01 ledger.

A tile **may carry a bottom gradient inside the tile** for label legibility (W24-R5). The
section-level overlay ban is unchanged.

| Tile | Goes to |
|---|---|
| Tigla metalica | the existing tigla page, at the URL it already has |
| Roca vulcanica Novatik | a **new page**, mirroring the imperlux Novatik page section by section under W24-R6 and W24-R7 |
| Calculeaza pretul acoperisului | `/in-constructie/` |
| Reduceri | **not a link.** No hover, no pointer cursor, `aria-disabled` |

On mobile the tiles stack into one column with the tall tile first.

Then the "Patru lucrari de acoperis" section that W24-06 moved here, then the page's
existing content.

## What is copied, and what is held

Structure and text are copied and "Imperlux" is replaced with "Rapid Construct"
(W24-R6). **Any sentence asserting a company fact is not rendered**: own workshop, team,
years, warranty, discount figure, counts, coverage, certificates. Each one is written to
`docs/W24-CLAIMS-HELD.md` with its page and its position, and the layout slot stays,
filled with neutral existing Rapid Construct copy or left empty. The owner ticks them
later.

**Imperlux prices are not published** (W24-R7). A price slot renders "Pret la cerere" in
its locale. The Reduceri tile reads "Reduceri" and its RU equivalent, with no percentage.

RU strings come from the reference site's RU version. Where none exists, RO is reused for
a product proper name and every such key is listed in the PR (W24-R9).

## Acceptance

1. The bento is the first section after the header, in both locales.
2. The Reduceri tile is not a link, has no hover, no pointer cursor, and carries
   `aria-disabled="true"`.
3. Every tile placeholder has a ledger row and the reverse (the W24-01 gate).
4. The new Novatik page resolves, is in the sitemap with its hreflang pair, and carries
   no held claim and no price figure.
5. `docs/W24-CLAIMS-HELD.md` lists every held sentence with page and position.
6. Gate 14 green at 360 and 1280 on the Acoperisuri page and the Novatik page.
7. New height budgets for both pages, measured plus 60.
8. Screenshots at 1440 and 390 of both pages, RO and RU.
9. Every gate under `quality` exit 0, each as its own process, named with its exit code.
