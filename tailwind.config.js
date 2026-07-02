/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FBFAF7',
        ink: '#1C2B27',
        pine: {
          50: '#F1F6F4',
          100: '#DEEAE6',
          200: '#BCD5CD',
          300: '#8FB8AC',
          400: '#5E9486',
          500: '#3D7868',
          600: '#2D6A5C',
          700: '#23544A',
          800: '#1C423B',
          900: '#16332D',
        },
        amber: {
          50: '#FDF6E9',
          100: '#FAEACB',
          300: '#F0C375',
          500: '#E8A23D',
          600: '#CC8829',
          700: '#A66E20',
        },
        clay: {
          50: '#FBEFEE',
          100: '#F4D6D4',
          400: '#D17A78',
          500: '#C44545',
          600: '#A93838',
          700: '#852C2C',
        },
        mint: '#EDF3F1',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(28,43,39,0.04), 0 4px 16px rgba(28,43,39,0.06)',
        lift: '0 2px 8px rgba(28,43,39,0.06), 0 12px 32px rgba(28,43,39,0.10)',
      },
      borderRadius: {
        DEFAULT: '10px',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseLine: {
          '0%': { strokeDashoffset: '240' },
          '100%': { strokeDashoffset: '0' },
        },
        dotBounce: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.4s ease-out both',
        pulseLine: 'pulseLine 1.6s ease-out forwards',
        dotBounce: 'dotBounce 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
