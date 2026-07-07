import type { LubricantRecord } from "../data/types.ts";
import { normalizeTag, parseTagCore } from "./normalizeTag.ts";

/**
 * Tunable score tiers. Only EXACT and FUZZY are directly evidenced by the original
 * system's observed behavior (a "PP-503" search scored ME's "PP-503AB" at 100% and
 * EE's "PPM-503A/B" at 35%) — CONTAINS and PARTIAL_ID are reasoned intermediate
 * steps consistent with the legend's "60-85% ใกล้เคียง" band and may need retuning
 * once real usage data is available.
 */
export const TIER = {
  EXACT: 100,
  CONTAINS: 85,
  PARTIAL_ID: 60,
  FUZZY: 35,
  NONE: 0,
} as const;

/** Dice coefficient (bigram overlap) similarity, 0..1. Used only for loose keyword fuzzy-matching. */
function diceCoefficient(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const bigrams = (s: string): string[] => {
    const out: string[] = [];
    for (let i = 0; i < s.length - 1; i++) out.push(s.slice(i, i + 2));
    return out;
  };
  const aBi = bigrams(a);
  const bBi = bigrams(b);
  const remaining = [...bBi];
  let matches = 0;
  for (const bg of aBi) {
    const idx = remaining.indexOf(bg);
    if (idx !== -1) {
      matches++;
      remaining.splice(idx, 1);
    }
  }
  return (2 * matches) / (aBi.length + bBi.length);
}

/**
 * Scores how well a search query matches an equipment tag. Deliberately does NOT
 * fully unify tags that differ by more than plant-prefix/duplicate-suffix (e.g. ME's
 * "PP-503AB" vs EE's "PPM-503A/B" for the same physical pump) — that would be
 * over-fitting the real, inconsistent source data. Instead such near-matches land in
 * the low "partial" tier so they're surfaced without asserting equivalence.
 *
 * Also deliberately does NOT treat "same numeric id, unrelated code" as a match at
 * all (e.g. "PP-503" vs "TM-503") — verified against the real 1612-record dataset,
 * plants reuse the same numbering sequence across unrelated equipment classes
 * (pumps, centrifuges, generators...) constantly, so a bare numeric-id match is
 * coincidence, not a signal that the equipment is related.
 */
export function scoreTagQuery(query: string, tag: string): number {
  const qNorm = normalizeTag(query);
  const tNorm = normalizeTag(tag);
  if (!qNorm || !tNorm) return TIER.NONE;
  if (qNorm === tNorm) return TIER.EXACT;

  const q = parseTagCore(qNorm);
  const t = parseTagCore(tNorm);

  if (q && t) {
    if (q.code === t.code && q.num === t.num) return TIER.EXACT;
    if (
      q.num === t.num &&
      (t.code.includes(q.code) || q.code.includes(t.code)) &&
      Math.abs(q.code.length - t.code.length) <= 1
    ) {
      return TIER.FUZZY;
    }
    if (tNorm.includes(qNorm) || qNorm.includes(tNorm)) return TIER.CONTAINS;
    return TIER.NONE;
  }

  // Fallback for tags that don't fit the plant-code-number-suffix shape (e.g. instrument tags).
  if (tNorm.includes(qNorm) || qNorm.includes(tNorm)) return TIER.CONTAINS;
  return TIER.NONE;
}

const KEYWORD_FIELDS: Array<keyof LubricantRecord> = ["EQ_Type", "GCMP_use", "Part"];

/** Scores a free-text query (e.g. "Compressor", "Pump") against a record's descriptive fields. */
export function scoreKeyword(query: string, record: LubricantRecord): number {
  const q = query.trim().toLowerCase();
  if (!q) return TIER.NONE;

  let best: number = TIER.NONE;
  for (const field of KEYWORD_FIELDS) {
    const value = (record[field] as string).toLowerCase();
    if (!value) continue;
    if (value === q) {
      // Capped below EXACT: EXACT is reserved for confirmed tag identity, so a generic
      // word doesn't misleadingly claim "100% exact" across dozens of unrelated rows.
      best = Math.max(best, TIER.CONTAINS);
    } else if (value.includes(q)) {
      best = Math.max(best, TIER.PARTIAL_ID);
    } else if (diceCoefficient(value, q) >= 0.5) {
      best = Math.max(best, TIER.FUZZY);
    }
  }
  return best;
}

/**
 * Combined score for a query against a record: always tries tag matching against
 * EQ_Tag, and additionally tries keyword matching (against EQ_Type/GCMP_use/Part)
 * whenever the query has no digits (tag queries in this dataset always carry a
 * numeric id) or the tag score came back low, taking whichever is higher.
 */
export function scoreMatch(query: string, record: LubricantRecord): number {
  const tagScore = scoreTagQuery(query, record.EQ_Tag);
  const hasDigit = /\d/.test(query);
  if (!hasDigit || tagScore < TIER.PARTIAL_ID) {
    return Math.max(tagScore, scoreKeyword(query, record));
  }
  return tagScore;
}
