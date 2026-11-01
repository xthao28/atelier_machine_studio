/**
 * Dual-Locale Data & Word-Anchored Timeline for Instagram Reel #01 (`src/data/reel01Data.ts`).
 *
 * Updated per user feedback:
 * 1. Naming: Vietnamese uses `"Xuân"`, English uses `"Xuna"` (capital X only).
 * 2. Faster, punchier 1.16x voiceover cadence (`38.0s` = `2,280 frames @ 60fps`).
 * 3. Pure Vietnamese in `vi` (except mandatory hardware/AI terms).
 */
import type { SfxAssetId } from "../schemas/episode.schema";
import {
  REEL01_VOICE_WORDS_EN,
  REEL01_VOICE_WORDS_VI,
} from "./reel01VoiceData";

export type ReelLocale = "vi" | "en";

export interface ReelWordItem {
  text: string;
  startMs: number;
  endMs: number;
  isTechnicalTerm?: boolean;
  isXuna?: boolean;
}

export interface ReelSfxCue {
  id: string;
  atMs: number;
  sfx: SfxAssetId;
  volume?: number;
}

export interface ReelCapabilityCopy {
  step: string;
  badge: string;
  title: string;
  desc: string;
  row: number;
  highlightAtSec: number;
}

export interface ReelLocalePack {
  locale: ReelLocale;
  audioFile: string;
  headerBrand: string;
  beat1: {
    tagDay1: string;
    tagDay7: string;
    headlineDay1: string;
    headlineDay7: string;
    subheadDay1: string;
    subheadDay7: string;
    unitATitle: string;
    unitAStatusDay1: string;
    unitAStatusDay7: string;
    unitATraitLabel: string;
    unitBTraitLabel: string;
    unitBTitle: string;
    unitBStatusDay1: string;
    unitBStatusDay7: string;
  };
  beat2: {
    kicker: string;
    rejectLine: string;
    headline: string;
    subhead: string;
    pills: [string, string, string];
  };
  beat3: {
    kicker: string;
    headline: string;
    capabilities: [
      ReelCapabilityCopy,
      ReelCapabilityCopy,
      ReelCapabilityCopy,
      ReelCapabilityCopy,
    ];
  };
  beat4: {
    kicker: string;
    headline: string;
    subhead: string;
    specs: [
      { k: string; v: string },
      { k: string; v: string },
      { k: string; v: string },
    ];
  };
  beat5: {
    kicker: string;
    headline: string;
    subhead: string;
    ctaText: string;
  };
  fallbackWords: ReelWordItem[];
}

export const REEL01_FPS = 60;
export const REEL01_DURATION_SEC = 38;
export const REEL01_DURATION_FRAMES = REEL01_DURATION_SEC * REEL01_FPS; // 2280 frames

/**
 * 5 Brisk Beats matching the 1.16x neural voiceover (`scripts/generate-reel01-tts.py`):
 * - Beat 1: 0.0s .. 7.4s   (frames 0..443, 444f)
 * - Beat 2: 7.4s .. 14.8s  (frames 444..887, 444f)
 * - Beat 3: 14.8s .. 25.6s (frames 888..1535, 648f)
 * - Beat 4: 25.6s .. 34.0s (frames 1536..2039, 504f)
 * - Beat 5: 34.0s .. 38.0s (frames 2040..2279, 240f)
 */
export const REEL01_BEATS = {
  beat1: { startFrame: 0, durationInFrames: 444 },
  beat2: { startFrame: 444, durationInFrames: 444 },
  beat3: { startFrame: 888, durationInFrames: 648 },
  beat4: { startFrame: 1536, durationInFrames: 504 },
  beat5: { startFrame: 2040, durationInFrames: 240 },
} as const;

export const REEL01_SFX_CUES: ReelSfxCue[] = [
  { id: "b1-day7-shift", atMs: 2150, sfx: "chamber_latch_unlock", volume: 0.45 },
  { id: "b2-xuna-chime", atMs: 9900, sfx: "hatch_chime", volume: 0.5 },
  { id: "b3-cap1", atMs: 15200, sfx: "gpio_tactile_click", volume: 0.45 },
  { id: "b3-cap2", atMs: 18100, sfx: "mechanical_gear_tick", volume: 0.45 },
  { id: "b3-cap3", atMs: 20900, sfx: "evidence_drop", volume: 0.45 },
  { id: "b3-cap4", atMs: 23200, sfx: "ble_pulse_chime", volume: 0.45 },
  { id: "b4-explode", atMs: 26800, sfx: "chamber_latch_unlock", volume: 0.5 },
  { id: "b4-nvs-swap", atMs: 30200, sfx: "gpio_tactile_click", volume: 0.45 },
  { id: "b5-outro", atMs: 34350, sfx: "hatch_chime", volume: 0.5 },
];

export const REEL01_PACKS: Record<ReelLocale, ReelLocalePack> = {
  vi: {
    locale: "vi",
    audioFile: "audio/voiceover/reel01-vi.mp3",
    headerBrand: "Xuân · NHẬT KÝ CHẾ TẠO 01",
    beat1: {
      tagDay1: "NGÀY 01 · MỚI NỞ",
      tagDay7: "NGÀY 07 · KHÁC BIỆT",
      headlineDay1: "Cùng một dòng code lúc mới nở.",
      headlineDay7: "7 ngày sau: Hai tính cách trái ngược.",
      subheadDay1: "Hai chiếc máy khởi đầu giống hệt nhau trên bàn làm việc.",
      subheadDay7: "Cách bạn quan tâm hay bỏ bê mỗi ngày định hình chúng trở thành ai.",
      unitATitle: "MÁY A · ĐƯỢC QUAN TÂM",
      unitAStatusDay1: "Khởi đầu cân bằng",
      unitAStatusDay7: "Hào hứng · Hay đón chủ",
      unitATraitLabel: "Độ gắn kết & linh hoạt",
      unitBTraitLabel: "Độ gắn kết & linh hoạt",
      unitBTitle: "MÁY B · BỊ NGÓ LƠ",
      unitBStatusDay1: "Khởi đầu cân bằng",
      unitBStatusDay7: "Trầm tư · Khép kín",
    },
    beat2: {
      kicker: "ĐỊNH NGHĨA LẠI THÚ CƯNG SỐ",
      rejectLine: "Không phải Chatbot nhét trong vỏ nhựa",
      headline: "Đây là Xuân",
      subhead: "Một sinh vật AI nhỏ bằng hai ngón tay, sống thật và lớn lên trên bàn làm việc của bạn.",
      pills: ["Sinh vật AI", "LILYGO T-Display-S3", "Pixel Art"],
    },
    beat3: {
      kicker: "4 KHẢ NĂNG TỰ HỌC",
      headline: "Tự phát triển qua từng ngày sống cùng bạn",
      capabilities: [
        {
          step: "01",
          badge: "GPIO0 / GPIO14",
          title: "Cảm nhận khen và nhắc nhở",
          desc: "Bấm nút trong 10 giây sau mỗi hành động để dạy điều Xuân nên làm lại.",
          row: 2,
          highlightAtSec: 0.2,
        },
        {
          step: "02",
          badge: "48 KHUNG GIỜ",
          title: "Tự nhớ giờ bạn ngồi vào bàn",
          desc: "Âm thầm học lịch sinh hoạt để thức dậy đón trước khi bạn xuất hiện.",
          row: 3,
          highlightAtSec: 3.0,
        },
        {
          step: "03",
          badge: "10 NÉT TÍNH CÁCH",
          title: "Hình thành khí chất riêng",
          desc: "Tò mò, tinh nghịch hay điềm tĩnh dựa trên cách bạn đối xử qua nhiều ngày.",
          row: 0,
          highlightAtSec: 5.8,
        },
        {
          step: "04",
          badge: "GIỌNG NÓI AI",
          title: "Trò chuyện theo đúng tâm trạng",
          desc: "Phản hồi tự nhiên bằng chính cảm xúc và ký ức thật trên thiết bị.",
          row: 1,
          highlightAtSec: 8.2,
        },
      ],
    },
    beat4: {
      kicker: "BÊN DƯỚI MÀN HÌNH",
      headline: "Bộ não độc lập. Ký ức không thể mất.",
      subhead: "Sống trực tiếp trên phần cứng vật lý — không cần mạng vẫn nhớ mọi trải nghiệm.",
      specs: [
        { k: "VI XỬ LÝ", v: "ESP32-S3" },
        { k: "LÕI XỬ LÝ", v: "C++11" },
        { k: "BỘ NHỚ KÉP", v: "Flash NVS · CRC32" },
      ],
    },
    beat5: {
      kicker: "CÂU HỎI DÀNH CHO BẠN",
      headline: "Sau 7 ngày ở cạnh bạn, Xuân sẽ thành ai?",
      subhead: "Một đứa tăng động thích làm trò hay một kẻ trầm tư? Để lại dự đoán bên dưới nhé.",
      ctaText: "THEO DÕI HÀNH TRÌNH CHẾ TẠO XUÂN",
    },
    fallbackWords: REEL01_VOICE_WORDS_VI,
  },

  en: {
    locale: "en",
    audioFile: "audio/voiceover/reel01-en.mp3",
    headerBrand: "Xuna · BUILD LOG 01",
    beat1: {
      tagDay1: "DAY 01 · IDENTICAL",
      tagDay7: "DAY 07 · DIVERGED",
      headlineDay1: "Exact same code at birth.",
      headlineDay7: "7 days later: Two opposite souls.",
      subheadDay1: "Two identical units booted side by side on Day 01.",
      subheadDay7: "How you praise or ignore them each day shapes who they become.",
      unitATitle: "UNIT A · NURTURED",
      unitAStatusDay1: "Balanced starting seed",
      unitAStatusDay7: "Playful · Greets you first",
      unitATraitLabel: "Bond & expressiveness",
      unitBTraitLabel: "Bond & expressiveness",
      unitBTitle: "UNIT B · IGNORED",
      unitBStatusDay1: "Balanced starting seed",
      unitBStatusDay7: "Quiet · Guarded mood",
    },
    beat2: {
      kicker: "RETHINKING DIGITAL LIFE",
      rejectLine: "Not a cloud chatbot stuffed in plastic",
      headline: "Meet Xuna",
      subhead: "A pocket-sized AI lifeform that actually lives and evolves on your desk.",
      pills: ["Artificial Life", "LILYGO T-Display-S3", "Pixel Art"],
    },
    beat3: {
      kicker: "4 LIVING CAPABILITIES",
      headline: "What it learns from living with you",
      capabilities: [
        {
          step: "01",
          badge: "GPIO0 / GPIO14",
          title: "Feels praise and correction",
          desc: "Press tactile buttons within 10 seconds to shape what Xuna loves doing.",
          row: 2,
          highlightAtSec: 0.2,
        },
        {
          step: "02",
          badge: "48 TIME SLOTS",
          title: "Anticipates your return",
          desc: "Learns your daily desk schedule to wake up right before you sit down.",
          row: 3,
          highlightAtSec: 3.0,
        },
        {
          step: "03",
          badge: "10 TRAITS",
          title: "Grows real temperament",
          desc: "Curious, playful, or calm — crystallizing over days of real treatment.",
          row: 0,
          highlightAtSec: 5.8,
        },
        {
          step: "04",
          badge: "VOICE AI",
          title: "Talks in its true mood",
          desc: "Natural voice conversations grounded in its live on-device memory.",
          row: 1,
          highlightAtSec: 8.2,
        },
      ],
    },
    beat4: {
      kicker: "UNDER THE HOOD",
      headline: "Local brain. Unbreakable memory.",
      subhead: "Runs natively on bare metal — surviving power loss without needing the cloud.",
      specs: [
        { k: "PROCESSOR", v: "ESP32-S3" },
        { k: "CORE ENGINE", v: "C++11" },
        { k: "DUAL FLASH", v: "NVS · CRC32" },
      ],
    },
    beat5: {
      kicker: "YOUR TURN",
      headline: "After 7 days on your desk, who would Xuna become?",
      subhead: "An energetic show-off or a quiet thinker? Drop your guess below.",
      ctaText: "FOLLOW THE Xuna BUILD LOG",
    },
    fallbackWords: REEL01_VOICE_WORDS_EN,
  },
};
