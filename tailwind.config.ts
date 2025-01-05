import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundSize: {
        "size-1000": "1000% 1000%",
        "size-200": "200% 200%",
      },
      backgroundPosition: {
        "pos-0": "0% 0%",
        "pos-100": "100% 100%",
        "pos-300": "300% 300%",
      },
      colors: {
        terracotta: {
          50: "#FFE8DE",
          100: "#FFCCB3",
          200: "#FFB38D",
          300: "#FF9966",
          400: "#D97A4F",
          500: "#3D3029",
          600: "#2E241F",
          650: "#302A27",
          700: "#2A2522",
          750: "#2e2924",
          800: "#201D1A",
          900: "#1C1917",
          950: "#171514",
        },
        coffee: {
          600: "#4A3D37",
          700: "#3A2E29",
        },
        "yellow-pastel": "#E0C097",
      },
    },
  },
  safelist: [
    { pattern: /^bg-\w+-\d+$/, variants: ["hover"] },
    { pattern: /^p-\d+$/ },
    { pattern: /^from-\w+-\d+/, variants: ["hover"] },
    { pattern: /^text-\w+-\d+/, variants: ["hover"] },
  ],
  plugins: [],
};
export default config;
