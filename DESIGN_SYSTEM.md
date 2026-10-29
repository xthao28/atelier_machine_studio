# ATELIER MACHINE — Official Design System (Extracted from Artifact)

> **Studio Identity:** **ATELIER MACHINE** is an independent art and technology studio that makes curious machines, interactive objects and artificial lifeforms.
> - **Tagline (EN):** `Making Machines Feel Alive.` (Always initial capitals + full stop)
> - **Tagline (VI):** `Làm cho máy móc như có sự sống.` (Same size as its English line)
> - **Core Philosophy:** Technology is a medium for artistic expression, not just a tool. Everything built from this system should read as a **retro-futurist publication** from a small studio that makes things with its hands: **art direction first, engineering craft second** — never a tech-news feed, a gaming brand, or a corporate AI company.

---

## 1. Content Fundamentals & Editorial Voice

- **Voice:** Curious, thoughtful, plainspoken — a maker explaining something they are excited about. Say what the machine does, then what it feels like.
  - *Example:* `"A small physical creature that senses light, learns from every encounter, and slowly becomes someone."`
- **Person & Tense:** `"We"` for the studio, `"you"` only to invite a swipe or a follow. Present tense for what a machine does, past tense for build steps.
- **Casing:**
  - **Sentence case** for headlines and body.
  - **UPPER-CASE** only in `IBM Plex Mono` labels (`label`, `meta`), tags, and the wordmark (`ATELIER MACHINE`).
- **Length Limits:**
  - Headlines: **at most 8 words**; one idea per slide/scene. A question is a fine headline (`"What is Physical AI?"`).
  - Body text: **at most 25 words** on a slide/scene. If a slide needs more than 25 words, split it.
- **Honest Specifics:** Name real parts and values (`ESP32-S3`, `LDR + 10 kΩ`, `3.3 V`, `Q1.14`, `life0 / life1`). **No hype words** (`"revolutionary"`, `"next-gen"`), **no emoji**, **no exclamation marks**.
- **Languages:** English first; Vietnamese in the same styles. Both `Space Grotesk` and `IBM Plex Mono` carry full Vietnamese diacritics.
- **Naming Conventions:**
  - `XUNA` is always upper-case.
  - Projects: `PRJ—001` (with em-dash `—`)
  - Experiments: `EXP—014`
  - Build logs: `LOG—007`
  - Object classification: `OBJ. CLASS A—3`

---

## 2. Visual Foundations

1. **Direction:** Contemporary retro-futurism — 1970s space-age graphics, 1980s–90s computing, vintage industrial design, and early digital interfaces, art-directed rather than decorated. Retro and futuristic at the same time.
2. **Colour Proportions:**
   - Ground is `paper` (**45%**) or `ink` (**30%**).
   - Accents are `lime` (**technical**, ~10%), `lilac` (**concept**, ~10%), and `orange` (**artificial life / XUNA**, ~5%).
   - Text is `ink` on light fields and `paper` on `ink`; secondary text is `muted`.
   - **Rule:** Do not use all five colours in every post/scene, and do not introduce another dominant colour. Keep **one accent field per slide** and **one filled tag**. Build a light and a dark version by swapping `surface` and `on-surface` (accent fields stay the same colour).
3. **Borders & Corners:**
   - Outlines in `rule` at `stroke-line` (`3px`); dividers at `stroke-hair` (`2px`); the pixel frame at `stroke-heavy` (`6px`).
   - Corners are **square** (`radius-none: 0`); **only tags are pills** (`radius-pill: 999px`) and **pins, step numbers, and status discs are round** (`radius-round: 50%`).
4. **Depth:** **Flat. No shadows, no gradients, no glow.** Depth comes from the halftone fade, paper grain, and overlapping blocks.
5. **Texture:**
   - Paper grain on light slides (`--grain-opacity: 0.07`).
   - Halftone on image frames and large panels (`--halftone-opacity: 0.35`, `--halftone-pitch: 14px`).
   - Dot grid for diagrams (`--dot-pitch: 24px`).
   - Technical grid at `--grid-pitch: 72px`.
   - **Rule:** Textures are quiet and **never sit under body text**. At most **two textures per slide**.
6. **Imagery & XUNA Character Rules:**
   - Real hardware photography (bench, breadboard, printed parts), pixel art, and technical diagrams drawn from this system's graphic language. No stock, no generated robot imagery, no 3D renders of XUNA.
   - **XUNA:** XUNA is an existing orange pixel-art character. Use the supplied reference art at **exact pixel multiples with nearest-neighbour scaling** (`image-rendering: pixelated`) inside `CharacterFrame` (`.am-char`). Never redraw, recolour, smooth, or re-proportion it.
7. **Motion (Video & Covers):**
   - **Cuts and 8-frame pixel steps** (`steps(8)` or discrete frame quantization), **never easing blurs or glitch effects**.
8. **Avoid:** Generic cyberpunk, neon, heavy gradients, glitch, sci-fi HUDs, overly dark compositions, gaming graphics, excessive pixelation, clutter, and unexplained decoration.

---

## 3. Color Tokens (`tokens.css`)

| Token | CSS Variable | Light · Paper (`[data-theme="light"]`) | Dark · Ink (`[data-theme="dark"]`) | Semantic Role |
| :--- | :--- | :--- | :--- | :--- |
| **Paper** | `--paper` | `#F2EFE7` | `#F2EFE7` | Warm archival paper ground (45% share) |
| **Paper Shade** | `--paper-shade` | `#E4DFD1` | `#E4DFD1` | Secondary panel / image frame well |
| **Paper Soft** | `--paper-soft` | `#B9B5AA` | `#B9B5AA` | Muted text on dark ink surfaces (7.5:1 contrast) |
| **Ink** | `--ink` | `#242424` | `#242424` | Deep carbon ink ground / rule / primary text (30% share) |
| **Ink Soft** | `--ink-soft` | `#4A4A46` | `#4A4A46` | Muted text on light paper surfaces (7.7:1 contrast) |
| **Lime** | `--lime` | `#D9F57A` | `#D9F57A` | **Technical** accent (hardware, firmware, live status, ~10%) |
| **Lilac** | `--lilac` | `#D9CBF6` | `#D9CBF6` | **Concept** accent (theory, architecture, code comparison, ~10%) |
| **Orange** | `--orange` | `#FF9B56` | `#FF9B56` | **Artificial Life / XUNA** accent (character frame, active step, ~5%) |
| **Grid Line** | `--grid-line` | `#D6D1C1` | `#3B3B38` | 72px technical module grid line |
| **Surface** | `--surface` | `var(--paper)` (`#F2EFE7`) | `var(--ink)` (`#242424`) | Adaptive slide background |
| **On-Surface** | `--on-surface` | `var(--ink)` (`#242424`) | `var(--paper)` (`#F2EFE7`) | Adaptive primary text (13.5:1 contrast) |
| **Muted** | `--muted` | `var(--ink-soft)` (`#4A4A46`) | `var(--paper-soft)` (`#B9B5AA`) | Adaptive secondary text |
| **Rule** | `--rule` | `var(--ink)` (`#242424`) | `var(--paper)` (`#F2EFE7`) | Adaptive 3px/2px border & line color |

---

## 4. Typography (`Space Grotesk` + `IBM Plex Mono`)

All font files are extracted directly from the artifact into [`public/fonts/`](file:///Users/xthao28/atelier_machine_studio/public/fonts):
- `SpaceGrotesk-400.ttf`, `SpaceGrotesk-500.ttf`, `SpaceGrotesk-600.ttf`, `SpaceGrotesk-700.ttf`
- `IBMPlexMono-400.ttf`, `IBMPlexMono-500.ttf`

### Type Scale (1080px-wide canvas pixels)

| Style Name | Class / Shorthand | Font Family | Weight | Size | Line Height | Letter Spacing | Transform & Rules |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display XL** | `.display-xl` / `.am-xl` | `Space Grotesk` | `700` | `220px` | `0.88` | `-0.045em` | Sentence case |
| **Display** | `.display` / `.am-d` | `Space Grotesk` | `700` | `144px` | `0.92` | `-0.04em` | Sentence case |
| **H1** | `.h1` / `.am-h1` | `Space Grotesk` | `700` | `96px` | `0.98` | `-0.03em` | Sentence case (max 8 words) |
| **H2** | `.h2` / `.am-h2` | `Space Grotesk` | `600` | `64px` | `1.04` | `-0.02em` | Sentence case |
| **H3** | `.h3` / `.am-h3` | `Space Grotesk` | `600` | `44px` | `1.1` | `-0.01em` | Sentence case |
| **Body Large** | `.body-lg` / `.am-bl` | `Space Grotesk` | `500` | `36px` | `1.35` | `0` | Sentence case (max 25 words) |
| **Body** | `.body` / `.am-b` | `Space Grotesk` | `400` | `32px` | `1.4` | `0` | Minimum on 1080px canvas: `28px` |
| **Caption** | `.caption` / `.am-cap` | `Space Grotesk` | `400` | `26px` | `1.35` | `0` | Minimum on 1080px canvas: `24px` |
| **Label** | `.label` / `.am-lab` | `IBM Plex Mono` | `500` | `22px` | `1.2` | `+0.08em` | **UPPER-CASE** (min `22px`) |
| **Meta** | `.meta` / `.am-meta` | `IBM Plex Mono` | `400` | `20px` | `1.35` | `+0.04em` | Coordinates, timestamps (min `20px`) |
| **Data** | `.data` / `.am-data` | `IBM Plex Mono` | `500` | `28px` | `1.3` | `0` | Numeric readouts, sensor values |
| **Wordmark** | `.am-wordmark` | `Space Grotesk` | `700` | `28px` | `1.0` | `+0.14em` | **UPPER-CASE**: `ATELIER MACHINE` |

> **Rule:** Never set a paragraph in mono. Left-align headlines, body text, and annotations. Centre only a single short line (a quote attribution, a coordinate under a target).

---

## 5. Social Formats, Grids & Safe Zones (`formats.md`)

Design every post/video on a **1080px wide canvas**.

### A. Instagram Reels, TikTok & Shorts · `9:16` (`1080 × 1920`) — `.am-slide.tall`
- **Use for:** Video covers, project demonstrations, build process, experiment videos, and short-form stories.
- **Conservative Safe Box:**
  - `x`: **`72px` to `920px`** (Left margin `72px`, Right safe zone `--safe-right-vertical: 160px` = width `848px`)
  - `y`: **`250px` to `1470px`** (Top safe zone `--safe-top-vertical: 250px`, Bottom safe zone `--safe-bottom-vertical: 450px` = height `1220px`)
- **Grid:** **4 columns**, `--gutter: 24px`.
- **Bands:**
  - `BrandHeader` sits at **`y = 270`** inside the safe box.
  - `BrandFooter` sits at **`y = 1400`** inside the safe box.
  - Profile 3:4 crop safety: keep titles between `y = 240` and `y = 1680`, preferably inside the safe box.
- **Rule:** Keep every word and key visual inside the safe box. Backgrounds, textures, and blocks may bleed to the edges.

### B. Instagram Carousel · `4:5` (`1080 × 1350`) — `.am-slide`
- **Margin:** `--margin-post: 72px` on all sides; inner area `936 × 1206`.
- **Grid:** **6 columns**, column `136px`, `--gutter: 24px`.
- **Bands:** Header `y = 72–124` (`BrandHeader`), Footer `y = 1222–1278` (`BrandFooter`). Content lives between `y = 150` and `y = 1190`.

### C. Square · `1:1` (`1080 × 1080`) — `.am-slide.sq`
- **Margin:** `72px`; 6 columns as 4:5. Header `y = 72`, Footer `y = 952`.

### D. Spacing Scale
- `--space-1: 8px` · `--space-2: 16px` · `--space-3: 24px` · `--space-4: 32px` · `--space-5: 48px` · `--space-6: 72px` · `--space-7: 96px`
- Every gap, padding, and offset is one of these values. Align to the `72px` technical grid; text baselines to `8px`.

---

## 6. The 15 Graphic Language Elements (`graphic-language.md`)

Each element has a defined purpose; **if an element has no job on a slide, remove it**.
- **Limits per slide/scene:** At most **1 targeting element**, **4 annotations**, and **2 textures** per slide.
- **Primitive rules:** Draw everything in `rule` colour (`3px` lines) or one accent fill; never recolour a symbol to match the slide. Arrows have **open mitered heads, never filled**.

1. **Technical grid overlay** (`Textures`, `Registration`): `72px` module in `grid-line` (`.am-gridbg`); shows the structure of a slide.
2. **Crosshair marker** (`Registration`): `.am-x` (`24×24px`, `3px` stroke); marks a corner or a point; four sizes.
3. **Coordinate label** (`Registration`): `X 12.40 · Y 08.75` in `meta`; locates an object.
4. **Circular targeting element** (`Registration`): Concentric rings and 30° ticks; isolates one subject.
5. **Retro computer interface frame** (`Frames`): Window with title bar for code and screens (`.am-code`).
6. **Experiment identification tag** (`ExperimentId`, `Labels`): `.am-expid` — e.g. `<b>EXP</b><span>014</span>` or `EXP—014`.
7. **Technical annotation line** (`TechnicalAnnotation`, `Annotations`): `.am-note` / SVG `3px` line with `r=8` dot or `16×16` square or open arrow tying a mono label (`ESP32-S3`, `Light sensor`, `Pixel display`) to one part of an image.
8. **Directional arrow** (`Annotations`): `3px` or `6px` stroke, or `stroke-dasharray="10 8"`, with open mitered head (`Direction · Flow · Return`).
9. **Halftone pattern** (`Textures`): `.am-halftone` (`14px` pitch, `0.35` opacity); fades photos and panels into the paper.
10. **Paper grain** (`Textures`): `.am-grain` (`0.07` opacity); warm print surface on light slides.
11. **Pixel-art frame** (`CharacterFrame`, `Frames`): `.am-char` — `8px` stepped pixel corners (`24px` 3-step corner notch) with `var(--fg)` outer border and `var(--c-orange)` inner field + `32×32px` pixel grid.
12. **Industrial information panel** (`Frames`, `MetadataBlock`): `.am-meta-block` — `220px 1fr` specification rows with `3px` top rule and `2px` row dividers.
13. **Geometric symbol** (`Symbols`): Twelve geometric glyphs with one fixed meaning each (no emoji, no icon sets).
14. **Object classification label** (`Labels`): `OBJ. CLASS A—3`.
15. **Numbered project indicator** (`ProjectNumber`, `Labels`): `.am-prj` (`001`, `002`, `003` in `96px` Space Grotesk Bold + `.am-lab`).

---

## 7. The 6 Template Families (`templates.md`)

| # | Family | Component Name | Purpose | Colour Lead |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **Project Reveal** | `TemplateProjectReveal` | Introduce a new project (`XUNA`) | `paper` + `orange` frame, `lime` number |
| **02** | **Build Log** | `TemplateBuildLog` | Document the making (`M01` → `M05a` → `PE-4`) | `paper` + `lime` stage block, `lilac` code slide |
| **03** | **Tech Explainer** | `TemplateTechExplainer` | Explain a concept (`LifeCore`, `Affect`, `EvidenceLedger`) | `paper` + `lime` glyph, `lilac` comparison |
| **04** | **Experiment Report** | `TemplateExperimentReport` | Show an experiment (`UCB`, `Brier score`, `46 native tests`) | `paper` + `lime` status |
| **05** | **Concept / Quote** | `TemplateConceptQuote` | Philosophy, one idea (*"Every experience shapes who XUNA becomes."*) | `ink` and `paper`, light and dark |
| **06** | **Pixel Life** | `TemplatePixelLife` | XUNA personality and evolution (`Temperament.h`, expressions) | `lilac` or `orange` ground |

### Rules Applying to Every Template Family
1. **Slide/Scene 1** is a cover with one dominant element. Inner scenes open with a `SectionHeading` (`.am-sec`).
2. Each post/video has one lead background colour plus at most one dark scene per sequence. Do not repeat the same composition on consecutive scenes.
3. Every scene carries `BrandHeader` (`.am-header`) and `BrandFooter` (`.am-footer`); page/scene numbering (`<b>02</b> / 06`) counts the cover.
4. Pair every status colour with a **shape** and a **word** in `.am-status`:
   - `.is-live`: **Circle** (`border-radius: 50%`) in `lime`
   - `.is-test`: **Triangle** (`clip-path: polygon(50% 0, 100% 100%, 0 100%)`) in `orange`
   - `.is-done`: **Square** filled in `fg`
   - `.is-idle`: **Dashed Square** (`border-style: dashed`)

---

## 8. Complete 29-Component Inventory (from Artifact)

All CSS implementations are saved in [`src/styles/atelier-machine.css`](file:///Users/xthao28/atelier_machine_studio/src/styles/atelier-machine.css):

1. `Annotations` — SVG `3px` annotation lines (dot/square/open-arrow end), directional arrows (`3px`/`6px`/dashed), dimension lines (`936 PX`, `72 PX`), and numbered pins (`r=22` circle with `IBM Plex Mono` index).
2. `BrandHeader` (`.am-header`) — `<span class="am-wordmark">Atelier Machine</span>` left + `<span class="am-lab">PRJ—001 · Artificial life</span>` right, `3px` bottom border.
3. `BrandFooter` (`.am-footer`) — `<span class="am-lab">Making Machines Feel Alive.</span>` left + `<span class="am-page"><b>02</b> / 05</span>` center + `<span class="am-nav">Swipe <span class="ar"></span></span>` right, `3px` top border.
4. `CarouselNav` (`.am-nav`) — Mono label + `.dots` or `.ar` (`64px` shaft + `16px` mitered open arrowhead).
5. `CategoryTag` (`.am-tag`) — Only pill-shaped element (`border-radius: 999px`, `3px` border, `.f-lime`, `.f-lilac`, `.f-orange`, `.f-ink`, `.f-paper`).
6. `CharacterFrame` (`.am-char`) — Stepped `8px` pixel-corner frame (`24px` corner cut) with `--c-orange` background and `32px` pixel grid for XUNA sprites.
7. `ColorBoard` — Swatch & contrast verification board.
8. `ExperimentId` (`.am-expid`) — Split box `<b>EXP</b><span>014</span>` with `3px` border.
9. `Frames` — Retro computer window frame, `.am-code` (`#242424` ground, `--c-lime` keywords, `--c-orange` numbers, `--c-psoft` comments).
10. `GridBoard` — 6-column (`4:5`) and 4-column (`9:16`) modular grid overlay.
11. `ImageFrame` (`.am-img`) — `3px` bordered frame on `--c-shade` with halftone edge fade and bottom mono `.cap` bar.
12. `Labels` — Object classification & specification labels.
13. `MetadataBlock` (`.am-meta-block`) — 2-column (`220px 1fr`) industrial specification table (`3px` top rule, `2px` hair row dividers).
14. `NumberedStep` (`.am-step`) — `56×56px` round disc `.n` + `36px` title `.t` + `28px` muted description `.d`.
15. `PageNumbering` (`.am-page`) — `<b>02</b> / 05` in `22px` `IBM Plex Mono`.
16. `ProgressIndicator` (`.am-prog`) — Segmented `24px`-tall bar with `3px` borders (`.seg.on` in `lime`, `.seg.now` in `orange`).
17. `ProjectNumber` (`.am-prj`) — `96px` Space Grotesk Bold number + `.am-lab` subtitle.
18. `QuoteBlock` (`.am-quote`) — `220px` quotation mark `.mk` + `96px` quote `.qt` + mono attribution `.by`.
19. `Registration` (`.am-x`) — Crosshair markers, coordinate readouts (`X 12.40 · Y 08.75`), circular targeting rings.
20. `SectionHeading` (`.am-sec`) — Baseline-aligned index/label + `.am-h3` (`44px`) + `3px` bottom border.
21. `StatusIndicator` (`.am-status`) — Shape + color + mono label (`.is-live` circle, `.is-test` triangle, `.is-done` solid square, `.is-idle` dashed square).
22. `Symbols` — 12 geometric glyphs in `3px` stroke.
23. `TechnicalAnnotation` (`.am-note`) — `16px` dot + `96px` line (`3px`) + mono text.
24. `TechnicalLabel` (`.am-lbl`) — Stacked mono key `.k` (`20px` muted) + mono value `.v` (`28px`).
25. `TemplateBuildLog` — Family 02 layout (`paper` + `lime` stage block + `lilac` code slide).
26. `TemplateProjectReveal` — Family 01 layout (`paper` + `orange` character frame + `lime` project number).
27. `TemplateTechExplainer` — Family 03 layout (`paper` + `lime` glyph + `lilac` comparison).
28. `Textures` — `.am-gridbg`, `.am-halftone`, `.am-dots`, `.am-hatch`, `.am-grain`.
29. `TypeBoard` — Complete specimen sheet for Display, Text, and Technical styles.
