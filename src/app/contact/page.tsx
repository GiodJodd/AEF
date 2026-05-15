"use client";

import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <main className="pt-24 pb-16 bg-[#0a0a0a] min-h-screen">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <h1 className="text-xs tracking-[0.4em] uppercase text-white/30 mb-4">
              Get in Touch
            </h1>
            <p className="text-2xl md:text-3xl font-extralight text-white/60 mb-16">
              We&apos;d love to hear from you.
            </p>

            <a
              href="mailto:info@aef.film"
              className="inline-block text-sm tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-8 py-3"
            >
              Write us
            </a>

            <div className="mt-20 pt-12 border-t border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-white/30">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-white/20 mb-2">
                    Email
                  </p>
                  <p className="text-white/50">info@aef.film</p>
                </div>
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-white/20 mb-2">
                    Studios
                  </p>
                  <p className="text-white/50">
                    Rome
                    <br />
                    London
                  </p>
                </div>
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
