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
        "pixel-white": "#FFFFFF",
        "pixel-brown": "#8B4513",
        "pixel-darkbrown": "#5C2E0B",
        "pixel-lightbrown": "#D2B48C",
        "pixel-cream": "#FDF5E6",
        "pixel-black": "#1A0F0D",
        "pixel-gold": "#FFD700",
        "pixel-green": "#2E8B57",
        "pixel-red": "#CD5C5C",
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
