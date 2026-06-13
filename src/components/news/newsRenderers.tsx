import type { DocumentRendererProps } from "@keystatic/core/renderer";

// Maps Keystatic Markdoc nodes onto the site's typographic system. Server-safe
// (no hooks / client APIs) so an article body renders fully in static HTML.
export const newsRenderers: DocumentRendererProps["renderers"] = {
  inline: {
    bold: ({ children }) => (
      <strong className="font-medium text-white/90">{children}</strong>
    ),
    italic: ({ children }) => <em className="italic">{children}</em>,
    strikethrough: ({ children }) => <s>{children}</s>,
    underline: ({ children }) => (
      <span className="underline underline-offset-4">{children}</span>
    ),
    code: ({ children }) => (
      <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em] text-white/90">
        {children}
      </code>
    ),
    keyboard: ({ children }) => <kbd>{children}</kbd>,
    superscript: ({ children }) => <sup>{children}</sup>,
    subscript: ({ children }) => <sub>{children}</sub>,
    link: ({ href, children }) => {
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
  block: {
    paragraph: ({ children }) => (
      <p className="mb-6 text-base md:text-lg font-light leading-relaxed text-white/65">
        {children}
      </p>
    ),
    heading: ({ level, children }) => {
      const Tag = `h${Math.min(level, 6)}` as "h2";
      const size = level <= 2 ? "text-2xl md:text-3xl" : "text-xl md:text-2xl";
      return (
        <Tag
          className={`mt-12 mb-5 font-extralight tracking-tight text-white/90 ${size}`}
        >
          {children}
        </Tag>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l border-white/20 pl-6 text-lg font-light italic text-white/55">
        {children}
      </blockquote>
    ),
    divider: () => <hr className="my-12 border-white/10" />,
    list: ({ type, children }) => {
      const cls =
        "mb-6 space-y-2 pl-6 text-base md:text-lg font-light leading-relaxed text-white/65";
      return type === "ordered" ? (
        <ol className={`list-decimal ${cls}`}>
          {children.map((child, i) => (
            <li key={i}>{child}</li>
          ))}
        </ol>
      ) : (
        <ul className={`list-disc ${cls}`}>
          {children.map((child, i) => (
            <li key={i}>{child}</li>
          ))}
        </ul>
      );
    },
    code: ({ children }) => (
      <pre className="my-8 overflow-x-auto rounded-lg bg-white/[0.04] p-5 text-sm leading-relaxed text-white/80">
        <code>{children}</code>
      </pre>
    ),
    image: ({ src, alt, title }) => (
      <figure className="my-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} title={title} className="w-full rounded-lg" loading="lazy" />
        {title ? (
          <figcaption className="mt-3 text-center text-xs tracking-wide text-white/40">
            {title}
          </figcaption>
        ) : null}
      </figure>
    ),
  },
};
