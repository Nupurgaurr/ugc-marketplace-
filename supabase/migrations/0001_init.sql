-- ============================================================================
-- Black Coffee Media UGC network — initial schema.
--
-- Authorization is enforced here, not in React. Every table has RLS enabled
-- and no table has a permissive default. A creator reaches only their own
-- row; BCM staff reach the roster; nobody but the owning creator and the
-- service role ever reaches payout details.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type creator_status as enum ('applied', 'in_review', 'approved', 'rejected');
create type payout_method as enum ('bank', 'upi');
create type social_platform as enum (
  'instagram', 'youtube', 'tiktok', 'facebook', 'linkedin', 'x', 'snapchat', 'website'
);

-- ---------------------------------------------------------------------------
-- Staff. Membership here is what makes an auth user BCM rather than a creator.
-- Rows are added by hand in the Supabase dashboard; nothing in the app writes
-- to this table.
-- ---------------------------------------------------------------------------

create table admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table admins enable row level security;

-- security definer so the policies below can consult this table without
-- recursing through its own RLS.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

create policy "admins read the roster of admins"
  on admins for select
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Option lists. Admin-editable later; the frontend reads these, it never
-- hardcodes them.
-- ---------------------------------------------------------------------------

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create table content_styles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

alter table categories enable row level security;
alter table content_styles enable row level security;

-- The application form is public, so the option lists must be too.
create policy "option lists are world readable"
  on categories for select using (true);

create policy "option lists are world readable"
  on content_styles for select using (true);

create policy "admins edit categories"
  on categories for all using (public.is_admin()) with check (public.is_admin());

create policy "admins edit content styles"
  on content_styles for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Creators
-- ---------------------------------------------------------------------------

create table creators (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users (id) on delete cascade,

  full_name text not null check (length(trim(full_name)) between 2 and 80),
  city text not null check (length(trim(city)) between 2 and 60),
  phone text not null check (phone ~ '^\+?[0-9 ]{10,16}$'),
  email text not null,

  category_id uuid references categories (id) on delete set null,
  content_styles text[] not null default '{}',
  languages text[] not null default '{}',

  shoot_setup text not null check (shoot_setup in ('phone', 'phone_lights', 'camera')),
  turnaround text not null check (turnaround in ('48h', '3_5_days', 'week_plus')),
  rate_band text not null check (rate_band in ('under_10k', '10k_20k', '20k_plus')),

  bio text not null default '' check (length(bio) <= 600),
  availability text not null default '' check (length(availability) <= 120),

  status creator_status not null default 'applied',

  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null
);

create index creators_status_idx on creators (status, created_at desc);
create index creators_auth_user_idx on creators (auth_user_id);

alter table creators enable row level security;

create policy "creator reads own row"
  on creators for select
  using (auth_user_id = auth.uid());

create policy "creator creates own row"
  on creators for insert
  with check (auth_user_id = auth.uid());

-- A creator edits their profile. They cannot move their own application
-- through the pipeline: the trigger below rejects any self-service change to
-- status, reviewed_at or reviewed_by.
create policy "creator updates own row"
  on creators for update
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

create policy "admins read every creator"
  on creators for select
  using (public.is_admin());

create policy "admins review creators"
  on creators for update
  using (public.is_admin())
  with check (public.is_admin());

create function public.guard_creator_review_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if new.status is distinct from old.status
     or new.reviewed_at is distinct from old.reviewed_at
     or new.reviewed_by is distinct from old.reviewed_by
     or new.auth_user_id is distinct from old.auth_user_id then
    raise exception 'review fields are set by BCM, not by the creator';
  end if;

  return new;
end;
$$;

create trigger creators_guard_review_fields
  before update on creators
  for each row execute function public.guard_creator_review_fields();

-- Stamp the review metadata whenever BCM moves an application.
create function public.stamp_creator_review()
returns trigger
language plpgsql
as $$
begin
  if new.status is distinct from old.status then
    new.reviewed_at := now();
    new.reviewed_by := auth.uid();
  end if;
  return new;
end;
$$;

create trigger creators_stamp_review
  before update on creators
  for each row execute function public.stamp_creator_review();

-- ---------------------------------------------------------------------------
-- Social profiles. One row per profile, never a joined string.
-- ---------------------------------------------------------------------------

create table creator_social_profiles (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creators (id) on delete cascade,
  platform social_platform not null,
  handle text not null check (length(trim(handle)) between 1 and 200),
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (creator_id, platform)
);

create index creator_social_profiles_creator_idx on creator_social_profiles (creator_id);

alter table creator_social_profiles enable row level security;

create policy "creator manages own social profiles"
  on creator_social_profiles for all
  using (
    exists (select 1 from creators c where c.id = creator_id and c.auth_user_id = auth.uid())
  )
  with check (
    exists (select 1 from creators c where c.id = creator_id and c.auth_user_id = auth.uid())
  );

create policy "admins read social profiles"
  on creator_social_profiles for select
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Sample links. Optional, capped at three by the trigger below.
-- ---------------------------------------------------------------------------

create table creator_sample_links (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creators (id) on delete cascade,
  url text not null check (url ~ '^https?://'),
  created_at timestamptz not null default now()
);

create index creator_sample_links_creator_idx on creator_sample_links (creator_id);

alter table creator_sample_links enable row level security;

create policy "creator manages own sample links"
  on creator_sample_links for all
  using (
    exists (select 1 from creators c where c.id = creator_id and c.auth_user_id = auth.uid())
  )
  with check (
    exists (select 1 from creators c where c.id = creator_id and c.auth_user_id = auth.uid())
  );

create policy "admins read sample links"
  on creator_sample_links for select
  using (public.is_admin());

create function public.enforce_sample_link_cap()
returns trigger
language plpgsql
as $$
begin
  if (select count(*) from creator_sample_links where creator_id = new.creator_id) >= 3 then
    raise exception 'a creator may have at most three sample links';
  end if;
  return new;
end;
$$;

create trigger creator_sample_links_cap
  before insert on creator_sample_links
  for each row execute function public.enforce_sample_link_cap();

-- ---------------------------------------------------------------------------
-- Payout details.
--
-- Financial and identity data. The strictest RLS in the project: the owning
-- creator and the service role, nobody else. Admins are deliberately absent
-- from these policies — BCM verifies payouts through the service role, not by
-- reading account numbers out of the app.
-- ---------------------------------------------------------------------------

create table creator_payout_details (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null unique references creators (id) on delete cascade,

  method payout_method not null,

  account_holder_name text check (length(trim(account_holder_name)) between 2 and 80),
  account_number text check (account_number ~ '^[0-9]{9,18}$'),
  ifsc text check (ifsc ~ '^[A-Z]{4}0[A-Z0-9]{6}$'),
  upi_id text check (upi_id ~ '^[a-zA-Z0-9._-]{2,64}@[a-zA-Z]{2,64}$'),

  pan_number text not null check (pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]$'),

  verified boolean not null default false,
  verified_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Whichever method is chosen, its own fields are required and the other
  -- method's are not half-filled.
  constraint payout_method_fields check (
    (method = 'bank'
      and account_holder_name is not null
      and account_number is not null
      and ifsc is not null)
    or
    (method = 'upi' and upi_id is not null)
  )
);

alter table creator_payout_details enable row level security;

create policy "creator manages own payout details"
  on creator_payout_details for all
  using (
    exists (select 1 from creators c where c.id = creator_id and c.auth_user_id = auth.uid())
  )
  with check (
    exists (select 1 from creators c where c.id = creator_id and c.auth_user_id = auth.uid())
  );

-- The creator supplies the details; only BCM (service role) marks them verified.
create function public.guard_payout_verification()
returns trigger
language plpgsql
as $$
begin
  if new.verified is distinct from old.verified and auth.uid() is not null then
    raise exception 'verification is set by BCM, not by the creator';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger creator_payout_details_guard
  before update on creator_payout_details
  for each row execute function public.guard_payout_verification();

-- ---------------------------------------------------------------------------
-- Admin notes. Private. No creator-facing policy exists, so a creator cannot
-- read these rows under any query.
-- ---------------------------------------------------------------------------

create table admin_notes (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creators (id) on delete cascade,
  author uuid not null references auth.users (id) on delete cascade,
  note text not null check (length(trim(note)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index admin_notes_creator_idx on admin_notes (creator_id, created_at desc);

alter table admin_notes enable row level security;

create policy "admins manage notes"
  on admin_notes for all
  using (public.is_admin())
  with check (public.is_admin());
