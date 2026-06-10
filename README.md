# Pizdit

Pizdit is an open-source civic-tech project that helps voters understand what politicians are saying before election day.

The product shows upcoming elections based on a user's address, lists candidates or parties on the ballot, and provides evidence-based analysis of political claims, promises, and public statements.

**Address → Election → Candidates → Verdict → Evidence**

## What it does

- Enter an address or select a region manually
- See upcoming elections in your area
- See candidates on your ballot
- Read short verdict summaries
- Inspect checked claims with sources and evidence
- See audit status and confidence level

## What it does not do

- Tell users who to vote for
- Require public user accounts
- Run live AI analysis when a voter opens a candidate page
- Publish unaudited AI outputs

## Core rule

**No live AI calls in the voter-facing flow.** Public users only see already processed, audited, cached data.

## Stack

- Next.js 15, React, TypeScript, Tailwind CSS
- Supabase (PostgreSQL, Auth, Storage)
- Vercel
- pnpm + Turborepo monorepo

## Repository structure

```
apps/web          Public voter app
apps/admin        Admin panel
packages/core     Types, enums, verdict formula
packages/db       Supabase client, migrations
packages/ai       AI pipeline
packages/adapters Country adapter interface
packages/ui       Shared components
country-adapters/ Country-specific adapters (pt, generic)
methodology/      Open-source rules
prompts/          Versioned AI prompts
evaluation/       Test fixtures
docs/             Documentation
```

## Getting started

```bash
pnpm install
cp .env.example apps/web/.env.local
cp .env.example apps/admin/.env.local
# Fill in Supabase and AI keys

# Run Supabase migrations (see packages/db/supabase/migrations/)
pnpm dev
```

- Public app: http://localhost:3000
- Admin app: http://localhost:3001

## License

MIT — see [LICENSE](LICENSE)

## Disclaimer

Pizdit is a civic information tool. It does not provide legal advice, voting instructions, or official election information. Always verify official election dates and polling locations through election authorities.
