export type TemplateKey =
  | "modern"
  | "professional"
  | "minimal"
  | "executive"
  | "international"
  | "compact"
  | "technical"
  | "academic"
  | "portfolio"
  | "bold"
  | "graduate";

export type ColorSlot = "accentColor" | "headerBg" | "linkColor";

export type ResumeAppearance = {
  accentColor: string;
  headerBg?: string;
  linkColor?: string;
  font: "inter" | "manrope" | "georgia" | "arial" | "calibri";
  fontSize: "small" | "medium" | "large";
  spacing: "compact" | "comfortable" | "spacious";
  layout?: "one-column" | "two-column";
  photoShape?: "circle" | "square";
  photoSize?: "small" | "medium" | "large";
  /** Continuous multiplier on top of fontSize/spacing, only ever set by
   * "Fit to one page" (never exposed as a manual control) — lets it grow
   * sparse content to fill a page beyond what the three discrete fontSize
   * steps alone can reach. 1 (or unset) = no extra scaling. */
  contentScale?: number;
};

export type ResumeExperience = {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  bullets: string[];
};

export type ResumeEducation = {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  gradYear: string;
  gpa?: string;
  coursework?: string;
  achievements?: string;
};

export type OptionalSections = {
  projects?: { id: string; name: string; description: string; link?: string }[];
  certifications?: { id: string; name: string; issuer: string; year?: string }[];
  languages?: { id: string; language: string; proficiency: string }[];
  awards?: { id: string; title: string; issuer?: string; year?: string }[];
  volunteer?: { id: string; role: string; organization: string; description?: string }[];
  publications?: { id: string; title: string; venue?: string; year?: string }[];
};

export type OptionalSectionKey = keyof OptionalSections;

/** The subset of a draft that every template renders. Used for live builder
 * previews and for the realistic marketplace/preview-page previews alike, so
 * there is exactly one shape templates need to know about. */
export type ResumeContent = {
  contact: {
    name: string;
    jobTitle?: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    portfolio?: string;
    photoDataUrl?: string;
  };
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: string[];
  optionalSections?: OptionalSections;
};

export type ResumeDraft = ResumeContent & {
  id: string;
  /** User-given label for this draft (e.g. "Product Designer — Google"),
   * distinct from contact.name — lets someone tell apart multiple tailored
   * resumes in My Resumes. Falls back to contact.name when unset. */
  title?: string;
  templateKey: TemplateKey;
  updatedAt: string;
  appearance: ResumeAppearance;
  /** Whether the background overflow watcher is allowed to auto-shrink text
   * to keep this resume on one page. Defaults to true (existing behavior)
   * when unset. Turning it off lets someone deliberately keep a larger,
   * more comfortable size and just let content flow onto a second page,
   * without the app fighting to compress it back down. */
  autoFitEnabled?: boolean;
  targeting: {
    targetRole?: string;
    jobDescription?: string;
  };
  targetingPromptShown: boolean;
  optionalSections: OptionalSections;
  jobMatch?: {
    score: number;
    /** How many recognizable skills the job description contained. 0 means
     * the score is meaningless (nothing to compare), not a real 0%. */
    totalKeywords?: number;
    matchedSkills: string[];
    missingSkills: string[];
    computedAt: string;
  };
};

export type TemplateStyle = "simple" | "modern" | "professional" | "creative";
export type TemplateFormat = "ats-friendly" | "one-page" | "two-column";
export type ExperienceLevel = "student" | "entry-level" | "experienced" | "executive";

export type TemplateMeta = {
  key: TemplateKey;
  name: string;
  tagline: string;
  description: string;
  atsFriendly: boolean;
  atsNote?: string;
  style: TemplateStyle;
  format: TemplateFormat[];
  experienceLevel: ExperienceLevel[];
  colorSlots: ColorSlot[];
  supportsLayoutToggle: boolean;
  supportsPhoto: boolean;
  /** Shown with a "Premium" badge — informational only for now (§pricing
   * page); nothing actually blocks using it until real entitlements exist. */
  premium: boolean;
  defaultAppearance: ResumeAppearance;
};
