import { Field } from "../Field";
import { textareaClass } from "../inputStyles";

export function SkillsForm({
  skills,
  onChange,
  onFocus,
}: {
  skills: string[];
  onChange: (skills: string[]) => void;
  onFocus: () => void;
}) {
  return (
    <Field label="Skills" helperText="One skill per line — press Enter to add another.">
      <textarea
        className={textareaClass}
        value={skills.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
        onFocus={onFocus}
        placeholder={"Python\nSQL\nExcel\nCommunication\nTeamwork"}
      />
      <p className="mt-1.5 text-[12px] text-text-secondary">
        Tip: list specific tools and technologies, not just soft skills. Ask the AI Helper to suggest
        skills based on your experience if you&rsquo;re stuck.
      </p>
    </Field>
  );
}
