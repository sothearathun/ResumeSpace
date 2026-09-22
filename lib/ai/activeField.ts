import type { OptionalSectionKey, ResumeContent } from "@/lib/resume/types";
import { optionalSectionMeta } from "@/lib/resume/optional-sections";

/** Whichever text field the user last clicked into — the one AI Helper
 * chat edits when asked to rewrite something. Identifying a field by kind
 * + ids (not a getter/setter closure) keeps this trivial to store in state. */
export type ActiveField =
  | { kind: "summary" }
  | { kind: "skills" }
  | { kind: "experience-bullets"; entryId: string }
  | { kind: "optional-field"; sectionKey: OptionalSectionKey; entryId: string; fieldKey: string };

export function labelForField(content: ResumeContent, field: ActiveField): string {
  switch (field.kind) {
    case "summary":
      return "Summary";
    case "skills":
      return "Skills";
    case "experience-bullets": {
      const job = content.experience.find((j) => j.id === field.entryId);
      return job?.jobTitle ? `${job.jobTitle} bullets` : "Experience bullets";
    }
    case "optional-field":
      return `${optionalSectionMeta[field.sectionKey].label} description`;
  }
}

export function getFieldText(content: ResumeContent, field: ActiveField): string {
  switch (field.kind) {
    case "summary":
      return content.summary;
    case "skills":
      return content.skills.join("\n");
    case "experience-bullets": {
      const job = content.experience.find((j) => j.id === field.entryId);
      return job ? job.bullets.join("\n") : "";
    }
    case "optional-field": {
      const entries = content.optionalSections?.[field.sectionKey] as
        | Record<string, string | undefined>[]
        | undefined;
      const entry = entries?.find((e) => e.id === field.entryId);
      return entry?.[field.fieldKey] ?? "";
    }
  }
}

export function applyFieldText(content: ResumeContent, field: ActiveField, text: string): Partial<ResumeContent> {
  switch (field.kind) {
    case "summary":
      return { summary: text };
    case "skills":
      return { skills: text.split("\n") };
    case "experience-bullets":
      return {
        experience: content.experience.map((job) =>
          job.id === field.entryId ? { ...job, bullets: text.split("\n") } : job
        ),
      };
    case "optional-field": {
      const entries = (content.optionalSections?.[field.sectionKey] as
        | Record<string, string | undefined>[]
        | undefined) ?? [];
      return {
        optionalSections: {
          ...content.optionalSections,
          [field.sectionKey]: entries.map((entry) =>
            entry.id === field.entryId ? { ...entry, [field.fieldKey]: text } : entry
          ),
        },
      };
    }
  }
}
