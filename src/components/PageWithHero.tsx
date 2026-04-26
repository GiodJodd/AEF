"use client";

import { useRef, useEffect } from "react";
import { useHeroColor } from "@/components/HeroColorContext";

function StaticHero() {
  const { heroColor } = useHeroColor();

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: heroColor.gradient }}
      />
      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
        <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-3">
          Now Showing
        </p>
        <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white/60">
          {heroColor.title}
        </h2>
      </div>
    </div>
  );
}

export default function PageWithHero({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = window.innerHeight;
    }
  }, []);

  return (
    <div
      ref={scrollRef}
      className="fixed inset-0 overflow-y-auto overflow-x-hidden z-[1] scrollbar-hide"
      style={{
        scrollSnapType: "y proximity",
        scrollbarWidth: "none",
      }}
    >
      <div
        className="relative w-full"
        style={{ height: "100dvh", scrollSnapAlign: "start" }}
      >
        <StaticHero />
      </div>

      <div className="relative bg-[#0a0a0a] z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}
