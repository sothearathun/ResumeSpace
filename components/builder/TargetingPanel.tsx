"use client";

import { useState } from "react";
import type { ResumeDraft } from "@/lib/resume/types";
import { Field } from "./Field";
import { inputClass, textareaClass } from "./inputStyles";

export function TargetingPanel({
  targeting,
  onDone,
}: {
  targeting: ResumeDraft["targeting"];
  onDone: (targeting: ResumeDraft["targeting"]) => void;
}) {
  const [targetRole, setTargetRole] = useState(targeting.targetRole ?? "");
  const [jobDescription, setJobDescription] = useState(targeting.jobDescription ?? "");

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-neutral-900/35 px-4">
      <div className="w-full max-w-[480px] rounded-xl border border-border bg-white p-8">
        <h2 className="text-[19px] font-semibold tracking-tight">
          Want to tailor your resume?
        </h2>
        <p className="mt-1.5 text-[13px] text-text-secondary">
          Paste the job description and we&rsquo;ll help tailor your resume. You can skip this
          and add it later.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <Field label="Target role">
            <input
              className={inputClass}
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Product Designer"
            />
          </Field>
          <Field label="Job description">
            <textarea
              className={textareaClass}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description"
            />
          </Field>
        </div>

        <div className="mt-7 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onDone({ targetRole, jobDescription })}
            className="rounded-lg bg-accent px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={() => onDone(targeting)}
            className="text-[14px] text-text-secondary hover:text-text-primary"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
