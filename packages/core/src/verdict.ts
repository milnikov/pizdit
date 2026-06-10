import { POSITIVE_RATINGS, PROBLEMATIC_RATINGS } from "./labels";
import {
  MIN_CLAIMS_FOR_VERDICT,
  type AnalysisTag,
  type ClaimRating,
  type PizditVerdict,
} from "./types";

export type ClaimCheckInput = {
  finalRating: ClaimRating;
  confidenceScore: number;
  tags: AnalysisTag[];
};

export type VerdictCalculationResult = {
  verdict: PizditVerdict;
  confidenceScore: number;
  summary: string;
  topConcerns: string[];
  reasonableProposals: string[];
  tags: AnalysisTag[];
  checkedClaimsCount: number;
  problematicClaimsCount: number;
};

function isProblematic(rating: ClaimRating): boolean {
  return PROBLEMATIC_RATINGS.includes(rating);
}

function isPositive(rating: ClaimRating): boolean {
  return POSITIVE_RATINGS.includes(rating);
}

export function calculateCandidateVerdict(
  checks: ClaimCheckInput[],
): VerdictCalculationResult {
  const checkedClaimsCount = checks.length;

  if (checkedClaimsCount < MIN_CLAIMS_FOR_VERDICT) {
    return {
      verdict: "INSUFFICIENT_DATA",
      confidenceScore: 0,
      summary:
        "Not enough checked claims to produce a stable verdict. More analysis is needed.",
      topConcerns: [],
      reasonableProposals: [],
      tags: ["INSUFFICIENT_DATA"],
      checkedClaimsCount,
      problematicClaimsCount: 0,
    };
  }

  const problematicClaimsCount = checks.filter((c) =>
    isProblematic(c.finalRating),
  ).length;
  const positiveCount = checks.filter((c) => isPositive(c.finalRating)).length;
  const mixedCount = checks.filter((c) => c.finalRating === "MIXED").length;
  const unverifiableCount = checks.filter(
    (c) => c.finalRating === "UNVERIFIABLE",
  ).length;

  const problematicRatio = problematicClaimsCount / checkedClaimsCount;
  const positiveRatio = positiveCount / checkedClaimsCount;

  const avgConfidence =
    checks.reduce((sum, c) => sum + c.confidenceScore, 0) / checkedClaimsCount;

  const allTags = checks.flatMap((c) => c.tags);
  const tagCounts = new Map<AnalysisTag, number>();
  for (const tag of allTags) {
    tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }

  const negativeTags = (
    [
      "UNSUPPORTED_CLAIM",
      "MISLEADING_STATISTICS",
      "NO_BUDGET",
      "NO_IMPLEMENTATION_PLAN",
      "OUTSIDE_AUTHORITY",
      "CONTRADICTS_VOTING_RECORD",
      "POSITION_FLIP",
      "FEAR_APPEAL",
      "SCAPEGOATING",
      "FALSE_DILEMMA",
      "VAGUE_PROMISE",
    ] as AnalysisTag[]
  )
    .filter((t) => tagCounts.has(t))
    .sort((a, b) => (tagCounts.get(b) ?? 0) - (tagCounts.get(a) ?? 0))
    .slice(0, 5);

  const positiveTags = (
    [
      "CONFIRMED_CLAIM",
      "REALISTIC_PROPOSAL",
      "CLEAR_BUDGET",
      "CLEAR_TIMELINE",
    ] as AnalysisTag[]
  )
    .filter((t) => tagCounts.has(t))
    .sort((a, b) => (tagCounts.get(b) ?? 0) - (tagCounts.get(a) ?? 0))
    .slice(0, 3);

  let verdict: PizditVerdict;

  if (unverifiableCount > checkedClaimsCount * 0.5) {
    verdict = "INSUFFICIENT_DATA";
  } else if (problematicRatio >= 0.6) {
    verdict = "YES_OFTEN";
  } else if (problematicRatio >= 0.35) {
    verdict = "LIKELY_YES";
  } else if (problematicRatio >= 0.15 && positiveRatio >= 0.15) {
    verdict = "MIXED";
  } else if (positiveRatio >= 0.5 && problematicRatio < 0.15) {
    verdict = "LIKELY_NO";
  } else if (mixedCount > checkedClaimsCount * 0.4) {
    verdict = "MIXED";
  } else {
    verdict = "LIKELY_NO";
  }

  const summary = buildSummary(
    verdict,
    problematicClaimsCount,
    positiveCount,
    checkedClaimsCount,
  );

  return {
    verdict,
    confidenceScore: Math.round(avgConfidence * 100) / 100,
    summary,
    topConcerns: negativeTags.map((t) => t.replace(/_/g, " ").toLowerCase()),
    reasonableProposals: positiveTags.map((t) =>
      t.replace(/_/g, " ").toLowerCase(),
    ),
    tags: [...negativeTags, ...positiveTags].slice(0, 8),
    checkedClaimsCount,
    problematicClaimsCount,
  };
}

function buildSummary(
  verdict: PizditVerdict,
  problematic: number,
  positive: number,
  total: number,
): string {
  switch (verdict) {
    case "YES_OFTEN":
      return `Many of the ${total} checked claims (${problematic}) are unsupported, misleading, or contradicted by evidence.`;
    case "LIKELY_YES":
      return `Several important checked claims (${problematic} of ${total}) lack clear evidence, budget details, or implementation mechanisms.`;
    case "MIXED":
      return `The record contains both supported claims (${positive}) and problematic claims (${problematic}) among ${total} checked statements.`;
    case "LIKELY_NO":
      return `Most checked claims (${positive} of ${total}) are supported or reasonably argued with available evidence.`;
    case "INSUFFICIENT_DATA":
      return "Not enough reliable evidence to produce a stable verdict.";
  }
}
