import { resumeChat } from "@/lib/ai/generateResume";

type ChatTurn = { role: "user" | "assistant"; content: string };

function parseChatMessages(value: unknown): ChatTurn[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (m): m is ChatTurn =>
      m &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.trim().length > 0
  );
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (body.action !== "resume-chat") {
    return Response.json({ error: "Unknown action" }, { status: 400 });
  }

  const messages = parseChatMessages(body.messages);
  if (messages.length === 0) {
    return Response.json({ error: "messages is required" }, { status: 400 });
  }

  const context = (body.context ?? {}) as Record<string, unknown>;

  try {
    const result = await resumeChat({
      messages,
      fieldLabel: typeof body.fieldLabel === "string" ? body.fieldLabel : undefined,
      fieldKind: typeof body.fieldKind === "string" ? body.fieldKind : undefined,
      fieldText: typeof body.fieldText === "string" ? body.fieldText : undefined,
      context: {
        jobTitle: typeof context.jobTitle === "string" ? context.jobTitle : undefined,
        company: typeof context.company === "string" ? context.company : undefined,
        targetRole: typeof context.targetRole === "string" ? context.targetRole : undefined,
        jobDescription: typeof context.jobDescription === "string" ? context.jobDescription : undefined,
        skills: Array.isArray(context.skills) ? context.skills : [],
        experienceSummary: typeof context.experienceSummary === "string" ? context.experienceSummary : undefined,
      },
    });
    return Response.json(result);
  } catch (error) {
    console.error("AI generate request failed", error);
    return Response.json({ error: "AI_PROVIDER_ERROR" }, { status: 502 });
  }
}

// Rendering PDFs / calling the AI can outlast a serverless default timeout.
export const maxDuration = 60;
