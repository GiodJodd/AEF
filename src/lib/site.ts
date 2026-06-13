// Single source of truth for site-level identity used across metadata,
// robots, sitemap, manifest and JSON-LD. CMS (siteSettings) can override
// presentation copy later; canonical URL + brand identity live here.

export const SITE_URL = "https://aefproductions.com";
export const SITE_NAME = "AEF";
export const SITE_TITLE = "AEF — Independent Film Production";
export const SITE_DESCRIPTION =
  "AEF is an independent film production company between Rome and London, founded in 2022 by Matteo Severini and Riccardo Rizzi.";

export const CONTACT_EMAIL = "info@aef.film";
export const FOUNDING_YEAR = "2022";
export const FOUNDERS = ["Matteo Severini", "Riccardo Rizzi"];
export const LOCATIONS = ["Rome", "London"];

// sameAs profiles for the knowledge graph. Add real URLs (Instagram, Vimeo,
// LinkedIn, IMDb) when available — do not invent them.
export const SOCIAL_LINKS: string[] = [];
