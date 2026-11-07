-- De Uno: per-user learning profile + daily AI usage counter.

create table if not exists public.profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  state      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users read their own profile"
  on public.profiles for select using (auth.uid() = user_id);
create policy "Users insert their own profile"
  on public.profiles for insert with check (auth.uid() = user_id);
create policy "Users update their own profile"
  on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Tutor calls per user per day, so one account cannot run up the Claude bill.
create table if not exists public.usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day     date not null default current_date,
  calls   integer not null default 0,
  primary key (user_id, day)
);

alter table public.usage enable row level security;

create policy "Users read their own usage"
  on public.usage for select using (auth.uid() = user_id);

-- Atomically counts one call for the signed-in user and returns today's total.
create or replace function public.bump_usage()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  total integer;
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;
  insert into public.usage (user_id, day, calls)
  values (auth.uid(), current_date, 1)
  on conflict (user_id, day) do update set calls = public.usage.calls + 1
  returning calls into total;
  return total;
end;
$$;

revoke all on function public.bump_usage() from public;
grant execute on function public.bump_usage() to authenticated;
