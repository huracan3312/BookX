/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.css",

  ],
  theme: {
    extend: {
      colors: {
        primary: '#F29900',
      },
    },
  },
  plugins: [],
}
