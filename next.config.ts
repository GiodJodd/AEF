import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // Canonicalize the host to the bare apex that metadataBase / canonical URLs
  // use, so www.* doesn't split duplicate content. Vercel honours this redirect.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.aefproductions.com" }],
        destination: "https://aefproductions.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
