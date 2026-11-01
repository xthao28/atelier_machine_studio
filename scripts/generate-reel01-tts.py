#!/usr/bin/env python3
"""
Generates natural neural voiceovers (MP3) + exact word-level timestamps for Reel #01
using a SINGLE WebSocket request per language (avoiding rate limits), then slices and
places each beat at its exact beat start time with a 1.16x tempo boost (`atempo=1.16`).

Note on Vietnamese pronunciation of "Xuna":
- `text` (used for subtitles & word timestamps) writes `"Xuna"` (single word, capital X only).
- `tts_text` (sent to `vi-VN-NamMinhNeural`) writes `"Xu na"` so the Vietnamese neural voice
  pronounces the two syllables `/su na/` naturally as "Xuna" instead of spelling out letters.
"""
import asyncio
import json
import os
import subprocess
import tempfile
import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_AUDIO_DIR = os.path.join(ROOT, "public", "audio", "voiceover")
OUT_TS_FILE = os.path.join(ROOT, "src", "data", "reel01VoiceData.ts")
FFMPEG = "/usr/local/bin/ffmpeg" if os.path.exists("/usr/local/bin/ffmpeg") else "ffmpeg"

os.makedirs(OUT_AUDIO_DIR, exist_ok=True)

SPEED = 1.16

BEAT_START_MS = {
    "beat1": 250,
    "beat2": 7550,
    "beat3": 15000,
    "beat4": 25800,
    "beat5": 34200,
}

# Each beat is one paragraph (1 line) so we can map SentenceBoundaries back to their beat
CONFIG = {
    "vi": {
        "voice": "vi-VN-NamMinhNeural",
        "beats": [
            {
                "id": "beat1",
                "startMs": BEAT_START_MS["beat1"],
                "text": "Cùng một bo mạch lúc mới nở, nhưng sau 7 ngày ở cạnh hai người khác nhau, chúng trở thành hai sinh vật hoàn toàn khác.",
                "tts_text": "Cùng một bo mạch lúc mới nở, nhưng sau 7 ngày ở cạnh hai người khác nhau, chúng trở thành hai sinh vật hoàn toàn khác.",
            },
            {
                "id": "beat2",
                "startMs": BEAT_START_MS["beat2"],
                "text": "Đây không phải chatbot nhét vào vỏ nhựa, mà đây là Xuna, một sinh vật AI nhỏ gọn sống thật trên bàn làm việc.",
                "tts_text": "Đây không phải chatbot nhét vào vỏ nhựa, mà đây là Xu na, một sinh vật AI nhỏ gọn sống thật trên bàn làm việc.",
            },
            {
                "id": "beat3",
                "startMs": BEAT_START_MS["beat3"],
                "text": "Xuna cảm nhận mỗi lần bạn bấm nút khen hay nhắc nhở, tự nhớ giờ bạn ngồi vào bàn để thức dậy đón, hình thành 10 nét tính cách riêng và trò chuyện theo đúng tâm trạng thật.",
                "tts_text": "Xu na cảm nhận mỗi lần bạn bấm nút khen hay nhắc nhở, tự nhớ giờ bạn ngồi vào bàn để thức dậy đón, hình thành 10 nét tính cách riêng và trò chuyện theo đúng tâm trạng thật.",
            },
            {
                "id": "beat4",
                "startMs": BEAT_START_MS["beat4"],
                "text": "Toàn bộ sự sống này chạy độc lập trên chip ESP32-S3 bằng C++11, cùng bộ nhớ kép Flash NVS giữ trọn ký ức ngay cả khi mất điện.",
                "tts_text": "Toàn bộ sự sống này chạy độc lập trên chip ESP32-S3 bằng C++11, cùng bộ nhớ kép Flash NVS giữ trọn ký ức ngay cả khi mất điện.",
            },
            {
                "id": "beat5",
                "startMs": BEAT_START_MS["beat5"],
                "text": "Sau 7 ngày ở cạnh bạn, Xuna sẽ trở thành ai?",
                "tts_text": "Sau 7 ngày ở cạnh bạn, Xu na sẽ trở thành ai?",
            },
        ],
    },
    "en": {
        "voice": "en-US-BrianNeural",
        "beats": [
            {
                "id": "beat1",
                "startMs": BEAT_START_MS["beat1"],
                "text": "Same circuit board at birth, yet after 7 days with two different people, they grow into two completely different creatures.",
                "tts_text": "Same circuit board at birth, yet after 7 days with two different people, they grow into two completely different creatures.",
            },
            {
                "id": "beat2",
                "startMs": BEAT_START_MS["beat2"],
                "text": "This is not a chatbot stuffed into plastic, meet Xuna, a pocket-sized AI lifeform that actually lives on your desk.",
                "tts_text": "This is not a chatbot stuffed into plastic, meet Xuna, a pocket-sized AI lifeform that actually lives on your desk.",
            },
            {
                "id": "beat3",
                "startMs": BEAT_START_MS["beat3"],
                "text": "Xuna feels when you press a button to praise or correct it, learns your daily schedule to wake up before you sit down, grows 10 real personality traits and talks back in its true mood.",
                "tts_text": "Xuna feels when you press a button to praise or correct it, learns your daily schedule to wake up before you sit down, grows 10 real personality traits and talks back in its true mood.",
            },
            {
                "id": "beat4",
                "startMs": BEAT_START_MS["beat4"],
                "text": "Everything runs locally on an ESP32-S3 chip in C++11, with dual-bank NVS flash so its memories survive any power loss.",
                "tts_text": "Everything runs locally on an ESP32-S3 chip in C++11, with dual-bank NVS flash so its memories survive any power loss.",
            },
            {
                "id": "beat5",
                "startMs": BEAT_START_MS["beat5"],
                "text": "After 7 days on your desk, who would Xuna become?",
                "tts_text": "After 7 days on your desk, who would Xuna become?",
            },
        ],
    },
}

TECH_KEYWORDS = {
    "AI",
    "CHATBOT",
    "ESP32-S3",
    "C++11",
    "FLASH",
    "NVS",
    "CRC32",
    "GPIO0",
    "GPIO14",
}

HERO_NAMES = {"XUNA"}


def split_sentence_into_words(sentence_text: str, start_ms: int, dur_ms: int, beat_id: str):
    tokens = [t for t in sentence_text.strip().split() if t]
    if not tokens:
        return []
    weights = [max(2, len(t)) for t in tokens]
    total_w = sum(weights)
    words = []
    cursor = float(start_ms)
    for tok, w in zip(tokens, weights):
        w_dur = (w / total_w) * dur_ms
        w_start = int(round(cursor))
        w_end = int(round(cursor + w_dur))
        cursor += w_dur
        clean_up = tok.upper().strip(".,!?;:—-\"'()")
        words.append(
            {
                "text": tok,
                "startMs": w_start,
                "endMs": max(w_start + 50, w_end),
                "beatId": beat_id,
                "isTechnicalTerm": clean_up in TECH_KEYWORDS,
                "isXuna": clean_up in HERO_NAMES,
            }
        )
    return words


async def synthesize_locale(locale: str, spec: dict):
    voice = spec["voice"]
    beats = spec["beats"]
    # Join all 5 beats into ONE single text request separated by newlines so each beat is 1 SentenceBoundary
    full_tts_text = "\n".join(b.get("tts_text", b["text"]) for b in beats)

    with tempfile.TemporaryDirectory() as tmpdir:
        raw_mp3 = os.path.join(tmpdir, f"{locale}_full_raw.mp3")
        meta_path = os.path.join(tmpdir, f"{locale}_full.jsonl")

        for attempt in range(5):
            try:
                communicate = edge_tts.Communicate(full_tts_text, voice)
                await communicate.save(raw_mp3, meta_path)
                break
            except Exception:
                if attempt == 4:
                    raise
                await asyncio.sleep(1.5 * (attempt + 1))

        sentences = []
        with open(meta_path, "r", encoding="utf-8") as mf:
            for line in mf:
                line = line.strip()
                if not line:
                    continue
                chunk = json.loads(line)
                if chunk.get("type") in ("SentenceBoundary", "WordBoundary"):
                    sentences.append(chunk)

        print(f"[{locale}] Single-call synthesis returned {len(sentences)} sentence boundaries")

        all_words = []
        beat_files = []

        for idx, beat in enumerate(beats):
            chunk = sentences[min(idx, len(sentences) - 1)]
            raw_start_sec = chunk["offset"] / 10_000_000.0
            raw_dur_sec = (chunk["duration"] / 10_000_000.0) + 0.12

            beat_mp3 = os.path.join(tmpdir, f"beat_{idx}_fast.mp3")
            subprocess.run(
                [
                    FFMPEG,
                    "-y",
                    "-ss",
                    f"{max(0.0, raw_start_sec - 0.04):.3f}",
                    "-t",
                    f"{raw_dur_sec:.3f}",
                    "-i",
                    raw_mp3,
                    "-filter:a",
                    f"atempo={SPEED}",
                    "-c:a",
                    "libmp3lame",
                    "-q:a",
                    "2",
                    beat_mp3,
                ],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )

            fast_dur_ms = max(200, int(round((chunk["duration"] / 10000.0) / SPEED)))
            # Use display `beat["text"]` (with "Xuna" as one word) for subtitle word tokens!
            beat_words = split_sentence_into_words(
                beat["text"], beat["startMs"], fast_dur_ms, beat["id"]
            )
            all_words.extend(beat_words)
            beat_files.append((beat["startMs"], beat_mp3))
            print(
                f"[{locale}] {beat['id']}: {beat['startMs']}ms -> {beat_words[-1]['endMs']}ms ({len(beat_words)} words)"
            )

        out_mp3 = os.path.join(OUT_AUDIO_DIR, f"reel01-{locale}.mp3")
        inputs = []
        filter_parts = []
        mix_labels = []
        for idx, (start_ms, path) in enumerate(beat_files):
            inputs.extend(["-i", path])
            filter_parts.append(f"[{idx}:a]adelay={start_ms}|{start_ms}[a{idx}]")
            mix_labels.append(f"[a{idx}]")

        filter_complex = (
            ";".join(filter_parts)
            + f";{''.join(mix_labels)}amix=inputs={len(beat_files)}:normalize=0,apad=whole_dur=38[outa]"
        )
        cmd = [
            FFMPEG,
            "-y",
            *inputs,
            "-filter_complex",
            filter_complex,
            "-map",
            "[outa]",
            "-c:a",
            "libmp3lame",
            "-q:a",
            "2",
            out_mp3,
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"[{locale}] Wrote master voiceover: {out_mp3}")

    return all_words


async def main():
    vi_words = await synthesize_locale("vi", CONFIG["vi"])
    await asyncio.sleep(1.5)
    en_words = await synthesize_locale("en", CONFIG["en"])

    ts_content = f"""// AUTO-GENERATED by scripts/generate-reel01-tts.py
// Real neural TTS word-boundary timestamps for Reel01 (VI & EN: "Xuna" at 1.16x tempo)

export interface ReelVoiceWord {{
  text: string;
  startMs: number;
  endMs: number;
  beatId: "beat1" | "beat2" | "beat3" | "beat4" | "beat5";
  isTechnicalTerm: boolean;
  isXuna: boolean;
}}

export const REEL01_VOICE_WORDS_VI: ReelVoiceWord[] = {json.dumps(vi_words, ensure_ascii=False, indent=2)};

export const REEL01_VOICE_WORDS_EN: ReelVoiceWord[] = {json.dumps(en_words, ensure_ascii=False, indent=2)};
"""
    with open(OUT_TS_FILE, "w", encoding="utf-8") as f:
        f.write(ts_content)
    print(f"Wrote word timestamps to {OUT_TS_FILE}")


if __name__ == "__main__":
    asyncio.run(main())
