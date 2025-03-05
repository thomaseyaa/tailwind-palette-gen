import type { OklchPalette, Palette } from "../index";
import { cssFormatter } from "./css";
import { dtcgFormatter } from "./dtcg";
import { tailwindFormatter } from "./tailwind";
import { tailwindV4Formatter } from "./tailwind-v4";

export type OutputFormat =
  | "tailwind"
  | "tailwind-v4"
  | "css"
  | "dtcg";

export const OUTPUT_FORMATS: OutputFormat[] = [
  "tailwind",
  "tailwind-v4",
  "css",
  "dtcg",
];

export interface FormatContext {
  name: string;
  palette: Palette;
  oklch?: OklchPalette;
}

export type Formatter = (ctx: FormatContext) => string;

export const FORMATTERS: Record<OutputFormat, Formatter> = {
  tailwind: tailwindFormatter,
  "tailwind-v4": tailwindV4Formatter,
  css: cssFormatter,
  dtcg: dtcgFormatter,
};

export function format(ctx: FormatContext, output: OutputFormat): string {
  const fn = FORMATTERS[output];
  if (!fn) {
    throw new Error(`Unknown output format: ${output}`);
  }
  return fn(ctx);
}
