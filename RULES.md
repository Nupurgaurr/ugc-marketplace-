# Rules

The standing rules for this codebase. They apply to every change, by anyone, including anything an AI agent writes. A change that breaks one of these is wrong even if it works and even if it looks fine.

This file used to be the Phase 1 rebuild brief. The tasks in it shipped; what is left is the part that does not expire. What was built and why is in [PROJECT_REPORT.md](./PROJECT_REPORT.md), and why each choice was made is in [DECISIONS.md](./DECISIONS.md).

---

## What this product is

A Black Coffee Media managed UGC network. BCM owns and manages the creator roster, vets every applicant, and brings creators paid work directly. Admin is BCM, and admin is the operator, not an approval button.

**Brands do not hold accounts and do not interact with creators through this product.** Anything that treats this as a marketplace, public brief boards, creator-to-brand pitching, auto matching, brand self checkout, is out of scope permanently unless PROJECT_REPORT says otherwise.

If a feature only makes sense in a marketplace, it does not belong here. That model was deleted deliberately; see the 2026-08-19 entry in DECISIONS.md.

---

## Code

- **No mock data, no seeded demo records, no localStorage auth, no in-memory mutation.** Everything is real and persisted. This is production.
- **No over engineering.** No abstraction until the same thing exists in three places. No config flags for features that do not exist.
- **Delete dead code, do not comment it out.** If it has no caller, it goes.
- **Server Components by default.** `'use client'` only where there is state, an effect, or an event handler.
- **All types live in `lib/types.ts`**, aliased off `lib/database.types.ts`, which is generated from the schema by `npm run types:db`. Never hand-write a type that duplicates a table.
- **All routes are constants in `lib/routes.ts`.** No hardcoded path strings in JSX.
- **Validation is Zod, defined once in `lib/schemas/`**, imported by both the form and the server action so they cannot drift.
- **No `any`, no `@ts-ignore`** without a comment explaining why.
- **Typecheck and build must pass on every commit.** Not just at the end of a task.

### Authorization

**Row Level Security in Postgres is the security boundary. Not React, not middleware.**

RLS is enabled on every table and no table has a permissive default. A creator's query returns only their own row because the database refuses the rest, which is why server-side reads do not filter by id defensively. Redirects and middleware are convenience, so a signed-out visitor gets a login page instead of an empty screen. Adding a check in React is not a substitute for a policy.

The service role bypasses RLS entirely. It is used in exactly two places, and `lib/supabase/admin.ts` imports `server-only` so reaching for it from a client component is a build error. Keep it that way.

`creator_payout_details` holds financial and identity data and gets the strictest treatment in the project: owning creator and service role only, admins deliberately absent from its policies, numbers masked to their last four digits before they leave the server, never returned by a public route, never logged.

---

## Design

- **No emojis.** Anywhere, in any component, in any copy. Every icon comes from `lucide-react`.
- **No em dashes.** Anywhere: copy, comments, page titles, docs. Use a comma, a full stop, or a colon.
- **No dashed or dotted borders.**
- **No pill or oval selectors with outline borders.** Every pick-from-a-set uses `components/shared/OptionTile.tsx`. Do not build a second selector; if a new picker needs a shape it does not have, change that component.
- **Every colour, size, spacing and duration comes from `styles/tokens.css` or `styles/typography.css`.** Never type a raw hex or a raw px into a component. Spacing comes off the `--space-1` to `--space-8` ladder; if the value you want is not on it, take the nearest step rather than inventing a number.
- **Languages render in their own script**, never transliterated into English, using the `--font-indic` stack. Urdu is right to left, and `dir="rtl"` goes on the label element itself, never on its container.
- **Do not redesign or restyle anything you were not asked to change.**

Full token reference and component contracts: [DESIGN_GUIDE.md](./DESIGN_GUIDE.md).

---

## Motion

- **Every animation respects `prefers-reduced-motion`**, by skipping entirely rather than shortening.
- **Motion must have a reason:** reveal, feedback, or orientation. No decoration-only movement.
- **Nothing blocks interaction. No scroll jacking.**
- **Kill every GSAP timeline and ScrollTrigger on unmount.**
- **Reveals do not get per-element tuning.** One distance (`--reveal-y`), one duration (`--duration-slow`), one easing (`--ease-out-soft`), one threshold, one root margin, all shared from `lib/animation/gsapConfig.ts`. Per-element timing is what makes two things at the same height on screen land at visibly different speeds.
- The expressive motion library in `components/motion/*` is reserved for the narrative and the waiting screen. Everyday portal UI stays on plain reveals and CSS transitions.

---

## Copy

- **Public copy** reads as the standard, not an option among many: short, assertive, one confident claim per section, no filler.
- **The creator funnel is the deliberate exception.** The `/become-a-creator` narrative and the application run in Hinglish, original lines only, never reproduced film quotes.
- **Roast lines are never aimed at ability or worth**, are always paired with a live next action, and are **never** used for a rejected application. A rejected creator gets plain, respectful copy. That boundary is the one rule that cannot bend.
- **Say plainly why sensitive data is collected.** The payout tab explains that BCM pays creators directly and needs the details before a first payout, rather than presenting bare fields.
- **No licensed or copyrighted meme content is committed.** `content/memes.ts` ships every slot empty and falls back to a typographic caption. That is real legal exposure for a commercial product, not a nicety.

---

## Process

- **Work on a branch, never on `main`. One pull request per task.**
- **Make targeted edits.** Do not rewrite a whole file when a small edit will do.
- **Adding a dependency** requires an entry in DECISIONS.md and agreement from both developers.
- **Changing the schema** means: write a migration, run it, `npm run types:db`, then update the Zod schema, then the UI, then the server action. In that order. The schema is the source of truth and everything else is derived.
- **Docs describe what exists today.** No aspirational language, no "will be". If a change makes a doc wrong, fixing the doc is part of the change.

### Ownership

| Area | Owner |
|---|---|
| Public surface, home, become a creator, creator portal | Dhruv |
| Admin, Supabase schema, `lib/data/*` | Nupur |
| `styles/tokens.css`, `styles/typography.css`, `components/shared/*`, `lib/types.ts`, `lib/routes.ts` | Shared. Message the other person before editing. |
