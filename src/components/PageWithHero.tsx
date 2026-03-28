"use client";

import { useRef, useEffect } from "react";
import { useHeroColor } from "@/components/HeroColorContext";

function StaticHero({ image }: { image?: string }) {
  const { heroColor } = useHeroColor();

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
      {image ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : null}
      <div
        className="absolute inset-0 opacity-40 mix-blend-multiply transition-all duration-1000"
        style={{ background: heroColor.gradient }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-[#0a0a0a]/10" />
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

interface PageWithHeroProps {
  children: React.ReactNode;
  image?: string;
}

export default function PageWithHero({ children, image }: PageWithHeroProps) {
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
        <StaticHero image={image} />
      </div>

      <div className="relative bg-[#0a0a0a] z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}
