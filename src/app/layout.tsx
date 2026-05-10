import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const SITE_URL = "https://aefproductions.com";
const TITLE = "AEF — Independent Film Production";
const DESCRIPTION =
  "AEF is an independent film production company between Rome and London, founded in 2022 by Matteo Severini and Riccardo Rizzi.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "AEF",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "CUIRDANGE — a feature film by Riccardo Rizzi, produced by AEF.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#0a0a0a] text-[#f5f5f5] antialiased">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
