# W26-02 · The audit that shows W25-24 was wrong, and the harness that could not have been

Card W26-02. Branch `w26/w26-02-imperlux-audit`, stacked on `w26/w26-01-roof-section`. PR only,
stops for the owner. **Nothing is built on this audit in this card**, which is what the dispatch
asks: the audit is committed first.

## The counts, against the owner's screenshots

| Section | Owner expected | Measured | Match |
|---|---|---|---|
| `tigla-metalica` | 7 | **7** | yes |
| `tigla-roca-vulcanica` | 4 | **4** | yes |
| `tigla-ceramica` | 1 | **1** | yes |
| `shingle` | 2 | **2** | yes |
| `sisteme-pluviale` | 17 | **17** | yes |

**Five of five.** **31 roofing products** on `imperlux.md`, every one with its URL, its card text
and its image file recorded in `docs/IMPERLUX-AUDIT-W26.md`.

**Q-W25-18 is closed by measurement**, not by assertion.

## What W25-24 got wrong, and it was the method

That card reported both hub sections gone. The acoperisuri hub carries a **five-tile bento**
headed "Produsele noastre. Alege acoperișul potrivit." **at 1,876px on a 12,535px page**, and
each tile opens a product section whose count matches the owner's screenshots to the product.

**Two readings, one mistake twice:**

1. It grepped the **HTML response** for the tile labels. Those tiles render client-side, so the
   labels were never going to be in the response.
2. It screenshotted **`--window-size=1440,4000`** and read "not there" off a picture of the top
   third of the page.

**Neither could have found a section that renders in JS below the fold.** W26-R2 forbids both,
and its last clause is the one that would have caught it: a finding of "does not exist" now
requires a rendered screenshot in the audit file, and a screenshot of a whole 12,535px document
shows the section immediately.

## The harness, and why it is in `scripts/`

`node scripts/audit-rendered.js <out-dir> <url> ...`, with `scripts/lib/cdp-ws.js`, a zero
dependency CDP client. It is committed rather than thrown away because W26-R2 is a **standing**
rule: every audit of a third-party site from now on uses this, and a rule whose tool lives in a
scratch directory is a rule that gets approximated next time.

**Network idle is measured, not waited out.** It polls `scrollHeight` and the image count until
three consecutive readings agree, then scrolls the whole document in 700px steps so every lazy
image loads, then returns to the top. A `--virtual-time-budget` that expires before the last
request returns is exactly how a late section is missed, which is the failure this replaces.

**The screenshot is the whole document**, `captureBeyondViewport` at the full content height,
not the viewport.

## What was read

**20 pages**: the homepage, `/acoperisuri/` and its five product sections, `/copertine/`, both
calculators, `/garduri/`, the fence catalogue and **all eight fence model pages**. Per page:
sections in order with their offsets and heights, every card with its image URL and destination,
every table, every image, every link, and a full-document screenshot.

`docs/audit/imperlux/` holds `audit.json` and 20 screenshots. They are JPEG at quality 72, 5.7MB
rather than 11MB as PNG: they are evidence a person reads, not pixels a gate measures.

## The tables exist, and four of five are published

`tigla-metalica`, `tigla-roca-vulcanica`, `shingle` and `sisteme-pluviale` each publish a
**Compară modelele** table, copied into the audit file column for column. For example the metal
tile table is `Preț`, `Garanție`, `Grosime`, `Greutate`, `Culori` across seven models.

`tigla-ceramica` has one product and no table, and **no fence model page publishes one**, so
W26-R6's "build one from the card specs" applies to those.

## The hub tile files

Recorded for W26-03, read from the rendered DOM:

| Tile opens | File |
|---|---|
| `/acoperisuri/produse/tigla-metalica/` | `images/categories/tigla-metalica.png` |
| `/acoperisuri/produse/tigla-roca-vulcanica/` | `images/categories/roca-vulcanica.png` |
| `/acoperisuri/produse/tigla-ceramica/` | `images/categories/ceramica.png` |
| `/acoperisuri/produse/shingle/` | `images/categories/shingle.png` |
| `/acoperisuri/produse/sisteme-pluviale/` | `images/categories/sisteme-pluviale.png` |
| `/acoperisuri/oferte` | `images/promo/scurgere-gratuit-cta.jpg` |

## What may not be copied, recorded in the audit itself

**Every roofing product card carries a percent badge and a struck price**, and the fence offers
block carries a countdown and a stock-limited claim. R-X forbids all of them here and
`check-scarcity.js` gates them. W25-R8 and W26-R5 take the current "de la" figure only.

**Warranty rows are held.** Q-W25-19 is answered for the fences, leave it off, and the roof rows
are still open.

## Gates

**25 of 25 gate commands exit 0.** Nothing about the built site changed: this card adds a
document, a directory of evidence and a script.

## Recorded for ratification

1. **The harness is committed**, because W26-R2 is standing and a rule whose tool is
   disposable gets approximated.
2. **Network idle is polled to stability**, never waited out on a fixed budget.
3. **Screenshots are the whole document**, which is what makes a "does not exist" finding
   checkable by a reader.
