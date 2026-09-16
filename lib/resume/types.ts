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
  templateKey: TemplateKey;
  appearance: ResumeAppearance;
  targeting: {
    targetRole?: string;
    jobDescription?: string;
  };
  targetingPromptShown: boolean;
  optionalSections: OptionalSections;
  jobMatch?: {
    score: number;
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
  defaultAppearance: ResumeAppearance;
};
