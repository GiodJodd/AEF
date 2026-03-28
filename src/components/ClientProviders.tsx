"use client";

import { HeroColorProvider } from "@/components/HeroColorContext";
import Nav from "@/components/Nav";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <HeroColorProvider>
      <Nav />
      {children}
    </HeroColorProvider>
  );
}
