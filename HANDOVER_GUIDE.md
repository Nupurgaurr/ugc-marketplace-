# Handover Guide

How this codebase is put together, and how to operate/extend each piece. Read PROJECT_REPORT.md first for the *what and why*; this is the *how*.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run build      # production build — also type-checks and lints
```

No environment variables are required — there is no backend yet. Everything is mock data (`lib/data/*`) and a mock localStorage session (`lib/auth/mockAuth.ts`).

## Project structure

```
app/                  routes only — no business logic lives here
  page.tsx             home
  client/…             brand portal routes
  creator/…            creator portal routes
  admin/…              admin routes (never linked publicly)

components/
  home/                landing page sections + entrance animation
  shared/              cross-portal primitives (Button, Modal, DataTable, DashboardShell…)
  client/  creator/  admin/    portal-specific components

lib/
  types.ts             every domain type — the contract the future backend fills
  routes.ts            every URL, in one place
  data/                mock arrays + query helpers (the "one seam" — see below)
  auth/                mock session handling
  animation/            GSAP helpers (useReveal, gsapConfig)

styles/
  tokens.css           color, spacing, radius, motion — change once, applies everywhere
  typography.css       fonts + type scale
```

`app/`, `components/client/`, `components/creator/`, `components/admin/` and `components/home/` are kept strictly separate — nothing home-specific lives in a portal folder and vice versa, per the brief.

## Colors & fonts — change once, apply everywhere

Every color in the product is a CSS variable defined in **`styles/tokens.css`**. To rebrand: change `--bcm-accent` (currently `#C4A370`) and every button, link, focus ring, and status pill updates. Fonts and the type scale (the `--step-*` clamp values) live in **`styles/typography.css`**. No component should ever hardcode a hex value or `font-family` — if you find one, it's a bug.

## The entrance animation

`components/home/IntroOverlay.tsx`. Plays once per browser tab (`sessionStorage.bcm_intro_seen`) — clear that key in devtools to replay it. GSAP timeline: "Welcome to" fades up → "blackcoffee." staggers in letter-by-letter from the left → "UGC" pops in the accent color → the whole overlay fades out, which calls `onComplete()` and triggers the hero's own staggered reveal (`components/home/Hero.tsx`, driven by its `start` prop). To retune timing, edit the `gsap.timeline()` calls in `IntroOverlay.tsx` — durations and stagger are the only numbers that matter. It fully respects `prefers-reduced-motion` (skips straight to the static state).

Scroll-triggered reveals elsewhere on the site use `lib/animation/useReveal.ts` (`useReveal` for a single element, `useRevealGroup` for a staggered list/grid) — attach the returned ref to any element and it fades/lifts in the first time it's scrolled into view.

## Mock auth — and where real auth plugs in

`lib/auth/mockAuth.ts` is a role-scoped (`client` / `creator` / `admin`) localStorage session with **no real password check**. `loginClient`/`loginCreator` just look up the email in the mock data; `loginAdmin` checks a single hardcoded dev credential (`admin` / `blackcoffee2026`, printed on the login screen itself). `registerClient`/`registerCreator` push a new record into the mock arrays and log the user in immediately.

Every call site is written against this same small surface (`getSession`, `logout`, `login*`, `register*`) specifically so that swapping this file for real Supabase Auth calls does not require touching `RequireAuth`, `useAuth`, or any page. That swap is the single highest-priority backend task.

`components/shared/RequireAuth.tsx` wraps every protected dashboard page and redirects to that portal's own login if there's no session.

## The admin URL

`/admin/login` is not linked from any header, footer, or nav in the entire app — it's reachable only by typing it. That satisfies "admin login from URL only" today. Before a real launch, harden it further: move the path itself into an environment variable so it's not a fixed, guessable string in source, add IP allowlisting or a second factor, and replace the hardcoded credential with real server-side admin auth.

## Data — the "one seam" pattern

Every domain object (`Creator`, `ClientAccount`, `MatchRequest`, `AdminNote`) is typed in `lib/types.ts` the way the eventual Postgres tables / API responses should look. `lib/data/*.ts` currently returns mock arrays; when the backend exists, each function in that folder (`getApprovedCreators`, `getRequestsForClient`, etc.) becomes an async `fetch` against the real API with the **same name and return shape**. No component should need to change — only the one function it calls.

A few of these mock functions **mutate the in-memory arrays directly** (`setCreatorStatus`, `createRequest`, `addNote`, etc.) so admin actions and client requests feel real within a session. This resets on a full page reload — that's expected for a mock and goes away the moment real persistence exists.

## Multistep wizards

Both registration flows (`components/client/RegisterWizard.tsx`, `components/creator/RegisterWizard.tsx`) share one chrome component, `components/shared/WizardShell.tsx` — progress bar, step counter, animated step transitions, Back/Next footer. Each wizard owns its own step content and validation as a `switch`-style set of `{step === N && (...)}` blocks with a single form-state object. To add a step: add a label to `STEP_LABELS`, a validation branch, and a render branch — the shell handles the rest.

## Swapping in real meme content

`components/creator/MemeBeat.tsx` renders original Hinglish text by default. Once you have real licensed meme images or GIFs, drop them in `public/media/memes/` and pass `imageSrc` (and `imageAlt`) to the relevant entry in the `MEME_BEATS` array at the top of `components/creator/RegisterWizard.tsx` — no other code changes.

## Mock vs. real — checklist

| Area | Today | Before launch |
|---|---|---|
| Auth | localStorage, no password check | Supabase Auth, real sessions, server-side checks |
| Admin credential | Hardcoded in `mockAuth.ts` | Real admin accounts, server-verified |
| Data | In-memory arrays in `lib/data/*` | Postgres via Prisma, behind the same function names |
| Video | Static demo files in `public/media/creators` | Mux (or Bunny Stream) direct upload + playback |
| Requests/notes | Mutated in memory, reset on reload | Persisted rows, real notifications |
| Admin URL | Unlinked `/admin/login` | Env-configurable path + IP allowlist / 2FA |
| Validation | Client-side only | Shared Zod schemas, enforced server-side too |

## Adding a new page

1. Decide which of the four surfaces it belongs to (`home` / `client` / `creator` / `admin`) and add the route under the matching `app/` folder.
2. Protected pages: wrap the page body in `<RequireAuth role="…" loginHref={ROUTES.…}>` and the matching `*Shell` component (`ClientShell` / `CreatorShell` / `AdminShell`) for nav chrome.
3. Add the route to `lib/routes.ts` rather than hardcoding the path anywhere.
4. Reach for `components/shared/*` before writing a new primitive — `Button`, `FormField`, `Chip`, `Modal`, `DataTable`, `StatCard`, `StatusPill` cover almost everything a new screen needs.
