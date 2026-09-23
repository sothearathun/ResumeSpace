import type { ResumeContent } from "@/lib/resume/types";
import { analyzeMasterResume } from "@/lib/ai/tailorResume";
import { enforceRateLimit, LIMITS, tooLarge } from "@/lib/apiGuard";

// Text of the master resume that gets sent to the paid AI provider. The inline
// photo is excluded from the count — it never goes to the model.
const MAX_MASTER_CHARS = 100_000;
const MAX_JOB_DESCRIPTION_CHARS = 10_000;

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, LIMITS.tailor);
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const master = body.master as ResumeContent | undefined;
  if (!master || !Array.isArray(master.experience) || !Array.isArray(master.education) || !Array.isArray(master.skills)) {
    return Response.json({ error: "Missing master resume" }, { status: 400 });
  }
  if (JSON.stringify({ ...master, contact: { ...master.contact, photoDataUrl: undefined } }).length > MAX_MASTER_CHARS) {
    return tooLarge();
  }

  try {
    const analysis = await analyzeMasterResume({
      master,
      targetRole: typeof body.targetRole === "string" ? body.targetRole.slice(0, 200) : undefined,
      jobDescription:
        typeof body.jobDescription === "string" ? body.jobDescription.slice(0, MAX_JOB_DESCRIPTION_CHARS) : undefined,
    });
    return Response.json(analysis);
  } catch (error) {
    console.error("Tailor analysis failed", error);
    return Response.json({ error: "AI_PROVIDER_ERROR" }, { status: 502 });
  }
}

// Rendering PDFs / calling the AI can outlast a serverless default timeout.
export const maxDuration = 60;
