"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import type { OptionalSectionKey, ResumeDraft } from "@/lib/resume/types";
import { getDraft, saveDraft } from "@/lib/resume/store";
import { getTemplateMeta } from "@/components/resume-templates/catalog";
import { SectionsNav, type SectionKey } from "./SectionsNav";
import { TargetingPanel } from "./TargetingPanel";
import { LivePreviewPane } from "./LivePreviewPane";
import { ContactForm } from "./sections/ContactForm";
import { SummaryForm } from "./sections/SummaryForm";
import { ExperienceForm } from "./sections/ExperienceForm";
import { EducationForm } from "./sections/EducationForm";
import { SkillsForm } from "./sections/SkillsForm";
import { OptionalSectionForm } from "./sections/OptionalSectionForm";

export function BuilderShell({ draftId }: { draftId: string }) {
  // Loaded via BuilderShellLoader (ssr: false), so this only ever runs
  // client-side — safe to read localStorage synchronously as initial state.
  const [draft, setDraft] = useState<ResumeDraft | null>(() => getDraft(draftId) ?? null);
  const [activeSection, setActiveSection] = useState<SectionKey>("contact");
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!draft) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => saveDraft(draft), 300);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [draft]);

  function update(patch: Partial<ResumeDraft>) {
    setDraft((d) => (d ? { ...d, ...patch } : d));
  }

  if (draft === null) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-[14px] text-text-secondary">
          We couldn&rsquo;t find that resume on this device.
        </p>
        <Link
          href="/templates"
          className="rounded-lg border border-border px-4 py-2 text-[14px] font-medium text-text-primary transition-colors hover:bg-bg-secondary"
        >
          Start a new resume
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {!draft.targetingPromptShown && (
        <TargetingPanel
          targeting={draft.targeting}
          onDone={(targeting) =>
            update({ targeting, targetingPromptShown: true })
          }
        />
      )}

      <Header statusText="Saved" />

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[200px_1fr_1fr]">
        <div className="border-b border-border lg:border-r lg:border-b-0">
          <SectionsNav
            active={activeSection}
            onSelect={setActiveSection}
            optionalSections={draft.optionalSections}
            onAddSection={(key: OptionalSectionKey) => {
              update({
                optionalSections: { ...draft.optionalSections, [key]: [] },
              });
              setActiveSection(key);
            }}
          />
        </div>

        <div className="border-b border-border px-6 py-8 lg:border-r lg:border-b-0 lg:px-10">
          <SectionEditor draft={draft} activeSection={activeSection} update={update} />
        </div>

        <div className="bg-bg-secondary px-6 py-8 lg:px-10">
          <LivePreviewPane draft={draft} />
        </div>
      </div>
    </div>
  );
}

function SectionEditor({
  draft,
  activeSection,
  update,
}: {
  draft: ResumeDraft;
  activeSection: SectionKey;
  update: (patch: Partial<ResumeDraft>) => void;
}) {
  switch (activeSection) {
    case "contact":
      return (
        <ContactForm
          contact={draft.contact}
          onChange={(contact) => update({ contact })}
          supportsPhoto={getTemplateMeta(draft.templateKey)?.supportsPhoto ?? false}
          photoShape={draft.appearance.photoShape}
          onPhotoShapeChange={(photoShape) =>
            update({ appearance: { ...draft.appearance, photoShape } })
          }
        />
      );
    case "summary":
      return <SummaryForm summary={draft.summary} onChange={(summary) => update({ summary })} />;
    case "experience":
      return (
        <ExperienceForm
          experience={draft.experience}
          onChange={(experience) => update({ experience })}
        />
      );
    case "education":
      return (
        <EducationForm
          education={draft.education}
          onChange={(education) => update({ education })}
        />
      );
    case "skills":
      return <SkillsForm skills={draft.skills} onChange={(skills) => update({ skills })} />;
    default: {
      const key = activeSection as OptionalSectionKey;
      return (
        <OptionalSectionForm
          sectionKey={key}
          entries={draft.optionalSections[key] ?? []}
          onChange={(entries) =>
            update({
              optionalSections: { ...draft.optionalSections, [key]: entries },
            })
          }
        />
      );
    }
  }
}
