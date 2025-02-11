import { converter, formatHex, parse } from "culori";

const toOklch = converter("oklch");
const toRgb = converter("rgb");

export interface OklchColor {
  l: number;
  c: number;
  h: number;
}

/**
 * Parse a hex color into OKLCH coordinates.
 *
 * Returns { l, c, h } where:
 *   - l (lightness)  : 0..1
 *   - c (chroma)     : 0..~0.4 in practice
 *   - h (hue, deg)   : 0..360 (NaN for greys)
 */
export function hexToOklch(hex: string): OklchColor {
  const parsed = parse(hex);
  if (!parsed) {
    throw new Error(`Invalid color: ${hex}`);
  }
  const o = toOklch(parsed);
  // Achromatic colors (greys, near-greys) produce NaN for hue. We keep the
  // hue at 0 — the chroma will also be ~0 so the hue choice doesn't matter
  // visually, but downstream code (e.g. CSS `oklch()` serialisation) can't
  // accept NaN.
  return {
    l: o?.l ?? 0,
    c: o?.c ?? 0,
    h: Number.isFinite(o?.h) ? (o!.h as number) : 0,
  };
}

export function isAchromatic(color: OklchColor, threshold = 0.005): boolean {
  return color.c < threshold;
}

/**
 * Build a hex color from OKLCH coordinates.
 *
 * The result is clamped to the sRGB gamut before being serialised, so
 * out-of-gamut combinations (very saturated yellows, deep blues) are
 * rendered to the closest in-gamut hex.
 */
export function oklchToHex(color: OklchColor): string {
  const rgb = toRgb({ mode: "oklch", l: color.l, c: color.c, h: color.h });
  if (!rgb) {
    throw new Error(`Could not convert OKLCH ${JSON.stringify(color)} to rgb`);
  }
  return formatHex(rgb)!;
}
