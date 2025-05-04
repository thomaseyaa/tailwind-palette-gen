// Re-export the library code from the parent package so the playground stays
// in sync with whatever ships from `tailwind-palette-gen` itself. We import
// via a relative path rather than the package name because the playground is
// not declared as a workspace consumer.
export {
  analyze,
  generatePalette,
  generatePaletteOklch,
  formatAsTailwindConfig,
} from "../../src/index";
export type {
  Palette,
  OklchPalette,
  OklchColor,
  ContrastIssue,
  PaletteAnalysis,
} from "../../src/index";
export {
  format,
  OUTPUT_FORMATS,
  type OutputFormat,
} from "../../src/formatters/index";
