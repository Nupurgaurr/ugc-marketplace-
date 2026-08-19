# Page Content & Feature Map

Every page in the app, what is written on it, and what works on it. Copy below is quoted from the source, not paraphrased, so this file is reviewable against the product without opening it.

Companion to [SITEMAP.md](./SITEMAP.md) (structure), [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) (tokens and components), [RULES.md](./RULES.md) (what cannot change) and [DECISIONS.md](./DECISIONS.md) (why).

---

## Home

### `/`
`app/page.tsx`, `components/home/HomePage.tsx`, `IntroOverlay.tsx`, `Header.tsx`, `ComingSoon.tsx`, `Footer.tsx`

**Copy**

| Where | Text |
|---|---|
| Entrance overlay | "welcome to blackcoffee.ugc" |
| Body, the only line | "Something good is brewing." |
| Menu | "Become a creator", "Admin login" |
| Footer tagline | "We reject most people who apply. That's the point." |
| Footer, Creators | "Become a partner", "Log in" |
| Footer, Contact | "brew@blackcoffee.media", "Mumbai · Vadodara" |
| Footer, bottom | "© {year} blackcoffee. media", "Built to be the standard, not another option." |

**Features**
- GSAP entrance: the three words stagger up out of a clipped mask, hold, then the black screen lifts.
- Runs once per browser session. `sessionStorage` is read **during the first render**, not in an effect, so a repeat visit or a client-side navigation back to home never mounts the overlay and never flashes black.
- Skipped entirely under `prefers-reduced-motion`.
- The one line reveals after the entrance completes.
- Header: logo left, hamburger right, at every breakpoint including desktop. It never becomes a horizontal nav. Escape closes the menu. The bar darkens and blurs past 12px of scroll.

No email capture, decided. Creators already have a route in through the menu.

---

## Become a creator

### `/become-a-creator`
`app/become-a-creator/page.tsx`, `components/roast/RoastStage.tsx`, `screens.tsx`

Ten stacked screens, in order:

| # | Screen | Copy |
|---|---|---|
| 1 | Cold open | "Ek minute." / "Form neeche hai. Pehle baat kar lete hain." |
| 2 | First cut | "You've shot 200 reels." swaps after 1.7s to "Total lifetime earnings: ₹0 and a protein bar." |
| 3 | The line | "Collab karte hain." / "Translation: free mein karwa lenge." |
| 4 | Meme beat | caption "200 reels. Zero rent paid by 'exposure.'" |
| 5 | Quiz | "How many brands replied last month?" Options: Zero, Ek-do, Bohot saare |
| 6 | The turn | "Here's what nobody tells you." / "Brands aren't short of creators. They're short of creators who deliver on time." |
| 7 | Meme beat | caption "Turnaround time: also a personality trait." |
| 8 | What we are | "So we made a list." then three staggered lines: "Paid briefs from real brands.", "We chase the invoice, not you.", "Fifty-something people on it. Not four lakh." |
| 9 | The bar | "We reject most people who apply." / "A list everyone's on is worth nothing to the brands paying for it." |
| 10 | The ask | "Toh? Ready ho?" with "Haan" and "Nahi" |

Quiz replies: Zero → "Thought so. Not your fault. You're pitching into a void." · Ek-do → "Two. Out of how many DMs?" · Bohot saare → "Achha? Toh yahan kya kar rahe ho?"

**Features**
- "Skip to application" link, fixed top right, always available.
- Keyboard navigation: arrows, space, escape (escape jumps to the application).
- Scroll-position progress bar along the bottom, hidden under `prefers-reduced-motion`.
- Lenis smooth scroll on the GSAP ticker, so reveals stay in sync with the scroll position. Never starts under reduced motion.
- **A screen reveals once and stays revealed.** Visibility used to be tied to a single active index, so screens faded back out as the next arrived.
- Motion per screen: character scramble (1), clip-path wipes (3, 6, 9), a cursor-following spotlight on every screen and brighter on 4 and 7, a magnetic "Haan", a cursor-dodging "Nahi" that settles after a capped number of dodges into "Theek hai. Dobara aana jab tayyar ho."
- Quiz options use the same `OptionTile` treatment as the form.
- Both meme slots render their typographic caption. No licensed image assets ship.
- Nothing here writes to the database.

### `/become-a-creator/apply`
`app/become-a-creator/apply/page.tsx`, `components/creator/RegisterWizard.tsx`, `SocialProfilesField.tsx`, `SampleLinksField.tsx`, `MemeBeat.tsx`

**Copy**
- Title "Lights, camera, apply." Footer "Already applied? Log in"
- Left rail: the five step names, then the beat.

| Step | Name | Beat | Fields |
|---|---|---|---|
| 1 | Naam & thikana | Card: "Har entry mein thoda drama hona chahiye." / "Scene 1: you, but main-character energy." | Full name, city, phone, email |
| 2 | Genre | Line: "Apna genre, apna swag. No copy-paste allowed." | Category (one), content styles (many) |
| 3 | Zubaan | Line: "Jitni zubaan, utna reach." | Languages (many) |
| 4 | Setup & speed | Line: "Setup chhota ho ya bada, speed hi hero hai." | Shoot setup, turnaround, rate band (one each) |
| 5 | Dikhao kaam | Card: "Ab dikhao asli talent. Links bhejo, drama nahi." / "This is the item number of your application." | Social profiles, sample links, review summary |

Review summary opens "Interval ho gaya. Last look before submit." and closes "A real person reviews this, usually within 48 hours. Track your status from the dashboard."

**Features**
- Two column layout: numbered step list and beat left, inputs right. Below 860px it stacks and the step list collapses to the current step, so it does not push the inputs below the fold.
- Category and content styles are read from `categories` and `content_styles`, never hardcoded.
- Languages render in their own script off `--font-indic`, with `dir="rtl"` on the Urdu label only.
- **Social profiles**: Instagram mandatory and first, with follower count beside it. "Add another profile" opens a menu of the platforms not yet used; picking one appends its input row and removes it from the menu; every added row can be removed, Instagram cannot.
- A pasted profile URL normalises down to a handle, so the same account entered two ways stores identically. Each platform validates against its own pattern.
- **Sample links** optional, up to three, added one at a time. Instagram reels are the expected case.
- Validation is react-hook-form in `onTouched` mode against the shared Zod schema: a field goes red when you leave it, then clears live as you fix it. "Aage badho" only advances if this step's fields pass.
- On submit: mints the auth user, signs the creator in, writes the record as `applied`, redirects to the dashboard. If any step fails the auth user is deleted rather than left orphaned.

---

## Creator portal

### `/creator/login`
`app/creator/login/page.tsx`, `components/creator/LoginForm.tsx`

**Copy**: title "Wapas aa gaye." · "No password. We email you a link that signs you in." · footer "Not a partner yet? Apply here" · button "Send me a link", "Bhej rahe hain" while pending.

**Features**
- Sends a Supabase magic link over Resend. Will not create a user, so an address with no application behind it gets "Is email par koi application nahi mili. Pehle apply karo."
- Success: "Link bhej diya. Apna inbox dekho."

### `/creator/dashboard`
`app/creator/dashboard/page.tsx`, `components/shared/PendingStage.tsx`, `components/creator/StatusTracker.tsx`

**Copy**
- Applied and in review, the waiting stage: "Under review." / "A human is actually looking at it. Usually 48 hours." / "Submitted {date}, we'll email you the moment a human decides."
- Rejected: "This application wasn't approved this time. Reach out to the team for details."
- Approved: "Overview" / "Your application status."

**Features**
- A Server Component that branches on status. No sidebar or fake dashboard sits behind the waiting stage.
- Status tracker: Applied, In review, Approved.
- The waiting stage's cursor-repelling word escalates on idle: WAITING, STILL WAITING, SERIOUSLY, GO OUTSIDE.

### `/creator/profile`
`app/creator/profile/page.tsx`, `components/creator/ProfileEditor.tsx`

**Copy**: "Profile" / "What BCM sees when matching you to work."

**Features**
- Edits bio, availability, category, content styles, languages, social profiles, sample links.
- Uses the same `OptionTile` and the same `SocialProfilesField` as the application, not a second implementation.
- Anyone not yet approved is redirected to the dashboard.

### `/creator/payouts`
`app/creator/payouts/page.tsx`, `components/creator/PayoutDetailsForm.tsx`

**Copy**
- "Payout details" / "How BCM pays you."
- "BCM pays creators directly for the work it brings them. These details are needed before your first payout, and nothing is sent until you are approved and a job is complete."
- "Only you can read these. They are never shown on your profile and never shared with a brand."
- Status line reads either "Verified by BCM" or "Waiting on BCM to verify".

**Features**
- Bank or UPI toggle. Bank takes account holder name, account number, a confirm field that **refuses a paste**, and IFSC. UPI takes a UPI ID. PAN required either way.
- Once saved, a summary shows the account ending in four digits, the PAN ending in four, and the verification state.
- **The full numbers never come back to the browser**, so replacing details means entering them in full rather than editing a prefilled field.
- Anyone not yet approved is redirected to the dashboard.

---

## Admin

### `/admin/login`
`app/admin/login/page.tsx`, `components/admin/LoginForm.tsx`

**Copy**: title "Admin" · "Internal use. Only addresses in the admins table can sign in."

**Features**
- Same magic link as creators, redirecting to the approval queue. Admin is membership in the `admins` table, not a password. The old hardcoded `admin` / `blackcoffee2026` credential is gone.

### `/admin/creators`
`app/admin/creators/page.tsx`, `components/admin/CreatorQueue.tsx`

**Copy**: "Creator approvals" / "Approve and reject every creator on the roster." Empty state "Nothing here."

**Features**
- Pending / All tabs.
- Columns: creator, category, submitted, sample link count, status, action.
- Actions: "Start review" (on `applied` only), "Approve", "Reject". The database stamps `reviewed_at` and `reviewed_by`.
- Expandable row: contact, languages in their own script, content styles, social profiles, sample links.
- **Payout details are not readable here.** No admin policy exists on that table.
- A non-admin is redirected home, and would update zero rows even if they were not.

---

## `/auth/callback`

No UI. Exchanges the magic link's one-time token for a session cookie and forwards to the dashboard or the approval queue. A missing or expired token redirects to the creator login with an error flag.

---

## Known gaps

- `admin_notes` exists with admin-only RLS. Nothing writes to it yet.
- Both meme slots are typographic fallbacks. No licensed assets ship.
- No onboarding path for the roughly 100 creators BCM already manages. They should not be asked to fill in the application. Not built, not scheduled.
- `app/admin/login/page.tsx` still lays itself out with inline styles and raw px values, against the rule in RULES.md. It predates the rebuild and was not in scope.
