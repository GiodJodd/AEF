import { getNews } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import NewsClient from "./NewsClient";

export const metadata = pageMetadata({
  title: "News",
  description:
    "Festival announcements, releases, and press updates from AEF.",
  path: "/news",
});

export default async function NewsPage() {
  const posts = await getNews();
  return <NewsClient posts={posts} />;
}
