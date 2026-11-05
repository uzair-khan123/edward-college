-- ============================================================================
-- Edward Model College
-- Initial database schema
-- Compatible with the current types/database.ts and application actions.
-- Intended for a fresh Supabase database. Run only once.
-- ============================================================================

begin;

-- ============================================================================
-- 1. PROFILES
-- ============================================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  role text not null default 'viewer'
    check (role in ('admin', 'editor', 'viewer')),
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 2. NOTICES
-- ============================================================================

create table public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null default 'general'
    check (
      category in ('general', 'admissions', 'exams', 'events', 'holiday')
    ),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notices_published_idx
  on public.notices (published, created_at desc);

create index notices_category_idx
  on public.notices (category);

-- ============================================================================
-- 3. FACULTY
-- ============================================================================

create table public.faculty (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text not null,
  department text not null,
  qualification text,
  photo_url text,
  bio text,
  created_at timestamptz not null default now()
);

create index faculty_department_idx
  on public.faculty (department);

-- ============================================================================
-- 4. GALLERY
-- ============================================================================

create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  category text not null default 'campus'
    check (
      category in (
        'campus',
        'classrooms',
        'activities',
        'sports',
        'events',
        'staff'
      )
    ),
  created_at timestamptz not null default now()
);

create index gallery_category_idx
  on public.gallery (category, created_at desc);

-- ============================================================================
-- 5. ADMISSIONS
-- ============================================================================

create table public.admissions (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  email text not null,
  phone text not null,
  class text not null,
  message text,
  status text not null default 'pending'
    check (status in ('pending', 'contacted', 'accepted', 'rejected')),
  created_at timestamptz not null default now()
);

create index admissions_status_idx
  on public.admissions (status, created_at desc);

-- ============================================================================
-- 6. CONTACT MESSAGES
-- ============================================================================

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

create index contact_messages_created_idx
  on public.contact_messages (created_at desc);

-- ============================================================================
-- 7. UPDATED_AT TRIGGER
-- ============================================================================

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger notices_touch_updated_at
before update on public.notices
for each row
execute function public.touch_updated_at();

-- ============================================================================
-- 8. AUTOMATIC PROFILE CREATION
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is null then
    raise exception 'An email address is required to create a profile';
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    'viewer'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ============================================================================
-- 9. STAFF PERMISSION HELPERS
-- SECURITY DEFINER avoids recursive profiles RLS checks.
-- The fixed search_path helps protect against object shadowing.
-- ============================================================================

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('admin', 'editor')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  );
$$;

-- ============================================================================
-- 10. ENABLE ROW LEVEL SECURITY
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.notices enable row level security;
alter table public.faculty enable row level security;
alter table public.gallery enable row level security;
alter table public.admissions enable row level security;
alter table public.contact_messages enable row level security;

-- ============================================================================
-- 11. REMOVE DEFAULT TABLE ACCESS
-- Explicit grants below define the allowed operations.
-- ============================================================================

revoke all on public.profiles
  from public, anon, authenticated;

revoke all on public.notices
  from public, anon, authenticated;

revoke all on public.faculty
  from public, anon, authenticated;

revoke all on public.gallery
  from public, anon, authenticated;

revoke all on public.admissions
  from public, anon, authenticated;

revoke all on public.contact_messages
  from public, anon, authenticated;

grant usage on schema public to anon, authenticated;

-- Profiles: users can read their own profile; admins can read all profiles.
grant select on public.profiles to authenticated;
grant update (full_name, avatar_url)
  on public.profiles to authenticated;

-- Public content can be read by visitors.
grant select on public.notices to anon, authenticated;
grant insert, update, delete on public.notices to authenticated;

grant select on public.faculty to anon, authenticated;
grant insert, update, delete on public.faculty to authenticated;

grant select on public.gallery to anon, authenticated;
grant insert, update, delete on public.gallery to authenticated;

-- Public forms can insert only their own submitted fields.
grant insert (
  student_name, email, phone, class, message
) on public.admissions to anon, authenticated;

grant select, update, delete
  on public.admissions to authenticated;

grant insert (
  name, email, subject, message
) on public.contact_messages to anon, authenticated;

grant select, update, delete
  on public.contact_messages to authenticated;

-- ============================================================================
-- 12. PROFILES POLICIES
-- ============================================================================

create policy "profiles_read_own_or_staff"
on public.profiles
for select
to authenticated
using (
  id = (select auth.uid())
  or (select public.is_admin())
);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- There is deliberately no client-side INSERT policy for profiles.
-- The trusted signup trigger creates profiles.
-- Column-level UPDATE grant only permits full_name/avatar_url changes.
-- No user can update their own role through the client.
-- Editors can manage content but cannot read admissions/contact messages.

-- ============================================================================
-- 13. NOTICES POLICIES
-- ============================================================================

create policy "notices_read_published_or_staff"
on public.notices
for select
to anon, authenticated
using (
  published = true
  or (select public.is_staff())
);

create policy "notices_staff_insert"
on public.notices
for insert
to authenticated
with check ((select public.is_staff()));

create policy "notices_staff_update"
on public.notices
for update
to authenticated
using ((select public.is_staff()))
with check ((select public.is_staff()));

create policy "notices_admin_delete"
on public.notices
for delete
to authenticated
using ((select public.is_admin()));

-- ============================================================================
-- 14. FACULTY POLICIES
-- ============================================================================

create policy "faculty_public_read"
on public.faculty
for select
to anon, authenticated
using (true);

create policy "faculty_staff_insert"
on public.faculty
for insert
to authenticated
with check ((select public.is_staff()));

create policy "faculty_staff_update"
on public.faculty
for update
to authenticated
using ((select public.is_staff()))
with check ((select public.is_staff()));

create policy "faculty_admin_delete"
on public.faculty
for delete
to authenticated
using ((select public.is_admin()));

-- ============================================================================
-- 15. GALLERY POLICIES
-- ============================================================================

create policy "gallery_public_read"
on public.gallery
for select
to anon, authenticated
using (true);

create policy "gallery_staff_insert"
on public.gallery
for insert
to authenticated
with check ((select public.is_staff()));

create policy "gallery_staff_update"
on public.gallery
for update
to authenticated
using ((select public.is_staff()))
with check ((select public.is_staff()));

create policy "gallery_admin_delete"
on public.gallery
for delete
to authenticated
using ((select public.is_admin()));

-- ============================================================================
-- 16. ADMISSIONS POLICIES
-- ============================================================================

create policy "admissions_public_submit"
on public.admissions
for insert
to anon, authenticated
with check (true);

create policy "admissions_admin_read"
on public.admissions
for select
to authenticated
using ((select public.is_admin()));

create policy "admissions_admin_update"
on public.admissions
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "admissions_admin_delete"
on public.admissions
for delete
to authenticated
using ((select public.is_admin()));

-- ============================================================================
-- 17. CONTACT MESSAGE POLICIES
-- ============================================================================

create policy "contact_public_submit"
on public.contact_messages
for insert
to anon, authenticated
with check (true);

create policy "contact_admin_read"
on public.contact_messages
for select
to authenticated
using ((select public.is_admin()));

create policy "contact_admin_delete"
on public.contact_messages
for delete
to authenticated
using ((select public.is_admin()));

-- ============================================================================
-- 18. FUNCTION EXECUTION PERMISSIONS
-- ============================================================================

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.touch_updated_at() from public, anon, authenticated;

revoke all on function public.is_staff() from public, anon;
revoke all on function public.is_admin() from public, anon;

grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;

commit;

-- ============================================================================
-- IMPORTANT:
-- 1. Do not make a user admin by editing client-side code.
-- 2. Create the first admin through a trusted, verified process after signup.
-- 3. Keep service-role keys private.
-- 4. Configure Storage buckets and their policies separately.
-- ============================================================================