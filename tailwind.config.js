/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
          light: '#A78BFA',
        },
        dark: {
          DEFAULT: '#111827',
          lighter: '#1F2937',
          lightest: '#374151',
        },
        accent: '#C4B5FD',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
