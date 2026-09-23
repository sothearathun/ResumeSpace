import { createClient } from "@/lib/supabase/server";
import { enforceRateLimit, LIMITS } from "@/lib/apiGuard";

const KINDS = ["bug", "idea", "other"] as const;

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, LIMITS.feedback);
  if (limited) return limited;

  let body: { kind?: string; message?: string; email?: string; path?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const message = body.message?.trim() ?? "";
  const kind = KINDS.find((k) => k === body.kind);
  if (!kind || message.length < 1 || message.length > 2000) {
    return Response.json({ error: "Please write a short message (up to 2000 characters)." }, { status: 400 });
  }
  const email = body.email?.trim().slice(0, 254) || null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("feedback").insert({
      user_id: user?.id ?? null,
      kind,
      message,
      contact_email: email,
      page_path: body.path?.slice(0, 300) ?? null,
      user_agent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
    });
    if (error) throw error;
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Feedback submit failed", error);
    return Response.json({ error: "Couldn't send feedback — please try again." }, { status: 500 });
  }
}
