# RC WEBSITE — PHOTO MANIFEST V2

> Companion to `RC-WEBSITE-MASTER-PLAN.md`. Applies only to the Rapid Construct
> MD website (repo `rc-website`).
>
> **V2 supersedes V1 entirely.** V1 listed 21 flat slots. V2 is built around a
> project content model, so portfolio covers are no longer separate slots: the
> portfolio reuses project covers. Fill the **File / notes** column during the
> selection session with Mihai. Leave it blank if no real photo exists.

**Total: 105 photo slots.** 89 project slots (54 covers + 35 gallery)
+ 5 process stages + 1 social share + 1 hero panel + 9 service cards.
Full arithmetic in *Slot count* below.

**105 is the slot inventory, not the shooting plan.** Only **11** photographs are
on the critical path: the 6 covers of the projects that carry real content, plus
the 5 process stages. Everything else is a reserved slot on a project with no
content, and a slot with no content behind it renders nowhere.

Every file: minimum 1600px long edge, landscape, JPG, under 400KB after
processing, no watermark, real Rapid Construct work only.
Naming: the Slot ID exactly, lowercase, `.jpg`.

**One slot group has a lower floor.** The nine service card slots take a
minimum of **1200px** on the long edge, not 1600. Owner ruling, W7-02; see
DECISIONS.md. A slot's own floor lives in `scripts/slots.js` as `minLongEdge`
and `process-photos.js` warns against that value rather than the default.

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
| `location` | per locale | Locality. **Never invent one.** |
| `year` | string | Four digits. |
| `work_type` | per locale | What kind of work it was, in the client's words. |
| `area_sqm` | string | Bare number. The `m²` is added on render. |
| `duration` | per locale | How long it ran. |
| `main_materials` | per locale | The materials that define the job. |
| `challenge` | per locale | The hard part, and what was done about it. |
| `cover` | slot ID | `proj-<id>-cover`. |
| `gallery` | slot ID[] | `proj-<id>-01` … `-04`. Three minimum, four maximum, or empty. |

**Every field except `id`, `service` and `cover` is optional and drops out of the
render on its own.** An empty string `""` and a `TODO:` marker mean the same
thing: no source for this yet. Neither is ever printed. A project with a real
location and no year prints the location alone.

**`title` and `summary` are the two that gate the project.** Without both, the
project does not render anywhere: not on its service page, not in the homepage
portfolio, not in the sitemap. That is what makes a stub safe to commit.

Service slugs: `case-la-cheie`, `acoperisuri`, `fatade`, `reparatii`,
`finisaje`, `proiectare-3d`, `instalatii`, `industrial`, `terasamente`.

**The portfolio grid reads project covers directly.** There are no `port-01`…
`port-06` slots any more. A project appears in the portfolio because it exists,
not because a separate cover was shot for it.

---

## Part B — Project slots

**Six projects per service, nine services, 54 in all.** The card asked for 5 to
7; six is the midpoint and divides evenly. Ten of the 54 carry real content
inherited from the live site; the other 44 are stubs.

**Per project: 1 cover + 3 to 4 gallery.** Cover is 3:2 landscape 1400x933.
Gallery is 3:2 landscape 1400x933. Gallery slot 04 is optional.

**A stub reserves its cover slot and no gallery slots.** Manifest rule D-6
already says a project with fewer than three usable gallery photos ships as
cover only, and a project with no content has no photos at all. Reserving three
gallery slots per stub would have put 132 unshootable slots into the plan and
taken the total from 95 to 216. Gallery slots are added to a project when it has
content and photographs. See `docs/QUESTIONS.md` Q-03.

| Project ID | Service | Cover slot | Gallery slots | File / notes |
|---|---|---|---|---|
| `case-la-cheie-01` | case-la-cheie | `proj-case-la-cheie-01-cover` | `-01` `-02` `-03` `-04` |  |
| `case-la-cheie-02` | case-la-cheie | `proj-case-la-cheie-02-cover` | `-01` `-02` `-03` |  |
| `case-la-cheie-03` | case-la-cheie | `proj-case-la-cheie-03-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `case-la-cheie-04` | case-la-cheie | `proj-case-la-cheie-04-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `case-la-cheie-05` | case-la-cheie | `proj-case-la-cheie-05-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `case-la-cheie-06` | case-la-cheie | `proj-case-la-cheie-06-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `acoperisuri-01` | acoperisuri | `proj-acoperisuri-01-cover` | `-01` `-02` `-03` `-04` |  |
| `acoperisuri-02` | acoperisuri | `proj-acoperisuri-02-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `acoperisuri-03` | acoperisuri | `proj-acoperisuri-03-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `acoperisuri-04` | acoperisuri | `proj-acoperisuri-04-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `acoperisuri-05` | acoperisuri | `proj-acoperisuri-05-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `acoperisuri-06` | acoperisuri | `proj-acoperisuri-06-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `fatade-01` | fatade | `proj-fatade-01-cover` | `-01` `-02` `-03` `-04` |  |
| `fatade-02` | fatade | `proj-fatade-02-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `fatade-03` | fatade | `proj-fatade-03-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `fatade-04` | fatade | `proj-fatade-04-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `fatade-05` | fatade | `proj-fatade-05-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `fatade-06` | fatade | `proj-fatade-06-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `reparatii-01` | reparatii | `proj-reparatii-01-cover` | `-01` `-02` `-03` `-04` |  |
| `reparatii-02` | reparatii | `proj-reparatii-02-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `reparatii-03` | reparatii | `proj-reparatii-03-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `reparatii-04` | reparatii | `proj-reparatii-04-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `reparatii-05` | reparatii | `proj-reparatii-05-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `reparatii-06` | reparatii | `proj-reparatii-06-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `finisaje-01` | finisaje | `proj-finisaje-01-cover` | `-01` `-02` `-03` `-04` |  |
| `finisaje-02` | finisaje | `proj-finisaje-02-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `finisaje-03` | finisaje | `proj-finisaje-03-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `finisaje-04` | finisaje | `proj-finisaje-04-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `finisaje-05` | finisaje | `proj-finisaje-05-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `finisaje-06` | finisaje | `proj-finisaje-06-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `proiectare-3d-01` | proiectare-3d | `proj-proiectare-3d-01-cover` | `-01` `-02` `-03` | Stub. Cover slot reserved, no content and no gallery yet. |
| `proiectare-3d-02` | proiectare-3d | `proj-proiectare-3d-02-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `proiectare-3d-03` | proiectare-3d | `proj-proiectare-3d-03-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `proiectare-3d-04` | proiectare-3d | `proj-proiectare-3d-04-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `proiectare-3d-05` | proiectare-3d | `proj-proiectare-3d-05-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `proiectare-3d-06` | proiectare-3d | `proj-proiectare-3d-06-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `instalatii-01` | instalatii | `proj-instalatii-01-cover` | `-01` `-02` `-03` | Stub. Cover slot reserved, no content and no gallery yet. |
| `instalatii-02` | instalatii | `proj-instalatii-02-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `instalatii-03` | instalatii | `proj-instalatii-03-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `instalatii-04` | instalatii | `proj-instalatii-04-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `instalatii-05` | instalatii | `proj-instalatii-05-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `instalatii-06` | instalatii | `proj-instalatii-06-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `industrial-01` | industrial | `proj-industrial-01-cover` | `-01` `-02` `-03` | Stub. Cover slot reserved, no content and no gallery yet. |
| `industrial-02` | industrial | `proj-industrial-02-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `industrial-03` | industrial | `proj-industrial-03-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `industrial-04` | industrial | `proj-industrial-04-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `industrial-05` | industrial | `proj-industrial-05-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `industrial-06` | industrial | `proj-industrial-06-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `terasamente-01` | terasamente | `proj-terasamente-01-cover` | `-01` `-02` `-03` | Stub. Cover slot reserved, no content and no gallery yet. |
| `terasamente-02` | terasamente | `proj-terasamente-02-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `terasamente-03` | terasamente | `proj-terasamente-03-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `terasamente-04` | terasamente | `proj-terasamente-04-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `terasamente-05` | terasamente | `proj-terasamente-05-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |
| `terasamente-06` | terasamente | `proj-terasamente-06-cover` | — | Stub. Cover slot reserved, no content and no gallery yet. |

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

### Supplier logos — 11, not photographs

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
| `cat` | CAT | Text fallback. Caterpillar's terms forbid third-party logo use |
| `heidelberg-materials` | Heidelberg Materials | `heidelberg-materials.svg`, from the brand's own site |
| `ytong` | Ytong | |
| `holcim` | Holcim | |

The fallback is per brand: a slug with no file renders its brand name as text in
the same white tile, so the first logo to land shows as a logo while the rest
stay text. Nothing in the code changes when a file appears.

**Bosch was dropped entirely in W8-04**, taking the list from twelve to eleven.
Its own legal notice forbids third-party use of its marks, so no logo could ever
land in that slot. Owner ruling; see DECISIONS.md.

**W9-01 replaced two brands**, keeping the count at eleven: `ceresit` -> `cat`
and `weber` -> `heidelberg-materials`. Heidelberg Materials landed a logo from
its own site. CAT could not: Caterpillar's terms forbid it, the same blocker
that removed Bosch. `cat` is the only text fallback left; see `docs/QUESTIONS.md` Q-10.

### Hero panel — 1, 4:3 landscape, 1400x1050 (2x is the 2800px source)

W6-03 turned this back into a photo slot. `public/img/hero-panel.svg` stays in
the repo and is what renders until `public/img/hero-panel.jpg` exists.

| Slot ID | Ratio | Dimensions | Shooting note |
|---|---|---|---|
| `hero-panel` | 4:3 | 1400x1050 | The single best finished-house shot the company owns. It sits beside the hero claim, so it carries the first impression |

Supply at **2800px on the long edge**: that is the 2x the pipeline writes.
A real photo here is the likely LCP element, so the build drops `loading="lazy"`
and sets `fetchpriority="high"` the moment the jpg exists.

### Service cards — 9, 4:3 landscape, 800x600 — FILLED 2026-08-31

**All nine are filled.** W7-02 processed the approved artwork through the
pipeline. Every card renders a photograph; the nine SVGs at
`public/img/services/svc-*.svg` are **retained but unused** — referenced zero
times in `dist/` — and remain the fallback if a jpg is ever removed.

Minimum long edge for this group is **1200px**, not the manifest default of
1600. The supplied artwork is 1448x1086, which is exactly 4:3 and crops without
losing a pixel. The 1x is 800x600, so 1448 covers it comfortably; the 2x is
interpolated up from 1448 to 1600, a 10% upscale.

Photos live at `public/img/<slot-id>.jpg`, which is where the pipeline writes.
The SVG fallbacks stay at `public/img/services/<slot-id>.svg`.

| Slot ID | Ratio | Dimensions | Shooting note |
|---|---|---|---|
| `svc-case-la-cheie` | 4:3 | 800x600 | **Filled** 2026-08-31, 82 KB / 266 KB |
| `svc-acoperisuri` | 4:3 | 800x600 | **Filled** 2026-08-31, 101 KB / 384 KB |
| `svc-fatade` | 4:3 | 800x600 | **Filled** 2026-08-31, 100 KB / 382 KB |
| `svc-reparatii` | 4:3 | 800x600 | **Filled** 2026-08-31, 131 KB / 368 KB (2x at q64 to fit the budget) |
| `svc-finisaje` | 4:3 | 800x600 | **Filled** 2026-08-31, 75 KB / 274 KB |
| `svc-proiectare-3d` | 4:3 | 800x600 | **Filled** 2026-08-31, 67 KB / 208 KB |
| `svc-instalatii` | 4:3 | 800x600 | **Filled** 2026-08-31, 125 KB / 387 KB |
| `svc-industrial` | 4:3 | 800x600 | **Filled** 2026-08-31, 77 KB / 292 KB |
| `svc-terasamente` | 4:3 | 800x600 | **Filled** 2026-08-31, 120 KB / 377 KB |

Sizes are 1x / 2x. Every file is under the 400KB budget.

Each also appears at the top of its own service page, on the dark field.

### Delivered, not photo slots

| Asset | Format | Status |
|---|---|---|
| Logo full / white, favicon 512 / 180 | PNG | **Delivered** |
| 12 supplier logos | SVG or PNG | Awaiting files, see above |

### Struck from V1

`form-bg` (struck earlier) and `port-01`…`port-06` (the portfolio reads project
covers). The nine `svc-*` slots were struck in phase 2 and **reinstated in
W6-03**; `hero-panel` was never a photo slot before W6-03 and is one now. In
both cases the SVG is not deleted, it becomes the fallback.

---

## Slot count

| Group | Slots |
|---|---|
| Project covers, 54 projects x 1 | 54 |
| Project gallery, 5 projects x 4 + 5 projects x 3 | 35 |
| Process stages | 5 |
| Social share | 1 |
| Hero panel | 1 |
| Service cards | 9 |
| **Total photo slots** | **105** |
| SVG fallbacks (`hero-panel` + 9 service SVGs), in the repo | 10 |
| Logo and favicon assets | 4 |
| Supplier logos | 11 |
| **Total assets tracked** | **130** |

**95 photo slots, but 95 is not the shooting plan.** 44 of the covers belong to
stub projects with no content. A stub becomes a real project only when someone
writes its title and summary, and only then does its cover need a photograph.

The number to plan shooting days around is unchanged from V2's first pass:

| | Photographs |
|---|---|
| Minimum viable: 6 covers of projects with real content + 5 process stages | **11** |
| The 10 slots that currently render an SVG fallback (hero panel + 9 cards) | 10 |
| Those 6 projects complete, covers and galleries | 29 |
| The 10 seeded projects complete, if the 4 without content get content | 45 |
| Every slot in the manifest, including 44 stubs | 105 |

Six of the ten seeded projects have real titles and summaries and therefore
render. The other four (`proiectare-3d-01`, `instalatii-01`, `industrial-01`,
`terasamente-01`) keep their reserved gallery slots but carry `TODO:` content,
so they are in the same position as the 44 stubs: invisible until written.

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
