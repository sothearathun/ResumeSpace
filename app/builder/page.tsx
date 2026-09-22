"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { startDraft } from "@/lib/resume/resumeService";
import { getTemplateMeta } from "@/components/resume-templates/catalog";
import type { TemplateKey } from "@/lib/resume/types";

const DEFAULT_TEMPLATE: TemplateKey = "minimal";

function RedirectToNewDraft() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Guards against React Strict Mode's dev-only double effect invocation,
  // which would otherwise create two orphaned drafts for one "Use template" click.
  const hasCreatedDraft = useRef(false);

  useEffect(() => {
    if (hasCreatedDraft.current) return;
    hasCreatedDraft.current = true;
    const requested = searchParams.get("template");
    const templateKey = (getTemplateMeta(requested ?? "")?.key ?? DEFAULT_TEMPLATE) as TemplateKey;
    // Signed in -> saved straight to their account; signed out -> this
    // browser's localStorage, same as before (see resumeService).
    startDraft(templateKey).then((draft) => router.replace(`/builder/${draft.id}`));
  }, [router, searchParams]);

  return null;
}

export default function BuilderEntryPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center">
        <p className="text-[14px] text-text-secondary">Setting up your resume…</p>
      </div>
      <Suspense>
        <RedirectToNewDraft />
      </Suspense>
    </div>
  );
}
