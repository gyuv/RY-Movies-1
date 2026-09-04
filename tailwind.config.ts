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
        // ── Project Apex: OLED + neon spatial palette ──
        apex: {
          void: "#000000", // true OLED black
          abyss: "#050505", // near-black surface base
          panel: "#0A0B0F", // raised glass panels
          hair: "#1A1D26", // hairline dividers
          cyan: "#22E6D8", // primary neon accent
          violet: "#8B5CF6", // secondary neon accent
          magenta: "#F02FB2", // tertiary hot accent
          amber: "#E8A33D", // legacy brand carry-over
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        heading: ["var(--font-heading)", "var(--font-body)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        sprockets:
          "repeating-linear-gradient(90deg, transparent 0 18px, #232830 18px 20px)",
        "apex-radial":
          "radial-gradient(ellipse at 50% 0%, rgba(34,230,216,0.12), transparent 60%)",
        "apex-portal":
          "radial-gradient(circle at center, rgba(139,92,246,0.35), rgba(34,230,216,0.12) 40%, transparent 70%)",
      },
      letterSpacing: {
        stub: "0.22em",
      },
      boxShadow: {
        "apex-glow": "0 0 0 1px rgba(34,230,216,0.35), 0 8px 40px -8px rgba(34,230,216,0.45)",
        "apex-violet": "0 0 0 1px rgba(139,92,246,0.4), 0 10px 50px -10px rgba(139,92,246,0.5)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px) scale(1.02)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "apex-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "apex-pulse": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" },
        },
        "apex-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "apex-sheen": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "apex-bar": {
          "0%": { transform: "scaleX(0)", opacity: "0" },
          "100%": { transform: "scaleX(1)", opacity: "1" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "apex-float": "apex-float 6s ease-in-out infinite",
        "apex-pulse": "apex-pulse 3.5s ease-in-out infinite",
        "apex-shimmer": "apex-shimmer 1.6s linear infinite",
        "apex-sheen": "apex-sheen 6s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
