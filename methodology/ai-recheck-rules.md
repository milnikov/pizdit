# AI Recheck Rules

**Status: Post-MVP.** This escalation workflow is queued for the next iteration.

## Triggers

A claim must be sent to a new AI recheck cycle if:

- Research Agent A and B strongly disagree
- Evidence is weak or unavailable
- Source quality is low
- Claim involves serious allegations or criminal accusations
- Possible defamation risk
- Sensitive personal data involved
- Audit Agent detects hallucinated sources
- Audit Agent confidence below 0.72
- Claim could materially affect candidate reputation
- Local legal/political context required

## MVP Behavior

Claims marked for AI recheck are stored but **not published** publicly. The system sends them into an additional AI cycle before any publication decision, and all manual overrides stay logged in `manual_overrides`.
