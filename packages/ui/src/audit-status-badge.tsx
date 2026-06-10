import type { AuditStatus } from "@pizdit/core";
import { cn } from "./utils";

const STATUS_LABELS: Record<AuditStatus, string> = {
  PASSED: "Audit passed",
  PASSED_WITH_WARNINGS: "Passed with warnings",
  FAILED_NEEDS_REVIEW: "Needs review",
  INSUFFICIENT_EVIDENCE: "Insufficient evidence",
};

const STATUS_STYLES: Record<AuditStatus, string> = {
  PASSED: "bg-green-100 text-green-800",
  PASSED_WITH_WARNINGS: "bg-yellow-100 text-yellow-800",
  FAILED_NEEDS_REVIEW: "bg-orange-100 text-orange-800",
  INSUFFICIENT_EVIDENCE: "bg-gray-100 text-gray-600",
};

export function AuditStatusBadge({
  status,
  className,
}: {
  status: AuditStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
