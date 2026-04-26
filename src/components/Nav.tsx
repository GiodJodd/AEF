"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Get in Touch" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (isHome) {
      const container = document.querySelector(".scroll-snap-container");
      if (container) container.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  }, [isHome, router]);

  useEffect(() => {
    const handleScroll = () => {
      const container =
        document.querySelector(".scroll-snap-container") ||
        document.querySelector(".fixed.inset-0.overflow-y-auto");
      const y = container ? container.scrollTop : window.scrollY;
      setScrolled(y > 50);
    };

    // Small delay to let containers mount
    const timer = setTimeout(() => {
      const containers = [
        document.querySelector(".scroll-snap-container"),
        document.querySelector(".fixed.inset-0.overflow-y-auto"),
      ].filter(Boolean);

      containers.forEach((c) => c?.addEventListener("scroll", handleScroll, { passive: true }));
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      return () => {
        containers.forEach((c) => c?.removeEventListener("scroll", handleScroll));
        window.removeEventListener("scroll", handleScroll);
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Dynamic blurred backdrop — transitions smoothly on scroll */}
      <div
        className="absolute inset-0 transition-all duration-500 ease-out"
        style={{
          backgroundColor: scrolled ? "rgba(10, 10, 10, 0.8)" : "rgba(10, 10, 10, 0)",
          backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
          borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid transparent",
        }}
      />

      <div className="relative flex items-center justify-between px-6 md:px-12 py-5">
        <a
          href="/"
          onClick={handleLogoClick}
          className="text-xl tracking-[0.3em] font-light uppercase text-white hover:opacity-70 transition-opacity cursor-pointer"
        >
          AEF
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const isContact = link.href === "/contact";

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-widest uppercase transition-colors duration-300 ${
                  isContact
                    ? isActive
                      ? "text-white font-medium"
                      : "text-white/70 font-medium hover:text-white"
                    : isActive
                      ? "text-white"
                      : "text-white/40 hover:text-white/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 w-6"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            className="block h-px w-full bg-white"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block h-px w-full bg-white"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            className="block h-px w-full bg-white"
          />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#0a0a0a]/90 md:hidden flex flex-col items-center justify-center gap-8 z-40"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-5 right-6 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 20 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
