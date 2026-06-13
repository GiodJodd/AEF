#!/usr/bin/env node
/**
 * Derives a 1200×630 social-card image for each film from its committed cover
 * (public/projects/<slug>/hero.webp), writing public/projects/<slug>/og.jpg.
 *
 * JPG (not WebP) for maximum compatibility with social/link-preview crawlers,
 * and 1200×630 is the canonical OpenGraph/Twitter summary_large_image size.
 * The covers are 2.39:1 cinemascope, so a center cover-crop trims the sides to
 * the 1.91:1 OG frame — the subject stays centered.
 *
 * Runs as a `prebuild` step so the cards always track the current covers and
 * are regenerated in CI without needing the original (non-repo) source images.
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("public/projects");
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const QUALITY = 82;

async function main() {
  let dirs;
  try {
    dirs = await fs.readdir(ROOT, { withFileTypes: true });
  } catch {
    console.warn(`No ${ROOT} directory — skipping OG image generation.`);
    return;
  }

  let count = 0;
  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;
    const slug = dir.name;
    const hero = path.join(ROOT, slug, "hero.webp");
    try {
      await fs.access(hero);
    } catch {
      continue; // no cover (e.g. in-development films) → root OG image is used
    }
    const out = path.join(ROOT, slug, "og.jpg");
    await sharp(hero)
      .resize({ width: OG_WIDTH, height: OG_HEIGHT, fit: "cover", position: "center" })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(out);
    count += 1;
    console.log(`  og.jpg → ${slug}`);
  }
  console.log(`Done. ${count} social cards generated.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
