# RC WEBSITE — PHOTO MANIFEST V2

> Companion to `RC-WEBSITE-MASTER-PLAN.md`. Applies only to the Rapid Construct
> MD website (repo `rc-website`).
>
> **V2 supersedes V1 entirely.** V1 listed 21 flat slots. V2 is built around a
> project content model, so portfolio covers are no longer separate slots: the
> portfolio reuses project covers. Fill the **File / notes** column during the
> selection session with Mihai. Leave it blank if no real photo exists.

**Total: 51 photo slots.** 45 project slots (10 covers + 35 gallery)
+ 5 process stages + 1 social share. Full arithmetic in *Slot count* below.

Every file: minimum 1600px long edge, landscape, JPG, under 400KB after
processing, no watermark, real Rapid Construct work only.
Naming: the Slot ID exactly, lowercase, `.jpg`.

---

## Part A — Content model

Photos are no longer a flat list. They hang off projects, defined in
`content/projects.json` (to be created when the portfolio is rebuilt):

```json
{
  "id": "acoperis-durlesti",
  "title": "Acoperiș din șindrilă bituminoasă",
  "service": "acoperisuri",
  "location": "Durlești",
  "year": 2025,
  "cover": "proj-acoperis-durlesti-cover",
  "gallery": [
    "proj-acoperis-durlesti-01",
    "proj-acoperis-durlesti-02",
    "proj-acoperis-durlesti-03"
  ]
}
```

| Field | Type | Notes |
|---|---|---|
| `id` | slug | Unique, lowercase, hyphenated. Drives the slot IDs. |
| `title` | string | Per locale. Real project name. |
| `service` | slug | One of the nine service slugs below. |
| `location` | string | Locality. **Leave the field out if unknown. Never invent one.** |
| `year` | number | **Leave out if unknown.** |
| `cover` | slot ID | `proj-<id>-cover`. |
| `gallery` | slot ID[] | `proj-<id>-01` … `-04`. Three minimum, four maximum. |

Service slugs: `case-la-cheie`, `acoperisuri`, `fatade`, `reparatii`,
`finisaje`, `proiectare-3d`, `instalatii`, `industrial`, `terasamente`.

**The portfolio grid reads project covers directly.** There are no `port-01`…
`port-06` slots any more. A project appears in the portfolio because it exists,
not because a separate cover was shot for it.

---

## Part B — Project slots

Nine projects, one per service, so every service has real work behind it.

**Per project: 1 cover + 3 to 4 gallery.** Cover is 3:2 landscape 1400x933.
Gallery is 3:2 landscape 1400x933. Gallery slot 04 is optional.

| Project ID | Service | Cover slot | Gallery slots | File / notes |
|---|---|---|---|---|
| `case-la-cheie-01` | case-la-cheie | `proj-case-la-cheie-01-cover` | `-01` `-02` `-03` `-04` | |
| `acoperisuri-01` | acoperisuri | `proj-acoperisuri-01-cover` | `-01` `-02` `-03` `-04` | |
| `fatade-01` | fatade | `proj-fatade-01-cover` | `-01` `-02` `-03` `-04` | |
| `reparatii-01` | reparatii | `proj-reparatii-01-cover` | `-01` `-02` `-03` `-04` | |
| `finisaje-01` | finisaje | `proj-finisaje-01-cover` | `-01` `-02` `-03` `-04` | |
| `proiectare-3d-01` | proiectare-3d | `proj-proiectare-3d-01-cover` | `-01` `-02` `-03` | |
| `instalatii-01` | instalatii | `proj-instalatii-01-cover` | `-01` `-02` `-03` | |
| `industrial-01` | industrial | `proj-industrial-01-cover` | `-01` `-02` `-03` | |
| `terasamente-01` | terasamente | `proj-terasamente-01-cover` | `-01` `-02` `-03` | |
| `case-la-cheie-02` | case-la-cheie | `proj-case-la-cheie-02-cover` | `-01` `-02` `-03` | Added W2-01: carries the sixth real live-site entry, which a strict one-per-service seed would have orphaned |

### Shooting notes, one line per slot

| Slot ID | Ratio | Dimensions | Shooting note |
|---|---|---|---|
| `proj-case-la-cheie-01-cover` | 3:2 | 1400x933 | Finished house, full exterior, daylight, straight on |
| `proj-case-la-cheie-01-01` | 3:2 | 1400x933 | Same house, three-quarter angle showing depth |
| `proj-case-la-cheie-01-02` | 3:2 | 1400x933 | Entrance and door detail |
| `proj-case-la-cheie-01-03` | 3:2 | 1400x933 | Interior, main living space, finished |
| `proj-case-la-cheie-01-04` | 3:2 | 1400x933 | Optional: the same house earlier in the build |
| `proj-acoperisuri-01-cover` | 3:2 | 1400x933 | Completed roof from an elevated angle |
| `proj-acoperisuri-01-01` | 3:2 | 1400x933 | Ridge and valley detail, clean lines |
| `proj-acoperisuri-01-02` | 3:2 | 1400x933 | Guttering and downpipe run |
| `proj-acoperisuri-01-03` | 3:2 | 1400x933 | Roof in progress, battens or membrane visible |
| `proj-acoperisuri-01-04` | 3:2 | 1400x933 | Optional: chimney or skylight flashing |
| `proj-fatade-01-cover` | 3:2 | 1400x933 | Finished façade, full elevation, even light |
| `proj-fatade-01-01` | 3:2 | 1400x933 | Render or cladding texture, close |
| `proj-fatade-01-02` | 3:2 | 1400x933 | Insulation boards going on, mid-job |
| `proj-fatade-01-03` | 3:2 | 1400x933 | Corner or reveal detail |
| `proj-fatade-01-04` | 3:2 | 1400x933 | Optional: before and after from one position |
| `proj-reparatii-01-cover` | 3:2 | 1400x933 | Finished renovated room, wide |
| `proj-reparatii-01-01` | 3:2 | 1400x933 | Same room before, from the same position |
| `proj-reparatii-01-02` | 3:2 | 1400x933 | Demolition or strip-out in progress |
| `proj-reparatii-01-03` | 3:2 | 1400x933 | Second finished room |
| `proj-reparatii-01-04` | 3:2 | 1400x933 | Optional: kitchen or bathroom finished |
| `proj-finisaje-01-cover` | 3:2 | 1400x933 | Finished interior, plaster and paint clean |
| `proj-finisaje-01-01` | 3:2 | 1400x933 | Flooring laid, edges and thresholds neat |
| `proj-finisaje-01-02` | 3:2 | 1400x933 | Tiling, grout lines square |
| `proj-finisaje-01-03` | 3:2 | 1400x933 | Plasterboard and skim mid-job |
| `proj-finisaje-01-04` | 3:2 | 1400x933 | Optional: door or trim detail |
| `proj-proiectare-3d-01-cover` | 3:2 | 1400x933 | 3D render of a real project, full exterior |
| `proj-proiectare-3d-01-01` | 3:2 | 1400x933 | Render next to the built result, same angle |
| `proj-proiectare-3d-01-02` | 3:2 | 1400x933 | Floor plan or elevation on screen |
| `proj-proiectare-3d-01-03` | 3:2 | 1400x933 | Interior render |
| `proj-instalatii-01-cover` | 3:2 | 1400x933 | Tidy pipe or cable run, first fix |
| `proj-instalatii-01-01` | 3:2 | 1400x933 | Manifold or distribution board, labelled |
| `proj-instalatii-01-02` | 3:2 | 1400x933 | Underfloor heating loops laid out |
| `proj-instalatii-01-03` | 3:2 | 1400x933 | Finished fixtures, second fix |
| `proj-industrial-01-cover` | 3:2 | 1400x933 | Hall or warehouse exterior, full width |
| `proj-industrial-01-01` | 3:2 | 1400x933 | Interior span, structure visible |
| `proj-industrial-01-02` | 3:2 | 1400x933 | Steel frame going up |
| `proj-industrial-01-03` | 3:2 | 1400x933 | Loading bay or main door detail |
| `proj-terasamente-01-cover` | 3:2 | 1400x933 | Machinery working the plot, wide |
| `proj-terasamente-01-01` | 3:2 | 1400x933 | Excavation face, depth readable |
| `proj-terasamente-01-02` | 3:2 | 1400x933 | Levelled and compacted ground |
| `proj-terasamente-01-03` | 3:2 | 1400x933 | Foundation trench set out |

---

## Part C — Retained non-project slots

### Process stages — 5 mandatory, 4:3 landscape, 900x675

Strongest version is one house at five moments.

| Slot ID | Ratio | Dimensions | Shooting note |
|---|---|---|---|
| `step-01-fundatie` | 4:3 | 900x675 | Foundation poured or formwork in place |
| `step-02-structura` | 4:3 | 900x675 | Walls up, structure visible |
| `step-03-acoperis` | 4:3 | 900x675 | Roof being installed or freshly finished |
| `step-04-fatada` | 4:3 | 900x675 | Insulation boards or render being applied |
| `step-05-predare` | 4:3 | 900x675 | Finished house, yard cleared |

### Social share — 1 mandatory, 1200x630

| Slot ID | Ratio | Dimensions | Shooting note |
|---|---|---|---|
| `og-image` | 1200x630 | 1200x630 | Best single finished-house shot. Currently a branded logo card on #141414; a real photo overwrites it |

### Supplier logos — 12, not photographs

One full-colour file per brand at `public/img/suppliers/<slug>.svg` (preferred)
or `.png`. Transparent background. **There is no second greyscale asset:** the
grey default state in the marquee is a CSS filter on the colour file.

Not photo slots, so they are outside the 51-slot count and the `photos-raw/`
pipeline: they are a direct drop into `public/img/suppliers/`.

| Slug | Brand | File present |
|---|---|---|
| `technonicol` | TechnoNICOL | |
| `bilka` | Bilka | |
| `novatik` | Novatik | |
| `iko` | IKO | |
| `swisspor` | Swisspor | |
| `knauf` | Knauf | |
| `baumit` | Baumit | |
| `ceresit` | Ceresit | |
| `weber` | Weber | |
| `ytong` | Ytong | |
| `holcim` | Holcim | |
| `bosch` | Bosch | |

The fallback is per brand: a slug with no file renders its brand name as text in
the same white tile, so the first logo to land shows as a logo while the rest
stay text. Nothing in the code changes when a file appears.

### Delivered, no longer photo slots

| Asset | Format | Status |
|---|---|---|
| `hero-panel` | SVG, 800x600 | **Delivered.** Illustration, not a photograph |
| 9 service illustrations | SVG, 400x300 | **Delivered.** `public/img/services/svc-*.svg` |
| Logo full / white, favicon 512 / 180 | PNG | **Delivered** |

> Deviation noted: the card brief said to retain `hero-panel` in the manifest.
> It is listed here for traceability but is **not** a photo slot, because it was
> delivered as an SVG illustration in W1-00.

### Struck from V1

`form-bg` (struck earlier), the nine `svc-*` photo slots (now SVG), and
`port-01`…`port-06` (portfolio now reads project covers).

---

## Slot count

| Group | Slots |
|---|---|
| Project covers, 10 projects x 1 | 10 |
| Project gallery, 5 projects x 4 + 5 projects x 3 | 35 |
| Process stages | 5 |
| Social share | 1 |
| **Total photo slots** | **51** |
| Delivered illustrations (`hero-panel` + 9 service SVGs) | 10 |
| Logo and favicon assets | 4 |
| **Total assets tracked** | **65** |

**51 photographs to collect**, up from V1's 12 remaining photo slots, because
the portfolio moved from six one-off covers to nine documented projects with
galleries. That is the cost of the project model, and it is the number to plan
the shooting days around.

Minimum viable set: the 10 covers plus 5 process stages = **15 photographs**.
Galleries can land per project afterwards without blocking launch.

---

## Part D — Rules for the selection session

1. Judge every photo at full width on a laptop, not on a phone.
2. Reject anything blurred, backlit into a white sky, shot in rain, or carrying
   another company's branding.
3. Prefer daylight and clear weather across the whole set.
4. If a slot has no good real photo, delete the slot. Never fill it with stock.
5. Decide roof and façade first. Those two carry the business.
6. A project with fewer than three usable gallery photos ships as cover only.
   Do not pad a gallery with weak frames.
