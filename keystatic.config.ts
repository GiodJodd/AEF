import { config, collection, singleton, fields } from "@keystatic/core";

// Reading content via `createReader` works against the committed files
// regardless of `storage.kind`, so the site builds the same locally and on
// Vercel. `storage` only governs where the /keystatic admin UI writes:
//   - local  → writes to the working tree (dev)
//   - github → commits via a GitHub App (prod, so non-technical editors can
//              save changes straight to the repo)
//
// The /keystatic admin runs in the BROWSER, so the storage.kind trigger must be
// a NEXT_PUBLIC_ var — otherwise the client resolves a different storage.kind
// than the server (a server-only secret reads as undefined in the browser and
// the admin silently falls back to local). So github mode keys off the PUBLIC
// GitHub App slug: set the four env vars on Vercel and production becomes github.
// Without it (local dev, CI), storage is local and builds never need GitHub creds.
//
// One-time setup: run `npm run dev` with NEXT_PUBLIC_KEYSTATIC_SETUP=true (it's in
// .env.local) to force github mode before the app exists — that surfaces the
// GitHub App setup wizard at /keystatic. Dev-only, so production builds without
// the slug stay local and never throw. See CMS-ACCESS.md for the full walkthrough.
const useGithubStorage =
  !!process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG ||
  (process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_KEYSTATIC_SETUP === "true");
const storage = useGithubStorage
  ? ({ kind: "github", repo: "GiodJodd/AEF" } as const)
  : ({ kind: "local" } as const);

export default config({
  storage,
  ui: {
    brand: { name: "AEF" },
    navigation: {
      Content: ["films", "news"],
      Studio: ["team"],
      Pages: ["home", "about", "contact"],
      Settings: ["siteSettings", "filmOrder"],
    },
  },
  collections: {
    films: collection({
      label: "Films",
      slugField: "title",
      path: "src/content/films/*",
      // Keystatic slugifies the title for the filename/URL slug, e.g.
      // "JAIL TIME RECORDS" → "jail-time-records". Keep titles stable so the
      // public /projects/<slug> URLs never change.
      format: { data: "yaml" },
      entryLayout: "form",
      columns: ["year", "format"],
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
        }),
        year: fields.integer({
          label: "Year",
          validation: { isRequired: true },
        }),
        sortOrder: fields.integer({
          label: "Sort order",
          defaultValue: 100,
          description:
            "Fallback ordering (lower = first), used only for films not placed in the Film order list under Settings.",
        }),
        format: fields.select({
          label: "Format",
          options: [
            { label: "Feature Film", value: "feature" },
            { label: "Documentary", value: "documentary" },
            { label: "Short", value: "short" },
            { label: "Development", value: "development" },
          ],
          defaultValue: "short",
        }),
        formatLabel: fields.text({
          label: "Format label",
          description: 'Display label, e.g. "Feature Documentary".',
        }),
        logline: fields.text({
          label: "Logline",
          description:
            "One sentence. Used as the page's SEO meta description and social card text — keep it under ~155 characters.",
          multiline: true,
        }),
        tagline: fields.text({ label: "Tagline (optional)" }),
        synopsis: fields.text({
          label: "Synopsis",
          description: "Full synopsis. Separate paragraphs with a blank line.",
          multiline: true,
        }),
        directors: fields.array(fields.text({ label: "Director" }), {
          label: "Directors",
          itemLabel: (props) => props.value,
        }),
        producers: fields.array(fields.text({ label: "Producer" }), {
          label: "Producers",
          itemLabel: (props) => props.value,
        }),
        executiveProducers: fields.array(
          fields.text({ label: "Executive producer" }),
          { label: "Executive producers", itemLabel: (props) => props.value },
        ),
        partners: fields.array(fields.text({ label: "Partner" }), {
          label: "Partners",
          itemLabel: (props) => props.value,
        }),
        cast: fields.array(fields.text({ label: "Cast member" }), {
          label: "Cast",
          itemLabel: (props) => props.value,
        }),
        genre: fields.array(fields.text({ label: "Genre" }), {
          label: "Genres",
          itemLabel: (props) => props.value,
        }),
        festivals: fields.array(
          fields.object({
            name: fields.text({ label: "Festival / venue" }),
            year: fields.text({ label: "Year" }),
            award: fields.text({ label: "Award (optional)" }),
          }),
          {
            label: "Festivals & awards",
            itemLabel: (props) =>
              [props.fields.name.value, props.fields.year.value]
                .filter(Boolean)
                .join(" — "),
          },
        ),
        pressLinks: fields.array(
          fields.object({
            label: fields.text({ label: "Label" }),
            url: fields.url({ label: "URL" }),
          }),
          {
            label: "Press links",
            itemLabel: (props) => props.fields.label.value,
          },
        ),
        releaseDate: fields.text({
          label: "Release date (optional)",
          description: "ISO date (YYYY-MM-DD) or free text.",
        }),
        runtime: fields.text({ label: "Runtime (optional)" }),
        status: fields.text({
          label: "Status (optional)",
          description: 'e.g. "In production", "Released".',
        }),
        language: fields.text({ label: "Language (optional)" }),
        country: fields.text({ label: "Country (optional)" }),
        trailerUrl: fields.url({ label: "Trailer URL (optional)" }),
        gradient: fields.text({
          label: "Fallback gradient (CSS)",
          description: "Used as a colored backdrop when no cover image exists.",
        }),
        accentColor: fields.text({
          label: "Accent color (hex)",
          description: "Drives the nav accent on this film's page.",
        }),
        coverPosition: fields.text({
          label: "Cover object-position (optional)",
          description:
            'CSS object-position for the cover crop, e.g. "60% 50%". Defaults to center.',
        }),
        coverAlt: fields.text({
          label: "Cover alt text (optional)",
          description: "Describes the cover image for screen readers and SEO.",
        }),
        cover: fields.image({
          label: "Cover image (optional)",
          directory: "public/projects-src/films",
          publicPath: "/projects-src/films",
          description:
            "Hero shown on the film page and listings. Optimized at build (WebP + blur-up + social card). Leave empty to fall back to the gradient backdrop.",
        }),
        coverMobile: fields.conditional(
          fields.checkbox({
            label: "Use a separate mobile cover",
            defaultValue: false,
            description:
              "Off: the cover above is used on phones and desktop alike. On: upload a different phone-friendly image shown on small screens (home hero + film page).",
          }),
          {
            true: fields.image({
              label: "Mobile cover",
              directory: "public/projects-src/films",
              publicPath: "/projects-src/films",
              description:
                "Shown on small screens. Native aspect is preserved (not cropped to cinemascope) — upload it framed how you want it to appear on a phone.",
            }),
            false: fields.empty(),
          },
        ),
        gallery: fields.array(
          fields.image({
            label: "Gallery image",
            directory: "public/projects-src/films",
            publicPath: "/projects-src/films",
          }),
          {
            label: "Gallery",
            description: "Additional stills, optimized at build.",
            itemLabel: () => "Gallery image",
          },
        ),
        seoTitle: fields.text({
          label: "SEO title override (optional)",
          description: 'Defaults to "TITLE (year)".',
        }),
        seoDescription: fields.text({
          label: "SEO description override (optional)",
          description: "Defaults to the logline.",
          multiline: true,
        }),
      },
    }),

    news: collection({
      label: "News",
      slugField: "title",
      path: "src/content/news/*",
      format: { contentField: "body" },
      columns: ["publishedDate"],
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
        }),
        publishedDate: fields.date({
          label: "Published date",
          validation: { isRequired: true },
        }),
        excerpt: fields.text({
          label: "Excerpt",
          description: "Short summary for the index and SEO description.",
          multiline: true,
        }),
        coverImage: fields.image({
          label: "Cover image (optional)",
          directory: "public/images/news",
          publicPath: "/images/news",
        }),
        author: fields.text({ label: "Author", defaultValue: "AEF" }),
        draft: fields.checkbox({
          label: "Draft",
          description: "Hide from the published site.",
          defaultValue: false,
        }),
        body: fields.document({
          label: "Body",
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: "public/images/news",
            publicPath: "/images/news",
          },
        }),
      },
    }),

    team: collection({
      label: "Team",
      slugField: "name",
      path: "src/content/team/*",
      format: { data: "yaml" },
      columns: ["role"],
      schema: {
        name: fields.slug({
          name: { label: "Name", validation: { isRequired: true } },
        }),
        role: fields.text({ label: "Role" }),
        order: fields.integer({
          label: "Sort order",
          defaultValue: 0,
          description: "Lower numbers appear first.",
        }),
        photo: fields.image({
          label: "Photo (optional)",
          directory: "public/images/team",
          publicPath: "/images/team",
        }),
        bio: fields.text({ label: "Bio (optional)", multiline: true }),
      },
    }),
  },

  singletons: {
    siteSettings: singleton({
      label: "Site settings",
      path: "src/content/settings/site",
      format: { data: "yaml" },
      schema: {
        seoTitle: fields.text({ label: "Default SEO title" }),
        seoDescription: fields.text({
          label: "Default SEO description",
          multiline: true,
        }),
        contactEmail: fields.text({ label: "Contact email" }),
        studios: fields.array(
          fields.object({
            city: fields.text({ label: "City" }),
            street: fields.text({ label: "Street address" }),
            postalCode: fields.text({ label: "Postal code" }),
            country: fields.text({ label: "Country" }),
          }),
          {
            label: "Studios",
            description:
              "Listed in this order across the site (home, footer, about, contact) — drag to reorder.",
            itemLabel: (props) => props.fields.city.value || "Studio",
          },
        ),
        founders: fields.array(fields.text({ label: "Founder" }), {
          label: "Founders",
          itemLabel: (props) => props.value,
        }),
        foundingYear: fields.text({ label: "Founding year" }),
        foundingLocation: fields.text({ label: "Founding location" }),
        instagram: fields.url({ label: "Instagram URL (optional)" }),
        letterboxd: fields.url({ label: "Letterboxd URL (optional)" }),
        vimeo: fields.url({ label: "Vimeo URL (optional)" }),
        linkedin: fields.url({ label: "LinkedIn URL (optional)" }),
      },
    }),

    filmOrder: singleton({
      label: "Film order",
      path: "src/content/settings/film-order",
      format: { data: "yaml" },
      schema: {
        order: fields.array(
          fields.relationship({ label: "Film", collection: "films" }),
          {
            label: "Film display order",
            description:
              "Drag to set the order films appear on the home page and /projects. Any film not listed falls back to its Sort order number.",
            itemLabel: (props) => props.value ?? "—",
          },
        ),
      },
    }),

    home: singleton({
      label: "Home page",
      path: "src/content/pages/home",
      format: { data: "yaml" },
      schema: {
        aboutTeaser: fields.text({
          label: "About teaser",
          description: "Shown in the second hero section on the home page.",
          multiline: true,
        }),
        contactPrompt: fields.text({
          label: "Contact prompt",
          description: 'e.g. "Have a story to tell?"',
        }),
      },
    }),

    about: singleton({
      label: "About page",
      path: "src/content/pages/about",
      format: { data: "yaml" },
      schema: {
        lead: fields.text({
          label: "Lead paragraph",
          multiline: true,
        }),
        body: fields.array(
          fields.text({ label: "Paragraph", multiline: true }),
          {
            label: "Body paragraphs",
            itemLabel: (props) => props.value.slice(0, 60),
          },
        ),
      },
    }),

    contact: singleton({
      label: "Contact page",
      path: "src/content/pages/contact",
      format: { data: "yaml" },
      schema: {
        heading: fields.text({ label: "Heading" }),
        intro: fields.text({ label: "Intro line" }),
      },
    }),
  },
});
