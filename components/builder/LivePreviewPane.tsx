"use client";

import type { ResumeDraft } from "@/lib/resume/types";
import { templateComponents } from "@/components/resume-templates";
import { MultiPageCanvas } from "./MultiPageCanvas";

export function LivePreviewPane({ draft, zoom }: { draft: ResumeDraft; zoom: number }) {
  const Template = templateComponents[draft.templateKey];

  // 100% = fills this column edge to edge, not an arbitrary fixed width —
  // the column itself is already roughly half the builder.
  return (
    <div style={{ width: `${zoom}%` }}>
      <MultiPageCanvas>
        <Template content={draft} appearance={draft.appearance} />
      </MultiPageCanvas>
    </div>
  );
}
