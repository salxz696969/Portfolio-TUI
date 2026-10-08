/**
 * Builds src/data/icons.generated.json from the real logos in the `devicon`
 * package (MIT). Each icon covers ICON_COLS × ICON_ROWS terminal cells and is
 * stored twice:
 *  - `png`: base64 PNG, drawn as a real image in terminals that support the
 *    iTerm2 inline image protocol (ttyd with enableSixel, iTerm2, WezTerm).
 *  - `cells`: quadrant-block pixel art (2×2 pixels per cell, two colors per
 *    cell) for every other terminal.
 * Run `pnpm generate:icons` after adding a skill.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import sharp from "sharp";
import { skills } from "../src/data/skills";
import { ICON_COLS, ICON_ROWS } from "../src/data/iconSize";

const deviconDir = join(dirname(createRequire(import.meta.url).resolve("devicon/package.json")), "icons");
const PNG_SIZE = 64;
// Terminal background the art is blended against (matches ttyd theme).
const BG: RGB = [13, 17, 23];

type RGB = [number, number, number];
export interface Cell {
  ch: string;
  fg?: string;
  bg?: string;
}

// Quadrant characters indexed by mask: TL=1, TR=2, BL=4, BR=8.
const QUADS = " ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█";

const hex = ([r, g, b]: RGB) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const dist = (a: RGB, b: RGB) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
const mean = (ps: RGB[]): RGB =>
  ps.reduce<RGB>((m, p) => [m[0] + p[0] / ps.length, m[1] + p[1] / ps.length, m[2] + p[2] / ps.length], [0, 0, 0]);

/**
 * The logo rasterized to w×h, optionally inverted. `fill` stretches it, used
 * for quadrant pixels, which are twice as tall as they are wide on screen.
 */
function raster(svg: Buffer, w: number, h: number, invert?: boolean, fit: "contain" | "fill" = "contain") {
  const img = sharp(svg, { density: 300 }).resize(w, h, {
    fit,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  return invert ? img.negate({ alpha: false }) : img;
}

async function quadrantArt(svg: Buffer, invert?: boolean): Promise<Cell[][]> {
  const w = ICON_COLS * 2;
  const h = ICON_ROWS * 2;
  const { data } = await raster(svg, w, h, invert, "fill")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Pixel color blended over the background, plus whether it's mostly transparent.
  const px = (x: number, y: number): { c: RGB; clear: boolean } => {
    const i = (y * w + x) * 4;
    const a = data[i + 3] / 255;
    const c: RGB = [0, 1, 2].map((k) => data[i + k] * a + BG[k] * (1 - a)) as RGB;
    return { c, clear: a < 0.25 };
  };

  const rows: Cell[][] = [];
  for (let cy = 0; cy < ICON_ROWS; cy++) {
    const row: Cell[] = [];
    for (let cx = 0; cx < ICON_COLS; cx++) {
      const q = [px(cx * 2, cy * 2), px(cx * 2 + 1, cy * 2), px(cx * 2, cy * 2 + 1), px(cx * 2 + 1, cy * 2 + 1)];
      if (q.every((p) => p.clear)) {
        row.push({ ch: " " });
        continue;
      }
      // Try every split of the 4 pixels into two colors; keep the closest.
      let best = { err: Infinity, mask: 15, a: BG, b: BG, aClear: false, bClear: false };
      for (let mask = 1; mask < 16; mask++) {
        const A = q.filter((_, i) => mask & (1 << i));
        const B = q.filter((_, i) => !(mask & (1 << i)));
        const a = mean(A.map((p) => p.c));
        const b = B.length ? mean(B.map((p) => p.c)) : BG;
        const err = A.reduce((e, p) => e + dist(p.c, a), 0) + B.reduce((e, p) => e + dist(p.c, b), 0);
        if (err < best.err) {
          best = { err, mask, a, b, aClear: A.every((p) => p.clear), bClear: B.every((p) => p.clear) };
        }
      }
      const { mask, a, b, aClear, bClear } = best;
      // Leave fully transparent halves unpainted so the real background shows.
      if (aClear) row.push({ ch: QUADS[15 - mask], fg: hex(b) });
      else row.push({ ch: QUADS[mask], fg: hex(a), bg: mask === 15 || bClear ? undefined : hex(b) });
    }
    rows.push(row);
  }
  return rows;
}

const out: Record<string, { png: string; cells: Cell[][] }> = {};
for (const skill of skills) {
  const svg = readFileSync(join(deviconDir, skill.icon, `${skill.icon}-${skill.variant ?? "original"}.svg`));
  const png = await raster(svg, PNG_SIZE * ICON_COLS / (ICON_ROWS * 2), PNG_SIZE, skill.invert)
    .png({ palette: true, compressionLevel: 9 })
    .toBuffer();
  out[skill.name] = { png: png.toString("base64"), cells: await quadrantArt(svg, skill.invert) };
}
writeFileSync(new URL("../src/data/icons.generated.json", import.meta.url), JSON.stringify(out) + "\n");
console.log(`wrote ${Object.keys(out).length} icons`);
