/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        black: '#004d40', // Very deep, unmistakably rich teal/green instead of black
        white: '#fffcf2', // Warm, creamy ivory instead of stark white
        gray: { 
          50: '#faf8f5', 100: '#f0ece1', 200: '#e5dec8', 300: '#d1c7aa', 400: '#bcad86',
          500: '#a39266', 600: '#88774f', 700: '#6c5d3f', 800: '#554a34', 900: '#423a2a',
        },
        neutral: {
          50: '#faf8f5', 100: '#f0ece1', 200: '#e5dec8', 300: '#d1c7aa', 400: '#bcad86',
          500: '#a39266', 600: '#88774f', 700: '#6c5d3f', 800: '#554a34', 900: '#423a2a',
        },
        forest: { 
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        cream: { 
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
        },
        amber: { 
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
      },
      fontFamily: {
        display: ['"DM Sans"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fill-bar': 'fillBar 1s ease-out forwards',
        'float': 'none',
        'count-up': 'countUp 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'pulse-slow': 'none',
      },
      keyframes: {
        fillBar: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--fill-width)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'warm': 'none',
        'warm-lg': 'none',
        'card': '0 1px 2px rgba(0,0,0,0.02)',
      },
    },
  },
  plugins: [],
}
