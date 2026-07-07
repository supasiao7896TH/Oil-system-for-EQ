import { describe, expect, it } from "vitest";
import records from "../lubricants.generated.json";
import type { LubricantRecord } from "../types.ts";

const typedRecords = records as LubricantRecord[];

function countBy(source: string, plant?: string): number {
  return typedRecords.filter((r) => r.Source === source && (plant === undefined || r.Plant === plant)).length;
}

// Regression test against the counts verified directly from the source Excel files —
// catches a silently-shifted column offset (e.g. the EE "GCMP use" column detection)
// producing a wrong total that would otherwise hide behind a coincidentally-plausible sum.
describe("generated lubricants dataset — row counts", () => {
  it("has the expected ME per-plant counts", () => {
    expect(countBy("ME", "Plant#1")).toBe(309);
    expect(countBy("ME", "Plant#2")).toBe(281);
    expect(countBy("ME", "Plant#3")).toBe(244);
    expect(countBy("ME", "OSBL")).toBe(319);
  });

  it("has the expected EE per-plant counts", () => {
    expect(countBy("EE", "Plant#1")).toBe(76);
    expect(countBy("EE", "Plant#2")).toBe(104);
    expect(countBy("EE", "Plant#3")).toBe(97);
    expect(countBy("EE", "OSBL")).toBe(73);
  });

  it("has the expected IE count", () => {
    expect(countBy("IE")).toBe(109);
  });

  it("has the expected grand total", () => {
    expect(typedRecords.length).toBe(1612);
  });

  it("every record has a non-empty EQ_Tag (forward-fill worked)", () => {
    const blanks = typedRecords.filter((r) => r.EQ_Tag === "");
    expect(blanks).toEqual([]);
  });
});
