import { generatePaletteOklch } from "../src/index";
import { findContrastIssues, lightnessDelta } from "../src/contrast";

describe("lightnessDelta", () => {
  it("returns the absolute L difference", () => {
    expect(lightnessDelta({ l: 0.8, c: 0, h: 0 }, { l: 0.3, c: 0, h: 0 })).toBeCloseTo(0.5);
    expect(lightnessDelta({ l: 0.3, c: 0, h: 0 }, { l: 0.8, c: 0, h: 0 })).toBeCloseTo(0.5);
  });
});

describe("findContrastIssues", () => {
  it("returns an empty list for a well-formed palette", () => {
    const palette = generatePaletteOklch("#3b82f6");
    expect(findContrastIssues(palette)).toEqual([]);
  });

  it("flags adjacent shades that are too close (synthetic case)", () => {
    const palette = generatePaletteOklch("#3b82f6");
    // Squash 400 and 500 together so the delta drops below threshold.
    palette["500"] = { ...palette["400"] };
    const issues = findContrastIssues(palette);
    expect(issues).toHaveLength(1);
    expect(issues[0].from).toBe("400");
    expect(issues[0].to).toBe("500");
    expect(issues[0].delta).toBeCloseTo(0);
  });

  it("respects a custom threshold", () => {
    const palette = generatePaletteOklch("#3b82f6");
    const issues = findContrastIssues(palette, 0.5);
    // With such a high threshold every adjacent pair fails.
    expect(issues.length).toBeGreaterThan(5);
  });

  it("flags palettes whose lightest <-> darkest spread is too low", () => {
    const palette = generatePaletteOklch("#3b82f6");
    // Squash everything into the middle of the lightness range.
    for (const shade of Object.keys(palette)) {
      palette[shade] = { ...palette[shade], l: 0.5 };
    }
    const issues = findContrastIssues(palette);
    const spreadIssue = issues.find((i) => i.kind === "spread-too-low");
    expect(spreadIssue).toBeDefined();
    expect(spreadIssue?.from).toBe("50");
    expect(spreadIssue?.to).toBe("950");
  });
});
