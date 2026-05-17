/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'choco-dark': '#2B1408', // Deeper, warmer dark brown like Ferrero
        'choco-medium': '#4A2511', // Rich chocolate
        'choco-light': '#8C5A35', // Hazelnut/milk chocolate
        'ivory': '#FAF7F2', // Warmer, more elegant off-white
        'cream': '#F0E5D8',
        'gold': '#C89B3C', // Ferrero signature gold
        'gold-light': '#E6C173',
        'gold-dark': '#A67B27',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'serif': ['Cinzel', 'Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
