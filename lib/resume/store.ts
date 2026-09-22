import type { ResumeContent, ResumeDraft, TemplateKey } from "./types";
import { getTemplateMeta } from "@/components/resume-templates/catalog";
import { dedupeDrafts } from "./draftHygiene";

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

/** All saved drafts with real content in them, most recently edited first —
 * backs the "My Resumes" page. Also prunes blank/duplicate-session drafts
 * out of storage as a side effect (see dedupeDrafts), so abandoned
 * templates don't accumulate forever. */
export function getAllDrafts(): ResumeDraft[] {
  const all = readAll();
  const { kept, removedIds } = dedupeDrafts(Object.values(all));
  if (removedIds.length > 0) {
    for (const id of removedIds) delete all[id];
    writeAll(all);
  }
  return kept;
}

export function deleteDraft(id: string) {
  const all = readAll();
  delete all[id];
  writeAll(all);
}
