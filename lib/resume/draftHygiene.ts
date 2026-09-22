import type { ResumeDraft } from "./types";

/** Whether a draft has anything worth showing in "My Resumes" — every
 * "Use template" click (and every visit to /builder while signed in)
 * creates and immediately persists a blank draft so the builder has
 * something to load, so without this check, abandoning a template before
 * typing anything permanently clutters the list with empty entries. */
export function hasUsableContent(draft: ResumeDraft): boolean {
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

function sessionKey(draft: ResumeDraft): string {
  const person =
    draft.contact.email?.trim().toLowerCase() || draft.contact.name?.trim().toLowerCase() || draft.id;
  const role = draft.targeting?.targetRole?.trim().toLowerCase() ?? "";
  const jd = draft.targeting?.jobDescription?.trim().slice(0, 200).toLowerCase() ?? "";
  return `${person}|${role}|${jd}`;
}

/** Prunes blank drafts and collapses one-resume-per-editing-session (trying
 * several templates for the same person/job target shouldn't leave one
 * saved copy per template) — the same hygiene rule for both local and
 * account storage, so "My Resumes" behaves the same regardless of where a
 * draft lives. Returns the drafts worth keeping, newest first, plus the ids
 * of everything that should be deleted from storage. */
export function dedupeDrafts(drafts: ResumeDraft[]): { kept: ResumeDraft[]; removedIds: string[] } {
  const removedIds: string[] = [];
  const usable = drafts.filter((d) => {
    if (hasUsableContent(d)) return true;
    removedIds.push(d.id);
    return false;
  });

  const newestFirst = [...usable].sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
  const seen = new Set<string>();
  const kept: ResumeDraft[] = [];
  for (const draft of newestFirst) {
    const key = sessionKey(draft);
    if (seen.has(key)) {
      removedIds.push(draft.id);
      continue;
    }
    seen.add(key);
    kept.push(draft);
  }

  return { kept, removedIds };
}
