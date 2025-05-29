/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#10b981',
          DEFAULT: '#059669'
        }
      }
    }
  },
  plugins: []
}
