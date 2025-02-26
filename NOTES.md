# Notes

## OKLCH migration (Feb 2025) — done

Done in commits between 2025-02-04 and 2025-02-25:

- Added `culori` and a small wrapper (`src/oklch.ts`) for hex <-> OKLCH.
- Switched `generatePalette` to drive shades from a calibrated lightness
  curve, then taper chroma at the ends.
- Achromatic bases (true greys) bypass the chroma curve entirely.
- Snapshot fixtures pin known palettes (blue, slate, green, red) so any
  curve regression is caught.
- New `generatePaletteOklch(hex)` returns raw OKLCH coordinates for code
  that wants to emit `oklch()` CSS or design tokens.

## Next — multi-format output (Mar 2025)

The current CLI only outputs a flat list or a Tailwind v3 config object.
Targets for next month:

1. CSS custom properties block (`--brand-500: oklch(...)`) — keeps OKLCH
   in the output, falls back to hex via a second declaration.
2. DTCG JSON token file — each shade as `{ "$value": "...", "$type":
   "color" }`. The spec is finally stable enough.
3. Tailwind v4 `@theme` block — Tailwind v4 (Jan 2025) ships its CSS-first
   config; we should emit something that works there too.

CLI surface: `--format tailwind|css|dtcg|tailwind-v4`, default `tailwind`.
