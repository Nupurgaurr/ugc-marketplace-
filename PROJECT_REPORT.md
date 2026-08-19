# Black Coffee Media UGC Network, Project Report

Last updated 2026-08-19, after the Phase 1 rebuild (Tasks 1 to 7). This document describes what exists today. Anything not yet built sits under Section 4, clearly marked. No aspirational language above that line.

## 1. Summary

A managed UGC creator network owned and operated by Black Coffee Media. BCM holds the creator roster, vets every applicant, and brings creators paid work directly.

BCM already manages roughly 100 creators in Google Sheets. This product moves that roster online.

Three surfaces:

- **Home**, the public front door
- **Creator**, apply, track application status, keep a profile and payout details current
- **Admin**, which is BCM, the operator that approves and rejects applications

Brands do not hold accounts and do not interact with creators through this product. Work reaches creators through BCM, not through a marketplace transaction in the app.

**This is not a marketplace.** Anything that treats it like one, public brief boards, creator to brand pitching, auto matching, brand self checkout, is out of scope permanently unless this document says otherwise.

## 2. Phases

### Phase 1, current

A public shopfront and a working creator pipeline, on a real backend.

In scope: home page, become a creator narrative, application form, creator portal (status, profile, payout details), and a minimal admin approval queue.

Out of scope: brand accounts, discover, shortlists, briefs, pitches, requests, casting workflow, payout processing, contracts, reports, messaging.

### Phase 2, later

Brand accounts, campaign and casting workflow, deliverable tracking, payout runs, reporting. The Phase 1 data model must not block these, but no Phase 2 code ships in Phase 1.

## 3. How It Works

1. **Creator applies** through `/become-a-creator` (narrative) into `/become-a-creator/apply` (the five step application).
2. **The record is created** with status `applied`. The creator is signed in and lands on the dashboard.
3. **Dashboard shows a waiting state** until BCM reviews.
4. **BCM moves the application** to `in_review`, then `approved` or `rejected`. Approved creators get the full dashboard. Rejected creators get a plain, respectful message.
5. **Approved creators add payout details** so BCM can pay them directly for work it brings them.

A separate onboarding path is needed for the roughly 100 creators BCM already manages. They must not be asked to fill in the application. This is not built yet, see Section 4.

## 4. Current State

### Done

The Phase 1 rebuild is complete. Every task in the brief has shipped, each on its own commit on `feat/phase-1-rebuild`.

| Task | What landed |
|---|---|
| 1 | Purge. Brand side, briefs, pitches, requests, discover, admin reports and all mock data deleted, roughly 5,500 lines |
| 2 | Supabase backend. Schema, RLS on every table, magic link auth, Zod schemas, Server Components, middleware |
| 3 | Entrance transition and coming soon home. Permanent hamburger header. Fonts on `next/font` |
| 4 | `/become-a-creator` spacing on a scale, reveals standardised, Lenis on the GSAP ticker |
| 5 | Application form rebuilt. Tile selectors, structured social profiles, native-script languages, two column layout |
| 6 | Creator portal. Full profile editor, and the payout details tab |
| 7 | Docs. This file, `SITEMAP.md`, `PAGE_CONTENT_MAP.md`, `DESIGN_GUIDE.md`, and `DECISIONS.md` |

Typecheck and production build pass on every one of those commits.

### What is needed before this runs

The code is complete and the migrations are written, but **the Supabase project does not exist yet**. Four steps, all in `supabase/README.md`:

1. Create the project, and fill `.env.local` from `.env.example`
2. Run `migrations/0001_init.sql`, `0002_seed_option_lists.sql`, `0003_social_follower_count.sql` in order
3. Configure Resend as the SMTP provider, and add `/auth/callback` to the redirect allow list
4. Insert a row into `admins` for whoever is reviewing applications

Until then the app builds and typechecks but cannot read or write anything.

### Not built

- Onboarding for BCM's existing roster: bulk import, and a claim flow so those creators are not asked to fill in the application.
- A UI for `admin_notes`. The table and its admin-only RLS exist; nothing writes to it.
- Portfolio video upload. See Section 8.

## 5. Data Model

Defined in `supabase/migrations/0001_init.sql`. All tables carry Row Level Security, and no table has a permissive default. A creator can read and write only their own rows, proven either by `auth_user_id` or by a join back to it.

| Table | Holds |
|---|---|
| `creators` | Identity, location, contact, category, content styles, languages, shoot setup, turnaround, rate band, bio, availability, status, review metadata |
| `creator_social_profiles` | One row per profile. Instagram mandatory, other platforms added by the creator. Never a joined string. |
| `creator_sample_links` | Up to three, optional |
| `creator_payout_details` | Bank or UPI, PAN, verification flag |
| `categories`, `content_styles` | Admin editable later, seeded now. Read from the database, never hardcoded in components. |
| `admin_notes` | Private to BCM. No creator-facing policy exists, so a creator cannot read these rows under any query |
| `admins` | Membership here is what makes an auth user BCM. Rows are added by hand; nothing in the app writes to it |

Application status: `applied`, `in_review`, `approved`, `rejected`.

`creator_payout_details` is the most sensitive table in the project. The owning creator and the service role only. **Admins are deliberately absent from its policies**, a trigger blocks a creator marking their own details verified, and the account and PAN numbers are masked to their last four digits in `lib/data/creator.ts` before they ever leave the server. Nothing logs them.

A trigger on `creators` also blocks a creator editing their own `status`, `reviewed_at` or `reviewed_by`, so only BCM moves an application through the pipeline.

## 6. Brand and Tone

Public copy reads as the standard, not an option among many: short, assertive headlines, one confident claim per section.

The creator application is the deliberate exception, playful and Hinglish throughout, because that is the register that gets a real creator to finish an application instead of bouncing.

Admin rejection copy is the hard boundary on that voice. Always plain and respectful, never a roast.

Every meme slot in the narrative flow (`components/shared/MemeSlot.tsx`, driven by `content/memes.ts`) ships with `src` empty, so each slot falls back to its typographic caption. That is a deliberate placeholder pending licensed assets.

The non negotiable UI rules that follow from this voice, no emojis, no em dashes, no dashed borders, no pill selectors, no raw hex or px, languages in their own script, live in [RULES.md](./RULES.md). They are constraints on future work rather than a description of the product, which is why they sit there and not here.

Accent colour: `#C4A370` on a dark, warm neutral canvas.

### Motion

A small shared motion library (`components/motion/*`) backs the expressive surfaces: a cursor repelling word for the waiting screen, a cursor fleeing button and a magnetic button for the application's closing ask, a clip path text wipe and character scramble reveal for the narrative screens, and a cursor following spotlight.

These are reserved for the narrative and waiting surfaces only. Everyday portal UI stays on plain reveals and CSS transitions. Every animation respects `prefers-reduced-motion`, nothing blocks interaction, and no scroll jacking.

## 7. Technical Approach

Next.js 14 (App Router), TypeScript, CSS Modules, GSAP. No CSS framework: a single token file drives colour, type, spacing and motion across every screen.

| Layer | Choice |
|---|---|
| Database | Supabase Postgres |
| Auth | Supabase Auth, email magic link. No passwords |
| Authorization | Row Level Security on every table, enforced in the database |
| Validation | Zod, shared between form and route handler |
| Forms | react-hook-form with the Zod resolver |
| Icons | lucide-react |
| Smooth scroll | Lenis, wired into the GSAP ticker, disabled under reduced motion |
| Email | Resend, wired in as Supabase's SMTP provider |
| API | Next.js Route Handlers and Server Actions. No separate server |
| Hosting | Vercel, preview deploy per pull request |

Every dependency in the project, and what it is for, is listed in [DECISIONS.md](./DECISIONS.md). The rule for adding one is in [RULES.md](./RULES.md).

---

Decisions, open and closed, are in [DECISIONS.md](./DECISIONS.md). Ownership and process are in [RULES.md](./RULES.md).
