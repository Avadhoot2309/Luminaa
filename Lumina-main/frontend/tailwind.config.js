/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A1628',
        'navy-light': '#2C4A6E',
        blue: '#4A90D9',
        amber: '#E8920C',
        teal: '#1A7A62',
        'teal-light': '#F0F9F7',
        cream: '#F7F6F2',
        'cream-light': '#FFFBF0',
        yellow: '#FDF6E3',
        'yellow-high': '#FFE500',
        ink: '#1A2635'
      },
      fontFamily: {
        heading: ['Fraunces', 'serif'],
        body: ['Nunito', 'sans-serif'],
        dyslexic: ['OpenDyslexic', 'sans-serif']
      }
    },
  },
  plugins: [],
}
