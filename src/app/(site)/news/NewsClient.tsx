"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import type { NewsListItem } from "@/lib/content";

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
}

export default function NewsClient({ posts }: { posts: NewsListItem[] }) {
  if (posts.length === 0) {
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

  return (
    <main className="pt-24 pb-16 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <h1 className="text-xs tracking-[0.4em] uppercase text-white/30 mb-12">
          News
        </h1>
        <ul className="border-t border-white/10">
          {posts.map((post, i) => (
            <motion.li
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.05,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
              className="border-b border-white/10"
            >
              <Link href={`/news/${post.slug}`} className="group block py-8">
                <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-2">
                  {formatDate(post.publishedDate)}
                </p>
                <h2 className="text-2xl md:text-3xl font-extralight tracking-tight text-white/85 group-hover:text-white transition-colors mb-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm md:text-base font-light text-white/45 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="mt-24">
        <Footer />
      </div>
    </main>
  );
}
