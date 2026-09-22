"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ResumeContent, TemplateKey } from "@/lib/resume/types";
import { templateCatalog } from "@/components/resume-templates/catalog";
import { createDraft } from "@/lib/resume/store";
import {
  buildTailoredContent,
  keywordAnalysis,
  type TailorAnalysis,
} from "@/lib/resume/tailor";
import { Field } from "@/components/builder/Field";
import { inputClass, textareaClass } from "@/components/builder/inputStyles";

type Review = {
  analysis: TailorAnalysis;
  summary: string;
  jobKeep: Record<string, boolean>;
  bulletKeep: Record<string, boolean[]>;
  eduKeep: Record<string, boolean>;
  skillKeep: Record<string, boolean>;
  fellBack: boolean;
};

function buildReview(master: ResumeContent, analysis: TailorAnalysis, fellBack: boolean): Review {
  const jobKeep: Record<string, boolean> = {};
  const bulletKeep: Record<string, boolean[]> = {};
  for (const job of master.experience) {
    const a = analysis.experience.find((e) => e.id === job.id);
    jobKeep[job.id] = a?.keep ?? true;
    const keepSet = new Set(a?.keepBullets ?? job.bullets.map((_, i) => i));
    bulletKeep[job.id] = job.bullets.map((_, i) => keepSet.has(i));
  }
  const eduKeep: Record<string, boolean> = {};
  for (const edu of master.education) eduKeep[edu.id] = analysis.education.find((e) => e.id === edu.id)?.keep ?? true;
  const skillKeep: Record<string, boolean> = {};
  const picked = new Set(analysis.skills);
  for (const skill of master.skills) skillKeep[skill] = picked.has(skill);
  return { analysis, summary: analysis.summary, jobKeep, bulletKeep, eduKeep, skillKeep, fellBack };
}

function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
      />
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  );
}

function SectionTitle({ children, count }: { children: React.ReactNode; count: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <h3 className="text-[13px] font-semibold text-text-primary">{children}</h3>
      <span className="text-[12px] text-text-secondary">{count}</span>
    </div>
  );
}

export function GeneratePanel({ masterContent }: { masterContent: ResumeContent }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [templateKey, setTemplateKey] = useState<TemplateKey>("minimal");
  const [analyzing, setAnalyzing] = useState(false);
  const [review, setReview] = useState<Review | null>(null);

  const isEmpty = !masterContent.contact.name && masterContent.experience.length === 0;

  async function handleAnalyze() {
    setAnalyzing(true);
    const hasTarget = targetRole.trim() || jobDescription.trim();
    let analysis: TailorAnalysis | null = null;
    if (hasTarget) {
      try {
        const res = await fetch("/api/tailor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ master: masterContent, targetRole, jobDescription }),
        });
        if (res.ok) analysis = await res.json();
      } catch {
        // falls through to the keyword fallback below
      }
    }
    const fellBack = Boolean(hasTarget) && !analysis;
    setReview(buildReview(masterContent, analysis ?? keywordAnalysis(masterContent, jobDescription, targetRole), fellBack));
    setAnalyzing(false);
  }

  function handleCreate() {
    if (!review) return;
    const content = buildTailoredContent(masterContent, {
      summary: review.summary,
      experience: masterContent.experience
        .filter((job) => review.jobKeep[job.id])
        .map((job) => ({
          id: job.id,
          bullets: review.bulletKeep[job.id].flatMap((keep, i) => (keep ? [i] : [])),
        })),
      education: masterContent.education.filter((edu) => review.eduKeep[edu.id]).map((edu) => edu.id),
      // Keep the analysis's relevance order first, then anything the user
      // added back that the analysis had left out.
      skills: [
        ...review.analysis.skills.filter((s) => review.skillKeep[s]),
        ...masterContent.skills.filter((s) => review.skillKeep[s] && !review.analysis.skills.includes(s)),
      ],
    });
    const draft = createDraft(templateKey, content, { targetRole, jobDescription });
    router.push(`/builder/${draft.id}`);
  }

  if (isEmpty) {
    return (
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-[15px] font-semibold">Nothing to generate from yet</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
          Fill in your experience and skills on the left first — once there&rsquo;s
          something here, you can generate a resume tailored to a specific job
          from it.
        </p>
      </div>
    );
  }

  if (review) {
    const keptJobs = masterContent.experience.filter((j) => review.jobKeep[j.id]).length;
    const keptEdu = masterContent.education.filter((e) => review.eduKeep[e.id]).length;
    const keptSkills = masterContent.skills.filter((s) => review.skillKeep[s]).length;

    return (
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-[15px] font-semibold">
          Review your {targetRole.trim() ? `${targetRole.trim()} ` : "tailored "}resume
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
          {review.analysis.source === "ai"
            ? "We picked what fits this role best. Tick or untick anything you want to change."
            : review.fellBack
              ? "The AI analysis wasn't available, so this is a keyword-based first pass. Tick or untick anything you want to change."
              : "Choose what to include. Nothing in your master resume is changed."}
        </p>

        <div className="mt-5 flex flex-col gap-6">
          <Field label="Summary">
            <textarea
              className={`${textareaClass} min-h-40`}
              value={review.summary}
              onChange={(e) => setReview({ ...review, summary: e.target.value })}
            />
          </Field>

          <div className="flex flex-col gap-3">
            <SectionTitle count={`${keptJobs} of ${masterContent.experience.length}`}>Experience</SectionTitle>
            {masterContent.experience.map((job) => {
              const a = review.analysis.experience.find((e) => e.id === job.id);
              const kept = review.jobKeep[job.id];
              return (
                <div key={job.id} className={`rounded-lg border p-3 ${kept ? "border-border" : "border-border bg-bg-secondary"}`}>
                  <Checkbox
                    checked={kept}
                    onChange={(checked) => setReview({ ...review, jobKeep: { ...review.jobKeep, [job.id]: checked } })}
                  >
                    <span className={`text-[13px] font-medium ${kept ? "text-text-primary" : "text-text-secondary"}`}>
                      {job.jobTitle || "Untitled role"}
                      {job.company ? ` · ${job.company}` : ""}
                    </span>
                    {review.analysis.source === "ai" && a && (
                      <span className="ml-2 text-[11px] text-text-secondary">{a.relevance}% relevant</span>
                    )}
                    {a?.reason && <span className="mt-0.5 block text-[12px] text-text-secondary">{a.reason}</span>}
                  </Checkbox>
                  {kept && job.bullets.length > 0 && (
                    <div className="mt-2.5 flex flex-col gap-1.5 border-t border-border pt-2.5 pl-6">
                      {job.bullets.map((bullet, i) => (
                        <Checkbox
                          key={i}
                          checked={review.bulletKeep[job.id][i]}
                          onChange={(checked) =>
                            setReview({
                              ...review,
                              bulletKeep: {
                                ...review.bulletKeep,
                                [job.id]: review.bulletKeep[job.id].map((v, idx) => (idx === i ? checked : v)),
                              },
                            })
                          }
                        >
                          <span className="text-[12px] leading-snug text-text-secondary">{bullet}</span>
                        </Checkbox>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {masterContent.education.length > 0 && (
            <div className="flex flex-col gap-3">
              <SectionTitle count={`${keptEdu} of ${masterContent.education.length}`}>Education</SectionTitle>
              {masterContent.education.map((edu) => {
                const a = review.analysis.education.find((e) => e.id === edu.id);
                return (
                  <Checkbox
                    key={edu.id}
                    checked={review.eduKeep[edu.id]}
                    onChange={(checked) => setReview({ ...review, eduKeep: { ...review.eduKeep, [edu.id]: checked } })}
                  >
                    <span className="text-[13px] text-text-primary">
                      {edu.degree || "Degree"}
                      {edu.institution ? `, ${edu.institution}` : ""}
                    </span>
                    {a?.reason && <span className="mt-0.5 block text-[12px] text-text-secondary">{a.reason}</span>}
                  </Checkbox>
                );
              })}
            </div>
          )}

          {masterContent.skills.length > 0 && (
            <div className="flex flex-col gap-3">
              <SectionTitle count={`${keptSkills} of ${masterContent.skills.length}`}>Skills</SectionTitle>
              <div className="flex flex-wrap gap-1.5">
                {masterContent.skills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    aria-pressed={review.skillKeep[skill]}
                    onClick={() =>
                      setReview({ ...review, skillKeep: { ...review.skillKeep, [skill]: !review.skillKeep[skill] } })
                    }
                    className={`rounded-full border px-2.5 py-1 text-[12px] transition-colors ${
                      review.skillKeep[skill]
                        ? "border-accent bg-accent text-white"
                        : "border-border text-text-secondary hover:bg-bg-secondary"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCreate}
              className="rounded-lg bg-accent px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Create resume
            </button>
            <button
              type="button"
              onClick={() => setReview(null)}
              className="text-[14px] text-text-secondary hover:text-text-primary"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <h2 className="text-[15px] font-semibold">Generate a tailored resume</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
        Tell us the role and paste the job description. We&rsquo;ll analyze your master resume, pick the
        experience, education and skills that fit, and let you adjust the picks before creating it —
        everything here stays untouched.
      </p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 rounded-lg bg-accent px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Get started
        </button>
      ) : (
        <div className="mt-5 flex flex-col gap-4">
          <Field label="Target role">
            <input
              className={inputClass}
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Product Designer"
            />
          </Field>
          <Field label="Job description" helperText="Optional, but this makes the analysis sharper">
            <textarea
              className={textareaClass}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description"
            />
          </Field>
          <Field label="Template">
            <select
              className={inputClass}
              value={templateKey}
              onChange={(e) => setTemplateKey(e.target.value as TemplateKey)}
            >
              {templateCatalog.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing}
            className="rounded-lg bg-accent px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {analyzing ? "Analyzing your resume…" : "Analyze & review"}
          </button>
        </div>
      )}
    </div>
  );
}
