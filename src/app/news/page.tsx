"use client";

import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function NewsPage() {
  return (
    <main className="pt-24 pb-16 bg-[#0a0a0a] min-h-screen flex flex-col">
      <div className="max-w-3xl mx-auto px-6 md:px-12 flex-1 flex flex-col items-center justify-center text-center py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-8">
            News
          </p>
          <h1 className="text-5xl md:text-7xl font-extralight tracking-tight text-white/85 mb-8">
            Coming Soon
          </h1>
          <p className="text-base md:text-lg font-light leading-relaxed text-white/45 max-w-xl mx-auto">
            Festival announcements, releases, and press updates will live
            here. Check back soon — or get in touch if you&apos;d like to be
            among the first to hear.
          </p>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
