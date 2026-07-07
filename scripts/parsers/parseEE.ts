import type { LubricantRecord } from "../../src/data/types.ts";
import {
  loadWorkbook,
  getSheet,
  getRowValues,
  findColumnByHeader,
  forwardFillTag,
  normalizeLubeType,
} from "./common.ts";

const SHEETS: Array<{ name: string; plant: string }> = [
  { name: "GC-M PTA#1 Final", plant: "Plant#1" },
  { name: "GC-M PTA#2 Final", plant: "Plant#2" },
  { name: "GC-M PTA#3 Final", plant: "Plant#3" },
  { name: "GC-M PTA#OSBL Final", plant: "OSBL" },
];

const HEADER_ROW = 2;
const SUBHEADER_ROW = 3;

export async function parseEE(path: string): Promise<LubricantRecord[]> {
  const workbook = await loadWorkbook(path);
  const records: LubricantRecord[] = [];

  for (const { name: sheetName, plant } of SHEETS) {
    const sheet = getSheet(workbook, sheetName);
    const maxCol = sheet.columnCount;
    const header1 = getRowValues(sheet, HEADER_ROW, maxCol);
    const header2 = getRowValues(sheet, SUBHEADER_ROW, maxCol);

    const tagCol = findColumnByHeader(header1, "EQ Tag No.");
    const typeCol = findColumnByHeader(header1, "EQ Type");
    const partCol = findColumnByHeader(header1, "Part to be Lubricated");
    // The "GCMP use" column shifts position between sheets (a wide block of unused
    // template columns precedes it) — locate it dynamically rather than hardcoding an offset.
    const gcmpCol = findColumnByHeader(header1, "GCMP use");

    if (tagCol === -1 || typeCol === -1 || partCol === -1 || gcmpCol === -1) {
      throw new Error(
        `EE sheet "${sheetName}": could not find one of the required header columns (EQ Tag No./EQ Type/Part to be Lubricated/GCMP use). Header row was: ${JSON.stringify(header1)}`,
      );
    }

    const lubeTypeCol = gcmpCol + 2;
    const unitCol = gcmpCol + 3;
    const makeupIntervalCol = gcmpCol + 4;
    const makeupQtyCol = gcmpCol + 5;
    const replaceIntervalCol = gcmpCol + 6;
    const replaceQtyCol = gcmpCol + 7;

    if (
      header2[makeupIntervalCol - 1]?.toLowerCase() !== "interval" ||
      !header2[makeupQtyCol - 1]?.toLowerCase().startsWith("qty") ||
      header2[replaceIntervalCol - 1]?.toLowerCase() !== "interval" ||
      !header2[replaceQtyCol - 1]?.toLowerCase().startsWith("qty")
    ) {
      throw new Error(
        `EE sheet "${sheetName}": columns after "GCMP use" did not match the expected Old name/type/Unit/Make up(Interval,Qty)/Replace(Interval,Qty) layout. Sub-header row was: ${JSON.stringify(header2)}`,
      );
    }

    let previousTag = "";
    let dataRowIndex = 0;
    for (let r = SUBHEADER_ROW + 1; r <= sheet.rowCount; r++) {
      const row = getRowValues(sheet, r, maxCol);
      const hasAnyValue = row.some((v) => v !== "");
      if (!hasAnyValue) continue;

      const rawTag = row[tagCol - 1] ?? "";
      const tag = forwardFillTag(rawTag, previousTag);
      previousTag = tag;

      records.push({
        id: `EE-${sheetName}-${dataRowIndex++}`,
        Source: "EE",
        Plant: plant,
        EQ_Tag: tag,
        EQ_Type: row[typeCol - 1] ?? "",
        Part: row[partCol - 1] ?? "",
        GCMP_use: row[gcmpCol - 1] ?? "",
        Lube_Type: normalizeLubeType(row[lubeTypeCol - 1] ?? ""),
        Unit: row[unitCol - 1] ?? "",
        Makeup_Interval: row[makeupIntervalCol - 1] ?? "",
        Makeup_Qty: row[makeupQtyCol - 1] ?? "",
        Replace_Interval: row[replaceIntervalCol - 1] ?? "",
        Replace_Qty: row[replaceQtyCol - 1] ?? "",
      });
    }
  }

  return records;
}
