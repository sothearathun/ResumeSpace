"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { migrateLocalDataToAccount } from "@/lib/resume/resumeService";
import { UserMenu } from "./UserMenu";

const navLinks = [
  { href: "/#templates", label: "Templates" },
  { href: "/master-resume", label: "Master Resume" },
  { href: "/resume-examples", label: "Examples" },
  // Blog and Pricing are hidden from nav for now — pages still exist, just
  // not linked yet. Re-add when ready:
  // { href: "/blog", label: "Blog" },
  // { href: "/pricing", label: "Pricing" },
];

export function Header({ statusText }: { statusText?: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      // Fires right after a magic-link click or Google sign-in completes —
      // the moment to upload whatever this browser built anonymously into
      // the account that just signed in.
      if (event === "SIGNED_IN" && session?.user) {
        migrateLocalDataToAccount(session.user.id).catch(() => {});
      }
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:h-[68px] lg:px-10">
        <Link href="/" className="flex items-center gap-2">
          {/* unoptimized: Next's resize pipeline quantizes this logo's
              antialiased transparent edges into a visible halo at icon size */}
          <Image
            src="/image.png"
            alt=""
            width={26}
            height={26}
            unoptimized
            className="rounded-md"
          />
          <span className="text-[17px] font-semibold tracking-tight">ResumeSpace</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {statusText && (
            <span className="hidden text-[13px] text-text-secondary sm:inline">{statusText}</span>
          )}
          {user ? (
            <UserMenu user={user} onSignOut={handleSignOut} />
          ) : (
            <Link
              href="/sign-in"
              className="hidden text-[14px] text-text-secondary transition-colors hover:text-text-primary sm:inline"
            >
              Sign in
            </Link>
          )}
          <Link
            href="/builder"
            className="rounded-lg bg-accent px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Create resume
          </Link>
        </div>
      </div>
    </header>
  );
}
