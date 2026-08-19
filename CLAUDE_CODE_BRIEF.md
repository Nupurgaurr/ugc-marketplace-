# Claude Code Brief: Phase 1 Rebuild

Read this whole file before writing any code. Work through the tasks in order. Do not skip ahead. There are two hard STOP points where you must ask me questions and wait for answers.

---

## 0. What changed

The project plan has changed. What exists in this repo was built against a rough, incomplete plan and a lot of it is now wrong.

**Old model:** a three sided marketplace. Creators and brands both hold accounts, brands browse and request creators directly, admin rubber stamps everything.

**New model:** a Black Coffee Media managed UGC network. BCM owns and manages the creator roster. Admin is BCM, and admin is the operator, not an approval button. Brands do not hold accounts and do not interact with creators through the product at all.

The project is now split into two phases. **We are building Phase 1 only.**

### Phase 1 scope

1. Landing page with entrance transition, then a coming soon home page
2. Become a creator narrative page (exists, needs fixing)
3. Creator application form (exists, needs a full rebuild)
4. Creator portal: profile, application status, bank and payout details
5. Creator application goes to BCM for approval. This flow is retained exactly as it is conceptually.
6. Everything runs on a real backend with real data

### Out of scope for Phase 1, delete on sight

Brands, brand accounts, brand login, brand registration, brand dashboard, discover, creator profile pages for brands, shortlists, requests, briefs, pitches, pitch review, reports, and every piece of mock or seeded demo data.

---

## 1. Rules, non negotiable

These apply to every task below and to anything you build after this.

**Code**
- No mock data, no seeded demo records, no localStorage auth, no in memory mutation. Everything is real and persisted. This is production.
- No over engineering. No abstraction until the same thing exists in three places. No config flags for features that do not exist.
- Delete dead code, do not comment it out.
- Server Components by default. `'use client'` only where there is state, an effect, or an event handler.
- All types live in `lib/types.ts` and are generated from the database schema. Do not hand write a type that duplicates a table.
- All routes are constants in `lib/routes.ts`. No hardcoded path strings in JSX.
- Validation is Zod, defined once in `lib/schemas/`, imported by both the form and the route handler.
- No `any`, no `@ts-ignore` without a comment explaining why.

**Design**
- No emojis anywhere, in any component, in any copy. Use `lucide-react` for every icon.
- No em dashes in any copy, anywhere. Use a comma, a full stop, or a colon.
- No dashed or dotted borders anywhere.
- No pill shaped or oval selectors with outline borders. See Task 5.
- Every colour, size, spacing and duration comes from `styles/tokens.css` and `styles/typography.css`. Never type a raw hex or a raw px value into a component.
- Do not redesign or restyle anything you were not asked to change.

**Motion**
- Every animation respects `prefers-reduced-motion`.
- Motion must have a reason: reveal, feedback, or orientation. No decoration only movement.
- Nothing blocks interaction. No scroll jacking.
- Kill every GSAP timeline and ScrollTrigger on unmount.

**Process**
- Work on a branch, never on `main`. Branch name: `feat/phase-1-rebuild`.
- Make targeted edits. Do not rewrite a whole file when a small edit will do.
- Commit after each numbered task below, with a clear message.

---

## 2. Task 1: Purge

Delete, do not archive:

- Every route, component, type and data file for the brand side: `/client/*`, `/discover`, `/discover/[slug]`, and everything under `components/client/`
- Briefs and pitches end to end: routes, components, types, and the admin brief queue
- The requests system end to end: creator inbox, client requests, admin requests table
- Admin reports
- All of `lib/data/` mock data and the mock auth layer
- Any component that only existed to serve the above

Keep:

- Home
- `/become-a-creator` and `/become-a-creator/apply`
- Creator login, creator dashboard, creator profile
- Admin login and the admin creator approval queue only. Do not expand admin beyond approve and reject. Nupur owns admin and will build it out separately.
- `components/shared/*`, `components/motion/*`, `styles/*`, `lib/animation/*`

After deleting, run a typecheck and a build. Fix every break. Then update `SITEMAP.md`, `PAGE_CONTENT_MAP.md` and `PROJECT_REPORT.md` so they describe what actually exists. Commit.

---

## 3. Task 2: Real backend

Set up Supabase. Nothing below this line runs on mock data.

- **Database:** Supabase Postgres
- **Auth:** Supabase Auth, email magic link for creators. No passwords, no reset flow.
- **Authorization:** Row Level Security on every table. A creator can read and write only their own row. This is enforced in the database, not in React.
- **Validation:** Zod, shared between the form and the route handler
- **Forms:** react-hook-form with the Zod resolver
- **Icons:** lucide-react
- **Email:** Resend, wired in as Supabase's SMTP provider
- **API:** Next.js Route Handlers and Server Actions. No separate server.

Do not add any other dependency without asking.

### Tables

`creators`
- id, auth user id, full name, city, phone, email
- category (foreign key), content styles, languages
- shoot setup, turnaround, rate band
- bio, availability
- status: `applied` | `in_review` | `approved` | `rejected`
- created at, reviewed at, reviewed by

`creator_social_profiles`
- id, creator id, platform, handle or url, is primary
- One row per profile so a creator can add as many as they want. See Task 5.

`creator_sample_links`
- id, creator id, url

`creator_payout_details`
- id, creator id, method: `bank` | `upi`
- account holder name, account number, ifsc, upi id
- pan number
- verified flag
- **This table holds financial and identity data. Lock it down with the strictest RLS in the project: readable and writable only by the owning creator, and by service role. Never expose it through any public route. Mask the account number in the UI after save, show last four digits only.**

`categories` and `content_styles`
- Admin editable later, seeded with sensible defaults now so nothing is hardcoded in the frontend. Read these from the database, do not hardcode the option lists in components.

`admin_notes`
- id, creator id, author, note, created at. Private, never visible to the creator.

### The approval flow, retained

Creator submits application, record is created with status `applied`, creator is logged in and lands on the dashboard, dashboard shows a waiting state until BCM approves. Admin moves it to `in_review`, then `approved` or `rejected`. Approved creators get the full dashboard. Rejected creators get a plain, respectful message with no roast language.

Commit.

---

## 4. Task 3: Landing and home

**Entrance transition, home page only.** Not on any other route, and not on client side navigation back to home.

- Full black screen on first load of the session
- The words `welcome to blackcoffee.ugc` reveal in a stagger
- Transition out, home page comes in
- Runs once per browser session, stored in `sessionStorage`
- Skips instantly on repeat visits and under `prefers-reduced-motion`
- GSAP driven

**Home page is a coming soon page.** One line, centred, nothing else in the body. No marketing sections, no work rail, no how it works, no refusals list, no split tiles. Delete all of that.

**Header**
- Logo on the left
- Hamburger on the right, always visible, at every breakpoint, including desktop. It never turns into a horizontal nav.
- Use a clean lucide icon for it, not a hand drawn three line SVG
- Menu opens to two items only: **Become a creator** and **Admin login**

Commit.

---

## 5. Task 4: Fix /become-a-creator

The content and the concept of this page are good. Keep them. The execution has two problems.

**Problem 1: too much empty space.** Sections are spaced by feel rather than by a system, so the page has large uneven gaps. Fix by:
- Adding a spacing scale to `tokens.css` and using it everywhere: `--space-1: 0.25rem` through `--space-8: 4rem` in a sensible ladder
- Reducing `--section-y` from `clamp(4.5rem, 9vw, 8.5rem)` to `clamp(3.5rem, 6vw, 6.5rem)`
- Removing any hardcoded margin or padding on this page in favour of the scale
- Removing empty spacer divs and min height rules that exist only to create room for an animation

**Problem 2: the scroll feels bad because reveals are not in sync.** Fix by:
- Installing Lenis for smooth scrolling and wiring it into the GSAP ticker so ScrollTrigger stays in sync. Disable Lenis entirely under `prefers-reduced-motion`, do not just shorten it.
- Standardising reveal distance. Add `--reveal-y: 20px` and use it for every reveal on the page. Long travel distances are why it feels like the page is assembling itself.
- Triggering all reveals off the same threshold and the same easing. Use `--ease-out-soft` and `--duration-slow` consistently.
- Making sure a reveal fires when the element is meaningfully in view, not when it is one pixel past the fold.

Do not change any copy on this page. Do not change the narrative structure. Do not add or remove screens.

Commit.

---

## 6. Task 5: Rebuild the application form

### STOP. Ask me the questions in Section 9 before writing any code for this task. Wait for my answers.

The current form does not work visually and the input model is wrong. Rebuild it.

**What is wrong today**
- Oval, outlined selector chips. I do not want these.
- Emoji in the meme beat cards.
- Dashed borders.
- Languages listed in English.
- Social handles and sample links crammed into one comma separated text input.

**What it needs to be**

**Language selector.** Every language written in its own script, not in English. Use exactly these:

| Value | Label |
|---|---|
| hindi | हिंदी |
| english | English |
| tamil | தமிழ் |
| telugu | తెలుగు |
| marathi | मराठी |
| bengali | বাংলা |
| gujarati | ગુજરાતી |
| malayalam | മലയാളം |
| punjabi | ਪੰਜਾਬੀ |
| kannada | ಕನ್ನಡ |
| urdu | اردو |
| konkani | कोंकणी |

Note two things. First, `Hanken Grotesk` does not include Devanagari, Tamil, Telugu, Bengali, Gujarati, Malayalam, Gurmukhi, Kannada or Arabic glyphs, so these will fall back to a system font and look inconsistent. Load the matching Noto Sans subsets through `next/font` and add a font stack token for Indic scripts. Second, Urdu is right to left, so set `dir="rtl"` on that label only, not on its container.

**Social profiles, structured, not a text blob.**
- Instagram is mandatory and always present as the first field
- Below it, a control to add another profile. Clicking it opens a dropdown of the remaining platforms: YouTube, TikTok, Facebook, LinkedIn, X, Snapchat, Website
- Selecting one adds a new input row for that platform. A platform already added is removed from the dropdown options.
- Each added row can be removed
- Store one row per profile in `creator_social_profiles`, not a joined string
- Validate the handle format per platform, and normalise a pasted full URL down to a handle

**Sample links, optional.**
- Separate from social profiles
- Up to three, each its own input, added one at a time
- Instagram reel links are fine and expected
- Not required to submit

**Meme beat cards.** Keep the concept and the Hinglish copy. Replace every emoji with a lucide icon. Remove the dashed border. Rework the card so it reads as part of the form, not as a sticker pasted on top of it.

**Everything else about the flow stays.** Five steps, the same fields, the same Hinglish copy, the same review summary before submit, the same submit behaviour, the same routing to the dashboard afterwards.

On submit: write a real record to Supabase with status `applied`, create the auth user, send the magic link through Resend, redirect to the creator dashboard.

Commit.

---

## 7. Task 6: Creator portal

**Remove** everything that came from the brand side. Creators do not receive requests from brands, do not see briefs, and do not send pitches. BCM brings them work. Delete the requests inbox, the briefs tabs, the pitch modal and the my pitches page entirely.

**Keep and make real**
- Application status tracker: Applied, In review, Approved. Rejected shows a plain respectful message with no roast copy.
- Waiting state for anyone not yet approved
- Profile editor: bio, availability, category, content styles, languages, social profiles, sample links. Same structured social profile control as the form.

**Add: Payout details tab.** New sidebar item.
- Toggle between Bank account and UPI
- Bank: account holder name, account number, confirm account number, IFSC
- UPI: UPI ID
- PAN number, required for both
- After save, mask the account number and show only the last four digits
- Show a clear state for whether BCM has verified the details yet
- Copy should explain plainly why this is being collected: BCM pays creators directly, and these details are needed before the first payout
- This data is sensitive. Strict RLS, never returned by any public route, never logged.

Commit.

---

## 8. Task 7: Docs

Update `PROJECT_REPORT.md`, `SITEMAP.md`, `PAGE_CONTENT_MAP.md` and the design guide so they describe exactly what exists after this rebuild. Remove every reference to brands, briefs, pitches, requests and discover. Add a dated entry to `DECISIONS.md` recording the pivot from marketplace to managed network and why.

Docs describe what exists today. No aspirational language, no "will be".

Commit.

---

## 9. Questions to ask me before Task 5

Ask these together, wait for my answers, then build.

**Selector style.** I do not want oval outlined chips. Show me two or three concrete alternatives for a multi select control on a dark canvas, for example a bordered rectangular tile with a check state, a filled block that inverts when selected, or a checkbox list with a hover surface. Describe them, do not build them yet.

**Single select versus multi select.** For category, is it one choice or many? Same question for shoot setup, turnaround, and rate band.

**Step layout.** Should each step stay centred in a narrow column, or move to a two column layout with the meme beat card on one side and the inputs on the other?

**Meme beat cards.** Keep them on every step, or only on the first and last?

**Progress indicator.** Keep the segmented bar, or switch to a numbered step list, or remove it?

**Validation timing.** Show errors on blur, on submit of each step, or live as the user types?

**Field set.** Is anything currently in the form now unnecessary, and is anything missing that BCM needs at application time?

**Portfolio video upload.** Phase 1 collects Instagram links only, or do creators upload actual video files? Video upload means a hosting provider and a transcode pipeline, which is its own piece of work. Confirm before assuming either.

---

## 10. Open items I need a decision on, not blockers

- Who approves creators while admin is unbuilt: the minimal admin queue in this repo, or directly in the Supabase dashboard until Nupur ships hers.
- Whether the coming soon home page needs an email capture, or genuinely nothing but one line.
- Exact wording of the one liner on the home page.
- Exact wording and casing of the entrance text. Currently written as `welcome to blackcoffee.ugc`.
