"use client";

import { docs, projects } from "@/data/projects";
import FilmCard from "@/components/FilmCard";
import Footer from "@/components/Footer";
import PageWithHero from "@/components/PageWithHero";
import { motion } from "framer-motion";

export default function DocsPage() {
  return (
    <PageWithHero image={docs[0]?.image}>
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <h1 className="text-xs tracking-[0.4em] uppercase text-white/30 mb-12">
              Documentaries
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {docs.map((project, i) => (
              <FilmCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        </div>
        <div className="mt-24">
          <Footer />
        </div>
      </main>
    </PageWithHero>
  );
}
