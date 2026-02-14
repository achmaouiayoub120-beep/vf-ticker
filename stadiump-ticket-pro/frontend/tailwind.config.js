/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        maroc: {
          rouge: '#c72b2b',
          vert: '#006400',
          sable: '#f2e6d9',
          blanc: '#ffffff',
          noir: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
};
