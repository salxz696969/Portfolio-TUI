import sharp from "sharp";
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const LOGO_DIR = path.join(process.cwd(), "src/logos");
const OUTPUT = path.join(process.cwd(), "src/data/techIconColors.json");

// Flatten transparent pixels against this background. Most terminal UIs have
// a dark background, so pick a value that blends in for typical dark themes.
// Change this if your icons render with a visible boxy halo.
const FLATTEN_BG = { r: 26, g: 26, b: 26, alpha: 1 }; // #1a1a1a

// Map each filename in src/logos to the tech name used in skills.ts
const filenameToTech: Record<string, string> = {
  "JavaScript-logo.png": "JavaScript",
  "Typescript_logo_2020.svg.webp": "TypeScript",
  "Python-logo-notext.svg.webp": "Python",
  "react.png": "React",
  "express.webp": "Express",
  "fastapi.svg": "FastAPI",
  "NestJS.svg": "NestJS",
  "nextjs.png": "Next.js",
  "Postgresql_elephant.svg.webp": "PostgreSQL",
  "mongodb.png": "MongoDB",
  "mysql.png": "MySQL",
  "redis.webp": "Redis",
  "sqlite_logo_icon_169724.webp": "SQLite",
};

type Colors = [string, string, string, string]; // [tl, tr, bl, br]

function toHex(r: number, g: number, b: number): string {
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

// Resize the image to a 2×2 grid and average each quadrant rather than
// nearest-pixel sampling — this gives smoother, more representative colors
// for icons that have fine detail (e.g. line art).
async function extract2x2(filepath: string): Promise<Colors> {
  const { data, info } = await sharp(filepath)
    .resize(2, 2, { fit: "cover" })
    .flatten({ background: FLATTEN_BG })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels; // 3 (RGB) after removeAlpha
  const pix = (i: number) => ({
    r: data[i * channels],
    g: data[i * channels + 1],
    b: data[i * channels + 2],
  });

  // sharp raw output is row-major: tl, tr, bl, br
  const tl = pix(0);
  const tr = pix(1);
  const bl = pix(2);
  const br = pix(3);

  return [toHex(tl.r, tl.g, tl.b), toHex(tr.r, tr.g, tr.b), toHex(bl.r, bl.g, bl.b), toHex(br.r, br.g, br.b)];
}

async function main() {
  const files = await readdir(LOGO_DIR);
  const result: Record<string, Colors> = {};

  for (const file of files) {
    const tech = filenameToTech[file];
    if (!tech) {
      console.log(`- skip: ${file} (not in mapping)`);
      continue;
    }
    const filepath = path.join(LOGO_DIR, file);
    try {
      result[tech] = await extract2x2(filepath);
      console.log(`✓ ${tech.padEnd(14)} ${JSON.stringify(result[tech])}`);
    } catch (err) {
      console.error(`✗ ${tech} (${file}):`, err instanceof Error ? err.message : err);
    }
  }

  const json = JSON.stringify(result, null, 2) + "\n";
  await writeFile(OUTPUT, json, "utf8");
  console.log(`\nWrote ${result.length} entries → ${path.relative(process.cwd(), OUTPUT)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});