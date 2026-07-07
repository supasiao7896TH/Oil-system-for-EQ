import { describe, expect, it } from "vitest";
import type { LubricantRecord } from "../../data/types.ts";
import { scoreMatch, scoreTagQuery, TIER } from "../scoring.ts";

function makeRecord(overrides: Partial<LubricantRecord>): LubricantRecord {
  return {
    id: "test",
    Source: "ME",
    Plant: "Plant#1",
    EQ_Tag: "",
    EQ_Type: "",
    Part: "",
    GCMP_use: "",
    Lube_Type: "Oil",
    Unit: "",
    Makeup_Interval: "",
    Makeup_Qty: "",
    Replace_Interval: "",
    Replace_Qty: "",
    ...overrides,
  };
}

// This is the scoring oracle re-encoded directly from the .mht snapshot of the original
// live site: searching "PP-503" scored the ME gearbox rows at 100% and the EE motor-bearing
// rows (same physical pump, tagged "PPM-503A/B" by the EE department) at 35%.
describe("scoreTagQuery — PP-503 oracle", () => {
  it.each(["PP-503AB", "2PP-503AB", "3PP-503AB"])(
    "scores ME tag %s at 100 for query 'PP-503'",
    (tag) => {
      expect(scoreTagQuery("PP-503", tag)).toBe(TIER.EXACT);
    },
  );

  it.each(["PPM-503A/B", "2PPM-503A/B", "3PPM-503A/B"])(
    "scores EE tag %s at 35 for query 'PP-503'",
    (tag) => {
      expect(scoreTagQuery("PP-503", tag)).toBe(TIER.FUZZY);
    },
  );

  it("does not match an unrelated tag", () => {
    expect(scoreTagQuery("PP-503", "PC-201AB")).toBe(TIER.NONE);
  });
});

describe("scoreMatch — full record scoring", () => {
  it("reproduces the oracle end-to-end through scoreMatch", () => {
    const meRow = makeRecord({ Source: "ME", EQ_Tag: "PP-503AB", EQ_Type: "Medium pressure flush water pump" });
    const eeRow = makeRecord({ Source: "EE", EQ_Tag: "PPM-503A/B", EQ_Type: "MP Flush Water Pump" });
    expect(scoreMatch("PP-503", meRow)).toBe(TIER.EXACT);
    expect(scoreMatch("PP-503", eeRow)).toBe(TIER.FUZZY);
  });

  it("matches by keyword when the query has no digits", () => {
    const compressor = makeRecord({ EQ_Tag: "PC-201AB", EQ_Type: "H2 Compressor" });
    const pump = makeRecord({ EQ_Tag: "PP-503AB", EQ_Type: "Medium pressure flush water pump" });
    expect(scoreMatch("Compressor", compressor)).toBeGreaterThan(TIER.NONE);
    expect(scoreMatch("Compressor", pump)).toBe(TIER.NONE);
  });

  it("does not claim a false 100% exact match for a generic keyword", () => {
    const pump = makeRecord({ EQ_Tag: "PP-503AB", EQ_Type: "Medium pressure flush water pump" });
    expect(scoreMatch("Pump", pump)).toBeLessThan(TIER.EXACT);
  });
});
