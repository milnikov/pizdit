import type { ClaimCheck, PoliticalClaim } from "@pizdit/core";
import Link from "next/link";
import { ClaimRatingBadge } from "./claim-rating-badge";
import { cn } from "./utils";

export function ClaimCheckCard({
  claim,
  check,
  className,
}: {
  claim: PoliticalClaim;
  check: ClaimCheck;
  className?: string;
}) {
  return (
    <Link
      href={`/claims/${claim.id}`}
      className={cn(
        "block rounded-lg border border-slate-200 p-4 transition hover:border-slate-400",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-slate-800 line-clamp-2">
          &ldquo;{claim.claimText}&rdquo;
        </p>
        <ClaimRatingBadge rating={check.finalRating} />
      </div>
      <p className="mt-2 text-xs text-slate-600">{check.shortExplanation}</p>
    </Link>
  );
}
