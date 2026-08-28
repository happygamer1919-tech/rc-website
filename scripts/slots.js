/* Single source of truth for image slots, from docs/RC-PHOTO-MANIFEST.md.
   Both gen-placeholders.js and process-photos.js read this. Adding a slot here
   and to the template is all it takes. */
/* Phase 2: the nine svc-* photo slots are gone. Service cards now hold SVG
   illustrations, which are not photographs and live in SERVICE_ILLUSTRATIONS
   below. */
const SLOTS = [
  { id: 'hero-panel', w: 1200, h: 900, ratio: '4:3', retina: true },
  ...['step-01-fundatie', 'step-02-structura', 'step-03-acoperis', 'step-04-fatada', 'step-05-predare']
    .map((id) => ({ id, w: 900, h: 675, ratio: '4:3', retina: true })),
  ...['port-01', 'port-02', 'port-03', 'port-04', 'port-05', 'port-06']
    .map((id) => ({ id, w: 1400, h: 933, ratio: '3:2', retina: true })),
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
  'svc-proiectare-3d', 'svc-retele', 'svc-industrial', 'svc-terasamente',
];

module.exports = { SLOTS, SERVICE_ILLUSTRATIONS, MAX_BYTES, MIN_LONG_EDGE };
