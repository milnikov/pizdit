import type { Candidate, CandidateVerdict, PizditVerdict } from "@pizdit/core";
import Link from "next/link";
import { AnalysisTagList } from "./analysis-tag-list";
import { VerdictBadge } from "./verdict-badge";
import { cn } from "./utils";

export function CandidateCard({
  candidate,
  verdict,
  className,
}: {
  candidate: Candidate;
  verdict?: CandidateVerdict | null;
  className?: string;
}) {
  return (
    <Link
      href={`/candidates/${candidate.id}`}
      className={cn(
        "block rounded-xl border border-slate-200 p-6 transition hover:border-slate-400 hover:shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {candidate.fullName}
          </h3>
          <p className="text-sm text-slate-600">
            {candidate.isIndependent
              ? "Independent"
              : candidate.partyName ?? "Unknown party"}
          </p>
        </div>
        {verdict && (
          <VerdictBadge verdict={verdict.verdict as PizditVerdict} />
        )}
      </div>
      {verdict && verdict.summary && (
        <p className="mt-3 text-sm text-slate-700">{verdict.summary}</p>
      )}
      {verdict && verdict.tags.length > 0 && (
        <AnalysisTagList tags={verdict.tags} className="mt-3" />
      )}
      <span className="mt-4 inline-block text-sm font-medium text-slate-900">
        View analysis →
      </span>
    </Link>
  );
}
