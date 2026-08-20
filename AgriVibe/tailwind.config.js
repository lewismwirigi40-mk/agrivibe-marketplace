/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },

      colors: {
        agrivibe: {
          dark: "#0B120D",
          darker: "#07100A",
          green: "#2E7D32",
          "green-light": "#4CAF50",
          "green-soft": "#66BB6A",
          gold: "#F5A623",
          "gold-light": "#F7C948",
          cream: "#FFFDF7",
        },
      },

      boxShadow: {
        "agrivibe-sm": "0 4px 16px rgba(0, 0, 0, 0.08)",
        "agrivibe-md": "0 10px 30px rgba(0, 0, 0, 0.10)",
        "agrivibe-lg": "0 20px 60px rgba(0, 0, 0, 0.15)",
        "agrivibe-green": "0 10px 30px rgba(46, 125, 50, 0.25)",
        "agrivibe-gold": "0 10px 30px rgba(245, 166, 35, 0.25)",
      },

      borderRadius: {
        "4xl": "2rem",
      },

      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-up": "fadeUp 0.6s ease-out",
        float: "float 3s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2.5s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },

        fadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        float: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-8px)",
          },
        },

        pulseSoft: {
          "0%, 100%": {
            boxShadow: "0 0 0 rgba(245, 166, 35, 0)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(245, 166, 35, 0.25)",
          },
        },
      },
    },
  },

  plugins: [],
};