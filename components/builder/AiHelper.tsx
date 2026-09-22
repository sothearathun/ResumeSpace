"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, X } from "lucide-react";
import type { ResumeContent } from "@/lib/resume/types";
import { type ActiveField, labelForField, getFieldText, applyFieldText } from "@/lib/ai/activeField";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SEEN_KEY = "resumecraft:aiHelperSeen";

export function AiHelper({
  content,
  activeField,
  onApply,
  jobTitle,
  company,
  targetRole,
  jobDescription,
}: {
  content: ResumeContent;
  activeField: ActiveField | null;
  onApply: (patch: Partial<ResumeContent>) => void;
  jobTitle?: string;
  company?: string;
  targetRole?: string;
  jobDescription?: string;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Invite bubble + attention pulse, shown together — only for someone who's
  // never opened the helper before. Once they know it's there, or dismiss
  // the invite, stop calling attention to it (even on future visits).
  const [showInvite, setShowInvite] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // localStorage unavailable — just skip the first-visit treatment.
    }
    if (seen) return;
    const showTimer = setTimeout(() => setShowInvite(true), 1200);
    const hideTimer = setTimeout(() => setShowInvite(false), 9000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  function markSeen() {
    setShowInvite(false);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Non-fatal — worst case the invite reappears next visit.
    }
  }

  const fieldLabel = activeField ? labelForField(content, activeField) : undefined;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resume-chat",
          messages: nextMessages,
          fieldLabel,
          fieldKind: activeField?.kind,
          fieldText: activeField ? getFieldText(content, activeField) : undefined,
          context: {
            jobTitle,
            company,
            targetRole,
            jobDescription,
            skills: content.skills,
            experienceSummary: content.experience.flatMap((j) => j.bullets).join("\n"),
          },
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      const { reply, updatedText } = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      if (typeof updatedText === "string" && activeField) {
        onApply(applyFieldText(content, activeField, updatedText));
      }
    } catch {
      setError("Couldn't reach the assistant — try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <div className="fixed right-6 bottom-6 z-30 flex flex-col items-end">
        {showInvite && (
          <div className="animate-bubble-in relative mb-1 mr-1 flex items-center gap-2 rounded-xl bg-accent px-3 py-2 shadow-md">
            <p className="text-[12px] font-medium text-white">
              Don&rsquo;t stress about the wording — I&rsquo;ll write it for you in seconds. Just ask! ✨
            </p>
            <button
              type="button"
              onClick={markSeen}
              aria-label="Dismiss"
              className="shrink-0 text-white/80 hover:text-white"
            >
              <X size={13} />
            </button>
            {/* Speech-bubble tail, pointing down at the button */}
            <span className="absolute -bottom-[7px] right-5 h-3 w-3 rotate-45 bg-accent" />
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            markSeen();
          }}
          aria-label="Open AI Helper"
          className={`flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-md transition-colors hover:bg-accent-hover ${
            showInvite ? "animate-gentle-bob" : ""
          }`}
        >
          <Sparkles size={22} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-6 bottom-6 z-30 flex w-80 flex-col overflow-hidden rounded-lg border border-border bg-white shadow-md">
      <div className="flex items-center justify-between border-b border-border bg-bg-secondary px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles size={15} className="text-accent" />
          <span className="text-[13px] font-medium text-text-primary">AI Helper</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close AI Helper"
          className="text-text-secondary hover:text-text-primary"
        >
          <X size={16} />
        </button>
      </div>

      <p className="border-b border-border bg-bg-secondary px-3 py-1.5 text-[11px] text-text-secondary">
        {fieldLabel ? (
          <>
            Helping with: <span className="font-medium text-text-primary">{fieldLabel}</span>
          </>
        ) : (
          "Click into a field to let me edit it — or just ask me anything."
        )}
      </p>

      <div ref={scrollRef} className="flex max-h-80 min-h-[120px] flex-col gap-2 overflow-y-auto p-3">
        {messages.length === 0 && (
          <p className="text-[12px] text-text-secondary">
            Hi! Click into any field — Summary, a bullet point, Skills — and tell me what you need. I can
            write a first draft from just a word, or adjust what&rsquo;s there.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <span
              className={`inline-block max-w-[85%] rounded-md px-2.5 py-1.5 text-[12px] ${
                m.role === "user" ? "bg-accent text-white" : "bg-bg-secondary text-text-primary"
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <span className="inline-block rounded-md bg-bg-secondary px-2.5 py-1.5 text-[12px] text-text-secondary">
              Thinking…
            </span>
          </div>
        )}
        {error && <p className="text-[12px] text-error">{error}</p>}
      </div>

      <div className="flex items-center gap-2 border-t border-border p-2.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              send();
            }
          }}
          disabled={loading}
          placeholder="Ask me anything…"
          className="flex-1 rounded-md border border-border bg-white px-2.5 py-1.5 text-[13px] text-text-primary outline-none transition-colors focus:border-accent disabled:opacity-60"
        />
        <button
          type="button"
          onClick={send}
          disabled={loading || !input.trim()}
          className="rounded-md bg-accent px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
