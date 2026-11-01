# Social formats

Design every post on a 1080 px wide canvas. All sizes below are canvas pixels.

## Instagram carousel · 4:5 · 1080 × 1350

- Use for project introductions, explainers, hardware breakdowns and development updates.
- Margin `margin-post` (72 px) on all sides; inner area 936 × 1206. 6 columns, column 136 px, `gutter` 24 px.
- Header band y 72–124 (`BrandHeader`), footer band y 1222–1278 (`BrandFooter`). Content lives between y 150 and y 1190.
- The profile grid crops 4:5 to 3:4: keep titles and key marks at least 34 px from the left and right edges.
- Slide 1 is the cover and carries the title; slides 2 to n−1 carry one idea each; the last slide is the call to action.

## Instagram Reels and TikTok · 9:16 · 1080 × 1920

- Use for video covers, project demonstrations, build process, experiment videos and short-form stories.
- Conservative safe box: x 72–920, y 250–1470 (`safe-top-vertical` 250, `safe-bottom-vertical` 450, `safe-right-vertical` 160). 4 columns, `gutter` 24 px.
- Keep every word and key visual inside the safe box. Backgrounds, textures and blocks may bleed to the edges.
- Covers are cropped to 3:4 on profile grids: keep the title between y 240 and y 1680, preferably inside the safe box.
- Header sits at y 270, footer at y 1400 inside the safe box. No page numbering on covers.

## Square · 1:1 · 1080 × 1080

- Use for announcements, profile-related graphics and compact assets.
- Margin 72 px; 6 columns as 4:5. Header y 72, footer y 952.
- One idea per square: a title and one image, or a quote.

## Spacing scale

- `space-1` 8 · `space-2` 16 · `space-3` 24 · `space-4` 32 · `space-5` 48 · `space-6` 72 · `space-7` 96. Every gap, padding and offset is one of these values.
- Align to the 72 px technical grid; text baselines to 8 px.

## Alignment

- Left-align headlines, body text and annotations. Centre only a single short line (a quote attribution, a coordinate under a target).
- Numbers and mono values align to the left edge of their column; right-align only counters and right-hand context labels in the header and footer.
