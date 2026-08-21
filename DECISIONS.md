# Decisions

Every decision on this project, open and closed. Closed ones are dated and **append only**: correct them with a new entry, never by editing an old one, or the record stops being worth keeping.

What the product is and what state it is in: [PROJECT_REPORT.md](./PROJECT_REPORT.md). What constrains future work: [RULES.md](./RULES.md).

---

## Open

Things that need an answer, not things that need building.

- **Who approves creators** while the full admin panel does not exist. The minimal queue in this repo works and is wired to real data, so the only question is whether Nupur's panel replaces it before launch. A creator can apply on day one, so someone needs a row in `admins` either way.
- **Existing roster onboarding.** How BCM's roughly 100 current creators get imported and invited to claim a profile, and who chases them for their details. Nothing is built for this, and they must not be asked to fill in the application.
- **Payout model.** Rate bands set by BCM versus creators quoting freely, payment split on casting versus on delivery, and TDS and GST handling. Needs BCM's CA before it is finalised. Phase 2, but the fields are captured from day one.
- **Verifying payout details.** The `verified` flag exists and only the service role can set it. Nothing in the product sets it, so BCM flips it in the Supabase dashboard today. Decide whether that is good enough or whether it needs a surface.
- **Portfolio video, revisited.** Phase 1 is links only and that is settled. If uploads are wanted later it means a hosting and transcode provider and a preview clip strategy, and it is its own piece of work rather than an addition to the form.
- **Ownership of what shipped.** `PROJECT_REPORT` assigned Admin, the Supabase schema and `lib/data/*` to Nupur. The Phase 1 rebuild built all three. She should review `feat/phase-1-rebuild` before it merges, and the six dependencies below still need her agreement per RULES.md.

---

## Closed

### 2026-08-19: Marketplace to managed network

**The product is no longer a three sided marketplace. It is a Black Coffee Media managed UGC network.**

The old model had creators and brands both holding accounts, brands browsing and requesting creators directly, and admin acting as a rubber stamp between them. The new model is that BCM owns and manages the creator roster, and admin is BCM operating it rather than approving someone else's transaction.

**Brands do not hold accounts and do not interact with creators through the product at all.** Work reaches a creator because BCM brings it to them, not because a brand found them in a grid.

#### Why

The marketplace model was written against a rough, incomplete plan. Three things were wrong with it:

- It assumed brand self-serve demand that does not exist yet. BCM's business today is managed service: it already runs roughly 100 creators and sells to brands directly. A brand-facing product served nobody who was actually going to use it.
- It put the hardest problems first. Discovery, briefs, pitching and matching are all Phase 2 problems that only matter once there is a roster online and a brand willing to self-serve. Neither is true yet.
- It made admin a rubber stamp on a transaction rather than the operator of a roster, which is the opposite of how BCM actually works.

#### What this cost

Task 1 deleted roughly 5,500 lines: `/client/*`, `/discover`, briefs end to end, pitches end to end, the requests system, admin reports, the admin overview, the client and brief approval queues, and every mock and seeded record behind them. The home page lost its work rail, how-it-works sequence, refusals list and split tiles, all of which existed to sell the marketplace to a brand.

That is the right trade. None of it was load bearing for the thing being built, and leaving it in place would have meant maintaining two models at once.

#### What is still true from the old model

The creator approval flow, unchanged in concept: a creator applies, the record is created as `applied`, they are signed in and land on a dashboard showing a waiting state, and BCM moves them to `in_review` then `approved` or `rejected`. That was always the good part.

The design system, the motion library, and the Hinglish voice on the creator funnel also carry over untouched.

---

### 2026-08-19: Supabase, and authorization in the database

Postgres, Auth, and RLS from one provider, with Next.js Route Handlers and Server Actions rather than a separate server.

**Row Level Security on every table is the actual security boundary, not React and not middleware.** A creator reaches only their own row because the database refuses to return anyone else's, so the server-side reads in `lib/data/creator.ts` do not filter defensively. The middleware redirect is a convenience, not a guard.

Two consequences worth knowing:

- Admin is membership in an `admins` table, checked by a `SECURITY DEFINER` function the policies call. It is not a role claim, and not the hardcoded `admin` / `blackcoffee2026` credential that used to sit in the source.
- The service role key bypasses RLS entirely, so it is used in exactly two places: minting the auth user during application submit, which cannot happen under a session that does not exist yet, and BCM verifying payout details. `lib/supabase/admin.ts` imports `server-only` so using it from a client component is a build error.

### 2026-08-19: Payout details are the strictest table in the project

`creator_payout_details` holds account numbers, IFSC, UPI IDs and PAN. It gets treatment nothing else does:

- Readable and writable by the owning creator and the service role. **Admins are deliberately absent from its policies**, so no admin surface can read an account number.
- A trigger blocks a creator marking their own details verified.
- The account and PAN numbers are masked to their last four digits in `lib/data/creator.ts` before they leave the server. The full values are never sent to the browser, which is why replacing them means entering them in full rather than editing a prefilled field.
- Nothing logs the form's input.

### 2026-08-19: Magic link, no passwords

Supabase Auth email magic link for both creators and admins, delivered over Resend as Supabase's SMTP provider. No passwords, so no password reset flow, no password storage, and no credential to leak.

The returning-creator login passes `shouldCreateUser: false`. Without it anyone could mint an auth user with no application behind it.

Application submit is the one place this bends: it mints the auth user with the service role, then burns a one-time token immediately to establish the session, so a creator lands on their dashboard without going to their inbox first. They still get a link for next time.

### 2026-08-19: Dependencies added

All pre-approved in the rebuild brief.

| Package | For |
|---|---|
| `@supabase/supabase-js`, `@supabase/ssr` | Database, auth, and the cookie-based session across Server Components |
| `zod` | Validation, defined once in `lib/schemas/` and imported by both the form and the action |
| `react-hook-form`, `@hookform/resolvers` | Form state, in `onTouched` mode |
| `lucide-react` | Every icon in the product. No emoji anywhere |
| `lenis` | Smooth scroll, wired into the GSAP ticker |
| `server-only` | Makes importing the service role client from a client component a build error |

Resend is **not** an npm dependency. It is configured as Supabase's SMTP provider in the dashboard, so Supabase sends the mail and the app never calls Resend directly.

### 2026-08-19: One selector control

Bordered rectangular tiles with a check state (`components/shared/OptionTile.tsx`), used for every pick-from-a-set in the product: category, content styles, languages, shoot setup, turnaround, rate band, and the quiz on `/become-a-creator`.

This replaced oval outlined chips, which were rejected on sight. The `Tag`/`Chip` component that produced them is deleted rather than left available to reach for.

Single and multi select differ only in ARIA role and in whether a click replaces or toggles. They are the same component because two selector components become three.

### 2026-08-19: Application form shape

Decided with Dhruv before the rebuild:

- **Two column layout.** Numbered step list and the Hinglish beat on the left, inputs on the right. Stacks below 860px, where the step list collapses to the current step so it does not push the inputs below the fold.
- **Cardinality.** Category, shoot setup, turnaround and rate band are single choice. Content styles and languages are multi.
- **Beat cards** keep the voice on every step: a full card on the first and last, a single quiet line on the middle three. Five identical cards wears thin.
- **Validation on blur, then live once touched.** Never scolds mid-typing, never leaves a field red after it is corrected.
- **Follower count** is collected once beside the Instagram handle, and stored on the primary social profile row rather than on `creators`, because reach belongs to an account and a creator with three platforms has three numbers.
- **Rate band stays**, even though BCM sets what a creator is paid. It is useful as an expectation-setting signal at application time.

### 2026-08-19: Portfolio video is links only

Phase 1 collects Instagram and other profile handles, plus up to three optional sample links. **No file uploads.**

Real video upload means a hosting provider, a transcode pipeline, upload progress, storage limits and a moderation surface. That is its own piece of work and gets its own scoping. BCM watches the work where it already lives.

### 2026-08-19: Languages render in their own script

Never transliterated into English. Hanken Grotesk carries no Devanagari, Tamil, Telugu, Bengali, Gujarati, Malayalam, Gurmukhi, Kannada or Arabic glyphs, so the nine matching Noto Sans subsets are loaded through `next/font` behind a `--font-indic` stack token. Without it the language list renders in nine different typefaces.

Urdu is right to left, and `dir="rtl"` goes on the label element itself, never on its container, or the surrounding layout flips with it.

### 2026-08-19: Home is a coming soon page

One centred line, "Something good is brewing.", and nothing else in the body. No email capture: creators already have a route in through the menu, and a capture field would compete with the only action that matters.

The entrance transition reads `welcome to blackcoffee.ugc`, staggering up out of a clipped mask before the black screen lifts. It runs once per browser session, and `sessionStorage` is read during the first render so a repeat visit or a client-side navigation back to home never mounts the overlay and never flashes black. `prefers-reduced-motion` skips it entirely rather than shortening it.

The header is a logo and a hamburger at every breakpoint, including desktop. It never becomes a horizontal nav. The menu holds two destinations: Become a creator, and Admin login.

### 2026-08-21: Admin login moves to email + password, separate from Supabase Auth

**Admins no longer use the magic-link flow described in "Magic link, no passwords" above.** They authenticate with email and password against two hardcoded addresses, checked in the app layer rather than through Supabase Auth. This corrects that entry rather than editing it, per this file's own rule.

Why: admin access needed to be provably restricted to exactly two people, independent of anything reachable through the creator auth surface. Reusing `signInWithOtp` meant one server action and one Postgres auth flow serving both portals, distinguished only by a hidden `portal` form field — easy to get wrong as requirements changed, and not a real boundary on its own.

- The two addresses (`dhruv@blackcoffee.media`, `nupur@blackcoffee.media`) are a hardcoded allowlist in `lib/admin/credentials.ts`, not a database table. Each password exists only as a scrypt hash in an env var (`ADMIN_DHRUV_PASSWORD_HASH`, `ADMIN_NUPUR_PASSWORD_HASH`), generated with `npm run admin:hash-password`. No plaintext password is ever written to disk or committed.
- Session is a signed cookie (`bcm_admin_session`), not a Supabase session: HMAC-SHA256 over `{email, exp}`, keyed by `ADMIN_SESSION_SECRET`, verified with Web Crypto so the same check runs in edge middleware and in Node. 12h expiry, httpOnly, `secure` in production.
- **Admins have no `auth.users` row, so RLS cannot gate them.** `middleware.ts` protects every `/admin/*` path by checking the cookie, and `lib/data/admin.ts` / `app/actions/review.ts` read and write through the service-role client instead of the RLS-bound one. The `admins` table and `is_admin()` RPC from the original schema still exist and are harmless, but nothing on the admin path consults them anymore.
- `addAdminNote` in `app/actions/review.ts` isn't wired into any UI yet, and its `author` column is a `not null` foreign key to `auth.users`. It needs a migration before it can be turned on, since an admin identity no longer lives there.
