# Page Content & Feature Map

Every page in the app, what's written on it, and what actually works on it. Companion to [SITEMAP.md](./SITEMAP.md) (structure) and [HANDOVER_GUIDE.md](./HANDOVER_GUIDE.md) (how it's built).

Each entry: **Route** → key source files → **Content** (copy as written) → **Features** (what's interactive).

---

## Home

### `/` — Home
Files: `app/page.tsx`, `components/home/HomePage.tsx`, `components/home/*`

**Content**
- Entrance overlay (once per session): "black coffee." then "no sugar."
- Header: logo left, hamburger right. Menu holds Become a creator and Admin login
- Hero headline "Pick creators from their work. *Not their bio.*"; link "Become a creator →"
- Footer: tagline "We reject most people who apply. That's the point."; columns Creators (Become a partner / Log in) and Contact (brew@blackcoffee.media, Mumbai · Vadodara)

**Features**
- Full-black GSAP entrance animation, once per browser session (`sessionStorage`), skips instantly on repeat visits or `prefers-reduced-motion`
- Staggered hero reveal triggered right after the entrance completes
- Sticky header that darkens and blurs on scroll
- Header is session-aware: shows a single "Dashboard" button once a creator is logged in

The entrance text and the coming soon one-liner are still to be finalised. Task 3 replaces the hero.

---

## Become a creator

### `/become-a-creator` — Pre-application narrative
Files: `app/become-a-creator/page.tsx`, `components/roast/RoastStage.tsx`, `components/roast/screens.tsx`

**Content**
A ten-screen scroll narrative (not scroll-jacked, plain stacked sections with a reveal-on-scroll trigger), told in the same Hinglish register as the application: opens on "Ek minute." / "Form neeche hai. Pehle baat kar lete hain."; roasts the unpaid-collab grind ("Total lifetime earnings: ₹0 and a protein bar."); an interactive three-option quiz ("How many brands replied last month?") with canned replies; the pitch for why the list is small and paid ("Brands aren't short of creators. They're short of creators who deliver on time." / "We reject most people who apply."); closes on "Toh? Ready ho?" with a "Haan" CTA into the application and a "Nahi" button that dodges the cursor before settling into a link back home.

**Features**
- "Skip to application →" link, always available, top-right
- Keyboard navigation between screens (arrows, space, escape)
- Scroll-position progress bar (hidden under `prefers-reduced-motion`)
- Screen-specific motion: character-scramble text, clip-path text wipes, a cursor-following spotlight (brighter on two screens), a cursor-dodging button, a magnetic-pull button
- All meme slots on this page show their typographic fallback caption. No licensed image assets ship yet
- Purely narrative and local state. Nothing here writes to any data store

### `/become-a-creator/apply` — Application wizard
Files: `app/become-a-creator/apply/page.tsx`, `components/creator/RegisterWizard.tsx`, `components/creator/MemeBeat.tsx`

**Content**
- Title "Lights, camera, apply."; footer "Already applied? Log in"
- 5 steps, each with a Hinglish meme beat card:
  1. **Naam & thikana** — name, city, phone, email
  2. **Genre** — category and content styles
  3. **Zubaan** — languages
  4. **Setup & speed** — shoot setup, turnaround, rate band
  5. **Dikhao kaam** — handles and sample links, then a review summary: "Interval ho gaya. Last look before submit."

**Features**
- Shared `WizardShell` chrome: progress bar, step counter, GSAP slide/fade between steps, Back/Next footer
- Per-step validation with Hinglish inline error text
- On final submit: creates an `applied` creator record, signs the session in, redirects to `/creator/dashboard`

Task 5 rebuilds this form: structured social profiles, separate sample links, native-script language labels, lucide icons in place of emoji, and a new selector style.

---

## Creator portal

### `/creator/login` — Creator login
Files: `app/creator/login/page.tsx`, `components/creator/LoginForm.tsx`

**Content**
- Footer "Not a partner yet? Apply here"

**Features**
- Email lookup against the creator store. Replaced by a Supabase magic link in Task 2

### `/creator/dashboard` — Overview
Files: `app/creator/dashboard/page.tsx`, `components/creator/DashboardGate.tsx`, `DashboardOverview.tsx`, `StatusTracker.tsx`

**Content**
- Applied and in-review creators see a waiting screen instead of the dashboard (shared `PendingStage`)
- Rejected creators see a plain status message: "This application wasn't approved this time. Reach out to the team for details."
- Once approved: "Overview" / "Your application status and activity."

**Features**
- `DashboardGate` swaps in `PendingStage` while status is `applied` or `in_review`
- Status tracker: Applied, In review, Approved
- Link through to the profile editor

### `/creator/profile` — Profile
Files: `app/creator/profile/page.tsx`, `components/creator/ProfileEditor.tsx`

**Content**
- "Profile" / "What BCM sees when matching you to work."

**Features**
- Edit bio and availability, Save

Task 6 adds category, content styles, languages, structured social profiles, sample links, and a payout details tab.

---

## Admin panel *(URL-only)*

### `/admin/login`
Files: `app/admin/login/page.tsx`, `components/admin/LoginForm.tsx`

**Content**
- Title "Admin"; hint: "Internal use only. Dev credentials: admin / blackcoffee2026."

**Features**
- Username and password login against a hardcoded dev credential. Replaced in Task 2

### `/admin/creators` — Creator approvals
Files: `app/admin/creators/page.tsx`, `components/admin/CreatorQueue.tsx`

**Content**
- "Creator approvals" / "Approve, reject, and manage every creator on the platform."

**Features**
- Pending / All tabs
- Table: name, category, submitted date, sample-link count, status, Approve and Reject actions
- Expandable row: contact info, languages, content styles, handles

Private internal notes are dropped until the `admin_notes` table lands in Task 2. Admin is not expanded past approve and reject in this repo.

---

## Known gaps

- The creator and admin portals still run on an in-memory store and a localStorage session. Both go away in Task 2.
- No records are seeded. A creator only exists once someone submits the application form in that browser session, and the store resets on reload.
- Meme slots in the narrative flow are typographic fallbacks. No licensed assets ship yet.
