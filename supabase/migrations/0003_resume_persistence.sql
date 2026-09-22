-- Wires real per-account resume storage on top of the 0001 schema.
-- The app's template catalog is hardcoded (TemplateKey string, not the
-- unused `templates` table), so resumes need their own template_key column
-- rather than the template_id FK. appearance/auto_fit_enabled hold the rest
-- of what a ResumeDraft needs beyond title/target_role/job_description/content.

alter table public.resumes
  add column if not exists template_key text not null default 'minimal',
  add column if not exists appearance jsonb not null default '{}'::jsonb,
  add column if not exists auto_fit_enabled boolean not null default true;

-- ── master_resumes ───────────────────────────────────────────────────────
-- One row per user — the comprehensive, never-sent-directly document that
-- tailored resumes are generated from. Separate table (not a resumes row)
-- since it has no template/appearance and is looked up by user, not by id.
create table if not exists public.master_resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  content jsonb not null default '{}'::jsonb,
  photo_shape text,
  photo_size text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.master_resumes enable row level security;

create policy "Users can manage their own master resume"
  on public.master_resumes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger master_resumes_set_updated_at
  before update on public.master_resumes
  for each row execute function public.set_updated_at();
