/**
 * Episode & Word-Anchored Timeline Schema (`src/schemas/episode.schema.ts`).
 *
 * Combines:
 * 1. Hypit (`hypit-ai/hypit`) — Word-Anchored Timeline & Semantic Projection (`WordCue`, `WordWindow`).
 * 2. HyperFrames (`heygen-com/hyperframes`) — `drop / rail / embed` Caption Doctrine, `StillnessWindow`, and `SeamSpec` carrier continuity.
 * 3. OpenMontage (`calesthio/openmontage`) — Declarative Episode Manifest & Stage-Gate QA contract.
 */
import type { Ground } from "../design-system";

export type EpisodeSceneId =
  | "scene-01-hook"
  | "scene-02-foundation"
  | "scene-03-learning"
  | "scene-04-temperament"
  | "scene-05-voice-cloud"
  | "scene-06-outro";

export interface WordCaptionItem {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number;
  confidence: number;
  sceneId: EpisodeSceneId;
  isTechnicalTerm: boolean;
}

/**
 * HyperFrames Caption Model (`captions-overlay`):
 * - `drop`: filler / omitted from caption display
 * - `rail`: default lower-third verbatim subtitle rail with active word & technical term highlight
 * - `embed`: scarce earned peak (<= 1 per beat), rendered as oversized background typography behind the rig
 */
export type CaptionMode = "drop" | "rail" | "embed";

/** Tactile / mechanical sound effects available in `public/audio/sfx/`. */
export type SfxAssetId =
  | "ble_pulse_chime"
  | "chamber_latch_unlock"
  | "evidence_drop"
  | "gpio_tactile_click"
  | "hatch_chime"
  | "mechanical_gear_tick"
  | "spring_boing_heavy"
  | "whoosh_transition";

/**
 * Hypit-style Word-Anchored Cue:
 * Anchors a visual state change, embed peak word, or tactile SFX to a spoken word in the transcript
 * rather than brittle hardcoded frame numbers.
 */
export interface WordAnchoredCue {
  id: string;
  /** Target word substring to match within the scene's transcript (case-insensitive). */
  matchWord: string;
  /** Occurrence index within the scene (0 = first occurrence, default 0). */
  occurrence?: number;
  /** Frame offset relative to the matched word's local start frame (e.g. -14 for stillness-before-climax). */
  offsetFrames?: number;
  /** Optional caption promotion mode (`embed` promotes the word to a background display peak). */
  captionMode?: CaptionMode;
  /** Optional display text override when promoted to `embed`. */
  embedText?: string;
  /** Optional SFX triggered when this word cue fires. */
  sfx?: SfxAssetId;
  /** Volume 0..1 for the SFX (default 0.65). */
  sfxVolume?: number;
  /** Human-readable description of the mechanical/visual action driven by this word. */
  action: string;
}

/**
 * HyperFrames Motion Doctrine — Stillness Before Climax:
 * Freezes ambient/secondary motion for `holdFrames` right before a major mechanical release.
 */
export interface StillnessClimaxSpec {
  id: string;
  /** Word that triggers the climax release. */
  climaxWord: string;
  occurrence?: number;
  /** Number of frames of complete mechanical stillness before the climax frame (default 14 frames ≈ 0.23s @ 60fps). */
  stillnessFrames: number;
  /** Pre-climax latch/click sound effect. */
  preLatchSfx?: SfxAssetId;
}

/**
 * HyperFrames Seam Craft — Carrier Continuity Ledger Row:
 * Ensures scene-to-scene transitions maintain eye momentum via a carrier element or matched cut.
 */
export interface SeamSpec {
  id: string;
  fromScene: EpisodeSceneId;
  toScene: EpisodeSceneId;
  technique: "hard-cut-carrier" | "pixel-wipe-8step";
  /** Visual element that carries eye focus across the cut (e.g. XUNA pixel frame -> LILYGO LCD screen). */
  carrierDescription: string;
  /** Target bounding box on the 1080×1920 canvas at the cut boundary. */
  carrierAnchor: { x: number; y: number; width: number; height: number };
}

export type AmTemplateFamily =
  | "01-project-reveal"
  | "02-technical-explainer"
  | "03-build-log"
  | "04-spec-sheet"
  | "05-system-architecture"
  | "06-manifesto-outro";

export type IsometricMachineId =
  | "none"
  | "LilygoExplodedMachine"
  | "DualSpringAffectMachine"
  | "TemperamentChamberMachine";

export interface SceneManifest {
  id: EpisodeSceneId;
  index: number;
  title: string;
  figureCode: string;
  templateFamily: AmTemplateFamily;
  ground: Ground;
  machine: IsometricMachineId;
  /** Start time in milliseconds on the master episode clock. */
  startMs: number;
  /** End time in milliseconds on the master episode clock. */
  endMs: number;
  /** Word-anchored cues driving mechanical states, embed peaks, and SFX. */
  wordCues: WordAnchoredCue[];
  /** Optional stillness-before-climax window for the primary mechanical payoff. */
  stillnessClimax?: StillnessClimaxSpec;
}

export interface EpisodeManifest {
  episodeId: string;
  title: string;
  fps: number;
  width: number;
  height: number;
  bgmAsset: string;
  bgmVolume: number;
  scenes: SceneManifest[];
  seams: SeamSpec[];
}
