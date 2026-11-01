// ATELIER MACHINE — generated from tokens.json
// Do not edit. Source: design-system-artifact/project/tokens.json · rebuild: npm run ds:build
// Pixel values are numbers on the 1080 px canvas; React treats unitless sizes as px.

/** Fixed brand colours (same in every theme). */
export const color = {
  "paper": "#F4EFE4",
  "card": "#FAF8F3",
  "ink": "#242424",
  "lime": "#D9F57A",
  "lilac": "#D9CBF6",
  "orange": "#FF9B56",
  "paper-shade": "#E7DFCF",
  "ink-soft": "#5C584F",
  "paper-soft": "#B9B5AA"
} as const;

/** Theme-dependent colours: surface, on-surface, muted, rule, grid-line. */
export const themes = {
  "light": {
    "grid-line": "#D6D1C1",
    "surface": "#F4EFE4",
    "on-surface": "#242424",
    "muted": "#5C584F",
    "rule": "#242424"
  },
  "dark": {
    "grid-line": "#3B3B38",
    "surface": "#242424",
    "on-surface": "#F4EFE4",
    "muted": "#B9B5AA",
    "rule": "#F4EFE4"
  }
} as const;

export const fontFamily = {
  "sans": "\"Space Grotesk\", system-ui, sans-serif",
  "mono": "\"IBM Plex Mono\", ui-monospace, monospace"
} as const;

/** Font files in public/fonts/, loaded by src/design-system/fonts.ts before the first frame. */
export const fonts = [
  {
    "family": "Space Grotesk",
    "weight": "400",
    "style": "normal",
    "file": "fonts/SpaceGrotesk-400.ttf"
  },
  {
    "family": "Space Grotesk",
    "weight": "500",
    "style": "normal",
    "file": "fonts/SpaceGrotesk-500.ttf"
  },
  {
    "family": "Space Grotesk",
    "weight": "600",
    "style": "normal",
    "file": "fonts/SpaceGrotesk-600.ttf"
  },
  {
    "family": "Space Grotesk",
    "weight": "700",
    "style": "normal",
    "file": "fonts/SpaceGrotesk-700.ttf"
  },
  {
    "family": "IBM Plex Mono",
    "weight": "400",
    "style": "normal",
    "file": "fonts/IBMPlexMono-400.ttf"
  },
  {
    "family": "IBM Plex Mono",
    "weight": "500",
    "style": "normal",
    "file": "fonts/IBMPlexMono-500.ttf"
  }
] as const;

/** One entry per text style; spread into a style object: `style={{ ...typeStyles.h1 }}`. */
export const typeStyles = {
  "display-xl": {
    "fontFamily": "\"Space Grotesk\", system-ui, sans-serif",
    "fontSize": 220,
    "lineHeight": 0.88,
    "fontWeight": 700,
    "letterSpacing": "-0.045em"
  },
  "display": {
    "fontFamily": "\"Space Grotesk\", system-ui, sans-serif",
    "fontSize": 144,
    "lineHeight": 0.92,
    "fontWeight": 700,
    "letterSpacing": "-0.04em"
  },
  "h1": {
    "fontFamily": "\"Space Grotesk\", system-ui, sans-serif",
    "fontSize": 96,
    "lineHeight": 0.98,
    "fontWeight": 700,
    "letterSpacing": "-0.03em"
  },
  "h2": {
    "fontFamily": "\"Space Grotesk\", system-ui, sans-serif",
    "fontSize": 64,
    "lineHeight": 1.04,
    "fontWeight": 600,
    "letterSpacing": "-0.02em"
  },
  "h3": {
    "fontFamily": "\"Space Grotesk\", system-ui, sans-serif",
    "fontSize": 44,
    "lineHeight": 1.1,
    "fontWeight": 600,
    "letterSpacing": "-0.01em"
  },
  "body-lg": {
    "fontFamily": "\"Space Grotesk\", system-ui, sans-serif",
    "fontSize": 36,
    "lineHeight": 1.35,
    "fontWeight": 500,
    "letterSpacing": "0"
  },
  "body": {
    "fontFamily": "\"Space Grotesk\", system-ui, sans-serif",
    "fontSize": 32,
    "lineHeight": 1.4,
    "fontWeight": 400,
    "letterSpacing": "0"
  },
  "caption": {
    "fontFamily": "\"Space Grotesk\", system-ui, sans-serif",
    "fontSize": 26,
    "lineHeight": 1.35,
    "fontWeight": 400,
    "letterSpacing": "0"
  },
  "label": {
    "fontFamily": "\"IBM Plex Mono\", ui-monospace, monospace",
    "fontSize": 22,
    "lineHeight": 1.2,
    "fontWeight": 500,
    "letterSpacing": "0.08em"
  },
  "meta": {
    "fontFamily": "\"IBM Plex Mono\", ui-monospace, monospace",
    "fontSize": 20,
    "lineHeight": 1.35,
    "fontWeight": 400,
    "letterSpacing": "0.04em"
  },
  "data": {
    "fontFamily": "\"IBM Plex Mono\", ui-monospace, monospace",
    "fontSize": 28,
    "lineHeight": 1.3,
    "fontWeight": 500,
    "letterSpacing": "0"
  }
} as const;

export const space = {
  "space-1": 8,
  "space-2": 16,
  "space-3": 24,
  "space-4": 32,
  "space-5": 48,
  "space-6": 72,
  "space-7": 96,
  "margin-post": 72,
  "gutter": 24,
  "safe-top-vertical": 250,
  "safe-bottom-vertical": 450,
  "safe-right-vertical": 160
} as const;

export const radius = {
  "radius-none": "0",
  "radius-pill": 999,
  "radius-round": "50%"
} as const;

export const stroke = {
  "stroke-hair": 2,
  "stroke-line": 3,
  "stroke-heavy": 6
} as const;

export const texture = {
  "grain-opacity": "0.07",
  "halftone-opacity": "0.35",
  "halftone-pitch": 14,
  "dot-pitch": 24,
  "grid-pitch": 72
} as const;

export type ColorName = keyof typeof color;
export type ThemeId = keyof typeof themes;
export type TypeStyleName = keyof typeof typeStyles;
