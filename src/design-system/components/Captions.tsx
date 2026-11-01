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
}

export const AmCaptionRail: React.FC<AmCaptionRailProps> = ({ sceneId, top = 1492 }) => {
  const { activeWord, activeChunk, masterTimeMs, isStillness } = useWordTimeline(sceneId);

  if (activeChunk.words.length === 0) return null;

  return (
    <div
      className="am-abs"
      style={{
        left: safe.left,
        top,
        width: SAFE_WIDTH,
        border: "var(--stroke-line) solid var(--on-surface)",
        background: "var(--surface)",
        color: "var(--on-surface)",
        display: "grid",
        gridTemplateColumns: "156px 1fr",
        minHeight: 84,
        boxSizing: "border-box",
        zIndex: 30,
      }}
    >
      {/* Left telemetry cell: VO language + live word-synced timecode */}
      <div
        style={{
          borderRight: "var(--stroke-hair) solid var(--on-surface)",
          padding: "10px 14px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: isStillness ? color.orange : "var(--surface-alt, var(--paper-shade))",
          color: color.ink,
        }}
      >
        <div
          className="am-lab"
          style={{
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: color.ink,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              background: activeWord ? color.orange : color.ink,
              display: "inline-block",
            }}
          />
          {isStillness ? "HOLD · LATCH" : "VO · VI—EP01"}
        </div>
        <div
          className="am-meta"
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: color.ink,
          }}
        >
          {formatMasterTimecode(masterTimeMs)}
        </div>
      </div>

      {/* Right verbatim word rail */}
      <div
        style={{
          padding: "12px 18px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "6px 8px",
          fontFamily: '"Be Vietnam Pro", var(--font-sans)',
          fontSize: 27,
          lineHeight: 1.25,
          fontWeight: 600,
        }}
      >
        {activeChunk.words.map((w) => {
          const isCurrent = activeWord?.sceneWordIndex === w.sceneWordIndex;
          const isPast =
            activeWord !== null && w.sceneWordIndex < activeWord.sceneWordIndex;
          const isXuna = w.cleanText === "xuna";

          let wordBg = "transparent";
          let wordColor = "var(--on-surface)";
          let wordBorder = "2px solid transparent";

          if (isCurrent) {
            if (isXuna) {
              wordBg = color.orange;
              wordColor = color.ink;
              wordBorder = `2px solid ${color.ink}`;
            } else if (w.isTechnicalTerm) {
              wordBg = color.lime;
              wordColor = color.ink;
              wordBorder = `2px solid ${color.ink}`;
            } else {
              wordBg = "var(--on-surface)";
              wordColor = "var(--surface)";
              wordBorder = "2px solid var(--on-surface)";
            }
          } else if (w.isTechnicalTerm) {
            wordBg = "transparent";
            wordColor = "var(--on-surface)";
            wordBorder = "2px solid var(--rule)";
          } else if (!isPast && activeWord !== null) {
            wordColor = "var(--muted)";
          }

          return (
            <span
              key={`${w.sceneWordIndex}-${w.startMs}`}
              style={{
                padding: "1px 7px",
                background: wordBg,
                color: wordColor,
                border: wordBorder,
                fontFamily: w.isTechnicalTerm
                  ? "var(--font-mono)"
                  : '"Be Vietnam Pro", var(--font-sans)',
                fontSize: w.isTechnicalTerm ? 23 : 27,
                fontWeight: w.isTechnicalTerm ? 500 : 600,
                letterSpacing: w.isTechnicalTerm ? "0.03em" : "-0.01em",
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

