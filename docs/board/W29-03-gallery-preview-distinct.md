# W29-03 · Gallery preview visibility and a distinct image

R-W29-03. On every service page gallery (RO and RU), the "Deschide galeria" card reads as a button at first sight: orange filled background, white bold text, a gallery icon, the image count "(N fotografii)", the whole card one link, a darker fill on hover. The preview picture is never a picture already shown as a described card in the same gallery: the next RC-own picture not used above, else the first stock picture of that gallery, never identical.

## Reading

- "Described item card" is a project card in the same grid (heading, description, cover). A project cover and a gallery photograph are different files cut from the same original by two pipelines, so "not identical" is judged on the photograph (a 256-bit difference hash drawn by Chrome) as well as on the `src`.
- "RC-own" is `origin` owner (not stock) in `content/galleries.json`.

## Acceptance

- `node build.js && node scripts/check-gallery-preview.js` (the named test gallery-preview-distinct) exit 0, every service page in both locales.
- Screenshot per page in `docs/reports/W29-RUN.md`, and the list of replaced previews per page.
