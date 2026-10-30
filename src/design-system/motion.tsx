/**
 * Motion rules (DESIGN_SYSTEM.md §2): cuts and 8-frame pixel steps, never easing blurs or glitch.
 * Everything is driven by useCurrentFrame(); never use CSS animations or transitions in a render.
 */
import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame } from "remotion";

export const PIXEL_STEPS = 8;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Progress 0..1 in 8 discrete steps over `frames` frames, starting at frame `at`.
 * The first step shows on frame `at`; the last (1) on frame `at + frames - 1`.
 */
export const pixelStep = (frame: number, at: number, frames = PIXEL_STEPS) => {
  if (frame < at) return 0;
  const linear = clamp01((frame - at + 1) / frames);
  return Math.ceil(linear * PIXEL_STEPS - 1e-9) / PIXEL_STEPS;
};

/** A number that counts from `from` to `to` in 8 discrete steps (readouts, progress counts). */
export const stepCount = (frame: number, at: number, from: number, to: number, frames = PIXEL_STEPS) =>
  Math.round(from + (to - from) * pixelStep(frame, at, frames));

/** Index into a sprite row: holds each sprite frame for `hold` video frames, then loops. */
export const spriteFrame = (frame: number, count: number, hold = 4, at = 0) =>
  Math.floor(Math.max(0, frame - at) / hold) % count;

/** Hard cut: children exist only from frame `at` (and before `until`, if given). */
export const Cut = ({ at = 0, until, children }: { at?: number; until?: number; children: ReactNode }) => {
  const frame = useCurrentFrame();
  if (frame < at || (until !== undefined && frame >= until)) return null;
  return <>{children}</>;
};

export type WipeDirection = "right" | "left" | "down" | "up";

const insetFor = (direction: WipeDirection, hidden: number) => {
  const h = `${(hidden * 100).toFixed(3)}%`;
  switch (direction) {
    case "right":
      return `inset(0 ${h} 0 0)`;
    case "left":
      return `inset(0 0 0 ${h})`;
    case "down":
      return `inset(0 0 ${h} 0)`;
    case "up":
      return `inset(${h} 0 0 0)`;
  }
};

/**
 * Reveals its children with a hard-edged wipe in 8 steps. Wraps them in a block that keeps
 * the children's own layout; put positioning on the wrapper with `style` or `className`.
 */
export const PixelWipe = ({
  at = 0,
  frames = PIXEL_STEPS,
  direction = "right",
  className,
  style,
  children,
}: {
  at?: number;
  frames?: number;
  direction?: WipeDirection;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) => {
  const frame = useCurrentFrame();
  const p = pixelStep(frame, at, frames);
  if (p === 0) return null;
  return (
    <div className={className} style={{ ...style, clipPath: p < 1 ? insetFor(direction, 1 - p) : undefined }}>
      {children}
    </div>
  );
};
