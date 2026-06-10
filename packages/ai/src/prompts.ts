import { readFileSync } from "fs";
import { join } from "path";

const PROMPTS_DIR = join(__dirname, "../../../prompts");

export function loadPrompt(name: string): string {
  try {
    return readFileSync(join(PROMPTS_DIR, `${name}.md`), "utf-8");
  } catch {
    return getDefaultPrompt(name);
  }
}

function getDefaultPrompt(name: string): string {
  const defaults: Record<string, string> = {
    "claim-extraction": `You are a claim extraction agent for a political fact-checking system.
Extract only checkable political claims from the provided source text.
Return structured JSON array with: claimText, originalLanguage, translatedText, claimType, claimSourceUrl, context.`,

    "research-agent-a": `You are Research Agent A for a political fact-checking system.
Independently verify the provided political claim using reliable sources.
Return structured JSON with: rating, confidenceScore, summary, reasoningSummary, evidence, concerns, missingData.`,

    "research-agent-b": `You are Research Agent B for a political fact-checking system.
Verify the same claim independently from another angle.
Return structured JSON with: rating, confidenceScore, summary, reasoningSummary, evidence, concerns, missingData.`,

    "audit-agent": `You are the Audit Agent for a political fact-checking system.
Compare both research results and decide publishability.
Return structured JSON with: agreementLevel, finalRating, finalConfidenceScore, publishStatus, auditSummary, publicExplanation, internalConcerns.`,
  };
  return defaults[name] ?? "";
}
