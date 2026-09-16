import { service } from "../config/service";

function Contact() {
  return service.contactEmail ? (
    <a href={`mailto:${service.contactEmail}`}>{service.contactEmail}</a>
  ) : <span>{service.contactPending}</span>;
}

export function ServiceEnded() {
  return (
    <div className="shell">
      <main className="card">
        <p className="brand">{service.name}</p>
        <p className="eyebrow">{service.label}</p>
        <h1>{service.title}</h1>
        <div className="message">
          {service.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <p className="contact">{service.contactLabel}: <Contact /></p>
      </main>
      <footer>
        <p>{service.copyright}</p>
        <p>{service.contactLabel}: <Contact /></p>
      </footer>
    </div>
  );
}
