# tailwind-palette-gen

Generate a full Tailwind CSS color palette (50-950) from a single base color.

## Usage

```bash
npx tailwind-palette-gen "#3b82f6"
```

```
  Palette for #3b82f6 (primary):

    50  #f0f6fe
   100  #e2ecfe
   200  #bbd4fc
   300  #8fb8fa
   400  #5996f7
   500  #0b64f4
   600  #0a54cd
   700  #0846aa
   800  #06327a
   900  #042458
   950  #021431
```

## Options

```bash
# Custom name
npx tailwind-palette-gen "#3b82f6" --name brand

# Output as Tailwind config
npx tailwind-palette-gen "#3b82f6" --name brand --config
```

## Programmatic API

```ts
import { generatePalette, formatAsTailwindConfig } from "tailwind-palette-gen";

const palette = generatePalette("#3b82f6");
// { "50": "#f0f6fe", "100": "#e2ecfe", ... "950": "#021431" }

const config = formatAsTailwindConfig(palette, "brand");
// module.exports = { theme: { extend: { colors: { brand: { ... } } } } }
```

## License

MIT
