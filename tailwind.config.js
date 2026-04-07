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
        forest: {
          50:  '#edf4ef',
          100: '#d0e6d7',
          200: '#a2ccb1',
          300: '#70b089',
          400: '#459464',
          500: '#2a7a4b',
          600: '#1f6038',
          700: '#1a3a2a',
          800: '#132b1f',
          900: '#0b1c14',
        },
        cream: {
          50:  '#fdfcf9',
          100: '#f5f0e8',
          200: '#ede4d2',
          300: '#e0d3bb',
          400: '#cdbf9f',
          500: '#b8a882',
        },
        amber: {
          400: '#d4824a',
          500: '#c4692a',
          600: '#a8531e',
          700: '#8a4018',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fill-bar': 'fillBar 1s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'count-up': 'countUp 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fillBar: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--fill-width)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'warm': '0 4px 24px rgba(26, 58, 42, 0.12)',
        'warm-lg': '0 8px 40px rgba(26, 58, 42, 0.18)',
        'card': '0 2px 16px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
