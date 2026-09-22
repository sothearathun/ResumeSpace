import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TemplateGrid } from "@/components/marketplace/TemplateGrid";
import { templateCatalog } from "@/components/resume-templates/catalog";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqSection } from "@/components/seo/FaqSection";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE_NAME } from "@/lib/seo";
import { getSeoPage } from "@/lib/seo-pages";
import { seoPages } from "@/lib/seo-pages";

export function seoPageMetadata(slug: string) {
  const page = getSeoPage(slug);
  return pageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/${page.slug}`,
    keywords: page.keywords,
  });
}

export function SeoLandingPage({ slug }: { slug: string }) {
  const page = getSeoPage(slug);
  const path = `/${page.slug}`;
  const related = page.related.map((s) => seoPages.find((p) => p.slug === s)).filter(Boolean);

  return (
    <div className="flex flex-1 flex-col">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: page.metaTitle,
            description: page.metaDescription,
            url: absoluteUrl(path),
            isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
          },
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: page.navLabel, path },
          ]),
          faqJsonLd(page.faq),
        ]}
      />
      <Header />

      <main>
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-blue-50/70 to-white">
          <div className="mx-auto w-full max-w-[1000px] px-4 pt-10 pb-14 sm:px-6 lg:px-10 lg:pt-14 lg:pb-16">
            <nav aria-label="Breadcrumb" className="text-[13px] text-text-secondary">
              <Link href="/" className="hover:text-text-primary">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-text-primary">{page.navLabel}</span>
            </nav>

            <p className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold tracking-wide text-emerald-700 uppercase ring-1 ring-emerald-200">
              <Check size={13} strokeWidth={3} />
              {page.eyebrow}
            </p>
            <h1 className="mt-4 text-[34px] leading-[1.1] font-semibold tracking-tight sm:text-[46px]">{page.h1}</h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-text-secondary sm:text-[18px]">
              {page.intro}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={page.primaryCta.href}
                className="group flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-accent-hover"
              >
                {page.primaryCta.label}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={page.secondaryCta.href}
                className="rounded-xl border border-border bg-white px-6 py-3.5 text-[15px] font-medium text-text-primary transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                {page.secondaryCta.label}
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-[1000px] px-4 sm:px-6 lg:px-10">
          {page.sections.map((section) => (
            <section key={section.heading} className="border-b border-border py-12 last:border-b-0">
              <h2 className="text-[26px] font-semibold tracking-tight sm:text-[30px]">{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-4 max-w-3xl text-[16px] leading-relaxed text-text-secondary">
                  {paragraph}
                </p>
              ))}
              {section.points && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {section.points.map((point) => (
                    <div key={point.title} className="rounded-xl border border-border bg-white p-5">
                      <h3 className="text-[16px] font-semibold">{point.title}</h3>
                      <p className="mt-1.5 text-[14.5px] leading-relaxed text-text-secondary">{point.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          <section className="border-t border-border py-12">
            <h2 className="text-[26px] font-semibold tracking-tight sm:text-[30px]">Popular resume templates</h2>
            <p className="mt-3 max-w-2xl text-[15px] text-text-secondary">
              Start with a design that fits your field. Every template is free to use and can be changed at any time.
            </p>
            <div className="mt-8">
              <TemplateGrid templates={templateCatalog.slice(0, 3)} />
            </div>
            <Link href="/#templates" className="mt-8 inline-block text-[14px] font-medium text-accent hover:text-accent-hover">
              See all resume templates →
            </Link>
          </section>

          <FaqSection items={page.faq} heading="Frequently asked questions" />

          {related.length > 0 && (
            <section className="border-t border-border py-12">
              <h2 className="text-[22px] font-semibold tracking-tight">Explore more</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {related.map((r) => (
                  <Link
                    key={r!.slug}
                    href={`/${r!.slug}`}
                    className="rounded-lg border border-border px-4 py-2.5 text-[14px] font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
                  >
                    {r!.navLabel}
                  </Link>
                ))}
                <Link
                  href="/resume-examples"
                  className="rounded-lg border border-border px-4 py-2.5 text-[14px] font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
                >
                  Resume examples
                </Link>
                <Link
                  href="/blog"
                  className="rounded-lg border border-border px-4 py-2.5 text-[14px] font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
                >
                  Resume guides
                </Link>
              </div>
            </section>
          )}
        </div>

        <section className="px-4 pb-20 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1000px] rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 px-6 py-12 text-center text-white sm:px-12">
            <h2 className="text-[26px] font-semibold tracking-tight sm:text-[32px]">Ready to start? It&rsquo;s free.</h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-blue-100">
              No sign-up and no credit card. Build a resume now or set up your master resume once.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/builder"
                className="rounded-xl bg-white px-6 py-3.5 text-[15px] font-semibold text-blue-700 transition-all hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Create my free resume
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
      </main>

      <Footer />
    </div>
  );
}
