"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";

export function InlineEditableTitle({
  value,
  placeholder,
  onChange,
  className,
  inputClassName,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function commit() {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onChange(trimmed);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        placeholder={placeholder}
        className={inputClassName ?? className}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDraft(value);
        setEditing(true);
      }}
      className="group inline-flex max-w-full items-center gap-1.5 text-left"
    >
      <span className={`truncate ${className ?? ""}`}>{value || placeholder}</span>
      <Pencil
        size={12}
        className="shrink-0 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100"
      />
    </button>
  );
}
