"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { OptionalSectionKey, OptionalSections } from "@/lib/resume/types";
import { optionalSectionMeta } from "@/lib/resume/optional-sections";

export type CoreSectionKey = "contact" | "summary" | "experience" | "education" | "skills";
export type SectionKey = CoreSectionKey | OptionalSectionKey;

const coreSections: { key: CoreSectionKey; label: string }[] = [
  { key: "contact", label: "Contact" },
  { key: "summary", label: "Summary" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
];

export function SectionsNav({
  active,
  onSelect,
  optionalSections,
  onAddSection,
}: {
  active: SectionKey;
  onSelect: (key: SectionKey) => void;
  optionalSections: OptionalSections;
  onAddSection: (key: OptionalSectionKey) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const addedKeys = (Object.keys(optionalSections) as OptionalSectionKey[]).filter(
    (key) => optionalSections[key] !== undefined
  );
  const availableToAdd = (Object.keys(optionalSectionMeta) as OptionalSectionKey[]).filter(
    (key) => !addedKeys.includes(key)
  );

  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {coreSections.map((section) => (
        <NavItem
          key={section.key}
          label={section.label}
          active={active === section.key}
          onClick={() => onSelect(section.key)}
        />
      ))}

      {addedKeys.map((key) => (
        <NavItem
          key={key}
          label={optionalSectionMeta[key].label}
          active={active === key}
          onClick={() => onSelect(key)}
        />
      ))}

      {availableToAdd.length > 0 && (
        <div className="relative mt-2">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex w-full items-center gap-1.5 rounded-md px-3 py-2 text-left text-[13px] text-text-secondary transition-colors hover:text-text-primary"
          >
            <Plus size={14} />
            Add section
          </button>
          {menuOpen && (
            <div className="absolute top-full left-0 z-10 mt-1 w-48 rounded-lg border border-border bg-white py-1 shadow-sm">
              {availableToAdd.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onAddSection(key);
                    setMenuOpen(false);
                  }}
                  className="block w-full px-3 py-1.5 text-left text-[13px] text-text-primary hover:bg-bg-secondary"
                >
                  {optionalSectionMeta[key].label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function NavItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border-l-2 px-3 py-2 text-left text-[13px] transition-colors ${
        active
          ? "border-accent font-medium text-text-primary"
          : "border-transparent text-text-secondary hover:text-text-primary"
      }`}
    >
      {label}
    </button>
  );
}
