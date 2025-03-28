/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5a5b5e',
        secondary: '#10B981',
        dark: '#1F2937',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

