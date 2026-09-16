import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TemplateBrowser } from "@/components/marketplace/TemplateBrowser";
import { templateCatalog } from "@/components/resume-templates/catalog";

export const metadata: Metadata = {
  title: "Templates — ResumeCraft",
  description: "Browse resume templates and start building.",
};

export default function TemplatesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <section className="mx-auto w-full max-w-[1280px] px-4 pt-14 pb-24 sm:px-6 lg:px-10">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-[32px] font-semibold tracking-tight sm:text-[36px]">
            Choose a template
          </h1>
          <p className="mt-2 text-[14px] text-text-secondary">
            Start with a design that fits your experience and the kind of
            role you&rsquo;re applying for.
          </p>
        </div>

        <TemplateBrowser templates={templateCatalog} />
      </section>

      <Footer />
    </div>
  );
}
