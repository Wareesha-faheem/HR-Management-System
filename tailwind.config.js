/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "-apple-system", "sans-serif"],
        display: ['"Space Grotesk"', "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        navy: {
          950: "#04070F",
          900: "#060B1E",
          800: "#0A1330",
          700: "#101B45",
          600: "#152358",
        },
        brand: {
          DEFAULT: "#1E5EFF",
          dark: "#0B2A9C",
          light: "#22B2FF",
        },
        primary: "rgb(var(--text-primary) / <alpha-value>)",
        secondary: "rgb(var(--text-secondary) / <alpha-value>)",
        surface: "rgb(var(--bg-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--bg-surface-2) / <alpha-value>)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #0B2A9C 0%, #1E5EFF 55%, #22B2FF 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(11,42,156,0.15) 0%, rgba(30,94,255,0.12) 55%, rgba(34,178,255,0.10) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(6, 11, 30, 0.28)",
        "glow-brand": "0 0 40px -8px rgba(34, 178, 255, 0.55)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-in": { from: { opacity: 0, transform: "translateY(4px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-400px 0" }, "100%": { backgroundPosition: "400px 0" } },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
