import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          950: "#06182B",
          900: "#0B2540",
          800: "#103253",
          700: "#143E68",
          500: "#3B5BFE",
          400: "#6486FF",
          300: "#9DB2FF",
          100: "#E7ECFF",
        },
        ink: {
          900: "#0F172A",
          700: "#1F2937",
          500: "#475569",
          400: "#64748B",
          300: "#94A3B8",
          200: "#CBD5E1",
          150: "#E2E8F0",
          100: "#F1F5F9",
          50: "#F8FAFC",
        },
        paper: "#FFFFFF",
        success: {
          DEFAULT: "#059669",
          ink: "#047857",
          bg: "#ECFDF5",
        },
        warn: {
          DEFAULT: "#D97706",
          ink: "#B45309",
          bg: "#FFFBEB",
        },
        danger: {
          DEFAULT: "#DC2626",
          ink: "#B91C1C",
          bg: "#FEF2F2",
        },
        info: {
          DEFAULT: "#0284C7",
          ink: "#0369A1",
          bg: "#F0F9FF",
        },
        accent: {
          violet: "#7C3AED",
          violetBg: "#F5F3FF",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        display: ["Inter Tight", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        micro: [
          "11px",
          { lineHeight: "16px", letterSpacing: "0.06em", fontWeight: "500" },
        ],
        small: ["12.5px", { lineHeight: "18px" }],
        body: ["14px", { lineHeight: "20px" }],
        h3: ["16px", { lineHeight: "24px", fontWeight: "600" }],
        h2: ["18px", { lineHeight: "26px", fontWeight: "600" }],
        h1: ["22px", { lineHeight: "30px", fontWeight: "600", letterSpacing: "-0.01em" }],
        display: ["28px", { lineHeight: "34px", fontWeight: "600", letterSpacing: "-0.01em" }],
        "display-xl": ["34px", { lineHeight: "40px", fontWeight: "600", letterSpacing: "-0.02em" }],
        "mono-lg": ["22px", { lineHeight: "28px", fontWeight: "500" }],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(15,23,42,0.04)",
        md: "0 4px 12px rgba(15,23,42,0.06)",
        lg: "0 12px 32px rgba(15,23,42,0.10)",
        glow: "0 0 0 1px rgba(59,91,254,0.20), 0 8px 24px rgba(59,91,254,0.18)",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.9)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        overlayShow: { from: { opacity: "0" }, to: { opacity: "1" } },
        contentShow: {
          from: { opacity: "0", transform: "translate(-50%, -48%) scale(.98)" },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "fade-in": "fadeIn 200ms ease-out",
        "overlay-show": "overlayShow 150ms ease-out",
        "content-show": "contentShow 180ms cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer: "shimmer 2.4s linear infinite",
      },
      backgroundImage: {
        "ai-gradient": "linear-gradient(135deg, #3B5BFE 0%, #7C3AED 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
