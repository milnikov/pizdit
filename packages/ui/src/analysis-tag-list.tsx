import { TAG_LABELS, type AnalysisTag } from "@pizdit/core";
import { cn } from "./utils";

export function AnalysisTagList({
  tags,
  className,
}: {
  tags: AnalysisTag[];
  className?: string;
}) {
  if (tags.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
        >
          {TAG_LABELS[tag]}
        </li>
      ))}
    </ul>
  );
}
