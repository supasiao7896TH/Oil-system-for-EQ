# ไฟล์ข้อมูลสารหล่อลื่น (แหล่งข้อมูลหลัก)

โฟลเดอร์นี้เก็บไฟล์ Excel ต้นฉบับที่เป็น **แหล่งข้อมูลจริง** ของระบบค้นหา เว็บไซต์ไม่ได้อ่านไฟล์เหล่านี้โดยตรง — ทุกครั้งที่ไฟล์ในนี้เปลี่ยน ระบบอัตโนมัติ (GitHub Action) จะรัน `npm run build:data` เพื่อแปลงข้อมูลเป็น `src/data/lubricants.generated.json` แล้ว commit ให้เอง เว็บที่ deploy จะอัปเดตภายในไม่กี่นาที

## เมื่อมี revision ใหม่ ให้ทำตามนี้

1. ตั้งชื่อไฟล์ให้ตรงรูปแบบเดิมทุกประการ (เปลี่ยนแค่เลข revision):
   - `Lubricant_List_Of_GCM_PTA_MM_Rev.0X.xlsx` (ข้อมูลแผนก ME)
   - `Lubricant_List_Of_GCM_PTA_EE_Rev.0X.xlsx` (ข้อมูลแผนก EE)
   - `Lubricant_List_Of_GCM_PTA_IE_Rev.0X.xlsx` (ข้อมูลแผนก IE)
2. อัปโหลดไฟล์ใหม่มาแทนที่ไฟล์เดิมในโฟลเดอร์นี้ผ่านหน้าเว็บ GitHub ได้เลย (ไม่ต้องมีเครื่องมือพัฒนา):
   - เปิดโฟลเดอร์ `data/raw/` บน GitHub → คลิกไฟล์เดิม → คลิก "Delete file" หรือ "Upload files" เพื่ออัปโหลดไฟล์ใหม่ทับ → ตั้งชื่อ commit แล้วกด commit ตรง `main`/branch ที่ deploy อยู่
   - ระบบจะสร้างข้อมูลใหม่และ deploy ให้อัตโนมัติ ไม่ต้องรันคำสั่งใดๆ เอง
3. ไฟล์ต้องเป็น `.xlsx` (Excel 2007+) เท่านั้น — ถ้ามีต้นฉบับเป็น `.xls` (Excel 97-2003) ให้เปิดด้วย Excel แล้ว "Save As" เป็น `.xlsx` ก่อนอัปโหลด (เดิม xlrd/`xlsx`(npm) รองรับ `.xls` แต่ pipeline นี้ตั้งใจใช้เฉพาะ `.xlsx` เพื่อเลี่ยงไลบรารีที่มีช่องโหว่ความปลอดภัยที่ยังไม่มีแพตช์)

## โครงสร้างที่ parser คาดหวังในแต่ละไฟล์

### MM (ME) — ชีท `Plant#1`, `Plant#2`, `Plant#3`, `OSBL.`
แถวหัวตาราง 2 แถว: `EQ Tag No.` / `EQ Name` หรือ `EQ Type` / `No. of EQ` / `Part to be Lubricated` / `No. of Part` / `GCMP use` / `Old name` / `Vendor recommend` / `Type` / `Unit` / `Make up`(`Interval`,`Qty / part`) / `Replace`(`Interval`,`Qty / part`) ข้อมูลเริ่มหลังแถวหัวตาราง ถ้าช่อง `EQ Tag No.` ว่าง หมายถึงต่อจากแถวก่อนหน้า (อุปกรณ์เดียวกัน มีจุดหล่อลื่นหลายจุด)

ชีทอื่นในไฟล์นี้ (`Common gearbox oil list...`, `Oil stock total`) **ไม่ถูกใช้** โดยระบบค้นหา

### EE — ชีท `GC-M PTA#1/2/3/OSBL Final`
คอลัมน์ `EQ Tag No.`, `EQ Type`, `Part to be Lubricated` อยู่ 3 คอลัมน์แรกเสมอ ตามด้วยคอลัมน์ว่างจำนวนมาก (เทมเพลตเก่า ไม่ได้ใช้งาน) แล้วตามด้วย `GCMP use`, `Old name`, `type`, `Unit`, `Make up`(`Interval`,`Qty / part`), `Replace`(`Interval`,`Qty / part`) — **ตำแหน่งคอลัมน์ `GCMP use` ขยับได้ในแต่ละชีท** ระบบค้นหาตำแหน่งจากข้อความหัวตาราง ไม่ได้ fix ตำแหน่งไว้ตายตัว ดังนั้นห้ามลบ/แทรกข้อความหัวตาราง `GCMP use` ผิดตำแหน่ง

### IE — เฉพาะชีท `Lubricant_Grease`
`EQ Tag No.` / `EQ Type` / `GCMP use` / `Name of part use` / `Type` / `Maker/Code recommend` / `Equivalent` / `Unit` / `Make up`(`Interval`,`Qty / part`) / `Replace`(`Interval`,`Qty / part`) ช่อง `EQ Tag No.` ว่าง = ต่อจากแถวก่อนหน้าเช่นเดียวกับ ME

ชีทอื่นในไฟล์นี้ (`Grease_*`, `Oil_*`, `ListOfPistonCylinderValves`) เป็นรายการเครื่องมือวัด/วาล์วแยกต่างหาก **ไม่ถูกใช้** โดยระบบค้นหานี้

## ถ้า build ล้มเหลวหลังอัปโหลดไฟล์ใหม่

ดู log ของ GitHub Action ที่แท็บ "Actions" — ตัว parser จะแจ้ง error ทันทีถ้าหาคอลัมน์ที่คาดไว้ (เช่น `GCMP use`) ไม่เจอ หรือถ้าโครงสร้างหัวตารางเปลี่ยนไปจากเดิม กรณีนี้มักแปลว่ามีคนแก้โครงสร้างไฟล์ Excel (เพิ่ม/ลบคอลัมน์ เปลี่ยนชื่อหัวตาราง) — ต้องแจ้งทีมพัฒนาให้ปรับ parser ตาม
