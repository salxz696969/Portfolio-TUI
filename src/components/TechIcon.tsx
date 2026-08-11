import React from "react";
import { Text, Box } from "ink";

/**
 * Half-block 2×2 icon renderer.
 *
 * Uses the Unicode upper-half block `▀` (U+2580) to paint two vertical pixels
 * per character cell: the top pixel is the foreground `color`, the bottom pixel
 * is `backgroundColor`. Two characters side by side produce a 2×2 pixel grid.
 *
 * Color data is generated from the real logo files in `src/logos/` by
 * `scripts/generate-logo-colors.ts` → `src/data/techIconColors.json`.
 * Re-run `pnpm generate:logos` whenever logo assets change.
 */
export type Icon2x2Colors = [string, string, string, string]; // [tl, tr, bl, br]

export default function TechIcon({ colors }: { colors: Icon2x2Colors }) {
  const [tl, tr, bl, br] = colors;
  return (
    <Box flexDirection="row">
      <Text color={tl} backgroundColor={bl}>▀</Text>
      <Text color={tr} backgroundColor={br}>▀</Text>
    </Box>
  );
}