import { createClient } from "@supabase/supabase-js";

// Server-only. Uses the service-role key, which bypasses RLS — never import
// this from a client component and never expose the key to the browser.
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
