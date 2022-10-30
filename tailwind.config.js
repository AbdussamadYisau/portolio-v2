/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: [
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
  ],
  theme: {
    screens: {
      'xs': {'max': '281px'},
      ...defaultTheme.screens,
    }
  },
  darkMode: 'class',
  plugins: [],
}
