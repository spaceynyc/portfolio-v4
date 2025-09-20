import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const palette = {
  ink: {
    50: "#F5F5F7",
    100: "#E6E6EC",
    200: "#C8C8D2",
    300: "#A9A9B7",
    400: "#84849A",
    500: "#62627B",
    600: "#44445A",
    700: "#2B2B3B",
    800: "#161625",
    900: "#0B0B13",
    DEFAULT: "#0B0B0B"
  },
  iris: {
    50: "#F4F2FF",
    100: "#E8E1FF",
    200: "#D0C6FF",
    300: "#B19FFF",
    400: "#9278FF",
    500: "#7551FF",
    600: "#5A34F4",
    700: "#4526D1",
    800: "#341E9F",
    900: "#271879",
    DEFAULT: "#7551FF"
  },
  lavender: {
    50: "#FBF8FF",
    100: "#F3ECFF",
    200: "#E1D4FF",
    300: "#C7ACFF",
    400: "#AB86FF",
    500: "#9263FF",
    600: "#7A45E6",
    700: "#5E34B3",
    800: "#452582",
    900: "#2D1856",
    DEFAULT: "#C7ACFF"
  },
  slate: {
    50: "#F7F7FA",
    100: "#EBEBF1",
    200: "#D9D9E3",
    300: "#C1C2D1",
    400: "#A3A5B5",
    500: "#86889B",
    600: "#696C80",
    700: "#505366",
    800: "#3A3D4B",
    900: "#252633",
    DEFAULT: "#C1C2D1"
  },
  mint: {
    50: "#F2FFF8",
    100: "#D9FBE8",
    200: "#B8F5D6",
    300: "#8EE7C0",
    400: "#5FD3A7",
    500: "#39BD91",
    600: "#279974",
    700: "#1C7559",
    800: "#125341",
    900: "#093026",
    DEFAULT: "#39BD91"
  }
} as const;

const glassLevels = {
  100: { blur: "8px", backgroundMix: 12, highlightMix: 4, borderMix: 18, shadow: "depth-1" },
  200: { blur: "10px", backgroundMix: 16, highlightMix: 6, borderMix: 24, shadow: "depth-1" },
  300: { blur: "12px", backgroundMix: 20, highlightMix: 8, borderMix: 28, shadow: "depth-2" },
  400: { blur: "14px", backgroundMix: 24, highlightMix: 10, borderMix: 32, shadow: "depth-3" },
  500: { blur: "16px", backgroundMix: 28, highlightMix: 12, borderMix: 36, shadow: "depth-3" },
  600: { blur: "18px", backgroundMix: 32, highlightMix: 14, borderMix: 40, shadow: "depth-4" },
  700: { blur: "22px", backgroundMix: 36, highlightMix: 18, borderMix: 48, shadow: "depth-5" }
} as const;

const typeScale = {
  display: [
    "clamp(2.75rem, 4vw + 1.25rem, 4.75rem)",
    { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "600" }
  ],
  title: [
    "clamp(2rem, 3vw + 1rem, 3.25rem)",
    { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "600" }
  ],
  lead: [
    "clamp(1.5rem, 2vw + 0.75rem, 2.25rem)",
    { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "500" }
  ],
  body: [
    "clamp(1rem, 1vw + 0.75rem, 1.2rem)",
    { lineHeight: "1.6", letterSpacing: "0em", fontWeight: "400" }
  ],
  micro: [
    "clamp(0.75rem, 0.6vw + 0.65rem, 0.9rem)",
    { lineHeight: "1.6", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: "500" }
  ]
} as const;

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: palette,
      borderRadius: {
        xs: "0.125rem",
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem"
      },
      boxShadow: {
        "depth-1": "0 1px 2px -1px rgba(8, 12, 24, 0.25), 0 1px 1px rgba(8, 12, 24, 0.12)",
        "depth-2": "0 4px 12px -4px rgba(8, 12, 24, 0.35), 0 2px 6px -2px rgba(8, 12, 24, 0.22)",
        "depth-3": "0 10px 24px -8px rgba(6, 10, 24, 0.4), 0 4px 12px -4px rgba(6, 10, 24, 0.25)",
        "depth-4": "0 16px 32px -10px rgba(4, 8, 24, 0.45), 0 6px 16px -6px rgba(4, 8, 24, 0.3)",
        "depth-5": "0 28px 56px -12px rgba(2, 6, 20, 0.5), 0 12px 28px -10px rgba(2, 6, 20, 0.35)"
      },
      opacity: {
        4: "0.04",
        8: "0.08",
        12: "0.12",
        16: "0.16",
        24: "0.24",
        32: "0.32",
        48: "0.48",
        64: "0.64",
        72: "0.72",
        80: "0.8",
        88: "0.88",
        96: "0.96"
      },
      transitionDuration: {
        120: "120ms",
        160: "160ms",
        240: "240ms",
        320: "320ms",
        400: "400ms",
        "t-in": "180ms",
        "t-out": "240ms",
        "t-snap": "320ms"
      },
      transitionTimingFunction: {
        "t-in": "cubic-bezier(0.32, 0, 0.67, 0)",
        "t-out": "cubic-bezier(0.33, 1, 0.68, 1)",
        "t-snap": "cubic-bezier(0.16, 1, 0.3, 1)",
        calm: "cubic-bezier(0.215, 0.61, 0.355, 1)",
        "calm-inout": "cubic-bezier(0.86, 0, 0.07, 1)"
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      fontSize: typeScale
    }
  },
  plugins: [
    plugin(({ addUtilities, theme }) => {
      const base = theme("colors.ink.900") as string;
      const accent = theme("colors.iris.400") as string;
      const glow = theme("colors.lavender.200") as string;

      const surfaceUtilities = Object.entries(glassLevels).reduce(
        (utilities, [key, settings]) => {
          utilities[`.surface-glass-${key}`] = {
            backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${base} ${settings.backgroundMix}%, transparent) 0%, color-mix(in srgb, ${accent} ${settings.highlightMix}%, transparent) 65%, color-mix(in srgb, ${glow} ${settings.highlightMix}%, transparent) 100%)`,
            backgroundColor: `color-mix(in srgb, ${base} ${settings.backgroundMix / 2}%, transparent)`,
            border: `1px solid color-mix(in srgb, ${base} ${settings.borderMix}%, transparent)`,
            boxShadow: theme(`boxShadow.${settings.shadow}`) as string,
            backdropFilter: `blur(${settings.blur})`,
            WebkitBackdropFilter: `blur(${settings.blur})`
          };
          return utilities;
        },
        {} as Record<string, Record<string, string>>
      );

      addUtilities(surfaceUtilities);
    })
  ]
};

export default config;
