#!/usr/bin/env node
/**
 * gen-hero-photos.mjs · optimiza las fotos oficiales descargadas de Tripadvisor.
 *
 * Entrada: public/oficial/*.jpg (originales 1100×1100, 130-300 KB)
 * Salida:  public/oficial/*.webp + *.avif (más ligeros, mejor calidad)
 *
 * Re-correr cuando lleguen fotos nuevas:
 *    npm run hero-photos
 */
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', 'public', 'oficial');

const files = (await readdir(DIR)).filter((f) => f.endsWith('.jpg'));

console.log(`Optimizando ${files.length} fotos oficiales (Lanczos3 · WebP q85 · AVIF q70)…\n`);

for (const file of files) {
  const src = join(DIR, file);
  const name = basename(file, extname(file));

  // No reescala (cover natural a 1100×1100), solo recomprime con mejor codec.
  const webp = await sharp(src)
    .webp({ quality: 85, effort: 6, smartSubsample: true })
    .toFile(join(DIR, `${name}.webp`));

  const avif = await sharp(src)
    .avif({ quality: 70, effort: 6 })
    .toFile(join(DIR, `${name}.avif`));

  const origKb = (await stat(src)).size / 1024;
  const k = (n) => `${(n / 1024).toFixed(1)} KB`;
  console.log(
    `✓ ${name}: JPG ${origKb.toFixed(1)} KB → WebP ${k(webp.size)} (-${Math.round((1 - webp.size / 1024 / origKb) * 100)}%) · AVIF ${k(avif.size)} (-${Math.round((1 - avif.size / 1024 / origKb) * 100)}%)`,
  );
}

console.log(`\n✅ ${files.length * 2} variantes optimizadas en public/oficial/`);
