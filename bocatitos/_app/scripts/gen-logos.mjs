#!/usr/bin/env node
/**
 * gen-logos.mjs · genera el logo oficial en múltiples tamaños y formatos
 * usando sharp con Lanczos3 (resampling de alta calidad para downscale).
 *
 * Entrada: scripts/source/logo-bocatitos.png (1066×1178 · original WordPress)
 * Salida:  public/logo-{32,64,128,256,512}.{png,webp,avif}
 *          + public/logo-192.png (apple-touch-icon)
 *
 * Re-correr cuando se actualice el logo original:
 *    npm run logos
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');
const SOURCE = join(__dirname, 'source', 'logo-bocatitos.png');

// Tamaños usados por el componente Logo + favicons:
//   32  → favicon + Logo profile xs (1x)
//   64  → Logo profile xs (2x retina) + sm (1x)
//   128 → Logo profile sm (2x retina) + lg (1x)
//   256 → Logo profile lg (2x retina) + xl (1x)
//   512 → Logo profile xl (2x retina) + hero overlay
//   192 → PNG-only: apple-touch-icon + favicon 192x192
const SIZES = [32, 64, 128, 256, 512];
const PNG_ONLY_SIZES = [192]; // solo PNG, sin AVIF/WebP (favicons legacy)

await mkdir(PUBLIC, { recursive: true });

const meta = await sharp(SOURCE).metadata();
console.log(`Origen: ${meta.width}×${meta.height} px (${(meta.size / 1024).toFixed(1)} KB)`);
const total = SIZES.length * 3 + PNG_ONLY_SIZES.length;
console.log(`Generando ${total} archivos (${SIZES.length} tamaños × 3 formatos + ${PNG_ONLY_SIZES.length} PNG legacy)…\n`);

const ratio = meta.width / meta.height;
const k = (n) => `${(n / 1024).toFixed(1)} KB`;

const pipeline = (size) =>
  sharp(SOURCE).resize(
    Math.round(size * ratio < size ? size * ratio : size),
    Math.round(size),
    { kernel: sharp.kernel.lanczos3, fit: 'inside', withoutEnlargement: true },
  );

for (const size of SIZES) {
  const base = `logo-${size}`;
  const png  = await pipeline(size).png({ compressionLevel: 9, palette: true, quality: 100, effort: 10 }).toFile(join(PUBLIC, `${base}.png`));
  const webp = await pipeline(size).webp({ quality: 92, effort: 6, smartSubsample: true }).toFile(join(PUBLIC, `${base}.webp`));
  const avif = await pipeline(size).avif({ quality: 80, effort: 6 }).toFile(join(PUBLIC, `${base}.avif`));
  console.log(`✓ ${base}: PNG ${k(png.size)} · WebP ${k(webp.size)} · AVIF ${k(avif.size)}`);
}

for (const size of PNG_ONLY_SIZES) {
  const base = `logo-${size}`;
  const png = await pipeline(size).png({ compressionLevel: 9, palette: true, quality: 100, effort: 10 }).toFile(join(PUBLIC, `${base}.png`));
  console.log(`✓ ${base}: PNG ${k(png.size)} (favicon legacy)`);
}

console.log(`\n✅ ${total} archivos generados en public/`);
