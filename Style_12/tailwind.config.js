/** @type {import('tailwindcss').Config} */
module.exports = {
  // File mana aja yang boleh pakai class Tailwind
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
