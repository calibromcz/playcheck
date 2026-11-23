/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          bg: '#F4EFE6',
          card: '#FFFDF8',
          border: '#141414',
          ink: '#141414',
        },
        risograph: {
          vermilion: '#FF4522',
          yellow: '#FFE600',
          lime: '#B8FF2C',
          cobalt: '#2447FF',
          lilac: '#D7C4FF',
        }
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px #141414',
        'brutal': '3px 3px 0px #141414',
        'brutal-lg': '5px 5px 0px #141414',
        'brutal-active': '0px 0px 0px #141414',
      }
    },
  },
  plugins: [],
}
