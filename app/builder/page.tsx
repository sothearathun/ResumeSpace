"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { createDraft } from "@/lib/resume/store";
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
    const draft = createDraft(templateKey);
    router.replace(`/builder/${draft.id}`);
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
