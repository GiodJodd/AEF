#!/usr/bin/env node
/**
 * Reads source images from ~/Downloads/material for AEF/<folder>/, auto-trims
 * letterbox bars with sharp.trim(), and for each source emits two outputs:
 *
 *   LQ (served on hero / thumbnails)
 *     public/projects/<slug>/hero.webp
 *     public/projects/<slug>/gallery-N.webp
 *     WebP @ quality 95, max 2400px wide, native aspect.
 *
 *   HQ (served in the lightbox zoom view)
 *     public/projects/<slug>/hero-hq.png
 *     public/projects/<slug>/gallery-N-hq.png
 *     PNG lossless, max 4800px wide, native aspect.
 *
 *   src/data/project-media.ts — typed map of both src + hqSrc per image.
 *
 * Skips: files containing "to fix", dotfiles.
 * Filenames containing "this image" skip the auto-trim, so dark/negative
 * space around the subject is preserved as-is (e.g. cuirdange's flower-van).
 * When both `hero.*` and `enhanced_hero*` exist in a folder, `enhanced_hero`
 * wins and the plain `hero.*` is dropped entirely (it's the same shot,
 * pre-enhancement).
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

const LQ_MAX_WIDTH = 2400;
const HQ_MAX_WIDTH = 4800;
const LQ_QUALITY = 95;
const LQ_EFFORT = 6;
const BLUR_WIDTH = 16;

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

function isPlainHero(name) {
  // hero.png, hero.jpg, etc. — excludes music-hero.jpg, enhanced_hero, etc.
  return /^hero\./i.test(name);
}

function isEnhancedHero(name) {
  // enhanced_hero.png, enhanced_hero (2).png, etc.
  return /^enhanced_hero/i.test(name);
}

function isHero(name) {
  return isPlainHero(name) || isEnhancedHero(name);
}

function isThisImage(name) {
  // Files matching "this image" skip the auto-trim so intentional negative
  // space around the subject is preserved.
  return name.toLowerCase().includes("this image");
}

async function processOne(srcPath, outDir, baseName) {
  const filename = path.basename(srcPath);
  const skipTrim = isThisImage(filename);

  // 1) Trim letterbox bars (or skip for "this image" files).
  const trimmed = skipTrim
    ? await sharp(srcPath).toBuffer()
    : await sharp(srcPath)
        .trim({ background: "#000000", threshold: 25 })
        .toBuffer();

  // 2) LQ: WebP @ q95, max 2400px wide, native aspect.
  const lqOutPath = path.join(outDir, `${baseName}.webp`);
  const { data: lqData, info: lqInfo } = await sharp(trimmed)
    .resize({ width: LQ_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: LQ_QUALITY, effort: LQ_EFFORT })
    .toBuffer({ resolveWithObject: true });
  await fs.writeFile(lqOutPath, lqData);

  // 3) HQ: PNG lossless, max 4800px wide, native aspect.
  const hqOutPath = path.join(outDir, `${baseName}-hq.png`);
  const { data: hqData, info: hqInfo } = await sharp(trimmed)
    .resize({ width: HQ_MAX_WIDTH, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer({ resolveWithObject: true });
  await fs.writeFile(hqOutPath, hqData);

  // 4) Blur placeholder from the LQ output (so colors + aspect match).
  const blurBuffer = await sharp(lqData)
    .resize({ width: BLUR_WIDTH })
    .webp({ quality: 50 })
    .toBuffer();
  const blurDataURL = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

  return {
    src: "/" + path.relative("public", lqOutPath).split(path.sep).join("/"),
    hqSrc: "/" + path.relative("public", hqOutPath).split(path.sep).join("/"),
    blurDataURL,
    width: lqInfo.width,
    height: lqInfo.height,
    hqWidth: hqInfo.width,
    hqHeight: hqInfo.height,
  };
}

async function processFolder(slug, folderName) {
  const srcDir = path.join(SOURCE_ROOT, folderName);
  const outDir = path.join(OUT_PUBLIC_ROOT, slug);

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

  // Hero selection: prefer enhanced_hero* over plain hero.*.
  const enhancedHeroes = files.filter(isEnhancedHero);
  const plainHeroes = files.filter(isPlainHero);
  let heroFile = null;
  if (enhancedHeroes.length > 0) {
    heroFile = enhancedHeroes[0];
  } else if (plainHeroes.length > 0) {
    heroFile = plainHeroes[0];
  }

  if (!heroFile) {
    console.warn(`  ! no hero found for ${slug}, skipping`);
    return null;
  }

  // Gallery: everything that's not a hero candidate. When enhanced_hero is
  // present the plain hero.* is dropped (they're the same shot).
  const galleryFiles = files.filter((f) => !isHero(f));

  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  console.log(`\n→ ${slug}`);
  console.log(`  hero: ${heroFile}`);
  const cover = await processOne(
    path.join(srcDir, heroFile),
    outDir,
    "hero",
  );

  const gallery = [];
  for (let i = 0; i < galleryFiles.length; i++) {
    const src = galleryFiles[i];
    console.log(`  gallery-${i + 1}: ${src}`);
    const meta = await processOne(
      path.join(srcDir, src),
      outDir,
      `gallery-${i + 1}`,
    );
    gallery.push(meta);
  }

  return { cover, gallery };
}

function emitTs(media) {
  const header = `// AUTO-GENERATED by scripts/optimize-project-images.mjs — do not edit by hand.
// Run \`node scripts/optimize-project-images.mjs\` to regenerate.

export interface ImageMeta {
  /** LQ WebP source — used for hero + thumbnails. */
  src: string;
  /** HQ PNG source — served by the lightbox / zoom view. */
  hqSrc: string;
  blurDataURL: string;
  /** Dimensions of the LQ WebP (governs hero / thumbnail aspect ratio). */
  width: number;
  height: number;
  /** Dimensions of the HQ PNG (governs lightbox sizing + zoom level). */
  hqWidth: number;
  hqHeight: number;
}

export interface ProjectMedia {
  cover: ImageMeta;
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
