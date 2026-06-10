import { CLAIM_RATING_LABELS, type ClaimRating } from "@pizdit/core";
import { cn } from "./utils";

const RATING_STYLES: Record<ClaimRating, string> = {
  TRUE: "bg-green-100 text-green-800",
  MOSTLY_TRUE: "bg-green-50 text-green-700",
  MIXED: "bg-yellow-100 text-yellow-800",
  MISLEADING: "bg-orange-100 text-orange-800",
  UNSUPPORTED: "bg-red-100 text-red-800",
  FALSE: "bg-red-200 text-red-900",
  UNVERIFIABLE: "bg-gray-100 text-gray-600",
};

export function ClaimRatingBadge({
  rating,
  className,
}: {
  rating: ClaimRating;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
        RATING_STYLES[rating],
        className,
      )}
    >
      {CLAIM_RATING_LABELS[rating]}
    </span>
  );
}
