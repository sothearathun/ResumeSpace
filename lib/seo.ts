import type { Metadata } from "next";
import { SITE_URL } from "./site";

export const SITE_NAME = "ResumeSpace";

export const DEFAULT_TITLE = "Free AI Resume Builder & Master Resume Maker";

export const DEFAULT_DESCRIPTION =
  "Build a free, ATS-friendly resume or CV in minutes. ResumeSpace is a free AI resume builder with a master resume: enter your career history once, then generate a tailored resume for every job and download it as a PDF.";

export const KEYWORDS = [
  "free resume builder",
  "AI resume builder",
  "master resume",
  "master resume builder",
  "resume maker",
  "make a resume",
  "create a resume online",
  "CV maker",
  "free CV maker",
  "AI resume generator",
  "AI resume writer",
  "ATS-friendly resume",
  "resume templates",
  "tailor resume to job description",
  "resume PDF download",
];

const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE_NAME} — ${DEFAULT_TITLE}` };

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/** Consistent per-page metadata: canonical, Open Graph and Twitter all agree
 * with the page's own title/description. The root layout's title template
 * appends the site name, so pass the bare page title. */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  /** Skip the " | ResumeSpace" suffix (for pages whose title already reads as a full headline). */
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: path,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export const noIndex: Metadata = {
  robots: { index: false, follow: false },
};

export type FaqItem = { q: string; a: string };

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
