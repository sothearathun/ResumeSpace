import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { ResumeAppearance, ResumeContent, ResumeDraft, TemplateKey } from "./types";
import { getTemplateMeta } from "@/components/resume-templates/catalog";

type ResumeRow = {
  id: string;
  title: string;
  template_key: string;
  target_role: string | null;
  job_description: string | null;
  content: ResumeContent;
  appearance: ResumeAppearance;
  auto_fit_enabled: boolean;
  updated_at: string;
};

function rowToDraft(row: ResumeRow): ResumeDraft {
  const content = row.content ?? {
    contact: { name: "", email: "" },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    optionalSections: {},
  };
  return {
    ...content,
    optionalSections: content.optionalSections ?? {},
    id: row.id,
    // Empty string means "unset" here (the column is NOT NULL) — falls back
    // to contact.name for display, same as when the field was never set.
    title: row.title || undefined,
    templateKey: row.template_key as TemplateKey,
    updatedAt: row.updated_at,
    appearance: row.appearance,
    autoFitEnabled: row.auto_fit_enabled,
    targeting: { targetRole: row.target_role ?? undefined, jobDescription: row.job_description ?? undefined },
    // The "want to tailor?" prompt this once gated was removed — every
    // remote draft behaves as if it was already shown.
    targetingPromptShown: true,
  };
}

function draftToRow(draft: ResumeDraft, userId: string) {
  const { id, title, templateKey, appearance, autoFitEnabled, targeting, updatedAt: _updatedAt, targetingPromptShown: _tps, jobMatch: _jm, ...content } = draft;
  void _updatedAt;
  void _tps;
  void _jm;
  return {
    id,
    user_id: userId,
    title: title ?? "",
    template_key: templateKey,
    target_role: targeting?.targetRole ?? null,
    job_description: targeting?.jobDescription ?? null,
    content: content satisfies ResumeContent,
    appearance,
    auto_fit_enabled: autoFitEnabled ?? true,
  };
}

async function client(): Promise<SupabaseClient> {
  return createClient();
}

export async function fetchRemoteDraft(id: string): Promise<ResumeDraft | null> {
  const supabase = await client();
  const { data, error } = await supabase.from("resumes").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return rowToDraft(data as ResumeRow);
}

export async function fetchRemoteDrafts(): Promise<ResumeDraft[]> {
  const supabase = await client();
  const { data, error } = await supabase.from("resumes").select("*").order("updated_at", { ascending: false });
  if (error || !data) return [];
  return (data as ResumeRow[]).map(rowToDraft);
}

export async function createRemoteDraft(
  userId: string,
  templateKey: TemplateKey,
  seed?: ResumeContent,
  targeting?: ResumeDraft["targeting"]
): Promise<ResumeDraft> {
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
    targetingPromptShown: true,
  };
  const supabase = await client();
  const { error } = await supabase.from("resumes").insert(draftToRow(draft, userId));
  if (error) throw error;
  return draft;
}

export async function upsertRemoteDraft(draft: ResumeDraft, userId: string): Promise<void> {
  const supabase = await client();
  const { error } = await supabase.from("resumes").upsert(draftToRow(draft, userId));
  if (error) throw error;
}

export async function deleteRemoteDraft(id: string): Promise<void> {
  const supabase = await client();
  const { error } = await supabase.from("resumes").delete().eq("id", id);
  if (error) throw error;
}

/** Uploads a locally-created draft into the signed-in user's account under
 * its existing id, but only if nothing with that id exists there yet — used
 * to migrate local drafts on sign-in without ever clobbering a remote edit. */
export async function migrateDraftIfAbsent(draft: ResumeDraft, userId: string): Promise<void> {
  const supabase = await client();
  await supabase.from("resumes").upsert(draftToRow(draft, userId), { onConflict: "id", ignoreDuplicates: true });
}
