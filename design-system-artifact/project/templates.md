# Templates

Six template families share one header, footer, grid and component set. This first release defines three; the others follow after review.

| Family | Purpose | Colour lead | Status |
| --- | --- | --- | --- |
| 01 Project Reveal | Introduce a new project | `paper` + `orange` frame, `lime` number | Designed |
| 02 Build Log | Document the making | `paper` + `lime` stage block, `lilac` code slide | Designed |
| 03 Tech Explainer | Explain a concept | `paper` + `lime` glyph, `lilac` comparison | Designed |
| 04 Experiment Report | Show an experiment | `paper` + `lime` status | Next |
| 05 Concept / Quote | Philosophy, one idea | `ink` and `paper`, light and dark | Next |
| 06 Pixel Life | XUNA personality and evolution | `lilac` or `orange` ground | Next, needs XUNA reference art |

## Rules that apply to every family

- Slide 1 is a cover with one dominant element. Inner slides open with a `SectionHeading`.
- Each post has one lead background colour plus at most one dark slide. Do not repeat the same composition on consecutive slides.
- Every slide carries `BrandHeader` and `BrandFooter`; page numbering counts the cover.
- Light and dark versions swap `surface` and `on-surface`; accent fields stay the same colour.
- Replace placeholders (photo, XUNA) with real material before publishing; never publish a placeholder.
