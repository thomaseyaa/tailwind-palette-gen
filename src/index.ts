import { hexToOklch, oklchToHex } from "./oklch";

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

export function generatePalette(hex: string): Palette {
  const clean = hex.replace("#", "");
  if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(clean)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const { c, h } = hexToOklch(hex);
  const palette: Palette = {};

  for (const shade of SHADES) {
    const l = LIGHTNESS_STOPS[shade];
    palette[String(shade)] = oklchToHex({ l, c, h });
  }

  return palette;
}

export function formatAsTailwindConfig(palette: Palette, name: string): string {
  const entries = Object.entries(palette)
    .map(([shade, color]) => `        ${shade}: "${color}",`)
    .join("\n");

  return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        ${name}: {\n${entries}\n        },\n      },\n    },\n  },\n};`;
}
