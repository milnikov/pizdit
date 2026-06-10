import { randomUUID } from "crypto";
import type {
  AuditAgentResult,
  EvidenceItem,
  PoliticalClaim,
  ResearchAgentResult,
} from "@pizdit/core";
import { MIN_CONFIDENCE_TO_PUBLISH } from "@pizdit/core";
import { loadPrompt } from "./prompts";
import type {
  AIProvider,
  AuditAgentInput,
  AuditAgentRaw,
  ClaimExtractionInput,
  ExtractedClaimRaw,
  ResearchAgentInput,
  ResearchAgentRaw,
} from "./provider";

async function callOpenAI(
  systemPrompt: string,
  userContent: string,
  model?: string,
): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error("AI_API_KEY is not configured");
  }

  const modelName =
    model ??
    process.env.AI_MODEL_RESEARCH ??
    "gpt-4o-mini";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${err}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
    usage?: { prompt_tokens: number; completion_tokens: number };
  };

  return {
    content: data.choices[0]?.message?.content ?? "{}",
    inputTokens: data.usage?.prompt_tokens ?? 0,
    outputTokens: data.usage?.completion_tokens ?? 0,
  };
}

function parseJson<T>(content: string): T {
  const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as T;
}

export class OpenAIProvider implements AIProvider {
  async extractClaims(input: ClaimExtractionInput): Promise<PoliticalClaim[]> {
    const prompt = loadPrompt("claim-extraction");
    const { content } = await callOpenAI(
      prompt,
      JSON.stringify({
        sourceText: input.sourceText.slice(0, 30000),
        sourceUrl: input.sourceUrl,
        sourceTitle: input.sourceTitle,
        countryCode: input.countryCode,
      }),
    );

    const parsed = parseJson<{ claims: ExtractedClaimRaw[] }>(content);
    const now = new Date().toISOString();

    return (parsed.claims ?? []).map((c) => ({
      id: randomUUID(),
      electionId: "",
      countryCode: input.countryCode,
      claimText: c.claimText,
      originalLanguage: c.originalLanguage ?? input.language ?? "en",
      translatedText: c.translatedText,
      claimType: c.claimType,
      claimSourceUrl: c.claimSourceUrl ?? input.sourceUrl,
      claimSourceTitle: c.claimSourceTitle ?? input.sourceTitle,
      claimDate: c.claimDate,
      context: c.context,
      createdAt: now,
      updatedAt: now,
    }));
  }

  async runResearchAgent(
    input: ResearchAgentInput,
  ): Promise<ResearchAgentResult> {
    const promptName =
      input.agentName === "RESEARCH_AGENT_A"
        ? "research-agent-a"
        : "research-agent-b";
    const prompt = loadPrompt(promptName);
    const model = process.env.AI_MODEL_RESEARCH ?? "gpt-4o-mini";

    const { content, inputTokens, outputTokens } = await callOpenAI(
      prompt,
      JSON.stringify({
        claim: input.claim,
        sourceChunks: input.sourceChunks,
      }),
      model,
    );

    const raw = parseJson<ResearchAgentRaw>(content);
    const now = new Date().toISOString();

    const evidence: EvidenceItem[] = (raw.evidence ?? []).map((e) => ({
      url: e.url,
      title: e.title,
      publisher: e.publisher,
      sourceType: e.sourceType as EvidenceItem["sourceType"],
      relevantExcerpt: e.relevantExcerpt,
      relevanceScore: e.relevanceScore,
      supportsClaim: e.supportsClaim,
      contradictsClaim: e.contradictsClaim,
      accessedAt: now,
    }));

    return {
      id: randomUUID(),
      agentName: input.agentName,
      claimId: input.claim.id,
      promptVersion: input.promptVersion,
      modelName: model,
      rating: raw.rating,
      confidenceScore: raw.confidenceScore,
      summary: raw.summary,
      reasoningSummary: raw.reasoningSummary,
      evidence,
      concerns: raw.concerns ?? [],
      missingData: raw.missingData ?? [],
      tokenUsage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
      },
      createdAt: now,
    };
  }

  async runAuditAgent(input: AuditAgentInput): Promise<AuditAgentResult> {
    const prompt = loadPrompt("audit-agent");
    const model = process.env.AI_MODEL_AUDIT ?? "gpt-4o";

    const { content, inputTokens, outputTokens } = await callOpenAI(
      prompt,
      JSON.stringify({
        claim: input.claim,
        agentAResult: input.agentAResult,
        agentBResult: input.agentBResult,
      }),
      model,
    );

    const raw = parseJson<AuditAgentRaw>(content);
    const now = new Date().toISOString();

    let publishStatus = raw.publishStatus;
    if (
      raw.finalConfidenceScore < MIN_CONFIDENCE_TO_PUBLISH &&
      publishStatus === "APPROVED"
    ) {
      publishStatus = "NEEDS_HUMAN_REVIEW";
    }

    return {
      id: randomUUID(),
      claimId: input.claim.id,
      agentAResultId: input.agentAResult.id,
      agentBResultId: input.agentBResult.id,
      promptVersion: input.promptVersion,
      modelName: model,
      agreementLevel: raw.agreementLevel,
      finalRating: raw.finalRating,
      finalConfidenceScore: raw.finalConfidenceScore,
      publishStatus,
      auditSummary: raw.auditSummary,
      publicExplanation: raw.publicExplanation,
      internalConcerns: raw.internalConcerns ?? [],
      requiredHumanReviewReason: raw.requiredHumanReviewReason,
      tokenUsage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
      },
      createdAt: now,
    };
  }
}

export function createAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? "openai";
  if (provider === "openai") {
    return new OpenAIProvider();
  }
  throw new Error(`Unsupported AI provider: ${provider}`);
}
