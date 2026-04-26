"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, FORMAT_FILTERS, type ProjectFormat } from "@/data/projects";
import ProjectCard from "@/components/FilmCard";
import Footer from "@/components/Footer";

type Filter = ProjectFormat | "all";

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter((p) => p.format === activeFilter);
  }, [activeFilter]);

  return (
    <main className="pt-24 pb-16 bg-[#0a0a0a] min-h-screen">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <h1 className="text-xs tracking-[0.4em] uppercase text-white/30 mb-8">
              Projects
            </h1>
          </motion.div>

          {/* Filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 20 }}
            className="flex flex-wrap gap-2 md:gap-3 mb-12"
          >
            {FORMAT_FILTERS.map((f) => {
              const isActive = activeFilter === f.value;
              const count =
                f.value === "all"
                  ? projects.length
                  : projects.filter((p) => p.format === f.value).length;

              return (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`relative text-xs tracking-[0.2em] uppercase px-4 py-2 rounded-full border transition-all duration-300 ${
                    isActive
                      ? "border-white/40 text-white bg-white/5"
                      : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
                  }`}
                >
                  {f.label}
                  <span className="ml-2 text-[10px] opacity-50">{count}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard key={project.slug} project={project} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
        <div className="mt-24">
          <Footer />
        </div>
      </main>
  );
}
