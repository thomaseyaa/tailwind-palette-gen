#!/usr/bin/env node

import { generatePalette, formatAsTailwindConfig } from "./index";

const args = process.argv.slice(2);

if (args.length < 1 || args.includes("--help") || args.includes("-h")) {
  console.log(`
  tailwind-palette-gen - Generate a Tailwind palette from a base color

  Usage:
    tailwind-palette-gen <hex-color> [--name <name>] [--config]

  Options:
    --name <name>  Name for the color (default: "primary")
    --config       Output as Tailwind config

  Examples:
    tailwind-palette-gen "#3b82f6"
    tailwind-palette-gen "#3b82f6" --name blue
    tailwind-palette-gen "#3b82f6" --name brand --config
  `);
  process.exit(args.includes("--help") || args.includes("-h") ? 0 : 1);
}

const hex = args[0];
const nameIdx = args.indexOf("--name");
const name = nameIdx !== -1 && args[nameIdx + 1] ? args[nameIdx + 1] : "primary";
const asConfig = args.includes("--config");

try {
  const palette = generatePalette(hex);

  if (asConfig) {
    console.log(formatAsTailwindConfig(palette, name));
  } else {
    console.log(`\n  Palette for ${hex} (${name}):\n`);
    for (const [shade, color] of Object.entries(palette)) {
      console.log(`  ${shade.padStart(4)}  ${color}`);
    }
    console.log();
  }
} catch (err: any) {
  console.error(`  Error: ${err.message}`);
  process.exit(1);
}
