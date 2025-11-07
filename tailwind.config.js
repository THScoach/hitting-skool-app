/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#07070C",
          foreground: "#F7FAFC",
        },
        primary: {
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
        },
        accent: {
          500: "#F97316",
          600: "#EA580C",
        },
        success: "#22C55E",
        warning: "#FACC15",
        danger: "#F87171",
      },
      boxShadow: {
        glow: "0 0 30px rgba(14, 165, 233, 0.3)",
      },
    },
  },
  plugins: [],
};
