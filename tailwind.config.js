/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        // Add the new slide animations here
        'slide-out-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        // Add the new slide animations
        'slide-out-left': 'slide-out-left 0.3s ease-in-out',
        'slide-out-right': 'slide-out-right 0.3s ease-in-out',
        'slide-in-left': 'slide-in-left 0.3s ease-in-out',
        'slide-in-right': 'slide-in-right 0.3s ease-in-out'
      }
    },
  },
  plugins: [],
}
