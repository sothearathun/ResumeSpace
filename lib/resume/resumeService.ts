import { createClient } from "@/lib/supabase/client";
import type { ResumeContent, ResumeDraft, TemplateKey } from "./types";
import {
  createDraft as createLocalDraft,
  getDraft as getLocalDraft,
  saveDraft as saveLocalDraft,
  getAllDrafts as getAllLocalDrafts,
  deleteDraft as deleteLocalDraft,
} from "./store";
import {
  fetchRemoteDraft,
  fetchRemoteDrafts,
  createRemoteDraft,
  upsertRemoteDraft,
  deleteRemoteDraft,
  migrateDraftIfAbsent,
} from "./remoteStore";
import { dedupeDrafts } from "./draftHygiene";
import {
  getMasterResume as getLocalMasterResume,
  hasUsableMasterResume,
  type MasterResumeRecord,
} from "./masterResumeStore";
import {
  fetchRemoteMasterResume,
  saveRemoteMasterResume,
  migrateMasterResumeIfAbsent,
} from "./remoteMasterResumeStore";

/** Single source of truth for "where does this resume live": a signed-in
 * user's resumes and master resume live in their Supabase account; a
 * signed-out visitor's live in this browser's localStorage so they can
 * still build and download a resume without an account. */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// ── Resumes ─────────────────────────────────────────────────────────────

export async function loadDraft(id: string): Promise<ResumeDraft | null> {
  const userId = await getCurrentUserId();
  if (!userId) return getLocalDraft(id) ?? null;

  const remote = await fetchRemoteDraft(id);
  if (remote) return remote;

  // Not found remotely yet — could be a local draft from just before sign-in
  // that the background migration (see migrateLocalDataToAccount) hasn't
  // reached. Fall back to local and migrate this one draft immediately
  // rather than losing it.
  const local = getLocalDraft(id);
  if (local) {
    await migrateDraftIfAbsent(local, userId);
    return local;
  }
  return null;
}

export async function loadAllDrafts(): Promise<ResumeDraft[]> {
  const userId = await getCurrentUserId();
  if (!userId) return getAllLocalDrafts();

  // Same hygiene as the local path (see draftHygiene): every visit to
  // /builder while signed in creates a row immediately, so without this,
  // abandoned/blank drafts and repeat "tried another template" drafts would
  // accumulate in the account forever — this is what actually deletes them,
  // not just hides them client-side.
  const remote = await fetchRemoteDrafts();
  const { kept, removedIds } = dedupeDrafts(remote);
  if (removedIds.length > 0) {
    await Promise.all(removedIds.map((id) => deleteRemoteDraft(id)));
  }
  return kept;
}

export async function startDraft(
  templateKey: TemplateKey,
  seed?: ResumeContent,
  targeting?: ResumeDraft["targeting"]
): Promise<ResumeDraft> {
  const userId = await getCurrentUserId();
  return userId ? createRemoteDraft(userId, templateKey, seed, targeting) : createLocalDraft(templateKey, seed, targeting);
}

export async function persistDraft(draft: ResumeDraft): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await upsertRemoteDraft(draft, userId);
    return;
  }
  saveLocalDraft(draft);
}

export async function removeDraft(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await deleteRemoteDraft(id);
    return;
  }
  deleteLocalDraft(id);
}

// ── Master resume ───────────────────────────────────────────────────────
// Account-only: there's no local fallback, since the master resume is only
// useful as a durable, cross-device document (see MasterResumeShell's
// sign-in gate).

export async function loadMasterResume(): Promise<MasterResumeRecord | undefined> {
  return fetchRemoteMasterResume();
}

export async function persistMasterResume(userId: string, record: MasterResumeRecord): Promise<void> {
  await saveRemoteMasterResume(userId, record);
}

// ── Migration on sign-in ───────────────────────────────────────────────

const MIGRATED_FLAG_PREFIX = "resumecraft:migratedToAccount:";

/** Uploads whatever this browser built anonymously into the account that
 * just signed in — once per (browser, account) pair. Never overwrites data
 * already in the account (see migrateDraftIfAbsent / migrateMasterResumeIfAbsent),
 * so it's safe to call this more than once. */
export async function migrateLocalDataToAccount(userId: string): Promise<void> {
  if (typeof window === "undefined") return;
  const flagKey = `${MIGRATED_FLAG_PREFIX}${userId}`;
  if (window.localStorage.getItem(flagKey)) return;

  try {
    for (const draft of getAllLocalDrafts()) {
      await migrateDraftIfAbsent(draft, userId);
    }
    if (hasUsableMasterResume()) {
      const record = getLocalMasterResume();
      if (record) await migrateMasterResumeIfAbsent(userId, record);
    }
  } finally {
    // Mark done even if a single item failed partway — this is a best-effort
    // convenience migration, not a guarantee, and retrying on every future
    // sign-in would just keep re-uploading the same handful of items.
    window.localStorage.setItem(flagKey, "1");
  }
}
