import type { ResumeContent } from "./types";
import { tokenize, scoreAgainst } from "./keywords";

/** What to include in a tailored resume, decided by analysis (AI or the
 * keyword fallback) and then adjustable by the user before anything is
 * created. Ids refer to entries in the master resume. */
export type TailorAnalysis = {
  summary: string;
  experience: { id: string; relevance: number; keep: boolean; reason: string; keepBullets: number[] }[];
  education: { id: string; keep: boolean; reason: string }[];
  /** Skills to keep, most relevant first. */
  skills: string[];
  source: "ai" | "keywords";
};

/** The user's final choices, after reviewing the analysis. */
export type TailorSelection = {
  summary: string;
  experience: { id: string; bullets: number[] }[];
  education: string[];
  skills: string[];
};

const MIN_SKILLS = 6;
const MAX_BULLETS_PER_JOB = 4;

/** Offline fallback when the AI analysis isn't available: keeps jobs that
 * share vocabulary with the target role/job description, drops the rest. */
export function keywordAnalysis(master: ResumeContent, jobText: string, targetRole?: string): TailorAnalysis {
  const keywords = new Set(tokenize([targetRole, jobText].filter(Boolean).join(" ")));

  const jobScores = master.experience.map((job) => ({
    job,
    score: scoreAgainst(job.jobTitle, keywords) * 2 + job.bullets.reduce((sum, b) => sum + scoreAgainst(b, keywords), 0),
  }));
  const bestScore = Math.max(0, ...jobScores.map((j) => j.score));
  const noSignal = keywords.size === 0 || bestScore === 0;

  const experience = jobScores.map(({ job, score }) => {
    const bulletScores = job.bullets.map((b, i) => ({ i, score: scoreAgainst(b, keywords) }));
    const top = [...bulletScores].sort((a, b) => b.score - a.score).slice(0, MAX_BULLETS_PER_JOB);
    return {
      id: job.id,
      relevance: bestScore === 0 ? 50 : Math.round((score / bestScore) * 100),
      keep: noSignal || score > 0,
      reason: noSignal ? "" : score > 0 ? "Shares keywords with the role" : "No overlap with the role's keywords",
      keepBullets: top.map((t) => t.i).sort((a, b) => a - b),
    };
  });

  const scoredSkills = master.skills.map((skill) => ({ skill, score: scoreAgainst(skill, keywords) }));
  const matched = scoredSkills.filter((s) => s.score > 0).map((s) => s.skill);
  const rest = scoredSkills.filter((s) => s.score === 0).map((s) => s.skill);
  const skills = matched.length >= MIN_SKILLS ? matched : [...matched, ...rest.slice(0, MIN_SKILLS - matched.length)];

  return {
    summary: master.summary,
    experience,
    education: master.education.map((edu) => ({ id: edu.id, keep: true, reason: "" })),
    skills,
    source: "keywords",
  };
}

/** Builds resume content from the master resume using only what the user
 * kept. Entries stay in their original order; skills follow the selection's
 * order (most relevant first). */
export function buildTailoredContent(master: ResumeContent, selection: TailorSelection): ResumeContent {
  const clone = structuredClone(master);
  const bulletsByJob = new Map(selection.experience.map((e) => [e.id, new Set(e.bullets)]));
  const eduKeep = new Set(selection.education);
  const masterSkills = new Set(master.skills);

  return {
    ...clone,
    summary: selection.summary,
    experience: clone.experience
      .filter((job) => bulletsByJob.has(job.id))
      .map((job) => ({ ...job, bullets: job.bullets.filter((_, i) => bulletsByJob.get(job.id)!.has(i)) })),
    education: clone.education.filter((edu) => eduKeep.has(edu.id)),
    skills: selection.skills.filter((skill) => masterSkills.has(skill)),
  };
}
