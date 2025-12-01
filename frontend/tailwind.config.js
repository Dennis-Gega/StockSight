/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
      boxShadow: { soft: "0 8px 30px rgba(0,0,0,.08)" },
      container: { center: true, padding: "1rem" },
    },
  },
  plugins: [],
};
