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

## Multi-format output (Mar 2025) — done

Shipped in 0.3.0. `--format tailwind | tailwind-v4 | css | dtcg`, with
`--out <path>` to dump to a file.

## Contrast detection (Apr 2025) — done

Shipped in 0.4.0. `findContrastIssues()` + `--check-contrast` + `--strict`.

## Playground (May 2025) — done

Vite 6 + React 19 + plain CSS in `playground/`. Deployed via Vercel.

## 1.0.0 (June 2025) — done

Public API stable. See CHANGELOG.md for the full release notes.

## Ideas for later

- WCAG / APCA delta on top of the OKLCH-L delta (would let us flag bad
  fg/bg combinations inside the palette itself).
- Custom curves via `--curve <preset>` (e.g. "softer", "punchier").
- Palette diff command: take two base colors, show shade-by-shade delta.
