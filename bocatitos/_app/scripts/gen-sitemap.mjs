#!/usr/bin/env node
/**
 * gen-sitemap.mjs · genera public/sitemap.xml a mano.
 *
 * Mantenemos una lista hard-coded para evitar el bug de @astrojs/sitemap
 * (`reduce of undefined`) con esta combo de versiones. Re-correr al añadir
 * páginas. Se ejecuta automáticamente en `npm run prebuild`.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');

const SITE = process.env.PUBLIC_SITE_URL || 'https://bocatitos.es';

const pages = [
  { path: '/',      priority: 1.0, changefreq: 'monthly' },
  { path: '/carta', priority: 0.9, changefreq: 'weekly' },
];

const today = new Date().toISOString().split('T')[0];

const urls = pages
  .map(
    (p) => `  <url>
    <loc>${SITE}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

await mkdir(PUBLIC, { recursive: true });
await writeFile(join(PUBLIC, 'sitemap.xml'), xml, 'utf8');
console.log(`✓ public/sitemap.xml (${pages.length} URLs)`);
