import type { Formatter } from "./index";

/**
 * Tailwind v3 config block — drop-in `theme.extend.colors.<name>`.
 */
export const tailwindFormatter: Formatter = ({ name, palette }) => {
  const entries = Object.entries(palette)
    .map(([shade, color]) => `        ${shade}: "${color}",`)
    .join("\n");
  return [
    "module.exports = {",
    "  theme: {",
    "    extend: {",
    "      colors: {",
    `        ${name}: {`,
    entries,
    "        },",
    "      },",
    "    },",
    "  },",
    "};",
  ].join("\n");
};
