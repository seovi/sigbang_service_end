import assert from "node:assert/strict";

const base = process.argv[2] || "http://localhost:3100";
const gonePaths = ["/recipe/123", "/recipes/123", "/menu/test", "/menus/test", "/search/test", "/search?q=test", "/category/test", "/user/test", "/unknown-old-content", "/gone", "/sitemap.xml", "/sitemap/old.xml", "/recipe/123/", "/api/recipes"];
for (const [path, status] of [["/", 200], ["/legal/privacy", 200], ["/robots.txt", 200], ["/favicon.svg", 200], ["/notice.css", 200], ...gonePaths.map(path => [path, 410])]) {
  for (const method of ["GET", "HEAD"]) {
    const response = await fetch(new URL(path, base), { method, redirect: "manual" });
    assert.equal(response.status, status, `${method} ${path}`);
    assert.equal(response.headers.get("location"), null, `${path} must not redirect`);
    const body = await response.text();
    if (method === "GET" && path === "/legal/privacy") {
      assert.match(body, /아직 삭제되지 않았습니다/);
      assert.match(body, /서비스 운영 당시 개인정보처리방침/);
      assert.match(body, /2025.07.23/);
      assert.match(body, /name="robots" content="noindex, follow"/);
      assert.match(body, /mailto:contact.sigbang@gmail.com/);
    }
    if (method === "GET" && status === 410) {
      assert.match(body, /페이지를 더 이상 제공하지 않습니다/);
      assert.match(body, /href="\/"/);
      assert.equal(response.headers.get("x-robots-tag"), "noindex, follow");
    }
    if (method === "GET" && path === "/robots.txt") {
      assert.match(body, /User-Agent: \*/i);
      assert.match(body, /Allow: \//);
      assert.doesNotMatch(body, /Disallow|Sitemap/i);
    }
    if (method === "GET" && path === "/") {
      assert.match(body, /서비스 종료 안내/);
      assert.match(body, /href="\/legal\/privacy"/);
      assert.match(body, new RegExp(`name="robots" content="${process.env.SERVICE_END_PAGE_NOINDEX === "true" ? "noindex" : "index"}, follow"`));
      const assets = [...body.matchAll(/(?:src|href)="([^" ]*\/_next\/[^" ]+)"/g)];
      assert.ok(assets.length, "Next.js assets must be present");
      for (const [, asset] of assets) {
        assert.equal((await fetch(new URL(asset.replaceAll("&amp;", "&"), base))).status, 200, asset);
      }
    }
    console.log(`${method} ${path} → ${response.status}; Location: none`);
  }
}
