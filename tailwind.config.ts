import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:    '#0c0e13',
        bg2:   '#11141b',
        bg3:   '#181c26',
        bg4:   '#1f2435',
        c1:    '#00d4ff',
        c2:    '#ff6b35',
        c3:    '#8b5cf6',
        c4:    '#00e87a',
      },
      fontFamily: {
        barlow: ['"Barlow Condensed"', 'sans-serif'],
        syne:   ['Syne', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
