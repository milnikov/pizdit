# Candidate Verdict Formula

Candidate-level verdicts are computed deterministically from audited claim-level checks. They are **not** generated directly by AI.

## Minimum Requirements

- At least 3 published claim checks required for a non-`INSUFFICIENT_DATA` verdict

## Problematic Ratings

`FALSE`, `MISLEADING`, `UNSUPPORTED` count as problematic.

## Verdict Mapping

| Condition | Verdict |
|---|---|
| < 3 checked claims | INSUFFICIENT_DATA |
| > 50% unverifiable | INSUFFICIENT_DATA |
| problematic ratio ≥ 60% | YES_OFTEN |
| problematic ratio ≥ 35% | LIKELY_YES |
| problematic ≥ 15% AND positive ≥ 15% | MIXED |
| positive ≥ 50% AND problematic < 15% | LIKELY_NO |
| mixed claims > 40% | MIXED |
| default | LIKELY_NO |

Implementation: `packages/core/src/verdict.ts`
