import { Field } from "../Field";
import { textareaClass } from "../inputStyles";

export function SummaryForm({
  summary,
  onChange,
  onFocus,
}: {
  summary: string;
  onChange: (summary: string) => void;
  onFocus: () => void;
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
        onFocus={onFocus}
        placeholder="Product designer with six years of experience shaping consumer and B2B software..."
      />
      <p className="mt-1.5 text-[12px] text-text-secondary">
        Tip: lead with your role and top strengths, then what you&rsquo;re focused on now. Stuck? Click in
        here and ask the AI Helper in the corner — even one word is enough to start.
      </p>
    </Field>
  );
}
