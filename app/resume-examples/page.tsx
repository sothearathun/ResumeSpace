import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/seo";
import { resumeExamples } from "@/lib/resume-examples/examples";
import { ExampleCard } from "@/components/resume-examples/ExampleCard";

export const metadata: Metadata = pageMetadata({
  title: "Resume Examples by Job: Engineering, Design, Marketing & More",
  description:
    "Free resume examples for real roles across engineering, design, marketing, finance and academia. Copy the structure and build yours with a free resume builder.",
  path: "/resume-examples",
  keywords: ["resume examples", "resume samples", "resume examples by job"],
});

export default function ResumeExamplesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <section className="mx-auto w-full max-w-[1280px] px-4 pt-14 pb-24 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <h1 className="text-[32px] font-semibold tracking-tight sm:text-[36px]">
            Resume examples
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
            Full, role-specific resumes — not just a template with placeholder
            text. Each one comes with notes on why the format fits that role.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {resumeExamples.map((example) => (
            <ExampleCard key={example.slug} example={example} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
