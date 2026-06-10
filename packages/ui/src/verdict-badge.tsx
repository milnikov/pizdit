import { VERDICT_LABELS, type PizditVerdict } from "@pizdit/core";
import { cn } from "./utils";

const VERDICT_STYLES: Record<PizditVerdict, string> = {
  YES_OFTEN: "bg-red-100 text-red-800 border-red-200",
  LIKELY_YES: "bg-orange-100 text-orange-800 border-orange-200",
  MIXED: "bg-yellow-100 text-yellow-800 border-yellow-200",
  LIKELY_NO: "bg-green-100 text-green-800 border-green-200",
  INSUFFICIENT_DATA: "bg-gray-100 text-gray-600 border-gray-200",
};

export function VerdictBadge({
  verdict,
  className,
}: {
  verdict: PizditVerdict;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium",
        VERDICT_STYLES[verdict],
        className,
      )}
    >
      Pizdit {VERDICT_LABELS[verdict]}
    </span>
  );
}
