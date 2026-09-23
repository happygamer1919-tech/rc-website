# W28-02 · The floating header

Card W28-02. Branch `w27/w28-02-floating-header`, stacked on W28-01. Approved under your delegation
(W27-R-07); you may overturn it in the morning, and it is one card to revert.

## What changed

The white strip behind the header and the line under it are gone. The dark pill now floats on the
page on a deep soft shadow, a little taller (72px), and the page scrolls behind it. Nothing else in
the header moved: same logo, same links, same buttons, same phone number.

## What to look at

`docs/design/W27/w28-02-*.jpg`, the top of every page, and scroll one page on a phone to see the pill
compress over the content.

## Gates

Static gates, header-fit, dropdown-contrast and text-contrast gates exit 0. CI runs the full 29.
