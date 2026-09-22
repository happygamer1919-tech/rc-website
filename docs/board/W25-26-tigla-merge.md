# W25-26 · There were never two suppliers

Card W25-26. Branch `w25/w25-26-tigla-merge`, stacked on `w25/w25-25-fence-completeness`.
PR only, stops for the owner.

## The finding, which changes what the ruling had to do

W25-R21 closes Q-W25-17 with *"Same name with two prices: Dasterum price and record kept,
Imperlux duplicate dropped. Imperlux-only models keep their Imperlux price."*

**There is no Imperlux data in this anywhere, and there are no Imperlux-only models.**

`content/tigla-metalica.json` was never an Imperlux listing. Its own `_note` says the wave 14
audit, section 2.1, and **that section is titled "dasterum.md: Țiglă metalică"**. Every row of
its table names **Dasterum** as the manufacturer. Measured against the live source on
2026-09-22: `imperlux.md/acoperisuri/` publishes **Monterrey 0 times, Valencia 0, Kascad 0**.
It sells Barcelona, Madrid, Bavaria, Novatik and IKO.

**So the eight cards were the same four Dasterum products, captured twice**, once at W14-10 as
model data with grades and palettes, once at W25-09 as catalogue records. Q-W25-17 asked the
owner to choose between two suppliers; there was one.

**The two prices are the same supplier's too.** `De la 110 lei` on the catalogue card is the
Econom grade's current listing price, and `184 lei/m²` on the tile page is the Standart
grade's list price, which carries no discount. The audit records both. They were never in
conflict; nothing on either card said which grade it was.

## What shipped, and why it is still the ruling

**One card per model name in the Tigla metalică group.** The four cards built from
`tigla-metalica.json` are gone from `/servicii/acoperisuri/`; the four Dasterum catalogue
records stay, with their prices. That is exactly what W25-R21 asks for, and the corrected
premise does not change it: whichever of the two capture routes is called "the Dasterum
record", the group ends with four cards under four names.

**The roofing section is 75 cards to 71**, and the `productCards` marker with it.

## The four ACTM slots

They were created by W25-19 for those four catalogue cards. With the cards gone they would
have been ledger rows nothing renders, which gate 19 refuses. **They moved to
`/servicii/tigla-metalica/`, beside the models they are pictures of**, and they are filled.

**Filled from `dasterum.md`, not from `imperlux.md`.** The dispatch's card says "from
imperlux.md" and that cannot be done: imperlux does not sell these four models. W25-R20 gives
the order to follow instead, and its first step lands on the right host without a judgement
call: *"a product picture comes first from the site its data and price came from"*, which for
these is Dasterum.

**And no fetch was needed at all.** The same four pictures are already installed on
`CAT-0224` to `CAT-0227`, so each `ACTM-` slot takes one under W25-R17's declared reuse, which
is the case that ruling exists for: the same product under two records.

**Matched by model name, never by id order.** `CAT-0226` is the modular tile and `CAT-0227` is
Kascad, so a positional pairing would have put Kascad's picture on the modular card. The
pairing is asserted against the record's own name at write time.

## A pre-W24-01 image path is gone with it

The tile card used to render an image if `public/img/tigla-<id>.jpg` happened to exist: **no
ledger row, no provenance row, no gate**. Four files could have appeared in that directory and
nothing in this repo would have known where they came from. The card now calls the placeholder
component, which is the one call site for every image the site renders.

## The budgets: two fall, two rise

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/acoperisuri/` | 16,904 | **16,470** | 16,964 to **16,530** |
| `/ru/servicii/acoperisuri/` | 17,064 | **16,608** | 17,124 to **16,668** |
| `/servicii/tigla-metalica/` | 3,979 | **4,223** | 4,039 to **4,283** |
| `/ru/servicii/tigla-metalica/` | 4,010 | **4,256** | 4,072 to **4,316** |

**The roofing page loses more than the tile page gains**, 434px against 244px: a card in a
four-column grid of 71 costs a nineteenth of a row, and a picture on a tile card costs its own
height on a page of four.

## Slots

**283 to 287 of 337.** The four are the `ACTM-` slots, filled by reuse, with no image added to
`public/`.

## Gates

**25 of 25 gate commands exit 0.**

## Recorded for ratification

1. **Q-W25-17's premise was wrong and the walk says so.** Both sets are Dasterum; the audit
   that created the tile data is titled with that host and imperlux publishes none of the four
   names.
2. **The ACTM slots are filled from Dasterum**, by W25-R20's first step, because the dispatch's
   "from imperlux.md" names a host that does not sell these models.
3. **The legacy `public/img/tigla-<id>.jpg` path is deleted.** An image outside the ledger is
   an image with no provenance.
