# Black Coffee Media UGC Network, Project Report

Last updated after Task 1 (purge). This document describes what exists today. Anything not yet built sits under Section 4, clearly marked. No aspirational language above that line.

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

A separate onboarding path is needed for the roughly 100 creators BCM already manages. They must not be asked to fill in the application wizard. This is not built yet, see Section 4.

## 4. Current State

### Done

**Task 1, purge.** The brand side, briefs, pitches, requests, discover, admin reports and all mock data are deleted. Nine routes remain. Docs updated to match.

### Still running on temporary code

The creator and admin portals run on an in memory store (`lib/data/creators.ts`) and a localStorage session (`lib/auth/mockAuth.ts`). Both are deleted in Task 2 when Supabase replaces them. No demo records are seeded: a creator only exists once someone submits the application form, and that record disappears on reload.

### Not built yet

| Task | Scope |
|---|---|
| 2 | Supabase backend, auth, RLS, real persistence |
| 3 | Home entrance transition and coming soon page, hamburger header |
| 4 | Fix `/become-a-creator` spacing and reveal sync, add Lenis |
| 5 | Full rebuild of the application form |
| 6 | Creator portal cleanup, payout details tab |
| 7 | Docs pass |

Also not built and not yet scheduled: bulk import and claim flow for BCM's existing roster, and portfolio video upload (see Section 8).

## 5. Data Model

Defined in Task 2. All tables carry Row Level Security. A creator can read and write only their own rows.

| Table | Holds |
|---|---|
| `creators` | Identity, location, contact, category, content styles, languages, shoot setup, turnaround, rate band, bio, availability, status, review metadata |
| `creator_social_profiles` | One row per profile. Instagram mandatory, other platforms added by the creator. Never a joined string. |
| `creator_sample_links` | Up to three, optional |
| `creator_payout_details` | Bank or UPI, PAN, verification flag |
| `categories`, `content_styles` | Admin editable later, seeded now. Read from the database, never hardcoded in components. |
| `admin_notes` | Private to BCM, never visible to the creator |

Application status: `applied`, `in_review`, `approved`, `rejected`.

`creator_payout_details` is the most sensitive table in the project. Strictest RLS, never exposed through a public route, never logged, account number masked to the last four digits in the UI after save.

## 6. Brand and Tone

Public copy reads as the standard, not an option among many: short, assertive headlines, one confident claim per section.

The creator application is the deliberate exception, playful and Hinglish throughout, because that is the register that gets a real creator to finish an application instead of bouncing.

Admin rejection copy is the hard boundary on that voice. Always plain and respectful, never a roast.

Every meme slot in the narrative flow (`components/shared/MemeSlot.tsx`, driven by `content/memes.ts`) ships with `src` empty, so each slot falls back to its typographic caption. That is a deliberate placeholder pending licensed assets.

### Non negotiable UI rules

- No emojis anywhere, in any component or copy. Icons come from `lucide-react`.
- No em dashes in any copy.
- No dashed or dotted borders.
- No pill or oval selectors with outline borders.
- Every colour, size, spacing and duration comes from `styles/tokens.css` and `styles/typography.css`. No raw hex, no raw px in a component.
- Languages render in their own script, not in English. Devanagari, Tamil, Telugu, Bengali, Gujarati, Malayalam, Gurmukhi, Kannada and Arabic glyphs need Noto Sans subsets loaded, since Hanken Grotesk does not carry them. Urdu is right to left.

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

Adding a dependency requires an entry in `DECISIONS.md` and agreement from both developers.

## 8. Open Decisions

Things that need an answer, not things that need building.

- **Portfolio video.** Phase 1 collects Instagram links only, or creators upload real video files. Upload means a hosting and transcode provider (Cloudflare Stream or Bunny Stream) and a preview clip strategy for grid hover. This changes the backend, so it is decided before Task 5, not during it.
- **Who approves creators** while the full admin panel does not exist. The minimal queue in this repo, or directly in the Supabase dashboard until Nupur ships hers. A creator can apply on day one, so this needs an answer at launch.
- **Home page one liner**, exact wording.
- **Entrance text**, exact wording and casing. Currently written as `welcome to blackcoffee.ugc`.
- **Email capture on the coming soon page**, or genuinely nothing but one line.
- **Existing roster onboarding.** How BCM's current creators get imported and invited to claim a profile, and who chases them for their details.
- **Payout model.** Rate bands set by BCM versus creators quoting freely, payment split on casting versus on delivery, and TDS and GST handling. Needs BCM's CA before it is finalised. Phase 2, but the fields are captured from day one.

## 9. Ownership

| Area | Owner |
|---|---|
| Public surface, home, become a creator, creator portal | Dhruv |
| Admin, Supabase schema, `lib/data/*` | Nupur |
| `styles/tokens.css`, `styles/typography.css`, `components/shared/*`, `lib/types.ts`, `lib/routes.ts` | Shared. Message the other person before editing. |

Work happens on branches, never on `main`. One pull request per task.