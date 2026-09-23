import { resumeChat } from "@/lib/ai/generateResume";
import { enforceRateLimit, LIMITS } from "@/lib/apiGuard";

type ChatTurn = { role: "user" | "assistant"; content: string };

// Caps on what a single call can send to the paid AI provider.
const MAX_TURNS = 20;
const MAX_TURN_CHARS = 4000;
const MAX_FIELD_CHARS = 8000;
const MAX_LONG_TEXT_CHARS = 10000;
const MAX_SKILLS = 100;

function clamp(value: unknown, max: number): string | undefined {
  return typeof value === "string" ? value.slice(0, max) : undefined;
}

function parseChatMessages(value: unknown): ChatTurn[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (m): m is ChatTurn =>
        m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_TURN_CHARS) }));
}

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, LIMITS.generate);
  if (limited) return limited;

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
      fieldLabel: clamp(body.fieldLabel, 200),
      fieldKind: clamp(body.fieldKind, 50),
      fieldText: clamp(body.fieldText, MAX_FIELD_CHARS),
      context: {
        jobTitle: clamp(context.jobTitle, 200),
        company: clamp(context.company, 200),
        targetRole: clamp(context.targetRole, 200),
        jobDescription: clamp(context.jobDescription, MAX_LONG_TEXT_CHARS),
        skills: Array.isArray(context.skills)
          ? context.skills.filter((s): s is string => typeof s === "string").slice(0, MAX_SKILLS).map((s) => s.slice(0, 80))
          : [],
        experienceSummary: clamp(context.experienceSummary, MAX_LONG_TEXT_CHARS),
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
