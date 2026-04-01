/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'skretting-teal': '#00A5B5',
        'skretting-navy': '#1A2B4A',
        'skretting-orange': '#E87722',
        'skretting-light': '#F4F5F6',
        'skretting-border': '#D1D5DB',
        'skretting-muted': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
