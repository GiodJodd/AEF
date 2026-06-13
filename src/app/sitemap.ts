import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getFilmSlugs, getNewsSlugs } from "@/lib/content";

// Slugs come from the Keystatic reader (committed content), so the sitemap
// stays in sync with whatever editors publish.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  const [filmSlugs, newsSlugs] = await Promise.all([
    getFilmSlugs(),
    getNewsSlugs(),
  ]);

  const filmRoutes: MetadataRoute.Sitemap = filmSlugs.map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const newsRoutes: MetadataRoute.Sitemap = newsSlugs.map((slug) => ({
    url: `${SITE_URL}/news/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...filmRoutes, ...newsRoutes];
}
