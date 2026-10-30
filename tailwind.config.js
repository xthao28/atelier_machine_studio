/**
 * Theme values come from the ATELIER MACHINE tokens, never from literals here.
 * Source: design-system-artifact/project/tokens.json (see DESIGN_SYSTEM.md §0).
 * Utility names mirror token names: bg-am-paper-shade, text-am-h1, p-space-4, border-line, rounded-pill.
 */
const tokens = require("./design-system-artifact/project/tokens.json");

const byName = (list) => Object.fromEntries(list.map((t) => [t.name, t.value]));
const typeStyles = tokens.type.groups.flatMap((g) => g.styles.map((s) => ({ ...s, family: g.family })));

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./episodes/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Every colour token as a CSS variable, so [data-theme="dark"] switches surface/on-surface/muted/rule/grid-line.
        am: Object.fromEntries(tokens.color.tokens.map((t) => [t.name, `var(--${t.name})`])),
        // XUNA device LCD sprite palette (LILYGO T-Display-S3). Only for pixel art drawn inside the LCD screen,
        // never for layout, type or graphics: those use the `am` colours.
        lcd: {
          wall: "#393342",
          floor: "#776487",
          floorShadow: "#584B67",
          olive: "#929D5A",
          oliveShadow: "#66723E",
          pet: "#D87949",
          petShadow: "#AC5336",
          cream: "#E6D8BC",
          outline: "#211E29",
        },
      },
      fontFamily: Object.fromEntries(
        Object.entries(tokens.type.families).map(([key, stack]) => [key, stack.split(/,\s*/)]),
      ),
      fontSize: Object.fromEntries(
        typeStyles.map((s) => [
          `am-${s.name}`,
          [s.fontSize, { lineHeight: String(s.lineHeight), letterSpacing: s.letterSpacing, fontWeight: String(s.fontWeight) }],
        ]),
      ),
      spacing: byName(tokens.spacing.tokens),
      borderWidth: Object.fromEntries(tokens.stroke.tokens.map((t) => [t.name.replace(/^stroke-/, ""), t.value])),
      borderRadius: Object.fromEntries(tokens.radius.tokens.map((t) => [t.name.replace(/^radius-/, ""), t.value])),
    },
  },
  plugins: [],
};
