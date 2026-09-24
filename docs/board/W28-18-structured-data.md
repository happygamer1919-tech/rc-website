# W28-18 · Structured data on every page

Card W28-18. Branch `w28/w28-18-structured-data`, stacked on W28-17. Under the wave 28 dispatch.

## What this card does

Every one of the 85 pages now tells search engines what it is in their own format (JSON-LD):
the home page says who Rapid Construct is (organisation and local business, with the address,
phone and e-mail the footer prints); every service page says what service it is; every catalogue
page lists each priced product with its "from" price in lei (no upper price, no struck price, no
rating); every inner page carries its breadcrumb trail; the FAQ pages carry their questions and
answers. No star rating and no review markup anywhere. A new gate checks all of it on every build.

## What to look at

Paste `https://rapidconstruct.md/catalog/termoizolatie/` into Google's Rich Results Test after the
merge: Product entries with prices, and the breadcrumb.

## Heights

None move.

## Gates

All 33 gate commands exit 0 locally (`node scripts/run-gates.js --keep-going`), including the new
gate 34. CI runs the full 33.
