/**
 * Scene 01 — Hook & Project Reveal (`Scene01Hook.tsx`, 9:16, 60fps).
 * Focuses on what XUNA is and what XUNA can actually do in real life:
 * - Beat 1 (0.0s–3.0s, frames 0..179): Template 01 Project Reveal Cover on `paper`
 *   with live animated XUNA pixel art (`track_a_frames.png`), `ProjectNumberBlock` 001,
 *   and plainspoken maker intro.
 * - Beat 2 (3.0s–6.0s, frames 180..359): Hard cut to `lilac` Concept & Capabilities
 *   showing the 4 living behaviors XUNA performs on your desk.
 */
import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import {
  Abs,
  AmCaptionRail,
  AmWordEmbed,
  BrandFooter,
  BrandHeader,
  CarouselNav,
  CategoryTag,
  CharacterFrame,
  CoordinateLabel,
  Crosshair,
  Cut,
  DashedOrbit,
  formats,
  PixelSprite,
  PixelWipe,
  ProjectNumberBlock,
  SceneSfxTrack,
  SectionHeading,
  Slide,
  spriteFrame,
  StatusIndicator,
  SvgLabel,
  SvgLayer,
  type SpriteSheet,
} from "../design-system";
import {
  resolveSceneDurationFrames,
  resolveSceneWordFrame,
  useWordTimeline,
} from "../hooks/useWordTimeline";

/** Word-anchored Beat 1 -> Beat 2 cut frame: cuts right as voiceover says "Đây là XUNA" (~frame 192). */
export const SCENE01_BEAT1_FRAMES = resolveSceneWordFrame("scene-01-hook", "XUNA", 0, -6);
export const SCENE01_DURATION = resolveSceneDurationFrames("scene-01-hook"); // 480 frames (8.0s @ 60fps)
export const SCENE01_BEAT2_FRAMES = SCENE01_DURATION - SCENE01_BEAT1_FRAMES;

const { safe, sectionTop } = formats["9:16"];
const safeWidth = safe.right - safe.left;

/** Supplied Track A expressive sprite sheet: 16 columns × 4 rows of 96 × 72 px. */
export const TRACK_A_SPRITE: SpriteSheet = {
  src: "xuna-sync/sprites/track_a_frames.png",
  frameWidth: 96,
  frameHeight: 72,
  columns: 16,
  rows: 4,
};

const FRAME = { left: 500, top: 600, size: 400 };
const frameCenter = {
  x: FRAME.left + FRAME.size / 2,
  y: FRAME.top + FRAME.size / 2,
};

const EXPRESSIONS = [
  { row: 2, label: "STATE · BOUNCE PLAY" },
  { row: 0, label: "STATE · LOOK AROUND" },
  { row: 3, label: "STATE · GREET NUZZLE" },
] as const;

const Beat1ProjectRevealCover: React.FC = () => {
  const frame = useCurrentFrame();
  const { isStillness, climaxFrame } = useWordTimeline("scene-01-hook");
  const effectiveFrame = isStillness && climaxFrame > 0 ? climaxFrame - 12 : frame;
  const exprIndex = Math.floor(effectiveFrame / 60) % EXPRESSIONS.length;
  const activeExpr = EXPRESSIONS[exprIndex]!;

  return (
    <Slide format="9:16" ground="paper" grid grain>
      <BrandHeader context="PRJ—001 · Artificial life" />

      <PixelWipe
        at={6}
        steps={8}
        framesPerStep={2}
        className="am-abs am-xl"
        style={{ left: 66, top: 340 }}
      >
        XUNA
      </PixelWipe>

      <Cut at={18}>
        <Abs left={safe.left} top={575} width={400} className="am-h2">
          An evolving
          <br />
          AI pixel pet
        </Abs>
      </Cut>

      <PixelWipe
        at={24}
        steps={8}
        framesPerStep={2}
        direction="down"
        className="am-abs"
        style={{ left: FRAME.left, top: FRAME.top }}
      >
        <CharacterFrame size={FRAME.size}>
          <PixelSprite
            sheet={TRACK_A_SPRITE}
            column={spriteFrame(effectiveFrame, TRACK_A_SPRITE.columns, 5, 24)}
            row={activeExpr.row}
            scale={3}
          />
        </CharacterFrame>
      </PixelWipe>

      <Cut at={40}>
        <SvgLayer format="9:16">
          <DashedOrbit cx={frameCenter.x} cy={frameCenter.y} r={230} />
          <Crosshair x={FRAME.left - 20} y={FRAME.top - 20} />
          <Crosshair x={FRAME.left + FRAME.size + 20} y={FRAME.top - 20} />
          <Crosshair x={FRAME.left - 20} y={FRAME.top + FRAME.size + 20} />
          <Crosshair x={FRAME.left + FRAME.size + 20} y={FRAME.top + FRAME.size + 20} />
          <CoordinateLabel x={FRAME.left + 20} y={FRAME.top - 36}>
            X 12.40 · Y 08.75
          </CoordinateLabel>
          <SvgLabel x={FRAME.left + FRAME.size} y={FRAME.top + FRAME.size + 66} small anchor="end">
            {activeExpr.label}
          </SvgLabel>
        </SvgLayer>
      </Cut>

      <PixelWipe
        at={48}
        steps={8}
        framesPerStep={2}
        className="am-abs"
        style={{ left: safe.left, top: 760, width: 380 }}
      >
        <ProjectNumberBlock number="001" style={{ height: 200 }} />
      </PixelWipe>

      {/* Body text: 17 words, plainspoken maker voice */}
      <Cut at={60}>
        <Abs left={safe.left} top={1080} width={580} className="am-b">
          A small physical creature that senses light, remembers how you treat it, and slowly becomes someone.
        </Abs>
      </Cut>

      <Abs
        left={safe.left}
        top={1300}
        width={safeWidth}
        style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}
      >
        <Cut at={72}>
          <CategoryTag fill="lilac">Artificial life</CategoryTag>
        </Cut>
        <Cut at={78}>
          <CategoryTag>Physical AI</CategoryTag>
        </Cut>
        <Cut at={84}>
          <CategoryTag>Pixel art</CategoryTag>
        </Cut>
      </Abs>

      <Cut at={90}>
        <BrandFooter />
      </Cut>
    </Slide>
  );
};

const CAPABILITIES = [
  {
    code: "01 · TOUCH",
    title: "Feels how you treat it",
    desc: "Praise or scold via physical buttons shapes its real mood.",
    row: 2,
    badge: "GPIO0 / 14",
  },
  {
    code: "02 · RHYTHM",
    title: "Knows when you return",
    desc: "Learns your desk schedule and wakes up to greet you.",
    row: 3,
    badge: "ROUTINE AI",
  },
  {
    code: "03 · CHARACTER",
    title: "Grows its own traits",
    desc: "Ten traits shift over days—curious, playful, or calm.",
    row: 0,
    badge: "10 TRAITS",
  },
  {
    code: "04 · VOICE",
    title: "Talks in its own mood",
    desc: "Natural voice chat shaped by its personality and memory.",
    row: 1,
    badge: "VOICE V1",
  },
] as const;

const Beat2WhatXunaDoes: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Slide format="9:16" ground="lilac" grid grain>
      <BrandHeader context="PRJ—001 · What XUNA does" />

      <Abs left={safe.left} top={sectionTop} width={safeWidth}>
        <SectionHeading index={1} title="Living companion" context="What it does" />
      </Abs>

      {/* Headline: 6 words, single line in .am-h2 (64px) */}
      <PixelWipe
        at={6}
        steps={8}
        framesPerStep={2}
        className="am-abs am-h2"
        style={{ left: safe.left, top: 418, width: safeWidth }}
      >
        Not a chatbot in a box.
      </PixelWipe>

      {/* Lead: 20 words, clear below headline */}
      <Cut at={18}>
        <Abs left={safe.left} top={504} width={safeWidth} className="am-b">
          XUNA lives on your desk, reacts to your touch, learns your daily rhythm, and grows its own personality.
        </Abs>
      </Cut>

      {/* 2×2 Living Capability Showcase Cards with real animated XUNA sprites */}
      <Abs
        left={safe.left}
        top={608}
        width={safeWidth}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-3)",
        }}
      >
        {CAPABILITIES.map((cap, idx) => (
          <Cut key={cap.code} at={24 + idx * 8}>
            <div
              style={{
                background: "var(--paper)",
                border: "var(--stroke-line) solid var(--ink)",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "var(--stroke-hair) solid var(--ink)",
                  paddingBottom: "var(--space-1)",
                }}
              >
                <span className="am-lab" style={{ color: "var(--ink)" }}>
                  {cap.code}
                </span>
                <span
                  className="am-meta"
                  style={{
                    background: idx === 0 ? "var(--lime)" : "var(--paper-shade)",
                    color: "var(--ink)",
                    padding: "2px 8px",
                    border: "var(--stroke-hair) solid var(--ink)",
                  }}
                >
                  {cap.badge}
                </span>
              </div>

              <div
                style={{
                  background: "var(--orange)",
                  border: "var(--stroke-line) solid var(--ink)",
                  height: 86,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PixelSprite
                  sheet={TRACK_A_SPRITE}
                  column={spriteFrame(frame + idx * 12, TRACK_A_SPRITE.columns, 5, 0)}
                  row={cap.row}
                  scale={1}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div className="am-b" style={{ fontWeight: 600, color: "var(--ink)", lineHeight: 1.15 }}>
                  {cap.title}
                </div>
                <div className="am-cap" style={{ color: "var(--ink-soft)", lineHeight: 1.25 }}>
                  {cap.desc}
                </div>
              </div>
            </div>
          </Cut>
        ))}
      </Abs>

      {/* Bottom status & category strip */}
      <Cut at={64}>
        <Abs
          left={safe.left}
          top={1318}
          width={safeWidth}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <CategoryTag fill="lime">100% Local Brain</CategoryTag>
            <CategoryTag>LILYGO T-Display-S3</CategoryTag>
          </div>
          <StatusIndicator status="live">Living on desk</StatusIndicator>
        </Abs>
      </Cut>

      <Cut at={72}>
        <BrandFooter page={{ page: 1, total: 6 }} right={<CarouselNav label="Swipe" />} />
      </Cut>
    </Slide>
  );
};

export const Scene01Hook: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={SCENE01_BEAT1_FRAMES}>
      <Beat1ProjectRevealCover />
    </Sequence>
    <Sequence from={SCENE01_BEAT1_FRAMES} durationInFrames={SCENE01_BEAT2_FRAMES}>
      <Beat2WhatXunaDoes />
    </Sequence>
    <AmWordEmbed sceneId="scene-01-hook" top={1145} />
    <AmCaptionRail sceneId="scene-01-hook" />
    <SceneSfxTrack sceneId="scene-01-hook" />
  </>
);

