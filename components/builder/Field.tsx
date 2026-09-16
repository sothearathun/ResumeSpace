export function Field({
  label,
  helperText,
  children,
}: {
  label: string;
  helperText?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-text-primary">{label}</span>
      {children}
      {helperText && <span className="text-[12px] text-text-secondary">{helperText}</span>}
    </label>
  );
}
