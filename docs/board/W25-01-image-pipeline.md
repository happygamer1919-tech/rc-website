# W25-01 · The image pipeline: a filled slot, its provenance, and the gate that holds them

| | |
|---|---|
| Dispatched | Wave 25, 2026-09-20 |
| Rulings in force | R-V, R-W as amended by W25-R1 and W25-R3, R-X, R-Y, R-Z, R-AA, R-AB, section 12.0, and W25-R1 to W25-R4 |
| Depends on | #89, merged as `9de1fb4` |
| Opens | Q-W25-01 (WebP) |
| Ships no image | Every one of the 261 slots is still a placeholder. This card builds the road. |

## The precondition

`#89` merged as `9de1fb4`. Deploy succeeded, edge polled until it served that sha, then
`node scripts/verify-live.js https://rapidconstruct.md` **exit 0, PASS, 0 unverified, 0
failed, 51 of 51**. Section 12.0's first application, run unprompted.

## 1 · One component, two outcomes

Every one of the eight call sites that renders an image asks for a slot by id and gets
back **either** the placeholder box it has always got **or** a real `<picture>`. Which one
is decided by the **ledger**, and by nothing at the call site. So a slot flips from empty
to filled by one field in one JSON file, and the eight callers never learn about images.

**The frame does not move.** The `<picture>` takes the same box from the same
`--ph-ratio`, so filling a slot changes no layout and no height budget.

**`object-fit: contain` on white for packshots**, because a tall bottle of primer and a
square tile both have to sit inside the square untouched: `cover` would crop the bottle's
cap off, and a cropped packshot is a picture of a different product. `cover` is used on
the three families that are scene photographs with a label over them (hub tiles, category
tiles, the copertine hero), where a letterbox would read as a mistake.

**`width` and `height` are emitted** so the box is reserved before the bytes arrive, and
they are derived from the ledger's ratio rather than written a second time (section 14).

**Lazy below the first row.** The caller says which, because only the caller knows where
in a list it sits: the first four catalogue cards, the first two hub tiles, the
before/after pair and the copertine hero are eager; everything else is lazy.

## 2 · The ledger grows three fields

`state` (`placeholder` or `filled`), `provenance` (the path of the image, which is the key
of its row in `PROVENANCE.md`) and `alt` (per locale). **All 261 slots ship
`placeholder`.** A filled slot with no provenance or no alt does not build: an image with
no provenance row is what R-W exists to prevent, and an image with no alt is a hole in the
page for anyone not looking at it.

## 3 · Gate 19 now holds the filled half, with eight arms

The scanner matched only `<div>`. A filled slot is a `<picture>`, so **every filled slot
would have been reported as rendered by no page** — the reverse assertion firing on a slot
that was working. Fixed, and the element name is now read and compared to `state`.

New assertions on a filled slot: it has an `<img>`, it has alt text, its ledger row names
a provenance row, **that row exists**, its source is not a forbidden host, its licence is
one of R-W's approved origins, and **a generated image is refused on an evidence slot**
(`BA-`, `PROJ-`, `PORT-` prefixes) because a render is never a proof image.

| Arm | Fires on |
|---|---|
| a rendered placeholder with no ledger row | `unledgered` |
| a ledger row nothing renders | `unrendered` |
| a rendered ratio disagreeing with its row | `ratio` |
| **a filled slot whose provenance names fatade3d.md** | `forbidden-host` |
| **a filled slot with no provenance row at all** | `no-provenance` |
| a filled slot whose licence is not an approved origin | `unapproved-origin` |
| a generated image on a before/after slot | `render-as-proof` |
| the ledger says filled and the page renders a box | `state` |

The dispatch names the fourth and fifth by name. **Two controls**, a placeholder one and a
filled one, both watched clean immediately before the arms and immediately after: without
a green filled control an arm firing could be the filled path being broken rather than the
plant being caught.

## 4 · `scripts/process-packshot.js`

`node scripts/process-packshot.js <file> <SLOT-ID> [--dir catalog]`. Longest side 800px,
metadata gone, and it prints the ledger fields and the provenance row to paste.

**It does not touch the ledger.** A tool that flips `state` to filled on its own would let
an image reach the site without anyone reading its provenance.

Three refusals, each watched firing: a file that is **not an image by its bytes** (a
downloaded "packshot" that is really an HTML error page reads exactly like this), a source
whose longest side is under 800px (**upscaling invents detail that was never
photographed**; the slot stays a placeholder instead, per W25-R4), and **metadata that
survived the strip**, read back from the written bytes rather than trusted.

`sips -d all` is not available on this macOS (error 13); the strip is the re-encode plus
an exiftool pass where it is installed, and the read-back assertion is what decides.

## 5 · The proof run, and the two things it found

The arms only prove the gate. So two real slots were filled end to end, built, measured,
and reverted. It found:

1. **A doubled path.** Every filled slot emitted `/img/img/catalog/CAT-0001.jpg`, because
   the provenance path already carries `img/` and the code pasted another in front. No arm
   would ever have caught that; only rendering one did.
2. **The provenance gate refusing my own proof rows**, correctly: they claimed
   `legacy, licence unverified` for files that are not legacy. That gate works.

With both fixed, all 19 gates passed with two slots genuinely filled, and the RO and RU
alt text came out per locale as intended.

## 6 · The hub label over a real photograph

W24-R5 permits a bottom gradient inside a hub tile so a white label stays legible once a
photograph lands. **Measured on a filled tile, by sampling the painted pixels behind the
label: 6.77:1 worst case against white**, mean 9.50:1, against a 3:1 large-text threshold
at 24px/700. The unfilled tiles read 18 to 19:1 on their dark ground.

Gate 20 now asserts the **mechanism** on every filled tile: the gradient exists and covers
the label's box, at both widths. **The pixel ratio itself is not gate-enforced and that is
stated rather than implied**: a very bright packshot could drop it, and no cheap assertion
sees that. W25-05 and W25-06 re-measure by hand per filled hub tile.

## 7 · WebP is not shipped

The dispatch asks for WebP plus a JPEG fallback. The JPEG half ships. **WebP cannot be
encoded on this machine by anything already here**: `sips -s format webp` exits 13, macOS
26.6.2's ImageIO lists `public.jpeg`, `public.png` and `public.jpeg-2000` as its writable
types and not WebP, and there is no cwebp, no ImageMagick and no npm package in a repo
with no `package.json` by design. Every route is a new dependency, and `docs/CLAUDE.md`
says not without asking. **Q-W25-01**, recommending one Homebrew binary.

`build.js` already emits `<source type="image/webp">` the moment a `.webp` sits beside the
`.jpg`. The day that question is answered, one line changes in one script.

## Gates

19 of 19 exit 0, each its own process with its exit code read (R-AB).
