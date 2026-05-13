import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"],
  theme: {
    extend: {
      colors: {
        actionBlue: {
          DEFAULT: "#0066cc",
          focus: "#0071e3",
          onDark: "#2997ff"
        },
        canvas: {
          DEFAULT: "#ffffff",
          parchment: "#f5f5f7"
        },
        surface: {
          tile1: "#272729",
          tile2: "#2a2a2c",
          tile3: "#252527",
          black: "#000000"
        },
        ink: {
          DEFAULT: "#1d1d1f",
          muted80: "#333333",
          muted48: "#7a7a7a"
        },
        hairline: "#e0e0e0"
      },
      fontFamily: {
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        text:    ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      borderRadius: {
        "0":   "0",
        xs:    "5px",
        sm:    "8px",
        md:    "11px",
        lg:    "18px",
        pill:  "9999px"
      },
      spacing: {
        rhythm:  "21px",
        "17":    "17px",
        section: "80px"
      },
      fontSize: {
        hero:    ["56px",  { lineHeight: "1.07", letterSpacing: "-0.28px",  fontWeight: "600" }],
        dlg:     ["40px",  { lineHeight: "1.10", letterSpacing: "0",        fontWeight: "600" }],
        dmd:     ["34px",  { lineHeight: "1.47", letterSpacing: "-0.374px", fontWeight: "600" }],
        lead:    ["28px",  { lineHeight: "1.14", letterSpacing: "0.196px",  fontWeight: "400" }],
        airy:    ["24px",  { lineHeight: "1.50", letterSpacing: "0",        fontWeight: "300" }],
        tagline: ["21px",  { lineHeight: "1.19", letterSpacing: "0.231px",  fontWeight: "600" }],
        body:    ["17px",  { lineHeight: "1.47", letterSpacing: "-0.374px", fontWeight: "400" }],
        nav:     ["12px",  { lineHeight: "1.00", letterSpacing: "-0.12px",  fontWeight: "400" }]
      }
    }
  },
  plugins: []
};

export default config;
