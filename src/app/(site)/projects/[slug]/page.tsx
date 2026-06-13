import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFilm, getFilms, getFilmSlugs } from "@/lib/content";
import { type Film, filmOgPath } from "@/lib/film";
import { pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { movieSchema, breadcrumbSchema } from "@/lib/schema";
import ProjectDetailClient, { type RelatedFilm } from "./ProjectDetailClient";

// Same-format films first, then fill from the rest — gives every film a few
// crawlable internal links without inventing relationships.
function pickRelated(all: Film[], current: Film, n: number): RelatedFilm[] {
  const others = all.filter((f) => f.slug !== current.slug);
  const sameFormat = others.filter((f) => f.format === current.format);
  const rest = others.filter((f) => f.format !== current.format);
  return [...sameFormat, ...rest].slice(0, n).map((f) => ({
    slug: f.slug,
    title: f.title,
    formatLabel: f.formatLabel,
    gradient: f.gradient,
    coverAlt: f.coverAlt,
    cover: f.media
      ? { src: f.media.cover.src, blurDataURL: f.media.cover.blurDataURL }
      : null,
  }));
}

// Fixed film catalog → prerender every slug and 404 anything else.
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getFilmSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const film = await getFilm(slug);
  if (!film) return {};
  const og = filmOgPath(film);
  return pageMetadata({
    title: film.seoTitle || `${film.title} (${film.year})`,
    description: film.seoDescription || film.logline,
    path: `/projects/${slug}`,
    images: og
      ? [
          {
            url: og,
            width: 1200,
            height: 630,
            alt: film.coverAlt || film.title,
          },
        ]
      : undefined,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [film, allFilms] = await Promise.all([getFilm(slug), getFilms()]);
  if (!film) notFound();
  const related = pickRelated(allFilms, film, 3);
  return (
    <>
      <JsonLd
        data={[
          movieSchema(film),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Projects", url: "/projects" },
            { name: film.title, url: `/projects/${film.slug}` },
          ]),
        ]}
      />
      <ProjectDetailClient film={film} related={related} />
    </>
  );
}
