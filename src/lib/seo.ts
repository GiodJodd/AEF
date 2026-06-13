import type { Metadata } from "next";
import { SITE_URL } from "./site";

type OgImage = NonNullable<NonNullable<Metadata["openGraph"]>["images"]>;

// Next merges metadata shallowly, so a page that sets `alternates.canonical`
// drops any inherited `alternates.types`. Re-declare the feed link on every
// page (via this helper and the home page) so RSS discovery survives.
export const FEED_ALTERNATE = {
  "application/rss+xml": `${SITE_URL}/feed.xml`,
} as const;

/**
 * Builds per-page metadata: a templated <title> ("X — AEF"), description, a
 * canonical URL (resolved against metadataBase in the root layout), and
 * matching OpenGraph/Twitter fields. Omit `images` to inherit the root
 * opengraph-image.jpg / twitter-image.jpg file-convention images.
 */
export function pageMetadata({
  title,
  description,
  path,
  images,
}: {
  title: string;
  description: string;
  path: string;
  images?: OgImage;
}): Metadata {
  const fullTitle = `${title} — AEF`;
  return {
    title,
    description,
    alternates: { canonical: path, types: FEED_ALTERNATE },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      ...(images ? { images } : {}),
    },
    twitter: {
      title: fullTitle,
      description,
      ...(images ? { images } : {}),
    },
  };
}
