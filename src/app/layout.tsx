import type { Metadata, Viewport } from "next";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site";
import { satoshi } from "@/lib/fonts";
import { getSiteSettings } from "@/lib/content";
import { SiteSettingsProvider } from "@/components/SiteSettingsContext";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s — AEF" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
  // Root social images are served by the opengraph-image.jpg / twitter-image.jpg
  // file conventions in this folder, so they're intentionally not repeated here.
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Set GOOGLE_SITE_VERIFICATION on Vercel to emit the Search Console
  // verification <meta> tag. Omitted entirely when unset.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={satoshi.variable}>
      <body className="bg-[#0a0a0a] text-[#f5f5f5] antialiased">
        <JsonLd data={[organizationSchema(settings), websiteSchema()]} />
        <SiteSettingsProvider value={settings}>{children}</SiteSettingsProvider>
      </body>
    </html>
  );
}
