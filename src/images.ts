import { ICON_COLS, ICON_ROWS } from "./data/iconSize";
import icons from "./data/icons.generated.json";

/**
 * Real logo images via the iTerm2 inline image protocol (OSC 1337), which
 * ttyd's image addon (`-t enableSixel=true`), iTerm2 and WezTerm understand.
 * Ink can't lay out images, so screens reserve blank cells for them and this
 * module draws the images on top after Ink writes a frame: save cursor, jump
 * to the cell, draw, restore cursor. Text Ink later writes over those cells
 * replaces the image, so images are redrawn after every frame that may have
 * touched them.
 */
export const imagesSupported =
  process.env.PORTFOLIO_ICONS === "image" ||
  (process.env.PORTFOLIO_ICONS !== "blocks" &&
    ["iTerm.app", "WezTerm"].includes(process.env.TERM_PROGRAM ?? ""));

export interface Placement {
  name: string;
  /** 0-based screen cell of the image's top-left corner. */
  x: number;
  y: number;
}

const iconData = icons as Record<string, { png: string }>;
const sequences = new Map<string, string>();
const sequenceFor = (name: string) => {
  let seq = sequences.get(name);
  if (!seq) {
    const png = iconData[name].png;
    const size = Buffer.from(png, "base64").length;
    seq = `\x1b]1337;File=inline=1;size=${size};width=${ICON_COLS};height=${ICON_ROWS};preserveAspectRatio=1:${png}\x07`;
    sequences.set(name, seq);
  }
  return seq;
};

let placements: Placement[] = [];
let write: ((data: string) => boolean) | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;

// Coalesce redraws: wheel scrolling can produce many frames in a burst.
const FLUSH_MS = 40;

function flush() {
  timer = null;
  if (!write || placements.length === 0) return;
  let out = "\x1b7";
  for (const p of placements) out += `\x1b[${p.y + 1};${p.x + 1}H${sequenceFor(p.name)}`;
  write(out + "\x1b8");
}

function schedule() {
  if (!timer && placements.length > 0) timer = setTimeout(flush, FLUSH_MS);
}

/** Hook stdout so images are redrawn after Ink's frames. */
export function attachImages(stdout: NodeJS.WriteStream) {
  if (!imagesSupported) return;
  const original = stdout.write.bind(stdout) as (data: string) => boolean;
  write = original;
  stdout.write = ((chunk: string | Uint8Array, ...rest: unknown[]) => {
    const result = (original as (...a: unknown[]) => boolean)(chunk, ...rest);
    schedule();
    return result;
  }) as typeof stdout.write;
}

export function setImagePlacements(next: Placement[]) {
  placements = next;
  schedule();
}
