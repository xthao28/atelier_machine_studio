import type { CSSProperties, ReactNode } from "react";
import { formats, type FormatId } from "../formats";

/** Slide ground. `paper` is the default; the others map to `.am.is-<ground>` in bundle.css. */
export type Ground = "paper" | "dark" | "lilac" | "lime" | "orange" | "shade";

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(" ");

export const groundClass = (ground: Ground) => (ground === "paper" ? "am" : `am is-${ground}`);

/** An `.am` scope: every component must sit inside one. Sets ground, text and grid colours. */
export const AmScope = ({
  ground = "paper",
  className,
  style,
  children,
}: {
  ground?: Ground;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) => (
  <div className={cx(groundClass(ground), className)} style={style}>
    {children}
  </div>
);

/**
 * A full canvas: `.am .am-slide` at the format's size. Children are placed with `Abs`.
 * `grid` adds the technical grid, `grain` the paper grain (both count toward the two-texture limit).
 */
export const Slide = ({
  format = "9:16",
  ground = "paper",
  grid = false,
  grain = false,
  style,
  children,
}: {
  format?: FormatId;
  ground?: Ground;
  grid?: boolean;
  grain?: boolean;
  style?: CSSProperties;
  children: ReactNode;
}) => (
  <div
    className={cx(groundClass(ground), "am-slide", format === "9:16" && "tall", format === "1:1" && "sq", grain && "am-grain")}
    style={style}
  >
    {grid && <div className="am-gridbg" />}
    {children}
  </div>
);

/** Absolutely positioned block (`.am-abs`) at canvas coordinates. */
export const Abs = ({
  left,
  top,
  width,
  height,
  className,
  style,
  children,
}: {
  left: number;
  top: number;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) => (
  <div className={cx("am-abs", className)} style={{ left, top, width, height, ...style }}>
    {children}
  </div>
);

/** Full-canvas SVG layer for graphic language primitives (crosshairs, annotations, targets). */
export const SvgLayer = ({ format = "9:16", children }: { format?: FormatId; children: ReactNode }) => {
  const { width, height } = formats[format];
  return (
    <div className="am-layer" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ color: "var(--fg)" }} fill="none">
        {children}
      </svg>
    </div>
  );
};

/** Textures from the Textures component. At most two per slide; never under body text. */
export const Texture = ({
  kind,
  style,
}: {
  kind: "halftone" | "dots" | "hatch";
  style?: CSSProperties;
}) => <div className={`am-${kind}`} style={{ position: "absolute", inset: 0, ...style }} />;

export { cx };
