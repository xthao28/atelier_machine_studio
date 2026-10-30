import "./styles/globals.css";
import { Composition, Still } from "remotion";
import { AmComponentSheet, SHEET_HEIGHT, SHEET_WIDTH } from "./compositions/AmComponentSheet";
import { AmProjectRevealVertical, PROJECT_REVEAL_SCENE } from "./compositions/AmProjectRevealVertical";
import { SCENE02_DURATION, Scene02Foundation } from "./scenes/Scene02Foundation";
import { formats, loadAmFonts } from "./design-system";

loadAmFonts();

const vertical = formats["9:16"];

export const RemotionRoot = () => (
  <>
    <Composition
      id="AmProjectRevealVertical"
      component={AmProjectRevealVertical}
      durationInFrames={PROJECT_REVEAL_SCENE * 2}
      fps={30}
      width={vertical.width}
      height={vertical.height}
    />
    <Composition
      id="Scene02Foundation"
      component={Scene02Foundation}
      durationInFrames={SCENE02_DURATION}
      fps={60}
      width={vertical.width}
      height={vertical.height}
    />
    <Composition
      id="Scene02FoundationDark"
      component={() => <Scene02Foundation dark />}
      durationInFrames={SCENE02_DURATION}
      fps={60}
      width={vertical.width}
      height={vertical.height}
    />
    <Still id="AmComponentSheet" component={AmComponentSheet} width={SHEET_WIDTH} height={SHEET_HEIGHT} />
  </>
);
