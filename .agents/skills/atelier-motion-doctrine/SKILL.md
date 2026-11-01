---
name: atelier-motion-doctrine
description: "ATELIER MACHINE Motion, Caption, Visual Style & Word-Anchored Timeline Doctrine. Synthesizes HyperFrames (Motion Doctrine, Seam Craft, drop/rail/embed Captions Overlay Law), Hypit (Word-Anchored Semantic Projection), OpenMontage (Episode Manifest & Stage-Gate QA), and the updated Warm Cream Grid-Free Editorial Design System for 60fps Flat 100% Remotion scenes and dual-locale Instagram Reels (Xuân / Xuna)."
---

# ATELIER MACHINE · Visual Style, Motion, Caption & Word-Anchored Doctrine

Read this skill before authoring or editing any Reel (`src/compositions/Reel*.tsx`), Scene (`src/scenes/*.tsx`), Isometric Machine (`src/components/isometric/*.tsx`), or Episode Script (`episodes/*.script.ts`).

---

## 1. Updated Visual Style: Warm Cream Grid-Free Editorial System

1. **Grid-Free Minimalist Layout (`grid={false}`):**
   - **Never render background grid lines (`am-gridbg` / `grid`).** Keep the canvas clean, breathable, and uncluttered.
   - Structure hierarchy using solid `3px solid #242424` (`--stroke-line`) editorial cards, `2px solid #242424` internal dividers, and generous margins (`left: 72px`, `right: 72px`, width `936px`).
2. **Warm Bright Cream Palette (`tokens.json`):**
   - `paper` (`#F4EFE4`): Primary warm bright cream canvas background (never stark white `#FFFFFF`, never dull gray).
   - `paper-shade` (`#E7DFCF`): Secondary warm sand tint for card header bars, secondary panels, and inactive slots.
   - `card` (`#FAF8F3`): Warm editorial card surface sitting cleanly on top of `#F4EFE4`.
   - `ink` (`#242424`): Primary charcoal ink for borders, rules, and headline/body typography.
   - `ink-soft` (`#5C584F`) & `paper-soft` (`#8A8478`): Secondary warm charcoal and muted stone for metadata and unspoken subtitle words.
   - `orange` (`#FF9B56`): Artificial-life accent (`Xuân` / `Xuna` frame, Twin B, speaker badge).
   - `lime` (`#D9F57A`): Technical & active word highlight accent (`Twin A`, active spoken word pill, verified status).
3. **Dual-Locale & Language Purity Rules (`vi` vs `en`):**
   - **Vietnamese Channel (`vi`):**
     - Pet name is **`"Xuân"`** (both in on-screen text and Vietnamese TTS voiceover).
     - **100% pure Vietnamese** for all UI labels, headers, badges, and narrative text. English words are strictly prohibited unless they are mandatory technical/hardware proper nouns (`AI`, `Pixel Art`, `LILYGO T-Display-S3`, `ESP32-S3`, `C++11`, `Flash NVS`, `CRC32`, `GPIO0 / GPIO14`).
     - Any text containing Vietnamese diacritics must use **`"Be Vietnam Pro"`** (`FONT_SANS`), because `IBM Plex Mono` in `public/fonts/` only covers ASCII/Latin glyphs.
   - **International English Channel (`en`):**
     - Pet name is **`"Xuna"`** (only the first letter `X` capitalized in narrative and UI).

---

## 2. Unified Full-Width Subtitle Card Strip (`SubtitleCardStrip` & `<AmCaptionRail />`)

Subtitles must never look like a disconnected floating dark box. They are an integral editorial card in the same visual family as the cards above:

1. **Geometry & Alignment:**
   - Full `936px` width (`left = 72`, `right = 72`), sitting at `top = 1394` on Instagram Reels (`Reel01TwinExperiment`) or `top = 1492` on multi-scene episodes (`AmCaptionRail`).
   - Uses `background: #FAF8F3` (`color.card`) and `border: 3px solid #242424` (`color.ink`).
2. **Two-Row Editorial Structure:**
   - **Top Header Strip (`background: #E7DFCF`, `borderBottom: 2px solid #242424`):**
     - Left: Orange bordered speaker pill (`THUYẾT MINH · XUÂN` or `VOICEOVER · XUNA`) + beat/timecode readout.
     - Right: 5-bar minimalist audio equalizer animated by the active spoken word index.
   - **Bottom Word-by-Word Body (`background: #FAF8F3`):**
     - Displays the current 9-word chunk in `"Be Vietnam Pro"` (`27–29px`, weight `600–700`).
     - **Active word:** Highlighted with a `2px solid #242424` box (`#FF9B56` orange when saying `"Xuân"` / `"Xuna"`, `#D9F57A` lime for all other active words).
     - **Spoken words:** `#242424` (`color.ink`).
     - **Upcoming words:** `#8A8478` (`color["paper-soft"]`).
3. **The Overlay Law (HyperFrames Pattern):**
   - Never shift upper scene content upward or compress the main card layout when captions update.

---

## 3. Neural TTS Voiceover & Word-Anchored Timeline (Hypit Pattern)

1. **Neural Voiceover Generation (`scripts/generate-reel01-tts.py`):**
   - Uses Microsoft Edge Neural TTS (`vi-VN-NamMinhNeural` for Vietnamese `"Xuân"`, `en-US-BrianNeural` for English `"Xuna"`).
   - Consolidates all beats per language into a single `edge_tts.Communicate(full_text, voice)` stream to avoid rate-limiting, slices each beat onto its exact timeline window, and accelerates playback by **`1.16x`** (`ffmpeg -filter:a atempo=1.16`) for a crisp, engaging Instagram Reels cadence.
   - Outputs `.mp3` files to `public/audio/voiceover/` and exact word-level timestamps (`startMs`, `endMs`) to `src/data/reel01VoiceData.ts`.
2. **Word-Anchored Scene Actions (`src/hooks/useWordTimeline.ts`):**
   - Never hardcode arbitrary frame numbers for narrative beats, hardware explosions, button presses, or SFX.
   - All timing derives from word timestamps via `resolveSceneDurationFrames()` and `resolveSceneWordFrame()`.

---

## 4. Motion Doctrine: Flat 100% + Stillness Before Climax + Carrier Seams

1. **No Blur, No Glow, No Shadow (`DESIGN_SYSTEM.md` Supersedes Gaussian Blur Cuts):**
   - All blur, shadow, and smooth gradient effects are strictly banned.
   - Entrances use hard cuts (`<Cut at={...}>`), 8-step `<PixelWipe>`, or 60fps mechanical springs (`useAnatomyClock`).
2. **Ban on Idle Wobble ("Motion Must PERFORM, Not Breathe"):**
   - Never add aimless floating sine waves to cards or typography. Every movement must represent a physical actuation (GPIO button press, NVS bank switch, spring compression, or sprite state change).
3. **Stillness Before Climax (`stillnessClimax`):**
   - Right before a major mechanical release, freeze secondary motion for `12–16 frames` (`0.20–0.26s @ 60fps`) accompanied by a tactile pre-latch click (`chamber_latch_unlock` or `gpio_tactile_click`).

---

## 5. Stage-Gate & Seam-Gate Verification (OpenMontage Pattern)

After editing any Reel, scene, or manifest, always run:

```bash
npm run typecheck
npm run qa:episode
```

Both gates must pass with `0 errors` before rendering or committing.
