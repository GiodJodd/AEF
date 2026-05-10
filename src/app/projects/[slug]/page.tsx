"use client";

import { use, useEffect } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getProject, getProjectMedia } from "@/data/projects";
import Footer from "@/components/Footer";
import MediaCarousel from "@/components/MediaCarousel";
import { useHeroColor } from "@/components/HeroColorContext";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const project = getProject(slug);
  const media = getProjectMedia(slug);

  // Sync nav accent color with this project even though we don't use PageWithHero
  const { setHeroColor } = useHeroColor();
  useEffect(() => {
    if (project) {
      setHeroColor({
        gradient: project.gradient,
        accentColor: project.accentColor,
        title: project.title,
      });
    }
  }, [project, setHeroColor]);

  if (!project) notFound();

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
            {media ? (
              <Image
                src={media.cover.src}
                alt={project.title}
                fill
                priority
                placeholder="blur"
                blurDataURL={media.cover.blurDataURL}
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: project.gradient }}
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
              <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3">
                {project.formatLabel}
              </p>
              <h1 className="text-5xl md:text-7xl font-extralight tracking-tight mb-3">
                {project.title}
              </h1>
              <p className="text-sm text-white/50 tracking-wide">
                Directed by {project.directors.join(", ")}
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
                  <h3 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-2">
                    Directed By
                  </h3>
                  {project.directors.map((d) => (
                    <p key={d}>{d}</p>
                  ))}
                </div>
                <div>
                  <h3 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-2">
                    Produced By
                  </h3>
                  {project.producers.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                {project.executiveProducers && project.executiveProducers.length > 0 && (
                  <div>
                    <h3 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-2">
                      Executive Producers
                    </h3>
                    {project.executiveProducers.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                )}
                {project.partners && project.partners.length > 0 && (
                  <div>
                    <h3 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-2">
                      With
                    </h3>
                    {project.partners.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                )}
                <div>
                  <h3 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-2">
                    Format
                  </h3>
                  <p>{project.formatLabel}</p>
                </div>
              </div>

              {/* Synopsis column */}
              <div>
                <h2 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">
                  Synopsis
                </h2>
                <div className="space-y-4 text-lg font-light leading-relaxed text-white/60">
                  {project.synopsis.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Media carousel — only if there are gallery images */}
            {media && media.gallery.length > 0 && (
              <div className="mt-20">
                <h2 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-8">
                  Gallery
                </h2>
                <MediaCarousel items={media.gallery} />
              </div>
            )}

            {/* Back link */}
            <div className="mt-16">
              <Link
                href="/projects"
                className="text-xs tracking-[0.3em] uppercase text-white/30 hover:text-white/70 transition-colors"
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
