/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fira Code', 'monospace'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        orange: {
          300: '#fdba74',
          500: '#f97316',
          600: '#ea580c',
        },
        'red-orange': {
          400: '#ff6b4a',
          500: '#ff5533',
          600: '#e64422',
        },
        dark: {
          900: '#0a0e27',
          800: '#121829',
          700: '#1a1f3a',
          600: '#1e2642',
          500: '#303654',
        }
      },
    },
  },
  plugins: [],
}
