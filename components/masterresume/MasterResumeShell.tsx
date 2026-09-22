"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/layout/Header";
import type { OptionalSectionKey, ResumeContent } from "@/lib/resume/types";
import { getOrCreateMasterResume, saveMasterResume, type MasterResumeRecord } from "@/lib/resume/masterResumeStore";
import type { ActiveField } from "@/lib/ai/activeField";
import { SectionsNav, type SectionKey } from "@/components/builder/SectionsNav";
import { AiHelper } from "@/components/builder/AiHelper";
import { ContactForm } from "@/components/builder/sections/ContactForm";
import { SummaryForm } from "@/components/builder/sections/SummaryForm";
import { ExperienceForm } from "@/components/builder/sections/ExperienceForm";
import { EducationForm } from "@/components/builder/sections/EducationForm";
import { SkillsForm } from "@/components/builder/sections/SkillsForm";
import { OptionalSectionForm } from "@/components/builder/sections/OptionalSectionForm";
import { GeneratePanel } from "./GeneratePanel";

export function MasterResumeShell() {
  // "use client"-only route (see MasterResumePage), so reading localStorage
  // synchronously as initial state is safe — same pattern as BuilderShell.
  const [record, setRecord] = useState<MasterResumeRecord>(() => getOrCreateMasterResume());
  const [activeSection, setActiveSection] = useState<SectionKey>("contact");
  const [activeField, setActiveField] = useState<ActiveField | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => saveMasterResume(record), 300);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [record]);

  function updateContent(patch: Partial<ResumeContent>) {
    setRecord((r) => ({ ...r, content: { ...r.content, ...patch } }));
  }

  const { content } = record;

  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <div className="border-b border-border px-4 py-6 sm:px-6 lg:px-10">
        <h1 className="text-[20px] font-semibold tracking-tight">Master resume</h1>
        <p className="mt-1 max-w-2xl text-[13px] text-text-secondary">
          Keep everything here — every job, every bullet, every skill. It&rsquo;s
          never sent anywhere on its own; it&rsquo;s the source you generate
          job-specific resumes from.
        </p>
      </div>

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)_minmax(460px,42%)]">
        <div className="border-b border-border lg:border-r lg:border-b-0">
          <SectionsNav
            active={activeSection}
            onSelect={setActiveSection}
            optionalSections={content.optionalSections ?? {}}
            onAddSection={(key: OptionalSectionKey) => {
              updateContent({
                optionalSections: { ...content.optionalSections, [key]: [] },
              });
              setActiveSection(key);
            }}
          />
        </div>

        <div className="border-b border-border px-6 py-8 lg:border-r lg:border-b-0 lg:px-10">
          <SectionEditor
            content={content}
            activeSection={activeSection}
            update={updateContent}
            photoShape={record.photoShape}
            onPhotoShapeChange={(photoShape) => setRecord((r) => ({ ...r, photoShape }))}
            photoSize={record.photoSize}
            onPhotoSizeChange={(photoSize) => setRecord((r) => ({ ...r, photoSize }))}
            onFocusField={setActiveField}
          />
        </div>

        <div className="bg-bg-secondary px-6 py-8 lg:px-8">
          <GeneratePanel masterContent={content} />
        </div>
      </div>

      <AiHelper
        content={content}
        activeField={activeField}
        onApply={updateContent}
        jobTitle={content.contact.jobTitle}
        company={content.experience[0]?.company}
      />
    </div>
  );
}

function SectionEditor({
  content,
  activeSection,
  update,
  photoShape,
  onPhotoShapeChange,
  photoSize,
  onPhotoSizeChange,
  onFocusField,
}: {
  content: ResumeContent;
  activeSection: SectionKey;
  update: (patch: Partial<ResumeContent>) => void;
  photoShape: "circle" | "square" | undefined;
  onPhotoShapeChange: (shape: "circle" | "square" | undefined) => void;
  photoSize: "small" | "medium" | "large" | undefined;
  onPhotoSizeChange: (size: "small" | "medium" | "large" | undefined) => void;
  onFocusField: (field: ActiveField) => void;
}) {
  switch (activeSection) {
    case "contact":
      return (
        <ContactForm
          contact={content.contact}
          onChange={(contact) => update({ contact })}
          supportsPhoto
          photoShape={photoShape}
          onPhotoShapeChange={onPhotoShapeChange}
          photoSize={photoSize}
          onPhotoSizeChange={onPhotoSizeChange}
        />
      );
    case "summary":
      return (
        <SummaryForm
          summary={content.summary}
          onChange={(summary) => update({ summary })}
          onFocus={() => onFocusField({ kind: "summary" })}
        />
      );
    case "experience":
      return (
        <ExperienceForm
          experience={content.experience}
          onChange={(experience) => update({ experience })}
          onFocusBullets={(entryId) => onFocusField({ kind: "experience-bullets", entryId })}
        />
      );
    case "education":
      return (
        <EducationForm education={content.education} onChange={(education) => update({ education })} />
      );
    case "skills":
      return (
        <SkillsForm
          skills={content.skills}
          onChange={(skills) => update({ skills })}
          onFocus={() => onFocusField({ kind: "skills" })}
        />
      );
    default: {
      const key = activeSection as OptionalSectionKey;
      return (
        <OptionalSectionForm
          sectionKey={key}
          entries={content.optionalSections?.[key] ?? []}
          onChange={(entries) =>
            update({
              optionalSections: { ...content.optionalSections, [key]: entries },
            })
          }
          onFocusField={(entryId, fieldKey) =>
            onFocusField({ kind: "optional-field", sectionKey: key, entryId, fieldKey })
          }
        />
      );
    }
  }
}
