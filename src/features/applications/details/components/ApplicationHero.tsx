import { Link } from "react-router";
import type { Application, ApplicationStatus } from "@/api/types";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { StatusBadge } from "../../components/StatusBadge";
import {
  formatAppliedDate,
  PRIORITY_DOT_CLASS,
  PRIORITY_LABELS,
  SOURCE_LABELS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "../../labels";
import { applicationCode, applicationHeadline } from "../display";

export function ApplicationHero({
  application,
  onStatusChange,
  onArchive,
  onDelete,
  isArchiving,
  isDeleting,
}: {
  application: Application;
  onStatusChange: (status: ApplicationStatus) => void;
  onArchive: () => void;
  onDelete: () => void;
  isArchiving?: boolean;
  isDeleting?: boolean;
}) {
  const code = applicationCode(application.id);

  return (
    <section className="rounded-xl border border-border bg-white px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight">
              {application.company}
            </h1>
            <StatusBadge status={application.status} />
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  PRIORITY_DOT_CLASS[application.priority],
                )}
              />
              {PRIORITY_LABELS[application.priority]} priority
            </span>
            {application.archived && (
              <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                archived
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {applicationHeadline(application)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {code}
            {application.appliedDate
              ? ` · applied ${formatAppliedDate(application.appliedDate)}`
              : ""}
            {application.source
              ? ` · via ${SOURCE_LABELS[application.source]}`
              : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-8 gap-1 rounded-lg bg-white",
              )}
            >
              {STATUS_LABELS[application.status]}
              <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              <DropdownMenuRadioGroup
                value={application.status}
                onValueChange={(value) => {
                  if (value && value !== application.status) {
                    onStatusChange(value as ApplicationStatus);
                  }
                }}
              >
                {STATUS_OPTIONS.map((option) => (
                  <DropdownMenuRadioItem key={option} value={option}>
                    {STATUS_LABELS[option]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to={`/applications/${application.id}/edit`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 rounded-lg bg-white",
            )}
          >
            Edit
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 rounded-lg bg-white"
            onClick={onArchive}
            disabled={isArchiving}
          >
            {application.archived ? "Restore" : "Archive"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 rounded-lg border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={onDelete}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </section>
  );
}
