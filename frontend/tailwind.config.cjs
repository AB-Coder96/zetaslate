import colors from 'tailwindcss/colors';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: colors.black,
        white: colors.white,
        zinc: colors.zinc,
        stone: colors.stone,
        neutral: colors.neutral,
        sky: colors.sky,
      },
      fontFamily: {
        serif: ['Cinzel', 'serif'],  // Cinzel for headings
        sans: ['GFS Didot', 'serif'],
      },
    },
  },
  plugins: [],
}
