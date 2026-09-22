import { Plus, Trash2 } from "lucide-react";
import type { ResumeExperience } from "@/lib/resume/types";
import { newId } from "@/lib/resume/id";
import { Field } from "../Field";
import { inputClass, textareaClass } from "../inputStyles";

export function ExperienceForm({
  experience,
  onChange,
  onFocusBullets,
}: {
  experience: ResumeExperience[];
  onChange: (experience: ResumeExperience[]) => void;
  onFocusBullets: (entryId: string) => void;
}) {
  function update(id: string, patch: Partial<ResumeExperience>) {
    onChange(experience.map((job) => (job.id === id ? { ...job, ...patch } : job)));
  }

  function remove(id: string) {
    onChange(experience.filter((job) => job.id !== id));
  }

  function add() {
    onChange([
      ...experience,
      {
        id: newId(),
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        bullets: [],
      },
    ]);
  }

  return (
    <div className="flex flex-col gap-8">
      {experience.map((job, index) => (
        <div key={job.id} className="flex flex-col gap-4 border-b border-border pb-8 last:border-b-0 last:pb-0">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-text-secondary">
              Position {index + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(job.id)}
              className="flex items-center gap-1 text-[12px] text-text-secondary hover:text-error"
              aria-label="Remove position"
            >
              <Trash2 size={13} />
              Remove
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Job title">
              <input
                className={inputClass}
                value={job.jobTitle}
                onChange={(e) => update(job.id, { jobTitle: e.target.value })}
                placeholder="Product Designer"
              />
            </Field>
            <Field label="Company">
              <input
                className={inputClass}
                value={job.company}
                onChange={(e) => update(job.id, { company: e.target.value })}
                placeholder="Company name"
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Location">
              <input
                className={inputClass}
                value={job.location ?? ""}
                onChange={(e) => update(job.id, { location: e.target.value })}
                placeholder="City, State"
              />
            </Field>
            <Field label="Start date">
              <input
                className={inputClass}
                value={job.startDate}
                onChange={(e) => update(job.id, { startDate: e.target.value })}
                placeholder="2022"
              />
            </Field>
            <Field label="End date">
              <input
                className={inputClass}
                value={job.endDate}
                onChange={(e) => update(job.id, { endDate: e.target.value })}
                placeholder="Present"
              />
            </Field>
          </div>

          <Field label="What did you do?" helperText="One line per bullet point.">
            <textarea
              className={textareaClass}
              value={job.bullets.join("\n")}
              onChange={(e) => update(job.id, { bullets: e.target.value.split("\n") })}
              onFocus={() => onFocusBullets(job.id)}
              placeholder={"Led design for the onboarding redesign...\nBuilt and maintained the team's design system..."}
            />
          </Field>
          <p className="-mt-2 text-[12px] text-text-secondary">
            Tip: use the STAR format — Situation, Task, Action, Result — and include a measurable
            outcome where you can. Click into a bullet and ask the AI Helper for a hand.
          </p>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 self-start text-[13px] font-medium text-accent hover:text-accent-hover"
      >
        <Plus size={14} />
        Add experience
      </button>
    </div>
  );
}
