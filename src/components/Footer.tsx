"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  CONTACT_EMAIL,
  SOCIAL_LINKS,
  STUDIOS,
  formatStudioAddress,
} from "@/lib/site";
import { PROJECT_MEDIA } from "@/data/project-media";
import { useSiteSettings } from "@/components/SiteSettingsContext";

// Label a social URL from its host so the owner only maintains URLs in one
// place (CMS / src/lib/site.ts) — we never invent a link, only render real ones.
const SOCIAL_LABELS: Record<string, string> = {
  "instagram.com": "Instagram",
  "vimeo.com": "Vimeo",
  "linkedin.com": "LinkedIn",
  "letterboxd.com": "Letterboxd",
  "youtube.com": "YouTube",
  "imdb.com": "IMDb",
};

function socialLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return (
      SOCIAL_LABELS[host] ??
      host.split(".")[0].replace(/^./, (c) => c.toUpperCase())
    );
  } catch {
    return "Link";
  }
}

// A single atmospheric still anchors the footer. Swap the slug to re-art-direct;
// falls back to any available cover, or to a plain dark footer if none exist.
const footerCover =
  PROJECT_MEDIA["cuirdange"] ??
  PROJECT_MEDIA["noia"] ??
  Object.values(PROJECT_MEDIA)[0] ??
  null;

export default function Footer({ minimal = false }: { minimal?: boolean }) {
  const reduce = useReducedMotion();
  const settings = useSiteSettings();
  const studios = settings?.studios?.length ? settings.studios : STUDIOS;
  const email = settings?.contactEmail || CONTACT_EMAIL;
  const social = settings?.social?.length ? settings.social : SOCIAL_LINKS;

  // Compact fixed bar for the Keystatic admin chrome — unchanged.
  if (minimal) {
    return (
      <footer className="fixed bottom-0 left-0 right-0 z-40 px-6 md:px-12 py-4 flex justify-between items-center text-xs tracking-wide text-[#444]">
        <span>AEF &middot; London &middot; Rome</span>
        <span>&copy; 2026</span>
      </footer>
    );
  }

  return (
    <footer className="relative flex min-h-[70vh] flex-col justify-end overflow-hidden bg-[#0a0a0a]">
      {footerCover && (
        <Image
          src={footerCover.cover.src}
          alt=""
          fill
          placeholder="blur"
          blurDataURL={footerCover.cover.blurDataURL}
          sizes="100vw"
          className="object-cover"
        />
      )}
      {/* Film grain — matches the hero */}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]" />
      {/* Flat dark wash for legibility — no gradient */}
      <div className="absolute inset-0 bg-[#0a0a0a]/60" />

      <motion.div
        className="relative z-10 px-8 md:px-16 pb-10 md:pb-16"
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
      >
        <Link href="/" aria-label="AEF — Home" className="inline-block text-white transition-opacity hover:opacity-80">
          <svg
            viewBox="0 0 231 233"
            className="h-14 md:h-20 w-auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M104.061 189.121V154.677C104.061 144.881 92.2212 139.973 85.2905 146.891L228.561 3.62109V231.121H146.061C122.865 231.121 104.061 212.317 104.061 189.121Z"
              fill="currentColor"
            />
            <path
              d="M1.06055 231.121L85.2824 146.899C92.212 139.97 104.061 144.877 104.061 154.677V189.121C104.061 212.317 122.865 231.121 146.061 231.121H228.561V3.62109L1.06055 231.121Z"
              stroke="currentColor"
              strokeWidth={3}
            />
          </svg>
        </Link>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {/* Studios — listed in CMS order (London first) */}
          <div className="flex flex-col gap-5 sm:flex-row sm:gap-12">
            {studios.map((s) => (
              <div key={s.city} className="text-sm leading-relaxed">
                <p className="text-white/90">{s.city}</p>
                <p className="text-white/55">{formatStudioAddress(s)}</p>
              </div>
            ))}
          </div>

          {/* Contact + legal */}
          <div className="flex flex-col gap-2 lg:items-end">
            <a
              href={`mailto:${email}`}
              className="text-lg md:text-xl font-light text-white/85 transition-colors hover:text-white"
            >
              {email}
            </a>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs tracking-[0.1em] text-white/45 lg:justify-end">
              {social.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {socialLabel(url)}
                </a>
              ))}
              <span>&copy; 2026 AEF</span>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
