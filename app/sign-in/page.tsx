"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setStatus(error ? "error" : "sent");
  }

  async function handleGoogleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <section className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center px-4 py-24 sm:px-6">
        <h1 className="text-[24px] font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
          No password needed — we&rsquo;ll email you a link to sign in.
        </p>

        {status === "sent" ? (
          <p className="mt-8 rounded-lg border border-border bg-bg-secondary px-4 py-3 text-[14px] text-text-primary">
            Check <span className="font-medium">{email}</span> for a sign-in link.
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="mt-8 flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-[14px] font-medium text-text-primary transition-colors hover:bg-bg-secondary"
            >
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.7 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.6 39.6 16.3 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.8l6.6 5.6C41.4 36.3 44 30.6 44 24c0-1.3-.1-2.7-.4-3.5z" />
              </svg>
              Continue with Google
            </button>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[12px] text-text-secondary">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="rounded-lg border border-border bg-white px-3 py-2 text-[14px] text-text-primary outline-none transition-colors focus:border-accent"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-lg bg-accent px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send sign-in link"}
              </button>
              {status === "error" && (
                <p className="text-[13px] text-error">Couldn&rsquo;t send that — try again.</p>
              )}
            </form>
          </>
        )}
      </section>
      <Footer />
    </div>
  );
}
