/**
 * Verifica que TODAS las claves data-i18n usadas en el DOM tienen
 * traducción en los 5 idiomas. Cero huecos = "todo traducido".
 *
 * Uso:
 *   node scripts/verify-i18n.mjs <archivo-keys.txt>
 *
 * El archivo de claves se genera con:
 *   curl -s http://localhost:4322/ http://localhost:4322/carta \
 *     | grep -oE 'data-i18n[^"]*="[^"]+"' | grep -oE '"[^"]+"' \
 *     | tr -d '"' | tr ';' '\n' | sed -E 's/.*://' | sort -u > keys.txt
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const LOCALES = ['es', 'en', 'fr', 'it', 'de'];

const m11 = JSON.parse(readFileSync(resolve(root, 'src/i18n/from-modelo11.json'), 'utf8'));
const tsRaw = readFileSync(resolve(root, 'src/i18n/ui.ts'), 'utf8');

// Parser ligero del bloque MANUAL: por cada locale, busca su sub-bloque y extrae 'clave': 'valor'.
const MANUAL = {};
for (const l of LOCALES) {
  const re = new RegExp(`  ${l}: \\{([\\s\\S]*?)\\n  \\},`, 'm');
  const m = tsRaw.match(re);
  if (!m) { console.log(`! No se encontró el bloque MANUAL.${l}`); continue; }
  const body = m[1];
  MANUAL[l] = {};
  for (const kv of body.matchAll(/'([^']+)':\s*'((?:[^'\\]|\\.)*)'/g)) {
    MANUAL[l][kv[1]] = kv[2];
  }
}

// Merge final: from-modelo11 + MANUAL (manual gana).
const ui = {};
for (const l of LOCALES) ui[l] = { ...(m11[l] ?? {}), ...(MANUAL[l] ?? {}) };

const keysFile = process.argv[2];
if (!keysFile) {
  console.error('Uso: node scripts/verify-i18n.mjs <archivo-keys.txt>');
  process.exit(1);
}
const keys = readFileSync(keysFile, 'utf8').trim().split('\n').filter(Boolean);

let missing = 0;
const report = {};
for (const k of keys) {
  for (const l of LOCALES) {
    if (!ui[l]?.[k]) {
      (report[k] ||= []).push(l);
      missing++;
    }
  }
}

console.log(`\n📊 Verificación i18n`);
console.log(`   Claves usadas en DOM: ${keys.length}`);
console.log(`   Idiomas:               ${LOCALES.length}`);
console.log(`   Total entradas:        ${keys.length * LOCALES.length}`);

if (missing === 0) {
  console.log(`\n✅ COBERTURA TOTAL — 0 huecos · todo traducido en los 5 idiomas\n`);
} else {
  console.log(`\n❌ ${missing} huecos en ${Object.keys(report).length} claves:\n`);
  for (const [k, langs] of Object.entries(report)) {
    console.log(`   ${k} → falta en: ${langs.join(', ')}`);
  }
  process.exit(1);
}
