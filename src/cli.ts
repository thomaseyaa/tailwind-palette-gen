#!/usr/bin/env node

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generatePalette, generatePaletteOklch } from "./index";
import {
  format as runFormatter,
  OUTPUT_FORMATS,
  OutputFormat,
} from "./formatters/index";

const args = process.argv.slice(2);

if (args.includes("--version") || args.includes("-v")) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { version } = require("../package.json");
  console.log(version);
  process.exit(0);
}

if (args.length < 1 || args.includes("--help") || args.includes("-h")) {
  console.log(`
  tailwind-palette-gen - Generate a Tailwind palette from a base color

  Usage:
    tailwind-palette-gen <hex-color> [options]

  Options:
    --name <name>     Name for the color (default: "primary")
    --format <fmt>    Output format: ${OUTPUT_FORMATS.join(" | ")}
                      (default: pretty table; passing --config is a
                      shortcut for --format tailwind)
    --out <path>      Write formatted output to a file
    --config          Alias for --format tailwind
    --version, -v     Print version
    --help, -h        Show this help

  Examples:
    tailwind-palette-gen "#3b82f6"
    tailwind-palette-gen "#3b82f6" --name brand --format tailwind-v4
    tailwind-palette-gen "#3b82f6" --name brand --format dtcg > brand.tokens.json
    tailwind-palette-gen "#3b82f6" --name brand --format css
  `);
  process.exit(args.includes("--help") || args.includes("-h") ? 0 : 1);
}

const hex = args[0];

function pickFlag(name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  const next = args[idx + 1];
  if (!next || next.startsWith("-")) return undefined;
  return next;
}

const name = pickFlag("--name") ?? "primary";

let format: OutputFormat | "pretty";
const formatFlag = pickFlag("--format");
if (formatFlag) {
  if (!(OUTPUT_FORMATS as string[]).includes(formatFlag)) {
    console.error(
      `  Error: Unknown format "${formatFlag}". Valid: ${OUTPUT_FORMATS.join(", ")}`
    );
    process.exit(1);
  }
  format = formatFlag as OutputFormat;
} else if (args.includes("--config")) {
  format = "tailwind";
} else {
  format = "pretty";
}

try {
  const palette = generatePalette(hex);

  if (format === "pretty") {
    const showOklch = args.includes("--show-oklch");
    const oklch = showOklch ? generatePaletteOklch(hex) : undefined;
    console.log(`\n  Palette for ${hex} (${name}):\n`);
    for (const [shade, color] of Object.entries(palette)) {
      if (showOklch && oklch) {
        const o = oklch[shade];
        const ls = (o.l * 100).toFixed(1).padStart(5);
        const cs = o.c.toFixed(3);
        const hs = o.h.toFixed(1).padStart(5);
        console.log(`  ${shade.padStart(4)}  ${color}  oklch(${ls}% ${cs} ${hs})`);
      } else {
        console.log(`  ${shade.padStart(4)}  ${color}`);
      }
    }
    console.log();
  } else {
    const oklch = generatePaletteOklch(hex);
    const out = runFormatter({ name, palette, oklch }, format);
    const outPath = pickFlag("--out");
    if (outPath) {
      writeFileSync(resolve(process.cwd(), outPath), out + "\n", "utf8");
      console.error(`  Wrote ${out.split("\n").length} lines to ${outPath}`);
    } else {
      console.log(out);
    }
  }
} catch (err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`  Error: ${msg}`);
  process.exit(1);
}
