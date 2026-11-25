/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom Light & Dark Theme Palettes
        brand: {
          navy: '#25364A',
          teal: '#426B72',
          lightTeal: '#D7E2DF',
          accent: '#8DAEAA',
        },
        surface: {
          lightBg: '#F5F6F4',
          lightCard: '#FFFFFF',
          lightBorder: '#E5E8E5',
          lightText: '#263238',
          lightMuted: '#77818A',
          
          darkBg: '#17232D',
          darkSidebar: '#1D2C37',
          darkCard: '#243541',
          darkBorder: '#354651',
          darkText: '#E7ECEB',
          darkMuted: '#A2AFB5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
