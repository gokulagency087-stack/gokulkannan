/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agri-green': '#2D5A27',
        'agri-gold': '#D4AF37',
      }
    },
  },
  plugins: [],
}
