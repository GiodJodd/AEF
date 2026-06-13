import { getAbout, getTeam, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import AboutClient from "./AboutClient";

export const metadata = pageMetadata({
  title: "About",
  description:
    "AEF is an independent film production company between Rome and London, founded in 2022 by Matteo Severini and Riccardo Rizzi.",
  path: "/about",
});

export default async function AboutPage() {
  const [about, team, settings] = await Promise.all([
    getAbout(),
    getTeam(),
    getSiteSettings(),
  ]);
  return <AboutClient about={about} team={team} settings={settings} />;
}
