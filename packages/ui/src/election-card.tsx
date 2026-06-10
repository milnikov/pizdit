import type { Election } from "@pizdit/core";
import Link from "next/link";
import { cn } from "./utils";

export function ElectionCard({
  election,
  className,
}: {
  election: Election;
  className?: string;
}) {
  const location = [election.municipalityName, election.regionName, election.countryCode]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/elections/${election.id}`}
      className={cn(
        "block rounded-xl border border-slate-200 p-6 transition hover:border-slate-400 hover:shadow-sm",
        className,
      )}
    >
      <h3 className="text-lg font-semibold text-slate-900">{election.name}</h3>
      <p className="mt-1 text-sm text-slate-600">{location}</p>
      <p className="mt-2 text-sm font-medium text-slate-800">
        {new Date(election.electionDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <span className="mt-3 inline-block text-sm text-slate-500 capitalize">
        {election.electionLevel} · {election.ballotType.replace("_", " ")}
      </span>
    </Link>
  );
}
