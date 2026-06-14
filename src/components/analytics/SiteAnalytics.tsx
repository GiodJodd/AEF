"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

const CONSENT_KEY = "aef-consent";
type Consent = "granted" | "denied";

// Public env, inlined at build. When unset, GA never loads and — since the
// rest of our analytics is cookieless — no consent banner is shown at all.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function SiteAnalytics() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === "granted" || stored === "denied") setConsent(stored);
    } catch {
      /* localStorage unavailable (private mode) — treat as undecided */
    }
    setReady(true);
  }, []);

  function choose(value: Consent) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* ignore persistence failure */
    }
    setConsent(value);
  }

  const showBanner = ready && Boolean(GA_ID) && consent === null;

  return (
    <>
      {/* Cookieless & privacy-friendly → safe to load without consent. */}
      <Analytics />
      <SpeedInsights />

      {/* GA4 sets cookies → mount only after explicit opt-in (GDPR/UK-GDPR). */}
      {GA_ID && consent === "granted" ? <GoogleAnalytics gaId={GA_ID} /> : null}

      {showBanner ? (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-[100] bg-[#0a0a0a]/90 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-12">
            <p className="text-sm font-light leading-relaxed text-white/55">
              We use privacy-friendly analytics to understand how the site is
              used. With your consent we also load Google Analytics, which sets
              cookies.
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => choose("denied")}
                className="rounded-full bg-white/10 px-5 py-2 text-xs tracking-[0.1em] text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => choose("granted")}
                className="rounded-full bg-white px-5 py-2 text-xs tracking-[0.1em] text-black transition-opacity hover:opacity-85"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
