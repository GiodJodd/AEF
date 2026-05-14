"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { projects, getProjectMedia } from "@/data/projects";
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
        <FadeInSection className="max-w-3xl text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-8">
            About AEF
          </p>
          <p className="text-2xl md:text-3xl font-extralight leading-relaxed text-white/70 mb-8">
            An independent film production company between Rome and London —
            building cinema as a collaborative system where authorship, labor,
            and value are inseparable.
          </p>
          <Link
            href="/about"
            className="text-xs tracking-[0.3em] uppercase text-white/30 hover:text-white/70 transition-colors border-b border-white/10 hover:border-white/30 pb-1"
          >
            Learn More
          </Link>
        </FadeInSection>
      </div>

      {/* Section 3: Selected Projects — free scroll */}
      <div className="scroll-free-section flex flex-col items-center px-8 py-32 md:py-40 bg-[#0a0a0a] z-10">
        <FadeInSection className="w-full max-w-5xl">
          <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-12 text-center">
            Selected Projects
          </p>
          <div className="flex flex-col gap-6 md:gap-10">
            {projects.slice(0, 6).map((project, i) => {
              const m = getProjectMedia(project.slug);
              return (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 100, damping: 20 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group block"
                  >
                    <div
                      className="rounded-sm overflow-hidden relative transition-transform duration-500 group-hover:scale-[1.01]"
                      style={{
                        aspectRatio: m
                          ? `${m.cover.width} / ${m.cover.height}`
                          : "16 / 9",
                      }}
                    >
                      {m ? (
                        <Image
                          src={m.cover.src}
                          alt={project.title}
                          fill
                          placeholder="blur"
                          blurDataURL={m.cover.blurDataURL}
                          sizes="(min-width: 1024px) 1024px, 100vw"
                          className="object-cover"
                          style={{ objectPosition: project.coverPosition ?? "center" }}
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{ background: project.gradient }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
                        <p className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-white/60 mb-2">
                          {project.formatLabel}
                        </p>
                        <h3 className="text-2xl md:text-4xl font-light tracking-tight text-white">
                          {project.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </FadeInSection>
      </div>

      {/* Section 4: Contact CTA — free scroll */}
      <div className="scroll-free-section flex flex-col items-center px-8 py-32 md:py-40 bg-[#0a0a0a] z-10">
        <FadeInSection className="text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-8">
            Get in Touch
          </p>
          <p className="text-xl md:text-2xl font-extralight text-white/50 mb-8">
            Have a story to tell?
          </p>
          <Link
            href="/contact"
            className="inline-block text-sm tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-8 py-3"
          >
            Contact Us
          </Link>
        </FadeInSection>
      </div>

      {/* Footer — free scroll */}
      <div className="scroll-free-section bg-[#0a0a0a] z-10">
        <Footer />
      </div>
    </div>
  );
}
