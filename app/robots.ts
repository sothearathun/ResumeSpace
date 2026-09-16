import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Builder/master-resume pages are per-device (localStorage-backed),
      // not content — nothing there is indexable, so keep crawlers out.
      disallow: ["/builder", "/master-resume"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
