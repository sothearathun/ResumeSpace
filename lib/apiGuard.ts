import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ResumeDraft } from "@/lib/resume/types";

type Tier = { limit: number; windowSeconds: number };
type Policy = { name: string; anonymous: Tier; signedIn: Tier };

const HOUR = 3600;

// AI routes cost money per call, so they're the tightest; the PDF routes cost
// server CPU; check-overflow fires automatically (debounced) while editing, so
// it gets generous headroom.
export const LIMITS = {
  generate: { name: "generate", anonymous: { limit: 30, windowSeconds: HOUR }, signedIn: { limit: 100, windowSeconds: HOUR } },
  tailor: { name: "tailor", anonymous: { limit: 5, windowSeconds: HOUR }, signedIn: { limit: 20, windowSeconds: HOUR } },
  pdf: { name: "pdf", anonymous: { limit: 30, windowSeconds: HOUR }, signedIn: { limit: 100, windowSeconds: HOUR } },
  fitToPage: { name: "fit", anonymous: { limit: 60, windowSeconds: HOUR }, signedIn: { limit: 200, windowSeconds: HOUR } },
  checkOverflow: { name: "overflow", anonymous: { limit: 600, windowSeconds: HOUR }, signedIn: { limit: 1200, windowSeconds: HOUR } },
  feedback: { name: "feedback", anonymous: { limit: 5, windowSeconds: HOUR }, signedIn: { limit: 20, windowSeconds: HOUR } },
} satisfies Record<string, Policy>;

function clientIp(request: Request): string {
  // On Vercel these are set by the platform, not the caller.
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

// Stored hashed so the rate-limit table never holds raw IP addresses.
function hashed(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

/**
 * Returns a 429 Response when the caller is over the policy's limit, otherwise
 * null. Signed-in users are counted by verified user id (higher limit); everyone
 * else by IP. If the limiter itself is unavailable it fails open, because
 * blocking every real user is worse than briefly not limiting — but it logs
 * loudly so a missing SUPABASE_SERVICE_ROLE_KEY doesn't go unnoticed.
 */
export async function enforceRateLimit(request: Request, policy: Policy): Promise<Response | null> {
  try {
    const admin = createAdminClient();
    if (!admin) {
      console.error("Rate limiting is DISABLED: SUPABASE_SERVICE_ROLE_KEY is not set");
      return null;
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const tier = user ? policy.signedIn : policy.anonymous;
    const identity = user ? `u:${user.id}` : `ip:${hashed(clientIp(request))}`;

    const { data, error } = await admin.rpc("check_rate_limit", {
      p_key: `${policy.name}:${identity}`,
      p_limit: tier.limit,
      p_window_seconds: tier.windowSeconds,
    });
    if (error) throw error;
    if (data === true) return null;

    const retryAfter = tier.windowSeconds - (Math.floor(Date.now() / 1000) % tier.windowSeconds);
    return Response.json(
      { error: "RATE_LIMITED" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  } catch (error) {
    console.error("Rate limit check failed; allowing request", error);
    return null;
  }
}

const MAX_DRAFT_CHARS = 200_000;

/** Guards the CPU-heavy PDF routes against absurdly large drafts. The inline
 * photo is excluded — it's a bounded image, not text a renderer has to lay out. */
export function draftTooLarge(draft: ResumeDraft): boolean {
  const contact = { ...draft.contact, photoDataUrl: undefined };
  return JSON.stringify({ ...draft, contact }).length > MAX_DRAFT_CHARS;
}

export function tooLarge(): Response {
  return Response.json({ error: "Request too large" }, { status: 413 });
}
