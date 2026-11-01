/**
 * Social formats from design-system-artifact/project/formats.md, in canvas px.
 * Margins and safe zones read the spacing tokens; band positions are the documented ones.
 */
import { space } from "./tokens";

const margin = space["margin-post"];
const gutter = space.gutter;
const WIDTH = 1080;

export type FormatId = "4:5" | "9:16" | "1:1";

export type Box = { left: number; top: number; right: number; bottom: number };

export type Format = {
  width: number;
  height: number;
  /** Where words and key visuals must stay. Backgrounds, textures and blocks may bleed. */
  safe: Box;
  columns: number;
  header: { left: number; top: number; width: number };
  footer: { left: number; top: number; width: number };
  /** Inner slides place `SectionHeading` here, directly under the header band. */
  sectionTop: number;
};

const box = (height: number, safe?: Partial<Box>): Box => ({
  left: margin,
  top: margin,
  right: WIDTH - margin,
  bottom: height - margin,
  ...safe,
});

const vertical = box(1920, {
  top: space["safe-top-vertical"],
  right: WIDTH - space["safe-right-vertical"],
  bottom: 1920 - space["safe-bottom-vertical"],
});

export const formats: Record<FormatId, Format> = {
  "4:5": {
    width: WIDTH,
    height: 1350,
    safe: box(1350),
    columns: 6,
    header: { left: margin, top: 72, width: WIDTH - 2 * margin },
    footer: { left: margin, top: 1222, width: WIDTH - 2 * margin },
    sectionTop: 170,
  },
  "1:1": {
    width: WIDTH,
    height: 1080,
    safe: box(1080),
    columns: 6,
    header: { left: margin, top: 72, width: WIDTH - 2 * margin },
    footer: { left: margin, top: 952, width: WIDTH - 2 * margin },
    sectionTop: 170,
  },
  "9:16": {
    width: WIDTH,
    height: 1920,
    safe: vertical,
    columns: 4,
    header: { left: vertical.left, top: 270, width: vertical.right - vertical.left },
    footer: { left: vertical.left, top: 1400, width: vertical.right - vertical.left },
    sectionTop: 368,
  },
};

/** Left edge and width of `span` columns starting at column `index` (0-based) inside the safe box. */
export const column = (format: FormatId, index: number, span = 1) => {
  const f = formats[format];
  const inner = f.safe.right - f.safe.left;
  const col = (inner - (f.columns - 1) * gutter) / f.columns;
  return { left: f.safe.left + index * (col + gutter), width: span * col + (span - 1) * gutter };
};
