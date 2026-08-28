# photos-raw

Drop raw photos here named by slot ID, then run:

    node scripts/process-photos.js && node build.js

Any size, any dimensions. The script centre-crops to the slot's ratio, writes a
1x and a 2x into `public/img/`, compresses each under 400KB, and tells you which
slots are still on placeholders.

Filenames must match a slot ID exactly, lowercase, any common image extension:

    svc-acoperisuri.jpg   port-03.jpg   step-01-fundatie.png

Anything that does not match a slot ID is ignored and listed as unrecognised.
Slot IDs are in `docs/RC-PHOTO-MANIFEST.md` and `scripts/slots.js`.

Files in this directory are not committed. The processed output in
`public/img/` is what ships.
