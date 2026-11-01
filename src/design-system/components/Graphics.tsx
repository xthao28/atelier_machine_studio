/**
 * Graphic language primitives (DESIGN_SYSTEM.md §7), drawn as in the artifact's Registration,
 * Annotations and Symbols previews. Everything except `TechnicalAnnotation` and `AmSymbol` is an SVG
 * element: place it inside `SvgLayer` (canvas coordinates) or your own `<svg>`.
 * Per slide: at most one target, four annotations, two textures.
 */
import type { CSSProperties } from "react";

type Pt = [number, number];

const STROKE = { stroke: "currentColor", strokeWidth: 3 } as const;

/** Open, mitered arrowhead whose tip is `tip`, pointing away from `from`. 14 px long, 7.7 px half-width. */
const arrowHead = (from: Pt, tip: Pt, weight = 3) => {
  const dx = tip[0] - from[0];
  const dy = tip[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const [ux, uy] = [dx / len, dy / len];
  const [nx, ny] = [-uy, ux];
  const bx = tip[0] - 14 * ux;
  const by = tip[1] - 14 * uy;
  const f = (v: number) => v.toFixed(1);
  return (
    <path
      d={`M${f(bx + 7.7 * nx)} ${f(by + 7.7 * ny)}L${tip[0]} ${tip[1]}L${f(bx - 7.7 * nx)} ${f(by - 7.7 * ny)}`}
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinejoin="miter"
    />
  );
};

/** Mono upper-case SVG text (`.am-svgt`, or `.am-svgt.s` when `small`). */
export const SvgLabel = ({
  x,
  y,
  children,
  small = false,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: string;
  small?: boolean;
  anchor?: "start" | "middle" | "end";
}) => (
  <text x={x} y={y} className={small ? "am-svgt s" : "am-svgt"} textAnchor={anchor}>
    {children}
  </text>
);

const CROSSHAIR_ARM = { S: 16, M: 26, L: 38, XL: 50 } as const;

/** Marks a corner or a point. Four sizes; XL uses a 4 px stroke as in the artifact. */
export const Crosshair = ({ x, y, size = "M" }: { x: number; y: number; size?: keyof typeof CROSSHAIR_ARM }) => {
  const a = CROSSHAIR_ARM[size];
  return <path d={`M${x - a} ${y}H${x + a}M${x} ${y - a}V${y + a}`} stroke="currentColor" strokeWidth={size === "XL" ? 4 : 3} />;
};

/** `X 12.40 · Y 08.75`. Sample data only; never the real location of a private person. */
export const CoordinateLabel = ({ x, y, children, anchor = "start" }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end" }) => (
  <SvgLabel x={x} y={y} small anchor={anchor}>
    {children}
  </SvgLabel>
);

/** Isolates one subject: rings at 100 / 66 / 33 %, a crosshair and ticks every 30°. One per slide. */
export const TargetRing = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    const f = (v: number) => Math.round(v);
    return <path key={i} d={`M${f(cx + r * c)} ${f(cy + r * s)}L${f(cx + (r + 14) * c)} ${f(cy + (r + 14) * s)}`} {...STROKE} />;
  });
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} {...STROKE} />
      <circle cx={cx} cy={cy} r={r * 0.66} {...STROKE} strokeDasharray="4 10" />
      <circle cx={cx} cy={cy} r={r * 0.33} {...STROKE} />
      <path d={`M${cx - r - 24} ${cy}H${cx + r + 24}M${cx} ${cy - r - 24}V${cy + r + 24}`} {...STROKE} />
      {ticks}
    </g>
  );
};

/** Dashed orbit used around a character frame on the Project Reveal cover. */
export const DashedOrbit = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => (
  <circle cx={cx} cy={cy} r={r} stroke="currentColor" strokeWidth={2} strokeDasharray="3 12" />
);

/**
 * Leader line from a part to its label. `points[0]` touches the part; the label follows the last point.
 * Dot = surface, square = edge, arrow = direction; `dashed` = optional or hidden part.
 * Horizontal or vertical first, 45° only when needed; never cross two lines.
 */
export const AnnotationLine = ({
  points,
  end = "dot",
  dashed = false,
  label,
}: {
  points: Pt[];
  end?: "dot" | "square" | "arrow";
  dashed?: boolean;
  label?: string;
}) => {
  const [p0, p1] = points;
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  const leftward = last[0] < prev[0];
  return (
    <g>
      <path d={`M${points.map((p) => p.join(" ")).join("L")}`} {...STROKE} strokeDasharray={dashed ? "8 6" : undefined} />
      {end === "dot" && <circle cx={p0[0]} cy={p0[1]} r={8} fill="var(--fg)" {...STROKE} />}
      {end === "square" && <rect x={p0[0] - 8} y={p0[1] - 8} width={16} height={16} {...STROKE} />}
      {end === "arrow" && arrowHead(p1, p0)}
      {label && (
        <SvgLabel x={last[0] + (leftward ? -14 : 14)} y={last[1] + 6} anchor={leftward ? "end" : "start"}>
          {label}
        </SvgLabel>
      )}
    </g>
  );
};

/** Flow, return or emphasis. Open head, never filled. `weight` 6 for emphasis, `dashed` for return paths. */
export const Arrow = ({ from, to, weight = 3, dashed = false }: { from: Pt; to: Pt; weight?: 3 | 6; dashed?: boolean }) => (
  <g>
    <path d={`M${from.join(" ")}L${to.join(" ")}`} stroke="currentColor" strokeWidth={weight} strokeDasharray={dashed ? "10 8" : undefined} />
    {arrowHead(from, to, weight)}
  </g>
);

/** Measurement with end ticks and a mono value (`936 PX`). Horizontal or vertical. */
export const DimensionLine = ({ from, to, label }: { from: Pt; to: Pt; label: string }) => {
  const vertical = from[0] === to[0];
  const tick = ([x, y]: Pt) => (vertical ? `M${x - 12} ${y}H${x + 12}` : `M${x} ${y - 12}V${y + 12}`);
  return (
    <g>
      <path d={`M${from.join(" ")}L${to.join(" ")}${tick(from)}${tick(to)}`} {...STROKE} />
      {vertical ? (
        <SvgLabel x={from[0] + 24} y={(from[1] + to[1]) / 2 + 6} small>
          {label}
        </SvgLabel>
      ) : (
        <SvgLabel x={(from[0] + to[0]) / 2} y={from[1] - 16} small anchor="middle">
          {label}
        </SvgLabel>
      )}
    </g>
  );
};

/** Numbered or lettered pin linking a point to a key. */
export const NumberedPin = ({ cx, cy, label }: { cx: number; cy: number; label: string }) => (
  <g>
    <circle cx={cx} cy={cy} r={22} fill="var(--fg)" stroke="var(--fg)" strokeWidth={3} />
    <text x={cx} y={cy + 8} textAnchor="middle" style={{ font: "500 22px var(--f-mono)", fill: "var(--bg)" }}>
      {label}
    </text>
  </g>
);

/** HTML leader: end marker, 96 px line, mono label. For annotations laid out in flow rather than on a canvas. */
export const TechnicalAnnotation = ({ children, end = "dot", dashed = false }: { children: string; end?: "dot" | "square"; dashed?: boolean }) => (
  <div className="am-note">
    <span className="dot" style={end === "square" ? { borderRadius: 0 } : undefined} />
    <span className="ln" style={dashed ? { background: "repeating-linear-gradient(90deg,var(--fg) 0 8px,transparent 8px 14px)" } : undefined} />
    <span className="tx">{children}</span>
  </div>
);

// ---------- Symbols ----------

export type SymbolKind =
  | "disc"
  | "square"
  | "triangle"
  | "half-disc"
  | "plus"
  | "diamond"
  | "ring"
  | "bar"
  | "pixel-cluster"
  | "arc"
  | "steps"
  | "bracket";

/** Fixed meaning of each symbol. Use them to replace words in tags and diagrams, never as ornament. */
export const SYMBOL_MEANING: Record<SymbolKind, string> = {
  disc: "Signal, on, live",
  square: "Object, hardware",
  triangle: "Testing, warning",
  "half-disc": "Input, sensor",
  plus: "Target, coordinate",
  diamond: "Decision, branch",
  ring: "Loop, cycle",
  bar: "Progress, level",
  "pixel-cluster": "Pixel life, growth",
  arc: "Range, perception",
  steps: "Evolution, stages",
  bracket: "Selection, focus",
};

type Accent = "lime" | "lilac" | "orange";
const DEFAULT_FILL: Partial<Record<SymbolKind, Accent>> = {
  disc: "lime",
  square: "lilac",
  triangle: "orange",
  "half-disc": "lime",
  bar: "lime",
  "pixel-cluster": "orange",
};

const symbolBody = (kind: SymbolKind, fill: string) => {
  const ink = { stroke: "var(--c-ink)", strokeWidth: 3 } as const;
  switch (kind) {
    case "disc":
      return <circle cx={48} cy={48} r={36} fill={fill} {...ink} />;
    case "square":
      return <rect x={14} y={14} width={68} height={68} fill={fill} {...ink} />;
    case "triangle":
      return <path d="M48 12L86 82H10Z" fill={fill} {...ink} />;
    case "half-disc":
      return <path d="M12 70A36 36 0 0 1 84 70Z" fill={fill} {...ink} />;
    case "plus":
      return <path d="M12 48H84M48 12V84" {...STROKE} />;
    case "diamond":
      return <path d="M48 10L86 48L48 86L10 48Z" {...STROKE} />;
    case "ring":
      return (
        <>
          <circle cx={48} cy={48} r={34} {...STROKE} />
          <circle cx={48} cy={48} r={18} {...STROKE} strokeDasharray="4 6" />
        </>
      );
    case "bar":
      return (
        <>
          <rect x={10} y={36} width={76} height={24} {...STROKE} />
          <rect x={10} y={36} width={48} height={24} fill={fill} {...ink} />
        </>
      );
    case "pixel-cluster":
      return (
        <>
          {[0, 1, 2].flatMap((cx) =>
            [0, 1, 2].map((cy) => (
              <rect
                key={`${cx}${cy}`}
                x={12 + cx * 24}
                y={12 + cy * 24}
                width={24}
                height={24}
                fill={(cx + cy) % 2 === 0 ? fill : "none"}
                stroke="currentColor"
                strokeWidth={2}
              />
            )),
          )}
        </>
      );
    case "arc":
      return (
        <>
          <path d="M14 70A40 40 0 0 1 82 70" {...STROKE} />
          <path d="M28 70A26 26 0 0 1 68 70" {...STROKE} />
          <circle cx={48} cy={70} r={6} fill="currentColor" />
        </>
      );
    case "steps":
      return <path d="M10 82H34V58H58V34H82V12" {...STROKE} />;
    case "bracket":
      return <path d="M30 14H14V30M66 14H82V30M30 82H14V66M66 82H82V66" {...STROKE} />;
  }
};

/** One of the twelve geometric symbols, drawn on a 96 px grid. Fill only with `lime`, `lilac` or `orange`. */
export const AmSymbol = ({ kind, size = 96, fill, style }: { kind: SymbolKind; size?: number; fill?: Accent; style?: CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 96 96" fill="none" style={{ color: "var(--fg)", display: "block", ...style }}>
    {symbolBody(kind, `var(--c-${fill ?? DEFAULT_FILL[kind] ?? "lime"})`)}
  </svg>
);
