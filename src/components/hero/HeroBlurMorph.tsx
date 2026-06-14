"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Film } from "@/lib/film";

const ROTATE_MS = 6000;

export default function HeroBlurMorph({ films }: { films: Film[] }) {
  const projects = films;
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduce = useReducedMotion();
  // Guards against rapid double-fires (e.g. click + keydown landing together).
  const lastNavRef = useRef(0);

  const advance = useCallback(() => {
    const now = Date.now();
    if (now - lastNavRef.current < 250) return;
    lastNavRef.current = now;
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const goBack = useCallback(() => {
    const now = Date.now();
    if (now - lastNavRef.current < 250) return;
    lastNavRef.current = now;
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  // Slow auto-rotation, one film at a time. Restarts whenever the index changes
  // (auto, click zones, keyboard, or the progress controls below).
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, ROTATE_MS);
    return () => clearTimeout(timer);
  }, [currentIndex, projects.length]);

  // Keyboard navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") advance();
      else if (e.key === "ArrowLeft") goBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, goBack]);

  if (!projects.length) return null;

  const film = projects[currentIndex];

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
      {/* Rotating still — slow crossfade + gentle zoom */}
      <AnimatePresence initial={false}>
        <motion.div
          key={film.slug}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.3 : 1.2, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0"
            initial={reduce ? false : { scale: 1.06 }}
            animate={reduce ? undefined : { scale: 1 }}
            transition={reduce ? undefined : { duration: ROTATE_MS / 1000 + 1.4, ease: "easeOut" }}
          >
            {(() => {
              const media = film.media;
              if (!media) return null;
              // Per-film mobile cover swaps the source by viewport when present.
              return media.coverMobile ? (
                <>
                  <Image
                    src={media.coverMobile.src}
                    alt={film.title}
                    fill
                    priority={currentIndex === 0}
                    placeholder="blur"
                    blurDataURL={media.coverMobile.blurDataURL}
                    sizes="100vw"
                    className="object-cover md:hidden"
                  />
                  <Image
                    src={media.cover.src}
                    alt={film.title}
                    fill
                    priority={currentIndex === 0}
                    placeholder="blur"
                    blurDataURL={media.cover.blurDataURL}
                    sizes="100vw"
                    className="hidden object-cover md:block"
                    style={{ objectPosition: film.coverPosition ?? "center" }}
                  />
                </>
              ) : (
                <Image
                  src={media.cover.src}
                  alt={film.title}
                  fill
                  priority={currentIndex === 0}
                  placeholder="blur"
                  blurDataURL={media.cover.blurDataURL}
                  sizes="100vw"
                  className="object-cover"
                  style={{ objectPosition: film.coverPosition ?? "center" }}
                />
              );
            })()}
          </motion.div>
          {/* Film grain texture */}
          <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]" />
          {/* Dark scrim — keeps the caption legible over bright stills */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Click zones — left third = previous, right third = next */}
      <button
        type="button"
        onClick={goBack}
        aria-label="Previous film"
        className="absolute left-0 top-0 z-[5] h-full w-1/3 cursor-w-resize"
      />
      <button
        type="button"
        onClick={advance}
        aria-label="Next film"
        className="absolute right-0 top-0 z-[5] h-full w-1/3 cursor-e-resize"
      />

      {/* Current film — small caption, bottom-left */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-8 md:p-12 lg:p-16">
        <motion.div
          key={film.slug}
          initial={reduce ? false : { y: 14 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <p className="mb-2 text-xs tracking-[0.15em] text-white/45">
              {film.formatLabel}
            </p>
            <Link href={`/projects/${film.slug}`} className="group inline-block">
              <h2 className="text-2xl md:text-4xl font-medium tracking-tight text-white transition-opacity group-hover:opacity-80">
                {film.title}
              </h2>
            </Link>
            {film.directors.length > 0 && (
              <p className="mt-2 text-sm text-white/55">
                {film.directors.join(", ")}
              </p>
            )}
        </motion.div>

        {/* Progress / navigation — one segment per film, active fills over the rotation */}
        <div className="mt-6 flex gap-2">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Show ${p.title}`}
              className="relative h-[2px] w-10 md:w-14 overflow-hidden bg-white/15"
            >
              <motion.div
                key={`bar-${i}-${currentIndex}`}
                className="absolute inset-y-0 left-0 bg-white/70"
                initial={{ width: i < currentIndex ? "100%" : "0%" }}
                animate={{
                  width:
                    i === currentIndex ? "100%" : i < currentIndex ? "100%" : "0%",
                }}
                transition={
                  i === currentIndex
                    ? { duration: reduce ? 0 : ROTATE_MS / 1000, ease: "linear" }
                    : { duration: 0.3 }
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-8 right-6 z-10 text-white/50 md:right-12"
        animate={reduce ? undefined : { y: [0, 6, 0] }}
        transition={reduce ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          className="h-5 w-5 md:h-6 md:w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
        </svg>
      </motion.div>
    </div>
  );
}
