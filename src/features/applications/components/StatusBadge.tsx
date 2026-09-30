import type { ApplicationStatus } from "@/features/applications/types/application";
import { cn } from "@/lib/utils";
import { STATUS_BADGE_CLASS, STATUS_LABELS } from "../utils/labels";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-medium",
        STATUS_BADGE_CLASS[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
