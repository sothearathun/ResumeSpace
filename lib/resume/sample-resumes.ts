import type { ResumeContent, TemplateKey } from "./types";
import { sampleExtras, type SampleExtras } from "./sample-extras";

/** Realistic placeholder content used to render believable template
 * previews on the marketplace, preview pages, and (later) empty builder
 * state — never lorem ipsum. */
export const baseSampleResumes: Record<TemplateKey, ResumeContent> = {
  minimal: {
    contact: {
      name: "Michael Lee",
      jobTitle: "Software Engineer",
      email: "michael.lee@email.com",
      phone: "(415) 555-0182",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/michaellee",
    },
    summary:
      "Backend-focused software engineer with four years of experience building reliable APIs and data pipelines. Comfortable owning a service from design through on-call.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Software Engineer",
        company: "Northbeam Analytics",
        location: "San Francisco, CA",
        startDate: "2022",
        endDate: "Present",
        bullets: [
          "Rebuilt the billing service's event pipeline, cutting invoice processing time from hours to minutes",
          "Introduced integration tests for the payments API, reducing production incidents by half",
          "Mentored two new-grad engineers through their first six months on the team",
        ],
      },
      {
        id: "exp-2",
        jobTitle: "Software Engineer",
        company: "Fieldstone Labs",
        location: "Oakland, CA",
        startDate: "2020",
        endDate: "2022",
        bullets: [
          "Built and shipped the internal admin dashboard used by 40+ support staff daily",
          "Migrated a legacy monolith's auth module to a standalone service with zero downtime",
        ],
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.S. Computer Science",
        institution: "UC Davis",
        location: "Davis, CA",
        gradYear: "2020",
      },
    ],
    skills: ["Python", "TypeScript", "PostgreSQL", "AWS", "Docker", "System design"],
  },
  professional: {
    contact: {
      name: "Daniel Kim",
      jobTitle: "Marketing Specialist",
      email: "daniel.kim@email.com",
      phone: "(312) 555-0143",
      location: "Chicago, IL",
      linkedin: "linkedin.com/in/danielkim",
    },
    summary:
      "Marketing specialist with five years of experience running multi-channel campaigns for consumer brands, from content planning through performance reporting.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Marketing Specialist",
        company: "Harborline Goods",
        location: "Chicago, IL",
        startDate: "2021",
        endDate: "Present",
        bullets: [
          "Planned and ran email and social campaigns across a 200k-subscriber list, growing engagement quarter over quarter",
          "Partnered with design and sales to launch three seasonal campaigns a year, on schedule and on budget",
          "Built a monthly reporting dashboard that became the team's standard for tracking campaign performance",
        ],
      },
      {
        id: "exp-2",
        jobTitle: "Marketing Coordinator",
        company: "Bright Path Media",
        location: "Chicago, IL",
        startDate: "2019",
        endDate: "2021",
        bullets: [
          "Coordinated content calendars across four client accounts",
          "Wrote and scheduled social copy for Instagram, LinkedIn, and X",
        ],
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.A. Communications",
        institution: "University of Illinois",
        location: "Urbana-Champaign, IL",
        gradYear: "2019",
      },
    ],
    skills: ["Campaign planning", "Content strategy", "Email marketing", "Analytics", "Communication"],
  },
  modern: {
    contact: {
      name: "Sarah Chen",
      jobTitle: "Product Designer",
      email: "sarah.chen@email.com",
      phone: "(646) 555-0119",
      location: "New York, NY",
      portfolio: "sarahchen.design",
    },
    summary:
      "Product designer with six years of experience shaping consumer and B2B software, from early product strategy through detailed interaction design.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Senior Product Designer",
        company: "Loomwork",
        location: "New York, NY",
        startDate: "2022",
        endDate: "Present",
        bullets: [
          "Led design for the onboarding redesign that reduced new-user drop-off by a third",
          "Built and maintained the team's design system component library used across five product surfaces",
          "Ran weekly usability sessions that directly shaped two major roadmap decisions",
        ],
      },
      {
        id: "exp-2",
        jobTitle: "Product Designer",
        company: "Alto Studio",
        location: "Brooklyn, NY",
        startDate: "2019",
        endDate: "2022",
        bullets: [
          "Designed core flows for a B2B scheduling product from zero to first paying customers",
          "Partnered directly with engineering to ship weekly design iterations",
        ],
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.F.A. Graphic Design",
        institution: "Parsons School of Design",
        location: "New York, NY",
        gradYear: "2019",
      },
    ],
    skills: ["Product design", "Figma", "Design systems", "Prototyping", "User research"],
  },
  executive: {
    contact: {
      name: "Robert Hayes",
      jobTitle: "VP of Operations",
      email: "robert.hayes@email.com",
      phone: "(212) 555-0176",
      location: "New York, NY",
      linkedin: "linkedin.com/in/roberthayes",
    },
    summary:
      "Operations executive with over fifteen years leading logistics and supply chain teams through periods of rapid growth, most recently overseeing a 300-person division across four regional hubs.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "VP of Operations",
        company: "Meridian Freight Group",
        location: "New York, NY",
        startDate: "2019",
        endDate: "Present",
        bullets: [
          "Led operations for four regional hubs, growing throughput by 40% while holding headcount flat",
          "Rebuilt the executive reporting process the board now uses for quarterly planning",
          "Negotiated carrier contracts that reduced annual freight costs by $2.1M",
        ],
      },
      {
        id: "exp-2",
        jobTitle: "Director of Operations",
        company: "Carrow Logistics",
        location: "Newark, NJ",
        startDate: "2014",
        endDate: "2019",
        bullets: [
          "Managed a 120-person warehouse and distribution team across two sites",
          "Introduced a scheduling system that cut overtime costs by a quarter",
        ],
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "M.B.A.",
        institution: "NYU Stern School of Business",
        location: "New York, NY",
        gradYear: "2014",
      },
    ],
    skills: ["Operations strategy", "Supply chain", "P&L management", "Team leadership", "Negotiation"],
  },
  international: {
    contact: {
      name: "Elena Rossi",
      jobTitle: "Business Analyst",
      email: "elena.rossi@email.com",
      phone: "+39 345 555 0128",
      location: "Milan, Italy",
      linkedin: "linkedin.com/in/elenarossi",
    },
    summary:
      "Business analyst with four years of experience supporting cross-border retail and finance projects across three European markets.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Business Analyst",
        company: "Verdanta Retail Group",
        location: "Milan, Italy",
        startDate: "2022",
        endDate: "Present",
        bullets: [
          "Analyzed sales data across five countries to guide quarterly inventory planning",
          "Built the reporting model finance now uses for monthly forecasting",
        ],
      },
      {
        id: "exp-2",
        jobTitle: "Junior Analyst",
        company: "Banco Alto",
        location: "Barcelona, Spain",
        startDate: "2020",
        endDate: "2022",
        bullets: ["Supported the risk team with weekly portfolio reporting"],
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "M.Sc. Business Administration",
        institution: "Bocconi University",
        location: "Milan, Italy",
        gradYear: "2020",
      },
    ],
    skills: ["Data analysis", "Excel", "SQL", "Forecasting", "Stakeholder reporting"],
    optionalSections: {
      languages: [
        { id: "lang-1", language: "Italian", proficiency: "Native" },
        { id: "lang-2", language: "English", proficiency: "Fluent" },
        { id: "lang-3", language: "Spanish", proficiency: "Professional working" },
      ],
    },
  },
  compact: {
    contact: {
      name: "James Whitfield",
      jobTitle: "Senior Accountant",
      email: "james.whitfield@email.com",
      phone: "(617) 555-0142",
      location: "Boston, MA",
      linkedin: "linkedin.com/in/jameswhitfield",
    },
    summary:
      "Senior accountant with twelve years across public accounting and industry, focused on month-end close, audit readiness, and process improvement.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Senior Accountant",
        company: "Bridgewell Manufacturing",
        location: "Boston, MA",
        startDate: "2020",
        endDate: "Present",
        bullets: [
          "Own month-end close for a $40M division, closing two days faster than the prior process",
          "Lead annual external audit prep, reducing auditor follow-up requests by half",
        ],
      },
      {
        id: "exp-2",
        jobTitle: "Staff Accountant",
        company: "Colby & Reed LLP",
        location: "Boston, MA",
        startDate: "2016",
        endDate: "2020",
        bullets: ["Prepared financial statements for 15+ mid-market clients"],
      },
      {
        id: "exp-3",
        jobTitle: "Accounting Intern",
        company: "Colby & Reed LLP",
        location: "Boston, MA",
        startDate: "2015",
        endDate: "2016",
        bullets: ["Assisted with quarterly tax filings and reconciliations"],
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.S. Accounting",
        institution: "Boston College",
        location: "Chestnut Hill, MA",
        gradYear: "2015",
      },
    ],
    skills: ["GAAP", "Month-end close", "Audit prep", "Excel", "NetSuite", "Forecasting"],
    optionalSections: {
      certifications: [{ id: "cert-1", name: "CPA", issuer: "Massachusetts Board of Accountancy", year: "2018" }],
    },
  },
  technical: {
    contact: {
      name: "Priya Nair",
      jobTitle: "Backend Engineer",
      email: "priya.nair@email.com",
      phone: "(408) 555-0193",
      location: "Seattle, WA",
      portfolio: "github.com/priyanair",
    },
    summary:
      "Backend engineer with five years building distributed systems, most recently focused on payments infrastructure handling millions of transactions a day.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Backend Engineer",
        company: "Ledgerline",
        location: "Seattle, WA",
        startDate: "2022",
        endDate: "Present",
        bullets: [
          "Redesigned the transaction service to handle 3x throughput without added infrastructure cost",
          "Cut p99 latency on the payments API from 800ms to 210ms",
          "Introduced contract testing between six internal services, catching breaking changes before deploy",
        ],
      },
      {
        id: "exp-2",
        jobTitle: "Software Engineer",
        company: "Fieldnote",
        location: "Seattle, WA",
        startDate: "2019",
        endDate: "2022",
        bullets: ["Built the event ingestion pipeline processing 50M+ events/day"],
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.S. Computer Science",
        institution: "University of Washington",
        location: "Seattle, WA",
        gradYear: "2019",
      },
    ],
    skills: ["Go", "Python", "PostgreSQL", "Kafka", "Kubernetes", "AWS", "gRPC", "System design"],
    optionalSections: {
      projects: [
        {
          id: "proj-1",
          name: "queuelite",
          description: "An open-source, embeddable job queue for Go services — 600+ GitHub stars",
          link: "github.com/priyanair/queuelite",
        },
      ],
    },
  },
  academic: {
    contact: {
      name: "Amara Osei",
      jobTitle: "Postdoctoral Researcher, Cognitive Science",
      email: "amara.osei@email.edu",
      phone: "(773) 555-0161",
      location: "Chicago, IL",
    },
    summary:
      "Cognitive scientist researching how working memory constraints shape language processing, with six peer-reviewed publications and experience teaching at the undergraduate and graduate level.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Postdoctoral Researcher",
        company: "University of Chicago, Department of Psychology",
        location: "Chicago, IL",
        startDate: "2023",
        endDate: "Present",
        bullets: [
          "Lead a research line on working memory and sentence processing, funded by an NSF grant",
          "Supervise two graduate research assistants",
        ],
      },
      {
        id: "exp-2",
        jobTitle: "Graduate Instructor",
        company: "University of Michigan",
        location: "Ann Arbor, MI",
        startDate: "2019",
        endDate: "2023",
        bullets: ["Taught two undergraduate courses in cognitive psychology, average evaluation 4.8/5"],
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "Ph.D. Cognitive Psychology",
        institution: "University of Michigan",
        location: "Ann Arbor, MI",
        gradYear: "2023",
      },
      {
        id: "edu-2",
        degree: "B.A. Psychology",
        institution: "Williams College",
        location: "Williamstown, MA",
        gradYear: "2017",
      },
    ],
    skills: ["Experimental design", "R", "Eye-tracking", "Statistical modeling", "Grant writing"],
    optionalSections: {
      publications: [
        {
          id: "pub-1",
          title: "Working memory load modulates syntactic reanalysis",
          venue: "Journal of Memory and Language",
          year: "2024",
        },
        {
          id: "pub-2",
          title: "Individual differences in garden-path recovery",
          venue: "Cognition",
          year: "2022",
        },
      ],
    },
  },
  portfolio: {
    contact: {
      name: "Jamie Ortiz",
      jobTitle: "Creative Director",
      email: "jamie.ortiz@email.com",
      phone: "(310) 555-0177",
      location: "Los Angeles, CA",
      portfolio: "jamieortiz.work",
    },
    summary:
      "Creative director with nine years building brand and campaign work for consumer and entertainment clients, leading teams of designers, writers, and producers.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Creative Director",
        company: "Palmwave Studio",
        location: "Los Angeles, CA",
        startDate: "2021",
        endDate: "Present",
        bullets: [
          "Lead a team of 8 across brand identity, campaign, and motion work for entertainment clients",
          "Directed the rebrand for a streaming platform's 2024 relaunch campaign",
        ],
      },
      {
        id: "exp-2",
        jobTitle: "Art Director",
        company: "Union & Co.",
        location: "Los Angeles, CA",
        startDate: "2017",
        endDate: "2021",
        bullets: ["Led art direction for national print and digital campaigns across five accounts"],
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.F.A. Advertising Design",
        institution: "ArtCenter College of Design",
        location: "Pasadena, CA",
        gradYear: "2015",
      },
    ],
    skills: ["Brand identity", "Art direction", "Team leadership", "Adobe Creative Suite", "Motion design"],
    optionalSections: {
      projects: [
        {
          id: "proj-1",
          name: "Streamline 2024 Rebrand",
          description: "Full brand identity and campaign system for a national streaming platform relaunch",
        },
      ],
    },
  },
  bold: {
    contact: {
      name: "Tyler Brooks",
      jobTitle: "Growth Marketing Lead",
      email: "tyler.brooks@email.com",
      phone: "(512) 555-0134",
      location: "Austin, TX",
      linkedin: "linkedin.com/in/tylerbrooks",
    },
    summary:
      "Growth marketer who has taken two early-stage startups from pre-launch to seven-figure ARR, focused on paid acquisition, lifecycle, and experimentation.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Growth Marketing Lead",
        company: "Fernbase",
        location: "Austin, TX",
        startDate: "2022",
        endDate: "Present",
        bullets: [
          "Grew monthly signups from 800 to 14,000 in eighteen months through paid and lifecycle channels",
          "Built the experimentation program that now ships 4+ tests a month",
          "Cut customer acquisition cost by 35% by reworking channel mix",
        ],
      },
      {
        id: "exp-2",
        jobTitle: "Growth Marketer",
        company: "Orbitpay",
        location: "Remote",
        startDate: "2020",
        endDate: "2022",
        bullets: ["Owned paid social, scaling spend from $10K to $150K/month while holding CAC flat"],
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.B.A. Marketing",
        institution: "University of Texas at Austin",
        location: "Austin, TX",
        gradYear: "2019",
      },
    ],
    skills: ["Paid acquisition", "Lifecycle marketing", "A/B testing", "SQL", "Analytics", "Positioning"],
  },
  graduate: {
    contact: {
      name: "Maya Chen",
      jobTitle: "Computer Science Student",
      email: "maya.chen@email.com",
      phone: "(650) 555-0119",
      location: "Berkeley, CA",
      portfolio: "github.com/mayachen",
    },
    summary:
      "Final-year computer science student focused on machine learning, with internship experience and two personal projects with real users.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Software Engineering Intern",
        company: "Clearwave Analytics",
        location: "San Francisco, CA",
        startDate: "Summer 2025",
        endDate: "Summer 2025",
        bullets: [
          "Built a data-labeling tool used by the research team, cutting labeling time by 30%",
          "Wrote unit tests that raised coverage on the core module from 40% to 85%",
        ],
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.S. Computer Science",
        institution: "UC Berkeley",
        location: "Berkeley, CA",
        gradYear: "2026",
        gpa: "3.8",
        coursework: "Machine Learning, Data Structures, Distributed Systems, Linear Algebra",
      },
    ],
    skills: ["Python", "PyTorch", "Java", "SQL", "Git", "Problem solving"],
    optionalSections: {
      projects: [
        {
          id: "proj-1",
          name: "StudySync",
          description: "A study-group matching app used by 300+ students on campus, built with React and Firebase",
          link: "github.com/mayachen/studysync",
        },
        {
          id: "proj-2",
          name: "Course recommender",
          description: "A course recommendation model trained on five years of enrollment data for a class project",
        },
      ],
    },
  },
};

function withExtras(base: ResumeContent, extras: SampleExtras, photo: string): ResumeContent {
  const experience = base.experience.map((job, i) =>
    ({
      ...job,
      bullets: [
        ...job.bullets,
        ...(i === 0 ? (extras.firstJobBullets ?? []) : []),
        ...(extras.moreBullets?.[i] ?? []),
      ],
    })
  );
  const optionalSections: Record<string, unknown[]> = { ...base.optionalSections };
  for (const [key, entries] of Object.entries(extras.optionalSections ?? {})) {
    optionalSections[key] = [...(optionalSections[key] ?? []), ...(entries as unknown[])];
  }
  return {
    ...base,
    contact: { ...base.contact, photoDataUrl: base.contact.photoDataUrl ?? photo },
    experience: [...experience, ...(extras.experience ?? [])],
    education: [...base.education, ...(extras.education ?? [])],
    skills: [...base.skills, ...(extras.skills ?? [])],
    optionalSections: optionalSections as ResumeContent["optionalSections"],
  };
}

/** The samples every preview renders: base content plus extras. */
export const sampleResumes: Record<TemplateKey, ResumeContent> = Object.fromEntries(
  (Object.keys(baseSampleResumes) as TemplateKey[]).map((key) => [key, withExtras(baseSampleResumes[key], sampleExtras[key], `/samples/${key}.svg`)])
) as Record<TemplateKey, ResumeContent>;
