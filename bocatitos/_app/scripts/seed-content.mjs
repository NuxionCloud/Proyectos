#!/usr/bin/env node
/**
 * seed-content.mjs
 * ─────────────────
 * Lee scripts/source/i18n-modelo11.js (carta validada por el cliente,
 * derivada del modelo 11 original) y genera los 23 archivos .md de
 * content collections con los 5 idiomas.
 *
 * Idempotente: borra y recrea los .md de cada carpeta.
 * Re-correr cuando se actualice el i18n source.
 *
 * Uso:  node scripts/seed-content.mjs
 */
import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE = join(__dirname, 'source', 'i18n-modelo11.js');
const CONTENT = join(ROOT, 'src', 'content');

// Idiomas a generar (5 según briefing actualizado · sin PT)
const LANGS = ['es', 'en', 'fr', 'it', 'de'];

/**
 * OVERRIDES · sustituciones puntuales sobre el i18n.js del modelo 11.
 * Cada entrada es { match, replace } por idioma. `match` y `replace` son
 * strings; se hace replaceAll sobre el array de ingredientes ya parseado.
 *
 * Justificación de cada cambio (uso nativo en hostelería):
 *   - DE "Doppelter Speck"   → "Doppelter Bacon" (Speck es panceta curada
 *                              alemana, no el bacon americano)
 *   - DE "Schweinerücken"    → "Schweinefilet"   (más natural en cartas
 *                              para "lomo de cerdo")
 *   - DE "Wurst" (hot dog)   → "Würstchen"       (Würstchen es la
 *                              salchicha tipo frankfurter; Wurst es genérico)
 *   - IT "Edamer"            → "Edam"            (Edamer es alemán; en
 *                              italiano el queso se llama Edam)
 *   - FR "Pomme de terre frite" → "Pommes de terre épaisses" (plural
 *                              y "épaisses" para la patata gruesa de bravas)
 */
const OVERRIDES = {
  de: [
    { match: 'Doppelter Speck',  replace: 'Doppelter Bacon' },
    { match: 'Schweinerücken',   replace: 'Schweinefilet' },
    { match: 'Wurst',            replace: 'Würstchen' },
  ],
  it: [
    { match: 'Edamer', replace: 'Edam' },
  ],
  fr: [
    { match: 'Pomme de terre frite', replace: 'Pommes de terre épaisses' },
  ],
};

function applyOverrides(lang, ingredient) {
  const rules = OVERRIDES[lang];
  if (!rules) return ingredient;
  let out = ingredient;
  for (const { match, replace } of rules) {
    out = out.replaceAll(match, replace);
  }
  return out;
}

// Mapa de platos · slug → {file, base, subcategoria, categoria, tag, imagen, orden, i18nKey}
// `i18nKey` apunta a la clave en i18n.js. Para desayunos/tapas el nombre también es i18n.
const DISHES = [
  // ─── STREET FOOD · Smash burgers (6)
  // Fotos oficiales del cliente (descargadas de Tripadvisor con su nombre real)
  { slug: 'tito-gourmet', orden: 1, categoria: 'street-food', subcategoria: 'smash', base: 'brioche', tag: null, imagen: '/oficial/tito-gourmet.jpg', ingKey: 'p.tito_gourmet', nombreFixed: 'TITO GOURMET' },
  { slug: 'tito-bb',      orden: 2, categoria: 'street-food', subcategoria: 'smash', base: 'brioche', tag: null, imagen: '/oficial/tito-bb.jpg',      ingKey: 'p.tito_bb',      nombreFixed: 'TITO BB' },
  { slug: 'tito-hot',     orden: 3, categoria: 'street-food', subcategoria: 'smash', base: 'brioche', tag: 'spicy', imagen: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=900&q=85&auto=format&fit=crop', ingKey: 'p.tito_hot',     nombreFixed: 'TITO HOT' },
  { slug: 'tito-trufa',   orden: 4, categoria: 'street-food', subcategoria: 'smash', base: 'brioche', tag: null, imagen: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=900&q=85&auto=format&fit=crop', ingKey: 'p.tito_trufa',   nombreFixed: 'TITO TRUFA' },
  { slug: 'tito-porky',   orden: 5, categoria: 'street-food', subcategoria: 'smash', base: 'brioche', tag: null, imagen: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=900&q=85&auto=format&fit=crop', ingKey: 'p.tito_porky',   nombreFixed: 'TITO PORKY' },
  { slug: 'tito-sanji',   orden: 6, categoria: 'street-food', subcategoria: 'smash', base: 'brioche', tag: 'signature', imagen: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=85&auto=format&fit=crop', ingKey: 'p.tito_sanji', nombreFixed: 'TITO SANJI' },

  // ─── STREET FOOD · Bocatas (7)
  { slug: 'pobacemi',  orden: 7,  categoria: 'street-food', subcategoria: 'bocata', base: 'ciabatta', tag: null, imagen: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=900&q=85&auto=format&fit=crop', ingKey: 'p.pobacemi',  nombreFixed: 'POBACEMI' },
  { slug: 'pocebra',   orden: 8,  categoria: 'street-food', subcategoria: 'bocata', base: 'ciabatta', tag: null, imagen: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=900&q=85&auto=format&fit=crop', ingKey: 'p.pocebra',   nombreFixed: 'POCEBRA' },
  { slug: 'rocotito',  orden: 9,  categoria: 'street-food', subcategoria: 'bocata', base: 'ciabatta', tag: 'spicy', imagen: 'https://images.unsplash.com/photo-1592415486689-125cbbfcbee2?w=900&q=85&auto=format&fit=crop', ingKey: 'p.rocotito',  nombreFixed: 'ROCOTITO' },
  { slug: 'baqueto',   orden: 10, categoria: 'street-food', subcategoria: 'bocata', base: 'ciabatta', tag: null, imagen: 'https://images.unsplash.com/photo-1559054663-e8d23213f55c?w=900&q=85&auto=format&fit=crop', ingKey: 'p.baqueto',   nombreFixed: 'BAQUETO' },
  { slug: 'onito',     orden: 11, categoria: 'street-food', subcategoria: 'bocata', base: 'ciabatta', tag: null, imagen: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=900&q=85&auto=format&fit=crop', ingKey: 'p.onito',     nombreFixed: 'ONITO' },
  { slug: 'tartufito', orden: 12, categoria: 'street-food', subcategoria: 'bocata', base: 'ciabatta', tag: null, imagen: 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=900&q=85&auto=format&fit=crop', ingKey: 'p.tartufito', nombreFixed: 'TARTUFITO' },
  { slug: 'bocaveggie',orden: 13, categoria: 'street-food', subcategoria: 'bocata', base: 'ciabatta', tag: 'veggie', imagen: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=900&q=85&auto=format&fit=crop', ingKey: 'p.bocaveggie',nombreFixed: 'BOCAVEGGIE' },

  // ─── STREET FOOD · Hot dogs (4)
  { slug: 'porkillo',         orden: 14, categoria: 'street-food', subcategoria: 'hotdog', base: 'bun', tag: null, imagen: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=900&q=85&auto=format&fit=crop', ingKey: 'p.porkillo',  nombreFixed: 'PORKILLO' },
  { slug: 'uno-que-empache',  orden: 15, categoria: 'street-food', subcategoria: 'hotdog', base: 'bun', tag: null, imagen: 'https://images.unsplash.com/photo-1612392061787-2d078b3e573a?w=900&q=85&auto=format&fit=crop', ingKey: 'p.empache',   nombreFixed: 'UNO QUE EMPACHE' },
  { slug: 'que-pesha',        orden: 16, categoria: 'street-food', subcategoria: 'hotdog', base: 'bun', tag: null, imagen: 'https://images.unsplash.com/photo-1612392987082-aab1b6c54b71?w=900&q=85&auto=format&fit=crop', ingKey: 'p.pesha',     nombreFixed: 'QUÉ PESHÁ' },
  { slug: 'ole-sanji',        orden: 17, categoria: 'street-food', subcategoria: 'hotdog', base: 'bun', tag: 'signature', imagen: 'https://images.unsplash.com/photo-1605789343781-4b71b6a40c41?w=900&q=85&auto=format&fit=crop', ingKey: 'p.ole_sanji', nombreFixed: 'OLE SANJI' },

  // ─── DESAYUNOS (3) · nombre traducido
  { slug: 'tostada-aove-tomate',     orden: 1, categoria: 'desayunos', subcategoria: 'desayuno', base: 'ciabatta', tag: null, imagen: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900&q=85&auto=format&fit=crop', ingKey: 'brk.01.ings', nombreKey: 'brk.01.h', destacado: true },
  { slug: 'tostada-serrana',         orden: 2, categoria: 'desayunos', subcategoria: 'desayuno', base: 'ciabatta', tag: null, imagen: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=900&q=85&auto=format&fit=crop', ingKey: 'brk.02.ings', nombreKey: 'brk.02.h' },
  { slug: 'montadito-bacon-queso',   orden: 3, categoria: 'desayunos', subcategoria: 'desayuno', base: 'ciabatta', tag: null, imagen: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=900&q=85&auto=format&fit=crop', ingKey: 'brk.03.ings', nombreKey: 'brk.03.h' },

  // ─── TAPAS (3) · nombre traducido
  { slug: 'croquetas-de-la-casa',    orden: 1, categoria: 'tapas', subcategoria: 'tapa', base: 'plato', tag: null, imagen: 'https://images.unsplash.com/photo-1601314002957-aa6068b5fe7d?w=900&q=85&auto=format&fit=crop', ingKey: 'tapa.01.ings', nombreKey: 'tapa.01.h', destacado: true },
  { slug: 'patatas-bravas',          orden: 2, categoria: 'tapas', subcategoria: 'tapa', base: 'plato', tag: null, imagen: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=900&q=85&auto=format&fit=crop', ingKey: 'tapa.02.ings', nombreKey: 'tapa.02.h' },
  { slug: 'pinchos-de-la-semana',    orden: 3, categoria: 'tapas', subcategoria: 'tapa', base: 'plato', tag: null, imagen: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=900&q=85&auto=format&fit=crop', ingKey: 'tapa.03.ings', nombreKey: 'tapa.03.h' },
];

// ──────────────────────────────────────────────
// Parseo del i18n.js del modelo 11
// ──────────────────────────────────────────────
async function loadI18n() {
  const txt = await readFile(SOURCE, 'utf8');
  // El modelo 11 hace `window.T = { ... };` seguido de `window.LANGS = [...]`.
  // Buscamos el inicio del literal y emparejamos llaves para encontrar el cierre.
  const start = txt.indexOf('{', txt.indexOf('window.T'));
  let depth = 0;
  let end = -1;
  for (let i = start; i < txt.length; i++) {
    const c = txt[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) throw new Error('No se encontró el cierre del objeto T');
  const blob = txt.slice(start, end + 1);
  // eslint-disable-next-line no-eval
  return eval('(' + blob + ')');
}

function spansToArray(html) {
  if (!html) return [];
  const re = /<span>([\s\S]*?)<\/span>/g;
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) out.push(m[1].trim());
  return out;
}

function buildIngredientes(i18n, key) {
  const out = {};
  for (const lang of LANGS) {
    const raw = spansToArray(i18n[lang]?.[key] ?? '');
    out[lang] = raw.map((ing) => applyOverrides(lang, ing));
  }
  return out;
}

function buildNombre(i18n, dish) {
  if (dish.nombreFixed) {
    const out = {};
    for (const lang of LANGS) out[lang] = dish.nombreFixed;
    return out;
  }
  const out = {};
  for (const lang of LANGS) out[lang] = i18n[lang]?.[dish.nombreKey] ?? '';
  return out;
}

function frontmatter(dish, nombre, ingredientes) {
  const lines = ['---'];
  lines.push('nombre:');
  for (const lang of LANGS) lines.push(`  ${lang}: "${nombre[lang].replace(/"/g, '\\"')}"`);
  lines.push(`base: "${dish.base}"`);
  lines.push(`subcategoria: "${dish.subcategoria}"`);
  lines.push(`categoria: "${dish.categoria}"`);
  lines.push(`imagen: "${dish.imagen}"`);
  if (dish.tag) lines.push(`tag: "${dish.tag}"`);
  if (dish.destacado) lines.push(`destacado: true`);
  if (dish.categoria === 'desayunos') lines.push(`disponibleDomicilio: false`);
  lines.push(`orden: ${dish.orden}`);
  lines.push('ingredientes:');
  for (const lang of LANGS) {
    lines.push(`  ${lang}:`);
    for (const ing of ingredientes[lang]) {
      lines.push(`    - "${ing.replace(/"/g, '\\"')}"`);
    }
  }
  lines.push('---', '');
  return lines.join('\n');
}

async function cleanFolder(folder) {
  try {
    const files = await readdir(folder);
    for (const f of files) if (f.endsWith('.md')) await unlink(join(folder, f));
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
}

// ──────────────────────────────────────────────
// Run
// ──────────────────────────────────────────────
const i18n = await loadI18n();

await mkdir(join(CONTENT, 'desayunos'), { recursive: true });
await mkdir(join(CONTENT, 'tapas'), { recursive: true });
await mkdir(join(CONTENT, 'street-food'), { recursive: true });
await cleanFolder(join(CONTENT, 'desayunos'));
await cleanFolder(join(CONTENT, 'tapas'));
await cleanFolder(join(CONTENT, 'street-food'));

const dishesI18n = {};
let count = 0;
for (const dish of DISHES) {
  const ingredientes = buildIngredientes(i18n, dish.ingKey);
  const nombre = buildNombre(i18n, dish);
  const md = frontmatter(dish, nombre, ingredientes);
  const padded = String(dish.orden).padStart(2, '0');
  const path = join(CONTENT, dish.categoria, `${padded}-${dish.slug}.md`);
  await writeFile(path, md, 'utf8');
  // Index para el client runtime de i18n
  dishesI18n[dish.slug] = { nombre, ingredientes };
  count++;
  console.log(`✓ ${dish.categoria}/${padded}-${dish.slug}.md (${nombre.es})`);
}

// Genera public/i18n/dishes.json para el runtime cliente del switcher.
const publicI18n = join(ROOT, 'public', 'i18n');
await mkdir(publicI18n, { recursive: true });
await writeFile(join(publicI18n, 'dishes.json'), JSON.stringify(dishesI18n, null, 2), 'utf8');
console.log(`✓ public/i18n/dishes.json (${Object.keys(dishesI18n).length} platos)`);

console.log(`\n✅ ${count} platos generados desde i18n.js del modelo 11.`);
