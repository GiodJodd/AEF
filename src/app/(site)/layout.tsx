import ClientProviders from "@/components/ClientProviders";
import SiteAnalytics from "@/components/analytics/SiteAnalytics";

// Wraps every public page in the site chrome (fixed Nav + hero-color context).
// The /keystatic admin lives outside this group so it doesn't inherit the Nav
// or the analytics/consent layer.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClientProviders>{children}</ClientProviders>
      <SiteAnalytics />
    </>
  );
}
