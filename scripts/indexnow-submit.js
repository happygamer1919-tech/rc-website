#!/usr/bin/env node
/* IndexNow submit, card SEO-01.

   Tells Bing, Yandex, Seznam and Naver that every page in the LIVE sitemap
   exists or changed, so they crawl it now instead of whenever they find it.
   Bing's index is what ChatGPT search and Copilot answer from, and Yandex is
   read by the Russian-speaking half of the audience, so this is the cheapest
   lever the site has on both search and answer engines.

   The key is public by design: the protocol proves ownership by the key file
   served at the site root, public/<key>.txt, which build.js copies to dist.
   NO DEPENDENCY: Node's own fetch.

   Run it AFTER a deploy has propagated (section 12.0), never before: IndexNow
   fetches the key file from the live host, and a key that is not live yet is
   a 403.

     node scripts/indexnow-submit.js                 # rapidconstruct.md
     node scripts/indexnow-submit.js --dry-run       # print, send nothing

   It fails, never passes vacuously, on zero URLs, a missing key file, a key
   file the live host does not serve, or any non-2xx answer. */
'use strict';
const fs = require('fs');

const ORIGIN = 'https://rapidconstruct.md';
const HOST = new URL(ORIGIN).host;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const DRY = process.argv.includes('--dry-run');

const fail = (msg) => { console.error(`FAIL: ${msg}`); process.exit(1); };

(async () => {
  const keys = fs.readdirSync('public').filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  if (keys.length !== 1) fail(`expected exactly one public/<32 hex>.txt key file, found ${keys.length}`);
  const key = keys[0].slice(0, -4);
  if (fs.readFileSync(`public/${keys[0]}`, 'utf8').trim() !== key) fail('the key file does not contain its own name');

  const keyLocation = `${ORIGIN}/${key}.txt`;
  const live = await fetch(keyLocation);
  if (!live.ok || (await live.text()).trim() !== key) fail(`${keyLocation} is not live with the key (HTTP ${live.status}); deploy first`);

  const sm = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!sm.ok) fail(`sitemap HTTP ${sm.status}`);
  const urlList = [...(await sm.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  if (urlList.length === 0) fail('zero URLs in the live sitemap');
  if (urlList.some((u) => new URL(u).host !== HOST)) fail(`a sitemap URL is not on ${HOST}`);

  console.log(`${urlList.length} URLs from ${ORIGIN}/sitemap.xml, key ${keyLocation}`);
  if (DRY) { console.log('dry run: nothing sent'); return; }

  // The protocol takes up to 10,000 URLs per request; the site has a few hundred.
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
  });
  const body = (await res.text()).slice(0, 300);
  if (res.status < 200 || res.status > 299) fail(`IndexNow answered HTTP ${res.status} ${body}`);
  console.log(`OK: IndexNow answered HTTP ${res.status} (200 accepted, 202 accepted pending key check)`);
})().catch((e) => fail(e.stack || String(e)));
