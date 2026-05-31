import type { MetadataRoute } from "next";
import { works } from "./works";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://auvance.ca";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...works.map((w) => ({
      url: `${SITE}/work/${w.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
