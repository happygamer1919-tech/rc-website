# Decisions

Where this build departs from `docs/RC-WEBSITE-MASTER-PLAN.md`, and why. The
master plan wins by default; every exception below was approved by Ivan.

## The master plan is stale on two token values

Both were written before the logo file existed. The values below are sampled
from the logo and are what the approved mockup renders.

| Token | Master plan | Built | Why |
|---|---|---|---|
| `--brand` | `#F26419` | `#F65308` | Sampled from `public/logo-full.png`. Approved mockup uses it. |
| `--ink` | `#1C1C1C` | `#1A1A1A` | Same. |

These are the only two places the master plan loses.

## Approved exceptions

- **Services grid may exceed the 1,400px section cap.** Nine 4:3 photo cards in
  a 3x3 grid cannot fit under 1,400px at 96px section padding. It is the same
  object as the portfolio grid, so it is a second permitted grid exception.
  Measured 1,830px (RO) / 1,909px (RU). Desktop page total still clears 9,000px.
- **`form-bg` slot struck.** A darkened photo behind the form needs a fourth
  background value and a translucent overlay. Both are forbidden. See the
  manifest.

## Forced by the real copy

The predecessor build at rapidconstruct-web.vercel.app is the copy source. Where
the design files invented content, the real copy wins.

- Service names are the live ones: `Instalații` not "Rețele inginerești",
  `Renovări la cheie` not "Reparații la cheie", `Lucrări de terasament și
  excavare` not "Terasamente", `Construcție case la cheie` not "Case la cheie".
- Portfolio filter is `Renovări`, not the design's "Reparații".
- Ten work types in the form select, including `Altceva`. The design had nine.
- **Portfolio cards have no location line.** The master plan's card spec lists
  one, but the live site carries no per-project location and inventing one is
  not permitted. Card is photo, category chip, title, one-line description.
- **Process step titles come from the master plan, not the live site.** Section
  5.4 names the five steps explicitly and the manifest locks the slot IDs
  (`step-04-fatada`, `step-05-predare`). The live site's old scroll section used
  a different step 4 ("Ferestre și uși") and step 5 ("Ultimele detalii"). Steps
  1, 2, 3 and 5 reuse the live one-liners verbatim. Step 4 has no matching live
  stage line, so it uses the real `Fațade` service sentence, shortened, which is
  a permitted edit.

## Everything the design files invented, and did not ship

None of this reached `dist/`:

- Testimonials from Andrei Ciobanu, Maria Rusu and Victor Munteanu. The real
  three are Ion Miron, Maria Oprea and Andrei Condrea.
- Six invented portfolio projects with fabricated m², durations and locations
  (Durlești, Stăuceni, Ialoveni, Bubuieci, "240 m²", "unsprezece luni").
- Invented service two-liners.

## Build choices

- Hero is variant B (centred). Variant A dropped.
- Heading family is behind `--font-heading` in `src/styles.css`. Both Inter and
  Unbounded are already in the font link, so the pending A/B is a one-value
  change and no font bytes are downloaded for the family that is not used.
- Image placeholders are generated JPGs at the manifest's pixel size, not CSS
  backgrounds, so `<img>` alt text survives for Romanian-language SEO and no
  broken-image icon is ever possible. See `scripts/gen-placeholders.js`.
- Form posts to Web3Forms. Access key comes from `WEB3FORMS_KEY` at build time.
