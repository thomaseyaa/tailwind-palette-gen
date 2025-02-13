import { CHROMA_MULTIPLIERS, LIGHTNESS_STOPS, SHADES } from "./curves";
import { hexToOklch, isAchromatic, oklchToHex } from "./oklch";

export interface Palette {
  [shade: string]: string;
}

export function generatePalette(hex: string): Palette {
  const clean = hex.replace("#", "");
  if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(clean)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const base = hexToOklch(hex);
  const palette: Palette = {};

  // For achromatic bases (true greys), force chroma to 0 across all shades
  // so the generated palette stays neutral instead of drifting toward an
  // arbitrary hue once we apply the chroma multiplier curve.
  const baseChroma = isAchromatic(base) ? 0 : base.c;

  for (const shade of SHADES) {
    const l = LIGHTNESS_STOPS[shade];
    const c = baseChroma * CHROMA_MULTIPLIERS[shade];
    palette[String(shade)] = oklchToHex({ l, c, h: base.h });
  }

  return palette;
}

export function formatAsTailwindConfig(palette: Palette, name: string): string {
  const entries = Object.entries(palette)
    .map(([shade, color]) => `        ${shade}: "${color}",`)
    .join("\n");

  return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        ${name}: {\n${entries}\n        },\n      },\n    },\n  },\n};`;
}
