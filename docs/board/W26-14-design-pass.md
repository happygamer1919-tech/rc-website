# W26-14 · The design pass

Card W26-14. Branch `w26/w26-14-design-pass`, stacked on W26-13 (#134). PR only.

## First, the study

I opened **linear.app, stripe.com and Apple's MacBook Air page** in a real browser, on a desktop
and a phone width, and measured every element on them: corners, borders, shadows, button shapes,
backgrounds, spacing, type. What I learned is in **`docs/design/PRINCIPLES-W26.md`**: ten
principles, each with why it works and where it applies on our site. **Nothing was copied** from
those sites.

## What changed on your site

- **Every card has the same 20px rounded corner.** Before, most were 10px, four kinds were 20px,
  and three kinds were square.
- **The big hero panels have 24px corners.**
- **Every button is a pill.**
- **Card borders are almost invisible hairlines**, with a soft two-layer shadow instead. Form
  fields keep their visible border, so people can find them.
- **Hovering a card lifts it 4px, deepens the shadow and grows its photo 3%**, in a quarter of a
  second. With reduced motion turned on, nothing moves.
- **Two light sections that touch now alternate white and a warm off-white** (`#F7F5F2`). The dark
  bands stay exactly where they are.
- **Phone sections have 64px of breathing room** instead of 56px. Desktop was already 96px.
- **Headings are set slightly tighter.**

## Please look at the off-white before you merge

**Your first site was rejected partly because its light sections "read as a dirty screen"**: it
used three near-identical off-whites side by side. This uses **exactly one**, only where two light
sections touch, alternating with white. If it still reads that way to you, **it is one line to
remove**. Compare the before and after screenshots in `docs/design/W26/`.

## Something I found broken and fixed

**Cards were supposed to lift when you hover them, and almost none ever did.** The scroll
animation that fades cards in was overriding the lift on 124 of the 125 cards on the four main
pages. The lift works now, checked in a real browser on a card that fades in late: it starts
moving within 40 milliseconds.

## Speed and accessibility

**No page got slower or less accessible.** Lighthouse, desktop, median of three, on the four
main pages in both languages: performance **99, 99, 98, 98, 100, 100, 100, 100** before and
**exactly the same** after; accessibility **100** everywhere, before and after. (On my first draft
the roofing page once read 92; five alternating runs showed the old site does the same about
twice in five, so it is the page, not the change.)

## Heights

On a desktop, **49 of 53 measured pages are identical to the pixel and none grew**; four got 22
to 30px shorter. On a phone the four main pages grew 58 to 128px from the extra section spacing.

## Screenshots

`docs/design/W26/`: homepage, roofing, turnkey houses, catalogue. Desktop and phone, before and
after.

## Gates

**29 of 29 gate commands exit 0.** 30 numbered gates.
