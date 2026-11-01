# ATELIER MACHINE — Design System

> **ATELIER MACHINE** is an independent art and technology studio that makes curious machines, interactive objects and artificial lifeforms.
> Tagline: **`Making Machines Feel Alive.`** (initial capitals, full stop) · VI: **`Làm cho máy móc như có sự sống.`** (same size as the English line)
>
> Technology is a medium for artistic expression, not just a tool. Everything built from this system reads as a **retro-futurist publication** from a small studio that makes things with its hands: **art direction first, engineering craft second**. Never a tech-news feed, a gaming brand or a corporate AI company.

---

## 0. Source of truth

This document summarises the design system artifact. When the two disagree, the artifact wins.

| What | Where | Edit? |
| :--- | :--- | :--- |
| Token values (colour, type, spacing, radius, stroke, texture) | [`design-system-artifact/project/tokens.json`](design-system-artifact/project/tokens.json) | Source |
| Component classes (`.am-*`) | [`design-system-artifact/project/components/bundle.css`](design-system-artifact/project/components/bundle.css) | Source |
| Component rules and live previews | [`design-system-artifact/project/components/<Name>/`](design-system-artifact/project/components/) (`README.md` + `preview.html`) | Source |
| Brand, formats, graphic language, templates, guidelines | [`design-system-artifact/project/*.md`](design-system-artifact/project/) | Source |
| CSS variables, theme blocks, type classes | [`src/styles/tokens.css`](src/styles/tokens.css) | Generated |
| Component classes for Remotion | [`src/styles/atelier-machine.css`](src/styles/atelier-machine.css) | Generated |
| Typed tokens and font list for inline styles | [`src/design-system/tokens.ts`](src/design-system/tokens.ts) | Generated |
| React components, formats, motion, font loading | [`src/design-system/`](src/design-system/) (`index.ts` exports all) | Hand-written, ported from the previews |
| Tailwind theme | [`tailwind.config.js`](tailwind.config.js) reads `tokens.json` directly | Do not add literals |

Generated files are rebuilt with **`npm run ds:build`** ([`scripts/build-design-system.ts`](scripts/build-design-system.ts)) and must not be edited by hand. To change a value, update the artifact, re-export it into `design-system-artifact/`, then rebuild.

**One rule for code:** colours, sizes, strokes and type come only from tokens or from `src/design-system/`. No hex literal, font size or border width is typed into a scene. Literal values copied from the artifact markup live only inside `src/design-system/components/`. The single exception is the `lcd` palette in Tailwind, used only for pixel art drawn inside XUNA's device screen.

---

## 1. Content and voice

- **Voice.** Curious, thoughtful, plainspoken: a maker explaining something they are excited about. Say what the machine does, then what it feels like. *"A small physical creature that senses light, learns from every encounter, and slowly becomes someone."*
- **Person and tense.** "We" for the studio, "you" only to invite a swipe or a follow. Present tense for what a machine does, past tense for build steps.
- **Casing.** Sentence case for headlines and body. UPPER-CASE only in IBM Plex Mono labels (`label`, `meta`), tags and the wordmark.
- **Length.** Headlines at most **8 words**, one idea per slide. Body text at most **25 words** per slide; if a slide needs more, split it. A question is a fine headline: "What is Physical AI?"
- **Honest specifics.** Name real parts and values (`ESP32`, `LDR + 10 kΩ`, `3.3 V`) with non-breaking spaces before units. **No hype words** ("revolutionary", "next-gen"), **no emoji**, **no exclamation marks**.
- **Languages.** English first; Vietnamese in the same styles and at the same size. Space Grotesk and IBM Plex Mono both carry Vietnamese diacritics; test every diacritic stack (ệ, ữ, ỳ) in headlines before publishing.
- **Naming.** `XUNA` is always upper-case. IDs use an em dash and three digits: projects `PRJ—001`, experiments `EXP—014`, build logs `LOG—007`, figures `FIG—003` (sub-figures add a letter). Object classes: `OBJ. CLASS A—3` (A artificial life, B interactive object).

---

## 2. Visual foundations

- **Direction.** Contemporary retro-futurism: 1970s space-age graphics, 1980s–90s computing, vintage industrial design and early digital interfaces, art-directed rather than decorated.
- **Colour.** Ground is `paper` (~45%) or `ink` (~30%). Accents by meaning: `lime` technical (~10%), `lilac` concept (~10%), `orange` artificial life and XUNA (~5%). The shares are a guideline; no post needs all five colours. Never introduce another dominant colour. **One accent field and one filled tag per slide.**
- **Light and dark.** Build both versions of every layout by swapping `surface` and `on-surface`. Accent fields keep their colour.
- **Type.** Space Grotesk for display, headlines and running text; IBM Plex Mono for IDs, labels, timestamps, coordinates and annotations. Display type is tight (−.03 to −.045em), mono labels are open (+.08em). **Never set a paragraph in mono.**
- **Layout.** Modular grid, asymmetric but balanced. One dominant element per slide, at least a third of the slide quiet, and **one deliberate break of the grid**.
- **Borders.** Outlines in `rule` at `stroke-line` (3 px), dividers at `stroke-hair` (2 px), the pixel frame at `stroke-heavy` (6 px). Corners are square. Only tags are pills; pins, step numbers and status discs are round.
- **Depth.** Flat. **No shadows, no gradients, no glow.** Depth comes from the halftone fade, paper grain and overlapping blocks.
- **Texture.** Paper grain on light slides, halftone on image frames and large panels, dot grid for diagrams, technical grid at 72 px. Textures are quiet and never sit under body text. **At most two textures per slide.**
- **Imagery.** Real hardware photography (bench, breadboard, printed parts), pixel art, and technical diagrams drawn from the graphic language. No stock, no generated robot imagery, no 3D renders of XUNA.
- **Motion (video covers).** Cuts and 8-frame pixel steps; never easing blurs or glitch effects.
- **Avoid.** Generic cyberpunk, neon, heavy gradients, glitch, sci-fi HUDs, overly dark compositions, gaming graphics, excessive pixelation, clutter and unexplained decoration.

### Logo and icons

- There is **no logo mark** yet. The wordmark is the name `ATELIER MACHINE` in Space Grotesk 700, upper-case, +.14em. Do not draw or invent a mark.
- There is **no icon set**. Use the twelve geometric symbols and the numbered pins (§7); each has one fixed meaning. No emoji, no glyph icons.

### XUNA

- XUNA is an existing orange pixel-art character. Use the supplied reference art at exact pixel multiples with nearest-neighbour scaling (`image-rendering: pixelated`) inside `CharacterFrame`. Never redraw, recolour, smooth or re-proportion it, and never turn it into a robot, animal or 3D character.
- Until reference art is placed in a slot, keep the labelled placeholder (`XUNA reference art pending`). Never publish a placeholder.

---

## 3. Colour tokens

Two themes: `light` (Light · Paper, the default on `:root`) and `dark` (Dark · Ink, `[data-theme="dark"]`).

| Token | Light | Dark | Use |
| :--- | :--- | :--- | :--- |
| `paper` | `#F4EFE4` | `#F4EFE4` | Brand warm bright cream paper. Main grid-free backgrounds, large negative space; text on `ink` |
| `card` | `#FAF8F3` | `#FAF8F3` | Warm editorial card surface on top of `paper` or `paper-shade` |
| `ink` | `#242424` | `#242424` | Brand ink. Type on paper, card, and accents, outlines, technical graphics, dark grounds |
| `lime` | `#D9F57A` | `#D9F57A` | Technical accent: indicators, active spoken word highlights, labels, project-number block. Text on it is `ink` |
| `lilac` | `#D9CBF6` | `#D9CBF6` | Concept field: concept and experimental slides, comparison columns |
| `orange` | `#FF9B56` | `#FF9B56` | Artificial-life accent: Xuân (VI) / Xuna (EN), character frames, warm highlights. Never body text on `paper` |
| `paper-shade` | `#E7DFCF` | `#E7DFCF` | Warm sand panel tint: card header strips, secondary panels, relief blocks. Not for text |
| `ink-soft` | `#5C584F` | `#5C584F` | Secondary text on `paper`, `card`, `paper-shade`, `lime`, `lilac`. Not on `orange`: use `ink` |
| `paper-soft` | `#B9B5AA` | `#B9B5AA` | Secondary text on `ink` and muted upcoming words in subtitle strips |
| `grid-line` | `#D6D1C1` | `#3B3B38` | Optional diagram lines only (background grid `am-gridbg` is disabled in minimalist editorial video layouts) |
| `surface` | → `paper` | → `ink` | Slide ground in the current theme |
| `on-surface` | → `ink` | → `paper` | Primary text, outlines and rules on `surface` |
| `muted` | → `ink-soft` | → `paper-soft` | Secondary text and mono metadata on `surface` |
| `rule` | → `ink` | → `paper` | Header, footer and section rules, frame borders, annotation lines |

**Approved text pairs (WCAG 2):** `ink` on `paper` 13.5:1 · `ink` on `lime` 12.8:1 · `ink` on `lilac` 10.2:1 · `ink` on `orange` 7.4:1 · `paper` on `ink` 13.5:1 · `lime` on `ink` 12.8:1 · `ink-soft` on `paper` 7.7:1 (on `lilac` 5.9:1) · `paper-soft` on `ink` 7.6:1.
**Never:** `orange` or `lilac` text on `paper` (1.8:1 / 1.3:1), `ink-soft` on `orange` (4.3:1).

---

## 4. Typography

Fonts are self-hosted from [`public/fonts/`](public/fonts/): Space Grotesk 400/500/600/700, IBM Plex Mono 400/500. Other fonts in that folder (Be Vietnam Pro, JetBrains Mono, Anton) are **not part of the system**; do not use them on brand surfaces.

Sizes are canvas pixels on a 1080 px-wide post.

| Style | Token class | `.am` shorthand | Family | Weight | Size / line | Tracking | Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Display XL | `.display-xl` | `.am-xl` | Space Grotesk | 700 | 220 / .88 | −.045em | Single-word project title on covers (XUNA). One per post |
| Display | `.display` | `.am-d` | Space Grotesk | 700 | 144 / .92 | −.04em | Question and statement covers, quotes |
| H1 | `.h1` | `.am-h1` | Space Grotesk | 700 | 96 / .98 | −.03em | Slide headlines, build log titles |
| H2 | `.h2` | `.am-h2` | Space Grotesk | 600 | 64 / 1.04 | −.02em | Subtitles, section statements |
| H3 | `.h3` | `.am-h3` | Space Grotesk | 600 | 44 / 1.1 | −.01em | Section headings, step titles, quiet CTAs |
| Body large | `.body-lg` | `.am-bl` | Space Grotesk | 500 | 36 / 1.35 | 0 | Lead paragraphs on covers |
| Body | `.body` | `.am-b` | Space Grotesk | 400 | 32 / 1.4 | 0 | Running text, left-aligned |
| Caption | `.caption` | `.am-cap` | Space Grotesk | 400 | 26 / 1.35 | 0 | Captions, step descriptions, in `muted` |
| Label | `.label` | `.am-lab` | IBM Plex Mono | 500 | 22 / 1.2 | +.08em | Upper-case labels, tags, IDs, header and footer text |
| Meta | `.meta` | `.am-meta` | IBM Plex Mono | 400 | 20 / 1.35 | +.04em | Metadata, coordinates, annotations, in `muted`. Never sentences |
| Data | `.data` | `.am-data` | IBM Plex Mono | 500 | 28 / 1.3 | 0 | Values in technical labels and readouts |
| Wordmark | — | `.am-wordmark` | Space Grotesk | 700 | 28 / 1 | +.14em | `ATELIER MACHINE`, upper-case |

- **Minimum sizes on 1080 px:** body 28, caption 24, label 22, metadata 20.
- The `.am-*` shorthands live inside an `.am` scope; `.am-cap` and `.am-meta` set their own `muted` colour, `.am-lab` upper-cases itself. The token classes (`.display-xl`…`.data`) set only the font.
- Left-align headlines, body text and annotations. Centre only a single short line (a quote attribution, a coordinate under a target).

---

## 5. Spacing, radius, stroke and texture tokens

| Group | Token | Value | Use |
| :--- | :--- | :--- | :--- |
| Spacing | `space-1` | 8 px | Base unit. Gaps inside tags, status indicators, icon-to-text |
| | `space-2` | 16 px | Label to value, small stacks |
| | `space-3` | 24 px | Column gutter, gap between steps |
| | `space-4` | 32 px | Padding inside panels and frames; gap between text blocks |
| | `space-5` | 48 px | Heading to its content block |
| | `space-6` | 72 px | Outer margin, technical grid module |
| | `space-7` | 96 px | Large separation between sections |
| | `margin-post` | 72 px | Margin on 4:5 and 1:1, and the sides of 9:16 |
| | `gutter` | 24 px | Gutter on the 6-column (4:5, 1:1) and 4-column (9:16) grids |
| | `safe-top-vertical` | 250 px | 9:16: text and key visuals below this line |
| | `safe-bottom-vertical` | 450 px | 9:16: text and key visuals above this distance from the bottom |
| | `safe-right-vertical` | 160 px | 9:16: text clear of the right-hand action rail |
| Radius | `radius-none` | 0 | Default: frames, panels, blocks, labels, IDs, images |
| | `radius-pill` | 999 px | Category tags only |
| | `radius-round` | 50% | Pins, step numbers, status discs, targeting rings |
| Stroke | `stroke-hair` | 2 px | Grid lines, row dividers, secondary rings |
| | `stroke-line` | 3 px | Default outline: rules, frames, tags, annotation lines, crosshairs |
| | `stroke-heavy` | 6 px | Pixel-art character frame and format outlines |
| Texture | `grain-opacity` | 0.07 | Paper grain on light slides (multiply); 0.06 screen on dark |
| | `halftone-opacity` | 0.35 | Halftone fade on image frames and panels |
| | `halftone-pitch` | 14 px | Halftone dot spacing |
| | `dot-pitch` | 24 px | Dot grid for diagrams and Pixel Life backgrounds |
| | `grid-pitch` | 72 px | Technical grid module, equal to the outer margin |

Every gap, padding and offset is one of the spacing values. Align blocks to the 72 px technical grid and text baselines to 8 px.

---

## 6. Social formats

Design on a 1080 px-wide canvas. All values are canvas pixels.

| Format | Canvas | Class | Margin and grid | Header / footer | Use |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Carousel 4:5 | 1080 × 1350 | `.am-slide` | 72 all sides, inner 936 × 1206; 6 columns of 136, gutter 24 | Header y 72–124, footer y 1222–1278; content y 150–1190 | Project introductions, explainers, hardware breakdowns, updates |
| Reels / TikTok 9:16 | 1080 × 1920 | `.am-slide.tall` | Safe box x 72–920, y 250–1470; 4 columns, gutter 24 | Header y 270, footer y 1400, inside the safe box | Video covers, demos, build process, experiments, stories |
| Square 1:1 | 1080 × 1080 | `.am-slide.sq` | 72; 6 columns as 4:5 | Header y 72, footer y 952 | Announcements, profile graphics, one title + one image, or a quote |

- **4:5:** the profile grid crops to 3:4, so keep titles and key marks at least 34 px from the left and right edges. Slide 1 is the cover with the title, slides 2 to n−1 carry one idea each, the last slide is the call to action.
- **9:16:** every word and key visual stays inside the safe box; backgrounds, textures and blocks may bleed. Covers crop to 3:4 on profile grids: keep the title between y 240 and y 1680. No page numbering on covers.
- `.am-slide` only sets the canvas size. Place bands and blocks with `.am-abs` at the coordinates above.
- Numbers and mono values align left in their column; right-align only counters and right-hand context labels in the header and footer.

---

## 7. Graphic language

Each element has a defined job; if it has no job on a slide, remove it.

1. **Technical grid overlay** (`Textures`, `Registration`): 72 px module in `grid-line`; shows the structure of a slide.
2. **Crosshair marker** (`Registration`): marks a corner or a point; four sizes.
3. **Coordinate label** (`Registration`): `X 12.40 · Y 08.75` in `meta`; locates an object.
4. **Circular targeting element** (`Registration`): rings and 30° ticks; isolates one subject.
5. **Retro computer interface frame** (`Frames`): window with a title bar for code and screens.
6. **Experiment identification tag** (`ExperimentId`, `Labels`): `EXP—014`.
7. **Technical annotation line** (`TechnicalAnnotation`, `Annotations`): ties a label to a part.
8. **Directional arrow** (`Annotations`): flow, return, emphasis; open head.
9. **Halftone pattern** (`Textures`): fades photos and panels into the paper.
10. **Paper grain** (`Textures`): warm print surface on light slides.
11. **Pixel-art frame** (`CharacterFrame`, `Frames`): stepped corners for characters.
12. **Industrial information panel** (`Frames`, `MetadataBlock`): rows of specification.
13. **Geometric symbol** (`Symbols`): twelve glyphs with one meaning each.
14. **Object classification label** (`Labels`): `OBJ. CLASS A—3`.
15. **Numbered project indicator** (`ProjectNumber`, `Labels`): `001`, `002`, `003`.

**Rules**

- Draw everything in `rule` colour or one accent fill; never recolour a symbol to match the slide.
- Per slide: at most **one targeting element, four annotations and two textures**.
- Graphics frame content; they never replace it. Keep body text on a clean area.
- Draw new elements from the same primitives: 3 px lines, squares, discs, plus marks and 8 px steps. Arrows have open heads, never filled.

**The twelve symbols:** disc = live · square = object · triangle = testing · half disc = input · plus = target · diamond = decision · ring = loop · bar = progress · pixel cluster = pixel life · arc = range · steps = evolution · bracket = focus. Fill only with `lime`, `lilac` or `orange`; outline in `rule`.

---

## 8. Components

29 components, each with rules in `design-system-artifact/project/components/<Name>/README.md` and a live `preview.html`. Wrap any component in an `.am` scope; set the scope ground with `.am.is-dark`, `.is-lilac`, `.is-lime`, `.is-orange` or `.is-shade`.

### Brand bands

| Component | Class | Rules |
| :--- | :--- | :--- |
| `BrandHeader` | `.am-header` > `.am-wordmark` + `.am-lab` | x 72, y 72, 936 wide (4:5, 1:1); y 270 on 9:16. Right label states template and number (`PRJ—001 · …`, `Build log · 07`). 3 px rule under it. No logo mark |
| `BrandFooter` | `.am-footer` | x 72, y 1222 on 4:5. Tagline `Making Machines Feel Alive.` in label style; `Swipe` on slides 1 to n−1, `Follow` on the last. Single images drop the page number. 3 px rule on top |
| `PageNumbering` | `.am-page` (`<b>02</b> / 05`) | Two digits, current in 500, total in 400. Centre of the footer on 4:5 and 1:1; omitted on 9:16 covers. Total counts the cover |
| `CarouselNav` | `.am-nav` > `.dots` / `.ar` | Bottom-right of the footer. Arrow 64 px, 3 px, open head. Last slide has no forward arrow. Dots only where there is no page numbering |

### Identity and labels

| Component | Class | Rules |
| :--- | :--- | :--- |
| `CategoryTag` | `.am-tag` (+ `.f-lime` / `.f-lilac` / `.f-orange` / `.f-ink` / `.f-paper`) | Outline by default; at most one filled tag per slide, filled by meaning (`lilac` concept, `lime` technical, `orange` artificial life, `ink` hardware). The only pills in the system |
| `ExperimentId` | `.am-expid` (`<b>EXP</b><span>014</span>`) | Prefixes `EXP`, `LOG`, `FIG`; three digits. One per slide, never two prefixes in one tag. Mono 500, 26 px; inverts with the surface |
| `ProjectNumber` | `.am-prj` > `strong` + `.am-lab` | Project Reveal covers and the lime block. Numbers never repeat or recolour. Numeral at least 96 px |
| `Labels` | — | Experiment tags, object classes (A—3 artificial life, B—1 interactive object), project indicators. Future project numbers in `muted`, never blank |
| `TechnicalLabel` | `.am-lbl` > `.k` + `.v` | Key mono 400 20 `muted`, value mono 500 28. Two to four in a row, unboxed. Real units with non-breaking spaces |
| `StatusIndicator` | `.am-status.is-live` / `.is-test` / `.is-done` / `.is-idle` | Shape + word, never colour alone: disc live (`lime`), triangle testing (`orange`), square done (`on-surface`), dashed square upcoming |

### Content blocks

| Component | Class | Rules |
| :--- | :--- | :--- |
| `SectionHeading` | `.am-sec` > number + `.am-h3` | Directly under the header band (y 170) on inner slides; never on covers. Numbers restart at 01 per post |
| `NumberedStep` | `.am-step` > `.n` `.t` `.d` | 56 px disc; title 36/600, description 28/400 `muted`, one sentence. Three to four per slide |
| `MetadataBlock` | `.am-meta-block` > `.k` `.v` | Keys mono 20 caps `muted`, values Space Grotesk 500 30. 3 px top rule, 2 px row rules. Three to five rows; status last |
| `QuoteBlock` | `.am-quote` > `.mk` `.qt` `.by` | Display 700, 96–144 px, two to four lines; hanging opening mark. Highlight at most one phrase (`lime` on dark, `orange` on light). Leave at least 40% of the slide empty |
| `ProgressIndicator` | `.am-prog` > `.bar` > `.seg.on` / `.seg.now` | One 24 px segment per stage, 8 px gap. Done `lime`, current `orange`, upcoming outline. Always a mono count label |

### Frames and media

| Component | Class | Rules |
| :--- | :--- | :--- |
| `Frames` | `.am-code` and the frames below | Square; border `stroke-line`, or `stroke-heavy` for the pixel frame. Computer frame for code and screens, panel for specs, image frame for photos. Never nest more than one frame |
| `ImageFrame` | `.am-img` > `.ph` / `.cap` | Real photos only, on `paper-shade` with the halftone fade, no filters. Caption bar: figure number left, view or scale right. Crosshairs 24 px outside the corners |
| `CharacterFrame` | `.am-char` > `.px-out` `.px-in` `.pxg` `.ph` | 8 px stepped corners, `orange` field for XUNA. Exact pixel multiples, nearest-neighbour. Placeholder until art is supplied |

### Graphic elements

| Component | Class | Rules |
| :--- | :--- | :--- |
| `TechnicalAnnotation` | `.am-note` > `.dot` `.ln` `.tx` | Dot ends on a surface, square on an edge, dashed for optional or hidden parts. 3 px, horizontal or vertical first, 45° only when needed; lines never cross |
| `Annotations` | SVG in `.am-layer`, labels `.am-svgt` | Annotation lines, open-headed arrows, dimension lines, numbered pins. At most four per image |
| `Registration` | `.am-x` (crosshair) | Grid, crosshairs, coordinates, targets: each with a job. `rule` colour, 3 or 2 px. One target per slide. Coordinates are sample data, never a real person's location |
| `Symbols` | SVG | The twelve symbols in §7 |
| `Textures` | `.am-gridbg` `.am-halftone` `.am-dots` `.am-hatch` `.am-grain` | Use the opacity tokens, never stronger. At most two per slide; text areas texture-free apart from grain. Hatch only for unsafe or restricted zones |

### Boards (reference only)

`ColorBoard` (colours, shares, contrast), `TypeBoard` (all styles with Vietnamese coverage), `GridBoard` (grids, margins, safe areas) document the foundations; they are not used in posts. `Cover` is the artifact's own cover preview.

### Template components

`TemplateProjectReveal`, `TemplateBuildLog`, `TemplateTechExplainer`; see §9.

---

## 9. Templates

Six families share one header, footer, grid and component set. **Three are designed; three are not yet** and have no components: do not invent them.

| Family | Component | Purpose | Colour lead | Status |
| :--- | :--- | :--- | :--- | :--- |
| 01 Project Reveal | `TemplateProjectReveal` | Introduce a new project | `paper` + `orange` frame, `lime` number | Designed |
| 02 Build Log | `TemplateBuildLog` | Document the making | `paper` + `lime` stage block, `lilac` code slide | Designed |
| 03 Tech Explainer | `TemplateTechExplainer` | Explain a concept | `paper` + `lime` glyph, `lilac` comparison | Designed |
| 04 Experiment Report | — | Show an experiment | `paper` + `lime` status | Next |
| 05 Concept / Quote | — | Philosophy, one idea | `ink` and `paper`, light and dark | Next |
| 06 Pixel Life | — | XUNA personality and evolution | `lilac` or `orange` ground | Next, needs XUNA reference art |

**01 Project Reveal.** Cover: one `display-xl` word in `on-surface`, `h2` subtitle, `ProjectNumber` block, one-sentence description, up to three `CategoryTag`s and the `CharacterFrame`. Inner: Concept on `lilac` (statement `h1`, lead `body-lg`, `MetadataBlock`); Anatomy (frame with four numbered `TechnicalAnnotation`s and a `NumberedStep` key). 4–6 slides; the last ends with `Follow the build.` The dark variant keeps the frame orange.

**02 Build Log.** Cover: `lime` stage block (`label` + 200 px numeral) beside an `h1` title, `ExperimentId` and tag, then a real photo in `ImageFrame` with numbered pins and a three-value `TechnicalLabel` row. Inner: Components (photo + four `NumberedStep`s), Firmware (code in `.am-code`, at most 10 real, compilable lines at 26 px; three steps), Progress (six stage rows with `StatusIndicator` and a `ProgressIndicator`). End with the next log's title as the call to action.

**03 Tech Explainer.** Cover: question in `display`, one oversized `lime` glyph (the question mark) clipped by the right edge, a two-line `body-lg` answer, nothing else. Diagram: three nodes (`lime`, `lilac`, `orange`) with arrows and a dashed return path, then three one-sentence `NumberedStep`s. Comparison: two columns, mono row keys, the subject in `lime`. Takeaway on `ink` with one `lime` phrase and the next question.

**Every family**

- Slide 1 is a cover with one dominant element; inner slides open with a `SectionHeading`.
- One lead background colour per post plus at most one dark slide. Never repeat a composition on consecutive slides.
- `BrandHeader` and `BrandFooter` on every slide; page numbering counts the cover.
- Light and dark swap `surface` and `on-surface`; accent fields keep their colour.
- Replace every placeholder (photo, XUNA) with real material before publishing.

---

## 10. Usage guidelines

**Hierarchy.** 1. The headline or one dominant graphic. 2. Technical identity (project number, experiment ID, tags). 3. Body text and annotations.

**Do**

- Use real hardware photographs and the supplied XUNA reference art.
- Let negative space work; leave at least a third of a slide quiet.
- Pair every status colour with a shape and a word.
- Keep one accent field and one filled tag per slide.
- Check each headline in Vietnamese before publishing a bilingual post.

**Don't**

- Use gradients, glow, shadows, neon or glitch effects.
- Set paragraphs in mono or decorative fonts, or go below the minimum sizes.
- Place text on halftone, grain-heavy areas or a photo without a `paper` or `ink` plate.
- Redraw XUNA, invent a logo mark, or add stock or generated robot imagery.
- Add a graphic element without a job from §7.

**Image treatment.** Photos: natural colour, square-on or a clear three-quarter angle, plain bench, in `ImageFrame`. Pixel art: whole-multiple nearest-neighbour scaling on a flat field, dot grid at most. Diagrams: 3 px lines, nodes in `lime`, `lilac`, `orange`, labels in `label`.

**Checklist before publishing**

- [ ] Header and footer on every slide, same positions on every post
- [ ] Colours only from tokens; type only from the styles
- [ ] Light and dark versions both checked at phone size
- [ ] Headline ≤ 8 words, body ≤ 25 words per slide, no emoji or exclamation marks
- [ ] ≤ 1 target, ≤ 4 annotations, ≤ 2 textures, 1 accent field, 1 filled tag per slide
- [ ] No placeholder left (photo, XUNA)

---

## 11. Using the system in code

[`src/Root.tsx`](src/Root.tsx) already imports `styles/globals.css` and calls `loadAmFonts()`, which loads the six font files from `public/fonts/` with `staticFile()` and holds the render until they are ready. Import everything else from [`src/design-system`](src/design-system/index.ts).

### Components (React, ported 1:1 from the artifact previews)

| Group | Exports |
| :--- | :--- |
| Canvas | `Slide` (format, ground, `grid`, `grain`), `AmScope`, `Abs`, `SvgLayer`, `Texture` |
| Brand bands | `BrandHeader`, `BrandFooter`, `PageNumbering`, `CarouselNav`, `TAGLINE`, `TAGLINE_VI` |
| Identity | `CategoryTag`, `ExperimentId`, `ProjectNumber`, `ProjectNumberBlock`, `ObjectClass`, `TechnicalLabel`, `TechnicalLabelRow`, `StatusIndicator` |
| Content | `SectionHeading`, `NumberedStep`, `NumberedSteps`, `MetadataBlock`, `QuoteBlock`, `QuoteHighlight`, `ProgressIndicator` |
| Frames | `CharacterFrame`, `PixelSprite`, `XUNA_SPRITE`, `ImageFrame`, `CodeFrame` (+ `CodeKeyword`, `CodeNumber`, `CodeComment`), `ComputerFrame`, `InfoPanel` |
| Graphics (SVG, inside `SvgLayer`) | `Crosshair`, `CoordinateLabel`, `TargetRing`, `DashedOrbit`, `AnnotationLine`, `Arrow`, `DimensionLine`, `NumberedPin`, `SvgLabel` |
| Graphics (HTML) | `TechnicalAnnotation`, `AmSymbol` (+ `SYMBOL_MEANING`) |
| Layout | `formats` (canvas, safe box, header/footer bands, `sectionTop` per format), `column(format, index, span)` |
| Motion | `Cut`, `PixelWipe`, `pixelStep`, `stepCount`, `spriteFrame`, `PIXEL_STEPS` |
| Tokens | `color`, `themes`, `typeStyles`, `fontFamily`, `fonts`, `space`, `radius`, `stroke`, `texture` |

Not ported: `ColorBoard`, `TypeBoard`, `GridBoard` and `Cover` are reference boards. The three template families are composed from the components; see [`src/compositions/AmProjectRevealVertical.tsx`](src/compositions/AmProjectRevealVertical.tsx) for Project Reveal at 9:16.

```tsx
import { useCurrentFrame } from "remotion";
import { Slide, BrandHeader, BrandFooter, Abs, Cut, PixelWipe, CharacterFrame, PixelSprite, XUNA_SPRITE, spriteFrame, formats } from "../design-system";

const { safe } = formats["9:16"];

export const Cover = () => {
  const frame = useCurrentFrame();
  return (
    <Slide format="9:16" grid grain>
      <BrandHeader context="PRJ—001 · Artificial life" />
      <PixelWipe at={6} className="am-abs am-xl" style={{ left: 66, top: 340 }}>XUNA</PixelWipe>
      <PixelWipe at={24} direction="down" className="am-abs" style={{ left: 500, top: 600 }}>
        <CharacterFrame size={400}>
          <PixelSprite sheet={XUNA_SPRITE} column={spriteFrame(frame, XUNA_SPRITE.columns, 4, 24)} scale={3} />
        </CharacterFrame>
      </PixelWipe>
      <Cut at={64}>
        <Abs left={safe.left} top={1080} width={560} className="am-b">A small physical creature that senses light.</Abs>
      </Cut>
      <BrandFooter />
    </Slide>
  );
};
```

### Motion

- **Cut** (`<Cut at>`) for almost everything: elements appear on a frame, never fade.
- **Pixel steps** (`<PixelWipe>`, `pixelStep`, `stepCount`): 8 hard steps over 8 frames by default. Use for the one dominant element of a scene.
- **Sprites** (`spriteFrame`): hold each XUNA frame for a whole number of video frames, scale by whole multiples.
- Drive everything from `useCurrentFrame()`. No CSS `transition`/`animation`, no `interpolate` with easing, no blur, opacity fades or glitch.

### Other ways to use the tokens

```tsx
// Inline styles: typed tokens
import { themes, typeStyles, space } from "../design-system";
<h1 style={{ ...typeStyles.h1, color: themes.light["on-surface"], marginBottom: space["space-5"] }} />

// Tailwind: utility names mirror token names
<div className="bg-am-surface text-am-on-surface text-am-h1 p-space-4 border-line border-am-rule rounded-none" />
```

- Theme: inside components, set the ground with `Slide`/`AmScope` (`ground="dark"` → `.am.is-dark`). Outside an `.am` scope, `[data-theme="dark"]` on a container switches `surface`, `on-surface`, `muted`, `rule` and `grid-line` for Tailwind `am-*` colours and any `var(--…)`.
- Known artifact behaviour, kept as is: on `ink` grounds the `f-ink` tag, `CodeFrame` and the ink outlines of filled symbols lose their edge, and the `ImageFrame` halftone uses `paper` dots. Prefer light grounds for those components.

### Visual QA

`npm run ds:sheet` renders every component in light and dark to `out/am-component-sheet.png`; compare it with the artifact previews after changing the artifact or the components.
