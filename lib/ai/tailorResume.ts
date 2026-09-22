import type { ResumeContent } from "@/lib/resume/types";
import type { TailorAnalysis } from "@/lib/resume/tailor";
import { getDeepSeekClient } from "./deepseekClient";

const SYSTEM_PROMPT =
  "You are an expert resume strategist. You are given a candidate's complete master resume plus the role " +
  "they are applying for (and possibly a job description). Decide what belongs in a resume tailored to " +
  "that role. Be decisive and selective — a focused resume beats a complete history.\n\n" +
  "Rules:\n" +
  "- Experience: DROP jobs whose work clearly doesn't transfer to the target role (for example, a web " +
  "developer job is not relevant to a product designer application unless its bullets show design work). " +
  "Keep jobs that are relevant or that show transferable skills for the role. Give each a relevance score " +
  "0-100 and a short reason (max 12 words). For kept jobs, list the 2-4 most relevant bullet indexes " +
  "(0-based). If a kept job has no bullets, return an empty list.\n" +
  "- Education: keep entries relevant to the role and the candidate's highest level of education; drop " +
  "the rest. Short reason (max 10 words).\n" +
  "- Skills: return ONLY skills that genuinely help for this role, taken from the candidate's own skills " +
  "list and spelled exactly as given, most relevant first. Leave out skills that belong to a different " +
  "field (e.g. Docker, Kubernetes or SQL for a designer role) — never pad the list to reach a number.\n" +
  "- Summary: rewrite it in 2-3 sentences aimed at the target role, using ONLY facts present in the resume. " +
  "Never invent employers, degrees, numbers or achievements. Single paragraph, no line breaks.\n\n" +
  "Respond with JSON only, in exactly this shape:\n" +
  '{"summary": string, "experience": [{"id": string, "relevance": number, "keep": boolean, "reason": string, ' +
  '"keepBullets": number[]}], "education": [{"id": string, "keep": boolean, "reason": string}], ' +
  '"skills": string[]}';

function describeMaster(master: ResumeContent): string {
  const experience = master.experience
    .map((job) =>
      [
        `- id=${job.id} | ${job.jobTitle} at ${job.company} (${job.startDate} - ${job.endDate})`,
        ...job.bullets.map((b, i) => `    [${i}] ${b}`),
      ].join("\n")
    )
    .join("\n");
  const education = master.education
    .map((edu) => `- id=${edu.id} | ${edu.degree}, ${edu.institution} (${edu.gradYear})`)
    .join("\n");
  return [
    `SUMMARY: ${master.summary || "(none)"}`,
    `EXPERIENCE:\n${experience || "(none)"}`,
    `EDUCATION:\n${education || "(none)"}`,
    `SKILLS: ${master.skills.join(", ") || "(none)"}`,
  ].join("\n\n");
}

function normalize(raw: unknown, master: ResumeContent): TailorAnalysis {
  const data = (raw ?? {}) as Record<string, unknown>;
  const list = (value: unknown): Record<string, unknown>[] =>
    Array.isArray(value) ? value.filter((v): v is Record<string, unknown> => !!v && typeof v === "object") : [];

  const expById = new Map(list(data.experience).map((e) => [String(e.id), e]));
  const eduById = new Map(list(data.education).map((e) => [String(e.id), e]));

  const experience = master.experience.map((job) => {
    const item = expById.get(job.id);
    const bullets = Array.isArray(item?.keepBullets)
      ? (item.keepBullets as unknown[]).filter(
          (n): n is number => Number.isInteger(n) && (n as number) >= 0 && (n as number) < job.bullets.length
        )
      : [];
    return {
      id: job.id,
      relevance: Math.max(0, Math.min(100, Number(item?.relevance) || 0)),
      keep: item ? item.keep === true : true,
      reason: typeof item?.reason === "string" ? item.reason.slice(0, 160) : "",
      keepBullets: bullets.length > 0 ? [...new Set(bullets)].sort((a, b) => a - b) : job.bullets.map((_, i) => i),
    };
  });

  const education = master.education.map((edu) => {
    const item = eduById.get(edu.id);
    return {
      id: edu.id,
      keep: item ? item.keep === true : true,
      reason: typeof item?.reason === "string" ? item.reason.slice(0, 160) : "",
    };
  });

  const masterSkills = new Set(master.skills);
  const aiSkills = Array.isArray(data.skills)
    ? (data.skills as unknown[]).filter((s): s is string => typeof s === "string" && masterSkills.has(s))
    : [];

  return {
    summary: typeof data.summary === "string" && data.summary.trim() ? data.summary.trim() : master.summary,
    experience,
    education,
    skills: aiSkills.length > 0 ? [...new Set(aiSkills)] : master.skills,
    source: "ai",
  };
}

export async function analyzeMasterResume(input: {
  master: ResumeContent;
  targetRole?: string;
  jobDescription?: string;
}): Promise<TailorAnalysis> {
  const userMessage = [
    `TARGET ROLE: ${input.targetRole?.trim() || "(not given — infer from the job description)"}`,
    input.jobDescription?.trim() && `JOB DESCRIPTION:\n${input.jobDescription.trim().slice(0, 6000)}`,
    `CANDIDATE MASTER RESUME:\n${describeMaster(input.master)}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const completion = await getDeepSeekClient().chat.completions.create({
    model: "deepseek-chat",
    temperature: 0.2,
    max_tokens: 2000,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  return normalize(JSON.parse(raw), input.master);
}
