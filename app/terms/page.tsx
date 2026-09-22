import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms for using ResumeSpace.",
  path: "/terms",
});

const LAST_UPDATED = "September 22, 2026";

export default function TermsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <article className="mx-auto w-full max-w-[720px] px-4 pt-14 pb-24 sm:px-6 lg:px-10">
        <h1 className="text-[32px] font-semibold tracking-tight sm:text-[36px]">Terms of Service</h1>
        <p className="mt-2 text-[13px] text-text-secondary">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8 flex flex-col gap-8 text-[15px] leading-relaxed text-text-primary">
          <p>
            These are the terms for using ResumeSpace. By using the site, you agree to them. If you have
            questions, use the Feedback button or email{" "}
            <a href="mailto:thunsotheara01@gmail.com" className="text-accent hover:text-accent-hover">thunsotheara01@gmail.com</a>.
          </p>

          <section>
            <h2 className="text-[19px] font-semibold">The service</h2>
            <p className="mt-3 text-text-secondary">
              ResumeSpace is a resume and CV builder with an AI writing assistant and a master resume
              feature. It&rsquo;s free to use. Building, editing, and downloading a resume doesn&rsquo;t
              require an account; some features — like the master resume — require signing in so your
              information can be saved to your account.
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold">Your content</h2>
            <p className="mt-3 text-text-secondary">
              You own what you enter into ResumeSpace — your resume content, photos, and any text you
              write. You&rsquo;re responsible for making sure it&rsquo;s accurate. We don&rsquo;t claim
              ownership of it, and we only use it to provide the service to you (building your resume,
              generating your PDF, and — when you ask for it — sending relevant text to our AI provider to
              help you write it).
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold">AI-generated content</h2>
            <p className="mt-3 text-text-secondary">
              The AI Helper and tailoring features are meant to assist your writing, not replace your
              judgment. AI-generated text can be wrong, generic, or miss context it doesn&rsquo;t have.
              You&rsquo;re responsible for reviewing anything AI writes before you send your resume to an
              employer — including checking that no incorrect claims made it in.
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold">Acceptable use</h2>
            <p className="mt-3 text-text-secondary">Please don&rsquo;t use ResumeSpace to:</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-text-secondary">
              <li>Build a resume containing content that&rsquo;s illegal, fraudulent, or intended to deceive an employer about your identity.</li>
              <li>Attempt to disrupt the service, abuse the AI features to burn through resources, or access other users&rsquo; accounts or data.</li>
              <li>Scrape, resell, or republish the site&rsquo;s templates or content as your own product.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold">Accounts</h2>
            <p className="mt-3 text-text-secondary">
              You&rsquo;re responsible for keeping access to your email or Google account secure, since
              that&rsquo;s how you sign in. If you believe your account has been accessed without
              permission, let us know.
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold">No warranty</h2>
            <p className="mt-3 text-text-secondary">
              ResumeSpace is provided as-is, without warranties of any kind. We do our best to keep it
              working correctly, but we don&rsquo;t guarantee the service will be uninterrupted, error-free,
              or that AI-generated suggestions will be accurate. We&rsquo;re not liable for outcomes of your
              job applications.
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold">Changes</h2>
            <p className="mt-3 text-text-secondary">
              We may update these terms or the service itself over time. If a change is significant,
              we&rsquo;ll update the date at the top of this page. Continuing to use the site after a change
              means you accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold">Ending your use</h2>
            <p className="mt-3 text-text-secondary">
              You can stop using ResumeSpace and delete your account at any time — see the Privacy Policy
              for how. We may suspend access for accounts that violate the acceptable use terms above.
            </p>
          </section>
        </div>
      </article>

      <Footer />
    </div>
  );
}
