# W25-17 · The supplier the catalogue was copied from now supplies its pictures

Card W25-17. Branch `w25/w25-17-fatade3d-images`, on `main` at `f21f21b` after #104 to #107
merged. PR only, stops for the owner.

## What this ships

**99 product photographs, from `fatade3d.md`, under W25-R14.** The 64 facade mouldings and
the 25 outdoor lamps that W25-R9 had left waiting on the client, plus the 3 `brand_hidden`
plates and 8 of the 11 products that name no manufacturer.

**Catalog slots go from 160 to 259 of 333.** 103 attempted, 99 filled, 4 refused by the
floor and reported.

## The five rulings, recorded before anything was done

`docs/rulings/W25-R.md` gains **W25-R14 to W25-R18**, quoted exactly as the owner gave them.
The next free id was `W25-R14`. This card acts on `W25-R14` and `W25-R17`; the other three
belong to W25-18, W25-20 and W25-19.

## Why 103 attempted and not 89

The dispatch names four groups and they are four different reasons, not one:

| Group | Slots | Why it was unreachable until now |
|---|---|---|
| Facade mouldings | 64 | W25-R9: the records describe them by a shop code and a price |
| Outdoor lamps | 25 | the same |
| No named manufacturer | 11 | W25-R1: there is no manufacturer site to be the origin |
| `brand_hidden` plates | 3 | W25-03d: matched in none of the three catalogues |

**Every one of them had exactly one origin all along**, and it was the host the catalogue
text was already copied from under W24-R1. W25-R14 is what makes the pictures follow the
text.

## How the image for each product was found, and why it is the right one

**The record already carried the page.** Every row in `content/catalog-products.json` holds
`source.url`, the product's own page on `fatade3d.md`, captured on 2026-09-19. Nothing had to
be searched for, so nothing could be mismatched by a search: the page is named in the data.

**The picture is the page's first `og:image`**, which on this WooCommerce install is the
product gallery's main image. That claim was tested rather than assumed: for the four
products that came back under the floor, the gallery block itself was parsed, and in all four
it holds **exactly one** product image and it is the one `og:image` named.

**It matters, because the loose reading finds the wrong product.** Reading every
`wp-content/uploads` URL on the page returns 6 to 8 candidates, and on these pages the extras
are the related-products carousel: `CAT-0022`'s page carries `CAT-0023`'s main image and the
other way round. A fallback that reached for "the next candidate" when the first was too
small would have installed a picture of a different product, which is exactly what W25-R4
forbids. So there is no such fallback. **A product with one image under the floor stays a
placeholder.**

## The four that stayed placeholders

| Slot | Product | Its one gallery image |
|---|---|---|
| `CAT-0003` | Polistiren expandat EPS-50 to EPS-200 | 250x250 |
| `CAT-0022` | Mesterul dibaci POLISTIREN | 174x270 |
| `CAT-0023` | Mesterul dibaci VATA MINERALA | 183x276 |
| `CAT-0025` | Diblu din otel LGX | 400x266 |

W25-R12 made the 450 floor final with a named list of cases it does not bend for, and these
are four more. **The reason is now a measurement in the ledger**, `empty_reason`, rather than
a sentence derived from the record's shape: without it the review list would have gone on
calling them "no manufacturer site", which was true yesterday and is not the reason today.

## The images were looked at, all 99

The download guard cannot see a watermark, a logo or a face, and says so on every fetch. So
all 99 installed files were rendered onto four contact sheets and read, with each slot id and
each product name printed under its picture.

**The mouldings verify themselves.** Every one of the 64 carries its own product code burned
into the render, `RED-01` through `RED-78`, and every one matched the record's name. That is
the same kind of evidence the Phomi swatches gave and it is stronger than a filename:
`CAT-0132`'s page slug is `bagheta-decorativa-fatada-red-01`, and the picture on it reads
`RED-06`, which is what the record says the product is.

**Two flags came out of looking**, and both are now declared on the ledger row rather than
derived:

- **`label: true` on the 64 mouldings.** The burned-in code is W25-R5's condition exactly,
  and no data file in this repo can see it.
- **`watermark: true` on 3 files.** `CAT-0221`, `CAT-0222` and `CAT-0223` carry the FATADE 3D
  mark on the product or its package. The other 96 carry none. **Deriving the watermark flag
  from the origin, the way the Dasterum rows do, would have flagged all 99** and told the
  reviewer nothing: Dasterum marks every file it publishes and Fatade 3D does not.

## The guard, extended twice and narrowed once

`scripts/fetch-packshot.js`, `scripts/check-asset-provenance.js` and gate 19 all learn the
same two things, in the same shape they already held `dasterum.md`:

1. **`fatade3d.md` is a direct supplier** (W25-R14), behind its own `--fatade3d` flag, lifted
   only for a row whose licence is that host's own sentence, character for character.
2. **`imperlux.md` is not.** W25-R15 is an owner override and it is coded as one: the
   permission is attached to **twelve slot ids**, so a thirteenth id is refused with the flag
   set. That is the only executable form of "nothing else from imperlux.md, ever". W25-18
   uses it; this card only ships it.

Each refusal was watched fire: the four arms are in the PR body.

## The prompt pack

**The 89 are gone from it**, and the pack now says why in its own words instead of going on
saying they wait on the client. `entries whose appearance is not in the records: 0`. The pack
is **23 entries**, down from 30.

## Gates

**24 of 24 gate commands exit 0**, from `node scripts/run-gates.js --keep-going`, which reads
`quality.yml`. Gate 19 reads `ledger slots filled: 259 of 333`, gate 24 reads
`259 installed, 63 empty, file matches the data`.

## Section 12.0

Owed by #104 to #107 and run before this card started, unprompted, with the full
forty-character `EXPECT_SHA` and the edge polled with a cache-buster until it served that
sha. `node scripts/verify-live.js https://rapidconstruct.md` on
`f21f21b73f543b16a1eb65d5cc0937cd21ecdcb0`: **exit 0, PASS, 0 unverified, 0 failed, 67 of 67
pages, 0 rows retried, 0 pages that never became ready.** 41 reachable URLs crawled, 0 with a
visible TODO.

This card's own 12.0 run is owed after its merge.

## Recorded for ratification

1. **The picture is the first `og:image` and there is no fallback to a second candidate.**
   The alternative was measured and it picks up the related-products carousel.
2. **`label` and `watermark` are declared on the ledger row, not derived from the origin.**
   Fatade 3D does not mark its files the way Dasterum does, and a flag that fires on
   everything is not a flag.
3. **`empty_reason` on a ledger row beats a reason derived from the record's shape**, where a
   card has measured one.
