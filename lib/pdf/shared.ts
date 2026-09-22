import type { ResumeAppearance } from "@/lib/resume/types";

// react-pdf ships Helvetica/Helvetica-Bold built in (no font file to load,
// no network call at render time) — visually close enough to the web
// preview's Inter that it's not worth the complexity of registering a real
// font file for a first version.
export const PDF_FONT = "Helvetica";
export const PDF_FONT_BOLD = "Helvetica-Bold";

/** Matches the <Page> padding in renderResumePdf.tsx — templates with a
 * full-bleed header band use a negative margin of this size to reach the
 * page edge, so the two must stay in sync. */
export const PAGE_PADDING = 28;

const FONT_SIZE_PT: Record<ResumeAppearance["fontSize"], number> = {
  small: 9,
  medium: 10,
  large: 11,
};

const SECTION_GAP_PT: Record<ResumeAppearance["spacing"], number> = {
  compact: 10,
  comfortable: 14,
  spacious: 18,
};

const LINE_HEIGHT: Record<ResumeAppearance["spacing"], number> = {
  compact: 1.3,
  comfortable: 1.45,
  spacious: 1.6,
};

/** Same `contentScale` lever as appearanceStyle() (lib/resume/appearance.ts)
 * — only ever set by "Fit to one page" to grow sparse content beyond the
 * three discrete fontSize steps. 1 (or unset) = no extra scaling. */
export function pdfMetrics(appearance: ResumeAppearance) {
  const scale = appearance.contentScale ?? 1;
  return {
    fontSize: FONT_SIZE_PT[appearance.fontSize] * scale,
    sectionGap: SECTION_GAP_PT[appearance.spacing] * scale,
    lineHeight: LINE_HEIGHT[appearance.spacing],
    accent: appearance.accentColor,
    headerBg: appearance.headerBg ?? "#f7f7f8",
    link: appearance.linkColor ?? appearance.accentColor,
  };
}

export function contactLine(contact: {
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
}): string {
  return [contact.email, contact.phone, contact.location, contact.linkedin, contact.portfolio]
    .filter(Boolean)
    .join("   ·   ");
}

export function initials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  );
}
