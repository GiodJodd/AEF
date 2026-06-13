import { getNews } from "@/lib/content";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

// Statically generated at build alongside the rest of the SSG output.
export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getNews();

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}/news/${post.slug}`;
      const pubDate = post.publishedDate
        ? new Date(post.publishedDate).toUTCString()
        : "";
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : "",
        post.author ? `      <dc:creator>${escapeXml(post.author)}</dc:creator>` : "",
        post.excerpt
          ? `      <description>${escapeXml(post.excerpt)}</description>`
          : "",
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const lastBuildDate = posts[0]?.publishedDate
    ? new Date(posts[0].publishedDate).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_NAME)} — News</title>
    <link>${SITE_URL}/news</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
