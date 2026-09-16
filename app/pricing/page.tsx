import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Pricing — ResumeCraft",
  description: "Free to build. Pay only when you need more than one resume.",
};

const plans = [
  {
    name: "Starter Pack",
    badge: "Try it first",
    price: "$2.99",
    unit: "one time",
    description: "A small taste — enough for one focused application, before you commit to more.",
    features: [
      "3 tailored generations from your Master Resume",
      "Every premium template unlocked for 48 hours",
      "No account limits — upgrade to a Pass or Credits any time",
    ],
  },
  {
    name: "7-Day Pass",
    badge: "Most popular",
    price: "$12.99",
    unit: "one time",
    description: "For an active job search — apply as much as you want for a week.",
    features: [
      "Every template, including premium ones",
      "Unlimited tailored generations from your Master Resume",
      "Unlimited saved resumes for 7 days",
      "No auto-renewal — it just ends",
    ],
  },
  {
    name: "Generation Credits",
    price: "$7.99",
    unit: "for 10 credits",
    description: "For occasional use — buy once, spend whenever, credits never expire.",
    features: [
      "1 credit per tailored generation from your Master Resume",
      "Use them the day you buy them or months later",
      "Core templates included at no cost, always",
      "Top up any time",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <section className="mx-auto w-full max-w-[1160px] px-4 pt-14 pb-24 sm:px-6 lg:px-10">
        <div className="max-w-xl">
          <h1 className="text-[32px] font-semibold tracking-tight sm:text-[36px]">Pricing</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
            Building a resume, choosing a template, editing every section, and
            downloading the PDF is free — no account, no limit. These are for
            when you want more: every template, or tailored generations from
            your Master Resume beyond the free ones.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="flex flex-col rounded-xl border border-border p-6">
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-semibold">{plan.name}</h2>
                {plan.badge && (
                  <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                    {plan.badge}
                  </span>
                )}
              </div>
              <p className="mt-3 flex items-baseline gap-1.5">
                <span className="text-[30px] font-semibold tracking-tight">{plan.price}</span>
                <span className="text-[13px] text-text-secondary">{plan.unit}</span>
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
                {plan.description}
              </p>

              <ul className="mt-5 flex flex-col gap-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[13.5px]">
                    <Check size={16} className="mt-0.5 shrink-0 text-accent" strokeWidth={2} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-in"
                className="mt-6 rounded-lg bg-accent px-4 py-2.5 text-center text-[14px] font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Create an account
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-border bg-bg-secondary p-6">
          <p className="text-[14px] font-medium">Don&rsquo;t want to pay?</p>
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-text-secondary">
            You&rsquo;ll be able to watch one or two short ads to earn a single
            generation credit, no purchase needed. This depends on an ad
            network we haven&rsquo;t connected yet — it needs ResumeCraft to be
            live at a real domain before an ad provider will approve it, so
            it&rsquo;s coming after checkout, not before.
          </p>
        </div>

        <p className="mt-6 text-[13px] text-text-secondary">
          Checkout isn&rsquo;t live yet — everything on ResumeCraft is free to
          use while this is in progress. Creating an account now reserves your
          spot for when it is.
        </p>
      </section>

      <Footer />
    </div>
  );
}
