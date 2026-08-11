# Page Content & Feature Map

Every page in the app, what's written on it, and what actually works on it — so you can review content and functionality independently and flag what to change. Companion to [SITEMAP.md](./SITEMAP.md) (structure) and [HANDOVER_GUIDE.md](./HANDOVER_GUIDE.md) (how it's built).

Each entry: **Route** → key source files → **Content** (copy as written) → **Features** (what's interactive).

---

## Home

### `/` — Home
Files: `app/page.tsx`, `components/home/*`

**Content**
- Entrance overlay: "Welcome to" → "blackcoffee." → "UGC"
- Header nav: How it works · Creators · Why us. Actions: Log in (Brand login / Creator login), Find a creator, Become a creator
- Hero — eyebrow "India's UGC marketplace"; headline "We built the standard. *Everyone else is catching up.*"; lede "Vetted creators. Video-first browsing. No monthly minimum to even look."; stat row: 500+ vetted creators / 12 languages / ₹0 monthly minimum
- How it works — eyebrow "How it works"; title "Three steps. No noise."; steps: **Register or post a need** (brands sign up free, creators apply in under two minutes) → **We match or you shortlist** (browse yourself or tell us the brief) → **Approve and collaborate** (we coordinate, creator delivers, you review)
- The work — eyebrow "The work"; title "Hover. Judge for yourself."; grid of up to 8 approved creators; CTA "See all N+ creators"
- Why us — eyebrow "Why us"; title "What the others make you tolerate."; four pillars: **Zero minimum to browse** / **Video-first, always** / **Every creator vetted** / **Regional-language first**
- Get started — eyebrow "Get started"; title "Pick a side. Both take under five minutes."; two cards: *For brands → Find a creator* (browse video-first, no account required) / *For creators → Become a creator* (two-minute application, a person reviews it)
- Footer — brand tagline "The vetted UGC marketplace. We set the bar for who gets on the platform — brands just pick."; columns: Brands (Find a creator / Register a brand / Log in), Creators (Become a partner / Log in), Contact (brew@blackcoffee.media, Mumbai · Vadodara)

**Features**
- Full-black GSAP entrance animation, once per browser session (`sessionStorage`), skips instantly on repeat visits or `prefers-reduced-motion`
- Staggered hero reveal triggered right after the entrance completes
- Scroll-triggered fade/lift reveals on every section (`useReveal` / `useRevealGroup`)
- Hover-to-preview video cards (poster → autoplay muted loop on hover)
- Sticky header that darkens/blurs on scroll; mobile nav sheet
- Header is session-aware — shows a single "Dashboard" button instead of Log in/CTAs once a client or creator is logged in

---

## Client (brand) portal

### `/client/discover` — Browse creators
Files: `app/client/discover/page.tsx`, `components/client/DiscoverView.tsx`

**Content**
- Eyebrow "Browse creators"; H1 "Hover to preview. No account needed to look."
- Public site header/footer (same as home)

**Features**
- Filter panel: category, content style, language, location, rate band (multi-select chips, derived from the actual creator data set, not hardcoded)
- Free-text search (name, category, city, content styles, languages)
- Live result count, "clear filters" with active-filter count
- Video-first grid, hover-to-preview
- Shortlist toggle (star icon) — **if not logged in, opens the auth-gate modal instead of acting**
- "Request" button per card — same auth gate if logged out
- No account required just to browse, per the report

### `/client/register` — Register your brand
Files: `app/client/register/page.tsx`, `components/client/RegisterWizard.tsx`

**Content**
- Eyebrow "For brands"; title "Register your brand"; footer "Already have an account? Log in"
- 4 steps: **Brand basics** (brand name, website, contact name, work email, phone) → **What you need** (category chips, monthly budget band, typical volume) → **Account** (password + confirm, with a note that it's not actually stored) → **Confirm** (summary + submit)

**Features**
- Shared `WizardShell` chrome: progress bar, step counter, GSAP slide/fade between steps, Back/Next footer
- Per-step client-side validation with inline error text
- On submit: creates a mock `pending` client account, logs the session in, redirects to `/client/dashboard`

### `/client/login` — Brand login
Files: `app/client/login/page.tsx`, `components/client/LoginForm.tsx`

**Content**
- Eyebrow "For brands"; title "Welcome back"; footer "New here? Register your brand"
- Hint text pointing at a seeded demo account (`rhea@suvanaskincare.com`)

**Features**
- Email-only mock login (no password check) against the seeded/mock client list
- Inline error if the email isn't found

### `/client/dashboard` 🔒 — Overview
Files: `app/client/dashboard/page.tsx`, `components/client/DashboardOverview.tsx`

**Content**
- "Overview" / "Everything about your brand's activity on the marketplace."

**Features**
- Stat cards: shortlisted creators, active requests, total requests sent
- Quick links: Browse creators, Post a brief, View shortlist
- Recent requests list (up to 5) with status pill

### `/client/shortlist` 🔒 — Shortlist
Files: `app/client/shortlist/page.tsx`, `components/client/ShortlistView.tsx`

**Content**
- "Shortlist" / "Creators you've saved across sessions."
- Empty state: "Nothing shortlisted yet — browse creators and tap the star to save one."

**Features**
- Grid of shortlisted creators (persisted per-client in `localStorage`)
- Remove from shortlist, open request modal per creator

### `/client/requests` 🔒 — Requests
Files: `app/client/requests/page.tsx`, `components/client/RequestsView.tsx`

**Content**
- "Requests" / "Every creator you've requested and where it stands."
- Empty state: "No requests sent yet."

**Features**
- List of every request this client has sent, with campaign, need, sent date, and status pill (requested → accepted → delivered → approved)

### `/client/brief` 🔒 — Post a brief
Files: `app/client/brief/page.tsx`, `components/client/BriefForm.tsx`

**Content**
- "Post a brief" / "Describe what you need — admin suggests matching creators."
- Confirmation: "Brief received. Our team will suggest a shortlist of matching creators — check Requests for updates."

**Features**
- Category chip picker, budget field, free-text description
- Submit → local confirmation state (no request record created yet — see "Gaps" below)

---

## Creator portal

### `/creator/register` — Become a creator
Files: `app/creator/register/page.tsx`, `components/creator/RegisterWizard.tsx`, `components/creator/MemeBeat.tsx`

**Content**
- Eyebrow "For creators"; title "Lights, camera, apply."; footer "Already applied? Log in"
- 5 steps, each with an original Hinglish/Bollywood-flavored "meme beat" card:
  1. **Naam & thikana** — 🎬 "Har entry mein thoda drama hona chahiye." → name, city, phone, email
  2. **Genre** — 🎤 "Apna genre, apna swag — no copy-paste allowed." → category + content styles
  3. **Zubaan** — 🗣️ "Jitni zubaan, utna reach." → languages
  4. **Dikhao kaam** — 🎥 "Ab dikhao asli talent — links bhejo, drama nahi." → handles + sample links
  5. **The End** — 🍿 "Interval ho gaya — ab bas submit dabate hain." → review & submit

**Features**
- Same `WizardShell` mechanics as the client wizard
- Per-step validation
- On submit: creates a mock `applied` creator record, logs the session in, redirects to `/creator/dashboard`
- `MemeBeat` accepts an optional real image/GIF later — no copyrighted content shipped today

### `/creator/login` — Creator login
Files: `app/creator/login/page.tsx`, `components/creator/LoginForm.tsx`

**Content**
- Eyebrow "For creators"; title "Welcome back"; footer "Not a partner yet? Apply here"
- Hint text pointing at a seeded demo account (`aisha.rahman@example.com`)

**Features**
- Email-only mock login against the seeded/mock creator list

### `/creator/dashboard` 🔒 — Overview
Files: `app/creator/dashboard/page.tsx`, `components/creator/DashboardOverview.tsx`, `components/creator/StatusTracker.tsx`

**Content**
- "Overview" / "Your application status and activity."

**Features**
- Status tracker: Applied → In review → Approved → Live (or a rejected state)
- Stat cards: portfolio videos, rating, incoming requests
- Quick links: Edit profile & portfolio, View requests
- Recent requests list (up to 5)

### `/creator/profile` 🔒 — Profile & portfolio
Files: `app/creator/profile/page.tsx`, `components/creator/ProfileEditor.tsx`

**Content**
- "Profile & portfolio" / "What brands see once you're approved."
- Note: "Prototype — new clips reuse a demo preview. Real uploads plug into the video pipeline."

**Features**
- Edit bio and availability, Save (mutates the mock record for the session)
- Portfolio grid: add a clip (title + style, reuses a demo video asset), remove a clip

### `/creator/requests` 🔒 — Requests (inbox)
Files: `app/creator/requests/page.tsx`, `components/creator/RequestInbox.tsx`

**Content**
- "Requests" / "Brands who want to work with you."
- Empty state: "No requests yet — they'll show up here once a brand reaches out."

**Features**
- List of incoming requests with Accept / Decline actions on anything still in `requested` state; status pill once acted on

---

## Admin panel *(URL-only — see SITEMAP.md)*

### `/admin/login`
Files: `app/admin/login/page.tsx`, `components/admin/LoginForm.tsx`

**Content**
- Eyebrow "Internal"; title "Admin"
- Hint: "Internal use only. Dev credentials: admin / blackcoffee2026."

**Features**
- Username + password mock login (hardcoded dev credential, flagged as dev-only in code)

### `/admin/dashboard` 🔒 — Overview
Files: `app/admin/dashboard/page.tsx`, `components/admin/DashboardOverview.tsx`

**Content**
- "Overview" / "Platform health at a glance."

**Features**
- Stat cards: pending creators, pending clients, approved creators, active requests
- "Needs a decision" list — every pending creator and client in one place
- Recent request activity feed

### `/admin/creators` 🔒 — Creator approvals
Files: `app/admin/creators/page.tsx`, `components/admin/CreatorQueue.tsx`

**Content**
- "Creator approvals" / "Approve, reject, and manage every creator on the platform."

**Features**
- Pending / All tabs
- Table: name, category, submitted date, sample-link count, status, Approve/Reject actions
- Expandable row: contact info, languages, content styles, handles, **private internal notes** (add note, never shown to the creator)

### `/admin/clients` 🔒 — Client approvals
Files: `app/admin/clients/page.tsx`, `components/admin/ClientQueue.tsx`

**Content**
- "Client approvals" / "Light moderation for brand safety, spam and fraud."

**Features**
- Pending / All tabs
- Table: brand, category need, submitted date, budget band, status, Approve/Flag actions
- Expandable row: contact, website, typical volume, budget, private internal notes

### `/admin/requests` 🔒 — Requests
Files: `app/admin/requests/page.tsx`, `components/admin/RequestsTable.tsx`

**Content**
- "Requests" / "Which client requested which creator, and the outcome."

**Features**
- Full table of every request on the platform: brand, creator, campaign, need, sent date, status

### `/admin/reports` 🔒 — Reports
Files: `app/admin/reports/page.tsx`, `components/admin/Reports.tsx`

**Content**
- "Reports" / "Platform numbers at a glance."
- Note: "Placeholder reporting — wire real charts once there is real volume to show."

**Features**
- Stat tiles: approved creators, pending creators, approved clients, avg. review time
- Requests-by-status breakdown tiles

---

## Known gaps worth deciding on

Things that work end-to-end vs. things that are visually present but not fully wired — useful to triage while refining:

- **Client "Post a brief"** shows a confirmation but doesn't yet create a request record admin can see (unlike the Discover/Shortlist "Request" flow, which does via `createRequest`).
- **Portfolio edits, bio edits, admin approve/reject, notes, and request status changes** all mutate in-memory mock data — they feel real within a session but reset on a full page reload (no backend yet, documented in HANDOVER_GUIDE.md).
- **Creator public profile page** — there's no `/creator/[slug]` detail page; clients see creators only as cards in the discover grid today. Worth deciding if a full profile view is needed before backend work starts.
- **Reports page** is stat tiles only, no charts — intentionally deferred until there's real volume.
