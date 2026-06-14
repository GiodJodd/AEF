"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Film } from "@/lib/film";
import Footer from "@/components/Footer";
import ProjectGallery from "@/components/ProjectGallery";
import { useHeroColor } from "@/components/HeroColorContext";

export interface RelatedFilm {
  slug: string;
  title: string;
  formatLabel: string;
  gradient: string;
  coverAlt: string;
  cover: { src: string; blurDataURL: string } | null;
}

export default function ProjectDetailClient({
  film,
  related,
}: {
  film: Film;
  related: RelatedFilm[];
}) {
  const media = film.media;

  // Sync nav accent color with this film even though we don't use PageWithHero
  const { setHeroColor } = useHeroColor();
  useEffect(() => {
    setHeroColor({
      gradient: film.gradient,
      accentColor: film.accentColor,
      title: film.title,
    });
  }, [film, setHeroColor]);

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
        {/* Hero */}
        <div className="relative h-[70vh] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1, filter: "blur(10px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {!media ? (
              <div className="absolute inset-0 bg-[#141414]" />
            ) : media.coverMobile ? (
              <>
                <Image
                  src={media.coverMobile.src}
                  alt={film.coverAlt || film.title}
                  fill
                  priority
                  placeholder="blur"
                  blurDataURL={media.coverMobile.blurDataURL}
                  sizes="100vw"
                  className="object-cover md:hidden"
                />
                <Image
                  src={media.cover.src}
                  alt={film.coverAlt || film.title}
                  fill
                  priority
                  placeholder="blur"
                  blurDataURL={media.cover.blurDataURL}
                  sizes="100vw"
                  className="hidden object-cover md:block"
                  style={{ objectPosition: film.coverPosition || "center" }}
                />
              </>
            ) : (
              <Image
                src={media.cover.src}
                alt={film.coverAlt || film.title}
                fill
                priority
                placeholder="blur"
                blurDataURL={media.cover.blurDataURL}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: film.coverPosition || "center" }}
              />
            )}
          </motion.div>
          {/* Film grain */}
          <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 20 }}
            >
              <p className="text-xs tracking-[0.12em] text-white/40 mb-3">
                {film.formatLabel}
              </p>
              <h1 className="text-5xl md:text-7xl font-extralight tracking-tight mb-3">
                {film.title}
              </h1>
              <p className="text-sm text-white/50 tracking-wide">
                Directed by {film.directors.join(", ")}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Details */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12">
              {/* Credits column */}
              <div className="space-y-6 text-sm text-white/50">
                <div>
                  <h3 className="text-xs tracking-[0.12em] text-white/30 mb-2">
                    Directed By
                  </h3>
                  {film.directors.map((d) => (
                    <p key={d}>{d}</p>
                  ))}
                </div>
                <div>
                  <h3 className="text-xs tracking-[0.12em] text-white/30 mb-2">
                    Produced By
                  </h3>
                  {film.producers.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                {film.executiveProducers.length > 0 && (
                  <div>
                    <h3 className="text-xs tracking-[0.12em] text-white/30 mb-2">
                      Executive Producers
                    </h3>
                    {film.executiveProducers.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                )}
                {film.partners.length > 0 && (
                  <div>
                    <h3 className="text-xs tracking-[0.12em] text-white/30 mb-2">
                      With
                    </h3>
                    {film.partners.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                )}
                <div>
                  <h3 className="text-xs tracking-[0.12em] text-white/30 mb-2">
                    Format
                  </h3>
                  <p>{film.formatLabel}</p>
                </div>
              </div>

              {/* Synopsis column */}
              <div>
                <h2 className="text-xs tracking-[0.12em] text-white/30 mb-4">
                  Synopsis
                </h2>
                <div className="space-y-4 text-lg font-light leading-relaxed text-white/60">
                  {film.synopsis.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Gallery mosaic — only if there are gallery images */}
            {media && media.gallery.length > 0 && (
              <div className="mt-20">
                <h2 className="text-xs tracking-[0.12em] text-white/30 mb-8">
                  Gallery
                </h2>
                <ProjectGallery images={media.gallery} title={film.title} />
              </div>
            )}

            {/* Related films — internal linking */}
            {related.length > 0 && (
              <div className="mt-24">
                <h2 className="text-xs tracking-[0.12em] text-white/30 mb-8">
                  More Projects
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/projects/${r.slug}`}
                      className="group block"
                    >
                      <div
                        className="relative w-full overflow-hidden rounded-sm"
                        style={{ aspectRatio: "2.39 / 1" }}
                      >
                        {r.cover ? (
                          <Image
                            src={r.cover.src}
                            alt={r.coverAlt || r.title}
                            fill
                            placeholder="blur"
                            blurDataURL={r.cover.blurDataURL}
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-[#141414]" />
                        )}
                      </div>
                      <p className="mt-3 text-xs tracking-[0.12em] text-white/30">
                        {r.formatLabel}
                      </p>
                      <p className="mt-1 text-lg font-light text-white/80 transition-colors group-hover:text-white">
                        {r.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back link */}
            <div className="mt-16">
              <Link
                href="/projects"
                className="text-xs tracking-[0.12em] text-white/30 hover:text-white/70 transition-colors"
              >
                &larr; All Projects
              </Link>
            </div>
          </motion.div>
        </div>

        <Footer />
      </main>
  );
}
