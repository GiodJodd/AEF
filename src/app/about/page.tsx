"use client";

import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import PageWithHero from "@/components/PageWithHero";
import { projects } from "@/data/projects";

export default function AboutPage() {
  return (
    <PageWithHero image={projects[0]?.image}>
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <h1 className="text-xs tracking-[0.4em] uppercase text-white/30 mb-16">
              About
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-16">
              <div>
                <p className="text-3xl md:text-4xl font-extralight leading-relaxed text-white/80 mb-8">
                  AEF is an independent production house based in Rome, dedicated
                  to crafting films and documentaries that explore the depth of
                  human experience.
                </p>
                <div className="space-y-6 text-base text-white/40 leading-relaxed">
                  <p>
                    Founded with a belief that cinema is the most powerful medium
                    for storytelling, we work with visionary directors to bring
                    distinctive narratives to life. Our focus is on stories rooted
                    in Italian culture with universal resonance.
                  </p>
                  <p>
                    From the streets of Rome to the shores of Sicily, our
                    productions capture the beauty, complexity, and contradictions
                    of contemporary life. We believe in patient filmmaking —
                    giving stories the time and space they need to unfold
                    authentically.
                  </p>
                </div>
              </div>

              <div>
                <div className="sticky top-32">
                  <div
                    className="aspect-[3/4] rounded-sm mb-8"
                    style={{
                      background:
                        "linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)",
                    }}
                  />
                  <div className="space-y-4 text-sm text-white/30">
                    <div>
                      <p className="text-xs tracking-[0.3em] uppercase text-white/20 mb-1">
                        Location
                      </p>
                      <p className="text-white/50">Rome, Italy</p>
                    </div>
                    <div>
                      <p className="text-xs tracking-[0.3em] uppercase text-white/20 mb-1">
                        Founded
                      </p>
                      <p className="text-white/50">2020</p>
                    </div>
                    <div>
                      <p className="text-xs tracking-[0.3em] uppercase text-white/20 mb-1">
                        Focus
                      </p>
                      <p className="text-white/50">
                        Feature Films & Documentaries
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="mt-24">
          <Footer />
        </div>
      </main>
    </PageWithHero>
  );
}
