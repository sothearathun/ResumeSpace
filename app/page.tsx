import Link from "next/link";
import { Target, PenLine, ListChecks } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TemplateGrid } from "@/components/marketplace/TemplateGrid";
import { templateCatalog } from "@/components/resume-templates/catalog";

const FEATURED_TEMPLATE_COUNT = 3;

const tailoringFeatures = [
  {
    icon: Target,
    title: "Tell us the job you're after",
    description:
      "Pick a target role, or paste the job description, and your resume gets shaped around what that job actually asks for.",
  },
  {
    icon: PenLine,
    title: "Get help with the hard parts",
    description:
      "Not sure how to phrase a bullet point? Ask for a rewrite, a shorter version, or stronger wording — one section at a time.",
  },
  {
    icon: ListChecks,
    title: "See how you match",
    description:
      "Paste a job description and see which of your skills line up, and which ones are worth adding.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <section className="mx-auto w-full max-w-[1280px] px-4 pt-16 pb-14 sm:px-6 lg:px-10 lg:pt-20 lg:pb-16">
        <div className="max-w-2xl">
          <h1 className="text-[40px] leading-[1.1] font-semibold tracking-tight sm:text-[52px]">
            Build a resume you&rsquo;re proud to send.
          </h1>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-text-secondary sm:text-[17px]">
            Choose a professional template, add your experience, and get help
            tailoring it to the job you actually want — from your summary to
            every bullet point.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/templates"
              className="rounded-lg bg-accent px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Create a resume
            </Link>
            <Link
              href="/templates"
              className="rounded-lg border border-border px-5 py-3 text-[14px] font-medium text-text-primary transition-colors hover:bg-bg-secondary"
            >
              Browse templates
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-4 pb-24 sm:px-6 lg:px-10">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[26px] font-semibold tracking-tight sm:text-[30px]">
              Choose a template
            </h2>
            <p className="mt-2 max-w-md text-[14px] text-text-secondary">
              Start with a design that fits your experience and the kind of
              role you&rsquo;re applying for.
            </p>
          </div>
          <Link
            href="/templates"
            className="hidden shrink-0 text-[14px] font-medium text-accent hover:text-accent-hover sm:inline"
          >
            Browse all templates →
          </Link>
        </div>

        <TemplateGrid templates={templateCatalog.slice(0, FEATURED_TEMPLATE_COUNT)} />
      </section>

      <section className="border-t border-border bg-bg-secondary">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
          <div className="max-w-xl">
            <h2 className="text-[26px] font-semibold tracking-tight sm:text-[30px]">
              Built to help you write, not just format
            </h2>
            <p className="mt-2 text-[14px] text-text-secondary">
              A template gets you started. These are the tools that help once
              you&rsquo;re staring at a blank section.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {tailoringFeatures.map(({ icon: Icon, title, description }) => (
              <div key={title}>
                <Icon size={20} className="text-accent" strokeWidth={1.75} />
                <h3 className="mt-3 text-[15px] font-medium">{title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-text-secondary">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
