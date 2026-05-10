"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  projects,
  FORMAT_FILTERS,
  getProjectMedia,
  type ProjectFormat,
} from "@/data/projects";
import Footer from "@/components/Footer";

type Filter = ProjectFormat | "all";

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // Mouse-follow state for the floating cover preview (desktop hover)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 250, damping: 30, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 250, damping: 30, mass: 0.4 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    },
    [mouseX, mouseY],
  );

  const filtered = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter((p) => p.format === activeFilter);
  }, [activeFilter]);

  const hoveredProject = hoveredSlug
    ? projects.find((p) => p.slug === hoveredSlug)
    : null;
  const hoveredMedia = hoveredSlug ? getProjectMedia(hoveredSlug) : null;

  return (
    <main
      className="pt-24 pb-16 bg-[#0a0a0a] min-h-screen relative"
      onMouseMove={handleMouseMove}
    >
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
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
          className="flex flex-wrap gap-2 md:gap-3 mb-16 md:mb-20"
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

        {/* Typographic title list */}
        <motion.ul
          layout
          className="border-t border-white/10"
          onMouseLeave={() => setHoveredSlug(null)}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((project, i) => {
              const isHovered = hoveredSlug === project.slug;
              const someoneElseHovered =
                hoveredSlug !== null && !isHovered;

              return (
                <motion.li
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    delay: i * 0.04,
                    type: "spring",
                    stiffness: 120,
                    damping: 22,
                  }}
                  className="border-b border-white/10"
                  onMouseEnter={() => setHoveredSlug(project.slug)}
                  onFocus={() => setHoveredSlug(project.slug)}
                  onBlur={() => setHoveredSlug(null)}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group flex items-baseline justify-between gap-6 py-6 md:py-8 outline-none"
                  >
                    <h2
                      className={`text-3xl md:text-5xl lg:text-6xl font-extralight tracking-tight transition-all duration-500 ${
                        someoneElseHovered
                          ? "text-white/25"
                          : "text-white/85 group-hover:text-white"
                      }`}
                    >
                      {project.title}
                    </h2>
                    <span
                      className={`shrink-0 text-[10px] md:text-xs tracking-[0.25em] uppercase transition-colors duration-500 ${
                        someoneElseHovered ? "text-white/15" : "text-white/40"
                      }`}
                    >
                      {project.formatLabel}
                    </span>
                  </Link>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </div>

      {/* Floating cover preview — desktop only, follows cursor with spring lag */}
      <motion.div
        className="hidden md:block fixed top-0 left-0 pointer-events-none z-40"
        style={{
          x: springX,
          y: springY,
        }}
      >
        <div style={{ transform: "translate(32px, -50%)" }}>
          <AnimatePresence mode="wait">
            {hoveredProject && (
              <motion.div
                key={hoveredProject.slug}
                initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
                transition={{
                  duration: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative w-[400px] rounded-sm overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                style={{
                  aspectRatio: hoveredMedia
                    ? `${hoveredMedia.cover.width} / ${hoveredMedia.cover.height}`
                    : "4 / 5",
                }}
              >
                {hoveredMedia ? (
                  <Image
                    src={hoveredMedia.cover.src}
                    alt=""
                    fill
                    placeholder="blur"
                    blurDataURL={hoveredMedia.cover.blurDataURL}
                    sizes="400px"
                    className="object-contain"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: hoveredProject.gradient }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="mt-24">
        <Footer />
      </div>
    </main>
  );
}
