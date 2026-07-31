/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // A calm clinical-teal palette instead of a generic default blue,
        // to keep the healthcare theme distinctive.
        ink: '#0B2A34',
        teal: {
          50: '#EEF9F8',
          100: '#D5F0EE',
          200: '#AEE2DE',
          300: '#7ACDC7',
          400: '#45B3AB',
          500: '#1F978E',
          600: '#157A73',
          700: '#12615D',
          800: '#124E4B',
          900: '#0F3E3C',
        },
        cloud: '#F6FAF9',
        coral: '#FF8A65',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -4px rgba(15, 62, 60, 0.12)',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.55' },
          '50%': { transform: 'scale(1.08)', opacity: '0.85' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseSlow: 'pulseSlow 3s ease-in-out infinite',
        fadeUp: 'fadeUp 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
