# RAPID CONSTRUCT — SHOOT SHEET

**15 photos. That is the whole list.** Everything else on the site can wait.

Print this page and tick the box as you go.

---

## Before you start

- **Landscape only.** Turn the phone sideways. A vertical photo cannot be used.
- **Long edge at least 1600 pixels.** Any modern phone on default settings is fine.
- **Daylight, dry weather.** Try to shoot the whole list in similar light.
- **Nothing in shot that belongs to another company.** No signage, no branded vans.
- **Save each photo with the exact filename in the last column.** Lowercase, with
  the `.jpg` on the end. The filename is how the website knows where it goes.
  A photo named anything else will be rejected.

Put all 15 files in one folder. Nothing else in that folder.

---

## GROUP 1 — On a finished house

Best done at one completed project. Four photos.

| ✔ | Subject | Orientation | Shape | Save as |
|---|---|---|---|---|
| ☐ | The finished house, whole front, straight on | Landscape | Wide (3:2) | `proj-case-la-cheie-01-cover.jpg` |
| ☐ | A second finished house, different one, whole front | Landscape | Wide (3:2) | `proj-case-la-cheie-02-cover.jpg` |
| ☐ | The finished house with the yard cleared, nothing left on site | Landscape | Slightly less wide (4:3) | `step-05-predare.jpg` |
| ☐ | A finished façade: render or stone, whole wall, even light | Landscape | Wide (3:2) | `proj-fatade-01-cover.jpg` |

## GROUP 2 — On a roof job

Two photos. Get high if you safely can, even a first-floor window helps.

| ✔ | Subject | Orientation | Shape | Save as |
|---|---|---|---|---|
| ☐ | A finished roof, seen from above or from higher ground | Landscape | Wide (3:2) | `proj-acoperisuri-01-cover.jpg` |
| ☐ | A roof being fitted, or just finished, seen from the ground | Landscape | Slightly less wide (4:3) | `step-03-acoperis.jpg` |

## GROUP 3 — On an active building site

Three photos. One site with work at different stages is ideal.

| ✔ | Subject | Orientation | Shape | Save as |
|---|---|---|---|---|
| ☐ | Foundation poured, or the formwork still in place | Landscape | Slightly less wide (4:3) | `step-01-fundatie.jpg` |
| ☐ | Walls up, you can see the shape of the building | Landscape | Slightly less wide (4:3) | `step-02-structura.jpg` |
| ☐ | Insulation boards or render going on the outside wall | Landscape | Slightly less wide (4:3) | `step-04-fatada.jpg` |

## GROUP 4 — On a renovation

Two photos. Inside is fine.

| ✔ | Subject | Orientation | Shape | Save as |
|---|---|---|---|---|
| ☐ | A finished renovated room, stand in the doorway, take the whole room | Landscape | Wide (3:2) | `proj-reparatii-01-cover.jpg` |
| ☐ | Finished interior work: smooth walls, paint, floor laid | Landscape | Wide (3:2) | `proj-finisaje-01-cover.jpg` |

## GROUP 5 — On an industrial or commercial job

One photo.

| ✔ | Subject | Orientation | Shape | Save as |
|---|---|---|---|---|
| ☐ | A hall, warehouse or shop unit, whole building from outside | Landscape | Wide (3:2) | `proj-industrial-01-cover.jpg` |

## GROUP 6 — On a groundworks job

One photo.

| ✔ | Subject | Orientation | Shape | Save as |
|---|---|---|---|---|
| ☐ | Machinery working the ground, digger in shot | Landscape | Wide (3:2) | `proj-terasamente-01-cover.jpg` |

## GROUP 7 — Installations

One photo. Can be at any site with first-fix work showing.

| ✔ | Subject | Orientation | Shape | Save as |
|---|---|---|---|---|
| ☐ | Pipework or cabling, neatly run, before it is covered up | Landscape | Wide (3:2) | `proj-instalatii-01-cover.jpg` |

## GROUP 8 — At the desk

One photo. No travel needed.

| ✔ | Subject | Orientation | Shape | Save as |
|---|---|---|---|---|
| ☐ | A 3D drawing of a real project, on screen, filling the frame | Landscape | Wide (3:2) | `proj-proiectare-3d-01-cover.jpg` |

---

## When you get back

Put all 15 files in the `photos-raw` folder, then run:

    node scripts/process-photos.js && node build.js

It crops, resizes and compresses everything, and tells you what is still
missing. If it complains about a filename, the name is wrong: fix the spelling
and run it again.

**Count check: 4 + 2 + 3 + 2 + 1 + 1 + 1 + 1 = 15.**
