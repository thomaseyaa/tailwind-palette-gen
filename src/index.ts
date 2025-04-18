import { findContrastIssues, type ContrastIssue } from "./contrast";

export type { ContrastIssue } from "./contrast";
export type { OklchColor } from "./oklch";
import { CHROMA_MULTIPLIERS, LIGHTNESS_STOPS, SHADES } from "./curves";
import { tailwindFormatter } from "./formatters/tailwind";
import { hexToOklch, isAchromatic, OklchColor, oklchToHex } from "./oklch";

export interface Palette {
  [shade: string]: string;
}

export interface OklchPalette {
  [shade: string]: OklchColor;
}

/**
 * Generate the full 11-shade palette as OKLCH coordinates. Useful when you
 * want to emit `oklch()` CSS, design token JSON, or any other format that
 * keeps the perceptual coordinates rather than the sRGB-clamped hex.
 */
export function generatePaletteOklch(hex: string): OklchPalette {
  const clean = hex.replace("#", "");
  if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(clean)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const base = hexToOklch(hex);
  const palette: OklchPalette = {};

  // For achromatic bases (true greys), force chroma to 0 across all shades
  // so the generated palette stays neutral instead of drifting toward an
  // arbitrary hue once we apply the chroma multiplier curve.
  const baseChroma = isAchromatic(base) ? 0 : base.c;

  for (const shade of SHADES) {
    palette[String(shade)] = {
      l: LIGHTNESS_STOPS[shade],
      c: baseChroma * CHROMA_MULTIPLIERS[shade],
      h: base.h,
    };
  }

  return palette;
}

export function generatePalette(hex: string): Palette {
  const oklch = generatePaletteOklch(hex);
  const palette: Palette = {};
  for (const [shade, color] of Object.entries(oklch)) {
    palette[shade] = oklchToHex(color);
  }
  return palette;
}

export function formatAsTailwindConfig(palette: Palette, name: string): string {
  return tailwindFormatter({ name, palette });
}

export interface PaletteAnalysis {
  palette: Palette;
  oklch: OklchPalette;
  contrastIssues: ContrastIssue[];
}

/**
 * One-shot helper that returns the hex palette, the OKLCH palette, and
 * any contrast issues detected in a single call.
 */
export function analyze(hex: string): PaletteAnalysis {
  const oklch = generatePaletteOklch(hex);
  const palette: Palette = {};
  for (const [shade, color] of Object.entries(oklch)) {
    palette[shade] = oklchToHex(color);
  }
  return {
    palette,
    oklch,
    contrastIssues: findContrastIssues(oklch),
  };
}
