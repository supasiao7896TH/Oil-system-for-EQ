import { describe, expect, it } from "vitest";
import { normalizeTag, parseTagCore } from "../normalizeTag.ts";

describe("normalizeTag", () => {
  it("uppercases and strips separators", () => {
    expect(normalizeTag("PP-503AB")).toBe("PP503AB");
    expect(normalizeTag("PPM-503A/B")).toBe("PPM503AB");
    expect(normalizeTag("2pp-503ab")).toBe("2PP503AB");
  });
});

describe("parseTagCore", () => {
  it("splits prefix/code/num/suffix", () => {
    expect(parseTagCore("PP503AB")).toEqual({ prefix: "", code: "PP", num: "503", suffix: "AB" });
    expect(parseTagCore("2PP503AB")).toEqual({ prefix: "2", code: "PP", num: "503", suffix: "AB" });
    expect(parseTagCore("PPM503AB")).toEqual({ prefix: "", code: "PPM", num: "503", suffix: "AB" });
  });

  it("returns null for tags that don't fit the single letters-then-digits shape", () => {
    // instrument-style tags have multiple alternating letter/digit runs and fall back
    // to substring matching in scoreTagQuery instead.
    expect(parseTagCore("5A6IS1PTAINS2IELV2104")).toBeNull();
    expect(parseTagCore("")).toBeNull();
  });
});
