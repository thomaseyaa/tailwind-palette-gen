import type { OklchColor } from "./oklch";

/**
 * Perceptual contrast between two OKLCH lightness values, on the 0..1 scale.
 *
 * This is intentionally a simpler metric than WCAG 2.x ratios. The point of
 * this module is to detect "shades that are too close together" inside a
 * generated palette — not to score real-world foreground/background pairs,
 * which `hex-a11y` already does with APCA / WCAG.
 */
export function lightnessDelta(a: OklchColor, b: OklchColor): number {
  return Math.abs(a.l - b.l);
}

/**
 * Heuristic threshold for an adjacent shade pair (e.g. 400 vs 500).
 *
 * The default 11-stop curve has a deliberately flatter 50 -> 100 step
 * (~0.04 OKLCH-L) because the bookend tints feel less distinct anyway.
 * Everything below ~0.035 reads as "I can't tell these apart in a list of
 * swatches" — which is what we want to flag.
 */
export const ADJACENT_PAIR_MIN_DELTA = 0.035;

export interface ContrastIssue {
  kind: "adjacent-too-close" | "spread-too-low";
  from: string;
  to: string;
  delta: number;
  threshold: number;
}

/**
 * Minimum acceptable OKLCH-L spread between the lightest and darkest
 * usable shades (50 and 950). A palette that fails this is essentially
 * a monochromatic family and not very useful as a UI scale.
 */
export const PALETTE_SPREAD_MIN = 0.6;

import type { OklchPalette } from "./index";

/**
 * Walk the palette in shade order and flag adjacent pairs whose OKLCH
 * lightness delta is below the threshold. The result is empty for a
 * well-formed palette built from the default curves.
 */
export function findContrastIssues(
  palette: OklchPalette,
  threshold = ADJACENT_PAIR_MIN_DELTA,
): ContrastIssue[] {
  const shades = Object.keys(palette);
  const issues: ContrastIssue[] = [];
  for (let i = 0; i < shades.length - 1; i++) {
    const a = palette[shades[i]];
    const b = palette[shades[i + 1]];
    const delta = lightnessDelta(a, b);
    if (delta < threshold) {
      issues.push({
        kind: "adjacent-too-close",
        from: shades[i],
        to: shades[i + 1],
        delta,
        threshold,
      });
    }
  }
  // Spread check: lightest vs darkest shade.
  const first = shades[0];
  const last = shades[shades.length - 1];
  const spread = lightnessDelta(palette[first], palette[last]);
  if (spread < PALETTE_SPREAD_MIN) {
    issues.push({
      kind: "spread-too-low",
      from: first,
      to: last,
      delta: spread,
      threshold: PALETTE_SPREAD_MIN,
    });
  }
  return issues;
}
