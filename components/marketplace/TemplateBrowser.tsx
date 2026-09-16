"use client";

import { useMemo, useState } from "react";
import type { ExperienceLevel, TemplateFormat, TemplateMeta, TemplateStyle } from "@/lib/resume/types";
import { TemplateGrid } from "./TemplateGrid";

const styleOptions: { value: TemplateStyle | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "simple", label: "Simple" },
  { value: "modern", label: "Modern" },
  { value: "professional", label: "Professional" },
  { value: "creative", label: "Creative" },
];

const formatOptions: { value: TemplateFormat; label: string }[] = [
  { value: "ats-friendly", label: "ATS-friendly" },
  { value: "one-page", label: "One page" },
  { value: "two-column", label: "Two column" },
];

const experienceOptions: { value: ExperienceLevel; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "entry-level", label: "Entry level" },
  { value: "experienced", label: "Experienced" },
  { value: "executive", label: "Executive" },
];

export function TemplateBrowser({ templates }: { templates: TemplateMeta[] }) {
  const [style, setStyle] = useState<TemplateStyle | "all">("all");
  const [formats, setFormats] = useState<Set<TemplateFormat>>(new Set());
  const [levels, setLevels] = useState<Set<ExperienceLevel>>(new Set());

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      if (style !== "all" && t.style !== style) return false;
      if (formats.size > 0 && ![...formats].some((f) => t.format.includes(f))) return false;
      if (levels.size > 0 && ![...levels].some((l) => t.experienceLevel.includes(l))) return false;
      return true;
    });
  }, [templates, style, formats, levels]);

  function toggle<T>(set: Set<T>, value: T, setter: (s: Set<T>) => void) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1 border-b border-border">
          {styleOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStyle(opt.value)}
              className={`border-b-2 px-3 py-2.5 text-[13px] font-medium transition-colors ${
                style === opt.value
                  ? "border-accent text-text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <FilterGroup label="Format">
            {formatOptions.map((opt) => (
              <FilterChip
                key={opt.value}
                active={formats.has(opt.value)}
                onClick={() => toggle(formats, opt.value, setFormats)}
              >
                {opt.label}
              </FilterChip>
            ))}
          </FilterGroup>

          <FilterGroup label="Experience">
            {experienceOptions.map((opt) => (
              <FilterChip
                key={opt.value}
                active={levels.has(opt.value)}
                onClick={() => toggle(levels, opt.value, setLevels)}
              >
                {opt.label}
              </FilterChip>
            ))}
          </FilterGroup>
        </div>
      </div>

      <TemplateGrid templates={filtered} />
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] text-text-secondary">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md border px-2.5 py-1 text-[12px] transition-colors ${
        active
          ? "border-accent bg-accent/5 text-accent"
          : "border-border text-text-secondary hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  );
}
