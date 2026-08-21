import type { MetadataRoute } from "next";

const siteUrl = "https://sobanshankar.vercel.app"; // update once a final domain is chosen

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date(), priority: 1 },
    { url: `${siteUrl}/work/fitnova`, lastModified: new Date(), priority: 0.9 },
  ];
}
