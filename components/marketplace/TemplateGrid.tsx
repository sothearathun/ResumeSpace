import type { TemplateMeta } from "@/lib/resume/types";
import { TemplateCard } from "./TemplateCard";

export function TemplateGrid({ templates }: { templates: TemplateMeta[] }) {
  if (templates.length === 0) {
    return (
      <p className="py-16 text-center text-[14px] text-text-secondary">
        No templates match these filters yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard key={template.key} template={template} />
      ))}
    </div>
  );
}
