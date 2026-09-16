"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ResumeContent, TemplateKey } from "@/lib/resume/types";
import { templateCatalog } from "@/components/resume-templates/catalog";
import { createDraft } from "@/lib/resume/store";
import { tailorContentToJob } from "@/lib/resume/tailor";
import { Field } from "@/components/builder/Field";
import { inputClass, textareaClass } from "@/components/builder/inputStyles";

export function GeneratePanel({ masterContent }: { masterContent: ResumeContent }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [templateKey, setTemplateKey] = useState<TemplateKey>("minimal");
  const [generating, setGenerating] = useState(false);

  const isEmpty = !masterContent.contact.name && masterContent.experience.length === 0;

  function handleGenerate() {
    setGenerating(true);
    const { content } = tailorContentToJob(masterContent, jobDescription, targetRole);
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

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <h2 className="text-[15px] font-semibold">Generate a tailored resume</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
        Paste a job description and we&rsquo;ll pull the most relevant
        experience, bullets, and skills from your master resume — everything
        here stays untouched.
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
          <Field label="Target role" helperText="Optional">
            <input
              className={inputClass}
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Product Designer"
            />
          </Field>
          <Field label="Job description" helperText="Optional, but this is what makes it tailored">
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
            onClick={handleGenerate}
            disabled={generating}
            className="rounded-lg bg-accent px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {generating ? "Generating…" : "Generate resume"}
          </button>
        </div>
      )}
    </div>
  );
}
