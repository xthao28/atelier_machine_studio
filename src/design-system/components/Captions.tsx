/**
 * ATELIER MACHINE Caption Doctrine & Word-Anchored SFX (`src/design-system/components/Captions.tsx`).
 *
 * Implements:
 * 1. HyperFrames Caption Model (`drop / rail / embed`) + Overlay Law:
 *    - `AmCaptionRail`: Verbatim lower-third overlay rail (`top = 1492`, below `BrandFooter` at `y = 1400`)
 *      so scene compositions stay centered on the true safe zone (`y: 250–1470`) without shifting up.
 *    - `AmWordEmbed`: Scarce earned peak word (`<= 1` per beat) composited in the background layer
 *      behind the isometric hardware rig or CharacterFrame.
 * 2. Hypit Word-Anchored SFX Track (`SceneSfxTrack`):
 *    - Triggers tactile mechanical sound effects (`public/audio/sfx/*.mp3`) at the exact frame
 *      a target keyword is spoken.
 * 3. ATELIER MACHINE Flat 100% Craft:
 *    - 3px solid borders, 0px corners (pill only on `.am-tag`), zero blur/shadow/gradient.
 */
import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { color } from "../tokens";
import { formats } from "../formats";
import { PixelWipe } from "../motion";
import { resolveSceneWordFrame, useWordTimeline } from "../../hooks/useWordTimeline";
import type { EpisodeSceneId } from "../../schemas/episode.schema";

const { safe } = formats["9:16"];
const SAFE_WIDTH = safe.right - safe.left;

const formatMasterTimecode = (ms: number): string => {
  const totalSec = Math.max(0, ms / 1000);
  const sec = Math.floor(totalSec);
  const cs = Math.floor((totalSec - sec) * 100);
  return `00:${String(sec).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
};

export interface AmCaptionRailProps {
  sceneId: EpisodeSceneId;
  /** Default `1492` sits cleanly below `BrandFooter` (`y = 1400..1464`) per the Overlay Law. */
  top?: number;
  /** Full editorial card width (`936px` by default, spanning `x: 72..1008` to match header/cards). */
  width?: number;
  speakerLabel?: string;
}

export const AmCaptionRail: React.FC<AmCaptionRailProps> = ({
  sceneId,
  top = 1492,
  width = 936,
  speakerLabel = "THUYẾT MINH · XUÂN",
}) => {
  const { activeWord, activeChunk, masterTimeMs, isStillness } = useWordTimeline(sceneId);

  if (activeChunk.words.length === 0) return null;

  return (
    <div
      className="am-abs"
      style={{
        left: safe.left,
        top,
        width,
        border: `3px solid ${color.ink}`,
        background: color.card,
        color: color.ink,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        zIndex: 30,
      }}
    >
      {/* Top header bar — matches the unified editorial card system */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 22px",
          borderBottom: `2px solid ${color.ink}`,
          background: isStillness ? color.orange : color["paper-shade"],
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: '"Be Vietnam Pro", var(--font-sans)',
              fontSize: 16,
              fontWeight: 700,
              color: color.ink,
              background: color.orange,
              border: `2px solid ${color.ink}`,
              padding: "3px 12px",
            }}
          >
            {isStillness ? "TẠM DỪNG · LATCH" : speakerLabel}
          </span>
          <span
            className="am-meta"
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: color["ink-soft"],
            }}
          >
            {formatMasterTimecode(masterTimeMs)}
          </span>
        </div>

        {/* Minimalist equalizer indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[0, 1, 2, 3, 4].map((bar) => {
            const active = activeWord !== null && (activeWord.sceneWordIndex + bar) % 2 === 0;
            return (
              <span
                key={bar}
                style={{
                  width: 5,
                  height: active ? 16 : 8,
                  background: active ? color.ink : color["paper-soft"],
                  display: "inline-block",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom verbatim word-by-word body */}
      <div
        style={{
          padding: "16px 22px 18px 22px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "6px 8px",
          minHeight: 108,
          fontFamily: '"Be Vietnam Pro", var(--font-sans)',
          fontSize: 27,
          lineHeight: 1.32,
          fontWeight: 600,
        }}
      >
        {activeChunk.words.map((w) => {
          const isCurrent = activeWord?.sceneWordIndex === w.sceneWordIndex;
          const isPast =
            activeWord !== null && w.sceneWordIndex < activeWord.sceneWordIndex;
          const isPetName = w.cleanText === "xuna" || w.cleanText === "xuân";

          let wordBg = "transparent";
          let wordColor: string = color.ink;
          let wordBorder = "2px solid transparent";

          if (isCurrent) {
            wordBg = isPetName ? color.orange : color.lime;
            wordColor = color.ink;
            wordBorder = `2px solid ${color.ink}`;
          } else if (isPast) {
            wordColor = color.ink;
          } else if (activeWord !== null) {
            wordColor = color["paper-soft"];
          }

          return (
            <span
              key={`${w.sceneWordIndex}-${w.startMs}`}
              style={{
                padding: "2px 8px",
                background: wordBg,
                color: wordColor,
                border: wordBorder,
                fontFamily: w.isTechnicalTerm
                  ? "var(--font-mono)"
                  : '"Be Vietnam Pro", var(--font-sans)',
                fontSize: w.isTechnicalTerm ? 24 : 27,
                fontWeight: isCurrent ? 700 : 600,
                letterSpacing: w.isTechnicalTerm ? "0.02em" : "-0.01em",
              }}
            >
              {w.text.trim()}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export interface AmWordEmbedProps {
  sceneId: EpisodeSceneId;
  /** Vertical position on the 1080×1920 canvas (placed behind the primary rig/subject). */
  top?: number;
  left?: number;
}

/**
 * HyperFrames Scarce Earned Peak (`embed`):
 * Renders at most one oversized background keyword per beat, behind the isometric machine or hero card,
 * revealed with a crisp 8-step `PixelWipe`.
 */
export const AmWordEmbed: React.FC<AmWordEmbedProps> = ({
  sceneId,
  top = 620,
  left = safe.left,
}) => {
  const { activeEmbed } = useWordTimeline(sceneId);
  if (!activeEmbed) return null;

  const displayWord = activeEmbed.embedText ?? activeEmbed.matchedWord.cleanText.toUpperCase();

  return (
    <PixelWipe
      key={activeEmbed.id}
      at={activeEmbed.triggerFrame}
      steps={8}
      framesPerStep={1}
      direction="right"
      className="am-abs"
      style={{
        left,
        top,
        width: SAFE_WIDTH,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 136,
          lineHeight: 0.88,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          textTransform: "uppercase",
          color: "transparent",
          WebkitTextStroke: "2px var(--grid-line)",
          userSelect: "none",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {displayWord}
      </div>
    </PixelWipe>
  );
};

/**
 * Mounts word-anchored tactile SFX (`public/audio/sfx/*.mp3`) for a scene based on `EP01_MANIFEST`.
 */
export const SceneSfxTrack: React.FC<{ sceneId: EpisodeSceneId }> = ({ sceneId }) => {
  const { resolvedCues, manifest, fps } = useWordTimeline(sceneId);

  const preLatchFrame =
    manifest.stillnessClimax?.preLatchSfx
      ? Math.max(
          0,
          resolveSceneWordFrame(
            sceneId,
            manifest.stillnessClimax.climaxWord,
            manifest.stillnessClimax.occurrence ?? 0,
            -manifest.stillnessClimax.stillnessFrames,
            fps,
          ),
        )
      : null;

  return (
    <>
      {manifest.stillnessClimax?.preLatchSfx && preLatchFrame !== null && (
        <Sequence from={preLatchFrame} durationInFrames={45} name={`sfx-prelatch-${manifest.id}`}>
          <Audio
            src={staticFile(`audio/sfx/${manifest.stillnessClimax.preLatchSfx}.mp3`)}
            volume={0.45}
          />
        </Sequence>
      )}
      {resolvedCues
        .filter((cue) => Boolean(cue.sfx))
        .map((cue) => (
          <Sequence
            key={cue.id}
            from={cue.triggerFrame}
            durationInFrames={60}
            name={`sfx-${cue.id}`}
          >
            <Audio
              src={staticFile(`audio/sfx/${cue.sfx}.mp3`)}
              volume={cue.sfxVolume ?? 0.55}
            />
          </Sequence>
        ))}
    </>
  );
};

