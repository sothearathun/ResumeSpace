import { Field } from "../Field";
import { textareaClass } from "../inputStyles";

export function SummaryForm({
  summary,
  onChange,
}: {
  summary: string;
  onChange: (summary: string) => void;
}) {
  return (
    <Field
      label="Professional summary"
      helperText="Two or three sentences on who you are and what you do."
    >
      <textarea
        className={textareaClass}
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Product designer with six years of experience shaping consumer and B2B software..."
      />
    </Field>
  );
}
