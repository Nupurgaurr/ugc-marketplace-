# Page Content & Feature Map

Every page in the app, what is written on it, and what works on it. Companion to [SITEMAP.md](./SITEMAP.md) (structure), [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) (tokens and components) and [DECISIONS.md](./DECISIONS.md) (why).

Each entry: **Route**, key source files, **Content** (copy as written), **Features** (what is interactive).

---

## Home

### `/` , Home
Files: `app/page.tsx`, `components/home/HomePage.tsx`, `components/home/*`

**Content**
- Entrance overlay, once per session: "welcome to blackcoffee.ugc"
- Header: logo left, hamburger right. Menu holds Become a creator and Admin login
- Body: one centred line, "Something good is brewing."
- Footer: tagline "We reject most people who apply. That's the point."; columns Creators (Become a partner / Log in) and Contact (brew@blackcoffee.media, Mumbai · Vadodara)

**Features**
- GSAP entrance: the three words stagger up out of a clipped mask, hold, then the black screen lifts
- Runs once per browser session. `sessionStorage` is read during the first render, so a repeat visit or a client-side navigation back to home never mounts the overlay and never flashes black
- Skipped entirely under `prefers-reduced-motion`
- The one line reveals once the entrance completes
- Sticky header that darkens and blurs on scroll; Escape closes the menu

No email capture. Creators already have a route in through the menu.

---

## Become a creator

### `/become-a-creator` , Pre-application narrative
Files: `app/become-a-creator/page.tsx`, `components/roast/RoastStage.tsx`, `components/roast/screens.tsx`

**Content**
A ten-screen scroll narrative, not scroll-jacked, in the same Hinglish register as the application: opens on "Ek minute." / "Form neeche hai. Pehle baat kar lete hain."; roasts the unpaid-collab grind ("Total lifetime earnings: ₹0 and a protein bar."); an interactive three-option quiz ("How many brands replied last month?") with canned replies; the pitch for why the list is small and paid ("Brands aren't short of creators. They're short of creators who deliver on time." / "We reject most people who apply."); closes on "Toh? Ready ho?" with a "Haan" CTA into the application and a "Nahi" button that dodges the cursor before settling into a link home.

**Features**
- "Skip to application" link, always available, top right
- Keyboard navigation between screens (arrows, space, escape)
- Scroll-position progress bar, hidden under `prefers-reduced-motion`
- Lenis smooth scroll, driven off the GSAP ticker so reveals stay in sync with the scroll position. Never starts under reduced motion
- A screen reveals once and stays revealed
- Screen motion: character scramble, clip-path text wipes, a cursor-following spotlight, a cursor-dodging button, a magnetic button
- Quiz options use the same `OptionTile` selector as the application form
- All meme slots show their typographic fallback. No licensed image assets ship yet
- Purely narrative. Nothing here writes to the database

### `/become-a-creator/apply` , Application
Files: `app/become-a-creator/apply/page.tsx`, `components/creator/RegisterWizard.tsx`, `SocialProfilesField.tsx`, `SampleLinksField.tsx`, `MemeBeat.tsx`

**Content**
- Title "Lights, camera, apply."; footer "Already applied? Log in"
- Left column: numbered step list, then the Hinglish beat
- Five steps:
  1. **Naam & thikana** , full card: "Har entry mein thoda drama hona chahiye." Name, city, phone, email
  2. **Genre** , quiet line: "Apna genre, apna swag. No copy-paste allowed." Category (one) and content styles (many)
  3. **Zubaan** , quiet line: "Jitni zubaan, utna reach." Languages (many)
  4. **Setup & speed** , quiet line: "Setup chhota ho ya bada, speed hi hero hai." Shoot setup, turnaround, rate band (one each)
  5. **Dikhao kaam** , full card: "Ab dikhao asli talent. Links bhejo, drama nahi." Social profiles, sample links, then the review summary "Interval ho gaya. Last look before submit."

**Features**
- Two column layout, stacking below 860px where the step list collapses to the current step
- Category and content styles are read from the database, never hardcoded
- Languages render in their own script off `--font-indic`, with `dir="rtl"` on the Urdu label only
- Instagram is mandatory and first, with follower count beside it. "Add another profile" opens a menu of the platforms not yet used; picking one adds its input row and removes it from the menu; every added row can be removed
- A pasted profile URL normalises down to a handle, and each platform validates against its own pattern
- Sample links are optional, up to three, added one at a time
- Validation is react-hook-form in `onTouched` mode against the shared Zod schema: a field goes red when you leave it, then clears live as you fix it. Next only advances if this step's fields pass
- On submit: creates the auth user, signs the creator in, writes the record as `applied`, and redirects to the dashboard

---

## Creator portal

### `/creator/login`
Files: `app/creator/login/page.tsx`, `components/creator/LoginForm.tsx`

**Content**
- "No password. We email you a link that signs you in."
- Footer "Not a partner yet? Apply here"

**Features**
- Sends a Supabase magic link over Resend. Will not create a user, so an address with no application behind it gets "Is email par koi application nahi mili. Pehle apply karo."

### `/creator/dashboard`
Files: `app/creator/dashboard/page.tsx`, `components/shared/PendingStage.tsx`, `components/creator/StatusTracker.tsx`

**Content**
- Applied and in-review: the waiting stage. "Under review." / "A human is actually looking at it. Usually 48 hours." / "Submitted {date}, we'll email you the moment a human decides."
- Rejected: "This application wasn't approved this time. Reach out to the team for details."
- Approved: "Overview" / "Your application status."

**Features**
- A Server Component that branches on status. No sidebar or fake dashboard behind the waiting stage
- Status tracker: Applied, In review, Approved
- The waiting stage's cursor-repelling word escalates through WAITING, STILL WAITING, SERIOUSLY, GO OUTSIDE on idle

### `/creator/profile`
Files: `app/creator/profile/page.tsx`, `components/creator/ProfileEditor.tsx`

**Content**
- "Profile" / "What BCM sees when matching you to work."

**Features**
- Edits bio, availability, category, content styles, languages, social profiles and sample links
- Uses the same selector and the same social control as the application form, not a second implementation
- Anyone not yet approved is redirected to the dashboard

### `/creator/payouts`
Files: `app/creator/payouts/page.tsx`, `components/creator/PayoutDetailsForm.tsx`

**Content**
- "Payout details" / "How BCM pays you."
- "BCM pays creators directly for the work it brings them. These details are needed before your first payout, and nothing is sent until you are approved and a job is complete."
- "Only you can read these. They are never shown on your profile and never shared with a brand."

**Features**
- Bank or UPI toggle. Bank takes account holder name, account number, a confirm field that refuses a paste, and IFSC. UPI takes a UPI ID. PAN is required either way
- Once saved, a summary shows the account ending in four digits, the PAN ending in four, and whether BCM has verified it
- The full numbers never come back to the browser, so replacing details means entering them again in full
- Anyone not yet approved is redirected to the dashboard

---

## Admin

### `/admin/login`
Files: `app/admin/login/page.tsx`, `components/admin/LoginForm.tsx`

**Content**
- Title "Admin"; "Internal use. Only addresses in the admins table can sign in."

**Features**
- Same magic link as creators, redirecting to the approval queue. Admin is membership in the `admins` table, not a password

### `/admin/creators`
Files: `app/admin/creators/page.tsx`, `components/admin/CreatorQueue.tsx`

**Content**
- "Creator approvals" / "Approve and reject every creator on the roster."

**Features**
- Pending / All tabs
- Table: name, category, submitted date, sample link count, status, and actions
- Actions: Start review (`applied` only), Approve, Reject. The database stamps `reviewed_at` and `reviewed_by`
- Expandable row: contact, languages in their own script, content styles, social profiles, sample links
- **Payout details are not readable here.** No admin policy exists on that table
- A non-admin session is redirected home, and would update zero rows even if it were not

---

## Known gaps

- The `admin_notes` table exists with admin-only RLS, but no UI writes to it yet.
- Meme slots in the narrative flow are typographic fallbacks. No licensed assets ship yet.
- No onboarding path for the roughly 100 creators BCM already manages. They should not be asked to fill in the application. Not built, not scheduled.
