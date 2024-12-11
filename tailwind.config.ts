import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background-color)",
        highlight: "var(--highlight-color)",
        lightened: "var(--lightened-color)",
        light: "var(--light-color)",
        h1: "var(--h1-color)",
        h2: "var(--h2-color)",
        h3: "var(--h3-color)",
        h4: "var(--h4-color)",
        h5: "var(--h5-color)",
        p: "var(--p-color)",
      },
    },
  },
  plugins: [],
} satisfies Config;
