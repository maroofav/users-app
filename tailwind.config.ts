export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Ensure all relevant files are included
    './src/**/*.{vue,html}', // Add any other file types you may be using
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
