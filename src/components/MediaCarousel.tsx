"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { ImageMeta } from "@/data/project-media";

export default function MediaCarousel({ items }: { items: ImageMeta[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!items || items.length === 0) return null;

  const navigate = (newIndex: number) => {
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentIndex(newIndex);
  };

  const prev = () => navigate((currentIndex - 1 + items.length) % items.length);
  const next = () => navigate((currentIndex + 1) % items.length);

  const item = items[currentIndex];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div className="relative">
      {/* Main carousel area */}
      <div
        ref={containerRef}
        className="relative aspect-[16/9] overflow-hidden rounded-sm bg-[#111]"
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 200, damping: 25 },
              opacity: { duration: 0.3 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={item.src}
              alt=""
              fill
              placeholder="blur"
              blurDataURL={item.blurDataURL}
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 z-20 text-xs tracking-[0.3em] text-white/50 font-mono bg-black/30 backdrop-blur-sm px-2 py-1 rounded-sm">
          {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
        {items.map((thumb, i) => (
          <button
            key={i}
            onClick={() => navigate(i)}
            aria-label={`Go to image ${i + 1}`}
            className={`relative flex-shrink-0 w-16 h-10 rounded-sm overflow-hidden transition-colors duration-300 border ${
              i === currentIndex
                ? "border-white/70"
                : "border-transparent hover:border-white/20"
            }`}
          >
            <Image
              src={thumb.src}
              alt=""
              fill
              placeholder="blur"
              blurDataURL={thumb.blurDataURL}
              sizes="64px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
