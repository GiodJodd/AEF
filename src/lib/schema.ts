import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  CONTACT_EMAIL,
  FOUNDING_YEAR,
  FOUNDING_LOCATION,
  FOUNDERS,
  STUDIOS,
  SOCIAL_LINKS,
  type Studio,
} from "./site";
import { type Film, filmOgPath } from "./film";

// Stable @id so other schema nodes (e.g. a film's productionCompany) can
// reference the same Organization rather than duplicating it.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path}`;

interface OrgSettings {
  studios?: Studio[];
  founders?: string[];
  foundingYear?: string;
  foundingLocation?: string;
  contactEmail?: string;
  social?: string[];
  seoDescription?: string;
}

// Pass the CMS siteSettings to reflect editor changes; falls back to the
// canonical constants in site.ts when called without arguments.
export function organizationSchema(settings?: OrgSettings) {
  const studios = settings?.studios?.length ? settings.studios : STUDIOS;
  const founders = settings?.founders?.length ? settings.founders : FOUNDERS;
  const foundingYear = settings?.foundingYear || FOUNDING_YEAR;
  const foundingLocation = settings?.foundingLocation || FOUNDING_LOCATION;
  const email = settings?.contactEmail || CONTACT_EMAIL;
  const description = settings?.seoDescription || SITE_DESCRIPTION;
  const sameAs = settings?.social?.length ? settings.social : SOCIAL_LINKS;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: "AEF Productions",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description,
    email,
    foundingDate: foundingYear,
    ...(foundingLocation
      ? {
          foundingLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: foundingLocation,
            },
          },
        }
      : {}),
    founders: founders.map((name) => ({ "@type": "Person", name })),
    location: studios.map((s) => ({
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(s.street ? { streetAddress: s.street } : {}),
        ...(s.postalCode ? { postalCode: s.postalCode } : {}),
        addressLocality: s.city,
        ...(s.country ? { addressCountry: s.country } : {}),
      },
    })),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en",
  };
}

const person = (name: string) => ({ "@type": "Person", name });

/** schema.org/Movie for a single film page. Omits fields with no data. */
export function movieSchema(film: Film) {
  const url = `${SITE_URL}/projects/${film.slug}`;
  const og = filmOgPath(film);
  const image = og ? absoluteUrl(og) : undefined;
  const created = film.releaseDate || (film.year ? String(film.year) : "");

  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    "@id": `${url}#movie`,
    name: film.title,
    url,
    ...(film.logline ? { description: film.logline } : {}),
    ...(image ? { image } : {}),
    productionCompany: { "@id": ORGANIZATION_ID },
    ...(film.directors.length
      ? { director: film.directors.map(person) }
      : {}),
    ...(film.cast.length ? { actor: film.cast.map(person) } : {}),
    ...(film.genre.length ? { genre: film.genre } : {}),
    ...(created ? { dateCreated: created } : {}),
    ...(film.language ? { inLanguage: film.language } : {}),
    ...(film.country
      ? { countryOfOrigin: { "@type": "Country", name: film.country } }
      : {}),
    ...(film.trailerUrl
      ? {
          trailer: {
            "@type": "VideoObject",
            name: `${film.title} — Trailer`,
            description: film.logline || `Trailer for ${film.title}.`,
            embedUrl: film.trailerUrl,
            ...(created ? { uploadDate: created } : {}),
            ...(image ? { thumbnailUrl: [image] } : {}),
          },
        }
      : {}),
  };
}

/** schema.org/BreadcrumbList from an ordered list of {name, url} crumbs. */
export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.url),
    })),
  };
}

/** schema.org/NewsArticle for a single /news post. */
export function newsArticleSchema(post: {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedDate: string;
  author: string;
}) {
  const url = `${SITE_URL}/news/${post.slug}`;
  const image = post.coverImage ? absoluteUrl(post.coverImage) : undefined;
  // "AEF" authorship maps to the Organization node; a named person becomes a
  // Person so Google can attribute the byline.
  const byOrg = !post.author || post.author === SITE_NAME || post.author === "AEF";

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    headline: post.title,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(image ? { image } : {}),
    ...(post.publishedDate
      ? { datePublished: post.publishedDate, dateModified: post.publishedDate }
      : {}),
    author: byOrg ? { "@id": ORGANIZATION_ID } : person(post.author),
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/** schema.org/CollectionPage + ItemList for the /projects index. */
export function filmsCollectionSchema(films: Film[]) {
  const url = `${SITE_URL}/projects`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: "Projects",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: films.length,
      itemListElement: films.map((film, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/projects/${film.slug}`,
        name: film.title,
      })),
    },
  };
}
