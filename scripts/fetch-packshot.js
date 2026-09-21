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

/* R-W and W25-R2, unchanged. Matched on the registrable domain, so
   cdn.fatade3d.md and www.fatade3d.md are the same refusal. */
const FORBIDDEN = ['fatade3d.md', 'imperlux.md', 'dasterum.md'];

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

const host = (u) => { try { return new URL(u).hostname.toLowerCase(); } catch { return null; } };
const registrable = (h) => h.split('.').slice(-2).join('.');

function guard(u, what) {
  const h = host(u);
  if (!h) die(`${what} is not a URL: ${u}`);
  for (const f of FORBIDDEN) {
    if (h === f || h.endsWith('.' + f) || registrable(h) === f) {
      die(`${what} is on ${f}, which R-W and W25-R2 forbid as an origin. ${u}`);
    }
  }
  const low = u.toLowerCase();
  for (const s of SHOPS) {
    if (h.includes(s.replace(/[/]/g, '')) || low.includes(s)) {
      die(`${what} looks like a retailer or marketplace (matched "${s}"). W25-R2: never an origin. ${u}`);
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
