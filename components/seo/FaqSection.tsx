import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/seo";

/** FAQ as native <details> elements: fully server-rendered (all answers are in
 * the HTML for crawlers) and accessible without any client JavaScript. */
export function FaqSection({ items, heading }: { items: FaqItem[]; heading: string }) {
  return (
    <section className="border-t border-border py-12">
      <h2 className="text-[26px] font-semibold tracking-tight sm:text-[30px]">{heading}</h2>
      <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-white">
        {items.map((item) => (
          <details key={item.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium">
              {item.q}
              <ChevronDown size={18} className="shrink-0 text-text-secondary transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-text-secondary">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
