/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          charcoal: '#171717',
          forestGreen: '#06110C',
          crimson: '#A31C18',
          crimsonHover: '#C4271F',
          crimsonTintDark: '#FF5A52',
          accentShine: '#1FD88A',
          highlightDark: '#2A0F0E',
          highlightLight: '#FBE9E8',
        },
        dark: {
          bg: '#06110C',
          surface: '#171717',
          card: '#171717',
          sidebar: '#0B1A13',
          border: '#2A322D',
          text: '#F4F6F5',
          textMuted: '#9AA6A0',
          primary: '#A31C18',
          primaryHover: '#C4271F',
          accent: '#1FD88A',
          highlight: '#2A0F0E',
          success: '#22C55E',
          warning: '#F5B301',
          danger: '#FF5A52',
        },
        light: {
          bg: '#F5F7F6',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          sidebar: '#171717',
          border: '#E2E8E4',
          text: '#171717',
          textMuted: '#5E6A64',
          primary: '#A31C18',
          primaryHover: '#8A1713',
          accent: '#0E7A4F',
          highlight: '#FBE9E8',
          success: '#15803D',
          warning: '#B45309',
          danger: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Devanagari"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card-glow': '0 0 24px rgba(31, 216, 138, 0.25)',
        'button-glow': '0 0 20px rgba(163, 28, 24, 0.35)',
        'dark-card': '0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(42, 50, 45, 0.5)',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
};
