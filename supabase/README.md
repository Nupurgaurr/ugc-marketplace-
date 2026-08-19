# Supabase setup

Everything in the app is written and typechecked against this schema. What is
left is creating the project and running the two migrations.

## 1. Create the project

Create a Supabase project, then copy `.env.example` to `.env.local` and fill in
the three values from **Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`.env.local` is gitignored. The service role key bypasses RLS, so it never gets
a `NEXT_PUBLIC_` prefix and never reaches the browser.

## 2. Run the migrations

In the Supabase dashboard, open **SQL Editor** and run these in order:

1. `migrations/0001_init.sql` — tables, constraints, triggers, RLS policies
2. `migrations/0002_seed_option_lists.sql` — categories and content styles

Re-running `0002` is safe. `0001` is not: it creates types and tables.

## 3. Wire Resend as the SMTP provider

Magic links are sent by Supabase over whatever SMTP is configured, and that is
Resend.

1. Create a Resend API key and verify the sending domain.
2. In Supabase, **Authentication → Emails → SMTP Settings**, enable custom SMTP:
   - Host `smtp.resend.com`, port `465`
   - Username `resend`
   - Password: the Resend API key
   - Sender: an address on the verified domain
3. **Authentication → URL Configuration**: add `http://localhost:3000/auth/callback`
   and the production equivalent to the redirect allow list.

## 4. Add yourself as an admin

Admin is membership in the `admins` table, not a password. Sign in once at
`/admin/login` to mint the auth user, find its id under **Authentication →
Users**, then:

```sql
insert into admins (user_id, email)
values ('<the-uuid>', 'you@blackcoffee.media');
```

Nothing in the app writes to `admins`. That is deliberate.

## 5. Regenerate types after any schema change

```
npm run types:db
```

This overwrites `lib/database.types.ts` from the linked project. Every domain
type in `lib/types.ts` is an alias off that file, so a dropped column becomes a
compile error rather than a runtime surprise.

## What the policies actually enforce

- **creators** — a creator reads and writes only the row whose `auth_user_id`
  matches their session. A trigger blocks them from touching `status`,
  `reviewed_at`, `reviewed_by` or `auth_user_id`; only an admin moves an
  application through the pipeline.
- **creator_social_profiles**, **creator_sample_links** — same ownership rule,
  proven through a join back to `creators`. Admins get read access for review.
- **creator_payout_details** — the owning creator and the service role, nobody
  else. Admins are deliberately absent from these policies. A trigger stops a
  creator marking their own details verified. The account and PAN numbers are
  masked to their last four digits before they leave the server, in
  `lib/data/creator.ts`.
- **admin_notes** — admins only. There is no creator-facing policy, so a
  creator cannot read these rows under any query.
- **categories**, **content_styles** — world readable, because the application
  form is public. Writable by admins.
