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
 * The 11-stop Tailwind curve targets ~0.08 OKLCH-L between adjacent shades.
 * Anything below ~0.05 reads as "I can't tell these apart in a list of
 * swatches" — which is exactly what we want to flag.
 */
export const ADJACENT_PAIR_MIN_DELTA = 0.05;

export interface ContrastIssue {
  kind: "adjacent-too-close";
  from: string;
  to: string;
  delta: number;
  threshold: number;
}

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
  return issues;
}
