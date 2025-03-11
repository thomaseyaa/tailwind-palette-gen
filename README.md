# tailwind-palette-gen

Generate a full Tailwind CSS color palette (50-950) from a single base color,
using OKLCH for perceptual uniformity.

## Usage

```bash
npx tailwind-palette-gen "#3b82f6"
```

```
  Palette for #3b82f6 (primary):

    50  #eef4ff
   100  #d9e6ff
   200  #b8d0ff
   300  #8db3fe
   400  #5c90fb
   500  #3b71f4
   600  #2e58d7
   700  #2643a8
   800  #1f3279
   900  #182552
   950  #0f172e
```

> Generated values are illustrative — the exact hex depends on the base
> color you feed in. Internally we work in OKLCH, snap the lightness to a
> Tailwind-v4-style curve, taper chroma at the ends, then clamp back to
> sRGB hex.

## Options

```bash
# Custom name
npx tailwind-palette-gen "#3b82f6" --name brand

# Output formats
npx tailwind-palette-gen "#3b82f6" --name brand --format tailwind        # v3 config
npx tailwind-palette-gen "#3b82f6" --name brand --format tailwind-v4     # @theme block
npx tailwind-palette-gen "#3b82f6" --name brand --format css             # :root vars
npx tailwind-palette-gen "#3b82f6" --name brand --format dtcg            # DTCG JSON

# Write to a file
npx tailwind-palette-gen "#3b82f6" --name brand --format dtcg --out brand.tokens.json
```

## Programmatic API

```ts
import { generatePalette, formatAsTailwindConfig } from "tailwind-palette-gen";

const palette = generatePalette("#3b82f6");
// { "50": "#eef4ff", "100": "#d9e6ff", ... "950": "#0f172e" }

const config = formatAsTailwindConfig(palette, "brand");
// module.exports = { theme: { extend: { colors: { brand: { ... } } } } }
```

## Why OKLCH?

`hsl()` is not perceptually uniform: dropping the L coordinate from 60% to
50% reads "much darker" for some hues and "barely visible" for others.
OKLCH (CSS Color 4, supported in every modern browser since 2023) is
designed to fix that. Two shades 0.1 OKLCH-L apart look equally spaced no
matter the hue.

## License

MIT
