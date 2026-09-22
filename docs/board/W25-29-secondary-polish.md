# W25-29 · The polish, and the photographs that are blocked on a 403

Card W25-29. Branch `w25/w25-29-secondary-polish`, stacked on `w25/w25-28-category-tiles`.
PR only, stops for the owner.

## What this ships, and what it does not

**Shipped: the polish.** One radius token, a resting shadow on every card family, and the hover
lift extended to the six families that had none.

**Not shipped, and blocked: all three photograph placements.** The homepage photo band, the
three service-page side photos and the contact strip all need a picture from a licence-free
library, and **W25-R23 names Unsplash and Pexels, and both refuse automated access**. Measured
at W25-27 and recorded as **Q-W25-20**: Unsplash answers 307, Pexels 403, and the Pexels API
401 without a key.

**Nothing was substituted.** The site holds project photographs that could have been dropped
into a decorative band, and they were not: they are 400x300, under the floor, and their
provenance rows read `legacy, licence unverified` with one saying `origin not recorded`. A
decorative band is the one place where a picture's origin is easiest to be careless about,
which is exactly why W25-R23 names two libraries and asks for the licence page.

## The polish, and why it moves no budget

**Three changes, none of which is layout.** A border radius, a box shadow and a hover
transform change nothing about where a box sits, which is why this half could ship while the
other half waits: it needed no measurement to be safe, and it was measured anyway.

| Page | Before | After |
|---|---|---|
| `/` | 9,081 | **9,081** |
| `/ru/` | 9,294 | **9,294** |
| `/catalog/` | 3,623 | **3,623** |
| `/servicii/acoperisuri/` | 16,470 | **16,470** |
| `/servicii/copertine/` | 6,555 | **6,555** |
| `/servicii/modele-garduri/` | 3,820 | **3,820** |

Identical to the pixel on all six. **No budget moved and none needed to.**

### One token where there were four numbers

The card radius was `10px` on `.card`, `20px` on `.prod`, `.cat-tile` and `.nvk`, and **`32px`
on `.xsell`**. The 20px was written out three times and the 32px was an outlier nobody had
noticed.

`--radius-card-lg: 20px` now holds it, and the four large families use it. `--radius-card`
stays 10px: it belongs to the project card, the spec table, the form card and the menu panels,
and merging the two would have been a redesign rather than a polish.

### A resting shadow, and a lift where there was none

`.card` and `.form-card` carried `--shadow-card`; `.prod`, `.cat-tile`, `.nvk`, `.xsell`,
`.teaser`, `.offer` and `.review` carried none. They do now.

**The lift is the one `.card` has had since wave 6**, extended rather than invented: the same
`translateY(-4px)`, the same `--hover-dur`, the same `0 8px 24px rgba(0, 0, 0, 0.12)` and the
same brand border. **No new colour value**, which gate 6 requires, because every value in it is
already in the stylesheet.

**A visitor pressing a catalogue card got no feedback at all** while a project card lifted
under the pointer. Six families, one behaviour.

### The reduced-motion list was extended in the same commit

`@media (prefers-reduced-motion: reduce)` names every selector whose transform it cancels, so a
lift added without touching that block is a lift reduced motion does not remove. All six were
added there too. **Section 1's rule is that motion is fully disabled under reduced motion, and
a list that has to be edited twice is a list that gets edited once.**

## Spacing rhythm: not done, and the reason

The dispatch's fourth polish item is spacing rhythm, and it is the one item here that **is**
layout. Changing a section's padding moves every height budget on the site, and this dispatch
has already re-measured six pages across four cards. It is a card of its own, with its own
measurement pass, and doing it here would have mixed a change that moves nothing with a change
that moves everything.

## Gates

**25 of 25 gate commands exit 0.** Gate 20 measured the geometry at 1440 and 390 in both
locales and passed; gate 22 confirms no class is declared twice with contradicting properties;
gate 5's Lighthouse floors are unchanged.

## Recorded for ratification

1. **No photograph was substituted for the blocked ones.** The site's own project covers are
   400x300 and carry `legacy, licence unverified`.
2. **The polish is exactly the three non-layout changes**, so no budget moved, and the six
   pages were measured to prove it rather than to find it.
3. **Spacing rhythm is deferred** to a card that can measure it.
