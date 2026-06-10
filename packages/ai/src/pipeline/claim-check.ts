import { calculateCandidateVerdict } from "@pizdit/core";
import type { AnalysisTag, AuditStatus } from "@pizdit/core";
import { getServiceClient } from "@pizdit/db";
import { getRelevantChunks } from "../ingestion";
import { createAIProvider } from "../openai-provider";
import type { PoliticalClaim } from "@pizdit/core";

const PROMPT_VERSION = "v1.0";

export async function runClaimCheckPipeline(claimId: string): Promise<{
  success: boolean;
  published: boolean;
  claimCheckId?: string;
  error?: string;
}> {
  const supabase = getServiceClient();
  const ai = createAIProvider();

  const { data: claim, error: claimError } = await supabase
    .from("political_claims")
    .select("*")
    .eq("id", claimId)
    .single();

  if (claimError || !claim) {
    return { success: false, published: false, error: "Claim not found" };
  }

  const politicalClaim: PoliticalClaim = {
    id: claim.id,
    candidateId: claim.candidate_id,
    partyId: claim.party_id,
    electionId: claim.election_id,
    countryCode: claim.country_code,
    claimText: claim.claim_text,
    originalLanguage: claim.original_language,
    translatedText: claim.translated_text,
    claimType: claim.claim_type,
    claimSourceUrl: claim.claim_source_url,
    claimSourceTitle: claim.claim_source_title,
    claimDate: claim.claim_date,
    context: claim.context,
    jurisdictionLevel: claim.jurisdiction_level,
    createdAt: claim.created_at,
    updatedAt: claim.updated_at,
  };

  const { data: pipelineRun } = await supabase
    .from("pipeline_runs")
    .insert({
      entity_type: "claim",
      entity_id: claimId,
      pipeline_type: "claim_check",
      status: "running",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  try {
    const snapshotIds: string[] = [];
    if (claim.candidate_id) {
      const { data: sources } = await supabase
        .from("candidate_sources")
        .select("url")
        .eq("candidate_id", claim.candidate_id);

      for (const s of sources ?? []) {
        const { data: snap } = await supabase
          .from("source_snapshots")
          .select("id")
          .eq("url", s.url)
          .maybeSingle();
        if (snap) snapshotIds.push(snap.id);
      }
    }

    const chunks = await getRelevantChunks(
      snapshotIds,
      politicalClaim.claimText,
    );

    const agentAResult = await ai.runResearchAgent({
      claim: politicalClaim,
      sourceChunks: chunks,
      agentName: "RESEARCH_AGENT_A",
      promptVersion: PROMPT_VERSION,
    });

    const agentBResult = await ai.runResearchAgent({
      claim: politicalClaim,
      sourceChunks: chunks,
      agentName: "RESEARCH_AGENT_B",
      promptVersion: PROMPT_VERSION,
    });

    const auditResult = await ai.runAuditAgent({
      claim: politicalClaim,
      agentAResult,
      agentBResult,
      promptVersion: PROMPT_VERSION,
    });

    const { data: raA } = await supabase
      .from("research_agent_results")
      .insert({
        claim_id: claimId,
        agent_name: agentAResult.agentName,
        prompt_version: agentAResult.promptVersion,
        model_name: agentAResult.modelName,
        rating: agentAResult.rating,
        confidence_score: agentAResult.confidenceScore,
        summary: agentAResult.summary,
        reasoning_summary: agentAResult.reasoningSummary,
        concerns: agentAResult.concerns,
        missing_data: agentAResult.missingData,
        input_tokens: agentAResult.tokenUsage?.inputTokens,
        output_tokens: agentAResult.tokenUsage?.outputTokens,
      })
      .select("id")
      .single();

    const { data: raB } = await supabase
      .from("research_agent_results")
      .insert({
        claim_id: claimId,
        agent_name: agentBResult.agentName,
        prompt_version: agentBResult.promptVersion,
        model_name: agentBResult.modelName,
        rating: agentBResult.rating,
        confidence_score: agentBResult.confidenceScore,
        summary: agentBResult.summary,
        reasoning_summary: agentBResult.reasoningSummary,
        concerns: agentBResult.concerns,
        missing_data: agentBResult.missingData,
        input_tokens: agentBResult.tokenUsage?.inputTokens,
        output_tokens: agentBResult.tokenUsage?.outputTokens,
      })
      .select("id")
      .single();

    const { data: audit } = await supabase
      .from("audit_agent_results")
      .insert({
        claim_id: claimId,
        agent_a_result_id: raA?.id,
        agent_b_result_id: raB?.id,
        prompt_version: auditResult.promptVersion,
        model_name: auditResult.modelName,
        agreement_level: auditResult.agreementLevel,
        final_rating: auditResult.finalRating,
        final_confidence_score: auditResult.finalConfidenceScore,
        publish_status: auditResult.publishStatus,
        audit_summary: auditResult.auditSummary,
        public_explanation: auditResult.publicExplanation,
        internal_concerns: auditResult.internalConcerns,
        required_human_review_reason: auditResult.requiredHumanReviewReason,
        input_tokens: auditResult.tokenUsage?.inputTokens,
        output_tokens: auditResult.tokenUsage?.outputTokens,
      })
      .select("id")
      .single();

    const totalInput =
      (agentAResult.tokenUsage?.inputTokens ?? 0) +
      (agentBResult.tokenUsage?.inputTokens ?? 0) +
      (auditResult.tokenUsage?.inputTokens ?? 0);
    const totalOutput =
      (agentAResult.tokenUsage?.outputTokens ?? 0) +
      (agentBResult.tokenUsage?.outputTokens ?? 0) +
      (auditResult.tokenUsage?.outputTokens ?? 0);

    const { data: trace } = await supabase
      .from("claim_check_traces")
      .insert({
        claim_id: claimId,
        agent_a_result_id: raA?.id,
        agent_b_result_id: raB?.id,
        audit_result_id: audit?.id,
        source_snapshot_ids: snapshotIds,
        model_names: [
          agentAResult.modelName,
          agentBResult.modelName,
          auditResult.modelName,
        ],
        prompt_versions: [PROMPT_VERSION],
        input_tokens: totalInput,
        output_tokens: totalOutput,
      })
      .select("id")
      .single();

    const publishable =
      auditResult.publishStatus === "APPROVED" ||
      auditResult.publishStatus === "APPROVED_WITH_WARNINGS";

    const auditStatus: AuditStatus = publishable
      ? auditResult.publishStatus === "APPROVED_WITH_WARNINGS"
        ? "PASSED_WITH_WARNINGS"
        : "PASSED"
      : "FAILED_NEEDS_REVIEW";

    let claimCheckId: string | undefined;

    if (publishable) {
      const evidenceUrls = [
        ...new Set([
          ...agentAResult.evidence.map((e) => e.url),
          ...agentBResult.evidence.map((e) => e.url),
        ]),
      ];

      const tags = [
        ...new Set([
          ...agentAResult.concerns,
          ...agentBResult.concerns,
        ]),
      ]
        .slice(0, 5)
        .map((t) => mapConcernToTag(t))
        .filter(Boolean) as AnalysisTag[];

      const { data: check } = await supabase
        .from("claim_checks")
        .insert({
          claim_id: claimId,
          candidate_id: claim.candidate_id,
          party_id: claim.party_id,
          final_rating: auditResult.finalRating,
          confidence_score: auditResult.finalConfidenceScore,
          short_explanation: auditResult.auditSummary,
          detailed_explanation: auditResult.publicExplanation,
          evidence_urls: evidenceUrls,
          tags,
          research_agent_a_result_id: raA?.id,
          research_agent_b_result_id: raB?.id,
          audit_result_id: audit?.id,
          trace_id: trace?.id,
          audit_status: auditStatus,
          is_published: true,
        })
        .select("id")
        .single();

      claimCheckId = check?.id;

      if (claim.candidate_id) {
        await recalculateCandidateVerdict(claim.candidate_id);
      }
    } else if (auditResult.publishStatus === "NEEDS_HUMAN_REVIEW") {
      await supabase.from("human_review_queue").insert({
        claim_id: claimId,
        audit_result_id: audit?.id,
        reason:
          auditResult.requiredHumanReviewReason ??
          "Audit agent flagged for additional AI recheck",
        status: "pending",
      });
    }

    await supabase.from("token_usage_logs").insert({
      pipeline_run_id: pipelineRun?.id,
      entity_type: "claim",
      entity_id: claimId,
      model_name: auditResult.modelName,
      prompt_version: PROMPT_VERSION,
      input_tokens: totalInput,
      output_tokens: totalOutput,
    });

    await supabase
      .from("pipeline_runs")
      .update({
        status: "completed",
        finished_at: new Date().toISOString(),
      })
      .eq("id", pipelineRun?.id);

    return { success: true, published: publishable, claimCheckId };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    await supabase
      .from("pipeline_runs")
      .update({
        status: "failed",
        error_message: message,
        finished_at: new Date().toISOString(),
      })
      .eq("id", pipelineRun?.id);

    return { success: false, published: false, error: message };
  }
}

async function recalculateCandidateVerdict(candidateId: string) {
  const supabase = getServiceClient();

  const { data: checks } = await supabase
    .from("claim_checks")
    .select("final_rating, confidence_score, tags")
    .eq("candidate_id", candidateId)
    .eq("is_published", true);

  const { data: candidate } = await supabase
    .from("candidates")
    .select("election_id")
    .eq("id", candidateId)
    .single();

  if (!candidate) return;

  const result = calculateCandidateVerdict(
    (checks ?? []).map((c) => ({
      finalRating: c.final_rating,
      confidenceScore: Number(c.confidence_score),
      tags: c.tags ?? [],
    })),
  );

  await supabase.from("candidate_verdicts").upsert(
    {
      candidate_id: candidateId,
      election_id: candidate.election_id,
      verdict: result.verdict,
      confidence_score: result.confidenceScore,
      summary: result.summary,
      top_concerns: result.topConcerns,
      reasonable_proposals: result.reasonableProposals,
      tags: result.tags,
      checked_claims_count: result.checkedClaimsCount,
      problematic_claims_count: result.problematicClaimsCount,
      last_calculated_at: new Date().toISOString(),
    },
    { onConflict: "candidate_id" },
  );
}

function mapConcernToTag(concern: string): AnalysisTag | null {
  const lower = concern.toLowerCase();
  if (lower.includes("budget")) return "NO_BUDGET";
  if (lower.includes("implementation")) return "NO_IMPLEMENTATION_PLAN";
  if (lower.includes("statistic")) return "MISLEADING_STATISTICS";
  if (lower.includes("authority")) return "OUTSIDE_AUTHORITY";
  if (lower.includes("vague")) return "VAGUE_PROMISE";
  if (lower.includes("unsupported")) return "UNSUPPORTED_CLAIM";
  return null;
}
