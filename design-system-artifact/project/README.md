ATELIER MACHINE is an independent art and technology studio that makes curious machines, interactive objects and artificial lifeforms. Its tagline is **Making Machines Feel Alive.** Technology is a medium for artistic expression, not just a tool. Everything built from this system should read as a retro-futurist publication from a small studio that makes things with its hands: art direction first, engineering craft second, never a tech-news feed, a gaming brand or a corporate AI company.

## Content fundamentals

- **Voice.** Curious, thoughtful, plainspoken: a maker explaining something they are excited about. Say what the machine does, then what it feels like. "A small physical creature that senses light, learns from every encounter, and slowly becomes someone."
- **Person and tense.** "We" for the studio, "you" only to invite a swipe or a follow. Present tense for what a machine does, past tense for build steps.
- **Casing.** Sentence case for headlines and body. UPPER-CASE only in IBM Plex Mono labels (`label`, `meta`), tags and the wordmark. The tagline is always `Making Machines Feel Alive.` with initial capitals and a full stop.
- **Length.** Headlines at most 8 words; one idea per slide; body text at most 25 words on a slide. A question is a fine headline: "What is Physical AI?"
- **Honest specifics.** Name real parts and values (`ESP32`, `LDR + 10 kΩ`, `3.3 V`). No hype words ("revolutionary", "next-gen"), no emoji, no exclamation marks.
- **Languages.** English first; Vietnamese in the same styles. Space Grotesk and IBM Plex Mono both carry Vietnamese diacritics, so keep `Làm cho máy móc như có sự sống.` at the same size as its English line.
- **Naming.** XUNA is always upper-case. Projects are numbered (`PRJ—001`), experiments are `EXP—014`, build logs are `LOG—007`.

## Visual foundations

- **Direction.** Contemporary retro-futurism: 1970s space-age graphics, 1980s–90s computing, vintage industrial design and early digital interfaces, art-directed rather than decorated. Retro and futuristic at the same time.
- **Colour.** Ground is `paper` (45%) or `ink` (30%). Accents are `lime` (technical), `lilac` (concept) and `orange` (artificial life, XUNA), roughly 10 / 10 / 5%. Text is `ink` on light fields and `paper` on `ink`; secondary text is `muted`. Do not use all five colours in every post, and do not introduce another dominant colour. Build a light and a dark version of every layout by swapping `surface` and `on-surface`.
- **Type.** Space Grotesk for display, headlines and running text (`display-xl` to `caption`); IBM Plex Mono for IDs, labels, timestamps, coordinates and annotations (`label`, `meta`, `data`). Display type is tight (−.03 to −.045em), mono labels are open (+.08em). Never set a paragraph in mono. Minimums on a 1080 px canvas: body 28, caption 24, label 22, metadata 20.
- **Layout.** Modular grid, asymmetric but balanced. Margin `margin-post` (72 px), 6 columns with a `gutter` of 24 px, bands for header (y 72) and footer (y 1222). One dominant element per slide, generous negative space, and one deliberate break of the grid.
- **Borders.** Outlines in `rule` at `stroke-line` (3 px); dividers at `stroke-hair` (2 px); the pixel frame at `stroke-heavy`. Corners are square (`radius-none`); only tags are pills (`radius-pill`) and pins, step numbers and status discs are round (`radius-round`).
- **Depth.** Flat. No shadows, no gradients, no glow. Depth comes from the halftone fade, paper grain and overlapping blocks.
- **Texture.** Paper grain on light slides (`grain-opacity`), halftone on image frames and large panels (`halftone-opacity`, `halftone-pitch`), dot grid for diagrams (`dot-pitch`), technical grid at `grid-pitch`. Textures are quiet and never sit under body text.
- **Imagery.** Real hardware photography (bench, breadboard, printed parts), pixel art, and technical diagrams drawn from this system's graphic language. No stock, no generated robot imagery, no 3D renders of XUNA.
- **Motion (video covers).** Cuts and 8-frame pixel steps, never easing blurs or glitch effects.
- **Avoid.** Generic cyberpunk, neon, heavy gradients, glitch, sci-fi HUDs, overly dark compositions, gaming graphics, excessive pixelation, clutter and unexplained decoration.

## Iconography and logo

- There is no logo mark yet. Set the name `ATELIER MACHINE` as the wordmark: Space Grotesk 700, upper-case, +.14em. Do not draw or invent a mark; add the real one to `assets/` when it exists.
- There is no icon set. Use the twelve geometric symbols and the numbered pins from Graphic Language; each has one fixed meaning. No emoji, no glyph icons.

## XUNA

- XUNA is an existing orange pixel-art character. Use the supplied reference art at exact pixel multiples with nearest-neighbour scaling inside `CharacterFrame`. Never redraw, recolour, smooth or re-proportion it, and never turn it into a robot, animal or 3D character.
- Until the reference art is supplied, every XUNA slot keeps the labelled placeholder (`XUNA reference art pending`). Do not invent a canonical design.

## Using this system

- Start from a template family (`TemplateProjectReveal`, `TemplateBuildLog`, `TemplateTechExplainer`), assemble slides from the components, and keep the header and footer on every slide.
- Formats, grids and safe areas are in *Social formats*; graphic elements in *Graphic language*; the six template families in *Templates*; do and don't rules in *Usage guidelines*.
- Sample copy in the previews is illustrative. Replace it with the studio's real names, parts, numbers and photographs.
