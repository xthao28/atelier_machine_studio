/**
 * Instagram Reel #01 — Minimalist Editorial Edition (`src/compositions/Reel01TwinExperiment.tsx`).
 *
 * Redesigned per user feedback:
 * 1. 100% Language Purity: `Reel01TwinExperimentVI` uses pure Vietnamese (only keeping mandatory hardware/AI proper nouns:
 *    `XUNA`, `AI`, `Pixel Art`, `LILYGO T-Display-S3`, `ESP32-S3`, `C++11`, `Flash NVS`, `CRC32`, `GPIO0 / GPIO14`).
 * 2. Minimalist & Warm Visual Design:
 *    - No background grid lines (`grid` removed).
 *    - Warm muted earth tones (`#E4DFD1` sand & `#B9B5AA` stone, `#242424` charcoal ink) — never harsh bright white.
 *    - Clean 3-part hierarchy per screen (Minimal Header -> Hero Visual -> Clean Centered Subtitle Pill).
 * 3. Real Neural Voiceover (`reel01-vi.mp3` & `reel01-en.mp3`) + relaxed 5-word subtitle chunks.
 */
import React, { useMemo } from "react";
import { Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Abs,
  color,
  Cut,
  PixelSprite,
  PixelWipe,
  spriteFrame,
  stepCount,
} from "../design-system";
import { LilygoExplodedMachine } from "../components/isometric/LilygoExplodedMachine";
import { useAnatomyClock } from "../hooks/useAnatomyClock";
import { TRACK_A_SPRITE } from "../scenes/Scene01Hook";
import {
  REEL01_BEATS,
  REEL01_DURATION_FRAMES,
  REEL01_PACKS,
  REEL01_SFX_CUES,
  type ReelLocale,
  type ReelLocalePack,
  type ReelWordItem,
} from "../data/reel01Data";

export { REEL01_DURATION_FRAMES };

// Warm, brighter cream palette (warm & inviting, never cold white)
const PALETTE = {
  sand: "#F4EFE4", // Warm bright cream background
  stone: "#E7DFCF", // Warm light sand secondary surface
  cardLight: "#FAF8F3", // Crisp warm ivory card surface
  ink: "#242424", // Deep charcoal ink
  inkSoft: "#4A4A46", // Muted secondary ink
  orange: "#FF9B56", // Xuân/Xuna living accent
  lime: "#D9F57A", // Technical highlight
  lilac: "#D9CBF6", // Secondary soft accent
} as const;

const SAFE_LEFT = 72;
const SAFE_WIDTH = 936; // Balanced 72px left & right margins on 1080px canvas
const TWIN_TOP = 590;
const TWIN_CARD_W = (SAFE_WIDTH - 28) / 2; // 454px each

const FONT_SANS = '"Be Vietnam Pro", "Space Grotesk", sans-serif';
const FONT_MONO = '"IBM Plex Mono", monospace';

// ============================================================================
// MINIMAL TOP BAR (Replaces cluttered BrandHeader + SectionHeading + Footer)
// ============================================================================
const MinimalHeader: React.FC<{
  brand: string;
  stepText: string;
  badgeText?: string;
  badgeBg?: string;
  dark?: boolean;
}> = ({ brand, stepText, badgeText, badgeBg = PALETTE.lime, dark = false }) => {
  const fg = dark ? PALETTE.sand : PALETTE.ink;
  return (
    <Abs
      left={SAFE_LEFT}
      top={236}
      width={SAFE_WIDTH}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 18,
        borderBottom: `2px solid ${fg}`,
      }}
    >
      <span
        style={{
          fontFamily: FONT_SANS,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: fg,
        }}
      >
        {brand}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {badgeText && (
          <span
            style={{
              fontFamily: FONT_SANS,
              fontSize: 18,
              fontWeight: 700,
              padding: "5px 14px",
              background: badgeBg,
              color: PALETTE.ink,
              border: `2px solid ${PALETTE.ink}`,
            }}
          >
            {badgeText}
          </span>
        )}
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 20,
            fontWeight: 500,
            color: fg,
          }}
        >
          {stepText}
        </span>
      </div>
    </Abs>
  );
};

// ============================================================================
// SHARED MINIMAL TWIN CARDS (Used in Beat 1 & Beat 5 for Seamless Loop)
// ============================================================================
const MinimalTwinCards: React.FC<{
  pack: ReelLocalePack;
  diverged: boolean;
  dark?: boolean;
}> = ({ pack, diverged, dark = false }) => {
  const frame = useCurrentFrame();
  const pctA = diverged ? stepCount(frame, 130, 50, 92, 16) : 50;
  const pctB = diverged ? stepCount(frame, 130, 50, 22, 16) : 50;

  const renderUnit = (
    title: string,
    status: string,
    traitLabel: string,
    pct: number,
    spriteRow: number,
    spriteHold: number,
    screenBg: string,
    accentBg: string,
  ) => (
    <div
      style={{
        width: TWIN_CARD_W,
        background: dark ? "#2F2F2C" : PALETTE.cardLight,
        border: `3px solid ${dark ? PALETTE.sand : PALETTE.ink}`,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        boxSizing: "border-box",
      }}
    >
      {/* Unit Title */}
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 22,
          fontWeight: 700,
          color: dark ? PALETTE.sand : PALETTE.ink,
          letterSpacing: "0.02em",
        }}
      >
        {title}
      </div>

      {/* Large Clean Pixel Art Screen */}
      <div
        style={{
          height: 290,
          background: screenBg,
          border: `3px solid ${PALETTE.ink}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PixelSprite
          sheet={TRACK_A_SPRITE}
          column={spriteFrame(frame, TRACK_A_SPRITE.columns, spriteHold, 0)}
          row={spriteRow}
          scale={2.4}
        />
      </div>

      {/* Single Clean Status Pill */}
      <div
        style={{
          background: accentBg,
          color: PALETTE.ink,
          border: `2px solid ${PALETTE.ink}`,
          padding: "10px 14px",
          fontFamily: FONT_SANS,
          fontSize: 23,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {status}
      </div>

      {/* Single Clean Bond Bar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: FONT_SANS,
            fontSize: 18,
            fontWeight: 600,
            color: dark ? PALETTE.stone : PALETTE.inkSoft,
          }}
        >
          <span>{traitLabel}</span>
          <span style={{ fontFamily: FONT_MONO, fontWeight: 700 }}>{pct}%</span>
        </div>
        <div
          style={{
            height: 14,
            background: dark ? PALETTE.ink : PALETTE.sand,
            border: `2px solid ${dark ? PALETTE.sand : PALETTE.ink}`,
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: accentBg,
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Abs
      left={SAFE_LEFT}
      top={TWIN_TOP}
      width={SAFE_WIDTH}
      style={{ display: "flex", justifyContent: "space-between", gap: 28 }}
    >
      {renderUnit(
        pack.beat1.unitATitle,
        diverged ? pack.beat1.unitAStatusDay7 : pack.beat1.unitAStatusDay1,
        pack.beat1.unitATraitLabel,
        pctA,
        diverged ? 2 : 0,
        diverged ? 4 : 6,
        diverged ? PALETTE.orange : PALETTE.stone,
        diverged ? PALETTE.lime : PALETTE.sand,
      )}
      {renderUnit(
        pack.beat1.unitBTitle,
        diverged ? pack.beat1.unitBStatusDay7 : pack.beat1.unitBStatusDay1,
        pack.beat1.unitBTraitLabel,
        pctB,
        diverged ? 1 : 0,
        diverged ? 9 : 6,
        PALETTE.stone,
        diverged ? PALETTE.lilac : PALETTE.sand,
      )}
    </Abs>
  );
};

// ============================================================================
// BEAT 1 (0.0s..6.5s): TWIN EXPERIMENT HOOK (Warm Sand `#E4DFD1`)
// ============================================================================
const Beat1TwinExperiment: React.FC<{ pack: ReelLocalePack }> = ({ pack }) => {
  const frame = useCurrentFrame();
  // Switch from Day 01 to Day 07 at frame 132 (2.2s) right as voiceover says "Nhưng sau 7 ngày..."
  const diverged = frame >= 132;

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: PALETTE.sand,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <MinimalHeader
        brand={pack.headerBrand}
        stepText="01 / 05"
        badgeText={diverged ? pack.beat1.tagDay7 : pack.beat1.tagDay1}
        badgeBg={diverged ? PALETTE.lime : PALETTE.cardLight}
      />

      <Abs left={SAFE_LEFT} top={324} width={SAFE_WIDTH}>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 46,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: PALETTE.ink,
            marginBottom: 14,
          }}
        >
          {diverged ? pack.beat1.headlineDay7 : pack.beat1.headlineDay1}
        </div>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 27,
            fontWeight: 500,
            lineHeight: 1.35,
            color: PALETTE.inkSoft,
          }}
        >
          {diverged ? pack.beat1.subheadDay7 : pack.beat1.subheadDay1}
        </div>
      </Abs>

      <MinimalTwinCards pack={pack} diverged={diverged} />
    </div>
  );
};

// ============================================================================
// BEAT 2 (6.5s..13.0s): CLEAN HERO PORTRAIT OF XUNA (Warm Stone `#B9B5AA` -> `#E4DFD1`)
// ============================================================================
const Beat2HeroPortrait: React.FC<{ pack: ReelLocalePack }> = ({ pack }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: PALETTE.stone,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <MinimalHeader
        brand={pack.headerBrand}
        stepText="02 / 05"
        badgeText={pack.beat2.kicker}
        badgeBg={PALETTE.cardLight}
      />

      {/* Crossed-out anti-chatbot banner */}
      <Cut at={4}>
        <Abs left={SAFE_LEFT} top={330} width={SAFE_WIDTH}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              background: PALETTE.sand,
              border: `2px solid ${PALETTE.ink}`,
              padding: "10px 20px",
              fontFamily: FONT_SANS,
              fontSize: 25,
              fontWeight: 600,
              color: PALETTE.inkSoft,
              textDecoration: "line-through",
              textDecorationThickness: "3px",
              textDecorationColor: PALETTE.ink,
            }}
          >
            {pack.beat2.rejectLine}
          </div>
        </Abs>
      </Cut>

      {/* Centerpiece Gallery Card */}
      <PixelWipe
        at={18}
        steps={8}
        framesPerStep={2}
        direction="down"
        style={{
          position: "absolute",
          left: SAFE_LEFT,
          top: 430,
          width: SAFE_WIDTH,
        }}
      >
        <div
          style={{
            background: PALETTE.cardLight,
            border: `3px solid ${PALETTE.ink}`,
            padding: "40px 44px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 28,
          }}
        >
          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: PALETTE.ink,
            }}
          >
            {pack.beat2.headline}
          </div>

          {/* Clean Orange Screen Frame */}
          <div
            style={{
              width: 420,
              height: 340,
              background: PALETTE.orange,
              border: `3px solid ${PALETTE.ink}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PixelSprite
              sheet={TRACK_A_SPRITE}
              column={spriteFrame(frame, TRACK_A_SPRITE.columns, 5, 0)}
              row={2}
              scale={3.2}
            />
          </div>

          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 31,
              fontWeight: 500,
              lineHeight: 1.38,
              color: PALETTE.ink,
              maxWidth: 780,
            }}
          >
            {pack.beat2.subhead}
          </div>

          {/* 3 Clean Pills */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            {pack.beat2.pills.map((pill, i) => (
              <span
                key={pill}
                style={{
                  fontFamily: i === 1 ? FONT_MONO : FONT_SANS,
                  fontSize: 21,
                  fontWeight: 700,
                  padding: "8px 20px",
                  borderRadius: 999,
                  background: i === 0 ? PALETTE.lime : PALETTE.sand,
                  color: PALETTE.ink,
                  border: `2px solid ${PALETTE.ink}`,
                }}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </PixelWipe>
    </div>
  );
};

// ============================================================================
// BEAT 3 (13.0s..23.5s): 4 LIVING CAPABILITIES (1 Hero Stage + 4 Clean Step Rows)
// ============================================================================
const Beat3Capabilities: React.FC<{ pack: ReelLocalePack }> = ({ pack }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;

  const caps = pack.beat3.capabilities;
  const activeIdx =
    sec >= caps[3].highlightAtSec
      ? 3
      : sec >= caps[2].highlightAtSec
        ? 2
        : sec >= caps[1].highlightAtSec
          ? 1
          : 0;
  const activeCap = caps[activeIdx]!;

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: PALETTE.sand,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <MinimalHeader
        brand={pack.headerBrand}
        stepText="03 / 05"
        badgeText={pack.beat3.kicker}
        badgeBg={PALETTE.lime}
      />

      <Abs left={SAFE_LEFT} top={324} width={SAFE_WIDTH}>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 43,
            fontWeight: 700,
            lineHeight: 1.15,
            color: PALETTE.ink,
          }}
        >
          {pack.beat3.headline}
        </div>
      </Abs>

      {/* Top Hero Stage showing the currently active capability clearly */}
      <Abs left={SAFE_LEFT} top={412} width={SAFE_WIDTH}>
        <div
          style={{
            background: PALETTE.cardLight,
            border: `3px solid ${PALETTE.ink}`,
            padding: 28,
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 28,
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: 220,
              background: PALETTE.orange,
              border: `3px solid ${PALETTE.ink}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PixelSprite
              sheet={TRACK_A_SPRITE}
              column={spriteFrame(frame, TRACK_A_SPRITE.columns, 4, 0)}
              row={activeCap.row}
              scale={2.2}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 19,
                  fontWeight: 700,
                  padding: "4px 12px",
                  background: PALETTE.lime,
                  border: `2px solid ${PALETTE.ink}`,
                  color: PALETTE.ink,
                }}
              >
                {activeCap.step} · {activeCap.badge}
              </span>
            </div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 36,
                fontWeight: 700,
                lineHeight: 1.15,
                color: PALETTE.ink,
              }}
            >
              {activeCap.title}
            </div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 26,
                fontWeight: 500,
                lineHeight: 1.35,
                color: PALETTE.inkSoft,
              }}
            >
              {activeCap.desc}
            </div>
          </div>
        </div>
      </Abs>

      {/* 4 Clean Step Rows Below */}
      <Abs
        left={SAFE_LEFT}
        top={736}
        width={SAFE_WIDTH}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        {caps.map((cap, idx) => {
          const isCurrent = idx === activeIdx;
          const isDone = idx < activeIdx;
          return (
            <div
              key={cap.step}
              style={{
                background: isCurrent
                  ? PALETTE.ink
                  : isDone
                    ? PALETTE.cardLight
                    : PALETTE.stone,
                color: isCurrent ? PALETTE.sand : PALETTE.ink,
                border: `3px solid ${PALETTE.ink}`,
                padding: "22px 26px",
                display: "grid",
                gridTemplateColumns: "64px 1fr auto",
                alignItems: "center",
                gap: 18,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 26,
                  fontWeight: 700,
                  color: isCurrent ? PALETTE.orange : PALETTE.ink,
                }}
              >
                {cap.step}
              </span>
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 29,
                  fontWeight: 700,
                }}
              >
                {cap.title}
              </span>
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 18,
                  fontWeight: 700,
                  padding: "5px 14px",
                  background: isCurrent ? PALETTE.lime : PALETTE.sand,
                  color: PALETTE.ink,
                  border: `2px solid ${PALETTE.ink}`,
                }}
              >
                {cap.badge}
              </span>
            </div>
          );
        })}
      </Abs>
    </div>
  );
};

// ============================================================================
// BEAT 4 (23.5s..31.5s): ISOMETRIC HARDWARE PROOF (Clean Warm Sand `#E4DFD1`)
// ============================================================================
const Beat4HardwareProof: React.FC<{ pack: ReelLocalePack }> = ({ pack }) => {
  const clock = useAnatomyClock({
    explodeStart: 54,
    collapseStart: 390,
    gpio0Frames: [130],
    gpio14Frames: [240],
    slotToggleFrame: 240,
    quantized: false,
  });

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: PALETTE.sand,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <MinimalHeader
        brand={pack.headerBrand}
        stepText="04 / 05"
        badgeText={pack.beat4.kicker}
        badgeBg={PALETTE.lime}
      />

      <Abs left={SAFE_LEFT} top={326} width={SAFE_WIDTH}>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 50,
            fontWeight: 700,
            lineHeight: 1.12,
            color: PALETTE.ink,
            marginBottom: 14,
          }}
        >
          {pack.beat4.headline}
        </div>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.35,
            color: PALETTE.inkSoft,
          }}
        >
          {pack.beat4.subhead}
        </div>
      </Abs>

      {/* Clean Card Wrapping the 60fps Isometric Rig (No grid clutter) */}
      <Abs
        left={SAFE_LEFT}
        top={520}
        width={SAFE_WIDTH}
        height={640}
        style={{
          background: PALETTE.cardLight,
          border: `3px solid ${PALETTE.ink}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LilygoExplodedMachine
          explode={clock.explode}
          gpio0Press={clock.gpio0Press}
          gpio14Press={clock.gpio14Press}
          activeSlot={clock.activeSlot}
          showCallouts
        />
      </Abs>

      {/* Clean 3-Column Spec Bar */}
      <Abs
        left={SAFE_LEFT}
        top={1188}
        width={SAFE_WIDTH}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          border: `3px solid ${PALETTE.ink}`,
          background: PALETTE.stone,
        }}
      >
        {pack.beat4.specs.map((s, idx) => (
          <div
            key={s.k}
            style={{
              padding: "18px 20px",
              borderLeft: idx > 0 ? `2px solid ${PALETTE.ink}` : "none",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: 17,
                fontWeight: 700,
                color: PALETTE.inkSoft,
              }}
            >
              {s.k}
            </span>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 24,
                fontWeight: 700,
                color: PALETTE.ink,
              }}
            >
              {s.v}
            </span>
          </div>
        ))}
      </Abs>
    </div>
  );
};

// ============================================================================
// BEAT 5 (31.5s..36.0s): PAYOFF QUESTION & SEAMLESS LOOP TO BEAT 1 (`#242424`)
// ============================================================================
const Beat5PayoffLoop: React.FC<{ pack: ReelLocalePack }> = ({ pack }) => (
  <div
    style={{
      width: 1080,
      height: 1920,
      background: PALETTE.ink,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <MinimalHeader
      brand={pack.headerBrand}
      stepText="05 / 05"
      badgeText={pack.beat5.kicker}
      badgeBg={PALETTE.orange}
      dark
    />

    <Abs left={SAFE_LEFT} top={328} width={SAFE_WIDTH}>
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 50,
          fontWeight: 700,
          lineHeight: 1.14,
          color: PALETTE.sand,
          marginBottom: 14,
        }}
      >
        {pack.beat5.headline}
      </div>
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 28,
          fontWeight: 500,
          lineHeight: 1.35,
          color: PALETTE.stone,
        }}
      >
        {pack.beat5.subhead}
      </div>
    </Abs>

    {/* Exact same coordinates (top = 590) as Beat 1 for a seamless loop on Instagram */}
    <MinimalTwinCards pack={pack} diverged dark />

    <Abs left={SAFE_LEFT} top={1210} width={SAFE_WIDTH}>
      <div
        style={{
          background: PALETTE.lime,
          color: PALETTE.ink,
          border: `3px solid ${PALETTE.sand}`,
          padding: "20px 24px",
          fontFamily: FONT_SANS,
          fontSize: 26,
          fontWeight: 800,
          textAlign: "center",
          letterSpacing: "0.03em",
        }}
      >
        {pack.beat5.ctaText}
      </div>
    </Abs>
  </div>
);

// ============================================================================
// MINIMAL CENTERED SUBTITLE BAR + VOICEOVER AUDIO & SFX
// ============================================================================
const ReelSubtitleAndAudio: React.FC<{
  pack: ReelLocalePack;
  words: ReelWordItem[];
}> = ({ pack, words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Group into comfortable 6-word chunks so the viewer's eyes never feel rushed
  const CHUNK_SIZE = 6;
  const { activeWord, chunkWords } = useMemo(() => {
    let foundIdx = -1;
    for (let i = 0; i < words.length; i++) {
      const w = words[i]!;
      const next = words[i + 1];
      const effectiveEnd = next ? Math.min(next.startMs, w.endMs + 350) : w.endMs + 420;
      if (currentMs >= w.startMs && currentMs < effectiveEnd) {
        foundIdx = i;
        break;
      }
    }
    if (foundIdx === -1) {
      return { activeWord: null, chunkWords: [] as ReelWordItem[] };
    }
    const chunkStart = Math.floor(foundIdx / CHUNK_SIZE) * CHUNK_SIZE;
    return {
      activeWord: words[foundIdx]!,
      chunkWords: words.slice(chunkStart, chunkStart + CHUNK_SIZE),
    };
  }, [words, currentMs]);

  return (
    <>
      {chunkWords.length > 0 && (
        <Abs
          left={SAFE_LEFT}
          top={1394}
          width={SAFE_WIDTH}
          style={{
            pointerEvents: "none",
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: "100%",
              background: PALETTE.cardLight,
              border: `3px solid ${PALETTE.ink}`,
              display: "grid",
              gridTemplateColumns: "56px 1fr",
              alignItems: "stretch",
              boxSizing: "border-box",
            }}
          >
            {/* Left Orange Voice Pulse Tab (matches the card system above) */}
            <div
              style={{
                background: PALETTE.orange,
                borderRight: `2px solid ${PALETTE.ink}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              {[0, 1, 2].map((barIdx) => {
                const h = 12 + ((Math.floor(frame / 4) + barIdx * 2) % 3) * 8;
                return (
                  <span
                    key={barIdx}
                    style={{
                      width: 4,
                      height: h,
                      background: PALETTE.ink,
                      display: "inline-block",
                    }}
                  />
                );
              })}
            </div>

            {/* Right Cohesive Editorial Subtitle Strip */}
            <div
              style={{
                padding: "16px 24px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "6px 8px",
              }}
            >
              {chunkWords.map((w) => {
                const isCurrent = activeWord?.startMs === w.startMs;
                const highlightBg = w.isXuna
                  ? PALETTE.orange
                  : PALETTE.lime;

                return (
                  <span
                    key={`${w.startMs}-${w.text}`}
                    style={{
                      fontFamily: w.isTechnicalTerm ? FONT_MONO : FONT_SANS,
                      fontSize: w.isTechnicalTerm ? 26 : 29,
                      fontWeight: isCurrent ? 700 : 600,
                      lineHeight: 1.2,
                      padding: "2px 9px",
                      background: isCurrent ? highlightBg : "transparent",
                      color: PALETTE.ink,
                      border: isCurrent ? `2px solid ${PALETTE.ink}` : "2px solid transparent",
                    }}
                  >
                    {w.text}
                  </span>
                );
              })}
            </div>
          </div>
        </Abs>
      )}

      {/* Real Neural Voiceover Track (VI or EN) + Low BGM + Subtle Tactile SFX */}
      <Audio src={staticFile(pack.audioFile)} volume={1.0} />
      <Audio src={staticFile("audio/bgm/house-vibez.mp3")} volume={0.1} />
      {REEL01_SFX_CUES.map((cue) => (
        <Sequence
          key={cue.id}
          from={Math.round((cue.atMs / 1000) * fps)}
          durationInFrames={45}
          name={`sfx-${cue.id}`}
        >
          <Audio src={staticFile(`audio/sfx/${cue.sfx}.mp3`)} volume={cue.volume ?? 0.4} />
        </Sequence>
      ))}
    </>
  );
};

// ============================================================================
// MASTER REEL #01 COMPOSITION
// ============================================================================
export const Reel01TwinExperiment: React.FC<{
  locale?: ReelLocale;
  voiceWordsOverride?: ReelWordItem[];
}> = ({ locale = "vi", voiceWordsOverride }) => {
  const pack = REEL01_PACKS[locale];
  const words = voiceWordsOverride ?? pack.fallbackWords;

  return (
    <>
      <Sequence
        from={REEL01_BEATS.beat1.startFrame}
        durationInFrames={REEL01_BEATS.beat1.durationInFrames}
        name="Beat1-TwinExperiment"
      >
        <Beat1TwinExperiment pack={pack} />
      </Sequence>

      <Sequence
        from={REEL01_BEATS.beat2.startFrame}
        durationInFrames={REEL01_BEATS.beat2.durationInFrames}
        name="Beat2-HeroPortrait"
      >
        <Beat2HeroPortrait pack={pack} />
      </Sequence>

      <Sequence
        from={REEL01_BEATS.beat3.startFrame}
        durationInFrames={REEL01_BEATS.beat3.durationInFrames}
        name="Beat3-Capabilities"
      >
        <Beat3Capabilities pack={pack} />
      </Sequence>

      <Sequence
        from={REEL01_BEATS.beat4.startFrame}
        durationInFrames={REEL01_BEATS.beat4.durationInFrames}
        name="Beat4-HardwareProof"
      >
        <Beat4HardwareProof pack={pack} />
      </Sequence>

      <Sequence
        from={REEL01_BEATS.beat5.startFrame}
        durationInFrames={REEL01_BEATS.beat5.durationInFrames}
        name="Beat5-PayoffLoop"
      >
        <Beat5PayoffLoop pack={pack} />
      </Sequence>

      <ReelSubtitleAndAudio pack={pack} words={words} />
    </>
  );
};
