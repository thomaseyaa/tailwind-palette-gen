import type { OklchPalette, Palette } from "../index";

export type OutputFormat =
  | "tailwind"
  | "tailwind-v4"
  | "css"
  | "dtcg";

export interface FormatContext {
  name: string;
  palette: Palette;
  oklch?: OklchPalette;
}

export type Formatter = (ctx: FormatContext) => string;
