# Architecture

## Overview

Pizdit is a pnpm + Turborepo monorepo with two Next.js apps and shared packages.

```
apps/web      — Public voter-facing app (no auth)
apps/admin    — Protected admin panel (Supabase Auth)
packages/core — Types, enums, verdict formula
packages/db   — Supabase client, queries, migrations
packages/ai   — AI provider abstraction, ingestion, pipeline
packages/adapters — CountryAdapter interface, geocoding
packages/ui   — Shared React components
country-adapters/pt — Portugal adapter (BETA)
country-adapters/generic — Fallback adapter
```

## Core Rules

1. **No live AI in public flow** — voters read cached, audited DB results only
2. **Candidate verdicts from claim checks** — deterministic formula, not direct AI
3. **Three-stage pipeline** — Research A → Research B → Audit Agent
4. **Traceability** — every published check links to sources, prompts, models, audit

## Data Flow

```
Admin seeds data → Source ingestion → Claim extraction → AI pipeline → claim_checks (published) → candidate_verdicts → Public app
```

## Deployment

- **Vercel**: two projects (`apps/web`, `apps/admin`)
- **Supabase**: PostgreSQL, Auth (admin only), Storage, vector extension
