import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        copa: {
          // Backgrounds
          dark: "#0F0F12",
          section: "#16161A",
          surface: "#1E1E25",
          line: "#2D2D38",
          // Texto
          ink: "#F5F5F7",
          "ink-soft": "#C8C8D0",
          muted: "#9CA3AF",
          "muted-soft": "#A8A8B5",
          // Marca
          red: "#E63946",
          "red-light": "#FF6371",
          blue: "#2A66D6",
          gold: "#E5B872",
          "gold-deep": "#D4A24E",
          "gold-dark": "#C99340",
          "gold-light": "#F5DC9A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui"],
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-in": "fadeIn 1s ease-out forwards",
        shine: "shine 6s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shine: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
