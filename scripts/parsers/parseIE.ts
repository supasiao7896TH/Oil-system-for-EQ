import type { LubricantRecord } from "../../src/data/types.ts";
import {
  loadWorkbook,
  getSheet,
  getRowValues,
  findColumnByHeader,
  forwardFillTag,
  normalizeLubeType,
} from "./common.ts";

const SHEET_NAME = "Lubricant_Grease";
const HEADER_ROW = 2;
const SUBHEADER_ROW = 3;

/**
 * Only the "Lubricant_Grease" sheet feeds the unified search schema (per product decision) —
 * the file's other 9 sheets use a different tag namespace (instrument/valve tags like
 * "5A6IS1-PTA-INS2-IE-LV2104") and are intentionally out of scope.
 */
export async function parseIE(path: string): Promise<LubricantRecord[]> {
  const workbook = await loadWorkbook(path);
  const sheet = getSheet(workbook, SHEET_NAME);
  const maxCol = sheet.columnCount;
  const header1 = getRowValues(sheet, HEADER_ROW, maxCol);
  const header2 = getRowValues(sheet, SUBHEADER_ROW, maxCol);

  const tagCol = findColumnByHeader(header1, "EQ Tag No.");
  const typeCol = findColumnByHeader(header1, "EQ Type");
  const gcmpCol = findColumnByHeader(header1, "GCMP use");
  const partCol = findColumnByHeader(header1, "Name of part use");
  const lubeTypeCol = findColumnByHeader(header1, "Type");
  const unitCol = findColumnByHeader(header1, "Unit");
  const makeupCol = findColumnByHeader(header1, "Make up");
  const replaceCol = findColumnByHeader(header1, "Replace");

  for (const [label, col] of Object.entries({
    tagCol,
    typeCol,
    gcmpCol,
    partCol,
    lubeTypeCol,
    unitCol,
    makeupCol,
    replaceCol,
  })) {
    if (col === -1) {
      throw new Error(
        `IE sheet "${SHEET_NAME}": could not find header column for "${label}". Header row was: ${JSON.stringify(header1)}`,
      );
    }
  }

  if (
    header2[makeupCol - 1]?.toLowerCase() !== "interval" ||
    !header2[makeupCol]?.toLowerCase().startsWith("qty") ||
    header2[replaceCol - 1]?.toLowerCase() !== "interval" ||
    !header2[replaceCol]?.toLowerCase().startsWith("qty")
  ) {
    throw new Error(
      `IE sheet "${SHEET_NAME}": Make up/Replace sub-header layout did not match expected "Interval"/"Qty / part" pattern. Row was: ${JSON.stringify(header2)}`,
    );
  }

  const records: LubricantRecord[] = [];
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
      id: `IE-${SHEET_NAME}-${dataRowIndex++}`,
      Source: "IE",
      Plant: "—",
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

  return records;
}
