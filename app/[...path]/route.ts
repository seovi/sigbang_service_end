import { service } from "../../config/service";

// A Route Handler controls the HTTP status directly; a page/notFound cannot emit 410.
// Public files and explicit App Router routes take priority over this catch-all.
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

function gone(request: Request): Response {
  if (new URL(request.url).pathname.startsWith("/_next/")) {
    return new Response(null, { status: 404 });
  }
  const contact = service.contactEmail
    ? `<a href="mailto:${escapeHtml(service.contactEmail)}">${escapeHtml(service.contactEmail)}</a>`
    : escapeHtml(service.contactPending);
  const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(service.goneTitle)} | ${escapeHtml(service.name)}</title>
<meta name="robots" content="noindex, follow">
<link rel="icon" href="/brand-icon.png"><link rel="stylesheet" href="/notice.css">
</head><body><div class="shell"><main class="card">
<div class="brand"><img src="/brand-logo.png" width="56" height="56" alt=""><span>${escapeHtml(service.name)}</span></div><p class="eyebrow">410 Gone</p>
<h1>${escapeHtml(service.goneTitle)}</h1>
<p class="message">${escapeHtml(service.goneDescription)}</p>
<a class="button" href="/">${escapeHtml(service.homeLink)}</a>
</main><footer><p>${escapeHtml(service.copyright)}</p>
<p><a href="/legal/privacy">${escapeHtml(service.privacyLink)}</a></p>
<p>${escapeHtml(service.contactLabel)}: ${contact}</p></footer></div></body></html>`;
  return new Response(request.method === "HEAD" ? null : html, {
    status: 410,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
      "X-Robots-Tag": "noindex, follow",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export { gone as GET, gone as HEAD, gone as POST, gone as PUT,
  gone as PATCH, gone as DELETE, gone as OPTIONS };
