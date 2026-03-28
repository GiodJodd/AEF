"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { getProject } from "@/data/projects";
import Footer from "@/components/Footer";
import PageWithHero from "@/components/PageWithHero";
import MediaCarousel from "@/components/MediaCarousel";

export default function FilmDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const project = getProject(slug);

  if (!project) notFound();

  return (
    <PageWithHero image={project.image}>
      <main className="min-h-screen">
        {/* Hero */}
        <div className="relative h-[70vh] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1, filter: "blur(10px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ background: project.gradient }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 20 }}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3">
                {project.type === "film" ? "Film" : "Documentary"}
              </p>
              <h1 className="text-5xl md:text-7xl font-extralight tracking-tight mb-3">
                {project.title}
              </h1>
              <p className="text-sm text-white/50 tracking-wide">
                Directed by {project.director} &middot; {project.year}
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
              <div>
                <h2 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">
                  Details
                </h2>
                <div className="space-y-3 text-sm text-white/50">
                  <p>
                    <span className="text-white/30">Director</span>
                    <br />
                    {project.director}
                  </p>
                  <p>
                    <span className="text-white/30">Year</span>
                    <br />
                    {project.year}
                  </p>
                  <p>
                    <span className="text-white/30">Type</span>
                    <br />
                    {project.type === "film" ? "Feature Film" : "Documentary"}
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">
                  Synopsis
                </h2>
                <p className="text-lg font-light leading-relaxed text-white/60">
                  {project.synopsis}
                </p>
              </div>
            </div>

            {/* Media carousel */}
            <div className="mt-20">
              <h2 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-8">
                Gallery
              </h2>
              <MediaCarousel items={project.media} />
            </div>

            {/* Back link */}
            <div className="mt-16">
              <Link
                href="/films"
                className="text-xs tracking-[0.3em] uppercase text-white/30 hover:text-white/70 transition-colors"
              >
                &larr; All Films
              </Link>
            </div>
          </motion.div>
        </div>

        <Footer />
      </main>
    </PageWithHero>
  );
}
