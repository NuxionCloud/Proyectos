/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        black: 'var(--black)',
        dark: 'var(--dark)',
        darker: 'var(--darker)',
        white: 'var(--white)',
        red: {
          DEFAULT: 'var(--red)',
          dark: 'var(--red-dark)',
        },
        yellow: 'var(--yellow)',
        cream: 'var(--cream)',
        whatsapp: {
          DEFAULT: 'var(--wa-green)',
          dark: 'var(--wa-green-dark)',
        },
        // Sub-paletas por categoría
        desayuno: {
          DEFAULT: 'var(--cat-desayuno)',
          soft: 'var(--cat-desayuno-soft)',
          accent: 'var(--cat-desayuno-accent)',
        },
        tapas: {
          DEFAULT: 'var(--cat-tapas)',
          soft: 'var(--cat-tapas-soft)',
          accent: 'var(--cat-tapas-accent)',
        },
        streetfood: {
          DEFAULT: 'var(--cat-streetfood)',
          soft: 'var(--cat-streetfood-soft)',
          accent: 'var(--cat-streetfood-accent)',
        },
      },
      fontFamily: {
        display: ['"Archivo Black"', 'system-ui', 'sans-serif'],
        condensed: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // Escala 1.5x basada en rem
        '2xs': '0.5rem',
        xs: '0.75rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2.5rem',
        xl: '4rem',
        '2xl': '6.5rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      maxWidth: {
        wrap: '1400px',
      },
    },
  },
  plugins: [],
};
