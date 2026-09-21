# W25-04 · Sisteme de iluminare: nought of twenty-five, attempted and measured

Card W25-04. Branch `w25/w25-04-packshots-iluminat`, stacked on
`w25/w25-03d-brand-settlement`. PR only, stops for the owner.

## The result

**0 filled of 25.** Every one of the 25 lighting products stays a placeholder, and all 25
go to W25-05.

The plan predicted 0 of 25 and said the card must "re-derive the count from the records at
the time it is worked, confirm no product gained a manufacturer since, and report the count
it measured, not the count written here". Re-derived today from
`content/catalog-products.json`:

| | Count |
|---|---|
| Products in `sisteme-iluminare` | **25** |
| Of those, naming a manufacturer | **0** |
| Of those, naming none | **25** |

No product has gained a manufacturer since the plan was written.

## This was attempted, not assumed, and that distinction is W25-02's lesson

W25-02 reported eleven manufacturers as unattempted after its agents stalled, and that was
nearly read as "those manufacturers have nothing". So this card went looking before it
reported a zero.

**What the records hold.** All 25 are named by a bare code: `GMD-881F`, `K1207`, `K5014`,
`K41041`. `brand` is `null` on every one, which W24-03 set because the source's brand field
was the reseller's own name, and W17-02 refuses that.

**What the source page holds.** Three of the product pages were read for text, which W24-R2
permits and which is not fetching an image. **They carry no manufacturer field at all**: no
"Marca", no "Producător", no brand attribute, nothing in the product meta. The source does
not know who makes them either.

**What a search holds.** `K1207` and `GMD-881` were searched as lighting model codes. They
return general outdoor-lighting catalogues from unrelated manufacturers and no product
under either code. They are OEM codes of the kind sold under many names, which is exactly
the case where a confident guess puts a photograph of a different lamp on the card.

**So there is no manufacturer official site to be the origin**, which is W25-R1's only
approved origin for a packshot. Under W25-R4 the slot stays a placeholder. That is the
whole card.

## What this card leaves behind that a machine keeps holding

A card whose result is a number stops being true the day someone edits the data. So the
result is now a rule, in gate 19:

**A filled slot whose catalogue record names no manufacturer may not claim a "manufacturer
packshot" origin.** There is no such manufacturer, so there was no such site, and the only
place a file could have come from is a reseller, which W25-R2 forbids by name. Gate 19
already read the ledger and the provenance rows; it now reads
`content/catalog-products.json` too, and judges only slots that appear in it.

It is deliberately not "a slot with no manufacturer may never be filled": **W25-R3 permits
an owner-generated image on a product slot**, and that is exactly what W25-05 exists to
produce for these 25. The rule refuses a false claim about where a photograph came from,
not a legitimately generated one.

**Watched fire, both synthetically and on the shipping files (R-AB):**

| Plant | Exit | Message |
|---|---|---|
| self-test arm, a filled slot with a manufacturer packshot and a null brand, against a control whose brand is Caparol | fires | `no-manufacturer` |
| `CAT-0033`'s manufacturer removed on the real data, its slot still filled | 1 | `no-manufacturer`, naming the slot and the page |

Control clean immediately before and after both. Gate 19 now runs **11 arms** and prints
`catalogue records read: 223, of which 103 name no usable manufacturer`.

## The 25, by name, handed to W25-05

`CAT-0196` GMD-881F · `CAT-0197` GMD-881Y · `CAT-0198` GMD-F841F-2 · `CAT-0199` K1207 ·
`CAT-0200` K1212S · `CAT-0201` K1213M · `CAT-0202` K1241 · `CAT-0203` K1247 ·
`CAT-0204` K2148 · `CAT-0205` K2276 · `CAT-0206` K5014 · `CAT-0207` K5016 ·
`CAT-0208` K41041 · `CAT-0209` K41047 · `CAT-0210` K41059 · `CAT-0211` K41061 ·
`CAT-0212` K45015 · `CAT-0213` K1247 · `CAT-0214` K2146 · `CAT-0215` K2880 ·
`CAT-0216` K2088L · `CAT-0217` K2222 · `CAT-0218` K2841 · `CAT-0219` K2842 ·
`CAT-0220` K1823

**`CAT-0203` and `CAT-0213` are both named "Lampă K1247"** and are separate records with
separate source URLs. They are handed over as two entries, because merging catalogue
records is a product decision and was not asked for. It is noted here so that two prompts
producing two pictures of one lamp is a known outcome rather than a surprise.

## The wider count, which W25-05 needs

Re-derived today: **103 catalogue products have no usable manufacturer**, being the 36 with
no `brand` at all and the 67 carrying `brand_hidden`. That is up from the plan's 100,
because W25-03d added `brand_hidden` to three ceramic plates.

| Group | Products |
|---|---|
| Elemente decorative, `brand_hidden` | 64 |
| Sisteme de iluminare, no manufacturer | 25 |
| Termoizolație, tencuieli, alte materiale, no manufacturer | 11 |
| Ceramic plates in no catalogue, `brand_hidden` (W25-03d) | 3 |
| **Total** | **103** |

## Gates

**22 of 22 exit 0**, reported by `node scripts/run-gates.js`. Gate 19 reads `ledger slots
filled: 27 of 261` and `103 name no usable manufacturer`.

## Recorded for ratification

1. **Gate 19 gained a rule no ruling asked for.** A card whose result is a count leaves
   nothing behind; this leaves the part of it that stays true.
2. **`CAT-0203` and `CAT-0213` are the same lamp name** on two records, and are not merged.
