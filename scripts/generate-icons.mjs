/**
 * Generates the app icons from the logo.
 *
 * The source lockup is the full stacked logo (mark, wordmark, tagline). At
 * favicon size the wordmark is illegible, so this crops to just the
 * three-figure mark, pads it square on the canvas tint, and writes the sizes
 * Next.js picks up automatically from `src/app/`.
 *
 * Re-run with `npm run icons` after replacing the logo — ideally with the SVG
 * the handoff asks for.
 */
import sharp from "sharp";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(ROOT, "public/BETAMINDS-AFRICA.png");
const APP = path.join(ROOT, "src/app");

/** Canvas tint from the design tokens. */
const CANVAS = { r: 251, g: 250, b: 248, alpha: 1 };

const { width = 0, height = 0 } = await sharp(SOURCE).metadata();

// The mark occupies the top of the lockup; the header crop in the handoff uses
// 876/400 of an 876-wide source, so take the same proportion and trim the
// surrounding whitespace to find the mark's true bounds.
const markHeight = Math.round(height * (400 / 717));

const top = await sharp(SOURCE)
  .extract({ left: 0, top: 0, width, height: markHeight })
  .toBuffer();

/**
 * sharp's `trim` doesn't bite on this file, so find the mark's bounds directly:
 * scan for pixels that are neither transparent nor near-white.
 */
async function inkBounds(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = info.width;
  let minY = info.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
      const isInk = a > 16 && (r < 235 || g < 235 || b < 235);
      if (!isInk) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0) throw new Error("No ink found in the logo's mark region.");
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

const bounds = await inkBounds(top);

const mark = await sharp(top)
  .extract(bounds)
  .toBuffer({ resolveWithObject: true });

const { width: mw = 0, height: mh = 0 } = mark.info;

// Square it, with ~8% breathing room so the mark isn't flush to the edge.
const side = Math.round(Math.max(mw, mh) * 1.16);
const squared = await sharp(mark.data)
  .extend({
    top: Math.round((side - mh) / 2),
    bottom: side - mh - Math.round((side - mh) / 2),
    left: Math.round((side - mw) / 2),
    right: side - mw - Math.round((side - mw) / 2),
    background: CANVAS,
  })
  .flatten({ background: CANVAS })
  .toBuffer();

const outputs = [
  ["icon.png", 512],
  ["apple-icon.png", 180],
];

for (const [name, size] of outputs) {
  await sharp(squared)
    .resize(size, size, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(APP, name));
  console.log(`wrote src/app/${name} (${size}×${size})`);
}

console.log(`source ${width}×${height} → mark ${mw}×${mh} → square ${side}×${side}`);

/* -- Open Graph card ------------------------------------------------------ */

// The full lockup on the canvas tint, over an accent rule. Composing from the
// logo artwork rather than rendering type means no font has to be fetched at
// build time and the card can never come out with a fallback typeface.
const OG = { width: 1200, height: 630 };
const LOCKUP_HEIGHT = 380;

const lockup = await sharp(SOURCE)
  .resize({ height: LOCKUP_HEIGHT })
  .toBuffer({ resolveWithObject: true });

await sharp({
  create: {
    width: OG.width,
    height: OG.height,
    channels: 4,
    background: CANVAS,
  },
})
  .composite([
    {
      input: lockup.data,
      left: Math.round((OG.width - lockup.info.width) / 2),
      top: Math.round((OG.height - lockup.info.height) / 2) - 14,
    },
    {
      // Accent rule along the bottom edge, in the fill gold.
      input: {
        create: {
          width: OG.width,
          height: 10,
          channels: 4,
          background: { r: 232, g: 163, b: 61, alpha: 1 },
        },
      },
      left: 0,
      top: OG.height - 10,
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile(path.join(ROOT, "public/og.png"));

console.log(`wrote public/og.png (${OG.width}×${OG.height})`);
