import {
  getCandidatesForElection,
  getCandidateVerdict,
  getElectionById,
} from "@pizdit/db";
import { CandidateCard } from "@pizdit/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ElectionPage({
  params,
}: {
  params: Promise<{ electionId: string }>;
}) {
  const { electionId } = await params;

  let election;
  try {
    election = await getElectionById(electionId);
  } catch {
    election = null;
  }

  if (!election) notFound();

  let candidates: Awaited<ReturnType<typeof getCandidatesForElection>> = [];
  try {
    candidates = await getCandidatesForElection(electionId);
  } catch {
    candidates = [];
  }

  const verdicts = await Promise.all(
    candidates.map(async (c) => ({
      candidateId: c.id,
      verdict: await getCandidateVerdict(c.id).catch(() => null),
    })),
  );

  const verdictMap = new Map(
    verdicts.map((v) => [v.candidateId, v.verdict]),
  );

  const location = [
    election.municipalityName,
    election.regionName,
    election.countryCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {election.name}
        </h1>
        <p className="text-slate-600">{location}</p>
        <p className="mt-1 font-medium text-slate-800">
          {new Date(election.electionDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        {election.pollingPlaceUrl && (
          <a
            href={election.pollingPlaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-slate-600 underline"
          >
            Official polling information
          </a>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Your ballot</h2>
        <div className="grid gap-4">
          {candidates.length === 0 ? (
            <p className="text-slate-500">No candidates listed yet.</p>
          ) : (
            candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                verdict={verdictMap.get(candidate.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
