import Link from "next/link";
import { ArrowRight, Check, ChevronDown, FileText, Layers, Sparkles, Wallet } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroVisual } from "@/components/landing/HeroVisual";
import { TemplateBrowser } from "@/components/marketplace/TemplateBrowser";
import { templateCatalog } from "@/components/resume-templates/catalog";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqSection } from "@/components/seo/FaqSection";
import { absoluteUrl, DEFAULT_DESCRIPTION, DEFAULT_TITLE, faqJsonLd, pageMetadata, SITE_NAME } from "@/lib/seo";
import { homeFaq } from "@/lib/seo-pages";

export const metadata = pageMetadata({
  title: `${DEFAULT_TITLE} | ${SITE_NAME}`,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

const featureCards = [
  {
    icon: Layers,
    title: "Master resume builder",
    text: "Write your entire career history once. Generate a focused, tailored resume from it for every application, without starting over.",
    href: "/master-resume-builder",
    cta: "How the master resume works",
  },
  {
    icon: Sparkles,
    title: "AI resume writer",
    text: "Get a first draft of your summary, sharper bullet points and skill ideas. The AI also recommends which experience fits each job.",
    href: "/ai-resume-builder",
    cta: "See the AI resume builder",
  },
  {
    icon: Wallet,
    title: "Free resume and CV maker",
    text: "Eleven templates, a live preview and PDF download, free to use with no sign-up and no credit card.",
    href: "/free-resume-builder",
    cta: "Make a free resume",
  },
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: DEFAULT_DESCRIPTION,
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/image.png"),
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${SITE_NAME} — Free AI Resume Builder`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: DEFAULT_DESCRIPTION,
    url: absoluteUrl("/"),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Free resume and CV builder",
      "AI resume writing assistant",
      "Master resume with AI tailoring to a job description",
      "ATS-friendly resume templates",
      "PDF download",
    ],
  },
  faqJsonLd(homeFaq),
];

const perks: { icon: typeof Check; label: string; accent?: boolean }[] = [
  { icon: Check, label: "Free templates & PDF download", accent: true },
  { icon: FileText, label: "ATS-friendly templates" },
  { icon: Sparkles, label: "AI writing help" },
];

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <JsonLd data={structuredData} />
      <Header />

      <section className="relative overflow-hidden">        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-24 h-[420px] w-[420px] animate-drift rounded-full bg-blue-200/50 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 -right-24 h-[380px] w-[380px] animate-drift rounded-full bg-indigo-200/40 blur-3xl"
          style={{ animationDelay: "-7s" }}
        />

        <div className="relative mx-auto grid w-full max-w-[1280px] items-center gap-10 px-4 pt-12 pb-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:px-10 lg:pt-16 lg:pb-20">
          <div>
            <div className="mb-5 inline-flex animate-fade-up items-center gap-2.5 rounded-full border border-emerald-200/80 bg-white/80 py-1.5 pr-4 pl-1.5 text-[13px] font-medium text-text-secondary shadow-sm shadow-emerald-500/10 backdrop-blur">
              <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2.5 py-1 text-[12px] font-bold tracking-wide text-white uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                Free
              </span>
              No sign-up. No credit card.
            </div>
            <h1
              className="animate-fade-up text-[42px] leading-[1.05] font-semibold tracking-tight sm:text-[58px]"
              style={{ animationDelay: "0.05s" }}
            >
              Build a{" "}
              <span className="relative inline-block bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                free
                <svg
                  aria-hidden="true"
                  viewBox="0 0 120 14"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-3 w-full"
                  fill="none"
                >
                  <path
                    d="M3 9 C 22 2, 40 13, 60 7 S 100 3, 117 8"
                    stroke="url(#free-underline)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    pathLength="1"
                    className="animate-draw-line"
                  />
                  <defs>
                    <linearGradient id="free-underline" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#10b981" />
                      <stop offset="1" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>{" "}
              AI resume you&rsquo;re proud to send.{" "}
              <span className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                In minutes.
              </span>
            </h1>
            <p
              className="mt-5 max-w-lg animate-fade-up text-[16px] leading-relaxed text-text-secondary sm:text-[18px]"
              style={{ animationDelay: "0.1s" }}
            >
              ResumeSpace is a free AI resume builder and CV maker with a <strong className="font-semibold text-text-primary">master resume</strong>:
              enter your career history once, get AI help writing it, then generate a tailored,
              ATS-friendly resume for every job and download it as a PDF.
            </p>

            <div
              className="mt-8 flex animate-fade-up flex-wrap items-center gap-3"
              style={{ animationDelay: "0.2s" }}
            >
              <Link
                href="/builder"
                className="group flex animate-pulse-ring items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-accent-hover"
              >
                Create my free resume
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/master-resume"
                className="rounded-xl border border-border bg-white px-6 py-3.5 text-[15px] font-medium text-text-primary transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                Build my master resume
              </Link>
            </div>

            <p
              className="mt-3 max-w-md animate-fade-up text-[13px] leading-relaxed text-text-secondary"
              style={{ animationDelay: "0.28s" }}
            >
              Master resume: enter your full history once, then generate a version tailored to any job.
            </p>

            <div
              className="mt-8 flex animate-fade-up flex-wrap gap-x-6 gap-y-2"
              style={{ animationDelay: "0.36s" }}
            >
              {perks.map(({ icon: Icon, label, accent }) => (
                <span
                  key={label}
                  className={`flex items-center gap-1.5 text-[13px] ${
                    accent ? "font-semibold text-emerald-700" : "text-text-secondary"
                  }`}
                >
                  {accent ? (
                    <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Icon size={11} strokeWidth={3} />
                    </span>
                  ) : (
                    <Icon size={15} className="text-accent" strokeWidth={1.75} />
                  )}
                  {label}
                </span>
              ))}
            </div>

            <a
              href="#templates"
              className="mt-8 inline-flex animate-fade-up items-center gap-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:text-accent"
              style={{ animationDelay: "0.44s" }}
            >
              or pick a template
              <ChevronDown size={15} className="animate-bounce" />
            </a>
          </div>

          <HeroVisual />
        </div>
      </section>

      <section id="templates" className="mx-auto w-full max-w-[1280px] scroll-mt-4 px-4 pt-6 pb-24 sm:px-6 lg:px-10">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-[28px] font-semibold tracking-tight sm:text-[34px]">
            Pick a template and start
          </h2>
          <p className="mt-2 text-[14px] text-text-secondary">
            Every template is editable and you can switch designs anytime while you write.
          </p>
        </div>

        <TemplateBrowser templates={templateCatalog} />
      </section>

      <section className="border-t border-border bg-bg-secondary">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="text-[28px] font-semibold tracking-tight sm:text-[34px]">
              The free AI resume builder built around your master resume
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
              Most resume makers give you a template and leave you to it. ResumeSpace keeps your full career history
              in one master resume, then uses AI to build the right resume for each job.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featureCards.map(({ icon: Icon, title, text, href, cta }) => (
              <div key={title} className="flex flex-col rounded-2xl border border-border bg-white p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-accent">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-[17px] font-semibold">{title}</h3>
                <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-text-secondary">{text}</p>
                <Link href={href} className="mt-4 inline-flex items-center gap-1 text-[14px] font-medium text-accent hover:text-accent-hover">
                  {cta}
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1000px] px-4 sm:px-6 lg:px-10">
        <FaqSection items={homeFaq} heading="Resume builder FAQ" />
      </div>

      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 px-6 py-14 text-center text-white sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-10 h-72 w-72 animate-drift rounded-full bg-white/10 blur-2xl"
          />
          <h2 className="relative text-[28px] font-semibold tracking-tight sm:text-[36px]">
            Ready when you are. It&rsquo;s{" "}
            <span className="rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 px-3.5 py-0.5 text-white shadow-lg shadow-emerald-900/20">
              free
            </span>
            .
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-[15px] text-blue-100">
            Start a resume now, or set up your master resume once and tailor it to every job.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/builder"
              className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-[15px] font-semibold text-blue-700 transition-all hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Create my free resume
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/master-resume"
              className="rounded-xl border border-white/40 px-6 py-3.5 text-[15px] font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
            >
              Build my master resume
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
