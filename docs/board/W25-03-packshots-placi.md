# W25-03 · Packshots: plăci ceramice

| | |
|---|---|
| Dispatched | Wave 25, 2026-09-20 |
| Rulings in force | R-W as amended by W25-R1 to W25-R4, R-AB, section 12.0 |
| Depends on | #91, merged as `7408a6b` |
| Opens | Q-W25-04 (the attribution of 70 records) |
| Blocked by | Q-W25-02, unanswered |
| Result | **0 filled of 88.** No image was installed and no product record was changed. |

## The precondition

`#91` merged as `7408a6b`, deploy succeeded, edge polled until it served that sha,
`node scripts/verify-live.js` **exit 0, PASS, 0 unverified, 0 failed, 51 of 51**. The
first real photograph, `CAT-0010`, is live and its page reads 6,801px against a 6,861
budget.

## Why nothing was filled: two independent blocks, both measured

This was expected to be the wave's easiest card: 88 products, one manufacturer, one site.
Both assumptions held. **Neither helped.**

### Block 1: the 800px floor, now confirmed on the manufacturer that matters most

`phomi.com` is the manufacturer's own site, confirmed by its footer and its About page.
Its catalogue is properly built: one page per product, each with a clean single-tile face
image on a plain ground, which is exactly what this card's dispatch asks for and not a
room scene.

**`Rome Travertine`, fetched and looked at: 459 x 398px.**

It is a correct, clean, manufacturer-published tile face with no watermark, no logo, no
face and no third-party branding. **It is refused on pixels alone**, and so is every other
image on that domain.

| Manufacturer | Products at stake | Their own image | Verdict |
|---|---|---|---|
| ROCKWOOL | 1 | 800 x 600 | filled at W25-02 |
| DURAZIV | 2 | 343 x 335 | refused on pixels |
| ROKO AquaMix | 2 | 492 x 400 | refused on pixels |
| **Phomi** | **88** | **459 x 398** | **refused on pixels** |

**Four manufacturers tested, three under the floor, and the one carrying 88 products is
among them.** A catalogue card's image box is about 264px wide at 1440, so 528px at 2x.
**Q-W25-02** is now the single decision gating the largest card in the wave, and a
travertine surface is the most forgiving subject there is for a 1.7x upscale: it has no
text and no hard edges to soften.

### Block 2: seventy of the eighty-eight are not Phomi products

Matched name by name against Phomi's own catalogue:

| | Count |
|---|---|
| Exact match to a Phomi catalogue name | **17** |
| Match with a suffix difference (`Polished Wood 4.0`) | 1 |
| **No match anywhere in Phomi's catalogue** | **70** |

The source's own data disagrees with itself, which is what makes this a finding rather
than a suspicion: `placa-ceramica-elysee-pure-white` is displayed as `Placă Kamu Yellow`,
and `placa-ceramica-elysee-pure-red` as `Placă Kamu Red`. **A product whose own address
says `pure-white` is displayed as Yellow.**

W24-03 copied those names verbatim and was right to. But under W25-R4 I cannot fetch a
picture of `Kamu Red` from Phomi, **because Phomi does not make anything called Kamu Red**.
Any image chosen would be a different product wearing this one's name.

**Q-W25-04** puts the options and recommends hiding the brand line on those 70, the way
the 64 RedConstruct records already work, because **the site currently tells visitors that
Phomi makes 70 products Phomi does not make.** That is a factual claim about a
manufacturer, and it is wrong today whether or not a photograph ever lands on it.

## What a ruling on Q-W25-02 would unlock here

**17, not 88.** The seventeen real Phomi products have correct images on the
manufacturer's own domain at about 459px. The other 70 need Q-W25-04 answered first, and
on the recommended answer they go to W25-05 rather than to a manufacturer at all.

## Method note

No agents. W25-02's research ran fourteen and eleven stalled; this card was worked
directly with `WebFetch` and `curl`, which found the manufacturer, its catalogue structure
and its exact image URLs in a handful of calls. The single image fetched went through
`scripts/fetch-packshot.js` like any other and was deleted after measurement.

`phomi-mcm.com`, which a search returns first, **301s to a `.store` domain**. It was not
used: a shop is not an origin under W25-R2, whatever it is called.

## Gates

19 of 19 exit 0, each its own process with its exit code read (R-AB). The tree is
unchanged apart from documents, so the counts are W25-02's: `ledger slots filled: 1 of
261`, 588 placeholders matched both ways.
