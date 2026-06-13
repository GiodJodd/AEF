import type { Metadata } from "next";
import { getFilms, getHome } from "@/lib/content";
import { FEED_ALTERNATE } from "@/lib/seo";
import LayoutScrollSnap from "@/components/layouts/LayoutScrollSnap";

// Home keeps the root layout's default title/description; we only pin its
// canonical URL. The rotating hero + grid read live from the CMS.
export const metadata: Metadata = {
  alternates: { canonical: "/", types: FEED_ALTERNATE },
};

export default async function HomePage() {
  const [films, home] = await Promise.all([getFilms(), getHome()]);
  return (
    <LayoutScrollSnap
      films={films}
      aboutTeaser={home.aboutTeaser}
      contactPrompt={home.contactPrompt}
    />
  );
}
