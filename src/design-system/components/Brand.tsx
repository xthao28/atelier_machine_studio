import type { ReactNode } from "react";
import { formats, type FormatId } from "../formats";

/** Band position; defaults to the format's documented header or footer band. */
type Place = { left: number; top: number; width: number };

export const TAGLINE = "Making Machines Feel Alive.";
export const TAGLINE_VI = "Làm cho máy móc như có sự sống.";

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Wordmark left, one mono context label right (`PRJ—001 · Artificial life`, `Build log · 07`). */
export const BrandHeader = ({ context, format = "9:16", place }: { context: string; format?: FormatId; place?: Place }) => {
  const { left, top, width } = place ?? formats[format].header;
  return (
    <div className="am-abs am-header" style={{ left, top, width }}>
      <span className="am-wordmark">Atelier Machine</span>
      <span className="am-lab">{context}</span>
    </div>
  );
};

/** `<b>02</b> / 05`. The total counts the cover. Omit on 9:16 covers and single images. */
export const PageNumbering = ({ page, total }: { page: number; total: number }) => (
  <span className="am-page">
    <b>{pad2(page)}</b> / {pad2(total)}
  </span>
);

/** Swipe cue with an open arrow, or dots. The last slide uses `Follow` or `Save`, never a forward arrow to nothing. */
export const CarouselNav = ({
  label,
  dots,
}: {
  label?: "Swipe" | "Follow" | "Save";
  dots?: { count: number; active: number };
}) => (
  <span className="am-nav">
    {label}
    {dots ? (
      <span className="dots">
        {Array.from({ length: dots.count }, (_, i) => (
          <i key={i} className={i === dots.active ? "on" : undefined} />
        ))}
      </span>
    ) : (
      label && <span className="ar" />
    )}
  </span>
);

/**
 * Tagline left, optional page numbering centre, optional right slot (nav on carousels).
 * In video, leave out `page` and `right` unless they carry meaning.
 */
export const BrandFooter = ({
  format = "9:16",
  page,
  right,
  place,
}: {
  format?: FormatId;
  place?: Place;
  page?: { page: number; total: number };
  right?: ReactNode;
}) => {
  const { left, top, width } = place ?? formats[format].footer;
  return (
    <div className="am-abs am-footer" style={{ left, top, width }}>
      <span className="am-lab">{TAGLINE}</span>
      {page && <PageNumbering {...page} />}
      {right}
    </div>
  );
};
