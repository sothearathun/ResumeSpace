import type { TemplateKey } from "@/lib/resume/types";

export type ResumeExample = {
  slug: string;
  roleTitle: string; // e.g. "Software Engineer"
  templateKey: TemplateKey; // sample content comes from sampleResumes[templateKey]
  summary: string; // one line for the index card
  whyItWorks: string[];
};

export const resumeExamples: ResumeExample[] = [
  {
    slug: "software-engineer-resume",
    roleTitle: "Software Engineer",
    templateKey: "minimal",
    summary: "A single-column, ATS-friendly resume for backend and full-stack roles.",
    whyItWorks: [
      "Single column with standard headings, so it parses cleanly through automated screening before a human ever sees it",
      "Technical skills are listed plainly, not buried in a sidebar or graphic an ATS might skip",
      "Bullets lead with what changed as a result of the work — processing time, incident rate — not just the task",
    ],
  },
  {
    slug: "marketing-specialist-resume",
    roleTitle: "Marketing Specialist",
    templateKey: "professional",
    summary: "A traditional layout built around campaign scope and measurable reach.",
    whyItWorks: [
      "The bold accent divider and centered header read as put-together without looking overdesigned for a corporate marketing team",
      "Numbers lead — list size, campaign cadence — since marketing hiring managers scan for scale first",
      "Chronological structure makes the progression from coordinator to specialist easy to follow",
    ],
  },
  {
    slug: "product-designer-resume",
    roleTitle: "Product Designer",
    templateKey: "modern",
    summary: "A design-forward layout that doubles as a small proof of design sense.",
    whyItWorks: [
      "The resume itself is a design artifact — for a design role, visual polish is part of the qualification, not just decoration",
      "A two-column layout keeps tools and skills scannable in a sidebar, next to a focused experience column",
      "Portfolio link sits in the header where it won't get missed",
    ],
  },
  {
    slug: "operations-executive-resume",
    roleTitle: "Operations Executive",
    templateKey: "executive",
    summary: "A centered, formal layout built for senior leadership resumes.",
    whyItWorks: [
      "Centered header and generous whitespace read as deliberate and senior, not decorative",
      "\"Areas of Expertise\" instead of a plain skills list matches how leadership resumes are usually written",
      "Dollar-figure and headcount impact are stated directly, which is what a board or VP-level reader is scanning for",
    ],
  },
  {
    slug: "business-analyst-resume",
    roleTitle: "Business Analyst",
    templateKey: "international",
    summary: "A photo-and-sidebar CV in the format expected across much of Europe.",
    whyItWorks: [
      "Matches the Europass-style format many EU employers still expect, photo included",
      "A dedicated languages section is relevant and often expected for cross-border analyst roles",
      "Skills and education sit in a persistent sidebar, so they're visible no matter how long the experience column runs",
    ],
  },
  {
    slug: "accountant-resume",
    roleTitle: "Senior Accountant",
    templateKey: "compact",
    summary: "A dense, ATS-friendly layout for a long, single-page work history.",
    whyItWorks: [
      "Tighter type and spacing fit twelve years of experience on one page without cutting the roles that show progression",
      "The CPA certification is called out on its own line instead of getting lost in a skills paragraph",
      "Still single-column and plainly labeled, so density doesn't cost it ATS compatibility",
    ],
  },
  {
    slug: "backend-engineer-resume",
    roleTitle: "Backend Engineer",
    templateKey: "technical",
    summary: "A skills-forward layout that reads like an engineer's own tech stack.",
    whyItWorks: [
      "Skills appear as individual tags right under the summary, the way engineers actually think about a stack",
      "Bullets lead with concrete technical metrics — latency, throughput — instead of vague ownership language",
      "A GitHub link sits next to contact info, where a technical reviewer expects to find it",
    ],
  },
  {
    slug: "academic-cv-example",
    roleTitle: "Postdoctoral Researcher",
    templateKey: "academic",
    summary: "An academic CV structured around education and publications, not a one-page limit.",
    whyItWorks: [
      "Education and publications come before teaching appointments, matching how search committees actually read a CV",
      "Publications get their own section with full citations, not folded into an \"achievements\" list",
      "Not capped at one page — academic CVs are expected to run as long as the record actually is",
    ],
  },
  {
    slug: "creative-director-resume",
    roleTitle: "Creative Director",
    templateKey: "portfolio",
    summary: "A bold, typography-led resume for design and creative leadership roles.",
    whyItWorks: [
      "Larger type and a confident header signal creative judgment before the reader gets to a single bullet point",
      "A named project is called out on its own, the way a portfolio piece would be, not folded into a job bullet",
      "Still readable and organized — bold doesn't mean illegible",
    ],
  },
  {
    slug: "growth-marketing-resume",
    roleTitle: "Growth Marketing Lead",
    templateKey: "bold",
    summary: "A full-color header resume for fast-moving, early-stage teams.",
    whyItWorks: [
      "The full-width color header matches the energy expected at an early-stage startup without needing a paragraph to say so",
      "Every bullet has a number attached — signups, CAC, spend — because growth roles are evaluated almost entirely on metrics",
      "Condensed layout respects that a startup reviewer is often reading resumes between other things, not carefully",
    ],
  },
  {
    slug: "student-resume-example",
    roleTitle: "Computer Science Student",
    templateKey: "graduate",
    summary: "A resume that leads with education and projects instead of a thin work history.",
    whyItWorks: [
      "Education comes first, with GPA and relevant coursework included — appropriate before you have years of work experience to lead with",
      "Projects get real space, since they often demonstrate more relevant skill than a single summer internship can",
      "Still fits in the same one-page, ATS-friendly structure recruiters expect from any applicant",
    ],
  },
];

export function getResumeExample(slug: string): ResumeExample | undefined {
  return resumeExamples.find((e) => e.slug === slug);
}
