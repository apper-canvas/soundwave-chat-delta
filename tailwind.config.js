/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DB954',
        secondary: '#191414',
        accent: '#1ED760',
        surface: '#282828',
        background: '#121212',
        success: '#1DB954',
        warning: '#FFA500',
        error: '#FF6B6B',
        info: '#4ECDC4'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      borderRadius: {
        'full': '500px'
      },
      backdropBlur: {
        'xs': '2px'
      }
    },
  },
  plugins: [],
}