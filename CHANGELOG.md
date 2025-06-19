# Changelog

## 1.0.0 (June 2025)

- Stabilise the public API. No breaking changes vs 0.4.0; promoting to 1.0
  to signal that the OKLCH-based generator and the four output formats
  (`tailwind`, `tailwind-v4`, `css`, `dtcg`) are considered done.
- Documentation pass: README, examples folder, contrast section, exit
  codes, Tailwind v4 integration snippet, link to the web playground.

## 0.4.0 (April 2025)

- New `analyze(hex)` helper returning palette + OKLCH + contrast issues
  in one call.
- New `--check-contrast` and `--strict` CLI flags. Exit code 2 is used
  when `--strict` finds issues.
- New `findContrastIssues()` flags both adjacent shades that are too
  close (OKLCH-L delta below threshold) and palettes whose overall
  lightness spread is too low.

## 0.3.0 (March 2025)

- Multi-format output: `--format tailwind | tailwind-v4 | css | dtcg`.
- `--out <path>` writes the formatted output to a file.
- `--show-oklch` prints OKLCH coordinates next to each hex shade.
- DTCG output carries a `$description` for the group.
- CSS / Tailwind v4 outputs use `oklch()` with a `none` hue for
  achromatic shades.

## 0.2.0 (February 2025)

- Rewrite the generator to drive shades from a calibrated OKLCH lightness
  curve, with a chroma multiplier that tapers towards the bookends.
- Achromatic bases (true greys) stay neutral across the full scale.
- New `generatePaletteOklch(hex)` returns raw OKLCH coordinates for
  downstream tooling.
- Snapshot fixtures lock the generated palettes for blue, slate, green
  and red.

## 0.1.0 (January 2021)

- Initial release: HSL-based 50-950 palette generation, CLI, and
  Tailwind v3 config output.
