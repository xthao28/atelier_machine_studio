/**
 * ATELIER MACHINE — design system build.
 *
 * Source of truth (never edit the outputs by hand):
 *   design-system-artifact/project/tokens.json            → every token value
 *   design-system-artifact/project/components/bundle.css  → every `.am-*` class
 *
 * Outputs:
 *   src/styles/tokens.css          CSS variables, theme blocks, type classes
 *   src/styles/atelier-machine.css the artifact's bundle.css, fonts served locally
 *   src/design-system/tokens.ts    the same tokens as typed constants for inline styles
 *
 * Run: npm run ds:build
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(__dirname, "..");
const SOURCE_DIR = join(ROOT, "design-system-artifact", "project");
const TOKENS_JSON = join(SOURCE_DIR, "tokens.json");
const BUNDLE_CSS = join(SOURCE_DIR, "components", "bundle.css");
const FONTS_DIR = join(ROOT, "public", "fonts");

const OUT_TOKENS_CSS = join(ROOT, "src", "styles", "tokens.css");
const OUT_BUNDLE_CSS = join(ROOT, "src", "styles", "atelier-machine.css");
const OUT_TOKENS_TS = join(ROOT, "src", "design-system", "tokens.ts");

type Token = { name: string; value: string; usage: string };
type ColorToken = { name: string; value: Record<string, string>; usage: string };
type TypeStyle = {
  name: string;
  fontSize: string;
  lineHeight: number;
  fontWeight: number;
  letterSpacing: string;
  usage: string;
  sample: string;
};
type Tokens = {
  name: string;
  color: { themes: { id: string; name: string }[]; tokens: ColorToken[] };
  type: {
    fonts: { family: string; file: string; weight: string; style: string }[];
    families: Record<string, string>;
    groups: { name: string; family: string; styles: TypeStyle[] }[];
  };
  spacing: { tokens: Token[] };
  radius: { tokens: Token[] };
  stroke: { tokens: Token[] };
  texture: { tokens: Token[] };
};

const tokens: Tokens = JSON.parse(readFileSync(TOKENS_JSON, "utf8"));
const themeIds = tokens.color.themes.map((t) => t.id);
const [firstTheme] = themeIds;

const isAlias = (v: string) => /^\{[\w-]+\}$/.test(v);
const aliasName = (v: string) => v.slice(1, -1);

/** Resolve `{paper}` style aliases to a hex value within one theme. */
const resolveColor = (theme: string, value: string, seen = new Set<string>()): string => {
  if (!isAlias(value)) return value.toUpperCase();
  const name = aliasName(value);
  if (seen.has(name)) throw new Error(`Alias cycle at {${name}}`);
  seen.add(name);
  const target = tokens.color.tokens.find((t) => t.name === name);
  if (!target) throw new Error(`Unknown colour alias {${name}}`);
  return resolveColor(theme, target.value[theme], seen);
};

const cssColor = (value: string) => (isAlias(value) ? `var(--${aliasName(value)})` : value.toLowerCase());

/** tokens.json names `fonts/SpaceGrotesk-400Regular.ttf`; this repo serves `public/fonts/SpaceGrotesk-400.ttf`. */
const fontFile = (family: string, weight: string) => {
  const file = `${family.replace(/\s+/g, "")}-${weight}.ttf`;
  if (!existsSync(join(FONTS_DIR, file))) throw new Error(`Missing font public/fonts/${file}`);
  return file;
};

const flatTypeStyles = tokens.type.groups.flatMap((g) => g.styles.map((s) => ({ ...s, family: g.family })));
const otherTokens = [...tokens.spacing.tokens, ...tokens.radius.tokens, ...tokens.stroke.tokens, ...tokens.texture.tokens];

// ---------- tokens.css (laid out as the artifact's "tokens.css as compiled") ----------
const block = (selector: string, lines: string[]) => `${selector} {\n${lines.map((l) => `  ${l}`).join("\n")}\n}`;

const themeBlocks = themeIds.map((id) =>
  block(
    id === firstTheme ? `:root, [data-theme="${id}"]` : `[data-theme="${id}"]`,
    tokens.color.tokens.map((t) => `--${t.name}: ${cssColor(t.value[id])};`),
  ),
);

const rootBlock = block(":root", [
  ...otherTokens.map((t) => `--${t.name}: ${t.value};`),
  ...Object.entries(tokens.type.families).map(([key, stack]) => `--font-${key}: ${stack};`),
]);

const typeClasses = flatTypeStyles.map((s) =>
  block(`.${s.name}`, [
    `font-family: var(--font-${s.family});`,
    `font-size: ${s.fontSize};`,
    `line-height: ${s.lineHeight};`,
    `font-weight: ${s.fontWeight};`,
    `letter-spacing: ${s.letterSpacing};`,
  ]),
);

const tokensCss = [
  `/* ${tokens.name} — generated from tokens.json */`,
  `/* Do not edit. Source: design-system-artifact/project/tokens.json · rebuild: npm run ds:build */`,
  `/* No @font-face here: webpack cannot resolve /fonts URLs, so src/design-system/fonts.ts loads them with staticFile(). */`,
  "",
  ...themeBlocks,
  rootBlock,
  ...typeClasses,
  "",
].join("\n");

// ---------- atelier-machine.css (bundle.css with fonts served from /public/fonts) ----------
const bundle = readFileSync(BUNDLE_CSS, "utf8")
  .replace(/^@import url\('https:\/\/fonts\.googleapis\.com[^\n]*\n+/m, "")
  .trimStart();

const bundleCss = [
  `/* ${tokens.name} — generated from components/bundle.css */`,
  `/* Do not edit. Source: design-system-artifact/project/components/bundle.css · rebuild: npm run ds:build */`,
  `/* Fonts load from public/fonts via src/design-system/fonts.ts instead of Google Fonts, so renders work offline. */`,
  "",
  bundle,
].join("\n");

// ---------- tokens.ts ----------
const px = (v: string) => (/^-?\d+(\.\d+)?px$/.test(v) ? Number(v.slice(0, -2)) : v);
const record = (list: Token[]) => Object.fromEntries(list.map((t) => [t.name, px(t.value)]));
const json = (v: unknown) => JSON.stringify(v, null, 2);

const baseColors = tokens.color.tokens.filter((t) => themeIds.every((id) => !isAlias(t.value[id])));
const color = Object.fromEntries(
  baseColors.filter((t) => new Set(themeIds.map((id) => t.value[id])).size === 1).map((t) => [t.name, resolveColor(firstTheme, t.value[firstTheme])]),
);
const themes = Object.fromEntries(
  themeIds.map((id) => [
    id,
    Object.fromEntries(
      tokens.color.tokens
        .filter((t) => !(t.name in color))
        .map((t) => [t.name, resolveColor(id, t.value[id])]),
    ),
  ]),
);
const typeStyles = Object.fromEntries(
  flatTypeStyles.map((s) => [
    s.name,
    {
      fontFamily: tokens.type.families[s.family],
      fontSize: px(s.fontSize),
      lineHeight: s.lineHeight,
      fontWeight: s.fontWeight,
      letterSpacing: s.letterSpacing,
    },
  ]),
);

const tokensTs = `// ${tokens.name} — generated from tokens.json
// Do not edit. Source: design-system-artifact/project/tokens.json · rebuild: npm run ds:build
// Pixel values are numbers on the 1080 px canvas; React treats unitless sizes as px.

/** Fixed brand colours (same in every theme). */
export const color = ${json(color)} as const;

/** Theme-dependent colours: surface, on-surface, muted, rule, grid-line. */
export const themes = ${json(themes)} as const;

export const fontFamily = ${json(tokens.type.families)} as const;

/** Font files in public/fonts/, loaded by src/design-system/fonts.ts before the first frame. */
export const fonts = ${json(tokens.type.fonts.map((f) => ({ family: f.family, weight: f.weight, style: f.style, file: `fonts/${fontFile(f.family, f.weight)}` })))} as const;

/** One entry per text style; spread into a style object: \`style={{ ...typeStyles.h1 }}\`. */
export const typeStyles = ${json(typeStyles)} as const;

export const space = ${json(record(tokens.spacing.tokens))} as const;

export const radius = ${json(record(tokens.radius.tokens))} as const;

export const stroke = ${json(record(tokens.stroke.tokens))} as const;

export const texture = ${json(record(tokens.texture.tokens))} as const;

export type ColorName = keyof typeof color;
export type ThemeId = keyof typeof themes;
export type TypeStyleName = keyof typeof typeStyles;
`;

for (const [file, content] of [
  [OUT_TOKENS_CSS, tokensCss],
  [OUT_BUNDLE_CSS, bundleCss],
  [OUT_TOKENS_TS, tokensTs],
] as const) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  console.log(`wrote ${file.slice(ROOT.length + 1)}`);
}
