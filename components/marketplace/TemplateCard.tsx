import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { TemplateMeta } from "@/lib/resume/types";
import { TemplatePreviewLazy } from "@/components/resume-templates/TemplatePreviewLazy";

export function TemplateCard({ template }: { template: TemplateMeta }) {
  return (
    <div className="group flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1">
      <div className="group relative">
        <TemplatePreviewLazy templateKey={template.key} />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 bg-neutral-900/0 opacity-0 transition-all duration-200 group-hover:bg-neutral-900/35 group-hover:opacity-100">
          <Link
            href={`/templates/${template.key}`}
            className="pointer-events-auto rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-text-primary shadow-none transition-colors hover:bg-neutral-100"
          >
            Preview
          </Link>
          <Link
            href={`/builder?template=${template.key}`}
            className="pointer-events-auto rounded-lg bg-accent px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Use template
          </Link>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-medium">{template.name}</h3>
          {template.atsFriendly && (
            <span className="rounded-md bg-bg-secondary px-2 py-0.5 text-[11px] font-medium text-text-secondary">
              ATS-friendly
            </span>
          )}
          {template.premium && (
            <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
              Premium
            </span>
          )}
        </div>
        <p className="mt-1 text-[13px] text-text-secondary">{template.tagline}</p>
        <Link
          href={`/builder?template=${template.key}`}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-accent/30 px-3.5 py-1.5 text-[13px] font-medium text-accent transition-all hover:border-accent hover:bg-accent hover:text-white"
        >
          Use this template
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
