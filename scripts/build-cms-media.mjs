#!/usr/bin/env node
/**
 * CI-safe `prebuild` step that turns CMS-uploaded film imagery into the same
 * optimized derivatives the hand-curated films already ship.
 *
 * Non-technical editors upload originals from /keystatic — committed to
 * public/projects-src/films via the GitHub storage — and this script reads each
 * film entry (src/content/films/<slug>.yaml), then for any film with a `cover`
 * (and optional `gallery`) it uses sharp to emit:
 *   - public/projects-cms/<slug>/hero.webp        (cover, cinemascope 2.39:1)
 *   - public/projects-cms/<slug>/gallery-N.webp   (stills, native aspect)
 *   - public/projects-cms/<slug>/og.jpg           (1200x630 social card)
 *   - src/data/cms-media.generated.ts             (typed cover+gallery+blur map)
 *
 * The content layer prefers CMS_MEDIA[slug] over the committed PROJECT_MEDIA, so
 * a CMS upload transparently overrides a film's imagery. Films without a CMS
 * cover are skipped and keep falling back to PROJECT_MEDIA. With no CMS images
 * at all the map is `{}` and the site renders exactly as before.
 */
import sharp from "sharp";
import yaml from "js-yaml";
import fs from "node:fs/promises";
import path from "node:path";

const FILMS_DIR = path.resolve("src/content/films");
const SETTINGS_FILE = path.resolve("src/content/settings/site.yaml");
const PUBLIC_DIR = path.resolve("public");
const OUT_ROOT = path.resolve("public/projects-cms");
const OUT_FOOTER_ROOT = path.resolve("public/footer-cms");
const OUT_DATA_FILE = path.resolve("src/data/cms-media.generated.ts");

const TARGET_WIDTH = 2400;
const QUALITY = 90;
const EFFORT = 6;
const BLUR_WIDTH = 16;
const CINEMASCOPE_RATIO = 2.39;
const ASPECT_TOLERANCE = 0.06; // already-cinemascope sources skip the re-crop
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const OG_QUALITY = 82;

// Resolve a Keystatic public path (e.g. "/projects-src/films/x.jpg") to disk.
function toDiskPath(publicPath) {
  return path.join(PUBLIC_DIR, publicPath.replace(/^\//, ""));
}

function toPublicSrc(outPath) {
  return "/" + path.relative(PUBLIC_DIR, outPath).split(path.sep).join("/");
}

async function optimize(srcDisk, outPath, { crop }) {
  const meta = await sharp(srcDisk).metadata();
  let pipeline = sharp(srcDisk).rotate(); // honor EXIF orientation

  const ratio = meta.width / meta.height;
  const alreadyCinemascope = Math.abs(ratio - CINEMASCOPE_RATIO) < ASPECT_TOLERANCE;

  if (crop && !alreadyCinemascope) {
    const w = Math.min(meta.width, TARGET_WIDTH);
    const h = Math.round(w / CINEMASCOPE_RATIO);
    pipeline = pipeline.resize({ width: w, height: h, fit: "cover", position: "center" });
  } else {
    pipeline = pipeline.resize({ width: TARGET_WIDTH, withoutEnlargement: true });
  }

  const { data, info } = await pipeline
    .webp({ quality: QUALITY, effort: EFFORT })
    .toBuffer({ resolveWithObject: true });
  await fs.writeFile(outPath, data);

  const blurBuffer = await sharp(data)
    .resize({ width: BLUR_WIDTH })
    .webp({ quality: 50 })
    .toBuffer();

  return {
    src: toPublicSrc(outPath),
    blurDataURL: `data:image/webp;base64,${blurBuffer.toString("base64")}`,
    width: info.width,
    height: info.height,
  };
}

async function processFilm(slug, data) {
  const coverPath = typeof data.cover === "string" ? data.cover : null;
  if (!coverPath) return null;

  const coverDisk = toDiskPath(coverPath);
  try {
    await fs.access(coverDisk);
  } catch {
    console.warn(`  ! ${slug}: cover not found on disk (${coverPath}) — skipping`);
    return null;
  }

  const outDir = path.join(OUT_ROOT, slug);
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  console.log(`\n→ ${slug}`);
  console.log(`  cover: ${coverPath}`);
  const cover = await optimize(coverDisk, path.join(outDir, "hero.webp"), { crop: true });

  // Optional per-film mobile cover. Keystatic `fields.conditional` (checkbox)
  // serializes as `coverMobile: { discriminant: true, value: <path> }` when on.
  // Native aspect is preserved (crop:false) — the editor frames it for phones.
  const mc = data.coverMobile;
  const coverMobilePath =
    mc && mc.discriminant === true && typeof mc.value === "string" ? mc.value : null;
  let coverMobile = null;
  if (coverMobilePath) {
    const mDisk = toDiskPath(coverMobilePath);
    let exists = true;
    try {
      await fs.access(mDisk);
    } catch {
      exists = false;
      console.warn(
        `  ! ${slug}: mobile cover missing (${coverMobilePath}) — falling back to desktop cover`,
      );
    }
    if (exists) {
      console.log(`  mobile cover: ${coverMobilePath}`);
      coverMobile = await optimize(mDisk, path.join(outDir, "hero-mobile.webp"), {
        crop: false,
      });
    }
  }

  const galleryPaths = Array.isArray(data.gallery)
    ? data.gallery.filter((g) => typeof g === "string")
    : [];
  const gallery = [];
  for (let i = 0; i < galleryPaths.length; i++) {
    const gDisk = toDiskPath(galleryPaths[i]);
    try {
      await fs.access(gDisk);
    } catch {
      console.warn(`  ! ${slug}: gallery image missing (${galleryPaths[i]}) — skipping`);
      continue;
    }
    console.log(`  gallery-${gallery.length + 1}: ${galleryPaths[i]}`);
    const meta = await optimize(gDisk, path.join(outDir, `gallery-${gallery.length + 1}.webp`), {
      crop: false,
    });
    gallery.push(meta);
  }

  // Social card derived from the optimized cover (sibling og.jpg).
  await sharp(path.join(outDir, "hero.webp"))
    .resize({ width: OG_WIDTH, height: OG_HEIGHT, fit: "cover", position: "center" })
    .jpeg({ quality: OG_QUALITY, mozjpeg: true })
    .toFile(path.join(outDir, "og.jpg"));

  return { cover, ...(coverMobile && { coverMobile }), gallery };
}

// A single optional footer backdrop from Site settings (siteSettings.footerImage).
// Native aspect is preserved (no cinemascope crop) — it's a full-bleed still.
async function processFooter() {
  let raw;
  try {
    raw = await fs.readFile(SETTINGS_FILE, "utf8");
  } catch {
    return null; // no settings file yet
  }
  const data = yaml.load(raw) ?? {};
  const imgPath = typeof data.footerImage === "string" ? data.footerImage : null;
  if (!imgPath) return null;

  const disk = toDiskPath(imgPath);
  try {
    await fs.access(disk);
  } catch {
    console.warn(`  ! footer image not found on disk (${imgPath}) — skipping`);
    return null;
  }

  await fs.rm(OUT_FOOTER_ROOT, { recursive: true, force: true });
  await fs.mkdir(OUT_FOOTER_ROOT, { recursive: true });
  console.log(`\n→ footer`);
  console.log(`  image: ${imgPath}`);
  return optimize(disk, path.join(OUT_FOOTER_ROOT, "footer.webp"), { crop: false });
}

function emitTs(media, footer) {
  return (
    "// AUTO-GENERATED by scripts/build-cms-media.mjs — do not edit by hand.\n" +
    "// Regenerated on every build from CMS-uploaded imagery.\n" +
    'import type { ImageMeta, ProjectMedia } from "./project-media";\n\n' +
    "export const CMS_MEDIA: Record<string, ProjectMedia> = " +
    JSON.stringify(media, null, 2) +
    ";\n\n" +
    "export const FOOTER_MEDIA: ImageMeta | null = " +
    JSON.stringify(footer ?? null, null, 2) +
    ";\n"
  );
}

async function main() {
  let files = [];
  try {
    files = await fs.readdir(FILMS_DIR);
  } catch {
    console.warn(`No ${FILMS_DIR} — no film imagery to process.`);
  }

  const media = {};
  for (const file of files.filter((f) => f.endsWith(".yaml")).sort()) {
    const slug = path.basename(file, ".yaml");
    const raw = await fs.readFile(path.join(FILMS_DIR, file), "utf8");
    const data = yaml.load(raw) ?? {};
    const result = await processFilm(slug, data);
    if (result) media[slug] = result;
  }

  const footer = await processFooter();

  await fs.mkdir(path.dirname(OUT_DATA_FILE), { recursive: true });
  await fs.writeFile(OUT_DATA_FILE, emitTs(media, footer));
  const count = Object.keys(media).length;
  console.log(
    `\nWrote ${OUT_DATA_FILE} — ${count} film(s) with CMS imagery` +
      `${footer ? " + footer image" : ""}.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
