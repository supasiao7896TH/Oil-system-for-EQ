# บริบทโปรเจกต์ OilMate

เอกสารนี้สรุปที่มา การตัดสินใจสำคัญ และเหตุผลเบื้องหลังของแอปนี้ สำหรับคนที่มาต่อยอดงานภายหลัง (คนหรือ AI agent ก็ตาม)

## ที่มา

เดิมโรงงาน GC-M PTA มีเว็บค้นหาสารหล่อลื่น/อุปกรณ์อยู่แล้วที่ `gcmplube.netlify.app` แต่สร้างโดยคนอื่นและไม่มีซอร์สโค้ดอยู่ที่ไหนเลย (repo นี้เดิมมีแค่ README เปล่า ๆ) จึงต้องสร้างใหม่ทั้งหมดจากไฟล์ Excel ต้นฉบับที่แผนก ME/EE/IE ใช้งานจริง แล้ว rebrand เป็น **OilMate** เพื่อไม่ให้เหมือนเว็บเดิม (ชื่อ คำ สี ธีม เปลี่ยนหมด แต่โครงสร้างข้อมูล/คอลัมน์ยังอิงตาม Excel จริงเหมือนเดิม)

## ข้อมูลต้นฉบับ

ไฟล์ Excel จริง 3 ไฟล์ อยู่ที่ `data/raw/` (ดู `data/raw/README.md` สำหรับวิธีอัปเดต revision ใหม่):

- **ME** (`..._MM_Rev.03.xlsx`) — ชีท `Plant#1/2/3`, `OSBL.`
- **EE** (`..._EE_Rev.03.xlsx`) — ชีท `GC-M PTA#1/2/3/OSBL Final` — ตำแหน่งคอลัมน์ `GCMP use` เลื่อนไม่เท่ากันในแต่ละชีท ต้องหาตำแหน่งแบบ dynamic ไม่ hardcode
- **IE** (`..._IE_Rev.03.xlsx`) — ใช้เฉพาะชีท `Lubricant_Grease` (ชีทอื่นเป็นแท็กเครื่องมือวัดคนละ namespace ไม่เอา) บาง row ต้อง forward-fill แท็กอุปกรณ์จาก row บน

ตัวแปลง Excel → JSON อยู่ที่ `scripts/parsers/` เรียกผ่าน `npm run build:data` สร้างไฟล์ที่ `src/data/*.generated.json` ซึ่ง commit เก็บไว้ในโค้ด (แอปไม่ parse Excel ตอน runtime) และมี GitHub Action (`.github/workflows/build-data.yml`) คอย build ใหม่อัตโนมัติเมื่อไฟล์ใน `data/raw/` เปลี่ยน

## อัลกอริทึมค้นหา/ให้คะแนน

จุดยากที่สุดของโปรเจกต์คือแต่ละแผนกตั้งชื่อแท็กอุปกรณ์ตัวเดียวกันไม่ตรงกัน เช่น ME เรียก `PP-503AB` แต่ EE เรียกอุปกรณ์ตัวเดียวกันว่า `PPM-503A/B` ระบบเดิม (เว็บเก่า) ให้คะแนนกรณีนี้ที่ 100% (ME) และ 35% (EE) — ใช้เป็น "oracle" ในการออกแบบ scoring ใหม่

`src/lib/scoring.ts` + `src/lib/normalizeTag.ts` เป็นตัวคำนวณ ระวังอย่าทำ normalize จนแน่นเกินไปจนแท็กคนละอุปกรณ์ที่บังเอิญใช้เลขรันเดียวกัน (เช่น `TM-503`, `EDG#3`) ดันมาแมตช์กับ `PP-503` โดยไม่ตั้งใจ — เคยเจอบั๊กนี้มาแล้วและแก้โดยตัด tier "same numeric id, different code" ออกจาก `scoreTagQuery`

## ธีม/แบรนด์

ชื่อ **OilMate**, ธีมสีปัจจุบันมาจากการให้ผู้ใช้เลือกจาก 3 mockup (Emerald Industrial / Graphite & Safety Orange / Clean Light) — เลือก Clean Light ธีมสีอยู่ใน `src/styles/tokens.css` เป็น CSS custom properties ทั้งหมด เปลี่ยนธีมทำที่ไฟล์เดียวได้

ไอคอนถังน้ำมันในแอป (header, empty state, ไอคอน PWA, favicon) ใช้ emoji 🛢️ (สีฟ้า) **โดยตั้งใจ** — เคยลองเปลี่ยนเป็น SVG วาดเองสีเหลือง (ให้ตรงกับถัง Shell Omala 200L จริงที่ใช้ในโรงงาน) แต่ผู้ใช้ดูแล้วไม่ชอบผลลัพธ์ทั้งสองรอบที่ลอง จึง revert กลับมาใช้ emoji เดิม — **อย่าเปลี่ยนไอคอนนี้อีกโดยไม่ถามก่อน**

## Build target สองแบบ

1. `npm run build` → `dist/` — multi-file, deploy บน Netlify (มี PWA service worker ผ่าน `vite-plugin-pwa`)
2. `npm run build:single` → `standalone/index.html` — ไฟล์ HTML เดียวจบ (inline JS/CSS/font ทั้งหมดเป็น base64) เปิดแบบ `file://` ได้โดยไม่ต้องมีเน็ต ผู้ใช้ขอไว้เพื่อให้ดาวน์โหลดจาก GitHub แล้วเปิดใช้ได้ทันทีแบบเว็บเก่า

ทั้งสอง build ต้องรันผ่านทุกครั้งที่แก้ `src/` แล้ว commit ผลลัพธ์ (`dist/` ไม่ commit แต่ `standalone/index.html` และ `public/icons/*` เป็น committed generated files)

## Deploy

Netlify auto-deploy จาก branch `main` (`verdant-pastelito-9e52ca.netlify.app`) — PR จะถูก merge ผ่าน GitHub web UI โดยผู้ใช้เอง ไม่ต้อง merge เองอัตโนมัติ
