import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./lib/**/*.{ts,tsx,js,jsx,mdx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        diletta: {
          bg: "#08050A",
          bg2: "#0E0A0C",
          bg3: "#15101A",
          line: "rgba(255,255,255,0.08)",
          line2: "rgba(230,0,0,0.30)",
          text1: "#F5F0F0",
          text2: "#BAB2B5",
          text3: "#7A7378",
          red: "#E60000",
          red2: "#FF3D3D",
          redSoft: "rgba(230,0,0,0.10)",
          redGlow: "rgba(230,0,0,0.35)",
          green: "#2C7A4B",
          amber: "#B8770D",
          blue: "#0563C1",
        },
        tremor: {
          brand: { faint: "#0e1828", muted: "#FCA5A5", subtle: "#F87171", DEFAULT: "#E60000", emphasis: "#FF3D3D", inverted: "#FFFFFF" },
          background: { muted: "#0E0A0C", subtle: "#15101A", DEFAULT: "#08050A", emphasis: "#F5F0F0" },
          border: { DEFAULT: "rgba(255,255,255,0.08)" },
          ring: { DEFAULT: "rgba(255,255,255,0.10)" },
          content: { subtle: "#7A7378", DEFAULT: "#BAB2B5", emphasis: "#F5F0F0", strong: "#FFFFFF", inverted: "#08050A" },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Fraunces", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: { "tremor-card": "0 1px 3px 0 rgba(0,0,0,0.5)", "tremor-input": "0 1px 2px 0 rgba(0,0,0,0.5)", "tremor-dropdown": "0 4px 6px -1px rgba(0,0,0,0.3)" },
      borderRadius: { "tremor-small": "0.375rem", "tremor-default": "0.5rem", "tremor-full": "9999px" },
      fontSize: {
        "tremor-label": ["0.75rem", { lineHeight: "1rem" }],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
    },
  },
  plugins: [],
  safelist: [
    { pattern: /^(bg|text|border|ring|stroke|fill)-(tremor|red|green|amber|blue|gray|slate)-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^(bg|text|border|ring|stroke|fill)-diletta-(bg|bg2|bg3|line|line2|text1|text2|text3|red|red2|redSoft|redGlow|green|amber|blue)$/ },
  ],
};
export default config;
