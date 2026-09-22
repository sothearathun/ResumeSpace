import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { templateCatalog } from "@/components/resume-templates/catalog";
import { blogPosts } from "@/lib/blog/posts";
import { resumeExamples } from "@/lib/resume-examples/examples";
import { seoPages } from "@/lib/seo-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/resume-examples`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/pricing`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const landingRoutes: MetadataRoute.Sitemap = seoPages.map((p) => ({
    url: `${SITE_URL}/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

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

  return [...staticRoutes, ...landingRoutes, ...templateRoutes, ...blogRoutes, ...exampleRoutes];
}
