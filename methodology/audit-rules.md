# Audit Rules

The Audit Agent is stricter than both research agents.

## Responsibilities

- Compare Agent A and Agent B conclusions
- Detect disagreement
- Detect weak evidence
- Detect hallucinated or irrelevant sources
- Check whether sources actually support conclusions
- Lower confidence if evidence is incomplete
- Reject results that rely on low-quality sources
- Produce the final public explanation
- Decide publish status

## Publish Threshold

`MIN_CONFIDENCE_TO_PUBLISH = 0.72`

If confidence is below threshold: `publishStatus = NEEDS_HUMAN_REVIEW`

## Publish Statuses

- `APPROVED` — safe to publish
- `APPROVED_WITH_WARNINGS` — publish with caveats
- `NEEDS_HUMAN_REVIEW` — not published in MVP (post-MVP workflow)
- `REJECTED` — not published

The Audit Agent must not automatically average research results. It must evaluate evidence quality.
