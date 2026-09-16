import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TemplatePreview } from "@/components/resume-templates/TemplatePreview";
import { getTemplateMeta } from "@/components/resume-templates/catalog";
import { resumeExamples, getResumeExample } from "@/lib/resume-examples/examples";
import { sampleResumes } from "@/lib/resume/sample-resumes";

export function generateStaticParams() {
  return resumeExamples.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata(
  props: PageProps<"/resume-examples/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const example = getResumeExample(slug);
  if (!example) return {};
  return {
    title: `${example.roleTitle} Resume Example — ResumeCraft`,
    description: example.summary,
  };
}

export default async function ResumeExamplePage(props: PageProps<"/resume-examples/[slug]">) {
  const { slug } = await props.params;
  const example = getResumeExample(slug);
  if (!example) notFound();

  const template = getTemplateMeta(example.templateKey);
  const name = sampleResumes[example.templateKey].contact.name;

  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <section className="mx-auto w-full max-w-[1280px] px-4 pt-10 pb-24 sm:px-6 lg:px-10">
        <Link
          href="/resume-examples"
          className="text-[13px] text-text-secondary hover:text-text-primary"
        >
          ← Back to resume examples
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
          <div className="mx-auto w-full max-w-[600px]">
            <TemplatePreview templateKey={example.templateKey} />
          </div>

          <div className="flex flex-col gap-6 lg:pt-4">
            <div>
              <h1 className="text-[22px] font-semibold tracking-tight">
                {example.roleTitle} Resume Example
              </h1>
              <p className="mt-1 text-[13px] text-text-secondary">
                Based on {name}&rsquo;s resume, built with the{" "}
                {template && (
                  <Link
                    href={`/templates/${template.key}`}
                    className="text-accent hover:text-accent-hover"
                  >
                    {template.name}
                  </Link>
                )}{" "}
                template
              </p>
            </div>

            <p className="text-[14px] leading-relaxed text-text-secondary">
              {example.summary}
            </p>

            <div>
              <h2 className="text-[13px] font-semibold tracking-tight">Why this works</h2>
              <ul className="mt-2 flex flex-col gap-2">
                {example.whyItWorks.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-text-secondary">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={`/builder?template=${example.templateKey}`}
              className="rounded-lg bg-accent px-5 py-3 text-center text-[14px] font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Use this template
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
