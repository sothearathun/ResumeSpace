"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { ResumeDraft } from "@/lib/resume/types";
import { TemplateCanvas } from "@/components/resume-templates/TemplateCanvas";
import { templateComponents } from "@/components/resume-templates";

const BASE_WIDTH = 520;
const MIN_ZOOM = 60;
const MAX_ZOOM = 140;

export function LivePreviewPane({ draft }: { draft: ResumeDraft }) {
  const [zoom, setZoom] = useState(100);
  const Template = templateComponents[draft.templateKey];

  return (
    <div className="flex flex-col items-center gap-4">
      <div style={{ width: `${(BASE_WIDTH * zoom) / 100}px` }}>
        <TemplateCanvas>
          <Template content={draft} appearance={draft.appearance} />
        </TemplateCanvas>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-white px-2 py-1">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 10))}
          className="rounded p-1 text-text-secondary hover:text-text-primary"
          aria-label="Zoom out"
        >
          <Minus size={14} />
        </button>
        <span className="w-10 text-center text-[12px] tabular-nums text-text-secondary">
          {zoom}%
        </span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 10))}
          className="rounded p-1 text-text-secondary hover:text-text-primary"
          aria-label="Zoom in"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
