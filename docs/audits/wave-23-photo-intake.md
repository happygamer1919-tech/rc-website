# Wave 23 photo intake: batch 2

Card W23-01, 2026-09-18. **Facts and decisions, file by file.** The source folder,
`/Users/ivan/RC-pics_2nd batch`, was read only and never modified.

**Ruling in force:** R-W as amended 2026-09-18. Client-supplied originals are an
approved origin; the provenance row reads source "client direct transfer, Mihai,
18.09.2026", licence "owned by Rapid Construct, supplied for site use", and needs no
licence URL. All EXIF and GPS is stripped before commit.

## 1. What arrived

| | |
|---|---|
| Folders | `Acoperisuri/` 7, `Before_after/` 8, `Garduri/` 6, plus `echipa.jpeg` |
| Files | **22 images** (a `.DS_Store` is ignored) |
| Copertine | absent, as the dispatch says; not blocking |
| GPS in the originals | **none**, 22 of 22, read with `exiftool -r -if '$gps:all'` |
| Other metadata of note | the four `After_*.JPG` carry `Software: Picasa`; no camera model or capture date anywhere |

## 2. Inventory, and what happened to each file

| # | File | Pixels | Bytes | sha256 (first 16) | GPS | Decision | Why |
|---|---|---|---|---|---|---|---|
| 1 | `Acoperisuri/WhatsApp Image 2026-09-18 at 4.19.47 AM (1).jpeg` | 896x1195 | 386,992 | `86bbc24f8e7a4c68` | none | **HOLD** | third-party watermark in the sky, upper right; the R-W amendment cannot make a watermarked frame ours |
| 2 | `Acoperisuri/WhatsApp Image 2026-09-18 at 4.19.47 AM (2).jpeg` | 1365x768 | 401,562 | `c5eee03704d371db` | none | **PUBLISHED** | `proj-acoperisuri-06-cover` (F-PORT-6), plus its @2x |
| 3 | `Acoperisuri/WhatsApp Image 2026-09-18 at 4.19.47 AM (3).jpeg` | 1195x896 | 310,963 | `34df30697916ae7b` | none | **HOLD** | no slot: roof covers 01 to 05 are filled and 06 is taken by file 2 |
| 4 | `Acoperisuri/WhatsApp Image 2026-09-18 at 4.19.47 AM.jpeg` | 1365x768 | 339,991 | `e155b04c23614f4d` | none | **HOLD** | no slot, as file 3 |
| 5 | `Acoperisuri/WhatsApp Image 2026-09-18 at 4.19.48 AM (1).jpeg` | 1365x768 | 297,418 | `9a3bf73877f68026` | none | **HOLD** | no slot, as file 3 |
| 6 | `Acoperisuri/WhatsApp Image 2026-09-18 at 4.19.48 AM (2).jpeg` | 1365x768 | 278,130 | `9cc7101426442bf1` | none | **HOLD** | no slot, as file 3 |
| 7 | `Acoperisuri/WhatsApp Image 2026-09-18 at 4.19.48 AM.jpeg` | 686x915 | 155,513 | `269c930a6f44bad5` | none | **HOLD** | third-party watermark in the sky, right edge |
| 8 | `Before_after/After_1.JPG` | 1024x1044 | 160,008 | `dbd67463f5ce105c` | none | **HOLD** | 3D visualisation, not a photograph of finished work (W23-02) |
| 9 | `Before_after/After_2.JPG` | 768x1364 | 160,517 | `0af0e57a508b919f` | none | **HOLD** | 3D visualisation, not a photograph (W23-02) |
| 10 | `Before_after/After_3.JPG` | 1264x845 | 243,020 | `a7b4b8f1714f9a1b` | none | **HOLD** | 3D visualisation, not a photograph (W23-02) |
| 11 | `Before_after/After_4.JPG` | 896x1194 | 212,115 | `bb554373dd9bff75` | none | **HOLD** | 3D visualisation, not a photograph (W23-02) |
| 12 | `Before_after/Before_1.JPG` | 1080x1101 | 302,752 | `f5f3301828a7a981` | none | **HOLD** | a before half whose after is a visualisation, so the pair cannot publish |
| 13 | `Before_after/Before_2.JPG` | 1200x2133 | 419,017 | `33ec64ad553f9005` | none | **HOLD** | as file 12 |
| 14 | `Before_after/Before_3.JPG` | 604x404 | 95,454 | `5b135f1209d303c6` | none | **HOLD** | as file 12; also 604x404, the smallest file in the batch |
| 15 | `Before_after/Before_4.JPG` | 736x981 | 182,831 | `0cfd7977e888baf6` | none | **HOLD** | as file 12 |
| 16 | `Garduri/WhatsApp Image 2026-09-18 at 4.21.04 AM (1).jpeg` | 510x462 | 51,432 | `ade8529fe1dc43b0` | none | **HOLD** | no slot: the garduri image slots (I-G-*) have no host component on the site |
| 17 | `Garduri/WhatsApp Image 2026-09-18 at 4.21.04 AM (2).jpeg` | 736x1308 | 162,536 | `c89cfe431e40de7b` | none | **HOLD** | no slot, as file 16 |
| 18 | `Garduri/WhatsApp Image 2026-09-18 at 4.21.04 AM (3).jpeg` | 640x800 | 75,690 | `bae1a9c94a05a592` | none | **HOLD** | no slot, as file 16 |
| 19 | `Garduri/WhatsApp Image 2026-09-18 at 4.21.04 AM (4).jpeg` | 676x1200 | 126,662 | `922e39ad44cbf773` | none | **HOLD** | no slot, as file 16 |
| 20 | `Garduri/WhatsApp Image 2026-09-18 at 4.21.04 AM (5).jpeg` | 736x736 | 134,084 | `55d5d9f1271bae14` | none | **HOLD** | no slot, as file 16 |
| 21 | `Garduri/WhatsApp Image 2026-09-18 at 4.21.04 AM.jpeg` | 736x981 | 116,154 | `f12fd9a284f8a160` | none | **HOLD** | no slot, as file 16 |
| 22 | `echipa.jpeg` | 736x920 | 224,626 | `05749e322b55ef5f` | none | **HOLD** | no slot: F-CONS-1 and I-G-HERO-1 have no host component; faces are visible, see the privacy review |
**Published: 1 of 22. Held: 21.**

## 3. Mapped and unmapped, against docs/assets/PENDING-PHOTOS.md

| Outcome | Count | Which |
|---|---|---|
| **Mapped to a slot and published** | 1 | file 2 to **F-PORT-6**, `proj-acoperisuri-06-cover` and `@2x` |
| Would map, but the slot's host does not exist on the site | 7 | the 6 garduri photos (I-G-*) and `echipa.jpeg` (F-CONS-1, I-G-HERO-1) |
| Would map, but the slot is already filled or taken | 4 | roof files 3 to 6: covers 01 to 05 are filled and 06 is taken by file 2 |
| Mapped to F-BA-1A..4B but refused on content | 8 | the four before/after pairs, see section 5 |
| Refused on provenance | 2 | roof files 1 and 7, watermarked |

**The 63-slot manifest moves by one.** That is not a processing limit: the batch is
larger than the site's empty, hosted slots. Twelve of the held files are held because
**nothing on the site renders them yet**, which is a decision for the owner, not a
defect: `docs/assets/PENDING-PHOTOS.md` records those slots as having no host, and the
readiness audit put 49 of 58 unfilled slots in that state.

## 4. The privacy review, file by file

Every one of the 22 frames was opened and looked at. Reported as the card asks:

| Looking for | Found |
|---|---|
| A house number | **none legible in any frame.** The drone frames (files 2, 4, 5) show neighbouring houses at a distance; no number can be read |
| A licence plate | **none legible.** File 19 shows a parked car far behind a gate, the plate is not readable at the file's own resolution |
| A face other than in `echipa.jpeg` | **none.** No person appears in any other frame |
| Faces in `echipa.jpeg` | two workers: one in profile wearing sunglasses and a hard hat, one with the face obscured by a cap and collar. **Not published**, and not because of the faces: the slot it would fill has no host |

**Nothing was published that carries a face, a plate or a number.**

## 5. Two findings that decide other cards

### 5.1 All four "after" images are 3D visualisations, not photographs

Files 8 to 11. Each shows the CGI signature plainly: rendered planting and paving,
dusk lighting with no shadow noise, furniture and cars that are catalogue models,
no construction debris anywhere near a site that is mid-build in its "before". Three
of them also carry `Software: Picasa`.

A before/after slot is a **proof** slot: master plan section 7 as amended by W14-18
admits real Rapid Construct work only, never stock or a visualisation. A render
published as the "after" of a real house claims a finished job that these files do not
evidence. **No pair can publish**, which is W23-02's result and its reason.

### 5.2 Two roof frames carry a third-party watermark

Files 1 and 7. A translucent wordmark sits in the sky, upper right in file 1 and at the
right edge in file 7; both were cropped and enlarged to confirm it. A watermark is
somebody else's claim on the frame, so the licence line "owned by Rapid Construct"
cannot be true of it, and the R-W amendment says as much in its own words. **Held, and
the owner is asked in `docs/QUESTIONS.md` Q-W23-01.**

## 6. The stripping, and how it was verified

1. File 2 was copied into `photos-raw/` under its slot id and run through
   `node scripts/process-photos.js`, the site's own pipeline: a centre crop to 4:3, a
   1x at 400x300 and a 2x at 800x600, quality walked down until each file is under
   400KB. R-B applies, so nothing is upscaled.
2. `exiftool -all= -overwrite_original` on both outputs.
3. Verified: `exiftool -s -G` on both files returns only exiftool's own derived File
   and Composite values. No Exif, no IPTC, no XMP, no ICC, no GPS.
4. Verified across the whole tree: `exiftool -r -if '$gps:all' public/img` reads 152
   image files and matches **none**.

**The corpus finding:** about 128 images already on `main` carry an Exif block and 3
carry IPTC, from before this ruling existed. **None carries GPS.** They are not
stripped here: their bytes are what `docs/assets/LEGACY-IMAGES.txt` matches, and that
match is what their legacy licence status rests on (R-W). The new gate holds the whole
tree to "no GPS" and the client-supplied origin to "no metadata at all", and prints the
Exif count every run so the gap stays visible.
