import type { CSSProperties, ReactNode } from "react";

/** Fill by meaning: lilac concept, lime technical, orange artificial life / XUNA, ink hardware. */
export type TagFill = "lilac" | "lime" | "orange" | "ink" | "paper";

/** Pill tag naming the topic. Outline by default; at most one filled tag per slide. */
export const CategoryTag = ({ children, fill }: { children: ReactNode; fill?: TagFill }) => (
  <span className={fill ? `am-tag f-${fill}` : "am-tag"}>{children}</span>
);

/** `EXP—014`: inverted prefix block + three-digit number (+ optional revision cell). One per slide. */
export const ExperimentId = ({
  prefix,
  number,
  revision,
}: {
  prefix: "EXP" | "LOG" | "FIG";
  number: string | number;
  revision?: string;
}) => (
  <span className="am-expid">
    <b>{prefix}</b>
    <span>{typeof number === "number" ? String(number).padStart(3, "0") : number}</span>
    {revision && <span>{revision}</span>}
  </span>
);

/** Large numeral with a mono prefix. `future` numbers show in `muted`, never blank. */
export const ProjectNumber = ({
  number,
  prefix = "Project",
  future = false,
}: {
  number: string;
  prefix?: string;
  future?: boolean;
}) => (
  <div className="am-prj">
    <span className="am-lab">{prefix}</span>
    <strong style={future ? { color: "var(--mut)" } : undefined}>{number}</strong>
  </div>
);

/** The lime project-number block of the Project Reveal cover: `lime` field, 3 px `ink` border, `ink` numeral. */
export const ProjectNumberBlock = ({
  number,
  prefix = "Project",
  numeralSize = 132,
  style,
}: {
  number: string;
  prefix?: string;
  /** Minimum 96 px. */
  numeralSize?: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      background: "var(--c-lime)",
      border: "3px solid var(--c-ink)",
      padding: 24,
      color: "var(--c-ink)",
      ...style,
    }}
  >
    <div className="am-lab">{prefix}</div>
    <div style={{ font: `700 ${Math.max(96, numeralSize)}px/.85 var(--f-sans)`, letterSpacing: "-.04em", marginTop: 14 }}>
      {number}
    </div>
  </div>
);

/** `OBJ. CLASS` key in ink + coloured value: `A—3 · Artificial life` (lime), `B—1 · Interactive object` (lilac). */
export const ObjectClass = ({ value, fill = "lime" }: { value: string; fill?: "lime" | "lilac" }) => (
  <div className="am" style={{ border: "3px solid var(--c-ink)", display: "inline-flex", alignSelf: "flex-start" }}>
    <div className="am-lab" style={{ background: "var(--c-ink)", color: "var(--c-paper)", padding: "10px 14px" }}>
      Obj. class
    </div>
    <div className="am-lab" style={{ padding: "10px 14px", background: `var(--c-${fill})`, color: "var(--c-ink)" }}>
      {value}
    </div>
  </div>
);

/** Key and value stating one fact. Use real units with non-breaking spaces (`10 kΩ`). */
export const TechnicalLabel = ({ k, v }: { k: string; v: ReactNode }) => (
  <div className="am-lbl">
    <span className="k">{k}</span>
    <span className="v">{v}</span>
  </div>
);

/** A row of two to four technical labels, unboxed. */
export const TechnicalLabelRow = ({ items, gap = 36 }: { items: { k: string; v: ReactNode }[]; gap?: number }) => (
  <div style={{ display: "flex", gap, flexWrap: "wrap", alignItems: "center" }}>
    {items.map((it) => (
      <TechnicalLabel key={it.k} {...it} />
    ))}
  </div>
);

export type Status = "live" | "test" | "done" | "idle";

/** Shape + word, never colour alone: disc live, triangle testing, square done, dashed square upcoming. */
export const StatusIndicator = ({ status, children }: { status: Status; children: ReactNode }) => (
  <span className={`am-status is-${status}`}>
    <i />
    {children}
  </span>
);
