/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: '#E50046',
        peach: '#FDAB9E',
        cream: '#1a1a2e',
        mint: '#C7DB9C',
        bg: '#FFF0BD',
        'bg-light': '#F0E4A0',
        'bg-card': '#FFF8D6',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        body: ['"VT323"', 'monospace'],
        script: ['"Aston Script"', 'cursive'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pop': 'pop 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'hop': 'hop 0.6s ease infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        pop: { '0%': { transform: 'scale(0.8)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        slideIn: { '0%': { transform: 'translateY(8px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-5px)' } },
        hop: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-3px)' } },
        wiggle: { '0%, 100%': { transform: 'rotate(0)' }, '25%': { transform: 'rotate(-3deg)' }, '75%': { transform: 'rotate(3deg)' } },
      },
      boxShadow: {
        'pixel': '3px 3px 0px rgba(0,0,0,0.2)',
        'pixel-sm': '2px 2px 0px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}
