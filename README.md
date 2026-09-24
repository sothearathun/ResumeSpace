# ResumeSpace: Free AI Resume Builder & CV Maker with a Master Resume

**ResumeSpace** is a free **resume builder and CV maker** built with Next.js, React and Supabase.
Write your whole career history once as a **master resume**, then use **AI** to tailor a focused,
**ATS-friendly resume** to any job description and download it as a PDF. No sign-up needed for a one-off resume.

**Live site: [www.resumespace.site](https://www.resumespace.site)**

- **Free resume builder**: build, edit and download a PDF without an account (drafts stay in your browser).
- **AI resume writer**: a per-field AI assistant for summaries and bullet points.
- **Master resume**: keep your full career history in one place and generate a tailored resume for each job.
- **11 resume and CV templates**: ATS-friendly single-column, two-column, academic CV, graduate, executive and more.
- **Live multi-page preview** with one-click "fit to page", real PDF export, and cross-device saving when signed in
  (magic link or Google).

Keywords: resume builder, CV maker, AI resume builder, free resume builder, master resume, ATS resume templates,
resume generator, PDF resume, Next.js resume app.

---

## Contents

1. [Tech stack](#tech-stack)
2. [Running locally](#running-locally)
3. [How it's organised](#how-its-organised)
4. [Templates](#templates)
5. [Contributing](#contributing)
6. [License and security](#license-and-security)

---

## Tech stack

Next.js (App Router), React, TypeScript, Tailwind CSS · Supabase (Postgres, Auth, RLS) · `@react-pdf/renderer`
for PDF generation · an LLM API for the AI writing assistant · hosted on Vercel.

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint        # eslint
npx tsc --noEmit    # type-check
```

You'll need your own `.env.local` (gitignored) with a Supabase project's URL and anon key, and an API key for
the AI provider if you want the AI features to work. The app runs without an AI key — the AI-dependent
features just won't respond. Database schema lives in [supabase/migrations/](supabase/migrations).

---

## How it's organised

- **Client-driven editor, server-rendered marketing pages.** The resume builder, My Resumes and the master
  resume are client components (they need to work without an account, using the browser's local storage).
  The landing page, template pages, blog and guides are server-rendered for SEO.
- **One storage layer, two backends.** All resume reads/writes go through a single service module. Signed
  out, drafts live in the browser. Signed in, they're saved to your Supabase account under row-level security,
  and available on any device.
- **A template renders twice.** Each resume template has a browser version (for the live preview) and a PDF
  version (for the actual download), kept in step with each other.
- **A handful of API routes** handle PDF rendering, the "fit to page" sizing, the AI assistant, tailoring a
  resume from the master resume, and feedback submissions. They're stateless — a draft is sent in, a result
  comes back, nothing is stored server-side by them directly.

```
app/            Routes: the landing page, template & example pages, the blog, the builder, API routes
components/     UI: the builder, resume templates (browser + PDF versions), marketing/SEO components
lib/            Storage, PDF rendering, AI integration, SEO helpers
supabase/       Database schema (migrations)
```

## Templates

Eleven templates ship today: Minimal, Professional, Modern, Executive, International, Compact, Technical,
Academic, Portfolio, Bold, and Graduate — covering ATS-friendly single-column layouts through to
photo-and-sidebar formats used internationally. Each one exists as both a live-preview component and a
matching PDF component, registered together so the two can't drift apart.

## Contributing

This is a personal project and isn't currently set up for outside contributions, but bug reports and
suggestions are welcome via [SECURITY.md](SECURITY.md) (for anything security-related) or the in-app Feedback
button for everything else.

---

## License and security

- **License:** all rights reserved. The source is public for viewing and reference; see [LICENSE](LICENSE). Ask
  before reusing any of it.
- **Security issues:** report privately per [SECURITY.md](SECURITY.md) — please don't open public issues for
  them.
