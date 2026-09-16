import type { TemplateKey } from "@/lib/resume/types";
import { sampleResumes } from "@/lib/resume/sample-resumes";
import { getTemplateMeta } from "./catalog";
import { templateComponents } from "./index";
import { TemplateCanvas } from "./TemplateCanvas";

/** Renders one template, scaled to fill its container, using realistic
 * sample content and that template's default appearance — the single
 * component reused by the marketplace card, the `/templates/[slug]` page,
 * and (later) the builder's live preview (§6 of the plan). */
export function TemplatePreview({ templateKey }: { templateKey: TemplateKey }) {
  const meta = getTemplateMeta(templateKey);
  if (!meta) return null;

  const Template = templateComponents[templateKey];
  const content = sampleResumes[templateKey];

  return (
    <TemplateCanvas>
      <Template content={content} appearance={meta.defaultAppearance} />
    </TemplateCanvas>
  );
}
