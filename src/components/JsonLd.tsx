// Renders schema.org JSON-LD. Server component — safe to use in layouts/pages.
// Escapes "<" so content strings can't break out of the <script> element.
export default function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
