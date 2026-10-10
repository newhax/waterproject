/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        ocean: {
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(8,51,68,0.04), 0 4px 16px rgba(8,51,68,0.06)',
        lift: '0 8px 30px rgba(8,51,68,0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        ripple: 'ripple 2.4s ease-out infinite',
      },
    },
  },
  plugins: [],
};
