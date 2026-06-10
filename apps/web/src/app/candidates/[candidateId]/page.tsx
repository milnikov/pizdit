import {
  getCandidateById,
  getCandidateVerdict,
  getPublishedClaimChecksForCandidate,
  getClaimById,
} from "@pizdit/db";
import {
  AnalysisTagList,
  ClaimCheckCard,
  VerdictBadge,
} from "@pizdit/ui";
import type { PizditVerdict } from "@pizdit/core";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CandidatePage({
  params,
}: {
  params: Promise<{ candidateId: string }>;
}) {
  const { candidateId } = await params;

  let candidate;
  try {
    candidate = await getCandidateById(candidateId);
  } catch {
    candidate = null;
  }

  if (!candidate) notFound();

  const [verdict, checks] = await Promise.all([
    getCandidateVerdict(candidateId).catch(() => null),
    getPublishedClaimChecksForCandidate(candidateId).catch(() => []),
  ]);

  const claimsWithChecks = await Promise.all(
    checks.map(async (check) => ({
      check,
      claim: await getClaimById(check.claimId).catch(() => null),
    })),
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href={`/elections/${candidate.electionId}`}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back to election
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {candidate.fullName}
        </h1>
        <p className="text-slate-600">
          {candidate.isIndependent
            ? "Independent"
            : candidate.partyName}
        </p>
        {candidate.shortBio && (
          <p className="mt-2 text-sm text-slate-700">{candidate.shortBio}</p>
        )}
      </div>

      {verdict && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <VerdictBadge verdict={verdict.verdict as PizditVerdict} />
          <p className="mt-4 text-slate-800">{verdict.summary}</p>
          {verdict.topConcerns.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-900">Main flags</h3>
              <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
                {verdict.topConcerns.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
          {verdict.tags.length > 0 && (
            <AnalysisTagList tags={verdict.tags} className="mt-4" />
          )}
          <p className="mt-4 text-xs text-slate-400">
            Based on {verdict.checkedClaimsCount} checked claims · Last updated{" "}
            {new Date(verdict.lastCalculatedAt).toLocaleDateString()}
          </p>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Checked claims
        </h2>
        <div className="grid gap-3">
          {claimsWithChecks.length === 0 ? (
            <p className="text-sm text-slate-500">
              No published claim checks yet.
            </p>
          ) : (
            claimsWithChecks.map(
              ({ check, claim }) =>
                claim && (
                  <ClaimCheckCard key={check.id} claim={claim} check={check} />
                ),
            )
          )}
        </div>
      </section>
    </div>
  );
}
