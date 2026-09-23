# W28-05 · Buttons: a dark label on the orange

Card W28-05. Branch `w27/w28-05-buttons`, stacked on W28-04.

## What changed

Every orange button now has a dark label instead of a white one, at 17px instead of 19px, including
the Catalog button in the header and the round arrow on product cards. Dark on orange reads at 5.3:1,
which passes accessibility at any size; white on orange only passed because the text was large.
Hovering a button turns it darker orange with a white label.

## What to look at

`docs/design/W27/w28-05-*.jpg`: the header, the hero buttons, the form's submit, the product cards.

## Gates

Static gates, header-fit, dropdown-contrast and text-contrast gates exit 0. CI runs the full 29.
