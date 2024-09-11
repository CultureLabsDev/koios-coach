/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require('daisyui')],
  content: ['src/**/*.ts', 'src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Barlow', 'sans-serif'],
      },
      colors: {
        dark: '#2b324e', // Arcadia navy
      },
    },
  },
  daisyui: {
    themes: [
      {
        arcadia: {
          "primary": "#27ade4",
          "secondary": "#53bbb3",
          "accent": "#fbcd4f",
          "neutral": "#8e8e90",
          "base-100": "#ffffff",
          "base-200": "#e9e9ea",
          "info": "#27ade4",
          "success": "#53bbb3",
          "warning": "#fbcd4f",
          "error": "#ec6559",
        },
      },
    ],
  },
};