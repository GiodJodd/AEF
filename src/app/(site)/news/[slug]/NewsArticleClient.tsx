"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";

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

export default function NewsArticleClient({
  title,
  publishedDate,
  author,
  coverImage,
  children,
}: {
  title: string;
  publishedDate: string;
  author: string;
  coverImage: string | null;
  children: React.ReactNode;
}) {
  return (
    <main className="pt-24 pb-16 bg-[#0a0a0a] min-h-screen">
      <article className="max-w-3xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <Link
            href="/news"
            className="inline-block text-xs tracking-[0.12em] text-white/30 hover:text-white/60 transition-colors mb-10"
          >
            ← News
          </Link>
          <header className="mb-10">
            <p className="text-xs tracking-[0.1em] text-white/30 mb-4">
              {formatDate(publishedDate)}
              {author ? ` · ${author}` : ""}
            </p>
            <h1 className="text-4xl md:text-6xl font-extralight tracking-tight text-white/90 leading-[1.05]">
              {title}
            </h1>
          </header>
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImage} alt="" className="w-full rounded-lg mb-12" />
          ) : null}
          <div>{children}</div>
        </motion.div>
      </article>
      <div className="mt-24">
        <Footer />
      </div>
    </main>
  );
}
