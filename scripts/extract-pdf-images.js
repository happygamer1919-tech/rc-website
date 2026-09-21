#!/usr/bin/env node
/* Extract embedded JPEG image streams from a PDF, with no dependency.
   Card W25-14.

       node scripts/extract-pdf-images.js <file.pdf> [out-dir]

   WHY IT EXISTS. W25-14's dispatch rules that "an image extracted from an
   official PDF counts as manufacturer origin, record the PDF URL". That is a
   real origin only if the extraction takes the manufacturer's own bytes and does
   nothing else to them, so this lifts the stream verbatim: no re-encode, no
   resize, no crop. The floor and the no-upscaling rule then apply to what comes
   out, exactly as they do to a download.

   WHAT IT DOES NOT DO. It reads DCTDecode streams only, which is the JPEG case.
   A PDF whose images are FlateDecode bitmaps or vector art yields nothing and
   says so, rather than producing something that is not in the file. Four
   manufacturers' datasheets were read with it on W25-14 and the measured result
   was that none of them carries a packshot at or above the floor.
   A PDF image XObject with /Filter /DCTDecode holds a complete JPEG between
   `stream` and `endstream`, so the bytes can be lifted out verbatim: nothing is
   re-encoded, resized or invented, which is what "extracted from an official
   PDF" has to mean if the origin claim is to hold. */
const fs = require('fs');
const src = process.argv[2], outDir = process.argv[3] || '.';
const b = fs.readFileSync(src);
let n = 0;
const S = Buffer.from('stream'), E = Buffer.from('endstream');
let i = 0;
while (true) {
  const s = b.indexOf(S, i);
  if (s < 0) break;
  let start = s + S.length;
  if (b[start] === 0x0d) start++;
  if (b[start] === 0x0a) start++;
  const e = b.indexOf(E, start);
  if (e < 0) break;
  const data = b.subarray(start, e);
  if (data.length > 800 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
    const f = `${outDir}/${require('path').basename(src, '.pdf')}-${++n}.jpg`;
    fs.writeFileSync(f, data);
    console.log(`${f} ${data.length}`);
  }
  i = e + E.length;
}
if (!n) console.log('no DCTDecode (JPEG) image streams found');
