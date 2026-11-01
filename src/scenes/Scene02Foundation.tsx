/**
 * Scene 02 — M04 Hardware & Immortal Foundation (`LilygoExplodedMachine` in 9:16, 60fps).
 * Follows ATELIER MACHINE Design System rules:
 * - Safe zone x: 72–920 (width 848), y: 250–1470
 * - Headline <= 8 words (sentence case), body <= 25 words
 * - 60fps smooth spring-driven exploded view of the real LILYGO T-Display-S3 (62 × 26 mm).
 */
import React from "react";
import {
  Abs,
  BrandFooter,
  BrandHeader,
  CarouselNav,
  CategoryTag,
  Cut,
  ExperimentId,
  formats,
  PixelWipe,
  SectionHeading,
  Slide,
  TechnicalLabelRow,
} from "../design-system";
import {
  getLilygoTelemetry,
  LilygoExplodedMachine,
} from "../components/isometric/LilygoExplodedMachine";
import { useAnatomyClock } from "../hooks/useAnatomyClock";

export const SCENE02_DURATION = 300; // 5.0s at 60fps

const { safe, sectionTop } = formats["9:16"];
const safeWidth = safe.right - safe.left;

export const Scene02Foundation: React.FC<{ dark?: boolean }> = ({ dark = false }) => {
  const clock = useAnatomyClock({
    explodeStart: 28,
    collapseStart: 250,
    quantized: false,
  });

  const telemetry = getLilygoTelemetry(
    clock.explode,
    clock.gpio0Press,
    clock.gpio14Press,
    clock.activeSlot,
  );

  return (
    <Slide format="9:16" ground={dark ? "dark" : "paper"} grid grain>
      <BrandHeader context="PRJ—001 · Hardware anatomy" />

      <Abs left={safe.left} top={sectionTop} width={safeWidth}>
        <SectionHeading index={2} title="Anatomy" context="FIG—001 · LILYGO T-Display-S3" />
      </Abs>

      {/* Headline: 5 words, single line, sentence case */}
      <PixelWipe at={4} className="am-abs am-h2" style={{ left: safe.left, top: 418, width: 920 }}>
        Three layers keep XUNA alive
      </PixelWipe>

      {/* Body: 15 words, honest specifics with non-breaking spaces */}
      <Cut at={12}>
        <Abs left={safe.left} top={504} width={safeWidth} className="am-b">
          An ESP32-S3R8 runs deterministic C++11 while dual-bank NVS flash guards every memory with CRC32.
        </Abs>
      </Cut>

      {/* Isometric Exploded LILYGO T-Display-S3 (60fps spring-driven, precomputed static paths) */}
      <Abs left={safe.left - 12} top={596} width={safeWidth + 24} height={620}>
        <LilygoExplodedMachine
          explode={clock.explode}
          gpio0Press={clock.gpio0Press}
          gpio14Press={clock.gpio14Press}
          activeSlot={clock.activeSlot}
          showCallouts
        />
      </Abs>

      {/* Live Telemetry Row driven by the exact same model as the isometric rig */}
      <Cut at={18}>
        <Abs left={safe.left} top={1232} width={safeWidth}>
          <TechnicalLabelRow
            items={[
              { k: "MCU", v: "ESP32-S3R8 · 240\u00A0MHz" },
              { k: "NVS BANK", v: telemetry.activeBank },
              { k: "Z-LIFT", v: telemetry.explodeMm },
            ]}
          />
        </Abs>
      </Cut>

      {/* Identity row: ExperimentId + 1 filled tag + outline tags */}
      <Cut at={24}>
        <Abs
          left={safe.left}
          top={1324}
          width={safeWidth}
          style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
        >
          <ExperimentId prefix="FIG" number="001" />
          <CategoryTag fill="lime">Hardware</CategoryTag>
          <CategoryTag>ST7789V 320×170</CategoryTag>
          <CategoryTag>GPIO0 / GPIO14</CategoryTag>
        </Abs>
      </Cut>

      <Cut at={28}>
        <BrandFooter page={{ page: 2, total: 6 }} right={<CarouselNav label="Swipe" />} />
      </Cut>
    </Slide>
  );
};
