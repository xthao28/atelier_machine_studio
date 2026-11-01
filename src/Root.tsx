import "./styles/globals.css";
import { Audio, Composition, Series, staticFile, Still } from "remotion";
import { EP01_MANIFEST } from "../episodes/ep01-xuna-evolution.script";
import { AmComponentSheet, SHEET_HEIGHT, SHEET_WIDTH } from "./compositions/AmComponentSheet";
import { AmProjectRevealVertical, PROJECT_REVEAL_SCENE } from "./compositions/AmProjectRevealVertical";
import {
  REEL01_DURATION_FRAMES,
  Reel01TwinExperiment,
} from "./compositions/Reel01TwinExperiment";
import { SCENE01_DURATION, Scene01Hook } from "./scenes/Scene01Hook";
import { SCENE02_DURATION, Scene02Foundation } from "./scenes/Scene02Foundation";
import { formats, loadAmFonts } from "./design-system";

loadAmFonts();

const vertical = formats["9:16"];

const XunaEp01Preview = () => (
  <>
    <Audio src={staticFile(EP01_MANIFEST.bgmAsset)} volume={EP01_MANIFEST.bgmVolume} />
    <Series>
      <Series.Sequence durationInFrames={SCENE01_DURATION}>
        <Scene01Hook />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE02_DURATION}>
        <Scene02Foundation />
      </Series.Sequence>
    </Series>
  </>
);

export const RemotionRoot = () => (
  <>
    <Composition
      id="Reel01TwinExperimentVI"
      component={() => <Reel01TwinExperiment locale="vi" />}
      durationInFrames={REEL01_DURATION_FRAMES}
      fps={60}
      width={vertical.width}
      height={vertical.height}
    />
    <Composition
      id="Reel01TwinExperimentEN"
      component={() => <Reel01TwinExperiment locale="en" />}
      durationInFrames={REEL01_DURATION_FRAMES}
      fps={60}
      width={vertical.width}
      height={vertical.height}
    />
    <Composition
      id="XunaEp01Preview"
      component={XunaEp01Preview}
      durationInFrames={SCENE01_DURATION + SCENE02_DURATION}
      fps={60}
      width={vertical.width}
      height={vertical.height}
    />
    <Composition
      id="Scene01Hook"
      component={Scene01Hook}
      durationInFrames={SCENE01_DURATION}
      fps={60}
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
    <Composition
      id="AmProjectRevealVertical"
      component={AmProjectRevealVertical}
      durationInFrames={PROJECT_REVEAL_SCENE * 2}
      fps={30}
      width={vertical.width}
      height={vertical.height}
    />
    <Still id="AmComponentSheet" component={AmComponentSheet} width={SHEET_WIDTH} height={SHEET_HEIGHT} />
  </>
);
