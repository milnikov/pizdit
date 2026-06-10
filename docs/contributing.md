# Contributing to Pizdit

Thank you for your interest in contributing to Pizdit

Pizdit is an open-source civic-tech project for evidence-based political claim analysis.

## Project Values

- Evidence over opinion
- Transparency and auditability
- Political neutrality in the analytical layer
- Legal safety and privacy
- Simple public UX, rigorous internal methodology

## Contribution Rules

1. **Be source-backed** — cite election commissions, government records, official statistics
2. **No unsupported accusations** — evaluate specific claims, not personalities
3. **Careful public wording** — "unsupported claim" not "liar"
4. **Protect privacy** — no API keys, raw addresses, or private data in commits

## High-Risk Changes (require extra review)

- Claim rating rules, verdict formula, source quality rules
- AI prompts and audit logic
- Country adapters
- Politically sensitive wording

## Local Development

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` in each app and fill in Supabase + AI keys.

## Core Architectural Rule

Do not add live AI analysis to the public voter-facing flow.

Correct: `Batch/admin pipeline → audited database result → public app reads result`

Incorrect: `Public user opens candidate page → app calls AI model live`
