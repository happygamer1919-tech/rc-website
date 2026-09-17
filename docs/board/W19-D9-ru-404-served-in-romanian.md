# W19-D9 · A broken Russian link shows the Romanian "Pagina nu există" page; the Russian 404 is built but never served

| | |
|---|---|
| Found by | Critic, wave 19 boundary, second pass, 2026-09-17 |
| Live build | `ff102c6`, `https://rapidconstruct.md` |
| Severity rank | 4 of 5 in this pass |
| Mode | Not assigned by the critic |

## What a visitor sees

A Russian-speaking visitor follows a mistyped or outdated link under `/ru/`, for
example `/ru/uslugi/`. The page they get is in Romanian: "Pagina nu există",
`lang="ro"`, and a "Înapoi la pagina principală" button that takes them to the
**Romanian** homepage `/`.

A translated page exists at `/ru/404.html`: "Страница не найдена", with a button
back to `/ru/`. No visitor is ever shown it unless they type that address.

## Why it happens

GitHub Pages answers every unknown path on the origin with the one file at the
root, `/404.html`. `build.js` knows this. Its comment beside the page list reads "404
goes to the site root as well as /ru/, because a static host serves one 404 for the
whole origin". It writes `dist/ru/404.html` anyway, and nothing sends Russian paths
to it. The Apache fallback that `build.js` writes to `dist/.htaccess` names only
`/404.html` as well.

## Evidence, measured on the live site

Cache-busted, redirects not followed, then rendered in headless Chrome at 390 and
1280:

| URL requested | HTTP status | Bytes | `html lang` | Visible h1 | Home button goes to |
|---|---|---|---|---|---|
| `/ru/uslugi/` | 404 | 4324 | `ro` | Pagina nu există | `/` |
| `/ru/servicii/fatade-vechi/` | 404 | 4324 | `ro` | Pagina nu există | `/` |
| `/ru/nu-exista/` | 404 | 4324 | `ro` | Pagina nu există | `/` |
| `/servicii/nu-exista/` (RO, for comparison) | 404 | 4324 | `ro` | Pagina nu există | `/` |
| `/ru/404.html`, requested directly | 200 | 4706 | `ru` | Страница не найдена | `/ru/` |

4324 bytes is the size of the root `/404.html`, and 4706 the size of
`/ru/404.html`, as recorded in `docs/audits/wave-19-readiness.md` section 1.

## Scope

Every unknown path under `/ru/`, on the GitHub Pages host, and on the Apache host
if that deploy path is still used.

## Fix direction, non-binding

A static host cannot choose a 404 by directory, so the choice has to happen in the
page. There are two plausible shapes.
- **(a)** The root `404.html` carries both languages' strings and shows the Russian
  ones, with `lang="ru"`, when the path starts with `/ru/`. The broken address
  stays in the address bar.
- **(b)** The root `404.html` replaces the location with `/ru/404.html` for those
  paths. This is simpler, but the address bar loses the broken URL, and the visitor
  lands on a page that answers 200.

Either way, the broken URL's own HTTP status stays 404, and both pages stay
`noindex`. For Apache, `ErrorDocument` can be set for `/ru/` separately.

## Acceptance, machine-checkable

1. **A local server that behaves like GitHub Pages**: a missing path returns the
   bytes of `dist/404.html` with status 404. Headless Chrome, JavaScript on, at 390
   (`mobile: true`) and 1280:
   - `/ru/nu-exista/`, `/ru/servicii/nu-exista/`, `/ru/a/b/c/`: once the page has
     settled, the visible `h1` text equals the `h1` of `dist/ru/404.html`,
     `document.documentElement.lang === 'ru'`, and the primary button's `href` is
     `/ru/`;
   - `/nu-exista/`, `/servicii/nu-exista/`, `/rus/`, `/ruta/`: the `h1` equals that
     of `dist/404.html`, `lang` is `ro`, and the button's `href` is `/`. A path that
     merely starts with the letters "ru" is not Russian;
   - print the 14 combinations read, and fail if fewer.
2. **Status and indexing.** The server's first response for every URL in check 1 is
   404, with no redirect followed. The page the visitor ends on carries
   `<meta name="robots" content="noindex">`.
3. **Watched failing first.** Check 1 on the current `main` build fails on the 3 RU
   paths at both widths, 6 combinations, each showing the Romanian `h1`, and passes
   on the 4 RO paths.
4. **After deploy**, on the live site with a cache-buster (R-P):
   `https://rapidconstruct.md/ru/nu-exista-<timestamp>/` answers 404 and renders the
   Russian `h1`.
5. All `quality` gates exit 0, each read from its own process. Both 404 pages are
   in the matrix of `node scripts/check-header-fit.js`, so a change to the 404
   template must keep it green.
