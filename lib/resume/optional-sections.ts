import type { OptionalSectionKey, OptionalSections } from "./types";

export const optionalSectionMeta: Record<
  OptionalSectionKey,
  { label: string; fields: { key: string; label: string; multiline?: boolean }[] }
> = {
  projects: {
    label: "Projects",
    fields: [
      { key: "name", label: "Project name" },
      { key: "description", label: "Description", multiline: true },
      { key: "link", label: "Link" },
    ],
  },
  certifications: {
    label: "Certifications",
    fields: [
      { key: "name", label: "Certification" },
      { key: "issuer", label: "Issuer" },
      { key: "year", label: "Year" },
    ],
  },
  languages: {
    label: "Languages",
    fields: [
      { key: "language", label: "Language" },
      { key: "proficiency", label: "Proficiency" },
    ],
  },
  awards: {
    label: "Awards",
    fields: [
      { key: "title", label: "Award" },
      { key: "issuer", label: "Issuer" },
      { key: "year", label: "Year" },
    ],
  },
  volunteer: {
    label: "Volunteer Experience",
    fields: [
      { key: "role", label: "Role" },
      { key: "organization", label: "Organization" },
      { key: "description", label: "Description", multiline: true },
    ],
  },
  publications: {
    label: "Publications",
    fields: [
      { key: "title", label: "Title" },
      { key: "venue", label: "Venue" },
      { key: "year", label: "Year" },
    ],
  },
};

function formatEntry(key: OptionalSectionKey, entry: Record<string, string | undefined>): string {
  switch (key) {
    case "projects":
      return [entry.name, entry.description].filter(Boolean).join(" — ");
    case "certifications":
      return [entry.name, entry.issuer, entry.year && `(${entry.year})`].filter(Boolean).join(", ");
    case "languages":
      return [entry.language, entry.proficiency].filter(Boolean).join(" — ");
    case "awards":
      return [entry.title, entry.issuer, entry.year && `(${entry.year})`].filter(Boolean).join(", ");
    case "volunteer":
      return [entry.role, entry.organization, entry.description].filter(Boolean).join(" — ");
    case "publications":
      return [entry.title, entry.venue, entry.year && `(${entry.year})`].filter(Boolean).join(", ");
  }
}

/** Turns whichever optional sections a draft has into simple {title, lines}
 * blocks every template can render the same way, without each template
 * needing to know the shape of all six optional section types. */
export function optionalSectionsToBlocks(
  optionalSections: OptionalSections | undefined
): { key: OptionalSectionKey; title: string; lines: string[] }[] {
  if (!optionalSections) return [];
  return (Object.keys(optionalSectionMeta) as OptionalSectionKey[])
    .filter((key) => (optionalSections[key]?.length ?? 0) > 0)
    .map((key) => ({
      key,
      title: optionalSectionMeta[key].label,
      lines: (optionalSections[key] as Record<string, string | undefined>[]).map((entry) =>
        formatEntry(key, entry)
      ),
    }));
}
