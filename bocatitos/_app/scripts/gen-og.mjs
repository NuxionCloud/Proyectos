/**
 * Genera imágenes Open Graph (1200×630, ratio 1.91:1) a partir de fotos oficiales.
 * Una por página clave de la web (home, carta, …) para que el preview de share
 * en WhatsApp / Twitter / Facebook coincida con el contenido de cada URL.
 *
 * Salida:
 *   public/og-default.jpg   ← homepage (TITO GOURMET, plato insignia)
 *   public/og-carta.jpg     ← /carta (Bocakillo, muestra de la variedad)
 *
 * Re-ejecutar con `npm run og`.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const TARGETS = [
  {
    source: 'public/oficial/tito-gourmet.jpg',
    output: 'public/og-default.jpg',
    label: 'home',
  },
  {
    source: 'public/oficial/bocakillo-2.jpg',
    output: 'public/og-carta.jpg',
    label: 'carta',
  },
];

for (const { source, output, label } of TARGETS) {
  const src = resolve(root, source);
  const out = resolve(root, output);

  if (!existsSync(src)) {
    console.error(`✗ [${label}] no existe ${src}`);
    continue;
  }
  mkdirSync(dirname(out), { recursive: true });

  await sharp(src)
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(out);

  console.log(`✓ [${label}] ${output}`);
}
