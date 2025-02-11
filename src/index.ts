import { hexToOklch, isAchromatic, oklchToHex } from "./oklch";

export interface Palette {
  [shade: string]: string;
}

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

// Lightness stops calibrated against Tailwind v4 palettes (OKLCH L, 0..1).
// 500 is intentionally close to the base color but not identical — we keep
// the base's hue and chroma and snap the lightness to the curve.
const LIGHTNESS_STOPS: Record<number, number> = {
  50: 0.97,
  100: 0.93,
  200: 0.86,
  300: 0.77,
  400: 0.67,
  500: 0.57,
  600: 0.49,
  700: 0.41,
  800: 0.33,
  900: 0.26,
  950: 0.18,
};

// Chroma multipliers applied to the base color's chroma per shade. Ends are
// tapered because very light / very dark colors can't sustain high chroma
// inside sRGB — keeping the multiplier at 1 would produce visible banding.
const CHROMA_MULTIPLIERS: Record<number, number> = {
  50: 0.25,
  100: 0.4,
  200: 0.6,
  300: 0.8,
  400: 0.95,
  500: 1,
  600: 1,
  700: 0.95,
  800: 0.85,
  900: 0.7,
  950: 0.55,
};

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
