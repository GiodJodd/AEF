"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { projectsForHomeHero, getProjectMedia } from "@/data/projects";
import { useHeroColor } from "@/components/HeroColorContext";

const projects = projectsForHomeHero;

type FeedbackSide = "left" | "right" | null;

export default function HeroBlurMorph() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackSide>(null);
  const { setHeroColor } = useHeroColor();
  // Guard against rapid duplicate calls (e.g. Next.js dev-mode multi-HMR firing)
  const lastClickRef = useRef(0);

  const advance = useCallback(() => {
    const now = Date.now();
    if (now - lastClickRef.current < 250) return;
    lastClickRef.current = now;
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setFeedback("right");
  }, []);

  const goBack = useCallback(() => {
    const now = Date.now();
    if (now - lastClickRef.current < 250) return;
    lastClickRef.current = now;
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setFeedback("left");
  }, []);

  // Clear feedback after animation
  useEffect(() => {
    if (feedback) {
      const t = setTimeout(() => setFeedback(null), 500);
      return () => clearTimeout(t);
    }
  }, [feedback]);

  // Auto-advance: restarts 5s countdown whenever currentIndex changes (manual or auto)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const project = projects[currentIndex];

  useEffect(() => {
    setHeroColor({
      gradient: project.gradient,
      accentColor: project.accentColor,
      title: project.title,
    });
  }, [project, setHeroColor]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
      <AnimatePresence initial={false}>
        <motion.div
          key={project.slug}
          className="absolute inset-0"
          initial={{ filter: "blur(40px)", scale: 1.08, opacity: 0 }}
          animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
          exit={{ filter: "blur(30px)", scale: 1.03, opacity: 0 }}
          transition={{
            filter: { type: "spring", stiffness: 80, damping: 20 },
            scale: { type: "spring", stiffness: 80, damping: 20 },
            opacity: { duration: 0.8 },
          }}
        >
          {(() => {
            const media = getProjectMedia(project.slug);
            return media ? (
              <Image
                src={media.cover.src}
                alt={project.title}
                fill
                priority={currentIndex === 0}
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
            );
          })()}
          {/* Film grain texture */}
          <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]" />
          {/* Dark gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Feedback ellipses — mostly off-screen, peek in on click */}
      <AnimatePresence>
        {feedback === "left" && (
          <motion.div
            key="ellipse-left"
            className="absolute z-[4] pointer-events-none"
            style={{
              width: "40vw",
              height: "120vh",
              borderRadius: "50%",
              background: "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)",
              top: "50%",
              left: "-30vw",
              translateY: "-50%",
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        )}
        {feedback === "right" && (
          <motion.div
            key="ellipse-right"
            className="absolute z-[4] pointer-events-none"
            style={{
              width: "40vw",
              height: "120vh",
              borderRadius: "50%",
              background: "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)",
              top: "50%",
              right: "-30vw",
              translateY: "-50%",
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        )}
      </AnimatePresence>

      {/* Left/right click zones */}
      <button
        onClick={(e) => { e.stopPropagation(); goBack(); }}
        className="absolute left-0 top-0 w-1/3 h-full z-[5] cursor-w-resize"
        aria-label="Previous"
      />
      <button
        onClick={(e) => { e.stopPropagation(); advance(); }}
        className="absolute right-0 top-0 w-1/3 h-full z-[5] cursor-e-resize"
        aria-label="Next"
      />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3">
              {project.formatLabel}
            </p>
            <Link
              href={`/projects/${project.slug}`}
              className="group inline-flex items-end gap-4 pointer-events-auto"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight group-hover:text-white/80 transition-colors">
                {project.title}
              </h1>
              <span className="mb-2 md:mb-3 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </span>
            </Link>
            <p className="text-sm md:text-base text-white/50 tracking-wide mt-3">
              {project.directors.join(", ")}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress indicators */}
        <div className="flex gap-2 mt-8 pointer-events-auto">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                setFeedback(i > currentIndex ? "right" : "left");
              }}
              className="group relative h-[2px] flex-1 max-w-16 bg-white/10 overflow-hidden"
            >
              <motion.div
                key={`bar-${i}-${currentIndex}`}
                className="absolute inset-y-0 left-0 bg-white/60"
                initial={{ width: i < currentIndex ? "100%" : "0%" }}
                animate={{ width: i === currentIndex ? "100%" : i < currentIndex ? "100%" : "0%" }}
                transition={
                  i === currentIndex
                    ? { duration: 5, ease: "linear" }
                    : { duration: 0.4, ease: "easeOut" }
                }
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
