# blackcoffee. UGC

A managed UGC creator network for Black Coffee Media. Creators apply, BCM vets them, and BCM brings them paid work. Brands do not hold accounts and have no surface in this product.

Next.js 14 (App Router), TypeScript, CSS Modules, GSAP, on Supabase Postgres with Row Level Security.

```bash
npm install
cp .env.example .env.local   # then fill it from the Supabase dashboard
npm run dev
```

The Supabase project has to exist first. Four setup steps in [supabase/README.md](./supabase/README.md).

- **The rules every change has to follow** → [RULES.md](./RULES.md)
- **What this is and what state it is in** → [PROJECT_REPORT.md](./PROJECT_REPORT.md)
- **Every decision, open and closed** → [DECISIONS.md](./DECISIONS.md)
- **How to run, extend and operate every piece** → [HANDOVER_GUIDE.md](./HANDOVER_GUIDE.md)
- **Colour, type, spacing, motion, components** → [DESIGN_GUIDE.md](./DESIGN_GUIDE.md)
- **Every route** → [SITEMAP.md](./SITEMAP.md)
- **What is written and what works on every page** → [PAGE_CONTENT_MAP.md](./PAGE_CONTENT_MAP.md)
