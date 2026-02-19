/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
            DEFAULT: '#7c3aed', // Violet-600
            dark: '#6d28d9',    // Violet-700
            light: '#a78bfa',   // Violet-400
        },
        secondary: '#db2777',   // Pink-600
        success: {
            DEFAULT: '#10b981', // Emerald-500
            dark: '#059669',    // Emerald-600
            light: '#34d399',   // Emerald-400
        },
        danger: {
            DEFAULT: '#f43f5e', // Rose-500
            dark: '#e11d48',    // Rose-600
            light: '#fb7185',   // Rose-400
        },
        warning: {
            DEFAULT: '#f59e0b', // Amber-500
            dark: '#b45309',    // Amber-700
        },
        dark: {
            DEFAULT: '#1e293b', // Slate-900
            light: '#334155',   // Slate-700
            lighter: '#475569', // Slate-600
        },
        light: {
            DEFAULT: '#f8fafc', // Slate-50
            dark: '#e2e8f0',    // Slate-200
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'glass-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
