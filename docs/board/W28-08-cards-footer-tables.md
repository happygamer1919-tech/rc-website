# W28-08 · Product cards, bento labels, a quiet footer, zebra tables

Card W28-08. Branch `w27/w28-08-cards-footer-tables`, stacked on W28-07. The last design card;
W28-T (two-tone headings) is skipped, see below.

## What changed

- **Product cards** show, in this order: picture, name, one line, the price in orange with the arrow,
  the colour chips as soft cream pills, a hairline, then the facts.
- **The big tile labels are 32px.**
- **The footer is quiet**: grey uppercase column heads, larger white links, no lines.
- **Tables** (specifications, "Compară modelele") have a dark header row, alternating cream rows and
  more room in every cell.

## W28-T, skipped

Two-tone headings need the second half of each heading in its own element, which this repo's
locale strings cannot express without a change to the site generator; the design cards allow CSS
and locale strings only. Your ruling made it optional. The hub headings already have a muted second
word and keep it.

## What to look at

`docs/design/W27/w28-08-*.jpg`: the roofing page's cards and tables, the home page's footer.

## Gates

Static gates, heading-fit, geometry and text-contrast gates exit 0. CI runs the full 29.
