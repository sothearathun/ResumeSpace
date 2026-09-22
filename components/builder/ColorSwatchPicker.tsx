const SWATCHES = [
  "#2563eb", // blue (brand default)
  "#1f2937", // slate
  "#7c3aed", // violet
  "#db2777", // rose
  "#16a34a", // green
  "#ea580c", // orange
  "#0891b2", // teal
  "#dc2626", // red
];

export function ColorSwatchPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-text-primary">{label}</span>
      <div className="flex flex-wrap items-center gap-2">
        {SWATCHES.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            aria-label={color}
            aria-pressed={value.toLowerCase() === color}
            style={{ backgroundColor: color }}
            className={`h-7 w-7 rounded-full transition-transform ${
              value.toLowerCase() === color
                ? "ring-2 ring-accent ring-offset-2"
                : "hover:scale-105"
            }`}
          />
        ))}

        <label
          className="relative flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border text-text-secondary"
          title="Custom color"
        >
          <span className="text-[14px] leading-none">+</span>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
      </div>
    </div>
  );
}
