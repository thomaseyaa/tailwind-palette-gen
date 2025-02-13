/**
 * Lightness and chroma curves used to derive every shade in the palette.
 *
 * The lightness stops are calibrated against Tailwind's own v4 palettes
 * (which moved to OKLCH internally). The chroma multipliers taper toward
 * the extremes because deeply saturated colors cannot survive the L=0.18
 * or L=0.97 stops without leaving the sRGB gamut.
 */

export const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export type Shade = (typeof SHADES)[number];

export const LIGHTNESS_STOPS: Record<Shade, number> = {
  50: 0.97,
  100: 0.93,
  200: 0.86,
  300: 0.77,
  400: 0.67,
  500: 0.57,
  600: 0.49,
  700: 0.41,
  800: 0.33,
  900: 0.26,
  950: 0.18,
};

export const CHROMA_MULTIPLIERS: Record<Shade, number> = {
  50: 0.25,
  100: 0.4,
  200: 0.6,
  300: 0.8,
  400: 0.95,
  500: 1,
  600: 1,
  700: 0.95,
  800: 0.85,
  900: 0.7,
  950: 0.55,
};
