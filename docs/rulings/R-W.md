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
