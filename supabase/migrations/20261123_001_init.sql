-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 30),
  created_at timestamptz not null default now()
);

-- Progress: one row per user, topic, kind, day
create table public.progress_events (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  topic_id text not null check (char_length(topic_id) between 1 and 120),
  kind text not null check (kind in ('lesson_read','game_completed','dictionary_viewed')),
  day date not null default current_date
    check (day <= current_date + 1 and day > current_date - 800),
  created_at timestamptz not null default now(),
  unique (user_id, topic_id, kind, day)
);

-- Explain It Back submissions, moderated by you
create table public.explanations (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  topic_id text not null check (char_length(topic_id) between 1 and 120),
  body text not null check (char_length(body) between 20 and 600),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
create index explanations_topic_status_idx on public.explanations (topic_id, status);

create table public.reports (
  id bigint generated always as identity primary key,
  explanation_id bigint not null references public.explanations(id) on delete cascade,
  reporter_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  reason text not null check (char_length(reason) between 3 and 300),
  created_at timestamptz not null default now(),
  unique (explanation_id, reporter_id)
);

-- Row Level Security: on for every table
alter table public.profiles enable row level security;
alter table public.progress_events enable row level security;
alter table public.explanations enable row level security;
alter table public.reports enable row level security;

-- Profiles: only your own row
create policy profiles_select_own on public.profiles for select to authenticated
  using (id = (select auth.uid()));
create policy profiles_insert_own on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Progress: only your own rows
create policy progress_select_own on public.progress_events for select to authenticated
  using (user_id = (select auth.uid()));
create policy progress_insert_own on public.progress_events for insert to authenticated
  with check (user_id = (select auth.uid()));

-- Explanations: everyone reads approved; you also read your own pending ones
create policy explanations_read on public.explanations for select to anon, authenticated
  using (status = 'approved' or user_id = (select auth.uid()));
create policy explanations_insert_own_pending on public.explanations for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'pending');

-- No update or delete policy exists, so users can never change status.
revoke update, delete on public.explanations from anon, authenticated;

-- Reports: insert as yourself, read only your own
create policy reports_insert_own on public.reports for insert to authenticated
  with check (reporter_id = (select auth.uid()));
create policy reports_select_own on public.reports for select to authenticated
  using (reporter_id = (select auth.uid()));

-- Rate limit in the database: 5 explanations per user per hour
create or replace function public.limit_explanations() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.explanations
      where user_id = new.user_id and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'rate_limited';
  end if;
  return new;
end $$;

create trigger explanations_rate_limit before insert on public.explanations
  for each row execute function public.limit_explanations();