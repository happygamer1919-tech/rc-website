# rc-website

Static marketing site for Rapid Construct MD (Chișinău). Plain HTML and CSS,
no framework, no CMS, no database, no animation library.

## Layout

    docs/       RC-WEBSITE-MASTER-PLAN.md (spec) and RC-PHOTO-MANIFEST.md (slots)
    design/     approved Claude Design output, reference only, untouched
    src/        template.html, styles.css, main.js
    locales/    ro.json (default) and ru.json
    public/     logos, favicons, img/ placeholders
    scripts/    gen-placeholders.js
    build.js    template + locales -> dist/
    dist/       build output, not committed

## Build

    node scripts/gen-placeholders.js    # regenerate /public/img placeholders
    node build.js                       # writes dist/index.html and dist/ru/index.html

`build.js` fails loudly if ro.json and ru.json key sets differ, or if any
`{{ }}` placeholder survives into the output.

## Photos

Every image slot ships as a generated placeholder JPG at the manifest's pixel
size. Dropping a real photo in is a one-file overwrite at
`public/img/<slot-id>.jpg` with zero code changes.
