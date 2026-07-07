import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const SITE = "https://www.geekinthesheets.app";
// Bump when the core pages change meaningfully
const CORE_LASTMOD = "2026-07-07";

const CORE_PAGES = [
  "/",
  "/support/",
  "/privacy-policy/",
  "/terms-and-conditions/",
  "/delete-request/",
];

const day = (d: Date) => d.toISOString().slice(0, 10);

export const GET: APIRoute = async () => {
  const tutorials = await getCollection(
    "tutorials",
    ({ data }) => !(data.draft && import.meta.env.PROD),
  );

  const urls = CORE_PAGES.map((path) => ({
    loc: `${SITE}${path}`,
    lastmod: CORE_LASTMOD,
  }));

  if (tutorials.length > 0) {
    const newest = tutorials
      .map((t) => t.data.updatedDate ?? t.data.publishDate)
      .sort((a, b) => b.valueOf() - a.valueOf())[0];
    urls.push({ loc: `${SITE}/tutorials/`, lastmod: day(newest) });
    for (const t of tutorials) {
      urls.push({
        loc: `${SITE}/tutorials/${t.id}/`,
        lastmod: day(t.data.updatedDate ?? t.data.publishDate),
      });
    }
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`,
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
