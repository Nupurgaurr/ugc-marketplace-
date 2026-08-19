# Handover Guide

How this codebase is put together, and how to extend each piece. Read [RULES.md](./RULES.md) first for what cannot change, [PROJECT_REPORT.md](./PROJECT_REPORT.md) for what the product is, and [DECISIONS.md](./DECISIONS.md) for why it is shaped this way. This is the how.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run build      # production build, also type-checks and lints
npm run types:db   # regenerate lib/database.types.ts from the linked Supabase project
```

**Environment variables are required.** Copy `.env.example` to `.env.local` and fill it from the Supabase dashboard. Without them the app builds but every query fails. Full setup, including the migrations and the Resend SMTP config, is in [`supabase/README.md`](./supabase/README.md).

## Project structure

```
app/                   routes and server actions
  page.tsx              home
  actions/              server actions: auth, application, profile, review
  auth/callback/        where a magic link lands
  become-a-creator/     narrative, then the application
  creator/…             creator portal
  admin/…               admin, approve and reject only

components/
  home/                 header, entrance overlay, coming soon, footer
  roast/                the /become-a-creator narrative
  shared/               cross-portal primitives
  creator/  admin/      portal-specific components
  motion/               single-purpose motion effects

lib/
  database.types.ts     generated from the schema, do not hand edit
  types.ts              every domain type, aliased off the generated types
  routes.ts             every URL, in one place
  schemas/              Zod, shared by form and server action
  supabase/             browser, server and service-role clients
  data/                 server-side reads
  social.ts             handle normalisation and per-platform validation
  languages.ts          the twelve languages, in their own scripts
  animation/            GSAP helpers and the shared reveal constants

supabase/
  migrations/           the schema, run in order
  README.md             setup

styles/
  tokens.css            colour, spacing, radius, motion
  typography.css        fonts and type scale

middleware.ts           session refresh, and redirects for anonymous traffic
```

## Where authorization actually lives

**Row Level Security in Postgres is the security boundary.** Not React, not middleware.

A creator's query returns only their own row because the database refuses the rest, which is why the reads in `lib/data/creator.ts` do not filter by id defensively. The Server Component redirects and the middleware are convenience, so a signed-out visitor gets a login page instead of an empty screen. Removing them would be a UX regression, not a security hole.

Three clients, and the difference matters:

| Client | Runs as | Use for |
|---|---|---|
| `lib/supabase/client.ts` | The signed-in user | Browser-side queries. RLS applies |
| `lib/supabase/server.ts` | The signed-in user | Server Components, Route Handlers, Server Actions. RLS applies |
| `lib/supabase/admin.ts` | Service role | **Bypasses RLS.** Two places only: minting the auth user on submit, and BCM verifying payouts |

`admin.ts` imports `server-only`, so importing it from a client component is a build error. Keep it that way.

## Auth

Supabase magic link, no passwords, delivered over Resend as Supabase's SMTP provider. The app never calls Resend directly.

- **Returning creator or admin**: `sendMagicLink` in `app/actions/auth.ts`. It passes `shouldCreateUser: false`, without which anyone could mint an auth user with no application behind it. The `next` destination is picked from a fixed pair, never taken from the form body, or it becomes an open redirect.
- **New application**: `app/actions/application.ts` mints the auth user with the service role, then burns a one-time token immediately to establish the session, so the creator lands on their dashboard without going to their inbox. Everything after that runs under their own session so RLS checks the writes. If any step fails the auth user is deleted rather than left orphaned.
- **Admin** is membership in the `admins` table, checked by the `is_admin()` SQL function that the policies call. Add a row by hand; nothing in the app writes to that table.

## Adding a field

The schema is the source of truth and everything else is derived, so the order matters:

1. Add a migration under `supabase/migrations/`, and run it.
2. `npm run types:db` to regenerate `lib/database.types.ts`.
3. Add the field to the relevant Zod schema in `lib/schemas/`. Both the form and the server action import it, so they cannot drift.
4. Add the input. The form is `components/creator/RegisterWizard.tsx`, the profile editor is `components/creator/ProfileEditor.tsx`. Reach for `OptionTile` for anything selected from a set.
5. Write it in the server action.

Never hand-write a type that duplicates a table. If a column changes, the regenerated types should break the code at the places that care.

## Adding a page

1. Add the route under the matching `app/` folder, and the path to `lib/routes.ts`. No hardcoded path strings in JSX.
2. Keep it a Server Component. `'use client'` only where there is state, an effect, or an event handler.
3. Do the auth check in the page itself, with `getCurrentCreator()` or `isCurrentUserAdmin()` and a `redirect`. There is no `RequireAuth` wrapper any more, because the check belongs on the server.
4. Wrap the body in `CreatorShell` or `AdminShell` for nav chrome, and add the route to that shell's `NAV`.
5. Reach for `components/shared/*` before writing a new primitive. See [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) §5.

## Motion

`components/home/IntroOverlay.tsx` is the entrance: three words stagger up out of a clipped mask, hold, then the black screen lifts. It reads `sessionStorage.bcm_intro_seen` **during the first render**, not in an effect, so a repeat visit never mounts the overlay and never flashes black. Clear that key in devtools to replay it.

Scroll reveals use `lib/animation/useReveal.ts`. Neither hook takes a distance, duration or easing override, and new reveals should not invent their own: all of them share four constants from `gsapConfig.ts`. Per-element tuning is what made reveals on the same screen land at visibly different speeds.

`components/motion/SmoothScroll.tsx` runs Lenis off the GSAP ticker rather than its own rAF loop, so Lenis and ScrollTrigger advance in the same frame. Mount it per page, not globally. It never starts under `prefers-reduced-motion`.

Every animation must respect `prefers-reduced-motion`, and every GSAP timeline must be killed on unmount.

## Meme content

`content/memes.ts` is a manifest where every slot ships with `src` empty, so `MemeSlot` falls back to a typographic caption. The page is fully shippable with zero assets. Once BCM has licensed, self-made or cleared assets, drop them under `public/media/memes/` and fill in `src`. Nothing else changes.

No film stills, GIFs or copyrighted clips are committed here, deliberately: that is real legal exposure for a commercial product.

## The admin URL

`/admin/login` is linked only from the home menu. Before a real launch, harden it: IP allowlisting or a second factor. Magic link already removed the hardcoded credential that used to sit in source.
