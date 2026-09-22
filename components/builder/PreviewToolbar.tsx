"use client";

import { useState } from "react";
import { Download, Maximize2, Minus, Plus, Undo2 } from "lucide-react";
import type { ResumeDraft } from "@/lib/resume/types";
import { downloadResumePdf } from "@/lib/pdf/downloadPdf";
import { SegmentedControl } from "./SegmentedControl";

export const MIN_ZOOM = 60;
export const MAX_ZOOM = 140;

const iconButton = "rounded p-1 text-text-secondary hover:text-text-primary";

export function PreviewToolbar({
  draft,
  saveStatus,
  zoom,
  onZoomChange,
  fitMessage,
  canUndoFit,
  onRunFit,
  onUndoFit,
  autoFitEnabled,
  onToggleAutoFit,
}: {
  draft: ResumeDraft;
  saveStatus: "saved" | "saving";
  zoom: number;
  onZoomChange: (zoom: number) => void;
  fitMessage: string | null;
  canUndoFit: boolean;
  onRunFit: () => Promise<void>;
  onUndoFit: () => void;
  autoFitEnabled: boolean;
  onToggleAutoFit: (enabled: boolean) => void;
}) {
  const [downloading, setDownloading] = useState(false);
  const [fitting, setFitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setDownloading(true);
    setError(null);
    try {
      await downloadResumePdf(draft);
    } catch {
      setError("Couldn't generate the PDF — try again.");
    } finally {
      setDownloading(false);
    }
  }

  async function handleFit() {
    setFitting(true);
    try {
      await onRunFit();
    } finally {
      setFitting(false);
    }
  }

  const note = error ?? fitMessage;

  return (
    <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1.5">
      {note && (
        <span
          className={`flex items-center gap-1.5 text-[12px] ${error ? "text-error" : "text-text-secondary"}`}
        >
          {note}
        </span>
      )}

      <span className="text-[12px] text-text-secondary">
        {saveStatus === "saving" ? "Saving…" : "Saved"}
      </span>

      <div className="flex items-center rounded-md border border-border bg-white px-1 py-0.5">
        <button
          type="button"
          onClick={() => onZoomChange(Math.max(MIN_ZOOM, zoom - 10))}
          className={iconButton}
          aria-label="Zoom out"
        >
          <Minus size={12} />
        </button>
        <span className="w-9 text-center text-[12px] tabular-nums text-text-secondary">{zoom}%</span>
        <button
          type="button"
          onClick={() => onZoomChange(Math.min(MAX_ZOOM, zoom + 10))}
          className={iconButton}
          aria-label="Zoom in"
        >
          <Plus size={12} />
        </button>
      </div>

      <SegmentedControl
        size="sm"
        value={autoFitEnabled ? "fit" : "flow"}
        onChange={(value) => onToggleAutoFit(value === "fit")}
        options={[
          { value: "fit", label: "One page" },
          { value: "flow", label: "Multi-page" },
        ]}
      />

      <div className="inline-flex overflow-hidden rounded-md border border-border bg-white">
        <button
          type="button"
          onClick={handleFit}
          disabled={fitting}
          className="flex items-center gap-1 px-2 py-1 text-[12px] font-medium text-text-primary transition-colors hover:bg-bg-secondary disabled:opacity-60"
        >
          <Maximize2 size={12} />
          {fitting ? "Fitting…" : "Fit to one page"}
        </button>
        <button
          type="button"
          onClick={onUndoFit}
          disabled={!canUndoFit}
          className="flex items-center gap-1 border-l border-border px-2 py-1 text-[12px] font-medium text-text-primary transition-colors hover:bg-bg-secondary disabled:cursor-not-allowed disabled:text-text-secondary disabled:opacity-50 disabled:hover:bg-white"
        >
          <Undo2 size={12} />
          Undo
        </button>
      </div>

      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="flex items-center gap-1 rounded-md bg-accent px-2.5 py-1 text-[12px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        <Download size={12} />
        {downloading ? "Preparing…" : "Download PDF"}
      </button>
    </div>
  );
}
