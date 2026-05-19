/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        carbon: "#0a0d0b",
        smoke: "#111512",
        acid: "#d7ff3f",
        plasma: "#ff4d6d",
        aqua: "#32e5ff",
        saffron: "#ffc247",
        mint: "#19ffa5",
      },
      boxShadow: {
        glow: "0 0 42px rgba(215, 255, 63, 0.18)",
        ember: "0 18px 60px rgba(255, 77, 109, 0.16)",
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
