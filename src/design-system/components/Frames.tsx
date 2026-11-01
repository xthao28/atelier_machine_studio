import type { CSSProperties, ReactNode } from "react";
import { Img, staticFile } from "remotion";

/** Mono text matching `.am-svgt.s`, for HTML frames drawn from the artifact's SVG originals. */
const monoSmall: CSSProperties = {
  font: "500 20px var(--f-mono)",
  letterSpacing: ".04em",
  textTransform: "uppercase",
};

// ---------- CharacterFrame + pixel sprites ----------

export type SpriteSheet = {
  /** Path inside public/, passed to staticFile(). */
  src: string;
  frameWidth: number;
  frameHeight: number;
  columns: number;
  rows: number;
};

/** The supplied XUNA reference art: 32 frames × 4 rows of 96 × 72 px. */
export const XUNA_SPRITE: SpriteSheet = {
  src: "xuna-sync/sprites/pet_frames.png",
  frameWidth: 96,
  frameHeight: 72,
  columns: 32,
  rows: 4,
};

/**
 * One frame of a pixel-art sheet at an exact whole-number scale with nearest-neighbour sampling.
 * Never smooth, recolour or re-proportion XUNA.
 */
export const PixelSprite = ({
  sheet = XUNA_SPRITE,
  column = 0,
  row = 0,
  scale = 3,
}: {
  sheet?: SpriteSheet;
  column?: number;
  row?: number;
  scale?: number;
}) => {
  const s = Math.max(1, Math.floor(scale));
  const w = sheet.frameWidth * s;
  const h = sheet.frameHeight * s;
  return (
    <div style={{ position: "relative", width: w, height: h, overflow: "hidden", flex: "none" }}>
      <Img
        src={staticFile(sheet.src)}
        style={{
          position: "absolute",
          left: -(column % sheet.columns) * w,
          top: -(row % sheet.rows) * h,
          width: sheet.columns * w,
          height: sheet.rows * h,
          maxWidth: "none",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};

/**
 * Square frame with 8 px stepped corners and an `orange` field for XUNA.
 * Without children it shows the labelled placeholder, which must never be published.
 */
export const CharacterFrame = ({
  size,
  field,
  style,
  children,
}: {
  size: number;
  /** Other characters take the same frame with a different field colour. */
  field?: "lilac" | "lime" | "paper";
  style?: CSSProperties;
  children?: ReactNode;
}) => (
  <div className="am-char" style={{ width: size, height: size, ...style }}>
    <div className="px-out" />
    <div className="px-in" style={field ? { background: `var(--c-${field})` } : undefined} />
    <div className="pxg" />
    <div className="ph">
      {children ?? (
        <span>
          XUNA
          <br />
          reference art
          <br />
          pending
        </span>
      )}
    </div>
  </div>
);

// ---------- ImageFrame ----------

/**
 * Real hardware photography on `paper-shade` with the halftone fade, crosshair corners and a caption bar
 * (figure number left, view or scale right). The outer box is 56 px larger than the photo to hold the crosshairs.
 */
export const ImageFrame = ({
  width,
  height,
  src,
  placeholder = "Photo pending",
  figure,
  view,
  style,
}: {
  width: number;
  height: number;
  /** Path inside public/. Leave out to show the placeholder. */
  src?: string;
  placeholder?: ReactNode;
  figure?: string;
  view?: string;
  style?: CSSProperties;
}) => {
  const W = width + 56;
  const H = height + 56;
  const corner = (x: number, y: number) => <path key={`${x}-${y}`} d={`M${x - 12} ${y}H${x + 12}M${x} ${y - 12}V${y + 12}`} stroke="currentColor" strokeWidth={3} />;
  return (
    <div style={{ position: "relative", width: W, height: H, ...style }}>
      <div className="am-img" style={{ position: "absolute", left: 28, top: 28, width, height }}>
        {src && <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
        <div className="am-halftone" style={{ position: "absolute", inset: 0 }} />
        {!src && (
          <div className="ph">
            <span>{placeholder}</span>
          </div>
        )}
        {(figure || view) && (
          <div className="cap">
            <span>{figure}</span>
            <span>{view}</span>
          </div>
        )}
      </div>
      <div className="am-layer" style={{ width: W, height: H }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ color: "var(--fg)" }} fill="none">
          {[corner(14, 14), corner(W - 14, 14), corner(14, H - 14), corner(W - 14, H - 14)]}
        </svg>
      </div>
    </div>
  );
};

// ---------- Code ----------

/** `ink` ground, `lime` keywords, `orange` numbers, `paper-soft` comments. Real code, at most 10 lines. */
export const CodeFrame = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div className="am-code" style={style}>
    {children}
  </div>
);
export const CodeKeyword = ({ children }: { children: ReactNode }) => <span className="k">{children}</span>;
export const CodeNumber = ({ children }: { children: ReactNode }) => <span className="n">{children}</span>;
export const CodeComment = ({ children }: { children: ReactNode }) => <span className="c">{children}</span>;

// ---------- Retro computer frame + industrial info panel ----------

/** Window with a title bar (three squares, the last `lime`) for code, screenshots and simulated screens. */
export const ComputerFrame = ({
  title,
  width,
  height,
  screen = "lilac",
  style,
  children,
}: {
  title: string;
  width: number;
  height: number;
  screen?: "lilac" | "paper" | "ink";
  style?: CSSProperties;
  children?: ReactNode;
}) => {
  const square = (fill?: string) => (
    <i style={{ display: "block", width: 16, height: 16, border: "2px solid var(--c-ink)", background: fill }} />
  );
  return (
    <div
      style={{
        width,
        height,
        background: "var(--c-paper)",
        border: "3px solid var(--c-ink)",
        color: "var(--c-ink)",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, height: 42, padding: "0 14px", borderBottom: "3px solid var(--c-ink)", flex: "none" }}>
        {square()}
        {square()}
        {square("var(--c-lime)")}
        <span style={{ ...monoSmall, marginLeft: 22 }}>{title}</span>
      </div>
      <div
        style={{
          flex: 1,
          margin: "20px 20px 20px",
          border: "2px solid var(--c-ink)",
          background: `var(--c-${screen})`,
          color: screen === "ink" ? "var(--c-paper)" : "var(--c-ink)",
          padding: 16,
          overflow: "hidden",
          ...monoSmall,
          lineHeight: 1.5,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Specification panel with four rivets and 2 px dividers: `OBJ. CLASS … A—3`. */
export const InfoPanel = ({ rows, width, style }: { rows: { k: string; v: string }[]; width: number; style?: CSSProperties }) => {
  const rivet = (pos: CSSProperties) => (
    <i style={{ position: "absolute", width: 15, height: 15, borderRadius: "50%", border: "3px solid var(--c-ink)", ...pos }} />
  );
  return (
    <div
      style={{
        position: "relative",
        width,
        background: "var(--c-paper)",
        border: "3px solid var(--c-ink)",
        color: "var(--c-ink)",
        padding: "24px 20px 24px 40px",
        ...style,
      }}
    >
      {rivet({ left: 12, top: 12 })}
      {rivet({ right: 12, top: 12 })}
      {rivet({ left: 12, bottom: 12 })}
      {rivet({ right: 12, bottom: 12 })}
      {rows.map((r, i) => (
        <div
          key={r.k}
          style={{
            ...monoSmall,
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            marginRight: 20,
            borderBottom: i < rows.length - 1 ? "2px solid var(--c-ink)" : undefined,
          }}
        >
          <span>{r.k}</span>
          <span>{r.v}</span>
        </div>
      ))}
    </div>
  );
};
