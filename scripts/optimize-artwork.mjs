// Build-time optimization for self-hosted artwork (runs as a `prebuild` step).
//
// Self-hosted uploads can be many MB; this resizes oversized images and
// recompresses them in place (keeping the same format) so the gallery stays
// light. It's deliberately defensive: if sharp is unavailable or any single
// file fails, it logs and moves on rather than breaking the build. Already-light
// images are left untouched, so re-runs are cheap and idempotent.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('[optimize-artwork] sharp unavailable; skipping image optimization');
  process.exit(0);
}

const DIR = new URL('../public/artwork/', import.meta.url);
const MAX_WIDTH = 1400; // ample for a ~700px column at 2x device pixels
const QUALITY = 80;

const mb = (n) => `${(n / 1e6).toFixed(2)}MB`;

let names = [];
try {
  names = await readdir(DIR);
} catch {
  process.exit(0); // no artwork directory yet
}

let saved = 0;
for (const name of names) {
  if (!/\.(jpe?g|png|webp)$/i.test(name)) continue;
  const url = new URL(name, DIR);
  try {
    const input = await readFile(url);
    const img = sharp(input, { failOn: 'none' });
    const { width = 0 } = await img.metadata();
    // Only ever touch oversized images. Once one is resized to <= MAX_WIDTH it's
    // skipped on every future run, so repeated builds never re-compress (and so
    // never generationally degrade) an image.
    if (width <= MAX_WIDTH) continue;

    let pipe = img.rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true });

    const ext = extname(name).toLowerCase();
    if (ext === '.png') pipe = pipe.png({ compressionLevel: 9, palette: true, quality: QUALITY, dither: 1 });
    else if (ext === '.webp') pipe = pipe.webp({ quality: QUALITY });
    else pipe = pipe.jpeg({ quality: QUALITY, mozjpeg: true });

    const output = await pipe.toBuffer();
    if (output.byteLength < input.byteLength) {
      await writeFile(url, output);
      console.log(`[optimize-artwork] ${name}: ${mb(input.byteLength)} -> ${mb(output.byteLength)}`);
      saved += input.byteLength - output.byteLength;
    }
  } catch (err) {
    console.warn(`[optimize-artwork] skip ${name}: ${err.message}`);
  }
}
if (saved) console.log(`[optimize-artwork] saved ${mb(saved)} total`);
