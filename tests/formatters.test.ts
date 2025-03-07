import { generatePalette, generatePaletteOklch } from "../src/index";
import { format } from "../src/formatters/index";

const palette = generatePalette("#3b82f6");
const oklch = generatePaletteOklch("#3b82f6");

describe("formatters", () => {
  it("tailwind v3 output is valid CommonJS", () => {
    const out = format({ name: "brand", palette }, "tailwind");
    expect(out).toContain("module.exports");
    expect(out).toContain("brand:");
    expect(out).toContain("500:");
  });

  it("tailwind v4 output uses @theme block and css variables", () => {
    const out = format({ name: "brand", palette, oklch }, "tailwind-v4");
    expect(out).toMatch(/^@theme \{/);
    expect(out).toContain("--color-brand-50:");
    expect(out).toContain("--color-brand-950:");
    expect(out).toContain("oklch(");
  });

  it("css output declares custom properties under :root", () => {
    const out = format({ name: "brand", palette, oklch }, "css");
    expect(out).toMatch(/^:root \{/);
    expect(out).toContain("--brand-500");
  });

  it("dtcg output is valid JSON with $value and $type", () => {
    const out = format({ name: "brand", palette }, "dtcg");
    const parsed = JSON.parse(out);
    expect(parsed.brand["500"]).toEqual({
      $type: "color",
      $value: palette["500"],
    });
  });

  it("unknown format throws", () => {
    expect(() => format({ name: "brand", palette }, "xml" as never)).toThrow(/Unknown/);
  });
});
