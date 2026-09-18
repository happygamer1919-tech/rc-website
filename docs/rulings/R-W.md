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

