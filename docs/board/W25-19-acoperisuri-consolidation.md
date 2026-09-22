# W25-19 · The roofing catalogue moves onto the page that sells the roof

Card W25-19. Branch `w25/w25-19-acoperisuri-consolidation`, stacked on
`w25/w25-18-garduri-images`. PR only, stops for the owner.

## What this ships

`/servicii/acoperisuri/` keeps its four hub tiles and gains **the whole roofing catalogue**:
a filter bar of eight buttons and **75 product cards**, the 71 roofing records plus the four
metal tile models. The eight `/catalog/materiale-acoperis/*` URLs become **redirect pages
that still answer 200** and land on the matching filter.

A visitor who wanted a gutter was two page loads and a menu from one. Now they are on the
page that sells the roof, and the filter is one press.

## The section

**The card is `prodCard`, the catalogue's own.** It was lifted out of `catalogProducts`
unchanged and the extraction was proved neutral before anything was built on it: the whole
of `dist/` was diffed against the same build before the refactor and **every byte matched**.
The quote button, the price element, the placeholder and the phone fold therefore behave
here exactly as they do on a catalogue page, because they are the same code.

**The filter is the subcategory list**, read from `content/catalog.json`, so the groups,
their labels and their order are the menu's own and nothing about them is typed in
`build.js`.

**A card appears once, under every group it belongs to.** Three records are in two
subcategories each. Rendering the card twice would have put one picture on two cards, which
gate 19 refuses for good reason, so a card carries a space-separated `data-roof-groups` and
the filter matches into it.

**The prefix is `.roof-*` and rule 3.1 was checked first**: `grep '\.roof' src/styles.css`
returned nothing. `.filter` and `.filters` were the obvious reuse and are the portfolio
chips', which is the reuse rule 3.1 exists to stop: those chips are shown and hidden by a
different script, and a class carries a rule as well as a look.

## The fold and the filter had to be taught about each other

`main.js` folded cards by their position in the full list. On a filtered grid that is the
wrong list: with Profnastil selected, **eight cards are on the page and seven of them would
have been folded behind a button saying there were more**. The fold now counts the cards the
filter is showing, and a filter press dispatches `rc:filtered` so the revealed count resets.
On every unfiltered grid the visible list IS the full list, so the fourteen catalogue pages
behave exactly as before.

**Measured in a browser, at both widths, pressing the controls:**

| Width | Action | Shown | Painted | Folded | Button |
|---|---|---|---|---|---|
| 1440 | load | 75 | 75 | 0 | hidden |
| 1440 | Profnastil | 8 | 8 | 0 | hidden |
| 1440 | Hidroizolație | 22 | 22 | 0 | hidden |
| 390 | load | 75 | 9 | 66 | shown |
| 390 | Profnastil | 8 | 8 | 0 | hidden |
| 390 | Toate | 75 | 9 | 66 | shown |
| 390 | `#mat-sistem-de-scurgere` | 14 | 9 | 5 | shown |
| 1440 | `#mat-elemente-de-fixare` | 6 | 6 | 0 | hidden |

Every count is the data's: profnastil 8, hidroizolație 22, sistem de scurgere 14, elemente
de fixare 6, elemente de siguranță 3.

## The redirect pages

GitHub Pages serves static files and cannot answer a 301, so the choice was a dead URL or a
page that answers 200 and moves the visitor on. **Three mechanisms, because each covers what
the one before cannot**: the http-equiv refresh for a visitor with no JavaScript; `noindex,
follow` with a canonical at the destination, for a crawler; and a real visible link, for the
case where the refresh is blocked.

**They carry the promo bar and almost nothing else of the site's chrome.** That is not
taste: the promo bar is what `verify-live` reads to decide a page is ready to measure
(W25-R11), and a page it can never call ready is a row it can never measure.

**The eight leave the sitemap.** A sitemap that advertises a `noindex` page asks a crawler
to index what the page tells it not to. They keep their URLs and still answer 200.

## Sixteen rows left verify-live, and were replaced rather than deleted

The sixteen `cat` and `sub` rows are gone from `PAGES`. **A redirect page cannot be
measured**: its refresh fires before anything settles, so a browser measuring
`/catalog/materiale-acoperis/profnastil/` reports the height of `/servicii/acoperisuri/`
with a filter applied. That is a measurement of a different page wearing this one's label,
and it is exactly what happened on the first local run, which is how it was found.

What replaces them is `REDIRECTS`: a plain cache-busted fetch of each of the sixteen URLs,
asserting **200**, `noindex, follow`, the build sha, and that the refresh, the canonical and
the visible link agree on one destination. No browser, milliseconds.

## The gates learned, they were not relaxed

**RC-129** gains a fourth kind of page. The eight roofing routes are `redirect` pages, not
an exemption: they are still scanned whole for every prohibition, **and** are held to what a
redirect page must carry, and **eight per locale is asserted** so a ninth or a reverted one
fires. It also gains a second permitted home for `.prod__price`, named rather than
pattern-matched on the path, so a third page cannot acquire the permission by being called
something.

**The catalogue gate reads comments, and it caught this card's own.** `src/moved.html`
explained its refresh by writing the tag out in a comment, and the gate's target regex
matched the comment before the real tag, on all sixteen pages. The comment now describes the
mechanism instead, and says why.

**Gate 20 measured the new grid** at 1440 and 390, both locales, and passed. `gen-photo-review`
and `gen-ai-prompts` both learned `ACTM-`: the four tile model cards are in the owner's
review list, and they are held out of the prompt pack under W25-R2, as named tile products,
by the same words that hold the four Novatik tiles.

## The budget, per W25-R18

`/servicii/acoperisuri/` **7,598 to 16,904**, budget **16,964**; RU **7,736 to 17,064**,
budget **17,124**. Measured at 1440 with every reveal applied and settled, plus 60, which is
W24-R4's own term. `docs/rulings/R-Y.md` carries it with the reason. W25-R18 requires it
re-measured on the deployed sha after the merge, and corrected there if the live page
differs.

## Q-W25-17

The Tigla metalică filter holds eight cards under four names: the tile page's four models
and Dasterum's four. Those are generic profile names every maker in the region uses, so two
suppliers publishing them is ordinary, but a visitor sees **two prices for what reads as the
same tile** with nothing saying why. Logged with four options and a shipped default of
"leave it", because naming the supplier needs Q-W14-08 answered first.

## Gates

**24 of 24 gate commands exit 0**, from `node scripts/run-gates.js --keep-going`. RC-129
reads `2 index, 14 category, 14 subcategory, 16 redirect`. Gate 19 reads `ledger slots
filled: 271 of 337`. Gate 20 measured the new grid at 1440 and 390 in both locales.

## Recorded for ratification

1. **The section sits after the roofing offers, not directly under the hub tiles.** The
   dispatch says "keeps its 4 hub tiles, then a product section"; putting a 16,000px grid
   between the hub and the hero would leave this page's own `h1` several screens down. The
   hub tiles are still the first thing on the page.
2. **A redirect page is a kind of page, not an exemption**, in RC-129 and in verify-live.
3. **The sixteen rows were replaced, not deleted.** Deleting them would have left sixteen
   live URLs that nothing checks.
