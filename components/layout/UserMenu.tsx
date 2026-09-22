"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

function initialsFor(user: User): string {
  const source = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "?";
  const letters = source
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return letters || "?";
}

function avatarUrlFor(user: User): string | undefined {
  // Supabase normally copies Google's picture into top-level user_metadata,
  // but fall back to the raw identity data too in case it wasn't copied.
  const fromMetadata = (user.user_metadata?.avatar_url ?? user.user_metadata?.picture) as
    | string
    | undefined;
  if (fromMetadata) return fromMetadata;

  const identityData = user.identities?.[0]?.identity_data as Record<string, unknown> | undefined;
  return (identityData?.avatar_url ?? identityData?.picture) as string | undefined;
}

export function UserMenu({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarUrl = avatarUrlFor(user);
  const name = (user.user_metadata?.full_name as string | undefined) ?? user.email;

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-accent text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
      >
        {avatarUrl && !imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          initialsFor(user)
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 z-20 mt-2 w-56 rounded-lg border border-border bg-white py-1 shadow-sm">
          <div className="border-b border-border px-3 py-2">
            <p className="truncate text-[13px] font-medium text-text-primary">{name}</p>
            <p className="truncate text-[12px] text-text-secondary">{user.email}</p>
          </div>
          <Link
            href="/my-resumes"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-[13px] text-text-primary hover:bg-bg-secondary"
          >
            My Resume
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="block w-full px-3 py-2 text-left text-[13px] text-text-primary hover:bg-bg-secondary"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
