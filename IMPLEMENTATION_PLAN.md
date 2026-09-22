# ResumeSpace — Implementation Plan

Direction: **template-first**, not question-first. The user sees real templates immediately, picks one, and only then optionally tells ResumeSpace what role they're targeting. AI is an assist layered onto a builder that works fine without it. Visually, the product reads as a premium, restrained productivity tool — see §12 for the full design system — not a generic AI-SaaS landing page.

```
Browse templates → Pick one → (optional) target role + job description → Build in a 3-pane editor → AI assist where useful → Customize appearance → Download PDF
```

Entry order is not fixed to "template first." A user can also **import an existing resume** before picking a template, or pick a template first and import into it afterward — both orders lead to the same populated draft (§8.2).

This is a larger surface than the original 5-screen wizard — see §11 for an explicit v1 cut vs. what's sequenced later.

## 1. Goal & non-goals

**Goal:** ResumeSpace feels like a template marketplace + document editor, not a form wizard. Templates are the product; AI and job-targeting are optional assists layered on top, never a gate before the user sees value. Visually it should look like it was designed by an experienced product designer in Figma, not generated from an AI-SaaS template (§12).

**Non-goals for v1 (see §11 for the full phase breakdown):**
- No chatbot-style AI UI — AI actions are small, inline, specifically-worded, and scoped to one field/section at a time (§8, §12.9)
- No fabricated achievements — AI rewrites what the user gave it; it doesn't invent numbers or accomplishments
- No claim of an official ATS score — the job-targeting feature is labeled "Job Match," not "ATS Score," and the methodology (keyword/skill overlap) must stay honest about what it actually measures
- No cover letter / application email generation, no account system beyond optional post-download save, no DOCX export, no resume-examples content library, no pricing page — all deferred (§11)
- No mandatory account creation anywhere in the resume-building path
- No visual anti-patterns from §12.1 (gradients, glassmorphism, glowing cards, sparkle iconography, etc.) anywhere in the product

## 2. Tech stack

Already scaffolded in this repo (verified in `package.json`): Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, ESLint. Per [AGENTS.md](AGENTS.md), consult `node_modules/next/dist/docs/01-app/` before writing App Router code — this Next.js version may differ from training-data conventions (routing, server actions, config).

To add, with rationale (defaults chosen below — flag if you want different picks):
| Need | Choice | Why |
|---|---|---|
| AI generation | Anthropic API (`@anthropic-ai/sdk`) | Server-side module, swappable if you'd rather use another provider |
| PDF export | `@react-pdf/renderer` | Real PDFs from React components, avoids browser print-dialog quirks |
| Persistence (draft, pre-save) | `localStorage`, keyed by a client-generated draft id | The journey now spans homepage → template preview → builder across possibly multiple visits, so `sessionStorage` (cleared on tab close) is no longer enough |
| Persistence (post-MVP account save) | Supabase (Postgres + Auth) | Only wired in once the no-account path works end to end |
| Fonts | `next/font` (Google Fonts: Inter, Manrope; system stacks for Arial/Georgia/Calibri) | Product UI uses Inter; resume documents offer the font choices in §9 |
| Icons | `lucide-react` | One consistent icon set, used functionally (§12.7), not decoratively |
| Deployment | Vercel | Already implied by Next.js choice |

## 3. Data model

One `ResumeDraft` object per draft, identified by a client-generated id (`crypto.randomUUID()`), stored in `localStorage` under a drafts map so "Create Another" and multiple in-progress resumes don't collide.

```ts
type TemplateKey = "modern" | "professional" | "minimal";

type ResumeDraft = {
  id: string;
  templateKey: TemplateKey;
  appearance: {
    accentColor: string;
    headerBg?: string;          // only meaningful for templates with a header band
    linkColor?: string;
    font: "inter" | "manrope" | "georgia" | "arial" | "calibri";
    fontSize: "small" | "medium" | "large";
    spacing: "compact" | "comfortable" | "spacious";
    layout?: "one-column" | "two-column"; // only offered where the template supports both
  };
  targeting: {
    targetRole?: string;        // optional, entered on builder entry, editable later
    jobDescription?: string;    // optional, pasted text
  };
  contact: {
    name: string; jobTitle?: string; email: string; phone?: string;
    location?: string; linkedin?: string; portfolio?: string;
  };
  summary: string;              // manually written or AI-generated, always user-editable
  experience: {
    id: string; jobTitle: string; company: string; location?: string;
    startDate: string; endDate: string;
    bullets: string[];          // user writes plain text or bullets directly; AI rewrites in place
  }[];
  education: {
    id: string; degree: string; institution: string; location?: string; gradYear: string;
    gpa?: string; coursework?: string; achievements?: string;
  }[];
  skills: string[];
  optionalSections: {
    projects?: { id: string; name: string; description: string; link?: string }[];
    certifications?: { id: string; name: string; issuer: string; year?: string }[];
    languages?: { id: string; language: string; proficiency: string }[];
    awards?: { id: string; title: string; issuer?: string; year?: string }[];
    volunteer?: { id: string; role: string; organization: string; description?: string }[];
    publications?: { id: string; title: string; venue?: string; year?: string }[];
  };
  jobMatch?: {
    score: number;              // 0-100, simple overlap metric — never presented as an "ATS score"
    matchedSkills: string[];
    missingSkills: string[];
    computedAt: string;         // so the UI can show "recompute" if targeting/skills changed since
  };
};
```

Sections start visible for the essentials (contact, summary, experience, education, skills) and `optionalSections` entries only appear in the sections nav once the user adds one — don't show 6 empty optional sections by default (§7).

## 4. Route map (App Router)

| Route | Purpose |
|---|---|
| `/` | Homepage: compact hero, template grid (first N + "Browse templates"), lower marketing sections (Phase 7) |
| `/templates` | Full template marketplace: grid + Style/Format/Experience filters |
| `/templates/[slug]` | Large preview of one template + "Use this template" |
| `/builder/[draftId]` | The 3-pane builder (§7) — created when "Use template" is clicked |
| `/builder/[draftId]/download` | Final screen: large preview, Download PDF, Keep editing, Change template |
| `/import` | Upload an existing resume before choosing a template — parses it, then hands off to `/templates` with the parsed draft attached (§8.2) |
| `/api/generate` | AI generation/rewrite endpoint (summary, bullet actions, skill suggestions) |
| `/api/job-match` | Computes/recomputes `jobMatch` from `targeting.jobDescription` + draft skills/experience |
| `/api/import-resume` | Parses an uploaded resume file/text into `ResumeDraft` fields (§8.2) |
| `/api/pdf` | Renders the current draft (template + appearance) to a PDF |

`/resume-examples`, `/resume-examples/[slug]`, and `/pricing` are marketing/SEO surfaces — sequenced in §11, not required to ship the builder.

## 5. Homepage / template marketplace

**Header** (§12.6 for exact sizing): logo left, nav (Templates · Examples · Resume Builder · Pricing — stubs/anchors until Phase 7), right side Sign In (stub until Phase 7 auth) + primary CTA **Create resume** in brand blue. ~64–72px tall, subtle bottom border, no shadow.

**Hero** — kept compact so the actual product (templates) is visible without much scrolling:
- Headline: "Build a resume you're proud to send."
- Subhead: "Choose a professional template, add your experience, and get help polishing every section when you need it."
- Primary CTA: **Create a resume** → `/templates`
- Secondary CTA: **Browse templates** → `/templates`
- No questionnaire, no chatbot, no "what job are you applying for" on this screen — that only appears after a template is chosen (§7)

**Template section** (the homepage's real content):
- Heading: "Choose a template"
- Subhead: "Start with a design that fits your experience and the kind of role you're applying for."
- Reuse one `<TemplateGrid>` component on `/` and `/templates` — don't duplicate the grid
- Filters (client-side over the static catalog, §6): Style (All/Simple/Modern/Professional/Creative), Format (ATS-friendly/One page/Two column), Experience (Student/Entry level/Experienced/Executive) — rendered as tabs, a segmented control, or understated dropdown buttons, **not** a wall of pill chips

**Template grid** — responsive 3/2/1 columns (desktop/tablet/mobile), consistent card proportions across a row. Each card: a large, realistic resume preview (dominant visual element, subtle border, no heavy shadow) using believable content — not lorem ipsum. Use placeholder people like "Sarah Chen — Product Designer," "Michael Lee — Software Engineer," "Daniel Kim — Marketing Specialist" so previews read as real documents. Below the preview: template name, short metadata line (e.g. "Professional · ATS-friendly"), then **Use template** / **Preview** actions.

**Card hover:** slightly increase contrast, reveal the two actions, very subtle movement (§12.6 timing) — no dramatic animation, no glow.

**`/templates/[slug]` preview:** large resume preview center/left, template name + metadata + short description on the side, single **Use this template** action. Reads as a design marketplace, not an e-commerce product page. (Page vs. modal is an open decision, §13 — plan assumes a page since it needs its own shareable/SEO-able URL.)

Lower homepage sections (resume-examples teaser, "why ResumeSpace," final CTA) are content-only, no engineering dependency — sequenced in Phase 7 (§11).

## 6. Template catalog

```ts
// components/resume-templates/catalog.ts
type TemplateMeta = {
  key: TemplateKey;
  name: string;
  tagline: string;
  description: string;
  atsFriendly: boolean;
  style: "simple" | "modern" | "professional" | "creative";
  format: ("ats-friendly" | "one-page" | "two-column")[];
  experienceLevel: ("student" | "entry-level" | "experienced" | "executive")[];
  colorSlots: ("accentColor" | "headerBg" | "linkColor")[];
  supportsLayoutToggle: boolean;    // can this template switch one/two column? (§9)
  defaultAppearance: ResumeDraft["appearance"];
};
```

Draft catalog content (placeholder copy — refine during Phase 1):

| Key | Name | Style | Format tags | Best for |
|---|---|---|---|---|
| `minimal` | Minimal | Simple | ATS-friendly, One page | Corporate, government, high-volume applications |
| `professional` | Professional | Professional | ATS-friendly, One page | Finance, ops, sales, teaching |
| `modern` | Modern | Modern | Two column | Tech, design, marketing — flag the two-column ATS caveat on its card, don't badge it ATS-friendly |

3 templates is still enough to populate every filter combination meaningfully; expanding the catalog beyond 3 is backlog (§11), not v1 — the filter UI should just be built to scale past 3 without changes.

```
components/resume-templates/
  catalog.ts
  ModernTemplate.tsx
  ProfessionalTemplate.tsx
  MinimalTemplate.tsx
  index.ts                    # map: template key -> component
```

One template component set is reused in three places — the marketplace preview card, the `/templates/[slug]` full preview, and the builder's live preview — so there is exactly one place that defines what each template looks like. The PDF renderer is the one place that needs a parallel (non-DOM) implementation (§10).

## 7. Builder (`/builder/[draftId]`)

Three-pane desktop layout, reading like a serious document editor:

```
┌──────────────────────────────────────────────────────────┐
│ ResumeSpace                    Save    Preview   Download │
├───────────────┬───────────────────────┬───────────────────┤
│ SECTIONS NAV   │   SECTION EDITOR      │   LIVE PREVIEW    │
│ Contact        │   Label               │   A4 document,    │
│ Summary        │   [ input ]           │   live data,      │
│ Experience     │   helper text         │   zoom controls   │
│ Education      │                       │                   │
│ Skills         │                       │                   │
│ + Add section  │                       │                   │
└───────────────┴───────────────────────┴───────────────────┘
```

- **Entry step (targeting panel):** shown once on a new draft, dismissible, re-editable later from within the builder:
  - Heading: "Want to tailor your resume?"
  - Target role field (e.g. placeholder "Product Designer") and job description textarea (placeholder "Paste the job description")
  - Primary action **Continue**, secondary **Skip for now** — the user must be able to build the whole resume having clicked Skip
- **Sections nav:** 5 core sections always present (Contact, Summary, Experience, Education, Skills); "+ Add section" reveals the optional ones from §3 (Projects, Certifications, Languages, Awards, Volunteer, Publications) — only added sections stay visible. Active section: black text, a subtle blue indicator (underline or left bar) — not a large colored nav item.
- **Section editor:** plain label → input → optional helper-text pattern, no cards nested inside cards. Every AI-touched field carries an inline action next to it, worded per §12.9 (never a generic "AI" button repeated everywhere).
- **Live preview:** the actual `TemplateKey` component from §6, rendered as a realistic A4 document (correct proportions, real typography, generous margins) — not styled as another web card. Include zoom controls (e.g. 100% with − / + or a dropdown of preset zoom levels). Updates immediately as the user edits.
- **Job Match panel:** shown only when `targeting.jobDescription` is set — score bar + matched/missing skill lists (label: "Job Match", never "ATS Score"), with a "Recompute" affordance if skills/experience changed since `jobMatch.computedAt`

## 8. AI integration

One server-only module, `lib/ai/generateResume.ts`, exposing distinct, narrowly-scoped actions rather than one generic "Improve with AI" — this maps directly to the specific inline labels in §12.9:

```ts
type GenerateAction =
  | "write-summary"       // from contact + experience + targeting
  | "shorten"              // condense the given text
  | "clarify"              // rewrite for clarity, same length roughly
  | "strengthen"           // stronger wording, still grounded in the input
  | "suggest-skills"       // propose skills based on experience + targeting
  | "tailor-to-job"        // reweight/rewrite emphasis toward targeting.jobDescription
  | "extract-jd-skills";   // internal: normalizes a JD into a skill list, used by job-match
```

Hard constraint on every rewrite action: never introduce a number, metric, or accomplishment that wasn't in the user's input. All actions return strict JSON (schema/tool-call style, not free text) so the UI never parses prose.

- `POST /api/generate` — `{ draftId, action: GenerateAction, targetField, ... }` — powers every inline action next to summary and experience bullets, plus the initial "not sure what to write? Try a suggestion" entry point
- `POST /api/job-match` — client sends `targeting.jobDescription` + `skills` + `experience` (draft lives in `localStorage`, not server-side), returns `jobMatch`; internally calls `extract-jd-skills` once and caches the result on the draft

### 8.1 Per-section paste-and-fill (paid)

A paid capability, gated behind a subscription/pass (see the pricing model — Starter Pack, 7-Day Pass, Generation Credits — which has since shipped ahead of this doc; §1's "no pricing page" non-goal is out of date): next to **every** section's editor, not just Experience — Contact, Summary, Experience, Education, Skills, and each optional section — a "Paste a description" affordance lets the user drop in unstructured text (a job posting, a LinkedIn export, a rough note about a role, a raw list of courses) and the system parses it straight into that section's structured fields, instead of the user typing each field by hand.

- New `GenerateAction`: `"extract-section-from-text"` — `{ section: SectionKey, rawText: string }` → returns the structured fields for that section only (e.g. pasted into Experience: infers job title/company/dates, drafts bullets from the responsibilities described; pasted into Education: extracts degree/institution/year)
- Same hard constraint as every other action: extracted content must be traceable to the pasted text — no inventing accomplishments or dates that weren't in it
- Free users keep the current manual-field flow untouched; this is additive, not a replacement, and never blocks building a resume without it
- Metering matches tailored generation from the Master Resume — one credit (or unlimited during an active Pass) per extraction — so it's the same entitlement check, not a separate paid feature to build from scratch

### 8.2 Import an existing resume

A user can bring an existing resume in instead of starting from a blank template, from **either direction**:
- **Import first:** `/import` → upload a file or paste text → parsed into a draft with no `templateKey` yet → user lands on `/templates` to pick a look, and the chosen template renders with the imported content already filled in
- **Template first:** normal `/templates/[slug]` → "Use this template" → inside the builder, an "Import a resume" affordance (e.g. in the Contact section or a builder-wide entry point) parses the file and merges the extracted fields into the current draft, overwriting only the sections it found content for

Both paths go through the same `POST /api/import-resume` — `{ file | rawText }` → structured `ResumeDraft` fields, reusing the same extraction action family as §8.1 (`"extract-section-from-text"` run once per section, or a dedicated `"extract-full-resume"` action) — same hard constraint: only content traceable to the source document, nothing invented.

**Limits, same shape as the AI features (§11 pricing tiers, `app/pricing`):**
- Free tier gets a small number of imports (e.g. 1) before hitting the limit, with **watch an ad for one more import** as the existing ad-for-credit mechanism already covers (§1 non-goals note: pricing has shipped, so this ties into real entitlement code, not just copy)
- Active Pass / subscription: unlimited (or a much higher cap) imports, no ads needed
- Generation Credits: an import consumes one credit, same balance as other paid AI actions — not a separate currency to track

## 9. Appearance customization

Builder exposes one appearance panel (not scattered controls), five groups, each defaulted per-template from `catalog.ts`:

| Control | Options | Notes |
|---|---|---|
| Accent | Curated swatches + custom color input, per §6 `colorSlots` | Applies to accent/header/link slots as previously scoped |
| Font | Inter, Manrope, Georgia, Arial, Calibri | Loaded via `next/font`; applies to live preview and PDF |
| Size | Small / Medium / Large | Base font-size scale for the document, independent of the product UI's own type scale (§12.3) |
| Spacing | Compact / Comfortable / Spacious | Maps to a line-height/margin scale per template |
| Layout | One column / Two column | Only shown when `catalog.supportsLayoutToggle` is true (Modern only, initially) |

Keep this panel exactly this small — five understandable controls, not a full design tool. All values are CSS custom properties scoped to the template root, so appearance changes are style updates, never structural re-renders. The PDF renderer (§10) reads the same `appearance` object so the download always matches the live preview exactly.

## 10. PDF export

`lib/pdf/renderResumePdf.tsx` — one `@react-pdf/renderer` component per template, reading `templateKey` + `appearance` + the draft content, mirroring the DOM template's layout. Given only 3 templates, hand-writing the PDF version alongside the DOM version is faster than building a shared abstraction.

`POST /api/pdf` takes a draft, returns a PDF stream. Download screen (`/builder/[draftId]/download`):
- Heading: "Your resume is ready."
- Subhead: "Give it a quick look, then download your PDF."
- Primary: **Download PDF**
- Secondary: **Keep editing**
- Optional: **Change template**
- No upsells stacked on this screen — cover letter/application email offers are Phase 8, and even then shown lightly, not bombarding this moment

## 11. Milestones & scope cut

Given how much larger this surface is than the original wizard, this section is the honest cut: what's required to have a working, template-first product (Phases 1–6) vs. what's sequenced after (Phase 7+) vs. explicit backlog. Each phase's UI should be checked against the §12.10 quality bar before being called done.

**Phase 0 — Scaffolding (done):** Next.js/TS/Tailwind app created.

**Phase 1 — Template marketplace shell**
- [ ] Design tokens in code: colors, type scale, spacing scale, radius, shadow as Tailwind theme config (§12.2–12.5) — everything after this phase consumes these, nothing hardcodes values
- [ ] `catalog.ts` with style/format/experience-level tags for all 3 templates
- [ ] `<TemplateGrid>` component (realistic preview, name, metadata, Preview + Use template actions, hover behavior per §5) reused on `/` and `/templates`
- [ ] `/templates` with working filters (tabs/segmented/dropdown, not pill walls)
- [ ] `/templates/[slug]` large preview page
- [ ] Homepage header + compact hero + embedded template section (lower marketing sections deferred to Phase 7)

**Phase 2 — Draft model & builder shell (no AI yet)**
- [ ] `ResumeDraft` type + `localStorage` drafts store (create on "Use template", keyed by id)
- [ ] 3-pane builder layout: sections nav (subtle active state), section editor (label/input/helper pattern), live preview
- [ ] Manual forms for all 5 core sections + "+ Add section" for optional ones
- [ ] Live preview renders the real template component as an A4 document with zoom controls

**Phase 3 — Optional AI targeting & assist**
- [ ] Targeting entry panel ("Want to tailor your resume?", skippable) on first builder visit
- [ ] `lib/ai/generateResume.ts` (all `GenerateAction`s, §8) + `POST /api/generate`
- [ ] Inline actions wired to summary and each experience entry, labeled per §12.9 (Improve, Shorten, Make clearer, Strengthen, Suggest skills, Tailor to this job — not one generic "AI" button)
- [ ] `POST /api/job-match` + Job Match panel in the builder

**Phase 4 — Appearance customization**
- [ ] Accent color picker (as previously scoped) + Font, Size, Spacing, Layout controls, all as CSS custom properties on the template root

**Phase 5 — PDF export**
- [ ] `lib/pdf/renderResumePdf.tsx` per template, reading `appearance`
- [ ] `POST /api/pdf`, download screen copy per §10

**Phase 6 — Mobile pass**
- [ ] Header, current-section view, fields, inline AI actions, Save, Preview button — no attempt to compress the 3-pane desktop layout onto a phone
- [ ] Sections as horizontal/dropdown nav, full-screen single-section editing, preview opens full-screen

**Phase 7 — Launch readiness**
- [ ] Optional account creation ("Save your resume?") — Supabase auth, offered after download, not before
- [ ] Rate limiting on `/api/generate` and `/api/job-match` (both cost money, no auth gate before this phase)
- [ ] Homepage lower sections (resume-examples teaser, why-ResumeSpace, final CTA) — content only, copy per §12.9 voice guidelines
- [ ] SEO basics (metadata, OG images) on `/` and `/templates`
- [ ] Accessibility pass against §12.8 (contrast, focus states, keyboard nav, semantic HTML, labels)
- [ ] Error/empty states pass, analytics (page views + funnel drop-off)

**Phase 8 — Cover letter & application email (post-resume-MVP, explicitly deferred)**
- [ ] `/builder/[draftId]/cover-letter` and `/builder/[draftId]/application-email`, offered lightly after the resume download screen, not before
- [ ] Reuse `lib/ai/generateResume.ts` (new prompt) and the PDF renderer (a plain letter layout)

**Backlog (not scheduled):** `/resume-examples` content library, `/pricing`, DOCX/TXT export, share links, expanding the catalog past 3 templates, application tracker, interview assistant, job matching against multiple postings at once.

## 12. Visual design system

Applies to every screen built in every phase above — this is the shared reference, not a one-time design pass.

### 12.1 What to avoid (hard constraints)

No purple/blue AI gradients, neon colors, glassmorphism, glowing or floating cards, blob shapes, pill-everything UI, heavy/excessive shadows, excessive animation, cartoon or robot/AI illustrations, sparkle iconography, generic "AI-powered" marketing language, oversized typography that wastes space, or icon clutter. The product should look expensive because it's well designed, not because it has visual effects. Reference feel: Figma-level spacing and precision + modern productivity software + a premium document editor — not the "gradient hero + glowing cards + floating blobs" AI-SaaS formula.

### 12.2 Brand & color

Predominantly black/white/gray, with **blue used selectively as the one accent** — not on every button, heading, icon, and border.

| Token | Value | Usage |
|---|---|---|
| `bg` | `#FFFFFF` | Page background |
| `bg-secondary` | `#F7F7F8` | Panels, secondary surfaces |
| `text-primary` | near-black | Headings, primary copy |
| `text-secondary` | neutral gray | Supporting/helper text |
| `border` | very light gray | Dividers, card/input borders |
| `accent` | professional blue | Primary CTAs, active states, links |
| `accent-hover` | slightly darker blue | Hover state on accent elements |
| `success` / `error` | used only when necessary | Never the primary means of communicating status (§12.8) |

### 12.3 Typography

Product UI font: Inter (fallback Manrope). Generous line-heights throughout; hierarchy comes from weight and size together, not size alone.

| Level | Size (desktop) | Weight |
|---|---|---|
| H1 | 48–64px | 600–700 |
| H2 | 32–40px | 600–700 |
| H3 | 20–24px | 600 |
| Body | 15–17px | 400–450 |
| Small UI | 13–14px | 400–500 |

### 12.4 Spacing scale

Fixed token scale, no ad hoc values: `4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 120` (px). Prefer generous whitespace over filling empty areas, but whitespace should serve hierarchy — not create empty space just to look "minimal."

### 12.5 Layout, radius, shadow

- **Container:** centered, max-width ~1200–1280px; horizontal padding 32–48px desktop, 24–32px tablet, 16–20px mobile. Left/right edges, section alignment, card alignment, button alignment, and typography must all align to one consistent grid.
- **Radius:** restrained — `6 / 8 / 10 / 12px` only. Inputs and small controls at the low end, cards at the high end. No pill-everything.
- **Shadow:** used sparingly; most cards rely on border + spacing + background contrast instead. Any shadow used should be extremely subtle (e.g. `0 1px 2px rgba(0,0,0,0.04)`).

### 12.6 Motion & header sizing

- Header: ~64–72px tall, subtle bottom border, no shadow.
- Transitions: 150–250ms, no bounce, no floating/parallax effects. Reserve animation for state changes that need it: template card hover, modal open, sidebar transitions, a saving indicator, live-preview updates.

### 12.7 Icons

One consistent set — `lucide-react`. Icons support the interface (a clear affordance) rather than decorate it; avoid oversized decorative icons and avoid icon-per-label everywhere.

### 12.8 Accessibility

Proper color contrast, visible focus states, full keyboard navigation, semantic HTML, descriptive/accessible labels on every control, sensible heading hierarchy, and color is never the only signal for status (pair with text/icon). Checked explicitly in Phase 7 (§11) but should hold from Phase 1 onward, not retrofitted.

### 12.9 Copy voice

Short, plain, specific — say what the product does, don't oversell it.

**Avoid:** "Unlock your potential," "Supercharge your career," "Transform your professional journey," "Revolutionize your resume," "Leverage cutting-edge AI," "Take your career to the next level," "Powered by intelligent technology," "Your career, reimagined" — and don't repeat the word "AI" as the product's personality.

**Prefer:** "Build your resume in a few minutes." / "Start with a template." / "Make your experience easier to read." / "Need a hand with this section?" / "Paste the job description and we'll help tailor your resume." / "Not sure what to write? Try a suggestion." / "Your resume is ready."

**Inline AI action labels** (map directly to `GenerateAction` in §8 — use these, not one generic "Improve with AI" everywhere): *Improve with AI* (entry point), *Make this clearer*, *Shorten this*, *Add stronger wording*, *Suggest skills*, *Tailor to this job*, *Rewrite*, *Try another version*, *Use suggestion*.

### 12.10 Design quality bar

Before any phase's UI is called done, check every page for: inconsistent spacing, inconsistent typography, unnecessary borders/shadows, oversized buttons, excessive rounded corners, awkward empty space, cramped sections, poor alignment, generic copy, repetitive "AI" language, unnecessary icons, visual noise. The interface should feel calm — every element should have a reason to exist.

## 13. Decisions still open

- **Scope confirmation:** Phases 1–6 (marketplace shell → builder → AI assist → appearance → PDF → mobile) is the recommended v1. Phase 7 (accounts, rate limiting, homepage marketing content, SEO, analytics, accessibility pass) and Phase 8 (cover letter/application email) are sequenced after — confirm this cut matches your priorities before Phase 7 work starts
- **Template preview page vs. modal:** plan assumes a dedicated `/templates/[slug]` page (shareable URL, SEO value) — a modal would be faster to build but loses that; confirm before Phase 1
- **AI provider:** assumed Anthropic API — confirm or swap
- **PDF approach:** assumed `@react-pdf/renderer` — alternative is headless-browser print (Puppeteer/Playwright), pixel-matches HTML/CSS but heavier to host
- **Job Match methodology:** assumed AI-extracted skill list from the JD compared against the draft's `skills` + experience text — needs a defensible, explainable method before shipping the score bar publicly, since overclaiming ATS accuracy is a real risk (per your own note)
- **Rate limiting for AI + job-match calls:** no auth gate exists before Phase 7, but both are paid calls reachable by anyone — needs at least an IP/session cap before real traffic, not just at Phase 7
- **Template catalog copy:** names/taglines/tags in §6 are placeholders — refine before Phase 1 ships, especially the Modern template's ATS caveat wording
- **Exact hex values for `accent`/`accent-hover`:** §12.2 specifies "professional blue" directionally — needs one concrete hex pair (plus a contrast check against `#FFFFFF` and `text-primary`) before Phase 1's design tokens are coded

## 14. Backend architecture (target)

**Status check against §2–3 above:** everything built so far is client-only — drafts live in `localStorage`, there is no database, and the only backend calls today are `/api/pdf` and the deterministic `/api/generate` / `/api/job-match` routes (§8). The one piece of what follows that's actually live is Supabase Auth (§ "Sign in" — real email magic-link sign-in via `@supabase/ssr`, `lib/supabase/client.ts` / `server.ts`, `proxy.ts` refreshing the session cookie). Everything else below — `profiles`, `resumes`, `templates`, `subscriptions`, `ai_usage` tables, RLS, real AI calls, Stripe — is the target design for migrating off `localStorage`, not yet built. Treat this section as the plan for that migration, sequenced after the phases in §11 that don't require a backend at all.

Modular Next.js backend — Route Handlers + a `lib/` service layer — rather than a separate Python/microservices backend. Simple enough to launch, structured enough not to require a rewrite to scale.

### 14.1 Overall architecture

```text
                              ┌─────────────────────┐
                              │       Browser       │
                              │  Next.js / React UI │
                              └──────────┬──────────┘
                                         │
                              HTTPS / Authenticated
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                         NEXT.JS APPLICATION                       │
│                                                                  │
│  ┌────────────────┐     ┌────────────────────────────────────┐   │
│  │ Server         │     │ API / Route Handlers               │   │
│  │ Components     │     │                                    │   │
│  └────────────────┘     │ /api/auth                          │   │
│                         │ /api/resumes                        │   │
│  ┌────────────────┐     │ /api/templates                      │   │
│  │ Resume Builder │     │ /api/ai/*                           │   │
│  └────────────────┘     │ /api/pdf                            │   │
│                         │ /api/stripe/*                       │   │
│  ┌────────────────┐     │ /api/uploads                        │   │
│  │ Resume Preview │     │ /api/usage                          │   │
│  └────────────────┘     └────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    Backend Services                         │  │
│  │                                                            │  │
│  │ Auth │ Resume │ AI │ PDF │ Billing │ Templates │ Usage     │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────────┬──────────────────────────────────┘
                                │
             ┌──────────────────┼───────────────────┐
             │                  │                   │
             ▼                  ▼                   ▼
      ┌─────────────┐    ┌──────────────┐   ┌──────────────┐
      │  Supabase   │    │ AI Provider  │   │    Stripe    │
      │             │    │              │   │              │
      │ PostgreSQL  │    │ OpenAI/etc.  │   │ Subscriptions│
      │ Auth        │    │              │   │ Checkout     │
      │ Storage     │    │              │   │ Webhooks     │
      └─────────────┘    └──────────────┘   └──────────────┘
```

### 14.2 Project structure

```text
resume-made/
│
├── app/
│   │
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   ├── templates/
│   │   ├── resume-examples/
│   │   ├── pricing/
│   │   └── about/
│   │
│   ├── (app)/
│   │   ├── dashboard/
│   │   ├── builder/
│   │   │   └── [resumeId]/
│   │   └── settings/
│   │
│   ├── auth/
│   │   ├── login/
│   │   ├── signup/
│   │   └── callback/
│   │
│   └── api/
│       │
│       ├── resumes/
│       │   ├── route.ts
│       │   └── [resumeId]/
│       │       ├── route.ts
│       │       ├── duplicate/
│       │       │   └── route.ts
│       │       └── export/
│       │           └── route.ts
│       │
│       ├── templates/
│       │   └── route.ts
│       │
│       ├── ai/
│       │   ├── improve/
│       │   │   └── route.ts
│       │   ├── tailor/
│       │   │   └── route.ts
│       │   ├── summary/
│       │   │   └── route.ts
│       │   ├── experience/
│       │   │   └── route.ts
│       │   └── skills/
│       │       └── route.ts
│       │
│       ├── pdf/
│       │   └── route.ts
│       │
│       ├── uploads/
│       │   └── route.ts
│       │
│       ├── usage/
│       │   └── route.ts
│       │
│       └── stripe/
│           ├── checkout/
│           │   └── route.ts
│           └── webhook/
│               └── route.ts
│
├── components/
│   ├── resume/
│   ├── builder/
│   ├── templates/
│   ├── ai/
│   └── ui/
│
├── lib/
│   │
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── admin.ts
│   │
│   ├── auth/
│   │   ├── require-user.ts
│   │   └── permissions.ts
│   │
│   ├── resumes/
│   │   ├── service.ts
│   │   ├── repository.ts
│   │   └── validation.ts
│   │
│   ├── ai/
│   │   ├── client.ts
│   │   ├── prompts.ts
│   │   ├── schemas.ts
│   │   └── service.ts
│   │
│   ├── pdf/
│   │   ├── renderer.ts
│   │   └── service.ts
│   │
│   ├── templates/
│   │   └── service.ts
│   │
│   ├── stripe/
│   │   ├── client.ts
│   │   └── service.ts
│   │
│   ├── usage/
│   │   └── service.ts
│   │
│   └── validation/
│       └── common.ts
│
├── types/
│   ├── resume.ts
│   ├── template.ts
│   ├── user.ts
│   └── billing.ts
│
├── supabase/
│   ├── migrations/
│   └── seed.sql
│
└── proxy.ts
```

Note: the tree above says `middleware.ts` in the original design — this repo's actual Next.js version renamed that convention to `proxy.ts` (confirmed against `node_modules/next/dist/docs/`), which is what's already in place.

**Key principle: route handlers should be thin. Business logic belongs in `lib/`.** Don't put 500 lines of database/AI/business logic inside `route.ts`.

### 14.3 Database architecture

PostgreSQL through Supabase. MVP tables:

```text
users
profiles
resumes
templates
subscriptions
ai_usage
```

Users come from Supabase Auth; the app's own `profiles` table holds application-specific data.

### 14.4 Users / profiles

Supabase Auth handles email/password, Google login, sessions, password reset, OAuth.

```text
profiles
──────────────
id
user_id
full_name
avatar_url
created_at
updated_at
```

```text
auth.users
    │
    │ 1:1
    ▼
profiles
```

Never store passwords yourself.

### 14.5 Resumes table

The most important table.

```text
resumes
────────────────────────
id                  UUID
user_id             UUID
title               TEXT
template_id         UUID
target_role         TEXT
job_description     TEXT
content             JSONB
status              TEXT
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

`content` example (maps closely to the existing `ResumeDraft`/`ResumeContent` shape in `lib/resume/types.ts`, so migrating off `localStorage` should mostly be a matter of moving that same object into this column):

```json
{
  "personal": {
    "fullName": "John Smith",
    "email": "john@example.com",
    "phone": "+1 555 123 4567",
    "location": "New York, NY",
    "website": "johnsmith.com",
    "linkedin": "linkedin.com/in/johnsmith"
  },
  "summary": { "text": "Product designer with 5 years..." },
  "experience": [
    {
      "id": "exp_1",
      "company": "Acme",
      "position": "Product Designer",
      "location": "New York",
      "startDate": "2022-01",
      "endDate": null,
      "current": true,
      "bullets": ["Designed...", "Improved..."]
    }
  ],
  "education": [
    { "id": "edu_1", "school": "University...", "degree": "B.S. Computer Science", "startDate": "2017", "endDate": "2021" }
  ],
  "skills": ["Figma", "React", "TypeScript"],
  "projects": [],
  "certifications": [],
  "languages": []
}
```

**Why JSONB:** resume structures change. Today: Experience, Education, Skills. Tomorrow: Publications, Awards, Volunteer Work, References, Portfolio. No new migration every time a resume section is added — keep the resume document itself flexible.

### 14.6 Templates

Don't store the actual React template inside PostgreSQL.

```text
templates
──────────────────
id
name
slug
description
style
layout
preview_url
is_active
created_at
```

```text
resume.template_id
        ↓
modern-professional
        ↓
ModernProfessional.tsx
```

(This repo's `TemplateKey`/`catalog.ts` in `components/resume-templates/` already plays this role client-side — migrating means the catalog's static data moves into this table, and `template_id` becomes the join key instead of the current hardcoded union type.)

### 14.7 Resume API

```http
POST /api/resumes
```
Request: `{ "title": "...", "templateId": "modern-professional", "targetRole": "..." }`
Response: `{ "id": "resume_123", "title": "..." }`

```http
GET /api/resumes/:resumeId
PATCH /api/resumes/:resumeId      # e.g. { "content": { "...": "..." } }
DELETE /api/resumes/:resumeId
POST /api/resumes/:resumeId/duplicate
```

Duplicate is useful for "Software Engineer Resume" vs. "Software Engineer — Google" as separate versions.

### 14.8 Critical ownership check

Every resume API must verify:

```text
Authenticated user → Get resume → resume.user_id == authenticated user?
YES → continue   /   NO → 404/403
```

Never trust a `userId` coming from the browser payload — get the user from the authenticated Supabase session.

### 14.9 Supabase RLS

Enforce ownership at the database level too, as defense in depth on top of the API-level check in §14.8:

```text
resumes.user_id = auth.uid()
```

API authorization + Supabase RLS, not one or the other.

### 14.10 AI architecture

Never call the AI provider directly from the browser:

```text
Wrong:   Browser → OpenAI
Correct: Browser → POST /api/ai/improve → Auth → Ownership → Usage check
                  → Input validation → AI service → OpenAI/Anthropic
                  → Validate response → Browser
```

### 14.11 AI service

```text
lib/ai/
├── client.ts    # AI SDK setup
├── service.ts   # business logic
├── prompts.ts   # prompts
└── schemas.ts   # structured-output validation
```

Note: this repo's current `lib/ai/generateResume.ts` (§8) is the deterministic, no-API-key placeholder for this layer — it gets replaced/extended by a real `client.ts` + `prompts.ts` once an AI provider key is wired in, not thrown away wholesale (the request-shape/action pattern already matches).

### 14.12 AI endpoints

Start small — not 20 AI endpoints:

```text
POST /api/ai/improve
POST /api/ai/tailor
POST /api/ai/suggest-skills
```

```json
POST /api/ai/improve
{ "resumeId": "...", "section": "experience", "itemId": "exp_1", "text": "Worked on website" }
```
```json
{ "suggestion": "Developed and maintained the company website...", "reason": "Uses clearer action-oriented language." }
```

User then chooses **Keep Original** or **Use Suggestion** — never silently overwrite their resume.

### 14.13 AI tailoring

User enters a target role + job description. Backend combines Resume + target role + job description → AI → suggested changes:

```json
{
  "summary": "...",
  "skills": [{ "skill": "Design Systems", "reason": "Already supported by experience..." }],
  "experience": [{ "experienceId": "exp_1", "suggestedBullets": ["..."] }]
}
```

Suggestions, not fabricated facts — same hard constraint already established in §8 and §8.1: *"Only use information supported by the user's existing resume. Never invent employers, degrees, technologies, responsibilities, metrics, awards, or achievements."*

### 14.14 AI usage system

```text
ai_usage
──────────────────
id
user_id
feature
request_id
tokens_input
tokens_output
created_at
```

Enables tier limits (`Free: 10 AI actions/month`, `Pro: 100/month`) that can change later without touching the AI architecture — this is the real metering layer behind the credit/Pass system already sketched in `app/pricing/page.tsx` and §8.1/§8.2.

### 14.15 Rate limiting

Protect `/api/ai/*`, `/api/pdf`, `/api/auth/*` from abuse — stricter for anonymous, then free-tier and paid-tier caps as in §14.14. Don't introduce Redis just because it sounds architectural; add a distributed rate limiter later if scale actually requires it.

### 14.16 PDF architecture

Don't build two separate resume designs. One Resume JSON feeds both a Web Template and a PDF Template through a shared renderer concept — already the pattern in this repo (`components/resume-templates/*` for the DOM, `components/pdf/*` for `@react-pdf/renderer`, both reading the same `ResumeContent`/`ResumeAppearance`), so this is validating the existing approach rather than changing it.

### 14.17 PDF endpoint

```http
POST /api/pdf
{ "resumeId": "resume_123" }
```
Flow: Authenticate → Ownership check → Load resume → Load template → Render → Generate PDF → Return file. (This repo's existing `/api/pdf` already does the render/return part via `@react-pdf/renderer`; auth + ownership checks are what's missing once accounts exist.) For heavier future needs, server-side browser rendering (Playwright) is a practical alternative to a React-PDF renderer.

### 14.18 File storage

Supabase Storage for `uploads/`, `exports/`, `avatars/` — private buckets, no publicly exposed raw storage paths. Access goes through API authorization → signed URL → temporary access, not direct public URLs.

### 14.19 Stripe architecture

Two pieces: Checkout (`POST /api/stripe/checkout`, redirects the user into Stripe Checkout) and Webhook (`POST /api/stripe/webhook`, Stripe telling the backend about `payment completed` / `subscription created` / `subscription renewed` / `subscription canceled` / `payment failed`, which updates the `subscriptions` table).

### 14.20 Never trust the frontend for payment status

Don't gate premium features on a client-side `paymentSuccess` flag. The webhook, signature-verified server-side, is the only source of truth for subscription state.

### 14.21 Subscription table

```text
subscriptions
────────────────────────
id
user_id
stripe_customer_id
stripe_subscription_id
plan
status
current_period_start
current_period_end
cancel_at_period_end
created_at
updated_at
```

### 14.22 Proxy/middleware scope

Use `proxy.ts` for protected application routes (`/builder/*`, `/dashboard/*`, `/settings/*`), session handling, and basic request protection — but don't put the entire authorization system there. API endpoints must still independently verify authentication and authorization (§14.8), since a proxy matcher change can silently stop covering a route.

### 14.23 Validation

Zod (or equivalent) between every browser request and business logic: resume IDs, template IDs, text lengths, job descriptions, uploaded files, AI responses, Stripe payloads, API bodies in general. Never assume browser input is trustworthy.

### 14.24 Error handling

Consistent API error shape:

```json
{ "error": { "code": "RESUME_NOT_FOUND", "message": "Resume not found." } }
```

Codes: `UNAUTHORIZED`, `FORBIDDEN`, `RESUME_NOT_FOUND`, `INVALID_REQUEST`, `AI_LIMIT_REACHED`, `AI_PROVIDER_ERROR`, `PDF_GENERATION_FAILED`, `PAYMENT_REQUIRED`.

### 14.25 Logging

Log request_id, user_id, endpoint, duration, status, error_code for API/AI/PDF/webhook/auth events — never dump full resume content into logs (it's personal information).

### 14.26 Environment variables

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=   # or ANTHROPIC_API_KEY, per §2's provider choice

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_APP_URL=
```

`NEXT_PUBLIC_*` is exposed to the browser (already true of `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` today). `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`/`ANTHROPIC_API_KEY`, and `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` must never reach the client.

### 14.27 Security architecture

```text
Request → HTTPS/TLS → Next.js API → Authentication → Authorization
  → Input validation → Rate limiting → Business logic → PostgreSQL (RLS) / AI API
```

Also: secure cookies/session handling, CSRF protection where applicable, CSP/security headers, HSTS, file type/size validation, private storage, webhook signature verification, database backups, dependency updates, audit logging for sensitive actions, account/data deletion, privacy policy and retention rules.

### 14.28 Data flow — creating a resume

```text
User selects template → POST /api/resumes → Authenticate → Validate template
  → Create resume → Return resume ID → Open builder
```
Autosave: edit → debounce ~500–1000ms → `PATCH /api/resumes/:id` → validate → ownership check → update JSONB. Don't save on every keystroke (matches the existing 300ms debounce pattern in `BuilderShell.tsx`, just against a real endpoint instead of `localStorage`).

### 14.29 Data flow — AI improvement

```text
Click "Improve" → POST /api/ai/improve → Authenticate → Ownership check
  → Usage check → Validate input → Build prompt → AI provider
  → Validate structured response → Record usage → Return suggestion
```
User then keeps or rejects the suggestion.

### 14.30 Data flow — download PDF

```text
Download PDF → POST /api/pdf → Authenticate → Ownership check
  → Load Resume JSON → Load template → Render → Generate PDF → Return PDF
```

### 14.31 Data flow — subscription

```text
Upgrade → POST /api/stripe/checkout → Stripe Checkout → Payment
  → Stripe Webhook → /api/stripe/webhook → Verify signature
  → Update subscriptions → User gets Pro features
```

### 14.32 What not to build yet

No separate Python/FastAPI service, no Redis/Kafka/Celery/Kubernetes, no microservices, no vector DB, no Elasticsearch, no Lambda/S3/CloudFront/API Gateway. A legitimate production architecture for this product is just:

```text
Browser → Vercel (Next.js front + API) → Supabase / AI API / Stripe
```

If Python is ever needed for specialized AI/document processing, add it as a separate service later without replacing this architecture — don't build it into the MVP.

### 14.33 Locked-in stack + the core principle

```text
Frontend:  Next.js, React, TypeScript, Tailwind (already in place)
Backend:   Next.js Route Handlers, TypeScript, Zod
Database:  Supabase PostgreSQL
Auth:      Supabase Auth (already wired — real magic-link sign-in)
Storage:   Supabase Storage
AI:        Anthropic API per §2 (or OpenAI)
PDF:       @react-pdf/renderer (already in place) — Playwright as a fallback for heavier needs
Payments:  Stripe
Hosting:   Vercel
```

Backend modules: `lib/{auth,resumes,templates,ai,pdf,billing,usage,storage,validation}/`.

**The core architectural principle: keep the system centered on one canonical Resume document.**

```text
                     Resume JSON
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
   Resume Editor     AI Features       PDF Renderer
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                    PostgreSQL
```

Everything else in this section exists to serve that one decision.
