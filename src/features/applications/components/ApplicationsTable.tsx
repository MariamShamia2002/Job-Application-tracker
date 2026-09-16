import { ChevronRight, Triangle } from "lucide-react";
import type { Application, ApplicationStatus } from "@/api/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  formatAppliedDate,
  PRIORITY_DOT_CLASS,
  PRIORITY_LABELS,
  SOURCE_LABELS,
} from "../labels";
import { useApplicationFilters, type SortField } from "../useApplicationFilters";
import { StatusMenu } from "./StatusMenu";

function SortableHead({
  field,
  children,
}: {
  field: SortField;
  children: string;
}) {
  const { sortField, sortDir, toggleSort } = useApplicationFilters();
  const active = sortField === field;

  return (
    <button
      type="button"
      onClick={() => toggleSort(field)}
      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
    >
      {children}
      {active && (
        <Triangle
          className={cn(
            "size-2 fill-current",
            sortDir === "desc" && "rotate-180",
          )}
        />
      )}
    </button>
  );
}

export function ApplicationsTable({
  applications,
  onStatusChange,
}: {
  applications: Application[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 px-4 text-xs font-medium text-muted-foreground">
              <SortableHead field="company">Company / Role</SortableHead>
            </TableHead>
            <TableHead className="h-11 text-xs font-medium text-muted-foreground">
              <SortableHead field="status">Status</SortableHead>
            </TableHead>
            <TableHead className="h-11 text-xs font-medium text-muted-foreground">
              <SortableHead field="appliedDate">Applied</SortableHead>
            </TableHead>
            <TableHead className="h-11 text-xs font-medium text-muted-foreground">
              Source
            </TableHead>
            <TableHead className="h-11 text-xs font-medium text-muted-foreground">
              <SortableHead field="priority">Priority</SortableHead>
            </TableHead>
            <TableHead className="h-11 w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow
              key={application.id}
              className="group border-border hover:bg-transparent"
            >
              <TableCell className="px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      PRIORITY_DOT_CLASS[application.priority],
                    )}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {application.company}
                      </span>
                      {application.archived && (
                        <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                          archived
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {application.role}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-3.5">
                <StatusMenu
                  status={application.status}
                  onChange={(status) => onStatusChange(application.id, status)}
                />
              </TableCell>
              <TableCell className="py-3.5 text-sm text-foreground">
                {formatAppliedDate(application.appliedDate)}
              </TableCell>
              <TableCell className="py-3.5 text-sm text-foreground">
                {application.source ? SOURCE_LABELS[application.source] : "—"}
              </TableCell>
              <TableCell className="py-3.5 text-sm text-foreground">
                {PRIORITY_LABELS[application.priority]}
              </TableCell>
              <TableCell className="py-3.5 pr-4">
                <span
                  aria-hidden
                  className="flex justify-end text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <ChevronRight className="size-4" />
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
        <p className="text-xs text-muted-foreground">
          {applications.length} of {applications.length} shown
        </p>
        <p className="text-xs text-muted-foreground">
          Use the caret beside a status badge to change it inline
        </p>
      </div>
    </div>
  );
}

export function ApplicationsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="space-y-0">
        <div className="h-11 border-b border-border bg-white" />
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-border px-4 py-4 last:border-0"
          >
            <div className="size-2 rounded-full bg-zinc-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-36 animate-pulse rounded bg-zinc-200" />
              <div className="h-2.5 w-24 animate-pulse rounded bg-zinc-100" />
            </div>
            <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-200" />
            <div className="h-3 w-20 animate-pulse rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ApplicationsEmpty({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-white px-6 py-16 text-center">
      <p className="text-sm font-medium text-foreground">
        {hasFilters ? "No applications match these filters" : "No applications yet"}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {hasFilters
          ? "Try clearing search, filters, or sort to see your list again."
          : "Add a role you’re chasing and it will show up here."}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 text-sm underline underline-offset-2"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
