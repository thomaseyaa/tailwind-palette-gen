import { hexToOklch, oklchToHex } from "../src/oklch";

describe("hexToOklch", () => {
  it("converts white to L=1", () => {
    const o = hexToOklch("#ffffff");
    expect(o.l).toBeCloseTo(1, 2);
    expect(o.c).toBeCloseTo(0, 2);
  });

  it("converts black to L=0", () => {
    const o = hexToOklch("#000000");
    expect(o.l).toBeCloseTo(0, 2);
    expect(o.c).toBeCloseTo(0, 2);
  });

  it("converts a saturated blue to a hue in the blue range", () => {
    const o = hexToOklch("#3b82f6");
    // OKLCH blues sit roughly between 240 and 270 degrees.
    expect(o.h).toBeGreaterThan(230);
    expect(o.h).toBeLessThan(280);
    expect(o.c).toBeGreaterThan(0.1);
  });

  it("throws on garbage input", () => {
    expect(() => hexToOklch("not-a-color")).toThrow(/Invalid color/);
  });
});

describe("oklchToHex", () => {
  it("round-trips a known color within delta", () => {
    const hex = "#3b82f6";
    const o = hexToOklch(hex);
    const back = oklchToHex(o);
    // Allow small drift across L/C/H quantisation.
    expect(back).toMatch(/^#[0-9a-f]{6}$/);
    expect(back.slice(0, 4)).toBe(hex.slice(0, 4));
  });

  it("clamps out-of-gamut colors to a valid hex", () => {
    const hex = oklchToHex({ l: 0.5, c: 0.5, h: 30 });
    expect(hex).toMatch(/^#[0-9a-f]{6}$/);
  });
});
