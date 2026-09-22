"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X } from "lucide-react";
import { inputClass, textareaClass } from "@/components/builder/inputStyles";

const KINDS = [
  { value: "bug", label: "Report a problem" },
  { value: "idea", label: "Suggest an idea" },
  { value: "other", label: "Something else" },
] as const;

type Kind = (typeof KINDS)[number]["value"];

export function FeedbackButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind>("bug");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function openDialog() {
    setStatus("idle");
    setError(null);
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, message, email, path: pathname }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Couldn't send feedback — please try again.");
      }
      setMessage("");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send feedback — please try again.");
      setStatus("idle");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="fixed bottom-4 left-16 z-40 flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[12px] font-medium text-text-secondary shadow-sm transition-colors hover:text-text-primary hover:shadow"
      >
        <MessageSquare size={13} />
        Feedback
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            className="w-full max-w-[440px] rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="feedback-title" className="text-[16px] font-semibold text-text-primary">
                  Send feedback
                </h2>
                <p className="mt-1 text-[13px] text-text-secondary">
                  Found a bug or have an idea? Tell us — we read everything.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded p-1 text-text-secondary hover:text-text-primary"
              >
                <X size={16} />
              </button>
            </div>

            {status === "sent" ? (
              <div className="mt-6 flex flex-col items-center gap-4 py-4 text-center">
                <p className="text-[14px] font-medium text-text-primary">Thanks — feedback received.</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-accent px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
                <div className="inline-flex w-fit overflow-hidden rounded-md border border-border">
                  {KINDS.map((k) => (
                    <button
                      key={k.value}
                      type="button"
                      onClick={() => setKind(k.value)}
                      aria-pressed={kind === k.value}
                      className={`px-3 py-1.5 text-[12px] transition-colors ${
                        kind === k.value ? "bg-accent text-white" : "text-text-secondary hover:bg-bg-secondary"
                      }`}
                    >
                      {k.label}
                    </button>
                  ))}
                </div>

                <textarea
                  className={textareaClass}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                  required
                  autoFocus
                  placeholder={
                    kind === "bug"
                      ? "What went wrong? What were you doing when it happened?"
                      : kind === "idea"
                        ? "What would make ResumeSpace better for you?"
                        : "Tell us anything"
                  }
                />

                <input
                  className={inputClass}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email (optional, if you'd like a reply)"
                />

                {error && <p className="text-[12px] text-error">{error}</p>}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-text-primary transition-colors hover:bg-bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === "sending" || !message.trim()}
                    className="rounded-lg bg-accent px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : "Send"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
