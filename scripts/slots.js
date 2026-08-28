/* Single source of truth for image slots, from docs/RC-PHOTO-MANIFEST.md.
   Both gen-placeholders.js and process-photos.js read this. Adding a slot here
   and to the template is all it takes. */
/* Phase 2: the nine svc-* photo slots are gone. Service cards now hold SVG
   illustrations, which are not photographs and live in SERVICE_ILLUSTRATIONS
   below. */
const SLOTS = [
  ...['step-01-fundatie', 'step-02-structura', 'step-03-acoperis', 'step-04-fatada', 'step-05-predare']
    .map((id) => ({ id, w: 900, h: 675, ratio: '4:3', retina: true })),
  // Project covers, one per project in content/projects.json.
  ...require('../content/projects.json').projects
    .map((p) => ({ id: p.cover, w: 1400, h: 933, ratio: '3:2', retina: true })),
  // Project gallery slots. Real slots the photo pipeline must accept, but not
  // rendered anywhere yet, so `placeholder: false` keeps gen-placeholders from
  // writing 70 files nothing points at. process-photos handles them normally.
  ...require('../content/projects.json').projects
    .flatMap((p) => p.gallery.map((id) => ({ id, w: 1400, h: 933, ratio: '3:2', retina: true, placeholder: false }))),
  // Social card. Never retina: og consumers take one fixed size.
  { id: 'og-image', w: 1200, h: 630, ratio: '1200x630', retina: false, branded: true },
];

const MAX_BYTES = 400 * 1024;   // manifest: under 400KB after processing
const MIN_LONG_EDGE = 1600;     // manifest: minimum on the long edge

/* Service card illustrations. Not photo slots: they ship as placeholder SVGs so
   the <img> always resolves, and a real illustration simply overwrites the file
   at public/img/services/<id>.svg. */
const SERVICE_ILLUSTRATIONS = [
  'svc-case-la-cheie', 'svc-acoperisuri', 'svc-fatade', 'svc-reparatii', 'svc-finisaje',
  'svc-proiectare-3d', 'svc-instalatii', 'svc-industrial', 'svc-terasamente',
];

module.exports = { SLOTS, SERVICE_ILLUSTRATIONS, MAX_BYTES, MIN_LONG_EDGE };
