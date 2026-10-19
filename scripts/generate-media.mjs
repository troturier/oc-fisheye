// Génère les variantes légères des médias de public/ :
//  - public/media/<nom>-<largeur>.avif|webp pour chaque JPG (portraits et photos)
//  - public/media/<nom>-poster.avif|webp pour chaque vidéo MP4 (image extraite à 0,1 s)
// Usage : npm run media   (nécessite ffmpeg pour les posters vidéo ; ignore les fichiers déjà à jour)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve("public");
const OUT_DIR = path.join(PUBLIC_DIR, "media");
const WIDTHS = [200, 400, 800, 1600];
const POSTER_WIDTH = 800;

mkdirSync(OUT_DIR, { recursive: true });

const isUpToDate = (src, out) => existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs;

async function writeVariants(input, src, base, width) {
  for (const [format, options] of [
    ["avif", { quality: 55, effort: 4 }],
    ["webp", { quality: 75 }],
  ]) {
    const out = path.join(OUT_DIR, `${base}.${format}`);
    if (isUpToDate(src, out)) continue;
    await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      [format](options)
      .toFile(out);
    console.log(`  ${path.relative(PUBLIC_DIR, out)}`);
  }
}

for (const file of readdirSync(PUBLIC_DIR).sort()) {
  const { name, ext } = path.parse(file);
  const src = path.join(PUBLIC_DIR, file);

  if (ext === ".jpg") {
    console.log(file);
    for (const width of WIDTHS) await writeVariants(src, src, `${name}-${width}`, width);
  } else if (ext === ".mp4") {
    console.log(file);
    const frame = path.join(tmpdir(), `${name}-frame.png`);
    execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", "0.1", "-i", src, "-frames:v", "1", frame]);
    await writeVariants(frame, src, `${name}-poster`, POSTER_WIDTH);
  }
}
