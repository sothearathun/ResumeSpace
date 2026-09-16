import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TemplatePreview } from "@/components/resume-templates/TemplatePreview";
import { getTemplateMeta, templateCatalog } from "@/components/resume-templates/catalog";

export function generateStaticParams() {
  return templateCatalog.map((t) => ({ slug: t.key }));
}

export async function generateMetadata(
  props: PageProps<"/templates/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const template = getTemplateMeta(slug);
  if (!template) return {};
  return {
    title: `${template.name} template — ResumeCraft`,
    description: template.description,
  };
}

export default async function TemplatePreviewPage(props: PageProps<"/templates/[slug]">) {
  const { slug } = await props.params;
  const template = getTemplateMeta(slug);
  if (!template) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <section className="mx-auto w-full max-w-[1280px] px-4 pt-10 pb-24 sm:px-6 lg:px-10">
        <Link
          href="/templates"
          className="text-[13px] text-text-secondary hover:text-text-primary"
        >
          ← Back to templates
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
          <div className="mx-auto w-full max-w-[600px]">
            <TemplatePreview templateKey={template.key} />
          </div>

          <div className="flex flex-col gap-6 lg:pt-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-semibold tracking-tight">{template.name}</h1>
                {template.atsFriendly && (
                  <span className="rounded-md bg-bg-secondary px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                    ATS-friendly
                  </span>
                )}
              </div>
              <p className="mt-1 text-[13px] text-text-secondary">
                {template.style.charAt(0).toUpperCase() + template.style.slice(1)}
                {" · "}
                {template.format.join(", ")}
              </p>
            </div>

            <p className="text-[14px] leading-relaxed text-text-secondary">
              {template.description}
            </p>

            {template.atsNote && (
              <p className="rounded-lg bg-bg-secondary px-3 py-2.5 text-[12.5px] leading-relaxed text-text-secondary">
                {template.atsNote}
              </p>
            )}

            <Link
              href={`/builder?template=${template.key}`}
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
