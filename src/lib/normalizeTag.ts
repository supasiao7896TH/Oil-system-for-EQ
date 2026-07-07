export interface TagCore {
  prefix: string;
  code: string;
  num: string;
  suffix: string;
}

const TAG_CORE_PATTERN = /^(\d{0,2})([A-Z]+)(\d+)([A-Z]*)$/;

/** Uppercase and strip everything except letters/digits, e.g. "PPM-503A/B" -> "PPM503AB". */
export function normalizeTag(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/**
 * Splits a normalized tag into its identity-bearing parts. `prefix` (an optional leading
 * plant-number digit) and `suffix` (trailing duplicate-unit letters like A/B/C) do not
 * identify the equipment itself — only `code` (equipment class) and `num` (numeric id) do.
 */
export function parseTagCore(normalized: string): TagCore | null {
  const match = TAG_CORE_PATTERN.exec(normalized);
  if (!match) return null;
  const [, prefix, code, num, suffix] = match;
  return { prefix, code, num, suffix };
}
