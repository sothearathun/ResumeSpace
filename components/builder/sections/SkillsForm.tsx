import { useState } from "react";
import { Field } from "../Field";
import { inputClass } from "../inputStyles";

export function SkillsForm({
  skills,
  onChange,
}: {
  skills: string[];
  onChange: (skills: string[]) => void;
}) {
  // Local text buffer so a trailing ", " while typing isn't immediately
  // stripped by re-deriving the input value from the parsed array.
  const [text, setText] = useState(skills.join(", "));

  function handleChange(value: string) {
    setText(value);
    onChange(
      value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }

  return (
    <Field label="Skills" helperText="Separate each skill with a comma.">
      <input
        className={inputClass}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Python, SQL, Excel, communication, teamwork"
      />
    </Field>
  );
}
