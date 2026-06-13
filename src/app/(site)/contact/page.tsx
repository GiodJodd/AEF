import { getContact, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import ContactClient from "./ContactClient";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with AEF — independent film production between Rome and London.",
  path: "/contact",
});

export default async function ContactPage() {
  const [contact, settings] = await Promise.all([
    getContact(),
    getSiteSettings(),
  ]);
  return <ContactClient contact={contact} settings={settings} />;
}
