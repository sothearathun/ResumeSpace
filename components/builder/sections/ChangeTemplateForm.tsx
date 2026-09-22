import type { ResumeDraft, TemplateKey } from "@/lib/resume/types";
import { templateCatalog } from "@/components/resume-templates/catalog";
import { templateComponents } from "@/components/resume-templates";
import { TemplateCanvas } from "@/components/resume-templates/TemplateCanvas";

export function ChangeTemplateForm({
  draft,
  onChange,
}: {
  draft: ResumeDraft;
  onChange: (templateKey: TemplateKey) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-[14px] font-medium text-text-primary">Change template</h2>
        <p className="mt-1 text-[13px] text-text-secondary">
          Everything you&rsquo;ve entered stays exactly as it is — only the look changes. Appearance
          customization (color, font, spacing) resets to the new template&rsquo;s defaults.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {templateCatalog.map((meta) => {
          const Template = templateComponents[meta.key];
          const active = meta.key === draft.templateKey;
          return (
            <button
              key={meta.key}
              type="button"
              onClick={() => onChange(meta.key)}
              disabled={active}
              className={`flex flex-col gap-2 rounded-lg text-left ${active ? "cursor-default" : ""}`}
            >
              <div className={active ? "rounded-lg ring-2 ring-accent" : "rounded-lg"}>
                <TemplateCanvas>
                  <Template content={draft} appearance={meta.defaultAppearance} />
                </TemplateCanvas>
              </div>
              <span className="text-[12px] font-medium text-text-primary">
                {meta.name}
                {active && <span className="ml-1.5 font-normal text-text-secondary">(current)</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
