/**
 * time.ts · helper para "¿Qué te apetece ahora?"
 * Devuelve la sugerencia según la hora local del cliente.
 */

export type Slot = 'desayuno' | 'tapa' | 'street' | 'cerrado';

export interface Suggestion {
  slot: Slot;
  titulo: string;
  desc: string;
  href: string;
  cta: string;
  accent: 'desayuno' | 'tapas' | 'streetfood';
}

export function getSuggestion(hour: number): Suggestion {
  if (hour >= 6 && hour < 12) {
    return {
      slot: 'desayuno',
      titulo: 'Hora de desayunar',
      desc: 'Tostadas, café de especialidad y montaditos. Solo en local — pásate.',
      href: '/carta#desayunos',
      cta: 'Ver desayunos',
      accent: 'desayuno',
    };
  }
  if (hour >= 12 && hour < 17) {
    return {
      slot: 'tapa',
      titulo: 'Hora del tapeo',
      desc: 'Croquetas, bravas y pinchos de la semana. A la mesa o a domicilio.',
      href: '/carta#tapas',
      cta: 'Ver tapas',
      accent: 'tapas',
    };
  }
  if (hour >= 19 && hour < 24) {
    return {
      slot: 'street',
      titulo: 'Modo street food',
      desc: 'Smash burgers, bocatas y hot dogs. Pide por WhatsApp y lo tenemos listo.',
      href: '/carta#street-food',
      cta: 'Ver street food',
      accent: 'streetfood',
    };
  }
  return {
    slot: 'cerrado',
    titulo: 'Ahora mismo descansamos',
    desc: 'Volvemos a las 08:00 con desayunos. Mientras tanto, échale un ojo a la carta.',
    href: '/carta',
    cta: 'Ver carta',
    accent: 'streetfood',
  };
}
