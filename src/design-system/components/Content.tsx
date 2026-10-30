import type { CSSProperties, ReactNode } from "react";

/** Opens a section on an inner slide: mono number, `h3` title, optional mono context. Never on covers. */
export const SectionHeading = ({ index, title, context }: { index: number; title: string; context?: string }) => (
  <div className="am-sec">
    <span className="am-lab">{String(index).padStart(2, "0")}</span>
    <span className="am-h3">{title}</span>
    {context && <span className="am-lab">{context}</span>}
  </div>
);

/** Circled number, short title, one-sentence description. Three to four per slide. */
export const NumberedStep = ({ n, title, description }: { n: number | string; title: string; description?: string }) => (
  <div className="am-step">
    <span className="n">{n}</span>
    <div>
      <div className="t">{title}</div>
      {description && <div className="d">{description}</div>}
    </div>
  </div>
);

/** Stack of numbered steps, 24 px apart (`space-3`). */
export const NumberedSteps = ({
  steps,
  gap = 24,
  style,
}: {
  steps: { title: string; description?: string }[];
  gap?: number;
  style?: CSSProperties;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>
    {steps.map((s, i) => (
      <NumberedStep key={s.title} n={i + 1} {...s} />
    ))}
  </div>
);

/** Ruled key/value table. Three to five rows; put status last with a `StatusIndicator`. */
export const MetadataBlock = ({ rows, style }: { rows: { k: string; v: ReactNode }[]; style?: CSSProperties }) => (
  <div className="am-meta-block" style={style}>
    {rows.flatMap((r) => [
      <div key={`${r.k}-k`} className="k">
        {r.k}
      </div>,
      <div key={`${r.k}-v`} className="v">
        {r.v}
      </div>,
    ])}
  </div>
);

/**
 * Display quote with a hanging mark and a label attribution. Two to four lines; leave 40% of the slide empty.
 * Highlight at most one phrase with `QuoteHighlight`.
 */
export const QuoteBlock = ({ children, by, style }: { children: ReactNode; by?: string; style?: CSSProperties }) => (
  <div className="am-quote" style={style}>
    <span className="mk">“</span>
    <div className="qt">{children}</div>
    {by && <div className="by am-lab">— {by}</div>}
  </div>
);

/** The one highlighted phrase in a quote: `lime` on dark grounds, `orange` on light. */
export const QuoteHighlight = ({ children, on }: { children: ReactNode; on: "light" | "dark" }) => (
  <span style={{ color: on === "dark" ? "var(--c-lime)" : "var(--c-orange)" }}>{children}</span>
);

/**
 * One segment per stage: `done` lime, the next one `orange` when `current`, the rest outline.
 * Always carries a mono label; colour is never the only signal.
 */
export const ProgressIndicator = ({
  label,
  total,
  done,
  current = true,
  style,
}: {
  label: string;
  total: number;
  done: number;
  current?: boolean;
  style?: CSSProperties;
}) => (
  <div className="am-prog" style={style}>
    <div className="am-lab">{label}</div>
    <div className="bar">
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={i < done ? "seg on" : i === done && current ? "seg now" : "seg"} />
      ))}
    </div>
  </div>
);
