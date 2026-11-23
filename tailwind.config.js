/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#F6F4EF',
          card: '#FFFFFF',
          secondary: '#EFECE4',
          border: '#E4DFD3',
          borderHover: '#DDD7C9',
          text: '#1C1917',
          muted: '#78716C',
          label: '#57534E',
        },
        forest: {
          DEFAULT: '#1B4D3E',
          hover: '#143A2F',
          soft: '#E7F0EC',
        },
        amber: {
          DEFAULT: '#D97706',
          soft: '#FEF3C7',
          dark: '#92400E',
        },
        danger: {
          DEFAULT: '#DC2626',
          soft: '#FEE2E2',
        }
      },
      fontFamily: {
        serif: ['"Fraunces"', 'serif'],
        sans: ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(28, 25, 23, 0.04)',
        'sheet': '0 -8px 24px rgba(28, 25, 23, 0.08)',
        'btn': '0 1px 3px rgba(28, 25, 23, 0.06)',
      }
    },
  },
  plugins: [],
}
