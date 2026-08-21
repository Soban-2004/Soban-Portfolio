import type { MetadataRoute } from "next";

const siteUrl = "https://sobanshankar.vercel.app"; // update once a final domain is chosen

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
