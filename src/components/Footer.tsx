import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/site";

// Label a social URL from its host so the owner only maintains URLs in one
// place (src/lib/site.ts) — we never invent a link, only render real ones.
const SOCIAL_LABELS: Record<string, string> = {
  "instagram.com": "Instagram",
  "vimeo.com": "Vimeo",
  "linkedin.com": "LinkedIn",
  "letterboxd.com": "Letterboxd",
  "youtube.com": "YouTube",
  "imdb.com": "IMDb",
};

function socialLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return (
      SOCIAL_LABELS[host] ??
      host.split(".")[0].replace(/^./, (c) => c.toUpperCase())
    );
  } catch {
    return "Link";
  }
}

export default function Footer({ minimal = false }: { minimal?: boolean }) {
  if (minimal) {
    return (
      <footer className="fixed bottom-0 left-0 right-0 z-40 px-6 md:px-12 py-4 flex justify-between items-center text-xs tracking-widest uppercase text-[#444]">
        <span>AEF &middot; Rome &middot; London</span>
        <span>&copy; 2026</span>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/5 px-6 md:px-12 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div>
          <p className="text-xl tracking-[0.3em] font-light uppercase mb-2">AEF</p>
          <p className="text-sm text-[#666]">Rome &middot; London</p>
        </div>
        <div className="flex gap-8 text-sm text-[#666]">
          {SOCIAL_LINKS.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              {socialLabel(url)}
            </a>
          ))}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hover:text-white transition-colors"
          >
            Email
          </a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-white/5 text-xs text-[#444] tracking-widest uppercase">
        &copy; 2026 AEF. All rights reserved.
      </div>
    </footer>
  );
}
