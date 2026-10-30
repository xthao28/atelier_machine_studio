import React from "react";
import * as k from "./kit/iso-kit";
import {
  AM_ISO_CSS,
  Dots,
  FaceText,
  Line,
  Solid,
  Wire,
} from "./kit/draw";
import { useAnatomyClock } from "../../hooks/useAnatomyClock";

export interface LilygoExplodedMachineProps {
  /** Override explode progress [0..1]. If omitted, driven by 60fps `useAnatomyClock()`. */
  explode?: number;
  /** Override GPIO0 (BOOT / Praise +) button press [0..1]. */
  gpio0Press?: number;
  /** Override GPIO14 (KEY / Scold -) button press [0..1]. */
  gpio14Press?: number;
  /** Override active NVS bank (0 = life0 Slot A, 1 = life1 Slot B). */
  activeSlot?: 0 | 1;
  /** SVG viewBox width (default 840). */
  width?: number;
  /** SVG viewBox height (default 620). */
  height?: number;
  /** Show isometric assembly stage callouts on the right rail. */
  showCallouts?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface LilygoTelemetry {
  explodeMm: string;
  activeBank: "LIFE0 (A)" | "LIFE1 (B)";
  crcStatus: "CRC32 OK";
  gpio0State: "PRESSED (+)" | "IDLE (HI)";
  gpio14State: "PRESSED (-)" | "IDLE (HI)";
  powerRail: "GPIO15=HI · 3.3V";
  busSpeed: "i8080 8-BIT · 40MHz";
}

export function getLilygoTelemetry(
  explode: number,
  gpio0Press: number,
  gpio14Press: number,
  activeSlot: 0 | 1,
): LilygoTelemetry {
  return {
    explodeMm: `${(explode * 36.0).toFixed(1)}\u00A0mm`,
    activeBank: activeSlot === 0 ? "LIFE0 (A)" : "LIFE1 (B)",
    crcStatus: "CRC32 OK",
    gpio0State: gpio0Press > 0.25 ? "PRESSED (+)" : "IDLE (HI)",
    gpio14State: gpio14Press > 0.25 ? "PRESSED (-)" : "IDLE (HI)",
    powerRail: "GPIO15=HI · 3.3V",
    busSpeed: "i8080 8-BIT · 40MHz",
  };
}

// ===========================================================================
// Precomputed Static World Geometry (2.4 world units = 1 mm of real hardware)
// Official LILYGO T-Display-S3 PCB: 62.0 mm × 26.0 mm → 148 × 62 world units
// Built ONCE at module load so per-frame rendering uses pure SVG transforms!
// ===========================================================================
const VIEW_W = 840;
const VIEW_H = 620;

const SHELL_PLAN: k.Plan = { x: -77, y: -33, w: 154, d: 66, r: 5.5 };
const SHELL_CAVITY: k.Plan = { x: -72, y: -28.5, w: 144, d: 57, r: 4 };
const SHELL_H = 11;

const PCB_PLAN: k.Plan = { x: -74, y: -31, w: 148, d: 62, r: 4.5 };
const PCB_H = 4.2;

// Real T-Display-S3 layout:
// The 1.9" ST7789V IPS glass display sits on the left/center of the PCB (x = -69..+47),
// leaving the right-hand chin (x = +48..+74) exposed for the USB-C port and
// the two iconic white round tactile buttons: BOOT (GPIO0) & KEY (GPIO14)!
const LCD_GLASS_PLAN: k.Plan = { x: -69, y: -28.5, w: 116, d: 57, r: 3.2 };
const LCD_ACTIVE_PLAN: k.Plan = { x: -57, y: -24.5, w: 98, d: 49, r: 1.8 };
const LCD_H = 4.6;

// 4 corner M2 mounting holes on the LILYGO T-Display-S3 PCB
const M2_HOLES: [number, number][] = [
  [-68.5, -25.5], // back-left
  [68.5, -25.5],  // back-right
  [-68.5, 25.5],  // front-left
  [68.5, 25.5],   // front-right
];

// 2 × 12 (24-pin) 2.54mm (6.1 wu pitch) gold header pads along top & bottom edges
const HEADER_XS = Array.from({ length: 12 }, (_, i) => -33.55 + i * 6.1);
const TOP_HEADER_PINS: [number, number][] = HEADER_XS.map((x) => [x, -27.8]);
const BOT_HEADER_PINS: [number, number][] = HEADER_XS.map((x) => [x, 27.8]);

// Rest Z levels when assembled into one compact LILYGO T-Display-S3 unit
const TIER1_Z0 = 0;
const TIER2_Z0 = SHELL_H + 1.5; // PCB rests right on the shell standoffs
const TIER3_Z0 = TIER2_Z0 + PCB_H + 1.2; // IPS screen rests right on the PCB

// Explode travel distances along +Z
const TIER1_DROP = -18; // Bottom shell drops down
const TIER2_LIFT = 22;  // Main PCB rises to center
const TIER3_LIFT = 76;  // IPS LCD screen lifts above PCB

const BASE_P = k.fitProjection(
  [
    ...k.boxCorners(SHELL_PLAN, TIER1_DROP - 6, 0),
    ...k.boxCorners(SHELL_PLAN, 0, TIER3_Z0 + LCD_H + TIER3_LIFT + 8),
  ],
  VIEW_W,
  VIEW_H,
  { pad: 26, azimuth: 37, elevation: 32 },
);

const P: k.Projection = {
  ...BASE_P,
  origin: [BASE_P.origin[0] - 92, BASE_P.origin[1] + 8],
};

const at = (pt: k.Point3) => k.iso(pt, P);
const sortByDepth = <T,>(items: T[], getPoint: (item: T) => k.Point3): T[] =>
  [...items].sort((a, b) => k.depthOf(getPoint(a), P) - k.depthOf(getPoint(b), P));

// ---------------------------------------------------------------------------
// Precompute Layer 01 (Bottom Enclosure Shell + Dual-Bank NVS + Li-Po + Qwiic)
// Built at local z = TIER1_Z0
// ---------------------------------------------------------------------------
const T1_FLOOR_Z = TIER1_Z0 + SHELL_H;
const BANK_A_PLAN: k.Plan = { x: -64, y: -21, w: 42, d: 42, r: 2 };
const BANK_B_PLAN: k.Plan = { x: -16, y: -21, w: 42, d: 42, r: 2 };
const CRC_PLAN: k.Plan = { x: 32, y: -21, w: 20, d: 24, r: 1.5 };
const JST_BAT_PLAN: k.Plan = { x: 32, y: 7, w: 18, d: 15, r: 1.2 };
const QWIIC_PLAN: k.Plan = { x: 54, y: -12, w: 14, d: 24, r: 1.2 };

const T1_GEO = {
  shellOuter: k.slabOf(SHELL_PLAN, TIER1_Z0, SHELL_H, P, 6, 1.2),
  shellSeam: k.sideSeam(SHELL_PLAN, TIER1_Z0 + SHELL_H * 0.45, P, 6),
  shellFloor: k.slabOf(SHELL_CAVITY, T1_FLOOR_Z - 0.8, 0.8, P, 4),
  shellRim: k.planOutline(SHELL_CAVITY, T1_FLOOR_Z, P, 4),
  standoffs: sortByDepth(M2_HOLES, ([x, y]) => [x, y, T1_FLOOR_Z]).map(([x, y]) => ({
    outer: k.cylinder(x, y, 3.4, T1_FLOOR_Z, 2.2, P, 20),
    bore: at([x, y, T1_FLOOR_Z + 2.2]),
  })),
  bankA: k.slabOf(BANK_A_PLAN, T1_FLOOR_Z, 3.8, P, 4, 0.5),
  bankAInset: k.planOutline(k.insetPlan(BANK_A_PLAN, 2.2), T1_FLOOR_Z + 3.8, P, 3),
  bankADots: k.dotGrid(BANK_A_PLAN.x + 5, BANK_A_PLAN.y + 5, 5, 5, 6.8, T1_FLOOR_Z + 3.8, P),
  bankATextMat: k.topMatrix([BANK_A_PLAN.x + 4, BANK_A_PLAN.y + 36], T1_FLOOR_Z + 3.9, P, "x"),

  bankB: k.slabOf(BANK_B_PLAN, T1_FLOOR_Z, 3.8, P, 4, 0.5),
  bankBInset: k.planOutline(k.insetPlan(BANK_B_PLAN, 2.2), T1_FLOOR_Z + 3.8, P, 3),
  bankBDots: k.dotGrid(BANK_B_PLAN.x + 5, BANK_B_PLAN.y + 5, 5, 5, 6.8, T1_FLOOR_Z + 3.8, P),
  bankBTextMat: k.topMatrix([BANK_B_PLAN.x + 4, BANK_B_PLAN.y + 36], T1_FLOOR_Z + 3.9, P, "x"),

  crcBlock: k.slabOf(CRC_PLAN, T1_FLOOR_Z, 4.6, P, 3, 0.5),
  crcInset: k.planOutline(k.insetPlan(CRC_PLAN, 1.8), T1_FLOOR_Z + 4.6, P, 3),
  crcTextMat: k.topMatrix([CRC_PLAN.x + 2.5, CRC_PLAN.y + 14], T1_FLOOR_Z + 4.7, P, "x"),

  jstBat: k.slabOf(JST_BAT_PLAN, T1_FLOOR_Z, 5.2, P, 2, 0.4),
  jstPins: [
    at([JST_BAT_PLAN.x + 6, JST_BAT_PLAN.y + 7.5, T1_FLOOR_Z + 5.2]),
    at([JST_BAT_PLAN.x + 12, JST_BAT_PLAN.y + 7.5, T1_FLOOR_Z + 5.2]),
  ],
  qwiicPort: k.slabOf(QWIIC_PLAN, T1_FLOOR_Z, 4.4, P, 2, 0.4),
  qwiicPins: [0, 1, 2, 3].map((i) =>
    at([QWIIC_PLAN.x + 7, QWIIC_PLAN.y + 4.5 + i * 5, T1_FLOOR_Z + 4.4]),
  ),
  wireAB: [
    at([BANK_A_PLAN.x + BANK_A_PLAN.w, 0, T1_FLOOR_Z + 2.0]),
    at([BANK_B_PLAN.x, 0, T1_FLOOR_Z + 2.0]),
  ] as [k.Flat, k.Flat],
  wireBCrc: [
    at([BANK_B_PLAN.x + BANK_B_PLAN.w, -8, T1_FLOOR_Z + 2.0]),
    at([CRC_PLAN.x, -8, T1_FLOOR_Z + 2.0]),
  ] as [k.Flat, k.Flat],
  rulerTicks: k.sideTicks(-64, 64, 4.8, 5, SHELL_PLAN.y + SHELL_PLAN.d, TIER1_Z0 + SHELL_H - 1.5, [2.0, 3.8], P, "x"),
};

// ---------------------------------------------------------------------------
// Precompute Layer 02 (Real LILYGO T-Display-S3 Main PCB, 62 × 26 mm)
// Built at local z = TIER2_Z0
// ---------------------------------------------------------------------------
const T2_TOP_Z = TIER2_Z0 + PCB_H;
const MCU_CAN_PLAN: k.Plan = { x: -42, y: -18, w: 46, d: 36, r: 2.2 };
const MCU_DIE_PLAN: k.Plan = { x: -34, y: -12, w: 30, d: 24, r: 1.4 };
const FPC_CONN_PLAN: k.Plan = { x: 12, y: -16, w: 10, d: 32, r: 1 };
const IO15_CHIP_PLAN: k.Plan = { x: 28, y: -16, w: 13, d: 13, r: 1 };
const CHG_CHIP_PLAN: k.Plan = { x: 28, y: 3, w: 13, d: 13, r: 1 };
const RST_SW_PLAN: k.Plan = { x: 38, y: 22, w: 9, d: 8, r: 0.8 };

// Right-hand exposed chin of the T-Display-S3:
// USB Type-C port in center (y = -10.5..+10.5), flanked by BOOT (GPIO0) & KEY (GPIO14)
const USB_C_PLAN: k.Plan = { x: 54, y: -10.5, w: 23, d: 21, r: 3.2 };
const BTN_GPIO0_BASE: k.Plan = { x: 54, y: -23.5, w: 11, d: 10, r: 1.4 };
const BTN_GPIO14_BASE: k.Plan = { x: 54, y: 13.5, w: 11, d: 10, r: 1.4 };

const T2_GEO = {
  pcbSlab: k.slabOf(PCB_PLAN, TIER2_Z0, PCB_H, P, 5, 0.6),
  pcbSeam: k.sideSeam(PCB_PLAN, TIER2_Z0 + PCB_H * 0.5, P, 5),
  pcbInset: k.planOutline(k.insetPlan(PCB_PLAN, 1.6), T2_TOP_Z, P, 5),
  // Silkscreen divider line where the 1.9" LCD ends (x = +48) leaving the right button bay
  chinDivider: k.lineOnTop([48, -29], [48, 29], T2_TOP_Z + 0.08, P),

  // 4 corner M2 gold mounting rings
  m2Rings: M2_HOLES.map(([x, y]) => k.ring(x, y, 2.8, T2_TOP_Z + 0.08, P, 20)).join(""),
  m2Holes: M2_HOLES.map(([x, y]) => at([x, y, T2_TOP_Z + 0.08])),

  // 2 × 12 (24) gold through-hole header pads along top & bottom long edges
  topHeaderRings: TOP_HEADER_PINS.map(([x, y]) => k.ring(x, y, 1.9, T2_TOP_Z + 0.08, P, 14)).join(""),
  topHeaderDots: TOP_HEADER_PINS.map(([x, y]) => at([x, y, T2_TOP_Z + 0.08])),
  botHeaderRings: BOT_HEADER_PINS.map(([x, y]) => k.ring(x, y, 1.9, T2_TOP_Z + 0.08, P, 14)).join(""),
  botHeaderDots: BOT_HEADER_PINS.map(([x, y]) => at([x, y, T2_TOP_Z + 0.08])),

  // Left-end 2.4 GHz BLE 5 / Wi-Fi Meander PCB Trace Antenna (x = -71..-45)
  antennaKeepout: k.slabOf({ x: -71.5, y: -21, w: 26, d: 42, r: 2 }, T2_TOP_Z, 0.35, P, 3),
  antennaTrace: k.onTop(
    [
      [-45, -16],
      [-68, -16],
      [-68, -9],
      [-51, -9],
      [-51, -2],
      [-68, -2],
      [-68, 5],
      [-51, 5],
      [-51, 12],
      [-68, 12],
      [-68, 18],
      [-45, 18],
    ],
    T2_TOP_Z + 0.4,
    P,
    false,
  ),
  antennaFeeds: [at([-45, -16, T2_TOP_Z + 0.4]), at([-45, 18, T2_TOP_Z + 0.4])],

  // ESP32-S3R8 RF Shield Can + Dual-Core LX7 LifeCore Die
  mcuCan: k.slabOf(MCU_CAN_PLAN, T2_TOP_Z, 4.6, P, 4, 0.6),
  mcuDie: k.slabOf(MCU_DIE_PLAN, T2_TOP_Z + 4.6, 1.2, P, 3, 0.3),
  mcuInset: k.planOutline(k.insetPlan(MCU_CAN_PLAN, 2.0), T2_TOP_Z + 4.6, P, 3),
  mcuTitleMat: k.topMatrix([MCU_DIE_PLAN.x + 2.5, MCU_DIE_PLAN.y + 9.5], T2_TOP_Z + 5.9, P, "x"),
  mcuSubMat: k.topMatrix([MCU_DIE_PLAN.x + 2.5, MCU_DIE_PLAN.y + 17.5], T2_TOP_Z + 5.9, P, "x"),

  // 8-Bit Parallel i8080 Display Bus Traces (GPIO39–48, WR, DC, CS, RST, BL)
  busTraces: [-12, -8, -4, 0, 4, 8, 12]
    .map((ty) => k.lineOnTop([MCU_CAN_PLAN.x + MCU_CAN_PLAN.w, ty], [FPC_CONN_PLAN.x, ty], T2_TOP_Z + 0.1, P))
    .join(""),
  fpcConn: k.slabOf(FPC_CONN_PLAN, T2_TOP_Z, 3.2, P, 2, 0.3),
  fpcPins: [-12, -8, -4, 0, 4, 8, 12].map((py) =>
    at([FPC_CONN_PLAN.x + 5, py, T2_TOP_Z + 3.2]),
  ),

  // GPIO15 Power Latch IC & Battery PMIC
  io15Chip: k.slabOf(IO15_CHIP_PLAN, T2_TOP_Z, 2.6, P, 2, 0.3),
  io15TextMat: k.topMatrix([IO15_CHIP_PLAN.x + 1.8, IO15_CHIP_PLAN.y + 8.5], T2_TOP_Z + 2.7, P, "x"),
  chgChip: k.slabOf(CHG_CHIP_PLAN, T2_TOP_Z, 2.6, P, 2, 0.3),

  // Side RST button
  rstBody: k.slabOf(RST_SW_PLAN, T2_TOP_Z, 2.8, P, 2, 0.3),
  rstPlunger: k.cylinder(RST_SW_PLAN.x + 4.5, RST_SW_PLAN.y + 8.5, 1.8, T2_TOP_Z + 1.0, 1.6, P, 14),

  // Right-edge USB Type-C Receptacle (protruding slightly past x = +74)
  usbShell: k.slabOf(USB_C_PLAN, T2_TOP_Z, 5.8, P, 5, 0.9),
  usbSeam: k.sideSeam(USB_C_PLAN, T2_TOP_Z + 2.9, P, 5),
  usbInset: k.planOutline(k.insetPlan(USB_C_PLAN, 2.2), T2_TOP_Z + 5.8, P, 4),
  usbTongue: k.slabOf({ x: USB_C_PLAN.x + 16, y: -6, w: 6.5, d: 12, r: 1 }, T2_TOP_Z + 2.2, 1.4, P, 2),
  usbTextMat: k.topMatrix([USB_C_PLAN.x + 3, USB_C_PLAN.y + 12.5], T2_TOP_Z + 5.9, P, "x"),

  // SMD Switch Housings for BOOT (GPIO0) & KEY (GPIO14) on the right PCB chin
  btn0Base: k.slabOf(BTN_GPIO0_BASE, T2_TOP_Z, 2.2, P, 3, 0.3),
  btn14Base: k.slabOf(BTN_GPIO14_BASE, T2_TOP_Z, 2.2, P, 3, 0.3),
  btn0LabelMat: k.topMatrix([BTN_GPIO0_BASE.x - 1, BTN_GPIO0_BASE.y - 2.2], T2_TOP_Z + 0.2, P, "x"),
  btn14LabelMat: k.topMatrix([BTN_GPIO14_BASE.x - 1, BTN_GPIO14_BASE.y + 13.8], T2_TOP_Z + 0.2, P, "x"),
};

// ---------------------------------------------------------------------------
// Precompute Layer 03 (1.9" ST7789V 320×170 IPS Glass Display + Left FPC Ribbon)
// Built at local z = TIER3_Z0
// ---------------------------------------------------------------------------
const T3_TOP_Z = TIER3_Z0 + LCD_H;
const FPC_RIBBON_PLAN: k.Plan = { x: -73.5, y: -14, w: 6.5, d: 28, r: 1.2 };

const T3_GEO = {
  // Amber/Orange FPC display ribbon folding around the left edge of the 1.9" screen
  fpcRibbon: k.slabOf(FPC_RIBBON_PLAN, TIER3_Z0 - 2.2, LCD_H + 1.8, P, 3, 0.4),
  // Black glass ST7789V bezel frame
  glassBezel: k.slabOf(LCD_GLASS_PLAN, TIER3_Z0, LCD_H, P, 4, 0.7),
  glassSeam: k.sideSeam(LCD_GLASS_PLAN, TIER3_Z0 + LCD_H * 0.5, P, 4),
  // Active 320×170 IPS display viewport (Orange XUNA artificial-life field)
  activeViewport: k.slabOf(LCD_ACTIVE_PLAN, T3_TOP_Z - 0.8, 0.9, P, 3, 0.2),
  activeBorder: k.planOutline(LCD_ACTIVE_PLAN, T3_TOP_Z + 0.12, P, 3),
  // Left glass bezel LILYGO silkscreen strip
  brandStripMat: k.topMatrix([LCD_GLASS_PLAN.x + 3.5, LCD_GLASS_PLAN.y + 49], T3_TOP_Z + 0.12, P, "y"),
  // Top-face projection matrix for the 320×170 pixel art canvas
  screenMatrix: k.topMatrix([LCD_ACTIVE_PLAN.x, LCD_ACTIVE_PLAN.y], T3_TOP_Z + 0.15, P, "x"),
};

// ===========================================================================
// Main Component: LilygoExplodedMachine
// ===========================================================================
export const LilygoExplodedMachine: React.FC<LilygoExplodedMachineProps> = ({
  explode: explodeProp,
  gpio0Press: gpio0Prop,
  gpio14Press: gpio14Prop,
  activeSlot: slotProp,
  width = VIEW_W,
  height = VIEW_H,
  showCallouts = true,
  className,
  style,
}) => {
  const clock = useAnatomyClock();
  const explode = explodeProp ?? clock.explode;
  const gpio0Press = gpio0Prop ?? clock.gpio0Press;
  const gpio14Press = gpio14Prop ?? clock.gpio14Press;
  const activeSlot = slotProp ?? clock.activeSlot;

  // Smooth spring Z offsets for the 3 real LILYGO T-Display-S3 layers
  const t1ShiftZ = (explodeProp !== undefined ? explode : clock.tierExplode[1]) * TIER1_DROP;
  const t2ShiftZ = (explodeProp !== undefined ? explode : clock.tierExplode[2]) * TIER2_LIFT;
  const t3ShiftZ = (explodeProp !== undefined ? explode : clock.tierExplode[3]) * TIER3_LIFT;

  const t1Transform = k.translateAlong(P, [0, 0, t1ShiftZ]);
  const t2Transform = k.translateAlong(P, [0, 0, t2ShiftZ]);
  const t3Transform = k.translateAlong(P, [0, 0, t3ShiftZ]);

  const isPraised = gpio0Press > 0.2;
  const isScolded = gpio14Press > 0.2;

  // Only the two round tactile button caps rebuild when pressed (2 cylinders total!)
  const btn0CapPaths = k.cylinder(
    BTN_GPIO0_BASE.x + 5.5,
    BTN_GPIO0_BASE.y + 5.0,
    3.6,
    T2_TOP_Z + 2.2,
    Math.max(1.2, 3.8 - gpio0Press * 2.2),
    P,
    24,
    0.4,
  );
  const btn14CapPaths = k.cylinder(
    BTN_GPIO14_BASE.x + 5.5,
    BTN_GPIO14_BASE.y + 5.0,
    3.6,
    T2_TOP_Z + 2.2,
    Math.max(1.2, 3.8 - gpio14Press * 2.2),
    P,
    24,
    0.4,
  );

  // Subtle breathing of XUNA inside the 320×170 IPS screen
  const petBob = Math.sin((clock.frame / clock.fps) * Math.PI * 2.2) * 0.9;

  // World Z coordinates for alignment lines & callouts
  const z1World = T1_FLOOR_Z + t1ShiftZ;
  const z2World = TIER2_Z0 + t2ShiftZ;
  const z3World = TIER3_Z0 + t3ShiftZ;

  return (
    <div
      className={className ? `am-iso ${className}` : "am-iso"}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <style>{AM_ISO_CSS}</style>
      <svg
        className="am-iso-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Exploded isometric LILYGO T-Display-S3 showing bottom ABS shell with Dual-Bank 16MB NVS Flash (life0/life1 + CRC32), middle 62x26mm PCB with ESP32-S3R8 240MHz MCU, 2x12 header pins, USB-C, and BOOT GPIO0 / KEY GPIO14 buttons, and top 1.9-inch ST7789V 320x170 IPS glass display."
      >
        {/* ================================================================= */}
        {/* LAYER 01: LILYGO Protective Bottom Shell + Dual-Bank NVS + Li-Po  */}
        {/* ================================================================= */}
        <g data-assembly="01-shell-nvs" transform={t1Transform}>
          <Solid
            paths={T1_GEO.shellOuter}
            tone="mid"
            crease="lo"
            inner={<Line d={T1_GEO.shellSeam} tone="faint" />}
          />
          <Solid paths={T1_GEO.shellFloor} tone="lo" accent="shade" crease="none" />
          <Line d={T1_GEO.shellRim} tone="lo" />

          {/* Precision millimeter scale engraved along front wall of shell */}
          <Line d={T1_GEO.rulerTicks.minor} tone="lo" />
          <Line d={T1_GEO.rulerTicks.major} tone="hi" />

          {/* 4 corner M2 brass standoffs */}
          {T1_GEO.standoffs.map((st, idx) => (
            <React.Fragment key={`st-${idx}`}>
              <Solid paths={st.outer} tone="mid" />
              <Dots points={[st.bore]} size={0.65} tone="hi" />
            </React.Fragment>
          ))}

          {/* Dual-Bank 16MB Flash NVS: Slot A (life0) */}
          <Solid
            paths={T1_GEO.bankA}
            tone="hi"
            accent={activeSlot === 0 ? "lime" : "shade"}
            crease="lo"
          />
          <Line d={T1_GEO.bankAInset} tone="lo" />
          <Dots points={T1_GEO.bankADots} size={0.55} tone="hi" />
          <FaceText
            transform={T1_GEO.bankATextMat}
            size={4.0}
            tone="hi"
            onAccent={activeSlot === 0}
          >
            LIFE0 · BANK A
          </FaceText>

          {/* Dual-Bank 16MB Flash NVS: Slot B (life1) */}
          <Solid
            paths={T1_GEO.bankB}
            tone="hi"
            accent={activeSlot === 1 ? "lime" : "shade"}
            crease="lo"
          />
          <Line d={T1_GEO.bankBInset} tone="lo" />
          <Dots points={T1_GEO.bankBDots} size={0.55} tone="hi" />
          <FaceText
            transform={T1_GEO.bankBTextMat}
            size={4.0}
            tone="hi"
            onAccent={activeSlot === 1}
          >
            LIFE1 · BANK B
          </FaceText>

          {/* Atomic A/B switch & CRC32 bus links */}
          <Wire from={T1_GEO.wireAB[0]} to={T1_GEO.wireAB[1]} tone="hi" size={1.3} />
          <Wire from={T1_GEO.wireBCrc[0]} to={T1_GEO.wireBCrc[1]} tone="hi" size={1.3} />

          {/* CRC32 Guard Comparator Block */}
          <Solid paths={T1_GEO.crcBlock} tone="hi" crease="lo" />
          <Line d={T1_GEO.crcInset} tone="lo" />
          <FaceText transform={T1_GEO.crcTextMat} size={3.6} tone="hi">
            CRC32
          </FaceText>

          {/* JST-GH 1.25mm 2P Li-Po Battery Connector (GPIO4 ADC) */}
          <Solid paths={T1_GEO.jstBat} tone="mid" />
          <Dots points={T1_GEO.jstPins} size={0.75} tone="hi" />

          {/* 4-Pin JST-SH STEMMA QT / Qwiic I2C Port (GPIO17/18) */}
          <Solid paths={T1_GEO.qwiicPort} tone="mid" />
          <Dots points={T1_GEO.qwiicPins} size={0.55} tone="hi" />
        </g>

        {/* Explode alignment axes between Layer 01 and Layer 02 (4 M2 corners + SPI bus) */}
        {explode > 0.05 ? (
          <g data-assembly="links-1-2">
            {M2_HOLES.map(([mx, my], idx) => (
              <Line
                key={`axis-12-${idx}`}
                d={k.rise([mx, my], z1World + 2.2, z2World, P)}
                tone="lo"
                dashed
              />
            ))}
            <Wire
              from={at([-16, 0, z1World + 3.8])}
              to={at([-16, 0, z2World])}
              tone="mid"
              dashed
              size={1.4}
            />
          </g>
        ) : null}

        {/* ================================================================= */}
        {/* LAYER 02: Iconic LILYGO T-Display-S3 Main PCB (62 × 26 mm)        */}
        {/* ================================================================= */}
        <g data-assembly="02-main-pcb" transform={t2Transform}>
          {/* Main PCB Substrate */}
          <Solid
            paths={T2_GEO.pcbSlab}
            tone="hi"
            crease="lo"
            inner={<Line d={T2_GEO.pcbSeam} tone="faint" />}
          />
          <Line d={T2_GEO.pcbInset} tone="faint" />
          <Line d={T2_GEO.chinDivider} tone="lo" />

          {/* 4 Corner M2 Gold Mounting Rings */}
          <Line d={T2_GEO.m2Rings} tone="hi" />
          <Dots points={T2_GEO.m2Holes} size={0.85} tone="hi" />

          {/* Top & Bottom 12-Pin Gold Header Rows (2 × 12 = 24 Pins at 2.54mm pitch) */}
          <Line d={T2_GEO.topHeaderRings} tone="mid" />
          <Dots points={T2_GEO.topHeaderDots} size={0.65} tone="hi" />
          <Line d={T2_GEO.botHeaderRings} tone="mid" />
          <Dots points={T2_GEO.botHeaderDots} size={0.65} tone="hi" />

          {/* Left-end 2.4 GHz BLE 5 / Wi-Fi Meander PCB Trace Antenna */}
          <Solid paths={T2_GEO.antennaKeepout} tone="lo" accent="shade" crease="none" />
          <Line d={T2_GEO.antennaTrace} tone="hi" />
          <Dots points={T2_GEO.antennaFeeds} size={0.75} tone="hi" />

          {/* 8-Bit Parallel i8080 Display Bus Traces */}
          <Line d={T2_GEO.busTraces} tone="mid" />

          {/* ESP32-S3R8 RF Shield Can + LifeCore C++11 Engine (Lilac Accent) */}
          <Solid paths={T2_GEO.mcuCan} tone="hi" accent="lilac" crease="lo" />
          <Solid paths={T2_GEO.mcuDie} tone="hi" accent="lilac" crease="lo" />
          <Line d={T2_GEO.mcuInset} tone="lo" />
          <FaceText transform={T2_GEO.mcuTitleMat} size={3.8} tone="hi" onAccent>
            ESP32-S3R8
          </FaceText>
          <FaceText transform={T2_GEO.mcuSubMat} size={3.0} tone="mid" onAccent>
            LIFECORE C++11
          </FaceText>

          {/* 24-Pin i8080 Parallel Display FPC Receptacle */}
          <Solid paths={T2_GEO.fpcConn} tone="mid" />
          <Dots points={T2_GEO.fpcPins} size={0.55} tone="hi" />

          {/* GPIO15 Power Enable Latch & PMIC */}
          <Solid paths={T2_GEO.io15Chip} tone="mid" />
          <FaceText transform={T2_GEO.io15TextMat} size={2.7} tone="hi">
            IO15
          </FaceText>
          <Solid paths={T2_GEO.chgChip} tone="mid" />

          {/* Side Hardware Reset (RST) Switch */}
          <Solid paths={T2_GEO.rstBody} tone="mid" />
          <Solid paths={T2_GEO.rstPlunger} tone="hi" />

          {/* Right-Chin Exposed Controls: BOOT (GPIO0), USB Type-C, KEY (GPIO14) */}
          {/* 1. BOOT / GPIO0 (+) Tactile Button (top-right of PCB) */}
          <Solid paths={T2_GEO.btn0Base} tone="mid" />
          <Solid
            paths={btn0CapPaths}
            tone="hi"
            accent={isPraised ? "lime" : undefined}
            lit={isPraised}
          />
          <FaceText transform={T2_GEO.btn0LabelMat} size={2.7} tone="hi">
            IO0(+)
          </FaceText>

          {/* 2. Center-Right Protruding USB Type-C Receptacle */}
          <Solid
            paths={T2_GEO.usbShell}
            tone="hi"
            crease="lo"
            inner={<Line d={T2_GEO.usbSeam} tone="lo" />}
          />
          <Line d={T2_GEO.usbInset} tone="lo" />
          <Solid paths={T2_GEO.usbTongue} tone="mid" />
          <FaceText transform={T2_GEO.usbTextMat} size={3.2} tone="hi">
            USB-C
          </FaceText>

          {/* 3. KEY / GPIO14 (−) Tactile Button (bottom-right of PCB) */}
          <Solid paths={T2_GEO.btn14Base} tone="mid" />
          <Solid
            paths={btn14CapPaths}
            tone="hi"
            accent={isScolded ? "lilac" : undefined}
            lit={isScolded}
          />
          <FaceText transform={T2_GEO.btn14LabelMat} size={2.7} tone="hi">
            IO14(−)
          </FaceText>
        </g>

        {/* Explode alignment axes between Layer 02 (PCB) and Layer 03 (IPS Screen) */}
        {explode > 0.05 ? (
          <g data-assembly="links-2-3">
            {[
              [-68.5, -25.5],
              [45.0, -25.5],
              [-68.5, 25.5],
              [45.0, 25.5],
            ].map(([mx, my], idx) => (
              <Line
                key={`axis-23-${idx}`}
                d={k.rise([mx, my], z2World + PCB_H, z3World, P)}
                tone="lo"
                dashed
              />
            ))}
            {/* i8080 8-bit parallel display bus link */}
            <Wire
              from={at([FPC_CONN_PLAN.x + 5, 0, z2World + PCB_H + 3.2])}
              to={at([FPC_CONN_PLAN.x + 5, 0, z3World])}
              tone="hi"
              dashed
              size={1.5}
            />
          </g>
        ) : null}

        {/* ================================================================= */}
        {/* LAYER 03: 1.9" ST7789V IPS Glass Display (320 × 170) + FPC Ribbon */}
        {/* ================================================================= */}
        <g data-assembly="03-ips-lcd" transform={t3Transform}>
          {/* Left-edge folded amber/orange FPC ribbon tail */}
          <Solid paths={T3_GEO.fpcRibbon} tone="hi" accent="orange" crease="lo" />

          {/* Black glass ST7789V display module bezel (sits left of USB-C & buttons) */}
          <Solid
            paths={T3_GEO.glassBezel}
            tone="hi"
            crease="lo"
            inner={<Line d={T3_GEO.glassSeam} tone="faint" />}
          />

          {/* LILYGO T-Display-S3 silkscreen along left glass bezel */}
          <FaceText transform={T3_GEO.brandStripMat} size={3.1} tone="mid">
            T-DISPLAY-S3
          </FaceText>

          {/* Active 320×170 IPS Screen Viewport (Orange Artificial-Life Field) */}
          <Solid paths={T3_GEO.activeViewport} tone="hi" accent="orange" crease="lo" />
          <Line d={T3_GEO.activeBorder} tone="hi" />

          {/* Isometric Projected 320×170 LCD Screen Content */}
          <g transform={T3_GEO.screenMatrix}>
            {/* Top telemetry bar inside the 320×170 IPS screen */}
            <rect x={2.5} y={2.5} width={93} height={7.2} fill="var(--ink)" />
            <text
              x={5.5}
              y={7.4}
              fill="var(--paper)"
              fontFamily="var(--f-mono)"
              fontSize={3.8}
              fontWeight={500}
              letterSpacing="0.06em"
            >
              ST7789V · 320×170 IPS
            </text>
            <text
              x={92.5}
              y={7.4}
              fill="var(--lime)"
              fontFamily="var(--f-mono)"
              fontSize={3.6}
              fontWeight={500}
              textAnchor="end"
            >
              {activeSlot === 0 ? "BANK:A" : "BANK:B"}
            </text>

            {/* Dotted pixel floor inside XUNA's habitat */}
            <line
              x1={3}
              y1={37}
              x2={95}
              y2={37}
              stroke="var(--ink)"
              strokeWidth={0.8}
              strokeDasharray="2.5 2.5"
            />

            {/* Stepped Pixel-Art XUNA Specimen in center of the 320×170 screen */}
            <g transform={`translate(38, ${15.5 + petBob})`}>
              <rect x={2} y={18} width={18} height={2.2} fill="var(--ink)" opacity={0.32} />
              <rect x={3} y={2} width={16} height={2.4} fill="var(--ink)" />
              <rect x={1} y={4.4} width={20} height={11.5} fill="var(--ink)" />
              <rect x={3.5} y={15.9} width={4.5} height={2.6} fill="var(--ink)" />
              <rect x={14} y={15.9} width={4.5} height={2.6} fill="var(--ink)" />
              <rect x={3.2} y={4.4} width={15.6} height={9.6} fill="var(--paper)" />

              {/* Expressive pixel eyes reacting to GPIO0 / GPIO14 */}
              {isPraised ? (
                <>
                  <path d="M5.5 8.5 L7.2 6.8 L8.9 8.5" stroke="var(--ink)" strokeWidth={1.2} fill="none" />
                  <path d="M13.1 8.5 L14.8 6.8 L16.5 8.5" stroke="var(--ink)" strokeWidth={1.2} fill="none" />
                </>
              ) : isScolded ? (
                <>
                  <rect x={5.5} y={7.8} width={3.6} height={1.3} fill="var(--ink)" />
                  <rect x={12.9} y={7.8} width={3.6} height={1.3} fill="var(--ink)" />
                </>
              ) : (
                <>
                  <rect x={6.2} y={6.8} width={2.4} height={3.2} fill="var(--ink)" />
                  <rect x={13.4} y={6.8} width={2.4} height={3.2} fill="var(--ink)" />
                </>
              )}
              <rect x={9.6} y={11.0} width={2.8} height={1.2} fill="var(--ink)" />
            </g>

            {/* Bottom status readout bar inside the 320×170 screen */}
            <rect
              x={3.5}
              y={39.2}
              width={91}
              height={6.6}
              fill={isPraised ? "var(--lime)" : isScolded ? "var(--lilac)" : "var(--paper)"}
              stroke="var(--ink)"
              strokeWidth={0.7}
            />
            <text
              x={49}
              y={43.8}
              fill="var(--ink)"
              fontFamily="var(--f-mono)"
              fontSize={3.5}
              fontWeight={500}
              textAnchor="middle"
              letterSpacing="0.05em"
            >
              {isPraised
                ? "GPIO0 (+1) · PRAISE RECORDED"
                : isScolded
                  ? "GPIO14 (-1) · SCOLD RECORDED"
                  : "XUNA LIFECORE · 3.3V LOCAL"}
            </text>
          </g>
        </g>

        {/* ================================================================= */}
        {/* Right-Hand Technical Callouts (smoothly tracking each layer's Z)  */}
        {/* ================================================================= */}
        {showCallouts && explode > 0.25 ? (
          <g data-assembly="callouts" opacity={Math.min(1, (explode - 0.25) / 0.35)}>
            {/* Callout 03: 1.9" ST7789V 320×170 IPS Display */}
            {(() => {
              const p3 = at([LCD_GLASS_PLAN.x + LCD_GLASS_PLAN.w, 6, z3World + LCD_H * 0.6]);
              const elbowY = p3[1] - 10;
              return (
                <>
                  <Wire
                    from={p3}
                    via={[[548, elbowY]]}
                    to={[820, elbowY]}
                    tone="hi"
                    ends="from"
                    size={2.4}
                  />
                  <text
                    x={554}
                    y={elbowY - 10}
                    fill="var(--am-iso-fg)"
                    fontFamily="var(--f-mono)"
                    fontSize={14}
                    fontWeight={500}
                    letterSpacing="0.08em"
                  >
                    03 · 1.9″ ST7789V IPS LCD
                  </text>
                  <text
                    x={554}
                    y={elbowY + 18}
                    fill="var(--am-iso-mut)"
                    fontFamily="var(--f-mono)"
                    fontSize={12}
                    fontWeight={400}
                    letterSpacing="0.04em"
                  >
                    320×170 RGB · FPC RIBBON · BL IO38
                  </text>
                </>
              );
            })()}

            {/* Callout 02: LILYGO T-Display-S3 Main PCB (62 × 26 mm) */}
            {(() => {
              const p2 = at([USB_C_PLAN.x + USB_C_PLAN.w, 0, z2World + PCB_H + 2.8]);
              const elbowY = p2[1] - 4;
              return (
                <>
                  <Wire
                    from={p2}
                    via={[[548, elbowY]]}
                    to={[820, elbowY]}
                    tone="hi"
                    ends="from"
                    size={2.4}
                  />
                  <text
                    x={554}
                    y={elbowY - 10}
                    fill="var(--am-iso-fg)"
                    fontFamily="var(--f-mono)"
                    fontSize={14}
                    fontWeight={500}
                    letterSpacing="0.08em"
                  >
                    02 · T-DISPLAY-S3 MAIN PCB
                  </text>
                  <text
                    x={554}
                    y={elbowY + 18}
                    fill="var(--am-iso-mut)"
                    fontFamily="var(--f-mono)"
                    fontSize={12}
                    fontWeight={400}
                    letterSpacing="0.04em"
                  >
                    ESP32-S3R8 · IO0/IO14 · USB-C · 2×12 PINS
                  </text>
                </>
              );
            })()}

            {/* Callout 01: Bottom Shell + Dual-Bank 16 MB NVS Flash */}
            {(() => {
              const p1 = at([SHELL_PLAN.x + SHELL_PLAN.w, 12, z1World - SHELL_H * 0.3]);
              const elbowY = p1[1] + 4;
              return (
                <>
                  <Wire
                    from={p1}
                    via={[[548, elbowY]]}
                    to={[820, elbowY]}
                    tone="hi"
                    ends="from"
                    size={2.4}
                  />
                  <text
                    x={554}
                    y={elbowY - 10}
                    fill="var(--am-iso-fg)"
                    fontFamily="var(--f-mono)"
                    fontSize={14}
                    fontWeight={500}
                    letterSpacing="0.08em"
                  >
                    01 · NVS A/B VAULT & SHELL
                  </text>
                  <text
                    x={554}
                    y={elbowY + 18}
                    fill="var(--am-iso-mut)"
                    fontFamily="var(--f-mono)"
                    fontSize={12}
                    fontWeight={400}
                    letterSpacing="0.04em"
                  >
                    16MB LIFE0/LIFE1 · CRC32 · JST LI-PO
                  </text>
                </>
              );
            })()}
          </g>
        ) : null}
      </svg>
    </div>
  );
};
