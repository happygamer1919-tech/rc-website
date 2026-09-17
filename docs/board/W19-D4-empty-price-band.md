# W19-D4 · Five service pages carry a "Preț și condiții" band with no price and no conditions

| | |
|---|---|
| Found by | Critic, wave 19 boundary, 2026-09-16 |
| Live build | `47957f3`, `https://rapidconstruct.md` |
| Severity rank | 4 of 5 |
| Mode | Not assigned by the critic |

## What a visitor sees

On Construcție case la cheie, Acoperișuri, Fațade, Renovări la cheie and Finisaje,
in both locales, a full-width dark band sits between the service details and the
projects. It is headed **"Preț și condiții"** / **"Цена и условия"** and contains
one line: "−10% la programări anticipate" / "−10% при ранней записи". It has no
price, no conditions and no heading. The other four service pages have no such
band. It reads as a section whose content was never filled in.

## Why it exists

W14-05 (RC-105) removed the frozen 160 lei/m² price. That price was the box's
`h2` (`hero.priceTitle`), so the `h2` went with it, and the card kept the box
itself with its eyebrow and the discount line. This was the card's own directive,
never reported as a deviation and never ratified, so it is not a recorded product
decision. It is not an open question either: no `docs/QUESTIONS.md` entry covers
it.

**The one line it still carries is already on the same page.** `footer.offer`
renders "−10% la programări anticipate" / "−10% при ранней записи" in the footer of
40 of the 44 live pages. That includes all 24 pages under `/servicii/`; only the two
privacy pages and the two 404 pages lack it. Measured over the live HTML, 44 of 44
files read. On the homepage the line also appears in the hero card.

## Evidence, measured on the live HTML

Rule: a `<section>` with no `h1` or `h2`, whose visible text **excluding**
`p.eyebrow` is under 60 characters. Over all 44 live pages (files read: 44 of 44),
it matches **exactly these 10 and nothing else**:

| Page | Text besides the eyebrow |
|---|---|
| `/servicii/case-la-cheie/`, `/servicii/acoperisuri/`, `/servicii/fatade/`, `/servicii/reparatii/`, `/servicii/finisaje/` | 29 characters, "−10% la programări anticipate" |
| the five RU counterparts | 22 characters, "−10% при ранней записи" |

## Scope

The price box on the five priced service pages, both locales. Rendered by
`build.js` from `servicePage.priceH` and the discount line.

## Fix direction, non-binding

**Recommended default: remove the band.** Nothing the visitor can read is lost,
because the same line is in the footer of the same page. The alternative, giving
the band real price or conditions content, needs a source for that content and
the owner's word (R-X, W14-05, Q-W14-10's outcome). It is not the critic's to pick,
and the acceptance below holds for either.

Removal lowers each page's height. Service page budgets live in the wave 7
acceptance table in `RELEASE-NOTES.md`; a lower height stays inside them. If
`servicePage.priceH` becomes unused in both locales, it is removed from both in the
same commit (`docs/CLAUDE.md` section 8).

## Acceptance, machine-checkable

1. After `node build.js`, over **every** `.html` file under `dist/` (print the count
   read, and fail if it is zero): zero `<section>` elements with no `h1`/`h2` whose
   visible text, excluding `p.eyebrow`, is under 60 characters. Strip tags, `script`
   and `style`, and collapse whitespace before counting.
2. **Watched failing first.** The same rule run on the current `main` build reports
   exactly the 10 pages above, and exits non-zero.
3. **If the band is removed:**
   - no built page contains the text "Preț și condiții" or "Цена и условия";
   - the footer line "−10% la programări anticipate" / "−10% при ранней записи" is
     still present on all 18 service pages.
4. **If the band is kept with real content:** each of the 10 pages has an `h2` inside
   that section, and the owner's instruction for the content is recorded in
   `DECISIONS.md`.
5. `node scripts/check-links.js` exit 0, and all `quality` gates exit 0, each read
   from its own process.

Recommended, not required: add rule 1 to an existing built-site gate, so an emptied
section cannot ship again unnoticed.
