import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { blogPosts, getBlogPost } from "@/lib/blog/posts";
import { formatPostDate } from "@/lib/blog/format";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — ResumeCraft`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      url: `${SITE_URL}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: "ResumeCraft" },
    publisher: { "@type": "Organization", name: "ResumeCraft" },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto w-full max-w-[680px] px-4 pt-12 pb-16 sm:px-6">
        <Link href="/blog" className="text-[13px] text-text-secondary hover:text-text-primary">
          ← Back to blog
        </Link>

        <header className="mt-6 border-b border-border pb-6">
          <time className="text-[13px] text-text-secondary">
            {formatPostDate(post.publishedAt)}
          </time>
          <h1 className="mt-2 text-[28px] font-semibold tracking-tight sm:text-[32px]">
            {post.title}
          </h1>
        </header>

        <div className="pt-8">
          <post.Content />
        </div>

        <div className="mt-14 flex flex-col items-start gap-3 rounded-xl border border-border bg-bg-secondary p-6">
          <p className="text-[14px] font-medium">Ready to put this into practice?</p>
          <Link
            href="/templates"
            className="rounded-lg bg-accent px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Create a resume
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}
