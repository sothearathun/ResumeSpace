export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  size = "md",
}: {
  size?: "sm" | "md";
  label?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-[13px] font-medium text-text-primary">{label}</span>}
      <div className="inline-flex w-fit overflow-hidden rounded-md border border-border">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={`transition-colors ${
              size === "sm" ? "px-2 py-1 text-[12px]" : "px-3 py-1.5 text-[13px]"
            } ${
              value === opt.value
                ? "bg-accent text-white"
                : "text-text-secondary hover:bg-bg-secondary"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
