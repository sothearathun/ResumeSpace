import type { ResumeContent } from "@/lib/resume/types";
import { analyzeMasterResume } from "@/lib/ai/tailorResume";

export async function POST(request: Request) {
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

  try {
    const analysis = await analyzeMasterResume({
      master,
      targetRole: typeof body.targetRole === "string" ? body.targetRole : undefined,
      jobDescription: typeof body.jobDescription === "string" ? body.jobDescription : undefined,
    });
    return Response.json(analysis);
  } catch (error) {
    console.error("Tailor analysis failed", error);
    return Response.json({ error: "AI_PROVIDER_ERROR" }, { status: 502 });
  }
}

// Rendering PDFs / calling the AI can outlast a serverless default timeout.
export const maxDuration = 60;
