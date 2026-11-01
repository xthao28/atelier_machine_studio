/**
 * ATELIER MACHINE — Episode Stage-Gate & Seam-Gate Verifier (`scripts/verify-episode.ts`).
 *
 * Combines:
 * 1. OpenMontage (`calesthio/openmontage`) Stage-Gate Reviewer:
 *    Validates `EP01_MANIFEST` completeness, audio/SFX asset existence, and Design System compliance.
 * 2. Hypit (`hypit-ai/hypit`) Word-Projection Verification:
 *    Ensures every `WordAnchoredCue` and `StillnessClimaxSpec` resolves to a real word inside the scene's time window.
 * 3. HyperFrames (`heygen-com/hyperframes`) Seam-Gate & Caption Doctrine:
 *    Enforces scarce `embed` spacing (no overlapping `embed` windows) and verifies carrier seam anchors.
 *
 * Run: npm run qa:episode
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { EP01_MANIFEST } from "../episodes/ep01-xuna-evolution.script";
import {
  getSceneResolvedWords,
  resolveSceneDurationFrames,
  resolveSceneWordCues,
  resolveSceneWordFrame,
} from "../src/hooks/useWordTimeline";

const ROOT = resolve(__dirname, "..");
const EMBED_HOLD_FRAMES = 78;

let errors = 0;
let warnings = 0;

const pass = (msg: string) => console.log(`  [PASS] ${msg}`);
const warn = (msg: string) => {
  warnings++;
  console.warn(`  [WARN] ${msg}`);
};
const fail = (msg: string) => {
  errors++;
  console.error(`  [FAIL] ${msg}`);
};

console.log(`\n======================================================================`);
console.log(` ATELIER MACHINE · STAGE-GATE & SEAM-GATE VERIFIER (${EP01_MANIFEST.episodeId})`);
console.log(`======================================================================\n`);

// 1. Verify BGM asset
const bgmPath = join(ROOT, "public", EP01_MANIFEST.bgmAsset);
if (existsSync(bgmPath)) {
  pass(`BGM asset verified: public/${EP01_MANIFEST.bgmAsset}`);
} else {
  fail(`Missing BGM asset: public/${EP01_MANIFEST.bgmAsset}`);
}

// 2. Verify each SceneManifest, Word-Anchored Cues, Stillness Windows & Embed Spacing
console.log(`\n--- 1. Word-Anchored Timeline Projection (${EP01_MANIFEST.fps}fps) ---`);
for (const scene of EP01_MANIFEST.scenes) {
  const durationFrames = resolveSceneDurationFrames(scene.id, EP01_MANIFEST.fps);
  const words = getSceneResolvedWords(scene.id, EP01_MANIFEST.fps);
  const resolvedCues = resolveSceneWordCues(scene.id, EP01_MANIFEST.fps);

  if (words.length === 0) {
    fail(`${scene.id}: No words found in EP01_WORD_CAPTIONS`);
    continue;
  }

  console.log(
    `\n  Scene ${scene.index}: ${scene.id} [${scene.startMs}ms..${scene.endMs}ms | ${durationFrames}f | ${words.length} words | ground=${scene.ground}]`,
  );

  if (resolvedCues.length !== scene.wordCues.length) {
    fail(
      `${scene.id}: Only ${resolvedCues.length}/${scene.wordCues.length} wordCues matched spoken words in transcript`,
    );
  }

  // Check each resolved cue
  let prevEmbedEnd = -1;
  for (const cue of resolvedCues) {
    if (cue.triggerFrame < 0 || cue.triggerFrame >= durationFrames) {
      fail(
        `${scene.id} cue "${cue.id}": triggerFrame ${cue.triggerFrame} out of scene bounds [0..${durationFrames})`,
      );
    } else {
      pass(
        `Cue "${cue.id}" -> word "${cue.matchedWord.text.trim()}" @ frame ${cue.triggerFrame} (${(cue.triggerFrame / EP01_MANIFEST.fps).toFixed(2)}s) [${cue.captionMode ?? "rail"}]`,
      );
    }

    // Check SFX asset on disk
    if (cue.sfx) {
      const sfxFile = join(ROOT, "public", "audio", "sfx", `${cue.sfx}.mp3`);
      if (!existsSync(sfxFile)) {
        fail(`${scene.id} cue "${cue.id}": Missing SFX file public/audio/sfx/${cue.sfx}.mp3`);
      }
    }

    // HyperFrames Caption Doctrine: no two `embed` peaks may overlap
    if (cue.captionMode === "embed") {
      if (cue.triggerFrame < prevEmbedEnd) {
        fail(
          `${scene.id} cue "${cue.id}": Embed peak @ frame ${cue.triggerFrame} overlaps previous embed window (ends @ ${prevEmbedEnd})`,
        );
      }
      prevEmbedEnd = cue.triggerFrame + EMBED_HOLD_FRAMES;
    }
  }

  // Check Stillness Before Climax window
  if (scene.stillnessClimax) {
    const climaxFrame = resolveSceneWordFrame(
      scene.id,
      scene.stillnessClimax.climaxWord,
      scene.stillnessClimax.occurrence ?? 0,
      0,
      EP01_MANIFEST.fps,
    );
    const holdStart = climaxFrame - scene.stillnessClimax.stillnessFrames;
    if (holdStart < 0) {
      warn(
        `${scene.id} stillnessClimax "${scene.stillnessClimax.id}": stillness starts before frame 0 (${holdStart})`,
      );
    } else {
      pass(
        `Stillness Before Climax "${scene.stillnessClimax.id}": holds frames [${holdStart}..${climaxFrame}) before "${scene.stillnessClimax.climaxWord}"`,
      );
    }
  }
}

// 3. Verify Seam-Gate Ledger
console.log(`\n--- 2. HyperFrames Seam-Gate Carrier Ledger ---`);
for (const seam of EP01_MANIFEST.seams) {
  const { x, y, width, height } = seam.carrierAnchor;
  const insideSafeX = x >= 72 && x + width <= 920;
  const insideSafeY = y >= 250 && y + height <= 1470;
  if (insideSafeX && insideSafeY) {
    pass(
      `Seam "${seam.id}" (${seam.fromScene} -> ${seam.toScene}, ${seam.technique}): carrier anchor [${x},${y} ${width}×${height}] inside 9:16 safe zone`,
    );
  } else {
    warn(
      `Seam "${seam.id}": carrier anchor [${x},${y} ${width}×${height}] extends outside 9:16 safe box [72..920, 250..1470]`,
    );
  }
}

// 4. Verify ATELIER MACHINE Flat 100% Design System rules in src/scenes and src/design-system
console.log(`\n--- 3. ATELIER MACHINE Flat 100% Craft Gate ---`);
const FORBIDDEN_PATTERNS = [
  { regex: /boxShadow\s*:/, label: "boxShadow inline style (Forbidden: Flat 100%)" },
  { regex: /textShadow\s*:/, label: "textShadow inline style (Forbidden: Flat 100%)" },
  { regex: /(?<!repeating-)linear-gradient\s*\(/, label: "linear-gradient (Forbidden: Flat 100%)" },
  { regex: /radial-gradient\s*\(/, label: "radial-gradient (Forbidden: Flat 100%)" },
  { regex: /filter\s*:\s*["'`][^"'`]*blur\(/, label: "filter: blur() (Forbidden: Flat 100%)" },
];

const scanDir = (dir: string) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(full);
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      const content = readFileSync(full, "utf8");
      for (const pat of FORBIDDEN_PATTERNS) {
        if (pat.regex.test(content)) {
          fail(`${full.slice(ROOT.length + 1)}: Found ${pat.label}`);
        }
      }
    }
  }
};

scanDir(join(ROOT, "src", "scenes"));
scanDir(join(ROOT, "src", "compositions"));
scanDir(join(ROOT, "src", "design-system"));
if (errors === 0) {
  pass(`All scene & design-system files pass Flat 100% craft gate (0 shadows, 0 gradients, 0 blurs)`);
}

console.log(`\n======================================================================`);
console.log(` SUMMARY: ${errors} error(s), ${warnings} warning(s)`);
console.log(`======================================================================\n`);

if (errors > 0) {
  process.exit(1);
}
