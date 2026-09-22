"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import type { OptionalSectionKey, ResumeAppearance, ResumeDraft } from "@/lib/resume/types";
import { loadDraft, persistDraft } from "@/lib/resume/resumeService";
import { createClient } from "@/lib/supabase/client";
import { getTemplateMeta } from "@/components/resume-templates/catalog";
import type { ActiveField } from "@/lib/ai/activeField";
import { fetchCheckOverflow, fetchFitToPage, type FitToPageResult } from "@/lib/builder/fitToPage";
import { SectionsNav, type SectionKey } from "./SectionsNav";
import { LivePreviewPane } from "./LivePreviewPane";
import { PreviewToolbar } from "./PreviewToolbar";
import { AiHelper } from "./AiHelper";
import { InlineEditableTitle } from "./InlineEditableTitle";
import { ContactForm } from "./sections/ContactForm";
import { SummaryForm } from "./sections/SummaryForm";
import { ExperienceForm } from "./sections/ExperienceForm";
import { EducationForm } from "./sections/EducationForm";
import { SkillsForm } from "./sections/SkillsForm";
import { OptionalSectionForm } from "./sections/OptionalSectionForm";
import { ChangeTemplateForm } from "./sections/ChangeTemplateForm";
import { AppearanceForm } from "./sections/AppearanceForm";

export function BuilderShell({ draftId }: { draftId: string }) {
  // Loaded via BuilderShellLoader (ssr: false). undefined = still loading,
  // null = no such draft (signed-in account or this device's storage).
  const [draft, setDraft] = useState<ResumeDraft | null | undefined>(undefined);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>("contact");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [activeField, setActiveField] = useState<ActiveField | null>(null);
  const [fitMessage, setFitMessage] = useState<string | null>(null);
  const [undoAppearance, setUndoAppearance] = useState<ResumeAppearance | null>(null);
  const [zoom, setZoom] = useState(100);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoFitTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadDraft(draftId).then((loaded) => {
      if (!cancelled) setDraft(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [draftId]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user));
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!draft) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      await persistDraft(draft);
      setSaveStatus("saved");
    }, 300);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [draft]);

  // Watches the resume's *content* only (not appearance) so applying a fit
  // below never re-triggers this itself. Debounced well past typing, and a
  // cheap single-page-count check runs first so the expensive multi-combo
  // search in fetchFitToPage only fires when there's an actual problem.
  const contentFingerprint = draft
    ? JSON.stringify({
        templateKey: draft.templateKey,
        contact: draft.contact,
        summary: draft.summary,
        experience: draft.experience,
        education: draft.education,
        skills: draft.skills,
        optionalSections: draft.optionalSections,
      })
    : null;

  useEffect(() => {
    if (autoFitTimeout.current) clearTimeout(autoFitTimeout.current);
    // Off entirely when the user has turned auto-fit off — a deliberate
    // opt-out so a resume can stay at whatever font size they picked and
    // just flow onto a second page, instead of the app always shrinking it
    // back down to one whenever that's technically possible.
    if (!draft || !contentFingerprint || draft.autoFitEnabled === false) return;
    autoFitTimeout.current = setTimeout(async () => {
      const overflowing = await fetchCheckOverflow(draft);
      if (!overflowing) return;
      const result = await fetchFitToPage(draft);
      // Only auto-apply when it can actually land on one clean page. If
      // there's genuinely too much content, leave the appearance alone —
      // the live preview just shows the extra page(s) instead of the font
      // silently shrinking out from under the user.
      if (!result || !result.fits) return;
      applyFitResult(draft, result, true);
    }, 2000);
    return () => {
      if (autoFitTimeout.current) clearTimeout(autoFitTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentFingerprint, draft?.autoFitEnabled]);

  function update(patch: Partial<ResumeDraft>) {
    setSaveStatus("saving");
    setDraft((d) => (d ? { ...d, ...patch } : d));
  }

  function applyFitResult(current: ResumeDraft, result: FitToPageResult, isAuto: boolean) {
    setUndoAppearance(current.appearance);
    update({
      appearance: {
        ...current.appearance,
        fontSize: result.fontSize,
        spacing: result.spacing,
        contentScale: result.contentScale,
      },
    });
    setFitMessage(
      isAuto
        ? "This wasn't going to fit one page, so it was resized automatically."
        : result.fits
          ? "Sized to fill one page."
          : `This resume runs to ${result.pages} pages at a comfortable size — the preview below now shows all of them.`
    );
  }

  async function runFitToPage() {
    if (!draft) return;
    const result = await fetchFitToPage(draft);
    if (!result) {
      setUndoAppearance(null);
      setFitMessage("Couldn't check the fit — try again.");
      return;
    }
    applyFitResult(draft, result, false);
  }

  function undoFit() {
    if (!undoAppearance) return;
    update({ appearance: undoAppearance });
    setUndoAppearance(null);
    setFitMessage(null);
  }

  if (draft === undefined) {
    return (
      <div className="flex flex-1 flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-[14px] text-text-secondary">Loading your resume…</p>
        </div>
      </div>
    );
  }

  if (draft === null) {
    return (
      <div className="flex flex-1 flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
          <p className="text-[14px] text-text-secondary">
            {signedIn
              ? "We couldn't find that resume in your account."
              : "We couldn't find that resume on this device."}
          </p>
          <Link
            href="/builder"
            className="rounded-lg border border-border px-4 py-2 text-[14px] font-medium text-text-primary transition-colors hover:bg-bg-secondary"
          >
            Start a new resume
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-border px-6 py-2 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <InlineEditableTitle
            value={draft.title ?? ""}
            placeholder={draft.contact.name || "Untitled resume"}
            onChange={(title) => update({ title })}
            className="text-[14px] font-medium text-text-primary"
          />
          {signedIn === false && (
            <Link
              href="/sign-in"
              className="shrink-0 text-[12px] font-medium text-accent hover:text-accent-hover"
            >
              Sign in to save this permanently →
            </Link>
          )}
        </div>
        <PreviewToolbar
          draft={draft}
          saveStatus={saveStatus}
          zoom={zoom}
          onZoomChange={setZoom}
          fitMessage={fitMessage}
          canUndoFit={Boolean(undoAppearance)}
          onRunFit={runFitToPage}
          onUndoFit={undoFit}
          autoFitEnabled={draft.autoFitEnabled !== false}
          onToggleAutoFit={(autoFitEnabled) => {
            update({ autoFitEnabled });
            if (autoFitEnabled) setFitMessage(null);
          }}
        />
      </div>

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)_minmax(0,1fr)]">
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
            showAppearance
          />
        </div>

        <div className="flex flex-col gap-6 border-b border-border px-6 py-8 lg:border-r lg:border-b-0 lg:px-10">
          <SectionEditor
            draft={draft}
            activeSection={activeSection}
            update={update}
            onFocusField={setActiveField}
          />
        </div>

        <div className="overflow-x-auto bg-bg-secondary p-3">
          <LivePreviewPane draft={draft} zoom={zoom} />
        </div>
      </div>

      <AiHelper
        content={draft}
        activeField={activeField}
        onApply={(patch) => update(patch)}
        jobTitle={draft.contact.jobTitle}
        company={draft.experience[0]?.company}
        targetRole={draft.targeting.targetRole}
        jobDescription={draft.targeting.jobDescription}
      />
    </div>
  );
}

function SectionEditor({
  draft,
  activeSection,
  update,
  onFocusField,
}: {
  draft: ResumeDraft;
  activeSection: SectionKey;
  update: (patch: Partial<ResumeDraft>) => void;
  onFocusField: (field: ActiveField) => void;
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
          photoSize={draft.appearance.photoSize}
          onPhotoSizeChange={(photoSize) =>
            update({ appearance: { ...draft.appearance, photoSize } })
          }
        />
      );
    case "summary":
      return (
        <SummaryForm
          summary={draft.summary}
          onChange={(summary) => update({ summary })}
          onFocus={() => onFocusField({ kind: "summary" })}
        />
      );
    case "experience":
      return (
        <ExperienceForm
          experience={draft.experience}
          onChange={(experience) => update({ experience })}
          onFocusBullets={(entryId) => onFocusField({ kind: "experience-bullets", entryId })}
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
      return (
        <SkillsForm
          skills={draft.skills}
          onChange={(skills) => update({ skills })}
          onFocus={() => onFocusField({ kind: "skills" })}
        />
      );
    case "template":
      return (
        <ChangeTemplateForm
          draft={draft}
          onChange={(templateKey) => {
            const meta = getTemplateMeta(templateKey);
            update({
              templateKey,
              appearance: meta?.defaultAppearance ?? draft.appearance,
            });
          }}
        />
      );
    case "appearance":
      return (
        <AppearanceForm
          appearance={draft.appearance}
          template={getTemplateMeta(draft.templateKey)}
          onChange={(patch) => update({ appearance: { ...draft.appearance, ...patch } })}
        />
      );
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
          onFocusField={(entryId, fieldKey) =>
            onFocusField({ kind: "optional-field", sectionKey: key, entryId, fieldKey })
          }
        />
      );
    }
  }
}
