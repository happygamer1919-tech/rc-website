# RC WEBSITE — PHOTO MANIFEST

> Companion to `RC-WEBSITE-MASTER-PLAN.md`. Applies only to the Rapid Construct MD website (repo `rc-website`).
> Fill the **File / notes** column during the photo selection session with Mihai. Leave it blank if no real photo exists for that slot.

**Total needed: 17 mandatory, up to 18 optional.**

Revised for phase 2. The count went 26 -> 25 when `form-bg` was struck, then
25 -> 17 when the nine `svc-*` photo slots were replaced by SVG illustrations
and `hero-panel` was added.

**13 image slots** + 4 logo assets = 17:
one `hero-panel`, five process stages, six portfolio covers, one `og-image`.

Every file: minimum 1600px long edge, landscape, JPG, under 400KB after compression, no watermark, real Rapid Construct work only.
Naming: use the Slot ID exactly, lowercase, `.jpg`. Example: `svc-acoperisuri.jpg`. Drop everything into one folder, no subfolders.

---

## Part A — Slots in the build

### Hero
No photo. Decision locked: plain background.

### Services grid — STRUCK, no longer photographs

~~Nine `svc-*` photo slots, 4:3, 1200x900.~~ Removed in phase 2. The nine
service cards now hold **SVG illustrations**, produced in Claude Design, not
photographs. They are therefore outside this manifest.

Drop each finished illustration at `public/img/services/<id>.svg`, overwriting
the placeholder. IDs: `svc-case-la-cheie`, `svc-acoperisuri`, `svc-fatade`,
`svc-reparatii`, `svc-finisaje`, `svc-proiectare-3d`, `svc-retele`,
`svc-industrial`, `svc-terasamente`. Regenerate placeholders with
`node scripts/gen-service-svgs.js`; it will not overwrite a real file.

### Hero panel — 1 mandatory, 4:3 landscape, 1200x900

| Slot ID | What it must show | File / notes |
|---|---|---|
| `hero-panel` | Right-hand panel of the hero. Ivan is producing an illustration for this slot | |

### Process block — 5 mandatory, 4:3 landscape, 900x675

These can come from a single project shot at five stages. That is the strongest version of this section: same house, five moments.

| Slot ID | Stage | File / notes |
|---|---|---|
| `step-01-fundatie` | Foundation poured or formwork in place | |
| `step-02-structura` | Walls up, structure visible | |
| `step-03-acoperis` | Roof being installed or freshly finished | |
| `step-04-fatada` | Insulation boards or render being applied | |
| `step-05-predare` | Finished house, yard cleared | |

### Portfolio covers — 6 mandatory, 3:2 landscape, 1400x933

One cover per project. Each project also gets a category so the filter tabs work.

| Slot ID | Category | Project | File / notes |
|---|---|---|---|
| `port-01` | Acoperișuri | | |
| `port-02` | Finisaje | | |
| `port-03` | Reparații | | |
| `port-04` | Case la cheie | | |
| `port-05` | Fațade | | |
| `port-06` | Case la cheie | | |

### Portfolio extras — up to 18 optional, 3 per project, same 3:2 spec

Only if we enable the lightbox. Name them `port-01-a`, `port-01-b`, `port-01-c` and so on.

| Project | Extra 1 | Extra 2 | Extra 3 |
|---|---|---|---|
| `port-01` | | | |
| `port-02` | | | |
| `port-03` | | | |
| `port-04` | | | |
| `port-05` | | | |
| `port-06` | | | |

### Form section background — STRUCK

~~`form-bg`, 16:9, 1920x1080.~~ Removed by Ivan, 2026-08-27. A darkened photo
behind the form would add a fourth background value and a translucent overlay,
both forbidden by the master plan's background rule, which is the one thing the
client stated clearly. The form section stays flat `#F2F2F2`.

### Social share image — 1 mandatory, 1200x630

| Slot ID | What it must show | File / notes |
|---|---|---|
| `og-image` | Best single finished-house photo. This is what appears when the link is shared on WhatsApp, Facebook or Viber | |

### Logo

| Asset | Format | Status |
|---|---|---|
| Logo, full colour | SVG preferred, PNG with transparency acceptable | Pending from Ivan |
| Logo, white version for the dark footer | SVG or PNG | Pending |
| Favicon | 512x512 PNG, square mark only | Pending |

A JPG will need its background removed before it can sit on the white header bar. Vector avoids that step entirely.

---

## Part B — Shooting and collection batches

If you are going out to collect or shoot rather than picking from an archive, gather by batch. Slots draw from these.

| Batch | Count | Covers slots |
|---|---|---|
| Acoperișuri: metal tile and bituminous, at least one elevated angle | 5 | `svc-acoperisuri`, `step-03`, `port-01` and its extras |
| Fațade: insulation boards, decorative render, stone cladding | 5 | `svc-fatade`, `step-04`, `port-05` and extras |
| Case la cheie: finished exteriors, different houses, daylight | 6 | `svc-case-la-cheie`, `step-05`, `port-04`, `port-06`, `og-image` |
| Șantier în lucru: excavation, foundation, walls, structure | 5 | `svc-terasamente`, `step-01`, `step-02`, `form-bg` |
| Interioare și finisaje | 4 | `svc-finisaje`, `svc-reparatii`, `port-02`, `port-03` |
| Proiectare 3D: renders or plans | 2 | `svc-proiectare-3d` |
| Industrial: hall, warehouse, commercial | 2 | `svc-industrial` |
| Rețele inginerești: piping, wiring, heating | 2 | `svc-retele` |
| Reserve: anything strong that does not fit above | 2 | swap-ins |

**Total to collect: 33.** That gives 26 slots filled with 7 in reserve for the ones that turn out unusable at full size.

---

## Part C — Rules for the selection session

1. Judge every photo at full width on a laptop, not on a phone. Photos that look fine on a phone fall apart at 1400px.
2. Reject anything blurred, backlit into a white sky, shot in rain, or containing another company's branding.
3. Prefer daylight and clear weather across the whole set. Mixed lighting across a grid looks like a mistake even when each photo is fine on its own.
4. If a slot has no good real photo, delete the slot. Never fill it with stock. A grid of eight real services beats nine with one fake.
5. Decide the roof and façade batches first. Those two carry the business and they are the shots Mihai will judge the site by.
