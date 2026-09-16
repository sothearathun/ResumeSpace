import type { ComponentType } from "react";
import { TailorResumeToJobDescription } from "@/components/blog/posts/TailorResumeToJobDescription";
import { AtsFriendlyResumeGuide } from "@/components/blog/posts/AtsFriendlyResumeGuide";
import { ResumePhotoByCountry } from "@/components/blog/posts/ResumePhotoByCountry";
import { WhatIsAMasterResume } from "@/components/blog/posts/WhatIsAMasterResume";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  Content: ComponentType;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "tailor-resume-to-job-description",
    title: "How to Tailor Your Resume to a Job Description",
    description:
      "A resume written for every job at once is really written for none of them. Here's how to actually tailor one, without fabricating anything.",
    publishedAt: "2026-01-12",
    Content: TailorResumeToJobDescription,
  },
  {
    slug: "ats-friendly-resume-guide",
    title: "What Actually Makes a Resume ATS-Friendly",
    description:
      "\"ATS-friendly\" usually means layout, not keywords. Here's what actually breaks parsing, and what doesn't matter as much as people think.",
    publishedAt: "2026-01-19",
    Content: AtsFriendlyResumeGuide,
  },
  {
    slug: "resume-photo-by-country",
    title: "Should You Put a Photo on Your Resume? A Country-by-Country Guide",
    description:
      "Photo norms vary sharply by region — standard in Germany and Japan, discouraged in the US and UK. Here's what to do depending on where you're applying.",
    publishedAt: "2026-01-26",
    Content: ResumePhotoByCountry,
  },
  {
    slug: "what-is-a-master-resume",
    title: "What Is a Master Resume (and Why You Should Keep One)",
    description:
      "One complete document with every job, bullet, and skill you've ever had — and why it makes every resume you actually send faster to write.",
    publishedAt: "2026-02-02",
    Content: WhatIsAMasterResume,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
