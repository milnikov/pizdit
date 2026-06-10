import type {
  AuditAgentResult,
  ClaimType,
  ClaimRating,
  PoliticalClaim,
  ResearchAgentResult,
  TokenUsage,
} from "@pizdit/core";

export type ClaimExtractionInput = {
  sourceText: string;
  sourceUrl: string;
  sourceTitle?: string;
  countryCode: string;
  language?: string;
};

export type ResearchAgentInput = {
  claim: PoliticalClaim;
  sourceChunks: string[];
  agentName: "RESEARCH_AGENT_A" | "RESEARCH_AGENT_B";
  promptVersion: string;
};

export type AuditAgentInput = {
  claim: PoliticalClaim;
  agentAResult: ResearchAgentResult;
  agentBResult: ResearchAgentResult;
  promptVersion: string;
};

export interface AIProvider {
  extractClaims(input: ClaimExtractionInput): Promise<PoliticalClaim[]>;
  runResearchAgent(input: ResearchAgentInput): Promise<ResearchAgentResult>;
  runAuditAgent(input: AuditAgentInput): Promise<AuditAgentResult>;
}

export type ExtractedClaimRaw = {
  claimText: string;
  originalLanguage: string;
  translatedText?: string;
  claimType: ClaimType;
  claimSourceUrl: string;
  claimSourceTitle?: string;
  claimDate?: string;
  context?: string;
};

export type ResearchAgentRaw = {
  rating: ClaimRating;
  confidenceScore: number;
  summary: string;
  reasoningSummary: string;
  evidence: Array<{
    url: string;
    title?: string;
    publisher?: string;
    sourceType: string;
    relevantExcerpt?: string;
    relevanceScore: number;
    supportsClaim?: boolean;
    contradictsClaim?: boolean;
  }>;
  concerns: string[];
  missingData: string[];
  tokenUsage?: TokenUsage;
};

export type AuditAgentRaw = {
  agreementLevel: "HIGH" | "MEDIUM" | "LOW" | "CONFLICT";
  finalRating: ClaimRating;
  finalConfidenceScore: number;
  publishStatus:
    | "APPROVED"
    | "APPROVED_WITH_WARNINGS"
    | "NEEDS_HUMAN_REVIEW"
    | "REJECTED";
  auditSummary: string;
  publicExplanation: string;
  internalConcerns: string[];
  requiredHumanReviewReason?: string;
  requiredRecheckReason?: string;
  tokenUsage?: TokenUsage;
};
