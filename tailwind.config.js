/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Skretting brand — sourced from skretting.com CSS design tokens
        'skretting-red':        '#C8102E', // Brand primary (--brand__color--primary)
        'skretting-red-dark':   '#A50E25', // Hover state
        'skretting-red-soft':   '#FFECEB', // Light background tint
        'skretting-teal':       '#007D8A', // Aquaculture teal (primary action)
        'skretting-teal-dark':  '#004F57', // Teal hover
        'skretting-teal-soft':  '#E6F4F5', // Teal light background
        'skretting-navy':       '#001F3B', // Deep navy (--brand__color--deepred AQV)
        'skretting-light':      '#F2F2F3', // Page background (--brand__color--softgrey)
        'skretting-border':     '#D0D0D1', // Borders (--brand__color--grey)
        'skretting-muted':      '#84888B', // Secondary text (--brand__color--deepgrey)
      },
      fontFamily: {
        // Skretting uses Sitka Banner (serif) for headings, Arial for body
        sans:  ['Arial', 'system-ui', '-apple-system', '"Helvetica Neue"', 'sans-serif'],
        serif: ['"Sitka Banner"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
