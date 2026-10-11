import type { MetadataRoute } from "next";
import { query } from "@/lib/db";

const SITE_URL = "https://zenera.top";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
  try {
    const rows = await query<{ slug: string }>(
      "SELECT slug FROM products ORDER BY id ASC"
    );
    for (const r of rows) {
      if (!r.slug) continue;
      urls.push({
        url: `${SITE_URL}/product/${encodeURIComponent(r.slug)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // DB unavailable at build time: serve homepage-only sitemap
  }
  return urls;
}
