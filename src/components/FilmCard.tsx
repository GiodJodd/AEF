"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

export default function FilmCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const href =
    project.type === "film"
      ? `/films/${project.slug}`
      : `/films/${project.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
    >
      <Link href={href} className="group block">
        <div className="relative aspect-[3/4] rounded-sm overflow-hidden mb-4">
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div
            className="absolute inset-0 opacity-30 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-20"
            style={{ background: project.gradient }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-1">
              {project.type === "film" ? "Film" : "Documentary"}
            </p>
            <p className="text-sm text-white/70 line-clamp-3">
              {project.synopsis}
            </p>
          </div>
        </div>
        <h3 className="text-base font-light tracking-wide text-white/80 group-hover:text-white transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-white/30 mt-1 tracking-wide">
          {project.director} &middot; {project.year}
        </p>
      </Link>
    </motion.div>
  );
}
