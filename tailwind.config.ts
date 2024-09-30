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
        background: "var(--background)",
        foreground: "var(--foreground)",
        navblack: "#242424",
        primary1: "#FC6200",
        primary2: "#FF9800",
        primary1_hover: "#f05b01",
        accent: "#FF8000",
        black2: "#222222",
        hrColor: "#C2C2C2",
      },
    },
  },
  plugins: [],
};
export default config;
