import { createClient } from "@/lib/supabase/client";
import type { ResumeContent } from "./types";
import type { MasterResumeRecord } from "./masterResumeStore";

type MasterResumeRow = {
  content: ResumeContent;
  photo_shape: "circle" | "square" | null;
  photo_size: "small" | "medium" | "large" | null;
};

function rowToRecord(row: MasterResumeRow): MasterResumeRecord {
  return {
    content: row.content,
    photoShape: row.photo_shape ?? undefined,
    photoSize: row.photo_size ?? undefined,
  };
}

export async function fetchRemoteMasterResume(): Promise<MasterResumeRecord | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase.from("master_resumes").select("*").maybeSingle();
  if (error || !data) return undefined;
  return rowToRecord(data as MasterResumeRow);
}

export async function saveRemoteMasterResume(userId: string, record: MasterResumeRecord): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("master_resumes").upsert(
    {
      user_id: userId,
      content: record.content,
      photo_shape: record.photoShape ?? null,
      photo_size: record.photoSize ?? null,
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}

/** Uploads a locally-built master resume on sign-in, but only if the
 * account doesn't already have one — never overwrites an existing remote
 * master resume with a stale local copy. */
export async function migrateMasterResumeIfAbsent(userId: string, record: MasterResumeRecord): Promise<void> {
  const supabase = createClient();
  const { data } = await supabase.from("master_resumes").select("id").eq("user_id", userId).maybeSingle();
  if (data) return;
  await saveRemoteMasterResume(userId, record);
}
