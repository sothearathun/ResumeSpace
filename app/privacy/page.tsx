import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "What ResumeSpace collects, why, and how to control it.",
  path: "/privacy",
});

const LAST_UPDATED = "September 23, 2026";

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <article className="mx-auto w-full max-w-[720px] px-4 pt-14 pb-24 sm:px-6 lg:px-10">
        <h1 className="text-[32px] font-semibold tracking-tight sm:text-[36px]">Privacy Policy</h1>
        <p className="mt-2 text-[13px] text-text-secondary">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8 flex flex-col gap-8 text-[15px] leading-relaxed text-text-primary">
          <p>
            This page explains what ResumeSpace collects, why, and how to control it. It&rsquo;s written in
            plain language on purpose. If anything here is unclear, use the Feedback button on the site or
            email <a href="mailto:support@resumespace.site" className="text-accent hover:text-accent-hover">support@resumespace.site</a>.
          </p>

          <section>
            <h2 className="text-[19px] font-semibold">What we collect</h2>
            <div className="mt-3 flex flex-col gap-4">
              <div>
                <h3 className="text-[15px] font-medium">If you don&rsquo;t create an account</h3>
                <p className="mt-1 text-text-secondary">
                  You can build and download a resume without signing in. Everything you type — including
                  any photo you upload — is stored only in your browser&rsquo;s local storage, on your own
                  device. We don&rsquo;t receive or store it on our servers, except briefly and only to
                  generate the PDF you asked for or to use an AI feature (see below).
                </p>
              </div>
              <div>
                <h3 className="text-[15px] font-medium">If you sign in</h3>
                <p className="mt-1 text-text-secondary">
                  We use Supabase for authentication and storage. Signing in with a magic link uses your
                  email address; signing in with Google shares your name, email, and profile picture with
                  us, as provided by Google. Once signed in, your resumes and master resume — including any
                  photo you add — are stored on our servers (via Supabase) tied to your account, so you can
                  access them from any device.
                </p>
              </div>
              <div>
                <h3 className="text-[15px] font-medium">Resume content</h3>
                <p className="mt-1 text-text-secondary">
                  Whatever you enter: contact details, work history, education, skills, and any optional
                  sections you add. This can include personal information you choose to include, like a
                  phone number, address, or photo. Only include what you&rsquo;re comfortable storing with
                  us.
                </p>
              </div>
              <div>
                <h3 className="text-[15px] font-medium">Feedback</h3>
                <p className="mt-1 text-text-secondary">
                  If you use the Feedback button, we store the message you write, the page you sent it
                  from, your browser&rsquo;s user agent, and — if you&rsquo;re signed in — your account. An
                  email address is only stored if you choose to type one in.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold">AI features</h2>
            <p className="mt-3 text-text-secondary">
              The AI Helper and the master resume tailoring feature send relevant text — such as the field
              you&rsquo;re editing, your job title, target role, or job description — to{" "}
              <a href="https://www.deepseek.com" target="_blank" rel="noreferrer" className="text-accent hover:text-accent-hover">
                DeepSeek
              </a>
              , a third-party AI provider, in order to generate a response. This only happens when you
              actively use an AI feature — it isn&rsquo;t running in the background. We don&rsquo;t control
              DeepSeek&rsquo;s own data retention; see their policies for details.
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold">Abuse prevention</h2>
            <p className="mt-3 text-text-secondary">
              To stop misuse of the AI and PDF features, we count requests per visitor. If you&rsquo;re signed
              in that&rsquo;s tied to your account; otherwise it&rsquo;s tied to a one-way hash of your IP
              address, so we never store the address itself. These counters are short-lived and old ones are
              periodically deleted automatically.
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold">Analytics and ads</h2>
            <p className="mt-3 text-text-secondary">
              We use Vercel Analytics to count page views and visitors. It doesn&rsquo;t use cookies and
              doesn&rsquo;t track you individually — it reports anonymous, aggregated numbers like how many
              people visited a page, not who they were.
            </p>
            <p className="mt-3 text-text-secondary">
              This site also works with Google AdSense to show ads, which helps keep it free. Once ads are
              running, Google may set cookies and use data about your visit to show relevant ads, including
              to comply with consent requirements in the EEA, UK, and Switzerland. You can see and control
              how Google uses this at{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-accent hover:text-accent-hover">
                adssettings.google.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold">What we don&rsquo;t do</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-text-secondary">
              <li>We don&rsquo;t sell or share your resume content with data brokers or advertisers.</li>
              <li>We don&rsquo;t send your resume anywhere except to generate your own PDF or, when you use an AI feature, to DeepSeek as described above.</li>
              <li>Payments aren&rsquo;t live yet — we don&rsquo;t currently process or store any billing information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold">Cookies</h2>
            <p className="mt-3 text-text-secondary">
              If you sign in, we use a cookie set by Supabase to keep you signed in. Vercel Analytics
              doesn&rsquo;t use cookies. Google AdSense may set advertising cookies once ads are running, as
              described above.
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold">Your choices</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-text-secondary">
              <li>You can delete any saved resume yourself from the My Resumes page.</li>
              <li>You can sign out at any time from the account menu.</li>
              <li>
                To delete your account and everything tied to it (resumes, master resume, feedback), email{" "}
                <a href="mailto:support@resumespace.site" className="text-accent hover:text-accent-hover">support@resumespace.site</a>{" "}
                and we&rsquo;ll remove it.
              </li>
              <li>If you never sign in, clearing your browser&rsquo;s site data removes everything, since nothing was stored elsewhere.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold">Changes to this policy</h2>
            <p className="mt-3 text-text-secondary">
              If this changes in a way that matters, we&rsquo;ll update the date at the top of this page.
            </p>
          </section>
        </div>
      </article>

      <Footer />
    </div>
  );
}
