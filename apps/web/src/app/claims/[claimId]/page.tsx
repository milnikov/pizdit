import {
  getClaimById,
  getPublishedClaimCheck,
  getClaimCheckTrace,
} from "@pizdit/db";
import {
  AuditStatusBadge,
  ClaimRatingBadge,
  AnalysisTagList,
} from "@pizdit/ui";
import type { AuditStatus } from "@pizdit/core";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;

  let claim;
  try {
    claim = await getClaimById(claimId);
  } catch {
    claim = null;
  }

  if (!claim) notFound();

  const check = await getPublishedClaimCheck(claimId).catch(() => null);
  if (!check) notFound();

  const trace = await getClaimCheckTrace(check.traceId).catch(() => null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        {claim.candidateId && (
          <Link
            href={`/candidates/${claim.candidateId}`}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            ← Back to candidate
          </Link>
        )}
        <blockquote className="mt-2 border-l-4 border-slate-300 pl-4 text-lg text-slate-900">
          &ldquo;{claim.claimText}&rdquo;
        </blockquote>
        {claim.claimSourceTitle && (
          <p className="mt-2 text-sm text-slate-500">
            Source:{" "}
            <a
              href={claim.claimSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {claim.claimSourceTitle}
            </a>
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ClaimRatingBadge rating={check.finalRating} />
        <AuditStatusBadge status={check.auditStatus as AuditStatus} />
        <span className="text-sm text-slate-500">
          Confidence: {Math.round(check.confidenceScore * 100)}%
        </span>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">Explanation</h2>
        <p className="mt-2 text-slate-700">{check.detailedExplanation}</p>
      </section>

      {check.evidenceUrls.length > 0 && (
        <section>
          <h2 className="mb-3 font-semibold text-slate-900">Evidence</h2>
          <ul className="space-y-2">
            {check.evidenceUrls.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline break-all"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {check.tags.length > 0 && (
        <section>
          <h2 className="mb-3 font-semibold text-slate-900">Tags</h2>
          <AnalysisTagList tags={check.tags} />
        </section>
      )}

      {trace && (
        <section className="rounded-lg bg-slate-50 p-4 text-xs text-slate-500">
          <h2 className="mb-2 font-medium text-slate-700">Audit trail</h2>
          <p>Models: {(trace.model_names as string[]).join(", ")}</p>
          <p>Prompt versions: {(trace.prompt_versions as string[]).join(", ")}</p>
          <p>
            Checked: {new Date(trace.created_at as string).toLocaleString()}
          </p>
        </section>
      )}
    </div>
  );
}
