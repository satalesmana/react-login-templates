/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0D1E4C",
          dark: "#081330",
          light: "#162E6E",
        },
        brand: {
          orange: "#F03D14",
        },
      },
    },
  },
  plugins: [],
};
