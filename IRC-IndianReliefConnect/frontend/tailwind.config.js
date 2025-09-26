/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        deepBlue: '#0A2A4E',
        cyan: '#40B9D6',
        orange: '#F77F00',
        pure: '#FFFFFF',
      },
      boxShadow: {
        glow: '0 0 40px rgba(64, 185, 214, 0.35)'
      }
    },
  },
  plugins: [],
}
