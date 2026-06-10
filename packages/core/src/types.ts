export type PizditVerdict =
  | "YES_OFTEN"
  | "LIKELY_YES"
  | "MIXED"
  | "LIKELY_NO"
  | "INSUFFICIENT_DATA";

export type ClaimRating =
  | "TRUE"
  | "MOSTLY_TRUE"
  | "MIXED"
  | "MISLEADING"
  | "UNSUPPORTED"
  | "FALSE"
  | "UNVERIFIABLE";

export type AnalysisTag =
  | "UNSUPPORTED_CLAIM"
  | "MISLEADING_STATISTICS"
  | "NO_BUDGET"
  | "NO_IMPLEMENTATION_PLAN"
  | "OUTSIDE_AUTHORITY"
  | "CONTRADICTS_VOTING_RECORD"
  | "POSITION_FLIP"
  | "FEAR_APPEAL"
  | "SCAPEGOATING"
  | "FALSE_DILEMMA"
  | "VAGUE_PROMISE"
  | "CONFIRMED_CLAIM"
  | "REALISTIC_PROPOSAL"
  | "CLEAR_BUDGET"
  | "CLEAR_TIMELINE"
  | "INSUFFICIENT_DATA";

export type AdapterStatus =
  | "NOT_STARTED"
  | "PLANNED"
  | "IN_PROGRESS"
  | "BETA"
  | "SUPPORTED"
  | "DEPRECATED";

export type ElectionLevel =
  | "municipal"
  | "regional"
  | "national"
  | "presidential"
  | "parliamentary"
  | "referendum"
  | "other";

export type BallotType =
  | "candidate"
  | "party_list"
  | "mixed"
  | "referendum_question"
  | "unknown";

export type ClaimType =
  | "statistical"
  | "promise"
  | "attack"
  | "policy_position"
  | "past_record"
  | "future_projection"
  | "other";

export type JurisdictionLevel =
  | "municipal"
  | "regional"
  | "national"
  | "international"
  | "unknown";

export type SourceType =
  | "official_candidate"
  | "official_party"
  | "election_commission"
  | "government"
  | "public_record"
  | "statistics_database"
  | "media"
  | "fact_checking_org"
  | "ngo"
  | "academic"
  | "social_media"
  | "other";

export type EvidenceSourceType =
  | "official_government"
  | "election_commission"
  | "official_candidate"
  | "official_party"
  | "public_record"
  | "court_record"
  | "statistics_database"
  | "reputable_media"
  | "fact_checking_org"
  | "academic"
  | "ngo"
  | "social_media"
  | "other";

export type ReliabilityLevel = "high" | "medium" | "low";

export type AgentName = "RESEARCH_AGENT_A" | "RESEARCH_AGENT_B";

export type AgreementLevel = "HIGH" | "MEDIUM" | "LOW" | "CONFLICT";

export type PublishStatus =
  | "APPROVED"
  | "APPROVED_WITH_WARNINGS"
  | "NEEDS_HUMAN_REVIEW"
  | "REJECTED";

export type AuditStatus =
  | "PASSED"
  | "PASSED_WITH_WARNINGS"
  | "FAILED_NEEDS_REVIEW"
  | "INSUFFICIENT_EVIDENCE";

export type PipelineStatus = "pending" | "running" | "completed" | "failed";

export type TokenUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd?: number;
};

export type Country = {
  id: string;
  isoCode: string;
  name: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  electionSystemNotes?: string;
  legalRiskNotes?: string;
  officialElectionSourceUrls: string[];
  adapterStatus: AdapterStatus;
  createdAt: string;
  updatedAt: string;
};

export type Election = {
  id: string;
  countryCode: string;
  name: string;
  regionName?: string;
  municipalityName?: string;
  districtName?: string;
  electionLevel: ElectionLevel;
  ballotType: BallotType;
  electionDate: string;
  registrationDeadline?: string;
  pollingPlaceUrl?: string;
  sourceUrls: string[];
  createdAt: string;
  updatedAt: string;
};

export type ElectoralDistrict = {
  id: string;
  countryCode: string;
  regionName?: string;
  municipalityName?: string;
  districtName: string;
  districtCode?: string;
  boundaryGeoJson?: unknown;
  sourceUrls: string[];
  createdAt: string;
  updatedAt: string;
};

export type Party = {
  id: string;
  countryCode: string;
  name: string;
  shortName?: string;
  officialWebsiteUrl?: string;
  socialUrls?: string[];
  ideologyDescription?: string;
  sourceUrls: string[];
  createdAt: string;
  updatedAt: string;
};

export type Candidate = {
  id: string;
  electionId: string;
  countryCode: string;
  fullName: string;
  partyName?: string;
  partyId?: string;
  isIndependent: boolean;
  photoUrl?: string;
  officialWebsiteUrl?: string;
  socialUrls?: string[];
  shortBio?: string;
  currentRole?: string;
  previousRoles?: string[];
  districtName?: string;
  sourceLanguage?: string;
  createdAt: string;
  updatedAt: string;
};

export type CandidateSource = {
  id: string;
  candidateId: string;
  url: string;
  title?: string;
  publisher?: string;
  countryCode: string;
  language?: string;
  sourceType: SourceType;
  reliabilityLevel: ReliabilityLevel;
  addedAt: string;
};

export type PoliticalClaim = {
  id: string;
  candidateId?: string;
  partyId?: string;
  electionId: string;
  countryCode: string;
  claimText: string;
  originalLanguage: string;
  translatedText?: string;
  claimType: ClaimType;
  claimSourceUrl: string;
  claimSourceTitle?: string;
  claimDate?: string;
  context?: string;
  jurisdictionLevel?: JurisdictionLevel;
  createdAt: string;
  updatedAt: string;
};

export type EvidenceItem = {
  id?: string;
  url: string;
  title?: string;
  publisher?: string;
  countryCode?: string;
  language?: string;
  publishedAt?: string;
  accessedAt: string;
  sourceType: EvidenceSourceType;
  relevantExcerpt?: string;
  relevanceScore: number;
  supportsClaim?: boolean;
  contradictsClaim?: boolean;
};

export type ResearchAgentResult = {
  id: string;
  agentName: AgentName;
  claimId: string;
  promptVersion: string;
  modelName: string;
  rating: ClaimRating;
  confidenceScore: number;
  summary: string;
  reasoningSummary: string;
  evidence: EvidenceItem[];
  concerns: string[];
  missingData: string[];
  tokenUsage?: TokenUsage;
  createdAt: string;
};

export type AuditAgentResult = {
  id: string;
  claimId: string;
  agentAResultId: string;
  agentBResultId: string;
  promptVersion: string;
  modelName: string;
  agreementLevel: AgreementLevel;
  finalRating: ClaimRating;
  finalConfidenceScore: number;
  publishStatus: PublishStatus;
  auditSummary: string;
  publicExplanation: string;
  internalConcerns: string[];
  requiredHumanReviewReason?: string;
  tokenUsage?: TokenUsage;
  createdAt: string;
};

export type ClaimCheck = {
  id: string;
  claimId: string;
  candidateId?: string;
  partyId?: string;
  finalRating: ClaimRating;
  confidenceScore: number;
  shortExplanation: string;
  detailedExplanation: string;
  evidenceUrls: string[];
  conflictingEvidenceUrls?: string[];
  tags: AnalysisTag[];
  researchAgentAResultId: string;
  researchAgentBResultId: string;
  auditResultId: string;
  auditStatus: AuditStatus;
  traceId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CandidateVerdict = {
  id: string;
  candidateId: string;
  electionId: string;
  verdict: PizditVerdict;
  confidenceScore: number;
  summary: string;
  topConcerns: string[];
  reasonableProposals: string[];
  tags: AnalysisTag[];
  checkedClaimsCount: number;
  problematicClaimsCount: number;
  lastCalculatedAt: string;
};

export type ClaimCheckTrace = {
  id: string;
  claimId: string;
  agentAResultId: string;
  agentBResultId: string;
  auditResultId: string;
  sourceSnapshotIds: string[];
  modelNames: string[];
  promptVersions: string[];
  tokenUsage: TokenUsage;
  createdAt: string;
};

export type ManualOverride = {
  id: string;
  entityType: "claim_check" | "candidate_verdict" | "source" | "candidate" | "election";
  entityId: string;
  previousValue: unknown;
  newValue: unknown;
  reason: string;
  reviewerId: string;
  createdAt: string;
};

export const MIN_CONFIDENCE_TO_PUBLISH = 0.72;
export const MIN_CLAIMS_FOR_VERDICT = 3;
