import { TemplatePreviewLazy } from "@/components/resume-templates/TemplatePreviewLazy";

// Three real templates fanned out and gently floating — shows what the
// product makes, instead of describing it.
const cards = [
  { key: "minimal", className: "left-0 top-16 w-[54%] -rotate-6", delay: "0.15s", floatDelay: "0s" },
  { key: "executive", className: "right-0 top-4 w-[54%] rotate-6", delay: "0.3s", floatDelay: "1.4s" },
  { key: "modern", className: "left-[22%] top-0 z-10 w-[58%]", delay: "0.45s", floatDelay: "0.7s" },
] as const;

export function HeroVisual() {
  return (
    <div className="relative mx-auto h-[380px] w-full max-w-[520px] sm:h-[500px]" aria-hidden="true">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`absolute ${card.className} animate-fade-up`}
          style={{ animationDelay: card.delay }}
        >
          <div className="animate-float" style={{ animationDelay: card.floatDelay }}>
            <div className="overflow-hidden rounded-lg shadow-2xl shadow-blue-900/15 ring-1 ring-black/5">
              <TemplatePreviewLazy templateKey={card.key} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
