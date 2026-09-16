import type { CSSProperties } from "react";
import type { ResumeAppearance } from "./types";

const FONT_SIZE_PX: Record<ResumeAppearance["fontSize"], number> = {
  small: 13,
  medium: 14.5,
  large: 16,
};

const SECTION_GAP_PX: Record<ResumeAppearance["spacing"], number> = {
  compact: 16,
  comfortable: 24,
  spacious: 32,
};

const LINE_HEIGHT: Record<ResumeAppearance["spacing"], number> = {
  compact: 1.4,
  comfortable: 1.55,
  spacious: 1.7,
};

/** Turns an appearance selection into CSS custom properties every template
 * root consumes — one place appearance maps to style, per §9 of the plan. */
export function appearanceStyle(appearance: ResumeAppearance): CSSProperties {
  return {
    "--accent": appearance.accentColor,
    "--header-bg": appearance.headerBg ?? "#f7f7f8",
    "--link": appearance.linkColor ?? appearance.accentColor,
    "--section-gap": `${SECTION_GAP_PX[appearance.spacing]}px`,
    fontSize: `${FONT_SIZE_PX[appearance.fontSize]}px`,
    lineHeight: LINE_HEIGHT[appearance.spacing],
  } as CSSProperties;
}
