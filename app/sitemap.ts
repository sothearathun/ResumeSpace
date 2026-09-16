import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { templateCatalog } from "@/components/resume-templates/catalog";
import { blogPosts } from "@/lib/blog/posts";
import { resumeExamples } from "@/lib/resume-examples/examples";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/templates`, changeFrequency: "weekly", priority: 0.9 },
    // /master-resume and /builder are excluded — see robots.ts: they're
    // per-device, localStorage-backed pages with nothing indexable on them.
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/resume-examples`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/pricing`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const templateRoutes: MetadataRoute.Sitemap = templateCatalog.map((t) => ({
    url: `${SITE_URL}/templates/${t.key}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const exampleRoutes: MetadataRoute.Sitemap = resumeExamples.map((e) => ({
    url: `${SITE_URL}/resume-examples/${e.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...templateRoutes, ...blogRoutes, ...exampleRoutes];
}
