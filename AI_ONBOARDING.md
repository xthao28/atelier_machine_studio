# AI_ONBOARDING.md — Hướng dẫn Khởi tạo & Bối cảnh Dự án cho AI Agent

> **DÀNH CHO AI AGENT (Claude / Antigravity / Cursor / Windsurf):**
> Khi người dùng yêu cầu bạn đọc file này trên một máy mới sau khi `git clone`, hãy thực hiện tuần tự **Bước 1 (Cài đặt môi trường & AI Skills)** và **Bước 2 (Đọc tài liệu bắt buộc)** trước khi viết hoặc chỉnh sửa bất kỳ dòng code nào.

---

## BƯỚC 1: KHỞI TẠO MÔI TRƯỜNG & CLONE AI AGENT SKILLS (BẮT BUỘC CHẠY ĐẦU TIÊN)

Chạy lần lượt các lệnh sau trong terminal tại thư mục gốc của repository:

```bash
# 1. Cài đặt toàn bộ dependencies (Remotion 4.0.484, Three.js, Shiki, Tailwind, Rough.js...)
npm install --legacy-peer-deps

# 2. Clone 2 bộ AI Agent Skills chủ lực vào .agents/skills/
npm run setup:skills
# (Tương đương với: npx skills add Vincentwei1021/video-shotcraft -y && npx skills add wheresryan22/anatomy -y)

# 3. Kiểm tra đồng bộ phiên bản Remotion
npx remotion versions
```

Sau khi chạy xong `npm run setup:skills`, hãy xác nhận 3 thư mục skill sau đã tồn tại:
- `.agents/skills/video-shotcraft/SKILL.md`
- `.agents/skills/anatomy/SKILL.md`
- `.agents/skills/atelier-motion-doctrine/SKILL.md` (đã tích hợp sẵn trong repo)

---

## BƯỚC 2: ĐỌC CÁC TÀI LIỆU CHUẨN TRONG REPO (THEO THỨ TỰ)

1. **[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)** (đọc §0 trước)
   - Đây là **Design System chính thức của studio `ATELIER MACHINE`** (*"Making Machines Feel Alive." / "Làm cho máy móc như có sự sống."*).
   - **Nguồn chuẩn duy nhất** là artifact trong [`design-system-artifact/project/`](./design-system-artifact/project/) (`tokens.json` + `components/bundle.css`). Các file `src/styles/tokens.css`, `src/styles/atelier-machine.css`, `src/design-system/tokens.ts` được **sinh tự động** bằng `npm run ds:build`, không sửa tay. Trong code không gõ mã hex / cỡ chữ / độ dày viền trực tiếp: dùng CSS variable, class `.am-*`, Tailwind `am-*` hoặc `tokens.ts`.
   - **Component React cho video** nằm ở [`src/design-system/`](./src/design-system/index.ts) (xem `DESIGN_SYSTEM.md` §11): `Slide`, `BrandHeader`, `CharacterFrame` + `PixelSprite` (sprite XUNA thật), `MetadataBlock`, `StatusIndicator`… cùng helper chuyển động `Cut` / `PixelWipe` (chỉ cắt cảnh và bước 8 frame). Mẫu dựng sẵn: [`src/compositions/AmProjectRevealVertical.tsx`](./src/compositions/AmProjectRevealVertical.tsx).
   - **Quy tắc bất di bất dịch:**
     - Phong cách: **Contemporary Retro-Futurism** (tạp chí kỹ thuật thập niên 1970s–90s).
     - **Flat 100%:** Không đổ bóng (`no shadows`), không chuyển sắc (`no gradients`), không phát sáng (`no glow`), không hiệu ứng glitch/blur.
     - **Bảng màu (`tokens.css`):** Ground là `--paper: #F2EFE7` (45%) hoặc `--ink: #242424` (30%); Accents là `--lime: #D9F57A` (technical ~10%), `--lilac: #D9CBF6` (concept/code ~10%), `--orange: #FF9B56` (artificial life / XUNA ~5%); phụ trợ `--paper-shade: #E4DFD1`, `--ink-soft: #4A4A46`, `--paper-soft: #B9B5AA`, `--grid-line: #D6D1C1` / `#3B3B38`.
     - **Typography (Canvas 1080px):** `Space Grotesk` cho Display & Body (`.display-xl` 220px, `.display` 144px, `.h1` 96px tối đa 8 từ, `.h2` 64px, `.h3` 44px, `.body-lg` 36px tối đa 25 từ/cảnh, `.body` 32px, `.caption` 26px — dùng *Sentence case*). `IBM Plex Mono` cho Technical (`.label` / `.am-lab` 22px UPPER-CASE tracking `+0.08em`, `.meta` 20px, `.data` 28px).
     - **Safe Zone Video Dọc `9:16` (`1080 × 1920` — `.am-slide.tall`):** Safe box `x: 72px → 920px` (`--margin-post: 72px`, `--safe-right-vertical: 160px`), `y: 250px → 1470px` (`--safe-top-vertical: 250px`, `--safe-bottom-vertical: 450px`). Lưới 4 cột, `--gutter: 24px`, bước lưới kỹ thuật `--grid-pitch: 72px`. `BrandHeader` (`.am-header`) ở `y = 270`, `BrandFooter` (`.am-footer`) ở `y = 1400`.
     - **Viền & Khung XUNA:** Viền `--stroke-line: 3px`, đường mảnh `--stroke-hair: 2px`, góc vuông (`0px`), chỉ `.am-tag` mới bo tròn pill (`999px`). Nhân vật Pixel Art XUNA luôn đặt trong `CharacterFrame` (`.am-char`) cắt góc bậc thang `8px` trên nền `--orange` với `image-rendering: pixelated`.
2. **`.agents/skills/video-shotcraft/SKILL.md`**
   - Đọc để nắm bộ **120+ Shot Recipe Cards** (2.5D camera pan/tilt, hero reveal, split-screen, kinetic typography, spotlight zoom, beat-synced cuts).
3. **`.agents/skills/anatomy/SKILL.md` & [`src/components/isometric/kit/iso-kit.ts`](./src/components/isometric/kit/iso-kit.ts) & [`src/components/isometric/kit/draw.tsx`](./src/components/isometric/kit/draw.tsx)**
   - Đọc để nắm cách dựng các **cỗ máy cơ khí Isometric (2.5D/3D)** bằng SVG đổ bóng 4 sắc độ (`4-tone shading`), sắp xếp thứ tự vẽ (`painter's order`) và nối biến thời gian vào `useCurrentFrame()` / `spring()` của Remotion.
4. **`.agents/skills/atelier-motion-doctrine/SKILL.md` & [`episodes/ep01-xuna-evolution.script.ts`](./episodes/ep01-xuna-evolution.script.ts) & [`src/hooks/useWordTimeline.ts`](./src/hooks/useWordTimeline.ts)**
   - **Word-Anchored Timeline (từ `hypit`):** Mọi chuyển động cơ khí, điểm cắt beat và SFX đều được neo vào các từ khoá giọng đọc trong [`src/data/ep01Captions.ts`](./src/data/ep01Captions.ts) thông qua `resolveSceneWordFrame()` / `useWordTimeline()`.
   - **Caption Model `drop / rail / embed` + Overlay Law (từ `hyperframes`):** Dùng `<AmCaptionRail>` đặt ở `top = 1492` (dưới `BrandFooter` `y = 1400`) để không làm lệch tâm bố cục `y: 250–1470`, kết hợp `<AmWordEmbed>` (tối đa 1 từ khoá khổ lớn mỗi beat ở lớp nền sau cỗ máy) và `<SceneSfxTrack>`.
   - **Stage-Gate & Seam-Gate QA (từ `openmontage` & `hyperframes`):** Luôn chạy `npm run typecheck && npm run qa:episode` sau khi chỉnh sửa scene hoặc manifest.

---

## BƯỚC 3: BỐI CẢNH DỰ ÁN XUNA (NGUỒN DỮ LIỆU ĐỂ KỂ CHUYỆN TRONG VIDEO)

- **Tầm nhìn sản phẩm:** *"Every experience shapes who XUNA becomes."* (Mọi trải nghiệm đều định hình XUNA là ai).
- **Bản chất:** `XUNA` là một sinh vật số AI (Digital Lifeform) sống thật trên thiết bị phần cứng vật lý (**LILYGO T-Display-S3**, màn hình LCD `320×170`, chip `ESP32-S3`, 2 nút bấm vật lý `GPIO0` và `GPIO14`), biểu đạt qua **Pixel Art**. XUNA KHÔNG phải một chatbot nhét vào phần cứng hay thú ảo cày điểm XP lặp đi lặp lại.
- **Triết lý cốt lõi:** **Local-first & Device-authoritative** (trạng thái sống, trí nhớ, sở thích và tính cách nằm trên thiết bị, hoạt động độc lập không cần mạng; App Flutter qua BLE và Cloud FastAPI/LLM chỉ đóng vai trò hỗ trợ giao tiếp, sao lưu và cung cấp bằng chứng học tập).
- **Hành trình phát triển kỹ thuật (5 chặng):**
  1. **Khởi nguyên & Đổi tên (`M01` – `M03`):** Đi từ bản mẫu đầu tiên (`MOCHI` → đổi thành `XUNA`), tách `xuna_core` viết bằng C++11 thuần (deterministic, không cấp phát động bừa bãi, 46 native unit test suites + ASan).
  2. **Nền tảng sự sống bất tử (`M04` Foundation):**
     - `LifeCore`, hệ thống nhu cầu `Needs` (Năng lượng, Kích thích), chu kỳ ngủ/thức tự nhiên.
     - Cơ chế nở trứng (`Hatch` giữ nút 3s hoặc qua App, đồng bộ thời gian thực `TimeSync`).
     - Lưu trữ bền vững `LifeSnapshot v2` vào Flash NVS theo cấu trúc 2 ngăn A/B (`life0`/`life1`) có CRC/generation chống hỏng dữ liệu khi mất điện đột ngột, định danh `PetId` / `DeviceId` / `BrainId` riêng biệt.
  3. **Học từ trải nghiệm thật (`M05a` Learning & Routine):**
     - Thuật toán học sở thích **`PreferenceLearnerV3`** (Discounted Beta distribution + chính sách khám phá **UCB**): học chọn hành vi (`idle`, `happy`, `curious`) theo ngữ cảnh (`quiet`, `play`, `button_greeting`) và 5 buổi trong ngày (`day_part`).
     - **Reaction Learning (D6 revised):** Trong 10 giây sau khi XUNA hành động, chủ bấm `GPIO0` là xoa đầu khen (`+`), bấm `GPIO14` là xua tay (`-`), hoặc dạy qua lời nói có xác nhận trên App.
     - **Routine Learning (`HabitPredictor`):** Học thói quen 48 khung giờ (mỗi 30 phút) kèm cổng kiểm định `Brier score` để đoán trước lúc nào chủ sắp xuất hiện.
  4. **Tiến hoá Tính cách & Cảm xúc (`PE-0` → `PE-4` & Track A):**
     - **`Temperament.h` (Bộ gen khí chất 10 tham số `Q1.14`):** `curiosity`, `sociability`, `playfulness`, `tempo`, `sensitivity`, `moodInertia`, `moodBaseline`, `persistence`, `boredom`, `restfulness`. Khởi tạo lệch nhẹ (`±0.15`) từ `PetId` khi mới nở, dịch chuyển chậm qua **`EvidenceLedger.h`** (chỉ kết tinh `Consolidation` khi đủ độ quan trọng qua `≥ 4 buổi` khác nhau và nhất quán dấu, chống một sự kiện cực đoan làm lệch tính cách).
     - **`Drives.h` & `Affect.h` (Hệ cảm xúc lò xo kép):** Lấy cảm hứng từ kiến trúc cảm xúc WASABI & GAMYGDALA — `Emotion` và `Mood` hoạt động như **2 chiếc lò xo vật lý nối nhau** (cảm xúc tức thời từ kỳ vọng đúng/sai kéo theo tâm trạng có quán tính và tự hồi về baseline).
     - **Biểu hiện (`Expression` & `Track A`):** Tính cách điều khiển nhịp độ frame (`±15%`), thời lượng phản ứng, tần suất tự hành động (`51–69s`) và các biến thể hoạt ảnh (`look_around`, `yawn_stretch`, `bounce_play`, `greet_nuzzle`).
  5. **Giao tiếp giọng nói & Dạy kiến thức (`Voice V1` & `Knowledge`):**
     - Giao tiếp tiếng Việt tự nhiên (*"mình – bạn"*), thu âm qua App (consent `U3V`), LLM trả lời dựa trên chính tính cách + tâm trạng thật từ thiết bị truyền lên (`PetSelf`), dạy kiến thức mới và ghi nhận vào **Evolution Journal** (*"Vì sao XUNA thay đổi"*).

---

## BƯỚC 4: TÀI NGUYÊN ĐÃ ĐỒNG BỘ SẴN TRONG REPO (KHÔNG CẦN REPO `xuna_pet` VẪN CHẠY ĐƯỢC)

Toàn bộ tài nguyên từ repo `xuna_pet` và bộ Design System đã được đóng gói sẵn trong repo này:
- **Fonts (`public/fonts/`):**
  - Bộ font chuẩn `ATELIER MACHINE`: `SpaceGrotesk-400.ttf`, `SpaceGrotesk-500.ttf`, `SpaceGrotesk-600.ttf`, `SpaceGrotesk-700.ttf`, `IBMPlexMono-400.ttf`, `IBMPlexMono-500.ttf`.
  - Bộ font phụ trợ tiếng Việt: `BeVietnamPro-*.ttf`, `JetBrainsMono-*.ttf`, `Anton-Regular.ttf`.
- **Pixel Art Sprites & Scene Configs (`public/xuna-sync/`):**
  - `sprites/pet_frames.png`, `sprites/track_a_frames.png`, `sprites/xuna_emotion_sheet_v2.png`, `sprites/pet_lcd_preview.png`, `sprites/room_background.png`, `sprites/scene_backdrops.png`, `sprites/xuna_avatar_round_512.png`, `sprites/xuna_stickers_round_512.png`.
  - `animated_scene.json`, `scene_config.json`, `xuna_scene.json`.
- **Dữ liệu Kỹ thuật & Phụ đề (`src/data/`):**
  - [`src/data/xunaSyncData.ts`](./src/data/xunaSyncData.ts): Số liệu 46 native test suites, 14 parity traces, và C++11 code snapshots thật từ `xuna_core`.
  - [`src/data/ep01Captions.ts`](./src/data/ep01Captions.ts) & `public/audio/voiceover/ep01-vi.captions.json`: 366 word-level timestamps tiếng Việt.
- **Audio (`public/audio/`):**
  - `bgm/house-vibez.mp3` và 8 hiệu ứng âm thanh cơ khí/tactile trong `sfx/`.

---

## BƯỚC 5: KIẾN TRÚC 3 CỖ MÁY ISOMETRIC (`anatomy`) & CÁC SCENE CẦN TRIỂN KHAI

Khi người dùng yêu cầu bắt đầu code các component và scene cho Flagship Video (`9:16`, `1080×1920`, `60fps`, thời lượng `60–90s`), hãy kết hợp chặt chẽ **Design System `ATELIER MACHINE`** + **`anatomy`** + **`video-shotcraft`**:

1. **Cỗ máy Isometric 1 (`LilygoExplodedMachine.tsx`):**
   - Tách lớp 3D Isometric chiếc mạch `LILYGO T-Display-S3`:
     - Tầng đáy: Flash NVS 2 ngăn A/B (`life0` / `life1`) + CRC32 guard.
     - Tầng giữa: Bộ não `LifeCore` (`ESP32-S3` deterministic C++11).
     - Tầng trên: Màn hình LCD `320×170` hiển thị Pixel Art của XUNA + 2 nút `GPIO0` / `GPIO14`.
2. **Cỗ máy Isometric 2 (`DualSpringAffectMachine.tsx`):**
   - Minh hoạ `Affect.h` bằng 2 chiếc lò xo cơ khí Isometric nối nhau (`Emotion` bật nhanh khi bấm nút `GPIO0`/`GPIO14`, kéo theo khối nặng `Mood` có quán tính trượt trên ray cơ khí).
3. **Cỗ máy Isometric 3 (`TemperamentChamberMachine.tsx`):**
   - Minh hoạ `EvidenceLedger.h` + `Temperament.h` như một bình tích luỹ bằng chứng: từng giọt sự kiện từ nút bấm & hội thoại rơi vào bình, đủ `≥ 4 buổi` (`4 day-part gates`) mới mở chốt đẩy 10 thanh trượt cơ khí (`10 Q1.14 traits`) nhích sang vị trí mới.
4. **6 Scenes theo đúng 6 Template Families của `ATELIER MACHINE`:**
   - Luôn có `BrandHeader` (`.am-header`) và `BrandFooter` (`.am-footer`) nằm trong vùng an toàn `9:16` (`x: 72–920`, `y: 250–1470`), sử dụng bảng màu `--paper`, `--ink`, `--lime`, `--lilac`, `--orange`, viền `3px` vuông vức, không đổ bóng/gradient.

