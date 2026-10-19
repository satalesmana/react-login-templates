/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        secondary: "#4F46E5",
        dark: "#0F172A",
        muted: "#64748B",
        card: "#F8FAFC",
      },
    },
  },
  plugins: [],
};
