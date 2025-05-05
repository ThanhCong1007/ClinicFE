/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      scale: {
        '103': '1.03',
      },
      keyframes: {
        growDown: {
          '0%': { transform: 'scaleY(0)' },
          '80%': { transform: 'scaleY(1.05)' },
          '100%': { transform: 'scaleY(1)' },
        },
        stickyTransition: {
          'from': { transform: 'translateY(-10px)', opacity: '0.8' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        growDown: 'growDown 0.3s ease-in-out forwards',
        stickyTransition: 'stickyTransition 0.2s ease-out',
      },
    },
  },
  plugins: [],
}