/**
 * Word-Anchored Timeline Engine (`src/hooks/useWordTimeline.ts`).
 *
 * Inspired by:
 * - Hypit (`hypit-ai/hypit` `<semantic:Projection>`): Projects word-level speech alignment
 *   (`EP01_WORD_CAPTIONS`) onto local scene frames (`60fps`) so visual beats, mechanical rigs,
 *   and SFX are anchored to spoken words rather than brittle hardcoded frame numbers.
 * - HyperFrames (`heygen-com/hyperframes` `motion-doctrine` & `captions-overlay`):
 *   Computes `isStillness` (Stillness Before Climax) and scarce `embed` peak windows (`<= 1` active).
 */
import { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { EP01_MANIFEST, getSceneManifest } from "../../episodes/ep01-xuna-evolution.script";
import { EP01_WORD_CAPTIONS } from "../data/ep01Captions";
import { isStillnessWindow } from "../design-system/motion";
import type { EpisodeSceneId, WordAnchoredCue, WordCaptionItem } from "../schemas/episode.schema";

export interface ResolvedWord extends WordCaptionItem {
  /** Clean word token stripped of leading/trailing whitespace and punctuation. */
  cleanText: string;
  /** Index within the scene's word array. */
  sceneWordIndex: number;
  /** Local start frame inside the scene (0-based at `fps`). */
  localStartFrame: number;
  /** Local end frame inside the scene (0-based at `fps`). */
  localEndFrame: number;
}

export interface ResolvedWordCue extends WordAnchoredCue {
  /** Local scene frame where this cue triggers. */
  triggerFrame: number;
  /** Matched word item from `EP01_WORD_CAPTIONS`. */
  matchedWord: ResolvedWord;
}

const normalizeToken = (raw: string): string =>
  raw
    .trim()
    .replace(/^[.,!?;:—\-("']+|[.,!?;:—\-)"']+$/g, "")
    .toLowerCase();

/** Pure helper: returns total duration in frames for a scene from `EP01_MANIFEST`. */
export const resolveSceneDurationFrames = (
  sceneId: EpisodeSceneId,
  fps: number = EP01_MANIFEST.fps,
): number => {
  const manifest = getSceneManifest(sceneId);
  return Math.round(((manifest.endMs - manifest.startMs) / 1000) * fps);
};

/** Pure helper: resolves all words belonging to `sceneId` with local frame boundaries. */
export const getSceneResolvedWords = (
  sceneId: EpisodeSceneId,
  fps: number = EP01_MANIFEST.fps,
): ResolvedWord[] => {
  const manifest = getSceneManifest(sceneId);
  return EP01_WORD_CAPTIONS.filter((w) => w.sceneId === sceneId).map((w, idx) => {
    const relStartMs = Math.max(0, w.startMs - manifest.startMs);
    const relEndMs = Math.max(relStartMs + 50, w.endMs - manifest.startMs);
    return {
      ...w,
      cleanText: normalizeToken(w.text),
      sceneWordIndex: idx,
      localStartFrame: Math.round((relStartMs / 1000) * fps),
      localEndFrame: Math.round((relEndMs / 1000) * fps),
    };
  });
};

/**
 * Pure helper: finds the Nth occurrence of `matchWord` in `sceneId` and returns its local start frame
 * plus `offsetFrames`. Falls back safely to frame 0 if not found.
 */
export const resolveSceneWordFrame = (
  sceneId: EpisodeSceneId,
  matchWord: string,
  occurrence = 0,
  offsetFrames = 0,
  fps: number = EP01_MANIFEST.fps,
): number => {
  const words = getSceneResolvedWords(sceneId, fps);
  const target = normalizeToken(matchWord);
  const matches = words.filter(
    (w) => w.cleanText === target || w.cleanText.includes(target),
  );
  const picked = matches[Math.min(occurrence, Math.max(0, matches.length - 1))];
  if (!picked) return Math.max(0, offsetFrames);
  return Math.max(0, picked.localStartFrame + offsetFrames);
};

/** Pure helper: resolves all `wordCues` declared in `EP01_MANIFEST` for `sceneId`. */
export const resolveSceneWordCues = (
  sceneId: EpisodeSceneId,
  fps: number = EP01_MANIFEST.fps,
): ResolvedWordCue[] => {
  const manifest = getSceneManifest(sceneId);
  const words = getSceneResolvedWords(sceneId, fps);

  return manifest.wordCues.flatMap((cue) => {
    const target = normalizeToken(cue.matchWord);
    const matches = words.filter(
      (w) => w.cleanText === target || w.cleanText.includes(target),
    );
    const picked = matches[Math.min(cue.occurrence ?? 0, Math.max(0, matches.length - 1))];
    if (!picked) return [];
    const triggerFrame = Math.max(0, picked.localStartFrame + (cue.offsetFrames ?? 0));
    return [{ ...cue, triggerFrame, matchedWord: picked }];
  });
};

const CHUNK_SIZE = 7;
const EMBED_HOLD_FRAMES = 78; // 1.3s at 60fps

export const useWordTimeline = (sceneId: EpisodeSceneId) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const manifest = useMemo(() => getSceneManifest(sceneId), [sceneId]);
  const words = useMemo(() => getSceneResolvedWords(sceneId, fps), [sceneId, fps]);
  const resolvedCues = useMemo(() => resolveSceneWordCues(sceneId, fps), [sceneId, fps]);

  const masterTimeMs = manifest.startMs + (frame / fps) * 1000;

  // Find active word (allowing a natural 240ms bridge between consecutive words so the rail stays steady)
  const activeWord = useMemo(() => {
    const bridgeFrames = Math.round(0.24 * fps);
    for (let i = 0; i < words.length; i++) {
      const w = words[i]!;
      const next = words[i + 1];
      const effectiveEnd = next
        ? Math.min(next.localStartFrame, w.localEndFrame + bridgeFrames)
        : w.localEndFrame + bridgeFrames;
      if (frame >= w.localStartFrame && frame < effectiveEnd) {
        return w;
      }
    }
    return null;
  }, [words, frame, fps]);

  // Group words into fixed-size readable rail chunks of CHUNK_SIZE words
  const activeChunk = useMemo(() => {
    if (words.length === 0) return { words: [] as ResolvedWord[], chunkIndex: 0 };
    const focusWord =
      activeWord ??
      words.find((w) => w.localStartFrame > frame) ??
      words[words.length - 1]!;
    const chunkIndex = Math.floor(focusWord.sceneWordIndex / CHUNK_SIZE);
    const startIdx = chunkIndex * CHUNK_SIZE;
    return {
      words: words.slice(startIdx, startIdx + CHUNK_SIZE),
      chunkIndex,
    };
  }, [words, activeWord, frame]);

  // HyperFrames `embed` peak word: scarce, at most 1 active at any frame
  const activeEmbed = useMemo(() => {
    const embedCues = resolvedCues.filter((c) => c.captionMode === "embed");
    for (let i = embedCues.length - 1; i >= 0; i--) {
      const cue = embedCues[i]!;
      if (frame >= cue.triggerFrame && frame < cue.triggerFrame + EMBED_HOLD_FRAMES) {
        return cue;
      }
    }
    return null;
  }, [resolvedCues, frame]);

  // HyperFrames `Stillness Before Climax` window
  const stillnessInfo = useMemo(() => {
    const spec = manifest.stillnessClimax;
    if (!spec) return { isStillness: false, climaxFrame: -1 };
    const climaxFrame = resolveSceneWordFrame(
      sceneId,
      spec.climaxWord,
      spec.occurrence ?? 0,
      0,
      fps,
    );
    return {
      isStillness: isStillnessWindow(frame, climaxFrame, spec.stillnessFrames),
      climaxFrame,
    };
  }, [manifest.stillnessClimax, sceneId, fps, frame]);

  const wordFrame = (matchWord: string, occurrence = 0, offsetFrames = 0) =>
    resolveSceneWordFrame(sceneId, matchWord, occurrence, offsetFrames, fps);

  const hasPassedWord = (matchWord: string, occurrence = 0, offsetFrames = 0) =>
    frame >= wordFrame(matchWord, occurrence, offsetFrames);

  return {
    frame,
    fps,
    manifest,
    masterTimeMs,
    words,
    activeWord,
    activeChunk,
    activeEmbed,
    isStillness: stillnessInfo.isStillness,
    climaxFrame: stillnessInfo.climaxFrame,
    resolvedCues,
    wordFrame,
    hasPassedWord,
  };
};

