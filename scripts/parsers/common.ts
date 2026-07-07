import ExcelJS from "exceljs";

export async function loadWorkbook(path: string): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path);
  return workbook;
}

export function getSheet(
  workbook: ExcelJS.Workbook,
  sheetName: string,
): ExcelJS.Worksheet {
  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }
  return sheet;
}

/** Excel cell values can be strings, numbers, rich text, formula results, or dates. */
export function cellToDisplayString(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : String(value);
  }
  if (typeof value === "string") return value.trim();
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "object") {
    if ("richText" in value && Array.isArray(value.richText)) {
      return value.richText.map((rt) => rt.text).join("").trim();
    }
    if ("result" in value) {
      return cellToDisplayString(value.result as ExcelJS.CellValue);
    }
    if ("text" in value && typeof value.text === "string") {
      return value.text.trim();
    }
  }
  return String(value).trim();
}

export function getRowValues(sheet: ExcelJS.Worksheet, rowNumber: number, maxCol: number): string[] {
  const row = sheet.getRow(rowNumber);
  const values: string[] = [];
  for (let c = 1; c <= maxCol; c++) {
    values.push(cellToDisplayString(row.getCell(c).value));
  }
  return values;
}

function normalizeHeader(text: string): string {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Find the 1-indexed column whose value in the given row matches `text`, comparing
 * case-insensitively with collapsed whitespace (source headers vary in casing and
 * spacing between sheets, e.g. "Vendor recommend" vs "Vendor Recommend"). Returns -1 if not found.
 */
export function findColumnByHeader(rowValues: string[], text: string): number {
  const target = normalizeHeader(text);
  const idx = rowValues.findIndex((v) => normalizeHeader(v) === target);
  return idx === -1 ? -1 : idx + 1;
}

/**
 * Forward-fills a blank EQ tag column: when a row's tag cell is empty, it means
 * the row continues the previous row's equipment (multiple lube points per tag).
 */
export function forwardFillTag(rawTag: string, previousTag: string): string {
  return rawTag !== "" ? rawTag : previousTag;
}

/** Normalizes free-text lube type values (e.g. "oil", "OIL", "Grease ") into the schema's LubeType union. */
export function normalizeLubeType(raw: string): "Oil" | "Grease" | "Other" {
  const t = raw.trim().toLowerCase();
  if (t === "oil") return "Oil";
  if (t === "grease") return "Grease";
  return "Other";
}

/** Extracts the revision number from a filename like "..._MM_Rev.03.xlsx" -> "03". */
export function extractRevision(filename: string): string {
  const match = filename.match(/Rev\.?\s*0*(\d+)/i);
  return match ? match[1] : "?";
}
