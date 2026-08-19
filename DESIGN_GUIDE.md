# Design Guide

The single source of truth for color, type, spacing, motion, and shared components. Every value below is read straight from the code — `styles/tokens.css`, `styles/typography.css`, and `components/shared/*` — not a separate design file to keep in sync by hand. If this doc and the code ever disagree, the code has drifted or this doc has; fix whichever is wrong, don't just pick one.

**The rule for every stakeholder touching this project**: no component hardcodes a hex value, a px spacing number, or a `font-family`. Everything routes through a token. If you're about to type a color or a font, stop and reach for the variable instead — see `styles/tokens.css`'s own header comment, which says exactly this.

Companion docs: [PROJECT_REPORT.md](./PROJECT_REPORT.md) (what's built and why, including brand tone), [PAGE_CONTENT_MAP.md](./PAGE_CONTENT_MAP.md) (copy + features per screen), [SITEMAP.md](./SITEMAP.md) (routes), [HANDOVER_GUIDE.md](./HANDOVER_GUIDE.md) (engineering structure).

---

## 1. Color

All color lives in `styles/tokens.css` as CSS custom properties on `:root`. Dark, warm-neutral canvas throughout — there is no light theme.

### Canvas & surface

| Token | Value | Use |
|---|---|---|
| `--bcm-black` | `#0b0908` | Page canvas (warm-shifted near-black) |
| `--bcm-grounds` | `#121010` | Raised band — section backgrounds, sidebar, expanded table rows |
| `--bcm-roast` | `#1a1615` | Card / input surface |
| `--bcm-roast-hi` | `#241f1d` | Hover surface (table row hover, chip hover) |

### Text

| Token | Value | Use |
|---|---|---|
| `--bcm-crema` | `#ede6dc` | Primary text |
| `--bcm-ash` | `#978d83` | Secondary text — ledes, labels, meta lines |
| `--bcm-ash-dim` | `#6b625b` | Tertiary / disabled / placeholder |

### Accent

| Token | Value | Use |
|---|---|---|
| `--bcm-accent` | `#c4a370` (warm gold) | Primary CTA background, links, active states |
| `--bcm-accent-hi` | `#d9bd91` | Accent hover |
| `--bcm-accent-dim` | `#a5854f` | Accent pressed / muted |
| `--bcm-accent-wash` | `rgba(196, 163, 112, 0.12)` | Active chip/pill background, active nav-link background |
| `--bcm-accent-wash-strong` | `rgba(196, 163, 112, 0.22)` | Stronger accent wash where the 12% version doesn't read |

### Status

Four semantic tones, each with a solid color and a low-opacity wash for pill backgrounds. Used everywhere something has a lifecycle — creator/client/brief/request/pitch status.

| Tone | Solid | Wash |
|---|---|---|
| Success | `--status-success` `#6fae6b` | `--status-success-wash` `rgba(111, 174, 107, 0.14)` |
| Warning | `--status-warning` `#d9a441` | `--status-warning-wash` `rgba(217, 164, 65, 0.14)` |
| Danger | `--status-danger` `#c5645a` | `--status-danger-wash` `rgba(197, 100, 90, 0.14)` |
| Info | `--status-info` `#6f9bd1` | `--status-info-wash` `rgba(111, 155, 209, 0.14)` |

Never pick a status color by eye — go through `StatusPill` (§9.3), which already maps every status string in the product to the right tone.

### Lines

| Token | Value | Use |
|---|---|---|
| `--bcm-line` | `rgba(237, 230, 220, 0.11)` | Default hairline — card borders, table dividers, section rules |
| `--bcm-line-strong` | `rgba(237, 230, 220, 0.2)` | Input borders, chip/tag borders — anything that needs to read as interactive |

### Portal accents

`--portal-client`, `--portal-creator`, `--portal-admin` exist in tokens.css as a hook for "subtle differentiation" between the three logged-in dashboards, but today all three are set to the same value as `--bcm-accent`. If a stakeholder wants the portals to feel distinct at a glance, this is the one place to make that change — see §10.

---

## 2. Typography

Tokens live in `styles/typography.css`, imported once into `app/globals.css`. Two families, both loaded as CSS variables — no component ever names a font directly.

| Token | Stack | Use |
|---|---|---|
| `--font-display` | `'Bricolage Grotesque', 'Hanken Grotesk', system-ui, sans-serif` | Every heading (`h1`–`h4` are wired to it automatically), stat values, page titles |
| `--font-body` | `'Hanken Grotesk', system-ui, -apple-system, sans-serif` | Body copy — the default on `<body>` |
| `--font-mono` | `'JetBrains Mono', ui-monospace, 'SF Mono', monospace` | Labels, eyebrows, table headers, status pills, ratings — anything that should read as data/UI chrome rather than prose |

### Type scale

A fluid `clamp()` scale — every step grows smoothly between a mobile floor and a desktop ceiling instead of jumping at breakpoints.

| Token | Range | Typical use |
|---|---|---|
| `--step--1` | 0.8rem → 0.875rem | Fine print, pill/tag/mono text |
| `--step-0` | 0.95rem → 1.05rem | Body text (the `<body>` default) |
| `--step-1` | 1.1rem → 1.35rem | Sub-headings, modal titles |
| `--step-2` | 1.35rem → 1.9rem | Section titles, dashboard page titles, stat values |
| `--step-3` | 1.9rem → 3rem | `.display` — standard section headline |
| `--step-4` | 2.4rem → 4.6rem | `.display--xl` |
| `--step-5` | 3rem → 6rem | `.display--hero` — home hero only |

### Utility classes (`styles/typography.css`)

- `h1`–`h4` — display font, weight 600, line-height 1.03, tight tracking (-0.022em), `text-wrap: balance` by default. Don't override these per-component; if a heading needs to look different, it's a `.display*` class question, not a heading-level question.
- `.display` / `.display--xl` / `.display--hero` — the three headline sizes above. An `<em>` inside any of them is *not* italic — it's the accent pattern for a two-clause headline, rendered in `--bcm-ash` (e.g. "We built the standard. *Everyone else is catching up.*"). Use `<em>` for that pattern specifically, never for actual emphasis.
- `.lede` — intro paragraph under a headline: `--step-1`, `--bcm-ash`, capped at `46ch` so it never runs the full width of a wide section.
- `.body-dim` — inline secondary text, `--bcm-ash`.
- `.mono` — `--font-mono`, `--step--1`, tabular numerals. Reach for this on anything numeric that needs to not jitter (stat counters, timestamps).

---

## 3. Spacing & Layout

| Token | Value | Use |
|---|---|---|
| `--gutter` | `clamp(1.15rem, 4vw, 3.5rem)` | Horizontal page padding — every `.container` and most shell components use this, never a fixed px |
| `--measure` | `1260px` | Max content width (`.container`) |
| `--section-y` | `clamp(4.5rem, 9vw, 8.5rem)` | Vertical rhythm between marketing sections (`.section`) |

Beyond those three, spacing is written as plain `rem` values per component (`0.5rem`, `1rem`, `1.4rem 1.5rem`, etc.) rather than a spacing scale — there is no `--space-1`/`--space-2`-style token ladder today. See §10 if that's worth adding.

### Layout utility classes (`app/globals.css`)

- `.container` — centers content, applies `--measure` + `--gutter`.
- `.section` — vertical padding via `--section-y`.
- `.section--ruled` — top hairline (`--bcm-line`).
- `.section--band` — raised background (`--bcm-grounds`), for alternating section backgrounds down a long page.
- `.rule` — a standalone horizontal hairline.

### Radius

| Token | Value | Use |
|---|---|---|
| `--radius` | `4px` | Buttons, inputs, nav links — small interactive elements |
| `--radius-lg` | `10px` | Cards, modals, tables, stat cards — anything that reads as a "surface" |
| `--radius-full` | `999px` | Pills, tags, chips, progress-bar segments |

### Breakpoints

There is **no breakpoint token** — every component picks its own `max-width` in a local `@media` query, which has drifted into a loose, inconsistent set of values across the codebase: `480`, `560`, `640`, `700`, `780`, `860`, `900`, `980`, `1000`, `1280`px all appear at least once. In practice they cluster around four intents:

| Rough breakpoint | Common intent |
|---|---|
| ~480px | Smallest phones — tighten a two-up layout further |
| ~560–640px | Forms/duo-fields stack to one column |
| ~780–860px | Nav collapses, dashboard sidebar goes horizontal |
| ~900–1000px | Multi-column marketing grids drop a column |

Treat that table as the de facto scale until it's formalized as real tokens (see §10) — new components should snap to the nearest value in it rather than inventing a fifth number.

---

## 4. Motion

Two eased curves, three durations, defined in `styles/tokens.css` and mirrored in `lib/animation/gsapConfig.ts` for GSAP calls:

| Token | Value | Use |
|---|---|---|
| `--ease` / `EASE` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Default interaction easing (hover states, button transitions) |
| `--ease-out-soft` / `EASE_SOFT` | `cubic-bezier(0.16, 1, 0.3, 1)` | Scroll-reveal easing — softer landing, used by `useReveal`/`useRevealGroup` |
| `--duration-fast` | `0.18s` | Hover/focus micro-transitions |
| `--duration-base` | `0.32s` | Default transitions (media crossfades, etc.) |
| `--duration-slow` | `0.6s` | Reveal animations, progress-bar fills |

**Every animation must respect `prefers-reduced-motion`.** This is enforced two ways, and any new motion should use one of them rather than rolling its own check:
- `lib/animation/gsapConfig.ts` exports `prefersReducedMotion()` — GSAP-driven components (`useReveal`, `useRevealGroup`, the roast screens, etc.) branch on it and jump straight to the end state.
- `app/globals.css` has a global `@media (prefers-reduced-motion: reduce)` block that clamps all CSS animation/transition durations to near-zero and disables `.reveal`'s hidden-until-JS starting state, as a blanket fallback for anything that doesn't check explicitly.

### Reveal primitives (`lib/animation/useReveal.ts`)

- `useReveal()` — fades + lifts a single element the first time it scrolls into view (`IntersectionObserver`, threshold 0.15). Give the element `className="reveal"` so it's already hidden before JS/GSAP runs, for progressive enhancement.
- `useRevealGroup()` — same idea, staggered across a container's direct children (default 0.08s stagger). Use for card grids and feature lists.

### Motion component library (`components/motion/*`)

Small, single-purpose effects, most currently only used on the `/become-a-creator` roast narrative and a couple of other high-personality moments. Reach for these instead of writing bespoke GSAP when the effect matches:

| Component | Effect | Currently used in |
|---|---|---|
| `Spotlight` | Cursor-following radial glow (`bright` variant available) | Every roast screen |
| `MaskReveal` | Clip-path wipe-in on scroll, plays once | Roast screens (line/turn/bar beats) |
| `ScrambleText` | Character-scramble-then-settle reveal | Roast cold-open screen |
| `Strikethrough` | Draws a line through children on scroll-into-view | Home page "what we don't do" list |
| `DragRail` | Pointer-drag horizontal scroller with release inertia | Home page creator work rail |
| `MagneticButton` | Pulls the wrapped element toward the cursor within a radius | Roast "Haan" CTA |
| `DodgeButton` | Button that flees the cursor a capped number of times, then settles | Roast "Nahi" CTA |
| `LetterField` | Huge-type word whose letters repel the cursor | Pending/waiting dashboard screen |

These are deliberately reserved for moments that need extra personality (the roast narrative, the waiting screen) — everyday dashboard/portal UI should stay on `useReveal`/plain CSS transitions, not reach for this library by default.

---

## 5. Components

Every shared primitive lives in `components/shared/*`. New screens should reach for these before writing a new one-off — per `HANDOVER_GUIDE.md`'s "adding a new page" checklist.

### 5.1 Button (`Button.tsx` / `Button.module.css`)

Renders as `<Link>` when given `href`, otherwise a real `<button>` — same visual API either way.

| Prop | Values | Notes |
|---|---|---|
| `variant` | `primary` \| `secondary` \| `ghost` \| `danger` | `primary` = solid accent, black text — the one CTA per view. `secondary` = outlined, fills accent on hover. `ghost` = text-only, brightens on hover. `danger` = outlined in status-danger, washes on hover — destructive/reject actions only. |
| `size` | `default` \| `small` | |
| `block` | boolean | Full width |
| `arrow` | boolean | Appends a `→` that nudges right on hover — use for the last/forward action, never on a `danger` or cancel button |

Disabled state: 50% opacity, no press transform. Every button presses down 1px on `:active`.

### 5.2 Tag & Chip (`Tag.tsx` / `Tag.module.css`)

Two exports from one file, both pill-shaped (`--radius-full`), mono font:

- **`Tag`** — display-only pill (content style, language, turnaround band, etc. on a creator card). `on` prop switches it to the accent-outlined "active" look.
- **`Chip`** — the toggleable, clickable version used in every multi-select picker (niche, content styles, languages, budget bands) across both registration wizards and the brief form. `active` prop fills it solid accent with black text; inactive chips are ash-on-outline and brighten on hover. Always render as a `<button type="button" aria-pressed>` — don't reinvent this as a checkbox+label pair.

### 5.3 StatusPill (`StatusPill.tsx` / `StatusPill.module.css`)

The single place every lifecycle status maps to a color. Extend the `STATUS_TONE` map here — never hand-pick a tone for a new status elsewhere.

| Status | Tone | Status | Tone |
|---|---|---|---|
| `approved`, `delivered`, `live`, `selected`, `open` | success | `applied`, `submitted`, `closed` | neutral |
| `accepted`, `shortlisted` | info | `rejected`, `declined`, `flagged`, `passed` | danger |
| `in_review`, `pending`, `requested` | warning | | |

Labels are auto-derived from the status string (underscores → spaces, capitalized by CSS), with one manual override today: `in_review` → "In review". Add to the `LABEL` map for any future status whose auto-derived label reads wrong.

### 5.4 FormField (`FormField.tsx` / `FormField.module.css`)

Labeled text input with inline error text. `.duo` class in the same module gives a two-column field row that collapses to one column under 560px. `.chips` gives a wrapping flex row for a group of `Chip`s. Every text/email/tel input in the product should be a `FormField`, not a raw styled `<input>`.

### 5.5 Modal (`Modal.tsx` / `Modal.module.css`)

Centered overlay, `Escape` to close, click-outside to close, locks body scroll while open. Max width 460px — this is a focused single-purpose dialog (request confirmation, pitch form), not a general-purpose panel. `.actions` gives a stacked button column at the bottom; `.note` gives small print under the actions (e.g. "prototype — not stored").

### 5.6 StatCard (`StatCard.tsx` / `StatCard.module.css`)

`label` (mono, uppercase, ash) / `value` (display font, `--step-2`) / optional `hint` (small, dimmer). Used for every dashboard overview's stat row across all three portals plus the admin reports page — keep new stat tiles on this component rather than a bespoke card.

### 5.7 DataTable (`DataTable.module.css`)

The admin queue/table look: rounded outer border, mono uppercase headers, hairline row dividers, hover highlight on clickable rows (`.row` vs `.rowStatic`), an `.expanded` state for the raised detail row under an expandable row, and a centered `.empty` state. Every admin table (creators, clients, briefs, requests) shares this.

### 5.8 DashboardShell (`DashboardShell.tsx` / `DashboardShell.module.css`)

The sidebar + main-content frame behind every logged-in portal screen (client/creator/admin — see `ClientShell`/`CreatorShell`/`AdminShell`, which wrap this). Fixed 248px sidebar on desktop, collapses to a horizontal top bar under 860px. Sidebar shows the wordmark, a portal label (mono, uppercase), the nav list (`.linkActive` uses the accent wash), and a footer session block. Page content area gets a standard `.pageHead` (title + optional right-aligned action) and `.pageTitle`/`.pageSub` pairing — reuse that header pattern rather than hand-rolling a new one per page.

### 5.9 WizardShell (`WizardShell.tsx` / `WizardShell.module.css`)

Chrome shared by both multistep registration wizards (client and creator): a segmented progress bar (filled segments = done, in-progress segment fills to 100% too — i.e. it reads as "done" the moment you're on it, not partially filled), a mono step counter, a min-height viewport for the step content, and a footer with Back/Next. To add a step to either wizard: add a label, a validation branch, a render branch — the shell itself needs no changes (per HANDOVER_GUIDE.md).

### 5.10 AuthPageShell (`AuthPageShell.tsx` / `AuthPageShell.module.css`)

The centered single-column frame behind every login/register page outside the wizards — top brand mark, centered title, centered body, small-print footer link. Simple and deliberately generic; don't add portal-specific styling to it.

### 5.11 VideoPreviewCard (`VideoPreviewCard.tsx` / `VideoPreviewCard.module.css`)

The core "hover to preview" card: 4:5 poster image that crossfades to an autoplay-muted looping video on hover (`usePreviewPlayback`), a favorite/shortlist toggle (top-right circular button, fills accent when active), name + meta line, and a rating in mono accent color. This card is reused on Home, `/discover`, `/discover/[slug]`'s portfolio grid, `/client/shortlist`, and the "why video-first" comparison demo — any new place that shows a creator's work should reuse this card rather than a new one.

---

## 6. Voice & content patterns

Full detail in `PROJECT_REPORT.md` §5, summarized here for quick reference while designing a screen:

- **Public/brand-facing copy**: short, assertive, one confident claim per section, no filler. This is the default register for Home, `/discover`, and all client-portal copy.
- **Creator-facing copy at the top of the funnel**: the `/become-a-creator` narrative and the application wizard both run in Hinglish/Bollywood-flavored voice (original lines only — never reproduced film quotes). "My pitches" carries a lighter version of that same voice into a passed-pitch roast line.
- **Roast lines are never aimed at ability or worth**, always paired with a live next action (e.g. a link to more open briefs), and are never used for an admin-rejected application — a rejected creator gets plain, respectful copy instead (`StatusTracker`'s rejected state). If you're writing a new roast-style line, that boundary is the one rule that can't bend.
- **Prototype disclosures**: anywhere the UI does something that won't be true once a backend exists (unsaved passwords, in-memory mutations, demo video reuse), say so in small print rather than silently pretending it's real. Existing examples: client register step 3, creator profile editor, admin login footnote.

---

## 7. Open questions worth deciding on

Things a stakeholder should actively decide rather than infer from the code:

- **Portal accents aren't actually differentiated.** `--portal-client`/`--portal-creator`/`--portal-admin` all resolve to the same accent today (see §1). Decide whether the three logged-in portals should read as visually distinct, or whether one shared accent is the intended, simpler outcome — and either implement the differentiation or remove the unused tokens.
- **No spacing scale.** Layout tokens exist for gutter/measure/section rhythm, but component-internal spacing is ad hoc `rem` values chosen per component rather than a `--space-1…n` ladder. Worth formalizing if the component count keeps growing.
- **No breakpoint tokens.** See the table in §3 — eleven distinct pixel values across the codebase where four intents would cover it. Worth collapsing into `--bp-sm`/`--bp-md`/`--bp-lg`-style tokens before more components are added.
- **Licensed meme/reaction assets are still missing** for the `MemeSlot` system used across the roast flow — every slot currently shows its typographic fallback. Tracked in `PROJECT_REPORT.md` §5/§8.
