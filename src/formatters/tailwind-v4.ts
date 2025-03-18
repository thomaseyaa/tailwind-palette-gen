import type { Formatter } from "./index";

/**
 * Tailwind v4 `@theme` block (CSS-first config, shipped Jan 2025):
 *
 *   @theme {
 *     --color-brand-50: oklch(...);
 *     ...
 *   }
 *
 * Tailwind v4 picks up these variables and generates `bg-brand-500`,
 * `text-brand-700`, etc. automatically.
 */
export const tailwindV4Formatter: Formatter = ({ name, palette, oklch }) => {
  const lines: string[] = ["@theme {"];
  for (const shade of Object.keys(palette)) {
    const hex = palette[shade];
    if (oklch?.[shade]) {
      const { l, c, h } = oklch[shade];
      const ls = (l * 100).toFixed(2);
      const cs = c.toFixed(4);
      const hs = c < 0.0005 ? "none" : h.toFixed(2);
      lines.push(`  --color-${name}-${shade}: oklch(${ls}% ${cs} ${hs});`);
    } else {
      lines.push(`  --color-${name}-${shade}: ${hex};`);
    }
  }
  lines.push("}");
  return lines.join("\n");
};
