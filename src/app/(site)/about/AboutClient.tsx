"use client";

import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import type { AboutContent, TeamMember, SiteSettings } from "@/lib/content";

export default function AboutClient({
  about,
  team,
  settings,
}: {
  about: AboutContent;
  team: TeamMember[];
  settings: SiteSettings;
}) {
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
                {about.lead}
              </p>
            </div>

            {/* Body copy */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 md:gap-16 mb-24">
              <div className="space-y-6 text-base md:text-lg text-white/50 leading-relaxed font-light">
                {about.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="md:pl-4">
                <div className="space-y-6 text-sm text-white/30">
                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-white/20 mb-1">
                      Headquarters
                    </p>
                    <p className="text-white/60">
                      {settings.locations.join(" & ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-white/20 mb-1">
                      Founded
                    </p>
                    <p className="text-white/60">{settings.foundingYear}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-white/20 mb-1">
                      Founders
                    </p>
                    <p className="text-white/60">
                      {settings.founders.map((name, i) => (
                        <span key={name}>
                          {i > 0 && <br />}
                          {name}
                        </span>
                      ))}
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
                {team.map((member, i) => (
                  <motion.div
                    key={member.slug}
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
