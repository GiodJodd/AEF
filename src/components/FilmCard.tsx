"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { type Project, getProjectMedia } from "@/data/projects";

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const href = `/projects/${project.slug}`;
  const media = getProjectMedia(project.slug);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        delay: index * 0.06,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
    >
      <Link href={href} className="group block">
        <div className="relative aspect-[4/5] rounded-sm overflow-hidden mb-4">
          {/* Cover */}
          {media ? (
            <Image
              src={media.cover.src}
              alt={project.title}
              fill
              placeholder="blur"
              blurDataURL={media.cover.blurDataURL}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ objectPosition: project.coverPosition ?? "center" }}
            />
          ) : (
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ background: project.gradient }}
            />
          )}
          {/* Film grain */}
          <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

          {/* Title overlaid on cover — hidden on hover so synopsis can take its place */}
          <div className="absolute inset-0 flex items-end p-5 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
            <h3 className="text-xl md:text-2xl font-light tracking-tight text-white/90 leading-tight">
              {project.title}
            </h3>
          </div>

          {/* Hover overlay with synopsis */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
            <p className="text-xs tracking-[0.3em] uppercase text-white/60 mb-2">
              {project.formatLabel}
            </p>
            <p className="text-sm text-white/80 line-clamp-4">
              {project.synopsis.split("\n")[0]}
            </p>
          </div>
        </div>

        <p className="text-xs tracking-[0.25em] uppercase text-white/30 mb-1">
          {project.formatLabel}
        </p>
        <p className="text-sm text-white/50 tracking-wide">
          {project.directors.join(", ")}
        </p>
      </Link>
    </motion.div>
  );
}
