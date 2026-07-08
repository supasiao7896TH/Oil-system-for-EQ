# คำแนะนำสำหรับ AI Agent ที่มาทำงานต่อในโปรเจกต์นี้

อ่าน `context.md` ก่อนเพื่อรู้ที่มาและการตัดสินใจสำคัญ ไฟล์นี้เป็นแนวทางปฏิบัติเวลาแก้โค้ด

## คำสั่งที่ต้องรู้

```bash
npm run dev           # dev server
npm test               # รัน Vitest (ต้องผ่านทุกครั้งก่อน push)
npm run build          # build หลัก (Netlify, multi-file + PWA)
npm run build:single   # build ไฟล์เดียว → standalone/index.html
npm run build:data     # แปลง data/raw/*.xlsx → src/data/*.generated.json
npm run lint            # oxlint
```

## กฎเวลาแก้โค้ด

1. **แก้ `src/` แล้วต้อง build ทั้งสองแบบเสมอ** (`npm run build` และ `npm run build:single`) แล้ว commit ผลลัพธ์ที่เปลี่ยน (`standalone/index.html`, `public/icons/*.png` ถ้าเกี่ยวข้อง) — ทั้งสองไฟล์นี้เป็น generated แต่ commit ไว้ในโค้ดจริง ไม่ใช่ build artifact ที่ .gitignore
2. **รัน `npm test` ก่อน push ทุกครั้ง** มี 18 เทสอยู่ที่ `src/lib/__tests__/` และ `src/data/__tests__/counts.test.ts` — เทสหลังนี้เช็ค row count ของแต่ละชีท Excel ตรง ถ้าพังแปลว่าตัว parser หรือไฟล์ข้อมูลมีปัญหา
3. **ห้ามแก้ scoring logic (`src/lib/scoring.ts`, `normalizeTag.ts`) โดยไม่รันเทียบกับ oracle เดิม** — ค้นหา "PP-503" ต้องได้ผลลัพธ์ ME 3 แถว (100%) + EE 6 แถว (35%) เป๊ะ ๆ ตามที่เทสระบุไว้ ถ้าคิด tier ใหม่ต้องเช็คไม่ให้แท็กคนละอุปกรณ์ที่บังเอิญเลขรันตรงกันมาแมตช์กันเอง (เคยมีบั๊กนี้มาก่อน)
4. **ห้าม `dangerouslySetInnerHTML`** ในส่วนแสดงผลค้นหา — `HighlightedText.tsx` ต้อง split เป็น React children ธรรมดา ห้ามกลับไปต่อ string HTML เอง (คือช่องโหว่ XSS ที่แก้มาตั้งแต่รีวิวเว็บเก่า)
5. **สีธีมทั้งหมดอยู่ใน `src/styles/tokens.css`** เป็น CSS custom properties — อย่า hardcode สีใหม่ในไฟล์ `.module.css` แต่ละไฟล์ ให้ประกาศ token เพิ่มถ้าจำเป็น
6. **ทดสอบ mobile layout ด้วยการเช็ค `document.documentElement.scrollWidth` vs `clientWidth` จริง ๆ** ไม่ใช่แค่ screenshot แบบ `fullPage: true` เพราะ fullPage capture ทั้งพื้นที่ scroll ได้ จะไม่เห็น overflow บั๊กที่ผู้ใช้จริงเจอบนมือถือ (เคยพลาดมาแล้ว)
7. **ไอคอนถังน้ำมัน (🛢️) ห้ามเปลี่ยนโดยไม่ถามผู้ใช้ก่อน** — เคยลองเปลี่ยนเป็น SVG สีเหลืองสองรอบแล้วโดน revert ทั้งคู่ ถือว่าเป็นเรื่องที่ตัดสินใจแล้วว่าใช้ emoji เดิม
8. **แก้ข้อมูล Excel** ให้แก้ที่ `data/raw/*.xlsx` แล้วรัน `npm run build:data` — ห้ามแก้ `src/data/*.generated.json` ตรง ๆ (จะถูกทับตอน build ใหม่อยู่ดี และ GitHub Action ก็ regenerate อัตโนมัติเมื่อ push ไฟล์ `data/raw/**`)

## Branch / Git

- Branch พัฒนา: `claude/modest-fermi-e38d82` — push ที่นี่เสมอ อย่า push ตรงไป `main`
- ผู้ใช้เป็นคน merge PR เองผ่าน GitHub web UI — อย่า merge เอง อย่า force-push โดยไม่ถาม
- ถ้า branch เดิมถูก merge ไปแล้วและมีงานใหม่ต่อ ให้ restart branch จาก `origin/main` ล่าสุดก่อน (`git fetch origin main && git checkout -B claude/modest-fermi-e38d82 origin/main`) แทนที่จะ stack ทับ history เก่าที่ merge ไปแล้ว
- สื่อสารกับผู้ใช้เป็นภาษาไทยเสมอ (ผู้ใช้เป็นวิศวกรโรงงาน พูดไทย)

## จุดที่ผู้ใช้อยากรอเพิ่มทีหลัง

- `src/components/GuideModal.tsx` มี placeholder ข้อความติดต่อ ("รอข้อมูลช่องทางติดต่อจากทีมงาน") ผู้ใช้บอกว่าจะใส่เอง — ไม่ต้องแก้จนกว่าจะขอ
