# W28-17 · Technical SEO on every page

Card W28-17. Branch `w28/w28-17-technical-seo`, stacked on W28-16. Under the wave 28 dispatch.

## What this card does

Every one of the 85 pages now has the full set of search tags: a title of its own under 60
characters (no two pages share one any more), a description under 155, a canonical address, the
Romanian and Russian alternates pointing at each other, and the Open Graph and Twitter tags with a
real 1200x630 picture. The nineteen pages that lacked some of it (the old catalogue addresses that
forward, the privacy pages, the 404 pages, the internal review page) have it now; three Russian
titles that were one character too long are shorter; the sitemap no longer names the home pages as
the alternates of the privacy pages; the Catalog page's description says the category names again.

A new gate, `node scripts/seo-check.js`, checks all of it on every build and also fetches every
sitemap address from the built output to be sure it answers.

## What to look at

View the source of `https://rapidconstruct.md/catalog/materiale-acoperis/` after the merge: the
title starts with "Catalog:". `https://rapidconstruct.md/sitemap.xml`: 66 addresses, each with its
own Romanian and Russian alternates.

## Heights

None move.

## Gates

All 32 gate commands exit 0 locally (`node scripts/run-gates.js --keep-going`), including the new
gate 33. CI runs the full 32.
