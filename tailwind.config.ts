import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        codeblock: "var(--codeblock-color)",
        text: "var(--text-color)",
        h1: "var(--h1-color)",
        h2: "var(--h2-color)",
        h3: "var(--h3-color)",
        h4: "var(--h4-color)",
        h5: "var(--h5-color)",
        p: "var(--p-color)",
        link: "var(--link-color)",
        internal: "var(--internal-color)",

        "primary-50": "var(--primary-50)",
        "primary-100": "var(--primary-100)",
        "primary-200": "var(--primary-200)",
        "primary-300": "var(--primary-300)",
        "primary-400": "var(--primary-400)",
        "primary-500": "var(--primary-500)",
        "primary-900": "var(--primary-900)",

        "sub-100": "var(--sub-100)",
        "sub-200": "var(--sub-200)",
        "sub-300": "var(--sub-300)",
        "sub-500": "var(--sub-500)",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scroll-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    }),
  ],
} satisfies Config;
