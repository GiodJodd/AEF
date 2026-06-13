#!/usr/bin/env node
/**
 * Reads source images from ~/Downloads/material for AEF/<folder>/, auto-trims
 * letterbox bars with sharp.trim(), center-crops to 2.39:1 cinemascope (with
 * exceptions for projects/files whose native aspect must be preserved),
 * resizes to ~2400px max width, converts to WebP @ 95% quality, and writes:
 *   - public/projects/<slug>/hero.webp
 *   - public/projects/<slug>/gallery-N.webp
 *   - src/data/project-media.ts (typed map of cover + gallery + blurDataURLs)
 *
 * Skips: files containing "to fix".
 * Native-aspect exceptions (no cinemascope crop):
 *   - whole projects listed in KEEP_NATIVE_ASPECT_SLUGS
 *   - individual filenames containing "this image" (these also skip the auto-trim,
 *     so intentional dark/negative space around a subject is preserved as-is).
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { homedir } from "node:os";

const SOURCE_ROOT = path.join(homedir(), "Downloads", "material for AEF");
const OUT_PUBLIC_ROOT = path.resolve("public/projects");
const OUT_DATA_FILE = path.resolve("src/data/project-media.ts");

// Map slug → source folder (relative to SOURCE_ROOT)
const FOLDERS = {
  cuirdange: "cuirdange",
  "jail-time-records": "Jail time",
  "la-tempesta": "La tempesta",
  noia: "noia",
  maree: "maree",
  "kiss-of-an-angel": "kiss of an angel",
  faceboom: "faceboom/faceboom",
};

// Projects whose images keep their native aspect (no cinemascope crop). The
// auto-trim still runs to strip any letterbox bars.
const KEEP_NATIVE_ASPECT_SLUGS = new Set([
  "kiss-of-an-angel",
  "la-tempesta",
]);

const TARGET_WIDTH = 2400;
const QUALITY = 95;
const EFFORT = 6;
const BLUR_WIDTH = 16;
const CINEMASCOPE_RATIO = 2.39;

const SUPPORTED_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".tif",
  ".tiff",
]);

function shouldSkip(name) {
  const lower = name.toLowerCase();
  if (lower.startsWith(".")) return true; // .DS_Store etc.
  if (lower.includes("to fix")) return true;
  return false;
}

function isHero(name) {
  // Match files starting with "hero." in any extension (e.g. hero.png, hero.jpeg)
  // Excludes "music-hero.jpg" etc.
  return /^hero\./i.test(name);
}

function isThisImage(name) {
  // Files matching "this image" preserve their native framing entirely: they
  // skip the auto-trim AND the cinemascope crop. Used for stills where the
  // dark/negative space around the subject IS the composition.
  return name.toLowerCase().includes("this image");
}

async function processOne(srcPath, outPath, { keepNativeAspect }) {
  const filename = path.basename(srcPath);
  const skipTrim = isThisImage(filename);
  const skipCinemascope = skipTrim || keepNativeAspect;

  // 1) Trim letterbox bars (skipped for "this image" files so the framing is
  //    preserved exactly as the source).
  const trimmed = skipTrim
    ? await sharp(srcPath).toBuffer()
    : await sharp(srcPath)
        .trim({ background: "#000000", threshold: 25 })
        .toBuffer();
  const meta = await sharp(trimmed).metadata();

  // 2) Resize: cinemascope (default) or native aspect (exception)
  let pipeline = sharp(trimmed);
  if (skipCinemascope) {
    pipeline = pipeline.resize({
      width: TARGET_WIDTH,
      withoutEnlargement: true,
    });
  } else {
    const w = Math.min(meta.width, TARGET_WIDTH);
    const h = Math.round(w / CINEMASCOPE_RATIO);
    pipeline = pipeline.resize({
      width: w,
      height: h,
      fit: "cover",
      position: "center",
    });
  }

  // 3) Encode WebP and write
  const { data, info } = await pipeline
    .webp({ quality: QUALITY, effort: EFFORT })
    .toBuffer({ resolveWithObject: true });
  await fs.writeFile(outPath, data);

  // 4) Blur placeholder from the final output (so colors/aspect match)
  const blurBuffer = await sharp(data)
    .resize({ width: BLUR_WIDTH })
    .webp({ quality: 50 })
    .toBuffer();
  const blurDataURL = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

  return {
    src: "/" + path.relative("public", outPath).split(path.sep).join("/"),
    blurDataURL,
    width: info.width,
    height: info.height,
  };
}

async function processFolder(slug, folderName) {
  const srcDir = path.join(SOURCE_ROOT, folderName);
  const outDir = path.join(OUT_PUBLIC_ROOT, slug);
  const keepNativeAspect = KEEP_NATIVE_ASPECT_SLUGS.has(slug);

  let entries;
  try {
    entries = await fs.readdir(srcDir);
  } catch (err) {
    console.warn(`  ! source folder missing: ${srcDir}`);
    return null;
  }

  const files = entries
    .filter((f) => !shouldSkip(f))
    .filter((f) => SUPPORTED_EXT.has(path.extname(f).toLowerCase()))
    .sort();

  const heroFile = files.find(isHero);
  const galleryFiles = files.filter((f) => !isHero(f));

  if (!heroFile) {
    console.warn(`  ! no hero.* found for ${slug}, skipping`);
    return null;
  }

  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  console.log(`\n→ ${slug}${keepNativeAspect ? "  (native aspect)" : ""}`);
  console.log(`  hero: ${heroFile}`);
  const cover = await processOne(
    path.join(srcDir, heroFile),
    path.join(outDir, "hero.webp"),
    { keepNativeAspect },
  );

  const gallery = [];
  for (let i = 0; i < galleryFiles.length; i++) {
    const src = galleryFiles[i];
    const out = `gallery-${i + 1}.webp`;
    console.log(`  gallery-${i + 1}: ${src}`);
    const meta = await processOne(
      path.join(srcDir, src),
      path.join(outDir, out),
      { keepNativeAspect },
    );
    gallery.push(meta);
  }

  return { cover, gallery };
}

function emitTs(media) {
  const header = `// AUTO-GENERATED by scripts/optimize-project-images.mjs — do not edit by hand.
// Run \`node scripts/optimize-project-images.mjs\` to regenerate.

export interface ImageMeta {
  src: string;
  blurDataURL: string;
  width: number;
  height: number;
}

export interface ProjectMedia {
  cover: ImageMeta;
  coverMobile?: ImageMeta;
  gallery: ImageMeta[];
}

export const PROJECT_MEDIA: Record<string, ProjectMedia> = `;

  return header + JSON.stringify(media, null, 2) + ";\n";
}

async function main() {
  console.log(`Source: ${SOURCE_ROOT}`);
  console.log(`Output: ${OUT_PUBLIC_ROOT}\n`);

  await fs.mkdir(OUT_PUBLIC_ROOT, { recursive: true });

  const media = {};
  for (const [slug, folder] of Object.entries(FOLDERS)) {
    const result = await processFolder(slug, folder);
    if (result) media[slug] = result;
  }

  await fs.writeFile(OUT_DATA_FILE, emitTs(media));
  console.log(`\nWrote ${OUT_DATA_FILE}`);
  console.log(`Done. ${Object.keys(media).length} projects optimized.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
