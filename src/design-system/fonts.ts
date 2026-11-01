import { continueRender, delayRender, staticFile } from "remotion";
import { fonts } from "./tokens";

let loading: Promise<void> | null = null;

const VIETNAMESE_FONTS = [
  { family: "Be Vietnam Pro", weight: "500", style: "normal", file: "fonts/BeVietnamPro-Medium.ttf" },
  { family: "Be Vietnam Pro", weight: "600", style: "normal", file: "fonts/BeVietnamPro-SemiBold.ttf" },
  { family: "Be Vietnam Pro", weight: "700", style: "normal", file: "fonts/BeVietnamPro-Bold.ttf" },
] as const;

/**
 * Loads every ATELIER MACHINE font + Vietnamese caption faces from public/fonts/
 * and holds the render until they are ready, so no frame is drawn with a fallback face.
 */
export const loadAmFonts = () => {
  if (loading) return loading;
  const handle = delayRender("Loading ATELIER MACHINE fonts");
  const allFonts = [...fonts, ...VIETNAMESE_FONTS];
  loading = Promise.all(
    allFonts.map(async (f) => {
      const face = new FontFace(f.family, `url("${staticFile(f.file)}") format("truetype")`, {
        weight: f.weight,
        style: f.style,
      });
      document.fonts.add(await face.load());
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
  return loading;
};
