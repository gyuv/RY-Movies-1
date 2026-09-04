import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Arcade Navy Blue + Arcade Gold — global palette ──
        // Legacy tokens are repointed to the Arcade palette so every page
        // adopts it automatically.
        ink: {
          DEFAULT: "#060B24", // deep arcade navy — house background
          raised: "#0F1A44", // navy card / surface
          line: "#22306A", // navy hairline dividers
        },
        paper: {
          DEFAULT: "#F3F1FF", // soft off-white primary text
          dim: "#9FA8C7", // muted navy-tinted metadata text
        },
        marquee: {
          DEFAULT: "#C9A227", // arcade gold — primary brand accent
          hot: "#E5C15B",
        },
        reel: {
          teal: "#3B82F6", // arcade blue accent
          rose: "#C9A227", // gold alert/accent
        },
        // Arcade palette (canonical names)
        arcade: {
          navy: "#0B1437", // core arcade navy
          deep: "#060B24", // deepest navy (page ground)
          panel: "#0F1A44", // raised navy glass panels
          line: "#22306A", // hairline dividers
          blue: "#3B82F6", // arcade royal blue
          blueHot: "#60A5FA",
          gold: "#C9A227", // arcade gold
          goldHot: "#E5C15B",
        },
        // apex.* kept as aliases so existing components recolor for free.
        apex: {
          void: "#060B24", // page ground → deep navy
          abyss: "#081030",
          panel: "#0F1A44",
          hair: "#22306A",
          cyan: "#C9A227", // primary accent → arcade gold
          violet: "#3B82F6", // secondary accent → arcade blue
          magenta: "#E5C15B", // tertiary → gold-hot
          amber: "#C9A227",
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
          "radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.14), transparent 60%)",
        "apex-portal":
          "radial-gradient(circle at center, rgba(59,130,246,0.35), rgba(201,162,39,0.14) 40%, transparent 70%)",
      },
      letterSpacing: {
        stub: "0.22em",
      },
      boxShadow: {
        "apex-glow": "0 0 0 1px rgba(201,162,39,0.40), 0 8px 40px -8px rgba(201,162,39,0.50)",
        "apex-violet": "0 0 0 1px rgba(59,130,246,0.45), 0 10px 50px -10px rgba(59,130,246,0.55)",
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
