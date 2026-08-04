import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0D10", // near-black house background
          raised: "#14171C", // card / surface
          line: "#232830", // hairline dividers
        },
        paper: {
          DEFAULT: "#F2EFE9", // ticket-stub off-white for primary text
          dim: "#9A9FA8", // muted metadata text
        },
        marquee: {
          DEFAULT: "#E8A33D", // amber bulb accent — primary brand
          hot: "#F2B65B",
        },
        reel: {
          teal: "#34D0A8", // "Free" badge
          rose: "#E85B4B", // "Rent/Buy" badge / alerts
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        sprockets:
          "repeating-linear-gradient(90deg, transparent 0 18px, #232830 18px 20px)",
      },
      letterSpacing: {
        stub: "0.22em",
      },
    },
  },
  plugins: [],
};
export default config;
