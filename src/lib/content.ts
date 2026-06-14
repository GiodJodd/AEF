// Server-only content access layer. Wraps Keystatic's `createReader`, which
// reads the committed content files (src/content/**) at build time — no admin
// UI, GitHub App, or auth required for reads. Do NOT import this from client
// components; pass the returned plain objects down as props instead.
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import { PROJECT_MEDIA } from "@/data/project-media";
import { CMS_MEDIA } from "@/data/cms-media.generated";
import type { Film, ProjectFormat } from "./film";
import type { Studio } from "@/lib/site";

const reader = createReader(process.cwd(), keystaticConfig);

type FilmEntry = Awaited<
  ReturnType<typeof reader.collections.films.read>
>;

function toFilm(slug: string, entry: NonNullable<FilmEntry>): Film {
  return {
    slug,
    title: entry.title,
    year: entry.year ?? 0,
    sortOrder: entry.sortOrder ?? 100,
    format: entry.format as ProjectFormat,
    formatLabel: entry.formatLabel ?? "",
    logline: entry.logline ?? "",
    tagline: entry.tagline ?? "",
    synopsis: entry.synopsis ?? "",
    directors: [...(entry.directors ?? [])],
    producers: [...(entry.producers ?? [])],
    executiveProducers: [...(entry.executiveProducers ?? [])],
    partners: [...(entry.partners ?? [])],
    cast: [...(entry.cast ?? [])],
    genre: [...(entry.genre ?? [])],
    festivals: (entry.festivals ?? []).map((f) => ({
      name: f.name ?? "",
      year: f.year ?? "",
      award: f.award ?? "",
    })),
    pressLinks: (entry.pressLinks ?? []).map((p) => ({
      label: p.label ?? "",
      url: p.url ?? "",
    })),
    releaseDate: entry.releaseDate ?? "",
    runtime: entry.runtime ?? "",
    status: entry.status ?? "",
    language: entry.language ?? "",
    country: entry.country ?? "",
    trailerUrl: entry.trailerUrl ?? null,
    gradient: entry.gradient ?? "",
    accentColor: entry.accentColor ?? "",
    coverPosition: entry.coverPosition ?? "",
    coverAlt: entry.coverAlt ?? "",
    seoTitle: entry.seoTitle ?? "",
    seoDescription: entry.seoDescription ?? "",
    // CMS-uploaded imagery (build-time optimized) overrides the committed
    // PROJECT_MEDIA; falls back to it, then to the gradient when neither exists.
    media: CMS_MEDIA[slug] ?? PROJECT_MEDIA[slug],
  };
}

export async function getFilms(): Promise<Film[]> {
  const [all, orderDoc] = await Promise.all([
    reader.collections.films.all(),
    reader.singletons.filmOrder.read(),
  ]);
  const films = all.map(({ slug, entry }) => toFilm(slug, entry));
  // Editor-controlled drag order (Settings → Film order) wins; films not placed
  // in that list fall back to their per-film `sortOrder`. An empty/missing list
  // means every rank is Infinity → pure sortOrder, i.e. today's behavior.
  const ranked = (orderDoc?.order ?? []).filter(
    (s): s is string => typeof s === "string" && s.length > 0,
  );
  const rank = new Map(ranked.map((slug, i) => [slug, i] as const));
  return films.sort((a, b) => {
    const ra = rank.get(a.slug) ?? Infinity;
    const rb = rank.get(b.slug) ?? Infinity;
    return ra !== rb ? ra - rb : a.sortOrder - b.sortOrder;
  });
}

export async function getFilm(slug: string): Promise<Film | null> {
  const entry = await reader.collections.films.read(slug);
  return entry ? toFilm(slug, entry) : null;
}

export async function getFilmSlugs(): Promise<string[]> {
  return reader.collections.films.list();
}

/** Films that have optimized cover imagery — used for the homepage hero. */
export async function getFilmsWithMedia(): Promise<Film[]> {
  const films = await getFilms();
  return films.filter((f) => f.media !== undefined);
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  order: number;
  photo: string | null;
  bio: string;
}

export async function getTeam(): Promise<TeamMember[]> {
  const all = await reader.collections.team.all();
  return all
    .map(({ slug, entry }) => ({
      slug,
      name: entry.name,
      role: entry.role ?? "",
      order: entry.order ?? 0,
      photo: entry.photo ?? null,
      bio: entry.bio ?? "",
    }))
    .sort((a, b) => a.order - b.order);
}

export interface SiteSettings {
  seoTitle: string;
  seoDescription: string;
  contactEmail: string;
  studios: Studio[];
  locations: string[];
  founders: string[];
  foundingYear: string;
  foundingLocation: string;
  social: string[];
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const s = await reader.singletons.siteSettings.read();
  const social = [s?.instagram, s?.letterboxd, s?.vimeo, s?.linkedin].filter(
    (u): u is string => typeof u === "string" && u.length > 0,
  );
  const studios: Studio[] = (s?.studios ?? []).map((st) => ({
    city: st?.city ?? "",
    street: st?.street ?? "",
    postalCode: st?.postalCode ?? "",
    country: st?.country ?? "",
  }));
  return {
    seoTitle: s?.seoTitle ?? "",
    seoDescription: s?.seoDescription ?? "",
    contactEmail: s?.contactEmail ?? "",
    studios,
    locations: studios.map((st) => st.city),
    founders: [...(s?.founders ?? [])],
    foundingYear: s?.foundingYear ?? "",
    foundingLocation: s?.foundingLocation ?? "",
    social,
  };
}

export interface HomeContent {
  aboutTeaser: string;
  contactPrompt: string;
}

export async function getHome(): Promise<HomeContent> {
  const h = await reader.singletons.home.read();
  return {
    aboutTeaser: h?.aboutTeaser ?? "",
    contactPrompt: h?.contactPrompt ?? "",
  };
}

export interface AboutContent {
  lead: string;
  body: string[];
}

export async function getAbout(): Promise<AboutContent> {
  const a = await reader.singletons.about.read();
  return {
    lead: a?.lead ?? "",
    body: [...(a?.body ?? [])],
  };
}

export interface ContactContent {
  heading: string;
  intro: string;
}

export async function getContact(): Promise<ContactContent> {
  const c = await reader.singletons.contact.read();
  return {
    heading: c?.heading ?? "",
    intro: c?.intro ?? "",
  };
}

export interface NewsListItem {
  slug: string;
  title: string;
  publishedDate: string;
  excerpt: string;
  coverImage: string | null;
  author: string;
}

export async function getNews(): Promise<NewsListItem[]> {
  const all = await reader.collections.news.all();
  return all
    .filter(({ entry }) => !entry.draft)
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      publishedDate: entry.publishedDate ?? "",
      excerpt: entry.excerpt ?? "",
      coverImage: entry.coverImage ?? null,
      author: entry.author ?? "AEF",
    }))
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
}

type NewsEntry = NonNullable<
  Awaited<ReturnType<typeof reader.collections.news.read>>
>;
// `entry.body` is typed as the parsed node tree OR a lazy resolver returning
// it. This collapses both arms to the resolved node tree the renderer consumes.
type Resolved<T> = T extends (...args: never[]) => Promise<infer R> ? R : T;
export type NewsBody = Resolved<NewsEntry["body"]>;

export interface NewsPost extends NewsListItem {
  content: NewsBody;
}

/** Published post slugs — for generateStaticParams, the sitemap and the feed. */
export async function getNewsSlugs(): Promise<string[]> {
  const all = await reader.collections.news.all();
  return all.filter(({ entry }) => !entry.draft).map(({ slug }) => slug);
}

export async function getNewsPost(slug: string): Promise<NewsPost | null> {
  const entry = await reader.collections.news.read(slug);
  if (!entry || entry.draft) return null;
  const body = entry.body;
  const content = (
    typeof body === "function" ? await body() : body
  ) as NewsBody;
  return {
    slug,
    title: entry.title,
    publishedDate: entry.publishedDate ?? "",
    excerpt: entry.excerpt ?? "",
    coverImage: entry.coverImage ?? null,
    author: entry.author ?? "AEF",
    content,
  };
}
