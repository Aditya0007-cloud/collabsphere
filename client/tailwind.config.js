/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 18px 70px rgba(17, 24, 39, 0.18)',
        panel: '0 12px 34px rgba(15, 23, 42, 0.08)'
      },
      animation: {
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite'
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '0.78' },
          '50%': { opacity: '1' }
        }
      }
    }
  },
  plugins: []
};
