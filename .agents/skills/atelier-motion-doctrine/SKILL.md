---
name: atelier-motion-doctrine
description: "ATELIER MACHINE Motion, Caption & Word-Anchored Timeline Doctrine. Synthesizes HyperFrames (Motion Doctrine, Seam Craft, drop/rail/embed Captions Overlay Law), Hypit (Word-Anchored Semantic Projection), and OpenMontage (Episode Manifest & Stage-Gate QA) for 60fps Flat 100% Remotion scenes."
---

# ATELIER MACHINE · Motion, Caption & Word-Anchored Doctrine

Read this skill before authoring or editing any Scene (`src/scenes/*.tsx`), Isometric Machine (`src/components/isometric/*.tsx`), or Episode Script (`episodes/*.script.ts`).

---

## 1. Word-Anchored Timeline (Hypit `<semantic:Projection>` Pattern)

Never hardcode arbitrary frame numbers for narrative beats, hardware explosions, button presses, or SFX.
All timing derives from `EP01_WORD_CAPTIONS` (`src/data/ep01Captions.ts`) and `EP01_MANIFEST` (`episodes/ep01-xuna-evolution.script.ts`) via `src/hooks/useWordTimeline.ts`:

```tsx
import {
  resolveSceneDurationFrames,
  resolveSceneWordFrame,
  useWordTimeline,
} from "../hooks/useWordTimeline";

export const SCENE02_DURATION = resolveSceneDurationFrames("scene-02-foundation");
const EXPLODE_AT = resolveSceneWordFrame("scene-02-foundation", "LifeCore", 0, 0);
```

- When a spoken word moves (e.g., after re-running TTS alignment), every mechanical rig action, `PixelWipe`, and tactile SFX shifts automatically.

---

## 2. Caption Model: `drop / rail / embed` + The Overlay Law (HyperFrames Pattern)

1. **`rail` (`<AmCaptionRail sceneId="..." />`):**
   - Carries the verbatim Vietnamese voiceover in readable 7-word chunks.
   - Highlights the currently spoken word (`--orange` for `"XUNA"`, `--lime` for `isTechnicalTerm: true`, inverse `--on-surface` for standard words).
2. **`embed` (`<AmWordEmbed sceneId="..." />`):**
   - **Scarce earned peak (`<= 1` per beat, never overlapping within 78 frames / 1.3s).**
   - Renders one oversized technical/conceptual keyword (`.am-display` / `136px` Space Grotesk) in the background layer behind the isometric hardware rig or hero card, revealed via an 8-step `PixelWipe`.
3. **The Overlay Law:**
   - `AmCaptionRail` sits at `top = 1492` (cleanly below `BrandFooter` at `y = 1400..1464`).
   - **Never shift scene content upward** or compress the `y: 250–1470` safe zone to "make room" for captions.

---

## 3. Motion Doctrine: Flat 100% + Stillness Before Climax + Carrier Seams

1. **No Blur, No Glow, No Shadow (`DESIGN_SYSTEM.md` Supersedes Gaussian Blur Cuts):**
   - Upstream `cut-the-curve` uses 10–20px Gaussian blur on Z cuts. In `ATELIER MACHINE`, **all blur, shadow, and gradient effects are strictly banned**.
   - Scene and element entrances use hard cuts (`<Cut at={...}>`), 8-step `<PixelWipe>`, or 60fps mechanical springs (`useAnatomyClock`).
2. **Ban on Idle Wobble ("Motion Must PERFORM, Not Breathe"):**
   - Never add aimless floating sine waves to cards or typography. Every movement must represent a physical actuation (GPIO button press, NVS bank switch, spring compression, or sprite state change).
3. **Stillness Before Climax (`stillnessClimax`):**
   - Right before a major mechanical release (e.g., `LilygoExplodedMachine` Z-axis explosion or `EvidenceLedger` 4-gate unlock), freeze secondary motion for `12–16 frames` (`0.20–0.26s @ 60fps`) accompanied by a tactile pre-latch click (`chamber_latch_unlock` or `gpio_tactile_click`).
4. **Carrier Match-Cut (`SeamSpec`):**
   - Across scene boundaries, anchor eye momentum on a shared physical subject (e.g., XUNA's pixel sprite inside `Scene01Hook` hands off directly to the ST7789V `320×170` LCD screen on `LilygoExplodedMachine` in `Scene02Foundation`).

---

## 4. Stage-Gate & Seam-Gate Verification (OpenMontage Pattern)

After editing any scene or manifest, always run:

```bash
npm run typecheck
npm run qa:episode
```

Both gates must pass with `0 errors` before rendering or committing.

