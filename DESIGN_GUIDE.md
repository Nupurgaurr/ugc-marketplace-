# Design Guide

The single source of truth for color, type, spacing, motion, and shared components. Every value below is read straight from the code (`styles/tokens.css`, `styles/typography.css`, and `components/shared/*`), not a separate design file to keep in sync by hand. If this doc and the code ever disagree, the code has drifted or this doc has; fix whichever is wrong, don't just pick one.

**The rule for every stakeholder touching this project**: no component hardcodes a hex value, a px spacing number, or a `font-family`. Everything routes through a token. If you are about to type a colour or a font, stop and reach for the variable instead. §7 has the full list of rules that cannot bend.

Companion docs: [PROJECT_REPORT.md](./PROJECT_REPORT.md) (what is built and why, including brand tone), [PAGE_CONTENT_MAP.md](./PAGE_CONTENT_MAP.md) (copy and features per screen), [SITEMAP.md](./SITEMAP.md) (routes), [DECISIONS.md](./DECISIONS.md) (why things are the way they are).

---

## 1. Color

All color lives in `styles/tokens.css` as CSS custom properties on `:root`. Dark, warm-neutral canvas throughout. There is no light theme.

### Canvas & surface

| Token | Value | Use |
|---|---|---|
| `--bcm-black` | `#0b0908` | Page canvas (warm-shifted near-black) |
| `--bcm-grounds` | `#121010` | Raised band, section backgrounds, sidebar, expanded table rows |
| `--bcm-roast` | `#1a1615` | Card / input surface |
| `--bcm-roast-hi` | `#241f1d` | Hover surface (table row hover, chip hover) |

### Text

| Token | Value | Use |
|---|---|---|
| `--bcm-crema` | `#ede6dc` | Primary text |
| `--bcm-ash` | `#978d83` | Secondary text, ledes, labels, meta lines |
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

Four semantic tones, each with a solid color and a low-opacity wash for pill backgrounds. Used wherever something has a lifecycle: creator application status, and payout verification state.

| Tone | Solid | Wash |
|---|---|---|
| Success | `--status-success` `#6fae6b` | `--status-success-wash` `rgba(111, 174, 107, 0.14)` |
| Warning | `--status-warning` `#d9a441` | `--status-warning-wash` `rgba(217, 164, 65, 0.14)` |
| Danger | `--status-danger` `#c5645a` | `--status-danger-wash` `rgba(197, 100, 90, 0.14)` |
| Info | `--status-info` `#6f9bd1` | `--status-info-wash` `rgba(111, 155, 209, 0.14)` |

Never pick a status color by eye. Go through `StatusPill` (§5.3), which already maps every status string in the product to the right tone.

### Lines

| Token | Value | Use |
|---|---|---|
| `--bcm-line` | `rgba(237, 230, 220, 0.11)` | Default hairline, card borders, table dividers, section rules |
| `--bcm-line-strong` | `rgba(237, 230, 220, 0.2)` | Input borders, chip/tag borders, anything that needs to read as interactive |

### Portal accents

`--portal-creator` and `--portal-admin` exist in tokens.css as a hook for differentiating the two logged-in dashboards. Both are set to `--bcm-accent` today. `--portal-client` is gone: brands do not hold accounts.

---

## 2. Typography

Tokens live in `styles/typography.css`, imported once into `app/globals.css`. Every family is loaded through `next/font/google` in `app/layout.tsx` and reaches CSS as a variable, so no component ever names a font directly and there is no render-blocking stylesheet request.

| Token | Stack | Use |
|---|---|---|
| `--font-display` | Bricolage Grotesque | Every heading (`h1`-`h4` are wired to it automatically), stat values, page titles |
| `--font-body` | Hanken Grotesk | Body copy, the default on `<body>` |
| `--font-mono` | JetBrains Mono | Labels, eyebrows, table headers, status pills, anything that should read as data rather than prose |
| `--font-indic` | Hanken Grotesk, then nine Noto Sans subsets | **Required** for any label written in a non-Latin script |

Hanken Grotesk carries no Devanagari, Tamil, Telugu, Bengali, Gujarati, Malayalam, Gurmukhi, Kannada or Arabic glyphs. Without `--font-indic` those labels silently fall back to whatever the OS supplies and the language list renders in nine different typefaces. The Noto subsets are loaded alongside the Latin faces in `app/layout.tsx`.

Urdu is right to left. Set `dir="rtl"` on the label element itself, never on its container, or the surrounding layout flips with it. `OptionTile` does this correctly; copy that pattern.

### Type scale

A fluid `clamp()` scale: every step grows smoothly between a mobile floor and a desktop ceiling instead of jumping at breakpoints.

| Token | Range | Typical use |
|---|---|---|
| `--step--1` | 0.8rem → 0.875rem | Fine print, pill/tag/mono text |
| `--step-0` | 0.95rem → 1.05rem | Body text (the `<body>` default) |
| `--step-1` | 1.1rem → 1.35rem | Sub-headings, modal titles |
| `--step-2` | 1.35rem → 1.9rem | Section titles, dashboard page titles, stat values |
| `--step-3` | 1.9rem → 3rem | `.display`, standard section headline |
| `--step-4` | 2.4rem → 4.6rem | `.display--xl` |
| `--step-5` | 3rem → 6rem | `.display--hero`, home hero only |

### Utility classes (`styles/typography.css`)

- `h1` to `h4`: display font, weight 600, line-height 1.03, tight tracking (-0.022em), `text-wrap: balance` by default. Don't override these per-component; if a heading needs to look different, it's a `.display*` class question, not a heading-level question.
- `.display` / `.display--xl` / `.display--hero`: the three headline sizes above. An `<em>` inside any of them is *not* italic. It is the accent pattern for a two-clause headline, rendered in `--bcm-ash` (e.g. "We built the standard. *Everyone else is catching up.*"). Use `<em>` for that pattern specifically, never for actual emphasis.
- `.lede`: intro paragraph under a headline: `--step-1`, `--bcm-ash`, capped at `46ch` so it never runs the full width of a wide section.
- `.body-dim`: inline secondary text, `--bcm-ash`.
- `.mono`: `--font-mono`, `--step--1`, tabular numerals. Reach for this on anything numeric that needs to not jitter (stat counters, timestamps).

---

## 3. Spacing & Layout

| Token | Value | Use |
|---|---|---|
| `--gutter` | `clamp(1.15rem, 4vw, 3.5rem)` | Horizontal page padding, every `.container` and most shell components use this, never a fixed px |
| `--measure` | `1260px` | Max content width (`.container`) |
| `--section-y` | `clamp(3.5rem, 6vw, 6.5rem)` | Vertical rhythm between sections (`.section`) |

### The spacing scale

Every margin, padding and gap comes off this ladder. If the value you want is not here, the answer is the nearest step, not a new hardcoded number.

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `--space-1` | `0.25rem` | | `--space-5` | `1.5rem` |
| `--space-2` | `0.5rem` | | `--space-6` | `2rem` |
| `--space-3` | `0.75rem` | | `--space-7` | `3rem` |
| `--space-4` | `1rem` | | `--space-8` | `4rem` |

### Layout utility classes (`app/globals.css`)

- `.container`: centers content, applies `--measure` + `--gutter`.
- `.section`: vertical padding via `--section-y`.
- `.section--ruled`: top hairline (`--bcm-line`).
- `.section--band`: raised background (`--bcm-grounds`), for alternating section backgrounds down a long page.
- `.rule`: a standalone horizontal hairline.

### Radius

| Token | Value | Use |
|---|---|---|
| `--radius` | `4px` | Buttons, inputs, nav links, small interactive elements |
| `--radius-lg` | `10px` | Cards, modals, tables, stat cards, anything that reads as a "surface" |
| `--radius-full` | `999px` | Status pills and the two oversized narrative CTAs only |

`--radius-full` is **not** a selector shape. Anything a person picks from is a `--radius` rectangle, see §5.2.

### Breakpoints

There is **no breakpoint token**. Every component picks its own `max-width` in a local `@media` query, which has drifted into a loose, inconsistent set of values across the codebase: `480`, `560`, `640`, `700`, `780`, `860`, `900`, `980`, `1000`, `1280`px all appear at least once. In practice they cluster around four intents:

| Rough breakpoint | Common intent |
|---|---|
| ~480px | Smallest phones, tighten a two-up layout further |
| ~560–640px | Forms/duo-fields stack to one column |
| ~780–860px | Nav collapses, dashboard sidebar goes horizontal |
| ~900–1000px | Multi-column marketing grids drop a column |

Treat that table as the de facto scale until it is formalized as real tokens (see §8). New components should snap to the nearest value in it rather than inventing a fifth number.

---

## 4. Motion

Two eased curves, three durations, defined in `styles/tokens.css` and mirrored in `lib/animation/gsapConfig.ts` for GSAP calls:

| Token | Value | Use |
|---|---|---|
| `--ease` / `EASE` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Default interaction easing (hover states, button transitions) |
| `--ease-out-soft` / `EASE_SOFT` | `cubic-bezier(0.16, 1, 0.3, 1)` | Scroll-reveal easing, softer landing, used by `useReveal`/`useRevealGroup` |
| `--duration-fast` | `0.18s` | Hover/focus micro-transitions |
| `--duration-base` | `0.32s` | Default transitions (media crossfades, etc.) |
| `--duration-slow` | `0.6s` | Reveal animations, progress-bar fills |
| `--reveal-y` | `20px` | The distance **every** reveal travels. Long travel is what makes a page feel like it is assembling itself |

GSAP cannot resolve a CSS variable inside a transform, so `revealDistance()` in `lib/animation/gsapConfig.ts` reads `--reveal-y` and hands GSAP a number. Use it rather than typing a pixel value.

**Every animation must respect `prefers-reduced-motion`.** This is enforced two ways, and any new motion should use one of them rather than rolling its own check:
- `lib/animation/gsapConfig.ts` exports `prefersReducedMotion()`, which GSAP-driven components (`useReveal`, `useRevealGroup`, the narrative screens) branch on to jump straight to the end state.
- `app/globals.css` has a global `@media (prefers-reduced-motion: reduce)` block that clamps all CSS animation/transition durations to near-zero and disables `.reveal`'s hidden-until-JS starting state, as a blanket fallback for anything that doesn't check explicitly.

### Reveal primitives (`lib/animation/useReveal.ts`)

- `useReveal()` fades and lifts a single element the first time it scrolls meaningfully into view. Give the element `className="reveal"` so it is already hidden before GSAP runs, for progressive enhancement.
- `useRevealGroup()` is the same reveal staggered across a container's direct children (default 0.08s stagger).

**Neither takes a distance, duration or easing override, and new reveals should not invent their own.** All of them share four constants from `gsapConfig.ts`:

| Constant | Value | Why |
|---|---|---|
| `revealDistance()` | `--reveal-y`, 20px | One travel distance across the product |
| `REVEAL_DURATION` | `0.6`, matching `--duration-slow` | One speed |
| `REVEAL_THRESHOLD` | `0.25` | One trigger point |
| `REVEAL_ROOT_MARGIN` | `0px 0px -12% 0px` | Ignores the bottom 12% of the viewport, so nothing fires while it is still a sliver past the fold |

Per-element tuning is exactly what made reveals on the same screen land at visibly different speeds. If two things should arrive together, they already will.

### Smooth scrolling (`components/motion/SmoothScroll.tsx`)

Lenis, driven off the GSAP ticker rather than its own rAF loop, so Lenis and ScrollTrigger advance in the same frame. Two loops is what makes reveals land a frame behind the scroll position. Under `prefers-reduced-motion` Lenis never starts and the browser's own scrolling is left alone. Mount it once per page that needs it, not globally.

### Motion component library (`components/motion/*`)

Small, single-purpose effects, most currently only used on the `/become-a-creator` roast narrative and a couple of other high-personality moments. Reach for these instead of writing bespoke GSAP when the effect matches:

| Component | Effect | Currently used in |
|---|---|---|
| `Spotlight` | Cursor-following radial glow (`bright` variant available) | Every roast screen |
| `MaskReveal` | Clip-path wipe-in on scroll, plays once | Roast screens (line/turn/bar beats) |
| `ScrambleText` | Character-scramble-then-settle reveal | Roast cold-open screen |
| `Strikethrough` | Draws a line through children on scroll-into-view | Unused since the home page became a coming soon page |
| `DragRail` | Pointer-drag horizontal scroller with release inertia | Unused since the work rail was removed |
| `MagneticButton` | Pulls the wrapped element toward the cursor within a radius | Roast "Haan" CTA |
| `DodgeButton` | Button that flees the cursor a capped number of times, then settles | Roast "Nahi" CTA |
| `LetterField` | Huge-type word whose letters repel the cursor | Pending/waiting dashboard screen |

These are deliberately reserved for moments that need extra personality: the narrative and the waiting screen. Everyday portal UI stays on `useReveal` and plain CSS transitions. `Strikethrough` and `DragRail` currently have no caller; they are kept because `components/motion/*` is a retained library, not because anything renders them.

---

## 5. Components

Every shared primitive lives in `components/shared/*`. New screens should reach for these before writing a new one-off.

### 5.1 Button (`Button.tsx` / `Button.module.css`)

Renders as `<Link>` when given `href`, otherwise a real `<button>`, with the same visual API either way.

| Prop | Values | Notes |
|---|---|---|
| `variant` | `primary` \| `secondary` \| `ghost` \| `danger` | `primary` = solid accent, black text, the one CTA per view. `secondary` = outlined, fills accent on hover. `ghost` = text-only, brightens on hover. `danger` = outlined in status-danger, washes on hover, for destructive actions only. |
| `size` | `default` \| `small` | |
| `block` | boolean | Full width |
| `arrow` | boolean | Appends a `→` that nudges right on hover. Use for the last or forward action, never on a `danger` or cancel button |

Disabled state: 50% opacity, no press transform. Every button presses down 1px on `:active`.

### 5.2 OptionTile (`OptionTile.tsx` / `OptionTile.module.css`)

**The one selector control in the product.** Every place a person picks from a set uses it: category, content styles, languages, shoot setup, turnaround, rate band, and the quiz on `/become-a-creator`.

A bordered rectangular tile, `--radius` (4px), `--bcm-roast` surface, `--bcm-line-strong` border, with a lucide `Check` that fades in when the tile is on. Selected warms the border to `--bcm-accent` and the fill to `--bcm-accent-wash`. The check's box is reserved in both states, so selecting never changes a tile's width and reflows the grid. Minimum height 44px.

`OptionTileGroup` wraps a set. `multiple` decides everything that differs between single and multi select: the role (`radiogroup` vs `group`, `radio` vs `checkbox`), and whether a click replaces the value or toggles it in an array.

Pass `script: true` for a label in a non-Latin script, which applies `--font-indic`, and `rtl: true` for Urdu, which puts `dir="rtl"` on the label alone.

**Do not build a second selector.** The oval outlined chip this replaced is gone, and so is the `Tag`/`Chip` component that produced it. If a new picker needs a shape this does not have, change this component rather than adding a fourth one.

### 5.3 StatusPill (`StatusPill.tsx` / `StatusPill.module.css`)

The single place every lifecycle status maps to a color. Extend the `STATUS_TONE` map here. Never hand-pick a tone for a new status elsewhere.

| Status | Tone | Status | Tone |
|---|---|---|---|
| `approved` | success | `applied` | neutral |
| `rejected` | danger | `in_review` | warning |

The map still carries tones for statuses from the deleted marketplace model. They are harmless but dead; trim them when the map is next touched.

Labels are auto-derived from the status string (underscores → spaces, capitalized by CSS), with one manual override today: `in_review` → "In review". Add to the `LABEL` map for any future status whose auto-derived label reads wrong.

### 5.4 FormField (`FormField.tsx` / `FormField.module.css`)

Labeled text input with inline error text. It spreads its remaining props onto the `<input>`, so it takes a react-hook-form `register()` result directly. `.duo` in the same module gives a two-column field row that collapses to one column under 560px. Every text, email and tel input in the product should be a `FormField`, not a raw styled `<input>`.

### 5.5 DataTable (`DataTable.module.css`)

The admin queue look: rounded outer border, mono uppercase headers, hairline row dividers, hover highlight on clickable rows (`.row` vs `.rowStatic`), an `.expanded` state for the raised detail row, and a centered `.empty` state. The creator approval queue is its only caller.

### 5.6 DashboardShell (`DashboardShell.tsx` / `DashboardShell.module.css`)

The sidebar and main-content frame behind every logged-in portal screen, wrapped by `CreatorShell` and `AdminShell`. Fixed 248px sidebar on desktop, collapses to a horizontal top bar under 860px. `onLogout` takes a **server action**, rendered inside a `<form action>`, so the shells that wrap it stay Server Components. Sidebar shows the wordmark, a portal label (mono, uppercase), the nav list (`.linkActive` uses the accent wash), and a footer session block. Page content area gets a standard `.pageHead` (title + optional right-aligned action) and `.pageTitle`/`.pageSub` pairing. Reuse that header pattern rather than hand-rolling a new one per page.

### 5.7 AuthPageShell (`AuthPageShell.tsx` / `AuthPageShell.module.css`)

The frame behind every login page and the application: top brand mark, centered title, body, small-print footer link. Deliberately generic; do not add portal-specific styling to it.

### 5.8 SocialProfilesField (`SocialProfilesField.tsx`)

The structured social control, shared by the application and the profile editor. Instagram is mandatory and always the first row, carrying the follower count beside it. **Add another profile** opens a menu of the platforms not yet used; picking one appends its input row and removes it from the menu. Every added row can be removed, Instagram cannot.

Handles normalise before they validate: `lib/social.ts` reduces a pasted profile URL down to a handle, so the same account entered two different ways stores identically. Each platform validates against its own pattern.

One row per profile, stored one row per profile. Nothing here joins handles into a string.

### 5.9 SampleLinksField (`SampleLinksField.tsx`)

Optional, up to three, added one at a time, each its own input. Separate from social profiles: a handle says where someone posts, a sample link is one specific piece of work. Instagram reel links are the expected case.

### 5.10 PayoutDetailsForm (`PayoutDetailsForm.tsx` / `PayoutDetails.module.css`)

The most sensitive surface in the product. Bank or UPI toggle, PAN required either way, and the account number confirmed against a second field that refuses a paste.

**It never receives a full account or PAN number from the server.** `lib/data/creator.ts` masks both to their last four digits before they leave the server, so the summary can only ever render `ending 4321`, and replacing details means entering them in full. Do not add a route that returns these values, and do not log the form's input.

---

## 6. Voice & content patterns

Full detail in `PROJECT_REPORT.md`, summarized here for quick reference while designing a screen:

- **Public copy**: short, assertive, one confident claim per section, no filler. The default register for home.
- **Creator-facing copy at the top of the funnel**: the `/become-a-creator` narrative and the application both run in a Hinglish voice, original lines only, never reproduced film quotes. The application carries a full beat card on its first and last step and a single quiet line on the middle three.
- **Roast lines are never aimed at ability or worth**, are always paired with a live next action, and are never used for a rejected application. A rejected creator gets plain, respectful copy (`StatusTracker`'s rejected state). That boundary is the one rule that cannot bend.
- **Say plainly why sensitive data is collected.** The payout tab explains that BCM pays creators directly and needs the details before a first payout, rather than presenting bare fields.

---

## 7. Non-negotiable rules

These are not preferences. A change that breaks one of these is wrong even if it looks fine.

- **No emojis.** Anywhere, in any component, in any copy. Every icon comes from `lucide-react`.
- **No em dashes** in any copy, comment or page title. Use a comma, a full stop, or a colon.
- **No dashed or dotted borders.**
- **No pill or oval selectors with outline borders.** Selectors are `OptionTile`, see §5.2.
- **No raw hex, px, or font-family in a component.** Every colour, size, spacing and duration comes from `styles/tokens.css` or `styles/typography.css`.
- **Every animation respects `prefers-reduced-motion`**, and motion must have a reason: reveal, feedback, or orientation. Nothing decorative, nothing that blocks interaction, no scroll jacking. Kill every GSAP timeline and ScrollTrigger on unmount.
- **Server Components by default.** `'use client'` only where there is state, an effect, or an event handler.
- **Languages render in their own script**, never transliterated into English. See §2 for the font stack that makes that legible.

---

## 8. Open questions worth deciding on

- **No breakpoint tokens.** See the table in §3: eleven distinct pixel values across the codebase where four intents would cover it. Worth collapsing into `--bp-sm`/`--bp-md`/`--bp-lg` before more components are added.
- **Licensed meme assets are still missing** for the `MemeSlot` system used across the narrative flow. Every slot shows its typographic fallback today.
- **`StatusPill`'s tone map still carries statuses from the deleted marketplace model.** Dead but harmless; trim on next touch.
- **`Strikethrough` and `DragRail` have no caller.** Keep as library, or delete.
