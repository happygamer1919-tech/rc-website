# W26-12 · Galleries from your folders

Card W26-12. Branch `w26/w26-12-galleries`, based on `main` with #132 merged. PR only.

## Per folder: found, installed, page

| Folder | Found | Installed | Page |
|---|---|---|---|
| ACOPERIȘURI | 15 | 15 | `/servicii/acoperisuri/` |
| CONSTRUCȚIE CASE LA CHEIE | 2 | 2 | `/servicii/case-la-cheie/` |
| Construcții industriale | 0 | 0 | **empty folder, no gallery** |
| Copertine | 2 | 2 | `/servicii/copertine/` |
| Fațade | 4 | 4 | `/servicii/fatade/` |
| Finisaje | 5 | 5 | `/servicii/finisaje/` |
| Garduri | 19 | **13** | `/servicii/galerie-garduri/`, **a new page** |
| Instalații | 5 | 5 | `/servicii/instalatii/` |
| Lucrări de terasament și excavare | 16 | 16 | `/servicii/terasamente/` |
| Proiectare și vizualizare 3D | 0 | 0 | **empty folder, no gallery** |
| Renovări la cheie | 27 | 27 | `/servicii/reparatii/` |

**95 found, 89 installed. Unmatched folders: none**: every folder's name is a page's title.
Garduri's six missing files are **exact duplicates** of six others, so the gallery shows each
photograph once.

## What a visitor sees

- On each service page, **one more card after the project cards: "Deschide galeria"** (RU
  "Открыть галерею"), with one of the folder's photographs on it.
- **Copertine** has no project section, so its card sits in a small section of its own.
- **"Garduri tip jaluzele"** on the fence page now opens `/servicii/galerie-garduri/`, a page
  showing all thirteen fence photographs.
- Clicking opens **a full-screen gallery**: swipe on a phone, arrow keys on a keyboard, a close
  button, Escape, a counter like "5 / 15", no captions. With reduced motion turned on it jumps
  instead of sliding.

**Your photographs cost the pages nothing until opened**: they load only when the gallery opens.

## How the photographs were prepared

As JPEG, **at most 1600 pixels wide, never enlarged**, with **all EXIF and GPS removed** and
checked by reading the files back. The site's image gate now reads 201 of your photographs, all
clean.

## Two faults I found by using it, both fixed

1. **The counter read the wrong photo while sliding.** Pressing End showed "10 / 15" mid-slide,
   and the next key would have started from there. It now reads the position once the slide
   stops: End shows "15 / 15".
2. **Closing it sent keyboard focus to the top of the page** instead of back to the card. It now
   returns to whatever opened it.

## The gate you asked for, and more

**Gate 29 checks that every gallery shows exactly the photographs in the list, in order, on both
languages' pages**, that something opens it, and that no page shows a gallery the list does not
have. It watched itself fail when I removed one photo from the roofing page: "14 against 15".

## Please look at these (Q-W26-06)

Every gallery photo is recorded as **your own**. Seven earthworks photos (02, 04, 05, 10, 13, 14,
16) **look like stock photography**: one black-and-white, one black-and-white with only the yellow
formwork in colour, the rest catalogue-style. And one Finisaje photo (04) has a small "15" counter
from a messaging app in its corner. **If any are not your work, tell me which and they come out.**

## Heights

Service pages **identical to the pixel**. Copertine **+629** (its new section). The fence gallery
page **3,967**. All budgets in R-Y.

## Gates

**28 of 28 gate commands exit 0.** 29 numbered gates.
