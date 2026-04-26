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

            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-8"
            >
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-white/30 mb-3">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-white/10 focus:border-white/40 outline-none py-3 text-white/80 text-lg font-light transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-white/30 mb-3">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-transparent border-b border-white/10 focus:border-white/40 outline-none py-3 text-white/80 text-lg font-light transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-white/30 mb-3">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full bg-transparent border-b border-white/10 focus:border-white/40 outline-none py-3 text-white/80 text-lg font-light transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                className="text-sm tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-8 py-3 mt-4"
              >
                Send Message
              </button>
            </form>

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
