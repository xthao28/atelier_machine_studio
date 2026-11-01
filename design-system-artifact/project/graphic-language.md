# Graphic language

A reusable library of retro-futuristic elements. Each has a defined purpose; if an element has no job on a slide, remove it.

## The fifteen elements

1. **Technical grid overlay** (`Textures`, `Registration`): 72 px module in `grid-line`; shows the structure of a slide.
2. **Crosshair marker** (`Registration`): marks a corner or a point; four sizes.
3. **Coordinate label** (`Registration`): `X 12.40 · Y 08.75` in `meta`; locates an object.
4. **Circular targeting element** (`Registration`): rings and 30° ticks; isolates one subject.
5. **Retro computer interface frame** (`Frames`): window with title bar for code and screens.
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

## Rules

- Draw everything in `rule` colour or one accent fill; never recolour a symbol to match the slide.
- At most one targeting element, four annotations and two textures per slide.
- Graphics frame content; they never replace it. Keep body text on a clean area.
- Draw new elements from the same primitives: 3 px lines, squares, discs, plus marks and 8 px steps.
