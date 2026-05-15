"use client";

import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const TEAM = [
  { name: "Matteo Severini", role: "Co-Founder & CEO" },
  { name: "Riccardo Rizzi", role: "Co-Founder & Head of Production" },
  { name: "Simone Defendi", role: "Head of Acquisitions" },
  { name: "Thomas Piette", role: "Head of Post Production" },
  { name: "Pamela Adams", role: "Festival Manager" },
  { name: "Giordano Urettini", role: "Social Media and Marketing Director" },
  { name: "Ada Johnsson", role: "Creative Executive" },
];

export default function AboutPage() {
  return (
    <main className="pt-24 pb-16 bg-[#0a0a0a] min-h-screen">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <h1 className="text-xs tracking-[0.4em] uppercase text-white/30 mb-16">
              About
            </h1>

            {/* Lead paragraph */}
            <div className="max-w-3xl mb-16">
              <p className="text-2xl md:text-3xl font-extralight leading-relaxed text-white/80">
                AEF is an independent film production company operating between
                Rome and London, founded in 2022 by writer-producer Matteo
                Severini and director-producer Riccardo Rizzi.
              </p>
            </div>

            {/* Body copy */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 md:gap-16 mb-24">
              <div className="space-y-6 text-base md:text-lg text-white/50 leading-relaxed font-light">
                <p>
                  Conceived as both a creative and industrial platform, AEF
                  approaches cinema as a collaborative system in which
                  authorship, labor, and value are inseparable.
                </p>
                <p>
                  Working across development, production, and distribution, the
                  company is committed to building projects that are formally
                  rigorous, culturally resonant, and structurally independent.
                  Its slate spans narrative, hybrid, and non-fiction forms, with
                  a focus on voices that challenge conventional modes of
                  storytelling while remaining attentive to audience and market
                  realities.
                </p>
                <p>
                  At the core of AEF lies a rethinking of the production model
                  itself: a transparent, participation-driven framework that
                  aligns the interests of creators, collaborators, and partners.
                  By integrating artistic intent with sustainable practices.
                </p>
              </div>

              <div className="md:pl-4">
                <div className="space-y-6 text-sm text-white/30">
                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-white/20 mb-1">
                      Headquarters
                    </p>
                    <p className="text-white/60">Rome &amp; London</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-white/20 mb-1">
                      Founded
                    </p>
                    <p className="text-white/60">2022</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-white/20 mb-1">
                      Founders
                    </p>
                    <p className="text-white/60">
                      Matteo Severini
                      <br />
                      Riccardo Rizzi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team */}
            <div>
              <h2 className="text-xs tracking-[0.4em] uppercase text-white/30 mb-10">
                Team
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
                {TEAM.map((member, i) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.05,
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                    }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="border-t border-white/5 pt-4"
                  >
                    <p className="text-base md:text-lg font-light text-white/85 mb-1">
                      {member.name}
                    </p>
                    <p className="text-xs tracking-[0.15em] uppercase text-white/35">
                      {member.role}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        <div className="mt-24">
          <Footer />
        </div>
      </main>
  );
}
