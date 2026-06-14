import type { Metadata } from "next";
import Link from "next/link";

// Override the root layout's `index, follow` so the 404 is consistently
// noindex (Next also emits its own noindex for the not-found boundary).
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center">
      <p className="text-xs tracking-[0.12em] text-white/30">
        Error 404
      </p>
      <h1 className="mt-6 text-6xl font-extralight tracking-tight md:text-8xl">
        Page not found
      </h1>
      <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-white/50">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-white/10 px-6 py-3 text-xs tracking-[0.1em] text-white/80 transition-colors hover:bg-white/20 hover:text-white"
      >
        Back to home
      </Link>
    </main>
  );
}
