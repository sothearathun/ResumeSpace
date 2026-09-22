import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { blogPosts } from "@/lib/blog/posts";
import { pageMetadata } from "@/lib/seo";
import { formatPostDate } from "@/lib/blog/format";

export const metadata: Metadata = pageMetadata({
  title: "Resume Writing Guides: Master Resume, ATS & Tailoring Tips",
  description:
    "Practical guides on writing a resume, building a master resume, beating ATS systems and tailoring your resume to a job description.",
  path: "/blog",
  keywords: ["resume tips", "master resume guide", "ATS resume guide", "resume writing"],
});

export default function BlogIndexPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <section className="mx-auto w-full max-w-[720px] px-4 pt-14 pb-24 sm:px-6">
        <h1 className="text-[32px] font-semibold tracking-tight sm:text-[36px]">Blog</h1>
        <p className="mt-2 text-[14px] text-text-secondary">
          Practical writing on resumes, ATS systems, and job applications — no
          fluff, no generic advice.
        </p>

        <div className="mt-10 flex flex-col divide-y divide-border">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group py-7 first:pt-0"
            >
              <time className="text-[12.5px] text-text-secondary">
                {formatPostDate(post.publishedAt)}
              </time>
              <h2 className="mt-1.5 text-[18px] font-medium tracking-tight group-hover:text-accent">
                {post.title}
              </h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-text-secondary">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
