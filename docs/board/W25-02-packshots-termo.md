# W25-02 · Packshots: termoizolație, tencuieli, vopsele, alte materiale

| | |
|---|---|
| Dispatched | Wave 25, 2026-09-20 |
| Rulings in force | R-W as amended by W25-R1 to W25-R4, R-AB, section 12.0 |
| Depends on | #90, merged as `7c0ccf6` |
| Opens | Q-W25-02 (the 800px floor), Q-W25-03 (two judgement calls) |
| Result | **1 slot filled of 35 fetchable.** 46 products in scope, 11 with no manufacturer. |

## The precondition

`#90` merged as `7c0ccf6`, deploy succeeded, edge polled until it served that sha,
`node scripts/verify-live.js` **exit 0, PASS, 0 unverified, 0 failed, 51 of 51**.

## What shipped

**`CAT-0010`, ROCKWOOL Rockton Super.** 800x600 from ROCKWOOL's own brand portal, the
product alone on a plain studio background, no watermark, no retailer logo, no face, no
other seller's branding. **I looked at the file** before it was installed, which is the
step R-W's amendment says no gate can do. Re-encoded to 126KB, metadata asserted absent.

It is the **first real photograph on the site**, and it renders exactly as W25-01
designed: contained on white, in the same box its placeholder occupied, no layout shift
and no height change on the page.

## What did not ship, and why

**Of 46 products in scope, 11 carry no manufacturer** and were never W25-02's to fetch:
their source brand is `Fatade3D`, which W17-02 refuses, so W24-03 stored `brand: null`.
They go to W25-05.

**Of the 35 fetchable, 34 are still placeholders.** Two distinct causes, and only one of
them is about the products.

### Cause 1: the 800px source floor, which is the real story

| Manufacturer | Their own packshot | Verdict |
|---|---|---|
| ROCKWOOL | **800 x 600** | filled |
| DURAZIV, both products | 343 x 335 | refused on pixels |
| ROKO AquaMix, both products | 492 x 400 | refused on pixels |

**Every one of those refusals was correct in every other respect**: the manufacturer's own
site, the right product, the right pack size, the product alone on a plain background.
They were refused on pixels alone, and DURAZIV publishes no larger original anywhere.

A catalogue card's image box is about 264px wide at 1440, so 528px at 2x. **800 is an
output target that became an input floor**, and it is rejecting images the site could not
show the difference on. **Q-W25-02** puts the three options and recommends lowering the
floor to 500 and the output to 600, which fills the slots without upscaling a single pixel.

### Cause 2: the research did not finish

Fourteen agents, one per manufacturer. **Eleven stalled** on repeated no-progress timeouts
and returned nothing: Caparol (15 products, the largest single share), Baumit (5), FAWORI,
NOVOTERM, KREISEL, Ceresit, ISOMAT, STANCOLAC. Three finished and returned candidates.

**That is a tooling failure, not a finding about those manufacturers.** Caparol and Baumit
both run live national sites for Moldova, checked by hand afterwards: `www.caparol.md` and
`baumit.md` both answer 200. Their products are almost certainly fetchable and they are
listed as unattempted rather than as absent.

## What the run proved about trusting a researcher

Three candidates came back marked `found`. **Two were unusable and only the fetch guard
caught them**: Penoplex's image URL answered HTML rather than an image, and SWEETONDALE's
host failed TLS certificate verification. One of three claimed image URLs was real.

That is the argument for `scripts/fetch-packshot.js` existing at all. Research is
open-ended work; deciding whether a URL may be fetched is a rule, and the rule lives in
one place that cannot be talked round. Its five refusals were watched firing before it was
used: a forbidden host on the image URL, a forbidden host on the source page, a subdomain
of a forbidden host, a marketplace, and a response that is not an image by its bytes. It
re-checks every redirect hop, because that is how a tidy manufacturer URL becomes a
marketplace one.

## Gates

19 of 19 exit 0, each its own process with its exit code read (R-AB), with a real image on
the site: gate 19 reads `ledger slots filled: 1 of 261` and matches 588 placeholders both
ways; gate 17 finds no GPS; gate 20 is green at both widths.
