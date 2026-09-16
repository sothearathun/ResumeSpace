import Link from "next/link";
import type { TemplateMeta } from "@/lib/resume/types";
import { TemplatePreview } from "@/components/resume-templates/TemplatePreview";

export function TemplateCard({ template }: { template: TemplateMeta }) {
  return (
    <div className="group flex flex-col gap-4">
      <div className="group relative">
        <TemplatePreview templateKey={template.key} />

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
        </div>
        <p className="mt-1 text-[13px] text-text-secondary">{template.tagline}</p>
      </div>
    </div>
  );
}
