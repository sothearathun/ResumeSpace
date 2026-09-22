import type { ResumeAppearance, TemplateMeta } from "@/lib/resume/types";
import { ColorSwatchPicker } from "../ColorSwatchPicker";
import { SegmentedControl } from "../SegmentedControl";

export function AppearanceForm({
  appearance,
  template,
  onChange,
}: {
  appearance: ResumeAppearance;
  template: TemplateMeta | undefined;
  onChange: (patch: Partial<ResumeAppearance>) => void;
}) {
  const colorSlots = template?.colorSlots ?? ["accentColor"];

  return (
    <div className="flex flex-col gap-6">
      {colorSlots.includes("accentColor") && (
        <ColorSwatchPicker
          label="Accent color"
          value={appearance.accentColor}
          onChange={(accentColor) => onChange({ accentColor })}
        />
      )}

      {colorSlots.includes("headerBg") && (
        <ColorSwatchPicker
          label="Header background"
          value={appearance.headerBg ?? "#f7f7f8"}
          onChange={(headerBg) => onChange({ headerBg })}
        />
      )}

      {colorSlots.includes("linkColor") && (
        <ColorSwatchPicker
          label="Link color"
          value={appearance.linkColor ?? appearance.accentColor}
          onChange={(linkColor) => onChange({ linkColor })}
        />
      )}

      <SegmentedControl
        label="Text size"
        value={appearance.fontSize}
        // A manual pick means "use this preset as-is" — clear any leftover
        // scaling from a previous "Fit to one page" run so it isn't
        // silently distorting the size the user just chose.
        onChange={(fontSize) => onChange({ fontSize, contentScale: 1 })}
        options={[
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ]}
      />

      <SegmentedControl
        label="Spacing"
        value={appearance.spacing}
        onChange={(spacing) => onChange({ spacing, contentScale: 1 })}
        options={[
          { value: "compact", label: "Compact" },
          { value: "comfortable", label: "Comfortable" },
          { value: "spacious", label: "Spacious" },
        ]}
      />

      {template?.supportsLayoutToggle && (
        <SegmentedControl
          label="Layout"
          value={appearance.layout ?? "two-column"}
          onChange={(layout) => onChange({ layout })}
          options={[
            { value: "one-column", label: "One column" },
            { value: "two-column", label: "Two column" },
          ]}
        />
      )}
    </div>
  );
}
