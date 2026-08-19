# Black Coffee Media UGC Network — Project Report

## 1. Summary

A managed UGC creator network owned and operated by Black Coffee Media. BCM holds the creator roster, vets every applicant, and brings creators paid work directly. There are three surfaces:

- **Home** — the public front door. Currently a coming soon page.
- **Creator** — apply, track application status, keep a profile and payout details current.
- **Admin** — BCM. The operator. Approves and rejects creator applications.

Brands do not hold accounts and do not interact with creators through this product. Work reaches creators through BCM, not through a marketplace transaction in the app.

This is Phase 1. It is a real product on a real backend, not a prototype.

## 2. How It Works

1. **Creator applies** through `/become-a-creator` (narrative) into `/become-a-creator/apply` (the five-step application).
2. **The record is created** with status `applied`. The creator is signed in and lands on the dashboard.
3. **Dashboard shows a waiting state** until BCM reviews.
4. **BCM moves the application** to `in_review`, then `approved` or `rejected`. Approved creators get the full dashboard. Rejected creators get a plain, respectful message.
5. **Approved creators add payout details** so BCM can pay them directly for work it brings them.

## 3. What's Built

### Home
Full-black entrance transition on first load of a browser session, then a coming soon page. GSAP drives the entrance; it skips instantly on repeat visits and under `prefers-reduced-motion`. The header carries a logo and a hamburger at every breakpoint, opening to two items: Become a creator, Admin login.

### Creator side
A scroll-narrative at `/become-a-creator` making the case for why a vetted roster beats cold DMs, handing off to the five-step Hinglish application at `/become-a-creator/apply`. After submit: an application status tracker, a waiting state until approval, a profile editor, and payout details.

### Admin side
Reachable at `/admin/login`. A creator approval queue with an expandable row and a pending/all toggle. Approve and reject, nothing else. Admin is owned by Nupur and built out separately.

### Motion system
A small shared motion library (`components/motion/*`) backing the expressive surfaces: a cursor-repelling word for the waiting screen, a cursor-fleeing button and a magnetic button for the application's closing ask, a clip-path text wipe and character-scramble reveal for the narrative screens, and a cursor-following spotlight.

## 4. Brand & Tone

Public copy reads as the standard, not an option among many: short, assertive headlines, one confident claim per section. The creator application is the deliberate exception, playful and Hinglish throughout, because that is the register that gets a real creator to finish an application instead of bouncing. Admin rejection copy is the hard boundary on that voice: always plain and respectful, never a roast.

Every meme slot in the narrative flow (`components/shared/MemeSlot.tsx`, driven by `content/memes.ts`) ships with `src` empty, so each slot falls back to its typographic caption. That is a deliberate placeholder pending licensed assets.

Accent color: `#C4A370` (warm gold) on a dark, warm-neutral canvas. All tokens live in `styles/tokens.css` and `styles/typography.css`. No component hardcodes a hex or a px value.

## 5. Technical Approach

Next.js 14 (App Router), TypeScript, CSS Modules, GSAP. No CSS framework: a single token file drives color, type, spacing and motion across every screen.

| Layer | Choice |
|---|---|
| Database | Supabase Postgres |
| Auth | Supabase Auth, email magic link. No passwords |
| Authorization | Row Level Security on every table, enforced in the database |
| Validation | Zod, shared between form and route handler |
| Forms | react-hook-form with the Zod resolver |
| Icons | lucide-react |
| Email | Resend, wired in as Supabase's SMTP provider |
| API | Next.js Route Handlers and Server Actions. No separate server |
| Hosting | Vercel |

## 6. Current State

Task 1 (purge) is complete. The brand side, briefs, pitches, requests, discover, admin reports and all mock data are deleted. Nine routes remain.

The creator and admin portals still run on a temporary in-memory store (`lib/data/creators.ts`) and a localStorage session (`lib/auth/mockAuth.ts`). Both files are deleted in Task 2 when Supabase replaces them. No demo records are seeded: a creator only exists once someone submits the application form.
