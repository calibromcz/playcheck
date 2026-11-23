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
        display: ['"Archivo Black"', 'Syne', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px #141414',
        'brutal': '4px 4px 0px #141414',
        'brutal-lg': '6px 6px 0px #141414',
        'brutal-active': '0px 0px 0px #141414',
      }
    },
  },
  plugins: [],
}
