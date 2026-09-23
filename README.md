# ResumeSpace: Free AI Resume Builder & CV Maker with a Master Resume

**ResumeSpace** is a free **resume builder and CV maker** built with Next.js, React and Supabase.
Write your whole career history once as a **master resume**, then use **AI** to tailor a focused,
**ATS-friendly resume** to any job description and download it as a PDF. No sign-up needed for a one-off resume.

**Live site: [www.resumespace.site](https://www.resumespace.site)**

- **Free resume builder**: build, edit and download a PDF without an account (drafts stay in your browser).
- **AI resume writer**: a per-field AI assistant for summaries and bullet points, powered by DeepSeek.
- **Master resume**: keep your full career history in one place and generate a tailored resume for each job.
- **11 resume and CV templates**: ATS-friendly single-column, two-column, academic CV, graduate, executive and more.
- **Live multi-page preview** with one-click "fit to page", real PDF export, and cross-device saving when signed in
  (magic link or Google).

Keywords: resume builder, CV maker, AI resume builder, free resume builder, master resume, ATS resume templates,
resume generator, PDF resume, Next.js resume app.

> Setup history, dashboards, DNS/email/ads/analytics and the gotchas hit along the way live in
> [docs/SETUP.md](docs/SETUP.md). This README covers how the code is organised.

---

## Contents

1. [Tech stack](#tech-stack)
2. [Running locally](#running-locally)
3. [System overview](#system-overview)
4. [Routes](#routes)
5. [API routes](#api-routes)
6. [Directory layout](#directory-layout)
7. [Core subsystems](#core-subsystems)
8. [Database schema](#database-schema)
9. [External services](#external-services)
10. [What is and isn't wired up](#what-is-and-isnt-wired-up)
11. [Conventions and gotchas](#conventions-and-gotchas)
12. [License and security](#license-and-security)

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS v4, `lucide-react` icons, Inter via `next/font` |
| Database + auth | Supabase (Postgres, Auth, RLS) via `@supabase/ssr` |
| PDF | `@react-pdf/renderer` (generation), `pdf-lib` (page counting) |
| AI | DeepSeek through the `openai` SDK (OpenAI-compatible endpoint) |
| Hosting | Vercel (auto-deploys `main`), domain on GoDaddy |
| Analytics / ads | `@vercel/analytics`, Google AdSense script |

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npx tsc --noEmit   # type-check
```

Create `.env.local` (gitignored):

| Variable | Required | Used for |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase browser/server/proxy clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | same |
| `DEEPSEEK_API_KEY` | for AI | `/api/generate`, `/api/tailor` (server only) |
| `SUPABASE_SERVICE_ROLE_KEY` | for rate limiting | [lib/supabase/admin.ts](lib/supabase/admin.ts). **Server only, never expose it.** If missing, rate limiting is skipped (fail-open) and an error is logged |
| `NEXT_PUBLIC_SITE_URL` | no | Overrides the canonical URL; defaults to `https://www.resumespace.site` ([lib/site.ts](lib/site.ts)) |

Without the Supabase vars the app won't start signed-in flows; without `DEEPSEEK_API_KEY` the AI features
return `502 AI_PROVIDER_ERROR` (master-resume tailoring degrades to a keyword fallback, the AI Helper just
shows an error). Database schema is applied from [supabase/migrations/](supabase/migrations) with the Supabase CLI
(`npx supabase db push`).

---

## System overview

```
                        ┌────────────────────────────── Browser ───────────────────────────────┐
                        │  React client components                                               │
                        │  ├─ Builder / Master resume / My resumes  (edit, live preview)        │
                        │  └─ resumeService  ──►  signed out: localStorage                       │
                        │                    └─►  signed in : Supabase (direct, via RLS)         │
                        └───────────────┬───────────────────────────────┬───────────────────────┘
                                        │ HTML / RSC                    │ fetch()
                                        ▼                               ▼
   ┌───────────────────────────── Next.js on Vercel ────────────────────────────────────────────┐
   │  proxy.ts  (refreshes the Supabase session cookie on every request)                          │
   │                                                                                              │
   │  Server-rendered pages (SEO)          API route handlers                                    │
   │  /, /free-resume-builder, /blog …     /api/pdf            → react-pdf → application/pdf     │
   │  metadata · JSON-LD · sitemap ·       /api/fit-to-page    → many PDF renders, pick a fit    │
   │  robots · OG image                    /api/check-overflow → one PDF render + page count     │
   │                                       /api/generate       → DeepSeek  (AI Helper chat)      │
   │                                       /api/tailor         → DeepSeek  (master resume)       │
   │                                       /api/feedback       → Supabase insert                 │
   │                                       /auth/callback      → exchange auth code for session  │
   └───────────────┬───────────────────────────────────────┬──────────────────────────────────────┘
                   ▼                                       ▼
           Supabase (Postgres + Auth)                  DeepSeek API
           resumes · master_resumes ·                  (only when the user
           feedback · profiles                         invokes an AI feature)
```

Key architectural decisions:

- **Resume pages are client-driven.** The editor, live preview, My Resumes and Master Resume are client
  components that load data after mount, because signed-out data lives in `localStorage`. Marketing/SEO pages
  are server-rendered.
- **One storage facade.** Components never touch `localStorage` or Supabase directly; everything goes through
  [lib/resume/resumeService.ts](lib/resume/resumeService.ts), which picks the backend by auth state.
- **Two renderers per template.** Each template exists once as a DOM component (live preview, marketplace
  cards) and once as a `@react-pdf` component (the actual PDF). They must be kept visually in step; see
  [Templates](#templates).
- **The server does not persist resume content.** `/api/pdf`, `/api/fit-to-page` and `/api/check-overflow`
  receive the draft in the request body, render, and return. Saved resumes are written straight from the
  browser to Supabase under RLS.

---

## Routes

Source: [app/](app). "Indexed" means it is in the sitemap and crawlable.

### Marketing and content (server-rendered, indexed)

| Route | Purpose |
| --- | --- |
| `/` | Landing page: hero, template browser, feature cards, FAQ (with JSON-LD) |
| `/ai-resume-builder`, `/free-resume-builder`, `/master-resume-builder`, `/cv-maker` | Keyword landing pages, all driven by [lib/seo-pages.ts](lib/seo-pages.ts) through `SeoLandingPage` |
| `/templates/[slug]` | Detail page per template (11), with live preview |
| `/resume-examples`, `/resume-examples/[slug]` | 11 role-based example resumes ([lib/resume-examples/examples.ts](lib/resume-examples/examples.ts)) |
| `/blog`, `/blog/[slug]` | 4 guides ([lib/blog/posts.ts](lib/blog/posts.ts), bodies in `components/blog/posts/`) |
| `/pricing` | Planned paid tiers; checkout is not live (see [status](#what-is-and-isnt-wired-up)) |
| `/privacy`, `/terms` | Legal pages |

### App (client-driven, not indexed)

| Route | Auth | Purpose |
| --- | --- | --- |
| `/builder` | none | Creates a new draft (optional `?template=<key>`) and redirects to `/builder/[draftId]` |
| `/builder/[draftId]` | none | The editor: sections nav, forms, AI Helper, live preview, appearance, download |
| `/my-resumes` | none / account | Lists saved resumes. Signed out: this browser only. Signed in: the account's resumes |
| `/master-resume` | **required** | Build the master resume and generate tailored resumes from it. Marked `noindex,follow`; `/master-resume-builder` is the page meant to rank |
| `/sign-in` | none | Magic-link email or Google OAuth |
| `/auth/callback` | none | Route handler: exchanges the auth `code` for a session, redirects to `next` (default `/`) |

### Metadata routes

| File | Output |
| --- | --- |
| [app/sitemap.ts](app/sitemap.ts) | `/sitemap.xml`, all indexed routes (excludes `/master-resume` and app routes) |
| [app/robots.ts](app/robots.ts) | `/robots.txt`, disallows `/builder`, `/my-resumes`, `/sign-in`, `/auth/`, `/api/` |
| [app/opengraph-image.tsx](app/opengraph-image.tsx) | Dynamic Open Graph image via `next/og` |

---

## API routes

All are `POST` route handlers under [app/api/](app/api) and validate their input; the PDF/AI ones set
`maxDuration = 60`.

| Route | Input | Does | Returns |
| --- | --- | --- | --- |
| `/api/pdf` | `ResumeDraft` | Renders the draft with the template's PDF component | `application/pdf` attachment |
| `/api/check-overflow` | `ResumeDraft` | One real PDF render, counts pages with `pdf-lib` | `{ overflowing }` |
| `/api/fit-to-page` | `ResumeDraft` | Renders every fontSize x spacing preset in parallel (largest first), then tries growing `contentScale` for sparse resumes | `{ fontSize, spacing, contentScale, fits, pages }` |
| `/api/generate` | `{ action: "resume-chat", messages, fieldLabel, fieldKind, fieldText, context }` | Chat turn for the AI Helper via DeepSeek | AI response, or `502 AI_PROVIDER_ERROR` |
| `/api/tailor` | `{ master, targetRole?, jobDescription? }` | Asks DeepSeek what to keep/drop from the master resume | `TailorAnalysis`, or `502` |
| `/api/feedback` | `{ kind, message, email?, path }` | Inserts a row into `feedback` (attaches the user if signed in) | `{ ok: true }` |

Every route is rate limited and size-capped through [lib/apiGuard.ts](lib/apiGuard.ts); see
[Abuse protection](#abuse-protection).

---

## Directory layout

```
app/                         Routes (see above). layout.tsx holds metadata, AdSense tag, <Analytics/>
  api/                       pdf, fit-to-page, check-overflow, generate, tailor, feedback
  auth/callback/             OAuth / magic-link code exchange
components/
  builder/                   Editor: BuilderShell, forms (sections/), AiHelper, MultiPageCanvas,
                             LivePreviewPane, PreviewToolbar, SectionsNav, appearance controls
  masterresume/              MasterResumeShell, GeneratePanel (tailoring review UI)
  myresumes/                 MyResumesShell (list, dedupe, delete)
  resume-templates/          DOM templates (11), catalog.ts (metadata), TemplatePreview(Lazy), Section, Avatar
  pdf/                       @react-pdf templates (11) + primitives.tsx
  marketplace/               TemplateBrowser / Card / Grid (landing-page template picker)
  seo/                       SeoLandingPage, FaqSection, JsonLd
  blog/                      Prose + one component per post
  layout/                    Header, Footer, UserMenu, ComingSoon (currently unused)
  feedback/, landing/, resume-examples/, ui/
lib/
  resume/                    types, resumeService (facade), store (local), remoteStore, masterResumeStore,
                             remoteMasterResumeStore, draftHygiene, appearance, tailor, keywords, photo,
                             sample-resumes, sample-extras, optional-sections, id
  pdf/                       renderResumePdf, countPdfPages, downloadPdf, shared (fonts, padding, scale)
  builder/fitToPage.ts       Client wrappers for /api/fit-to-page and /api/check-overflow
  ai/                        deepseekClient, generateResume (chat), tailorResume (analysis), activeField
  supabase/                  client.ts (browser), server.ts (server components / route handlers)
  seo.ts, seo-pages.ts, site.ts
  blog/, resume-examples/    Content data
proxy.ts                     Session refresh (Next 16's replacement for middleware.ts)
supabase/migrations/         0001_init, 0002_feedback, 0003_resume_persistence, 0004_rate_limits
lib/apiGuard.ts              Rate limiting + input-size guards used by every API route
docs/SETUP.md                Infrastructure and setup log
LICENSE, SECURITY.md         License terms and vulnerability reporting
IMPLEMENTATION_PLAN.md       Original product/design plan
```

---

## Core subsystems

### Resume data model

Defined in [lib/resume/types.ts](lib/resume/types.ts).

- `ResumeContent`: contact (including an optional inline `photoDataUrl`), summary, experience, education,
  skills, optional sections (projects, certifications, languages, awards, volunteer, publications).
  Every template renders this same shape.
- `ResumeDraft = ResumeContent & { id, title?, templateKey, appearance, autoFitEnabled?, targeting, ... }`.
- `ResumeAppearance`: accent/header/link colors, font, `fontSize`, `spacing`, layout, photo shape/size, and a
  continuous `contentScale` that only "fit to page" sets.

### Storage: one facade, two backends

[lib/resume/resumeService.ts](lib/resume/resumeService.ts) is the only module UI code calls.

| Operation | Signed out | Signed in |
| --- | --- | --- |
| `loadDraft`, `loadAllDrafts`, `startDraft`, `persistDraft`, `removeDraft` | `localStorage` key `resumecraft:drafts` ([store.ts](lib/resume/store.ts)) | `resumes` table ([remoteStore.ts](lib/resume/remoteStore.ts)) |
| `loadMasterResume`, `persistMasterResume` | not available (sign-in gate) | `master_resumes` table ([remoteMasterResumeStore.ts](lib/resume/remoteMasterResumeStore.ts)) |

Supporting behaviour:

- **Migration on sign-in.** `Header.tsx` calls `migrateLocalDataToAccount` on the `SIGNED_IN` auth event. It
  uploads local drafts once (`upsert` with `ignoreDuplicates`), guarded by the flag
  `resumecraft:migratedToAccount:<userId>`.
- **Self-healing load.** `loadDraft` falls back to a matching local draft and migrates it if it isn't remote yet.
- **Hygiene.** [draftHygiene.ts](lib/resume/draftHygiene.ts) (`hasUsableContent`, `dedupeDrafts`) is shared by
  both backends: blank drafts are dropped, and duplicates of the same person/template session collapse to the
  newest. On the remote path, pruned rows are also **deleted from Supabase**, not just hidden.
- Writes are debounced from the editor (`BuilderShell`, `MasterResumeShell`).

### Builder (editor + live preview)

[components/builder/](components/builder) — a three-part layout: sections nav, section forms, and a live
preview pane.

- **Sections:** Contact, Summary, Experience, Education, Skills, optional sections, Appearance, Change template.
- **AI Helper** (`AiHelper.tsx`): a per-field assistant. `lib/ai/activeField.ts` tracks which field is focused so
  the chat knows what it's editing; context (job title, target role, skills, JD) is sent to `/api/generate`.
- **Multi-page live preview** ([MultiPageCanvas.tsx](components/builder/MultiPageCanvas.tsx)): the template DOM
  is rendered once at A4 width, then each page is a clipped window onto it. Safe break points come from
  measuring real text-line and element rects (`TreeWalker` + `Range.getClientRects()`), so lines aren't cut in
  half. Each page's clip height is `pageBreaks[i+1] - pageBreaks[i]`, not a fixed page height, otherwise text
  duplicates across pages. `lib/resume/appearance.ts` derives px sizes from the PDF's pt values so preview and
  PDF paginate the same way.
- **Auto-fit / Fit to page:** after edits (debounced, unless `autoFitEnabled` is off) the shell calls
  `/api/check-overflow`; overflowing resumes trigger `/api/fit-to-page`, which picks the largest readable
  preset that fits one page. If nothing fits, it keeps the readable size and lets content flow onto page 2+
  rather than crushing the text.
- **Download:** `lib/pdf/downloadPdf.ts` POSTs the draft to `/api/pdf` and saves the response.

### Templates

Eleven: minimal, professional, modern, executive, international, compact, technical, academic, portfolio, bold,
graduate. The `TemplateKey` union in [types.ts](lib/resume/types.ts) is the source of truth.

To add a template you touch four places:

1. `TemplateKey` in `lib/resume/types.ts`
2. An entry in [catalog.ts](components/resume-templates/catalog.ts) (metadata, ATS note, color slots, defaults)
3. A DOM component in `components/resume-templates/` (+ registration in its `index.ts`)
4. A PDF component in `components/pdf/` (+ registration in `lib/pdf/renderResumePdf.tsx`)

Both registries use `satisfies Record<TemplateKey, unknown>`, so a missing entry is a compile error.

The catalog also feeds `/templates/[slug]`, the sitemap, and the marketplace filters (style, format, experience
level). `TemplatePreviewLazy` renders previews client-only so sample-resume text never lands in server HTML.

### PDF generation

[lib/pdf/renderResumePdf.tsx](lib/pdf/renderResumePdf.tsx) renders an A4 `<Document>` with
`@react-pdf/renderer`'s `renderToBuffer`. `countPdfPages.ts` uses `pdf-lib` to count real pages, which is what
makes overflow detection accurate. Shared fonts, padding and scale constants are in `lib/pdf/shared.ts`.

### Master resume and tailoring

1. The user fills in a full career history at `/master-resume` (account-only, autosaved to `master_resumes`).
2. In `GeneratePanel` they enter a target role and/or job description.
3. The panel calls `/api/tailor` (DeepSeek, [lib/ai/tailorResume.ts](lib/ai/tailorResume.ts)), which returns a
   `TailorAnalysis`: per-job relevance/keep/bullet picks, education to keep, ranked skills, and a rewritten
   summary. The prompt forbids inventing employers, degrees or numbers.
4. If the AI call fails, [lib/resume/tailor.ts](lib/resume/tailor.ts) `keywordAnalysis` produces a keyword-overlap
   analysis instead (the UI says it fell back).
5. The user reviews and toggles every job, bullet, education entry and skill, then `buildTailoredContent` +
   `startDraft` create a normal saved draft and open it in the builder.

### AI layer

`lib/ai/deepseekClient.ts` builds a singleton `OpenAI` client with `baseURL: "https://api.deepseek.com"`.
`generateResume.ts` handles the AI Helper chat; `tailorResume.ts` handles master-resume analysis. Both run only
server-side and only when a user triggers them.

### Auth

- [lib/supabase/client.ts](lib/supabase/client.ts) (browser) and [server.ts](lib/supabase/server.ts)
  (server components, route handlers) wrap `@supabase/ssr`.
- [proxy.ts](proxy.ts) calls `supabase.auth.getUser()` on every non-static request so expired access tokens are
  refreshed and server-rendered code sees current auth state.
- `/sign-in` offers `signInWithOtp` (magic link) and `signInWithOAuth` (Google); both redirect to
  `/auth/callback`, which exchanges the code for a session.
- The auth emails go out through Resend SMTP configured in Supabase (see [docs/SETUP.md](docs/SETUP.md)).

### Abuse protection

The AI routes cost money per call and the PDF routes cost server CPU, so every `/api/*` handler starts with
`enforceRateLimit()` from [lib/apiGuard.ts](lib/apiGuard.ts).

- **Fixed-window counters in Postgres**, via the `check_rate_limit()` function ([migration 0004](supabase/migrations/0004_rate_limits.sql)),
  so limits hold across serverless instances. The `rate_limits` table has RLS on with no policies, and the
  function is executable by `service_role` only; the anon key can't read, write or call any of it.
- **Identity:** verified user id when signed in (higher limit), otherwise a SHA-256 hash of the client IP. Raw IPs
  are never stored.
- **Limits per hour (anonymous / signed in):** `generate` 30 / 100, `tailor` 5 / 20, `pdf` 30 / 100,
  `fit-to-page` 60 / 200, `check-overflow` 600 / 1200 (it fires automatically while editing), `feedback` 5 / 20.
  Over the limit returns `429` with `Retry-After`; the AI Helper and feedback box show a friendly message.
- **Fail-open:** if the limiter's backend errors or `SUPABASE_SERVICE_ROLE_KEY` is missing, requests are allowed and
  an error is logged, because blocking every real user is worse than briefly not limiting. Check the logs after
  changing env vars.
- **Input caps:** chat turns, field text and job descriptions are clamped before reaching DeepSeek; drafts over
  200k characters (photo excluded) get `413` on the PDF routes; the master resume is capped at 100k characters.
- **Headers:** `next.config.ts` sets `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` and
  `Permissions-Policy`. There is deliberately no CSP, because a wrong one would silently break AdSense.

### SEO layer

- [lib/seo.ts](lib/seo.ts): `SITE_NAME`, default title/description/keywords, `pageMetadata()` (canonical +
  Open Graph + Twitter in one call), `faqJsonLd()`, `breadcrumbJsonLd()`, `absoluteUrl()`, `noIndex`.
- [lib/site.ts](lib/site.ts): `SITE_URL`, deliberately the **`www`** host, because Vercel 308-redirects the apex
  and canonical/sitemap URLs must not go through that hop.
- [lib/seo-pages.ts](lib/seo-pages.ts) + [components/seo/](components/seo): landing-page content as data, rendered
  by one shell; FAQs are native `<details>` (fully SSR'd) with matching JSON-LD.
- Sitemap, robots and OG image as listed under [Routes](#metadata-routes).

### Content

Blog posts and resume examples are typed arrays (`lib/blog/posts.ts`, `lib/resume-examples/examples.ts`); a new
entry there is automatically routed and added to the sitemap. Template thumbnails live in `public/samples/`.

---

## Database schema

Managed by the SQL files in [supabase/migrations/](supabase/migrations). RLS is enabled on every table.

| Table | Migration | Purpose | Access | Status |
| --- | --- | --- | --- | --- |
| `resumes` | 0001, extended in 0003 | Saved resumes: `title`, `template_key`, `target_role`, `job_description`, `content` (jsonb: contact/summary/experience/education/skills/optional sections), `appearance` (jsonb), `auto_fit_enabled` | owner only (`auth.uid() = user_id`) | **in use** |
| `master_resumes` | 0003 | One row per user (`user_id` unique), the master resume content | owner only | **in use** |
| `feedback` | 0002 | Feedback button submissions (`kind`: bug/idea/other, message, optional email, page, user agent) | insert-only for anon + signed-in; read via the Supabase dashboard | **in use** |
| `profiles` | 0001 | Per-user profile, auto-created by a trigger on `auth.users` insert | owner select/update | created, not read by the app |
| `templates` | 0001 | Template rows | public read | unused (templates live in `catalog.ts`) |
| `subscriptions` | 0001 | Stripe customer/subscription state | owner select | **unused**, no checkout exists |
| `ai_usage` | 0001 | Per-user AI token accounting | owner select | **unused**, nothing writes to it |
| `rate_limits` | 0004 | Fixed-window request counters (hashed IP or user id) | service role only (RLS on, no policies) | **in use** |

`updated_at` is maintained by a shared `set_updated_at()` trigger. Deleting an `auth.users` row cascades to all
user-owned rows (feedback keeps its row and nulls `user_id`).

---

## External services

| Service | Role | Where configured |
| --- | --- | --- |
| Vercel | Hosting, auto-deploy from `main`, Web Analytics | Vercel project + env vars |
| GoDaddy | Domain registrar and DNS for `resumespace.site` | GoDaddy DNS |
| Supabase | Postgres, Auth, RLS | Supabase project |
| Google Cloud | OAuth client for "Continue with Google" | Google Cloud console + Supabase Auth |
| Resend | SMTP relay for magic-link emails | Supabase Auth SMTP settings + DNS (SPF/DKIM) |
| ImprovMX | Inbound forwarding for `@resumespace.site` (`support@` etc.) | ImprovMX + DNS (MX/SPF) |
| DeepSeek | Generative AI backend | `DEEPSEEK_API_KEY` |
| Google Search Console / Bing | Indexing and sitemap submission | Their dashboards |
| Google AdSense | Ads (site verified; see status below) | `<head>` script in `app/layout.tsx` |
| Vercel Analytics | Cookieless page-view/visitor counts | `<Analytics />` in `app/layout.tsx` |

The AdSense tag is a plain `<script>` in an explicit `<head>` on purpose: AdSense's verification crawler doesn't
run JavaScript, and `next/script` doesn't emit a literal tag in the server HTML.

---

## What is and isn't wired up

Written to keep the docs honest about what actually does something.

**Working end to end**

- Building, editing, previewing (multi-page) and downloading PDFs, signed out or in.
- Account persistence of resumes and the master resume, cross-device, with local-to-account migration.
- AI Helper and master-resume tailoring (with keyword fallback for tailoring).
- Feedback capture, magic-link and Google sign-in, custom-domain email in and out.
- SEO surface (metadata, JSON-LD, sitemap, robots, OG images).
- Vercel Analytics: the component is in the layout; data only appears once Web Analytics is enabled for the
  project in the Vercel dashboard.

**Present in the code or UI but not functional**

- **Paid plans.** `/pricing` lists a Starter Pack, 7-Day Pass and Generation Credits, but there is no checkout,
  no Stripe integration, and nothing writes `subscriptions`. The page says so.
- **Premium templates.** `premium: true` (modern, international, portfolio, bold) only shows a badge; nothing
  restricts their use. The catalog comment states this is informational until entitlements exist.
- **Per-user usage accounting.** `ai_usage` is never written. Abuse is handled by rate limiting instead (see
  [Abuse protection](#abuse-protection)), which caps requests but doesn't meter tokens or tie usage to billing.
- **Ads.** The AdSense script is loaded and the site is verified, but there are **no ad units** in the markup.
  Ads only appear if Auto ads is switched on in the AdSense dashboard, or ad slots are added. `/pricing` also
  still describes a "watch an ad for a credit" idea as waiting on an ad network; AdSense display ads don't
  provide that.
- **`jobMatch`** exists on the `ResumeDraft` type (a leftover from the original plan), but nothing computes it and
  `remoteStore` strips it (and `targetingPromptShown`) before writing to Supabase.
- **`ComingSoon`** ([components/layout/ComingSoon.tsx](components/layout/ComingSoon.tsx)) is not used by any page.
- **`templates` and `profiles` tables** are created but not read by the app.

**Not confirmed from the repo**

- DeepSeek account spending cap (set in DeepSeek's dashboard, not visible from code).

---

## Conventions and gotchas

- **This is not the Next.js you know.** Per [AGENTS.md](AGENTS.md), this Next 16 version has breaking changes
  (e.g. `proxy.ts` instead of `middleware.ts`, typed `PageProps<"/route">` / `LayoutProps`). Read the relevant
  guide in `node_modules/next/dist/docs/` before writing framework code.
- Keep canonical URLs on `www` (see [lib/site.ts](lib/site.ts)); a stale `NEXT_PUBLIC_SITE_URL` in Vercel
  overrides the fallback.
- A change to a template's layout usually needs a matching change in **both** its DOM and PDF component, or the
  preview and the downloaded PDF drift apart.
- Env var changes on Vercel need a manual redeploy; a variable saved as **Secret** can't be switched to Config
  (delete and recreate it).
- Before shipping, run `npm run lint`, `npx tsc --noEmit` and `npm run build`. For anything touching
  persistence, auth or AI, verify against the real deployment rather than trusting the code path: silent
  fall-through to `localStorage` is exactly how resumes once appeared saved without ever reaching an account.
- The Privacy Policy and Terms are written from what the code actually does; update them (and `LAST_UPDATED`)
  whenever data collection, third parties, or contact details change.

---

## License and security

- **License:** all rights reserved. The source is public for viewing and reference; see [LICENSE](LICENSE). Ask
  before reusing any of it.
- **Security issues:** report privately per [SECURITY.md](SECURITY.md); please don't open public issues for them.
