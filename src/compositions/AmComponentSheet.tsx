/**
 * Every design-system component in light and dark, side by side, for visual QA against the
 * artifact previews (design-system-artifact/project/components/<Name>/preview.html).
 * Sample copy is illustrative.
 */
import type { ReactNode } from "react";
import {
  AmScope,
  AmSymbol,
  AnnotationLine,
  Arrow,
  BrandFooter,
  BrandHeader,
  CarouselNav,
  CategoryTag,
  CharacterFrame,
  CodeComment,
  CodeFrame,
  CodeKeyword,
  CodeNumber,
  ComputerFrame,
  Crosshair,
  DimensionLine,
  ExperimentId,
  ImageFrame,
  InfoPanel,
  MetadataBlock,
  NumberedPin,
  NumberedSteps,
  ObjectClass,
  PixelSprite,
  ProgressIndicator,
  ProjectNumber,
  QuoteBlock,
  QuoteHighlight,
  SectionHeading,
  StatusIndicator,
  SvgLabel,
  SYMBOL_MEANING,
  TargetRing,
  TechnicalAnnotation,
  TechnicalLabelRow,
  Texture,
  type Ground,
  type SymbolKind,
} from "../design-system";

export const SHEET_WIDTH = 2160;
export const SHEET_HEIGHT = 4900;

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    <div className="am-meta">{title}</div>
    {children}
  </div>
);

const Row = ({ children, gap = 16 }: { children: ReactNode; gap?: number }) => (
  <div style={{ display: "flex", gap, flexWrap: "wrap", alignItems: "center" }}>{children}</div>
);

const Column = ({ ground }: { ground: Ground }) => {
  const dark = ground === "dark";
  return (
    <AmScope ground={ground} style={{ width: 1080, minHeight: SHEET_HEIGHT, padding: 72, display: "flex", flexDirection: "column", gap: 56 }}>
      <Section title="BrandHeader · BrandFooter · PageNumbering · CarouselNav">
        <div style={{ position: "relative", height: 240 }}>
          <BrandHeader context="PRJ—001 · Artificial life" place={{ left: 0, top: 0, width: 936 }} />
          <BrandFooter page={{ page: 2, total: 5 }} right={<CarouselNav label="Swipe" />} place={{ left: 0, top: 100, width: 936 }} />
          <div style={{ position: "absolute", left: 0, top: 200 }}>
            <CarouselNav dots={{ count: 4, active: 0 }} />
          </div>
        </div>
      </Section>

      <Section title="SectionHeading">
        <SectionHeading index={2} title="Anatomy" context="Four parts, one creature" />
      </Section>

      <Section title="CategoryTag · ExperimentId · ProjectNumber · ObjectClass">
        <Row>
          <CategoryTag>Physical AI</CategoryTag>
          <CategoryTag fill="lilac">Artificial life</CategoryTag>
          <CategoryTag fill="lime">Firmware</CategoryTag>
          <CategoryTag fill="orange">Pixel art</CategoryTag>
          <CategoryTag fill="ink">Hardware</CategoryTag>
        </Row>
        <Row>
          <ExperimentId prefix="EXP" number={14} />
          <ExperimentId prefix="LOG" number={7} />
          <ExperimentId prefix="FIG" number="01—A" />
          <ExperimentId prefix="EXP" number={14} revision="REV 2" />
        </Row>
        <Row gap={32}>
          <ProjectNumber number="001" />
          <ProjectNumber number="002" />
          <ProjectNumber number="003" future />
          <ObjectClass value="A—3 · Artificial life" />
        </Row>
      </Section>

      <Section title="TechnicalLabel · StatusIndicator">
        <TechnicalLabelRow
          items={[
            { k: "Board", v: "ESP32-S3" },
            { k: "Sensor", v: "LDR + 10 kΩ" },
            { k: "Firmware", v: "v0.4.2" },
            { k: "Supply", v: "3.3 V" },
          ]}
        />
        <Row gap={32}>
          <StatusIndicator status="live">Live</StatusIndicator>
          <StatusIndicator status="test">Testing</StatusIndicator>
          <StatusIndicator status="done">Done</StatusIndicator>
          <StatusIndicator status="idle">Next</StatusIndicator>
        </Row>
      </Section>

      <Section title="NumberedStep · ProgressIndicator">
        <Row gap={64}>
          <NumberedSteps
            steps={[
              { title: "Sense", description: "Light becomes a signal." },
              { title: "Think", description: "Code decides what to do." },
              { title: "Act", description: "Pixels change." },
            ]}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <ProgressIndicator label="Stage 4 of 6" total={6} done={3} style={{ width: 420 }} />
            <ProgressIndicator label="Complete" total={4} done={4} style={{ width: 420 }} />
          </div>
        </Row>
      </Section>

      <Section title="MetadataBlock">
        <MetadataBlock
          style={{ width: 820 }}
          rows={[
            { k: "Class", v: "Artificial life · Physical AI" },
            { k: "Medium", v: "Hardware + pixel animation" },
            { k: "Status", v: <StatusIndicator status="test">In development</StatusIndicator> },
          ]}
        />
      </Section>

      <Section title="QuoteBlock">
        <QuoteBlock by="Atelier Machine" style={{ width: 760 }}>
          Making Machines
          <br />
          <QuoteHighlight on={dark ? "dark" : "light"}>Feel Alive.</QuoteHighlight>
        </QuoteBlock>
      </Section>

      <Section title="CharacterFrame (placeholder · XUNA sprite) · ImageFrame">
        <Row gap={32}>
          <CharacterFrame size={300} />
          <CharacterFrame size={300}>
            <PixelSprite column={0} row={0} scale={2} />
          </CharacterFrame>
        </Row>
        <ImageFrame width={560} height={300} placeholder={<>Photo: ESP32<br />on breadboard</>} figure="FIG. 07-A" view="Top view" />
      </Section>

      <Section title="Frames: CodeFrame · ComputerFrame · InfoPanel">
        <CodeFrame>
          <CodeComment>{"// LDR on GPIO 1, 10 kΩ divider"}</CodeComment>
          {"\n"}
          <CodeKeyword>int</CodeKeyword> light = analogRead(<CodeNumber>1</CodeNumber>);{"\n"}
          <CodeKeyword>if</CodeKeyword> (light {">"} <CodeNumber>2800</CodeNumber>) mood = CURIOUS;
        </CodeFrame>
        <Row gap={32}>
          <ComputerFrame title="XUNA.EXE — Running" width={440} height={260}>
            {"> Light 0.82"}
            <br />
            {"> Mood  curious"}
          </ComputerFrame>
          <InfoPanel
            width={440}
            rows={[
              { k: "Obj. class", v: "A—3" },
              { k: "Medium", v: "Pixel + HW" },
              { k: "Status", v: "Testing" },
              { k: "Serial", v: "AM—0001" },
            ]}
          />
        </Row>
      </Section>

      <Section title="TechnicalAnnotation · Annotations · Registration">
        <Row gap={48}>
          <TechnicalAnnotation>ESP32-S3</TechnicalAnnotation>
          <TechnicalAnnotation end="square">Light sensor</TechnicalAnnotation>
          <TechnicalAnnotation dashed>Optional part</TechnicalAnnotation>
        </Row>
        <svg width={936} height={420} viewBox="0 0 936 420" fill="none" style={{ color: "var(--fg)", display: "block" }}>
          <AnnotationLine points={[[30, 40], [180, 40]]} label="ESP32-S3" />
          <AnnotationLine points={[[30, 100], [180, 100]]} end="square" label="Light sensor" />
          <AnnotationLine points={[[30, 160], [180, 160]]} end="arrow" label="Pixel display" />
          <Arrow from={[30, 230]} to={[150, 230]} />
          <Arrow from={[190, 260]} to={[280, 200]} />
          <Arrow from={[30, 300]} to={[160, 300]} weight={6} />
          <Arrow from={[200, 300]} to={[400, 300]} dashed />
          <DimensionLine from={[30, 390]} to={[400, 390]} label="936 PX" />
          <NumberedPin cx={500} cy={60} label="1" />
          <NumberedPin cx={500} cy={130} label="A" />
          <Crosshair x={500} y={230} size="S" />
          <Crosshair x={560} y={230} size="M" />
          <Crosshair x={640} y={230} size="L" />
          <SvgLabel x={480} y={330} small>
            X 12.40 · Y 08.75
          </SvgLabel>
          <TargetRing cx={800} cy={210} r={90} />
        </svg>
      </Section>

      <Section title="Symbols">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
          {(Object.keys(SYMBOL_MEANING) as SymbolKind[]).map((kind) => (
            <div key={kind} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <AmSymbol kind={kind} />
              <div className="am-meta">{kind}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Textures: halftone · dots · hatch · grid">
        <Row>
          {(["halftone", "dots", "hatch"] as const).map((kind) => (
            <div key={kind} style={{ position: "relative", width: 200, height: 160, border: "3px solid var(--fg)", overflow: "hidden" }}>
              <Texture kind={kind} style={kind === "hatch" ? { opacity: 0.5 } : undefined} />
            </div>
          ))}
          <div style={{ position: "relative", width: 200, height: 160, border: "3px solid var(--fg)", overflow: "hidden" }}>
            <div className="am-gridbg" />
          </div>
        </Row>
      </Section>
    </AmScope>
  );
};

export const AmComponentSheet = () => (
  <div style={{ display: "flex", width: SHEET_WIDTH, height: SHEET_HEIGHT }}>
    <Column ground="paper" />
    <Column ground="dark" />
  </div>
);
