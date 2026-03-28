"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface MediaItem {
  type: "image" | "video";
  gradient?: string; // placeholder gradient for images
  videoUrl?: string; // placeholder for video
  caption?: string;
}

export default function MediaCarousel({ items }: { items: MediaItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
            {item.type === "image" ? (
              <div
                className="absolute inset-0"
                style={{ background: item.gradient || "#1a1a1a" }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ background: item.gradient || "#1a1a1a" }}
                />
                {/* Play button overlay */}
                <div className="relative z-10 w-16 h-16 rounded-full border border-white/30 flex items-center justify-center cursor-pointer hover:border-white/60 hover:scale-105 transition-all">
                  <svg
                    className="w-6 h-6 text-white/70 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 z-20 text-xs tracking-[0.3em] text-white/30 font-mono">
          {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </div>

        {/* Type badge */}
        {item.type === "video" && (
          <div className="absolute top-4 left-4 z-20 text-[10px] tracking-[0.3em] uppercase text-white/40 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-sm">
            Video
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
        {items.map((thumb, i) => (
          <button
            key={i}
            onClick={() => navigate(i)}
            className={`relative flex-shrink-0 w-16 h-10 rounded-sm overflow-hidden transition-all duration-300 ${
              i === currentIndex
                ? "ring-1 ring-white/40 opacity-100"
                : "opacity-30 hover:opacity-60"
            }`}
          >
            <div
              className="absolute inset-0"
              style={{ background: thumb.gradient || "#1a1a1a" }}
            />
            {thumb.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-3 h-3 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Caption */}
      {item.caption && (
        <p className="text-xs text-white/30 mt-3 tracking-wide">{item.caption}</p>
      )}
    </div>
  );
}
