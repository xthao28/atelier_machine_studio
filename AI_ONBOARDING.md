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
   - **Quy tắc bất di bất dịch (Style Thiết Kế Mới — Warm Cream Grid-Free Editorial):**
     - Phong cách: **Contemporary Retro-Futurism Minimalist Editorial** (tối giản, sạch sẽ, không rối mắt).
     - **Bỏ lưới nền (`grid={false}`):** KHÔNG vẽ lưới kỹ thuật (`am-gridbg`) đè lên nền video. Bố cục phân tách bằng các thẻ card phẳng viền `3px solid #242424` rõ ràng.
     - **Flat 100%:** Không đổ bóng (`no shadows`), không chuyển sắc (`no gradients`), không phát sáng (`no glow`), không hiệu ứng glitch/blur.
     - **Bảng màu ấm sáng (`tokens.json` / `tokens.css`):**
       - Nền chính (`--paper`): `#F4EFE4` (kem sáng ấm dịu mắt, tuyệt đối không dùng trắng chói `#FFFFFF` hay xám lạnh).
       - Nền thẻ card (`--card`): `#FAF8F3` (kem sáng nổi nhẹ trên nền `#F4EFE4`).
       - Nền phụ / thanh tiêu đề card (`--paper-shade`): `#E7DFCF` (vàng cát ấm).
       - Mực & viền (`--ink`): `#242424`; chữ phụ (`--ink-soft`): `#5C584F`; chữ mờ (`--paper-soft`): `#8A8478`.
       - Điểm nhấn (`Accents`): `--orange: #FF9B56` (`Xuân` / `Xuna`, Twin B, nhãn người đọc) và `--lime: #D9F57A` (kỹ thuật, Twin A, từ đang đọc).
     - **Quy tắc Đa Ngôn Ngữ (`vi` vs `en`) & Tên Nhân Vật (`"Xuna"`):**
       - **Cả 2 bản Tiếng Việt (`vi`) và Tiếng Anh (`en`):** Tên nhân vật hiển thị trên màn hình (tiêu đề, thẻ card, phụ đề) thống nhất là **`"Xuna"`** (chỉ viết hoa chữ `X` đầu tiên).
       - **Mẹo phát âm chuẩn `"Xuna"` cho AI Tiếng Việt (`tts_text` vs `text`):** Trong [`scripts/generate-reel01-tts.py`](./scripts/generate-reel01-tts.py), chuỗi `text` hiển thị phụ đề giữ nguyên `"Xuna"`, còn chuỗi `tts_text` gửi vào `vi-VN-NamMinhNeural` được tách âm tiết thành **`"Xu na"`** để giọng đọc AI tiếng Việt phát âm mượt chuẩn `/su na/` ("Xuna") mà không bị đánh vần từng chữ cái.
       - **Thuần Việt 100% ở bản `vi`:** Giao diện bản Việt phải thuần Việt 100%, chỉ giữ tiếng Anh cho các thuật ngữ phần cứng/kỹ thuật bắt buộc (`Xuna`, `AI`, `Pixel Art`, `LILYGO T-Display-S3`, `ESP32-S3`, `C++11`, `Flash NVS`, `CRC32`, `GPIO0 / GPIO14`). Mọi text có dấu tiếng Việt dùng font `"Be Vietnam Pro"` (`FONT_SANS`).
     - **Thiết kế Phụ đề đồng bộ (`SubtitleCardStrip` & `<AmCaptionRail>`):**
       - Phụ đề đặt trong thẻ card rộng full-width `936px` (`left: 72`, `right: 72`, `top: 1394` trên Reel hoặc `1492` dưới Footer), nền `#FAF8F3`, viền `3px solid #242424`, có thanh tiêu đề `#E7DFCF` phía trên (gồm nhãn người đọc nền cam + bộ đếm beat/timecode + cột sóng âm equalizer) và phần chữ highlight từng từ phía dưới (từ đang đọc tô hộp `#D9F57A` hoặc `#FF9B56` viền `2px solid #242424`).
     - **Giọng đọc Neural TTS (`scripts/generate-reel01-tts.py`):**
       - Sử dụng `edge-tts` (`vi-VN-NamMinhNeural` cho bản Việt và `en-US-BrianNeural` cho bản Anh), tăng tốc `1.16x` (`ffmpeg -filter:a atempo=1.16`) và xuất word-timestamp tự động vào `src/data/reel01VoiceData.ts`.
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

