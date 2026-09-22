"use client";

import dynamic from "next/dynamic";
import type { TemplateKey } from "@/lib/resume/types";

// Rendered on the client only, on purpose: each preview is a full sample
// resume with its own <h1>/<h2> headings and placeholder names. Server-
// rendering a dozen of those puts a dozen H1s and ~100 irrelevant headings
// into the HTML that search engines index. Here the page keeps one clean
// heading structure and the preview fills in after hydration.
const Preview = dynamic(() => import("./TemplatePreview").then((m) => m.TemplatePreview), {
  ssr: false,
  loading: () => (
    <div className="aspect-[210/297] w-full animate-pulse rounded-lg border border-border bg-bg-secondary" />
  ),
});

export function TemplatePreviewLazy({ templateKey }: { templateKey: TemplateKey }) {
  return <Preview templateKey={templateKey} />;
}
