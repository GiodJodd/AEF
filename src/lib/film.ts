// Client-safe film types + format filters. No server-only imports here so both
// server (content layer) and client (UI) modules can share these shapes.
import type { ProjectMedia } from "@/data/project-media";

export type ProjectFormat = "feature" | "documentary" | "short" | "development";

export interface Festival {
  name: string;
  year: string;
  award: string;
}

export interface PressLink {
  label: string;
  url: string;
}

export interface Film {
  slug: string;
  title: string;
  year: number;
  sortOrder: number;
  format: ProjectFormat;
  formatLabel: string;
  logline: string;
  tagline: string;
  synopsis: string;
  directors: string[];
  producers: string[];
  executiveProducers: string[];
  partners: string[];
  cast: string[];
  genre: string[];
  festivals: Festival[];
  pressLinks: PressLink[];
  releaseDate: string;
  runtime: string;
  status: string;
  language: string;
  country: string;
  trailerUrl: string | null;
  gradient: string;
  accentColor: string;
  coverPosition: string;
  coverAlt: string;
  seoTitle: string;
  seoDescription: string;
  /** Optimized cover + gallery from the build-time image pipeline, if present. */
  media?: ProjectMedia;
}

/**
 * Social card path for a film: the `og.jpg` the image pipeline emits next to
 * the optimized cover. Derived from `cover.src` so it resolves correctly for
 * both committed films (`/projects/<slug>/`) and CMS uploads
 * (`/projects-cms/<slug>/`). Null when the film has no cover.
 */
export function filmOgPath(film: Film): string | null {
  return film.media ? film.media.cover.src.replace(/[^/]+$/, "og.jpg") : null;
}

export const FORMAT_FILTERS: { value: ProjectFormat | "all"; label: string }[] =
  [
    { value: "all", label: "All" },
    { value: "feature", label: "Features" },
    { value: "documentary", label: "Documentaries" },
    { value: "short", label: "Shorts" },
    { value: "development", label: "Development" },
  ];
