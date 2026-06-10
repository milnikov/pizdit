# Deployment

## Vercel (recommended)

Create a Vercel project from this monorepo:

### 1. Public web app (`apps/web`)

- Root directory: `apps/web`
- Build command: `cd ../.. && pnpm turbo build --filter=@pizdit/web`
- Install command: `cd ../.. && pnpm install`

## Environment variables

Set in the Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AI_PROVIDER=openai
AI_API_KEY=
AI_MODEL_RESEARCH=gpt-4o-mini
AI_MODEL_AUDIT=gpt-4o
GEOCODING_PROVIDER=nominatim
```

## Supabase

1. Create a Supabase project
2. Run migrations from `packages/db/supabase/migrations/`
3. Enable the `vector` extension

```bash
supabase link --project-ref <your-ref>
supabase db push
```

## Local development

```bash
git clone https://github.com/milnikov/pizdit.git
cd pizdit
pnpm install
pnpm dev
```
