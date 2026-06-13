import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentRenderer } from "@keystatic/core/renderer";
import type { DocumentRendererProps } from "@keystatic/core/renderer";
import { getNewsPost, getNewsSlugs } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { newsArticleSchema, breadcrumbSchema } from "@/lib/schema";
import { newsRenderers } from "@/components/news/newsRenderers";
import NewsArticleClient from "./NewsArticleClient";

// Fixed set of published posts → prerender each, 404 anything else.
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt || `${post.title} — news from AEF.`,
    path: `/news/${slug}`,
    images: post.coverImage
      ? [{ url: post.coverImage, alt: post.title }]
      : undefined,
  });
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) notFound();
  return (
    <>
      <JsonLd
        data={[
          newsArticleSchema(post),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "News", url: "/news" },
            { name: post.title, url: `/news/${post.slug}` },
          ]),
        ]}
      />
      <NewsArticleClient
        title={post.title}
        publishedDate={post.publishedDate}
        author={post.author}
        coverImage={post.coverImage}
      >
        <DocumentRenderer
          document={post.content as DocumentRendererProps["document"]}
          renderers={newsRenderers}
        />
      </NewsArticleClient>
    </>
  );
}
