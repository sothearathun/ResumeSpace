import type { ResumeContent } from "./types";

const STORAGE_KEY = "resumecraft:masterResume";

export type MasterResumeRecord = {
  content: ResumeContent;
  photoShape?: "circle" | "square";
};

function emptyContent(): ResumeContent {
  return {
    contact: { name: "", email: "" },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    optionalSections: {},
  };
}

export function getMasterResume(): MasterResumeRecord | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MasterResumeRecord) : undefined;
  } catch {
    return undefined;
  }
}

export function saveMasterResume(record: MasterResumeRecord) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export function getOrCreateMasterResume(): MasterResumeRecord {
  return getMasterResume() ?? { content: emptyContent() };
}

/** Whether there's enough in the master resume to be worth tailoring from —
 * an empty shell shouldn't be offered as a starting point. */
export function hasUsableMasterResume(): boolean {
  const record = getMasterResume();
  if (!record) return false;
  const { contact, experience, skills } = record.content;
  return Boolean(contact.name) && (experience.length > 0 || skills.length > 0);
}
