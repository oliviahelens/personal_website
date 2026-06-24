// Build-time optimization for self-hosted artwork (runs as a `prebuild` step).
//
// Self-hosted uploads can be many MB (or even TIFF, which browsers can't show);
// this resizes oversized images, recompresses them, and converts TIFF to JPEG so
// the gallery stays light and web-displayable. A tiny size cache makes it
// idempotent: each file is optimized at most once and then skipped on every
// later build, while a re-uploaded file (which changes size) is optimized afresh.
//
// Defensive by design: if sharp is unavailable or a single file fails, it logs
// and moves on rather than breaking the build.

import { readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { extname } from 'node:path';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('[optimize-artwork] sharp unavailable; skipping image optimization');
  process.exit(0);
}

const DIR = new URL('../public/artwork/', import.meta.url);
const CACHE = new URL('./.artwork-cache.json', import.meta.url);
const MAX_DIM = 1400; // longest edge; ample for a ~700px column at 2x
const QUALITY = 80;

const mb = (n) => `${(n / 1e6).toFixed(2)}MB`;

let cache = {};
try {
  cache = JSON.parse(await readFile(CACHE, 'utf8'));
} catch {
  /* first run */
}

let names = [];
try {
  names = await readdir(DIR);
} catch {
  process.exit(0); // no artwork directory yet
}

let saved = 0;
let dirty = false;
for (const name of names) {
  if (!/\.(jpe?g|png|webp|tiff?)$/i.test(name)) continue;
  const url = new URL(name, DIR);
  const input = await readFile(url);
  if (cache[name] === input.byteLength) continue; // already optimized, unchanged

  try {
    const img = sharp(input, { failOn: 'none' });
    const { width = 0, height = 0 } = await img.metadata();
    let pipe = img.rotate(); // bake in EXIF orientation
    if (Math.max(width, height) > MAX_DIM) {
      pipe = pipe.resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true });
    }

    const ext = extname(name).toLowerCase();
    const isTiff = ext === '.tiff' || ext === '.tif';
    if (ext === '.png') pipe = pipe.png({ compressionLevel: 9, palette: true, quality: QUALITY, dither: 1 });
    else if (ext === '.webp') pipe = pipe.webp({ quality: QUALITY });
    else pipe = pipe.jpeg({ quality: QUALITY, mozjpeg: true }); // jpg/jpeg and converted tiff

    const output = await pipe.toBuffer();

    if (isTiff) {
      // TIFF isn't web-displayable — write a .jpg sibling and drop the original.
      const jpg = name.replace(/\.tiff?$/i, '.jpg');
      await writeFile(new URL(jpg, DIR), output);
      await rm(url);
      console.log(`[optimize-artwork] ${name} -> ${jpg}: ${mb(input.byteLength)} -> ${mb(output.byteLength)}`);
      saved += Math.max(0, input.byteLength - output.byteLength);
      cache[jpg] = output.byteLength;
      delete cache[name];
      dirty = true;
    } else if (output.byteLength < input.byteLength) {
      await writeFile(url, output);
      console.log(`[optimize-artwork] ${name}: ${mb(input.byteLength)} -> ${mb(output.byteLength)}`);
      saved += input.byteLength - output.byteLength;
      cache[name] = output.byteLength;
      dirty = true;
    } else {
      cache[name] = input.byteLength; // no gain; record so we don't retry
      dirty = true;
    }
  } catch (err) {
    console.warn(`[optimize-artwork] skip ${name}: ${err.message}`);
  }
}

// Drop cache entries for files that no longer exist (re-read, since we may have
// just converted a TIFF to JPEG).
const current = await readdir(DIR).catch(() => names);
for (const key of Object.keys(cache)) {
  if (!current.includes(key)) {
    delete cache[key];
    dirty = true;
  }
}
if (dirty) await writeFile(CACHE, JSON.stringify(cache, null, 2) + '\n');
if (saved) console.log(`[optimize-artwork] saved ${mb(saved)} total`);
