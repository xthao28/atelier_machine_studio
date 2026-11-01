# ATELIER MACHINE — Programmatic Video Studio (XUNA)

Repository công cụ dựng video tự động bằng code (**Remotion 4 + TypeScript + Tailwind CSS + Three.js + Shiki + AI Skills `video-shotcraft` & `anatomy`**) theo chuẩn Design System **ATELIER MACHINE** (*"Making Machines Feel Alive."*) cho dự án **XUNA — AI Evolving Pixel Pet**.

---

## Khởi chạy nhanh trên máy mới (Copy câu lệnh dưới đây gửi cho AI Agent)

Sau khi `git clone` repo này về máy mới, bạn chỉ cần mở AI Agent (Claude / Antigravity / Cursor) và nhắn đúng câu này:

> **"Hãy đọc file `AI_ONBOARDING.md` và `DESIGN_SYSTEM.md`, sau đó chạy cài đặt dependencies cùng các AI Agent Skills cần thiết (`npm run setup:skills`) để sẵn sàng làm việc tiếp."**

---

## Các tài liệu quan trọng trong Repo

1. **[`AI_ONBOARDING.md`](./AI_ONBOARDING.md):** Hướng dẫn từng bước cho AI Agent khi clone sang máy mới (cài đặt `node_modules`, clone 2 bộ skill `video-shotcraft` & `anatomy`, bối cảnh kỹ thuật 5 chặng của XUNA, và danh sách tài nguyên đã đồng bộ sẵn).
2. **[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md):** Toàn bộ đặc tả Design System chính thức của **ATELIER MACHINE** (Color Tokens, Typography `Space Grotesk` + `IBM Plex Mono`, Safe Zones `9:16`, 15 Graphic Language Elements, 6 Template Families, 29 Components).
3. **[`design-system-artifact/project/`](./design-system-artifact/project/):** Nguồn chuẩn của design system (`tokens.json`, `components/bundle.css`, README từng component). Chạy `npm run ds:build` để sinh lại [`src/styles/tokens.css`](./src/styles/tokens.css), [`src/styles/atelier-machine.css`](./src/styles/atelier-machine.css) và [`src/design-system/tokens.ts`](./src/design-system/tokens.ts); không sửa tay các file sinh ra.

---

## Các lệnh CLI thường dùng

```bash
# 1. Cài đặt thư viện
npm install --legacy-peer-deps

# 2. Tải 2 bộ AI Agent Skills (video-shotcraft & anatomy) vào .agents/skills/
npm run setup:skills

# 3. Mở giao diện Remotion Studio
npm run dev
```
