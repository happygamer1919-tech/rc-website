# RULING R-W · Every shipped image has a recorded provenance, 2026-09-15

Recorded at the owner's instruction, from the wave 14 dispatch (card RC-102).

## The ruling, as given

> `docs/assets/PROVENANCE.md` has columns file, source URL, licence, licence URL,
> date. `scripts/check-asset-provenance.js` walks the image tree, fails on any
> image file with no row, and fails on any row whose source URL hostname matches
> fatade3d.md, imperlux.md or dasterum.md. It is wired into the `quality` check.
>
> This ships before any image lands. Every later card that adds an image adds
> its provenance row in the same commit.

## Implementation

`scripts/check-asset-provenance.js`, run by the `quality` workflow on every pull
request.

## Recorded interpretations, each open for ratification

1. **"The image tree" is `public/`, recursively.** That is everything the site
   serves. `photos-raw/` is git-ignored raw input, and `Services_real images/`
   is the client's unprocessed originals; neither is published. A file enters
   the tree when it is processed into `public/`, and that is when it needs a row.
2. **The walk is of the filesystem, not the git index.** An image copied into
   `public/` and not yet committed fails the check. That is what makes the
   acceptance test (a planted, unlisted image) meaningful.
3. **Hostname matching includes subdomains.** `www.dasterum.md` and
   `cdn.imperlux.md` fail the same as the bare domains. The match is on the
   parsed hostname, not a substring, so `notdasterum.md.example.com` is not
   caught and `dasterum.md.example.com` is not caught either. Neither is the
   competitor's host.
4. **Presence, not silence (`docs/CLAUDE.md` section 13).** A row must fill all
   five columns. An empty cell fails. Images that shipped before R-W, whose
   licence was never recorded, carry the literal value `unrecorded before R-W`.
   That value is accepted only on rows dated before 2026-09-15. A row dated on
   or after R-W with that value fails.
5. **One row per file**, including `@2x` variants. The check fails on any file
   without its own row and on any row naming a file that does not exist.

## Amendment · Legacy status and approved origins, 2026-09-15, W14-02b

Appended under R-T. Nothing above this block is edited. Recorded at the owner's
instruction from the wave 14 close-out dispatch.

> A provenance row may carry status "legacy, licence unverified" for images
> present on main before commit f5e4eb6. The gate fails only for images added at
> or after that commit without a licence row.
>
> Approved origins, additive to R-W: supplier packs from Dasterum, Caparol,
> Duraziv, Roko Aquamix; and Unsplash, Pexels, Pixabay with the licence URL
> recorded per file. Forbidden hostnames unchanged.

### How the gate holds it

1. **"Present on main before f5e4eb6" is a fingerprint, not a filename.**
   `docs/assets/LEGACY-IMAGES.txt` lists the path and sha256 of every image in
   f5e4eb6's first parent, e49e02e: 149 files. A row may say `legacy, licence
   unverified` only when its file's path is in that list **and its bytes still
   hash to the recorded value**. A legacy file overwritten with a new image loses
   the status and must carry a real licence row. The list is committed because
   CI checks out without history, and a gate that needs history it does not have
   would pass silently.
2. **Every other image needs a licence row:** a non-empty licence, and a licence
   URL that is a real `https://` URL, or, for a supplier pack, a cell starting
   `supplier permission:` that says who granted it and when. `legacy` and the old
   `unrecorded before R-W` value are refused on these rows.
3. **Forbidden hostnames are unchanged** and still apply to every row, legacy or
   not. A supplier pack from Dasterum is therefore recorded as a pack received
   from the supplier, never as a URL on dasterum.md.
4. **The approved origins are recorded, not enforced as an allow-list.** The
   dispatch makes them additive to R-W, which only forbade. The gate checks that
   a stock image names its licence URL; which library it came from is visible in
   the row.

The old `unrecorded before R-W` value is retired: the 131 rows that carried it
now say `legacy, licence unverified`, and each of their files is in the list.

---

### Amended 2026-09-18 by the wave 23 dispatch · client-supplied originals

Added under R-T; nothing above this block was edited. Recorded at the owner's
instruction, from the wave 23 dispatch:

> Client-supplied originals are an approved origin. Provenance row: source "client
> direct transfer, Mihai, 18.09.2026", licence "owned by Rapid Construct, supplied
> for site use", no URL required for this origin only. All EXIF and GPS stripped
> before commit, verified by exiftool showing no GPS tags.

**Scope: this origin only.** Every other image still needs a real licence and a
licence URL, or `supplier permission: ...` for a supplier pack, and the provenance
gate still refuses an empty cell.

**The licence line describes the origin, not the content.** A client transfer cannot
make Rapid Construct the owner of a frame that is visibly someone else's: a
third-party watermark on the image, or a 3D visualisation standing in for a
photograph of real work, contradicts it. Such a file is held with its reason
recorded rather than published under this row. Both cases occurred in the first
batch this amendment covered; the evidence is in DECISIONS.md, W23-01.


### Amended 2026-09-20 by the wave 25 dispatch · two new approved origins, and the never-origins made enforceable

Added under R-T; nothing above this block was edited. The rulings are recorded verbatim in
`DECISIONS.md` as block **W25-R**; this block records what changes for `public/`.

**New approved origin 1: MANUFACTURER OFFICIAL SITE.** For a product in
`content/catalog-products.json`, a packshot may be downloaded from the manufacturer's own
domain, or from its official national distributor domain **named on the manufacturer's own
site**. The row carries the source page URL, the image URL, the manufacturer, the capture
date, and the licence field exactly:

    manufacturer packshot, reseller display, licence not verified, owner accepted 2026-09-20

**That string is fixed text and is not paraphrased on any row.** It states plainly that no
licence was verified and that the owner accepted the reseller-display risk on a named date.
A row that softens it is a row that misrepresents what was checked. **Caparol rows cite the
W23-04 permission instead**, which is a real permission with conditions and a licence URL.

**New approved origin 2: OWNER AI GENERATED.** Provenance
`AI generated for Rapid Construct, tool named by owner, date`, with no URL, because there
is no source page. **Confined by slot kind**: permitted on product, hub, hero and
cross-sell slots, and **forbidden on project, portfolio and before/after slots**. Those
three are evidence slots: a before/after pair asserts that Rapid Construct did that work,
and a generated image there is a false claim rather than a decoration. *A render is never
a proof image* is the existing rule and this amendment does not touch it. Alt text on a
generated image describes the material or the product and never states that a pictured job
is Rapid Construct's.

**The forbidden hosts are UNCHANGED**: `fatade3d.md`, `imperlux.md`, `dasterum.md`,
subdomains included. Restated here on purpose, so a widened permission is not read as a
widened host list.

**The never-origins are now a list, and it is enforced rather than recorded.** No image may
come from a retailer, a marketplace, another reseller, a search result thumbnail, or a
stock site other than those already approved; and no image may carry a watermark, a
retailer logo, a person's face, or another seller's branding. The first five are hostnames
and are machine-checkable. **The last four are properties of the picture, not of the URL,
and no gate can see them**: they are checked by a person looking at the file before it is
committed, and that is stated here rather than implied, because an unenforceable rule
presented as enforced is worse than one presented plainly.

**A slot with no compliant image stays a placeholder** (W25-R4). Never a near match, never
a different variant, never a different brand. A placeholder is an acceptable outcome.

---

## AMENDED (W25-R7, 2026-09-21): a third approved origin, `direct_supplier`

> New approved origin direct_supplier: dasterum.md. Owner states the client buys directly
> from Dasterum and accepts use of their product data, public prices and product images.
> Conditions: watermark left exactly as published, never cropped out, never inpainted, no
> upscaling, floor 450 holds, ledger records the source URL per file. This amends W24-R for
> dasterum.md only. fatade3d.md and imperlux.md image files stay forbidden.

**This is the first time an image file may come from one of the three hosts this ruling was
written to keep out.** It is narrow in every direction and the narrowness is enforced, not
described.

### The licence string, which is fixed text

    direct supplier, dasterum.md, owner buys directly and accepts use of their
    product data and images, watermark as published, owner accepted 2026-09-21

**Written on one line, character for character.** It names the host it belongs to, so it
cannot be used to launder any other origin, and a row that drifts one word from it loses
the permission and fails.

### How each condition is held

| Condition | Held by |
|---|---|
| Only `dasterum.md` | `scripts/fetch-packshot.js`: the host is refused unless the run passes `--dasterum`, so a Dasterum URL cannot arrive by accident in a run meant for a manufacturer. `fatade3d.md` and `imperlux.md` are refused with or without it |
| The watermark stays as published | nothing crops or inpaints: `process-packshot.js` only re-encodes and scales, and no crop was passed on any of the 71 |
| No upscaling | `process-packshot.js` writes `min(OUTPUT, longest side)`. All 71 are 488x488 and all 71 are written at 488 |
| The 450 floor holds | unchanged, and 488 clears it by 38 |
| The ledger records the source URL per file | `scripts/check-asset-provenance.js`: a row carrying this licence and naming **no** `dasterum.md` URL is a failure, which is the condition asserted from the other side |

### Two places the host stays banned by default

`scripts/check-asset-provenance.js` keeps `dasterum.md` in `BANNED` and skips it **only**
for a row whose licence is the sentence above. `scripts/check-photo-slots-w24.js` keeps it
in `FORBIDDEN_HOSTS` and lifts it **only** for a row whose licence names
`direct supplier, dasterum.md`, with a self-test arm that plants a Dasterum source under an
ordinary licence and must fire.

**Lifting by exception rather than by removal is the point.** A row that stops carrying the
permission stops being allowed, without anyone having to remember to put the host back.

### A defect this amendment found in interpretation 3

Interpretation 3 above says "Hostname matching includes subdomains" and names
`www.dasterum.md`. **In `check-photo-slots-w24.js` it did not.** Its pattern required a
non-`[a-z0-9.-]` character before the host, and the character before `dasterum.md` in
`www.dasterum.md` is a dot, so every subdomain slipped past. It was found by writing the
self-test arm for this amendment, using the real URL shape.

The leading class is now `[^a-z0-9-]`, which accepts a preceding dot. `notdasterum.md` is
still not caught, because the character before is a letter, and `dasterum.md.example.com` is
still not caught, because the trailing class still refuses a following dot. Both of those
are interpretation 3's own words and both still hold.

---

## AMENDED (W28-23, wave 28, ruling R-W28-06): the stock set on the fatade group

Added 2026-09-24 by card W28-23. Nothing above this line moves.

**The owner's rule, verbatim** (second wave 28 dispatch): "allowed sources are Pexels, Unsplash,
Pixabay, Wikimedia Commons with CC0 or public domain, and Google Images only with usage-rights
filter Creative Commons and the licence verified on the landing page. No attribution-required
licences, no editorial-only, no watermark, no visible logo, brand, company name, vehicle livery or
text overlay in the frame, no identifiable faces. Every image gets a row in docs/images/SOURCES.md:
file, page, source URL, licence, subject."

**What it adds to this ruling.** A new approved origin, written in the licence cell as
`stock library, <licence>, R-W28-06, ...` where `<licence>` is one of `Pexels License`,
`Unsplash License`, `Pixabay Content License`, `CC0 1.0`, `Public domain` (the last two for
Wikimedia Commons, or Google Images with the licence verified on the landing page). The source
cell names the picture page and the picture file on the site's own hosts. The licence URL is the
site's licence page. **It is permitted on the fatade group only** (a catalogue record whose data
came from fatade3d.md, or a category tile standing on one), where R-W28-06 makes it the product
picture; W25-R23's "licence-free library" origin keeps its three secondary slots and nothing else
changes. `docs/images/SOURCES.md` is the owner's manifest of the same pictures (file, page, source
URL, licence, subject), written by `scripts/intake-stock.js` in the same step as this ledger's row,
and gate 32 (`scripts/check-image-sources.js`) holds the two together: a stock picture without a
SOURCES row, a SOURCES licence outside the allowed set, or a SOURCES row without a row here fails.
Gate 19 (`scripts/check-photo-slots-w24.js`) refuses the origin off the fatade group (arm
`stock-not-fatade`) and accepts it on the group (a green arm). W28-24 uses the same origin for the
service galleries' stock photographs, whose rows sit in `content/galleries.json` beside the owner's.

**Pictures may be WebP.** The stock pictures are encoded by the Chrome the gates run
(`scripts/webp-encode.js`, a canvas export, no dependency); this ledger's rows name `.webp` files
like any other, and gate 17 reads their chunks.
