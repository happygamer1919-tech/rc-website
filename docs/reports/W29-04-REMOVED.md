# W29-04 · Stock pictures removed from the service galleries (R-W29-04)

Card W29-04, owner ruling R-W29-04 (`docs/rulings/W29-R.md`). Every stock picture in the eleven
galleries of `content/galleries.json` was looked at at full size against the ruling's seven criteria.
The owner's own photographs (`origin` not `stock`) were not candidates. Nothing replaces a removed
picture: the gaps stay until the owner supplies RC-own photographs.

**This file is the list the named test gallery-removed reads** (`scripts/check-gallery-removed.js`).
Every row below whose first cell is a path is a removed file; the test asserts that none of them, nor
its thumb or JPEG twin, is named by any built page in either locale, any content or locale JSON, the
slot ledger, `docs/images/SOURCES.md` or `docs/assets/PROVENANCE.md`, or is still on disk, and that no
source URL in these rows is back in a ledger or manifest. The source URLs are kept here because the
SOURCES and PROVENANCE rows that carried them are gone.

**Criteria**, quoted from the ruling: "mountains or cliffs in frame", "snow with non-local house
style", "Mediterranean or coastal vegetation", "log cabins or timber houses", "ornate wrought-iron
gates on villas", "visible foreign signage or plates", "greenhouse or industrial campus backdrops".
The Garduri gallery's seven are the owner's own list; two of them (20, 21) meet no criterion and go on
that list alone.

## Removed files

| file | gallery | photo (1-based, before) | kind | source | criterion |
|---|---|---|---|---|---|
| `public/img/galerie/galerie-garduri/16.webp` | galerie-garduri | 16 | full | https://www.pexels.com/photo/5798851/ | Mediterranean or coastal vegetation |
| `public/img/galerie/galerie-garduri/16-t.webp` | galerie-garduri | 16 | thumb | https://www.pexels.com/photo/5798851/ | Mediterranean or coastal vegetation |
| `public/img/galerie/galerie-garduri/17.webp` | galerie-garduri | 17 | full | https://www.pexels.com/photo/35492457/ | snow with non-local house style; ornate wrought-iron gates on villas |
| `public/img/galerie/galerie-garduri/17-t.webp` | galerie-garduri | 17 | thumb | https://www.pexels.com/photo/35492457/ | snow with non-local house style; ornate wrought-iron gates on villas |
| `public/img/galerie/galerie-garduri/18.webp` | galerie-garduri | 18 | full | https://www.pexels.com/photo/7912825/ | greenhouse or industrial campus backdrops |
| `public/img/galerie/galerie-garduri/18-t.webp` | galerie-garduri | 18 | thumb | https://www.pexels.com/photo/7912825/ | greenhouse or industrial campus backdrops |
| `public/img/galerie/galerie-garduri/19.webp` | galerie-garduri | 19 | full | https://www.pexels.com/photo/34272815/ | mountains or cliffs in frame |
| `public/img/galerie/galerie-garduri/19-t.webp` | galerie-garduri | 19 | thumb | https://www.pexels.com/photo/34272815/ | mountains or cliffs in frame |
| `public/img/galerie/galerie-garduri/20.webp` | galerie-garduri | 20 | full | https://www.pexels.com/photo/18436382/ | owner's list only: no criterion hits, a gabion close-up with no scenery, which the ruling allows |
| `public/img/galerie/galerie-garduri/20-t.webp` | galerie-garduri | 20 | thumb | https://www.pexels.com/photo/18436382/ | owner's list only: no criterion hits, a gabion close-up with no scenery, which the ruling allows |
| `public/img/galerie/galerie-garduri/21.webp` | galerie-garduri | 21 | full | https://www.pexels.com/photo/36221294/ | owner's list only: no criterion hits, a mesh close-up with no scenery, which the ruling allows |
| `public/img/galerie/galerie-garduri/21-t.webp` | galerie-garduri | 21 | thumb | https://www.pexels.com/photo/36221294/ | owner's list only: no criterion hits, a mesh close-up with no scenery, which the ruling allows |
| `public/img/galerie/galerie-garduri/22.webp` | galerie-garduri | 22 | full | https://www.pexels.com/photo/18654631/ | log cabins or timber houses |
| `public/img/galerie/galerie-garduri/22-t.webp` | galerie-garduri | 22 | thumb | https://www.pexels.com/photo/18654631/ | log cabins or timber houses |
| `public/img/galerie/acoperisuri/19.webp` | acoperisuri | 19 | full | https://www.pexels.com/photo/5264825/ | Mediterranean or coastal vegetation |
| `public/img/galerie/acoperisuri/19-t.webp` | acoperisuri | 19 | thumb | https://www.pexels.com/photo/5264825/ | Mediterranean or coastal vegetation |
| `public/img/galerie/acoperisuri/20.webp` | acoperisuri | 20 | full | https://www.pexels.com/photo/11767927/ | log cabins or timber houses |
| `public/img/galerie/acoperisuri/20-t.webp` | acoperisuri | 20 | thumb | https://www.pexels.com/photo/11767927/ | log cabins or timber houses |
| `public/img/galerie/acoperisuri/21.webp` | acoperisuri | 21 | full | https://www.pexels.com/photo/26570514/ | log cabins or timber houses |
| `public/img/galerie/acoperisuri/21-t.webp` | acoperisuri | 21 | thumb | https://www.pexels.com/photo/26570514/ | log cabins or timber houses |
| `public/img/galerie/acoperisuri/23.webp` | acoperisuri | 23 | full | https://www.pexels.com/photo/11557060/ | log cabins or timber houses |
| `public/img/galerie/acoperisuri/23-t.webp` | acoperisuri | 23 | thumb | https://www.pexels.com/photo/11557060/ | log cabins or timber houses |
| `public/img/galerie/acoperisuri/25.webp` | acoperisuri | 25 | full | https://www.pexels.com/photo/38439476/ | log cabins or timber houses |
| `public/img/galerie/acoperisuri/25-t.webp` | acoperisuri | 25 | thumb | https://www.pexels.com/photo/38439476/ | log cabins or timber houses |
| `public/img/galerie/case-la-cheie/03.webp` | case-la-cheie | 3 | full | https://www.pexels.com/photo/30580640/ | greenhouse or industrial campus backdrops |
| `public/img/galerie/case-la-cheie/03-t.webp` | case-la-cheie | 3 | thumb | https://www.pexels.com/photo/30580640/ | greenhouse or industrial campus backdrops |
| `public/img/galerie/case-la-cheie/09.webp` | case-la-cheie | 9 | full | https://commons.wikimedia.org/wiki/File:Under_construction_housing,_Sandiacre_-_8_May_2026.jpg | visible foreign signage or plates |
| `public/img/galerie/case-la-cheie/09-t.webp` | case-la-cheie | 9 | thumb | https://commons.wikimedia.org/wiki/File:Under_construction_housing,_Sandiacre_-_8_May_2026.jpg | visible foreign signage or plates |
| `public/img/galerie/copertine/03.webp` | copertine | 3 | full | https://www.pexels.com/photo/9800008/ | greenhouse or industrial campus backdrops |
| `public/img/galerie/copertine/03-t.webp` | copertine | 3 | thumb | https://www.pexels.com/photo/9800008/ | greenhouse or industrial campus backdrops |
| `public/img/galerie/copertine/04.webp` | copertine | 4 | full | https://www.pexels.com/photo/2547578/ | Mediterranean or coastal vegetation (read as coastal scenery: the open sea fills the background) |
| `public/img/galerie/copertine/04-t.webp` | copertine | 4 | thumb | https://www.pexels.com/photo/2547578/ | Mediterranean or coastal vegetation (read as coastal scenery: the open sea fills the background) |
| `public/img/galerie/copertine/05.webp` | copertine | 5 | full | https://www.pexels.com/photo/36388699/ | mountains or cliffs in frame |
| `public/img/galerie/copertine/05-t.webp` | copertine | 5 | thumb | https://www.pexels.com/photo/36388699/ | mountains or cliffs in frame |
| `public/img/galerie/copertine/07.webp` | copertine | 7 | full | https://www.pexels.com/photo/38524590/ | visible foreign signage or plates |
| `public/img/galerie/copertine/07-t.webp` | copertine | 7 | thumb | https://www.pexels.com/photo/38524590/ | visible foreign signage or plates |
| `public/img/galerie/copertine/08.webp` | copertine | 8 | full | https://www.pexels.com/photo/9799727/ | Mediterranean or coastal vegetation; greenhouse or industrial campus backdrops |
| `public/img/galerie/copertine/08-t.webp` | copertine | 8 | thumb | https://www.pexels.com/photo/9799727/ | Mediterranean or coastal vegetation; greenhouse or industrial campus backdrops |
| `public/img/galerie/copertine/09.webp` | copertine | 9 | full | https://www.pexels.com/photo/9799761/ | greenhouse or industrial campus backdrops |
| `public/img/galerie/copertine/09-t.webp` | copertine | 9 | thumb | https://www.pexels.com/photo/9799761/ | greenhouse or industrial campus backdrops |
| `public/img/galerie/copertine/10.webp` | copertine | 10 | full | https://www.pexels.com/photo/9799731/ | Mediterranean or coastal vegetation; greenhouse or industrial campus backdrops |
| `public/img/galerie/copertine/10-t.webp` | copertine | 10 | thumb | https://www.pexels.com/photo/9799731/ | Mediterranean or coastal vegetation; greenhouse or industrial campus backdrops |
| `public/img/galerie/copertine/12.webp` | copertine | 12 | full | https://www.pexels.com/photo/12184742/ | mountains or cliffs in frame |
| `public/img/galerie/copertine/12-t.webp` | copertine | 12 | thumb | https://www.pexels.com/photo/12184742/ | mountains or cliffs in frame |
| `public/img/galerie/fatade/19.webp` | fatade | 19 | full | https://www.pexels.com/photo/39494025/ | visible foreign signage or plates |
| `public/img/galerie/fatade/19-t.webp` | fatade | 19 | thumb | https://www.pexels.com/photo/39494025/ | visible foreign signage or plates |
| `public/img/galerie/reparatii/30.webp` | reparatii | 30 | full | https://www.pexels.com/photo/4756489/ | log cabins or timber houses |
| `public/img/galerie/reparatii/30-t.webp` | reparatii | 30 | thumb | https://www.pexels.com/photo/4756489/ | log cabins or timber houses |
| `public/img/galerie/industrial/01.webp` | industrial | 1 | full | https://www.pexels.com/photo/13261149/ | greenhouse or industrial campus backdrops |
| `public/img/galerie/industrial/01-t.webp` | industrial | 1 | thumb | https://www.pexels.com/photo/13261149/ | greenhouse or industrial campus backdrops |

Total: 50 files

## Per gallery

| gallery | before | removed | kept | of which stock | preview |
|---|---|---|---|---|---|
| galerie-garduri (/servicii/galerie-garduri/) | 22 | 7 (16 to 22) | 15 | 3 (13, 14, 15) | unchanged (a grid page, no card) |
| acoperisuri | 25 | 5 (19, 20, 21, 23, 25) | 20 | 5 | unchanged |
| case-la-cheie | 12 | 2 (03, 09) | 10 | 8 | unchanged |
| copertine | 12 | 8 (03, 04, 05, 07, 08, 09, 10, 12) | 4 | 2 (06, 11) | unchanged |
| fatade | 19 | 1 (19) | 18 | 14 | unchanged |
| finisaje | 15 | 0 | 15 | 10 | unchanged |
| instalatii | 15 | 0 | 15 | 10 | unchanged |
| terasamente | 26 | 0 | 26 | 10 | unchanged |
| reparatii | 37 | 1 (30) | 36 | 9 | unchanged |
| industrial | 10 | 1 (01) | 9 | 9 | photograph 01 removed; `preview` stays 1 and now names 02 |
| proiectare-3d | 10 | 0 | 10 | 10 | unchanged |
| **all** | **203** | **25 pictures, 50 files** | **178** | **90** | |

Files are not renumbered: the kept pictures keep their file names, so the kept rows of SOURCES and
PROVENANCE do not move.
