#!/usr/bin/env node
/* Scarcity gate, ruling R-X (docs/rulings/R-X.md).

   Asserts zero countdown timers, zero stock-scarcity strings and zero
   instalment or financing strings across both locales, plus no struck-through
   price markup. AMENDED (W28-11, wave 28): and zero discount claims, which R-X's
   first recorded interpretation had left standing (the promo bar's "Reducere 10%
   ... 2027" and "−10% la programări anticipate"); the owner's wave 28 instruction
   removes every discount, percent-off, until-year and early-booking string, and
   the amendment block in docs/rulings/R-X.md records it. It reads:

     - every string in locales/ro.json and locales/ru.json
     - every built page in dist/, RO and RU, as raw HTML (so meta, og and
       JSON-LD text are covered, not only visible copy)
     - the source templates, build.js and src/main.js, for countdown machinery

   Per docs/CLAUDE.md section 13 it asserts that it saw what it needs before it
   concludes anything: both locale files parse to strings, dist/ holds at least
   one page per locale, and every pattern passes its own self-test (it must
   match its positive samples and must not match the clean samples, which are
   phrases already on the site). A run that saw nothing fails.

   Usage:  node build.js && node scripts/check-scarcity.js
   No dependencies. */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const fail = (msg) => { console.error(`\nSCARCITY CHECK FAILED: ${msg}\n`); process.exit(1); };

/* Letter-aware word edges. \b is ASCII-only in JS regex and would split
   "rată" at the ă, so every pattern is wrapped in these instead. */
const L = '\\p{L}';
const word = (body) => new RegExp(`(?<![${L}])(?:${body})(?![${L}])`, 'iu');

const PATTERNS = [
  // instalment and financing
  { id: 'ro-rate', kind: 'instalment', re: word('rat[ăae]|în rate'), yes: ['Rate 0% la acoperiș', 'plata în rate', 'o rată lunară'] },
  { id: 'ro-credit', kind: 'financing', re: word('credit(?:e|ul|are|ării)?|credităm'), yes: ['cumpără pe credit', 'creditare rapidă'] },
  { id: 'ro-finantare', kind: 'financing', re: word('finanț[a-zăâîșț]*|finant[a-z]*'), yes: ['finanțare disponibilă', 'finantare'] },
  { id: 'ro-leasing', kind: 'financing', re: word('leasing(?:ul)?'), yes: ['în leasing'] },
  { id: 'ro-dobanda', kind: 'financing', re: word('dob[âa]nd[ăae]|fără dobândă'), yes: ['fără dobândă'] },
  { id: 'ro-esalonat', kind: 'instalment', re: word('eșalonat[ăe]?|esalonat[ae]?|eșalonare'), yes: ['plată eșalonată'] },
  { id: 'ru-rassrochka', kind: 'instalment', re: word('рассрочк[а-я]*'), yes: ['Рассрочка 0% на кровлю', 'в рассрочку'] },
  { id: 'ru-kredit', kind: 'financing', re: word('кредит[а-я]*'), yes: ['в кредит', 'кредитование'] },
  { id: 'ru-finans', kind: 'financing', re: word('финансировани[а-я]*'), yes: ['финансирование'] },
  { id: 'ru-lizing', kind: 'financing', re: word('лизинг[а-я]*'), yes: ['в лизинг'] },
  { id: 'ru-bezprocent', kind: 'instalment', re: word('беспроцентн[а-я]*'), yes: ['беспроцентная'] },
  // stock scarcity
  { id: 'ro-stoc', kind: 'scarcity', re: word('stoc(?:uri|ul)? limitat[e]?|cantitat(?:e|ea) limitată|locuri limitate|ultimele (?:bucăți|locuri|unități)|ofert[ăa] limitată|se epuizează'), yes: ['stoc limitat', 'Ultimele locuri', 'ofertă limitată'] },
  { id: 'ro-ramase', kind: 'scarcity', re: word('(?:doar|numai|mai sunt) \\d+ (?:bucăți|locuri|unități)'), yes: ['mai sunt 3 locuri'] },
  { id: 'ru-ogranich', kind: 'scarcity', re: word('ограниченн[а-я]* (?:количеств[а-я]*|предложени[а-я]*|парти[а-я]*)|количество ограничено|последни[еихй] (?:штук[а-я]*|мест[а-я]*|экземпляр[а-я]*)|товар заканчивается'), yes: ['ограниченное количество', 'последние места'] },
  { id: 'ru-ostalos', kind: 'scarcity', re: word('осталось (?:всего |только )?(?:мало|\\d+)'), yes: ['осталось 3 места', 'осталось мало'] },
  // countdown
  { id: 'ro-countdown', kind: 'countdown', re: word('expiră în|timp rămas|numărătoare inversă|doar (?:azi|astăzi)|mai sunt \\d+ (?:zile|ore|minute)'), yes: ['Oferta expiră în 2 zile', 'doar azi'] },
  { id: 'ru-countdown', kind: 'countdown', re: word('до конца акции|обратный отсч[её]т|только сегодня|акция заканчивается|осталось \\d+ (?:дн|час|мин)[а-я]*'), yes: ['До конца акции', 'осталось 2 дня'] },
  { id: 'code-countdown', kind: 'countdown', re: /count-?down|data-(?:deadline|expires|countdown)/i, yes: ['class="countdown"', 'data-deadline="2026"'] },
  // struck prices (R-X, from RC-110)
  { id: 'struck-markup', kind: 'struck price', re: /<(?:s|del|strike)(?:\s[^>]*)?>|line-through/i, yes: ['<del>200 lei</del>', 'text-decoration: line-through'] },
  // discount claims (R-X as amended by W28-11, wave 28: every discount, percent-off,
  // "until <year>" and early-booking string goes, both locales)
  { id: 'ro-reducere', kind: 'discount', scope: 'text', re: word('reducer[ei]|discount(?:uri)?'), yes: ['Reducere 10% la orice serviciu doar până în 2027', 'reduceri de sezon', 'o reducere de zece la sută', 'discount'] },
  { id: 'ro-anticipate', kind: 'discount', scope: 'text', re: word('program[ăa]r[a-zăâîșț]* anticipate'), yes: ['−10% la programări anticipate', 'la programările anticipate se aplică'] },
  { id: 'ro-pana-in-an', kind: 'discount', scope: 'text', re: word('(?:doar|numai) p[âa]n[ăa] [îi]n 20\\d\\d'), yes: ['doar până în 2027', 'numai pana in 2027'] },
  { id: 'ru-skidka', kind: 'discount', scope: 'text', re: word('скидк[а-я]*'), yes: ['Скидка 10% на любую услугу только до 2027 года', 'скидка десять процентов', 'Скидки'] },
  { id: 'ru-rannei', kind: 'discount', scope: 'text', re: word('при ранней записи'), yes: ['−10% при ранней записи'] },
  { id: 'ru-do-goda', kind: 'discount', scope: 'text', re: word('только до 20\\d\\d года'), yes: ['только до 2027 года'] },
  { id: 'percent-off', kind: 'discount', scope: 'text', re: /(?:[−-]\s?\d{1,2}\s?%)|(?:\d{1,2}\s?%\s*(?:la |pe |pentru |reducere|discount|на |скидк))/iu, yes: ['−10% la programări anticipate', '-10%', '10% la orice serviciu', '10% на любую услугу'] },
];

/* Phrases that must never match. Each is on the site, or is a near miss that a
   careless pattern would catch. */
const CLEAN = [
  'O singură echipă răspunde de tot proiectul, de la structură până la ultimul finisaj.',
  'Garanție 30 de ani în contract',
  'generate separate decorate',
  'credibil și acreditat',
  'Остались вопросы? Позвоните нам.',
  'timpul de execuție se stabilește în deviz',
  // W28-11: what a discount pattern must NOT catch: a product figure, a spec percentage,
  // a year in a warranty, the two permitted ask strings, and the reduction of noise.
  'de la 179.55 lei/m²',
  'Absorbție de apă 3%',
  'garanție până în 2040 nu se promite',
  'Preț la cerere',
  'Цена по запросу',
  'reducerea zgomotului',
  'Гарантия до 30 лет по договору',
];

let selfTested = 0;
for (const p of PATTERNS) {
  for (const s of p.yes) {
    if (!p.re.test(s)) fail(`self-test: pattern ${p.id} does not match its own sample "${s}"`);
    selfTested++;
  }
  for (const s of CLEAN) {
    if (p.re.test(s)) fail(`self-test: pattern ${p.id} matches the clean sample "${s}"`);
    selfTested++;
  }
}

/* --- inputs --------------------------------------------------------------- */
const flatten = (o, pre = '') => Object.entries(o).flatMap(([k, v]) =>
  v && typeof v === 'object' ? flatten(v, `${pre}${k}.`) : [[`${pre}${k}`, String(v)]]);

const sources = [];
for (const code of ['ro', 'ru']) {
  const file = `locales/${code}.json`;
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) fail(`${file} is missing`);
  const strings = flatten(JSON.parse(fs.readFileSync(abs, 'utf8')));
  if (strings.length === 0) fail(`${file} parsed to zero strings`);
  strings.forEach(([k, v]) => sources.push({ where: `${file} ${k}`, text: v, locale: code }));
}

const pages = [];
const dist = path.join(ROOT, 'dist');
if (!fs.existsSync(dist)) fail('no dist/, run: node build.js');
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) pages.push(p);
  }
})(dist);
const rel = (p) => path.relative(ROOT, p);
const ruPages = pages.filter((p) => rel(p).startsWith('dist/ru/'));
const roPages = pages.filter((p) => !rel(p).startsWith('dist/ru/'));
for (const must of ['dist/index.html', 'dist/ru/index.html']) {
  if (!fs.existsSync(path.join(ROOT, must))) fail(`${must} is missing, so a locale was not built`);
}
if (roPages.length === 0 || ruPages.length === 0) fail(`dist/ holds ${roPages.length} RO and ${ruPages.length} RU pages; both must be non-zero`);
pages.forEach((p) => sources.push({ where: rel(p), text: fs.readFileSync(p, 'utf8'), locale: rel(p).startsWith('dist/ru/') ? 'ru' : 'ro' }));

const CODE = ['src/main.js', 'src/template.html', 'src/service.html', 'src/product.html', 'src/category.html', 'src/moved.html', 'src/catalog-index.html', 'src/in-constructie.html', 'src/privacy.html', 'src/404.html', 'src/styles.css', 'build.js'];

/* RC-135 (W17-04). Every template in src/ is in the list above, asserted by
   count. src/product.html sat outside it from W14-16 until this card, reported at
   W16-02, so a template added later fails here until it is registered rather
   than going unscanned in silence. */
const srcTemplates = fs.readdirSync(path.join(ROOT, 'src')).filter((f) => f.endsWith('.html')).map((f) => `src/${f}`).sort();
const listedTemplates = CODE.filter((f) => /^src\/[^/]+\.html$/.test(f)).sort();
if (srcTemplates.length === 0) fail('src/ holds zero .html templates, so the template count proves nothing');
if (listedTemplates.length !== srcTemplates.length) {
  const unlisted = srcTemplates.filter((f) => !listedTemplates.includes(f));
  fail(`templates scanned: ${listedTemplates.length}, templates in src/: ${srcTemplates.length}; not in CODE: ${unlisted.join(', ') || '(none)'}`);
}
for (const f of CODE) {
  const abs = path.join(ROOT, f);
  if (!fs.existsSync(abs)) fail(`${f} is missing from the code scan list`);
  sources.push({ where: f, text: fs.readFileSync(abs, 'utf8'), locale: 'code' });
}

/* --- scan ----------------------------------------------------------------- */
const hits = [];
for (const s of sources) {
  for (const p of PATTERNS) {
    /* W28-11: the discount arms read the locales and the built pages, which is where a
       claim can reach a visitor, and not the code files: a stylesheet's translateX(-50%)
       and a build.js comment that names the retired string are not claims. The countdown
       and struck-price arms keep reading the code, as they always have. */
    if (p.scope === 'text' && s.locale === 'code') continue;
    const g = new RegExp(p.re.source, p.re.flags.includes('g') ? p.re.flags : p.re.flags + 'g');
    for (const m of s.text.matchAll(g)) {
      const at = Math.max(0, m.index - 40);
      hits.push(`${s.where}  [${p.kind}, ${p.id}]  ...${s.text.slice(at, m.index + m[0].length + 40).replace(/\s+/g, ' ')}...`);
    }
  }
}

const count = (loc) => sources.filter((s) => s.locale === loc).length;
console.log(`patterns: ${PATTERNS.length}   self-test assertions: ${selfTested}`);
console.log(`scanned: ${count('ro')} RO sources (${roPages.length} pages), ${count('ru')} RU sources (${ruPages.length} pages), ${count('code')} code files`);
console.log(`templates scanned: ${listedTemplates.length} of ${srcTemplates.length} in src/ (${listedTemplates.join(', ')})`);
if (hits.length) {
  console.error(`\n${hits.length} R-X violation(s):`);
  hits.forEach((h) => console.error('  ' + h));
  process.exit(1);
}
console.log('zero countdowns, zero stock-scarcity strings, zero instalment or financing strings, zero struck prices, zero discount claims (W28-11).');
