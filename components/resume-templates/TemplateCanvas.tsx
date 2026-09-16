const DOC_WIDTH = 794; // A4 at 96dpi

/** Scales a fixed-width A4 document down (or up) to fill whatever container
 * it's placed in, purely with CSS container query units — used for the
 * marketplace card thumbnail, the full `/templates/[slug]` preview, and the
 * builder's live preview alike, so all three stay pixel-consistent with the
 * PDF's A4 layout (§7, §10 of the implementation plan). */
export function TemplateCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="@container relative aspect-[210/297] w-full overflow-hidden rounded-lg border border-border bg-white">
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: `${DOC_WIDTH}px`,
          transform: `scale(calc(100cqw / ${DOC_WIDTH}px))`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export { DOC_WIDTH };
