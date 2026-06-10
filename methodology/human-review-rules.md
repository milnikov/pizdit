# Human Review Rules

**Status: Post-MVP.** Schema exists but UI workflow is not implemented in MVP.

## Triggers

A claim must be sent to human review if:

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

Claims with `NEEDS_HUMAN_REVIEW` status are stored but **not published** publicly. Admins can manually publish/unpublish via admin toggle (logged in `manual_overrides`).
