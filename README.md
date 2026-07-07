# ระบบค้นหาสารหล่อลื่น GC-M PTA

เว็บแอปค้นหาอุปกรณ์และสารหล่อลื่นสำหรับ GC-M PTA รวมข้อมูลจาก 3 แผนก (ME/EE/IE) เข้าเป็นระบบค้นหาเดียว รองรับการค้นหาด้วย EQ Tag หรือคำทั่วไป (เช่น "Compressor", "Pump") พร้อมให้คะแนนความตรงของผลลัพธ์

## เทคโนโลยี

React + TypeScript + Vite, ไม่มี UI framework (CSS Modules ล้วน), Vitest สำหรับเทส

## เริ่มต้นใช้งาน

```bash
npm install
npm run build:data   # แปลงไฟล์ Excel ใน data/raw/ เป็น src/data/*.generated.json
npm run dev          # เปิด dev server
npm test             # รันเทส
npm run build        # build สำหรับ production (ตรวจ type + build)
```

## โครงสร้างข้อมูล

ข้อมูลต้นฉบับ (ไฟล์ Excel จริง) อยู่ที่ `data/raw/` — ดูวิธีอัปเดตข้อมูลเมื่อมี revision ใหม่ได้ที่ [`data/raw/README.md`](./data/raw/README.md) เมื่อไฟล์ในโฟลเดอร์นั้นเปลี่ยน ระบบจะสร้าง `src/data/lubricants.generated.json` ใหม่โดยอัตโนมัติผ่าน GitHub Action (`.github/workflows/build-data.yml`)

## อัลกอริทึมค้นหา

การให้คะแนนความตรงของแท็กอุปกรณ์ (`src/lib/scoring.ts`, `src/lib/normalizeTag.ts`) ถูกออกแบบให้จัดการกับความไม่สอดคล้องของรูปแบบแท็กระหว่างแผนก (เช่น ME เรียก `PP-503AB` แต่ EE เรียกอุปกรณ์ตัวเดียวกันว่า `PPM-503A/B`) โดยไม่รวมแท็กที่ต่างกันโดยบังเอิญ (เช่น อุปกรณ์คนละชนิดที่บังเอิญใช้เลขรันเดียวกัน) เข้าด้วยกัน — ดูรายละเอียดและเหตุผลในคอมเมนต์ของไฟล์นั้น
