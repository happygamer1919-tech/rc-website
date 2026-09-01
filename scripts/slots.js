/* Single source of truth for image slots, from docs/RC-PHOTO-MANIFEST.md.
   Both gen-placeholders.js and process-photos.js read this. Adding a slot here
   and to the template is all it takes. */
/* W6-03: the nine svc-* slots and hero-panel are photo slots again. The SVGs
   are not deleted, they become per-slot fallbacks: a service card renders its
   jpg the moment one exists and its SVG until then, one slot at a time. That is
   why these carry `placeholder: false` — the SVG already guarantees the <img>
   resolves, so a generated JPG placeholder would only hide the fallback. */
const SLOTS = [
  // minLongEdge 900 is a PROVISIONAL owner ruling, W10-01: it exists only to let
  // the five interim "Cum lucram" photos through, and is to be raised back to
  // the manifest default when better sources arrive. Three of the five are
  // portrait, which the manifest forbids for a landscape slot; the centre crop
  // is what pays for that. See DECISIONS.md.
  ...['step-01-fundatie', 'step-02-structura', 'step-03-acoperis', 'step-04-fatada', 'step-05-predare']
    .map((id) => ({ id, w: 900, h: 675, ratio: '4:3', retina: true, minLongEdge: 900 })),
  // Project covers, one per project in content/projects.json. A stub project
  // has no title, so nothing renders its cover and no placeholder is written
  // for it; the slot is still real and process-photos.js accepts it. Same
  // `placeholder: false` device as the gallery slots below.
  // W9-04 R-C: 4:3, not 3:2. Thirty-one of the forty-two sources are portrait,
  // and 4:3 keeps six more percentage points of every portrait frame than 3:2
  // did. It also matches the service cards and the step photos.
  //
  // W9-04, the sizes: at 1440 the container caps at 1200, a grid--3 at a 24px
  // gap gives 368px columns, and the card border leaves the media box at 366px.
  // So 400 covers the 1x natively and 800 covers it at device-pixel-ratio 2.
  // Deliberately below the svc-* convention of 800/1600 for the same box: there
  // are thirty-four of these and nine of those, so weight beats headroom here.
  //
  // minLongEdge 900 is a PROVISIONAL owner ruling, W9-04 R-A, the same device as
  // W7-02 (1200), W8-03 (720) and W10-01 (900). It is to be raised back to the
  // manifest default when better originals arrive. It is NOT a judgement that
  // 900 is enough. See DECISIONS.md.
  //
  // cropAnchor comes from the project record. A centre crop is wrong for a roof
  // and wrong for a foundation, so each project names the part that matters.
  ...require('../content/projects.json').projects
    .map((p) => ({
      id: p.cover, w: 400, h: 300, ratio: '4:3', retina: true, minLongEdge: 900,
      cropAnchor: p.crop_anchor || 'centre',
      placeholder: Boolean(p.title && p.title.ro && p.title.ro.trim() && !p.title.ro.trim().startsWith('TODO:')),
    })),
  // Project gallery slots. Real slots the photo pipeline must accept, but not
  // rendered anywhere yet, so `placeholder: false` keeps gen-placeholders from
  // writing 70 files nothing points at. process-photos handles them normally.
  ...require('../content/projects.json').projects
    .flatMap((p) => p.gallery.map((id) => ({ id, w: 1400, h: 933, ratio: '3:2', retina: true, placeholder: false }))),
  // Hero panel. 4:3, and the 2x is the 2800px source the manifest asks for.
  // Falls back to public/img/hero-panel.svg until the photo lands.
  // minLongEdge 720 is a PROVISIONAL owner ruling, W8-03: it exists only to let
  // the 720x540 interim file through, and is to be raised back when the
  // original arrives. It is NOT a judgement that 720 is enough. See DECISIONS.md.
  { id: 'hero-panel', w: 1400, h: 1050, ratio: '4:3', retina: true, placeholder: false, minLongEdge: 720 },
  // Nine service card photos, 4:3, with the 2x at the 1600x1200 source size.
  // Each falls back to public/img/services/<id>.svg on its own.
  // minLongEdge 1200, not the global 1600: owner ruling, W7-02. The approved
  // artwork is 1448px, and a card renders at 366px wide, so 1448 still covers
  // the 1x four times over. See DECISIONS.md.
  ...['svc-case-la-cheie', 'svc-acoperisuri', 'svc-fatade', 'svc-reparatii', 'svc-finisaje',
      'svc-proiectare-3d', 'svc-instalatii', 'svc-industrial', 'svc-terasamente']
    .map((id) => ({ id, w: 800, h: 600, ratio: '4:3', retina: true, placeholder: false, minLongEdge: 1200 })),
  // Social card. Never retina: og consumers take one fixed size.
  { id: 'og-image', w: 1200, h: 630, ratio: '1200x630', retina: false, branded: true },
];

const MAX_BYTES = 400 * 1024;   // manifest: under 400KB after processing
// Manifest default minimum on the long edge. A slot may lower its own bar with
// `minLongEdge`, which is an owner ruling each time, recorded in DECISIONS.md.
const MIN_LONG_EDGE = 1600;

/* Service card illustration SVGs. Since W6-03 these are the FALLBACK for the
   nine svc-* photo slots above, not the final asset: a card shows its SVG until
   public/img/<id>.jpg exists, then the photo. Still generated here so the <img>
   always resolves, and a real illustration still just overwrites the file at
   public/img/services/<id>.svg. */
const SERVICE_ILLUSTRATIONS = [
  'svc-case-la-cheie', 'svc-acoperisuri', 'svc-fatade', 'svc-reparatii', 'svc-finisaje',
  'svc-proiectare-3d', 'svc-instalatii', 'svc-industrial', 'svc-terasamente',
];

module.exports = { SLOTS, SERVICE_ILLUSTRATIONS, MAX_BYTES, MIN_LONG_EDGE };
