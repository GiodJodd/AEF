import localFont from "next/font/local";

// Self-hosted Satoshi (was a render-blocking Fontshare @import). next/font
// inlines the @font-face, preloads, and adds a size-adjusted fallback to
// eliminate font-driven layout shift (CLS).
export const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Satoshi-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Satoshi-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  fallback: ["Inter", "Helvetica Neue", "Arial", "sans-serif"],
});
