import * as React from "react";
import {
  pathOf,
  type Flat,
  type LineTone,
  type SolidPaths,
  type Tone,
} from "./iso-kit";

export type AmAccent = "lime" | "lilac" | "orange" | "ink" | "shade" | "paper";

/**
 * Isometric SVG stylesheet bridged to ATELIER MACHINE tokens (`tokens.css` & `atelier-machine.css`).
 * Reads `--bg`, `--fg`, `--mut`, `--grid` from `.am` (so `.am.is-dark` switches automatically)
 * with fallbacks to `--surface`, `--on-surface`, `--muted`, `--grid-line`.
 * 100% flat: no blur, no drop-shadow, no gradient, no hex literals.
 */
export const AM_ISO_CSS = `
.am-iso {
  --am-iso-bg: var(--bg, var(--surface));
  --am-iso-fg: var(--fg, var(--on-surface));
  --am-iso-mut: var(--mut, var(--muted));
  --am-iso-grid: var(--grid, var(--grid-line));

  --anatomy-paper: var(--am-iso-bg);
  --anatomy-top: color-mix(in srgb, var(--am-iso-bg) 95%, var(--am-iso-fg) 5%);
  --anatomy-face: var(--paper-shade);
  --anatomy-shade-0: color-mix(in srgb, var(--am-iso-bg) 70%, var(--am-iso-fg) 30%);
  --anatomy-shade-1: color-mix(in srgb, var(--am-iso-bg) 78%, var(--am-iso-fg) 22%);
  --anatomy-shade-2: color-mix(in srgb, var(--am-iso-bg) 85%, var(--am-iso-fg) 15%);
  --anatomy-shade-3: color-mix(in srgb, var(--am-iso-bg) 91%, var(--am-iso-fg) 9%);
  --anatomy-lit-top: var(--lime);
  --anatomy-lit-shade: color-mix(in srgb, var(--lime) 82%, var(--ink) 18%);
  --anatomy-hi: var(--am-iso-fg);
  --anatomy-mid: var(--am-iso-mut);
  --anatomy-lo: color-mix(in srgb, var(--am-iso-bg) 56%, var(--am-iso-fg) 44%);
  --anatomy-faint: var(--am-iso-grid);
  --anatomy-lit: var(--am-iso-fg);
  --anatomy-dot: var(--am-iso-fg);
  --anatomy-red: var(--orange);
  --anatomy-green: var(--lime);
  --anatomy-blue: var(--lilac);
  --anatomy-weight: 1.6px;
  --anatomy-mono: var(--f-mono);
}
.am-iso-svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.am-iso-svg path,
.am-iso-svg circle {
  vector-effect: non-scaling-stroke;
}
.am-iso .iso-fill {
  fill: var(--anatomy-paper);
  stroke: none;
}
.am-iso .iso-shade,
.am-iso .iso-top {
  stroke: none;
}
.am-iso .iso-shade[data-shade="0"] { fill: var(--anatomy-shade-0); }
.am-iso .iso-shade[data-shade="1"] { fill: var(--anatomy-shade-1); }
.am-iso .iso-shade[data-shade="2"] { fill: var(--anatomy-shade-2); }
.am-iso .iso-shade[data-shade="3"] { fill: var(--anatomy-shade-3); }
.am-iso .iso-top { fill: var(--anatomy-top); }

/* Lit & semantic ATELIER MACHINE accent solids keep their brand colour in both light and dark */
.am-iso .iso-solid[data-lit] > .iso-fill,
.am-iso .iso-solid[data-accent="lime"] > .iso-fill { fill: var(--lime); }
.am-iso .iso-solid[data-lit] > .iso-top,
.am-iso .iso-solid[data-accent="lime"] > .iso-top { fill: var(--lime); }
.am-iso .iso-solid[data-lit] > .iso-shade,
.am-iso .iso-solid[data-accent="lime"] > .iso-shade {
  fill: color-mix(in srgb, var(--lime) 80%, var(--ink) 20%);
}

.am-iso .iso-solid[data-accent="lilac"] > .iso-fill,
.am-iso .iso-solid[data-accent="lilac"] > .iso-top { fill: var(--lilac); }
.am-iso .iso-solid[data-accent="lilac"] > .iso-shade {
  fill: color-mix(in srgb, var(--lilac) 80%, var(--ink) 20%);
}

.am-iso .iso-solid[data-accent="orange"] > .iso-fill,
.am-iso .iso-solid[data-accent="orange"] > .iso-top { fill: var(--orange); }
.am-iso .iso-solid[data-accent="orange"] > .iso-shade {
  fill: color-mix(in srgb, var(--orange) 80%, var(--ink) 20%);
}

.am-iso .iso-solid[data-accent="shade"] > .iso-fill,
.am-iso .iso-solid[data-accent="shade"] > .iso-top {
  fill: color-mix(in srgb, var(--am-iso-bg) 88%, var(--am-iso-fg) 12%);
}
.am-iso .iso-solid[data-accent="shade"] > .iso-shade {
  fill: color-mix(in srgb, var(--am-iso-bg) 74%, var(--am-iso-fg) 26%);
}

.am-iso .iso-solid[data-accent="ink"] > .iso-fill,
.am-iso .iso-solid[data-accent="ink"] > .iso-top { fill: var(--ink); }
.am-iso .iso-solid[data-accent="ink"] > .iso-shade {
  fill: color-mix(in srgb, var(--ink) 82%, var(--paper) 18%);
}
.am-iso .iso-solid[data-accent="ink"] > .iso-crease,
.am-iso .iso-solid[data-accent="ink"] > .iso-bevel {
  stroke: var(--ink-soft);
}

.am-iso .iso-line {
  fill: none;
  stroke: var(--anatomy-lo);
  stroke-width: var(--anatomy-weight);
  stroke-linecap: square;
  stroke-linejoin: miter;
}
.am-iso .iso-edge[data-tone="hi"],
.am-iso .iso-solid[data-lit] > .iso-edge {
  stroke: var(--am-iso-fg);
  stroke-width: calc(var(--anatomy-weight) * 1.35);
}
.am-iso .iso-line[data-tone="hi"] { stroke: var(--anatomy-hi); }
.am-iso .iso-line[data-tone="mid"] { stroke: var(--anatomy-mid); }
.am-iso .iso-line[data-tone="lo"] { stroke: var(--anatomy-lo); }
.am-iso .iso-line[data-tone="faint"] { stroke: var(--anatomy-faint); }
.am-iso .iso-line[data-tone="lit"] {
  stroke: var(--anatomy-lit);
  stroke-width: calc(var(--anatomy-weight) * 1.4);
}
.am-iso .iso-line[data-tone="red"] { stroke: var(--anatomy-red); }
.am-iso .iso-line[data-tone="green"] { stroke: var(--anatomy-green); }
.am-iso .iso-line[data-tone="blue"] { stroke: var(--anatomy-blue); }
.am-iso .iso-line[data-dotted] { stroke-dasharray: 1.5 4; }
.am-iso .iso-line[data-dashed] { stroke-dasharray: 5 4; }

.am-iso .iso-wire-end {
  fill: var(--am-iso-bg);
  stroke: var(--am-iso-fg);
  stroke-width: var(--anatomy-weight);
}
.am-iso .iso-dots circle {
  fill: var(--anatomy-dot);
  stroke: none;
}
.am-iso .iso-dots[data-tone="hi"] circle { opacity: 1; }
.am-iso .iso-dots[data-tone="mid"] circle { opacity: 0.65; }
.am-iso .iso-dots[data-tone="lo"] circle { opacity: 0.38; }
.am-iso .iso-dots[data-tone="faint"] circle { opacity: 0.2; }

.am-iso .iso-face-text {
  fill: var(--am-iso-fg);
  font-family: var(--f-mono);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.am-iso .iso-face-text[data-tone="mid"] { fill: var(--am-iso-mut); }
.am-iso .iso-face-text[data-tone="lo"] { fill: var(--anatomy-lo); }
.am-iso .iso-face-text[data-tone="faint"] { fill: var(--paper-soft); }
.am-iso .iso-face-text[data-on-accent="true"] { fill: var(--ink); }
`;

export interface SolidProps {
  paths: SolidPaths;
  tone?: Tone;
  crease?: Tone | "none";
  lit?: boolean;
  accent?: AmAccent;
  flat?: boolean;
  className?: string;
  inner?: React.ReactNode;
  children?: React.ReactNode;
}

export function Solid({
  paths,
  tone = "hi",
  crease = "faint",
  lit = false,
  accent,
  flat = false,
  className,
  inner,
  children,
}: SolidProps) {
  return (
    <g
      className={className ? `iso-solid ${className}` : "iso-solid"}
      data-lit={lit ? "" : undefined}
      data-accent={accent}
      data-seamless={paths.seamless ? "" : undefined}
    >
      <path className="iso-fill" d={paths.fill} />
      {flat
        ? null
        : paths.shades.map((d, shade) =>
            d ? <path key={shade} className="iso-shade" data-shade={shade} d={d} /> : null,
          )}
      {flat ? null : <path className="iso-top" d={paths.top} />}
      {crease === "none" || !paths.crease ? null : (
        <path className="iso-line iso-crease" data-tone={crease} d={paths.crease} />
      )}
      {crease === "none" || !paths.bevel ? null : (
        <path className="iso-line iso-bevel" data-tone={crease} d={paths.bevel} />
      )}
      {inner}
      <path className="iso-line iso-edge" data-tone={tone} d={paths.outline} />
      {children}
    </g>
  );
}

export interface LineProps {
  d: string;
  tone?: LineTone;
  dotted?: boolean;
  dashed?: boolean;
  className?: string;
  free?: boolean | "start" | "end";
}

export function Line({
  d,
  tone = "lo",
  dotted = false,
  dashed = false,
  className,
  free,
}: LineProps) {
  if (!d) return null;
  return (
    <path
      className={className ? `iso-line ${className}` : "iso-line"}
      data-tone={tone}
      data-dotted={dotted ? "" : undefined}
      data-dashed={dashed ? "" : undefined}
      data-free={free === true ? "" : free || undefined}
      d={d}
    />
  );
}

export interface WireProps {
  from: Flat;
  to: Flat;
  via?: Flat[];
  tone?: LineTone;
  dotted?: boolean;
  dashed?: boolean;
  ends?: "both" | "from" | "to" | "none";
  size?: number;
}

const tenth = (value: number) => Math.round(value * 10) / 10;

export function Wire({
  from,
  to,
  via = [],
  tone = "lo",
  dotted = false,
  dashed = false,
  ends = "both",
  size = 1.6,
}: WireProps) {
  return (
    <g className="iso-wire" data-tone={tone}>
      <Line d={pathOf([from, ...via, to])} tone={tone} dotted={dotted} dashed={dashed} />
      {ends === "both" || ends === "from" ? (
        <circle className="iso-wire-end" cx={tenth(from[0])} cy={tenth(from[1])} r={size} />
      ) : null}
      {ends === "both" || ends === "to" ? (
        <circle className="iso-wire-end" cx={tenth(to[0])} cy={tenth(to[1])} r={size} />
      ) : null}
    </g>
  );
}

export function Dots({
  points,
  size = 0.65,
  tone = "mid",
}: {
  points: Array<Flat | [number, number, number]>;
  size?: number;
  tone?: Tone;
}) {
  return (
    <g className="iso-dots" data-tone={tone}>
      {points.map(([x, y, alpha], index) => (
        <circle
          key={index}
          cx={tenth(x)}
          cy={tenth(y)}
          r={size}
          fillOpacity={alpha !== undefined && alpha < 1 ? Math.max(0, alpha) : undefined}
        />
      ))}
    </g>
  );
}

export function FaceText({
  transform,
  children,
  size = 3,
  tone = "hi",
  anchor = "start",
  onAccent = false,
}: {
  transform: string;
  children: React.ReactNode;
  size?: number;
  tone?: Tone;
  anchor?: "start" | "middle" | "end";
  onAccent?: boolean;
}) {
  return (
    <text
      className="iso-face-text"
      data-tone={tone}
      data-on-accent={onAccent ? "true" : undefined}
      transform={transform}
      fontSize={size}
      textAnchor={anchor}
    >
      {children}
    </text>
  );
}
