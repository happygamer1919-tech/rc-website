#!/usr/bin/env node
/* Downloads ONE packshot, and refuses to download from a host R-W forbids.
   Card W25-02.

       node scripts/fetch-packshot.js <image-url> <source-page-url> <SLOT-ID> [--dir catalog]

   RESEARCH AND DOWNLOAD ARE SEPARATED ON PURPOSE. Finding a product's page is
   open-ended work and it was done by agents reading the web. Deciding whether a
   URL may be fetched is a rule, and a rule belongs in one place that cannot be
   talked round. So nothing that researched a URL ever fetched one: every
   candidate comes back here, and this is the only thing in the repo that reaches
   the network for an image.

   WHAT IT REFUSES:
     · a forbidden host, on EITHER the image URL or the source page URL, matched
       on the registrable domain so a subdomain cannot slip past (R-W, W25-R2);
     · dasterum.md WITHOUT --dasterum: W25-R7 allows the direct supplier, and
       the run has to say so, or a Dasterum URL could arrive by accident in a run
       meant for a manufacturer;
     · fatade3d.md WITHOUT --fatade3d: W25-R14 extends direct_supplier to that
       host on the same four conditions, and the same explicit flag, for PRODUCT
       IMAGES ONLY;
     · imperlux.md WITHOUT --imperlux-override AND a slot id inside the twelve
       W25-R15 names: that ruling is an owner override over a competitor host, not
       an approved origin, and it is held to its twelve slots rather than to the
       host, so a thirteenth id is refused even with the flag;
     · a host that looks like a shop or a marketplace, by a list of the patterns
       that actually turn up (amazon, ebay, emag, olx, 999.md, aliexpress, ...),
       because "never a retailer" is a rule and an unenforced rule is a comment;
     · a redirect that lands on a forbidden or shop host, which is how a tidy
       manufacturer URL becomes a marketplace one;
     · a response that is not an image by its BYTES, whatever the URL said;
     · anything over 12MB, which is not a packshot.

   WHAT IT CANNOT SEE, stated plainly because R-W's amendment says to state it:
   a watermark, a retailer logo, a person's face and another seller's branding are
   properties of the picture. No check here sees them. They are checked by a
   person looking at the downloaded file before it is committed, and this prints a
   reminder saying so on every successful fetch.

   It writes to a staging directory, NOT into public/. Nothing enters the repo
   until process-packshot.js has re-encoded it and a person has looked at it.

   Zero dependencies: node's own https. */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const STAGE = path.join(require('os').tmpdir(), 'rc-packshot-stage');
const MAX_BYTES = 12 * 1024 * 1024;

const die = (msg) => { console.error(`REFUSED: ${msg}`); process.exit(1); };

/* R-W and W25-R2. Matched on the registrable domain, so cdn.fatade3d.md and
   www.fatade3d.md are the same refusal.

   AMENDED (W25-R7): **dasterum.md is no longer forbidden, and only dasterum.md.**
   The owner states the client buys directly from Dasterum and accepts the use of
   their product data, public prices and product images, on conditions that are
   part of the permission rather than advice: the watermark stays exactly as
   published, never cropped out and never painted over; nothing is upscaled; the
   450 floor holds; and the ledger records the source URL per file. The first
   three are enforced by `--dasterum` below and by process-packshot.js; the
   fourth is enforced by gate 19 over the whole ledger.

   `fatade3d.md` and `imperlux.md` are untouched and stay forbidden. */
/* AMENDED (W25-R14): fatade3d.md joins dasterum.md as a direct supplier, on the
   same four conditions, for PRODUCT IMAGES ONLY. AMENDED (W25-R15): imperlux.md
   is not lifted. It stays forbidden and is overridden for exactly twelve slot
   ids, which is a different thing and is written differently below. */
const FORBIDDEN = ['imperlux.md'];
const DIRECT_SUPPLIERS = {
  'dasterum.md': '--dasterum',
  'fatade3d.md': '--fatade3d',
};

/* W25-R15. An OWNER OVERRIDE, not an approved origin, and the difference is the
   whole reason this is a separate mechanism: the permission is attached to the
   twelve slots the owner named, never to the host. A thirteenth id is refused
   with the flag set, which is what "nothing else from imperlux.md, ever" means in
   a form a machine can hold.

   STRATEGY RISK, recorded where the code is: the origin is a direct competitor
   and the site is served from GitHub Pages, so a complaint reaches a host that
   can remove the whole site rather than one file. The owner has read that and
   decided. */
const OVERRIDE_HOST = 'imperlux.md';
const OVERRIDE_FLAG = '--imperlux-override';
/* AMENDED (W26-11): the same list gate 19 holds. It had stayed at W25-R15's twelve
   through W26-R3, so this tool refused slots the gate permitted. W26-R10 adds the
   rest of the roofing page. */
const OVERRIDE_SLOTS = [
  'GARD-01', 'GARD-02', 'GARD-03', 'GARD-04', 'GARD-05', 'GARD-06', 'GARD-07', 'GARD-08',
  'GARDB-01', 'GARDB-02', 'GARDB-03', 'GARDB-04',
  'ACOP-01', 'ACOP-02', 'ACOP-03', 'ACOP-04', 'ACOP-05', 'ACOP-06', 'ACOP-07',
  'ACIM-01', 'ACIM-02', 'ACIM-03', 'ACIM-04', 'ACIM-05', 'ACIM-06', 'ACIM-07', 'ACIM-08', 'ACIM-09',
  /* AMENDED (W27-R-04, W27-C-03): imperlux.md is the source of record for everything under
     Acoperisuri and Garduri, so the list grows by name to every product slot those pages
     render: the seven metal tile models, the four Novatik models, and the ninth hub tile. */
  'ACIM-10', 'ACIM-11', 'ACIM-12', 'ACIM-13', 'ACIM-14', 'ACIM-15', 'ACIM-16', 'NVK-01', 'NVK-02', 'NVK-03', 'NVK-04',
  'ACOP-09',
];

/* "Never a retailer, a marketplace, another reseller, a search result thumbnail."
   These are the hosts that actually come back when you search for a building
   product in this region, plus the global marketplaces. It is not exhaustive and
   does not pretend to be: it is the enforceable part of a rule whose other half
   is a person looking at the page. */
const SHOPS = [
  'amazon.', 'ebay.', 'aliexpress.', 'alibaba.', 'emag.ro', 'emag.bg', 'olx.',
  '999.md', 'makler.md', 'darwin.md', 'enter.online', 'bomba.md',
  'leroymerlin.', 'obi.', 'hornbach.', 'dedeman.ro', 'brico', 'praktiker.',
  'allegro.', 'rozetka.', 'prom.ua', 'epicentrk.ua', 'wildberries.', 'ozon.',
  'google.com/imgres', 'gstatic.com', 'bing.com', 'pinterest.',
  'shop.', '/shop/', 'magazin', 'market.',
];

/* W25-R20. The fallback origin: when the site a product's data came from
   publishes nothing at the 450 floor, the picture may come from ANY site except a
   Russian domain, found by search, with the source URL logged and the row flagged
   `google_pick` for the owner's own pass.

   `--google-pick` is what a run says to use it, and it does exactly two things:
   it lifts the SHOPS refusal, because a search for a building product in this
   region returns retailers almost exclusively and a rule that still refused them
   would have left the fallback unusable; and it adds the Russian-domain refusal,
   which is answer set 1's Q-W25-03 closure and is the only exception the owner
   names.

   IT LIFTS NOTHING ELSE. The three competitor hosts keep their own treatment, an
   image is still an image by its bytes, and the half no host rule ever covered is
   untouched: a watermark, a retailer's logo and a person's face are properties of
   the PICTURE, no check here sees them, and a person looks at every file before it
   is committed. */
const GOOGLE_PICK = process.argv.includes('--google-pick');
const RU_TLD = /(^|\.)(ru|su|рф)$/i;

const host = (u) => { try { return new URL(u).hostname.toLowerCase(); } catch { return null; } };
const registrable = (h) => h.split('.').slice(-2).join('.');

/* W25-R7 and W25-R14. A direct supplier is allowed, and it is allowed EXPLICITLY:
   the caller has to name the host's own flag, so a supplier URL cannot arrive by
   accident in a run that was meant for a manufacturer. Without the flag the host
   is refused, and the refusal names the flag that would allow it. */
const matches = (h, d) => h === d || h.endsWith('.' + d) || registrable(h) === d;

function guard(u, what) {
  const h = host(u);
  if (!h) die(`${what} is not a URL: ${u}`);
  for (const [supplier, flagName] of Object.entries(DIRECT_SUPPLIERS)) {
    if (!matches(h, supplier)) continue;
    if (!process.argv.includes(flagName)) {
      die(`${what} is on ${supplier}. ${supplier === 'dasterum.md' ? 'W25-R7' : 'W25-R14'} allows it as a direct supplier, but only when the run says so: pass ${flagName}. ${u}`);
    }
    return h;
  }
  /* W25-R15. The override is checked against the SLOT, not only against the flag.
     An id outside the twelve is refused with the flag set, which is the only form
     "nothing else from imperlux.md, ever" can take in code. */
  if (matches(h, OVERRIDE_HOST)) {
    if (!process.argv.includes(OVERRIDE_FLAG)) {
      die(`${what} is on ${OVERRIDE_HOST}, which R-W and W25-R2 forbid. W25-R15 overrides that for the twelve Garduri slots only, and the run has to say so: pass ${OVERRIDE_FLAG}. ${u}`);
    }
    if (!OVERRIDE_SLOTS.includes(SLOT)) {
      die(`${what} is on ${OVERRIDE_HOST} and the slot is "${SLOT}", which is not one of the twelve W25-R15 names (${OVERRIDE_SLOTS.join(', ')}). The override is held to those slots, never to the host: nothing else from ${OVERRIDE_HOST}, ever. ${u}`);
    }
    return h;
  }
  for (const f of FORBIDDEN) {
    if (matches(h, f)) {
      die(`${what} is on ${f}, which R-W and W25-R2 forbid as an origin. ${u}`);
    }
  }
  /* W25-R20's one exception, and it applies whether or not the flag is set. */
  if (RU_TLD.test(h)) {
    die(`${what} is on a Russian domain (${h}). Answer set 1 closed Q-W25-03 on that and W25-R20 restates it as the fallback's only exception. ${u}`);
  }
  const low = u.toLowerCase();
  for (const s of SHOPS) {
    if (h.includes(s.replace(/[/]/g, '')) || low.includes(s)) {
      if (GOOGLE_PICK) continue;
      die(`${what} looks like a retailer or marketplace (matched "${s}"). W25-R2: never an origin. W25-R20 permits one as the fallback when the run says so: pass --google-pick, and the row is flagged for the owner's review. ${u}`);
    }
  }
  return h;
}

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (args.length < 3) die('usage: node scripts/fetch-packshot.js <image-url> <source-page-url> <SLOT-ID> [--dir catalog]');
const [IMG, PAGE, SLOT] = args;
const di = process.argv.indexOf('--dir');
const DIR = di > -1 && process.argv[di + 1] ? process.argv[di + 1] : 'catalog';
if (!/^[A-Z0-9-]+$/.test(SLOT)) die(`"${SLOT}" is not a slot id.`);

const imgHost = guard(IMG, 'the image URL');
const pageHost = guard(PAGE, 'the source page URL');

function get(url, depth = 0) {
  return new Promise((resolve, reject) => {
    if (depth > 5) return reject(new Error('too many redirects'));
    guard(url, `redirect ${depth}`);
    const mod = url.startsWith('http:') ? http : https;
    const req = mod.get(url, {
      headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36', accept: 'image/*,*/*' },
      timeout: 30000,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(get(new URL(res.headers.location, url).toString(), depth + 1));
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
      const chunks = [];
      let n = 0;
      res.on('data', (c) => {
        n += c.length;
        if (n > MAX_BYTES) { req.destroy(); return reject(new Error(`over ${MAX_BYTES} bytes, which is not a packshot`)); }
        chunks.push(c);
      });
      res.on('end', () => resolve({ body: Buffer.concat(chunks), type: res.headers['content-type'] || '', url }));
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('timed out')); });
    req.on('error', reject);
  });
}

(async () => {
  let r;
  try { r = await get(IMG); } catch (e) { die(`could not fetch ${IMG}: ${e.message}`); }

  /* An image by its bytes. A "packshot URL" that answers with an HTML error page
     or a tracking pixel is caught here and not three steps later. */
  const b = r.body;
  const magic =
    (b[0] === 0xff && b[1] === 0xd8) ? 'jpeg'
    : b.subarray(0, 8).toString('hex') === '89504e470d0a1a0a' ? 'png'
    : (b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') ? 'webp'
    : b.subarray(4, 8).toString() === 'ftyp' ? 'heic'
    : (b.subarray(0, 5).toString() === '<?xml' || b.subarray(0, 4).toString() === '<svg') ? 'svg'
    : null;
  if (!magic) die(`${IMG} answered ${b.length} bytes that are not an image (content-type said "${r.type}"). An HTML error page reads exactly like this.`);
  if (magic === 'svg') die(`${IMG} is an SVG. A packshot is a photograph; an SVG here is usually a logo or a placeholder.`);

  fs.mkdirSync(STAGE, { recursive: true });
  const ext = magic === 'jpeg' ? 'jpg' : magic;
  const out = path.join(STAGE, `${SLOT}.${ext}`);
  fs.writeFileSync(out, b);

  console.log(JSON.stringify({
    slot: SLOT, ok: true, file: out, bytes: b.length, format: magic,
    image_url: r.url, requested_url: IMG, source_page_url: PAGE,
    image_host: imgHost, page_host: pageHost, dir: DIR,
  }));
  console.error(`  staged ${SLOT}: ${magic} ${(b.length / 1024).toFixed(0)}KB from ${imgHost}`);
  console.error(`  A PERSON MUST LOOK AT THIS FILE: no check here sees a watermark, a retailer logo, a face or another seller's branding.`);
})();
