# Design principles, wave 26

Card W26-14, ruling W26-R16. Written before any token was changed.

## How these were found

Three sites were opened in headless Chrome on 2026-09-22, at 1440px and at 390px with mobile
emulation, scrolled to the end so lazy content loaded, and read two ways: by eye, from
screenshots taken down each page, and by measurement, from the computed style of every visible
element (corner radii, borders, shadows, background colours, button shapes, transitions, section
padding, type). The sites:

- **linear.app**, the home page (dark, product software);
- **stripe.com**, the home page (light, financial software);
- **apple.com/macbook-air/**, one Apple product page (light, a physical product).

**Nothing was copied.** No asset, sentence or line of code from any of them is in this repo. The
screenshots of those sites stayed in a scratch folder outside it; the screenshots in
`docs/design/W26/` are of this site only. What follows are observations
about how those pages behave, with the measured values that show it, and what each means for a
construction company's site in two languages.

Each principle says **why it works** and **where it applies here**. The token spec W26-R16 fixed
the values; these are the reasons the values hang together.

---

## 1. One corner, everywhere

**Seen.** Apple's page uses one radius, 28px, on 61 of 62 large rounded boxes and on 48 of 55
images. Stripe uses 6px on 64 of the 84 it rounds. Linear keeps a small family (12, 9 and 8px)
and uses it consistently by size.

**Why it works.** A repeated corner is how a page says "these are the same kind of thing". When
every card, image and panel shares it, the eye stops reading the shapes and reads the content.
Mixed corners (10px here, 20px there, square next to both) read as components from different
places, which is what they were.

**Here.** Every card family moves to 20px: project cards, catalogue products, category tiles,
fence models, cross-sell cards, teasers, offers, forms and the service steps. The two families
that already used 20px (W25-29's `--radius-card-lg`) and the ones on 10px become one token.

## 2. Nested corners are concentric

**Seen.** Not measured on its own: it is what principle 1 requires wherever one rounded box sits
inside another with a gap between them, and there are four such places here.

**Why it works.** Equal radii on an inset image make the gap pinch at the corners and bulge at the
sides. Concentric corners keep the frame the same width, which is what makes an inset read as
deliberate.

**Here.** The catalogue card's and the fence model card's images sit 12px inside a 20px card, and
the offer and metal tile images sit inside padded cards, so all four take a 12px corner. Images
that ARE the top of a card take the card's corner through the card's own clipping, and standalone
images take the card radius outright (principle 9).

## 3. Borders at the edge of visibility

**Seen.** Linear's borders are white at 8% on near-black (68 of the 92 one-pixel borders
counted). Stripe's are a pale blue-grey. Apple barely uses borders at all (three visible one-pixel borders on the whole
page) and separates with tone.

**Why it works.** A border is there to stop two white things merging, not to be looked at. At 6%
black it does that job on white and on the off-white, and it stops competing with the text and
the photographs for attention. A solid grey line draws a diagram around every card.

**Here.** Card, panel, divider and image borders move from `--line` to a 6% black hairline.
**Form fields keep `--line`**: a field's edge is how a visitor finds it, and it has to be seen.

## 4. Two soft shadows, not one hard one

**Seen.** Stripe's largest shadows are layered: a tight one at the contact edge and a wide, faint
one for depth. Linear uses a one-pixel shadow ring in place of a border.

**Why it works.** A real object on a table has a sharp dark line where it touches and a broad soft
shadow around it. Two layers imitate that, so a card reads as lifted rather than outlined. One
dark blur reads as a sticker.

**Here.** Every card rests on `0 1px 2px` at 4% plus `0 12px 32px` at 6%, and lifts on hover to a
deeper pair. None on the `#141414` bands, where a shadow cannot be seen and a wash already lifts.

## 5. Tone separates sections, lines do not

**Seen.** Apple's page is white panels and pale grey panels all the way down; Stripe drops to a very
pale tint behind some bands. Neither relies on a line to say where a section ends.

**Why it works.** A change of ground is read before any line or heading, so the visitor knows a
new subject has started without having to look for the divider. It also lets white cards sit on
the tinted ground and read as objects.

**Here.** Consecutive light sections alternate white and one warm off-white; the `#141414` bands
stay where they are. **One history the owner has seen before**: the rejected first build had
three near-identical light values side by side, and the client read them as "a dirty screen"
(master plan, section 1). This uses exactly one, alternating with white, never three, and it is
one token, so reverting it is one line.

## 6. Rhythm comes from one spacing value

**Seen.** Stripe's bands are padded 96px (5 of 7 large paddings measured); Linear's 128px. Within
each site the value repeats; it is not chosen per section.

**Why it works.** When every section breathes the same amount, the page feels even without the
visitor knowing why, and a section that needs to stand out can do it with content rather than
with a gap.

**Here.** Sections are 96px top and bottom on desktop, which they already were, and **64px on a
phone**, where 96px of empty screen is most of a thumb's travel.

## 7. Tight headings, loose body

**Seen.** Every large heading on all three sites is tracked negative: Linear's 64px heading at
-1.4px, Stripe's 48px at -0.96px. Body text is 16 to 17px with generous leading.

**Why it works.** Large type set at its default spacing looks loose, because the gaps between
letters grow with the size while the eye expects them to stay the same. Pulling them in makes a
heading read as one shape. Body text is the opposite: more leading makes long paragraphs,
especially Russian ones, easier to track from line to line.

**Here.** Headings at -0.01em, body line height 1.6. Our headings are uppercase, which already
spaces letters wider, so the pull is gentle.

## 8. Actions are pills, content is cards

**Seen.** Apple's buttons are full pills (a 980px radius), Linear's too (9999px). Their cards are
rounded rectangles. The two shapes never swap.

**Why it works.** When only buttons are pills, the shape alone says "this does something". A
rectangular button inside a rectangular card is one more rectangle to decode.

**Here.** Every `.btn`, the filters and the catalogue card's arrow button become pills. Cards
stay rounded rectangles.

## 9. Images wear the corner of their container

**Seen.** On Apple's page, 48 of 55 visible images carry the same 28px corner as the panels
around them; the other seven are square.

**Why it works.** A square photograph inside a rounded page reads as pasted in. Matching the
corner makes the photograph part of the layout rather than a rectangle sitting on it.

**Here.** Standalone images (the before and after slider, the gallery thumbnails, framed media)
take the card radius; the hero panels and the bento tiles are hero-scale and take 24px; inset
images take 12px (principle 2).

## 10. Motion answers the pointer, briefly, and nothing else moves

**Seen.** Linear's hover transitions run 100 to 160ms, Stripe's 300ms, Apple's 240 to 320ms,
mostly eased out. What moves is the thing under the pointer.

**Why it works.** A short eased response confirms "this is clickable" without making anyone
wait, and ease-out starts fast so the response feels immediate. Motion that is not a response
to the visitor is decoration, and this site's rule forbids it.

**Here.** A card lifts 4px and deepens its shadow over 250ms, and its photograph grows 3% inside
its frame. Nothing moves under reduced motion. Focus is always visible, so a keyboard visitor
gets the same answer a mouse gets: every focusable thing keeps its ring.

---

**What is not borrowed**, deliberately: Linear's dark theme, Stripe's gradients and Apple's type
scale. The site keeps its own ten colours plus the one off-white W26-R16 adds, its own orange for
action, its own uppercase headings and its own photographs.
