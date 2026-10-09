/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7f4",
          100: "#d7ece6",
          600: "#0B6B5B",
          700: "#095a4d",
          800: "#074a40",
        },
        cta: {
          DEFAULT: "#EA580C",
          dark: "#c2410c",
        },
        cream: "#FAF9F7",
      },
    },
  },
  plugins: [],
};
