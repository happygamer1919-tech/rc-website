# W29-02 · Service cards fully clickable

R-W29-03. The home page "Ce oferim pentru tine" cards, RO and RU: the whole card is one link to the service page, not only "Află mai multe". "Află mai multe" stays as the visual affordance inside the link. Hover: card lift plus border colour on the whole card. Keyboard focus ring on the card. No nested anchors.

## Reading

- "Every other service card grid (services index, RU too)": the site has no services index page. The home grid in both locales is the only grid of cards that link to service pages; the teaser row and the cross-sell cards were whole-card links already, and the header's Servicii panel is a menu, not cards.
- "Playwright test" is a zero-dependency CDP script (R-W29 register, test tooling); "axe passes" is Lighthouse accessibility 100 on the home pages (gate 5) plus the nesting check in the new test.

## Acceptance

- `node build.js && node scripts/check-service-cards.js` exit 0: 36 real pointer clicks (picture and description of each of 9 cards, RO and RU) land on the service URL; no interactive element inside another on either home page; self-test first. On the build of `main` before this card it exits 1, 18 cards named.
- `node scripts/check-lighthouse.js` exit 0 (accessibility 100, both home pages).
- `node scripts/check-viewport-320.js` exit 0.
