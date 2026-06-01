#!/usr/bin/env node
/**
 * gen-ui-strings.mjs · extrae las strings UI del i18n.js originalmente
 * derivado del modelo 11 (validado por el cliente) y las escribe en
 * src/i18n/from-modelo11.json para que ui.ts las consuma.
 *
 * Filtra las claves de plato (p.*, brk.*, tapa.*) — esas viven en
 * src/content/*.md y se manejan via dishes.json.
 *
 * Re-correr cuando se actualice scripts/source/i18n-modelo11.js:
 *    npm run ui-strings
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE = join(__dirname, 'source', 'i18n-modelo11.js');
const OUT_DIR = join(ROOT, 'src', 'i18n');
const OUT = join(OUT_DIR, 'from-modelo11.json');

const LANGS = ['es', 'en', 'fr', 'it', 'de'];

// Claves que NO entran (ya gestionadas en otro sitio).
const EXCLUDE_PREFIXES = ['p.', 'brk.', 'tapa.', 'base.', 'cat.smash', 'cat.bocata', 'cat.hotdog', 'cat.brk', 'cat.tapa'];

async function loadI18n() {
  const txt = await readFile(SOURCE, 'utf8');
  const start = txt.indexOf('{', txt.indexOf('window.T'));
  let depth = 0, end = -1;
  for (let i = start; i < txt.length; i++) {
    const c = txt[i];
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) throw new Error('No se encontró cierre del objeto T');
  // eslint-disable-next-line no-eval
  return eval('(' + txt.slice(start, end + 1) + ')');
}

const data = await loadI18n();
const out = {};

for (const lang of LANGS) {
  out[lang] = {};
  const dict = data[lang] || {};
  for (const [key, val] of Object.entries(dict)) {
    if (EXCLUDE_PREFIXES.some((p) => key.startsWith(p))) continue;
    out[lang][key] = val;
  }
}

await mkdir(OUT_DIR, { recursive: true });
await writeFile(OUT, JSON.stringify(out, null, 2), 'utf8');

const counts = LANGS.map((l) => `${l}:${Object.keys(out[l]).length}`).join(' · ');
console.log(`✓ ${OUT.split(/[\\/]/).slice(-3).join('/')} (${counts})`);
