export interface Palette {
  [shade: string]: string;
}

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;

  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l * 100];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}

export function generatePalette(hex: string): Palette {
  const clean = hex.replace("#", "");
  if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(clean)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const [h, s] = hexToHsl(hex);
  const palette: Palette = {};

  const lightnessMap: Record<number, number> = {
    50: 97,
    100: 94,
    200: 86,
    300: 77,
    400: 66,
    500: 50,
    600: 42,
    700: 35,
    800: 25,
    900: 18,
    950: 10,
  };

  for (const shade of SHADES) {
    const l = lightnessMap[shade];
    palette[String(shade)] = hslToHex(h, s, l);
  }

  return palette;
}

export function formatAsTailwindConfig(palette: Palette, name: string): string {
  const entries = Object.entries(palette)
    .map(([shade, color]) => `        ${shade}: "${color}",`)
    .join("\n");

  return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        ${name}: {\n${entries}\n        },\n      },\n    },\n  },\n};`;
}
