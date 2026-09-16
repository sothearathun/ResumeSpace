import type { ResumeContent, ResumeExperience } from "./types";

const STOPWORDS = new Set([
  "the", "and", "for", "with", "you", "your", "our", "are", "will", "have",
  "has", "this", "that", "from", "into", "who", "what", "when", "where",
  "job", "role", "work", "working", "team", "teams", "years", "year", "experience",
  "ability", "able", "strong", "excellent", "including", "such", "etc", "using",
  "responsibilities", "requirements", "required", "preferred", "must", "plus",
  "about", "across", "within", "other", "than", "also", "can", "not", "all",
  "new", "one", "more", "most", "each", "any", "per", "via",
]);

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9+#.]+/g) ?? []).filter(
    (word) => word.length > 2 && !STOPWORDS.has(word)
  );
}

function scoreAgainst(text: string, keywords: Set<string>): number {
  let score = 0;
  for (const word of tokenize(text)) {
    if (keywords.has(word)) score += 1;
  }
  return score;
}

const MIN_SKILLS = 6;
const MAX_BULLETS_PER_JOB = 4;
const MAX_JOBS = 5;

function selectSkills(skills: string[], keywords: Set<string>): string[] {
  const scored = skills.map((skill) => ({ skill, score: scoreAgainst(skill, keywords) }));
  const matched = scored.filter((s) => s.score > 0).map((s) => s.skill);
  const unmatched = scored.filter((s) => s.score === 0).map((s) => s.skill);
  if (matched.length >= MIN_SKILLS) return matched;
  return [...matched, ...unmatched.slice(0, MIN_SKILLS - matched.length)];
}

function trimBullets(job: ResumeExperience, keywords: Set<string>): ResumeExperience {
  if (job.bullets.length <= MAX_BULLETS_PER_JOB) return job;
  const scored = job.bullets.map((bullet) => ({
    bullet,
    score: scoreAgainst(bullet, keywords) + scoreAgainst(job.jobTitle, keywords),
  }));
  const topBullets = new Set(
    [...scored]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_BULLETS_PER_JOB)
      .map((s) => s.bullet)
  );
  // Keep the original bullet order among the ones selected, rather than
  // resorting by score — reads more naturally than a shuffled list.
  return { ...job, bullets: job.bullets.filter((b) => topBullets.has(b)) };
}

function selectExperience(experience: ResumeExperience[], keywords: Set<string>): ResumeExperience[] {
  let jobs = experience;
  if (jobs.length > MAX_JOBS) {
    const scored = experience.map((job, index) => ({
      index,
      score:
        scoreAgainst(job.jobTitle, keywords) +
        job.bullets.reduce((sum, b) => sum + scoreAgainst(b, keywords), 0),
    }));
    const keepIndexes = new Set(
      [...scored]
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_JOBS)
        .map((s) => s.index)
    );
    // Preserve chronological order among the kept jobs.
    jobs = experience.filter((_, index) => keepIndexes.has(index));
  }
  return jobs.map((job) => trimBullets(job, keywords));
}

export type TailorResult = {
  content: ResumeContent;
  matchedSkills: string[];
  missingKeywords: string[];
};

/** Selects and reorders the most relevant parts of a master resume for a
 * given job description, using keyword overlap — not generative rewriting.
 * Every word in the result already existed in the master resume; this only
 * decides what to keep, trim, and prioritize. */
export function tailorContentToJob(master: ResumeContent, jobText: string, targetRole?: string): TailorResult {
  const keywordSource = [targetRole, jobText].filter(Boolean).join(" ");
  const keywords = new Set(tokenize(keywordSource));

  if (keywords.size === 0) {
    return { content: structuredClone(master), matchedSkills: [], missingKeywords: [] };
  }

  const skills = selectSkills(master.skills, keywords);
  const experience = selectExperience(master.experience, keywords);

  const matchedSkills = master.skills.filter((skill) => scoreAgainst(skill, keywords) > 0);

  const mentioned = new Set(
    [...master.skills, ...master.experience.flatMap((j) => j.bullets), master.summary]
      .flatMap((text) => tokenize(text))
  );
  const missingKeywords = [...keywords].filter((k) => !mentioned.has(k)).slice(0, 8);

  return {
    content: { ...structuredClone(master), skills, experience },
    matchedSkills,
    missingKeywords,
  };
}
