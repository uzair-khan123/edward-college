import type { Config } from "tailwindcss";

// Colors, fonts and spacing below are ported 1:1 from the original
// static site's css/main.css (:root variables) so the visual identity
// carries over exactly into the new Next.js + Tailwind build.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#16233A",
        "ink-2": "#1E304C",
        parchment: "#F4EFE4",
        "parchment-2": "#ECE4D2",
        brass: "#C89B3C",
        "brass-dim": "#9C7A30",
        forest: "#3B5249",
        charcoal: "#1D1D1B",
        cream: "#F4EFE4",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      maxWidth: {
        wrap: "1160px",
      },
    },
  },
  plugins: [],
};
export default config;
