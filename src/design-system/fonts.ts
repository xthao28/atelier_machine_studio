import { continueRender, delayRender, staticFile } from "remotion";
import { fonts } from "./tokens";

let loading: Promise<void> | null = null;

/**
 * Loads every ATELIER MACHINE font from public/fonts/ and holds the render until they are ready,
 * so no frame is drawn with a fallback face. Safe to call more than once.
 */
export const loadAmFonts = () => {
  if (loading) return loading;
  const handle = delayRender("Loading ATELIER MACHINE fonts");
  loading = Promise.all(
    fonts.map(async (f) => {
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
