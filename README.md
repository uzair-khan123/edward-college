# Edward Model College — Website

A full-stack college management website for **Edward Model College**, Balambat, Timergara,
Lower Dir, KP. Rebuilt from the original static HTML/CSS/JS site into a modern, database-backed
application.

## Technologies

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — design tokens ported 1:1 from the original site's CSS
- **Supabase** — PostgreSQL database, Authentication, and file Storage
- Server Actions for forms and admin CRUD (no separate API layer needed)

## Project structure

```
app/                    Pages (App Router) — one folder per route
  about/, academics/, departments/, faculty/, campus-life/,
  gallery/, notices/, admissions/, contact/, privacy/   → public pages
  login/                                                 → admin sign-in
  admin/                                                 → protected dashboard
components/             Reusable UI components
lib/
  supabase/              Supabase client helpers (browser + server)
  actions.ts             Server Actions for public forms (contact, admissions)
  admin-actions.ts        Server Actions for admin CRUD
supabase/migrations/     SQL schema — run this in your Supabase project
types/database.ts        Hand-written TypeScript types matching the schema
middleware.ts            Protects /admin routes, refreshes the auth session
```

## 1. Install prerequisites (one-time, on your own computer)

This project was written in a sandbox with no internet access, so dependencies have **not**
been installed or build-tested yet. On your own computer:

1. Install **Node.js 18.18 or newer** from https://nodejs.org (LTS version recommended).
2. Install a code editor if you don't have one — **VS Code** (https://code.visualstudio.com) is
   a good free option.
3. Open a terminal inside this project folder and run:
   ```bash
   npm install
   ```
   This downloads all the packages listed in `package.json`.

## 2. Create your Supabase project

1. Go to https://supabase.com and sign up (free tier is enough to start).
2. Click **New Project**. Choose a name (e.g. `edward-model-college`), set a database password
   (save it somewhere safe), and pick a region close to Pakistan (e.g. Singapore).
3. Once the project is created, go to **Project Settings → API**. You'll need two values:
   - **Project URL** → looks like `https://xxxxxxxx.supabase.co`
   - **anon public key** → a long string starting with `eyJ...`
4. Copy `.env.example` to a new file named `.env.local` in the project root, and paste in those
   two values:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`. You can leave `SUPABASE_SERVICE_ROLE_KEY` blank for now —
   nothing in this project currently requires it.

   **Never commit `.env.local` to GitHub** — it's already listed in `.gitignore`.

## 3. Set up the database

1. In the Supabase dashboard, open **SQL Editor → New query**.
2. Open `supabase/migrations/0001_init.sql` from this project, copy its entire contents, paste
   it into the SQL editor, and click **Run**.
3. This creates all six tables (`profiles`, `notices`, `faculty`, `gallery`, `admissions`,
   `contact_messages`), their indexes, and all Row Level Security policies.

## 4. Create the Storage buckets (for photo uploads)

1. In the Supabase dashboard, go to **Storage → New bucket**.
2. Create three buckets, and mark each one **Public**:
   - `gallery-images`
   - `faculty-photos`
   - `avatars`
3. For each bucket, go to its **Policies** tab and add:
   - a **SELECT** policy allowing everyone to read (`true`)
   - an **INSERT** policy allowing only authenticated staff to upload (see the commented
     example policies at the bottom of `supabase/migrations/0001_init.sql` — uncomment and run
     them, adjusting the bucket name for each).

## 5. Create your first admin account

Supabase doesn't have public sign-up in this project (only the college admin should have
dashboard access):

1. In the Supabase dashboard, go to **Authentication → Users → Add user**.
2. Enter your email and set a password. Confirm the email automatically (toggle "Auto Confirm
   User").
3. Go to **Table Editor → profiles**, find the row that was just auto-created for your new user
   (via a database trigger), and change its `role` column from `viewer` to `admin`.
4. You can now sign in at `/login` with that email and password, and reach `/admin`.

## 6. Run the site locally

```bash
npm run dev
```

Visit http://localhost:3000 in your browser. The site should load with the homepage; once your
`.env.local` is filled in and the database has content, notices/faculty/gallery will populate
automatically.

## 7. Before you consider this "done"

Run these and fix anything that fails:

```bash
npm run typecheck   # TypeScript errors
npm run lint        # ESLint issues
npm run build        # production build — catches most real bugs
```

Then manually check: every page loads, the mobile hamburger menu works, login/logout works,
a non-admin account gets redirected away from /admin, the contact and admissions forms actually
insert rows (check in Table Editor), notice publish/unpublish reflects on the public site, and
photo uploads for faculty/gallery work end-to-end.

## 8. Content still needed from the college office

Search the codebase for `[Update` and `[Add` to find every placeholder that must be replaced
with real information before launch — phone number, email, principal's name and message, hero
statistics, and social media links. None of these were invented; they're intentionally left as
placeholders.

## 9. Deploying

This project deploys cleanly to **Vercel** (built by the Next.js team, generous free tier) or
**Netlify** (the original site's host — a `netlify.toml` is not included in this rebuild since
Vercel is the more natural fit for Next.js, but Netlify also supports Next.js if you prefer to
stay there). Either way: connect your GitHub repo, and add the same environment variables from
`.env.local` in the host's dashboard (Project Settings → Environment Variables).

## Environment variables reference

| Variable | Where to find it | Exposed to browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | Yes (safe — protected by RLS) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | Yes (safe — protected by RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | **No — server only, currently unused** |
