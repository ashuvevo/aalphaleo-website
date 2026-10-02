/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./build/**/*.js', './out/**/*.html'],
  theme: {
    extend: {
      colors: {
        primary: '#29292A',
        orange: '#F87820',
        secondary: '#FC6025',
        accent: '#F87820',
        'accent-light': '#FC6025',
        'accent-teal': '#25D366',
        white: '#FFFFFF',
        background: '#FFF8F3',
        border: '#F0E6DC',
        surface: '#FFFFFF',
        'surface-raised': '#FFFFFF',
        text: '#29292A',
        muted: '#555555',
        bg: '#FFF8F3',
        success: '#F87820',
        clay: '#FFFFFF',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      borderRadius: {
        btn: '12px',
        card: '16px',
        input: '12px',
      },
      boxShadow: {
        soft: '0 12px 40px rgb(41 41 42 / 0.06)',
        lift: '0 16px 48px rgb(41 41 42 / 0.1)',
        'neu-sm': '0 8px 24px rgb(41 41 42 / 0.05)',
        inset: 'inset 0 0 0 1px #F0E6DC',
        'inset-deep': 'inset 0 0 0 1px #F0E6DC',
        'inset-sm': 'inset 0 0 0 1px #F0E6DC',
        glow: '0 8px 24px rgb(248 120 32 / 0.28)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(180deg, #F8A020 0%, #F87820 48%, #E82038 100%)',
      },
    },
  },
  plugins: [],
};
