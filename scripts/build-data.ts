import { readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { LubricantRecord, RevisionMeta, Source } from "../src/data/types.ts";
import { parseME } from "./parsers/parseME.ts";
import { parseEE } from "./parsers/parseEE.ts";
import { parseIE } from "./parsers/parseIE.ts";
import { extractRevision } from "./parsers/common.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = join(__dirname, "..", "data", "raw");
const OUT_DIR = join(__dirname, "..", "src", "data");

function findRawFile(pattern: RegExp, label: string): string {
  const files = readdirSync(RAW_DIR).filter((f) => pattern.test(f));
  if (files.length !== 1) {
    throw new Error(
      `Expected exactly one ${label} file in data/raw/ matching ${pattern}, found ${files.length}: ${files.join(", ") || "(none)"}`,
    );
  }
  return join(RAW_DIR, files[0]);
}

async function main() {
  const mePath = findRawFile(/^Lubricant_List_Of_GCM_PTA_MM_Rev\.\d+\.xlsx$/i, "ME (MM)");
  const eePath = findRawFile(/^Lubricant_List_Of_GCM_PTA_EE_Rev\.\d+\.xlsx$/i, "EE");
  const iePath = findRawFile(/^Lubricant_List_Of_GCM_PTA_IE_Rev\.\d+\.xlsx$/i, "IE");

  const [meRecords, eeRecords, ieRecords] = await Promise.all([
    parseME(mePath),
    parseEE(eePath),
    parseIE(iePath),
  ]);

  const counts: Record<Source, number> = {
    ME: meRecords.length,
    EE: eeRecords.length,
    IE: ieRecords.length,
  };
  console.log("Parsed record counts:", counts);

  const records: LubricantRecord[] = [...meRecords, ...eeRecords, ...ieRecords];
  if (records.length === 0) {
    throw new Error("Parsed zero records total — refusing to write an empty dataset.");
  }

  const meta: RevisionMeta = {
    meRev: extractRevision(mePath),
    eeRev: extractRevision(eePath),
    ieRev: extractRevision(iePath),
    totalCount: records.length,
    generatedAt: new Date().toISOString(),
  };

  writeFileSync(join(OUT_DIR, "lubricants.generated.json"), JSON.stringify(records, null, 2) + "\n");
  writeFileSync(join(OUT_DIR, "meta.generated.json"), JSON.stringify(meta, null, 2) + "\n");

  console.log(`Wrote ${records.length} records. Revisions: ME=${meta.meRev} EE=${meta.eeRev} IE=${meta.ieRev}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
