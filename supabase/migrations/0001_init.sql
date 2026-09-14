-- ============================================================================
-- Edward Model College - initial database schema
-- Run this once in: Supabase Dashboard -> SQL Editor -> New query -> Run
-- (or via `supabase db push` if you use the Supabase CLI)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. PROFILES
-- One row per authenticated user, created automatically on signup (trigger
-- below). role decides what a logged-in user can do in the admin dashboard.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  role text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'viewer');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. NOTICES
-- ---------------------------------------------------------------------------
create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null default 'general' check (category in ('general', 'admissions', 'exams', 'events', 'holiday')),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists notices_published_idx on public.notices (published, created_at desc);
create index if not exists notices_category_idx on public.notices (category);

-- ---------------------------------------------------------------------------
-- 3. FACULTY
-- ---------------------------------------------------------------------------
create table if not exists public.faculty (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text not null,
  department text not null,
  qualification text,
  photo_url text,
  bio text,
  created_at timestamptz not null default now()
);
create index if not exists faculty_department_idx on public.faculty (department);

-- ---------------------------------------------------------------------------
-- 4. GALLERY
-- ---------------------------------------------------------------------------
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  category text not null default 'campus' check (category in ('campus', 'classrooms', 'activities', 'sports', 'events', 'staff')),
  created_at timestamptz not null default now()
);
create index if not exists gallery_category_idx on public.gallery (category, created_at desc);

-- ---------------------------------------------------------------------------
-- 5. ADMISSIONS (public inquiry form submissions)
-- ---------------------------------------------------------------------------
create table if not exists public.admissions (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  email text not null,
  phone text not null,
  class text not null,
  message text,
  status text not null default 'pending' check (status in ('pending', 'contacted', 'accepted', 'rejected')),
  created_at timestamptz not null default now()
);
create index if not exists admissions_status_idx on public.admissions (status, created_at desc);

-- ---------------------------------------------------------------------------
-- 6. CONTACT MESSAGES (public contact form submissions)
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);
create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY
-- Rule of thumb used throughout:
--   - Public/anon users: read-only, and only "published" rows where that
--     concept applies. Can INSERT into admissions/contact_messages only
--     (a public form submitting about itself), never read others' submissions.
--   - Authenticated users with role='admin' or 'editor' in profiles: full
--     read/write on content tables (notices, faculty, gallery) and read on
--     admissions/contact_messages.
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.notices enable row level security;
alter table public.faculty enable row level security;
alter table public.gallery enable row level security;
alter table public.admissions enable row level security;
alter table public.contact_messages enable row level security;

-- Small helper so policies below don't repeat this subquery everywhere.
create or replace function public.is_staff()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$ language sql security definer stable;

-- profiles: a user can read/update only their own row; staff can read all.
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id or public.is_staff());
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- notices: public can read only published notices; staff can do everything.
create policy "notices: public read published" on public.notices
  for select using (published = true or public.is_staff());
create policy "notices: staff write" on public.notices
  for insert with check (public.is_staff());
create policy "notices: staff update" on public.notices
  for update using (public.is_staff());
create policy "notices: staff delete" on public.notices
  for delete using (public.is_staff());

-- faculty: public can read all faculty (no "published" concept); staff manage.
create policy "faculty: public read" on public.faculty
  for select using (true);
create policy "faculty: staff write" on public.faculty
  for insert with check (public.is_staff());
create policy "faculty: staff update" on public.faculty
  for update using (public.is_staff());
create policy "faculty: staff delete" on public.faculty
  for delete using (public.is_staff());

-- gallery: public can read all; staff manage.
create policy "gallery: public read" on public.gallery
  for select using (true);
create policy "gallery: staff write" on public.gallery
  for insert with check (public.is_staff());
create policy "gallery: staff update" on public.gallery
  for update using (public.is_staff());
create policy "gallery: staff delete" on public.gallery
  for delete using (public.is_staff());

-- admissions: anyone can submit (insert); only staff can read/update/delete.
create policy "admissions: public submit" on public.admissions
  for insert with check (true);
create policy "admissions: staff read" on public.admissions
  for select using (public.is_staff());
create policy "admissions: staff update" on public.admissions
  for update using (public.is_staff());
create policy "admissions: staff delete" on public.admissions
  for delete using (public.is_staff());

-- contact_messages: anyone can submit (insert); only staff can read/delete.
create policy "contact: public submit" on public.contact_messages
  for insert with check (true);
create policy "contact: staff read" on public.contact_messages
  for select using (public.is_staff());
create policy "contact: staff delete" on public.contact_messages
  for delete using (public.is_staff());

-- ============================================================================
-- STORAGE BUCKETS
-- Create these in Supabase Dashboard -> Storage -> New bucket
-- (or uncomment and run the inserts below if the storage schema is available)
-- ============================================================================
-- insert into storage.buckets (id, name, public) values ('gallery-images', 'gallery-images', true);
-- insert into storage.buckets (id, name, public) values ('faculty-photos', 'faculty-photos', true);
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Storage policies (run after creating the buckets above):
-- create policy "gallery-images: public read" on storage.objects
--   for select using (bucket_id = 'gallery-images');
-- create policy "gallery-images: staff upload" on storage.objects
--   for insert with check (bucket_id = 'gallery-images' and public.is_staff());
-- create policy "gallery-images: staff delete" on storage.objects
--   for delete using (bucket_id = 'gallery-images' and public.is_staff());
-- (repeat the same three policies for 'faculty-photos' and 'avatars')
