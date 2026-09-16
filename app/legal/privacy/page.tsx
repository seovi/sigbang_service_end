import type { Metadata } from "next";
import { ArchivedPrivacyPolicy } from "../../../components/ArchivedPrivacyPolicy";
import { privacy } from "../../../config/privacy";
import { service } from "../../../config/service";

export const dynamic = "force-static";
export const metadata: Metadata = {
  title: `${privacy.title} | ${service.name}`,
  description: privacy.description,
  robots: { index: false, follow: true },
  openGraph: {
    title: `${privacy.title} | ${service.name}`,
    description: privacy.description,
    siteName: service.name,
    locale: "ko_KR",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="shell">
      <main className="card policy">
        <div className="brand">
          <img src="/brand-logo.png" width="56" height="56" alt="" />
          <span>{service.name}</span>
        </div>
        <h1>{privacy.title}</h1>
        <section aria-labelledby="current-privacy">
          <h2 id="current-privacy">{privacy.currentTitle}</h2>
          {privacy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="contact">{service.contactLabel}: <a href={`mailto:${service.contactEmail}`}>{service.contactEmail}</a></p>
        </section>
        <section className="archive" aria-labelledby="archived-privacy">
          <h2 id="archived-privacy">{privacy.archiveTitle}</h2>
          <p className="archive-notice">{privacy.archiveNotice}</p>
          <ArchivedPrivacyPolicy />
        </section>
        <a className="button" href="/">{service.homeLink}</a>
      </main>
      <footer><p>{service.copyright}</p><p>{service.contactLabel}: <a href={`mailto:${service.contactEmail}`}>{service.contactEmail}</a></p></footer>
    </div>
  );
}
