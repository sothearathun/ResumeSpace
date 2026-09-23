# ResumeSpace — Setup & Infrastructure Log

This documents everything set up for ResumeSpace end to end: hosting, domain, database, auth,
email, AI, SEO, ads, and analytics. It's a reference for "what exists and why," not a tutorial —
if a step needs redoing (e.g. after an account reset), the relevant dashboard will guide you
through the actual click-path; this records the decisions and the non-obvious gotchas.

Stack: Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Supabase
(Postgres + Auth) · DeepSeek (AI) · Vercel (hosting) · GoDaddy (domain registrar).

---

## 1. Hosting — Vercel

- The GitHub repo (`sothearathun/ResumeCraft`) is connected to a single Vercel project, auto-deploying
  `main` on every push.
- **Gotcha:** at one point the repo got connected to **two** Vercel projects simultaneously (both
  auto-deploying from the same GitHub repo), which caused confusion about which one actually had
  correct env vars set. The duplicate was deleted; only one project should ever exist for this repo.
  If a deploy doesn't reflect env var changes, check Vercel's project list for duplicates first.
- Environment variables are managed in Project → Settings → Environment Variables, scoped per
  environment (Production / Preview / Development).
  - **Gotcha:** a variable saved with type **Secret** is write-only and **cannot be converted to
    Config** after the fact — the UI locks the type selector and can also block the Save button
    entirely on the edit screen. To change a Secret-typed variable's type (e.g. to expose it to the
    browser via `NEXT_PUBLIC_`), delete it and re-create it fresh, choosing Config at creation time.
  - Env var changes require a manual **Redeploy** to take effect — editing the value alone does not
    trigger a new deploy.
- **Vercel Analytics** is enabled for visitor/pageview tracking — see [§8](#8-analytics--vercel-analytics).
- "Edge Requests" in the Vercel dashboard overview is a raw request counter (includes every asset
  fetch: JS bundles, images, API calls) — **not** a visitor count. Don't use it as a traffic metric;
  use the Analytics tab instead.

## 2. Domain — GoDaddy + Vercel

- Domain `resumespace.site` purchased on GoDaddy, DNS pointed at Vercel via the A/CNAME records
  Vercel's domain-add flow provides.
- Both the apex (`resumespace.site`) and `www.resumespace.site` are added as domains in Vercel.
  Vercel is configured to **308-redirect the apex to `www`** (i.e. `www` is canonical).
- **Gotcha (root cause of a real SEO bug):** every canonical URL, sitemap entry, robots.txt
  `Sitemap:` line, and OG/Twitter meta tag must point at `https://www.resumespace.site`, not the
  apex — otherwise Google's sitemap fetcher chokes on the redirect hop. This is centralized in
  [`lib/site.ts`](../lib/site.ts):

  ```ts
  export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.resumespace.site";
  ```

  The `NEXT_PUBLIC_SITE_URL` env var in Vercel overrides this and must be kept in sync if the
  domain setup ever changes (it was the var that hit the Secret/Config lock bug above).

## 3. Database & Auth — Supabase

- Supabase project provides Postgres (schema managed via CLI migrations in `supabase/migrations/`)
  and Auth (magic link + Google OAuth).
- Client access via `@supabase/ssr` — separate browser and server clients, with RLS policies
  enforcing `auth.uid() = user_id` on every user-owned table.
- Key tables:
  - `resumes` — saved/reusable resumes per user. Columns include `template_key`, `appearance`
    (jsonb), `auto_fit_enabled`.
  - `master_resumes` — one row per user (`user_id` unique), the canonical "everything you've ever
    done" resume that other resumes get tailored from.
  - `feedback` — messages from the in-app Feedback button (message, page, user agent, optional
    account, optional typed-in email).
  - `auth.users` — Supabase-managed; cascades deletes to owned rows.
- **Google OAuth** is configured as a sign-in provider (client ID/secret registered in both Google
  Cloud Console and Supabase Auth settings, redirect URLs pointing at the Supabase auth callback
  and the production domain).
- **Storage model (important architectural decision):** dual-mode, unified behind
  [`lib/resume/resumeService.ts`](../lib/resume/resumeService.ts) so UI components never touch
  storage directly:
  - **Signed out:** resumes live only in `localStorage` on the visitor's device. You can build,
    edit, and download a PDF with zero account. Nothing touches Supabase.
  - **Signed in:** resumes and the master resume are persisted to Supabase, tied to the account,
    accessible from any device.
  - On sign-in, `migrateLocalDataToAccount` (called from `Header.tsx` on the `SIGNED_IN` auth
    event) copies any local-only drafts up to the account once, guarded by a per-user localStorage
    flag so it doesn't re-run.
  - **Bug fixed this project:** resumes were originally never actually written to Supabase at all —
    only ever saved to `localStorage`, silently, even for signed-in users. The schema existed but
    the write path didn't use it. Fixed by wiring `BuilderShell`, `MyResumesShell`,
    `MasterResumeShell`, and `GeneratePanel` through `resumeService` for real reads/writes.
  - **Follow-up bug fixed:** once wired up, the remote path didn't apply the same
    prune/dedupe-empty-drafts logic the local path always had, causing signed-in accounts to
    accumulate junk blank-draft rows. Fixed by extracting shared logic into
    `lib/resume/draftHygiene.ts` (`hasUsableContent`, `dedupeDrafts`) used by both paths, and having
    `resumeService.loadAllDrafts()` actually delete the pruned rows remotely, not just filter them
    client-side.

## 4. AI — DeepSeek

- The app's only generative-AI backend. Accessed via the `openai` SDK pointed at DeepSeek's
  API endpoint (`lib/ai/generateResume.ts`, `lib/ai/tailorResume.ts`).
- Used by: the AI Helper (writing assistance on individual fields) and the master-resume tailoring
  feature (rewrites your master resume toward a specific job description).
- Config: `DEEPSEEK_API_KEY` env var, must be set in **Vercel's Production environment**
  specifically — a scoping mismatch here (key present in one environment but not Production) was
  the root cause of a real "Couldn't reach the assistant" outage, diagnosed by curling
  `/api/generate` on the live domain directly and getting a `502 AI_PROVIDER_ERROR`.
- A DeepSeek account spending cap was intended to be set (to bound cost exposure) — **status
  unconfirmed**; verify this is actually set in the DeepSeek dashboard's billing/limits page.

## 5. Transactional Email — Resend + ImprovMX

Two separate, non-overlapping email systems:

- **Resend** — SMTP relay used by Supabase Auth to send magic-link sign-in emails from the
  domain (instead of Supabase's shared/rate-limited default sender). Requires domain verification
  via SPF/DKIM TXT records added in GoDaddy DNS. Configured as custom SMTP in Supabase Auth
  settings.
- **Gravatar** — the sender avatar shown in Gmail/other clients for outgoing mail from the domain
  is sourced from a Gravatar profile registered against the sending address.
- **ImprovMX** — free inbound email forwarding for `@resumespace.site` addresses, set up **without**
  changing nameservers (just MX + SPF TXT records added alongside the existing DNS). This is what
  makes `support@resumespace.site` (used on the Privacy/Terms pages — see [§9](#9-legal-pages))
  actually deliver mail.
  - A **catch-all alias** (`*@resumespace.site`) forwards everything to the personal inbox, so any
    address at the domain works without needing to be individually added.
  - To add a named alias explicitly (optional, since the catch-all already covers it): ImprovMX
    dashboard → the domain → Aliases → type the local part → Add.

## 6. SEO

- **Metadata:** centralized helpers in [`lib/seo.ts`](../lib/seo.ts) — `SITE_NAME`,
  `DEFAULT_TITLE`, `DEFAULT_DESCRIPTION`, `KEYWORDS`, `pageMetadata()` (keeps canonical/OG/Twitter
  tags consistent per page), `faqJsonLd()`, `breadcrumbJsonLd()`.
- **Landing pages** targeting high-intent keywords, defined declaratively in
  [`lib/seo-pages.ts`](../lib/seo-pages.ts) and rendered by
  [`components/seo/SeoLandingPage.tsx`](../components/seo/SeoLandingPage.tsx):
  - `/ai-resume-builder`
  - `/free-resume-builder`
  - `/master-resume-builder`
  - `/cv-maker`

  Each has its own title/description/keywords/H1/intro/sections/FAQ/related-pages. FAQs render as
  native `<details>` elements — fully server-rendered, no JS required, with matching FAQ JSON-LD.
- The **tool** at `/master-resume` is intentionally `noindex, follow` — the **content** page at
  `/master-resume-builder` is what's meant to rank; the tool page just isn't useful as a search
  result.
- `TemplatePreviewLazy.tsx` client-wraps template previews so sample-resume placeholder text
  doesn't get indexed as if it were real page content.
- **Sitemap** ([`app/sitemap.ts`](../app/sitemap.ts)): includes home, blog, resume examples,
  pricing, privacy, terms, all SEO landing pages, template pages, blog posts, and resume examples.
  Deliberately excludes `/master-resume` (noindex) and app/auth routes.
- **Robots** ([`app/robots.ts`](../app/robots.ts)): disallows `/builder`, `/my-resumes`,
  `/sign-in`, `/auth/`, `/api/`.
- **OG images:** dynamic per-page via `next/og`'s `ImageResponse`
  ([`app/opengraph-image.tsx`](../app/opengraph-image.tsx)).
- **Google Search Console:** domain property verified for `resumespace.site`. Sitemap submission
  had transient issues (relative path `sitemap.xml` → "Invalid sitemap address"; full URL accepted
  but briefly showed "Couldn't fetch" before resolving on its own — never conclusively root-caused,
  possibly just propagation delay). If this recurs, re-check Vercel's Firewall settings (Bot
  Protection / IP Blocking / Attack Mode) aren't blocking Googlebot, and resubmit the **absolute**
  URL `https://www.resumespace.site/sitemap.xml`.
- Sitemap also submitted to Bing Webmaster Tools.

## 7. Monetization — Google AdSense

- AdSense client ID: `ca-pub-1317984984029392`.
- **Gotcha (the one real bug here):** AdSense's site-ownership verification crawler fetches raw
  HTML **without executing JavaScript**. `next/script` — regardless of `strategy` (including
  `beforeInteractive`) — doesn't satisfy this, because Next.js injects the script via its own
  runtime bootstrap rather than writing a literal `<script>` tag into the server-rendered HTML.
  Verified by curling the live site and confirming the client ID only appeared inside a
  `<link rel="preload">` and Next's internal script-data JSON, never as an actual `<script>` tag.
- **Fix:** a plain, literal JSX `<script>` tag inside an explicit `<head>` element in
  [`app/layout.tsx`](../app/layout.tsx):

  ```tsx
  <head>
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1317984984029392"
      crossOrigin="anonymous"
    />
  </head>
  ```

  Verified working by curling raw SSR'd HTML both locally and in production and confirming the
  exact tag appears verbatim; AdSense's "Verify site ownership" step then passed immediately.

## 8. Analytics — Vercel Analytics

- Package: `@vercel/analytics`, added as a real dependency (not a dev/test-only install).
- Wired via `import { Analytics } from "@vercel/analytics/next"` and `<Analytics />` rendered in
  the `<body>` of [`app/layout.tsx`](../app/layout.tsx).
- Cookieless — reports aggregate page views/visitors without tracking individuals.
- **Manual step required beyond the code:** the `<Analytics />` component alone doesn't make data
  appear — Web Analytics must be enabled in Vercel's dashboard (Project → Analytics tab → Enable).
  Free on Hobby up to a monthly event limit.

## 9. Legal Pages

- [`app/privacy/page.tsx`](../app/privacy/page.tsx) and [`app/terms/page.tsx`](../app/terms/page.tsx).
- Written from actually-verified facts about the codebase (grepped storage/data flows, checked what
  the feedback table stores, confirmed what gets sent to DeepSeek, etc.) rather than boilerplate —
  and kept in sync as real changes shipped:
  - Updated when Vercel Analytics + AdSense were added (previously claimed "no analytics or
    advertising trackers," which became false).
  - Contact address changed from the personal Gmail to `support@resumespace.site` (forwards via the
    ImprovMX catch-all — see [§5](#5-transactional-email--resend--improvmx)) so a public-facing
    legal document doesn't expose a personal inbox.
- Both pages track a `LAST_UPDATED` constant, bumped whenever the content changes.

## 10. Abuse Protection & Rate Limiting

- Every `/api/*` route calls `enforceRateLimit()` ([lib/apiGuard.ts](../lib/apiGuard.ts)) before doing any work.
  Counters live in Postgres (`rate_limits` table + `check_rate_limit()` function, migration
  `0004_rate_limits.sql`), so they hold across serverless instances. Per-route limits are in the `LIMITS` object
  in that file.
- **Requires `SUPABASE_SERVICE_ROLE_KEY` in Vercel** (Project → Settings → Environment Variables, type **Secret**,
  Production; redeploy after adding). It is server-only: never prefix it with `NEXT_PUBLIC_`. If it is missing the
  limiter fails open (requests allowed) and logs `Rate limiting is DISABLED` in the function logs, so check the
  logs after deploying. Get the value from Supabase → Project Settings → API keys → `service_role`.
- The migration was applied to the live project with
  `npx supabase db query --linked -f supabase/migrations/0004_rate_limits.sql` (Management API, no DB password
  needed). `npx supabase db push` needs `SUPABASE_DB_PASSWORD`. The migration is idempotent, so re-running it is
  safe.
- Verified against the live project: limits trip at exactly the configured counts, signed-in users are counted by
  user id, and the anon key is denied on both the function (`42501`) and the table (RLS, 0 rows).
- `next.config.ts` adds baseline security headers. There is intentionally no Content-Security-Policy, because a
  wrong one would silently break AdSense.

## 11. Making the Repository Public

Done in GitHub (Settings), not in code:

- **Visibility:** Settings → General → Danger Zone → Change visibility → Public.
- **About box:** description, website `https://www.resumespace.site`, and topics (see the README's keywords).
- **Rename** the repo from `ResumeCraft` to `resumespace` (GitHub redirects the old URL). Update the local remote
  afterwards with `git remote set-url origin <new url>`, and check Vercel still shows the connected repo.
- **Branches → Add rule for `main`:** block force pushes and deletions.
- **Code security:** enable Secret scanning + Push protection, Dependabot alerts, and Private vulnerability
  reporting.
- **Actions → General:** require approval for workflows from outside contributors.
- **Features:** disable Wiki / Projects / Discussions if unused.
- **Profile → Emails:** enable "Keep my email addresses private" and "Block command line pushes that expose my
  email".
- The repo has a restrictive [LICENSE](../LICENSE) (all rights reserved) on purpose; relicensing to MIT later is
  possible, taking back an open license once granted is not.

## 12. Working Practices Established

- **Never trust "it should work"** for anything touching production: verify via real `curl` against
  both local dev and the live domain, real Playwright browser automation, and real Supabase queries
  (using a service-role key fetched fresh via `npx supabase projects api-keys --reveal`, never
  committed anywhere, deleted from scratch files immediately after use) — not by reading code and
  assuming.
  - Signed-in flows were tested end-to-end by minting a real Supabase session for a disposable test
    user and injecting it as the `sb-<project-ref>-auth-token` cookie, rather than stubbing auth.
  - Test users/data are always cleaned up (`admin.auth.admin.deleteUser`) after verification.
- Lint (`eslint`), type-check (`tsc --noEmit`), and `next build` are run before treating any change
  as done.
