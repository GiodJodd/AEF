"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT_EMAIL } from "@/lib/site";
import { useSiteSettings } from "@/components/SiteSettingsContext";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const settings = useSiteSettings();
  const email = settings?.contactEmail || CONTACT_EMAIL;

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

  // Close the menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
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
        }}
      />

      <div className="relative flex items-center justify-between px-6 md:px-12 py-5">
        {/* Menu — opens the full-screen overlay (all breakpoints) */}
        <button
          onClick={() => setMenuOpen(true)}
          className="text-sm font-medium tracking-wide text-white/80 transition-colors hover:text-white"
          aria-label="Open menu"
        >
          Menu
        </button>

        {/* Logo — centered on every page */}
        <a
          href="/"
          onClick={handleLogoClick}
          aria-label="AEF — Home"
          className="absolute left-1/2 top-1/2 z-10 block -translate-x-1/2 -translate-y-1/2 text-white transition-opacity hover:opacity-70 cursor-pointer"
        >
          <svg
            viewBox="0 0 231 233"
            className="h-7 md:h-8 w-auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M104.061 189.121V154.677C104.061 144.881 92.2212 139.973 85.2905 146.891L228.561 3.62109V231.121H146.061C122.865 231.121 104.061 212.317 104.061 189.121Z"
              fill="currentColor"
            />
            <path
              d="M1.06055 231.121L85.2824 146.899C92.212 139.97 104.061 144.877 104.061 154.677V189.121C104.061 212.317 122.865 231.121 146.061 231.121H228.561V3.62109L1.06055 231.121Z"
              stroke="currentColor"
              strokeWidth={3}
            />
          </svg>
        </a>

        {/* Get in Touch — opens the visitor's mail client */}
        <a
          href={`mailto:${email}`}
          className="text-sm font-medium tracking-wide text-white/80 transition-colors hover:text-white"
        >
          Get in Touch
        </a>
      </div>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-5 bg-[#0a0a0a]/95"
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
                  className="text-3xl md:text-5xl font-medium tracking-tight text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              key="get-in-touch"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: links.length * 0.05, type: "spring", stiffness: 200, damping: 20 }}
            >
              <a
                href={`mailto:${email}`}
                onClick={() => setMenuOpen(false)}
                className="text-3xl md:text-5xl font-medium tracking-tight text-white/70 hover:text-white transition-colors"
              >
                Get in Touch
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
