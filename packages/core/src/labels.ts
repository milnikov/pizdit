import type { AnalysisTag, ClaimRating, PizditVerdict } from "./types";

export const VERDICT_LABELS: Record<PizditVerdict, string> = {
  YES_OFTEN: "Yes, often",
  LIKELY_YES: "Likely yes",
  MIXED: "Mixed",
  LIKELY_NO: "Likely no",
  INSUFFICIENT_DATA: "Insufficient data",
};

export const CLAIM_RATING_LABELS: Record<ClaimRating, string> = {
  TRUE: "True",
  MOSTLY_TRUE: "Mostly true",
  MIXED: "Mixed",
  MISLEADING: "Misleading",
  UNSUPPORTED: "Unsupported",
  FALSE: "False",
  UNVERIFIABLE: "Unverifiable",
};

export const TAG_LABELS: Record<AnalysisTag, string> = {
  UNSUPPORTED_CLAIM: "Unsupported claim",
  MISLEADING_STATISTICS: "Misleading statistics",
  NO_BUDGET: "No budget",
  NO_IMPLEMENTATION_PLAN: "No implementation plan",
  OUTSIDE_AUTHORITY: "Outside legal authority",
  CONTRADICTS_VOTING_RECORD: "Contradicts voting record",
  POSITION_FLIP: "Position changed",
  FEAR_APPEAL: "Fear-based rhetoric",
  SCAPEGOATING: "Scapegoating",
  FALSE_DILEMMA: "False dilemma",
  VAGUE_PROMISE: "Vague promise",
  CONFIRMED_CLAIM: "Confirmed claim",
  REALISTIC_PROPOSAL: "Realistic proposal",
  CLEAR_BUDGET: "Clear budget",
  CLEAR_TIMELINE: "Clear timeline",
  INSUFFICIENT_DATA: "Insufficient data",
};

export const PROBLEMATIC_RATINGS: ClaimRating[] = [
  "FALSE",
  "MISLEADING",
  "UNSUPPORTED",
];

export const POSITIVE_RATINGS: ClaimRating[] = [
  "TRUE",
  "MOSTLY_TRUE",
];
