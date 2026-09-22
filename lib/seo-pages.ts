import type { FaqItem } from "./seo";

export type SeoSection = {
  heading: string;
  paragraphs?: string[];
  points?: { title: string; text: string }[];
};

export type SeoPageConfig = {
  slug: string;
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  eyebrow: string;
  h1: string;
  intro: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  sections: SeoSection[];
  faq: FaqItem[];
  related: string[];
};

export const homeFaq: FaqItem[] = [
  {
    q: "Is ResumeSpace really a free resume builder?",
    a: "Yes. You can build, edit and download your resume as a PDF for free, with no sign-up and no credit card. Your resumes are saved in your browser, so you can start immediately.",
  },
  {
    q: "What is a master resume?",
    a: "A master resume is one complete document that holds your entire career history: every job, every bullet point, every skill and every degree. Instead of rewriting your resume for each application, you keep your master resume up to date and generate a shorter, tailored version from it whenever you apply.",
  },
  {
    q: "How does the AI resume builder work?",
    a: "The AI Helper works on whichever field you are editing. Ask it to write a first draft of your summary, tighten a bullet point, or suggest skills, and it updates that field. For tailoring, it analyzes your master resume against a target role or job description and suggests which experience, education and skills to include. You review and change every choice before anything is created.",
  },
  {
    q: "Will the AI make things up on my resume?",
    a: "It is instructed not to invent employers, degrees, certifications, dates or numbers that are not already in your resume. It rewrites and selects from what you provide. You should still read every line, because you are the one sending the resume.",
  },
  {
    q: "Are the resume templates ATS-friendly?",
    a: "Several templates are built specifically for applicant tracking systems, with a clean single-column structure and standard section headings. Each template is labelled, so you can pick an ATS-friendly design or a more visual one depending on the role.",
  },
  {
    q: "Can I make a CV as well as a resume?",
    a: "Yes. The same editor and templates work for a CV. There is an academic CV template for research and teaching roles and an international template for CVs commonly used in Europe and Asia, including an optional photo.",
  },
];

export const seoPages: SeoPageConfig[] = [
  {
    slug: "ai-resume-builder",
    navLabel: "AI resume builder",
    metaTitle: "Free AI Resume Builder — Write & Tailor Your Resume with AI",
    metaDescription:
      "Use a free AI resume builder to write your summary and bullet points, tailor your resume to any job description, and download an ATS-friendly PDF. No sign-up needed.",
    keywords: ["AI resume builder", "AI resume generator", "AI resume writer", "free AI resume builder", "resume AI"],
    eyebrow: "Free AI resume builder",
    h1: "A free AI resume builder that writes with you, not instead of you",
    intro:
      "ResumeSpace pairs a clean resume editor with an AI writing assistant. Get a first draft of your summary in seconds, sharpen weak bullet points, and tailor your whole resume to a job description, all for free and without creating an account.",
    primaryCta: { label: "Create my free AI resume", href: "/builder" },
    secondaryCta: { label: "Try the master resume", href: "/master-resume" },
    sections: [
      {
        heading: "What our AI resume builder does",
        points: [
          {
            title: "Writes the parts you get stuck on",
            text: "Click into your summary, experience bullets or skills and ask the AI Helper for a draft. Even a single word like your job title is enough to get a reasonable first version to edit.",
          },
          {
            title: "Rewrites what you already have",
            text: "Ask for a shorter version, stronger wording, a more confident tone or a mention of a specific skill. The AI adjusts the exact field you are editing and leaves the rest alone.",
          },
          {
            title: "Tailors your resume to a job",
            text: "Give it a target role or paste a job description and the AI analyzes your master resume, scoring each job for relevance and recommending which experience, education and skills to keep.",
          },
          {
            title: "Keeps you in control",
            text: "Every AI suggestion lands in a normal editable field, and the tailoring step ends with a review screen where you tick or untick each job, bullet, degree and skill before your resume is created.",
          },
        ],
      },
      {
        heading: "How to make an AI resume in four steps",
        points: [
          { title: "1. Start free", text: "Open the builder and choose a template. There is nothing to install and no account to create." },
          { title: "2. Add your details", text: "Fill in your contact details, experience, education and skills, or use your master resume as the starting point." },
          { title: "3. Ask the AI Helper", text: "Click into any field and tell the assistant what you need: a first draft, a rewrite or a list of skills to consider." },
          { title: "4. Download your PDF", text: "Check the live preview, use fit to one page if you want a single page, and download an ATS-friendly PDF." },
        ],
      },
      {
        heading: "Using AI on your resume, honestly",
        paragraphs: [
          "An AI resume builder is most useful for the blank-page problem: turning rough notes into clear sentences and finding stronger verbs. It is not a substitute for knowing your own work. The best results come from giving the AI real details, such as what you built, who it helped and what changed, and then editing the output until it sounds like you.",
          "ResumeSpace's AI is instructed not to invent employers, degrees, dates or metrics. If a bullet needs a number, add the real one yourself. Recruiters and hiring managers read a lot of generic AI text, so specific, accurate detail is what makes a resume stand out.",
        ],
      },
      {
        heading: "AI resume builder vs. an AI resume generator",
        paragraphs: [
          "Many AI resume generators produce a whole resume from a prompt, which often means made-up experience you then have to fact-check. ResumeSpace works the other way around: your real career history lives in your master resume, and the AI helps you select, phrase and prioritize it for each job.",
        ],
      },
    ],
    faq: [
      {
        q: "Is the AI resume builder free?",
        a: "Yes. You can use the editor, the AI Helper and PDF download for free, with no sign-up and no credit card required.",
      },
      {
        q: "Will AI invent experience on my resume?",
        a: "The AI is told not to make up employers, degrees, dates or numbers. It rewrites and selects from the information you provide. Always read the result before you send it.",
      },
      {
        q: "Can AI tailor my resume to a job description?",
        a: "Yes. Enter a target role or paste the job description on the Master Resume page. The AI recommends which experience, education and skills fit the role, and you review the selection before creating the resume.",
      },
      {
        q: "Is an AI-written resume ATS-friendly?",
        a: "ATS compatibility comes mostly from layout, not from who wrote the words. Choose one of the ATS-friendly templates and the resume exports as a clean, text-based PDF.",
      },
      {
        q: "Do I need an account to use the AI resume writer?",
        a: "No. You can start writing straight away. Your resumes are stored in your browser on your device.",
      },
    ],
    related: ["master-resume-builder", "free-resume-builder", "cv-maker"],
  },
  {
    slug: "free-resume-builder",
    navLabel: "Free resume builder",
    metaTitle: "Free Resume Builder — Make a Resume Online & Download PDF",
    metaDescription:
      "Make a professional resume online with a free resume builder. Pick a template, add your experience with AI help, and download a PDF. No sign-up, no credit card.",
    keywords: ["free resume builder", "resume maker", "make a resume", "create a resume online", "free resume maker", "resume builder no sign up"],
    eyebrow: "Free resume maker",
    h1: "Free resume builder: make a resume online in minutes",
    intro:
      "Pick a professional template, fill in your details, and download a polished resume as a PDF. ResumeSpace is free to use, works without an account, and includes an AI assistant for the parts that are hard to write.",
    primaryCta: { label: "Make my free resume", href: "/builder" },
    secondaryCta: { label: "Browse templates", href: "/#templates" },
    sections: [
      {
        heading: "Free, with no catch to get started",
        paragraphs: [
          "You can build a resume, edit it as often as you like and download it as a PDF without paying and without signing up. There is no credit card form and no email wall between you and your resume.",
          "Because your resumes are saved in your own browser, you can close the tab and come back to continue editing on the same device.",
        ],
      },
      {
        heading: "How to make a resume online",
        points: [
          { title: "Choose a template", text: "Browse eleven templates, from clean single-column designs made for applicant tracking systems to colorful layouts with a photo." },
          { title: "Add your information", text: "Enter your contact details, work experience, education and skills. Sections you do not need can simply stay empty, and optional sections like projects or certifications can be added." },
          { title: "Get help with the wording", text: "Use the AI Helper to draft a summary, improve bullet points or suggest skills based on your experience." },
          { title: "Fit it to the page", text: "Use fit to one page to size the text so everything lands on a single page, or let a longer resume flow onto two or more pages." },
          { title: "Download your PDF", text: "Export a clean, text-based PDF that is ready to attach to any application." },
        ],
      },
      {
        heading: "What you get",
        points: [
          { title: "ATS-friendly designs", text: "Templates labelled ATS-friendly use a simple structure and standard headings that applicant tracking systems read reliably." },
          { title: "Live preview", text: "See the finished resume update as you type, including page breaks for longer resumes." },
          { title: "Change templates anytime", text: "Switch to a different design in the same editor without re-entering anything." },
          { title: "Master resume support", text: "Keep all your experience in one master resume and generate a tailored version for each job." },
        ],
      },
      {
        heading: "A resume for any stage of your career",
        paragraphs: [
          "Students and new graduates can lead with education and projects using the graduate template. Experienced professionals can use a traditional layout that puts work history first, and senior leaders have an executive design. Browse our resume examples for role-specific inspiration in engineering, design, marketing, finance and more.",
        ],
      },
    ],
    faq: [
      {
        q: "Is this resume builder really free?",
        a: "Yes. Building, editing and downloading your resume as a PDF is free, with no sign-up and no credit card.",
      },
      {
        q: "Do I need to create an account?",
        a: "No. Open the builder and start. Your resume is saved in your browser on your device.",
      },
      {
        q: "Can I download my resume as a PDF?",
        a: "Yes. The download button exports a clean PDF that keeps selectable text, so applicant tracking systems can read it.",
      },
      {
        q: "How do I make a resume with no work experience?",
        a: "Use the graduate template, which leads with education, projects and skills. Add internships, volunteering, coursework and achievements, and ask the AI Helper to phrase them as clear bullet points.",
      },
      {
        q: "How long should my resume be?",
        a: "One page is the norm for most early and mid-career roles. If you have a longer history, two pages is acceptable. ResumeSpace can shrink your resume to one page or let it flow naturally onto extra pages.",
      },
    ],
    related: ["ai-resume-builder", "master-resume-builder", "cv-maker"],
  },
  {
    slug: "master-resume-builder",
    navLabel: "Master resume builder",
    metaTitle: "Master Resume Builder — Free Tool to Build & Tailor Your Master Resume",
    metaDescription:
      "Build a master resume once, then use AI to generate a tailored resume for every job. Free master resume builder: keep all your experience in one place and pick what fits each role.",
    keywords: ["master resume", "master resume builder", "master resume template", "what is a master resume", "master resume generator", "tailor resume"],
    eyebrow: "Free master resume builder",
    h1: "Master resume builder: write your career history once, tailor it forever",
    intro:
      "A master resume is your complete career record in one place. ResumeSpace's free master resume builder lets you enter everything once, then uses AI to pick the experience, education and skills that fit each job, so every application gets a focused, tailored resume in minutes.",
    primaryCta: { label: "Build my master resume", href: "/master-resume" },
    secondaryCta: { label: "Start a single resume", href: "/builder" },
    sections: [
      {
        heading: "What is a master resume?",
        paragraphs: [
          "A master resume is a single, comprehensive document that lists every job you have held, every accomplishment worth mentioning, every skill, certification and degree. It is deliberately long and is never sent to an employer. It is the source you copy from.",
          "When you apply for a role, you pull the most relevant parts of your master resume into a shorter, targeted resume. That keeps your applications focused while making sure you never forget a project or achievement from years ago.",
        ],
      },
      {
        heading: "Why use a master resume",
        points: [
          { title: "Stop rewriting from scratch", text: "Update your master resume once when something changes and every future tailored resume benefits." },
          { title: "Tailor without guessing", text: "Instead of deciding what to cut by feel, see which jobs and skills are most relevant to the role you are applying for." },
          { title: "Never lose a great bullet", text: "Achievements that do not fit today's resume stay safely in your master resume for the next one." },
          { title: "Apply faster", text: "Generating a tailored resume takes a few minutes instead of an evening of editing." },
        ],
      },
      {
        heading: "How the ResumeSpace master resume builder works",
        points: [
          { title: "1. Enter everything once", text: "Add your contact details, summary, every job with all its bullets, education, skills and optional sections such as certifications and projects." },
          { title: "2. Tell us the target", text: "Enter the role you want and paste the job description if you have it." },
          { title: "3. AI analyzes your history", text: "The AI scores each job for relevance, explains why, drops experience that does not transfer, picks the strongest bullets and skills, and drafts a summary aimed at the role." },
          { title: "4. You review and choose", text: "A review screen lists every job, bullet, degree and skill with a checkbox. Tick or untick anything before creating the resume." },
          { title: "5. Pick a template and edit", text: "Your tailored resume opens in the editor in the template you chose. Your master resume stays untouched." },
        ],
      },
      {
        heading: "Master resume tips",
        paragraphs: [
          "Write your master resume as if space did not matter. Include the metrics, tools and outcomes for every role. It is much easier to remove detail from a full record than to remember it later.",
          "Review it every few months, and after any big project, promotion or new certification. A master resume is only useful if it stays current. For a deeper guide, read our article on what a master resume is and how to build one.",
        ],
      },
    ],
    faq: [
      {
        q: "What is a master resume?",
        a: "A master resume is a complete record of your career, including every job, bullet, skill and degree. You never send it directly. You use it to build shorter, tailored resumes for each application.",
      },
      {
        q: "What is the difference between a master resume and a regular resume?",
        a: "A regular resume is short and targeted at one job. A master resume is long and comprehensive, and is the source your targeted resumes are made from.",
      },
      {
        q: "How long should a master resume be?",
        a: "As long as it needs to be. Many master resumes run to several pages because they hold everything. Only the tailored versions you send need to fit one or two pages.",
      },
      {
        q: "Is the master resume builder free?",
        a: "Yes. Building your master resume and generating tailored resumes from it is free, with no sign-up required.",
      },
      {
        q: "Where is my master resume stored?",
        a: "In your browser on your own device. When you ask the AI to analyze it for a role, the relevant text is sent to our AI provider to produce the selection.",
      },
      {
        q: "Can I change what the AI picks?",
        a: "Yes. The analysis is a recommendation. On the review screen you can tick or untick any job, bullet, education entry or skill and edit the summary before creating your resume.",
      },
    ],
    related: ["ai-resume-builder", "free-resume-builder", "cv-maker"],
  },
  {
    slug: "cv-maker",
    navLabel: "CV maker",
    metaTitle: "Free CV Maker — Create a Professional CV Online",
    metaDescription:
      "Create a professional CV online with a free CV maker. Academic and international CV templates, optional photo, AI writing help and PDF download. No sign-up needed.",
    keywords: ["CV maker", "free CV maker", "CV builder", "create a CV online", "academic CV template", "CV vs resume"],
    eyebrow: "Free CV maker",
    h1: "Free CV maker: build a professional CV and download it as a PDF",
    intro:
      "Whether you need a UK or European CV, an academic CV or simply a clean curriculum vitae, ResumeSpace gives you the templates, a live preview and AI writing help, free and without an account.",
    primaryCta: { label: "Make my free CV", href: "/builder" },
    secondaryCta: { label: "See CV templates", href: "/#templates" },
    sections: [
      {
        heading: "CV vs. resume: what is the difference?",
        paragraphs: [
          "In the US and Canada, a resume is a short, targeted summary of your experience, usually one or two pages, while a CV is a longer, complete record used mainly in academia and research. Elsewhere, including the UK, Europe, Australia and much of Asia, CV is simply the everyday word for the document you send when you apply for a job.",
          "So the right format depends on where you are applying and for what kind of role. ResumeSpace handles both with the same editor.",
        ],
      },
      {
        heading: "CV templates for different needs",
        points: [
          { title: "International CV", text: "A two-column layout with a sidebar for contact details and key facts, including an optional photo, suited to CVs commonly used in Europe and Asia." },
          { title: "Academic CV", text: "A structured layout for research and teaching careers with room for publications, awards and volunteer service." },
          { title: "Graduate CV", text: "Leads with education, projects and skills for students and recent graduates with limited work history." },
          { title: "Classic single-column CV", text: "Clean, ATS-friendly layouts that put work experience first for everyday job applications." },
        ],
      },
      {
        heading: "How to make a CV online",
        points: [
          { title: "Pick a template", text: "Start with the layout that matches your field and country." },
          { title: "Fill in your details", text: "Add contact information, a profile, experience, education and skills. Add optional sections like publications, languages or certifications where they help." },
          { title: "Polish with AI", text: "Ask the AI Helper for a strong personal profile or clearer achievement statements." },
          { title: "Download", text: "Export a clean PDF, ready to email or upload." },
        ],
      },
      {
        heading: "Should I put a photo on my CV?",
        paragraphs: [
          "It depends on the country. Photos are common on CVs in much of Europe, Asia and Latin America, but they are usually left off in the US, UK and Canada, where employers avoid photos to reduce bias. ResumeSpace treats the photo as optional, with your choice of shape and size, so you can follow the norm for where you are applying.",
        ],
      },
    ],
    faq: [
      {
        q: "What is the difference between a CV and a resume?",
        a: "In North America a resume is a short, targeted document and a CV is a longer academic record. In most other countries, CV is the standard word for a job application document.",
      },
      {
        q: "Is the CV maker free?",
        a: "Yes. You can create, edit and download your CV as a PDF for free, without signing up.",
      },
      {
        q: "Can I add a photo to my CV?",
        a: "Yes. Photos are optional. You can upload one and choose its shape and size, or leave it out.",
      },
      {
        q: "Is there an academic CV template?",
        a: "Yes. The academic template is built for research and teaching roles, with space for publications, awards and service.",
      },
      {
        q: "How long should a CV be?",
        a: "For most jobs, one to two pages. Academic CVs are often longer because they include publications, grants and teaching history.",
      },
    ],
    related: ["free-resume-builder", "ai-resume-builder", "master-resume-builder"],
  },
];

export function getSeoPage(slug: string): SeoPageConfig {
  const page = seoPages.find((p) => p.slug === slug);
  if (!page) throw new Error(`Unknown SEO page: ${slug}`);
  return page;
}
