import { Plus, Trash2 } from "lucide-react";
import type { ResumeEducation } from "@/lib/resume/types";
import { newId } from "@/lib/resume/id";
import { Field } from "../Field";
import { inputClass } from "../inputStyles";

export function EducationForm({
  education,
  onChange,
}: {
  education: ResumeEducation[];
  onChange: (education: ResumeEducation[]) => void;
}) {
  function update(id: string, patch: Partial<ResumeEducation>) {
    onChange(education.map((edu) => (edu.id === id ? { ...edu, ...patch } : edu)));
  }

  function remove(id: string) {
    onChange(education.filter((edu) => edu.id !== id));
  }

  function add() {
    onChange([
      ...education,
      { id: newId(), degree: "", institution: "", location: "", gradYear: "" },
    ]);
  }

  return (
    <div className="flex flex-col gap-8">
      {education.map((edu, index) => (
        <div key={edu.id} className="flex flex-col gap-4 border-b border-border pb-8 last:border-b-0 last:pb-0">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-text-secondary">
              Education {index + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(edu.id)}
              className="flex items-center gap-1 text-[12px] text-text-secondary hover:text-error"
              aria-label="Remove education"
            >
              <Trash2 size={13} />
              Remove
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Degree">
              <input
                className={inputClass}
                value={edu.degree}
                onChange={(e) => update(edu.id, { degree: e.target.value })}
                placeholder="B.A. Communications"
              />
            </Field>
            <Field label="Institution">
              <input
                className={inputClass}
                value={edu.institution}
                onChange={(e) => update(edu.id, { institution: e.target.value })}
                placeholder="University name"
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Location">
              <input
                className={inputClass}
                value={edu.location ?? ""}
                onChange={(e) => update(edu.id, { location: e.target.value })}
                placeholder="City, State"
              />
            </Field>
            <Field label="Graduation year">
              <input
                className={inputClass}
                value={edu.gradYear}
                onChange={(e) => update(edu.id, { gradYear: e.target.value })}
                placeholder="2024"
              />
            </Field>
            <Field label="GPA" helperText="Optional">
              <input
                className={inputClass}
                value={edu.gpa ?? ""}
                onChange={(e) => update(edu.id, { gpa: e.target.value })}
                placeholder="3.8"
              />
            </Field>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 self-start text-[13px] font-medium text-accent hover:text-accent-hover"
      >
        <Plus size={14} />
        Add education
      </button>
    </div>
  );
}
