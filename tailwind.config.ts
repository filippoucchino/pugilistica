import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "40px",
        sm: "20px",
        md: "40px",
      },
    },

    extend: {
      colors: {
        brand: {
          DEFAULT: "#C41E1E",
          light: "#D94444",
          dark: "#A51818",
          darker: "#7A1212",
        },
        surface: {
          body: "#0A0A0A",
          DEFAULT: "#111111",
          raised: "#1A1A1A",
          overlay: "#252525",
          card: "rgba(255, 255, 255, 0.02)",
          "card-hover": "rgba(255, 255, 255, 0.04)",
          input: "rgba(255, 255, 255, 0.05)",
          "input-focus": "rgba(255, 255, 255, 0.08)",
        },
        neutral: {
          950: "#111111",
          900: "#1A1A1A",
          800: "#252525",
          700: "#333333",
          600: "#4A4A4A",
          500: "#6B6B6B",
          400: "#8A8A8A",
          300: "#AAAAAA",
          200: "#CCCCCC",
          100: "#E5E5E5",
          50: "#F5F5F5",
        },
        pb: {
          "text-primary": "#FFFFFF",
          "text-secondary": "rgba(255, 255, 255, 0.75)",
          "text-tertiary": "rgba(255, 255, 255, 0.55)",
          "text-muted": "rgba(255, 255, 255, 0.40)",
          "text-faint": "rgba(255, 255, 255, 0.25)",
          "border-default": "rgba(255, 255, 255, 0.08)",
          "border-subtle": "rgba(255, 255, 255, 0.05)",
          "border-medium": "rgba(255, 255, 255, 0.12)",
          "border-strong": "rgba(255, 255, 255, 0.20)",
          "border-accent": "rgba(196, 30, 30, 0.30)",
          "border-accent-strong": "rgba(196, 30, 30, 0.50)",
          success: "#22C55E",
          "success-muted": "rgba(34, 197, 94, 0.15)",
          warning: "#EAB308",
          "warning-muted": "rgba(234, 179, 8, 0.15)",
          info: "#3B82F6",
          "info-muted": "rgba(59, 130, 246, 0.15)",
        },
      },

      fontFamily: {
        display: ["Bebas Neue", "Impact", "sans-serif"],
        body: ["Barlow", "Helvetica Neue", "Arial", "sans-serif"],
      },

      fontSize: {
        "display-hero": [
          "clamp(52px, 8vw, 96px)",
          { lineHeight: "1", letterSpacing: "-0.01em" },
        ],
        "display-lg": [
          "clamp(40px, 5.5vw, 64px)",
          { lineHeight: "1.15", letterSpacing: "-0.01em" },
        ],
        "display-md": [
          "clamp(32px, 4vw, 48px)",
          { lineHeight: "1.15", letterSpacing: "-0.01em" },
        ],
        "display-sm": [
          "clamp(26px, 3vw, 36px)",
          { lineHeight: "1.15", letterSpacing: "0" },
        ],
        xl: ["20px", { lineHeight: "1.6" }],
        lg: ["18px", { lineHeight: "1.6" }],
        base: ["16px", { lineHeight: "1.6" }],
        sm: ["14px", { lineHeight: "1.6" }],
        xs: ["13px", { lineHeight: "1.3" }],
        xxs: ["11px", { lineHeight: "1.3" }],
      },

      letterSpacing: {
        tighter: "-0.02em",
        tight: "-0.01em",
        normal: "0",
        wide: "0.03em",
        wider: "0.06em",
        widest: "0.15em",
      },

      lineHeight: {
        none: "1",
        tight: "1.15",
        snug: "1.3",
        normal: "1.6",
        relaxed: "1.7",
      },

      spacing: {
        "section-y": "80px",
        "section-y-lg": "96px",
        "component-gap": "32px",
        "card-pad": "24px",
        "card-pad-lg": "32px",
        "header-h": "72px",
        "header-h-mobile": "60px",
        "container-max": "1200px",
        "container-narrow": "800px",
        "container-wide": "1400px",
      },

      maxWidth: {
        container: "1200px",
        narrow: "800px",
        wide: "1400px",
        "hero-subtitle": "540px",
      },

      borderRadius: {
        none: "0",
        sm: "2px",
        md: "4px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        full: "9999px",
      },

      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.3)",
        md: "0 4px 12px rgba(0, 0, 0, 0.4)",
        lg: "0 8px 32px rgba(0, 0, 0, 0.5)",
        xl: "0 16px 48px rgba(0, 0, 0, 0.6)",
        glow: "0 0 40px rgba(196, 30, 30, 0.15)",
        "glow-strong": "0 0 60px rgba(196, 30, 30, 0.25)",
        "input-focus": "0 0 0 3px rgba(196, 30, 30, 0.15)",
      },

      transitionTimingFunction: {
        default: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "300ms",
        slow: "500ms",
        slower: "800ms",
      },

      zIndex: {
        base: "0",
        above: "10",
        sticky: "50",
        header: "100",
        dropdown: "200",
        overlay: "300",
        modal: "400",
        toast: "500",
      },

      backdropBlur: {
        header: "20px",
      },

      aspectRatio: {
        "16/10": "16 / 10",
      },

      gridTemplateColumns: {
        footer: "1.5fr 1fr 1fr 1fr",
        "footer-md": "1fr 1fr",
        coach: "200px 1fr",
        step: "56px 1fr",
        local: "1fr 1fr",
      },
    },
  },
  plugins: [],
} satisfies Config;
