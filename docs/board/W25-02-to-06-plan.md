# Wave 25 · cards W25-02 to W25-06, authored 2026-09-20

Authored with W25-01, from the data rather than from the dispatch's estimates. **Two of
the five change shape once the records are counted**, and both changes are recorded here
before any of them is worked.

## What is actually fetchable, counted from `content/catalog-products.json`

R1 permits a download from **the manufacturer's own site**. A product with no manufacturer
has nowhere to fetch from, so it is not W25-02 to W25-04 work at all.

| Category | Products | With a manufacturer | No manufacturer | Brand hidden |
|---|---|---|---|---|
| Sisteme de termoizolație | 25 | **25** | 0 | 0 |
| Tencuieli decorative | 13 | **13** | 0 | 0 |
| Vopsele | 5 | **5** | 0 | 0 |
| Alte materiale | 3 | 0 | **3** | 0 |
| Plăci ceramice | 88 | **88** | 0 | 0 |
| Sisteme de iluminare | 25 | 0 | **25** | 0 |
| Elemente decorative | 64 | 0 | 0 | **64** |
| **Total** | **223** | **131** | **28** | **64** |

**Why 28 products have no manufacturer.** Their source brand is `Fatade3D`, which W17-02
refuses as a manufacturer name on a catalogue page, so W24-03 stored `brand: null`. They
are not missing data; they are products the source never attributed to anyone but itself.

## The two shape changes

**W25-04 has no fetchable product.** All 25 lighting products are in that 28. The card as
dispatched, "packshots: sisteme de iluminare (25), same rules", has **zero** products to
fetch. It is not skipped: it is worked as a confirmation and a hand-off, because a card
that silently does nothing is worse than a card that reports why.

**W25-02 is 43 fetchable, not 46.** The three `Alte materiale` products are in the same
28 and go to W25-05.

**Nothing here is a judgement about the products.** W25-R4 is the rule: no manufacturer
means no compliant image means the slot stays a placeholder and the prompt pack covers it.

---

## W25-02 · Packshots: termoizolație, tencuieli, vopsele, alte materiale

Branch `w25/w25-02-packshots-termo`. **43 fetchable of 46.**

Manufacturers to visit, from the records: **Caparol** (cites the W23-04 permission, not
the R1 string), Penoplex, SWEETONDALE, IZOVAT, ROCKWOOL, FAWORI, NOVOTERM, KREISEL,
Baumit, DURAZIV, ROKO AquaMix, ISOMAT, STANCOLAC.

Per product: the manufacturer's own page for **that exact product and pack size**, the
plain packshot on white. Row per R1. Report filled, or placeholder with the reason.

**The exact-match rule is the one that will cost slots.** A 25kg bag and a 5kg bag of the
same adhesive are different products with different packshots; a brand's "range" image
showing three products is not this product's packshot. W25-R4 forbids the near match.

## W25-03 · Packshots: plăci ceramice

Branch `w25/w25-03-packshots-placi`. **88 fetchable, one manufacturer: Phomi.**

The single largest and the single easiest, because it is one site. **The manufacturer's
single-tile face image, never a room scene**: a room scene is an interior photograph, it
would be cropped by `object-fit` into something that is not the tile, and it shows a
finished space this company did not build.

## W25-04 · Sisteme de iluminare

Branch `w25/w25-04-packshots-iluminat`. **0 fetchable of 25.**

Worked as a confirmation: re-derive the count from the records at the time it is worked,
confirm no product gained a manufacturer since, and hand all 25 to W25-05 by name. If any
product HAS gained one, fetch it under the same rules. The card reports the count it
measured, not the count written here.

## W25-05 · The AI prompt pack

Branch `w25/w25-05-ai-prompts`. **No repo image.** Writes
`~/Documents/rc-audit-w24/AI-PROMPTS-W25.md`, outside the repo.

Entries, with the count known today and the W25-02/03 residue added when those cards
report:

| Group | Slots |
|---|---|
| Elemente decorative, brand hidden | 64 |
| Sisteme de iluminare, no manufacturer | 25 |
| Alte materiale, no manufacturer | 3 |
| Hub bento tiles | 8 |
| Fence model cards (`GARD-01..08`) | 8 |
| Novatik cards (`NVK-01..04`) | 4 |
| Copertine hero (`COP-HERO`) | 1 |
| Cross-sell cards (`COPX-01..02`) | 2 |
| **Known today** | **115** |
| Plus every product W25-02 and W25-03 leave placeholder | to be added |

**The țiglă metalică profile cards are in the dispatch's list and are not in the ledger.**
They are drawn SVG diagrams, not photo slots, and they carry no slot id. W25-05 records
that rather than inventing four slots for them.

One shared style block at the top so the set reads as one shoot. Per entry: slot id,
output filename (**slot id plus `.png`**), aspect ratio, minimum pixels, full prompt.
Product prompts are built from the product's own name and variant line so the shape is
right. Intake folder `/Users/ivan/RC-pics-ai/`, filenames equal to slot ids.

## W25-06 · AI intake

Branch `w25/w25-06-ai-intake`. **Blocked on the owner.**

`/Users/ivan/RC-pics-ai/` does not exist today. The card STOPS and reports until files are
in it. When they are: enumerate programmatically, match by slot id, **reject any file
carrying text, a logo or a face and list it**, convert through
`scripts/process-packshot.js`, write R3 provenance rows, fill the slots, re-measure the
height budgets under W24-R4, and re-measure the hub label contrast by hand on every filled
tile.

**The reject step is a person looking at the file.** R-W's amendment says so plainly: a
watermark, a logo, a face and another seller's branding are properties of the picture, not
of the URL, and no gate can see them.
