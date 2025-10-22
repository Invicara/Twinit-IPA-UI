/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      colors: {
        // Digital Twin Colors
        'digital-twin': {
          1: 'var(--digital-twin-1)',
          2: 'var(--digital-twin-2)',
          3: 'var(--digital-twin-3)',
          4: 'var(--digital-twin-4)',
          5: 'var(--digital-twin-5)',
          6: 'var(--digital-twin-6)',
          7: 'var(--digital-twin-7)',
          8: 'var(--digital-twin-8)',
          9: 'var(--digital-twin-9)',
          10: 'var(--digital-twin-10)',
        },
        // Classify Colors
        'classify': {
          1: 'var(--classify-1)',
          2: 'var(--classify-2)',
          3: 'var(--classify-3)',
          4: 'var(--classify-4)',
          5: 'var(--classify-5)',
          6: 'var(--classify-6)',
          7: 'var(--classify-7)',
          8: 'var(--classify-8)',
          9: 'var(--classify-9)',
          10: 'var(--classify-10)',
        },
        // Assure Colors
        'assure': {
          1: 'var(--assure-1)',
          2: 'var(--assure-2)',
          3: 'var(--assure-3)',
          4: 'var(--assure-4)',
          5: 'var(--assure-5)',
          6: 'var(--assure-6)',
          7: 'var(--assure-7)',
          8: 'var(--assure-8)',
          9: 'var(--assure-9)',
          10: 'var(--assure-10)',
        },
        // Neutral Colors
        'neutral': {
          0: 'var(--neutral-0)',
          0.5: 'var(--neutral-05)',
          1: 'var(--neutral-1)',
          2: 'var(--neutral-2)',
          3: 'var(--neutral-3)',
          4: 'var(--neutral-4)',
          5: 'var(--neutral-5)',
          6: 'var(--neutral-6)',
          7: 'var(--neutral-7)',
          8: 'var(--neutral-8)',
          9: 'var(--neutral-9)',
          10: 'var(--neutral-10)',
        },
        // Alert Colors
        'alert': {
          1: 'var(--alert-1)',
          2: 'var(--alert-2)',
          3: 'var(--alert-3)',
          4: 'var(--alert-4)',
          5: 'var(--alert-5)',
          6: 'var(--alert-6)',
          7: 'var(--alert-7)',
          8: 'var(--alert-8)',
          9: 'var(--alert-9)',
          10: 'var(--alert-10)',
        },
        // Warning Colors
        'warning': {
          1: 'var(--warning-1)',
          2: 'var(--warning-2)',
          3: 'var(--warning-3)',
          4: 'var(--warning-4)',
          5: 'var(--warning-5)',
          6: 'var(--warning-6)',
          7: 'var(--warning-7)',
          8: 'var(--warning-8)',
          9: 'var(--warning-9)',
          10: 'var(--warning-10)',
        },
        // Positive Colors
        'positive': {
          1: 'var(--positive-1)',
          2: 'var(--positive-2)',
          3: 'var(--positive-3)',
          4: 'var(--positive-4)',
          5: 'var(--positive-5)',
          6: 'var(--positive-6)',
          7: 'var(--positive-7)',
          8: 'var(--positive-8)',
          9: 'var(--positive-9)',
          10: 'var(--positive-10)',
        },
        // Blue Colors
        'blue': {
          1: 'var(--blue-1)',
          2: 'var(--blue-2)',
          3: 'var(--blue-3)',
          4: 'var(--blue-4)',
          5: 'var(--blue-5)',
          6: 'var(--blue-6)',
          7: 'var(--blue-7)',
          8: 'var(--blue-8)',
          9: 'var(--blue-9)',
          10: 'var(--blue-10)',
        },
        // Violet Colors
        'violet': {
          1: 'var(--violet-1)',
          2: 'var(--violet-2)',
          3: 'var(--violet-3)',
          4: 'var(--violet-4)',
          5: 'var(--violet-5)',
          6: 'var(--violet-6)',
          7: 'var(--violet-7)',
          8: 'var(--violet-8)',
          9: 'var(--violet-9)',
          10: 'var(--violet-10)',
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
}