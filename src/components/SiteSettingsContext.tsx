"use client";

import { createContext, useContext } from "react";
import type { SiteSettings } from "@/lib/content";

// Lets global client chrome (the Footer) read the CMS site settings without
// threading props through every page. Fed once from the root layout.
const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
