# W27-FIX-14 · Pictures appear at once

Card W27-FIX-14. Branch `w27/w27-fix-14-image-speed`, stacked on W27-FIX-13.

## What this does

Two things, both measured first.

- **Cards reveal before they reach the screen.** The fade-in used to start only once a tenth of a
  card was already visible, so on a scroll the cards looked late. They now start a quarter of a
  screen early: scrolling at a normal pace, a card is already there when it arrives; scrolling fast,
  you still see the smooth fade.
- **Retina screens stop downloading pictures four times too large.** The service cards, the five
  process pictures and the four roofing offer cards told the browser "take the double-size file on
  a retina screen", and that file is 350KB for a box a quarter of its size. They now say how wide
  the box is, and the browser picks the right file. A retina visitor to the homepage downloads
  2.9MB of pictures instead of 4.9MB; the roofing page 6.9MB instead of 7.4MB.

No picture was re-encoded and the format stays JPEG (your W25 ruling). The big remaining weight is
the roofing page's 99 product pictures and the galleries, which load only as you reach them.

## What to look at

`https://rapidconstruct.md/` on a phone or a retina laptop: scroll down through "Ce oferim" and "De
la fundație la predare"; the cards are there as you arrive.

## Heights

None move.

## Gates

Static gates exit 0. CI runs the full 29.
