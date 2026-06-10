import type { AdapterStatus } from "@pizdit/core";
import { cn } from "./utils";

const STATUS_LABELS: Record<AdapterStatus, string> = {
  NOT_STARTED: "Not started",
  PLANNED: "Planned",
  IN_PROGRESS: "In progress",
  BETA: "Beta",
  SUPPORTED: "Supported",
  DEPRECATED: "Deprecated",
};

const STATUS_STYLES: Record<AdapterStatus, string> = {
  NOT_STARTED: "bg-gray-100 text-gray-500",
  PLANNED: "bg-blue-50 text-blue-600",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  BETA: "bg-yellow-100 text-yellow-800",
  SUPPORTED: "bg-green-100 text-green-800",
  DEPRECATED: "bg-red-100 text-red-600",
};

export function CountryCoverageBadge({
  status,
  className,
}: {
  status: AdapterStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
