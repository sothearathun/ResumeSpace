import type { ResumeContent, ResumeDraft, TemplateKey } from "./types";
import { getTemplateMeta } from "@/components/resume-templates/catalog";

const STORAGE_KEY = "resumecraft:drafts";

type DraftMap = Record<string, ResumeDraft>;

function readAll(): DraftMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DraftMap) : {};
  } catch {
    return {};
  }
}

function writeAll(drafts: DraftMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function createDraft(
  templateKey: TemplateKey,
  seed?: ResumeContent,
  targeting?: ResumeDraft["targeting"]
): ResumeDraft {
  const meta = getTemplateMeta(templateKey);
  const content: ResumeContent = seed ?? {
    contact: { name: "", email: "" },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    optionalSections: {},
  };
  const draft: ResumeDraft = {
    ...content,
    optionalSections: content.optionalSections ?? {},
    id: crypto.randomUUID(),
    templateKey,
    updatedAt: new Date().toISOString(),
    appearance: meta?.defaultAppearance ?? {
      accentColor: "#2563eb",
      font: "inter",
      fontSize: "medium",
      spacing: "comfortable",
    },
    targeting: targeting ?? {},
    // A seeded draft already carries real content, so there's nothing to
    // gain by interrupting with the "want to tailor?" prompt again.
    targetingPromptShown: Boolean(seed),
  };
  const all = readAll();
  all[draft.id] = draft;
  writeAll(all);
  return draft;
}

export function getDraft(id: string): ResumeDraft | undefined {
  return readAll()[id];
}

export function saveDraft(draft: ResumeDraft) {
  const all = readAll();
  all[draft.id] = { ...draft, updatedAt: new Date().toISOString() };
  writeAll(all);
}

/** Whether a draft has anything worth showing in "My Resumes" — every
 * "Use template" click creates and immediately persists a blank draft so
 * the builder has something to load, so without this check, abandoning a
 * template before typing anything (or just previewing one) permanently
 * clutters the list with empty entries. */
function hasUsableContent(draft: ResumeDraft): boolean {
  const { contact, summary, experience, education, skills, optionalSections, title } = draft;
  if (title?.trim()) return true;
  if (
    contact.name?.trim() ||
    contact.email?.trim() ||
    contact.phone?.trim() ||
    contact.location?.trim() ||
    contact.photoDataUrl
  ) {
    return true;
  }
  if (summary?.trim()) return true;
  if (experience.some((job) => job.jobTitle?.trim() || job.company?.trim() || job.bullets.some((b) => b.trim()))) {
    return true;
  }
  if (education.some((edu) => edu.degree?.trim() || edu.institution?.trim())) return true;
  if (skills.some((s) => s.trim())) return true;
  if (Object.values(optionalSections ?? {}).some((entries) => (entries?.length ?? 0) > 0)) return true;
  return false;
}

/** All saved drafts with real content in them, most recently edited first —
 * backs the "My Resumes" page. Also prunes genuinely blank drafts out of
 * storage as a side effect, so abandoned templates don't accumulate forever
 * (see hasUsableContent above). Drafts saved before `updatedAt` existed
 * sort to the end. */
export function getAllDrafts(): ResumeDraft[] {
  const all = readAll();
  let changed = false;
  for (const [id, draft] of Object.entries(all)) {
    if (!hasUsableContent(draft)) {
      delete all[id];
      changed = true;
    }
  }

  // One resume per editing session: trying several templates for the same
  // person (each "Use template" click starts a fresh draft) shouldn't leave
  // one saved copy per template. Drafts for the same person and the same job
  // target collapse into the most recently edited one; tailored resumes for
  // different jobs stay separate.
  const newestFirst = Object.values(all).sort((a, b) =>
    (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")
  );
  const seen = new Set<string>();
  const kept: ResumeDraft[] = [];
  for (const draft of newestFirst) {
    const key = sessionKey(draft);
    if (seen.has(key)) {
      delete all[draft.id];
      changed = true;
      continue;
    }
    seen.add(key);
    kept.push(draft);
  }

  if (changed) writeAll(all);
  return kept;
}

function sessionKey(draft: ResumeDraft): string {
  const person =
    draft.contact.email?.trim().toLowerCase() || draft.contact.name?.trim().toLowerCase() || draft.id;
  const role = draft.targeting?.targetRole?.trim().toLowerCase() ?? "";
  const jd = draft.targeting?.jobDescription?.trim().slice(0, 200).toLowerCase() ?? "";
  return `${person}|${role}|${jd}`;
}

export function deleteDraft(id: string) {
  const all = readAll();
  delete all[id];
  writeAll(all);
}
