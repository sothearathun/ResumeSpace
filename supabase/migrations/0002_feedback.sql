-- User feedback / bug reports submitted from the in-app Feedback button.
-- Insert-only for the public API (anon + signed-in users); nobody can read
-- rows back through the client — review them in the Supabase dashboard.

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  kind text not null check (kind in ('bug', 'idea', 'other')),
  message text not null check (char_length(message) between 1 and 2000),
  contact_email text check (contact_email is null or char_length(contact_email) <= 254),
  page_path text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

create policy "Anyone can submit feedback"
  on public.feedback for insert
  to anon, authenticated
  with check (true);
