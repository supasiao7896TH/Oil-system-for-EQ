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
  { name: "Plant#1", plant: "Plant#1" },
  { name: "Plant#2", plant: "Plant#2" },
  { name: "Plant#3", plant: "Plant#3" },
  { name: "OSBL.", plant: "OSBL" },
];

const HEADER_ROW = 2;
const SUBHEADER_ROW = 3;

export async function parseME(path: string): Promise<LubricantRecord[]> {
  const workbook = await loadWorkbook(path);
  const records: LubricantRecord[] = [];

  for (const { name: sheetName, plant } of SHEETS) {
    const sheet = getSheet(workbook, sheetName);
    const maxCol = sheet.columnCount;
    const header1 = getRowValues(sheet, HEADER_ROW, maxCol);
    const header2 = getRowValues(sheet, SUBHEADER_ROW, maxCol);

    const tagCol = findColumnByHeader(header1, "EQ Tag No.");
    const typeCol =
      findColumnByHeader(header1, "EQ Name") !== -1
        ? findColumnByHeader(header1, "EQ Name")
        : findColumnByHeader(header1, "EQ Type");
    const partCol = findColumnByHeader(header1, "Part to be Lubricated");
    const gcmpCol = findColumnByHeader(header1, "GCMP use");
    const lubeTypeCol = findColumnByHeader(header1, "Type");
    const unitCol = findColumnByHeader(header1, "Unit");
    const makeupCol = findColumnByHeader(header1, "Make up");
    const replaceCol = findColumnByHeader(header1, "Replace");

    for (const [label, col] of Object.entries({
      tagCol,
      typeCol,
      partCol,
      gcmpCol,
      lubeTypeCol,
      unitCol,
      makeupCol,
      replaceCol,
    })) {
      if (col === -1) {
        throw new Error(
          `ME sheet "${sheetName}": could not find header column for "${label}". Header row was: ${JSON.stringify(header1)}`,
        );
      }
    }

    if (
      header2[makeupCol - 1]?.toLowerCase() !== "interval" ||
      header2[makeupCol]?.toLowerCase().startsWith("qty") !== true ||
      header2[replaceCol - 1]?.toLowerCase() !== "interval" ||
      header2[replaceCol]?.toLowerCase().startsWith("qty") !== true
    ) {
      throw new Error(
        `ME sheet "${sheetName}": Make up/Replace sub-header layout did not match expected "Interval"/"Qty / part" pattern. Row was: ${JSON.stringify(header2)}`,
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
        id: `ME-${sheetName}-${dataRowIndex++}`,
        Source: "ME",
        Plant: plant,
        EQ_Tag: tag,
        EQ_Type: row[typeCol - 1] ?? "",
        Part: row[partCol - 1] ?? "",
        GCMP_use: row[gcmpCol - 1] ?? "",
        Lube_Type: normalizeLubeType(row[lubeTypeCol - 1] ?? ""),
        Unit: row[unitCol - 1] ?? "",
        Makeup_Interval: row[makeupCol - 1] ?? "",
        Makeup_Qty: row[makeupCol] ?? "",
        Replace_Interval: row[replaceCol - 1] ?? "",
        Replace_Qty: row[replaceCol] ?? "",
      });
    }
  }

  return records;
}
