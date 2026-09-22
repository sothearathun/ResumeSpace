import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Editor drafts, saved resumes and auth pages are per-user or
      // per-device — nothing there is worth indexing.
      disallow: ["/builder", "/my-resumes", "/sign-in", "/auth/", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
