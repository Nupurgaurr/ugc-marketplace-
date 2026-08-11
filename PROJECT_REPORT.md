# UGC Creator Marketplace — Project Report

## 1. Summary

A closed, private UGC creator marketplace, built and owned by us, with three sides:

- **Home** — the public front door. Confident, brief, video-first.
- **Creator** — apply, build a profile, upload a portfolio, receive requests.
- **Client (brand)** — browse approved creators, watch their work, shortlist and request.
- **Admin** — the operator layer. Vets every creator and client, coordinates matches, moderates.

We sit in the middle as the marketplace operator: nothing goes live without a person approving it. Over time the platform monetizes through commission, subscription, or per-request fees — the way Billo, Trend and Insense monetize their own networks.

This repository is the **frontend build**: every screen described below exists and is clickable, backed by mock data and a mock (localStorage) auth layer so the full product experience can be evaluated before any backend is written. Section 6 covers what backend we recommend and why.

## 2. Market Position

Existing UGC platforms split into direct marketplaces (Billo, Insense, JoinBrands, Collabstr) and curated/campaign networks (Trend, Influee, Cohley). Common gaps across the category:

- Monthly minimums or subscriptions before a brand can even browse.
- Profile-first browsing instead of video-first — you have to click into everything to judge fit.
- No regional-language-first product for the Indian market.
- No lane for a human-vetted, high-touch relationship alongside self-serve.

This product is built directly against those four gaps: zero minimum to browse, video-first hover-to-preview grid, a human admin queue behind every creator and client, and Hindi/Tamil/Bengali/etc. as first-class filters, not an afterthought.

## 3. How It Works

1. **Creator applies** — public "Become a creator" flow, no invite required.
2. **Admin reviews** — quality and fit checked before the creator is visible to anyone.
3. **Creator profile goes live** — portfolio, niche, languages, availability.
4. **Client registers** — self-serve, any brand. Browsing itself never requires an account.
5. **Client browses or posts a brief** — video-first grid with filters, or describe a need for admin to match.
6. **Admin coordinates the match** — creator delivers, client approves, admin oversees quality throughout.

## 4. What's Built

### Creator side
Public multistep application → admin review → live profile with portfolio, bio, availability. Dashboard with an application status tracker (Applied → In review → Approved → Live), a profile/portfolio editor, and an incoming request inbox (accept/decline).

### Client side
Public, no-account video-first discovery grid with filters (category, content style, language, location, rate) and free-text search. Shortlisting and requesting a creator are the two actions gated behind a free account — everything else stays open. Multistep brand registration, dashboard, shortlist, request tracking, and a "post a brief" path for clients who'd rather describe a need than browse.

### Admin side
Reachable only at `/admin/login` — never linked from any nav, footer, or other portal. Creator approval queue and client approval/moderation queue, both with an expandable row (full application + private internal notes), an all-creators/all-clients view, a request/match tracking table, and a lightweight reports page.

### Home
A single confident landing page — not a wall of marketing copy. Full-black entrance animation ("Welcome to blackcoffee. UGC", staggered in from the left, dezerv-style) on first load per session, then a staggered hero reveal. Three short sections (how it works, the work itself, why us) and one closing dual-CTA. GSAP drives every reveal, scroll-triggered via IntersectionObserver, and respects `prefers-reduced-motion`.

## 5. Brand & Tone

The public copy is written to read as the standard, not an option among many — short, assertive headlines, no filler paragraphs, one confident claim per section. The creator application is the deliberate exception: playful, Hinglish, Bollywood-flavored copy at every step (original lines, not reproduced film quotes), because that's the register that gets a real creator to actually finish an application instead of bouncing.

Accent color: `#C4A370` (warm gold), replacing the prototype's amber. Canvas stays dark, warm-neutral, as before. All tokens live in `styles/tokens.css` and `styles/typography.css` — see HANDOVER_GUIDE.md.

## 6. Technical Approach

### Frontend (built)
Next.js 14 (App Router) + TypeScript + CSS Modules + GSAP. No CSS framework — a single disciplined token file drives color and type across every screen. See HANDOVER_GUIDE.md for the full structure.

### Backend (recommended, not yet built)

| Layer | Recommendation | Why |
|---|---|---|
| Auth | Supabase Auth (email/password + OTP) | Fastest to stand up, ships a managed Postgres alongside it, matches the JWT/session model the frontend already assumes |
| Database | Postgres (Supabase-managed) + Prisma | Prisma schema maps directly onto `lib/types.ts` — minimal translation layer |
| API | Next.js Route Handlers (`app/api/*`) at MVP scale | One deployable, one repo, fastest path to a working backend; extract to a standalone Node/Express service later only if scale demands it |
| Video | Mux | Best analytics/DX of the managed options, direct-upload + transcode + CDN in one API, matches the report's Section 6 comparison. Bunny Stream is the fallback if budget is the binding constraint |
| Non-video storage | Supabase Storage or S3 | Avatars, resumes/decks if ever needed |
| Hosting | Vercel | Native Next.js deploys, zero-config |
| Security | Supabase session cookies (JWT), rate limiting on public write endpoints (application submit, login) via Upstash Ratelimit, Zod validation shared between wizard forms and route handlers | Matches the report's "JWT, OAuth, rate limiting, encryption" requirement without hand-rolling auth |

This is a recommendation, not a decision made unilaterally — see HANDOVER_GUIDE.md's "mock vs. real" checklist for exactly what today's frontend assumes the backend will provide.

## 7. Roadmap

Automation ideas kept explicitly out of this phase (per the original research), roughly in the order they earn their cost:

1. Auto status emails on status change (SendGrid + templates).
2. Approval-queue reminders for applications sitting unreviewed.
3. Duplicate creator detection on signup (email/phone/handle match).
4. AI-assisted moderation pre-screening uploads before human review.
5. Basic search relevance ranking (Typesense) once the catalog is large enough to need it.
6. AI content tagging on upload.
7. Auto-recommended creators for a brief, once there's real campaign history to train on.

None of these are needed for the MVP frontend in this repo, and none should be built before the backend they depend on exists.
