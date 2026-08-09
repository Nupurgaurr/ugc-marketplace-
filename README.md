# BCM UGC Marketplace — public prototype

Three public routes for the Blackcoffee Media UGC creator marketplace. Creator
dashboard, admin panel, auth, payments and messaging are deliberately out of scope.

| Route | What it is |
| --- | --- |
| `/` | **Main public landing page** — the front door. Explains the marketplace and routes a visitor into one of two equal pathways. |
| `/find-a-creator` | The client experience: video-first discovery grid, filters, shortlist, post a brief. |
| `/become-a-creator` | The creator side: why join, six-step journey, an approved profile, how brands see you, review, request inbox, application and FAQ. |

Cross-page links live in `lib/routes.js`. They carry a `.html` suffix so the
static export opens from disk; on a deployed app, change that one file to
`/find-a-creator` and switch the anchors to `next/link`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export into ./out
```

`out/index.html` opens directly from disk — asset paths are relative.

## Structure

```
app/
  layout.jsx            fonts + metadata
  page.jsx              server component; awaits getApprovedCreators()
  globals.css           design tokens, type scale, layout primitives
components/
  PublicLanding         main landing shell (route /)
  MarketplaceHero       compact centred hero
  MarketplaceChoice     the two equal doors
    ClientPathway       brand side — mosaic of many creators
    CreatorPathway      creator side — one profile through review
  HowMarketplaceWorks   creator -> BCM -> brand -> BCM
  CreatorPreview        video-first teaser strip
  CuratedNetwork        vetting, kept short
  PathwayColumns        what each side gets
  MarketplaceFinalCTA   both CTAs, equal weight

  CreatorLanding        creator shell (route /become-a-creator)
  CreatorHero           mirrored hero, reuses ReelWall
  CreatorBenefits       why join — no volume/income claims
  CreatorJourney        apply -> approved -> profile -> upload -> discovered -> requests
  CreatorProfilePreview approved profile; portfolio grid takes the space
    PortfolioTile       one upload, same playback hook as CreatorCard
  ClientViewPreview     real CreatorCard in readOnly mode
  CreatorVetting        review pipeline, creator-framed
  RequestInbox          static preview of the future dashboard inbox
  ApplicationForm       the report's public application + confirmation dialog
  CreatorFAQ / CreatorFinalCTA

  ClientExperience      client shell (route /find-a-creator)
  Header                sticky nav, two variants, off-canvas mobile menu
  Hero / ReelWall       drifting poster wall + one live rotating tile
  DiscoveryPreview      composes FilterBar + CreatorGrid + ShortlistTray
  FilterBar             category · content style · language · location · rate
  CreatorGrid           presentational; empty state included
  CreatorCard           hover-to-play (pointer) / in-view play (touch)
  ShortlistTray         session shortlist, both actions hit the account gate
  AuthGateModal         the "account needed to save or request" moment
  WhyVideoFirst         profile-list vs video-grid toggle
  HowItWorks            client lane of the end-to-end flow
  BriefCTA              second pathway — describe a need, BCM matches
  TrustSection          Applied → In review → Approved → Live pipeline
  RegionalSection       language-first positioning
  FinalCTA / CreatorLane / Footer
  ui/                   Button, Eyebrow, Tag, Marquee
  usePreviewPlayback    shared hover-to-play / play-in-view behaviour
  ui/                   Button, Eyebrow, Tag, Marquee, shared modal styles
lib/
  creators.js           mock data shaped like the future API response
  routes.js             the two pathway hrefs, in one place
  filters.js            filter definitions + pure applyFilters()
  api.js                the single seam to swap for a real backend
```

## Wiring this to the stack in the report

| Report layer | Where it plugs in |
| --- | --- |
| Node API + PostgreSQL | `lib/api.js` — replace the mock return with `fetch`. Component props already match the row shape. |
| Mux / Cloudflare Stream / S3 + MediaConvert + CloudFront | `creator.preview.previewUrl` / `posterUrl`. Swap MP4 for an HLS playback URL; `CreatorCard` needs an hls.js attach and nothing else. |
| Supabase Auth | `AuthGateModal`. The in-memory `savedIds` array is written against the new client record on sign-up. |
| Admin approval queue | `getApprovedCreators()` filters on `status === 'approved'`. The public site must never receive any other row. |
| Typesense / search relevance | `lib/filters.js` `applyFilters()` has the signature the server-side query will expose. |

## Prototype data

All twelve creators, their rates, cities and languages are invented for the
demo. The preview clips are procedurally generated abstract footage, not real
portfolio work. No marketplace-scale statistics are claimed anywhere on the
page — the only numbers used are Blackcoffee Media's own, from
blackcoffee.media.
