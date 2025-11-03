// postcss.config.js
export default {
  plugins: {
    "@tailwindcss/postcss": {},   // ← new
    autoprefixer: {},             // keep if you installed autoprefixer
  },
};
