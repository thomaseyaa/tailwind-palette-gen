import type { Formatter } from "./index";

/**
 * CSS custom properties block:
 *
 *   :root {
 *     --brand-50: #...;
 *     --brand-100: #...;
 *   }
 *
 * If OKLCH coordinates are available in the context, we emit them as the
 * primary value and keep the hex as an inline comment for fallback.
 */
export const cssFormatter: Formatter = ({ name, palette, oklch }) => {
  const lines: string[] = [":root {"];
  for (const shade of Object.keys(palette)) {
    const hex = palette[shade];
    if (oklch?.[shade]) {
      const { l, c, h } = oklch[shade];
      const ls = (l * 100).toFixed(2);
      const cs = c.toFixed(4);
      const hs = h.toFixed(2);
      lines.push(`  --${name}-${shade}: oklch(${ls}% ${cs} ${hs}); /* ${hex} */`);
    } else {
      lines.push(`  --${name}-${shade}: ${hex};`);
    }
  }
  lines.push("}");
  return lines.join("\n");
};
