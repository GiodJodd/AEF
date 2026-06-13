// Keep the /keystatic admin outside the site chrome (no Nav/footer). The root
// layout still supplies <html>/<body>; this segment just passes children through.
export default function KeystaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
