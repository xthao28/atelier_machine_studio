import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PIXEL_STEPS } from "../design-system";

export interface AnatomyClockOptions {
  /** Frame when the assembly starts exploding apart (at 60fps, default 24 = 0.4s). */
  explodeStart?: number;
  /** Frame when the assembly collapses back together (optional). */
  collapseStart?: number;
  /** Quantize motion into discrete mechanical steps (default: false for smooth 60fps springs). */
  quantized?: boolean;
  /** Number of discrete steps when quantized is true. */
  steps?: number;
}

export interface AnatomyClock {
  frame: number;
  fps: number;
  timeSec: number;
  /** Overall explode progress in [0, 1]. */
  explode: number;
  /** Staggered spring progress per tier (tier 0 = shell/NVS, 1 = PCB/MCU, 2 = IPS LCD). */
  tierExplode: [number, number, number, number];
  /** Physical button depression in [0, 1] for GPIO0 (BOOT / Praise +). */
  gpio0Press: number;
  /** Physical button depression in [0, 1] for GPIO14 (KEY / Scold -). */
  gpio14Press: number;
  /** Active NVS slot (0 = life0 Bank A, 1 = life1 Bank B). */
  activeSlot: 0 | 1;
  /** Generation counter incremented on NVS commit. */
  generation: number;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const quantize01 = (v: number, steps: number) => {
  const c = clamp01(v);
  return Math.round(c * steps) / steps;
};

/**
 * Deterministic 60fps spring-driven mechanical clock for Remotion isometric figures.
 * Pre-tuned physical spring damping so assemblies glide apart without stutter or overshoot pop.
 */
export function useAnatomyClock({
  explodeStart = 24,
  collapseStart,
  quantized = false,
  steps = PIXEL_STEPS,
}: AnatomyClockOptions = {}): AnatomyClock {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeSec = frame / fps;

  const shape = (val: number) => (quantized ? quantize01(val, steps) : clamp01(val));

  const springAt = (delayFrames: number, stiffness = 84, damping = 18, mass = 0.9) => {
    const open = spring({
      frame: frame - delayFrames,
      fps,
      config: { damping, stiffness, mass },
    });
    if (collapseStart === undefined) return shape(open);
    const close = spring({
      frame: frame - collapseStart,
      fps,
      config: { damping, stiffness, mass },
    });
    return shape(Math.max(0, open - close));
  };

  const tier1 = springAt(explodeStart, 90, 19, 0.85);
  const tier2 = springAt(explodeStart + Math.round(fps * 0.1), 82, 18, 0.95);
  const tier3 = springAt(explodeStart + Math.round(fps * 0.2), 76, 17, 1.05);
  const explode = tier3;

  // Smooth spring tactile button presses:
  // GPIO0 pressed around 1.8s..2.5s, GPIO14 pressed around 3.2s..3.9s
  const buttonPulse = (startSec: number, holdSec = 0.55) => {
    const startF = Math.round(startSec * fps);
    const endF = Math.round((startSec + holdSec) * fps);
    const down = spring({
      frame: frame - startF,
      fps,
      config: { damping: 15, stiffness: 180, mass: 0.5 },
    });
    const up = spring({
      frame: frame - endF,
      fps,
      config: { damping: 16, stiffness: 160, mass: 0.5 },
    });
    return shape(Math.max(0, down - up));
  };

  const gpio0Press = buttonPulse(1.7, 0.65);
  const gpio14Press = buttonPulse(3.1, 0.65);
  const switchFrame = Math.round(2.9 * fps);
  const activeSlot: 0 | 1 = frame >= switchFrame ? 1 : 0;
  const generation = 42 + (frame >= switchFrame ? 1 : 0);

  return {
    frame,
    fps,
    timeSec,
    explode,
    tierExplode: [0, tier1, tier2, tier3],
    gpio0Press,
    gpio14Press,
    activeSlot,
    generation,
  };
}
