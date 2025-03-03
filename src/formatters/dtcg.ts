import type { Formatter } from "./index";

/**
 * Design Tokens Community Group format.
 *
 * Spec: https://design-tokens.github.io/community-group/format/
 *
 * Each shade becomes a token whose `$value` is the hex string. We don't
 * emit `$value` as a structured color object (with separate channels)
 * because the spec for that piece is still in flux as of early 2025 —
 * tools like Style Dictionary accept the hex string form everywhere.
 */
export const dtcgFormatter: Formatter = ({ name, palette }) => {
  const tokens: Record<string, { $type: string; $value: string }> = {};
  for (const [shade, color] of Object.entries(palette)) {
    tokens[shade] = { $type: "color", $value: color };
  }
  return JSON.stringify({ [name]: tokens }, null, 2);
};
