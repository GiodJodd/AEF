// Single source of truth for site-level identity used across metadata,
// robots, sitemap, manifest and JSON-LD. CMS (siteSettings) can override
// presentation copy; canonical URL + brand identity live here as the fallback.

export const SITE_URL = "https://aefproductions.com";
export const SITE_NAME = "AEF";
export const SITE_TITLE = "AEF — Independent Film Production";
export const SITE_DESCRIPTION =
  "AEF is an independent film production company between London and Rome, founded in London in 2022 by Matteo Severini and Riccardo Rizzi.";

export const CONTACT_EMAIL = "info@aef.film";
export const FOUNDING_YEAR = "2022";
export const FOUNDING_LOCATION = "London";
export const FOUNDERS = ["Matteo Severini", "Riccardo Rizzi"];

export interface Studio {
  city: string;
  street: string;
  postalCode: string;
  country: string;
}

// London is listed first by design. Canonical fallback for the Organization
// schema + footer when the CMS siteSettings carries no studios.
export const STUDIOS: Studio[] = [
  {
    city: "London",
    street: "12B Kensington Gardens Square",
    postalCode: "W2 4BH",
    country: "UK",
  },
  {
    city: "Rome",
    street: "Via Giorgio Vasari, 4",
    postalCode: "00196",
    country: "Italy",
  },
];

// City names only (London first), for any city-only display.
export const LOCATIONS = STUDIOS.map((s) => s.city);

/** "12B Kensington Gardens Square, W2 4BH, UK" — street, postcode, country. */
export function formatStudioAddress(s: Studio): string {
  return [s.street, s.postalCode, s.country].filter(Boolean).join(", ");
}

// sameAs profiles for the knowledge graph. Add real URLs (Instagram, Vimeo,
// LinkedIn, IMDb) when available — do not invent them.
export const SOCIAL_LINKS: string[] = [];
