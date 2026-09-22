"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { ResumeDraft } from "@/lib/resume/types";
import { getAllDrafts, deleteDraft, saveDraft } from "@/lib/resume/store";
import { getMasterResume, hasUsableMasterResume } from "@/lib/resume/masterResumeStore";
import { getTemplateMeta } from "@/components/resume-templates/catalog";
import { downloadResumePdf } from "@/lib/pdf/downloadPdf";
import { InlineEditableTitle } from "@/components/builder/InlineEditableTitle";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

function formatDate(iso: string | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function MyResumesShell() {
  const [drafts, setDrafts] = useState<ResumeDraft[]>(() => getAllDrafts());
  const masterResume = getMasterResume();
  const masterResumeUsable = hasUsableMasterResume();

  const [pendingDelete, setPendingDelete] = useState<ResumeDraft | null>(null);

  function confirmDelete() {
    if (!pendingDelete) return;
    deleteDraft(pendingDelete.id);
    setDrafts(getAllDrafts());
    setPendingDelete(null);
  }

  function handleRename(draft: ResumeDraft, title: string) {
    saveDraft({ ...draft, title });
    setDrafts(getAllDrafts());
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <section className="mx-auto w-full max-w-[1280px] px-4 pt-14 pb-24 sm:px-6 lg:px-10">
        <h1 className="text-[32px] font-semibold tracking-tight sm:text-[36px]">My Resumes</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
          Your master resume and every tailored version you&rsquo;ve built.
        </p>

        <h2 className="mt-10 text-[15px] font-medium text-text-primary">Master Resume</h2>
        <div className="mt-4 flex flex-col gap-3 rounded-lg border border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          {masterResumeUsable && masterResume ? (
            <div>
              <p className="text-[14px] font-medium text-text-primary">{masterResume.content.contact.name}</p>
              <p className="mt-1 text-[13px] text-text-secondary">
                {masterResume.content.experience.length} position
                {masterResume.content.experience.length === 1 ? "" : "s"} ·{" "}
                {masterResume.content.skills.length} skill{masterResume.content.skills.length === 1 ? "" : "s"}
              </p>
            </div>
          ) : (
            <p className="text-[14px] text-text-secondary">
              Fill in your full work history once, then generate tailored resumes from it.
            </p>
          )}
          <Link
            href="/master-resume"
            className="shrink-0 rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-text-primary transition-colors hover:bg-bg-secondary"
          >
            {masterResumeUsable ? "Edit master resume" : "Start master resume"}
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-between">
          <h2 className="text-[15px] font-medium text-text-primary">
            Resumes {drafts.length > 0 && `(${drafts.length})`}
          </h2>
          <Link
            href="/builder"
            className="text-[13px] font-medium text-accent hover:text-accent-hover"
          >
            + New resume
          </Link>
        </div>

        {drafts.length === 0 ? (
          <div className="mt-4 flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-16 text-center">
            <p className="text-[14px] text-text-secondary">You haven&rsquo;t built a resume yet.</p>
            <Link
              href="/#templates"
              className="rounded-lg bg-accent px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Browse templates
            </Link>
          </div>
        ) : (
          <div className="mt-4 flex flex-col divide-y divide-border rounded-lg border border-border">
            {drafts.map((draft) => (
              <ResumeCard
                key={draft.id}
                draft={draft}
                onDelete={() => setPendingDelete(draft)}
                onRename={(title) => handleRename(draft, title)}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this resume?"
        message={`"${pendingDelete?.title || pendingDelete?.contact.name || "Untitled resume"}" will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function ResumeCard({
  draft,
  onDelete,
  onRename,
}: {
  draft: ResumeDraft;
  onDelete: () => void;
  onRename: (title: string) => void;
}) {
  const [downloading, setDownloading] = useState(false);
  const meta = getTemplateMeta(draft.templateKey);

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadResumePdf(draft);
    } catch {
      // Same fire-and-forget error handling as the builder's own download
      // button — a toast/inline-error system would be the next step.
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <InlineEditableTitle
          value={draft.title ?? ""}
          placeholder={draft.contact.name || "Untitled resume"}
          onChange={onRename}
          className="text-[14px] font-medium text-text-primary"
        />
        <p className="mt-0.5 text-[12px] text-text-secondary">
          {meta?.name ?? draft.templateKey} · Edited {formatDate(draft.updatedAt)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4 text-[13px]">
        <Link href={`/builder/${draft.id}`} className="font-medium text-accent hover:text-accent-hover">
          Continue editing
        </Link>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="font-medium text-text-secondary hover:text-text-primary disabled:opacity-50"
        >
          {downloading ? "Preparing…" : "Download PDF"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="font-medium text-text-secondary hover:text-error"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
