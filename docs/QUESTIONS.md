# Open questions for the owner

Append only. Never delete an entry; mark it answered and keep it.
Every entry carries a recommended default, and the build ships that default so
nothing is blocked waiting for an answer.

---

## Q-01 · Supplier logo files — OPEN, opened 2026-08-31 (W6-01)

Twelve brands are now named in the marquee: technonicol, bilka, novatik, iko,
swisspor, knauf, baumit, ceresit, weber, ytong, holcim, bosch.

**Needed:** one full-colour logo file per brand, dropped at
`public/img/suppliers/<slug>.svg` (preferred) or `.png`. Transparent background.
No second greyscale asset: the grey default state is a CSS filter.

**Default shipped:** a chip with no logo file renders the brand name as text in
the white tile. The fallback is per brand, so the first logo to land shows as a
logo while the other eleven stay text.

**Also needs a ruling:** are all twelve brands actually used by Rapid Construct?
The marquee is a public claim about suppliers. The names came from the card, not
from the site copy, so they are treated as the owner's input rather than
invented, but nobody has confirmed the list against the business.

---

## Q-02 · Projects per service — OPEN, opened 2026-08-31 (W6-02)

The card asks for 5 to 7 projects per service across 9 services (45 to 63).

**Default shipped:** 6 per service, 54 total. Mid-range, and it divides evenly.

---

## Q-03 · Gallery slots on stub projects — OPEN, opened 2026-08-31 (W6-02)

The manifest's project shape is 1 cover + 3 to 4 gallery photos. Applying it to
44 new stub projects would put 132 unshootable gallery slots into the shoot plan.

**Default shipped:** stub projects carry a cover slot only. Gallery slots are
added to a project when it has real content and real photographs, which is what
manifest rule D-6 already says ("a project with fewer than three usable gallery
photos ships as cover only"). The 10 existing projects keep their galleries.

Cost of the alternative, for comparison: 216 photo slots instead of 89.

---

## Q-04 · Real content for 44 stub projects — OPEN, opened 2026-08-31 (W6-02)

Every stub ships with empty fields and is invisible on the site: `build.js`
drops any project without a real title and summary. They become visible only
when someone fills them.

**Needed per project:** title, summary, and optionally location, year,
work_type, area_sqm, duration, main_materials, challenge. Nothing is invented.

---

## Answered

*(none yet)*

---

## Q-05 · Nine `svc-*.png` files in the repo root — OPEN, opened 2026-08-31 (W6-03)

Nine untracked files sit in the repo root: `svc-case-la-cheie.png`,
`svc-acoperisuri.png`, `svc-fatade.png`, `svc-reparatii.png`, `svc-finisaje.png`,
`svc-proiectare-3d.png`, `svc-instalatii.png`, `svc-industrial.png`,
`svc-terasamente.png`. Each is 1448x1086 (4:3) and 1.7 to 2.2MB, timestamped
15:10 to 15:14 on 2026-08-31, which is before this session started. They were
not created by W6-03.

They match the nine service card slots by name and by ratio, which is very
likely what they are for.

**Nothing was done with them.** They are untouched, unstaged and uncommitted,
because moving or committing someone else's files is not this card's call.

**If they are the service card artwork**, the route in is:

    mv svc-*.png photos-raw/          # rename any .png to .jpg first, or keep .png
    node scripts/process-photos.js    # writes 800x600 and 1600x1200 into public/img
    node build.js                     # each card flips from SVG to photo on its own

One warning to expect: 1448px on the long edge is under the manifest's 1600px
minimum, so the pipeline will accept them and say so. The 2x would be upscaled
from 1448 to 1600. If better originals exist, they are worth finding first.

**If they are not**, they should be deleted or moved out of the repo root.

---

## Q-06 · The header contradicts a locked master-plan decision — OPEN, opened 2026-08-31 (W7-01)

Found while deriving `docs/CLAUDE.md` from committed material, not while
looking for it.

Master plan section 3, in the **Locked decisions** table:

> **Header** — White bar with accent. Solid, opaque, sticky. Not transparent,
> **not a floating dark pill.**

What is built (`src/styles.css`): a white `#FFFFFF` bar, 96px, opaque, fixed,
1px `--line` bottom border — containing a **`#141414` pill with
`border-radius: 999px`** that holds the nav, phone, CTA and language switcher.

**`DECISIONS.md` says nothing about the header.** Not one entry. That file
exists to record every departure from the master plan, and this departure is
from a decision the plan marks as locked and specifically warns against.

**In fairness to the build**, it honours most of the clause: the bar is white,
solid, opaque, and not floating (it is fixed with a constant body spacer). It is
a dark pill *inside* a white bar, not a floating dark pill. Whether that is the
thing the plan ruled out is a judgement, and that is exactly why it should be
recorded and is not.

The master plan also specifies header height 72px; the built bar is 96px
desktop and 80px mobile.

**Nothing was changed.** The header is not this wave's card, it was approved by
Mihai in the phase 1 snapshot on 2026-08-28, and reversing an approved visual on
my own reading of an older document would be guessing a product decision.

**Options:**

1. **Ratify it.** The pill shipped, it was approved, it looks deliberate. Add a
   `DECISIONS.md` entry saying the master plan loses here and why. One paragraph,
   no code. **Recommended.**
2. **Revert to the plan.** Drop the pill, put the nav on the white bar in
   `--ink`. This is a visible change to something Mihai has already signed off,
   and it would need re-approval.
3. Leave both documents contradicting each other. Not recommended: the next
   executor booting from the master plan reads "not a floating dark pill" as a
   live rule and may "fix" a header nobody asked them to touch.

**Default shipped:** option 3 by inaction, which is why this question exists.
No code changed and the contradiction is now at least written down.

**Related, already fixed:** `RELEASE-NOTES.md` carried three stale header
numbers (a "72px spacer" and a "72px -> 64px" compression; the real values are a
96px spacer and 64px -> 56px). Corrected in the W7-01 commit, since
`docs/CLAUDE.md` cites that file as a source and citing a wrong source is worse
than not citing one.
