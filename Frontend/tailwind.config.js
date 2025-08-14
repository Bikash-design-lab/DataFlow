/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",           // <-- needed for Vite
    "./src/**/*.{js,ts,jsx,tsx}",  // <-- scan all source files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
