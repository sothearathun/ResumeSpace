import type { OptionalSections, ResumeEducation, ResumeExperience, TemplateKey } from "./types";

export type SampleExtras = {
  /** Appended to the most recent job's bullets. */
  firstJobBullets?: string[];
  /** Extra bullets appended to the job at each index (0 = most recent). */
  moreBullets?: Record<number, string[]>;
  experience?: ResumeExperience[];
  education?: ResumeEducation[];
  skills?: string[];
  optionalSections?: OptionalSections;
};

// Fuller content layered on top of the base samples so every template
// preview reads as a realistic, nearly full page instead of a half-empty one.
export const sampleExtras: Record<TemplateKey, SampleExtras> = {
  minimal: {
    moreBullets: {
      0: ["Owned the on-call runbook and trained four engineers to handle first-line incidents"],
      1: ["Reduced CI build times from 22 to 9 minutes by parallelizing the test suite"],
    },
    firstJobBullets: ["Led the migration of 30+ services to a shared observability stack, shortening incident triage by 40%"],
    experience: [
      {
        id: "exp-3",
        jobTitle: "Junior Software Engineer",
        company: "Brightwave Systems",
        location: "San Jose, CA",
        startDate: "2019",
        endDate: "2020",
        bullets: [
          "Built REST endpoints for a customer-facing scheduling product used by 12,000 weekly users",
          "Wrote the team's first load tests, uncovering a query bottleneck that halved p95 latency",
          "Paired with senior engineers on code review, shipping 60+ pull requests in the first year",
        ],
      },
      {
        id: "exp-4",
        jobTitle: "Software Engineering Intern",
        company: "Cedarline Health",
        location: "Sacramento, CA",
        startDate: "2018",
        endDate: "2018",
        bullets: [
          "Automated a weekly compliance report that previously took an analyst half a day to compile",
          "Added input validation to patient intake forms, eliminating a class of recurring data errors",
        ],
      },
    ],
    skills: ["Go", "Redis", "GraphQL", "Terraform", "CI/CD", "Code review"],
    optionalSections: {
      projects: [
        {
          id: "proj-1",
          name: "queue-audit",
          description: "Open-source CLI that replays and diffs message-queue traffic between environments; 900+ GitHub stars.",
        },
      ],
      certifications: [{ id: "cert-1", name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services", year: "2022" }],
      languages: [
        { id: "lang-1", language: "English", proficiency: "Native" },
        { id: "lang-2", language: "Spanish", proficiency: "Professional working" },
      ],
    },
  },
  professional: {
    firstJobBullets: ["Reduced cost per acquisition by 22% by reallocating spend toward the highest-performing channels"],
    experience: [
      {
        id: "exp-3",
        jobTitle: "Marketing Assistant",
        company: "Lakeshore Outfitters",
        location: "Evanston, IL",
        startDate: "2018",
        endDate: "2019",
        bullets: [
          "Managed the brand's social calendar across three platforms, growing followers by 35% in a year",
          "Coordinated photo shoots and copy reviews for the spring and fall catalogs",
          "Compiled weekly competitor pricing reports used by the merchandising team",
        ],
      },
    ],
    skills: ["SEO", "Google Analytics", "HubSpot", "Copywriting", "Budget management", "Brand strategy"],
    optionalSections: {
      certifications: [
        { id: "cert-1", name: "Google Analytics Certification", issuer: "Google", year: "2021" },
      ],
    },
  },
  modern: {
    moreBullets: {
      0: [
        "Defined success metrics with PMs and engineers before every design kickoff",
        "Reduced onboarding drop-off by 24% after redesigning the first-run experience",
      ],
      1: [
        "Ran design critiques twice a week, raising review quality across a team of six",
        "Prototyped interactions in Figma and code to validate ideas before engineering handoff",
      ],
    },
    firstJobBullets: ["Partnered with research to run monthly usability studies, turning findings into a prioritized fix list"],
    experience: [
      {
        id: "exp-3",
        jobTitle: "Junior Designer",
        company: "Pixelbarn",
        location: "Brooklyn, NY",
        startDate: "2016",
        endDate: "2018",
        bullets: [
          "Designed marketing pages and email templates for a portfolio of eight SaaS clients",
          "Created the studio's first reusable icon set, adopted across every active client project",
          "Presented design rationale directly to client stakeholders in weekly reviews",
        ],
      },
    ],
    skills: ["Interaction design", "Accessibility", "Usability testing", "Journey mapping", "Workshop facilitation", "Motion design"],
    optionalSections: {
      awards: [{ id: "award-1", title: "Best Product Design Finalist", issuer: "Design Week NYC", year: "2023" }],
      languages: [
        { id: "lang-1", language: "English", proficiency: "Native" },
        { id: "lang-2", language: "Mandarin", proficiency: "Conversational" },
      ],
      volunteer: [
        {
          id: "vol-1",
          role: "Design Mentor",
          organization: "Girls Who Design",
          description: "Coach early-career designers on portfolios and interviews.",
        },
      ],
    },
  },
  executive: {
    experience: [
      {
        id: "exp-3",
        jobTitle: "Operations Manager",
        company: "Carrow Logistics",
        location: "Columbus, OH",
        startDate: "2009",
        endDate: "2013",
        bullets: [
          "Managed a 90-person warehouse and dispatch operation moving 4,000 shipments a week",
          "Introduced route-optimization software that lowered fuel spend by 12% in its first year",
          "Built the site's first cross-training program, reducing overtime by 18%",
        ],
      },
    ],
    skills: ["Board reporting", "M&A integration", "Lean Six Sigma", "Vendor negotiation", "Budget forecasting", "Change management"],
    optionalSections: {
      certifications: [{ id: "cert-1", name: "Lean Six Sigma Black Belt", issuer: "ASQ", year: "2014" }],
    },
  },
  international: {
    moreBullets: {
      0: ["Automated the weekly sales dashboard in Power BI, saving the team six hours a week"],
      1: ["Reconciled branch-level data across eight regions ahead of each quarterly close"],
    },
    firstJobBullets: ["Presented quarterly margin analyses to regional directors, shaping assortment decisions in 14 countries"],
    experience: [
      {
        id: "exp-3",
        jobTitle: "Data Analyst Intern",
        company: "Studio Legale Bianchi",
        location: "Milan, Italy",
        startDate: "2015",
        endDate: "2016",
        bullets: [
          "Cleaned and merged client billing data from three legacy systems into a single reporting table",
          "Built monthly utilization charts for the partners' meeting",
        ],
      },
    ],
    skills: ["Power BI", "Python", "Data modeling", "Process improvement", "Project coordination", "Presentation", "Tableau", "Stakeholder management", "Market research", "Budget analysis"],
    optionalSections: {
      languages: [
        { id: "lang-1", language: "Italian", proficiency: "Native" },
        { id: "lang-2", language: "English", proficiency: "Fluent (C1)" },
        { id: "lang-3", language: "Spanish", proficiency: "Intermediate (B1)" },
      ],
      projects: [
        {
          id: "proj-1",
          name: "Regional pricing model",
          description: "Built an elasticity model that guided price changes across 120 stores and lifted margin by 1.8 points.",
        },
      ],
      certifications: [{ id: "cert-1", name: "Microsoft Power BI Data Analyst", issuer: "Microsoft", year: "2021" }],
      awards: [{ id: "award-1", title: "Rising Talent Award", issuer: "Verdanta Retail Group", year: "2022" }],
    },
  },
  compact: {
    moreBullets: {
      0: [
        "Prepared the consolidated financial statements reviewed by the CFO and external auditors",
        "Trained two staff accountants on the new close checklist and NetSuite workflows",
      ],
      1: [
        "Performed account reconciliations and prepared workpapers for 25+ audit clients",
        "Identified a recurring revenue-recognition error that saved a client six figures in restatements",
      ],
      2: ["Assisted with year-end audit fieldwork and inventory counts"],    },
    firstJobBullets: ["Cut the monthly close from eight business days to five by standardizing reconciliations and templates"],
    experience: [
      {
        id: "exp-5",
        jobTitle: "Bookkeeper",
        company: "Nash & Associates",
        location: "Boston, MA",
        startDate: "2014",
        endDate: "2015",
        bullets: [
          "Maintained the general ledgers for 12 small-business clients on a monthly cycle",
          "Prepared payroll and quarterly sales-tax filings on time with zero penalties",
          "Trained two new hires on the firm's bookkeeping software",
        ],
      },
      {
        id: "exp-6",
        jobTitle: "Accounting Clerk",
        company: "Wexford Hardware",
        location: "Framingham, MA",
        startDate: "2012",
        endDate: "2013",
        bullets: [
          "Entered daily cash receipts and matched bank deposits to the sales journal",
          "Helped move the store's records from paper files to cloud accounting software",
        ],
      },
      {
        id: "exp-4",
        jobTitle: "Accounts Payable Clerk",
        company: "Harmon Supply Co.",
        location: "Worcester, MA",
        startDate: "2013",
        endDate: "2014",
        bullets: [
          "Processed 300+ vendor invoices weekly with a 99.5% coding accuracy rate",
          "Resolved vendor payment disputes and maintained clean aging reports",
        ],
      },
    ],
    skills: ["Accruals", "Fixed assets", "SOX compliance", "Variance analysis", "Tableau", "Process documentation"],
    optionalSections: {
      volunteer: [
        {
          id: "vol-1",
          role: "Volunteer Tax Preparer",
          organization: "AARP Tax-Aide",
          description: "Prepared returns for low-income and senior households each filing season.",
        },
      ],
      certifications: [{ id: "cert-2", name: "Certified Management Accountant (in progress)", issuer: "IMA", year: "2025" }],
      languages: [
        { id: "lang-1", language: "English", proficiency: "Native" },
        { id: "lang-2", language: "Portuguese", proficiency: "Conversational" },
      ],
      projects: [
        {
          id: "proj-1",
          name: "ERP migration",
          description: "Led the finance workstream for a migration to NetSuite, covering chart of accounts, data mapping and user training.",
        },
        {
          id: "proj-2",
          name: "Budget-vs-actual reporting",
          description: "Built a self-serve variance report that replaced eight monthly spreadsheets for department heads.",
        },
      ],
      awards: [{ id: "award-1", title: "Finance Team Excellence Award", issuer: "Bridgewell Manufacturing", year: "2021" }],
    },
  },
  technical: {
    moreBullets: {
      0: ["Cut p99 API latency from 480 ms to 140 ms by introducing read replicas and query caching"],
      1: [
        "Built a feature-flag service used by 15 teams to ship changes safely to production",
        "Reduced infrastructure cost by 28% by right-sizing services and adopting spot instances",
      ],
    },
    firstJobBullets: ["Designed an idempotent ledger-write path that removed duplicate postings under retry storms"],
    experience: [
      {
        id: "exp-3",
        jobTitle: "Software Engineer Intern",
        company: "Northstar Robotics",
        location: "Pittsburgh, PA",
        startDate: "2017",
        endDate: "2017",
        bullets: [
          "Implemented a telemetry ingestion service in Go handling 20k messages per second in testing",
          "Wrote integration tests that caught two protocol-version bugs before the fleet rollout",
        ],
      },
    ],
    skills: ["Rust", "Redis", "Terraform", "OpenTelemetry", "Distributed systems", "Postgres tuning"],
    optionalSections: {
      certifications: [{ id: "cert-1", name: "Certified Kubernetes Application Developer", issuer: "CNCF", year: "2022" }],
      volunteer: [
        {
          id: "vol-1",
          role: "Mentor",
          organization: "Code2040",
          description: "Meet monthly with early-career engineers on system design and interviewing.",
        },
      ],
      publications: [{ id: "pub-1", title: "Exactly-once semantics in payment pipelines", venue: "Ledgerline Engineering Blog", year: "2023" }],
    },
  },
  academic: {
    firstJobBullets: ["Mentored three graduate students, two of whom went on to present at national conferences"],
    experience: [
      {
        id: "exp-3",
        jobTitle: "Research Assistant",
        company: "University of Michigan, Attention & Memory Lab",
        location: "Ann Arbor, MI",
        startDate: "2013",
        endDate: "2016",
        bullets: [
          "Ran eye-tracking sessions with 200+ participants and maintained the lab's data-collection protocol",
          "Coded and analyzed behavioral data in R for two funded studies",
        ],
      },
    ],
    skills: ["Python", "MATLAB", "Mixed-effects models", "Data visualization", "Peer review", "Public speaking"],
    optionalSections: {
      awards: [
        { id: "award-1", title: "Dissertation Fellowship", issuer: "University of Michigan", year: "2019" },
        { id: "award-2", title: "Early Career Research Grant", issuer: "Cognitive Science Society", year: "2022" },
      ],
      volunteer: [
        {
          id: "vol-1",
          role: "Reviewer",
          organization: "Journal of Experimental Psychology",
          description: "Ad hoc peer reviewer for manuscripts on attention and memory.",
        },
      ],
    },
  },
  portfolio: {
    firstJobBullets: ["Grew the studio's creative team from four to eleven while keeping client retention above 90%"],
    experience: [
      {
        id: "exp-3",
        jobTitle: "Senior Designer",
        company: "Harbor & Vine",
        location: "Miami, FL",
        startDate: "2011",
        endDate: "2015",
        bullets: [
          "Led identity and packaging for a restaurant group's expansion from three to twelve locations",
          "Directed photo and video shoots for regional campaigns with budgets up to $150k",
        ],
      },
    ],
    skills: ["Packaging design", "Typography", "Storyboarding", "Client presentations", "Photography direction", "Budgeting"],
    optionalSections: {
      awards: [
        { id: "award-1", title: "Silver Pencil, Branding", issuer: "One Club", year: "2023" },
        { id: "award-2", title: "Gold ADDY", issuer: "American Advertising Federation", year: "2021" },
      ],
      languages: [
        { id: "lang-1", language: "English", proficiency: "Native" },
        { id: "lang-2", language: "Spanish", proficiency: "Fluent" },
      ],
    },
  },
  bold: {
    moreBullets: {
      0: [
        "Built the team's experimentation program, running 40+ A/B tests a year across acquisition and retention",
      ],
    },
    firstJobBullets: ["Launched a referral program that drove 18% of new signups at near-zero incremental cost"],
    experience: [
      {
        id: "exp-3",
        jobTitle: "Marketing Associate",
        company: "Loopwork",
        location: "Austin, TX",
        startDate: "2017",
        endDate: "2019",
        bullets: [
          "Ran weekly paid-social tests, doubling qualified-lead volume within two quarters",
          "Wrote lifecycle email sequences that lifted trial-to-paid conversion by 9%",
        ],
      },
    ],
    skills: ["Funnel optimization", "Google Ads", "Meta Ads", "Segment", "Looker", "Experiment design"],
    optionalSections: {
      certifications: [{ id: "cert-1", name: "Meta Certified Media Buying Professional", issuer: "Meta", year: "2022" }],
      languages: [
        { id: "lang-1", language: "English", proficiency: "Native" },
        { id: "lang-2", language: "French", proficiency: "Professional working" },
      ],
      volunteer: [
        {
          id: "vol-1",
          role: "Marketing Volunteer",
          organization: "Austin Pets Alive",
          description: "Ran the adoption-event email and social campaigns, doubling event attendance.",
        },
      ],
      awards: [{ id: "award-1", title: "Growth Team of the Year", issuer: "Fernbase", year: "2023" }],
    },
  },
  graduate: {
    firstJobBullets: ["Presented the project to 40 engineers at the internship showcase and received a return offer"],
    experience: [
      {
        id: "exp-2",
        jobTitle: "Teaching Assistant, Data Structures",
        company: "Stanford University",
        location: "Stanford, CA",
        startDate: "2023",
        endDate: "2024",
        bullets: [
          "Held weekly office hours and review sessions for a class of 220 students",
          "Graded assignments and wrote solution guides adopted by the following year's staff",
        ],
      },
      {
        id: "exp-3",
        jobTitle: "Research Assistant",
        company: "Stanford AI Lab",
        location: "Stanford, CA",
        startDate: "2022",
        endDate: "2023",
        bullets: [
          "Trained and evaluated image classification models on a 50k-sample dataset in PyTorch",
          "Documented experiments so other lab members could reproduce results",
        ],
      },
    ],
    skills: ["C++", "Linux", "Data structures", "Machine learning", "Teamwork", "Technical writing"],
    optionalSections: {
      languages: [
        { id: "lang-1", language: "English", proficiency: "Native" },
        { id: "lang-2", language: "Mandarin", proficiency: "Fluent" },
      ],
      awards: [{ id: "award-1", title: "Dean's List", issuer: "Stanford University", year: "2022–2024" }],
      volunteer: [
        {
          id: "vol-1",
          role: "Coding Workshop Instructor",
          organization: "Girls Who Code",
          description: "Taught weekend Python workshops to high school students.",
        },
      ],
    },
  },
};
