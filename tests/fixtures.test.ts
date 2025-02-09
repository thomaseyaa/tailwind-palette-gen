import { generatePalette } from "../src/index";

const KNOWN_BASES = [
  { name: "blue", hex: "#3b82f6" },
  { name: "slate", hex: "#64748b" },
  { name: "green", hex: "#22c55e" },
  { name: "red", hex: "#ef4444" },
];

describe("known base color snapshots", () => {
  for (const { name, hex } of KNOWN_BASES) {
    it(`generates a stable palette for ${name} (${hex})`, () => {
      const palette = generatePalette(hex);
      expect(palette).toMatchSnapshot();
    });
  }
});
