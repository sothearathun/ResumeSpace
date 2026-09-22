import type { CSSProperties } from "react";
import type { ResumeAppearance } from "./types";

// Derived from lib/pdf/shared.ts's FONT_SIZE_PT/SECTION_GAP_PT via the
// standard 1pt = 1.3333px (96 CSS dpi) conversion, instead of separately
// "eyeballed" px values — those used to run noticeably bigger than their PDF
// counterparts at every tier, so a resume that had *just* shrunk to fit one
// real PDF page (per "Fit to one page" / the auto-fit watcher) could still
// visibly overflow to a second page here, even though the download was
// already correct.
const PT_TO_PX = 1.3333;
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
const FONT_SIZE_PX: Record<ResumeAppearance["fontSize"], number> = {
  small: FONT_SIZE_PT.small * PT_TO_PX,
  medium: FONT_SIZE_PT.medium * PT_TO_PX,
  large: FONT_SIZE_PT.large * PT_TO_PX,
};

const SECTION_GAP_PX: Record<ResumeAppearance["spacing"], number> = {
  compact: SECTION_GAP_PT.compact * PT_TO_PX,
  comfortable: SECTION_GAP_PT.comfortable * PT_TO_PX,
  spacious: SECTION_GAP_PT.spacious * PT_TO_PX,
};

// Matches lib/pdf/shared.ts's LINE_HEIGHT exactly — these two used to drift
// (DOM ran 0.1 higher at every tier), which was invisible at normal sizes
// but meant the live preview could visibly clip content that the actual
// PDF still fit on one page, most noticeably right at "Fit to one page"'s
// boundary.
const LINE_HEIGHT: Record<ResumeAppearance["spacing"], number> = {
  compact: 1.3,
  comfortable: 1.45,
  spacious: 1.6,
};

// Each template already picks a sensible base avatar size for its own
// layout (a sidebar photo can afford to be bigger than an inline one next
// to a name) — this scales relative to that base instead of a single
// absolute pixel value, so "large" can't blow out a template that was
// designed for a small photo.
const PHOTO_SIZE_SCALE: Record<NonNullable<ResumeAppearance["photoSize"]>, number> = {
  small: 0.9,
  medium: 1.15,
  large: 1.5,
};

export function scaledAvatarSize(baseSize: number, photoSize: ResumeAppearance["photoSize"]): number {
  return Math.round(baseSize * PHOTO_SIZE_SCALE[photoSize ?? "medium"]);
}

/** Turns an appearance selection into CSS custom properties every template
 * root consumes — one place appearance maps to style, per §9 of the plan.
 * Since templates size most text in `em` off this root `fontSize`, scaling
 * it (and the section gap) by `contentScale` proportionally grows the whole
 * document — the lever "Fit to one page" uses to fill a page beyond what
 * the three fontSize steps alone allow. */
export function appearanceStyle(appearance: ResumeAppearance): CSSProperties {
  const scale = appearance.contentScale ?? 1;
  return {
    "--accent": appearance.accentColor,
    "--header-bg": appearance.headerBg ?? "#f7f7f8",
    "--link": appearance.linkColor ?? appearance.accentColor,
    "--section-gap": `${SECTION_GAP_PX[appearance.spacing] * scale}px`,
    fontSize: `${FONT_SIZE_PX[appearance.fontSize] * scale}px`,
    lineHeight: LINE_HEIGHT[appearance.spacing],
  } as CSSProperties;
}
