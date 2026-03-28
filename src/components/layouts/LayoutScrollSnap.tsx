"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { projects } from "@/data/projects";
import Footer from "@/components/Footer";
import HeroSelector from "@/components/hero/HeroSelector";

function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 40, filter: "blur(10px)" }
      }
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

export default function LayoutScrollSnap() {
  return (
    <div className="scroll-snap-container" style={{ position: "fixed", inset: 0, zIndex: 1 }}>
      {/* Section 1: Hero */}
      <div className="scroll-snap-section">
        <HeroSelector />
      </div>

      {/* Section 2: About teaser / Tagline */}
      <div className="scroll-snap-section flex items-center justify-center px-8 bg-[#0a0a0a] z-10">
        <FadeInSection className="max-w-2xl text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-8">
            About AEF
          </p>
          <p className="text-2xl md:text-3xl font-extralight leading-relaxed text-white/70 mb-8">
            We tell stories that matter. Based in Rome, AEF produces films and
            documentaries that explore the human condition with honesty and
            beauty.
          </p>
          <Link
            href="/about"
            className="text-xs tracking-[0.3em] uppercase text-white/30 hover:text-white/70 transition-colors border-b border-white/10 hover:border-white/30 pb-1"
          >
            Learn More
          </Link>
        </FadeInSection>
      </div>

      {/* Section 3: Selected Works */}
      <div className="scroll-snap-section flex flex-col items-center justify-center px-8 pt-20 pb-8 bg-[#0a0a0a] z-10">
        <FadeInSection className="w-full max-w-5xl">
          <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-8 text-center">
            Selected Works
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {projects.slice(0, 6).map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 100, damping: 20 }}
                viewport={{ once: false }}
              >
                <Link
                  href={project.type === "film" ? `/films/${project.slug}` : `/docs`}
                  className="group block"
                >
                  <div className="aspect-[4/5] rounded-sm overflow-hidden mb-2 relative transition-transform duration-500 group-hover:scale-[1.02]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0 opacity-20 mix-blend-multiply"
                      style={{ background: project.gradient }}
                    />
                  </div>
                  <p className="text-sm font-light tracking-wide group-hover:text-white transition-colors text-white/70">
                    {project.title}
                  </p>
                  <p className="text-xs text-white/30 mt-1">
                    {project.year}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </FadeInSection>
      </div>

      {/* Section 4: Contact + Footer */}
      <div className="scroll-snap-section flex flex-col items-center justify-center px-8 bg-[#0a0a0a] z-10">
        <FadeInSection className="text-center mb-24">
          <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-8">
            Get in Touch
          </p>
          <p className="text-xl md:text-2xl font-extralight text-white/50 mb-6">
            Have a story to tell?
          </p>
          <Link
            href="/contact"
            className="inline-block text-sm tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-8 py-3"
          >
            Contact Us
          </Link>
        </FadeInSection>
        <div className="absolute bottom-0 left-0 right-0">
          <Footer />
        </div>
      </div>
    </div>
  );
}
