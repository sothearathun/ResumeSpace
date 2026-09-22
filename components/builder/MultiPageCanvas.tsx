"use client";

import { useEffect, useRef, useState } from "react";
import { DOC_WIDTH } from "@/components/resume-templates/TemplateCanvas";

// A4 height at DOC_WIDTH (794px wide, 96dpi) — matches the aspect-[210/297]
// box TemplateCanvas uses for one page.
const PAGE_HEIGHT = Math.round((DOC_WIDTH * 297) / 210);

/** Every line of text's bottom edge, plus every childless ("leaf") element's
 * bottom edge, in the content's own unscaled coordinate space — the only
 * Y-coordinates a page break is allowed to land on. Cutting anywhere else
 * slices through the middle of a line of text, which shows as a clipped
 * sliver at the bottom of one page and then that same line again in full at
 * the top of the next — confusing, garbled-looking duplicate text. */
function collectSafeBreakPoints(root: HTMLElement): number[] {
  const rootTop = root.getBoundingClientRect().top;
  const points = new Set<number>();

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => (node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const rect of Array.from(range.getClientRects())) {
      if (rect.height > 0) points.add(Math.round(rect.bottom - rootTop));
    }
  }

  for (const el of Array.from(root.querySelectorAll<HTMLElement>("*"))) {
    if (el.children.length > 0) continue;
    const rect = el.getBoundingClientRect();
    if (rect.height > 0) points.add(Math.round(rect.bottom - rootTop));
  }

  return Array.from(points).sort((a, b) => a - b);
}

/** Walks forward in ~PAGE_HEIGHT increments, snapping each break back to the
 * nearest safe point so no page ever cuts through a line. Falls back to a
 * hard cut only when a single line/element is itself taller than one page. */
function computePageBreaks(totalHeight: number, safePoints: number[]): number[] {
  const breaks = [0];
  let cursor = 0;
  while (cursor < totalHeight - 1) {
    const target = cursor + PAGE_HEIGHT;
    if (target >= totalHeight) {
      breaks.push(totalHeight);
      break;
    }
    let candidate = -Infinity;
    for (const p of safePoints) {
      if (p > cursor && p <= target) candidate = Math.max(candidate, p);
    }
    if (!Number.isFinite(candidate)) candidate = target;
    breaks.push(candidate);
    cursor = candidate;
  }
  return breaks;
}

/** Same scaled-A4 rendering as TemplateCanvas, but for the builder's live
 * preview specifically: instead of clipping content to one page, it measures
 * the real rendered content and, once it runs past one page, renders it as
 * multiple separate A4 sheets — each a clipped, vertically-shifted view onto
 * the same flowing content, snapped to safe line boundaries (see above) so a
 * genuinely multi-page resume reads as an actual 2 (or 3, or 4)-page
 * document rather than a single tall box with a line drawn across it. */
export function MultiPageCanvas({ children }: { children: React.ReactNode }) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageBreaks, setPageBreaks] = useState<number[]>([0, PAGE_HEIGHT]);

  useEffect(() => {
    const node = measureRef.current;
    if (!node) return;
    const observer = new ResizeObserver(() => {
      const totalHeight = node.getBoundingClientRect().height;
      const safePoints = collectSafeBreakPoints(node);
      setPageBreaks(computePageBreaks(totalHeight, safePoints));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const pageCount = Math.max(1, pageBreaks.length - 1);

  return (
    <div className="flex flex-col items-stretch gap-5">
      {/* Off-screen, unclipped, un-transformed copy solely so we can measure
          real line positions — every visible page below is just a clipped
          window onto the same content. */}
      <div style={{ position: "relative", height: 0, overflow: "visible" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: DOC_WIDTH, visibility: "hidden" }}>
          <div ref={measureRef}>{children}</div>
        </div>
      </div>

      {Array.from({ length: pageCount }, (_, i) => {
        // A page break that snaps backward off the raw PAGE_HEIGHT boundary
        // (to avoid cutting through a line) means this page holds *less*
        // than a full page's worth of content — so its own clip window has
        // to shrink to match, or it would keep showing content all the way
        // to the old fixed boundary, duplicating whatever the next page
        // re-shows starting from the snapped-back point.
        const segmentHeight = pageBreaks[i + 1] - pageBreaks[i];
        return (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="@container relative aspect-[210/297] w-full overflow-hidden rounded-lg border border-border bg-white shadow-sm">
              <div
                className="absolute top-0 left-0 origin-top-left overflow-hidden"
                style={{
                  width: `${DOC_WIDTH}px`,
                  height: `${segmentHeight}px`,
                  transform: `scale(calc(100cqw / ${DOC_WIDTH}px))`,
                }}
              >
                <div style={{ marginTop: `${-pageBreaks[i]}px` }}>{children}</div>
              </div>
            </div>
            {pageCount > 1 && (
              <span className="self-center text-[11px] font-medium text-text-secondary">
                Page {i + 1} of {pageCount}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
