import { Plus, Trash2 } from "lucide-react";
import type { OptionalSectionKey } from "@/lib/resume/types";
import { optionalSectionMeta } from "@/lib/resume/optional-sections";
import { newId } from "@/lib/resume/id";
import { Field } from "../Field";
import { inputClass, textareaClass } from "../inputStyles";

type Entry = Record<string, string | undefined> & { id: string };

export function OptionalSectionForm({
  sectionKey,
  entries,
  onChange,
  onFocusField,
}: {
  sectionKey: OptionalSectionKey;
  entries: Entry[];
  onChange: (entries: Entry[]) => void;
  onFocusField: (entryId: string, fieldKey: string) => void;
}) {
  const meta = optionalSectionMeta[sectionKey];

  function update(id: string, patch: Partial<Entry>) {
    onChange(entries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  }

  function remove(id: string) {
    onChange(entries.filter((entry) => entry.id !== id));
  }

  function add() {
    const blank = Object.fromEntries(meta.fields.map((f) => [f.key, ""])) as Omit<Entry, "id">;
    onChange([...entries, { id: newId(), ...blank }]);
  }

  return (
    <div className="flex flex-col gap-8">
      {entries.map((entry, index) => (
        <div key={entry.id} className="flex flex-col gap-4 border-b border-border pb-8 last:border-b-0 last:pb-0">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-text-secondary">
              {meta.label} {index + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(entry.id)}
              className="flex items-center gap-1 text-[12px] text-text-secondary hover:text-error"
              aria-label={`Remove ${meta.label.toLowerCase()}`}
            >
              <Trash2 size={13} />
              Remove
            </button>
          </div>

          {meta.fields.map((field) =>
            field.multiline ? (
              <Field key={field.key} label={field.label}>
                <textarea
                  className={textareaClass}
                  value={entry[field.key] ?? ""}
                  onChange={(e) => update(entry.id, { [field.key]: e.target.value })}
                  onFocus={() => onFocusField(entry.id, field.key)}
                />
                <p className="mt-1.5 text-[12px] text-text-secondary">
                  Tip: briefly describe what you did and the impact it had. The AI Helper can draft or
                  adjust this for you.
                </p>
              </Field>
            ) : (
              <Field key={field.key} label={field.label}>
                <input
                  className={inputClass}
                  value={entry[field.key] ?? ""}
                  onChange={(e) => update(entry.id, { [field.key]: e.target.value })}
                />
              </Field>
            )
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 self-start text-[13px] font-medium text-accent hover:text-accent-hover"
      >
        <Plus size={14} />
        Add {meta.label.toLowerCase()}
      </button>
    </div>
  );
}
