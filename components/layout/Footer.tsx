import Link from "next/link";
import { seoPages } from "@/lib/seo-pages";

const resources = [
  { href: "/#templates", label: "Resume templates" },
  { href: "/resume-examples", label: "Resume examples" },
  { href: "/blog", label: "Resume guides" },
  { href: "/pricing", label: "Pricing" },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 text-[13px] text-text-secondary sm:grid-cols-[1.4fr_1fr_1fr] sm:px-6 lg:px-10">
        <div>
          <p className="text-[15px] font-semibold text-text-primary">ResumeSpace</p>
          <p className="mt-2 max-w-xs leading-relaxed">
            The free AI resume builder with a master resume. Make a resume or CV, tailor it to any job, and
            download it as a PDF.
          </p>
        </div>

        <nav aria-label="Resume tools">
          <p className="text-[13px] font-semibold text-text-primary">Resume tools</p>
          <ul className="mt-3 flex flex-col gap-2">
            {seoPages.map((page) => (
              <li key={page.slug}>
                <Link href={`/${page.slug}`} className="transition-colors hover:text-text-primary">
                  {page.navLabel}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/master-resume" className="transition-colors hover:text-text-primary">
                Build a master resume
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Resources">
          <p className="text-[13px] font-semibold text-text-primary">Resources</p>
          <ul className="mt-3 flex flex-col gap-2">
            {resources.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-5 text-[12px] text-text-secondary sm:px-6 lg:px-10">
          <span>© {new Date().getFullYear()} ResumeSpace. Free to use.</span>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-text-primary">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
