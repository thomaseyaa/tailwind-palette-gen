import { generatePalette, formatAsTailwindConfig } from "../src/index";

describe("generatePalette", () => {
  it("generates all 11 shades", () => {
    const palette = generatePalette("#3b82f6");
    const shades = Object.keys(palette);
    expect(shades).toEqual(["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"]);
  });

  it("all values are valid hex colors", () => {
    const palette = generatePalette("#3b82f6");
    for (const color of Object.values(palette)) {
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("50 is lighter than 950", () => {
    const palette = generatePalette("#3b82f6");
    const toLightness = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return (r + g + b) / 3;
    };
    expect(toLightness(palette["50"])).toBeGreaterThan(toLightness(palette["950"]));
  });

  it("shades are monotonically darker from 50 to 950", () => {
    const palette = generatePalette("#3b82f6");
    const toLightness = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return r + g + b;
    };
    const shades = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
    const values = shades.map((s) => toLightness(palette[s]));
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeLessThan(values[i - 1]);
    }
  });

  it("handles short hex", () => {
    const palette = generatePalette("#f00");
    expect(Object.keys(palette)).toHaveLength(11);
  });

  it("throws on invalid hex", () => {
    expect(() => generatePalette("xyz")).toThrow("Invalid hex color");
  });

  it("keeps a grey base neutral (no hue drift)", () => {
    const palette = generatePalette("#808080");
    for (const hex of Object.values(palette)) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      // Allow ±2 channels of drift due to sRGB rounding.
      expect(Math.abs(r - g)).toBeLessThanOrEqual(2);
      expect(Math.abs(g - b)).toBeLessThanOrEqual(2);
    }
  });
});

describe("formatAsTailwindConfig", () => {
  it("outputs valid Tailwind config structure", () => {
    const palette = generatePalette("#3b82f6");
    const config = formatAsTailwindConfig(palette, "blue");
    expect(config).toContain("module.exports");
    expect(config).toContain("blue");
    expect(config).toContain("500:");
  });
});
