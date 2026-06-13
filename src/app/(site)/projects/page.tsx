import { getFilms } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { filmsCollectionSchema } from "@/lib/schema";
import ProjectsClient from "./ProjectsClient";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Films produced by AEF — features, documentaries, and shorts spanning Rome and London.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const films = await getFilms();
  return (
    <>
      <JsonLd data={[filmsCollectionSchema(films)]} />
      <ProjectsClient films={films} />
    </>
  );
}
