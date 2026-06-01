import { defineCollection, z } from 'astro:content';

/**
 * Carta Bocatitos · contenido oficial.
 *
 * Fuente de verdad: el cliente NO publica precios online ("Sin precios en
 * la web — pregúntanos por WhatsApp"). Por eso `precio` no existe en el
 * schema. Si en el futuro cambian de criterio, se añade como opcional.
 *
 * Categorías macro: desayunos · tapas · street-food
 *  - desayunos: solo consumo en local (disponibleDomicilio: false por defecto)
 *  - tapas, street-food: domicilio disponible
 *
 * Sub-categorías dentro de street-food: smash · bocata · hotdog
 *
 * Idiomas: 5 (es, en, fr, it, de). El renderer escoge según locale activo.
 */

const idiomas = ['es', 'en', 'fr', 'it', 'de'] as const;
type Idioma = (typeof idiomas)[number];

const i18nString = z.object({
  es: z.string(),
  en: z.string(),
  fr: z.string(),
  it: z.string(),
  de: z.string(),
});

const i18nIngredientes = z.object({
  es: z.array(z.string()),
  en: z.array(z.string()),
  fr: z.array(z.string()),
  it: z.array(z.string()),
  de: z.array(z.string()),
});

const dishSchema = z.object({
  // Nombres tipo "TITO SANJI" no se traducen; desayunos y tapas sí — por eso es i18n.
  nombre: i18nString,
  // Tipo de pan / base. Determina el grupo visual.
  base: z.enum(['brioche', 'ciabatta', 'bun', 'plato']).default('plato'),
  // Sub-familia dentro de la categoría macro.
  subcategoria: z.enum(['smash', 'bocata', 'hotdog', 'desayuno', 'tapa']),
  // Tags visuales en la card.
  tag: z.enum(['signature', 'spicy', 'veggie']).optional(),
  // Categoría macro · alineada con el modelo de negocio del cliente.
  categoria: z.enum(['desayunos', 'tapas', 'street-food']),
  // Lista de ingredientes traducida.
  ingredientes: i18nIngredientes,
  // Imagen del plato (URL o ruta /images/).
  imagen: z.string(),
  // Si va a destacados de la home.
  destacado: z.boolean().default(false),
  // Si se puede pedir a domicilio. Desayunos NO (solo local).
  disponibleDomicilio: z.boolean().default(true),
  // Si está activo en carta. False oculta sin borrar.
  disponible: z.boolean().default(true),
  // Orden manual dentro de su subcategoría.
  orden: z.number().optional(),
});

const settingsSchema = z.object({
  direccion: z.string(),
  codigoPostal: z.string(),
  ciudad: z.string(),
  pais: z.string(),
  telefono: z.string(),
  whatsapp: z.string(),
  email: z.string().email().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  spotify: z.string().optional(),
  barrio: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  horario: z.object({
    lunes: z.string(),
    martes: z.string(),
    miercoles: z.string(),
    jueves: z.string(),
    viernes: z.string(),
    sabado: z.string(),
    domingo: z.string(),
  }),
  mapaEmbed: z.string().url().optional(),
  mapaLink: z.string().url().optional(),
});

export const collections = {
  desayunos: defineCollection({ type: 'content', schema: dishSchema }),
  tapas: defineCollection({ type: 'content', schema: dishSchema }),
  'street-food': defineCollection({ type: 'content', schema: dishSchema }),
  settings: defineCollection({ type: 'data', schema: settingsSchema }),
};

export type Dish = z.infer<typeof dishSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type { Idioma };
export { idiomas };
