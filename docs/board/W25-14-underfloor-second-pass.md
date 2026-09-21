# W25-14 · Nine under-floor products, attempted a second way, nought filled

Card W25-14. Branch `w25/w25-14-underfloor-second-pass`, stacked on
`w25/w25-13-verify-live-ready`. PR only, stops for the owner.

**W25-R12 is the frame**: the floor is 450 and there is no exception for Baumit, ROKO,
ISOMAT or DURAZIV. So this card went looking for a bigger file rather than a smaller floor.

## Attempted against filled

| Product | Brand | Where it looked | Measured | Verdict |
|---|---|---|---|---|
| `CAT-0017` Baumacol Bianco | Baumit | product page on `.md`, `.ro` and `.com`; technical documents; `int.baumit.com` | **400x400** | short by 50 |
| `CAT-0018` DuoContact | Baumit | the same | **400x400** | short by 50 |
| `CAT-0019` ProContact | Baumit | the same | **333x400** | short by 50 |
| `CAT-0026` SilikonTop | Baumit | the same | **400x400** | short by 50 |
| `CAT-0027` DuoTop | Baumit | the same | **400x400** | short by 50 |
| `CAT-0032` Standard TDS | DURAZIV | product page **and its official datasheet PDF** | **345x359** | short by 91 |
| `CAT-0037` Clima Protect | DURAZIV | product page **and its official datasheet PDF** | **343x335** | short by 107 |
| `CAT-0192` Flexcoat | ISOMAT | product page **and its official datasheet PDF** | **393x104** | a logo, not a packshot |
| `CAT-0038` Omitka Rokomozaiková | ROKO | product page, **datasheet PDF and both leaflet pages** | **1654x310** and **1867x1320** | a banner and two brochure spreads |

**9 attempted, 0 filled.** Every one now has two independent sources measured on the
manufacturer's own domain, not one.

## What each attempt actually found

**Baumit publishes 400x400 and nothing else.** The same file id answers 400x400 on
`baumit.md`, `baumit.ro` and `baumit.com`. The `?w=1200` query is ignored and returns 400x400
unchanged. Three alternative path shapes (`/big/`, `_big`, `/orig/`) all 404. **Their
technical-documents page lists 161 datasheet PDFs and the five that matter 404 on both
`baumit.md` and `baumit.ro`**: the links are on the page, the files are not on the server.
`int.baumit.com` did not answer in 45 seconds or in ten minutes.

**DURAZIV's own datasheets carry the same small packshot.** `FT-ST-TDS-2025-R8.pdf` and
`FT-CP-MD-2025R8.pdf`, both on `duraziv.ro`, embed exactly one JPEG each: **345x359** and
**343x335**. That is the second independent source for the same refusal and it agrees with
the product page to the pixel on one of the two.

**ISOMAT's datasheet has no packshot in it at all.** `e-ISOMAT-FLEXCOAT.pdf` embeds two
JPEGs, **393x104** and **126x89**: a logo and a mark.

**ROKO's material is a leaflet, not a photograph.** The datasheet PDF embeds one image, a
**1654x310** blue banner carrying the ROKO logo. The two `final_vzornik_omitek` pages are
**1867x1320 brochure spreads**: body copy in Czech, a colour swatch grid, the logo and a
"Prodejce / Distributor" box. W25-R2 refuses a picture carrying a logo and another seller's
box, and none of the three is a photograph of the product.

## A tool this card leaves behind

`node scripts/extract-pdf-images.js <file.pdf> [out-dir]`. **The dispatch rules that an
image extracted from an official PDF counts as manufacturer origin**, and that is only true
if the extraction takes the manufacturer's own bytes and does nothing to them. It lifts a
DCTDecode stream verbatim: no re-encode, no resize, no crop. The floor and the no-upscaling
rule then apply to what comes out exactly as they do to a download.

It reads JPEG streams only, and a PDF whose images are Flate bitmaps or vector art yields
nothing and **says so**, rather than producing something that is not in the file. Four
manufacturers' datasheets were read with it here.

## Nothing changed in the tree

No image, no ledger row, no provenance row, no product record. **This card is a measurement
and a refusal**, plus one script. The nine slots are already in
`docs/PHOTO-REVIEW-W25.md`'s table two and their reason there is still true.

## Gates

**23 of 23 exit 0**, from `node scripts/run-gates.js`.

## Recorded for ratification

1. **`scripts/extract-pdf-images.js` is new** and no ruling asked for a script, only for the
   extraction to be possible. It is 40 lines and zero dependency.
2. **Baumit's datasheet PDFs 404 on two of their own domains.** That is a fact about their
   server on 2026-09-21, recorded because a later card should not conclude they do not exist.
