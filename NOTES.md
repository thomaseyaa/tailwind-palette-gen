# Notes

## OKLCH migration (Feb 2025)

The current HSL-based palette generation has known issues:

- Shades are not perceptually uniform: 500 -> 600 looks much darker than
  600 -> 700 even though the lightness delta is similar.
- Hue rotation in HSL is uneven across the spectrum (yellows feel washed
  out around 50-100, blues feel too dark around 800-950).
- No way to tell that a generated palette is "good" without eyeballing it.

OKLCH (CSS Color 4, supported in all modern browsers since 2023) fixes
the perceptual uniformity issue and matches what Tailwind v4 ships with.

### Plan

1. Add `culori` for color conversion (HEX -> OKLCH -> HEX).
2. Replace the lightness map with an OKLCH L curve calibrated against
   Tailwind's own palettes (so 500 -> base color, 50/950 -> bookends).
3. Keep chroma roughly constant around the base, taper towards the ends.
4. Keep the public API stable (`generatePalette(hex)` still returns the
   same shape) so existing callers don't break.
5. Snapshot tests against a small set of base colors to catch regressions.

### Reference palettes

- Tailwind v4 (jan 2025) uses OKLCH internally and exposes both `oklch()`
  and hex values per shade.
- We target similar L stops: roughly 97 / 92 / 84 / 75 / 65 / 55 / 47 /
  40 / 33 / 25 / 15.
