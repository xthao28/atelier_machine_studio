/**
 * Template 01 Project Reveal adapted to 9:16 (1080 × 1920): cover, hard cut, Concept slide on `lilac`.
 * Every word sits inside the safe box x 72–920, y 250–1470. Motion: cuts and 8-frame pixel steps only.
 */
import { Sequence, useCurrentFrame } from "remotion";
import {
  Abs,
  BrandFooter,
  BrandHeader,
  CategoryTag,
  CharacterFrame,
  CoordinateLabel,
  Crosshair,
  Cut,
  DashedOrbit,
  formats,
  MetadataBlock,
  PixelSprite,
  PixelWipe,
  ProjectNumberBlock,
  SectionHeading,
  Slide,
  spriteFrame,
  StatusIndicator,
  SvgLabel,
  SvgLayer,
  XUNA_SPRITE,
} from "../design-system";

export const PROJECT_REVEAL_SCENE = 150;

const { safe } = formats["9:16"];

const FRAME = { left: 500, top: 600, size: 400 };
const frameCenter = { x: FRAME.left + FRAME.size / 2, y: FRAME.top + FRAME.size / 2 };

const Cover = () => {
  const frame = useCurrentFrame();
  const f = FRAME;
  return (
    <Slide format="9:16" grid grain>
      <BrandHeader context="PRJ—001 · Artificial life" />

      <PixelWipe at={6} className="am-abs am-xl" style={{ left: 66, top: 340 }}>
        XUNA
      </PixelWipe>

      <Cut at={18}>
        <Abs left={safe.left} top={575} width={400} className="am-h2">
          An evolving
          <br />
          AI pixel pet
        </Abs>
      </Cut>

      <PixelWipe at={24} direction="down" className="am-abs" style={{ left: f.left, top: f.top }}>
        <CharacterFrame size={f.size}>
          <PixelSprite sheet={XUNA_SPRITE} column={spriteFrame(frame, XUNA_SPRITE.columns, 4, 24)} row={0} scale={3} />
        </CharacterFrame>
      </PixelWipe>

      <Cut at={40}>
        <SvgLayer format="9:16">
          <DashedOrbit cx={frameCenter.x} cy={frameCenter.y} r={230} />
          <Crosshair x={f.left - 20} y={f.top - 20} />
          <Crosshair x={f.left + f.size + 20} y={f.top - 20} />
          <Crosshair x={f.left - 20} y={f.top + f.size + 20} />
          <Crosshair x={f.left + f.size + 20} y={f.top + f.size + 20} />
          <CoordinateLabel x={f.left + 20} y={f.top - 36}>
            X 12.40 · Y 08.75
          </CoordinateLabel>
          <SvgLabel x={f.left + f.size} y={f.top + f.size + 66} small anchor="end">
            FIG. 001 — SPECIMEN
          </SvgLabel>
        </SvgLayer>
      </Cut>

      <PixelWipe at={52} className="am-abs" style={{ left: safe.left, top: 760, width: 380 }}>
        <ProjectNumberBlock number="001" style={{ height: 200 }} />
      </PixelWipe>

      <Cut at={64}>
        <Abs left={safe.left} top={1080} width={560} className="am-b">
          A small physical creature that senses light, learns from every encounter, and slowly becomes someone.
        </Abs>
      </Cut>

      <Abs left={safe.left} top={1300} width={848} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Cut at={76}>
          <CategoryTag fill="lilac">Artificial life</CategoryTag>
        </Cut>
        <Cut at={80}>
          <CategoryTag>Physical AI</CategoryTag>
        </Cut>
        <Cut at={84}>
          <CategoryTag>Pixel art</CategoryTag>
        </Cut>
      </Abs>

      <Cut at={90}>
        <BrandFooter />
      </Cut>
    </Slide>
  );
};

const META = [
  { k: "Class", v: "Artificial life · Physical AI" },
  { k: "Medium", v: "Hardware + pixel animation" },
  { k: "Built with", v: "ESP32-S3 · LILYGO T-Display-S3" },
  { k: "Status", v: <StatusIndicator status="test">In development</StatusIndicator> },
];

const Concept = () => (
  <Slide format="9:16" ground="lilac" grid grain>
    <BrandHeader context="PRJ—001 · Concept" />
    <Abs left={safe.left} top={formats["9:16"].sectionTop} width={848}>
      <SectionHeading index={1} title="Concept" context="What it is" />
    </Abs>
    <PixelWipe at={6} className="am-abs am-h1" style={{ left: safe.left, top: 470, width: 848 }}>
      A creature that grows from what it senses.
    </PixelWipe>
    <Cut at={20}>
      <Abs left={safe.left} top={800} width={720} className="am-bl">
        XUNA lives on a pixel display inside a small handmade device. It notices light and changes over time.
      </Abs>
    </Cut>
    <Abs left={safe.left} top={1040} width={848}>
      <MetadataBlock rows={META.map((r, i) => ({ ...r, v: <Cut at={32 + i * 4}>{r.v}</Cut> }))} />
    </Abs>
    <BrandFooter />
  </Slide>
);

export const AmProjectRevealVertical = () => (
  <>
    <Sequence durationInFrames={PROJECT_REVEAL_SCENE} layout="none">
      <Cover />
    </Sequence>
    <Sequence from={PROJECT_REVEAL_SCENE} durationInFrames={PROJECT_REVEAL_SCENE} layout="none">
      <Concept />
    </Sequence>
  </>
);
